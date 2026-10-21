import {rigSpec,phases,duration,routePose,turnLength,travel} from './handling-motion.js';
import {RACKS} from '../../warehouse-model.js';
import {floorPoint} from './state-frame.js';
export {duration,phases};
const block=RACKS[3],origin=floorPoint(block.x,block.y);
// Physical pocket/support anchors refine the source's symbolic storage glyphs.
export const rackSpec=Object.freeze({source:'rack-3-1',x:origin.x,z:origin.z,width:6.4,depth:4.8,
 targetX:origin.x+1.6,targetZ:origin.z+.6,support:.61,beamBottom:1.94,aisleNear:15.87,aisleFar:20.53,
 turnScale:.40,carryZ:18.78,palletLocalX:.70,ground:.24});
const scale=rackSpec.turnScale,length=turnLength*scale,startX=rackSpec.targetX+2.8*scale,startZ=rackSpec.carryZ-2.8*scale;
const wheelSides=[-.53,.53,-.53,.53],nodes=[];
for(let i=0;i<=1200;i++){
 const s=length*i/1200,p=routePose(s/scale),k=p.curvature/scale,previous=nodes.at(-1),ds=previous?s-previous.s:0;
 nodes.push({s,x:startX+(p.x-14)*scale,z:startZ+(p.z-16)*scale,yaw:p.yaw,curvature:k,wheels:wheelSides.map((side,w)=>(previous?.wheels[w]||0)+ds*(w<2?1-k*side:Math.hypot(1-k*side,rigSpec.wheelbase*k)))});
}
const lerp=(a,b,t)=>a+(b-a)*t,smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*t*(10+t*(-15+6*t));};
function route(s){
 if(s>=length)return {...nodes.at(-1),z:rackSpec.carryZ+s-length,curvature:0,wheels:nodes.at(-1).wheels.map(w=>w+s-length)};
 const q=Math.max(0,s)/length*1200,i=Math.min(1199,Math.floor(q)),a=nodes[i],b=nodes[i+1],t=q-i;
 return {x:lerp(a.x,b.x,t),z:lerp(a.z,b.z,t),yaw:lerp(a.yaw,b.yaw,t),curvature:lerp(a.curvature,b.curvature,t),wheels:a.wheels.map((w,i)=>lerp(w,b.wheels[i],t))};
}
export function rackFrame(seconds){
 const t=Math.max(0,Math.min(duration,seconds)),height=rackSpec.support-rackSpec.ground,place=length+(rackSpec.targetZ-1.1-rackSpec.carryZ);
 const blend=(a,b,from,to)=>lerp(from,to,smooth((t-a)/(b-a)));
 let pose={x:startX,z:startZ,yaw:Math.PI},wheels=[0,0,0,0],curvature=0,fork=.1,tilt=0;
 if(t<8){
  const d=t<1.8?travel(t,0,1.8,0,2.8):t<2.3?2.8:t<4.1?travel(t,2.3,4.1,2.8,4):t<5.6?4:t<7.6?travel(t,5.6,7.6,4,0):0;
  pose.x-=d;wheels.fill(d);
  fork=t<1.8?.1:t<2.3?blend(1.8,2.3,.1,.05):t<4.1?.05:t<4.4?blend(4.1,4.4,.05,.065):t<5.2?blend(4.4,5.2,.065,.265):.265;
  tilt=t>=5.2?blend(5.2,5.6,0,Math.PI/72):0;
 }else{
  const s=t<12.8?travel(t,8,12.8,0,length):t<14?length:t<16?travel(t,14,16,length,place):t<17.2?place:t<19?travel(t,17.2,19,place,length):t<20?length:t<26?travel(t,20,26,length,0):0;
  const p=route(s);pose={x:p.x,z:p.z,yaw:p.yaw};wheels=p.wheels;curvature=p.curvature;
  fork=t<12.8?.265:t<14?blend(12.8,14,.265,height+.145):t<16?height+.145:t<16.8?blend(16,16.8,height+.145,height+.065):t<17.2?blend(16.8,17.2,height+.065,height+.045):t<19?height+.045:t<20?blend(19,20,height+.045,.1):.1;
  tilt=t<12.8?Math.PI/72:t<14?blend(12.8,14,Math.PI/72,0):0;
 }
 const carriage=fork-rigSpec.rootClearance-rigSpec.mastY,owner=t<4.4?'floor':t<16.8?'forks':'rack';
 let load={x:startX-5.1,z:startZ,bottom:0,yaw:Math.PI,tilt:0,owner,localX:rackSpec.palletLocalX};
 if(owner==='forks'){
  const ax=rigSpec.heelX+rackSpec.palletLocalX,ay=carriage+rigSpec.forkThickness-rigSpec.pocketTop,lx=rigSpec.mastX+Math.cos(tilt)*ax-Math.sin(tilt)*ay;
  load={...load,x:pose.x+Math.cos(pose.yaw)*lx,z:pose.z+Math.sin(pose.yaw)*lx,bottom:rigSpec.rootClearance+rigSpec.mastY+Math.sin(tilt)*ax+Math.cos(tilt)*ay,yaw:pose.yaw,tilt};
 }else if(owner==='rack')load={...load,x:rackSpec.targetX,z:rackSpec.targetZ,bottom:height,yaw:Math.PI/2};
 const steering=wheelSides.map((side,i)=>i<2?0:Math.atan2(-rigSpec.wheelbase*curvature,1-curvature*side));
 return {time:t,phase:phases.find(p=>t>=p.start&&t<p.end)?.label||'Cycle complete',pose,fork,tilt,carriage,wheels,steering,spin:wheels.map((d,i)=>-d/(i<2?.36:.29)),load};
}
