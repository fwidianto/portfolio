import {obstaclesFor,freePose,envelope} from './physical-space.js';
import {recoverySpec,coupledTugPose,recoveryBox,workSides,crewObstacles,drawbarPose,drawbarShape} from './physical-access.js';
import {planPhysicalPath,timePhysicalPath,physicalPathPose} from './physical-path.js';
import {swept,reserveConflict} from './physical-reservations.js';
const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);},lerp=(a,b,t)=>a+(b-a)*t;
const box=pose=>{const polygon=envelope(pose);return {polygon,x0:Math.min(...polygon.map(p=>p.x)),x1:Math.max(...polygon.map(p=>p.x)),z0:Math.min(...polygon.map(p=>p.z)),z1:Math.max(...polygon.map(p=>p.z))};};
function blockers(s,u){return [...obstaclesFor(s.physical.ports,s.units.filter(v=>v!==u).map(v=>v.physical.pose),new Set(s.spots.filter(p=>p.pallet).map(p=>p.id))),...crewObstacles(s,u.id)];}
export function extractionCandidate(s,u,event){
 const origin=u.physical.pose,blocked=blockers(s,u),c=Math.cos(origin.yaw),sn=Math.sin(origin.yaw);
 for(let distance=u.load?1.5:.4;distance<=4.001;distance+=.1){
  const target={...origin,x:origin.x-distance*c,z:origin.z-distance*sn,k:0,speed:0};
  if(workSides(s,event,u,{pose:target,reservations:false,ignoreTug:true}).length<event.crew)continue;
  const points=[];let valid=true;
  for(let d=0;d<=distance+.0001;d+=.02){const p={x:origin.x-d*c,z:origin.z-d*sn,yaw:origin.yaw,k:0,gear:-1};if(!freePose(p,blocked)||!freePose(coupledTugPose(p),blocked,recoverySpec)||!freePose(drawbarPose(p),blocked,drawbarShape)){valid=false;break;}points.push(p);}
  if(valid){points.push({...target,gear:-1});return {origin:{...origin},target,distance,points};}
 }
 return null;
}
export function initializeRecovery(s){
 if(!s.config.continuous&&!s.config.recovery)return;
 s.physical.recovery={pose:{...recoverySpec.home,k:0,speed:0,roll:[0,0,0,0]},phase:'home',unit:null,clock:0,path:null,returnPath:null,reservation:null,connected:false,mechanic:null,completed:0};
}
export function requestRecovery(s){
 const r=s.physical.recovery;if(!r||r.unit)return;
 const staff=s.mechanics.find(m=>!m.event&&!m.travel);if(!staff)return;
 const units=s.units.filter(u=>u.fault&&!u.physical.recovery&&u.physical.pose.speed<1e-7&&Math.abs(u.physical.pose.k)<.001);
 for(const u of units){
  const event=s.events.find(e=>e.id===u.fault);if(event.status==='in-progress'||event.crew>s.mechanics.length||workSides(s,event,u,{reservations:false}).length>=event.crew)continue;
  const key=JSON.stringify([u.id,event.id,s.physical.revision,staff.id]);if(u.physical.recoveryFailed===key)continue;
  const candidate=extractionCandidate(s,u,event);if(!candidate){r.failed=key;u.physical.recoveryFailed=key;u.reason='Recovery waiting · no clear extraction';continue;}
  const start=coupledTugPose(candidate.origin),end=coupledTugPose(candidate.target),blocked=blockers(s,u),approach=planPhysicalPath(r.pose,start,[...blocked,box(candidate.origin)],{shape:recoverySpec,lanes:true,maxNodes:4000});
  const back=approach.ok?planPhysicalPath(end,recoverySpec.home,[...blocked,box(candidate.target)],{shape:recoverySpec,lanes:true,maxNodes:4000}):null;
  if(!approach.ok||!back?.ok){r.failed=key;u.physical.recoveryFailed=key;continue;}
  const cartLine=candidate.points.map(coupledTugPose),reservation=[...swept(approach.points,{rear:.9,front:1.2,halfWidth:.65}),...swept(cartLine,{rear:.9,front:1.2,halfWidth:.65}),...swept(candidate.points.map(drawbarPose),{rear:.5,front:.5,halfWidth:.25}),...swept(candidate.points),...swept(back.points,{rear:.9,front:1.2,halfWidth:.65})];
  if(s.units.some(v=>v!==u&&v.physical.reservation&&reserveConflict(reservation,v.physical.reservation,v.physical.reservationFrom||0))){r.failed=key;u.physical.recoveryFailed=key;continue;}
  const extraction=timePhysicalPath(candidate.points,{speedLimit:.45}),path=timePhysicalPath(approach.points,{speedLimit:1.6,wheelbase:.9}),returnPath=timePhysicalPath(back.points,{speedLimit:1.6,wheelbase:.9}),id=event.id+':recovery';
  const work={id,unit:u.id,kind:'recovery',name:'Controlled drivetrain recovery',status:'in-progress',created:s.tick,started:s.tick,completed:null,bay:null,mechanics:[staff.id],crew:1,wrench:0,duration:(path.duration+returnPath.duration+extraction.duration+8)*176/s.config.monthSeconds,progress:0,personHours:0,parts:[],consumables:[],threshold:null};s.events.push(work);staff.event=id;
  u.physical.recovery={event:id,load:u.load,origin:candidate.origin,port:null,stage:'secure',initialFork:u.physical.fork,initialTilt:u.physical.tilt};u.physical.recoveryPath=extraction;u.physical.path=null;u.physical.candidate=null;u.physical.reservation=null;u.physical.phase='recovery-secure';u.physical.pose.speed=0;
  Object.assign(r,{phase:'secure',unit:u.id,clock:0,path,returnPath,reservation,connected:false,mechanic:staff.id,event:id,distance:candidate.distance,failed:null});s.physical.revision++;return;
 }
}
function groundLoad(s,u){
 const p=u.physical,held=p.recovery;if(!u.load)return;
 const pose=held.origin,c=Math.cos(pose.yaw),sn=Math.sin(pose.yaw),id='recovery-'+u.id,port={id,type:'recovery',x:pose.x+1.1*c,z:pose.z+1.1*sn,yaw:pose.yaw,support:.24,access:{x:u.x,y:u.y},dock:{x:pose.x,z:pose.z,yaw:pose.yaw},approach:{x:pose.x-1.36*c,z:pose.z-1.36*sn,yaw:pose.yaw}};
 s.physical.ports[id]=port;s.spots.push({id,type:'recovery',x:u.x,y:u.y,access:{x:u.x,y:u.y},pallet:u.load,reserved:null});const pallet=s.pallets.find(v=>v.id===u.load);pallet.location=id;s.transfers.push({tick:s.tick,pallet:pallet.id,from:'unit:'+u.id,to:id,unit:u.id,kind:'recovery-support'});u.load=null;held.port=id;s.jobs.find(j=>j.id===u.job).status='recovery';
}
function moveCart(r,path,time){
 const old=r.pose,at=physicalPathPose(path,time),yaw=old.yaw+Math.atan2(Math.sin(at.yaw-old.yaw),Math.cos(at.yaw-old.yaw)),ds=(at.x-old.x)*Math.cos((old.yaw+yaw)/2)+(at.z-old.z)*Math.sin((old.yaw+yaw)/2);
 r.pose={...at,yaw,roll:old.roll.map((v,i)=>v+ds*(i<2?1-at.k*(i%2?.42:-.42):Math.hypot(1-at.k*(i%2?.42:-.42),.9*at.k)))};
}
export function stepRecovery(s){
 const r=s.physical.recovery;if(!r?.unit)return;
 const u=s.units.find(u=>u.id===r.unit),p=u.physical,event=s.events.find(e=>e.id===r.event),staff=s.mechanics.find(m=>m.id===r.mechanic),dt=s.config.stepSeconds;
 if(!staff||staff.travel||staff.available<1e-9){u.reason='Recovery waiting · assigned mechanic unavailable';return;}
 const work=Math.min(staff.available,dt*176/s.config.monthSeconds);staff.used+=work;staff.available-=work;event.personHours+=work;event.progress+=work;event.duration=Math.max(event.duration,event.progress);r.clock+=dt;
 if(r.phase==='secure'){
  p.tilt=lerp(p.recovery.initialTilt,0,smooth(r.clock/.5));p.fork=r.clock<.5?p.recovery.initialFork:lerp(p.recovery.initialFork,.06,smooth((r.clock-.5)/1.5));u.reason='Recovery · level and support the pallet';
  if(r.clock>=2){groundLoad(s,u);r.phase='release';r.clock=0;}
 }else if(r.phase==='release'){
  p.fork=lerp(.06,.04,smooth(r.clock/.5));u.reason='Recovery · unload forks, keep pallet supported';if(r.clock>=.5){r.phase='approach';r.clock=0;p.phase='recovery-wait';}
 }else if(r.phase==='approach'){
  moveCart(r,r.path,Math.min(r.clock,r.path.duration));u.reason='Recovery tractor approaching';if(r.clock>=r.path.duration){r.phase='connect';r.clock=0;r.pose.speed=0;r.pose.k=0;}
 }else if(r.phase==='connect'){
  u.reason='Recovery · connect and check drawbar';if(r.clock>=4){r.phase='extract';r.clock=0;r.connected=true;p.phase='recovery-extract';p.baseRecoveryRoll=[...p.pose.roll];r.baseExtractRoll=[...r.pose.roll];}
 }else if(r.phase==='extract'){
  const at=physicalPathPose(p.recoveryPath,Math.min(r.clock,p.recoveryPath.duration));p.pose={...at,roll:at.roll.map((v,i)=>v+p.baseRecoveryRoll[i])};r.pose={...coupledTugPose(p.pose),roll:at.roll.map((v,i)=>r.baseExtractRoll[i]-v)};u.reason='Recovery · withdraw clear, pallet stays on support';
  if(r.clock>=p.recoveryPath.duration){r.phase='disconnect';r.clock=0;p.pose.speed=r.pose.speed=0;}
 }else if(r.phase==='disconnect'){
  u.reason='Recovery · uncouple in clear repair space';if(r.clock>=2){r.connected=false;r.phase='return';r.clock=0;p.phase='recovery-wait';}
 }else if(r.phase==='return'){
  moveCart(r,r.returnPath,Math.min(r.clock,r.returnPath.duration));u.reason='Recovery · tractor clearing the work area';if(r.clock>=r.returnPath.duration){event.status='completed';event.completed=s.tick;event.duration=event.progress;event.wrench=event.personHours;staff.event=null;p.recovery.stage='repair';p.recoveryPath=null;r.phase='home';r.unit=null;r.path=null;r.returnPath=null;r.reservation=null;r.pose={...r.pose,...recoverySpec.home,k:0,speed:0};r.completed++;s.physical.revision++;}
 }
}
export function recoverLoad(s,u){
 const held=u.physical.recovery,slot=s.spots.find(p=>p.id===held?.port),pallet=s.pallets.find(p=>p.id===held?.load);if(!slot||slot.pallet!==pallet?.id||pallet.location!==slot.id)throw Error('Recovery load ownership mismatch.');
 slot.pallet=null;u.load=pallet.id;pallet.location='unit:'+u.id;s.jobs.find(j=>j.id===u.job).status='loaded';s.transfers.push({tick:s.tick,pallet:pallet.id,from:slot.id,to:pallet.location,unit:u.id,kind:'recovery-reclaim'});
}
export function finishReclaim(s,u){const held=u.physical.recovery;if(held?.port){s.spots=s.spots.filter(p=>p.id!==held.port);delete s.physical.ports[held.port];}u.physical.recovery=null;}
