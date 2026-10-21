import {handlingFrame,turnLength,duration,rigSpec} from './handling-motion.js';
import {arrival,exits,roadDistance} from './road-path.js';
import {continuousLogisticsFrame} from './continuous-logistics.js';
import {docks} from '../layout/site-layout.js';
const clamp=x=>Math.max(0,Math.min(1,x)),smooth=x=>{x=clamp(x);return x*x*x*(10+x*(-15+6*x));};
export const dockCycle={carry:turnLength+.2,place:turnLength+1.85,retreat:turnLength+.1,height:.9};
export const arrivalEnd=33.6,collectionClose=160,doorSeconds=1.5,roadSpeed=3;
export const truckEnvelope={length:7.6,width:3,offset:1};
export function roadDuration(path){return path.length/roadSpeed+2;}
function truck(kind,time,depart){
 const dock=docks[kind],before=kind==='dispatch'&&time<arrivalEnd,path=before?arrival:exits[kind],elapsed=before?time:Math.max(0,time-depart),T=before?arrivalEnd:roadDuration(path),p=before||time>=depart?path.at(roadDistance(elapsed,T,path.length)):{...dock,curvature:0,roll:[0,0,0,0]},offset=kind==='dispatch'&&!before?arrival.at(arrival.length).roll:[0,0,0,0];
 const phase=before?'arriving':time<depart?'docked':'departing',door=phase==='docked'?Math.min(kind==='receiving'?1:smooth((time-arrivalEnd)/doorSeconds),1-smooth((time-(depart-2))/doorSeconds)):0;
 const restraint=phase==='docked'?1-smooth((time-(depart-1))/.7):0;
 return {kind,pose:{x:p.x,z:p.y,yaw:p.yaw},ground:.05,phase,door,restraint,chocked:restraint===1,visible:before||time<depart+T,roll:p.roll.map((v,i)=>v+offset[i]),steering:[-.99,.99,-.99,.99].map((side,i)=>i<2?0:Math.atan2(3.7*p.curvature,1-p.curvature*side))};
}
export function logisticsFrame(source,presentationTime=source.time){
 if(source.continuous)return continuousLogisticsFrame(source,presentationTime);
 const t=presentationTime,records=source.dockTransfers||[],receipts=records.filter(e=>e.kind==='receive'&&e.time>0),dispatches=records.filter(e=>e.kind==='dispatch'),firstReceive=receipts[0]?.time,firstDispatch=dispatches.find(e=>e.time<=collectionClose)?.time;
 const receiveStart=firstReceive==null?Infinity:firstReceive+2,dispatchStart=firstDispatch==null?Infinity:Math.max(firstDispatch+2,arrivalEnd+2),receiveEnd=Number.isFinite(receiveStart)?receiveStart+duration:0,dispatchEnd=Number.isFinite(dispatchStart)?dispatchStart+duration:0;
 const complete=records.filter(e=>e.kind==='receive').length===source.inventory.total,lastReceipt=records.filter(e=>e.kind==='receive').at(-1)?.time||0,receiveDepart=complete?Math.max(lastReceipt,receiveEnd)+3:Infinity,dispatchRequested=Math.max(collectionClose,dispatchEnd)+3,dispatchDepart=Math.max(dispatchRequested,receiveDepart+4);
 const trucks=[truck('receiving',t,receiveDepart),truck('dispatch',t,dispatchDepart)];trucks[1].waiting=t>=dispatchRequested&&t<dispatchDepart;
 const loaders=['receive','dispatch'].map((kind,i)=>{
  const start=i?dispatchStart:receiveStart,age=Math.max(0,Math.min(duration,t-start)),base=handlingFrame(i?age:duration-age,dockCycle),dock=docks[i?'dispatch':'receiving'],dx=dock.x+1.4-11.2,dz=20.8;
  const owner=base.load.owner==='platform'?'truck':base.load.owner==='floor'?'buffer':'forks',load={...base.load,x:base.load.x+dx,z:base.load.z+dz,owner,id:'DOCK-'+kind.toUpperCase()},vehicle=trucks[i];
  if(owner==='truck'){const yaw=vehicle.pose.yaw;load.x=vehicle.pose.x-1.4*Math.cos(yaw)-.55*Math.sin(yaw);load.z=vehicle.pose.z-1.4*Math.sin(yaw)+.55*Math.cos(yaw);load.yaw=yaw-Math.PI/2;}
  return {...base,ground:.05,pose:{x:base.pose.x+dx,z:base.pose.z+dz,yaw:base.pose.yaw},load,kind,active:t>=start&&t<start+duration,visibleLoad:i?t>=(firstDispatch??Infinity):source.inventory.total>source.inventory.opening,phase:t<start?'Waiting for source handoff':t>=start+duration?'Handoff complete':i?base.phase:({Approach:'Return empty',Insert:'Withdraw empty','Take weight':'Release weight','Lift clear':'Place in buffer','Tilt back':'Level mast',Withdraw:'Approach buffer','Stop and change direction':'Stop and change direction','Carry low':'Carry low','Stop, level and raise':'Stop, lower and tilt','Approach placement':'Back clear','Place on support':'Lift clear','Release weight':'Take weight','Withdraw empty':'Insert','Lower empty forks':'Raise empty','Return empty':'Approach truck','Cycle complete':'Waiting at truck'})[base.phase],shutter:i?smooth((t-(firstDispatch??Infinity))/doorSeconds):1-smooth((t-(receiveStart+duration))/doorSeconds)};
 });
 return {time:t,sourceTime:source.time,trucks,loaders,receiveDepart,dispatchDepart,dispatchRequested,receivingComplete:complete,counters:{opening:source.inventory.opening,received:records.filter(e=>e.kind==='receive'&&e.time<=source.time).length-source.inventory.opening,dispatched:records.filter(e=>e.kind==='dispatch'&&e.time<=source.time).length},samples:{receive:loaders[0].active||t>=receiveEnd&&receiveEnd>0?1:0,dispatch:loaders[1].active||t>=dispatchEnd&&dispatchEnd>0?1:0}};
}
