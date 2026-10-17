import {mix,clamp,range,perspective,quadMatrix,createBuildingRenderer} from './space.js';
import {buildScene,cameraAt,SCREEN,FACADE_LOGO,CONTACT_SHADOWS} from './scene.js';
import {LOCATIONS,BRANCHES,RECORDS,TOTAL,TIMES,BEATS,REPORT_STEPS,number,percent} from './data.js';
import {createMonitorDisplay} from './monitor-display.js';
import {createAtmosphere} from './atmosphere.js';

const $=id=>document.getElementById(id);
const chapterEl=$('ch03-layer-1')||$('chapter-03');
const managed=!!document.querySelector('#chapter-03.chapter-03-unified');
const stage=$('stage'), geo=$('geography'), building=$('building'), detail=$('details');
const gc=geo.getContext('2d'), dc=detail.getContext('2d');
const monitor=$('monitor'), scrub=$('timeline');
const focusStatus=document.createElement('div');focusStatus.className='ch03-work-focus';focusStatus.hidden=true;
focusStatus.innerHTML='<span class="ch03-work-source">SAP records → Excel → Branch report</span><strong></strong><span class="ch03-work-detail"></span><small>Synthetic sample · IDR million</small>';stage.append(focusStatus);
const motion=matchMedia('(prefers-reduced-motion: reduce)');
const params=new URLSearchParams(location.search);
let time=params.has('t')?clamp(Number(params.get('t'))/TIMES.duration)*TIMES.duration:0;
if(!Number.isFinite(time)) time=0;

// In the integrated portfolio, Chapter III starts paused at t=0 until scrolled into view
let playing=false, office=false, speed=1, last=null, raf=0, beat=-1;
let hasEnteredOnce=false, pausedByOffscreen=false, userPaused=params.has('t'), inViewport=false;
let width=1,height=1,dpr=1,screenW=1000,screenH=562;

function buildingRenderer(){
  try{return createBuildingRenderer(building,buildScene());}
  catch(error){console.warn('Static reporting fallback:',error.message);return null;}
}
let drawGL=buildingRenderer();
let staticMode=motion.matches||!drawGL;
const metrics={renders:0,renderMs:[],frameMs:[],webgl:!!drawGL};
const companyLogo=new Image();companyLogo.src=new URL('./assets/logo-traknus.png',import.meta.url).href;
companyLogo.addEventListener('load',()=>render());
document.fonts.ready.then(()=>render());
const monitorDisplay=createMonitorDisplay(()=>render());
const atmosphere=createAtmosphere();
const contactShadow=document.createElement('canvas');contactShadow.width=128;contactShadow.height=128;
const shadowContext=contactShadow.getContext('2d'),shadowGradient=shadowContext.createRadialGradient(64,64,8,64,64,62);
shadowGradient.addColorStop(0,'rgba(0,0,0,.36)');shadowGradient.addColorStop(.5,'rgba(0,0,0,.18)');shadowGradient.addColorStop(1,'rgba(0,0,0,0)');
shadowContext.fillStyle=shadowGradient;shadowContext.fillRect(0,0,128,128);
let nativeScreenWidth=0,cloudLayerCount=0,monitorPoints=[],hoverScreen=false;

// Real geography is cached in metres around the Jakarta anchor; all later shots
// use this same origin. The local district and building are stylized geometry.
const R=6378137,rad=Math.PI/180;
const merc=lat=>Math.log(Math.tan(Math.PI/4+lat*rad/2));
const origin=LOCATIONS[0];
const world=(lon,lat)=>[(lon-origin.lon)*rad*R,0,-(merc(lat)-merc(origin.lat))*R];
const countries=window.INDONESIA_CARTOGRAPHY.map(c=>({
  name:c.name,rings:(c.type==='Polygon'?[c.coordinates]:c.coordinates).flatMap(poly=>poly.map(ring=>ring.map(([lon,lat])=>world(lon,lat))))
}));
const branchWorld=LOCATIONS.map(b=>world(b.lon,b.lat));

