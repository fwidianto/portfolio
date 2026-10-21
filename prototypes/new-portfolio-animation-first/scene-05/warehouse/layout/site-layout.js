// Proposed physical exterior layout. Metres are synthetic game dimensions.
export const site={width:84,height:78,roadWidth:7,truckRadius:6,forkRadius:2.5};
export const buildings=[
 {id:'warehouse',name:'CUSTOMER WAREHOUSE',x:25,y:.8,w:42,h:34.2},
 {id:'workshop',name:'SERVICE WORKSHOP',x:3,y:10,w:16,h:22},
 {id:'office',name:'SERVICE OFFICE',x:3,y:1,w:16,h:7}
];
export const gates={entry:{x:84,y:57,width:7},exit:{x:84,y:71,width:7}};
export const docks={receiving:{x:35,y:43,yaw:Math.PI},dispatch:{x:57,y:43,yaw:Math.PI}};
export const bays=[{id:0,x:11,y:16,yaw:Math.PI},{id:1,x:11,y:29,yaw:Math.PI}];
export const connector={x:19,y:21,w:6,h:4,warehouseDoor:[25,23],workshopDoor:[19,23],crossingX:22};
export const line=(from,to)=>({kind:'line',from,to});
export const arc=(centre,radius,start,sweep)=>({kind:'arc',centre,radius,start,sweep});
const quarter=Math.PI/2;
export const entryRoad=[line([90,57],[76,57]),arc([76,51],6,quarter,quarter),line([70,51],[70,49]),arc([64,49],6,0,-quarter)];
export const westExit=[arc([12,49],6,-quarter,-quarter),line([6,49],[6,65]),arc([12,65],6,Math.PI,-quarter),line([12,71],[90,71])];
export const truckRoad=[...entryRoad,line([64,43],[12,43]),...westExit];
export const incomingToDispatch=[...entryRoad,line([64,43],[57,43])];
export const truckExit=key=>[line([docks[key].x,43],[12,43]),...westExit];
export const forkRoute=bay=>[
 line([25,23],[16.5,23]),
 bay===0?arc([16.5,20.5],2.5,quarter,quarter):arc([16.5,25.5],2.5,-quarter,-quarter),
 bay===0?line([14,20.5],[14,18.5]):line([14,25.5],[14,26.5]),
 bay===0?arc([11.5,18.5],2.5,0,-quarter):arc([11.5,26.5],2.5,0,quarter),
 line([11.5,bays[bay].y],[11,bays[bay].y])
];
export function pose(segment,t){
 if(segment.kind==='line'){const dx=segment.to[0]-segment.from[0],dy=segment.to[1]-segment.from[1];return {x:segment.from[0]+dx*t,y:segment.from[1]+dy*t,yaw:Math.atan2(dy,dx),curvature:0};}
 const angle=segment.start+segment.sweep*t;return {x:segment.centre[0]+segment.radius*Math.cos(angle),y:segment.centre[1]+segment.radius*Math.sin(angle),yaw:angle+Math.sign(segment.sweep)*quarter,curvature:Math.sign(segment.sweep)/segment.radius};
}
export function points(route,steps=100){return route.flatMap((segment,i)=>Array.from({length:steps+1},(_,n)=>pose(segment,n/steps)).slice(i?1:0));}
export function footprint(p,length,width,offset=0){const c=Math.cos(p.yaw),s=Math.sin(p.yaw);return [[-length/2,-width/2],[length/2,-width/2],[length/2,width/2],[-length/2,width/2]].map(([x,y])=>({x:p.x+(x+offset)*c-y*s,y:p.y+(x+offset)*s+y*c}));}
export function overlaps(a,b){
 for(const polygon of [a,b])for(let i=0;i<polygon.length;i++){const p=polygon[i],q=polygon[(i+1)%polygon.length],axis={x:q.y-p.y,y:p.x-q.x},A=a.map(v=>v.x*axis.x+v.y*axis.y),B=b.map(v=>v.x*axis.x+v.y*axis.y);if(Math.max(...A)<=Math.min(...B)||Math.max(...B)<=Math.min(...A))return false;}return true;
}
export const rectangle=(x,y,w,h)=>[{x,y},{x:x+w,y},{x:x+w,y:y+h},{x,y:y+h}];
export function distanceToRoute(p,route){
 return Math.min(...route.map(segment=>{
  const a=pose(segment,0),b=pose(segment,1),ends=Math.min(Math.hypot(p.x-a.x,p.y-a.y),Math.hypot(p.x-b.x,p.y-b.y));
  if(segment.kind==='line'){const dx=b.x-a.x,dy=b.y-a.y,u=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.y-a.y)*dy)/(dx*dx+dy*dy)));return Math.hypot(p.x-a.x-u*dx,p.y-a.y-u*dy);}
  const angle=Math.atan2(p.y-segment.centre[1],p.x-segment.centre[0]),delta=Math.atan2(Math.sin(angle-segment.start),Math.cos(angle-segment.start)),u=delta/segment.sweep;
  return u>=0&&u<=1?Math.min(ends,Math.abs(Math.hypot(p.x-segment.centre[0],p.y-segment.centre[1])-segment.radius)):ends;
 }));
}
