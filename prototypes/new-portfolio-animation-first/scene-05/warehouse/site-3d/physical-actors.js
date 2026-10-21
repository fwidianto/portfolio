import {polishMaterials} from './presentation.js';
import * as THREE from 'three';
import {createHandlingRig} from './forklift-rig.js';
import {createMechanicRig} from './mechanic-rig.js';
export function bindPhysicalActors(scene,built,{onRoot=()=>{},onRefresh=()=>{}}={}){
 built.referenceVehicles.slice(2).forEach(o=>o.visible=false);
 const units=new Map(),pallets=new Map(),crew=new Map(),freePallets=[];let template=null;
 const ringMaterial=new THREE.MeshBasicMaterial({color:'#e9bd65',side:THREE.DoubleSide}),ringGeometry=new THREE.RingGeometry(.9,1.03,32);
 function apply(frame){
  const live=new Set(frame.inventory.locations.map(p=>p.id));for(const [id,mesh] of pallets)if(!live.has(id)){mesh.visible=false;mesh.removeFromParent();pallets.delete(id);freePallets.push(mesh);}
  for(const u of frame.units){
   let r=units.get(u.id);if(!r){r=createHandlingRig(scene,{color:{'FG-25':'#d5aa47','FB-20':'#5f9d97','FD-25':'#cb8749'}[u.model],maintenance:true});scene.remove(r.pallet,r.platform);polishMaterials(r.root);polishMaterials(r.pallet);template||=r.pallet;const halo=new THREE.Mesh(ringGeometry,ringMaterial);halo.rotation.x=-Math.PI/2;halo.position.set(-.65,.015,0);r.root.add(halo);r.halo=halo;r.root.name=u.id;units.set(u.id,r);onRoot(r.root);}
   if(r.state&&r.state.model!==u.model){const colors={'FG-25':'d5aa47','FB-20':'5f9d97','FD-25':'cb8749'},old=colors[r.state.model];r.root.traverse(o=>{if(o.material?.color?.getHexString()===old)o.material.color.set('#'+colors[u.model]);});onRefresh(r.root);}
   const p=u.physical,pose=p.pose;r.root.position.set(pose.x,.245,pose.z);r.root.rotation.y=-pose.yaw;r.mast.rotation.z=p.tilt;r.carriage.position.y=p.fork-.225;
   r.wheels.forEach((w,i)=>{const steer=i<2?0:Math.atan2(-1.6*pose.k,1-(i%2?.53:-.53)*pose.k);w.pivot.rotation.y=-steer;w.spin.rotation.z=-pose.roll[i]/(i<2?.36:.29);});
   r.halo.visible=frame.activityUnit?frame.activityUnit===u.id:u.selected;r.hood.rotation.z=-1.15*Math.max(0,...frame.mechanics.filter(m=>m.visible&&m.unit===u.id).map(m=>m.hood||0));r.state=u;
  }
  for(const [id,r]of units)r.root.visible=frame.units.some(u=>u.id===id);
  for(const p of frame.inventory.locations){
   if(p.location==='offsite'||p.location==='dispatched'){if(pallets.has(p.id))pallets.get(p.id).visible=false;continue;}
   let mesh=pallets.get(p.id);if(!mesh){mesh=freePallets.pop()||template.clone(true);mesh.name=p.id;mesh.userData={pallet:p.id};pallets.set(p.id,mesh);onRoot(mesh);}mesh.visible=true;
   if(p.location.startsWith('unit:')){const r=units.get(p.location.slice(5));if(mesh.parent!==r.carriage)r.carriage.add(mesh);mesh.position.set(.7,-.065,0);mesh.rotation.set(0,0,0);}
   else{const port=frame.physical.ports[p.location];if(mesh.parent!==scene)scene.add(mesh);mesh.position.set(port.x,port.support,port.z);mesh.rotation.set(0,-port.yaw,0);}
   mesh.userData.location=p.location;
  }
  for(const m of frame.mechanics){let r=crew.get(m.id);if(!r&&m.visible){r=createMechanicRig(scene);polishMaterials(r.root);r.root.name=m.id;crew.set(m.id,r);onRoot(r.root);}if(r){const u=frame.units.find(u=>u.id===m.unit);if(u)r.apply(m,u);else r.root.visible=false;}}
  for(const [id,r]of crew)if(!frame.mechanics.some(m=>m.id===id))r.root.visible=false;
 }
 return {apply,unit:id=>units.get(id)?.root,rig:id=>units.get(id),pallet:id=>pallets.get(id),state:()=>({units:[...units.values()].map(r=>({id:r.root.name,model:r.state.model,position:[r.state.pose.x,r.state.pose.y,r.state.pose.z],front:r.root.position.toArray(),yaw:-r.root.rotation.y,load:r.state.load,loadVisible:!!r.state.load&&pallets.get(r.state.load)?.visible,region:r.state.region})),mechanics:[...crew.values()].filter(r=>r.root.visible).map(r=>({id:r.root.name,event:r.root.userData.state.event,unit:r.root.userData.state.unit,position:r.root.position.toArray()})),pallets:[...pallets.values()].filter(p=>p.visible).map(p=>({id:p.name,location:p.userData.location}))})};
}
