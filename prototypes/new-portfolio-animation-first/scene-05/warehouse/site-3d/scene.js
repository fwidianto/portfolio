import {createPresentation,polishMaterials} from './presentation.js';
import {mountSetupGuide} from '../setup-guide.js';
import {createFramePlayback} from './physical-interpolation.js';
import * as THREE from 'three';
import {OrbitControls} from './vendor/OrbitControls.js';
import {buildSite} from './geometry.js';
import {bindPhysicalActors} from './physical-actors.js';
import {createRack} from './rack-geometry.js';
import {rackBlocks} from './physical-space.js';
import {operationFrame,activityCue} from './state-frame.js';
import {connectOperation} from './operation.js';
import {bindLogistics} from './logistics-actors.js';
import {createActorBatches} from './actor-batches.js';
import {bindRecovery} from './recovery-actors.js';
import {createWorkGuide} from './work-guide.js';

const canvas=document.querySelector('#site-canvas'),status=document.querySelector('#map-status'),reduced=matchMedia('(prefers-reduced-motion: reduce)'),scene=new THREE.Scene();
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));
const presentation=createPresentation(scene,renderer);
// Actor batches update world matrices once before each render.
scene.matrixWorldAutoUpdate=false;scene.matrixAutoUpdate=false;
const built=buildSite(scene,{physicalRacks:true}),orthographic=new THREE.OrthographicCamera(-80,80,55,-55,.1,700),perspective=new THREE.PerspectiveCamera(42,1,.1,700);
createRack(scene,rackBlocks.map(rack=>({x:rack.x0+.07,z:rack.z0+.07})));
// Buildings and racks never move; retain their calculated world transforms.
scene.updateMatrixWorld(true);
for(const root of scene.children)if(root!==presentation.sun&&root!==presentation.sun.target)root.traverse(object=>{object.matrixAutoUpdate=false;object.matrixWorldAutoUpdate=false;});

const actorBatches=createActorBatches(scene,{cacheTransforms:true}),hooks={onRoot:root=>{polishMaterials(root);actorBatches.register(root);},onRefresh:root=>actorBatches.refresh(root)},actors=bindPhysicalActors(scene,built,hooks),logistics=bindLogistics(scene,built,hooks),recovery=bindRecovery(scene,hooks),workGuide=createWorkGuide(scene);polishMaterials(scene);const playback=createFramePlayback();let currentFrame=null,renderedFrame=null,frameSignature='',unitOptions='',activityUnit=null,pinnedUnit=false;
let camera=orthographic,controls,frame=0,renderCount=0,disposed=false,graphicsLost=false,focusName='site',height=110,lastRenderMs=0;
const presets={site:{target:[42,0,39],height:110},warehouse:{target:[46,2,20],height:58},workshop:{target:[13,1,23],height:31},doorway:{target:[22,1,23],height:20},loading:{target:[47,1,40],height:28}};
function requestRender(){if(!disposed&&!graphicsLost&&!document.hidden&&!frame)frame=requestAnimationFrame(draw);}
function setupControls(target){controls?.dispose();controls=new OrbitControls(camera,canvas);controls.target.copy(target);controls.enableDamping=!reduced.matches;controls.dampingFactor=.12;controls.screenSpacePanning=false;controls.minPolarAngle=.04;controls.maxPolarAngle=Math.PI/2-.035;controls.minDistance=4;controls.maxDistance=340;controls.minZoom=.3;controls.maxZoom=18;controls.listenToKeyEvents(canvas);controls.addEventListener('change',requestRender);controls.update();}
function resize(){const width=innerWidth,h=innerHeight,aspect=width/h;renderer.setSize(width,h,false);const visibleHeight=Math.max(height,height/aspect);orthographic.left=-visibleHeight*aspect/2;orthographic.right=visibleHeight*aspect/2;orthographic.top=visibleHeight/2;orthographic.bottom=-visibleHeight/2;orthographic.updateProjectionMatrix();perspective.aspect=aspect;perspective.updateProjectionMatrix();requestRender();}
function focus(name='site'){const wasPinned=pinnedUnit;if(name==='unit')pinnedUnit=true;else if(name==='warehouse'||name==='site')pinnedUnit=false;if(currentFrame&&wasPinned!==pinnedUnit){frameSignature='';queueMicrotask(()=>operation.refresh());}focusName=name;const unit=currentFrame?.units[Number(document.querySelector('#selected-unit').value)],phone=innerWidth<700&&innerHeight>innerWidth,preset=name==='unit'&&unit?{target:[unit.physical.pose.x,1,unit.physical.pose.z],height:12}:name==='warehouse'&&phone?{target:[49,1,14],height:34}:presets[name]||presets.site,target=new THREE.Vector3(...preset.target),direction=new THREE.Vector3(...(name==='loading'?[-1,1.3,-.15]:phone&&name==='warehouse'?[-.35,1,.35]:[-.8,.9,1])).normalize();height=preset.height;orthographic.zoom=1;const distance=Math.max(camera.isOrthographicCamera?140:0,Math.max(height,height/(innerWidth/innerHeight))/(2*Math.tan(THREE.MathUtils.degToRad(21))));camera.position.copy(target).addScaledVector(direction,distance);camera.lookAt(target);setupControls(target);built.focusLabels(name);resize();renderer.shadowMap.needsUpdate=true;requestRender();}
function projection(type){const target=controls.target.clone(),direction=camera.position.clone().sub(target).normalize(),distance=camera.position.distanceTo(target),visibleHeight=camera.isOrthographicCamera?(camera.top-camera.bottom)/camera.zoom:2*distance*Math.tan(THREE.MathUtils.degToRad(21));camera=type==='perspective'?perspective:orthographic;if(camera.isPerspectiveCamera)camera.position.copy(target).addScaledVector(direction,visibleHeight/(2*Math.tan(THREE.MathUtils.degToRad(21))));else{camera.zoom=(camera.top-camera.bottom)/visibleHeight;camera.position.copy(target).addScaledVector(direction,distance);}camera.lookAt(target);camera.updateProjectionMatrix();setupControls(target);requestRender();}
function draw(){frame=0;if(disposed||document.hidden)return;const start=performance.now(),sample=playback.sample(start),display=sample?{...sample,activityUnit:currentFrame.activityUnit,selected:currentFrame.selected}:currentFrame;
 if(currentFrame?.playing)renderer.shadowMap.needsUpdate=true;
 if(display){actors.apply(display);logistics.apply(display,display.time);recovery.apply(display);workGuide.apply(display);renderedFrame=display;}
 controls.update();presentation.update(camera,controls.target);actorBatches.update();renderer.render(scene,camera);lastRenderMs=performance.now()-start;renderCount++;document.documentElement.dataset.mapReady='true';if(currentFrame?.playing)requestRender();}

