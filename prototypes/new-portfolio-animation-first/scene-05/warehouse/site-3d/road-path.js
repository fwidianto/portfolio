import {truckRoad,incomingToDispatch,truckExit,pose} from '../layout/site-layout.js';
const lerp=(a,b,t)=>a+(b-a)*t;
function polynomial(ps,t){let q=ps.map(p=>[...p]);for(let n=q.length-1;n>0;n--)for(let i=0;i<n;i++)q[i]=q[i].map((v,k)=>lerp(v,q[i+1][k],t));return q[0];}
const angle=(a,b)=>a+Math.atan2(Math.sin(b-a),Math.cos(b-a));
export function roadDistance(t,T,D){const u=Math.max(0,Math.min(T,t)),r=Math.min(2,T/4),v=D/(T-r),ramp=q=>q*q*q-.5*q*q*q*q;return u<r?v*r*ramp(u/r):u>T-r?D-v*r*ramp((T-u)/r):v*(u-r/2);}
export function compileRoad(segments,{wheelbase=3.7,track=1.98}={}){
 let length=0,heading=pose(segments[0],0).yaw;const nodes=[{s:0,...pose(segments[0],0),roll:[0,0,0,0]}];
 for(const segment of segments){
  const start=pose(segment,0),end=pose(segment,1),arm=segment.radius*.3392857142857143;
  const ps=segment.kind==='line'?null:[[start.x,start.y],[start.x+Math.cos(start.yaw)*arm,start.y+Math.sin(start.yaw)*arm],[start.x+Math.cos(start.yaw)*2*arm,start.y+Math.sin(start.yaw)*2*arm],[end.x-Math.cos(end.yaw)*2*arm,end.y-Math.sin(end.yaw)*2*arm],[end.x-Math.cos(end.yaw)*arm,end.y-Math.sin(end.yaw)*arm],[end.x,end.y]];
  const d=ps?.slice(1).map((p,i)=>p.map((v,k)=>5*(v-ps[i][k]))),dd=d?.slice(1).map((p,i)=>p.map((v,k)=>4*(v-d[i][k])));
  const evaluate=t=>{if(!ps)return pose(segment,t);const [x,y]=polynomial(ps,t),[dx,dy]=polynomial(d,t),[ax,ay]=polynomial(dd,t);return {x,y,yaw:Math.atan2(dy,dx),curvature:(dx*ay-dy*ax)/Math.hypot(dx,dy)**3};};
  const steps=segment.kind==='line'?Math.ceil(Math.hypot(end.x-start.x,end.y-start.y)*12):300;
  for(let i=1;i<=steps;i++){const p=evaluate(i/steps),last=nodes.at(-1),ds=Math.hypot(p.x-last.x,p.y-last.y),k=(p.curvature+last.curvature)/2;p.yaw=angle(heading,p.yaw);heading=p.yaw;length+=ds;const f=[-track/2,track/2,-track/2,track/2].map((side,w)=>w<2?1-k*side:Math.hypot(1-k*side,wheelbase*k));nodes.push({...p,s:length,roll:last.roll.map((r,w)=>r+ds*f[w])});}
 }
 function at(distance){const s=Math.max(0,Math.min(length,distance));let lo=0,hi=nodes.length-1;while(hi-lo>1){const m=(lo+hi)>>1;if(nodes[m].s<s)lo=m;else hi=m;}const a=nodes[lo],b=nodes[hi],t=(s-a.s)/(b.s-a.s||1);return {x:lerp(a.x,b.x,t),y:lerp(a.y,b.y,t),yaw:lerp(a.yaw,b.yaw,t),curvature:lerp(a.curvature,b.curvature,t),roll:a.roll.map((r,i)=>lerp(r,b.roll[i],t))};}
 return {length,nodes,at};
}
export const road=compileRoad(truckRoad),arrival=compileRoad(incomingToDispatch),exits={receiving:compileRoad(truckExit('receiving')),dispatch:compileRoad(truckExit('dispatch'))};
