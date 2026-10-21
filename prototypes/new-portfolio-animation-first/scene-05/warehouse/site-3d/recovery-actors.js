import * as THREE from 'three';
import {createMechanicRig} from './mechanic-rig.js';
import {recoverySpec} from './physical-access.js';
export function bindRecovery(scene,{onRoot=()=>{}}={}){
 let rig=null;
 function create(){
  const root=new THREE.Group(),bar=new THREE.Group(),geo=new THREE.BoxGeometry(1,1,1),mats=new Map(),wheels=[];scene.add(root,bar);
  function box(parent,x,y,z,w,h,d,color){if(!mats.has(color))mats.set(color,new THREE.MeshStandardMaterial({color,roughness:.7,metalness:.12}));const mesh=new THREE.Mesh(geo,mats.get(color));mesh.position.set(x,y,z);mesh.scale.set(w,h,d);mesh.castShadow=mesh.receiveShadow=true;parent.add(mesh);return mesh;}
  box(root,.1,.42,0,1.7,.45,1,'#cb8749');box(root,-.4,.76,0,.55,.3,.9,'#d5aa47');box(root,.45,.9,0,.35,.5,.8,'#43626b');box(root,.45,1.25,0,.5,.1,.95,'#c4c2a8');
  const tire=new THREE.CylinderGeometry(.2,.2,.16,16),tireMat=new THREE.MeshStandardMaterial({color:'#26382f',roughness:.9});
  for(let i=0;i<4;i++){const pivot=new THREE.Group(),spin=new THREE.Group(),mesh=new THREE.Mesh(tire,tireMat);pivot.position.set(i<2?0:.9,.2,i%2?.42:-.42);root.add(pivot);pivot.add(spin);spin.add(mesh);mesh.rotation.x=Math.PI/2;mesh.castShadow=true;box(spin,0,0,i%2?.085:-.085,.055,.28,.018,'#bcc8c0');wheels.push({pivot,spin});}
  const beam=box(bar,0,0,0,recoverySpec.bar,.075,.10,'#bcc8c0');box(bar,0,.07,0,.10,.15,.13,'#d5aa47');const technician=createMechanicRig(scene);technician.root.name='recovery-technician';onRoot(root);onRoot(bar);onRoot(technician.root);return {root,bar,beam,wheels,technician};
 }
 function apply(frame){
  const r=frame.physical?.recovery;if(!r){if(rig){rig.root.visible=false;rig.bar.visible=false;rig.technician.root.visible=false;}return;}
  rig||=create();rig.root.visible=true;rig.root.position.set(r.pose.x,.245,r.pose.z);rig.root.rotation.y=-r.pose.yaw;
  rig.wheels.forEach((w,i)=>{w.pivot.rotation.y=i<2?0:-Math.atan2(.9*r.pose.k,1-(i%2?.42:-.42)*r.pose.k);w.spin.rotation.z=-r.pose.roll[i]/.2;});
  const unit=frame.units.find(u=>u.id===r.unit),p=unit?.physical.pose,connect=r.phase==='connect',disconnect=r.phase==='disconnect';rig.bar.visible=!!p&&(r.connected||connect||disconnect);rig.technician.root.visible=false;
  if(p){const c=Math.cos(p.yaw),s=Math.sin(p.yaw);rig.bar.position.set(p.x-2.5*c,.895,p.z-2.5*s);rig.bar.rotation.y=-p.yaw;rig.bar.scale.x=connect?Math.min(1,r.clock/1.5):disconnect?Math.max(0,1-(r.clock-1)/1):1;
   if(connect||disconnect){const T=connect?4:2,q=Math.min(1,r.clock/T),engage=q<.3?q/.3:q>.7?(1-q)/.3:1,x=-3.4+.8*engage,z=.8-.3*engage,m={visible:true,pose:{x:p.x+x*c-z*s,y:.245,z:p.z+x*s+z*c,yaw:p.yaw-Math.PI/2},walking:engage>0&&engage<1,walkDistance:.8544*engage,walkLength:.8544,walkStart:{x:-3.4,z:.8},walkEnd:{x:-2.6,z:.5},working:q>=.3&&q<=.7,side:1,toolAngle:.08*Math.sin(frame.time*4),contactTarget:[p.x-2.5*c,1.04,p.z-2.5*s],crouch:engage};rig.technician.apply(m,{pose:{x:p.x,y:.245,z:p.z,yaw:p.yaw}});rig.technician.root.userData.mechanic=r.mechanic;}
  }
 }
 return {apply,get rig(){return rig;}};
}