function poly(ctx,points,fill,stroke) {
  if(points.length<3||points.some(p=>!Number.isFinite(p[0])||!Number.isFinite(p[1])||p[2]<=.05)) return;
  ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();
  if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=.7;ctx.stroke();}
}
function label(ctx,text,x,y,color='#9ca3af',size=10,align='left') {
  ctx.font=`${size}px "JetBrains Mono", monospace`;ctx.textAlign=align;ctx.fillStyle=color;ctx.fillText(text,x,y);
}
function line(ctx,points,color,lineWidth=1) {
  ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p.slice(0,2)):ctx.moveTo(...p.slice(0,2)));
  ctx.strokeStyle=color;ctx.lineWidth=lineWidth;ctx.stroke();
}
function circle(ctx,x,y,r,color) {ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();}

function drawMap(t,p,camera) {
  gc.clearRect(0,0,width,height);
  // Sparse, deterministic night sky continues the accepted Chapter I–II field.
  gc.save();gc.globalAlpha=1-range(t,7.5,9.1);
  for(let i=0;i<55;i++){
    const x=((i*.618034+.13)%1)*width,y=((i*.414214+.21)%1)*height;
    const twinkle=.18+.18*(.5+.5*Math.sin(t*.55+i*1.7));
    circle(gc,x,y,i%9===0?1:.55,`rgba(${i%11===0?'255,170,112':'244,239,232'},${twinkle})`);
  }
  gc.restore();
  if(t>6.8) return;
  const mapAlpha=1-range(t,4.7,5.8);
  gc.save();gc.globalAlpha=mapAlpha;
  // Modest graticule gives scale without becoming a technical overlay.
  if(t<5.8) {
    for(const c of countries) for(const ring of c.rings) poly(gc,ring.map(p.point),c.name==='Indonesia'?'#141921':'#090c12',c.name==='Indonesia'?'#414750':'#1c2029');
  }
  const hub=p.point([0,0,0]);
  for(let i=1;i<branchWorld.length;i++) {
    const alpha=range(t,.1+i*.08,.45+i*.08), a=p.point(branchWorld[i]);
    if(alpha<=0||a[2]<0||hub[2]<0) continue;
    gc.globalAlpha=alpha*mapAlpha*(1-range(t,3.4,4.1));
    const bend=[mix(a[0],hub[0],.48),Math.min(a[1],hub[1])-Math.min(100,Math.abs(a[0]-hub[0])*.16+16)];
    const at=u=>[(1-u)**2*a[0]+2*(1-u)*u*bend[0]+u*u*hub[0],(1-u)**2*a[1]+2*(1-u)*u*bend[1]+u*u*hub[1]];
    const progress=range(t,.5+i*.07,2.55+i*.035);
    const points=Array.from({length:41},(_,j)=>at(j/40*progress));
    line(gc,points,'#ff6b3555',.9);
    if(progress>0&&progress<1){const head=at(progress);circle(gc,...head,2.3,'#e6b474');}
    circle(gc,a[0],a[1],3.1,'#d8a461');circle(gc,a[0],a[1],1.3,'#f4d6a4');
    if(width>700&&['MDN','SBY','SMD','DJJ'].includes(LOCATIONS[i].id)&&t<3.8) label(gc,LOCATIONS[i].name.toUpperCase(),a[0]+9,a[1]-10,'#9e968f',9);
  }
  gc.globalAlpha=mapAlpha;
  if(hub[2]>0){
    const glow=gc.createRadialGradient(hub[0],hub[1],0,hub[0],hub[1],26);
    glow.addColorStop(0,'#ff6b3545');glow.addColorStop(1,'#ff6b3500');gc.fillStyle=glow;gc.fillRect(hub[0]-26,hub[1]-26,52,52);
    circle(gc,hub[0],hub[1],5,'#ffaa70');
    gc.strokeStyle='#fe8a2f80';gc.lineWidth=1;gc.beginPath();gc.arc(hub[0],hub[1],11+3*range(t,1.8,3.2),0,Math.PI*2);gc.stroke();
    if(t<4.8){label(gc,'HEAD OFFICE',hub[0],hub[1]+32,'#f4efe8',width<700?10:12,'center');label(gc,'JAKARTA',hub[0],hub[1]+48,'#9e968f',8,'center');}
  }
  gc.restore();
  if(t<3.5){label(gc,`${LOCATIONS.length} offices · Jakarta Head Office`,width*.042,height-26,'#9e968f',width<700?8:10);}
}

