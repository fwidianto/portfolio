// Bounded presentation between known source frames; no stepping, ownership prediction or ledger changes.
export function interpolatePhysicalFrames(a,b,t){
 if(t<=0)return a;if(t>=1)return b;
 const lerp=(x,y)=>x+(y-x)*t,units=a.units.map(u=>{const v=b.units.find(v=>v.id===u.id);if(!v||u.load!==v.load||u.physical.phase!==v.physical.phase)return u;const p=u.physical.pose,q=v.physical.pose,yaw=p.yaw+Math.atan2(Math.sin(q.yaw-p.yaw),Math.cos(q.yaw-p.yaw))*t,pose={x:lerp(p.x,q.x),z:lerp(p.z,q.z),yaw,k:lerp(p.k,q.k),speed:lerp(p.speed,q.speed),roll:p.roll.map((r,i)=>lerp(r,q.roll[i]))};return {...u,pose:{x:pose.x-.65*Math.cos(yaw),y:.245,z:pose.z-.65*Math.sin(yaw),yaw},physical:{...u.physical,pose,fork:lerp(u.physical.fork,v.physical.fork),tilt:lerp(u.physical.tilt,v.physical.tilt)}};});
 const mixPose=(p,q)=>({...p,x:lerp(p.x,q.x),y:p.y===undefined?undefined:lerp(p.y,q.y),z:lerp(p.z,q.z),yaw:p.yaw+Math.atan2(Math.sin(q.yaw-p.yaw),Math.cos(q.yaw-p.yaw))*t,...(p.roll?{k:lerp(p.k,q.k),speed:lerp(p.speed,q.speed),roll:p.roll.map((r,i)=>lerp(r,q.roll[i]))}:{})});
 const mechanics=a.mechanics?.map(m=>{const n=b.mechanics?.find(n=>n.id===m.id);return n&&m.unit===n.unit&&m.phase===n.phase?{...m,pose:mixPose(m.pose,n.pose),hood:lerp(m.hood||0,n.hood||0),toolAngle:lerp(m.toolAngle||0,n.toolAngle||0),walkDistance:lerp(m.walkDistance||0,n.walkDistance||0)}:m;});
 const r=a.physical?.recovery,s=b.physical?.recovery,recovery=r&&s&&r.unit===s.unit&&r.phase===s.phase?{...r,clock:lerp(r.clock,s.clock),pose:mixPose(r.pose,s.pose)}:r;
 return {...a,time:lerp(a.time,b.time),units,...(mechanics?{mechanics}:{}),...(a.physical?{physical:{...a.physical,recovery}}:{})};
}


// A small history buffer absorbs packet jitter without predicting uncomputed work.
export function createFramePlayback(){
 let frames=[],cursor=0,lastAt=null;
 function reset(frame,now){frames=[frame];cursor=frame.time;lastAt=now;}
 return {
  push(frame,now){
   const last=frames.at(-1);
   if(!last||!frame.playing||frame.reduced||frame.time<last.time||frame.speed!==last.speed||!last.playing){reset(frame,now);return;}
   if(frame.time===last.time)frames[frames.length-1]=frame;else frames.push(frame);
   if(frames.length>64){frames.splice(0,frames.length-64);cursor=Math.max(cursor,frames[0].time);}
  },
  sample(now){
   const latest=frames.at(-1);if(!latest)return null;
   if(!latest.playing||latest.reduced){lastAt=now;cursor=latest.time;return latest;}
   if(now-lastAt>250){reset(latest,now);return latest;}
   const dt=Math.max(0,Math.min(.1,(now-lastAt)/1000));lastAt=now;
   const available=Math.max(0,latest.time-cursor);
   cursor+=Math.min(dt*latest.speed*1.1,available*(1-Math.exp(-dt/.1)));
   while(frames.length>2&&frames[1].time<=cursor)frames.shift();
   const a=frames[0],b=frames[1]||a;
   return interpolatePhysicalFrames(a,b,b.time===a.time?1:(cursor-a.time)/(b.time-a.time));
  },
  stats:()=>({frames:frames.length,time:cursor,latest:frames.at(-1)?.time})
 };
}
