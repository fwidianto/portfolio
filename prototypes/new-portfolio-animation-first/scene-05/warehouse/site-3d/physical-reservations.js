import {envelope,rectanglesOverlap} from './physical-space.js';
export const boxesOverlap=(a,b)=>a.x1>b.x0&&a.x0<b.x1&&a.z1>b.z0&&a.z0<b.z1&&rectanglesOverlap(a.polygon,b.polygon);
export function swept(points,shape={rear:2.23,front:1.85,halfWidth:.98}){
 const boxes=[];let last=null;for(const p of points){if(last&&Math.hypot(p.x-last.x,p.z-last.z)<.055&&Math.abs(p.yaw-last.yaw)<.03)continue;const polygon=envelope(p,shape);boxes.push({polygon,x0:Math.min(...polygon.map(p=>p.x)),x1:Math.max(...polygon.map(p=>p.x)),z0:Math.min(...polygon.map(p=>p.z)),z1:Math.max(...polygon.map(p=>p.z)),...(Number.isFinite(p.time)?{time:p.time}:{})});last=p;}return boxes;
}
const bounds=new WeakMap();
function suffixBounds(boxes){
 if(bounds.has(boxes))return bounds.get(boxes);const result=Array(boxes.length+1);result[boxes.length]={x0:Infinity,x1:-Infinity,z0:Infinity,z1:-Infinity};for(let i=boxes.length-1;i>=0;i--){const a=boxes[i],b=result[i+1];result[i]={x0:Math.min(a.x0,b.x0),x1:Math.max(a.x1,b.x1),z0:Math.min(a.z0,b.z0),z1:Math.max(a.z1,b.z1)};}bounds.set(boxes,result);return result;
}
export function reserveConflict(a,b,from=0){
 if(!a.length||from>=b.length)return false;const ab=suffixBounds(a)[0],bb=suffixBounds(b)[from];if(ab.x1<=bb.x0||ab.x0>=bb.x1||ab.z1<=bb.z0||ab.z0>=bb.z1)return false;
 const hash=new Map();for(let i=from;i<b.length;i++){const box=b[i];if(box.x1<=ab.x0||box.x0>=ab.x1||box.z1<=ab.z0||box.z0>=ab.z1)continue;for(let x=Math.floor(box.x0/4);x<=Math.floor(box.x1/4);x++)for(let z=Math.floor(box.z0/4);z<=Math.floor(box.z1/4);z++){const key=x+':'+z;if(!hash.has(key))hash.set(key,[]);hash.get(key).push(box);}}
 for(const box of a){const seen=new Set();for(let x=Math.floor(box.x0/4);x<=Math.floor(box.x1/4);x++)for(let z=Math.floor(box.z0/4);z<=Math.floor(box.z1/4);z++)for(const other of hash.get(x+':'+z)||[]){if(seen.has(other))continue;seen.add(other);if(boxesOverlap(box,other))return true;}}
 return false;
}