function drawDetails(t,p) {
  dc.clearRect(0,0,width,height);
  if(t>4.9&&t<6.65){
    const h=p.point([2,6,4]);dc.save();dc.globalAlpha=range(t,4.9,5.3)*(1-range(t,6.3,6.65));
    if(h[2]>0){circle(dc,h[0],h[1],4,'#d3b077');label(dc,'PULOGADUNG',h[0]+14,h[1]-12,'#d3c1a4',10);}
    dc.restore();
  }
  if(t>4.2&&t<6.55){
    const a=Math.sin(clamp((t-4.2)/2.35)*Math.PI)*.17;
    const g=dc.createLinearGradient(0,height*.15,width,height*.9);g.addColorStop(0,`rgba(177,193,199,${a})`);g.addColorStop(.43,'#cad9e000');g.addColorStop(.75,'#cad9e000');g.addColorStop(1,`rgba(151,173,185,${a*.6})`);dc.fillStyle=g;dc.fillRect(0,0,width,height);
  }
}

const rowHTML=b=>`<td>${b.name}${b.headOffice?' · HO':''}</td>${['revenue','cost','profit','margin'].map(k=>`<td class="${k}"><span>${k==='margin'?percent(b[k]):number(b[k])}</span></td>`).join('')}`;
$('branch-rows').innerHTML=BRANCHES.map(b=>`<tr>${rowHTML(b)}</tr>`).join('');
$('report-total').innerHTML=`<tr><th scope="row">Division total</th>${['revenue','cost','profit','margin'].map(k=>`<td>${k==='margin'?percent(TOTAL[k]):number(TOTAL[k])}</td>`).join('')}</tr>`;
$('raw-rows').innerHTML=RECORDS.slice(0,6).map(r=>`<tr class="record-${r.account.toLowerCase()}"><td>${r.order}</td><td>${BRANCHES.find(b=>b.id===r.branch).name}</td><td>${r.account}</td><td>${number(r.amount)}</td></tr>`).join('');
$('record-count').textContent=`${TOTAL.records} records / ${TOTAL.orders} work orders`;
$('scope-count').textContent=`${BRANCHES.length} Head & Branch Offices`;
const reportRows=[...$('branch-rows').rows],rawRows=[...$('raw-rows').rows],flow=[...document.querySelectorAll('#chapter-03 .workflow span')];
const transfer=[...document.querySelectorAll('#transfer i')];
const steps=REPORT_STEPS;
let displayedStep=-1;
function drawWorkflow(t){
  const swap=range(t,11.8,12.3);
  $('sap-screen').style.opacity=1-swap;$('excel-screen').style.opacity=swap;
  $('excel-screen').style.transform=`translateY(${(1-swap)*18}px)`;
  rawRows.forEach((row,i)=>{const p=range(t,10.42+i*.12,10.68+i*.12);row.style.opacity=p;row.style.transform=`translateX(${(1-p)*15}px)`;});
  const extracted=Math.round(TOTAL.records*range(t,10.4,11.55));
  $('extract-count').textContent=`${extracted}/${TOTAL.records} records · ${rawRows.length}-row preview`;
  $('export-status').textContent=t<11.5?'Preparing export ↗':'Transfer to Excel ↗';
  transfer.forEach((el,i)=>{const p=clamp((t-(11.55+i*.09))/.58);el.style.opacity=Math.sin(p*Math.PI)*.7;el.style.transform=`translate(${p*70}px,${i*29-p*65}px)`;});
  const idx=Math.max(0,steps.findLastIndex(s=>t>=s[0]));
  if(displayedStep!==idx){
    const s=steps[idx];$('calc-label').textContent=s[1];$('calc-formula').textContent=s[2];$('calc-detail').textContent=s[3];
    flow.forEach((el,i)=>{el.className=i===s[4]?'active':i<s[4]?'done':'';});displayedStep=idx;
  }
  reportRows.forEach((row,i)=>{
    const entry=range(t,TIMES.group+i*.025,TIMES.group+.17+i*.025);row.style.opacity=entry;row.style.transform=`translateY(${(1-entry)*8}px)`;
    const threshold=i===0?[TIMES.revenue,TIMES.cost,TIMES.profit,TIMES.margin]:[0,1,2,3].map(k=>TIMES.compare+(i-1)*.035+k*.02);
    [...row.cells].slice(1).forEach((td,k)=>{
      td.firstElementChild.style.opacity=range(t,threshold[k],threshold[k]+.16);
      const profitInputs=k<2&&t>=TIMES.profit-.3&&t<TIMES.profit+.2;
      const marginInputs=(k===0||k===2)&&t>=TIMES.margin-.25&&t<TIMES.margin+.2;
      td.classList.toggle('lit',i===0&&((t>=threshold[k]-.13&&t<threshold[k]+.4)||profitInputs||marginInputs));
    });
  });
  $('report-total').style.opacity=range(t,TIMES.finish-.1,TIMES.finish+.25);
  $('report-foot-text').textContent=t>=TIMES.finish?'Common definitions. Comparable performance.':'Building a common reporting structure';
}

