import {box,plane,range,mix,clamp,roundedBox,cylinderBetween,ellipsoid} from './space.js';

export const SCREEN = [[.415,6.695,-2.103],[3.585,6.695,-2.103],[3.585,4.915,-2.103],[.415,4.915,-2.103]];
export const FACADE_LOGO = [[-9.35,7.13,4.092],[-3.25,7.13,4.092],[-3.25,4.27,4.092],[-9.35,4.27,4.092]];
export const WORKSTATION_CAMERA = {eye:[-2.6,6.85,3.5],target:[1.65,5.45,-1.65]};
export const CONTACT_SHADOWS=[
  {x:2,y:.29,z:-4,rx:15,rz:13},
  ...[-20,-15,20,25].map(x=>({x:x+1,y:.27,z:12,rx:1.4,rz:2.6})),
  ...[-4,0,5,9].map(x=>({x:x+1.6,y:4.036,z:.48,rx:.9,rz:.7})),
  ...[-13,17].map(x=>({x:x+.6,y:.27,z:4.4,rx:1.05,rz:.9}))
].map(s=>[[s.x-s.rx,s.y,s.z-s.rz],[s.x+s.rx,s.y,s.z-s.rz],[s.x+s.rx,s.y,s.z+s.rz],[s.x-s.rx,s.y,s.z+s.rz]]);
const concrete = ['#33414b','#202b34','#47525a'];
const pale = ['#53606a','#35414b','#667179'];
const dark = ['#19232d','#121a22','#2b3742'];
const wood = ['#73624b','#4b4338','#a18b68'];

