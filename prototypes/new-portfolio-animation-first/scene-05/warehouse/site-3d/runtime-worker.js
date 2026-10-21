import {stepWarehouse,warehouseAction,assertWarehouse} from './physical-warehouse.js';

let mission=null,epoch=-1,ids=new WeakMap(),nextId=0,retained=new Set();
const fields=['dockExit','yieldRoute','itinerary','path','reservation','preparedDelivery','tripReservation','recoveryPath','returnPath','candidate','searchData'];
function publish(){
 const attachments=[],active=new Set();
 function physical(p){
  if(!p)return p;const copy={...p},refs={};
  for(const field of fields){const value=p[field];if(!value)continue;let id=ids.get(value);if(!id){id=++nextId;ids.set(value,id);}active.add(id);if(!retained.has(id))attachments.push({id,value});refs[field]=id;copy[field]=null;}
  copy.__runtimeRefs=refs;return copy;
 }
 const state={...mission,units:mission.units.map(u=>({...u,physical:physical(u.physical)})),physical:{...mission.physical,...(mission.physical.recovery?{recovery:physical(mission.physical.recovery)}:{})}};
 retained=active;return {state,attachments};
}
self.onmessage=({data:m})=>{
 if(m.epoch<epoch)return;
 try{
  let start=performance.now(),remainingCount=m.count||0;
  if(m.type==='reset'){epoch=m.epoch;mission=m.state;ids=new WeakMap();nextId=0;retained.clear();}
  else if(m.epoch!==epoch||!mission)throw Error('Simulation is not initialized.');
  else if(m.type==='step'){
   if(!Number.isInteger(m.count)||m.count<1||m.count>20000)throw Error('Invalid simulation step count.');
   let completed=0;
   for(let i=0;i<m.count;i++){
    if(m.drive)warehouseAction(mission,'move',m.drive,m.unit);stepWarehouse(mission);completed++;
    if(m.stream&&i<m.count-1&&(completed>=4||performance.now()-start>=12)){
     self.postMessage({id:m.id,epoch,...publish(),computeMs:performance.now()-start,count:completed,partial:true});
     remainingCount-=completed;completed=0;start=performance.now();
    }
   }
  }else if(m.type==='action')warehouseAction(mission,m.action,m.value,m.unit);
  else if(m.type==='verify')assertWarehouse(mission);
  else throw Error('Unknown simulation command.');
  const computeMs=performance.now()-start;self.postMessage({id:m.id,epoch,...publish(),computeMs,count:remainingCount});
 }catch(error){self.postMessage({id:m.id,epoch:m.epoch,error:error.message});}
};