function drawMonitor(t,p){
  const visible=office||staticMode&&t>=TIMES.finish?1:0;
  monitor.style.opacity=visible;
  monitor.style.visibility=visible?'visible':'hidden';
  if(!visible){monitor.style.transform='none';return;}
  // Automatic playback stays in third-person. Only explicit inspection enlarges it.
  const focus=office||staticMode&&t>=TIMES.finish?1:0;
  const fit=Math.min((width-(width<700?28:140))/screenW,(height-(width<700?94:110))/screenH);
  const rw=screenW*fit,rh=screenH*fit,x=(width-rw)/2,y=(height-rh)/2+9;
  const flat=[[x,y],[x+rw,y],[x+rw,y+rh],[x,y+rh]];
  const projected=SCREEN.map(p.point);
  const q=projected.map((v,i)=>[mix(v[0],flat[i][0],focus),mix(v[1],flat[i][1],focus)]);
  monitor.style.transform=quadMatrix(q,screenW,screenH);
  drawWorkflow(t);
}

function setBeat(t){
  const idx=BEATS.findLastIndex(b=>t>=b.time), b=BEATS[Math.max(0,idx)];
  if(beat!==idx){
    $('caption-title').textContent=b.title;$('caption-description').textContent=b.description;
    $('shot-location').textContent=b.place;$('shot-detail').textContent=b.detail;
    $('beat-number').textContent=`0${idx+1} / 06`;
    [...$('chapters').children].forEach((el,i)=>i===idx?el.setAttribute('aria-current','step'):el.removeAttribute('aria-current'));
    $('announcement').textContent=b.title+' '+b.description;beat=idx;
  }
  $('shot-detail').style.opacity=1-range(t,10.4,11.5);
  if(t>=TIMES.import&&t<TIMES.finish){
    const step=Math.max(0,steps.findLastIndex(s=>t>=s[0])),s=steps[step];
    const titles=['Import the transaction records.','Group records by branch.','Aggregate the revenue.','Aggregate the costs.','Calculate the profit.','Calculate the profitability margin.',`Compare all ${BRANCHES.length} branches.`];
    const title=titles[Math.min(step,6)],description=`${s[2]} · ${s[3]}`;
    if($('caption-title').textContent!==title)$('caption-title').textContent=title;
    if($('caption-description').textContent!==description)$('caption-description').textContent=description;
  }
  $('final-cue').hidden=t<TIMES.finish+.25||office||staticMode;
}

