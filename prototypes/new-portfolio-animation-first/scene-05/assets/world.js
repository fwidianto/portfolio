import {FONT} from './pixel-font.js';
const P={bg:'#111d27',line:'#405764',ink:'#101b23',floor:'#334956',edge:'#718387',light:'#e7d9b7',amber:'#d6aa6c',green:'#a4bea1',steel:'#94a9ab',skin:'#d1ac87'};
let c;
const r=(x,y,w,h,color)=>{c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));};
function line(x,y,x2,y2,color,w=1){x=Math.round(x);y=Math.round(y);x2=Math.round(x2);y2=Math.round(y2);let dx=Math.abs(x2-x),sx=x<x2?1:-1,dy=-Math.abs(y2-y),sy=y<y2?1:-1,e=dx+dy;for(;;){r(x,y,w,w,color);if(x===x2&&y===y2)break;const q=e*2;if(q>=dy){e+=dy;x+=sx;}if(q<=dx){e+=dx;y+=sy;}}}
function poly(points,color){const min=Math.floor(Math.min(...points.map(p=>p[1]))),max=Math.ceil(Math.max(...points.map(p=>p[1])));for(let y=min;y<=max;y++){const xs=[];for(let i=0;i<points.length;i++){const a=points[i],b=points[(i+1)%points.length];if((a[1]<=y&&b[1]>y)||(b[1]<=y&&a[1]>y))xs.push(a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1]));}xs.sort((a,b)=>a-b);for(let i=0;i<xs.length-1;i+=2)r(Math.ceil(xs[i]),y,Math.floor(xs[i+1])-Math.ceil(xs[i])+1,1,color);}}
function ellipse(x,y,rx,ry,color){for(let row=-ry;row<=ry;row++){const half=Math.floor(rx*Math.sqrt(Math.max(0,1-row*row/(ry*ry))));r(x-half,y+row,half*2+1,1,color);}}
function text(value,x,y,color=P.light,size=1){for(const char of String(value).toUpperCase()){const glyph=FONT[char]||FONT[' '];for(let row=0;row<7;row++)for(let col=0;col<glyph[row].length;col++)if(glyph[row][col]==='1')r(x+col*size,y+row*size,size,size,color);x+=(glyph[0].length+1)*size;}}
function platform(x,y,w,d){poly([[x-w,y],[x,y-d],[x+w,y],[x,y+d]],'#344953');poly([[x-w,y],[x,y+d],[x+w,y],[x+w,y+8],[x,y+d+8],[x-w,y+8]],'#202f39');line(x-w,y,x,y+d,'#6b7a78');line(x,y+d,x+w,y,'#4d6975');for(let i=-w+15;i<w;i+=20){const dy=(1-Math.abs(i)/w)*d;line(x+i,y-dy,x+i,y+dy,'#3b515a');}}
function crate(x,y){poly([[x,y],[x+12,y-6],[x+29,y-2],[x+16,y+5]],'#ac8e62');poly([[x,y],[x+16,y+5],[x+16,y+19],[x,y+14]],'#87704f');poly([[x+16,y+5],[x+29,y-2],[x+29,y+12],[x+16,y+19]],'#5c5a46');line(x+4,y+2,x+4,y+15,'#c2a675');line(x+12,y+4,x+12,y+17,'#514837');r(x+6,y+6,5,4,'#d3c096');}
function tree(x,y,size=1){r(x-2,y-10,4,21,'#554c40');poly([[x,y-49*size],[x-15*size,y-20],[x-8,y-20],[x-22*size,y],[x+20*size,y],[x+9,y-20],[x+15*size,y-20]],'#29443f');poly([[x,y-49*size],[x-15*size,y-20],[x-8,y-20],[x-22*size,y],[x,y-6]],'#3b5750');line(x-12,y-15,x-2,y-35,'#50655a');}
function person(x,y,time,color='#849d9c',helmet=true){const step=Math.sin(time*5)>0?1:0;ellipse(x+1,y+17,8,3,'#12242d');r(x-4,y+7,3,10+step,'#34424c');r(x+2,y+7,3,11-step,'#263844');r(x-5,y+16+step,5,3,'#131f29');r(x+1,y+17-step,6,3,'#131f29');r(x-5,y-8,11,17,color);r(x-7,y-6,3,10,P.skin);r(x+6,y-5,3,8,P.skin);r(x-3,y-18,7,10,P.skin);r(x-4,y-20,9,4,helmet?'#d6b777':'#594b3d');if(helmet)r(x-6,y-17,13,2,'#ebd29c');r(x+2,y-13,1,1,'#4c4b3a');r(x-3,y-3,2,4,'#d3cec0');r(x-5,y+6,11,2,'#536976');}
function wheel(x,y){ellipse(x,y,5,8,'#0b151d');ellipse(x-1,y,3,5,'#425462');r(x-2,y-2,2,4,'#899493');}
function machine(x,y,type,t=0,active=false){
  ellipse(x+7,y+18,29,8,'#182730');
  if(type==='EX-20'){
    r(x-21,y+7,48,11,'#17232b');r(x-19,y+9,44,7,'#536570');for(let i=0;i<7;i++)r(x-18+i*6,y+10,3,5,'#293b45');
    poly([[x-16,y-11],[x+10,y-17],[x+25,y-5],[x+20,y+10],[x-16,y+11]],'#94a78c');r(x-11,y-27,18,18,'#aec0a4');r(x-8,y-24,12,13,'#335363');r(x-6,y-23,3,9,'#a4c1bf');
    const lift=active?Math.round(Math.sin(t*2)*4):0;line(x+19,y-7,x+37,y-35+lift,'#cfb579',5);line(x+37,y-35+lift,x+56,y-5,'#9a8b59',4);line(x+20,y-7,x+37,y-30+lift,'#d6d4af');poly([[x+52,y-7],[x+63,y-1],[x+58,y+7],[x+46,y+5]],'#576572');
  }else{
    wheel(x-12,y+11);wheel(x+19,y+7);poly([[x-23,y-6],[x-4,y-16],[x+31,y-8],[x+32,y+8],[x+8,y+20],[x-23,y+11]],type==='FL-30'?'#bb944d':'#b88b43');
    poly([[x-23,y-6],[x-4,y-16],[x+31,y-8],[x+8,y+5]],'#e0b16a');r(x-13,y-14,19,17,'#9a753c');r(x-9,y-34,21,25,'#526976');r(x-6,y-31,14,15,'#82a5a6');r(x-5,y-30,4,12,'#b4c4b6');r(x-12,y-36,27,4,'#d9b376');r(x+5,y-30,2,18,'#d5b778');
    wheel(x-15,y+13);wheel(x+15,y+16);r(x-25,y+1,9,6,'#4b493d');r(x-24,y-1,5,3,'#f1d09c');
    if(type==='FL-30'){line(x+28,y+8,x+27,y-38,'#647986',3);line(x+35,y+5,x+34,y-41,'#95a6a4',3);line(x+28,y+4,x+50,y+11,'#a7b3af',3);line(x+35,y,x+55,y+6,'#6f8389',3);}
    else {const lift=active?Math.round(Math.sin(t*2)*3):0;line(x+22,y+7,x+43,y+2+lift,'#deb275',4);poly([[x+39,y-2+lift],[x+59,y+4+lift],[x+57,y+17],[x+35,y+12]],'#68736b');line(x+39,y-2+lift,x+59,y+4+lift,'#adb09a',2);}
  }
  if(active){r(x-8,y-46,28,3,'#2b4148');r(x-8,y-46,7+(Math.floor(t*8)%21),3,P.green);}
}
function building(x,y,name,mess=false){
  poly([[x-55,y-40],[x+10,y-68],[x+68,y-50],[x+68,y+5],[x+3,y+35],[x-55,y+15]],mess?'#536057':'#586875');
  poly([[x-55,y-40],[x+3,y-18],[x+3,y+35],[x-55,y+15]],mess?'#687463':'#61747f');
  poly([[x-62,y-42],[x+8,y-76],[x+76,y-55],[x+6,y-23]],mess?'#b6a485':'#89918a');
  for(let i=0;i<5;i++)line(x-48+i*12,y-39+i*4,x+17+i*12,y-70+i*4,mess?'#978772':'#a9aaa0');
  r(x-47,y-27,15,20,'#253c49');r(x-44,y-24,9,13,mess?'#d9c39a':'#78999d');r(x-23,y-19,15,20,'#263e48');r(x-20,y-16,9,13,mess?'#d9c39a':'#85a8a4');
  poly([[x+15,y-14],[x+41,y-26],[x+41,y+16],[x+15,y+28]],'#273b46');for(let i=0;i<5;i++)line(x+17,y-8+i*6,x+39,y-18+i*6,'#4f6871');
  poly([[x+49,y-31],[x+61,y-36],[x+61,y-18],[x+49,y-13]],'#a6bcac');
  text(name,x-47,y-53,P.light);r(x+47,y+10,4,17,'#273c46');r(x+44,y+9,10,5,P.amber);
}
function workstation(x,y,t){
  platform(x+5,y+35,85,42);
  r(x-58,y-67,42,39,'#796f55');r(x-55,y-64,36,33,'#d3c7a3');text('FMC',x-50,y-58,'#52645b');for(let i=0;i<4;i++)r(x-50,y-46+i*5,10+i*5,2,'#83987b');
  poly([[x-42,y+5],[x-26,y-6],[x+49,y+4],[x+40,y+19],[x-42,y+12]],'#947a59');r(x-38,y+13,4,26,'#677b7d');r(x+33,y+17,4,23,'#677b7d');
  r(x-20,y-46,59,43,'#152733');r(x-23,y-49,59,42,'#94a5a3');r(x-20,y-46,53,35,'#274b48');r(x-17,y-43,47,29,'#d9e0be');r(x-17,y-43,47,5,'#478468');
  for(let i=0;i<4;i++){r(x-15,y-34+i*5,43,1,'#a5b59a');r(x-12,y-32+i*5,14,2,'#77957b');r(x+10,y-32+i*5,12,2,i===3?'#b89459':'#77957b');}
  for(let i=0;i<3;i++)r(x-1+i*12,y-38,1,23,'#b1bea1');r(x+3,y-7,7,10,'#a2afaa');r(x-5,y+3,23,3,'#627e85');r(x-20,y+9,40,5,'#b2b9a8');for(let i=0;i<11;i++)r(x-18+i*3,y+10,1,2,'#57757a');
  r(x+44,y-4,6,10,'#d4c4a3');r(x+41,y-2,3,5,'#ac9f88');
  person(x-2,y+17,t,'#648e92',false);r(x-10,y+17,20,15,'#304c5b');r(x-8,y+18,16,11,'#436374');r(x,y+32,2,13,'#8a999a');
  text('COST CONTROL',x-39,y+72,'#a6babc');
}
function truck(x,y){ellipse(x,y+13,18,4,'#15232c');r(x-15,y-3,23,14,'#7a9a9d');poly([[x-15,y-3],[x-6,y-10],[x+16,y-5],[x+7,y+1]],'#aac0bc');r(x+6,y+1,12,11,'#536c7a');r(x+9,y+1,7,5,'#b7c7b9');r(x-11,y+10,6,6,'#152532');r(x+10,y+10,6,6,'#152532');r(x+17,y+6,3,3,'#e8cd9a');}
function miniReport(x,y,margin){r(x,y,89,57,'#172b36');r(x+2,y+2,85,53,'#bdc9ac');text('SERVICE DIV.',x+6,y+7,'#3e6550');for(let i=0;i<5;i++){const h=7+i*4;r(x+8+i*12,y+44-h,8,h,'#668865');}text('POSITIVE',x+6,y+47,'#35593f');if(margin!==undefined)text(margin.toFixed(1)+'%',x+63,y+33,'#715d3e');}
export class World {
  constructor(canvas){this.canvas=canvas;this.ctx=canvas.getContext('2d');this.buffer=document.createElement('canvas');this.zoom=1;this.focusX=400;this.focusY=220;this.frames=0;}
  render({scenario,result,site='A',month=1,time=0,act=0,idle=false,reduced=false,dt=.033}){
    const small=matchMedia('(max-width:600px)').matches,W=small?480:800,H=small?490:450;
    if(this.canvas.width!==W||this.canvas.height!==H||this.buffer.width!==W||this.buffer.height!==H){this.canvas.width=this.buffer.width=W;this.canvas.height=this.buffer.height=H;this.focusX=W/2;this.focusY=H/2;this.zoom=1;}
    c=this.buffer.getContext('2d');c.imageSmoothingEnabled=false;r(0,0,W,H,P.bg);
    for(let i=0;i<32;i++){const x=(i*131+19)%W,y=(i*37+10)%95;r(x,y,i%5===0?2:1,1,'#30434e');}
    const quarry=small?[322,166]:[547,163],depot=small?[125,113]:[215,124],desk=small?[135,375]:[329,340],mess=small?[369,388]:[692,338];
    for(let i=0;i<6;i++)tree((i*91+27)%W,90+(i%3)*35,.7+(i%2)*.2);
    const road=[[depot[0],depot[1]+87],[W*.46,H*.56],[quarry[0]-30,quarry[1]+109],[mess[0]-20,mess[1]+28]];
    for(let i=1;i<road.length;i++){line(...road[i-1],...road[i],'#203541',17);line(...road[i-1],...road[i],'#3b5058',1);}
    line(W*.46,H*.56,desk[0]+35,desk[1]+22,'#263c46',12);
    platform(...depot,small?91:130,57);building(depot[0]-8,depot[1]-13,'SATELLITE');crate(depot[0]+48,depot[1]+28);
    const qx=quarry[0],qy=quarry[1];platform(qx,qy+32,small?140:183,94);
    poly([[qx-85,qy-25],[qx-40,qy-60],[qx+14,qy-37],[qx+33,qy+1],[qx-19,qy+20]],'#5c6054');
    poly([[qx-40,qy-60],[qx+14,qy-37],[qx+33,qy+1],[qx-6,qy-14]],'#7e7961');line(qx-33,qy-49,qx+2,qy-31,'#9e9475');
    const selected=scenario.sites.find(s=>s.id===site),f=result.financial.find(f=>f.site===site),work=result.work[month-1].sites[site];
    const all=result.maintenance.units.filter(u=>u.site===site),visible=all.slice(0,small?9:15),meter=result.maintenance.meters.find(m=>m.site===site&&m.month===month);
    const pace=(meter?.hours||0)/180;
    visible.forEach((u,i)=>{const cols=small?3:5,x=qx-80+(i%cols)*(small?65:52),y=qy+25+Math.floor(i/cols)*40;
      const repair=scenario.repair.enabled&&scenario.repair.unit===u.id&&scenario.repair.month===month;
      machine(x,y,u.model,time*pace,!repair&&(idle?act>=1:pace>0));
      if(repair){r(x-13,y-49,39,13,'#9d6251');text('REPAIR',x-10,y-46,'#f0d6b8');}
    });
    text('SITE '+site+' / '+all.length+' UNITS',qx-(small?84:85),qy-97,P.amber);
    if(all.length>visible.length)text('+'+(all.length-visible.length)+' IN FLEET',qx-42,qy+141,'#91a7a9');
    if(work.shortfall>0){r(qx+90,qy-55,34,16,'#a46251');text('GAP',qx+97,qy-51,'#ffe1bc');}
    const housed=scenario.mechanics.filter(m=>m.location==='mess'&&m.homeSite===site).length;
    building(mess[0],mess[1]-7,'MESS',housed>0);
    text(housed+' RESIDENT',mess[0]-29,mess[1]+47,housed?P.green:'#687d86');
    workstation(...desk,time);miniReport(small?24:36,small?218:262);
    if(!small){
      const other=scenario.sites.find(s=>s.id!==site),otherUnits=result.maintenance.units.filter(u=>u.site===other.id);
      platform(157,237,64,24);if(otherUnits.length)machine(142,225,otherUnits[0].model,0,false);
      text('SITE '+other.id+' / '+otherUnits.length+' UNITS',134,273,'#89a29d');
    }
    // Workforce shown once; reservations and movement come from this month's allocation.
    work.assignments.forEach((a,i)=>{const x=qx-95+i*22,y=qy+123;person(x,y,reduced?0:time,'#8da798');r(x-7,y+23,17,3,'#324c55');const occupied=(work.personnel/Math.max(1,work.capacity))*a.capacity+a.hours;r(x-7,y+23,Math.min(17,occupied/176*17),3,work.shortfall>0?'#d49375':P.green);});
    const vehicleMoving=work.travelHours>0&&(idle?act>=4:true);
    if(vehicleMoving){const p=reduced?.4:(time*.06)%1;truck(road[0][0]+(road[2][0]-road[0][0])*p,road[0][1]+(road[2][1]-road[0][1])*p);}
    if(act>=2||!idle){
      const events=result.maintenance.events.filter(e=>e.site===site&&e.month===month);
      const px=small?25:40,py=small?302:350;
      text('MONTH '+String(month).padStart(2,'0'),px,py,'#a8bdb5');events.slice(0,5).forEach((e,i)=>{r(px+i*25,py+13,22,14,e.package===2000?'#aa7965':'#547569');text(e.repair?'R':e.package===2000?'2K':e.package===1000?'1K':String(e.package),px+2+i*25,py+17,P.light);});
      text(events.length+' SERVICE KITS',px,py+34,'#718e8e');
    }
    const targetZoom=idle&&act===0&&!reduced?1.16:1;
    const targetX=targetZoom>1?Math.max(W/(2*targetZoom),Math.min(W-W/(2*targetZoom),desk[0]-45)):W/2,targetY=targetZoom>1?Math.min(H-H/(2*targetZoom),H/2+24):H/2;
    const easing=reduced?1:Math.min(1,dt*2.5);this.zoom+=(targetZoom-this.zoom)*easing;this.focusX+=(targetX-this.focusX)*easing;this.focusY+=(targetY-this.focusY)*easing;
    const ctx=this.ctx;ctx.imageSmoothingEnabled=false;ctx.fillStyle=P.bg;ctx.fillRect(0,0,W,H);ctx.drawImage(this.buffer,Math.round(W/2-this.focusX*this.zoom),Math.round(H/2-this.focusY*this.zoom),Math.round(W*this.zoom),Math.round(H*this.zoom));
    this.frames++;this.positions={desk,quarry,depot,mess,forecast:small?[67,324]:[94,369],profit:small?[65,249]:[80,289],W,H};
  }
}
