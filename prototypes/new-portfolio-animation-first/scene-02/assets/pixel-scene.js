/* Original 2D pixel artwork. All rasterization happens on a fixed 640 × 400 grid. */
'use strict';
window.PixelScene=(()=>{
  const W=640,H=400;
  const quietPresentation=new URLSearchParams(location.search).get('chapter')==='1';
  const editorialWords=new Set(["FAUZAN / VENDOR RESEARCH + COORDINATION","DEMO TRANSACTIONS","ILLUSTRATIVE DOCUMENTS","FUEL REIMBURSEMENTS","~40 VEHICLES / ~IDR 50M MONTHLY FUNDING","ILLUSTRATIVE BALANCE","ILLUSTRATIVE DATA","SYNTHETIC EXCERPT / 3 PURCHASES","A COMPANY-FUNDED, VEHICLE-IDENTIFIED PROCESS","CORPORATE ARRANGEMENT","3 REPRESENTATIVE PAIRS"]);
  // Shorten holds individually while retaining readable hand, card and refueling actions.
  const timing=[[0,0],[1,2.6],[2.8,4.8],[3.5,6.2],[4.5,8.8],[6,10.6],[6.2,10.7],[7.5,12.7],[8.2,14.4],[9.1,15.3],[9.5,16.4],[10,17.3],[11,18.8],[12,19.7],[13,20.5],[14.2,21.5],[14.4,22.1],[15.4,23.1],[16,25.1],[17,27.6],[17.4,28],[18.5,29.1],[19,29.5],[19.5,30],[20.1,30.6],[21.9,32.4],[22.5,33],[23,33.5],[24,35.2],[24.8,36.3],[25.5,37],[26.5,38.3],[27.8,40.1],[28.6,40.9],[29.1,41.2],[29.8,42],[30.2,42.8],[31.3,44.5],[32,45.4],[33,46.5],[36,50]];
  function sourceTime(time){for(let i=1;i<timing.length;i++)if(time<timing[i][0]){const a=timing[i-1],b=timing[i];return a[1]+(b[1]-a[1])*Math.max(0,(time-a[0])/(b[0]-a[0]));}return 50;}
  const P={ink:'#101820',deep:quietPresentation?'#040508':'#0c141e',wall:'#1b2a35',wall2:'#243744',line:'#344b56',light:'#56717a',glass:'#283f50',glass2:'#385568',paper:'#e0d4b3',paperLight:'#f2e7cc',paperShade:'#baa98a',paperDark:'#8c7b64',wood:'#55483e',wood2:'#77604b',wood3:'#8f7557',woodLight:'#b29367',skin:'#cba37a',skinLight:'#e0ba8c',skinShade:'#a57a58',amber:'#d9ae6e',red:'#b95750',redLight:'#d77c66',redDark:'#773a3d',green:'#99c4a0',greenDark:'#31554c',white:'#d6ddcc',steel:'#7f9291',silver:'#a9b8b0',navy:'#314754',black:'#070e16'};
  const FONT={A:['01110','10001','10001','11111','10001','10001','10001'],B:['11110','10001','10001','11110','10001','10001','11110'],C:['01111','10000','10000','10000','10000','10000','01111'],D:['11110','10001','10001','10001','10001','10001','11110'],E:['11111','10000','10000','11110','10000','10000','11111'],F:['11111','10000','10000','11110','10000','10000','10000'],G:['01111','10000','10000','10111','10001','10001','01111'],H:['10001','10001','10001','11111','10001','10001','10001'],I:['111','010','010','010','010','010','111'],J:['00111','00010','00010','00010','10010','10010','01100'],K:['10001','10010','10100','11000','10100','10010','10001'],L:['10000','10000','10000','10000','10000','10000','11111'],M:['10001','11011','10101','10101','10001','10001','10001'],N:['10001','11001','11001','10101','10011','10011','10001'],O:['01110','10001','10001','10001','10001','10001','01110'],P:['11110','10001','10001','11110','10000','10000','10000'],Q:['01110','10001','10001','10001','10101','10010','01101'],R:['11110','10001','10001','11110','10100','10010','10001'],S:['01111','10000','10000','01110','00001','00001','11110'],T:['11111','00100','00100','00100','00100','00100','00100'],U:['10001','10001','10001','10001','10001','10001','01110'],V:['10001','10001','10001','10001','10001','01010','00100'],W:['10001','10001','10001','10101','10101','10101','01010'],X:['10001','10001','01010','00100','01010','10001','10001'],Y:['10001','10001','01010','00100','00100','00100','00100'],Z:['11111','00001','00010','00100','01000','10000','11111'],0:['01110','10001','10011','10101','11001','10001','01110'],1:['010','110','010','010','010','010','111'],2:['01110','10001','00001','00010','00100','01000','11111'],3:['11110','00001','00001','01110','00001','00001','11110'],4:['00010','00110','01010','10010','11111','00010','00010'],5:['11111','10000','10000','11110','00001','00001','11110'],6:['01110','10000','10000','11110','10001','10001','01110'],7:['11111','00001','00010','00100','01000','01000','01000'],8:['01110','10001','10001','01110','10001','10001','01110'],9:['01110','10001','10001','01111','00001','00001','01110'],'.':['0','0','0','0','0','1','1'],',':['0','0','0','0','1','1','1'],':':['0','1','1','0','1','1','0'],'-':['000','000','000','111','000','000','000'],'/':['00001','00001','00010','00100','01000','10000','10000'],'>':['100','010','001','010','100','000','000'],'+':['000','010','010','111','010','010','000'],'=':['000','000','111','000','111','000','000'],'~':['00000','00000','01001','10110','00000','00000','00000'],'(':['01','10','10','10','10','10','01'],')':['10','01','01','01','01','01','10'],' ':['000','000','000','000','000','000','000']};
  let c;
  const clamp=x=>Math.max(0,Math.min(1,x));
  const ease=x=>{x=clamp(x);return x*x*(3-2*x);};
  const ramp=(t,a,b)=>ease((t-a)/(b-a));
  const mix=(a,b,u)=>a+(b-a)*u;
  const R=(x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));};
  function text(str,x,y,col=P.paper,size=1){if(quietPresentation&&editorialWords.has(str))return x;x=Math.round(x);y=Math.round(y);for(const ch of String(str).toUpperCase()){const glyph=FONT[ch]||FONT[' '];for(let r=0;r<7;r++)for(let k=0;k<glyph[r].length;k++)if(glyph[r][k]==='1')R(x+k*size,y+r*size,size,size,col);x+=(glyph[0].length+1)*size;}return x;}
  function line(x1,y1,x2,y2,col,width=1){x1=Math.round(x1);y1=Math.round(y1);x2=Math.round(x2);y2=Math.round(y2);const dx=Math.abs(x2-x1),sx=x1<x2?1:-1,dy=-Math.abs(y2-y1),sy=y1<y2?1:-1;let err=dx+dy;for(;;){R(x1,y1,width,width,col);if(x1===x2&&y1===y2)break;const e=2*err;if(e>=dy){err+=dy;x1+=sx;}if(e<=dx){err+=dx;y1+=sy;}}}
  function circle(x,y,r,col){for(let row=-r;row<=r;row++){const half=Math.floor(Math.sqrt(r*r-row*row));R(x-half,y+row,half*2+1,1,col);}}
  function ellipse(x,y,rx,ry,col){for(let row=-ry;row<=ry;row++){const half=Math.floor(rx*Math.sqrt(1-row*row/(ry*ry)));R(x-half,y+row,half*2+1,1,col);}}
  function frame(x,y,w,h,fill,edge=P.line){R(x,y,w,h,edge);R(x+2,y+2,w-4,h-4,fill);R(x+2,y+2,w-4,1,P.light);}
  function alpha(a,fn){if(a<=0)return;c.save();c.globalAlpha*=clamp(a);fn();c.restore();}
  function at(x,y,s,fn){c.save();c.translate(Math.round(x),Math.round(y));c.scale(s,s);fn();c.restore();}
  function grain(x,y,w,h,col,step=6){for(let yy=0;yy<h;yy+=step)for(let xx=0;xx<w;xx+=step)if(((xx*13+yy*7)%37)<12)R(x+xx,y+yy,2,1,col);}
  const shadow=(x,y,w)=>{R(x+5,y,w-10,5,P.black);R(x,y+2,w,2,P.black);};
  function paper(x,y,w=99,h=128,kind='receipt'){
    R(x+3,y+4,w,h,P.ink);R(x,y,w,h,P.paperShade);R(x+1,y,w-3,h-3,P.paper);R(x+2,y+2,w-6,2,P.paperLight);grain(x+7,y+7,w-13,h-17,'#d7c9a8',13);
    if(kind==='receipt'){
      text('FUEL RECEIPT',x+10,y+13,P.wood,1);line(x+10,y+27,x+w-12,y+27,P.paperDark);
      text('SERVICE VEHICLE',x+9,y+36,P.paperDark,1);text('DEMO VH-017',x+10,y+49,P.wood,1);
      text('32.0 L',x+10,y+67,P.wood,1);text('RP 320.000',x+10,y+82,P.wood,1);
      for(let j=0;j<w-23;j+=3)R(x+11+j,y+h-29,j%4===0?2:1,12,P.paperDark);
      for(let j=0;j<w;j+=8){R(x+j,y+h-4,3,3,P.paperShade);R(x+j+3,y+h-1,5,3,P.wood);}
    }else{
      text('FUEL REIMBURSEMENT',x+10,y+11,P.wood,1);line(x+10,y+25,x+w-10,y+25,P.paperDark);
      text('MECHANIC CLAIMS',x+10,y+37,P.wood,1);for(let j=0;j<5;j++){R(x+11,y+58+j*15,w-23,1,P.paperShade);R(x+11,y+53+j*15,32+(j%3)*9,2,P.paperDark);}
      R(x+w-27,y+8,11,3,P.steel);R(x+w-27,y+10,2,8,P.steel);R(x+w-18,y+10,2,8,P.steel);
    }
  }
  function stack(x,y){for(let i=4;i>=0;i--){const dx=[0,4,-3,6,1][i];paper(x+dx,y+i*4,103,133);}R(x+12,y+5,19,2,P.steel);R(x+12,y+7,2,6,P.steel);}
  function hand(x,y,reach=1){
    at(x,y,1,()=>{R(42,4,101,28,P.navy);R(53,3,90,3,P.light);R(40,5,14,31,P.wood2);R(41,7,2,26,P.amber);R(13,7,30,24,P.skinShade);R(14,6,30,18,P.skin);R(7,12,28,9,P.skinLight);R(2,15,19,7,P.skin);R(9,23,20,7,P.skin);R(22,27,18,8,P.skinShade);R(21,25,18,7,P.skin);R(25,29,9,7,P.skinLight);line(9,20,29,20,P.skinShade);line(19,10,32,10,P.skinLight);});
  }
  function lamp(x,y){
    R(x+6,y+97,56,6,P.black);R(x+11,y+94,44,5,P.steel);R(x+31,y+25,5,70,P.line);line(x+33,y+28,x+9,y+1,P.steel,4);circle(x+33,y+30,5,P.silver);R(x-14,y-5,40,8,P.navy);R(x-21,y+1,53,9,P.light);R(x-25,y+9,61,7,P.steel);R(x-20,y+16,51,3,P.paper);R(x-10,y+18,31,2,P.amber);
  }
  function cup(x,y){R(x,y+3,21,25,P.ink);R(x+2,y+3,17,23,P.steel);R(x+3,y+4,4,20,P.silver);R(x+1,y,20,4,P.white);R(x+4,y+1,14,2,P.wood);R(x+21,y+6,6,13,P.steel);R(x+21,y+9,3,7,P.wall);R(x+2,y+26,18,2,P.line);}
  function windowPane(x,y,w,h){frame(x,y,w,h,P.glass);R(x+5,y+5,w-10,h-10,P.glass2);for(let i=0;i<7;i++){const hh=12+(i*17)%43;R(x+8+i*(w-18)/7,y+h-8-hh,(w-18)/8,hh,P.wall2);R(x+12+i*(w-18)/7,y+h-5-hh,2,3,P.light);}R(x+w/2-2,y+3,4,h-6,P.line);R(x+3,y+h/2-2,w-6,4,P.line);R(x-3,y+h,w+6,5,P.light);}
  function office(){
    R(0,0,W,H,P.deep);R(0,18,W,262,P.wall);R(0,17,W,2,P.line);for(let y=35;y<264;y+=34){R(0,y,W,1,'#22343f');for(let x=(y%2)*20;x<W;x+=112)R(x,y,1,33,'#22343f');}
    windowPane(22,45,146,112);frame(480,42,142,171,P.wood,P.wood2);R(484,46,134,1,P.wood3);
    R(0,278,W,122,'#1c2932');R(0,278,W,4,P.line);for(let y=301;y<H;y+=29)R(0,y,W,1,'#2a3a42');for(let i=0;i<7;i++)R(i*112,282,1,118,'#22343d');
    // Side-view desk, cabinet, telephone, keyboard and desk lamp.
    R(41,262,542,14,P.wood3);R(43,264,538,2,P.woodLight);R(46,276,530,13,P.wood);R(46,289,16,79,P.navy);R(563,289,13,79,P.navy);R(63,290,94,73,P.wood);R(69,294,82,28,P.wood2);R(69,327,82,28,P.wood2);R(99,305,22,3,P.paperDark);R(99,338,22,3,P.paperDark);
    R(293,253,120,8,P.ink);for(let r=0;r<2;r++)for(let k=0;k<18;k++)R(298+k*6,254+r*3,4,2,P.light);R(334,260,42,1,P.steel);cup(524,234);lamp(211,159);
    frame(307,125,183,114,P.ink,P.light);R(314,132,169,98,P.glass);R(314,132,169,1,P.steel);R(390,239,13,14,P.steel);R(370,252,52,5,P.line);R(396,234,2,2,P.green);
    grain(49,269,520,3,P.wood2,4);
    // The pot and lamp terminate on the desktop, with visible contact shadows.
    R(54,262,34,2,P.ink);R(58,245,24,15,P.wood2);R(61,260,18,2,P.wood);R(59,246,4,12,P.woodLight);R(79,246,3,14,P.wood);
    R(55,240,30,6,P.wood3);R(59,241,22,2,P.ink);line(70,242,70,214,P.greenDark,2);line(70,234,60,222,P.greenDark,2);line(71,231,82,218,P.greenDark,2);
    ellipse(61,221,10,5,P.greenDark);ellipse(57,218,6,4,'#42675a');ellipse(71,211,6,9,'#42675a');ellipse(81,219,8,5,'#537969');ellipse(78,229,8,4,P.greenDark);R(68,206,2,6,'#668c72');R(79,216,5,1,'#71917a');
  }
  function deskClose(){
    R(0,0,W,H,P.wall);windowPane(421,-15,183,118);R(0,110,W,290,P.wood);R(0,110,W,8,P.wood2);R(0,118,W,2,P.woodLight);
    for(let y=145;y<H;y+=43){R(0,y,W,1,'#6a5645');R(0,y+1,W,1,'#463b35');}grain(0,130,W,270,'#66533f',7);
    // A fixed, stepped pool of warm desk light rather than a smooth glow.
    for(let n=0;n<12;n++)alpha(.018,()=>ellipse(202,238,237-n*12,151-n*7,P.woodLight));
    lamp(70,15);cup(503,188);R(519,258,73,7,P.ink);R(523,258,58,3,P.steel);R(511,262,9,3,P.paper);R(510,172,41,4,P.line);
    paper(265,164,169,180,'claim');stack(124,151);
    R(57,305,73,39,P.navy);R(59,307,69,35,P.line);text('SERVICE',66,314,P.silver);text('MECHANIC',64,326,P.silver);R(85,300,15,6,P.steel);R(89,302,7,4,P.wood);
  }
  const cached={};
  function background(name,fn){if(!cached[name]){const old=c,cv=document.createElement('canvas');cv.width=W;cv.height=H;c=cv.getContext('2d');fn();c=old;cached[name]=cv;}c.drawImage(cached[name],0,0);}
  function receiptOpening(t){
    background('desk',deskClose);
    const added=ramp(t,2.6,4.8),leave=ramp(t,5,6.2);const x=mix(592,134,added),y=mix(87,141,added);
    if(t>=2.6){paper(x,y,104,135);alpha(1-leave,()=>hand(x+75+leave*200,y+39));}
    if(t>=6.2){const a=ramp(t,6.2,7);alpha(a,()=>{frame(371,79,219,44,P.deep,P.paperDark);text('PAID PERSONALLY',386,89,P.amber);text('CLAIMED AFTERWARD',386,106,P.paper);line(370,109,226,152,P.paperDark);});}
    text('FUEL REIMBURSEMENTS',53,367,P.paperDark);text('ILLUSTRATIVE DOCUMENTS',406,367,P.paperDark);
  }
  function person(x,y,uniform=P.navy,arm=0){at(x,y,1,()=>{
    shadow(-5,77,38);R(7,53,9,24,P.ink);R(22,53,9,24,P.ink);R(5,75,14,5,P.black);R(22,75,16,5,P.black);R(10,55,3,16,P.line);R(24,55,3,16,P.line);
    R(5,23,28,32,uniform);R(7,23,23,3,P.light);R(4,33,28,3,P.amber);R(5,44,28,2,P.line);R(0,26,7,24,uniform);R(30,26,7,18,uniform);R(30,40+arm,16,5,P.skin);R(40,37+arm,6,7,P.skinLight);R(1,47,6,7,P.skin);R(13,17,11,9,P.skinShade);
    R(10,0,18,19,P.skin);R(8,2,4,12,P.skinShade);R(25,7,5,6,P.skinLight);R(10,0,18,5,P.ink);R(8,4,6,6,P.ink);R(24,8,2,2,P.ink);R(23,16,5,1,P.skinShade);R(10,1,16,1,P.line);
  });}
  function card(x,y,s=1,id='VH-017'){at(x,y,s,()=>{
    R(2,3,119,70,P.black);R(0,0,120,70,P.redDark);R(2,2,116,64,P.red);R(3,3,113,1,P.redLight);R(5,64,110,2,P.redDark);grain(9,8,105,48,'#bc6155',11);
    text('PERTAMINA',10,10,P.paperLight);text('RETAIL',10,21,P.paper);text(id,10,45,P.paperLight);text('VEHICLE CARD',10,57,'#d4ac8d');
    line(93,28,98,32,P.paperShade);line(98,32,98,39,P.paperShade);line(98,39,93,43,P.paperShade);line(100,23,108,30,P.paperShade);line(108,30,108,41,P.paperShade);line(108,41,100,48,P.paperShade);
  });}
  function pickup(x,y,s=1,id='017',roll=0){at(x,y,s,()=>{
    shadow(5,86,183);R(10,53,175,23,P.ink);R(4,47,179,20,P.steel);R(9,29,66,22,P.white);R(9,26,65,5,P.silver);R(13,32,59,13,P.navy);R(13,29,60,3,P.paperLight);
    R(18,17,32,15,P.navy);R(19,18,30,2,P.light);R(22,20,3,10,P.steel);R(43,20,3,10,P.steel);R(30,24,10,2,P.steel);R(53,34,17,9,P.ink);
    R(75,7,45,48,P.white);R(81,3,34,5,P.white);R(78,7,39,3,P.paperLight);for(let j=0;j<24;j++)R(117+Math.floor(j*.7),9+j,5,1,P.white);
    R(80,13,19,23,P.glass);R(102,13,15,23,P.glass2);for(let j=0;j<22;j++)R(117,14+j,Math.floor(j*.7)+1,1,P.glass);R(81,14,16,2,P.light);R(104,14,10,2,P.steel);R(101,10,2,28,P.silver);
    R(134,34,38,18,P.white);R(139,33,27,2,P.paperLight);R(172,40,13,25,P.steel);R(177,44,7,10,P.paper);R(180,56,6,10,P.ink);R(171,60,16,4,P.silver);R(179,66,10,5,P.steel);
    R(8,48,166,17,P.white);R(8,61,166,4,P.red);R(8,65,166,7,P.steel);R(8,73,165,3,P.line);R(75,40,1,31,P.steel);R(129,39,1,33,P.steel);R(111,41,10,3,P.line);R(133,29,10,4,P.navy);R(141,28,4,7,P.line);
    R(4,50,5,12,P.red);R(4,63,5,5,P.paper);text('SERVICE',82,49,P.navy);text(id,85,69,P.navy);
    for(const wx of [39,144]){circle(wx,73,17,P.ink);circle(wx,74,14,P.black);circle(wx,74,10,P.light);circle(wx,74,7,P.silver);circle(wx,74,3,P.ink);const phase=Math.floor(roll*8)%2;if(phase===0){R(wx-1,66,2,5,P.navy);R(wx-1,78,2,5,P.navy);R(wx-8,73,5,2,P.navy);R(wx+4,73,5,2,P.navy);}else{line(wx-6,68,wx-3,71,P.navy,2);line(wx+3,77,wx+6,80,P.navy,2);line(wx+3,71,wx+6,68,P.navy,2);line(wx-6,80,wx-3,77,P.navy,2);}R(wx-12,62,4,2,P.line);}
  });}
  function account(x,y,s=1,balance='12.48M'){at(x,y,s,()=>{
    frame(0,0,182,82,P.deep,P.light);R(3,3,176,3,P.red);text('CENTRAL COMPANY BALANCE',10,15,P.silver);text('IDR '+balance,10,33,P.paper,2);R(10,57,161,1,P.line);text('ONE ACCOUNT / ALL CARDS',10,67,P.steel);
  });}
  function yard(){
    R(0,0,W,H,P.deep);R(0,54,W,226,P.wall);R(0,47,W,7,P.line);R(0,47,W,1,P.steel);for(let x=19;x<W;x+=208){frame(x,73,187,186,P.ink,P.line);for(let y=82;y<238;y+=8)R(x+4,y,179,2,P.wall2);R(x+17,244,11,9,P.amber);R(x+157,244,11,9,P.amber);}R(0,265,W,4,P.light);R(0,270,W,130,'#283842');R(0,328,W,1,P.line);R(0,390,W,10,P.ink);for(let x=35;x<W;x+=190){R(x,294,2,74,P.paperDark);R(x+156,294,2,74,P.paperDark);}grain(0,280,W,107,'#30414a',12);
  }
  function researchSheet(){
    // A clean sheet avoids inheriting rules from the reimbursement form.
    R(494,57,119,150,P.ink);R(491,53,119,150,P.paperShade);R(493,55,115,145,P.paper);R(494,55,112,2,P.paperLight);
    text('VENDOR RESEARCH',501,69,P.wood);line(501,82,599,82,P.paperDark);
    ['EVALUATE','CONTACT','COORDINATE','IMPLEMENT'].forEach((label,i)=>{const y=94+i*25;text(label,501,y,P.wood);line(501,y+12,599,y+12,P.paperShade);});
    R(540,49,22,8,P.ink);R(542,48,18,3,P.steel);R(543,51,3,9,P.light);R(556,51,3,9,P.light);R(545,48,12,1,P.silver);
  }
  function seatedAnalyst(t){
    const key=t>11.2&&t<14.4?Math.floor(t*4)%2:0;
    // Back view: feet and chair base on the floor, then torso, then the near chair back.
    ellipse(306,372,58,8,P.black);
    R(303,333,8,31,P.steel);R(304,337,3,24,P.light);
    line(307,363,266,373,P.light,3);line(307,363,348,373,P.light,3);line(307,363,307,378,P.steel,3);line(307,363,282,357,P.line,3);line(307,363,331,357,P.line,3);
    circle(264,375,4,P.black);circle(350,375,4,P.black);circle(309,380,3,P.black);circle(281,358,3,P.black);circle(333,358,3,P.black);
    R(274,321,16,29,P.navy);R(273,344,12,18,P.ink);R(266,359,21,9,P.black);R(322,321,16,28,P.navy);R(327,343,12,19,P.ink);R(326,359,23,9,P.black);R(267,359,17,2,P.line);R(329,359,17,2,P.line);
    R(264,323,82,13,P.ink);R(267,322,77,8,P.line);R(271,323,68,3,P.navy);
    // Both forearms reach forward to the keyboard's actual y253–260 surface.
    line(283,254,276,270,P.navy,9);line(326,254,335,268,P.navy,9);
    line(277,270,303,255+key,P.skinShade,6);line(279,268,304,253+key,P.skin,4);R(302,252+key,13,5,P.skinLight);
    line(336,269,351,257-key,P.skinShade,6);line(337,267,352,254-key,P.skin,4);R(349,252-key,14,5,P.skinLight);
    // The back occludes the far arm; the near hand stays visible beside the torso.
    R(291,245,31,9,P.navy);R(281,251,51,45,P.navy);R(286,294,43,24,P.navy);R(281,254,3,29,P.light);R(329,254,4,34,P.line);R(299,248,16,2,P.light);
    R(301,233,13,13,P.skinShade);R(303,236,9,8,P.skin);R(295,244,23,4,P.navy);
    R(294,204,22,4,P.black);R(290,208,30,7,P.black);R(288,215,34,15,P.black);R(292,230,28,6,P.black);R(296,236,20,3,P.ink);
    R(294,207,21,2,P.ink);R(290,217,3,12,P.ink);R(317,213,3,17,P.ink);R(285,222,4,7,P.skinShade);R(322,222,4,7,P.skinShade);
    R(261,278,17,5,P.ink);R(336,278,16,5,P.ink);R(264,283,3,28,P.line);R(346,283,3,28,P.line);
    R(279,276,55,5,P.ink);R(273,281,67,38,P.ink);R(280,319,53,7,P.ink);R(279,280,53,3,P.light);R(278,284,57,32,P.navy);R(284,288,45,22,'#2c414d');R(284,310,44,4,P.line);R(282,317,49,4,P.line);
  }
  function research(t){
    background('office',office);at(91,212,.34,()=>stack(0,0));
    text('VENDOR OPTIONS',324,143,P.paper);for(let n=0;n<3;n++){const a=ramp(t,10.7+n*.85,11.4+n*.85);alpha(a,()=>{text(['CARD / VEHICLE','COMPANY FUNDING','REPORTING'][n],324,165+n*19,P.silver);if(t>12.7+n*.55){line(459,165+n*19,462,168+n*19,P.green);line(462,168+n*19,467,160+n*19,P.green);}});}
    const selection=ramp(t,14.4,15.3);alpha(selection,()=>{R(316,134,166,94,P.glass);text('PERTAMINA',329,145,P.paper,2);text('RETAIL',329,165,P.paper,2);text('SELECTED PROVIDER',328,195,P.green);text('VENDOR TECHNOLOGY',328,214,P.steel);});
    alpha(ramp(t,11.1,12),researchSheet);
    seatedAnalyst(t);
    alpha(ramp(t,15.5,16.4),()=>{card(349,284,1.07);text('CORPORATE ARRANGEMENT',313,378,P.redLight);});
    text('FAUZAN / VENDOR RESEARCH + COORDINATION',92,28,P.steel);
  }
  function fleet(t,hideHero=false){
    background('yard',yard);account(222,40);text('ILLUSTRATIVE BALANCE',226,134,P.light);
    text('~40 VEHICLES / ~IDR 50M MONTHLY FUNDING',44,15,P.paper,2);
    const pairs=[{x:38,id:'VH-017',at:18.6},{x:230,id:'VH-024',at:20.5},{x:422,id:'VH-031',at:22.1}];
    for(const p of pairs){const reveal=ramp(t,p.at,p.at+1);alpha(reveal,()=>{const cx=p.x+40;line(313,123,313,150,P.redDark);line(313,150,cx+55,150,P.redDark);line(cx+55,150,cx+55,177,P.redLight);card(cx,181,.85,p.id);if(!hideHero||p.id!=='VH-017')pickup(p.x+mix(-32,0,reveal),280,.96,p.id.slice(-3),reveal<1?t:0);text(p.id,p.x+61,379,P.silver);line(cx+53,244,cx+53,264,P.redLight);R(cx+50,263,7,3,P.redLight);});}
    alpha(ramp(t,23,23.8),()=>{text('~40 VEHICLES',464,62,P.paper);for(let n=0;n<40;n++)alpha(ramp(t,23+n*.024,23.4+n*.024),()=>R(465+(n%10)*10,82+Math.floor(n/10)*10,4,4,P.redLight));text('ONE CARD',59,56,P.silver);text('ONE VEHICLE',59,69,P.silver);text('3 REPRESENTATIVE PAIRS',424,135,P.light);});
  }
  function stationBackground(){
    R(0,0,W,H,P.deep);for(let i=0;i<12;i++){const hh=28+(i*17)%53;R(i*53,130-hh,46,hh,P.wall);R(i*53+9,139-hh,3,4,P.wall2);R(i*53+24,155-hh,3,4,P.wall2);}R(0,143,W,111,P.wall2);R(0,250,W,150,'#283842');R(0,348,W,4,P.line);R(0,385,W,15,P.ink);for(let i=0;i<7;i++)R(i*115,376,65,3,P.paperDark);
    R(55,117,355,220,P.ink);frame(68,137,329,130,P.wall,P.line);windowPane(83,161,105,71);R(216,155,75,112,P.navy);R(223,163,61,52,P.glass);R(282,215,3,10,P.steel);text('SERVICE',96,146,P.steel);R(68,271,328,6,P.steel);
    R(56,91,12,245,P.steel);R(60,97,3,235,P.light);R(406,91,13,245,P.steel);R(409,99,3,233,P.light);R(43,54,388,42,P.line);R(43,54,388,5,P.silver);R(43,65,388,27,P.red);R(43,90,388,4,P.redDark);R(53,98,368,3,P.light);text('PERTAMINA RETAIL',128,71,P.paperLight,2);
    // A front-elevation dispenser with a reader and a hose stowed at its side.
    R(335,231,50,109,P.ink);R(339,230,45,99,P.silver);R(341,232,40,3,P.white);R(342,241,36,27,P.deep);text('DIESEL',345,246,P.green);R(342,259,26,3,P.greenDark);R(339,275,45,29,P.red);R(340,276,43,2,P.redLight);R(350,309,24,15,P.steel);R(336,329,53,10,P.ink);R(389,257,5,60,P.black);R(386,252,7,18,P.greenDark);
    frame(393,244,25,38,P.navy,P.light);R(398,250,15,12,P.glass);R(400,267,11,2,P.amber);
    grain(0,342,W,33,'#32414a',12);
  }
  function transaction(t,hideVehicle=false){
    background('station',stationBackground);const drive=ramp(t,26,27.6);if(!hideVehicle)pickup(mix(-185,92,drive),279,1.06,'017',drive<1?t:0);person(300,264,P.wood2, t>=28.5&&t<30?-9:0);person(406,264,P.redDark);
    if(t>=28){const u=ramp(t,28,29.1),out=1-ramp(t,30,30.6);alpha(out,()=>card(mix(316,388,u),mix(275,230,u),mix(.37,.24,u)));if(t>=29.1)R(400,267,11,2,P.green);}
    if(t>=30.6&&t<33.2){const pts=[[388,286],[402,300],[400,342],[382,360],[167,360],[150,345],[149,322]];for(let n=1;n<pts.length;n++)line(...pts[n-1],...pts[n],P.black,4);R(144,317,10,8,P.greenDark);}
    account(449,19,.94,t>=33?'12.16M':'12.48M');
    const panel=ramp(t,27.8,28.5);alpha(panel,()=>{
      frame(450,137,174,203,P.deep,P.line);text('COMPANY PURCHASE',461,151,P.green);text('ILLUSTRATIVE DATA',461,164,P.light);line(461,178,612,178,P.line);
      const rows=[['VEHICLE','VH-017',28.6],['ODOMETER','58,420 KM',29.5],['FUEL','DIESEL',30],['LITERS',(32*ramp(t,30.6,32.4)).toFixed(1)+' L',30.6]];
      rows.forEach((r,i)=>alpha(ramp(t,r[2],r[2]+.5),()=>{text(r[0],461,191+i*24,P.steel);text(r[1],533,191+i*24,P.paper);}));
      alpha(ramp(t,32.4,33),()=>{line(461,281,612,281,P.line);text('IDR 320,000',461,294,P.paper,2);text('RECORDED',461,322,P.green);});
    });
    text('DEMO VH-017 / REGISTERED VEHICLE',77,390,P.silver);
  }
  function monitor(t){
    shadow(85,353,474);R(34,321,574,12,P.wood3);R(34,324,574,2,P.woodLight);R(40,333,560,13,P.wood);R(49,346,13,54,P.navy);R(578,346,13,54,P.navy);
    R(301,289,32,30,P.steel);R(273,316,90,6,P.line);R(278,315,81,2,P.silver);
    frame(79,39,485,255,P.ink,P.light);R(85,46,473,235,P.deep);R(320,285,3,2,P.green);
    text('VENDOR TRANSACTION HISTORY',99,62,P.paper,2);text('SYNTHETIC EXCERPT / 3 PURCHASES',100,86,P.steel);line(98,106,543,106,P.line);
    const cols=[100,202,310,394,485];['VEHICLE','ODOMETER','VOLUME','IDR','STATUS'].forEach((v,i)=>text(v,cols[i],118,P.light));
    const rows=[['VH-017','58,420','32.0 L','320,000','OK'],['VH-024','72,610','36.0 L','360,000',t>=38.3?'REVIEW':'OK'],['VH-031','44,230','30.0 L','300,000','OK']];
    rows.forEach((row,i)=>alpha(ramp(t,34.1+i*.7,34.8+i*.7),()=>{const y=142+i*27;R(96,y-6,450,22,i===1&&t>=38.3?'#3b352c':P.wall);if(i===1&&t>=38.3)R(96,y-6,2,22,P.amber);row.forEach((v,j)=>text(v,cols[j],y,j===4?(i===1&&t>=38.3?P.amber:P.green):P.paper));}));
    const comparison=ramp(t,36.3,37);alpha(comparison,()=>{
      R(96,223,450,47,t>=38.3?'#3b352c':P.wall2);
      if(t<38.3){text('VH-017 / COMPARABLE FILL INTERVAL',106,232,P.steel);text('58,420 - 58,100 = 320 KM',106,249,P.paper);text('320 / 32 = 10.0 KM/L',361,249,P.green);}
      else{text('VH-024 / MANUAL REVIEW',106,232,P.amber);text('180 KM / 36 L = 5.0 KM/L',106,249,P.paper);text('CHECK ROUTE, LOAD, ENTRIES',354,249,P.paperShade);}
    });
    alpha(ramp(t,40.1,40.9),()=>{
      R(96,223,450,47,P.wall2);text('BALANCE REVIEW',106,232,P.steel);text('IDR 12.16M',106,249,P.paper,2);
      const pts=[[284,247],[306,236],[332,242],[358,250],[384,259],[410,263]];for(let i=1;i<pts.length;i++)line(...pts[i-1],...pts[i],P.amber);for(let x=282;x<415;x+=5)R(x,253,2,1,P.paperDark);text('15M',422,250,P.amber);text('REVIEW',476,249,P.paper);
    });
    R(105,329,130,10,P.ink);for(let i=0;i<19;i++)R(109+i*6,332,4,2,P.steel);cup(544,302);
    alpha(ramp(t,41.2,42),()=>{
      R(290,313,245,65,P.paperShade);R(292,313,241,60,P.paper);text('RECOMMEND TOP-UP',306,324,P.wood);text('IDR 20M',306,340,P.wood,2);text('COMPANY DECISION PENDING',306,362,P.paperDark);
    });
  }
  function reporting(t){
    R(0,0,W,H,P.deep);R(0,18,W,279,P.wall);R(0,19,W,1,P.line);windowPane(-65,63,127,142);windowPane(581,63,127,142);R(0,296,W,104,P.wall2);R(0,299,W,3,P.line);monitor(t);
  }
  function recordTile(x,y,s=1){at(x,y,s,()=>{frame(0,0,152,39,P.greenDark,P.green);text('VH-017 / RECORDED',10,9,P.paper);text('IDR 320,000',10,24,P.green);});}
  function smallStation(){
    R(14,22,132,91,P.wall2);frame(24,43,38,36,P.glass,P.line);R(86,43,29,69,P.navy);R(90,49,21,32,P.glass);R(4,20,6,94,P.steel);R(151,20,6,94,P.steel);
    R(0,0,163,5,P.silver);R(0,5,163,17,P.red);text('PERTAMINA RETAIL',31,10,P.paper);R(0,22,163,3,P.line);
    R(122,60,20,52,P.silver);R(125,65,14,13,P.deep);R(127,69,9,2,P.green);R(122,83,20,15,P.red);R(144,76,3,27,P.black);R(0,114,164,5,P.line);
  }
  function ending(t,hideMonitor=false){
    background('yard',yard);alpha(.78,()=>R(0,0,W,H,P.deep));
    account(27,45,.9,'12.16M');card(250,60,.86);at(293,206,1,smallStation);pickup(112,235,.85,'017');if(!hideMonitor)at(436,97,.32,()=>monitor(42.4));
    const u=ramp(t,44,45.4);alpha(u,()=>{line(110,127,110,191,P.greenDark);line(110,191,294,191,P.greenDark);line(294,124,294,191,P.greenDark);line(294,191,497,191,P.greenDark);line(497,191,497,155,P.greenDark);[110,294,497].forEach(x=>R(x-2,189,5,5,P.green));});
    const old=1-ramp(t,44,45.6);alpha(old,()=>{at(25,190,.54,()=>stack(0,0));text('PERSONAL CASH > RECEIPTS > CLAIMS',34,347,P.amber);});
    if(!quietPresentation)alpha(ramp(t,45.4,46.5),()=>{
      R(20,332,600,54,P.deep);const labels=[['COMPANY','ACCOUNT'],['VEHICLE','CARD'],['REFUELING',''],['VENDOR','RECORDS'],['COST','REVIEW']];
      labels.forEach((a,i)=>{const x=37+i*122;text(a[0],x,346,P.paper);text(a[1],x,364,P.steel);if(i<4)text('>',x+93,354,P.green);});
    });
    if(!quietPresentation)alpha(ramp(t,46,46.5),()=>{
      R(20,332,600,54,P.deep);
      const results=[['LESS','REIMBURSEMENT'],['CENTRAL','PAYMENT'],['VEHICLE COST','VISIBILITY']];
      results.forEach((a,i)=>{const x=[32,257,437][i];text(a[0],x,340,P.green,2);text(a[1],x,363,P.paper,2);});
    });
    text('A COMPANY-FUNDED, VEHICLE-IDENTIFIED PROCESS',43,19,P.steel);
  }
  function cross(from,to,u){
    from();alpha(u,()=>at(Math.round(20*(1-u)),0,1,to));
  }
  function draw(canvas,time){
    c=canvas.getContext('2d',{alpha:false});c.imageSmoothingEnabled=false;c.globalAlpha=1;c.setTransform(1,0,0,1,0,0);R(0,0,W,H,P.deep);
    // All sprite positions and camera handoffs derive from the same sampled playhead.
    const t=Math.floor(sourceTime(Math.max(0,time))*30)/30;
    if(t<8.8)receiptOpening(t);
    else if(t<10.6){const u=ramp(t,8.8,10.6);cross(()=>receiptOpening(8.8),()=>research(10.6),u);at(mix(134,91,u),mix(141,212,u),mix(1,.34,u),()=>paper(0,0,104,135));}
    else if(t<17.3)research(t);
    else if(t<18.8){const u=ramp(t,17.3,18.8);cross(()=>research(17.3),()=>fleet(18.8),u);card(mix(349,78,u),mix(284,181,u),mix(1.07,.85,u));}
    else if(t<25.1)fleet(t);
    else if(t<27.6){const u=ramp(t,25.1,27.6);cross(()=>fleet(25.1,true),()=>transaction(27.6,true),u);pickup(mix(38,92,u),mix(280,279,u),mix(.96,1.06,u),'017',t);}
    else if(t<33.5)transaction(t);
    else if(t<35.2){const u=ramp(t,33.5,35.2);cross(()=>transaction(33.5),()=>reporting(35.2),u);recordTile(mix(458,100,u),mix(288,133,u),mix(1,.92,u));}
    else if(t<42.8)reporting(t);
    else if(t<44.5){const u=ramp(t,42.8,44.5);cross(()=>reporting(42.8),()=>ending(44.5,true),u);at(mix(0,436,u),mix(0,97,u),mix(1,.32,u),()=>monitor(42.8));}
    else ending(t);
    text('DEMO TRANSACTIONS',514,389,P.light);
  }
  return {width:W,height:H,draw,palette:P};
})();
