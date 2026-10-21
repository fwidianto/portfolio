import {WAREHOUSE_DEFAULTS} from './warehouse-config.js';
import {evaluateGame} from './game-model.js';
import {packageAt,jobDuration} from './maintenance-engine.js';
import {logistics,REGULAR_HOURS} from './workforce-engine.js';
import {calculate} from './model.js';

export const WIDTH = 26, HEIGHT = 18;
export const RACKS = [4,11,18].flatMap(x=>[4,10].map(y=>({x,y,w:4,h:3})));
const key = (x,y)=>`${x},${y}`;
export const cellKey = p=>key(p.x,p.y);
export const isFloor = (x,y)=>x>=0&&x<WIDTH&&y>=0&&y<HEIGHT&&!RACKS.some(r=>x>=r.x&&x<r.x+r.w&&y>=r.y&&y<r.y+r.h);
export function exits(p) {
  const {x,y}=p;
  const candidates=[];
  if(y===0)candidates.push({x:x+1,y});
  else if(y===HEIGHT-1)candidates.push({x:x-1,y});
  else candidates.push({x:x+(y%2?-1:1),y});
  if(x===0)candidates.push({x,y:y-1});
  else if(x===WIDTH-1)candidates.push({x,y:y+1});
  else candidates.push({x,y:y+(x%2?-1:1)});
  return candidates.filter(p=>isFloor(p.x,p.y));
}
export function route(start,goal,blocked=new Set()) {
  const first=cellKey(start),end=cellKey(goal),queue=[start],previous=new Map([[first,null]]);
  for(let i=0;i<queue.length;i++){
    const p=queue[i],k=cellKey(p);
    if(k===end){const path=[];for(let v=k;previous.get(v)!==null;v=previous.get(v))path.push(v.split(',').map(Number));return path.reverse().map(([x,y])=>({x,y}));}
    for(const next of exits(p)){const nk=cellKey(next);if(!previous.has(nk)&&!blocked.has(nk)){previous.set(nk,k);queue.push(next);}}
  }
  return null;
}
export function randomAt(seed,...coordinates) {
  let h=seed>>>0;
  for(const part of coordinates){for(const c of String(part)){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}h^=h>>>16;h=Math.imul(h,2246822507);}
  return (h>>>0)/4294967296;
}
function spots(){
  const all=[];
  const add=(id,type,x,y,ax,ay)=>all.push({id,type,x,y,access:{x:ax,y:ay},pallet:null,reserved:null});
  for(let i=0;i<12;i++)add('in-'+i,'inbound',3+i*1.8,18.2,3+i*2,17);
  for(const [r,block] of RACKS.entries())for(let i=0;i<4;i++){
    add(`rack-${r}-${i}`,'storage',block.x+i+.4,block.y+.6,block.x+i,block.y-1);
    add(`rack-${r}-b${i}`,'storage',block.x+i+.4,block.y+2.3,block.x+i,block.y+3);
  }
  for(let i=0;i<12;i++)add('stage-'+i,'staging',2+i*2,-.6,2+i*2,0);
  for(let i=0;i<12;i++)add('out-'+i,'outbound',2+i*2,-2.4,2+i*2,0);
  return all;
}
export function createWarehouse(scenario,config={}) {
  const settings={...structuredClone(WAREHOUSE_DEFAULTS),...structuredClone(config)};
  if(!Number.isFinite(settings.seed)||settings.monthSeconds<30||settings.stepSeconds!==.05||!Number.isInteger(settings.pallets)||settings.pallets<12||settings.pallets>200||!Number.isInteger(settings.mechanics)||settings.mechanics<0||settings.mechanics>8||![1,2].includes(settings.bays)||!['immediate','after-job','defer'].includes(settings.policy))throw new Error('Invalid synthetic mission settings.');
  for(const k of ['monthSeconds','tileSeconds','handlingSeconds','opportunityHours'])if(!Number.isFinite(settings[k])||settings[k]<=0)throw new Error('Invalid simulation clock: '+k);
  for(const k of ['minorRate','majorRate','wearPerHour','wearRisk','overdueRisk'])if(!Number.isFinite(settings[k])||settings[k]<0)throw new Error('Invalid synthetic reliability assumption: '+k);
  if(scenario.fleets.length!==10||scenario.fleets.some(f=>f.qty!==1||!scenario.models[f.model]))throw new Error('Choose all ten forklift models.');
  const forecast=evaluateGame(scenario);
  const monthScenario=structuredClone(forecast.option.scenario);monthScenario.months=1;
  monthScenario.mechanics=Array.from({length:settings.mechanics},(_,i)=>({...structuredClone(forecast.option.scenario.mechanics[0]||{salary:scenario.worksheet.salary,otRate:0,otLimit:0,location:scenario.worksheet.placement==='dedicated'?'site':'satellite',homeSite:'A',alloc:{A:176,B:0}}),id:'PLAN'+i}));
  const plan=calculate(monthScenario,{compare:false}).financial[0].months[0];
  const state={config:settings,scenario:structuredClone(scenario),tick:0,time:0,finished:false,started:false,
    units:scenario.fleets.map((f,i)=>({id:f.id+'-01',index:i,model:f.model,x:2+i*2,y:15,heading:0,edge:null,
      job:null,load:null,mode:'auto',phase:'idle',reason:'Ready',handling:0,wait:0,completed:0,
      opening:f.start,meter:f.start,exposure:0,downtime:0,condition:settings.initialCondition,
      nextThreshold:(Math.floor(f.start/scenario.models[f.model].step)+1)*scenario.models[f.model].step,
      opportunity:0,service:null,fault:null,componentRequested:false})),
    spots:spots(),pallets:[],jobs:[],transfers:[],events:[],ledger:[],mechanics:[],bays:[],improvements:{},actions:[],policy:settings.policy,
    plan,forecastTeam:forecast.option.count};
  for(let i=0;i<settings.pallets;i++)state.pallets.push({id:'P'+String(i+1).padStart(3,'0'),location:'offsite',stage:0,arrival:i<12?0:(i-11)*settings.arrivalSeconds+randomAt(settings.seed,i,'arrival')*2});
  state.bays=Array.from({length:settings.bays},(_,i)=>({id:i,unit:null,position:{x:1,y:i===0?5:11}}));
  for(let i=0;i<settings.mechanics;i++)addMechanic(state,false);
  book(state,{id:'contract:revenue',category:'revenue',amount:state.plan.revenue,label:'Fixed monthly maintenance contract'});
  book(state,{id:'contract:other',category:'other',amount:scenario.sites[0].other,label:'Monthly operating allocation'});
  book(state,{id:'contract:overhead',category:'overhead',amount:scenario.sites[0].overhead,label:'Monthly overhead allocation'});
  if(settings.bays===2)book(state,{id:'improvement:bay',category:'other',amount:settings.bayLease,label:'Temporary second bay lease · one month'});
  arrive(state);createJobs(state);
  return state;
}
const spotById=(s,id)=>s.spots.find(p=>p.id===id);
const jobById=(s,id)=>s.jobs.find(j=>j.id===id);
function arrive(s,operations=null){
  for(const p of s.pallets.filter(p=>p.stage===3&&p.location!=='dispatched'&&p.departure<=s.time)){
    const slot=spotById(s,p.location);slot.pallet=null;s.transfers.push({tick:s.tick,pallet:p.id,from:p.location,to:'dispatched'});p.location='dispatched';
  }
  for(const p of s.pallets){
    if(p.location!=='offsite'||p.arrival>s.time)continue;
    const slot=s.spots.find(x=>x.type==='inbound'&&!x.pallet&&!x.reserved&&!operations?.portReserved?.(s,x));
    if(!slot)break;
    slot.pallet=p.id;p.location=slot.id;
    s.transfers.push({tick:s.tick,pallet:p.id,from:'offsite',to:slot.id});
  }
}
function createJobs(s,operations=null){
  for(const p of s.pallets){
    if(p.stage>=3||p.location==='offsite'||p.location.startsWith('unit:')||s.jobs.some(j=>j.pallet===p.id&&j.status!=='completed'))continue;
    if(operations?.jobAllowed&&!operations.jobAllowed(s,p))continue;
    const type=['receive','replenish','dispatch'][p.stage],target=['storage','staging','outbound'][p.stage];
    const choices=s.spots.filter(x=>x.type===target&&!x.pallet&&!x.reserved);
    if(!choices.length)continue;
    const dest=choices[Math.floor(randomAt(s.config.seed,p.id,p.stage)*choices.length)];
    const id=p.id+'-'+type;dest.reserved=id;
    s.jobs.push({id,pallet:p.id,type,source:p.location,destination:dest.id,status:'waiting',owner:null,created:s.tick,completed:null});
  }
}
function assign(s,u){
  if(s.scenario.fleets[u.index].hours===0)return;
  const j=s.jobs.find(j=>j.status==='waiting');
  if(j){j.owner=u.id;j.status='assigned';u.job=j.id;u.phase='pickup';u.reason='Travel to '+j.source;}
}
export function handleLoad(s,u) {
  const j=jobById(s,u.job);if(!j)return false;
  const location=spotById(s,u.load?j.destination:j.source);
  if(cellKey(u)!==cellKey(location.access)||u.edge)return false;
  const p=s.pallets.find(p=>p.id===j.pallet);
  if(!u.load){
    if(location.pallet!==p.id||p.location!==location.id||j.owner!==u.id)return false;
    location.pallet=null;p.location='unit:'+u.id;u.load=p.id;u.phase='drop';j.status='loaded';
    s.transfers.push({tick:s.tick,pallet:p.id,from:location.id,to:p.location,unit:u.id});
  }else{
    if(location.pallet||location.reserved!==j.id||p.location!=='unit:'+u.id||j.status==='completed')return false;
    const from=p.location;u.load=null;location.reserved=null;p.stage++;
    location.pallet=p.id;p.location=location.id;if(j.type==='dispatch')p.departure=s.time+3;
    s.transfers.push({tick:s.tick,pallet:p.id,from,to:p.location,unit:u.id});
    j.status='completed';j.completed=s.tick;u.completed++;u.job=null;u.phase='idle';
  }
  u.handling=0;u.manualHandling=false;u.reason=u.load?'Carry '+u.load:'Placement complete';return true;
}
function occupancy(s,u){const blocked=new Set();for(const v of s.units)if(v!==u){blocked.add(cellKey(v));if(v.edge)blocked.add(cellKey(v.edge.to));}return blocked;}
function move(s,u,target){
  const blocked=occupancy(s,u);
  const path=route(u,target,blocked);
  if(path?.length){u.edge={to:path[0],progress:0};u.heading=path[0].x>u.x?0:path[0].y>u.y?1:path[0].x<u.x?2:3;u.wait=0;return true;}
  u.wait+=s.config.stepSeconds;u.reason='Yielding · aisle occupied';
  if(u.wait>1.2){const next=exits(u).find(p=>!blocked.has(cellKey(p)));if(next){u.edge={to:next,progress:0};u.heading=next.x>u.x?0:next.y>u.y?1:next.x<u.x?2:3;u.wait=0;}}
  return false;
}
function operate(s,u){
  if(u.fault){u.reason=eventById(s,u.fault)?.status==='in-progress'?'Repair in progress':'Fault · waiting for repair crew';return;}
  if(u.edge){u.edge.progress+=s.config.stepSeconds/s.config.tileSeconds;if(u.edge.progress>=1-1e-9){Object.assign(u,u.edge.to);u.edge=null;}return;}
  if(u.service){
    const e=eventById(s,u.service);
    if(e.status==='in-progress'){u.reason=e.kind==='component'?'Component replacement':'Service in progress';return;}
    if(e.bay===null){u.reason='Queued · waiting for a bay';return;}
    const target=s.bays[e.bay].position;
    if(cellKey(u)!==cellKey(target)){u.reason='Travel to service bay';move(s,u,target);}else u.reason='At bay · waiting for crew';
    return;
  }
  if(!u.job)assign(s,u);
  const j=jobById(s,u.job);
  if(!j){
    const parking={x:2+u.index*2,y:15};
    if(u.mode==='auto'&&cellKey(u)!==cellKey(parking)){u.reason='Return to parking · no assignment';move(s,u,parking);}else u.reason='Engine off · waiting for work';
    return;
  }
  const target=spotById(s,u.load?j.destination:j.source).access;
  u.reason=(u.load?'Loaded travel · ':'Pickup · ')+j.type;
  if(cellKey(u)===cellKey(target)){
    u.reason=(u.load?'Place ':'Lift ')+j.pallet;
    if(u.mode==='auto'||u.manualHandling){u.handling+=s.config.stepSeconds;if(u.handling+1e-9>=s.config.handlingSeconds)handleLoad(s,u);}
  }else if(u.mode==='auto')move(s,u,target);
}
export function stepWarehouse(s,count=1,operations=null){
  for(let i=0;i<count&&!s.finished;i++){
    s.started=true;s.tick++;s.time=s.config.continuous?s.tick*s.config.stepSeconds:Math.min(s.config.monthSeconds,s.tick*s.config.stepSeconds);
    if(s.config.continuous){const period=Math.floor((s.time+1e-8)/s.config.monthSeconds)+1;if(period>(s.contractPeriods||1))renewContract(s,period);}
    operations?.beforeStep?.(s);
    arrive(s,operations);createJobs(s,operations);serviceQueues(s,operations);
    for(const u of s.units)expose(s,u,operations);
    for(let k=0;k<s.units.length;k++){
      const u=s.units[(k+s.tick)%s.units.length];
      if(operations)operations.operate(s,u,{assign,handleLoad});else operate(s,u);
    }
    workServices(s,operations);
    operations?.afterStep?.(s);
    if(!s.config.continuous&&s.time>=s.config.monthSeconds)s.finished=true;
  }
  return s;
}
export function assertWarehouse(s,{physicalOccupancy=false}={}){
  const used=new Map();
  for(const u of s.units){
    if(!isFloor(u.x,u.y))throw new Error('Unit crossed a solid obstacle: '+u.id);
    if(!physicalOccupancy)for(const p of [u,...(u.edge?[u.edge.to]:[])]){const k=cellKey(p);if(used.has(k)&&used.get(k)!==u.id)throw new Error('Conflicting occupancy '+k);used.set(k,u.id);}
    if(u.load&&!s.pallets.some(p=>p.id===u.load&&p.location==='unit:'+u.id))throw new Error('Unaccounted load');
  }
  for(const p of s.pallets){
    const owners=s.spots.filter(x=>x.pallet===p.id).length+s.units.filter(u=>u.load===p.id).length;
    if(owners!==(['offsite','dispatched'].includes(p.location)?0:1))throw new Error('Pallet ownership '+p.id);
    if(p.location!=='offsite'&&p.location!=='dispatched'&&!p.location.startsWith('unit:')&&spotById(s,p.location)?.pallet!==p.id)throw new Error('Inventory mismatch');
  }
  if(new Set(s.jobs.map(j=>j.id)).size!==s.jobs.length||new Set(s.ledger.map(e=>e.id)).size!==s.ledger.length)throw new Error('Duplicate event');
  for(const j of s.jobs){if(j.owner&&!s.units.some(u=>u.id===j.owner))throw new Error('Missing job owner');if(j.status==='completed'&&j.completed===null)throw new Error('Missing completion');}
  for(const spot of s.spots)if(spot.reserved&&!s.jobs.some(j=>j.id===spot.reserved&&j.status!=='completed'))throw new Error('Orphan destination reservation');
  for(const u of s.units)if(s.jobs.filter(j=>j.owner===u.id&&j.status!=='completed').length>1)throw new Error('Unit has conflicting jobs');
  if(s.units.filter(u=>u.mode==='manual').length>1)throw new Error('Only one unit may be player-controlled');
  if(new Set(s.events.map(e=>e.id)).size!==s.events.length)throw new Error('Duplicate service obligation');
  for(const m of s.mechanics){if(m.used+m.travelUsed>m.reserved+1e-6)throw new Error('Mechanic exceeded paid capacity');if(m.event&&!s.events.some(e=>e.id===m.event&&e.status==='in-progress'&&e.mechanics.includes(m.id)))throw new Error('Orphan mechanic reservation');}
  for(const e of s.events)if(e.status==='in-progress'&&(e.mechanics.length!==e.crew||e.mechanics.some(id=>s.mechanics.find(m=>m.id===id)?.event!==e.id)))throw new Error('Conflicting service crew');
  for(const b of s.bays)if(b.unit&&!s.units.some(u=>u.id===b.unit&&(eventById(s,u.service)?.bay===b.id||physicalOccupancy&&b.departing===u.id&&u.physical?.egress)))throw new Error('Orphan bay reservation');
  return true;
}

