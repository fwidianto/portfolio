import {obstaclesFor,freePose,envelope} from './physical-space.js';
import {boxesOverlap} from './physical-reservations.js';
export const recoverySpec=Object.freeze({rear:.8,front:1.1,halfWidth:.55,bar:.9,unitHook:2.05,home:{x:16.6,z:12,yaw:Math.PI/2}});
export function recoveryBox(pose){const polygon=envelope(pose,recoverySpec);return {polygon,x0:Math.min(...polygon.map(p=>p.x)),x1:Math.max(...polygon.map(p=>p.x)),z0:Math.min(...polygon.map(p=>p.z)),z1:Math.max(...polygon.map(p=>p.z))};}
export function coupledTugPose(p){const distance=recoverySpec.unitHook+recoverySpec.bar+recoverySpec.rear;return {x:p.x-distance*Math.cos(p.yaw),z:p.z-distance*Math.sin(p.yaw),yaw:p.yaw+Math.PI,k:0,speed:p.speed,roll:[0,0,0,0]};}
export const drawbarShape={rear:recoverySpec.bar/2+.03,front:recoverySpec.bar/2+.03,halfWidth:.12};
export function drawbarPose(p){const d=recoverySpec.unitHook+recoverySpec.bar/2;return {x:p.x-d*Math.cos(p.yaw),z:p.z-d*Math.sin(p.yaw),yaw:p.yaw};}
export function corridor(u,side,station=-1.95){
 const p=u.physical.pose,c=Math.cos(p.yaw),s=Math.sin(p.yaw),ps=[[station-.45,side*.65],[station+.45,side*.65],[station+.45,side*1.25],[station-.45,side*1.25]].map(([x,z])=>({x:p.x+x*c-z*s,z:p.z+x*s+z*c}));
 return {x0:Math.min(...ps.map(p=>p.x)),x1:Math.max(...ps.map(p=>p.x)),z0:Math.min(...ps.map(p=>p.z)),z1:Math.max(...ps.map(p=>p.z)),polygon:ps};
}
export function crewObstacles(s,except){return s.events.filter(e=>e.unit!==except&&e.kind!=='recovery'&&e.status==='in-progress').flatMap(e=>{const u=s.units.find(u=>u.id===e.unit),slots=e.physicalSlots||(e.physicalSides||[-1,1]).map(side=>({side,station:-1.95}));return slots.map(slot=>corridor(u,slot.side,slot.station));});}
export function workSlots(s,event,u,{pose=u.physical.pose,reservations=true,ignoreTug=false}={}){
 const blocked=[...obstaclesFor(s.physical.ports,s.units.filter(v=>v.id!==u.id).map(v=>v.physical.pose),new Set(s.spots.filter(p=>p.pallet).map(p=>p.id))),...crewObstacles(s,u.id)];
 if(!ignoreTug&&s.physical.recovery)blocked.push(recoveryBox(s.physical.recovery.pose));
 const candidates=[-1,1].map(side=>({side,station:-1.95}));
 if(!u.load&&!u.physical.recovery?.load&&u.physical.fork<=.3)candidates.push(...[-1,1].map(side=>({side,station:-.65})));
 const c=Math.cos(pose.yaw),sn=Math.sin(pose.yaw),slots=candidates.filter(({side,station})=>freePose({x:pose.x+station*c-side*.95*sn,z:pose.z+station*sn+side*.95*c,yaw:pose.yaw},blocked,{rear:.45,front:.45,halfWidth:.3}));
 if(!reservations)return slots;
 return slots.filter(slot=>!s.units.some(v=>v.id!==u.id&&v.physical.reservation?.some((box,i)=>i>=(v.physical.reservationFrom||0)&&boxesOverlap(corridor({physical:{pose}},slot.side,slot.station),box))));
}
export function workSides(s,event,u,options){return workSlots(s,event,u,options).map(slot=>slot.side);}
