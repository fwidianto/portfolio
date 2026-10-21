import {RACKS} from '../../warehouse-model.js';
export const vehicle={rear:2.1,front:1.72,halfWidth:.65,wheelbase:1.6,track:1.06,maxCurvature:1.2};
export const trafficLanes={x:[28.8,40.4,51.6,62.4],z:[7.6,18.2,29.3],offset:1.05,hold:4.4};
const room=(x0,z0,x1,z1)=>({x0,z0,x1,z1});
const rooms=[room(25.22,1.02,66.78,34.78),room(4.45,10.22,18.78,31.78),room(18.75,21.05,25.25,24.95)];
export const rackBlocks=RACKS.map(r=>room(25.2+r.x*1.6-.07,4.6+r.y*1.6-.07,25.2+(r.x+r.w)*1.6+.07,4.6+(r.y+r.h)*1.6+.07));
// Leave a full reverse approach behind the north rack berths, inside the existing wall envelope.
export const parking=i=>({x:27.9+i*3.9,z:3.45,yaw:Math.PI/2});
export function physicalPorts(spots){
 return Object.fromEntries(spots.map(s=>{
  let x,z,yaw,support=.24;const i=Number(s.id.split('-').at(-1));
  if(s.type==='storage'){
   const [,r,slot]=s.id.split('-'),rack=rackBlocks[Number(r)],back=slot.startsWith('b'),n=Number(back?slot.slice(1):slot);
   x=rack.x0+.07+.8+n*1.6;z=back?rack.z1-.07-.6:rack.z0+.07+.6;yaw=back?-Math.PI/2:Math.PI/2;support=.61;
  }else if(s.type==='inbound'){x=65.8;z=9+i*1.9;yaw=0;}
  else if(s.type==='staging'){x=26.2;z=[7.8,9.5,11.2,12.9,14.6,16.3,18,27,28.7,30.4][i];yaw=Math.PI;}
  else{x=31.2+i*2.6;z=33.8;yaw=Math.PI/2;}
  const c=Math.cos(yaw),sn=Math.sin(yaw);
  return [s.id,{id:s.id,type:s.type,x,z,yaw,support,access:s.access,dock:{x:x-1.1*c,z:z-1.1*sn,yaw},approach:{x:x-2.46*c,z:z-2.46*sn,yaw}}];
 }));
}
export function envelope(p,{front=vehicle.front,rear=vehicle.rear,halfWidth=vehicle.halfWidth}={}){
 const c=Math.cos(p.yaw),s=Math.sin(p.yaw);return [[-rear,-halfWidth],[front,-halfWidth],[front,halfWidth],[-rear,halfWidth]].map(([x,z])=>({x:p.x+c*x-s*z,z:p.z+s*x+c*z}));
}
export function rectanglesOverlap(a,b){
 for(const ps of [a,b])for(let i=0;i<4;i++){
  const p=ps[i],q=ps[(i+1)%4],ax=q.z-p.z,az=p.x-q.x;
  let amin=Infinity,amax=-Infinity,bmin=Infinity,bmax=-Infinity;
  for(const p of a){const v=p.x*ax+p.z*az;amin=Math.min(amin,v);amax=Math.max(amax,v);}for(const p of b){const v=p.x*ax+p.z*az;bmin=Math.min(bmin,v);bmax=Math.max(bmax,v);}
  if(amax<=bmin+1e-7||bmax<=amin+1e-7)return false;
 }return true;
}
export const blockPolygon=b=>[{x:b.x0,z:b.z0},{x:b.x1,z:b.z0},{x:b.x1,z:b.z1},{x:b.x0,z:b.z1}];
const inside=p=>rooms.some(r=>p.x>=r.x0&&p.x<=r.x1&&p.z>=r.z0&&p.z<=r.z1);
function freePolygon(ps,obstacles){
 if(!ps.every(inside))return false;
 // Crossing a room boundary must use the real open connector, including the intervening edges.
 if(!rooms.some(r=>ps.every(p=>p.x>=r.x0&&p.x<=r.x1&&p.z>=r.z0&&p.z<=r.z1))){
  for(let i=0;i<4;i++){const a=ps[i],b=ps[(i+1)%4];for(const r of rooms)for(const [axis,value]of [['x',r.x0],['x',r.x1],['z',r.z0],['z',r.z1]]){const t=(value-a[axis])/(b[axis]-a[axis]);if(t>0&&t<1&&!inside({x:a.x+(b.x-a.x)*t,z:a.z+(b.z-a.z)*t}))return false;}}
 }
 const minX=Math.min(...ps.map(p=>p.x)),maxX=Math.max(...ps.map(p=>p.x)),minZ=Math.min(...ps.map(p=>p.z)),maxZ=Math.max(...ps.map(p=>p.z));
 for(const b of obstacles){if(maxX<=b.x0||minX>=b.x1||maxZ<=b.z0||minZ>=b.z1)continue;if(rectanglesOverlap(ps,b.polygon||blockPolygon(b)))return false;}
 return true;
}
function freeRectangle(x,z,c,s,halfLength,halfWidth,obstacles){
 const dx=halfLength*Math.abs(c)+halfWidth*Math.abs(s),dz=halfLength*Math.abs(s)+halfWidth*Math.abs(c),x0=x-dx,x1=x+dx,z0=z-dz,z1=z+dz;let points=null;
 const vertices=()=>points||=( [[-halfLength,-halfWidth],[halfLength,-halfWidth],[halfLength,halfWidth],[-halfLength,halfWidth]].map(([a,b])=>({x:x+c*a-s*b,z:z+s*a+c*b})) );
 let insideRoom=false;
 for(const r of rooms)if(x0>=r.x0&&x1<=r.x1&&z0>=r.z0&&z1<=r.z1){if(Math.min(x0-r.x0,r.x1-x1,z0-r.z0,r.z1-z1)<1e-7)return freePolygon(vertices(),obstacles);insideRoom=true;break;}
 if(!insideRoom)return freePolygon(vertices(),obstacles);
 for(const b of obstacles){
  if(x1<=b.x0||x0>=b.x1||z1<=b.z0||z0>=b.z1)continue;
  if(b.polygon){if(rectanglesOverlap(vertices(),b.polygon))return false;continue;}
  const bx=(b.x0+b.x1)/2-x,bz=(b.z0+b.z1)/2-z,hx=(b.x1-b.x0)/2,hz=(b.z1-b.z0)/2;
  const a=Math.abs(bx*c+bz*s)-(halfLength+hx*Math.abs(c)+hz*Math.abs(s)),d=Math.abs(-bx*s+bz*c)-(halfWidth+hx*Math.abs(s)+hz*Math.abs(c));
  if(Math.abs(a)<1e-6||Math.abs(d)<1e-6){if(rectanglesOverlap(vertices(),blockPolygon(b)))return false;}
  else if(a<0&&d<0)return false;
 }
 return true;
}
export function freePose(p,obstacles,shape=null,clearance=0){
 const rear=(shape?.rear??vehicle.rear)+clearance,front=(shape?.front??vehicle.front)+clearance,width=(shape?.halfWidth??vehicle.halfWidth)+clearance,c=Math.cos(p.yaw),s=Math.sin(p.yaw),offset=(front-rear)/2;
 if(!freeRectangle(p.x+offset*c,p.z+offset*s,c,s,(front+rear)/2,width,obstacles))return false;
 const k=p.k||0;if(shape)return true;
 if(Math.abs(k)<1e-12){const x=p.x+offset*c,z=p.z+offset*s,dx=(front+rear)/2*Math.abs(c)+width*Math.abs(s),dz=(front+rear)/2*Math.abs(s)+width*Math.abs(c);if(rooms.some(r=>x-dx>r.x0+1e-7&&x+dx<r.x1-1e-7&&z-dz>r.z0+1e-7&&z+dz<r.z1-1e-7))return true;}
 for(const side of [-.53,.53]){const steer=Math.atan2(-1.6*k,1-side*k),ca=Math.cos(steer),sa=Math.sin(steer),wc=c*ca-s*sa,ws=s*ca+c*sa;if(!freeRectangle(p.x-1.6*c-side*s,p.z-1.6*s+side*c,wc,ws,.29+clearance,.09+clearance,obstacles))return false;}
 return true;
}
export function obstaclesFor(ports,others=[],occupied=null,clearance=0){
 const ground=Object.values(ports).filter(p=>p.type!=='storage'&&(!occupied||occupied.has(p.id))).map(p=>{const east=Math.abs(Math.cos(p.yaw))>.5;return room(p.x-(east?.6:.5),p.z-(east?.5:.6),p.x+(east?.6:.5),p.z+(east?.5:.6));});
 return [...rackBlocks,...ground,...others.map(p=>{const polygon=envelope(p,{rear:vehicle.rear+clearance,front:vehicle.front+clearance,halfWidth:vehicle.halfWidth+clearance});return {x0:Math.min(...polygon.map(p=>p.x)),x1:Math.max(...polygon.map(p=>p.x)),z0:Math.min(...polygon.map(p=>p.z)),z1:Math.max(...polygon.map(p=>p.z)),polygon};})];
}