export function buildScene() {
  const faces = [], add = (...args) => faces.push(...box(...args));
  const rounded=(...args)=>faces.push(...roundedBox(...args));
  const tube=(...args)=>faces.push(...cylinderBetween(...args));
  const oval=(...args)=>faces.push(...ellipsoid(...args));
  faces.push({...plane([[-50000,-.08,50000],[50000,-.08,50000],[50000,-.08,-50000],[-50000,-.08,-50000]], '#142028'),background:true});
  // One isolated office, with a quiet arrival road and forecourt.
  add(-100,.01,34,200,.025,14,dark);
  add(-100,.04,19,200,.08,1.4,concrete);
  for(let x=-100;x<100;x+=7) add(x,.05,27,.13,.02,3,['#657070','#657070','#657070']);
  add(-28,.1,17,64,.15,43,['#202a30','#202a30','#283239']);
  faces.push(plane([[-7,.258,17],[5,.258,17],[3.5,.258,8.5],[-5.5,.258,8.5]],'#47535a'));
  faces.push(plane([[-7,.260,17],[-6.92,.260,17],[-5.42,.260,8.5],[-5.5,.260,8.5]],'#758087'));
  faces.push(plane([[4.92,.260,17],[5,.260,17],[3.5,.260,8.5],[3.42,.260,8.5]],'#758087'));
  faces.push(plane([[-10,.28,4],[14,.28,4],[20,.28,-20],[-5,.28,-23]],'#101921'));
  // Main facility: a real roof, wings, back, and open framed second-floor facade.
  add(-10,0,4,24,4,17,concrete);
  add(-10,4,-12.6,24,4,.4,concrete);
  add(-10,4,4,.4,4,17,pale); add(13.6,4,4,.4,4,17,concrete);
  add(-10,7.8,4,24,.35,17,pale);
  add(-10,4.0,4.04,24,.42,.2,pale);
  add(-10,7.45,4.04,24,.36,.2,pale);
  add(-10,8.15,4.18,24,.2,.22,concrete);
  add(-10,8.15,4.18,.2,.2,17.3,concrete);
  add(13.8,8.15,4.18,.2,.2,17.3,concrete);
  add(-10,.1,4.1,24,.24,.22,dark);
  // One continuous plaster facade receives the brand decal; no separate signboard.
  faces.push(plane([[-9.76,4.05,4.089],[-2.02,4.05,4.089],[-2.02,7.44,4.089],[-9.76,7.44,4.089]],'#d3d5d0'));
  add(-9.90,4.12,4.16,.10,3.22,.06,['#9a2d35','#70232a','#b33d43']);
  add(-2.05,4.12,4.16,.08,3.22,.06,pale);
  for (let x=-10; x<14; x+=4) {
    if(x!==-6&&x!==2) add(x,4.4,4.08,.25,3.05,.25,pale);
    if(x>2) faces.push(plane([[x+.26,4.45,4],[x+3.97,4.45,4],[x+3.97,7.45,4],[x+.26,7.45,4]], '#1e3542'));
    add(x,1.0,4.05,3.4,2.2,.06,['#172d39','#172d39','#172d39']);
    add(x+1.65,1.02,4.13,.06,2.16,.07,pale);
    add(x+.10,2.08,4.14,3.18,.045,.05,concrete);
    if(x>2) add(x+1.96,4.45,4.12,.05,3,.07,concrete);
    if(x>2)faces.push(plane([[x+.45,4.57,4.018],[x+.9,4.57,4.018],[x+2.75,7.3,4.018],[x+2.3,7.3,4.018]],'#334b58'));
  }
  for(let z=-12;z<4;z+=1.1) add(-10.04,4.35,z,.05,3.2,.06,concrete);
  // Amber lintel carries the focal point from the geographic hub to the office.
  add(-2,7.48,4.16,8,.07,.09,['#c99a58','#ad7841','#d3aa6a']);
  add(-10,8.15,-9,24,.18,3,['#3b464e','#2a343c','#53616b']);
  for(let x=-7;x<12;x+=5){
    rounded(x,8.15,-6,2,.94,2,.09,dark);tube([x+1,9.09,-7],[x+1,9.2,-7],.65,'#52616b',12);
    for(const angle of [0,Math.PI/2])tube([x+1-Math.cos(angle)*.56,9.215,-7-Math.sin(angle)*.56],[x+1+Math.cos(angle)*.56,9.215,-7+Math.sin(angle)*.56],.023,'#1a252d',6);
  }
  // Exterior entry canopy and columns; asymmetry makes the changing angle visible.
  rounded(-5,3.2,8,8,.25,4,.10,pale);
  add(-4.8,3.16,7.92,7.6,.045,.06,['#c4b296','#948b79','#d8c5a3']);
  add(-5,.1,7.8,.25,3.1,.25,pale); add(2.7,.1,7.8,.25,3.1,.25,pale);
  add(-4.5,.25,7.6,7,.16,2,concrete);
  add(-4.7,.15,8.2,7.4,.10,1.2,concrete);add(-4.6,.25,7.7,7.2,.10,1.2,pale);
  for(const x of [-4.3,-1.6]){
    add(x,.42,4.16,2.55,2.62,.09,pale);add(x+.09,.49,4.26,2.37,2.44,.025,['#203944','#203944','#203944']);
    tube([x+2.25,1.37,4.31],[x+2.25,1.97,4.31],.028,'#bac2bf',8);
  }
  for(const x of [-5.1,3.0]){tube([x,.28,8.1],[x,1.05,8.1],.045,'#596972',8);tube([x,1.05,8.1],[x,1.05,5.1],.045,'#596972',8);}
  // Office occupies the actual space behind the opening.
  add(-9.5,3.97,3.95,23,.06,16.4,['#28323c','#28323c','#35414b']);
  add(-9.4,4,-9.9,22.8,3.5,.15,['#3e4952','#333e47','#3e4952']);
  for(let x=-8;x<13;x+=2) add(x,4.04,3.8,.02,.005,13.6,dark);
  for(let z=2;z>-10;z-=2) add(-9.3,4.04,z,22.6,.006,.015,dark);
  // Desks, shared workstation, task chairs, monitor, keyboard, folders and cup.
  for(const x of [-4,0,5,9]) {
    faces.push(plane([[x-.1,4.07,-.8],[x+3.95,4.07,-.8],[x+4.5,4.07,-3.6],[x+.4,4.07,-3.6]],'#26313a'));
    rounded(x,4.76,-.8,3.9,.14,2.1,.11,wood);
    for(const xx of [x+.18,x+3.7])for(const zz of [-1,-2.66])tube([xx,4.03,zz],[xx,4.76,zz],.055,'#26353f',8);
    tube([x+.18,4.15,-2.66],[x+3.7,4.15,-2.66],.038,'#26353f',8);
    const cx=x+1.6,cz=.48;
    rounded(x+1.0,4.59,1.0,1.2,.16,1.1,.15,['#293f4a','#1c2b34','#3b525d']);
    const pad=roundedBox(-.59,-.07,.55,1.18,.14,1.1,.18,['#253b46','#2b414d','#3d5662']);
    faces.push(...pad.map(f=>({...f,points:f.points.map(([xx,yy,zz])=>[cx+xx,5.21+zz,1.02-yy]),normals:f.normals.map(([xx,yy,zz])=>[xx,zz,-yy])})));
    tube([cx,4.18,cz],[cx,4.59,cz],.075,'#73838b',10);
    for(let i=0;i<5;i++){
      const a=i/5*Math.PI*2,wx=cx+Math.cos(a)*.65,wz=cz+Math.sin(a)*.65;
      tube([cx,4.18,cz],[wx,4.13,wz],.047,'#34464f',8);
      tube([wx-.045,4.10,wz],[wx+.045,4.10,wz],.07,'#0e171e',8);
    }
    for(const xx of [x+.95,x+2.25]){tube([xx,4.63,.15],[xx,4.94,.15],.03,'#445761',8);rounded(xx-.07,4.93,.68,.14,.08,.90,.06,dark);}
  }
  // The glass is behind these four bezel edges and in front of the back casing.
  add(.24,4.77,-2.12,3.52,2.09,.14,['#0d131a','#141f29','#283640']);
  const bezel=['#0b1117','#101921','#27333d'];
  add(.24,6.70,-2.055,3.52,.16,.09,bezel);
  add(.24,4.77,-2.055,3.52,.14,.09,bezel);
  add(.24,4.91,-2.055,.17,1.79,.09,bezel);
  add(3.59,4.91,-2.055,.17,1.79,.09,bezel);
  add(1.87,4.74,-2.14,.26,.35,.23,pale);
  add(1.35,4.88,-1.76,1.3,.035,.45,dark);
  rounded(.9,4.91,-1.02,1.9,.045,.52,.045,['#29353e','#263139','#414f58']);
  for(let row=0;row<3;row++)for(let col=0;col<11;col++)add(1.02+col*.15,4.958,-1.08-row*.12,.1,.014,.075,pale);
  rounded(1.36,4.958,-1.45,.92,.014,.09,.02,pale);
  oval([3.25,4.97,-1.22],[.14,.065,.20],'#596a76',12,5);
  tube([3.25,5.034,-1.24],[3.25,5.034,-1.17],.014,'#1b2730',6);
  rounded(.03,4.91,-1.22,.54,.06,.73,.025,['#bba984','#a29373','#d8c6a1']);
  tube([3.51,4.91,-2.6],[3.51,5.25,-2.6],.12,'#b7b3a5',12);
  faces.push(plane(Array.from({length:12},(_,i)=>[3.51+Math.cos(i/12*Math.PI*2)*.095,5.252,-2.6+Math.sin(i/12*Math.PI*2)*.095]),'#3b3026'));
  for(let i=0;i<4;i++){const a=i/4*Math.PI-Math.PI/2,b=(i+1)/4*Math.PI-Math.PI/2;tube([3.63+.09*Math.cos(a),5.08+.13*Math.sin(a),-2.6],[3.63+.09*Math.cos(b),5.08+.13*Math.sin(b),-2.6],.023,'#b7b3a5',6);}
  for(const x of [-3,6.1,10.1]) {
    add(x,5.2,-2,1.8,1.1,.14,dark);
    faces.push(plane([[x+.1,5.3,-1.99],[x+1.7,5.3,-1.99],[x+1.7,6.2,-1.99],[x+.1,6.2,-1.99]], '#234959'));
    add(x+.8,4.9,-2.08,.14,.3,.12,pale);
  }
  add(-8,4.04,-8,3,1.8,1.2,pale);
  for(let x=-7.8;x<-5.1;x+=.32) add(x,5.86,-8.1,.21,.6,.7,['#8a7b63','#384c52','#b6a17e']);
  // Practical ceiling strips, visible on entry; muted window-side light.
  for(const x of [-4,2,8]) faces.push(plane([[x,7.74,0],[x+.13,7.74,0],[x+.13,7.74,-6],[x,7.74,-6]], '#b0b5ab'));
  // Parked vehicles and low planters support industrial scale without motion clutter.
  for(const x of [-20,-15,20,25]){
    rounded(x,.50,14,2,.66,4.2,.16,['#3e4c56','#23323e','#5c6b76']);
    const lf=[x+.16,1.16,13.15],rf=[x+1.84,1.16,13.15],lt=[x+.35,1.76,12.60],rt=[x+1.65,1.76,12.60];
    const lb=[x+.16,1.16,10.55],rb=[x+1.84,1.16,10.55],lbt=[x+.35,1.76,11.15],rbt=[x+1.65,1.76,11.15];
    faces.push(plane([lf,rf,rt,lt],'#25404e'),plane([lt,rt,rbt,lbt],'#596a76'),plane([rb,lb,lbt,rbt],'#203541'),plane([lf,lt,lbt,lb],'#29424f'),plane([rf,rb,rbt,rt],'#263d4a'));
    for(const xx of [x+.05,x+1.95])for(const zz of [13.25,10.65])tube([xx-.10,.55,zz],[xx+.10,.55,zz],.30,'#101b22',12);
    for(const xx of [x+.2,x+1.48]){add(xx,.85,14.015,.32,.12,.025,['#bdbba6','#73766c','#bdbba6']);add(xx,.85,9.78,.32,.12,.025,['#853c32','#632b28','#853c32']);}
    add(x-.5,.28,14.5,.06,.02,5.5,pale);add(x+2.5,.28,14.5,.06,.02,5.5,pale);
  }
  for(const x of [-13,17]){
    tube([x+.6,.25,4.4],[x+.6,.75,4.4],.62,'#55636b',12);tube([x+.6,.72,4.4],[x+.6,2.10,4.4],.085,'#615647',8);
    oval([x+.6,2.55,4.4],[.86,.95,.83],'#365144',10,5);oval([x+.08,2.1,4.68],[.65,.68,.65],'#304a3d',10,5);oval([x+1.10,2.18,4.15],[.64,.72,.60],'#3e5848',10,5);
  }
  return faces;
}

