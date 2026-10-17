'use strict';
(() => {
  const DURATION=36;
  const ACTS=[
    {time:0,still:4.1,name:'The receipts',color:'#d4a768',description:'Mechanics paid personally for fuel, kept receipts and submitted reimbursement claims.',alt:'A stack of mechanics’ fuel receipts. A hand adds another receipt, then personal payment and reimbursement are identified.'},
    {time:6,still:9.7,name:'The solution',color:'#cf8d76',description:'Fauzan researched vendors, contacted Pertamina Retail and coordinated the corporate arrangement.',alt:'A seated analyst viewed from behind faces the workstation. A clean research sheet is clipped to the noticeboard. Vendor research and coordination lead to Pertamina Retail, the provider of the card technology.'},
    {time:11,still:15.7,name:'The fleet',color:'#ce7d72',description:'One central balance serves approximately 40 vehicles, each with its own card. Monthly funding was approximately IDR 50 million.',alt:'One corporate balance connects to vehicle-specific cards. The fleet size and monthly funding appear inside the scene.'},
    {time:17,still:22.7,name:'The purchase',color:'#99cbb1',description:'The card identifies the vehicle, the odometer is recorded, fuel is dispensed and the company purchase is registered.',alt:'At the fuel station, the vehicle card is read and odometer recorded. A synthetic 32-liter, IDR 320,000 transaction charges the corporate balance.'},
    {time:24,still:29.9,name:'The visibility',color:'#99cbb1',description:'Vendor records support manual usage review and a recommended top-up awaiting the company’s decision.',alt:'Transaction and odometer comparisons support manual review. A balance review produces a written top-up recommendation.'},
    {time:31,still:34.5,name:'The change',color:'#99cbb1',description:'Reduced reimbursement administration, centralized fuel payment and vehicle-level cost visibility.',alt:'The full operating process settles. Three outcomes appear inside the animation: less reimbursement, central payment and vehicle cost visibility.'}
  ];
  const RECORDS=[{id:'VH-017',liters:32,rate:10000,previous:58100,odometer:58420,review:false},{id:'VH-024',liters:36,rate:10000,previous:72430,odometer:72610,review:true},{id:'VH-031',liters:30,rate:10000,previous:43930,odometer:44230,review:false}].map(r=>({...r,value:r.liters*r.rate,distance:r.odometer-r.previous,efficiency:(r.odometer-r.previous)/r.liters}));
  const BALANCE_BEFORE=12480000,BALANCE_AFTER=BALANCE_BEFORE-RECORDS[0].value;
  const $=id=>document.getElementById(id),scene=$('scene');
  const number=n=>new Intl.NumberFormat('en-US').format(n),idr=n=>'IDR '+number(n);
  const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
  const text=(id,value)=>{if($(id).textContent!==value)$(id).textContent=value;};
  const actIndex=t=>Math.max(0,ACTS.findLastIndex(a=>t>=a.time));
  let time=0,playing=false,speed=1,raf=0,lastFrame=0,lastAct=-1,lastRaster=-1,lastSecond=-1;
  const media=matchMedia('(prefers-reduced-motion: reduce)');let reduced=media.matches;
  const frameStats={intervals:[],render:[],rasterIntervals:[]};let measuring=false,rasterLast=0;
  function render(){
    const start=performance.now(),i=actIndex(time),act=ACTS[i],t=reduced?act.still:time;
    if(i!==lastAct){lastAct=i;document.documentElement.style.setProperty('--accent',act.color);$('stage').dataset.act=String(i);scene.setAttribute('aria-label',act.alt);text('announcement','Act '+(i+1)+': '+act.name+'. '+act.description);document.querySelectorAll('.act-nav [data-act]').forEach((b,j)=>{if(j===i)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');});}
    const sample=Math.floor(t*30);if(sample!==lastRaster){PixelScene.draw(scene,t);lastRaster=sample;if(measuring){const now=performance.now();if(rasterLast)frameStats.rasterIntervals.push(now-rasterLast);rasterLast=now;}}
    $('timeline').value=String(time);$('timeline').style.setProperty('--progress',(time/DURATION*100)+'%');$('timeline').setAttribute('aria-valuetext',time.toFixed(1)+' seconds of 36. Act '+(i+1)+': '+act.name);
    const second=Math.floor(time);if(second!==lastSecond){lastSecond=second;$('time').innerHTML='00:'+String(second).padStart(2,'0')+' <span>/ 00:36</span>';}
    if(measuring)frameStats.render.push(performance.now()-start);
  }
  function updateControls(){
    text('play-label',playing?'Pause':time>=DURATION?'Replay':reduced?'Play story':'Play film');text('play-icon',playing?'Ⅱ':'▶');$('play').setAttribute('aria-label',playing?'Pause film':time>=DURATION?'Replay film':'Play film');
    $('motion').setAttribute('aria-pressed',String(reduced));$('motion').setAttribute('aria-label',reduced?'Reduced motion on. Enable full motion':'Full motion on. Enable reduced motion');$('motion').title=reduced?'Reduced motion':'Full motion';document.body.classList.toggle('motion-reduced',reduced);
  }
  function pause(){playing=false;cancelAnimationFrame(raf);raf=0;lastFrame=0;updateControls();}
  function seek(value){pause();time=clamp(Number.isFinite(Number(value))?Number(value):0,0,DURATION);render();updateControls();}
  function tick(now){
    if(!playing)return;
    if(lastFrame){const dt=now-lastFrame;if(measuring)frameStats.intervals.push(dt);time=Math.min(DURATION,time+dt/1000*speed);}
    lastFrame=now;render();
    if(time>=DURATION){pause();return;}
    raf=requestAnimationFrame(tick);
  }
  function play(){if(playing)return;if(time>=DURATION)time=0;playing=true;lastFrame=0;updateControls();raf=requestAnimationFrame(tick);}
  function replay(){seek(0);play();}
  function setReduced(value){pause();reduced=Boolean(value);lastAct=-1;render();updateControls();}
  $('play').addEventListener('click',()=>playing?pause():play());$('replay').addEventListener('click',replay);$('timeline').addEventListener('input',e=>seek(e.target.value));
  $('speed').addEventListener('change',e=>{speed=Number(e.target.value);});
  document.querySelectorAll('.act-nav [data-act]').forEach(b=>b.addEventListener('click',()=>seek(ACTS[Number(b.dataset.act)].time)));
  $('stage').addEventListener('keydown',e=>{if(e.key===' '){e.preventDefault();playing?pause():play();}else if(['ArrowRight','ArrowLeft','Home','End'].includes(e.key)){e.preventDefault();seek(e.key==='Home'?0:e.key==='End'?DURATION:time+(e.key==='ArrowRight'?.5:-.5));}});
  document.addEventListener('keydown',e=>{if(e.target===document.body&&e.key===' '){e.preventDefault();playing?pause():play();}});
  $('motion').addEventListener('click',()=>setReduced(!reduced));media.addEventListener('change',e=>setReduced(e.matches));
  document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();});
  function fillTransaction(){const r=RECORDS[Number($('vehicle-select').value)];$('transaction-detail').innerHTML=[['Vehicle identity','DEMO '+r.id],['Fuel type','Diesel'],['Fuel volume',r.liters.toFixed(1)+' L'],['Illustrative unit price',idr(r.rate)+'/L'],['Transaction value',idr(r.value)],['Odometer (previous → current)',number(r.previous)+' → '+number(r.odometer)+' km'],['Distance / volume',r.distance+' km / '+r.liters+' L'],['Illustrative consumption',r.efficiency.toFixed(1)+' km/L'],['Payment','Central company balance'],['Status','Recorded']].map(([k,v])=>`<div><dt>${k}</dt><dd>${v}</dd></div>`).join('');text('review-note',r.review?'Manual review: this example shows lower distance per liter. Check route conditions, load, fill levels and the entries before drawing a conclusion.':'Available transaction and odometer records support a practical reasonableness review. They do not establish a verified efficiency improvement.');}
  $('vehicle-select').addEventListener('change',fillTransaction);
  for(const [button,dialog] of [['about','about-dialog'],['inspect','transaction-dialog']]){$(button).addEventListener('click',()=>{pause();$(dialog).showModal();});$(dialog).addEventListener('click',e=>{if(e.target===$(dialog)){const b=e.target.getBoundingClientRect();if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom)e.target.close();}});}
  fillTransaction();
  // Small public inspection surface for reproducible browser acceptance and frame links.
  window.FuelFilm={seek,play,pause,replay,setReduced,acts:ACTS.map(({time,name,still})=>({time,name,still})),records:RECORDS,balance:{before:BALANCE_BEFORE,after:BALANCE_AFTER},state:()=>({time,playing,speed,reduced,act:actIndex(time),duration:DURATION,renderer:'pixel-canvas'}),measure:()=>{frameStats.intervals.length=0;frameStats.render.length=0;frameStats.rasterIntervals.length=0;rasterLast=0;measuring=true;},measureEnd:()=>{measuring=false;return structuredClone(frameStats);}};
  const params=new URLSearchParams(location.search),requested=params.get('t');
  seek(requested===null?0:Number(requested));
  if(requested===null&&!reduced)play();
})();