function render(){
  const started=performance.now();
  const cam=cameraAt(time,width,height);
  const p=perspective(cam.eye,cam.target,width,height);
  const screenPoints=SCREEN.map(p.point);
  monitorPoints=screenPoints;
  nativeScreenWidth=Math.max(...screenPoints.map(v=>v[0]))-Math.min(...screenPoints.map(v=>v[0]));
  drawMap(time,p,cam);
  building.style.opacity=staticMode&&time>=TIMES.finish?0:range(time,4.2,4.8)*(office?.18:1);
  cloudLayerCount=0;
  if(drawGL&&time>4.2&&!(staticMode&&time>=TIMES.finish)){
    const surfaces=[{...monitorDisplay.update(time),quad:SCREEN,kind:1,active:hoverScreen}];
    if(companyLogo.complete&&companyLogo.naturalWidth)surfaces.push({source:companyLogo,quad:FACADE_LOGO,uv:[[.12,.28],[.8775,.28],[.8775,.64],[.12,.64]],kind:0});
    surfaces.push(...CONTACT_SHADOWS.map(quad=>({source:contactShadow,quad,kind:3})));
    const clouds=atmosphere.layers(time,p);cloudLayerCount=clouds.length;surfaces.push(...clouds);
    drawGL(p,width,height,dpr,surfaces,atmosphere.haze(time,cam.eye[1]));
  }
  // The HTML report is only painted by drawMonitor when explicitly inspected.
  // Automatic playback uses the native LCD texture, without hidden DOM updates.
  drawDetails(time,p);drawMonitor(time,p);setBeat(time);
  focusStatus.hidden=!(managed&&width<700&&height>width&&time>=10.4);
  if(!focusStatus.hidden){
    const step=time<TIMES.import?['','EXTRACT SERVICE TRANSACTIONS',`${Math.round(TOTAL.records*range(time,10.4,11.55))} / ${TOTAL.records} records`,'Preparing a common reporting structure']:steps[Math.max(0,steps.findLastIndex(s=>time>=s[0]))];
    focusStatus.querySelector('strong').textContent=step[2];focusStatus.querySelector('.ch03-work-detail').textContent=step[3];
  }
  scrub.value=time;$('time').textContent=time.toFixed(1).padStart(4,'0');
  scrub.setAttribute('aria-valuetext',`${time.toFixed(1)} seconds, ${BEATS[Math.max(0,beat)].nav}`);
  $('view').setAttribute('aria-pressed',String(office));$('view').textContent=office?'Desk view':'Monitor detail';
  const ms=performance.now()-started;metrics.renders++;metrics.renderMs.push(ms);if(metrics.renderMs.length>2400)metrics.renderMs.shift();
}
function syncPlay(){
  $('play').innerHTML=playing?'<span aria-hidden="true">Ⅱ</span> Pause':'<span aria-hidden="true">▷</span> Play';
  $('play').setAttribute('aria-label',playing?'Pause animation':'Play animation');
}
function pauseInternal(){playing=false;last=null;cancelAnimationFrame(raf);raf=0;syncPlay();}
function pause(){userPaused=true;pausedByOffscreen=false;pauseInternal();}
function play(){
  if(!drawGL)return;
  if(time>=TIMES.duration)time=0;
  office=false;staticMode=false;userPaused=false;pausedByOffscreen=false;hasEnteredOnce=true;
  $('static-intro').hidden=true;
  if(playing)return;playing=true;last=null;syncPlay();raf=requestAnimationFrame(tick);
}
function seek(t){
  pauseInternal();office=false;hoverScreen=false;stage.style.cursor='';
  time=Math.max(0,Math.min(TIMES.duration,Number(t)||0));render();
}
function tick(now){
  if(!playing)return;
  if(last!==null){const dt=now-last;metrics.frameMs.push(dt);if(metrics.frameMs.length>2400)metrics.frameMs.shift();time=Math.min(TIMES.duration,time+dt/1000*speed);}
  last=now;render();
  if(time>=TIMES.duration){pauseInternal();return;}raf=requestAnimationFrame(tick);
}
function resize(){
  const r=stage.getBoundingClientRect();width=Math.max(1,r.width);height=Math.max(1,r.height);dpr=Math.min(devicePixelRatio||1,2);
  screenW=1000;screenH=562;
  for(const [canvas,ctx] of [[geo,gc],[detail,dc]]){canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);}
  render();
}