const eventById=(s,id)=>s.events.find(e=>e.id===id);
function book(s,entry){
  if(s.ledger.some(e=>e.id===entry.id))return;
  s.ledger.push({tick:s.tick,unit:null,event:null,items:[],...entry});
}
function addMechanic(s,additional){
  const id='M'+String(s.mechanics.length+1).padStart(2,'0'),fraction=1-(s.config.continuous?s.time%s.config.monthSeconds:s.time)/s.config.monthSeconds;
  const route=logistics({location:s.scenario.worksheet.placement==='dedicated'?'site':'satellite',homeSite:'A',dedicatedAccommodation:s.scenario.worksheet.dedicatedAccommodation},s.scenario.sites[0]);
  s.mechanics.push({id,event:null,start:s.time,reserved:REGULAR_HOURS*fraction,used:0,travelUsed:0,travel:false,available:0,travelBudget:route.hours*(s.config.continuous?1:fraction)});
  for(const [category,amount] of Object.entries({[additional?'additionalPayroll':'regularPayroll']:s.scenario.worksheet.salary,travel:route.travel,accommodation:route.accommodation,allowance:route.allowance})){
    book(s,{id:id+':'+category,category,amount:Math.round(amount*fraction),label:(additional?'Additional':'Reserved')+' '+id+' · remaining month'});
  }
}
function renewContract(s,period){
  s.contractPeriods=period;
  for(const [category,amount] of Object.entries({revenue:s.plan.revenue,other:s.scenario.sites[0].other,overhead:s.scenario.sites[0].overhead,...(s.bays.length===2?{bayLease:s.config.bayLease}:{})}))book(s,{id:'period:'+period+':'+category,category:category==='bayLease'?'other':category,amount,label:'Month '+period+' · '+category});
  const route=logistics({location:s.scenario.worksheet.placement==='dedicated'?'site':'satellite',homeSite:'A',dedicatedAccommodation:s.scenario.worksheet.dedicatedAccommodation},s.scenario.sites[0]);
  for(const m of s.mechanics){m.reserved+=REGULAR_HOURS;for(const [category,amount] of Object.entries({regularPayroll:s.scenario.worksheet.salary,travel:route.travel,accommodation:route.accommodation,allowance:route.allowance}))book(s,{id:m.id+':period:'+period+':'+category,category,amount:Math.round(amount),label:'Month '+period+' · '+m.id+' · '+category});}
}
function obligation(s,u,threshold){
  const model=s.scenario.models[u.model],packageKey=packageAt(threshold,model),p=model.packages[packageKey],duration=jobDuration(p.wrench,p.crew,p.efficiency,p.minDuration);
  const items=list=>list.map(i=>({...i,total:Math.round(i.qty*i.price)}));
  s.events.push({id:u.id+'@'+threshold,unit:u.id,kind:'service',name:packageKey+' h complete service',threshold,package:packageKey,
    status:'due',created:s.tick,started:null,completed:null,bay:null,mechanics:[],crew:p.crew,wrench:p.wrench,duration:duration.elapsed,progress:0,personHours:0,
    parts:items(p.parts),consumables:items(p.consumables),recovery:s.config.serviceRecovery});
}
function repairEvent(s,u,kind,id){
  const spec=kind==='component'?s.config.component:s.config[kind];
  const e={id,unit:u.id,kind,name:spec.name,threshold:null,status:kind==='component'?'due':'queued',created:s.tick,started:null,completed:null,bay:null,
    mechanics:[],crew:spec.crew,wrench:spec.wrench,duration:Math.max(spec.minimumHours,spec.wrench/spec.crew),progress:0,personHours:0,
    parts:[{name:spec.name+' · synthetic parts',qty:1,price:spec.parts,total:spec.parts}],consumables:[],recovery:spec.recovery};
  s.events.push(e);return e;
}
function expose(s,u,operations=null){
  const physicalRunning=operations?.running?.(s,u),running=physicalRunning??(!u.fault&&(!u.service||u.edge||eventById(s,u.service)?.bay!==null&&cellKey(u)!==cellKey(s.bays[eventById(s,u.service).bay].position))&&(u.job||u.edge||u.service));
  const hours=s.config.stepSeconds*s.scenario.fleets[u.index].hours/s.config.monthSeconds;
  if(!running){if(u.fault||u.service)u.downtime+=hours;return;}
  u.exposure+=hours;u.meter=u.opening+u.exposure;u.condition=Math.max(.1,u.condition-hours*s.config.wearPerHour);
  const model=s.scenario.models[u.model];
  if(s.config.maintenance)while(u.meter+1e-8>=u.nextThreshold){obligation(s,u,u.nextThreshold);u.nextThreshold+=model.step;}
  while(u.exposure+1e-8>=(u.opportunity+1)*s.config.opportunityHours){
    const opportunity=u.opportunity++;
    if(!s.config.incidents||u.fault)continue;
    const {risk}=warehouseRisk(s,u);
    const rate=s.config.minorRate+s.config.majorRate,p=1-Math.exp(-rate*s.config.opportunityHours*risk);
    if(randomAt(s.config.seed,u.id,opportunity,'fault')<p){
      const kind=randomAt(s.config.seed,u.id,opportunity,'severity')<s.config.majorRate/rate?'major':'minor';
      const e=repairEvent(s,u,kind,u.id+':fault:'+opportunity);e.sampling={opportunity,risk,exposure:u.exposure,condition:u.condition};u.fault=e.id;
    }
  }
}
function serviceQueues(s,operations=null){
  for(const u of s.units){
    if(u.service||u.fault||operations?.leavingBay?.(s,u))continue;
    const e=s.events.find(e=>e.unit===u.id&&['service','component'].includes(e.kind)&&['due','queued'].includes(e.status));
    if(!e||e.kind==='service'&&(s.policy==='defer'||s.policy==='after-job'&&u.job))continue;
    u.service=e.id;e.status='queued';
  }
  for(const u of [...s.units].sort((a,b)=>(eventById(s,a.service)?.created??Infinity)-(eventById(s,b.service)?.created??Infinity))){
    if(!u.service||u.fault)continue;
    const e=eventById(s,u.service);if(e.bay!==null)continue;
    const bay=s.bays.find(b=>!b.unit);
    if(bay){bay.unit=u.id;e.bay=bay.id;}
  }
}
function travelOverlap(s,m){
  const duration=s.config.continuous?s.config.monthSeconds:s.config.monthSeconds-m.start,interval=duration/22,rate=REGULAR_HOURS/s.config.monthSeconds;
  const travelDuration=Math.min(interval,m.travelBudget/22/rate),t0=Math.max(0,s.time-s.config.stepSeconds-m.start),t1=Math.max(0,s.time-m.start);
  let seconds=0;
  for(let i=Math.floor(t0/interval);i<=Math.floor(t1/interval)&&(s.config.continuous||i<22);i++)seconds+=Math.max(0,Math.min(t1,i*interval+travelDuration)-Math.max(t0,i*interval));
  return seconds*rate;
}
function workServices(s,operations=null){
  const paid=s.config.stepSeconds*REGULAR_HOURS/s.config.monthSeconds;
  for(const m of s.mechanics){const travel=travelOverlap(s,m);m.travelUsed+=travel;m.travel=travel>1e-8;m.available=paid-travel;}
  const queue=s.events.filter(e=>e.status!=='completed').sort((a,b)=>(a.kind==='minor'||a.kind==='major'?0:1)-(b.kind==='minor'||b.kind==='major'?0:1)||a.created-b.created);
  for(const e of queue){
    const u=s.units.find(u=>u.id===e.unit),repair=['minor','major'].includes(e.kind);
    if(!repair&&(u.fault||u.service!==e.id||e.bay===null||u.edge||cellKey(u)!==cellKey(s.bays[e.bay].position)))continue;
    if(e.status!=='in-progress'){
      if(operations?.canStartWork&&!operations.canStartWork(s,e,u))continue;
      const free=s.mechanics.filter(m=>!m.event&&m.available>1e-8).slice(0,e.crew);
      if(free.length!==e.crew)continue;
      e.mechanics=free.map(m=>m.id);free.forEach(m=>m.event=e.id);e.status='in-progress';e.started=s.tick;
      for(const [category,items] of [[repair||e.kind==='component'?'repairParts':'parts',e.parts],['consumables',e.consumables]])book(s,{id:e.id+':'+category,event:e.id,unit:u.id,category,amount:items.reduce((a,i)=>a+i.total,0),items:structuredClone(items),label:e.name});
    }
    const crew=e.mechanics.map(id=>s.mechanics.find(m=>m.id===id)),work=Math.min(e.duration-e.progress,...crew.map(m=>m.available));
    e.progress+=work;e.personHours+=work*e.crew;for(const m of crew){m.used+=work;m.available-=work;}
    if(e.progress+1e-8<e.duration)continue;
    e.status='completed';e.completed=s.tick;crew.forEach(m=>m.event=null);u.condition=e.kind==='component'?1:Math.min(1,u.condition+e.recovery);
    if(repair)u.fault=null;else{if(e.bay!==null){if(operations?.holdBayUntilClear?.(s,e,u))s.bays[e.bay].departing=u.id;else s.bays[e.bay].unit=null;}u.service=null;}u.reason=e.name+' complete · ready';
  }
}
export function warehouseRisk(s,u){
  const due=s.events.filter(e=>e.unit===u.id&&e.kind==='service'&&e.status!=='completed');
  const overdueHours=due.length?Math.max(0,u.meter-Math.min(...due.map(e=>e.threshold))):0;
  return {overdueHours,risk:1+(1-u.condition)*s.config.wearRisk+overdueHours/s.scenario.models[u.model].step*s.config.overdueRisk};
}
export function improvementQuote(s,kind,unit=0){
  const fraction=Math.max(0,1-(s.config.continuous?s.time%s.config.monthSeconds:s.time)/s.config.monthSeconds);
  if(kind==='mechanic'){
    const route=logistics({location:s.scenario.worksheet.placement==='dedicated'?'site':'satellite',homeSite:'A'},s.scenario.sites[0]);
    const cost=Math.round(s.scenario.worksheet.salary*fraction)+Math.round(route.travel*fraction)+Math.round(route.accommodation*fraction)+Math.round(route.allowance*fraction);
    return {cost,disabled:(s.config.continuous?s.mechanics.length>=8:s.improvements.mechanic!==undefined)||s.finished,timing:'Available immediately for the remaining month',benefit:'Adds '+(176*fraction).toFixed(1)+' paid hours before placement travel',tradeoff:'Prorated extra payroll and placement costs; existing payroll stays reserved.'};
  }
  if(kind==='bay')return {cost:s.config.bayLease,disabled:s.bays.length>=2||s.finished,timing:'Opens immediately',benefit:'Two services may occupy separate bays',tradeoff:'One-month temporary lease, booked as operating expense. Adds no mechanics.'};
  if(kind==='component')return {cost:s.config.component.parts,disabled:s.units[unit].componentRequested||s.finished,timing:s.config.component.minimumHours+' mechanic hours after reaching a bay',benefit:'Restores drive condition to 100% on completion',tradeoff:'Parts booked when work starts; existing crew and bay are occupied. Lifetime meter continues.'};
  throw new Error('Unknown improvement');
}
export function warehouseAction(s,type,value,unit=0){
  const u=s.units[unit];if(!u)throw new Error('Choose an existing unit.');
  if(s.finished)return false;
  let applied=false;
  if(type==='policy'&&['immediate','after-job','defer'].includes(value)){s.policy=value;applied=true;}
  if(type==='control'&&['auto','manual'].includes(value)&&!(value==='manual'&&(u.fault||u.service))){
    if(value==='manual')for(const other of s.units)if(other!==u&&other.mode==='manual')other.mode='auto';
    u.mode=value;applied=true;
  }
  if(type==='move'&&u.mode==='manual'&&!u.edge&&!u.service&&!u.fault){
    const delta={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]}[value];
    if(delta){const target={x:u.x+delta[0],y:u.y+delta[1]},legal=exits(u).some(p=>cellKey(p)===cellKey(target));
      if(legal&&!occupancy(s,u).has(cellKey(target))){u.edge={to:target,progress:0};u.handling=0;u.manualHandling=false;u.heading={right:0,down:1,left:2,up:3}[value];applied=true;}else u.reason='One-way aisle · choose a legal arrow';}
  }
  if(type==='handle'&&u.mode==='manual'&&!u.service&&!u.fault&&!u.edge){const j=jobById(s,u.job),target=j&&spotById(s,u.load?j.destination:j.source);if(target&&cellKey(u)===cellKey(target.access)){u.manualHandling=true;applied=true;}}
  if(type==='improve'){
    const quote=improvementQuote(s,value,unit);if(quote.disabled)return false;
    if(value==='bay'){s.bays.push({id:1,unit:null,position:{x:1,y:11}});book(s,{id:'improvement:bay',category:'other',amount:quote.cost,label:'Temporary second bay lease · one month'});s.improvements.bay=s.tick;}
    if(value==='mechanic'){addMechanic(s,true);s.improvements.mechanic=s.tick;}
    if(value==='component'){u.componentRequested=true;repairEvent(s,u,'component',u.id+':component');}
    applied=true;
  }
  if(applied)s.actions.push({tick:s.tick,type,value,unit});return applied;
}
export function warehouseActuals(s){
  const archive=s.archive||{},costs={...archive.costs};for(const e of s.ledger)if(e.category!=='revenue')costs[e.category]=(costs[e.category]||0)+e.amount;
  const revenue=(archive.revenue||0)+s.ledger.filter(e=>e.category==='revenue').reduce((a,e)=>a+e.amount,0),cost=Object.values(costs).reduce((a,b)=>a+b,0),overhead=costs.overhead||0;
  const completed=(archive.moves||0)+s.jobs.filter(j=>j.status==='completed').length,waiting=s.jobs.filter(j=>j.status!=='completed').length;
  const planned=s.scenario.fleets.reduce((a,f)=>a+f.hours,0),elapsedPotential=planned*s.time/s.config.monthSeconds,downtime=s.units.reduce((a,u)=>a+u.downtime,0);
  return {revenue,cost,contribution:revenue-(cost-overhead),profit:revenue-cost,margin:revenue?100*(revenue-cost)/revenue:null,costs,
    variance:s.config.continuous?cost-(s.plan.direct+s.plan.overhead)*(s.contractPeriods||1):cost-s.plan.direct-s.plan.overhead,completed,waiting,remaining:s.config.continuous?s.pallets.reduce((n,p)=>n+3-p.stage,0):s.config.pallets*3-completed,
    dispatched:(archive.dispatched||0)+s.pallets.filter(p=>p.location==='dispatched').length,exposure:s.units.reduce((a,u)=>a+u.exposure,0),downtime,
    availability:elapsedPotential?Math.max(0,100*(1-downtime/elapsedPotential)):null,
    services:(archive.services||0)+s.events.filter(e=>e.kind==='service'&&e.status==='completed').length,
    faults:(archive.faults||0)+s.events.filter(e=>['minor','major'].includes(e.kind)).length,backlog:s.events.filter(e=>e.status!=='completed').length,
    personnel:s.mechanics.reduce((a,m)=>a+m.used,0),travel:s.mechanics.reduce((a,m)=>a+m.travelUsed,0)};
}
