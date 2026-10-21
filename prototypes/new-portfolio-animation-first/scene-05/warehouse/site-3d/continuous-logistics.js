import {handlingFrame,shiftedHandlingRoute} from './handling-motion.js';
import {arrival,exits,roadDistance} from './road-path.js';
import {receiveArrival,dockRoadSeconds} from './dock-operations.js';
import {docks} from '../layout/site-layout.js';
const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);},slots=[-1.95,-.65],motions=slots.map(x=>shiftedHandlingRoute(-x-1.4));
function vehicle(kind,t,r){
 const receive=kind==='receiving',path=receive?receiveArrival:arrival,start=receive?r.start:r.dispatchArrival,docked=receive?r.receiveDock:r.dispatchDock,depart=(receive?r.receiveDepart:r.dispatchDepart)??Infinity;
 let phase=t<docked?'arriving':t<depart?'docked':'departing',p;
 if(phase==='arriving')p=path.at(roadDistance(t-start,dockRoadSeconds(path),path.length));else if(phase==='departing')p=exits[kind].at(roadDistance(t-depart,dockRoadSeconds(exits[kind]),exits[kind].length));else p={...docks[kind],curvature:0,roll:[0,0,0,0]};
 const offset=receive&&r.id===0?[0,0,0,0]:path.at(path.length).roll,roll=phase==='arriving'?p.roll:phase==='docked'?offset:p.roll.map((v,i)=>v+offset[i]);
 return {kind,round:r.id,pose:{x:p.x,z:p.y,yaw:p.yaw},phase,visible:t>=start&&t<depart+dockRoadSeconds(exits[kind]),ground:.05,door:phase==='docked'?Math.min(smooth((t-docked-.7)/1.5),1-smooth((t-(depart-2.5))/1.5)):0,restraint:phase==='docked'?Math.min(smooth((t-docked)/.7),1-smooth((t-(depart-.8))/.7)):0,chocked:phase==='docked'&&t>=docked+.7&&t<=depart-.8,roll,steering:[-.99,.99,-.99,.99].map((side,i)=>i<2?0:Math.atan2(3.7*p.curvature,1-p.curvature*side)),waiting:!Number.isFinite(depart)};
}
function loader(kind,t,r,truck){
 const receive=kind==='receive',start=(receive?r.receiveStart:r.dispatchStart)??Infinity,index=t>=start+28?1:0,slotStart=start+index*30,age=Math.max(0,Math.min(28,t-slotStart)),motion=motions[index],dock=docks[receive?'receiving':'dispatch'],dx=dock.x+1.4-11.2,dz=20.8,base=handlingFrame(receive?28-age:age,{carry:motion.length+.2,place:motion.length+1.85,retreat:motion.length+.1,height:.9,motion});
 function cargo(slot){
  const S=start+slot*30,id='DOCK-'+kind.toUpperCase()+'-'+r.id+'-'+slot,localX=slots[slot],active=slot===index;
  let owner,visible=true,x=dock.x-.8,z=36.8,bottom=0,yaw=Math.PI;
  if(active&&t>=S&&t<=S+28){owner=base.load.owner==='platform'?'truck':base.load.owner==='floor'?'buffer':'forks';x=base.load.x+dx;z=base.load.z+dz;bottom=base.load.bottom;yaw=base.load.yaw;}
  else owner=receive?(t<S?'truck':'buffer'):(t<S?'buffer':'truck');
  let belt=receive?smooth((t-(S+26.5))/4):smooth((t-(S-4))/4);
  if(owner==='buffer'){
   if(receive){belt=smooth((t-(S+26.5))/4);z=36.8-.8*belt;visible=t>=S+23.6&&t<S+30.5;}
   else{belt=smooth((t-(S-4))/4);z=36+.8*belt;visible=t>=S-4;}
   x=dock.x-.8;bottom=0;yaw=Math.PI;
  }
  if(owner==='truck'){const c=Math.cos(truck.pose.yaw),s=Math.sin(truck.pose.yaw);x=truck.pose.x+localX*c-.55*s;z=truck.pose.z+localX*s+.55*c;bottom=.9;yaw=truck.pose.yaw-Math.PI/2;visible=truck.visible;}
  return {id,owner,x,z,bottom,yaw,truckLocalX:localX,visible,active,belt};
 }
 const cargoes=slots.map((_,i)=>cargo(i)),load=cargoes[index],inCycle=t>=slotStart&&t<slotStart+28,reversePhase={Approach:'Withdraw empty','Align forks':'Clear the pallet',Insert:'Withdraw empty','Take weight':'Set down on support','Lift clear':'Lower onto support','Tilt back':'Level the pallet',Withdraw:'Approach the handoff','Stop and change direction':'Stop and change direction','Carry low':'Carry low','Stop, level and raise':'Lower for travel','Approach placement':'Withdraw from truck','Place on support':'Lift clear of deck','Release weight':'Take the pallet weight','Withdraw empty':'Insert into truck pallet','Lower empty forks':'Raise to truck deck','Return empty':'Approach truck','Cycle complete':'Ready'},step=receive?(reversePhase[base.phase]||base.phase):base.phase==='Place on support'?'Set down on truck deck':base.phase;
 const shutter=receive?smooth((t-(slotStart+18))/1.5)*(1-smooth((t-(slotStart+26.5))/1.5)):smooth((t-(slotStart-4))/1.5)*(1-smooth((t-(slotStart+8))/1.5));
 return {...base,kind,ground:.05,pose:{x:base.pose.x+dx,z:base.pose.z+dz,yaw:base.pose.yaw},load,cargoes,visibleLoad:load.visible,active:inCycle,shutter,phase:!Number.isFinite(start)?'Waiting for source handoff':inCycle?(receive?'Unload ':'Load ')+(index+1)+' / 2 · '+step:t<slotStart?'Covered handoff · prepare next pallet':'Two pallets handled · lane clears',belt:cargoes.reduce((a,c)=>a+c.belt,0)};
}
export function continuousLogisticsFrame(source,t){
 const fallback={id:0,start:0,receiveDock:0,dispatchArrival:0,dispatchDock:dockRoadSeconds(arrival),receiveStart:null,receiveDepart:null,dispatchStart:null,dispatchDepart:null,exitEnd:null},round=(source.dockRounds||[]).filter(r=>r.start!==null&&r.start<=t).at(-1)||fallback,trucks=[vehicle('receiving',t,round),vehicle('dispatch',t,round)],loaders=[loader('receive',t,round,trucks[0]),loader('dispatch',t,round,trucks[1])];
 return {time:t,sourceTime:source.time,trucks,loaders,receiveDepart:round.receiveDepart??Infinity,dispatchDepart:round.dispatchDepart??Infinity,receivingComplete:round.receiveDepart!==null&&t>=round.receiveDepart,counters:{opening:source.inventory.opening,received:source.inventory.laterReceived,dispatched:source.inventory.dispatched},samples:{receive:round.receiveStart===null?0:[0,1].filter(i=>t>=round.receiveStart+i*30+28).length,dispatch:round.dispatchStart===null?0:[0,1].filter(i=>t>=round.dispatchStart+i*30+28).length}};
}