document.querySelector('#focus').addEventListener('change',e=>focus(e.target.value));document.querySelector('#projection').addEventListener('change',e=>projection(e.target.value));document.querySelector('#reset').addEventListener('click',()=>focus(focusName));
document.querySelector('#cutaway').addEventListener('change',e=>{built.roofs.visible=!e.target.checked;renderer.shadowMap.needsUpdate=true;requestRender();});document.querySelector('#dimensions').addEventListener('change',e=>{built.dimensions.visible=e.target.checked;requestRender();});
addEventListener('resize',resize);document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else requestRender();});reduced.addEventListener('change',()=>{controls.enableDamping=!reduced.matches;requestRender();});
canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();graphicsLost=true;operation.source?.pause();cancelAnimationFrame(frame);frame=0;status.textContent='Graphics paused · operation paused while the view recovers.';});canvas.addEventListener('webglcontextrestored',()=>{graphicsLost=false;renderer.shadowMap.needsUpdate=true;requestRender();status.textContent='3D map restored · press Resume to continue';});
if(innerWidth<700)document.querySelector('#view-controls').open=false;
focus('site');status.textContent='Connecting the existing operation…';
const sourceFrame=document.querySelector('#operation-source'),panel=document.querySelector('#operation-panel'),manage=document.querySelector('#operation-toggle'),inspect=document.querySelector('#operation-inspect'),unitSelect=document.querySelector('#selected-unit');
function expandOperation(open){panel.classList.toggle('expanded',open);manage.setAttribute('aria-expanded',String(open));manage.textContent=open?'Close':currentFrame?.started?'Manage':'Continue setup';operation.expand(open);}
const operation=connectOperation({frame:sourceFrame,
 onReady(){mountSetupGuide(sourceFrame.contentDocument,operation.source,{onStart(){operation.source.play();operation.refresh();},onStarted(){expandOperation(false);},onReset(){expandOperation(true);}});sourceFrame.contentDocument.getElementById('game-calculations').addEventListener('close',()=>{if(!document.hidden)inspect.focus({preventScroll:true});});expandOperation(true);parent.postMessage({type:'ch03:ready'},location.origin);sourceFrame.classList.add('source-ready');sourceFrame.setAttribute('aria-busy','false');manage.disabled=inspect.disabled=unitSelect.disabled=false;document.documentElement.dataset.operationReady='true';},
 onError(error){status.textContent=error.message;document.querySelector('#operation-summary').textContent='Operation unavailable · reload to retry';},
 onSnapshot(snapshot){
  const next=operationFrame(snapshot),signature=JSON.stringify(next);if(signature===frameSignature)return;frameSignature=signature;const justStarted=next.started&&!currentFrame?.started,justFinished=next.finished&&!currentFrame?.finished;
  if(!next.started){pinnedUnit=false;activityUnit=null;}const working=u=>u&&(u.moving||u.physical?.phase==='handling'||u.physical?.recovery||u.fault?.status==='in-progress');const previous=next.units.find(u=>u.id===activityUnit),active=pinnedUnit?next.units[next.selected]:next.units.find(u=>u.id===next.physical.recovery?.unit)||(working(previous)?previous:null)||next.units.find(u=>u.physical?.phase==='handling')||next.units.find(u=>u.moving)||next.units[next.selected];activityUnit=active.id;next.activityUnit=activityUnit;currentFrame=next;playback.push(next,performance.now());
  manage.textContent=panel.classList.contains('expanded')?'Close':next.started?'Manage':'Continue setup';
  panel.classList.toggle('manual-controls',next.units.some(u=>u.mode==='manual'));panel.classList.toggle('setup-controls',!next.started);
  const options=next.units.map(u=>u.id+':'+u.model).join('|');if(options!==unitOptions){unitOptions=options;unitSelect.replaceChildren(...next.units.map(u=>{const option=document.createElement('option');option.value=u.index;option.textContent=u.id+' · '+u.model;return option;}));}unitSelect.value=String(next.selected);
  const u=active,cue=activityCue({...next,selected:u.index}),operating=next.units.filter(v=>!v.fault&&(v.moving||['travel','yield','dock-exit','handling','departure'].includes(v.physical?.phase))).length;document.querySelector('#unit-status').textContent=pinnedUnit||!next.started?`${pinnedUnit?'Selected':'Current work'} · ${u.id} · ${cue}`:`${operating} of ${next.units.length} forklifts operating · ${next.flow?next.flow.phase==='fill'?'Receiving → storage':'Storage → dispatch':'Receiving → storage → dispatch'}`;
  document.querySelector('#operation-summary').textContent=next.continuous?`Month ${next.period} · ${next.inventory.stored} / ${next.inventory.capacity} stored · ${next.inventory.dispatched} dispatched`:`Day ${Math.min(30,Math.floor(next.time/8)+1)} / 30 · ${next.inventory.dispatched} / ${next.inventory.total} dispatched`;
  if(!graphicsLost)status.textContent=`${next.inventory.opening} opening · ${next.inventory.laterReceived} received · ${next.workshop.active} workshop · ${next.workshop.inPlace} in-place repairs`;
  if(justStarted){document.querySelector('#focus').value='warehouse';document.querySelector('#cutaway').checked=true;built.roofs.visible=false;document.querySelector('#dimensions').checked=false;built.dimensions.visible=false;focus('warehouse');}
  if(justFinished)expandOperation(true);
  renderer.shadowMap.needsUpdate=true;requestRender();
 }
});
manage.addEventListener('click',()=>expandOperation(!panel.classList.contains('expanded')));inspect.addEventListener('click',()=>{expandOperation(true);operation.inspect();});unitSelect.addEventListener('change',e=>{pinnedUnit=true;operation.selectUnit(Number(e.target.value));if(focusName==='unit')focus('unit');});
window.siteMap={scene,renderer,presentation,built,operation,actors,logistics,get frame(){return currentFrame;},get display(){return renderedFrame;},get camera(){return camera;},get controls(){return controls;},focus,projection,requestRender,stats:()=>({renderCount,lastRenderMs,drawCalls:renderer.info.render.calls,triangles:renderer.info.render.triangles,geometries:renderer.info.memory.geometries,textures:renderer.info.memory.textures,actorBatches:actorBatches.stats(),projection:camera.isOrthographicCamera?'orthographic':'perspective',target:controls.target.toArray(),position:camera.position.toArray(),zoom:camera.zoom,dimensions:built.measurements,sourceTime:currentFrame?.time,displayTime:renderedFrame?.time,playback:playback.stats()}),footprints:()=>Object.fromEntries(Object.entries(built.footprints).map(([key,mesh])=>{const size=new THREE.Box3().setFromObject(mesh).getSize(new THREE.Vector3());return [key,{width:size.x,depth:size.z}];}))};
addEventListener('pagehide',()=>{disposed=true;cancelAnimationFrame(frame);operation.dispose();controls.dispose();const geometries=new Set(),materials=new Set();scene.traverse(o=>{if(o.geometry)geometries.add(o.geometry);if(o.material)materials.add(o.material);});geometries.forEach(g=>g.dispose());materials.forEach(m=>{m.map?.dispose();m.dispose();});renderer.dispose();});