$('chapters').innerHTML=BEATS.map((b,i)=>`<button type="button" aria-label="Go to ${b.nav}"><span class="num">0${i+1}</span>${b.nav}</button>`).join('');
[...$('chapters').children].forEach((el,i)=>el.addEventListener('click',()=>{userPaused=true;pausedByOffscreen=false;hasEnteredOnce=true;seek(BEATS[i].time);}));
scrub.max=TIMES.duration;$('duration').textContent=TIMES.duration.toFixed(1);
scrub.addEventListener('input',()=>{userPaused=true;pausedByOffscreen=false;hasEnteredOnce=true;seek(scrub.value);});
$('play').addEventListener('click',()=>playing?pause():play());
$('replay').addEventListener('click',()=>{seek(0);play();});
$('speed').addEventListener('change',e=>{speed=Number(e.target.value);last=null;});
$('view').addEventListener('click',()=>{pause();if(!drawGL)return;staticMode=false;office=!office;time=Math.max(time,9.75);render();});

function monitorHit(x,y){
  if(time<10.4||office||staticMode||!drawGL)return false;
  let sign=0;
  for(let i=0;i<4;i++){
    const a=monitorPoints[i],b=monitorPoints[(i+1)%4];if(a[2]<=0||b[2]<=0)return false;
    const cross=(b[0]-a[0])*(y-a[1])-(b[1]-a[1])*(x-a[0]);
    if(Math.abs(cross)<.001)continue;const next=Math.sign(cross);if(sign&&sign!==next)return false;sign=next;
  }return !!sign;
}
stage.addEventListener('pointermove',e=>{
  const r=stage.getBoundingClientRect(),hit=monitorHit(e.clientX-r.left,e.clientY-r.top);
  if(hit!==hoverScreen){hoverScreen=hit;stage.style.cursor=hit?'pointer':'';render();}
});
stage.addEventListener('pointerleave',()=>{if(hoverScreen){hoverScreen=false;stage.style.cursor='';render();}});
stage.addEventListener('click',e=>{const r=stage.getBoundingClientRect();if(monitorHit(e.clientX-r.left,e.clientY-r.top))openDialog('report-dialog');});
stage.setAttribute('aria-description','Use the playback controls to follow the story. In the workstation view, click the monitor or press Enter here to inspect the report.');
document.addEventListener('visibilitychange',()=>{if(document.hidden&&playing){pausedByOffscreen=true;pauseInternal();}});

function getVisiblePx(el){
  if(!el)return 0;
  const r=el.getBoundingClientRect();
  return Math.max(0,Math.min(window.innerHeight,r.bottom)-Math.max(0,r.top));
}
function isChapter03Dominant(){
  if(!chapterEl)return false;
  const v3=getVisiblePx(chapterEl);
  const v1=getVisiblePx($('hero'));
  const v2=getVisiblePx($('chapter-02'));
  const v4=getVisiblePx($('chapter-04'));
  return v3>window.innerHeight*0.35&&v3>=v1&&v3>=v2&&v3>=v4;
}

