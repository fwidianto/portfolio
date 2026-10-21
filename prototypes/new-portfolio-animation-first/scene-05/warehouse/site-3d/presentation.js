import * as THREE from 'three';

const treated=new WeakSet(),palette={
 '98a496':'a8aca8','bac1aa':'b8bbb3','b9b9a0':'b8b9b1','c4c2a8':'d0d3cf',
 '8a987a':'7a8574','59635b':'525d62','aaac86':'a6aca3',
 '526f69':'43626b','6c8b76':'597278','b69254':'b98b45','26382f':'252c2c'
};
const wood=new Set(['8b6b43','ac8957','b49a69','bb8d54','c7a679']),steel=new Set(['a3b1a0','a6b3a5','bcc8c0','a6b4a2']),paint=new Set(['d5aa47','5f9d97','cb8749']);
// Presentation only: keep model paint IDs and every geometry/contact anchor intact.
export function polishMaterials(root){
 root.traverse(object=>{
  for(const material of Array.isArray(object.material)?object.material:[object.material]){
   if(!material?.isMeshStandardMaterial||treated.has(material))continue;
   treated.add(material);const color=material.color.getHexString();
   if(palette[color])material.color.set('#'+palette[color]);
   material.roughness=wood.has(color)?.94:steel.has(color)?.45:paint.has(color)?.62:.88;
   material.metalness=steel.has(color)?.28:paint.has(color)?.12:0;
  }
 });
}

export function createPresentation(scene,renderer){
 scene.background=new THREE.Color('#7c8986');scene.fog=new THREE.Fog('#7c8986',230,450);
 renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
 renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFShadowMap;renderer.shadowMap.autoUpdate=false;
 scene.add(new THREE.HemisphereLight('#e3edf5','#5b6261',1.7));
 const sun=new THREE.DirectionalLight('#fff3df',2.7),offset=new THREE.Vector3(-65,100,-35),centre=new THREE.Vector3(42,0,39),right=new THREE.Vector3(0,1,0).cross(offset).normalize(),up=offset.clone().normalize().cross(right).normalize();
 sun.position.copy(centre).add(offset);sun.target.position.copy(centre);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);
 sun.shadow.normalBias=.012;sun.shadow.bias=-.000015;sun.shadow.radius=1;
 Object.assign(sun.shadow.camera,{left:-95,right:95,top:95,bottom:-95,near:1,far:240});scene.add(sun,sun.target);
 let lastX=NaN,lastZ=NaN,lastRadius=NaN;
 return {sun,update(camera,target){
  const distance=camera.position.distanceTo(target),vertical=camera.isOrthographicCamera?(camera.top-camera.bottom)/camera.zoom:2*distance*Math.tan(THREE.MathUtils.degToRad(camera.fov/2)),aspect=renderer.domElement.width/renderer.domElement.height;
  const elevation=Math.max(.25,Math.abs(camera.position.y-target.y)/Math.max(.001,distance)),radius=Math.ceil(Math.min(95,Math.max(10,Math.max(vertical,vertical*aspect)/(2*elevation)+8))*4)/4;
  if(Math.abs(target.x-lastX)<.01&&Math.abs(target.z-lastZ)<.01&&Math.abs(radius-lastRadius)<.01)return;
  lastX=target.x;lastZ=target.z;lastRadius=radius;centre.set(target.x,0,target.z);
  // A11 live-view profiling found the same 2048px overdraw penalty in wide views; retain one 1024px map.
  const resolution=1024;
  sun.shadow.normalBias=radius>32?.024:.012;sun.shadow.bias=radius>32?-.00003:-.000015;
  // Snap the shadow projection to its texels so small camera moves do not crawl over fixed racks.
  const texel=2*radius/resolution,x=centre.dot(right),y=centre.dot(up);centre.addScaledVector(right,Math.round(x/texel)*texel-x).addScaledVector(up,Math.round(y/texel)*texel-y);
  sun.position.copy(centre).add(offset);sun.target.position.copy(centre);
  Object.assign(sun.shadow.camera,{left:-radius,right:radius,top:radius,bottom:-radius});sun.shadow.camera.updateProjectionMatrix();renderer.shadowMap.needsUpdate=true;
 }};
}
