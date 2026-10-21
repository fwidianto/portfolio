import * as THREE from 'three';
import {site,buildings,docks,bays,truckRoad,points,pose,rectangle,footprint} from '../layout/site-layout.js';
import {road} from './road-path.js';
import {parking,trafficLanes} from './physical-space.js';

export function buildSite(scene,{workshopCutaway=false,rackStudy=false,physicalRacks=false}={}){
 const materials=new Map(),flatBatches=new Map(),wheelGeometries=new Map(),unitBox=new THREE.BoxGeometry(1,1,1),roofs=new THREE.Group(),dimensions=new THREE.Group(),footprints={},groups={},scale=1;
 const material=color=>{if(!materials.has(color))materials.set(color,new THREE.MeshStandardMaterial({color,roughness:.84,metalness:.06}));return materials.get(color);};
 function box(parent,x,y,z,w,h,d,color,name=''){const n=new THREE.Mesh(unitBox,material(color));n.position.set(x,y,z);n.scale.set(w,h,d);n.castShadow=true;n.receiveShadow=true;n.name=name;n.userData.staticBox=true;parent.add(n);return n;}
 function addFlat(vertices,color){if(!flatBatches.has(color))flatBatches.set(color,[]);const target=flatBatches.get(color);for(let i=0;i<vertices.length;i+=9){const area=(vertices[i+3]-vertices[i])*(vertices[i+8]-vertices[i+2])-(vertices[i+5]-vertices[i+2])*(vertices[i+6]-vertices[i]);if(Math.abs(area)<1e-10)continue;for(const j of area>0?[0,6,3]:[0,3,6])target.push(vertices[i+j],vertices[i+j+1],vertices[i+j+2]);}}
 function floorPolygon(parent,ps,color,height=.035){const vertices=[],contour=ps.map(p=>new THREE.Vector2(p.x,p.y));for(const triangle of THREE.ShapeUtils.triangulateShape(contour,[])){const [a,b,c]=triangle.map(i=>ps[i]),area=(b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x);for(const p of area>0?[a,c,b]:[a,b,c])vertices.push(p.x,height,p.y);}addFlat(vertices,color);}
 function strip(parent,path,width,color,height=.04){const left=[],right=[];for(let i=0;i<path.length;i++){const a=path[Math.max(0,i-1)],b=path[Math.min(path.length-1,i+1)],yaw=Math.atan2(b.y-a.y,b.x-a.x);left.push({x:path[i].x-Math.sin(yaw)*width/2,y:path[i].y+Math.cos(yaw)*width/2});right.push({x:path[i].x+Math.sin(yaw)*width/2,y:path[i].y-Math.cos(yaw)*width/2});}const vertices=[];for(let i=0;i<path.length-1;i++)for(const p of [left[i],left[i+1],right[i],right[i],left[i+1],right[i+1]])vertices.push(p.x,height,p.y);addFlat(vertices,color);}
 function outline(parent,x,z,w,d,color,height=.065){const ps=rectangle(x,z,w,d);ps.push(ps[0]);strip(parent,ps,.11,color,height);}
 function arrow(x,z,yaw,size=1,height=.075){const local=[[-.9,-.22],[.2,-.22],[.2,-.65],[1.0,0],[.2,.65],[.2,.22],[-.9,.22]],c=Math.cos(yaw),s=Math.sin(yaw);floorPolygon(scene,local.map(([a,b])=>({x:x+(a*c-b*s)*size,y:z+(a*s+b*c)*size})),'#f0e8cc',height);}
 function label(text,x,z,y=1.0,size=2.1,parent=dimensions,scope='site'){const canvas=document.createElement('canvas');let ctx=canvas.getContext('2d');ctx.font='48px sans-serif';canvas.width=Math.ceil(ctx.measureText(text).width)+50;canvas.height=90;ctx=canvas.getContext('2d');ctx.fillStyle='#14251de6';ctx.fillRect(0,0,canvas.width,90);ctx.font='48px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#f4e2bd';ctx.fillText(text,canvas.width/2,47);const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:texture,depthTest:false,depthWrite:false}));sprite.position.set(x,y,z);sprite.scale.set(size*canvas.width/90,size,1);sprite.renderOrder=10;sprite.userData.scope=scope;parent.add(sprite);return sprite;}
 const ground=box(scene,42,-.22,39,112,.4,104,'#8a987a','terrain');ground.castShadow=false;
 box(scene,site.width/2,.005,site.height/2,site.width,.06,site.height,'#b9b9a0','site-slab').castShadow=false;
 const path=road.nodes;strip(scene,path,site.roadWidth+.25,'#d1c9a8',.042);strip(scene,path,site.roadWidth,'#59635b',.05);
 let distance=0;for(let i=1;i<path.length;i++){const a=path[i-1],b=path[i],length=Math.hypot(b.x-a.x,b.y-a.y);distance+=length;if(Math.floor(distance/1.8)%2===0)strip(scene,[a,b],.1,'#d2b46a',.065);}
 for(let s=8;s<road.length;s+=12){const p=road.at(s);arrow(p.x,p.y,p.yaw,1.2);}
 // Site geometry is read directly from the same tested metre layout as the plan.
 const heights={warehouse:9.5,workshop:5.2,office:3.4};
 for(const b of buildings){
  const group=new THREE.Group();group.name=b.id;scene.add(group);groups[b.id]=group;
  const base=box(group,b.x+b.w/2,.13,b.y+b.h/2,b.w,.22,b.h,b.id==='warehouse'?'#98a496':'#bac1aa',b.id+'-footprint');footprints[b.id]=base;
  const h=heights[b.id],wall='#c4c2a8',trim='#657b72';
  function wallX(edge,start,end,opening=null){const x=edge===b.x?edge+.1:edge-.1;if(!opening){box(group,x,h/2,start+(end-start)/2,.2,h,end-start,wall);return;}const [a,c]=opening;box(group,x,h/2,(start+a)/2,.2,h,a-start,wall);box(group,x,h/2,(c+end)/2,.2,h,end-c,wall);box(group,x,(h+3.8)/2,(a+c)/2,.2,h-3.8,c-a,wall);}
  function wallZ(edge,start,end,openings=[]){const z=edge===b.y?edge+.1:edge-.1;let last=start;for(const [a,c] of [...openings,[end,end]]){if(a>last)box(group,(last+a)/2,h/2,z,a-last,h,.2,wall);if(c>a)box(group,(a+c)/2,(h+4.5)/2,z,c-a,h-4.5,.2,wall);last=c;}}
  wallX(b.x,b.y,b.y+b.h,b.id==='warehouse'?[20,26]:null);wallX(b.x+b.w,b.y,b.y+b.h,b.id==='workshop'?[20,26]:null);
  wallZ(b.y,b.x,b.x+b.w);wallZ(b.y+b.h,b.x,b.x+b.w,b.id==='warehouse'?[[32,38],[54,60]]:[]);
  for(const [x,z] of [[b.x+.15,b.y+.15],[b.x+b.w-.15,b.y+.15],[b.x+.15,b.y+b.h-.15],[b.x+b.w-.15,b.y+b.h-.15]])box(group,x,h/2,z,.3,h,.3,trim);
  if(b.id!=='workshop'){
   const roofGroup=new THREE.Group();roofGroup.name=b.id+'-roof';roofs.add(roofGroup);
   box(roofGroup,b.x+b.w/2,h+.15,b.y+b.h/2,b.w+.5,.3,b.h+.5,'#688391');
   for(let x=b.x+.6;x<b.x+b.w;x+=1.4)box(roofGroup,x,h+.33,b.y+b.h/2,.045,.06,b.h+.4,'#8b9f9e');
   if(b.id==='warehouse')for(const x of [33,46,59])for(const z of [12,27]){box(roofGroup,x,h+.55,z,1.3,.55,1.5,'#d4d9ca');box(roofGroup,x,h+.86,z,1.4,.08,1.6,'#7e9697');}
  }else{
   if(!workshopCutaway)for(const z of [12,20,30])box(group,b.x+b.w/2,h+.1,z,b.w,.2,.16,'#718479');
   for(const z of [12,15,18,22,26,30]){box(group,3.7,.95,z,1.05,1.8,1.7,z%2?'#365e74':'#b88043');box(group,4.25,1.8,z,.05,.08,1.55,'#c6c8b3');}
  }
  if(b.id==='office')for(const x of [6.5,12,16])box(group,x,1.8,8.01,2.4,1.2,.035,'#405f62');
 }
 scene.add(roofs);
 for(const x of [35,57]){outline(scene,x-6,37,12,10,'#d2b360');for(const dx of [-3.15,3.15])box(scene,x+dx,.55,35.5,.18,1.0,.18,'#d8b149');for(const dx of [-3,3])box(scene,x+dx,2.3,35.06,.18,4.6,.16,'#456771');box(scene,x,4.65,35.06,6.2,.3,.16,'#456771');}
 for(const x of [19,25]){for(const z of [20,26])box(scene,x,1.95,z,.18,3.9,.18,'#456771');box(scene,x,3.95,23,.18,.2,6.2,'#456771');}
 box(scene,22,.13,23,6,.22,4,'#aaac86').castShadow=false;outline(scene,19,21,6,4,'#d6bd6f',.242);
 strip(scene,[{x:19,y:5},{x:22,y:5},{x:22,y:35},{x:25,y:35}],1.2,'#81a48c',.075);
 for(let z=21;z<25;z+=.65)box(scene,22,.241,z+.15,1.6,.002,.3,'#eee8cf').castShadow=false;
 for(const x of [20.3,23.7])box(scene,x,.241,23,.15,.002,3.6,'#f2e4c3').castShadow=false;
 arrow(23.8,23.7,Math.PI,.55,.243);arrow(20.2,22.3,0,.55,.243);
 outline(scene,20,33,4.2,5.2,'#d6b45e');for(let a=14.8;a<=24.2;a+=.8){const t0=Math.max(0,20-a),t1=Math.min(5.2,24.2-a);if(t1>t0)strip(scene,[{x:a+t0,y:33+t0},{x:a+t1,y:33+t1}],.1,'#d6b45e',.085);}
 for(const [i,p] of bays.entries())outline(scene,7.5,i?25.5:12.5,8,i?6:7,'#d6b45e',.255);
 for(let i=0;i<10;i++){const p=parking(i);outline(scene,p.x-1.4,1.1,2.8,4.2,'#d6b45e',.255);}
 if(physicalRacks){
  for(const z of trafficLanes.z){for(let x=29;x<64;x+=2.4)strip(scene,[{x,y:z},{x:x+1.2,y:z}],.07,'#d6b45e',.242);for(const x of [35,46,57]){arrow(x,z-trafficLanes.offset,0,.4,.243);arrow(x,z+trafficLanes.offset,Math.PI,.4,.243);}}
  for(const x of trafficLanes.x){for(let z=8;z<30;z+=2.4)strip(scene,[{x,y:z},{x,y:z+1.2}],.07,'#d6b45e',.242);for(const z of [12,24]){arrow(x-trafficLanes.offset,z,-Math.PI/2,.4,.243);arrow(x+trafficLanes.offset,z,Math.PI/2,.4,.243);}}
 }

 for(const x of [31.6,42.8,54])for(const z of [11,20.6]){
  if(physicalRacks||rackStudy&&x===42.8&&z===20.6)continue;
  for(const xx of [x,x+6.4])for(const zz of [z,z+4.8])box(groups.warehouse,xx,2.6,zz,.12,5.2,.12,'#526f69');
  for(const y of [.55,2,3.45,4.9]){box(groups.warehouse,x+3.2,y,z,6.4,.12,.14,'#b69254');box(groups.warehouse,x+3.2,y,z+4.8,6.4,.12,.14,'#b69254');for(const xx of [x,x+3.2,x+6.4])box(groups.warehouse,xx,y,z+2.4,.1,.1,4.8,'#6c8b76');}
 }
 function wheel(parent,x,z,r,width){const key=r+':'+width;if(!wheelGeometries.has(key))wheelGeometries.set(key,new THREE.CylinderGeometry(r,r,width,14));const n=new THREE.Mesh(wheelGeometries.get(key),material('#293831'));n.rotation.x=Math.PI/2;const pivot=new THREE.Group(),spin=new THREE.Group();pivot.position.set(x,r,z);parent.add(pivot);pivot.add(spin);spin.add(n);n.castShadow=true;parent.userData.wheels||=[];parent.userData.wheels.push({pivot,spin,rear:x<0});for(const angle of [0,Math.PI/2]){const mark=box(spin,0,0,z<0?-width/2-.003:width/2+.003,.045,r*1.4,.006,'#a6b4a2');mark.rotation.z=angle;}}
 function equipment(p,kind,color='#d5aa47'){const group=new THREE.Group();group.name=kind;group.userData.supportSurface=kind==='truck'?.05:.24;group.position.set(p.x,group.userData.supportSurface+.005,p.y);group.rotation.y=-p.yaw;scene.add(group);
  if(kind==='truck'){
   box(group,-.2,.71,0,7.5,.32,2.15,'#3d4d43');box(group,-1.25,2.08,0,5.1,2,2.3,'#547e97');box(group,2.35,1.77,0,2,1.7,2.24,'#dce0cb');box(group,3.36,2.09,0,.03,.65,1.94,'#3c6265');
   for(const x of [-2.8,-1.65,2.5])for(const z of [-1.09,1.09])wheel(group,x,z,.48,.28);
  }else{
   box(group,-.35,.67,0,2.15,.64,1.08,color);const hood=new THREE.Group();hood.position.set(-.775,.845,0);group.add(hood);box(hood,-.325,.175,0,.65,.35,1.08,color);group.userData.hood=hood;box(group,-1.10,1.02,0,.48,.12,.72,'#344a3e');for(const side of [-1,1])box(group,-1.10,1.08,side*.40,.06,.035,.08,'#a6b4a2');box(group,-.1,1.12,0,.52,.22,.58,'#344a3e');box(group,-.3,1.41,0,.15,.42,.58,'#344a3e');
   for(const x of [-.7,.56])for(const z of [-.49,.49])box(group,x,1.69,z,.055,1.37,.055,'#3f5547');box(group,-.06,2.405,0,1.48,.07,1.14,'#617563');
   for(const z of [-.42,.42])box(group,.91,1.31,z,.12,2.3,.09,'#455c4a');box(group,.97,.515,0,.15,.55,.93,'#637663');for(const z of [-.3,.3])box(group,1.55,.155,z,1.2,.07,.13,'#8b9884');
   for(const x of [-.94,.65])for(const z of [-.53,.53])wheel(group,x,z,x<0?.29:.36,.18);
  }return group;
 }
 const referenceVehicles=[equipment(docks.receiving,'truck'),equipment(docks.dispatch,'truck'),...bays.map(p=>equipment(p,'forklift'))];
 // Batch repeated fence posts and rails into one draw call.
 const fenceBoxes=[];function fence(a,b){const length=Math.hypot(b[0]-a[0],b[1]-a[1]),count=Math.ceil(length/2),yaw=-Math.atan2(b[1]-a[1],b[0]-a[0]);for(let i=0;i<=count;i++){const t=i/count;fenceBoxes.push({x:a[0]+(b[0]-a[0])*t,z:a[1]+(b[1]-a[1])*t,y:1.1,w:.1,h:2.2,d:.1,yaw:0});}for(const y of [.45,1.2,2.0])fenceBoxes.push({x:(a[0]+b[0])/2,z:(a[1]+b[1])/2,y,w:length,h:.045,d:.045,yaw});}
 for(const [a,b] of [[[0,0],[84,0]],[[0,0],[0,78]],[[0,78],[84,78]],[[84,0],[84,53.5]],[[84,60.5],[84,67.5]],[[84,74.5],[84,78]]])fence(a,b);
 const fences=new THREE.InstancedMesh(unitBox,material('#526e65'),fenceBoxes.length),dummy=new THREE.Object3D();fenceBoxes.forEach((b,i)=>{dummy.position.set(b.x,b.y,b.z);dummy.rotation.set(0,b.yaw,0);dummy.scale.set(b.w,b.h,b.d);dummy.updateMatrix();fences.setMatrixAt(i,dummy.matrix);});fences.castShadow=true;scene.add(fences);
 box(scene,46.5,.17,58.5,31,.25,11,'#85976f');
 const leaves=new THREE.IcosahedronGeometry(1,1);for(const [x,z] of [[35,57],[43,60],[52,56],[58,60]]){box(scene,x,1.3,z,.22,2.6,.22,'#7e7155');const tree=new THREE.Mesh(leaves,material('#718e62'));tree.position.set(x,3.1,z);tree.scale.set(1.8,2.0,1.8);tree.castShadow=true;scene.add(tree);}
 const grid=new THREE.GridHelper(84,84,'#a8be9a','#a8be9a');grid.position.set(42,.11,39);grid.material.transparent=true;grid.material.opacity=.18;dimensions.add(grid);
 label('SITE · 84 × 78 m',42,79,1.8,2.3);label('WAREHOUSE · 42 × 34.2 m',46,17,12,2.5,dimensions,'warehouse');label('WORKSHOP · 16 × 22 m',11,23,7,1.8,dimensions,'workshop');label('TRUCK LANE · 7 m',44,71,1.6,1.9);label('CONNECTOR · 6 × 4 m',22,23,1.3,1.5,dimensions,'connector');label('IN',85,57,2.8,1.7);label('OUT',85,71,2.8,1.7);scene.add(dimensions);
 // Road paint shares one geometry per colour. Static boxes share instance batches.
 for(const [color,vertices] of flatBatches){const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));geo.computeVertexNormals();const mat=material(color).clone();mat.side=THREE.DoubleSide;const mesh=new THREE.Mesh(geo,mat);mesh.name=color==='#59635b'?'truck-road':'site-marking';mesh.receiveShadow=true;scene.add(mesh);}
 scene.updateMatrixWorld(true);
 function batchBoxes(root,skip=new Set()){
  const batches=new Map(),inverse=root.matrixWorld.clone().invert();
  function visit(parent){for(const child of parent.children){if(skip.has(child))continue;if(child.userData.staticBox){if(!batches.has(child.material))batches.set(child.material,[]);batches.get(child.material).push(inverse.clone().multiply(child.matrixWorld));child.visible=false;}else visit(child);}}
  visit(root);for(const [mat,matrices] of batches){const instances=new THREE.InstancedMesh(unitBox,mat,matrices.length);matrices.forEach((matrix,i)=>instances.setMatrixAt(i,matrix));instances.computeBoundingSphere();instances.castShadow=true;instances.receiveShadow=true;root.add(instances);}
 }
 batchBoxes(scene,new Set([roofs,...referenceVehicles]));batchBoxes(roofs);referenceVehicles.forEach(group=>batchBoxes(group));
 function createEquipment(model){const color={'FG-25':'#d5aa47','FB-20':'#5f9d97','FD-25':'#cb8749'}[model]||'#d5aa47',group=equipment({x:0,y:0,yaw:0},'forklift',color);scene.updateMatrixWorld(true);batchBoxes(group,new Set([group.userData.hood,...group.userData.wheels.map(w=>w.pivot)]));batchBoxes(group.userData.hood);group.userData.wheels.forEach(w=>batchBoxes(w.spin));return group;}
 function createLoad(){const group=new THREE.Group();scene.add(group);box(group,0,.05,0,.8075,.1,.7225,'#ac9165');for(const x of [-.18,.18])for(const z of [-.16,.16])box(group,x,.33,z,.34,.46,.30,'#c7ab79');scene.updateMatrixWorld(true);batchBoxes(group);return group;}
 let headGeometry=null;
 function createMechanic(){const group=new THREE.Group();scene.add(group);for(const z of [-.12,.12]){box(group,0,.47,z,.16,.82,.16,'#3e5770');box(group,.07,.06,z,.3,.12,.18,'#303d32');}box(group,0,1.13,0,.38,.53,.4,'#ce8a42');for(const z of [-.27,.27])box(group,.07,1.05,z,.12,.5,.12,'#47637a');headGeometry||=new THREE.SphereGeometry(.15,10,8);const head=new THREE.Mesh(headGeometry,material('#d6ba92'));head.position.set(0,1.57,0);head.castShadow=true;group.add(head);box(group,0,1.72,0,.35,.10,.34,'#e0dfca');scene.updateMatrixWorld(true);batchBoxes(group);return group;}
 const measurements={metresPerUnit:scale,site:{width:site.width,depth:site.height},buildings:buildings.map(b=>({id:b.id,width:b.w,depth:b.h,height:heights[b.id]})),roadWidth:site.roadWidth,nominalTruckCornerSpan:site.truckRadius,minimumTruckPathRadius:1/Math.max(...road.nodes.map(p=>Math.abs(p.curvature))),forkTurningRadius:site.forkRadius,referenceVehicles:referenceVehicles.length};
 function focusLabels(name){for(const child of dimensions.children)if(child.isSprite){const scope=child.userData.scope;child.visible=name==='site'?scope!=='connector':scope===name||name==='workshop'&&scope==='connector';}}
 return {roofs,dimensions,footprints,groups,referenceVehicles,measurements,focusLabels,createEquipment,createLoad,createMechanic};
}