document.addEventListener('keydown',e=>{
  if(managed&&!chapterEl.classList.contains('is-active'))return;
  if(e.altKey||e.ctrlKey||e.metaKey)return;
  if(document.querySelector('dialog[open]')||document.querySelector('#hero-info-container.is-open')||document.querySelector('.archival-dossier:not([hidden])'))return;
  if(/INPUT|SELECT|TEXTAREA|BUTTON|A/.test(e.target.tagName)||e.target.closest?.('#portfolio-left-nav'))return;
  const focusedInside=chapterEl&&chapterEl.contains(document.activeElement);
  if(!focusedInside&&!isChapter03Dominant())return;

  if(e.code==='Space'){e.preventDefault();playing?pause():play();}
  else if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();userPaused=true;pausedByOffscreen=false;hasEnteredOnce=true;seek(time+(e.shiftKey?1:.25)*(e.key==='ArrowRight'?1:-1));}
  else if(e.key==='Home'&&focusedInside){e.preventDefault();userPaused=true;pausedByOffscreen=false;seek(0);}
  else if(e.key==='End'&&focusedInside){e.preventDefault();userPaused=true;pausedByOffscreen=false;seek(TIMES.duration);}
  else if(e.key==='Enter'&&e.target===stage&&time>=10.4){e.preventDefault();openDialog('report-dialog');}
  else if(/^[1-6]$/.test(e.key)){userPaused=true;pausedByOffscreen=false;hasEnteredOnce=true;seek(BEATS[Number(e.key)-1].time);}
});

function openDialog(id){pause();$(id).showModal();}
for(const id of ['inspect','inspect-final','static-inspect'])$(id).addEventListener('click',()=>openDialog('report-dialog'));
$('story').addEventListener('click',()=>openDialog('story-dialog'));
$('close-report').addEventListener('click',()=>$('report-dialog').close());$('close-story').addEventListener('click',()=>$('story-dialog').close());
$('inspect-branches').innerHTML=BRANCHES.map(b=>`<tr><th scope="row">${b.name}</th><td>${b.orders}</td>${['revenue','cost','profit','margin'].map(k=>`<td>${k==='margin'?percent(b[k]):number(b[k])}</td>`).join('')}</tr>`).join('');
$('inspect-total').innerHTML=`<tr><th scope="row">Division total</th><td>${TOTAL.orders}</td>${['revenue','cost','profit','margin'].map(k=>`<td>${k==='margin'?percent(TOTAL[k]):number(TOTAL[k])}</td>`).join('')}</tr>`;
$('branch-select').innerHTML=BRANCHES.map(b=>`<option value="${b.id}">${b.name}</option>`).join('');
function branchFormula(){const b=BRANCHES.find(b=>b.id===$('branch-select').value);$('branch-formula').textContent=`${b.name}: ${number(b.revenue)} revenue − ${number(b.cost)} cost = ${number(b.profit)} profit. ${number(b.profit)} ÷ ${number(b.revenue)} × 100 = ${percent(b.margin)} margin. IDR million; ${b.orders} synthetic work orders.`;}
$('branch-select').addEventListener('change',branchFormula);branchFormula();
$('division-numbers').innerHTML=['revenue','cost','profit','margin'].map(k=>`<div><span>${k==='margin'?'Weighted margin':k[0].toUpperCase()+k.slice(1)+' · IDR m'}</span><strong>${k==='margin'?percent(TOTAL[k]):number(TOTAL[k])}</strong></div>`).join('');
$('division-formula').textContent=`${BRANCHES.length} Head & Branch Offices · ${TOTAL.orders} work orders · ${TOTAL.records} ledger records. ${number(TOTAL.profit)} ÷ ${number(TOTAL.revenue)} × 100 = ${percent(TOTAL.margin)}.`;
function tab(name,focus=false){for(const n of ['branch','division']){const active=n===name;$(n+'-tab').setAttribute('aria-selected',String(active));$(n+'-tab').tabIndex=active?0:-1;$(n+'-panel').hidden=!active;}if(focus)$(name+'-tab').focus();}
for(const name of ['branch','division']){
  $(name+'-tab').addEventListener('click',()=>tab(name));
  $(name+'-tab').addEventListener('keydown',e=>{if(['ArrowRight','ArrowLeft','Home','End'].includes(e.key)){e.preventDefault();tab(e.key==='Home'?'branch':e.key==='End'?'division':name==='branch'?'division':'branch',true);}});
}
for(const id of ['story-steps','static-steps'])$(id).innerHTML=BEATS.map(b=>`<li><strong>${b.title}</strong>${b.description}</li>`).join('');
function reducedPresentation(){
  staticMode=motion.matches||!drawGL;$('reduced-story').hidden=!staticMode;$('static-intro').hidden=!staticMode;
  if(staticMode){pauseInternal();office=false;time=TIMES.duration;}
  $('view').disabled=!drawGL;$('play').disabled=!drawGL;$('replay').disabled=!drawGL;
  scrub.disabled=!drawGL;[...$('chapters').children].forEach(b=>b.disabled=!drawGL);
  if(!drawGL)$('static-intro').textContent='Static presentation · interactive report available below.';
  render();
}
motion.addEventListener('change',reducedPresentation);
building.addEventListener('webglcontextlost',e=>{e.preventDefault();drawGL=null;reducedPresentation();});
building.addEventListener('webglcontextrestored',()=>{drawGL=buildingRenderer();reducedPresentation();});
new ResizeObserver(resize).observe(stage);