function descentCamera(t,width,height){
  const focal = Math.min(width*.85,height*1.35);
  const altitude = 5400000*focal/(width*.87);
  const national = [1240000,0,-420000];
  if(t<=3.2) return {eye:[national[0],altitude,national[2]+altitude*.025], target:national};
  const p=range(t,3.2,6.0), h=Math.exp(mix(Math.log(altitude),Math.log(90),p));
  const drift=1-range(t,3.2,4.8);
  return {eye:[national[0]*drift-30*p,h,national[2]*drift+h*(.025+.9*p)],target:[national[0]*drift,3*p,national[2]*drift]};
}

// Keep the descent and approach continuous as the camera enters the office.
const approachKeys=[
    [6.5,[-32,58,70],[0,3.8,0]],
    [7.35,[-20,23,38],[2,5.2,0]],
    [8.2,[-8,11.2,23],[2,5.8,1]],
    [8.95,[-1.8,7.5,10],[1.6,5.8,-1.2]],
    [9.55,[-.5,6.6,5.1],[1.8,5.6,-1.8]],
    [9.90,[-.8,6.72,3.6],[1.7,5.5,-1.7]],
    [10.4,WORKSTATION_CAMERA.eye,WORKSTATION_CAMERA.target]
];
const polarCamera=({eye,target})=>{
  const d=eye.map((v,j)=>v-target[j]),radius=Math.hypot(...d);
  return [Math.log(radius),Math.atan2(d[0],d[2]),Math.asin(d[1]/radius),...target];
};
let approachTrack;
function trackFor(width,height){
  if(approachTrack?.width===width&&approachTrack?.height===height)return approachTrack;
  const start=polarCamera(descentCamera(6,width,height)),previous=polarCamera(descentCamera(6-.0001,width,height));
  const frames=[[6,start],...approachKeys.map(([time,eye,target])=>[time,polarCamera({eye,target})])];
  const tangents=frames.map((frame,index)=>frame[1].map((v,axis)=>{
    if(index===0)return (v-previous[axis])/.0001;
    if(index===frames.length-1)return 0;
    const left=(v-frames[index-1][1][axis])/(frame[0]-frames[index-1][0]);
    const right=(frames[index+1][1][axis]-v)/(frames[index+1][0]-frame[0]);
    return left*right<=0?0:2*left*right/(left+right);
  }));
  return approachTrack={width,height,frames,tangents};
}

