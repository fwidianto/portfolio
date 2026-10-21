import * as THREE from 'three';
import {rackMembers} from './rack-members.js';
export function createRack(scene,spec){
 const root=new THREE.Group(),members=(Array.isArray(spec)?spec:[spec]).flatMap(item=>rackMembers(item)),geometry=new THREE.BoxGeometry(1,1,1),materials={beam:new THREE.MeshStandardMaterial({color:'#b69254',roughness:.85}),upright:new THREE.MeshStandardMaterial({color:'#526f69',roughness:.85}),rail:new THREE.MeshStandardMaterial({color:'#6c8b76',roughness:.85}),foot:new THREE.MeshStandardMaterial({color:'#526f69',roughness:.85})};
 for(const kind of Object.keys(materials)){const items=members.filter(m=>m.kind===kind),mesh=new THREE.InstancedMesh(geometry,materials[kind],items.length),dummy=new THREE.Object3D();mesh.name='rack-'+kind;items.forEach((m,i)=>{dummy.position.set(m.x,m.y,m.z);dummy.scale.set(m.w,m.h,m.d);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);});mesh.castShadow=mesh.receiveShadow=true;root.add(mesh);}
 scene.add(root);return {root,members};
}