// Viewport Lifecycle Management: start on first scroll entry, pause offscreen, resume on return
function evaluateViewportLifecycle(){
  if(managed||!chapterEl)return;
  const rect=chapterEl.getBoundingClientRect();
  const vh=window.innerHeight||800;
  const visiblePx=Math.max(0,Math.min(vh,rect.bottom)-Math.max(0,rect.top));
  const ratio=visiblePx/Math.max(1,Math.min(vh,rect.height));

  if(ratio>=0.28){
    if(!inViewport){
      inViewport=true;
      if(!staticMode&&!params.has('t')){
        if(!hasEnteredOnce){
          hasEnteredOnce=true;
          play();
        }else if(pausedByOffscreen&&!userPaused&&time<TIMES.duration){
          pausedByOffscreen=false;
          play();
        }else{
          render();
        }
      }else{
        render();
      }
    }
  }else if(ratio<0.06){
    if(inViewport){
      inViewport=false;
      if(playing){
        pausedByOffscreen=true;
        pauseInternal();
      }
    }
  }
}

if('IntersectionObserver' in window&&chapterEl){
  const observer=new IntersectionObserver(()=>evaluateViewportLifecycle(),{threshold:[0,0.05,0.15,0.28,0.5,0.75]});
  observer.observe(chapterEl);
}
window.addEventListener('scroll',evaluateViewportLifecycle,{passive:true});

resize();reducedPresentation();syncPlay();
evaluateViewportLifecycle();

// Bounded browser QA & portfolio integration hooks
window.Rebuild={
  seek:(t)=>{userPaused=true;pausedByOffscreen=false;hasEnteredOnce=true;seek(t);},
  pause,
  play,
  replay:()=>{seek(0);play();},
  state:()=>({time,playing,office,speed,staticMode,beat,width,height,nativeScreenWidth,cloudLayerCount,screenSurface:drawGL?'webgl':'static',lensZoom:1,monitorPoints,hoverScreen,inViewport,hasEnteredOnce,pausedByOffscreen,userPaused}),
  data:{BRANCHES,RECORDS,TOTAL,TIMES},
  metrics,
  resetMetrics(){metrics.renderMs.length=0;metrics.frameMs.length=0;metrics.renders=0;}
};
window.Ch03Scene01=window.Rebuild;
