// Synthetic A03 fixture. Metres, radians and seconds; no mission/accounting mutations.
export const rigSpec=Object.freeze({wheelbase:1.6,track:1.06,frontRadius:.36,rearRadius:.29,mastX:.32,mastY:.22,heelX:.08,forkLength:1.2,forkThickness:.05,palletLength:1.2,palletWidth:1,palletHeight:.15,pocketTop:.115,ground:.24,rootClearance:.005});
export const duration=28;
export const phases=[
 [0,1.8,'Approach'],[1.8,2.3,'Align forks'],[2.3,4.1,'Insert'],[4.1,4.4,'Take weight'],[4.4,5.2,'Lift clear'],[5.2,5.6,'Tilt back'],[5.6,7.6,'Withdraw'],[7.6,8,'Stop and change direction'],[8,12.8,'Carry low'],[12.8,14,'Stop, level and raise'],[14,16,'Approach placement'],[16,16.8,'Place on support'],[16.8,17.2,'Release weight'],[17.2,19,'Withdraw empty'],[19,20,'Lower empty forks'],[20,26,'Return empty'],[26,28,'Cycle complete']
].map(([start,end,label])=>Object.freeze({start,end,label}));
const clamp=x=>Math.max(0,Math.min(1,x)),smooth=x=>{x=clamp(x);return x*x*x*(10+x*(-15+6*x));},lerp=(a,b,t)=>a+(b-a)*t;
const controls=[[14,16],[13.05,16],[12.1,16],[11.2,16.9],[11.2,17.85],[11.2,18.8]];
function polynomial(ps,t){let values=ps.map(p=>[...p]);for(let n=values.length-1;n>0;n--)for(let i=0;i<n;i++)values[i]=values[i].map((v,k)=>lerp(v,values[i+1][k],t));return values[0];}
function curve(t,points=controls){const d=points.slice(1).map((p,i)=>p.map((v,k)=>5*(v-points[i][k]))),dd=d.slice(1).map((p,i)=>p.map((v,k)=>4*(v-d[i][k]))),[x,z]=polynomial(points,t),[dx,dz]=polynomial(d,t),[ddx,ddz]=polynomial(dd,t);return {x,z,yaw:Math.atan2(dz,dx),curvature:(dx*ddz-dz*ddx)/Math.hypot(dx,dz)**3};}
const wheelZ=[-rigSpec.track/2,rigSpec.track/2,-rigSpec.track/2,rigSpec.track/2];
function wheelFactors(k){return wheelZ.map((z,i)=>i<2?1-k*z:Math.hypot(1-k*z,rigSpec.wheelbase*k));}
const arc=[{t:0,s:0,wheels:[0,0,0,0]}];let previous=curve(0);
for(let i=1;i<=1000;i++){const t=i/1000,p=curve(t),ds=Math.hypot(p.x-previous.x,p.z-previous.z),last=arc.at(-1),f=wheelFactors(curve(t-.0005).curvature);arc.push({t,s:last.s+ds,wheels:last.wheels.map((v,k)=>v+ds*f[k])});previous=p;}
export const turnLength=arc.at(-1).s;
export const carryLength=turnLength+3.8,returnLength=turnLength+2.9;
export function routePose(distance){
 const s=Math.max(0,distance);
 if(s>=turnLength)return {x:11.2,z:18.8+s-turnLength,yaw:Math.PI/2,curvature:0,wheels:arc.at(-1).wheels.map(v=>v+s-turnLength)};
 let lo=0,hi=arc.length-1;while(hi-lo>1){const mid=(lo+hi)>>1;if(arc[mid].s<s)lo=mid;else hi=mid;}
 const a=arc[lo],b=arc[hi],q=(s-a.s)/(b.s-a.s);return {...curve(lerp(a.t,b.t,q)),wheels:a.wheels.map((v,i)=>lerp(v,b.wheels[i],q))};
}
const shiftedRoutes=new Map();
export function shiftedHandlingRoute(shift){
 if(shiftedRoutes.has(shift))return shiftedRoutes.get(shift);
 const points=controls.map(([x,z])=>[14+(x-14)*(2.8-shift)/2.8,z]),nodes=[{t:0,s:0,wheels:[0,0,0,0]}];let previous=curve(0,points);
 for(let i=1;i<=1000;i++){const t=i/1000,p=curve(t,points),ds=Math.hypot(p.x-previous.x,p.z-previous.z),last=nodes.at(-1),f=wheelFactors(curve(t-.0005,points).curvature);nodes.push({t,s:last.s+ds,wheels:last.wheels.map((v,k)=>v+ds*f[k])});previous=p;}
 const length=nodes.at(-1).s,endX=11.2+shift;
 const motion={length,endX,at(distance){const s=Math.max(0,distance);if(s>=length)return {x:endX,z:18.8+s-length,yaw:Math.PI/2,curvature:0,wheels:nodes.at(-1).wheels.map(v=>v+s-length)};let lo=0,hi=nodes.length-1;while(hi-lo>1){const mid=(lo+hi)>>1;if(nodes[mid].s<s)lo=mid;else hi=mid;}const a=nodes[lo],b=nodes[hi],q=(s-a.s)/(b.s-a.s);return {...curve(lerp(a.t,b.t,q),points),wheels:a.wheels.map((v,i)=>lerp(v,b.wheels[i],q))};}};shiftedRoutes.set(shift,motion);return motion;
}
// Integrated cubic velocity ramps: zero speed/acceleration at every stop.
export function travel(t,start,end,from,to){const T=end-start,r=Math.min(.55,T*.25),u=Math.max(0,Math.min(T,t-start)),v=(to-from)/(T-r),ramp=q=>q*q*q-.5*q*q*q*q;let d;if(u<r)d=v*r*ramp(u/r);else if(u>T-r)d=to-from-v*r*ramp((T-u)/r);else d=v*(u-r/2);return from+d;}
export function handlingFrame(seconds,{carry=carryLength,place=turnLength+5.2,retreat=returnLength,height=.8,motion=null}={}){
 const t=Math.max(0,Math.min(duration,seconds));let x=14,z=16,yaw=Math.PI,curvature=0,wheels=[0,0,0,0],fork=.1,tilt=0;
 const blend=(a,b,from,to)=>lerp(from,to,smooth((t-a)/(b-a)));
 if(t<8){
  if(t<1.8)x=travel(t,0,1.8,14,11.2);else if(t<2.3)x=11.2;else if(t<4.1)x=travel(t,2.3,4.1,11.2,10);else if(t<5.6)x=10;else if(t<7.6)x=travel(t,5.6,7.6,10,14);
  fork=t<1.8?.1:t<2.3?blend(1.8,2.3,.1,.05):t<4.1?.05:t<4.4?blend(4.1,4.4,.05,.065):t<5.2?blend(4.4,5.2,.065,.265):.265;
  tilt=t>=5.2?blend(5.2,5.6,0,Math.PI/72):0;wheels.fill(14-x);
 }else{
  let s=t<12.8?travel(t,8,12.8,0,carry):t<14?carry:t<16?travel(t,14,16,carry,place):t<17.2?place:t<19?travel(t,17.2,19,place,retreat):t<20?retreat:t<26?travel(t,20,26,retreat,0):0;
  ({x,z,yaw,curvature,wheels}=motion?motion.at(s):routePose(s));
  fork=t<12.8?.265:t<14?blend(12.8,14,.265,height+.145):t<16?height+.145:t<16.8?blend(16,16.8,height+.145,height+.065):t<17.2?blend(16.8,17.2,height+.065,height+.045):t<19?height+.045:t<20?blend(19,20,height+.045,.1):.1;
  tilt=t<12.8?Math.PI/72:t<14?blend(12.8,14,Math.PI/72,0):0;
 }
 const owner=t<4.4?'floor':t<16.8?'forks':'platform',q=fork-rigSpec.rootClearance-rigSpec.mastY;
 let load={x:9,z:16,bottom:0,yaw:Math.PI,tilt:0,owner};
 if(owner==='forks'){const anchorX=rigSpec.heelX+rigSpec.forkLength/2,anchorY=q+rigSpec.forkThickness-rigSpec.pocketTop,lx=rigSpec.mastX+Math.cos(tilt)*anchorX-Math.sin(tilt)*anchorY,ly=rigSpec.rootClearance+rigSpec.mastY+Math.sin(tilt)*anchorX+Math.cos(tilt)*anchorY;load={x:x+Math.cos(yaw)*lx,z:z+Math.sin(yaw)*lx,bottom:ly,yaw,tilt,owner};}
 if(owner==='platform')load={x:motion?.endX??11.2,z:19.8+place-(motion?.length??turnLength),bottom:height,yaw:Math.PI/2,tilt:0,owner};
 const steering=wheelZ.map((side,i)=>i<2?0:Math.atan2(-rigSpec.wheelbase*curvature,1-curvature*side));
 return {time:t,phase:phases.find(p=>t>=p.start&&t<p.end)?.label||phases.at(-1).label,pose:{x,z,yaw},fork,tilt,carriage:q,steering,wheels,spin:wheels.map((d,i)=>-d/(i<2?rigSpec.frontRadius:rigSpec.rearRadius)),load};
}
export function footprint(frame,bodyOnly=false){const {x,z,yaw}=frame.pose,c=Math.cos(yaw),s=Math.sin(yaw);return [[-2.1,-.65],[bodyOnly?.39:1.62,-.65],[bodyOnly?.39:1.62,.65],[-2.1,.65]].map(([a,b])=>({x:x+c*a-s*b,z:z+s*a+c*b}));}
export function wheelFootprints(frame){return frame.steering.map((angle,i)=>{const radius=i<2?rigSpec.frontRadius:rigSpec.rearRadius,axle=i<2?0:-rigSpec.wheelbase,side=(i%2?1:-1)*rigSpec.track/2;return [[-radius,-.09],[radius,-.09],[radius,.09],[-radius,.09]].map(([a,b])=>{const x=axle+Math.cos(angle)*a-Math.sin(angle)*b,z=side+Math.sin(angle)*a+Math.cos(angle)*b;return {x:frame.pose.x+Math.cos(frame.pose.yaw)*x-Math.sin(frame.pose.yaw)*z,z:frame.pose.z+Math.sin(frame.pose.yaw)*x+Math.cos(frame.pose.yaw)*z};});});}
