import * as THREE from 'three';

// Draw repeated actor parts together; keep the original joints and contact geometry for inspection.
export function createActorBatches(scene,{cacheTransforms=false}={}){
 const roots=new Map(),groups=new Map(),owned=new WeakSet(),transforms=new Map(),scratch=new THREE.Matrix4(),world=new THREE.Matrix4();
 const geometryKey=g=>g.type+':'+JSON.stringify(g.parameters||{id:g.uuid});
 const materialKey=m=>[m.type,m.color?.getHexString(),m.roughness,m.metalness,m.side,m.transparent,m.opacity,m.map?.uuid].join(':');
 function groupFor(object){
  const key=geometryKey(object.geometry)+'|'+materialKey(object.material)+'|'+object.castShadow+'|'+object.receiveShadow;
  let group=groups.get(key);if(!group){group={geometry:object.geometry,material:object.material.clone(),items:[],mesh:null,capacity:0,castShadow:object.castShadow,receiveShadow:object.receiveShadow};groups.set(key,group);}return group;
 }
 function register(root){
  if(roots.has(root))return;
  const items=[],nodes=new Set();
  function manage(object){if(!cacheTransforms||object===scene||nodes.has(object))return;nodes.add(object);let record=transforms.get(object);if(!record){record={auto:object.matrixAutoUpdate,refs:0,values:new Float64Array(10).fill(NaN),parent:null};transforms.set(object,record);object.updateMatrix();object.matrixAutoUpdate=false;}record.refs++;}
  for(let parent=root.parent;parent&&parent!==scene;parent=parent.parent)manage(parent);
  root.traverse(object=>{manage(object);
   if(!object.isMesh||!object.visible||!object.material?.isMeshStandardMaterial||owned.has(object))return;
   owned.add(object);
   const group=groupFor(object),count=object.isInstancedMesh?object.count:1;
   for(let i=0;i<count;i++){const item={root,object,index:object.isInstancedMesh?i:null};group.items.push(item);items.push({group,item});}
   // A separate layer suppresses source rendering without changing visibility or contact transforms.
   object.layers.set(31);
  });roots.set(root,{items,nodes});
 }
 function unregister(root){const record=roots.get(root);if(!record)return;for(const {group,item} of record.items){group.items.splice(group.items.indexOf(item),1);owned.delete(item.object);}for(const object of record.nodes){const transform=transforms.get(object);if(--transform.refs===0){object.matrixAutoUpdate=transform.auto;transforms.delete(object);}}roots.delete(root);}
 function refresh(root){unregister(root);register(root);}
 function visible(root){for(let p=root;p;p=p.parent)if(!p.visible)return false;return true;}
 function update(){
  for(const [object,record]of transforms){const p=object.position,q=object.quaternion,s=object.scale,v=record.values;
   if(p.x!==v[0]||p.y!==v[1]||p.z!==v[2]||q.x!==v[3]||q.y!==v[4]||q.z!==v[5]||q.w!==v[6]||s.x!==v[7]||s.y!==v[8]||s.z!==v[9]||object.parent!==record.parent){
    v[0]=p.x;v[1]=p.y;v[2]=p.z;v[3]=q.x;v[4]=q.y;v[5]=q.z;v[6]=q.w;v[7]=s.x;v[8]=s.y;v[9]=s.z;record.parent=object.parent;object.updateMatrix();object.matrixWorldNeedsUpdate=true;
   }
  }
  scene.updateMatrixWorld();const visibility=new Map();
  for(const group of groups.values()){
   if(group.items.length>group.capacity){
    if(group.mesh){scene.remove(group.mesh);group.mesh.dispose();}
    group.capacity=Math.max(8,2**Math.ceil(Math.log2(group.items.length)));group.mesh=new THREE.InstancedMesh(group.geometry,group.material,group.capacity);group.mesh.name='actor-batch';group.mesh.matrixAutoUpdate=false;group.mesh.castShadow=group.castShadow;group.mesh.receiveShadow=group.receiveShadow;group.mesh.frustumCulled=false;group.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);scene.add(group.mesh);
   }
   if(!group.mesh)continue;let count=0;
   for(const {object,index} of group.items){if(!visibility.has(object))visibility.set(object,visible(object));if(!visibility.get(object))continue;world.copy(object.matrixWorld);if(index!==null){object.getMatrixAt(index,scratch);world.multiply(scratch);}group.mesh.setMatrixAt(count++,world);}
   group.mesh.count=count;group.mesh.visible=count>0;group.mesh.instanceMatrix.needsUpdate=true;
  }
 }
 return {register,refresh,unregister,update,stats:()=>({roots:roots.size,batches:groups.size,instances:[...groups.values()].reduce((n,g)=>n+(g.mesh?.count||0),0)}),dispose(){for(const group of groups.values()){if(group.mesh){scene.remove(group.mesh);group.mesh.dispose();}group.material.dispose();}for(const [object,record]of transforms)object.matrixAutoUpdate=record.auto;transforms.clear();groups.clear();roots.clear();}};
}
