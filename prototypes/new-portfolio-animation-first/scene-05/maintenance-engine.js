export const sum = (values) => values.reduce((a,b)=>a+b,0);
export function number(value,label,min=0,max=Infinity,integer=false) {
  if(typeof value!=='number'||!Number.isFinite(value)||value<min||value>max||(integer&&!Number.isInteger(value)))
    throw new RangeError(`${label}: enter ${integer?'a whole number':'a number'} from ${min} to ${max===Infinity?'the supported limit':max}.`);
}
export function packageAt(meter,model) {
  return model.sequence[(Math.round(meter/model.step)-1)%model.sequence.length];
}
export function jobDuration(wrench,crew,efficiency=1,minDuration=0) {
  number(wrench,'Wrench hours');number(crew,'Crew',1,20,true);number(efficiency,'Efficiency',.1,1);number(minDuration,'Minimum duration');
  return {wrench,ideal:wrench/crew,elapsed:Math.max(wrench/(crew*efficiency),minDuration)};
}
export function units(s) {
  return s.fleets.flatMap(f=>Array.from({length:f.qty},(_,i)=>({id:`${f.id}-${String(i+1).padStart(2,'0')}`,site:f.site,model:f.model,start:f.start+i*f.stagger,group:f.id})));
}
export function validate(s) {
  number(s.months,'Contract months',1,60,true);
  if(!/^\d{4}-(0[1-9]|1[0-2])$/.test(s.start)||+s.start.slice(0,4)<2000||+s.start.slice(0,4)>2100)throw new Error('Start month must be between 2000-01 and 2100-12.');
  if(!['regular','overtime','hire','share'].includes(s.strategy))throw new Error('Unknown staffing strategy.');
  const siteIDs=s.sites.map(x=>x.id);
  if(new Set(siteIDs).size!==siteIDs.length||!siteIDs.includes(s.target))throw new Error('Site identifiers must be unique and target must exist.');
  for(const site of s.sites){
    if(!site.name.trim()||!site.contract.trim())throw new Error('A site name and contract identifier are required.');
    for(const key of ['revenue','other','overhead'])number(site[key],key,0,1e10);
    if(!['monthly','annual'].includes(site.revenueBasis))throw new Error('Unknown revenue period.');
    for(const [key,val] of Object.entries(site.logistics))number(val,key,0,key.toLowerCase().includes('hour')?176:1e8);
    for(const key of ['trips','commuteTrips','rotations'])number(site.logistics[key],key,0,31,true);
  }
  if(new Set(s.fleets.map(f=>f.id)).size!==s.fleets.length)throw new Error('Fleet group IDs must be unique.');
  for(const f of s.fleets){
    if(!s.models[f.model]||!siteIDs.includes(f.site))throw new Error('Unknown fleet model or site.');
    number(f.qty,'Quantity',0,120,true);number(f.start,'Starting meter',0,1e6);number(f.stagger,'Meter stagger',0,10000);
    number(f.hours,'Monthly operating hours',0,744);number(f.change,'Utilization change',-100,200);number(f.changeMonth,'Change month',1,60,true);
    if(f.hours*(1+f.change/100)>744)throw new Error('Adjusted operating hours cannot exceed 744 per month.');
  }
  for(const model of Object.values(s.models)){
    number(model.step,'Service step',1,10000,true);number(model.cycle,'Cycle',1,100000,true);
    if(model.cycle!==model.step*model.sequence.length)throw new Error('Cycle and sequence do not reconcile.');
    for(const key of model.sequence)if(!model.packages[key])throw new Error('Service cycle refers to a missing package.');
    for(const p of Object.values(model.packages)){
      number(p.wrench,'Package wrench hours',0,1000);number(p.crew,'Package crew',1,10,true);number(p.efficiency,'Practical efficiency',.1,1);
      number(p.minDuration,'Minimum duration',0,176);number(p.windowDays,'Service window days',1,22,true);
      for(const list of [p.parts,p.consumables])for(const i of list){if(!i.name.trim())throw new Error('Item name is required.');number(i.qty,'Item quantity',0,10000);number(i.price,'Unit cost',0,1e9);}
    }
  }
  if(new Set(s.mechanics.map(m=>m.id)).size!==s.mechanics.length)throw new Error('A mechanic cannot appear twice.');
  for(const m of [...s.mechanics,{...s.hire,homeSite:s.target,alloc:{}}]){
    number(m.salary,'Monthly fully loaded payroll',0,1e9);number(m.otRate,'Overtime hourly cost',0,1e7);number(m.otLimit,'Overtime limit',0,80);
    if(!['branch','satellite','local','site','mess'].includes(m.location)||!siteIDs.includes(m.homeSite))throw new Error('Unknown mechanic origin.');
    for(const [site,h] of Object.entries(m.alloc)){if(!siteIDs.includes(site))throw new Error('Unknown assignment site.');number(h,'Reserved regular hours',0,176);}
    if(sum(Object.values(m.alloc))>176+1e-8)throw new Error(`${m.name}: regular reservations exceed 176 hours across sites.`);
  }
  if(s.repair.enabled){
    if(!units(s).some(u=>u.id===s.repair.unit))throw new Error('Select an existing unit for the repair stress test.');
    number(s.repair.month,'Repair month',1,s.months,true);number(s.repair.wrench,'Repair wrench hours',0,1000);
    number(s.repair.parts,'Repair parts cost',0,1e9);number(s.repair.crew,'Repair crew',1,10,true);number(s.repair.downtime,'Repair downtime days',0,30);
  }
}
export function forecast(s) {
  validate(s);
  const events=[], meters=[];
  for(const f of s.fleets){
    const model=s.models[f.model];
    for(let unit=0;unit<f.qty;unit++){
      let meter=f.start+unit*f.stagger;
      const id=`${f.id}-${String(unit+1).padStart(2,'0')}`;
      for(let month=1;month<=s.months;month++){
        const hours=f.hours*(month>=f.changeMonth?1+f.change/100:1),end=meter+hours;
        // Starting threshold is already serviced; include (starting meter, ending meter].
        for(let threshold=(Math.floor(meter/model.step)+1)*model.step;threshold<=end+1e-8;threshold+=model.step){
          const key=packageAt(threshold,model),p=model.packages[key],duration=jobDuration(p.wrench,p.crew,p.efficiency,p.minDuration);
          const parts=p.parts.map(i=>({...i,total:Math.round(i.qty*i.price)})),consumables=p.consumables.map(i=>({...i,total:Math.round(i.qty*i.price)}));
          events.push({id:`${id}@${threshold}`,unit:id,site:f.site,model:f.model,month,threshold,package:key,wrench:p.wrench,
            crew:p.crew,duration:duration.elapsed,ideal:duration.ideal,personnel:duration.elapsed*p.crew,windowDays:p.windowDays,
            parts,consumables,partsCost:sum(parts.map(i=>i.total)),consumablesCost:sum(consumables.map(i=>i.total)),repair:false});
        }
        meters.push({unit:id,site:f.site,model:f.model,month,start:meter,end,hours});meter=end;
      }
    }
  }
  if(s.repair.enabled){
    const r=s.repair,u=units(s).find(u=>u.id===r.unit);
    events.push({id:'repair',unit:u.id,site:u.site,model:u.model,month:r.month,threshold:null,package:'Repair',wrench:r.wrench,
      crew:r.crew,duration:r.wrench/r.crew,ideal:r.wrench/r.crew,personnel:r.wrench,windowDays:r.urgent?1:5,
      parts:[{name:'Hypothetical repair parts',qty:1,price:r.parts,total:r.parts}],consumables:[],partsCost:r.parts,consumablesCost:0,repair:true});
  }
  events.sort((a,b)=>a.month-b.month||a.unit.localeCompare(b.unit)||(a.threshold||0)-(b.threshold||0));
  return {events,meters,units:units(s)};
}