export function cameraAt(t,width,height){
  if(width<700&&height>width&&t>=10.4){
    const focus=range(t,10.4,11.4),target=WORKSTATION_CAMERA.target.map((v,i)=>mix(v,[2,5.805,-2.103][i],focus));
    return {eye:WORKSTATION_CAMERA.eye.map((v,i)=>mix(v,[1.55,6.02,1.15][i],focus)),target};
  }
  if(t<6)return descentCamera(t,width,height);
  if(t>=10.4){
    const focus=range(t,10.8,17.3);
    return {
      eye:WORKSTATION_CAMERA.eye.map((v,i)=>mix(v,[-1.85,6.64,2.4][i],focus)),
      target:WORKSTATION_CAMERA.target.map((v,i)=>mix(v,[1.8,5.6,-1.9][i],focus))
    };
  }
  const {frames,tangents}=trackFor(width,height),i=frames.findIndex(f=>f[0]>t);
  const a=frames[i-1],b=frames[i],dt=b[0]-a[0],u=(t-a[0])/dt;
  const value=a[1].map((v,j)=>(2*u**3-3*u*u+1)*v+(u**3-2*u*u+u)*dt*tangents[i-1][j]+(-2*u**3+3*u*u)*b[1][j]+(u**3-u*u)*dt*tangents[i][j]);
  const [logRadius,heading,elevation,...target]=value,radius=Math.exp(logRadius),horizontal=radius*Math.cos(elevation);
  return {eye:[target[0]+horizontal*Math.sin(heading),target[1]+radius*Math.sin(elevation),target[2]+horizontal*Math.cos(heading)],target};
}

export function monitorTransitionCamera(t,width,height,progress){
  const start=cameraAt(t,width,height),p=clamp(progress)**2.4;
  const center=SCREEN[0].map((v,i)=>(v+SCREEN[2][i])/2);
  const destination=[center[0],center[1],center[2]+.623];
  return {
    eye:start.eye.map((v,i)=>mix(v,destination[i],p)),
    target:start.target.map((v,i)=>mix(v,center[i],p))
  };
}
