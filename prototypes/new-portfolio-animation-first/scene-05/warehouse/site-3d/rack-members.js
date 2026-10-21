import {rackSpec as defaultRack} from './rack-motion.js';
export function rackMembers(spec=defaultRack){
 const r=spec;
 const members=[],add=(kind,x,y,z,w,h,d)=>members.push({kind,x,y,z,w,h,d});
 for(const x of [r.x,r.x+3.2,r.x+6.4])for(const z of [r.z,r.z+2.4,r.z+4.8]){
  add('upright',x,2.6,z,.12,5.2,.12);add('foot',x,.27,z,.28,.06,.28);
 }
 for(const y of [.55,2,3.45,4.9]){
  for(const z of [r.z,r.z+1.2,r.z+2.4,r.z+3.6,r.z+4.8])add('beam',r.x+3.2,y,z,6.4,.12,.14);
  for(const x of [r.x,r.x+3.2,r.x+6.4])add('rail',x,y,r.z+2.4,.12,.12,4.8);
 }
 return members;
}
