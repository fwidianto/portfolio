function guide(p,path=p.path){
 if(!path?.nodes?.length)return [];
 const nodes=path.nodes;let lo=0,hi=nodes.length-1;while(hi-lo>1){const mid=(lo+hi)>>1;if(nodes[mid].time<=p.clock)lo=mid;else hi=mid;}
 let end=lo;while(end<nodes.length-1&&nodes[end].s<nodes[lo].s+8)end++;
 const points=[],step=Math.max(1,Math.ceil((end-lo)/24));for(let i=lo;i<=end;i+=step)points.push([nodes[i].x,nodes[i].z]);points.push([nodes[end].x,nodes[end].z]);return points;
}
export function projectPhysical(p){const h=p.handling;return {pose:p.pose,phase:p.phase,fork:p.fork,tilt:p.tilt,recovery:p.recovery||null,handling:h?{pickup:h.pickup,pallet:h.pallet,port:h.port,transferred:h.transferred,clock:h.clock??p.clock??0}:null,guide:p.guide??guide(p)};}
export function projectRecovery(r){return r?{pose:r.pose,phase:r.phase,unit:r.unit,clock:r.clock,connected:r.connected,mechanic:r.mechanic,completed:r.completed,distance:r.distance,guide:r.guide??(['approach','return'].includes(r.phase)?guide(r,r.phase==='return'?r.returnPath:r.path):[])}:null;}
export function projectMission(s){return {
 time:s.time,tick:s.tick,started:s.started,finished:s.finished,contractPeriods:s.contractPeriods,
 config:{continuous:s.config.continuous,monthSeconds:s.config.monthSeconds,stepSeconds:s.config.stepSeconds,seed:s.config.seed},
 units:s.units.map(u=>({id:u.id,index:u.index,model:u.model,x:u.x,y:u.y,heading:u.heading,edge:u.edge,load:u.load,job:u.job,phase:u.phase,reason:u.reason,mode:u.mode,meter:u.meter,condition:u.condition,fault:u.fault,service:u.service,physical:projectPhysical(u.physical)})),
 jobs:s.jobs.map(j=>({id:j.id,pallet:j.pallet,type:j.type,source:j.source,destination:j.destination,status:j.status})),
 events:s.events.map(e=>({id:e.id,unit:e.unit,kind:e.kind,status:e.status,bay:e.bay,crew:e.crew,progress:e.progress,duration:e.duration,mechanics:e.mechanics,created:e.created,started:e.started,completed:e.completed,physicalSides:e.physicalSides,physicalSlots:e.physicalSlots})),
 mechanics:s.mechanics.map(m=>({id:m.id,event:m.event,travel:m.travel,travelBudget:m.travelBudget,start:m.start})),bays:s.bays,
 pallets:s.pallets.map(p=>({id:p.id,location:p.location,stage:p.stage,arrival:p.arrival})),transfers:s.transfers.filter(t=>t.from==='offsite'||t.to==='dispatched').map(t=>({tick:t.tick,pallet:t.pallet,from:t.from,to:t.to})),archive:{received:s.archive?.received||0},
 physical:{workflow:s.physical.workflow,version:s.physical.version,ports:s.physical.ports,plans:s.physical.plans,rejected:s.physical.rejected,generated:s.physical.generated,opening:s.physical.opening,dock:{rounds:s.physical.dock?.rounds||[]},recovery:projectRecovery(s.physical.recovery)}
};}
