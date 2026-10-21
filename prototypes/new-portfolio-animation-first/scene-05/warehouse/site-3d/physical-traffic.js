import {timePhysicalPath,physicalHoldingPoints} from './physical-path.js';
import {swept,reserveConflict} from './physical-reservations.js';
import {obstaclesFor,freePose,vehicle} from './physical-space.js';
import {crewObstacles,recoveryBox} from './physical-access.js';

// Stop at straight holding points, reserving one corridor rather than an entire trip.
export function trafficItinerary(points,loaded,extra=[]){
 const chunks=[];let first=0,distance=0;
 for(let i=1;i<points.length-1;i++){
  distance+=Math.hypot(points[i].x-points[i-1].x,points[i].z-points[i-1].z);
  if(distance<4||!points[i].holding)continue;
  chunks.push(points.slice(first,i+1));first=i;distance=0;
 }
 chunks.push(points.slice(first));
 return chunks.map((chunk,i)=>{const path=timePhysicalPath(chunk,{loaded});return {path,reservation:swept(i===chunks.length-1?[...path.nodes,...extra.map(p=>({...p,time:path.duration}))]:path.nodes)};});
}

const waits=new WeakMap();
export function admitTraffic(s,u,segment){
 const revision=s.physical.revision+':'+s.units.map(v=>v.physical.reservationFrom||0).join(','),wait=waits.get(segment);if(wait?.revision===revision){u.physical.blockedBy=[...wait.blockedBy];return false;}
 const others=s.units.filter(v=>v!==u),occupied=new Set(s.spots.filter(p=>p.pallet).map(p=>p.id));
 const blocking=others.filter(v=>v.physical.reservation&&reserveConflict(segment.reservation,v.physical.reservation,v.physical.reservationFrom||0)||reserveConflict(segment.reservation,swept([v.physical.pose],vehicle)));
 u.physical.blockedBy=blocking.map(v=>v.id);
 const blocked=[...obstaclesFor(s.physical.ports,others.map(v=>v.physical.pose),occupied),...crewObstacles(s,u.id),...(s.physical.recovery?[recoveryBox(s.physical.recovery.pose)]:[])];
 // Test every precomputed corridor pose, not only its endpoint or centre line.
 if(blocking.length||s.physical.recovery?.reservation&&s.physical.recovery.unit!==u.id&&reserveConflict(segment.reservation,s.physical.recovery.reservation)||!segment.path.nodes.every(p=>freePose(p,blocked))){waits.set(segment,{revision,blockedBy:[...u.physical.blockedBy]});return false;}
 waits.delete(segment);u.physical.path=segment.path;u.physical.reservation=segment.reservation;u.physical.reservationFrom=0;s.physical.revision++;return true;
}

const continuations=new WeakMap();
export function admitNextTraffic(s,u,itinerary,index){
 // Keep the docking manoeuvre separate; roll through two other clear corridors.
 if(index+1<itinerary.length-1){
  let joined=continuations.get(itinerary);if(!joined){joined=new Map();continuations.set(itinerary,joined);}
  if(!joined.has(index)){const a=itinerary[index],b=itinerary[index+1],path=timePhysicalPath([...a.path.nodes,...b.path.nodes.slice(1)],{loaded:!!u.load});joined.set(index,{path,reservation:swept(path.nodes)});}
  if(admitTraffic(s,u,joined.get(index))){u.physical.segment=index+1;return true;}
 }
 if(!admitTraffic(s,u,itinerary[index]))return false;u.physical.segment=index;return true;
}

export function releasePassedTraffic(u){
 const p=u.physical;if(!p.reservation||!p.path)return;
 if(p.phase!=='dock-exit'&&['job','recovery-pick'].includes(p.goal.kind)&&(!p.itinerary||p.segment===p.itinerary.length-1))return;
 let index=p.reservationFrom||0;while(index<p.reservation.length-1&&p.reservation[index].time<p.clock)index++;p.reservationFrom=index;
}

export function needsYield(s,u){
 const p=u.physical,blocking=p.blockedBy?.length?s.units.filter(v=>p.blockedBy.includes(v.id)):s.units.filter(v=>v!==u&&Math.hypot(v.physical.pose.x-p.pose.x,v.physical.pose.z-p.pose.z)<6);
 return blocking.length>0&&blocking.every(v=>v.fault||!v.physical.search&&!['travel','dock-exit','yield','handling','departure','service-prep'].includes(v.physical.phase));
}

export function yieldTraffic(s,u){
 const p=u.physical,previous=p.itinerary?.[p.segment];if(!previous||p.goal.kind!=='job')return false;
 if(!p.yieldRoute){const points=previous.path.nodes.map(n=>({x:n.x,z:n.z,yaw:n.yaw,k:n.k,gear:-n.gear})).reverse();p.yieldRoute={path:timePhysicalPath(points,{loaded:!!u.load}),reservation:swept(points)};}
 if(!admitTraffic(s,u,p.yieldRoute))return false;
 p.phase='yield';p.clock=0;p.baseRoll=[...p.pose.roll];p.itinerary=null;p.yieldRoute=null;p.divert=true;u.reason='Backing to the clear holding point';return true;
}

export function backToHolding(s,u){
 const p=u.physical;if(p.pose.speed>1e-7||Math.abs(p.pose.k)>.001)return false;
 const c=Math.cos(p.pose.yaw),sn=Math.sin(p.pose.yaw);
 for(const target of physicalHoldingPoints(p.pose)){
  const dx=target.x-p.pose.x,dz=target.z-p.pose.z,behind=dx*c+dz*sn;
  if(behind>-.5||behind< -12||Math.abs(-dx*sn+dz*c)>.02||Math.abs(Math.atan2(Math.sin(target.yaw-p.pose.yaw),Math.cos(target.yaw-p.pose.yaw)))>.01)continue;
  const points=[{...p.pose,k:0,gear:-1},{...target,k:0,gear:-1}],path=timePhysicalPath(points,{loaded:!!u.load}),route={path,reservation:swept(path.nodes)};
  if(!admitTraffic(s,u,route))continue;
  p.phase='yield';p.clock=0;p.baseRoll=[...p.pose.roll];p.itinerary=null;p.divert=true;u.reason='Back clear of the shared aisle';u.edge={to:{x:u.x,y:u.y},progress:0};return true;
 }
 return false;
}
