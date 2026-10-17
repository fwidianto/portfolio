import {FONT} from './pixel-font.js';
import {SITES} from '../data/synthetic-records.js';
const P={void:'#14232e',ink:'#101c25',floor:'#344854',floor2:'#3e5460',edge:'#6c858b',wall:'#53636a',wall2:'#384d58',cream:'#d9d6b5',light:'#efe6bb',wood:'#8d7153',wood2:'#665443',steel:'#82999a',navy:'#354b5c',green:'#a4c29a',darkGreen:'#285b49',mint:'#d8e5c6',red:'#b87765',orange:'#d5a467',skin:'#d5af82',skinShade:'#ac8567',dark:'#172b35'};
let c;
function r(x,y,w,h,color){c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));}
function line(x1,y1,x2,y2,color,width=1){x1=Math.round(x1);y1=Math.round(y1);x2=Math.round(x2);y2=Math.round(y2);let dx=Math.abs(x2-x1),sx=x1<x2?1:-1,dy=-Math.abs(y2-y1),sy=y1<y2?1:-1,e=dx+dy;for(;;){r(x1,y1,width,width,color);if(x1===x2&&y1===y2)break;const q=e*2;if(q>=dy){e+=dy;x1+=sx;}if(q<=dx){e+=dx;y1+=sy;}}}
function poly(points,color){const min=Math.floor(Math.min(...points.map(p=>p[1]))),max=Math.ceil(Math.max(...points.map(p=>p[1])));for(let y=min;y<=max;y++){const xs=[];for(let i=0;i<points.length;i++){const a=points[i],b=points[(i+1)%points.length];if((a[1]<=y&&b[1]>y)||(b[1]<=y&&a[1]>y))xs.push(a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1]));}xs.sort((a,b)=>a-b);for(let i=0;i<xs.length-1;i+=2)r(Math.ceil(xs[i]),y,Math.floor(xs[i+1])-Math.ceil(xs[i])+1,1,color);}}
function ellipse(x,y,rx,ry,color){for(let row=-ry;row<=ry;row++){const half=Math.floor(rx*Math.sqrt(Math.max(0,1-row*row/(ry*ry))));r(x-half,y+row,half*2+1,1,color);}}
function text(value,x,y,color=P.cream,size=1){for(const char of String(value).toUpperCase()){const glyph=FONT[char]||FONT[' '];for(let row=0;row<7;row++)for(let col=0;col<glyph[row].length;col++)if(glyph[row][col]==='1')r(x+col*size,y+row*size,size,size,color);x+=(glyph[0].length+1)*size;}}
function crate(x,y){r(x+2,y+3,27,21,P.ink);r(x,y,26,21,'#8a7755');r(x+2,y+2,22,17,'#ae9568');r(x+5,y+3,2,16,'#6c5b43');r(x+19,y+3,2,16,'#6c5b43');r(x+2,y+9,22,2,'#796743');r(x+10,y+5,7,4,P.cream);}
function cabinet(x,y,color=P.navy){r(x+2,y+3,27,53,P.ink);r(x,y,27,52,color);r(x+1,y+1,25,2,P.steel);for(let i=0;i<3;i++){r(x+3,y+5+i*15,21,12,P.wall2);r(x+10,y+8+i*15,8,2,P.steel);r(x+10,y+9+i*15,8,1,P.ink);}r(x+3,y+51,4,3,P.ink);r(x+21,y+51,4,3,P.ink);}
function shelf(x,y,kind){r(x,y,43,54,P.wood2);r(x+3,y+3,37,48,P.dark);for(let i=0;i<3;i++){r(x+2,y+15+i*16,39,3,P.wood);for(let j=0;j<4;j++){const h=7+((i+j)%3)*2;r(x+5+j*8,y+15+i*16-h,5,h,kind==='parts'?['#ab9265','#8b9b87','#d0b788'][j%3]:['#667d81','#9a8067','#8d9a7c'][j%3]);r(x+6+j*8,y+17+i*16-h,3,2,P.cream);}}r(x+2,y+53,3,4,P.ink);r(x+38,y+53,3,4,P.ink);}
function plant(x,y){r(x+1,y+13,12,12,'#9c785a');r(x,y+12,14,3,'#c1a27b');r(x+6,y-7,2,19,'#768f72');r(x+1,y-2,6,6,'#5d7d68');r(x+8,y-9,7,7,'#739276');r(x-3,y-7,7,4,'#8da780');r(x+7,y+4,9,4,'#759175');}
function toolboard(x,y){r(x,y,44,37,'#8d8b71');r(x+2,y+2,40,33,'#615f53');for(let i=0;i<5;i++)for(let j=0;j<4;j++)r(x+5+i*8,y+5+j*8,1,1,'#a49d7b');line(x+9,y+9,x+9,y+27,P.steel,2);r(x+6,y+6,8,3,P.steel);r(x+6,y+3,2,6,P.steel);r(x+12,y+3,2,6,P.steel);line(x+24,y+9,x+24,y+28,'#b19267',2);r(x+20,y+7,10,4,P.steel);r(x+33,y+15,3,14,P.steel);r(x+31,y+13,7,4,P.steel);}
function floor(x,y,hq){
 ellipse(x,y+72,105,21,'#0e1d27');
 poly([[x-99,y+1],[x+13,y-21],[x+99,y+6],[x+99,y+81],[x-6,y+108],[x-99,y+70]],'#1d303d');
 poly([[x-99,y-1],[x+13,y-23],[x+99,y+4],[x+99,y+72],[x-6,y+98],[x-99,y+62]],hq?'#4a5c60':P.floor);
 for(let i=0;i<5;i++)line(x-85+i*37,y+3,x-85+i*37,y+69,'#425863');
 for(let i=0;i<4;i++)line(x-95,y+7+i*20,x+94,y+7+i*20,'#293f4c');
 line(x-99,y+62,x-6,y+98,P.edge);line(x-6,y+98,x+99,y+72,P.edge);
 for(let i=0;i<5;i++){line(x-86+i*14,y+65+i*5,x-80+i*14,y+67+i*5,P.orange,2);}
}
function monitor(x,y,w=55,h=39,active=false,time=0,rows=2){
 r(x+3,y+4,w,h,P.ink);r(x,y,w,h,P.steel);r(x+2,y+2,w-4,h-4,'#263c49');r(x+4,y+4,w-8,h-9,active?'#dae7ca':'#a5baa8');
 r(x+4,y+4,w-8,5,'#398b5e');r(x+7,y+5,3,3,'#d2e6c6');r(x+13,y+6,w-23,1,'#86b591');
 r(x+4,y+9,5,h-14,'#bcccb0');r(x+9,y+9,w-13,4,'#bdd0af');
 for(let col=0;col<4;col++)r(x+9+col*Math.floor((w-13)/4),y+13,1,h-18,'#9caf98');
 for(let row=0;row<4;row++){r(x+9,y+13+row*5,w-13,1,'#a3b69c');if(row<rows){r(x+12,y+15+row*5,9,1,'#587964');r(x+25,y+15+row*5,8,1,'#587964');r(x+39,y+15+row*5,4,1,'#527b5a');}}
 if(active){const row=Math.floor(time*1.1)%3;r(x+10,y+14+row*5,13,4,'#9cb89b');r(x+10,y+14+row*5,13,1,'#2f7b4c');if(Math.floor(time*2)%2===0)r(x+20,y+15+row*5,1,3,'#245e39');}
 r(x+7,y+h-6,w-20,2,'#7c9b8a');r(x+w-9,y+h-4,2,1,active?'#bbeaac':'#698677');r(x+w/2-3,y+h,7,9,P.steel);r(x+w/2-12,y+h+8,26,3,'#5b747d');r(x+w/2-10,y+h+8,21,1,'#b0b7a3');
}
function person(x,y,time,active,color,helmet=true){
 ellipse(x+4,y+29,17,5,P.ink);r(x-9,y+14,9,15,'#293e4c');r(x+7,y+14,9,14,'#293e4c');r(x-13,y+28,14,4,'#182c37');r(x+7,y+27,13,5,'#182c37');
 r(x-8,y-14,22,27,color);r(x-5,y-12,16,3,'#a1b6b2');r(x-9,y+5,24,6,'#284451');
 const reach=active?Math.floor(time*6)%2:0;r(x-17,y-11+reach,9,7,color);r(x-22,y-17+reach,7,10,P.skin);r(x-23,y-19+reach,8,4,P.skinShade);r(x+14,y-12-reach,10,6,color);r(x+20,y-18-reach,7,10,P.skin);r(x+19,y-20-reach,8,4,P.skinShade);
 r(x-3,y-21,12,8,P.skinShade);r(x-5,y-34,16,15,P.skin);r(x-3,y-35,12,4,'#4d483a');r(x-6,y-31,3,8,'#4d483a');r(x+10,y-30,2,8,P.skinShade);
 if(helmet){r(x-7,y-36,21,5,'#c59d5f');r(x-4,y-40,15,5,'#dec586');r(x+2,y-40,3,7,'#f0d59a');r(x-9,y-32,25,3,'#9a794c');}
 else {r(x-6,y-35,19,8,'#584d42');r(x-5,y-30,18,2,'#403d37');}
 // The chair back faces the viewer; hands reach the keyboard in front of the torso.
 r(x-12,y+3,29,17,'#223846');r(x-10,y+4,25,12,'#375565');r(x-12,y+18,29,4,'#182d3a');r(x+1,y+22,3,13,P.steel);line(x+2,y+34,x-11,y+38,P.steel,2);line(x+2,y+34,x+16,y+38,P.steel,2);r(x-14,y+38,5,3,P.ink);r(x+14,y+38,5,3,P.ink);
}
function workstation(x,y,time,active,site,hq=false,cue=''){
 const dx=x-45,dy=y+19;
 r(dx-1,dy+8,101,10,P.wood2);poly([[dx-2,dy],[dx+11,dy-12],[dx+98,dy-9],[dx+105,dy+7],[dx+4,dy+9]],P.wood);line(dx+4,dy+9,dx+105,dy+7,'#b3976b',2);
 r(dx+5,dy+16,5,29,'#4b6064');r(dx+91,dy+12,5,31,'#4b6064');r(dx+7,dy+39,82,3,'#253e4b');
 r(x+33,y+21,15,24,'#1b2f3d');r(x+35,y+23,11,20,'#6d838b');r(x+37,y+27,7,2,'#263e4b');r(x+37,y+38,2,2,P.green);
 monitor(x-(hq?35:30),y-(hq?47:37),hq?71:61,hq?46:40,active,time,active?3:2);
 r(x-29,y+11,53,8,'#203642');r(x-27,y+12,49,4,'#9da99e');for(let i=0;i<14;i++)r(x-26+i*3,y+13,1,2,'#5c777b');r(x+30,y+12,5,6,P.steel);
 r(x-42,y-4,8,12,'#c7c3a5');r(x-44,y-2,2,7,'#8a9a8d');r(x-41,y-5,7,2,'#6b705c');
 // Desk lamp is anchored on the surface, with a restrained pool of warm pixels.
 r(x+42,y+4,11,3,'#213845');line(x+47,y+4,x+54,y-20,P.steel,2);line(x+54,y-20,x+43,y-30,P.steel,2);r(x+35,y-32,14,4,'#769599');r(x+33,y-28,17,3,'#b5b99a');r(x+38,y-26,7,2,P.light);
 person(x-3,y+49,time,active&&cue!=='?',hq?'#65898a':site?.color||'#92a085',!hq);
 if(cue)thought(x+27,y-12,cue);
 if(active){r(x-34,y-42,hq?72:60,1,'#bfd7aa');r(x-35,y-41,1,6,'#bfd7aa');r(x+(hq?36:24),y-41,1,6,'#bfd7aa');}
}
function thought(x,y,cue){
 const glyph=cue==='?'?['01110','10001','00010','00100','00100','00000','00100']:['00100','00100','00100','00100','00100','00000','00100'];
 r(x+1,y-1,23,23,'#131821');r(x,y,23,20,'#d7c39c');r(x+2,y+2,19,16,'#f0e3bd');r(x-2,y+16,5,5,'#d7c39c');r(x-5,y+23,3,3,'#bbaa87');
 for(let yy=0;yy<7;yy++)for(let xx=0;xx<5;xx++)if(glyph[yy][xx]==='1')r(x+7+xx*2,y+3+yy*2,2,2,cue==='?'?'#5b5868':'#84623e');
}
const desktop={'01':[160,104],'02':[430,65],'03':[768,133],'04':[903,307],'05':[730,470],'06':[416,484],'07':[117,433],'08':[234,274],HQ:[500,274.8]};
const mobile={'01':[92,100],'02':[303,78],'03':[386,208],'04':[374,506],'05':[293,654],'06':[95,638],'07':[76,466],'08':[111,275],HQ:[240,354.8]};
export const layout=small=>({width:small?480:1000,height:small?760:600,positions:small?mobile:desktop,siteScale:.78,hqScale:1.05});
export function packetPoint(start,end,p){p=Math.max(0,Math.min(1,p));return [start[0]+(end[0]-start[0])*p,start[1]+(end[1]-start[1])*p];}
function packet(x,y,index){r(x-6,y-5,12,10,P.ink);r(x-5,y-6,10,10,'#a9c69b');r(x-3,y-4,6,1,'#edf0c9');r(x-3,y-1,6,1,'#4e8259');r(x-3,y+1,4,1,'#4e8259');if(index>=0)text(index+1,x-2,y-3,'#2c6149');}
export class World {
 constructor(canvas,buttons){this.canvas=canvas;this.buttons=buttons;this.buffer=document.createElement('canvas');this.sprite=document.createElement('canvas');this.sprite.width=160;this.sprite.height=170;this.small=false;this.lastLayout='';this.zoom=1;this.cx=500;this.cy=300;}
 render({time=0,active='01',phase=0,jobs=[],focus=null,reduced=false,dt=.016}={}){
  this.small=matchMedia('(max-width:600px)').matches;const l=layout(this.small),{width:W,height:H,positions}=l;
  if(this.lastLayout!==String(this.small)){this.canvas.width=this.buffer.width=W;this.canvas.height=this.buffer.height=H;this.lastLayout=String(this.small);this.cx=W/2;this.cy=H/2;this.buttons.innerHTML=[...SITES.map(s=>({id:s.id,name:'SITE '+s.id,role:s.name})),{id:'HQ',name:'HQ MASTER',role:'Central reporting'}].map(s=>`<button class="computer-hit ${s.id==='HQ'?'hq':''}" data-computer="${s.id}" aria-label="Open ${s.id==='HQ'?'HQ master':'Site '+s.id} workbook"><span class="pc-name">${s.name}</span><span class="pc-role">${s.role}</span></button>`).join('');}
  c=this.buffer.getContext('2d');c.imageSmoothingEnabled=false;c.clearRect(0,0,W,H);
  const target=positions.HQ;
  for(const site of SITES){const pos=positions[site.id],start=[pos[0]+20*l.siteScale,pos[1]-18*l.siteScale],end=[target[0],target[1]-20*l.hqScale];line(...start,...end,active===site.id?'#39434a':'#1c232c');}
  const order=Object.entries(positions).sort((a,b)=>a[1][1]-b[1][1]);
  const cue=active==='HQ'?'!':phase>=1&&phase<3?'?':phase>=3&&phase<7.8?'!':'';
  for(const [id,[x,y]] of order){const targetContext=c,scale=id==='HQ'?l.hqScale:l.siteScale;c=this.sprite.getContext('2d');c.clearRect(0,0,160,170);workstation(80,58,reduced?0:time,active===id,SITES.find(s=>s.id===id),id==='HQ',active===id?cue:'');c=targetContext;c.drawImage(this.sprite,Math.round(x-80*scale),Math.round(y-58*scale),Math.round(160*scale),Math.round(170*scale));}
  for(const job of jobs){const from=positions[job.site],to=positions.HQ,start=[from[0]+20*l.siteScale,from[1]-18*l.siteScale],end=[to[0],to[1]-20*l.hqScale];for(let i=0;i<job.ids.length;i++){const p=(job.elapsed-.2-i*.28)/2.55;if(p>=0&&p<=1){const q=packetPoint(start,end,reduced?1:p);packet(...q,i);}}}
  const targetZoom=focus&&!reduced?1.32:1,targetX=focus?positions[focus][0]:W/2,targetY=focus?positions[focus][1]+40:H/2,e=reduced?1:1-Math.exp(-dt*7);
  this.zoom+=(targetZoom-this.zoom)*e;this.cx+=(targetX-this.cx)*e;this.cy+=(targetY-this.cy)*e;
  const dx=W/2-this.cx*this.zoom,dy=H/2-this.cy*this.zoom,ctx=this.canvas.getContext('2d');ctx.imageSmoothingEnabled=false;ctx.clearRect(0,0,W,H);ctx.drawImage(this.buffer,Math.round(dx),Math.round(dy),Math.round(W*this.zoom),Math.round(H*this.zoom));
  const cb=this.canvas.getBoundingClientRect(),wb=this.buttons.parentElement.getBoundingClientRect();
  for(const b of this.buttons.children){const p=positions[b.dataset.computer],scale=b.dataset.computer==='HQ'?l.hqScale:l.siteScale;b.style.left=(cb.left-wb.left+(p[0]*this.zoom+dx)/W*cb.width)+'px';b.style.top=(cb.top-wb.top+((p[1]+24*scale)*this.zoom+dy)/H*cb.height)+'px';b.style.width=Math.max(44,145*scale/W*cb.width)+'px';b.style.height=Math.max(44,150*scale/H*cb.height)+'px';b.classList.toggle('active',b.dataset.computer===active);b.dataset.workerCue=b.dataset.computer===active?cue:'';}
 }
}
export function drawTransfer(canvas,job,reduced=false){c=canvas.getContext('2d');c.imageSmoothingEnabled=false;r(0,0,800,100,'#172c32');monitor(35,16,75,44,true,job.elapsed,3);monitor(682,16,75,44,true,job.elapsed,3);line(120,49,669,49,'#477a6b',2);text('SOURCE SAVED',27,84,'#bbceae');text('HQ MIRROR',683,84,'#bbceae');for(let i=0;i<job.ids.length;i++){let p=Math.max(0,Math.min(1,(job.elapsed-.2-i*.28)/2.55));packet(130+535*(reduced?1:p),49,i);}text(job.ids.length+' ROW'+(job.ids.length===1?'':'S'),365,21,'#d6d7b0');}
