import * as THREE from 'three';
import {rigSpec} from './handling-motion.js';

export function createHandlingRig(scene,{color='#d5aa47',maintenance=false}={}){
 const root=new THREE.Group(),mast=new THREE.Group(),carriage=new THREE.Group(),pallet=new THREE.Group(),platform=new THREE.Group(),wheels=[],materials=new Map(),boxGeometry=new THREE.BoxGeometry(1,1,1);scene.add(root,pallet,platform);
 const material=color=>{if(!materials.has(color))materials.set(color,new THREE.MeshStandardMaterial({color,roughness:.75}));return materials.get(color);};
 function box(parent,x,y,z,w,h,d,color){const m=new THREE.Mesh(boxGeometry,material(color));m.position.set(x,y,z);m.scale.set(w,h,d);m.castShadow=m.receiveShadow=true;parent.add(m);return m;}
 box(root,-1,.67,0,2.15,.64,1.08,color);let hood=null;
 if(maintenance){hood=new THREE.Group();hood.position.set(-1.425,.845,0);root.add(hood);box(hood,-.325,.175,0,.65,.35,1.08,color);box(root,-1.75,1.02,0,.48,.12,.72,'#344a3e');box(root,-2.04,.65,0,.08,.12,.22,'#bcc8c0');for(const side of [-1,1]){box(root,-1.75,1.08,side*.4,.06,.035,.08,'#a6b4a2');box(root,-.45,.78,side*.55,.06,.035,.08,'#a6b4a2');}}
 else box(root,-1.75,1.02,0,.65,.35,1.08,color);
 box(root,-.75,1.12,0,.52,.22,.58,'#344a3e');box(root,-.95,1.41,0,.15,.42,.58,'#344a3e');
 for(const x of [-1.35,-.09])for(const z of [-.49,.49])box(root,x,1.69,z,.055,1.37,.055,'#3f5547');box(root,-.71,2.405,0,1.48,.07,1.14,'#617563');
 // Moving joints remain independent meshes; wheel pivots are the real axle/track anchors.
 const tireGeometries=[rigSpec.frontRadius,rigSpec.rearRadius].map(r=>new THREE.CylinderGeometry(r,r,.18,24));
 for(let i=0;i<4;i++){const rear=i>=2,r=rear?rigSpec.rearRadius:rigSpec.frontRadius,z=(i%2?1:-1)*rigSpec.track/2,pivot=new THREE.Group(),spin=new THREE.Group(),tire=new THREE.Mesh(tireGeometries[rear?1:0],material('#26382f'));pivot.position.set(rear?-rigSpec.wheelbase:0,r,z);root.add(pivot);pivot.add(spin);spin.add(tire);tire.rotation.x=Math.PI/2;tire.castShadow=true;for(const a of [0,Math.PI/2]){const mark=box(spin,0,0,z<0?-.095:.095,.07,r*1.4,.012,'#a6b4a2');mark.rotation.z=a;}wheels.push({pivot,spin});}
 mast.position.set(rigSpec.mastX,rigSpec.mastY,0);root.add(mast);
 for(const z of [-.42,.42]){box(mast,0,1.15,z,.12,2.3,.09,'#455c4a');box(mast,.02,1.15,z*.72,.04,2.15,.025,'#a6b3a5');}box(mast,0,2.28,0,.13,.1,.95,'#455c4a');
 mast.add(carriage);carriage.position.x=rigSpec.heelX;box(carriage,-.05,.28,0,.12,.6,.95,'#677e6c');for(const z of [-.23,.23])box(carriage,rigSpec.forkLength/2,rigSpec.forkThickness/2,z,rigSpec.forkLength,rigSpec.forkThickness,.13,'#a3b1a0');
 for(const z of [-.43,0,.43]){box(pallet,0,.0175,z,1.2,.035,.12,'#8b6b43');for(const x of [-.5,0,.5])box(pallet,x,.075,z,.15,.08,.12,'#ac8957');}for(let i=0;i<7;i++)box(pallet,-.51+i*.17,.1325,0,.15,.035,1,'#b49a69');
 for(const x of [-.3,.3])for(const z of [-.23,.23])box(pallet,x,.47,z,.55,.64,.44,'#bb8d54');box(pallet,0,.81,0,1.1,.04,.94,'#c7a679');
 platform.position.set(11.2,rigSpec.ground,25);box(platform,0,.76,0,1.8,.08,1.2,'#668b8a');for(const x of [-.74,.74])for(const z of [-.46,.46])box(platform,x,.36,z,.09,.72,.09,'#45655f');
 function apply(frame,support=null){const ground=frame.ground??rigSpec.ground;root.position.set(frame.pose.x,ground+rigSpec.rootClearance,frame.pose.z);root.rotation.y=-frame.pose.yaw;mast.rotation.z=frame.tilt;carriage.position.y=frame.carriage;wheels.forEach((w,i)=>{w.pivot.rotation.y=-frame.steering[i];w.spin.rotation.z=frame.spin[i];});
  if(frame.load.owner==='forks'){if(pallet.parent!==carriage)carriage.add(pallet);pallet.position.set(frame.load.localX??rigSpec.forkLength/2,rigSpec.forkThickness-rigSpec.pocketTop,0);pallet.rotation.set(0,0,0);}else if(support){if(pallet.parent!==support) support.add(pallet);pallet.position.set(frame.load.truckLocalX??-1.4,.895,.55);pallet.rotation.set(0,Math.PI/2,0);}else{if(pallet.parent!==scene)scene.add(pallet);pallet.position.set(frame.load.x,ground+frame.load.bottom,frame.load.z);pallet.rotation.set(0,-frame.load.yaw,0);}pallet.userData.owner=frame.load.owner;
 }
 // Static pieces are batched within each joint, preserving the approved articulation.
 for(const parent of [root,mast,carriage,pallet,platform,...(hood?[hood]:[]),...wheels.map(w=>w.spin)]){const groups=new Map();for(const child of parent.children)if(child.isMesh&&child.geometry===boxGeometry){child.updateMatrix();if(!groups.has(child.material))groups.set(child.material,[]);groups.get(child.material).push(child.matrix.clone());child.visible=false;}for(const [mat,matrices] of groups){const batch=new THREE.InstancedMesh(boxGeometry,mat,matrices.length);matrices.forEach((matrix,i)=>batch.setMatrixAt(i,matrix));batch.castShadow=batch.receiveShadow=true;parent.add(batch);}}
 return {root,mast,carriage,pallet,platform,wheels,hood,apply};
}
