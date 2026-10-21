// Development import-map adapter; the default public controller still uses the native model.
import * as core from '../../warehouse-model.js?native=1';
import {CONTINUOUS_PALLETS} from './continuous-operations.js';
import {initializePhysical,physicalOperations,physicalAction} from './physical-driver.js';
import {freePose,envelope,rectanglesOverlap,obstaclesFor} from './physical-space.js';
import {recoverySpec,recoveryBox,drawbarPose,drawbarShape} from './physical-access.js';
export * from '../../warehouse-model.js?native=1';
export const createWarehouse=(scenario,config)=>initializePhysical(core.createWarehouse(scenario,config?.continuous?{pallets:CONTINUOUS_PALLETS,...config}:config));
export const stepWarehouse=(s,count=1)=>core.stepWarehouse(s,count,physicalOperations);
export function warehouseAction(s,type,value,index=0){
 if(type==='move'||type==='handle'){const applied=physicalAction(s,type,value,index);if(applied)s.actions.push({tick:s.tick,type,value,unit:index});return applied;}
 const applied=core.warehouseAction(s,type,value,index);
 if(applied&&type==='control')for(const u of s.units)if(u.mode==='auto'){u.physical.manualRequest=null;u.physical.manualHandle=false;u.physical.forceHandle=false;}
 return applied;
}
export const exits=u=>u.physical?[{x:u.x+1,y:u.y},{x:u.x-1,y:u.y},{x:u.x,y:u.y+1},{x:u.x,y:u.y-1}]:core.exits(u);
export function assertWarehouse(s){
 core.assertWarehouse(s,{physicalOccupancy:true});
 const zones=s.units.map(u=>u.workZone).filter(Boolean);if(new Set(zones).size!==zones.length)throw Error('Conflicting rack approach ownership.');
 for(let i=0;i<s.units.length;i++)for(const other of s.units.slice(i+1))if(rectanglesOverlap(envelope(s.units[i].physical.pose),envelope(other.physical.pose)))throw new Error('Physical vehicle overlap: '+s.units[i].id+' / '+other.id);
 const staticObstacles=obstaclesFor(s.physical.ports,[],new Set(s.spots.filter(p=>p.pallet).map(p=>p.id)));
 for(const u of s.units){const p=u.physical;if(p.phase==='handling'||p.phase.startsWith('recovery-')){
   if(!freePose(p.pose,staticObstacles,{rear:2.1,front:.39,halfWidth:.65}))throw new Error('Chassis crossed rack during handling: '+u.id);
  }else if(!freePose(p.pose,staticObstacles))throw new Error('Vehicle crossed static geometry: '+u.id);
  if(p.phase.startsWith('recovery-')){const clear=obstaclesFor(s.physical.ports,[],new Set(s.spots.filter(slot=>slot.pallet&&slot.id!==p.recovery?.port).map(slot=>slot.id)));if(!freePose(p.pose,clear))throw Error('Recovered forks crossed static geometry: '+u.id);}
 }
 const recovery=s.physical.recovery;if(recovery){if(!freePose(recovery.pose,staticObstacles,recoverySpec))throw Error('Recovery tractor crossed static geometry.');for(const u of s.units)if(rectanglesOverlap(recoveryBox(recovery.pose).polygon,envelope(u.physical.pose)))throw Error('Recovery tractor overlapped '+u.id);if(recovery.connected){const u=s.units.find(u=>u.id===recovery.unit);if(!freePose(drawbarPose(u.physical.pose),staticObstacles,drawbarShape))throw Error('Recovery drawbar crossed static geometry.');}}
 return true;
}
