import {baseline,MODEL_TEMPLATES} from './data/synthetic.js';
import {forecast,number,sum} from './maintenance-engine.js';
import {calculate} from './model.js';
import {logistics} from './workforce-engine.js';

function forklift(name,power,capacity,wrench){
  const model=structuredClone(MODEL_TEMPLATES['FL-30']);
  Object.assign(model,{name,power,capacity});
  Object.values(model.packages).forEach((p,i)=>{
    p.wrench=wrench[i];p.minDuration=0;
    if(power==='Battery'){
      p.parts=[{name:'Synthetic inspection kit',qty:1,price:[150000,250000,500000,1800000][i]}];
      p.consumables=[{name:'Cleaning / lubrication consumables',qty:1,price:[80000,120000,200000,350000][i]}];
    }
  });
  return model;
}
export const FORKLIFT_TYPES={
  'FG-25':forklift('Forklift Gasoline 2.5 Ton','Gasoline',2.5,[4,8,18,40]),
  'FB-20':forklift('Forklift Battery 2 Ton','Battery',2,[3,5,12,24]),
  'FD-25':forklift('Forklift Diesel 2.5 Ton','Diesel',2.5,[5,10,20,44])
};
export const SITE_TRAVEL_TYPES={
  urban:{label:'Urban area',minSpeed:30,maxSpeed:40},
  rural:{label:'Rural area',minSpeed:60,maxSpeed:80}
};
export function applyDistanceTravel(s,distance=s.worksheet.distanceKm,area=s.worksheet.areaType){
  const type=SITE_TRAVEL_TYPES[area];if(!type)throw new Error('Choose urban or rural area.');
  number(distance,'Distance to nearest office',0,2000);
  s.worksheet.distanceKm=Number(distance);s.worksheet.areaType=area;
  const roundTripHours=2*Number(distance)/((type.minSpeed+type.maxSpeed)/2);
  s.sites[0].logistics.satelliteHours=roundTripHours;
  return{...type,averageSpeed:(type.minSpeed+type.maxSpeed)/2,roundTripKm:2*Number(distance),roundTripHours};
}
export function averageMechanicComparison(hours,overtimeCap,mobileTravelHours=0){
  number(hours,'Average monthly maintenance hours');number(overtimeCap,'Monthly overtime cap',0,80);number(mobileTravelHours,'Mobile travel hours');
  const dedicatedMechanics=Math.ceil(hours/176),mobileHours=Math.max(0,176-mobileTravelHours),travelExceedsWorkMonth=mobileTravelHours>176,mobileMechanics=hours===0?0:!travelExceedsWorkMonth&&mobileHours>0?Math.ceil(hours/mobileHours):Infinity;
  const withOvertimeMechanics=hours===0?0:travelExceedsWorkMonth?Infinity:mobileHours+overtimeCap>0?Math.ceil(hours/(mobileHours+overtimeCap)):Infinity;
  const overtimeHours=Number.isFinite(withOvertimeMechanics)?Math.max(0,hours-withOvertimeMechanics*mobileHours):hours;
  return{dedicatedMechanics,mobileMechanics,mobileHours,travelExceedsWorkMonth,withOvertimeMechanics,overtimeHours,overtimePerMechanic:Number.isFinite(withOvertimeMechanics)&&withOvertimeMechanics?overtimeHours/withOvertimeMechanics:0};
}
export function worksheetBaseline(example=false){
  const s=baseline();s.name='FMC Maintenance Planning';s.months=60;s.models=structuredClone(FORKLIFT_TYPES);
  s.sites[0].name='Customer site';s.sites[0].contract='FMC-WORKSHEET';s.sites[0].location='';s.sites[0].revenue=0;s.sites[0].revenueBasis='monthly';s.sites[0].other=0;s.sites[0].overhead=0;
  s.sites[1].name='Other reserved commitments';s.sites[1].revenue=0;s.sites[1].other=0;s.sites[1].overhead=0;
  Object.keys(s.sites[1].logistics).forEach(k=>s.sites[1].logistics[k]=0);
  s.fleets=Array.from({length:10},(_,i)=>({id:'F'+String(i+1).padStart(2,'0'),site:'A',model:'',qty:0,start:0,stagger:0,hours:600,change:0,changeMonth:4}));
  s.worksheet={distanceKm:10,areaType:'urban',salary:8000000,overtimeCap:32,dedicatedAccommodation:false,placement:'hybrid'};
  s.mechanics=[];s.strategy='regular';s.target='A';s.repair.enabled=false;s.repair.unit='F01-01';
  Object.assign(s.sites[0].logistics,{commuteHours:0,commuteCost:25000,commuteTrips:22,rotations:1,mess:2000000,allowance:800000,localTransport:150000});
  Object.assign(s.sites[0].logistics,{satelliteCost:150000,trips:22,rotationCost:650000,rotations:1});
  applyDistanceTravel(s);
  if(example){
    s.sites[0].name='Sample customer';s.sites[0].location='Sample local customer site';s.sites[0].revenue=20000000;
    const sample=['FG-25','FG-25','FG-25','FB-20','FB-20','FB-20','FB-20','FB-20','FD-25','FD-25'],meters=[420,495,570,550,625,700,775,850,680,755];
    s.fleets.forEach((f,i)=>Object.assign(f,{model:sample[i],qty:1,start:meters[i],stagger:0,hours:600}));
  }
  return s;
}
export function validateWorksheet(s){
  if(s.fleets.length!==10)throw new Error('The fleet worksheet must have ten numbered rows.');
  let active=0;
  for(const [i,f] of s.fleets.entries()){
    if(!f.model&&f.qty===0)continue;
    if(!s.models[f.model])throw new Error(`Row ${i+1}: choose the unit type.`);
    if(f.qty!==1)throw new Error(`Row ${i+1}: one fleet row represents exactly one unit.`);
    active++;
  }
  if(!active)throw new Error('Enter at least one unit in the fleet table.');
  number(s.worksheet.distanceKm,'Distance to nearest office',0,2000);
  if(!SITE_TRAVEL_TYPES[s.worksheet.areaType])throw new Error('Choose urban or rural area.');
  number(s.worksheet.salary,'Loaded monthly payroll',0,1e9);number(s.worksheet.overtimeCap,'Monthly overtime cap',0,80);
}
function baseScenario(s){
  const next=structuredClone(s);next.fleets=next.fleets.filter(f=>f.model&&f.qty>0);next.sites[0].revenue*=next.fleets.length;next.mechanics=[];next.strategy='regular';
  return next;
}
function mechanics(count,hours,location,s,prefix,accommodation=false){
  return Array.from({length:count},(_,i)=>({id:prefix+String(i+1).padStart(2,'0'),name:`${prefix==='D'?'Dedicated':'Shared'} mechanic ${i+1}`,salary:s.worksheet.salary,otRate:0,otLimit:0,
    location,homeSite:'A',dedicatedAccommodation:prefix==='D'&&accommodation,alloc:{A:hours,B:176-hours}}));
}
function staffingCost(f){return sum(['regularPayroll','additionalPayroll','overtime','travel','accommodation','allowance'].map(k=>f.costs[k]));}
export function comparePlacement(s){
  validateWorksheet(s);
  const base=baseScenario(s),maintenance=forecast(base),events=maintenance.events.filter(e=>e.site==='A');
  const averageWrenchHours=sum(events.map(e=>e.wrench))/s.months,averageMechanics=Math.ceil(averageWrenchHours/176);
  const monthly=Array.from({length:s.months},(_,i)=>sum(events.filter(e=>e.month===i+1).map(e=>e.personnel)));
  const peak=Math.max(...monthly),crew=Math.max(0,...events.map(e=>e.crew));
  const dedicatedLocation='site';
  const dedicatedTravel=logistics({location:dedicatedLocation,homeSite:'A'},s.sites[0]).hours,usable=176-dedicatedTravel;
  const dedicatedCount=peak===0?0:Math.max(crew,usable>0?Math.ceil(peak/usable):crew);
  const mobileTravel=logistics({location:'satellite',homeSite:'A'},s.sites[0]).hours,mobileUsable=176-mobileTravel;
  const mobileCount=peak===0?0:Math.max(crew,mobileUsable>0?Math.ceil(peak/mobileUsable):Math.max(1,crew));
  const d=structuredClone(base),h=structuredClone(base);
  h.mechanics=mechanics(mobileCount,176,'satellite',s,'H');
  d.mechanics=mechanics(dedicatedCount,176,dedicatedLocation,s,'D',s.worksheet.dedicatedAccommodation);
  const options=[['dedicated',d],['hybrid',h]].map(([key,scenario])=>{
    const result=calculate(scenario,{compare:false}),financial=result.financial[0],months=result.work.map(w=>w.sites.A);
    return {key,scenario,result,count:scenario.mechanics.length,feasible:months.every(m=>m.feasible),peakShortfall:Math.max(...months.map(m=>m.shortfall)),
      minSpare:Math.min(...months.map(m=>m.remaining)),staffingCost:staffingCost(financial),travelHours:sum(months.map(m=>m.travelHours)),issues:[...new Set(months.flatMap(m=>m.issues))]};
  });
  const [dedicated,hybrid]=options;
  let suggested='review',reason='Neither arrangement clears the modeled capacity and job constraints. Review travel, availability and service windows.';
  if(peak===0){suggested='none';reason='No maintenance threshold is crossed during this forecast. Check opening backlog and other service obligations before assigning manpower.';}
  else if(hybrid.feasible&&(!dedicated.feasible||hybrid.staffingCost<=dedicated.staffingCost)){suggested='hybrid';reason='The mobile team covers the modeled workload after paid travel, at the lower attributable staffing and delivery cost.';}
  else if(dedicated.feasible){suggested='dedicated';reason=hybrid.feasible?'Dedicated staff cover the modeled workload at the lower attributable staffing and delivery cost.':'The mobile team leaves a capacity or job-constraint gap. Dedicated onsite staff cover the modeled workload under these assumptions.';}
  return {maintenance,options,suggested,reason,peak,crew,monthly,averageWrenchHours,averageMechanics,mobileCount};
}
export function emptyWorksheetResult(s){return calculate(baseScenario(s),{compare:false});}
