import {freePose as geometryFreePose,vehicle,rackBlocks,trafficLanes} from './physical-space.js';
const freePose=(p,space,shape)=>geometryFreePose(p,space.obstacles||space,shape||space.shape||null,shape?0:.035);
const wrap=a=>Math.atan2(Math.sin(a),Math.cos(a)),blend=t=>t*t*t*(10+t*(-15+6*t));
class Heap{
 constructor(){this.items=[];}
 push(n){let i=this.items.length;this.items.push(n);while(i){const p=(i-1)>>1;if(this.items[p].f<=n.f)break;this.items[i]=this.items[p];i=p;}this.items[i]=n;}
 pop(){const root=this.items[0],last=this.items.pop();if(this.items.length){let i=0;while(i*2+1<this.items.length){let c=i*2+1;if(c+1<this.items.length&&this.items[c+1].f<this.items[c].f)c++;if(this.items[c].f>=last.f)break;this.items[i]=this.items[c];i=c;}this.items[i]=last;}return root;}
}
function connector(a,b,gear,obstacles){
 const d=Math.hypot(b.x-a.x,b.z-a.z);if(d<1e-7&&Math.abs(wrap(b.yaw-a.yaw))<1e-7)return [];
 for(const factor of [.8,1.25,1.8,2.5]){
  const v0={x:gear*Math.cos(a.yaw)*d*factor,z:gear*Math.sin(a.yaw)*d*factor},v1={x:gear*Math.cos(b.yaw)*d*factor,z:gear*Math.sin(b.yaw)*d*factor},cs={};
  for(const axis of ['x','z']){const D=b[axis]-a[axis];cs[axis]=[a[axis],v0[axis],10*D-6*v0[axis]-4*v1[axis],-15*D+8*v0[axis]+7*v1[axis],6*D-3*v0[axis]-3*v1[axis]];}
  const points=[];let valid=true,last=a;
  const steps=Math.max(30,Math.ceil(d*factor/.045));
  for(let i=1;i<=steps;i++){
   const t=i/steps,values={};for(const axis of ['x','z']){const [p,v,c3,c4,c5]=cs[axis];values[axis]=p+v*t+c3*t**3+c4*t**4+c5*t**5;values['d'+axis]=v+3*c3*t*t+4*c4*t**3+5*c5*t**4;values['dd'+axis]=6*c3*t+12*c4*t*t+20*c5*t**3;}
   const speed=Math.hypot(values.dx,values.dz),k=gear*(values.dx*values.ddz-values.dz*values.ddx)/speed**3,yaw=last.yaw+wrap(Math.atan2(values.dz,values.dx)+(gear<0?Math.PI:0)-last.yaw),p={x:values.x,z:values.z,yaw,k,gear};
   if(!Number.isFinite(k)||Math.abs(k)>vehicle.maxCurvature||!freePose(p,obstacles)){valid=false;break;}points.push(p);last=p;
  }
  if(valid)return points;
 }return null;
}
function primitive(node,nextK,gear,obstacles,steps=10){
 const points=[],yawAt=q=>node.pose.yaw+gear*.65*(node.k*q+(nextK-node.k)*(2.5*q**4-3*q**5+q**6)),gauss=[[-.8611363115940526,.3478548451374538],[-.3399810435848563,.6521451548625461],[.3399810435848563,.6521451548625461],[.8611363115940526,.3478548451374538]];let p=node.pose;
 for(let i=1;i<=steps;i++){
  const mid=(i-.5)/steps,half=.5/steps;let dx=0,dz=0;for(const [q,w]of gauss){const yaw=yawAt(mid+q*half);dx+=w*Math.cos(yaw);dz+=w*Math.sin(yaw);}
  p={x:p.x+gear*.65*half*dx,z:p.z+gear*.65*half*dz,yaw:yawAt(i/steps),k:node.k+(nextK-node.k)*blend(i/steps),gear};
  if(obstacles&&!freePose(p,obstacles))return null;points.push(p);
 }points.meta={start:node.pose,k:node.k,nextK,gear};return points;
}
function distanceField(goal,obstacles){
 const cell=.6,w=114,h=60,dist=new Float64Array(w*h).fill(Infinity),blocked=new Uint8Array(w*h),heap=new Heap();
 for(let z=0;z<h;z++)for(let x=0;x<w;x++){const px=x*cell,pz=z*cell;blocked[z*w+x]=Number(!freePose({x:px,z:pz,yaw:0},obstacles,{rear:.45,front:.45,halfWidth:.45}));}
 const gx=Math.max(0,Math.min(w-1,Math.round(goal.x/cell))),gz=Math.max(0,Math.min(h-1,Math.round(goal.z/cell))),id=gz*w+gx;dist[id]=0;heap.push({id,f:0});
 while(heap.items.length){const n=heap.pop();if(n.f!==dist[n.id])continue;const x=n.id%w,z=Math.floor(n.id/w);for(const [dx,dz]of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]){const xx=x+dx,zz=z+dz;if(xx<0||xx>=w||zz<0||zz>=h)continue;const i=zz*w+xx;if(blocked[i]||dx&&dz&&(blocked[z*w+xx]||blocked[zz*w+x]))continue;const d=n.f+Math.hypot(dx,dz)*cell;if(d<dist[i]){dist[i]=d;heap.push({id:i,f:d});}}}
 return p=>{const x=Math.round(p.x/cell),z=Math.round(p.z/cell),d=dist[z*w+x];return Number.isFinite(d)?d:Math.hypot(p.x-goal.x,p.z-goal.z)+15;};
}
const laneGraphs=new Map();
function laneGraph(shape){
 const key=JSON.stringify(shape);if(laneGraphs.has(key))return laneGraphs.get(key);
 const space={obstacles:rackBlocks,shape},nodes=[];
 for(const x of trafficLanes.x)for(const z of trafficLanes.z){const cross=x+':'+z;for(const offset of [-trafficLanes.hold,trafficLanes.hold])for(const yaw of [0,Math.PI]){const pose={x:x+offset,z:z-trafficLanes.offset*Math.cos(yaw),yaw,k:0};if(freePose(pose,space))nodes.push({pose,cross,edges:[]});}for(const offset of [-trafficLanes.hold,trafficLanes.hold])for(const yaw of [-Math.PI/2,Math.PI/2]){const pose={x:x+trafficLanes.offset*Math.sin(yaw),z:z+offset,yaw,k:0};if(freePose(pose,space))nodes.push({pose,cross,edges:[]});}}
 for(let i=0;i<nodes.length;i++)for(let j=0;j<nodes.length;j++){
  if(i===j)continue;const a=nodes[i],b=nodes[j],distance=Math.hypot(b.pose.x-a.pose.x,b.pose.z-a.pose.z),same=Math.abs(wrap(a.pose.yaw-b.pose.yaw))<1e-6,straight=same&&(Math.abs(a.pose.x-b.pose.x)<1e-6||Math.abs(a.pose.z-b.pose.z)<1e-6);
  if(distance<.05||distance>14||!straight&&a.cross!==b.cross||Math.abs(wrap(a.pose.yaw-b.pose.yaw))>Math.PI*.51)continue;
  const forward=(b.pose.x-a.pose.x)*Math.cos(a.pose.yaw)+(b.pose.z-a.pose.z)*Math.sin(a.pose.yaw),gears=straight?(forward>0?[1]:[]):[1];
  for(const gear of gears){const points=connector(a.pose,b.pose,gear,space);if(!points)continue;let length=0,previous=a.pose;for(const p of points){length+=Math.hypot(p.x-previous.x,p.z-previous.z);previous=p;}if(points.length)points.at(-1).holding=true;a.edges.push({to:j,points,gear,cost:length*(gear<0?1.2:1)+.15});break;}
 }
 laneGraphs.set(key,nodes);return nodes;
}
export function physicalHoldingPoints(pose){return laneGraph(null).map(n=>n.pose).filter(p=>Math.hypot(p.x-pose.x,p.z-pose.z)<10).sort((a,b)=>Math.hypot(a.x-pose.x,a.z-pose.z)-Math.hypot(b.x-pose.x,b.z-pose.z));}
function dockTurns(start,space){const turns=[];for(const sign of [-1,1]){
  const k=sign*1.2,points=[{...start,k:0,gear:-1},{...start,k:k/2,gear:-1},{...start,k,gear:-1}],distance=Math.PI/(2*Math.abs(k));let clear=points.every(p=>freePose(p,space));
  for(let d=.02;clear&&d<distance+.02;d+=.02){const travel=Math.min(distance,d),yaw=start.yaw-travel*k,p={x:start.x+(Math.sin(yaw)-Math.sin(start.yaw))/k,z:start.z+(Math.cos(start.yaw)-Math.cos(yaw))/k,yaw,k,gear:-1};if(!freePose(p,space)){clear=false;break;}points.push(p);}
  if(!clear)continue;const end=points.at(-1);points.push({...end,k:k/2},{...end,k:0});turns.push(points);
 }return turns;}
