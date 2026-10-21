import * as THREE from 'three';

// Limb endpoints are solved in world space; the tool head remains on the engine bolt.
export function createMechanicRig(scene){
 const root=new THREE.Group();scene.add(root);const mats=new Map(),boxGeo=new THREE.BoxGeometry(1,1,1),sphere=new THREE.SphereGeometry(.15,10,8);
 const mat=c=>{if(!mats.has(c))mats.set(c,new THREE.MeshStandardMaterial({color:c,roughness:.85}));return mats.get(c);};
 function box(w,h,d,c,parent=root){const m=new THREE.Mesh(boxGeo,mat(c));m.scale.set(w,h,d);m.castShadow=true;parent.add(m);return m;}
 const torso=box(.36,.50,.42,'#ce8a42'),head=new THREE.Mesh(sphere,mat('#d6ba92'));head.castShadow=true;root.add(head);const hat=box(.36,.09,.36,'#e0dfca');
 const limbs=Array.from({length:8},()=>box(.105,1,.105,'#47637a')),feet=[box(.29,.12,.17,'#303d32'),box(.29,.12,.17,'#303d32')],tool=box(.035,.035,.24,'#bcc8c0');
 const up=new THREE.Vector3(0,1,0),v=(x,y,z)=>new THREE.Vector3(x,y,z);
 function segment(mesh,a,b){mesh.position.copy(a).add(b).multiplyScalar(.5);mesh.scale.y=a.distanceTo(b);mesh.quaternion.setFromUnitVectors(up,b.clone().sub(a).normalize());}
 function limb(index,a,b,length,bend){const delta=b.clone().sub(a),d=Math.min(delta.length(),2*length-.0001),mid=a.clone().addScaledVector(delta,.5),normal=bend.clone().addScaledVector(delta,-bend.dot(delta)/delta.lengthSq()).normalize();mid.addScaledVector(normal,Math.sqrt(Math.max(0,length*length-d*d/4)));segment(limbs[index],a,mid);segment(limbs[index+1],mid,b);}
 function apply(m,unit){
  root.visible=m.visible;if(!m.visible)return;root.position.set(m.pose.x,m.pose.y,m.pose.z);root.rotation.y=-m.pose.yaw;if(!root.matrixAutoUpdate)root.updateMatrix();root.updateMatrixWorld(true);
  const crouch=m.crouch||0;torso.position.set(0,1.13-.4*crouch,0);head.position.set(0,1.54-.4*crouch,0);hat.position.set(0,1.70-.4*crouch,0);
  const walking=m.walking,distance=m.walkDistance,stride=.60;
  for(let i=0;i<2;i++){
   let ankle=v(0,.13,i?.12:-.12);
   if(walking){
    const offset=i*.5,cycle=distance/stride+offset,n=Math.floor(cycle),q=cycle-n,plant=(n-offset+.30)*stride;
    let d=plant,lift=0;if(q>.6){const t=(q-.6)/.4;d=plant+stride*(t*t*(3-2*t));lift=Math.sin(Math.PI*t)*.09;}
    const fraction=Math.max(0,Math.min(1,d/(m.walkLength||1.874))),along=fraction;
    const c=Math.cos(unit.pose.yaw),s=Math.sin(unit.pose.yaw),x=m.walkStart?m.walkStart.x+(m.walkEnd.x-m.walkStart.x)*along:-3+1.85*along,z=m.walkStart?m.walkStart.z+(m.walkEnd.z-m.walkStart.z)*along:m.side*(1.25-.30*along)+(i?.12:-.12),footOffset=m.walkStart?(i?.12:-.12):0;
    const world=v(unit.pose.x+x*c-z*s-Math.sin(m.pose.yaw)*footOffset,unit.pose.y+.13+lift,unit.pose.z+x*s+z*c+Math.cos(m.pose.yaw)*footOffset);ankle=root.worldToLocal(world);
   }
   feet[i].position.set(ankle.x+.06,ankle.y-.07,ankle.z);limb(i*2,v(0,.89-.3*crouch,i?.12:-.12),ankle,.45,v(1,0,0));
  }
  const bolt=m.contactTarget?new THREE.Vector3(...m.contactTarget):new THREE.Vector3(-1.10,1.08,m.side*.44).applyAxisAngle(up,-unit.pose.yaw).add(new THREE.Vector3(unit.pose.x,unit.pose.y,unit.pose.z));
  const handle=bolt.clone().add(new THREE.Vector3(Math.sin(m.toolAngle)*.20,.20*Math.cos(m.toolAngle),0).applyAxisAngle(up,-unit.pose.yaw));
  const localBolt=root.worldToLocal(bolt.clone()),localHandle=root.worldToLocal(handle.clone());
  for(let i=0;i<2;i++){const shoulder=v(0,1.31-.4*crouch,i?.23:-.23),target=m.working?(i?localHandle:localBolt):v(.12,.91-.3*crouch,i?.27:-.27);limb(4+i*2,shoulder,target,.34,v(0,0,i?1:-1));}
  tool.visible=m.working;if(m.working){tool.position.copy(localBolt).add(localHandle).multiplyScalar(.5);tool.scale.z=localBolt.distanceTo(localHandle);tool.quaternion.setFromUnitVectors(v(0,0,1),localHandle.clone().sub(localBolt).normalize());}
  root.traverse(object=>{if(!object.matrixAutoUpdate)object.updateMatrix();});root.updateMatrixWorld(true);root.userData.feet=feet.map(f=>f.getWorldPosition(new THREE.Vector3()).toArray());root.userData.contact={bolt:bolt.toArray(),handle:handle.toArray(),working:m.working};root.userData.state=m;
 }
 root.userData.tool=tool;return {root,apply};
}
