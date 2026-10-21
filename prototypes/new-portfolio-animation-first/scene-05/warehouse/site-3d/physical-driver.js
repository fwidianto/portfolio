import {physicalPorts,parking,obstaclesFor,freePose,envelope,rectanglesOverlap,vehicle} from './physical-space.js';
import {planPhysicalPath,timePhysicalPath,physicalPathPose,advancePhysicalSearch} from './physical-path.js';
import {compileRoad} from './road-path.js';
import {forkRoute} from '../layout/site-layout.js';
import {openContinuous,continueStock,assignContinuous,storageWorkZone} from './continuous-operations.js';
import {swept,reserveConflict,boxesOverlap as overlap} from './physical-reservations.js';
import {workSlots,crewObstacles,recoveryBox} from './physical-access.js';
import {initializeRecovery,requestRecovery,stepRecovery,recoverLoad,finishReclaim} from './recovery-operations.js';
import {updateDockVisits} from './dock-operations.js';
import {trafficItinerary,admitNextTraffic,yieldTraffic,backToHolding,needsYield,releasePassedTraffic} from './physical-traffic.js';
const clamp=x=>Math.max(0,Math.min(1,x)),smooth=x=>{x=clamp(x);return x*x*(3-2*x);},lerp=(a,b,t)=>a+(b-a)*t;
export function initializePhysical(s){
 // The physical marshalling row leaves the workshop doorway clear: ten actual berths.
 s.spots=s.spots.filter(p=>p.type!=='staging'||Number(p.id.split('-')[1])<10);
 s.physical={version:1,ports:physicalPorts(s.spots),revision:0,lastPlanTick:-1,plans:0,rejected:0};
 for(const u of s.units)u.physical={pose:{...parking(u.index),k:0,roll:[0,0,0,0],speed:0},phase:'ready',fork:.1,tilt:0,clock:0,path:null,reservation:null,waitSince:0,goal:null,manualRequest:null};
 openContinuous(s);
 initializeRecovery(s);
 return s;
}
const portal={x:25.8,z:23,yaw:Math.PI},bayRoutes=[0,1].map(b=>{const segments=forkRoute(b);segments[0].from=[portal.x,portal.z];const road=compileRoad(segments,{wheelbase:1.6,track:1.06}),points=[];for(let s=0;s<road.length;s+=.035){const p=road.at(s);points.push({x:p.x,z:p.y,yaw:p.yaw,k:p.curvature,gear:1});}const p=road.at(road.length);points.push({x:p.x,z:p.y,yaw:p.yaw,k:0,gear:1});return points;});
const bayExits=bayRoutes.map(route=>[...route].reverse().map(point=>({...point,gear:-1})));
function setMoving(u,on){u.edge=on?{to:{x:u.x,y:u.y},progress:0}:null;}
function parked(v){const home=parking(v.index),p=v.physical.pose;return Math.hypot(p.x-home.x,p.z-home.z)<.02;}
function routeBlocker(v){return v.fault||v.mode==='manual'||v.physical.phase==='service'||parked(v)||!v.job&&!v.service;}
function moving(v){return !v.fault&&['travel','yield','dock-exit','handling','departure','service-prep'].includes(v.physical.phase);}
function obstacles(s,u,planning=false){return [...obstaclesFor(s.physical.ports,s.units.filter(v=>v!==u&&(!planning||!s.config.continuous||routeBlocker(v)||u.physical.divert&&!moving(v))).map(v=>v.physical.pose),new Set(s.spots.filter(p=>p.pallet).map(p=>p.id)),planning&&s.config.continuous ? .35 : 0),...crewObstacles(s,u.id),...(s.physical.recovery?[recoveryBox(s.physical.recovery.pose)]:[])];}
function deferPickup(s,u,job){const p=u.physical;u.skippedJobs={revision:s.physical.revision,ids:[...(u.skippedJobs?.revision===s.physical.revision?u.skippedJobs.ids:[]),job.id]};u.workZone=null;u.workZonePort=null;job.owner=null;job.status='waiting';u.job=null;p.candidate=null;p.failed=null;}
function beginRoute(s,u,target,kind,port=null){
 const p=u.physical,key=JSON.stringify([kind,target,port?.id,s.physical.revision]),previousPort=s.physical.ports[p.goal?.port];
 if(s.config.continuous&&p.triedRevision!==s.physical.revision){p.triedRevision=s.physical.revision;p.triedDestinations=null;}
 if(!s.config.continuous&&kind==='job'&&!u.load&&s.physical.handoffOwner&&s.physical.handoffOwner!==u.id){u.reason='Yielding · receiving-to-storage handoff reserved';return false;}
 if(p.failed===key){u.reason=p.failedReason;if(s.config.continuous&&s.time-(p.waitSince||s.time)>=8&&needsYield(s,u))backToHolding(s,u);return false;}
 if(s.physical.lastPlanTick!==s.tick){s.physical.lastPlanTick=s.tick;s.physical.planQuanta=0;}
 if(s.physical.planQuanta>=(s.config.continuous?4:1))return false;
 s.physical.planQuanta++;s.physical.plans++;
 const blocked=obstacles(s,u,true),cacheKey=s.config.continuous?JSON.stringify([p.pose.x,p.pose.z,p.pose.yaw,kind,target,p.lastBay,s.units.filter(v=>v!==u&&(routeBlocker(v)||p.divert&&!moving(v))).map(v=>v.physical.pose),s.spots.filter(p=>p.pallet).map(p=>p.id),s.events.filter(e=>e.status==='in-progress').map(e=>e.id)]):null;let result;
 if(cacheKey&&p.candidate?.key===cacheKey)result=p.candidate.result;
 else{
  const intoBay=kind==='bay',outOfBay=!intoBay&&p.lastBay!==undefined,intoParking=s.config.continuous&&['parking','waiting-parking'].includes(kind);
  const start=outOfBay?portal:p.pose,goal=intoBay?portal:intoParking?{...target,z:8}:target,options={lanes:s.config.continuous?(kind==='job'?'traffic':true):false,goalReverse:kind==='bay',maxNodes:s.config.continuous&&(intoBay||outOfBay)?4000:24000,docked:outOfBay?!!s.config.continuous:!!previousPort&&Math.hypot(p.pose.x-previousPort.approach.x,p.pose.z-previousPort.approach.z)<.02};
  if(s.config.continuous){
   const identity=JSON.stringify([p.pose.x,p.pose.z,p.pose.yaw,kind,target,p.lastBay]);
   if(p.search?.key!==identity){p.search={key:identity,quanta:0};p.searchData={planningKey:cacheKey,start:{x:start.x,z:start.z,yaw:start.yaw,k:0},goal,obstacles:blocked,options};}
   result=advancePhysicalSearch(p.searchData,p.search);
   if(!result){u.reason='Checking aisle clearance · '+(port?.id||kind);return false;}const searchedKey=p.searchData.planningKey;p.search=null;p.searchData=null;if(!result.ok&&searchedKey!==cacheKey){p.candidate=null;u.reason='Recheck changed aisle clearance';return false;}
  }else result=planPhysicalPath(start,goal,blocked,options);
  if(result.ok){
   if(intoParking){const tail=Array.from({length:120},(_,i)=>({...target,z:lerp(8,target.z,i/119),k:0,gear:-1}));result={...result,points:[...result.points,...tail]};}
   if(intoBay)result={ok:true,points:[...result.points,...bayRoutes[target.z===29?1:0].slice(1)]};
   else if(outOfBay)result={ok:true,points:[...bayExits[p.lastBay],...result.points.slice(1)]};
   if(!result.points.every(point=>freePose(point,blocked))){if(s.config.continuous){p.candidate=null;p.failed=null;u.reason='Recheck changed aisle clearance';return false;}result={ok:false,reason:'Route occupied during planning'};}
  }
 }
 if(cacheKey&&p.candidate?.key!==cacheKey)p.candidate={key:cacheKey,result};
 if(!result.ok){p.waitSince||=s.time;if(s.config.continuous&&s.time-p.waitSince>=8&&needsYield(s,u)&&backToHolding(s,u))return false;if(s.config.continuous&&kind==='job'){const job=s.jobs.find(j=>j.id===u.job);if(job?.type==='receive'&&u.load){p.triedDestinations||=[];if(!p.triedDestinations.includes(job.destination))p.triedDestinations.push(job.destination);const candidates=s.spots.filter(slot=>slot.type==='storage'&&!slot.pallet&&!slot.reserved&&!s.units.some(v=>v!==u&&v.workZone===storageWorkZone(slot.id))&&!p.triedDestinations.includes(slot.id)&&freePose(s.physical.ports[slot.id].approach,obstacles(s,u))).sort((a,b)=>Math.hypot(s.physical.ports[a.id].x-p.pose.x,s.physical.ports[a.id].z-p.pose.z)-Math.hypot(s.physical.ports[b.id].x-p.pose.x,s.physical.ports[b.id].z-p.pose.z));if(candidates.length){s.spots.find(slot=>slot.id===job.destination).reserved=null;job.destination=candidates[0].id;candidates[0].reserved=job.id;u.workZone=storageWorkZone(job.destination);u.workZonePort=job.destination;p.candidate=null;p.failed=null;u.reason='Choose a clear storage berth';return false;}}else if(job&&!u.load){deferPickup(s,u,job);return false;}}p.failed=key;p.planFailure=result.reason;p.failedReason=u.reason='Awaiting safe route · '+(port?.id||kind);s.physical.rejected++;return false;}
 const extra=port?Array.from({length:28},(_,i)=>({...port.approach,x:lerp(port.approach.x,port.dock.x,i/27),z:lerp(port.approach.z,port.dock.z,i/27)})):[],reservation=swept([...result.points,...extra]);
 if(!s.config.continuous&&(s.units.some(v=>v!==u&&v.physical.reservation&&reserveConflict(reservation,v.physical.reservation))||s.physical.recovery?.reservation&&s.physical.recovery.unit!==u.id&&reserveConflict(reservation,s.physical.recovery.reservation))){p.failed=key;p.failedReason=u.reason='Yielding · full manoeuvre reserved';s.physical.rejected++;return false;}
 let path;if(s.config.continuous){const itinerary=p.candidate.itinerary||=trafficItinerary(result.points,!!u.load,extra);if(!admitNextTraffic(s,u,itinerary,0)){u.reason='Yielding at aisle entry · corridor occupied';p.waitSince||=s.time;if(s.time-p.waitSince>=8&&needsYield(s,u)&&backToHolding(s,u))return false;if(kind==='job'&&!u.load&&s.time-p.waitSince>=8&&needsYield(s,u)){deferPickup(s,u,s.jobs.find(j=>j.id===u.job));return false;}return false;}p.itinerary=itinerary;path=p.path;}else path=timePhysicalPath(result.points,{loaded:!!u.load});const base=[...p.pose.roll];p.routeMethod=result.method||'local';p.path=path;p.candidate=null;p.baseRoll=base;p.clock=0;p.phase=u.load&&(Math.abs(p.fork-.265)>.001||Math.abs(p.tilt-Math.PI/72)>.001)?'departure':'travel';p.prep={fork:p.fork,tilt:p.tilt};p.goal={kind,target,port:port?.id||null};if(!s.config.continuous)p.reservation=reservation;p.lastBay=undefined;if(kind==='job'&&!u.load)s.physical.handoffOwner=u.id;p.divert=false;p.waitSince=0;p.triedDestinations=null;p.clearingPort=null;p.failed=null;setMoving(u,true);u.reason=kind==='job'?(u.load?'Carry pallet to ':'Travel to pickup · ')+port.id:kind==='bay'?'Travel to service bay':kind==='parking'?'Return to parking':'Travel to chosen waypoint';return true;
}
function completeRoute(s,u){
 const p=u.physical,g=p.goal;if(p.phase==='dock-exit'){if(g.port===u.workZonePort){u.workZone=null;u.workZonePort=null;}p.path=null;p.phase='ready';p.clock=0;p.pose.speed=0;p.reservation=swept([p.pose],vehicle);p.reservationFrom=0;p.goal={kind:'clear-port',target:{x:p.pose.x,z:p.pose.z,yaw:p.pose.yaw},port:null};p.clearingPort=null;p.dockExit=null;p.divert=false;setMoving(u,false);s.physical.revision++;return;}if(p.phase==='yield'){p.path=null;p.phase='ready';p.clock=0;p.pose.speed=0;p.reservation=swept([p.pose],vehicle);p.reservationFrom=0;p.candidate=null;p.failed=null;p.search=null;p.searchData=null;setMoving(u,false);s.physical.revision++;return;}if(s.config.continuous&&p.itinerary&&p.segment<p.itinerary.length-1){p.phase='traffic';p.path=null;p.reservation=swept([p.pose],vehicle);p.reservationFrom=0;p.clock=0;p.pose.speed=0;setMoving(u,false);s.physical.revision++;return;}const arrival=p.path;p.itinerary=null;p.pose={...p.pose,...g.target,k:0,speed:0};p.path=null;p.clock=0;setMoving(u,false);
 if(p.egress&&g.kind!=='bay')p.egress=false;
 if(g.kind==='job'||g.kind==='recovery-pick'){if(s.config.continuous){const points=arrival.nodes.map(n=>({x:n.x,z:n.z,yaw:n.yaw,k:n.k,gear:-n.gear})).reverse();p.dockExit=timePhysicalPath(points,{loaded:!u.load});}const port=s.physical.ports[g.port];u.x=port.access.x;u.y=port.access.y;if(u.mode==='manual'&&!p.forceHandle&&g.kind!=='recovery-pick'){p.phase='ready';u.reason='Aligned · Space to lift or place';p.reservation=null;s.physical.revision++;}else{p.forceHandle=false;p.phase='handling';p.handling={port:port.id,pallet:u.load||s.jobs.find(j=>j.id===u.job)?.pallet||p.recovery?.load,pickup:!u.load,recovery:g.kind==='recovery-pick',transferred:false,initialFork:p.fork,initialTilt:p.tilt};setMoving(u,true);}}
 else{p.phase=g.kind==='bay'?'service-prep':'ready';p.prep={fork:p.fork,tilt:p.tilt};p.reservation=null;s.physical.revision++;if(g.kind==='bay'){const e=s.events.find(e=>e.id===u.service),bay=s.bays[e.bay];u.x=bay.position.x;u.y=bay.position.y;p.lastBay=e.bay;setMoving(u,true);}if(g.kind==='manual')p.manualRequest=null;}
}
function handle(s,u,context){
 const p=u.physical,h=p.handling,port=s.physical.ports[h.port],t=p.clock,H=port.support-.245,pick=h.pickup,c=Math.cos(port.yaw),sn=Math.sin(port.yaw);
 const from=port.approach,to=port.dock,enter=pick?smooth((t-1)/2):smooth((t-1.5)/2),leave=pick?smooth((t-4.7)/2):smooth((t-4.7)/2),fraction=enter*(1-leave);
 const old={...p.pose};p.pose={...p.pose,x:lerp(from.x,to.x,fraction),z:lerp(from.z,to.z,fraction),yaw:port.yaw,k:0,speed:Math.hypot(to.x-from.x,to.z-from.z)*Math.abs(fraction-(p.previousDockFraction||0))/s.config.stepSeconds};
 p.previousDockFraction=fraction;const ds=(p.pose.x-old.x)*c+(p.pose.z-old.z)*sn;p.pose.roll=p.pose.roll.map(r=>r+ds);
 if(pick){
  p.fork=t<1?lerp(h.initialFork,H+.05,smooth(t)):t<3?H+.05:t<3.3?lerp(H+.05,H+.065,smooth((t-3)/.3)):t<4.3?lerp(H+.065,H+.265,smooth(t-3.3)):t<6.7?H+.265:lerp(H+.265,.265,smooth(t-6.7));
  p.tilt=t<4.3?lerp(h.initialTilt,0,smooth(t)):Math.PI/72*smooth((t-4.3)/.4);
 }else{
  p.fork=t<1.5?lerp(h.initialFork,H+.145,smooth(t/1.5)):t<3.5?H+.145:t<4.3?lerp(H+.145,H+.065,smooth((t-3.5)/.8)):t<4.7?lerp(H+.065,H+.045,smooth((t-4.3)/.4)):t<6.7?H+.045:lerp(H+.045,.1,smooth(t-6.7));
  p.tilt=lerp(h.initialTilt,0,smooth(t/1.5));
 }
 if(!h.transferred&&t>=(pick?3.3:4.3)-1e-8){
  setMoving(u,false);if(h.recovery)recoverLoad(s,u);else if(!context.handleLoad(s,u))throw new Error('Physical handoff rejected: '+u.id+' / '+port.id);h.transferred=true;setMoving(u,true);
 }
 u.reason=(pick?'Lift ':'Place ')+(h.pallet||u.load||port.id)+' · '+(t<1.5?'align':t<3.5?'engage':t<4.7?'transfer weight':t<6.7?'withdraw':'settle');
 if(t>=7.7-1e-8){p.clock=0;p.handling=null;p.previousDockFraction=0;if(h.recovery)finishReclaim(s,u);if(!pick&&s.physical.handoffOwner===u.id)s.physical.handoffOwner=null;p.pose.speed=0;if(s.config.continuous&&p.dockExit){p.phase='dock-exit';p.path=p.dockExit;p.reservation=swept(p.path.nodes);p.reservationFrom=0;p.baseRoll=[...p.pose.roll];p.clearingPort=null;setMoving(u,true);u.reason='Withdraw to the clear aisle';}else{p.phase='ready';p.reservation=null;p.clearingPort=pick?port.id:null;setMoving(u,false);}s.physical.revision++;}
}
export const physicalOperations={
 beforeStep(s){continueStock(s);requestRecovery(s);},
 jobAllowed(s,pallet){return !s.config.continuous||pallet.stage!==1||s.physical.workflow.phase==='dispatch';},
 afterStep(s){stepRecovery(s);updateDockVisits(s);for(const bay of s.bays)if(bay.departing&&s.units.find(u=>u.id===bay.departing).physical.pose.x>=25.5){bay.unit=null;delete bay.departing;s.physical.revision++;}},
 leavingBay(s,u){return !!u.physical.egress;},
 holdBayUntilClear(s,event,u){u.physical.egress=true;return true;},
 running(s,u){if(!s.config.continuous)return undefined;return !u.fault&&['travel','yield','dock-exit','departure','handling','service-prep'].includes(u.physical.phase);},
 portReserved(s,slot){
  const port=s.physical.ports[slot.id],c=Math.cos(port.yaw),sn=Math.sin(port.yaw),polygon=[[-.6,-.5],[.6,-.5],[.6,.5],[-.6,.5]].map(([x,z])=>({x:port.x+c*x-sn*z,z:port.z+sn*x+c*z})),box={polygon,x0:Math.min(...polygon.map(p=>p.x)),x1:Math.max(...polygon.map(p=>p.x)),z0:Math.min(...polygon.map(p=>p.z)),z1:Math.max(...polygon.map(p=>p.z))};
  return s.units.some(u=>u.physical.clearingPort===slot.id||rectanglesOverlap(envelope(u.physical.pose),polygon)||u.physical.reservation?.some((p,i)=>i>=(u.physical.reservationFrom||0)&&overlap(box,p)));
 },
 canStartWork(s,event,u){
  if(!['minor','major'].includes(event.kind)&&u.physical.phase!=='service')return false;
  const p=u.physical.pose;if(p.speed>1e-6||Math.abs(p.k)>.001)return false;
  if(s.physical.recovery?.unit===u.id)return false;
  const slots=workSlots(s,event,u);if(slots.length<event.crew)return false;event.physicalSlots=slots.slice(0,event.crew);event.physicalSides=event.physicalSlots.map(slot=>slot.side);return true;
 },
 operate(s,u,context){
  const p=u.physical,dt=s.config.stepSeconds;
  if(u.fault){
   if(p.phase==='handling')p.handlerRestart=0;
   const speed=p.pose.speed,next=Math.max(0,speed-2*dt);
   if(speed>1e-8&&['travel','yield','dock-exit'].includes(p.phase)){
    const nominal=physicalPathPose(p.path,p.clock).speed;p.clock=Math.min(p.path.duration,p.clock+dt*(speed+next)/2/Math.max(nominal,.01));const at=physicalPathPose(p.path,p.clock);p.pose={...at,roll:at.roll.map((r,i)=>r+p.baseRoll[i]),speed:next};
   }else if(speed>1e-8&&p.phase==='handling'){
    const pickup=p.handling.pickup,end=p.clock<4?(pickup?3:3.5):6.7;p.clock=Math.min(end,p.clock+dt*(speed+next)/(2*Math.max(speed,.01)));handle(s,u,context);p.pose.speed=next;
   }else{p.pose.speed=0;p.pose.k-=Math.sign(p.pose.k)*Math.min(Math.abs(p.pose.k),.7/1.8*dt);}
   if(s.config.continuous&&!p.recovery&&p.pose.speed<1e-7&&Math.abs(p.pose.k)<.001&&['travel','yield','dock-exit','traffic','departure'].includes(p.phase)){p.phase='ready';p.path=null;p.itinerary=null;p.dockExit=null;p.candidate=null;p.search=null;p.searchData=null;p.clock=0;p.reservation=swept([p.pose],vehicle);p.reservationFrom=0;p.clearingPort=null;s.physical.revision++;}
   u.reason=s.events.find(e=>e.id===u.fault)?.status==='in-progress'?'Repair in progress'+(u.load?' · load retained':''):'Fault · braking / waiting for repair crew';return;
  }
  if(p.recovery&&!['travel','yield','dock-exit','handling','departure'].includes(p.phase)){
   if(p.recovery.port&&!u.load){p.phase='ready';const port=s.physical.ports[p.recovery.port];beginRoute(s,u,port.approach,'recovery-pick',port);return;}
   finishReclaim(s,u);p.phase='ready';
  }
  if(p.phase==='traffic'){if(admitNextTraffic(s,u,p.itinerary,p.segment+1)){p.phase='travel';p.clock=0;p.waitSince=0;p.yieldRoute=null;p.baseRoll=[...p.pose.roll];setMoving(u,true);u.reason='Continue through cleared aisle';}else{p.waitSince||=s.time;u.reason='Yielding at holding point · aisle occupied';if(s.time-p.waitSince>=8&&needsYield(s,u)&&yieldTraffic(s,u))setMoving(u,true);else if(s.time-p.waitSince>=12&&needsYield(s,u)){p.phase='ready';p.itinerary=null;p.divert=true;p.candidate=null;p.failed=null;p.search=null;p.searchData=null;}}return;}
  if(p.phase==='departure'||p.phase==='service-prep'){
   p.clock=Math.min(1,p.clock+dt);const leaving=p.phase==='departure';u.reason=leaving?'Settle load for travel':'Park · lower forks for service';p.fork=lerp(p.prep.fork,leaving?.265:.1,smooth(p.clock));p.tilt=lerp(p.prep.tilt,leaving?Math.PI/72:0,smooth(p.clock));p.pose.speed=0;
   if(p.clock>=1-1e-8){p.phase=leaving?'travel':'service';p.clock=0;if(!leaving){setMoving(u,false);u.reason='At bay · crew access ready';}}return;
  }
  if(p.phase==='travel'||p.phase==='yield'||p.phase==='dock-exit'){
   if(u.service&&p.phase!=='dock-exit'&&p.goal.kind!=='bay'&&p.goal.kind!=='recovery-pick'&&p.goal.kind!=='clear-port'&&!(p.goal.kind==='waiting-parking'&&s.events.find(e=>e.id===u.service)?.bay===null)){
    const speed=p.pose.speed,next=Math.max(0,speed-2*dt);
    if(speed>1e-8){const nominal=physicalPathPose(p.path,p.clock).speed;p.clock=Math.min(p.path.duration,p.clock+dt*(speed+next)/(2*Math.max(nominal,.01)));const at=physicalPathPose(p.path,p.clock);p.pose={...at,roll:at.roll.map((r,i)=>r+p.baseRoll[i]),speed:next};}
    else{p.pose.k-=Math.sign(p.pose.k)*Math.min(Math.abs(p.pose.k),.7/1.8*dt);if(Math.abs(p.pose.k)<.001){p.phase='ready';p.path=null;p.reservation=null;p.clock=0;setMoving(u,false);if(!u.load&&s.physical.handoffOwner===u.id)s.physical.handoffOwner=null;s.physical.revision++;}}
    u.reason='Stopping safely for assigned service';return;
   }
   const targetSteer=physicalPathPose(p.path,p.clock).k;if(p.pose.speed<1e-7&&Math.abs(p.pose.k-targetSteer)>.001){p.pose.k+=Math.sign(targetSteer-p.pose.k)*Math.min(Math.abs(targetSteer-p.pose.k),.7/1.8*dt);return;}
   // A zero-speed sample ahead must not pin a stopped vehicle before its waypoint.
   const now=physicalPathPose(p.path,p.clock),next=physicalPathPose(p.path,Math.min(p.path.duration,p.clock+dt)),cap=Math.min(Math.max(now.speed,next.speed),p.pose.speed+.55*dt),scale=now.speed+next.speed>1e-8?Math.min(1,(p.pose.speed+cap)/(now.speed+next.speed)):1;
   p.clock=Math.min(p.path.duration,p.clock+dt*scale);const at=physicalPathPose(p.path,p.clock);p.pose={...at,roll:at.roll.map((r,i)=>r+p.baseRoll[i]),speed:Math.min(at.speed,cap)};
   if(s.config.continuous)releasePassedTraffic(u);
   if(p.clock>=p.path.duration-1e-8)completeRoute(s,u);return;
  }
  if(p.phase==='handling'){let scale=1;if(p.handlerRestart!==undefined){p.handlerRestart=Math.min(1,p.handlerRestart+dt/2);scale=p.handlerRestart;if(scale===1)delete p.handlerRestart;}p.clock=Math.min(7.7,p.clock+dt*scale);handle(s,u,context);return;}
  if(p.phase==='service'){
   if(u.service){u.reason='At bay · '+s.events.find(e=>e.id===u.service)?.status;return;}p.phase='ready';s.physical.revision++;
  }
  if(u.service){const e=s.events.find(e=>e.id===u.service);if(e.bay===null){const target=parking(u.index);if(!u.load&&(Math.hypot(p.pose.x-target.x,p.pose.z-target.z)>.01||Math.abs(p.pose.yaw-target.yaw)>.01)){beginRoute(s,u,target,'waiting-parking');u.reason='Clear aisle · wait for service bay';}else u.reason='Queued · waiting for a bay';return;}const target={x:11,z:e.bay?29:16,yaw:Math.PI};beginRoute(s,u,target,'bay');return;}
  if(p.lastBay!==undefined&&!u.load){beginRoute(s,u,parking(u.index),'parking');return;}
  if(!u.job&&!assignContinuous(s,u))context.assign(s,u);
  const job=s.jobs.find(j=>j.id===u.job);
  if(u.mode==='manual'){
   if(p.manualRequest)beginRoute(s,u,p.manualRequest,'manual');else if(p.manualHandle&&job){const port=s.physical.ports[u.load?job.destination:job.source];p.forceHandle=true;if(beginRoute(s,u,port.approach,'job',port))p.manualHandle=false;}else u.reason='Manual · choose a clear waypoint or handle assigned pallet';return;
  }
  if(job){const port=s.physical.ports[u.load?job.destination:job.source];beginRoute(s,u,port.approach,'job',port);return;}
  const target=parking(u.index);if(Math.hypot(p.pose.x-target.x,p.pose.z-target.z)>.01||Math.abs(p.pose.yaw-target.yaw)>.01)beginRoute(s,u,target,'parking');else{p.pose.speed=0;u.reason='Engine off · parked';}
 }
};
export function physicalAction(s,type,value,index=0){
 const u=s.units[index],p=u?.physical;if(!p||s.finished||u.mode!=='manual'||u.fault||u.service||p.phase!=='ready')return false;
 if(type==='handle'){p.manualHandle=true;p.failed=null;return true;}
 if(type==='move'){
  const d={up:[0,-1,-Math.PI/2],down:[0,1,Math.PI/2],left:[-1,0,Math.PI],right:[1,0,0]}[value];if(!d)return false;
  const target={x:p.pose.x+d[0]*1.6,z:p.pose.z+d[1]*1.6,yaw:d[2]};if(!freePose(target,obstacles(s,u))){u.reason='Waypoint blocked · choose another direction';return false;}p.manualRequest=target;p.failed=null;return true;
 }return false;
}