function* lanePath(start,goal,space){
 let work=0;
 const nodes=laneGraph(space.shape),near=(pose,radius=8,limit=24)=>nodes.map((n,id)=>({id,d:Math.hypot(n.pose.x-pose.x,n.pose.z-pose.z)})).sort((a,b)=>a.d-b.d).filter(n=>n.d<radius).slice(0,limit),starts=near(start),ends=new Map(),heap=new Heap(),seen=new Map(),edgeClear=new Map();
 const destinations=[{pose:goal,tail:[]},...dockTurns(goal,space).map(points=>({pose:points.at(-1),tail:points.map(p=>({...p,gear:-p.gear})).reverse()}))];
 for(const destination of destinations)for(const {id} of near(destination.pose,14,48)){if(!ends.has(id))ends.set(id,[]);ends.get(id).push(destination);}
 for(const {id} of (space.docked&&!space.shape?[]:starts))for(const gear of (space.shape?[1,-1]:[1])){if(++work%4===0)yield;const points=connector(start,nodes[id].pose,gear,space);if(!points)continue;if(points.length)points.at(-1).holding=true;const cost=Math.hypot(start.x-nodes[id].pose.x,start.z-nodes[id].pose.z)*(gear<0?1.2:1);heap.push({id,g:cost,f:cost+Math.hypot(nodes[id].pose.x-goal.x,nodes[id].pose.z-goal.z),parent:null,points:[{...start,k:0,gear},...points]});break;}
 if(space.docked)for(const points of dockTurns(start,space)){
  const pose=points.at(-1),distance=Math.PI/2/1.2;
  for(const {id} of near(pose))for(const gear of (space.shape?[1,-1]:[1])){if(++work%4===0)yield;const tail=connector(pose,nodes[id].pose,gear,space);if(!tail)continue;if(tail.length)tail.at(-1).holding=true;const g=distance*1.2+6+Math.hypot(pose.x-nodes[id].pose.x,pose.z-nodes[id].pose.z);heap.push({id,g,f:g+Math.hypot(nodes[id].pose.x-goal.x,nodes[id].pose.z-goal.z),parent:null,points:[...points,...tail]});break;}
 }
 let expanded=0;
 while(heap.items.length){if(++work%4===0)yield;const n=heap.pop();if((seen.get(n.id)??Infinity)<=n.g)continue;seen.set(n.id,n.g);expanded++;const node=nodes[n.id];
  if(ends.has(n.id))for(const destination of ends.get(n.id))for(const gear of (space.shape||space.goalReverse?[1,-1]:[1])){if(++work%4===0)yield;const tail=connector(node.pose,destination.pose,gear,space);if(!tail)continue;const chunks=[[...tail,...destination.tail]];for(let p=n;p;p=p.parent)chunks.push(p.points);return {ok:true,points:chunks.reverse().flat(),expanded,method:'aisles'};}
  for(const edge of node.edges){if(++work%4===0)yield;const key=n.id+':'+edge.to;if(!edgeClear.has(key))edgeClear.set(key,edge.points.every(p=>freePose(p,space)));if(!edgeClear.get(key))continue;const g=n.g+edge.cost;if((seen.get(edge.to)??Infinity)<=g)continue;const p=nodes[edge.to].pose;heap.push({id:edge.to,g,f:g+Math.hypot(p.x-goal.x,p.z-goal.z),parent:n,points:edge.points});}
 }
 return null;
}
function* searchPhysicalPath(start,goal,obstacles,maxNodes,lanes=false){
 if(!freePose(start,obstacles)||!freePose(goal,obstacles))return {ok:false,reason:'Occupied start or destination',expanded:0};
 if(lanes&&obstacles.goalReverse)for(const gear of [1,-1]){const direct=connector(start,goal,gear,obstacles);if(direct)return {ok:true,points:[{...start,k:0,gear},...direct],expanded:0};}
 if(lanes){const aisle=yield* lanePath(start,goal,obstacles);if(aisle)return aisle;if(lanes==='traffic')return {ok:false,reason:'Aisle connection temporarily blocked',expanded:0};}
 for(const gear of [1,-1]){const direct=connector(start,goal,gear,obstacles);if(direct)return {ok:true,points:[{...start,k:0,gear},...direct],expanded:0};}
 const heuristic=distanceField(goal,obstacles),heap=new Heap(),seen=new Map(),ks=[-1.2,-.6,0,.6,1.2];
 const root={pose:{...start,k:0,gear:1},k:0,ki:2,gear:1,g:0,f:heuristic(start),parent:null};heap.push(root);let expanded=0;
 while(heap.items.length&&expanded<maxNodes){
  const n=heap.pop(),key=[Math.round(n.pose.x/.3),Math.round(n.pose.z/.3),Math.round(wrap(n.pose.yaw)/(Math.PI/16)),n.ki,n.gear].join(':');
  if((seen.get(key)??Infinity)<=n.g)continue;seen.set(key,n.g);expanded++;if(expanded%64===0)yield;
  if(n.ki===2&&Math.hypot(n.pose.x-goal.x,n.pose.z-goal.z)<5){
   for(const gear of [n.gear,-n.gear]){const end=connector(n.pose,goal,gear,obstacles);if(!end)continue;const chunks=[end];for(let p=n;p.parent;p=p.parent)chunks.push(p.chunk);return {ok:true,points:[{...start,k:0,gear:chunks.at(-1)?.[0]?.gear||1},...chunks.reverse().flatMap(chunk=>chunk.meta?primitive({pose:chunk.meta.start,k:chunk.meta.k},chunk.meta.nextK,chunk.meta.gear,null,65):chunk)],expanded};}
  }
  // Steering at rest changes the wheel joints, never the vehicle heading.
  for(const ki of [n.ki-1,n.ki+1].filter(i=>i>=0&&i<ks.length)){
   const pose={...n.pose,k:ks[ki]},g=n.g+1.1;
   if(!freePose(pose,obstacles))continue;
   heap.push({pose,k:ks[ki],ki,gear:n.gear,g,f:g+1.6*heuristic(pose)+.25*Math.abs(wrap(pose.yaw-goal.yaw)),parent:n,chunk:[pose]});
  }
  for(let ki=Math.max(0,n.ki-1);ki<=Math.min(4,n.ki+1);ki++)for(const gear of [n.gear,-n.gear]){
   const chunk=primitive(n,ks[ki],gear,obstacles);if(!chunk)continue;const pose=chunk.at(-1),g=n.g+.65*(gear<0?1.25:1)+(gear!==n.gear?1.5:0)+Math.abs(ks[ki])*.04;
   heap.push({pose,k:ks[ki],ki,gear,g,f:g+1.6*heuristic(pose)+.25*Math.abs(wrap(pose.yaw-goal.yaw)),parent:n,chunk});
  }
 }return {ok:false,reason:'No cleared manoeuvre found within search budget',expanded};
}
function* physicalSearch(start,goal,obstacles,{maxNodes=24000,shape=null,lanes=false,docked=false,goalReverse=false}={}){
 // Tight rack approaches can be easier to solve outward. Share the same total
 // search budget between directions; reversing a route preserves chassis poses.
 const space={obstacles,shape,docked,goalReverse},forwardBudget=Math.ceil(maxNodes/2),forward=yield* searchPhysicalPath(start,goal,space,forwardBudget,lanes);
 // Retain a conservative rejection when the lattice is exhausted; avoid another costly search.
 if(forward.ok||forward.expanded<forwardBudget)return forward;
 const reverse=yield* searchPhysicalPath(goal,start,space,maxNodes-forward.expanded,lanes);
 if(!reverse.ok)return {...reverse,expanded:forward.expanded+reverse.expanded};
 const points=reverse.points.map((p,i,all)=>({...p,gear:-(all[i+1]||p).gear})).reverse();
 return {ok:true,points,expanded:forward.expanded+reverse.expanded};
}
export function planPhysicalPath(start,goal,obstacles,options){const iterator=physicalSearch(start,goal,obstacles,options);let next;do{next=iterator.next();}while(!next.done);return next.value;}
const searches=new WeakMap();
export function advancePhysicalSearch(data,progress){
 let entry=searches.get(data);if(!entry){entry={iterator:physicalSearch(data.start,data.goal,data.obstacles,data.options)};for(let i=0;i<progress.quanta;i++)if(entry.iterator.next().done)throw Error('Invalid route-search checkpoint.');searches.set(data,entry);}
 const next=entry.iterator.next();progress.quanta++;return next.done?next.value:null;
}
function geometryBetween(a,b,t){
 const lerp=(x,y)=>x+(y-x)*t,ds=Math.hypot(b.x-a.x,b.z-a.z);let x=lerp(a.x,b.x),z=lerp(a.z,b.z),yaw=lerp(a.yaw,b.yaw),k=lerp(a.k,b.k);
 if(ds>1e-8){
  const result={};
  for(const axis of ['x','z']){
   const ca=axis==='x'?Math.cos(a.yaw):Math.sin(a.yaw),cb=axis==='x'?Math.cos(b.yaw):Math.sin(b.yaw),na=axis==='x'?-Math.sin(a.yaw):Math.cos(a.yaw),nb=axis==='x'?-Math.sin(b.yaw):Math.cos(b.yaw),v0=b.gear*ca*ds,v1=b.gear*cb*ds,c2=a.k*na*ds*ds/2,D=b[axis]-a[axis]-v0-c2,V=v1-v0-2*c2,A=b.k*nb*ds*ds-2*c2,c3=10*D-4*V+A/2,c4=-15*D+7*V-A,c5=6*D-3*V+A/2;
   result[axis]=a[axis]+v0*t+c2*t*t+c3*t**3+c4*t**4+c5*t**5;result['d'+axis]=v0+2*c2*t+3*c3*t*t+4*c4*t**3+5*c5*t**4;result['dd'+axis]=2*c2+6*c3*t+12*c4*t*t+20*c5*t**3;
  }
  x=result.x;z=result.z;yaw=a.yaw+wrap(Math.atan2(result.dz,result.dx)+(b.gear<0?Math.PI:0)-a.yaw);k=b.gear*(result.dx*result.ddz-result.dz*result.ddx)/Math.hypot(result.dx,result.dz)**3;
 }
 return {x,z,yaw,k};
}
export function timePhysicalPath(points,{loaded=false,speedLimit=null,wheelbase=1.6}={}){
 const expanded=[];for(const p of points){let previous=expanded.at(-1);if(previous&&p.gear!==previous.gear){expanded.push({...previous,gear:p.gear});previous=expanded.at(-1);}if(previous){const steps=Math.max(1,Math.ceil(Math.hypot(p.x-previous.x,p.z-previous.z)/.012));for(let i=1;i<steps;i++)expanded.push({...geometryBetween(previous,p,i/steps),gear:p.gear});}expanded.push(p);}
 let heading=expanded[0].yaw;const nodes=expanded.map(p=>{heading+=wrap(p.yaw-heading);return {...p,yaw:heading,s:0,v:0,time:0,roll:[0,0,0,0]};});
 for(let i=1;i<nodes.length;i++)nodes[i].s=nodes[i-1].s+Math.hypot(nodes[i].x-nodes[i-1].x,nodes[i].z-nodes[i-1].z);
 const steering=p=>[-.53,.53].map(z=>Math.atan2(-wheelbase*p.k,1-z*p.k));
 nodes.forEach((p,i)=>{const a=nodes[Math.max(0,i-1)],b=nodes[Math.min(nodes.length-1,i+1)],before=p.s-a.s,after=b.s-p.s,here=steering(p),rate=Math.max(0,...here.map((v,j)=>Math.max(before?Math.abs(v-steering(a)[j])/before:0,after?Math.abs(steering(b)[j]-v)/after:0)))*1.2;p.limit=Math.min(speedLimit??(loaded?1.1:1.6),Math.sqrt(.7/Math.max(.01,Math.abs(p.k))),rate?.7/rate:Infinity);if(i&&(p.gear!==a.gear||p.s-a.s<1e-8))p.limit=a.limit=0;});
 nodes[0].limit=nodes.at(-1).limit=0;
 for(let i=1;i<nodes.length;i++)nodes[i].v=Math.min(nodes[i].limit,Math.sqrt(nodes[i-1].v**2+1.1*(nodes[i].s-nodes[i-1].s)));
 for(let i=nodes.length-2;i>=0;i--)nodes[i].v=Math.min(nodes[i].v,nodes[i].limit,Math.sqrt(nodes[i+1].v**2+1.1*(nodes[i+1].s-nodes[i].s)));
 for(let i=1;i<nodes.length;i++){
  const a=nodes[i-1],p=nodes[i],ds=p.s-a.s,k=(p.k+a.k)/2,denom=p.v+a.v;p.time=a.time+(ds<1e-8?Math.abs(p.k-a.k)*(wheelbase+.2)/.7+.15:denom?2*ds/denom:2*Math.sqrt(ds/.55));
  p.roll=a.roll.map((v,j)=>v+ds*p.gear*(j<2?1-k*(j%2?.53:-.53):Math.hypot(1-k*(j%2?.53:-.53),1.6*k)));
 }return {nodes,duration:nodes.at(-1).time};
}
export function physicalPathPose(path,time){
 const ns=path.nodes;let lo=0,hi=ns.length-1;while(hi-lo>1){const m=(lo+hi)>>1;if(ns[m].time<=time)lo=m;else hi=m;}const a=ns[lo],b=ns[hi],T=b.time-a.time||1,r=Math.max(0,Math.min(1,(time-a.time)/T)),dt=r*T,ds=b.s-a.s,triangle=ds>1e-8&&a.v+b.v<1e-8,t=ds>1e-8?triangle?(r<.5?.55*dt*dt/(2*ds):1-.55*(T-dt)**2/(2*ds)):Math.max(0,Math.min(1,(a.v*dt+.5*(b.v-a.v)/T*dt*dt)/ds)):r,lerp=(x,y)=>x+(y-x)*t;
 const {x,z,yaw,k}=geometryBetween(a,b,t);
 return {x,z,yaw,k,roll:a.roll.map((v,i)=>lerp(v,b.roll[i])),speed:triangle?.55*Math.min(dt,T-dt):a.v+(b.v-a.v)*r};
}
