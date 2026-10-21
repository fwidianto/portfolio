import {maintenancePose} from './maintenance-motion.js';
import {bays} from '../layout/site-layout.js';
import {projectPhysical,projectRecovery} from './physical-presentation.js';

// Camera-independent state mapping. This module owns no clock or operational rules.
export const floorPoint=(x,y)=>({x:25.2+x*1.6,y:.245,z:4.6+y*1.6});
export function activityCue(frame){
 const u=frame.units[frame.selected];
 if(!frame.started)return 'Choose your fleet and plan, one step at a time.';
 if(frame.finished)return 'Month closed · open Result or Inspect to trace costs and unfinished work.';
 if(u.physical?.recovery)return u.fault?.status==='in-progress'?'Repairing in clear access · the pallet stays on its support.':u.reason;
 if(u.reason.startsWith('Checking aisle clearance'))return 'Waiting for aisle clearance.';
 if(u.fault)return u.fault.status==='in-progress'?'Repair underway · the forklift stays stopped and keeps its load.':u.fault.crew>frame.mechanics.length?`Repair needs ${u.fault.crew} mechanics · ${frame.mechanics.length} available in the team. Open Manage → Workshop to review staffing.`:'Fault · stopped or braking while a repair crew becomes available.';
 if(u.reason.startsWith('Awaiting safe route'))return 'Waiting for a clear route · vehicles, stock or service access block the manoeuvre.';
 if(u.reason.startsWith('Yielding'))return 'Waiting for another forklift to finish its reserved manoeuvre.';
 if(u.physical?.phase==='service')return 'Parked in the workshop · assigned mechanics work when crew capacity is available.';
 if(u.physical?.phase==='handling'){
  const h=u.physical.handling;if(h?.pallet){const stage=h.clock<1.5?'align forks':h.clock<3.3?'insert forks':h.clock<4.7?h.pickup?'take weight and lift':'set down on support':h.clock<6.7?'withdraw':h.pickup?'lower for travel':'clear empty forks';return (h.pickup?'Pick up ':'Place ')+h.pallet+' · '+stage;}
  return u.load?'Pallet engaged · lifting, placing or withdrawing the forks.':'Handling the assigned pallet · align, engage and transfer its weight.';
 }
 if(u.physical?.phase==='travel'&&u.service)return 'Travel to the service bay.';
 if(u.physical?.phase==='travel'&&u.job){const target={receive:'storage',replenish:'staging',dispatch:'shipping'}[u.job.type],source={receive:'receiving',replenish:'storage',dispatch:'staging'}[u.job.type];return u.load?'Carry '+u.load+' to '+target+'.':'Collect '+u.job.pallet+' from '+source+'.';}
 return u.reason;
}
export function operationFrame(snapshot){
 const s=snapshot.mission,events=new Map(s.events.map(e=>[e.id,e])),jobs=new Map(s.jobs.map(j=>[j.id,j]));
 const units=s.units.map(u=>{
  const service=events.get(u.service),fault=events.get(u.fault),sourceBay=service?.bay==null?null:s.bays[service.bay];
  const atBay=!!sourceBay&&!u.edge&&u.x===sourceBay.position.x&&u.y===sourceBay.position.y&&!u.fault;
  const region=atBay?'workshop':'warehouse',xy=u.edge?{x:u.x+(u.edge.to.x-u.x)*u.edge.progress,y:u.y+(u.edge.to.y-u.y)*u.edge.progress}:u;
  const bay=atBay?bays[service.bay]:null,physical=u.physical,front=physical?.pose,pose=front?{x:front.x-.65*Math.cos(front.yaw),y:.245,z:front.z-.65*Math.sin(front.yaw),yaw:front.yaw}:bay?{x:bay.x,y:.245,z:bay.y,yaw:bay.yaw}:{...floorPoint(xy.x,xy.y),yaw:u.heading*Math.PI/2};
  const j=jobs.get(u.job),event=e=>e?{id:e.id,kind:e.kind,status:e.status,bay:e.bay,crew:e.crew,progress:e.progress,duration:e.duration,mechanics:[...e.mechanics],created:e.created,started:e.started,completed:e.completed,...(e.physicalSides?{physicalSides:e.physicalSides}:{}),...(e.physicalSlots?{physicalSlots:e.physicalSlots.map(slot=>({...slot}))}:{})}:null;
  return {id:u.id,index:u.index,model:u.model,pose,region:front?(front.x<25?'workshop':'warehouse'):region,load:u.load,job:j?{id:j.id,pallet:j.pallet,type:j.type,source:j.source,destination:j.destination,status:j.status}:null,moving:physical?physical.pose.speed>1e-7&&!u.fault:!!u.edge&&!u.fault,phase:u.phase,reason:u.reason,mode:u.mode,meter:u.meter,condition:u.condition,service:event(service),fault:event(fault),selected:u.index===snapshot.unit,...(physical?{physical:projectPhysical(physical)}:{})};
 });
 const byId=new Map(units.map(u=>[u.id,u]));
 const mechanics=s.mechanics.map(m=>{
  const event=events.get(m.event),u=byId.get(event?.unit);
  const choreography=u?maintenancePose(u,{...m,monthSeconds:s.config.monthSeconds},s.time):null;
  return {id:m.id,event:m.event,unit:event?.unit||null,travel:m.travel,working:false,visible:false,region:u?.region||'office',pose:{x:5,y:.245,z:5.5,yaw:0},...choreography};
 });
 const opening=s.physical?.opening??s.pallets.filter(p=>p.arrival===0).length,receipts=(s.archive?.received||0)+s.transfers.filter(t=>t.from==='offsite').length;
 return {flow:s.physical?.workflow?{...s.physical.workflow}:null,time:s.time,tick:s.tick,started:s.started,finished:s.finished,continuous:!!s.config.continuous,period:s.contractPeriods||1,periodSeconds:s.config.monthSeconds,playing:snapshot.playing,speed:snapshot.speed,reduced:snapshot.reduced,selected:snapshot.unit,seed:s.config.seed,units,mechanics,...(s.physical?{physical:{version:s.physical.version,ports:s.physical.ports,plans:s.physical.plans,rejected:s.physical.rejected,recovery:projectRecovery(s.physical.recovery)}}:{}),
  inventory:{stored:s.pallets.filter(p=>p.location.startsWith('rack-')).length,capacity:Object.values(s.physical?.ports||{}).filter(p=>p.type==='storage').length,total:s.physical?.generated||s.pallets.length,opening,received:receipts,laterReceived:receipts-opening,dispatched:snapshot.actuals.dispatched,carried:units.filter(u=>u.load).map(u=>({pallet:u.load,unit:u.id})),locations:s.pallets.map(p=>({id:p.id,location:p.location,stage:p.stage}))},
  dockRounds:s.physical?.dock?.rounds||[],dockTransfers:s.transfers.filter(e=>e.from==='offsite'||e.to==='dispatched').map(e=>({kind:e.from==='offsite'?'receive':'dispatch',time:e.tick*s.config.stepSeconds,pallet:e.pallet})),
  finance:{revenue:snapshot.actuals.revenue,cost:snapshot.actuals.cost,profit:snapshot.actuals.profit,contribution:snapshot.actuals.contribution,margin:snapshot.actuals.margin,costs:{...snapshot.actuals.costs}},
  workshop:{bays:s.bays.length,active:s.events.filter(e=>e.bay!==null&&e.status==='in-progress').length,inPlace:s.events.filter(e=>e.bay===null&&e.status==='in-progress').length}};
}
