const num=(v,d=0)=>v.toLocaleString('en-US',{maximumFractionDigits:d});
export async function startWorksheetFilm({panel,scenario,result,advice}){
  const css=document.createElement('link');css.rel='stylesheet';css.href=new URL('./worksheet-film.css',import.meta.url).href;
  await new Promise((yes,no)=>{css.onload=yes;css.onerror=no;document.head.append(css);});
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const shell=document.createElement('section');shell.className='worksheet-film';shell.setAttribute('aria-label','35 second worksheet calculation');
  shell.innerHTML='<div class="film-controls"><span class="film-brand">FMC <small>Synthetic sample</small></span><span id="film-phase" role="status" aria-live="polite">Fleet</span><button type="button" id="film-play">Pause</button><button type="button" id="film-finish">Explore ↗</button></div><div class="film-scrubber"><input id="film-time" type="range" min="0" max="35" step="0.1" value="0" aria-label="Animation time in seconds"><output id="film-clock" for="film-time">00 / 35s</output></div><div class="film-viewport"><div class="film-camera"></div></div>';
  panel.before(shell);shell.querySelector('.film-camera').append(panel);document.documentElement.classList.add('film-page');
  const viewport=shell.querySelector('.film-viewport'),camera=shell.querySelector('.film-camera'),slider=shell.querySelector('#film-time'),clock=shell.querySelector('#film-clock'),play=shell.querySelector('#film-play');
  const first=result.maintenance.meters[0],events=result.maintenance.events.filter(e=>e.unit===first.unit&&e.month===first.month),service=events.find(e=>e.package===1000);
  const travel=scenario.sites[0].logistics.satelliteHours*scenario.sites[0].logistics.trips,total=result.maintenance.events.reduce((v,e)=>v+e.wrench,0),chosen=advice.options.find(o=>o.key===scenario.worksheet.placement);
  const names=['Fleet','Service due','Complete package','Capacity','Forecast','Explore'],nodes=[];
  let time=0,last=0,raf=0,playing=false,finished=false,disposed=false,phase=-1,target={x:0,y:0,s:1},current={...target};
  const fleet=panel.querySelector('#worksheet-section-fleet'),pkg=panel.querySelector('#worksheet-section-package'),staff=panel.querySelector('#worksheet-section-results'),finance=panel.querySelector('#worksheet-section-financial');
  function node(cls,html,before){const el=document.createElement('section');el.className=cls;el.innerHTML=html;before.before(el);nodes.push(el);return el;}
  const meter=node('film-meter','<div class="film-node-heading"><span>'+first.unit+' · Lifetime meter</span><small>Jan 2026</small></div><div class="film-meter-values"><span><small>Opening</small>'+num(first.start)+' h</span><span><small>Operating / month</small>+'+num(first.hours)+' h</span><strong id="film-meter-value">'+num(first.start)+' h</strong></div><div class="film-meter-track"><i></i>'+events.map(e=>'<b style="left:'+((e.threshold-first.start)/first.hours*100)+'%" data-threshold="'+e.threshold+'"></b>').join('')+'</div><div class="film-service-nodes">'+events.map(e=>'<button type="button" data-event="'+e.id+'" data-threshold="'+e.threshold+'">'+num(e.threshold)+' h<small>'+num(e.package)+' package</small></button>').join('')+'</div><div class="film-meter-foot"><span>Next month opens at '+num(first.end)+' h</span><span>Lifetime · no reset</span></div>',pkg);
  const workload=node('film-workload','<div class="film-node-heading">Workload → capacity <small>'+scenario.months+' months</small></div><div class="film-workload-values"><div><small>'+num(result.maintenance.events.length)+' services</small><strong>'+num(total)+' h</strong></div><div><small>Average / month</small><strong>'+num(advice.averageWrenchHours,1)+' h</strong></div><div><small>Peak / month</small><strong>'+num(advice.peak)+' h</strong></div></div><div class="film-route"><span>Office</span><i></i><span>'+scenario.worksheet.distanceKm+' km · '+scenario.worksheet.areaType+'</span><i></i><span>Site</span></div><div class="film-travel-values"><span>'+num(scenario.sites[0].logistics.satelliteHours,2)+' h / round trip</span><span>'+scenario.sites[0].logistics.trips+' trips / month</span></div><div class="film-capacity-bar"><span style="width:'+((176-travel)/176*100)+'%">'+num(176-travel,2)+' work h</span><i></i></div><div class="film-travel-values"><span>176 regular h / person</span><span>'+num(travel,2)+' travel h / person</span></div><p class="film-plan-note">'+chosen.count+' '+(chosen.key==='dedicated'?'onsite':'mobile')+' mechanics · peak + crew checked</p>',staff);
  const labour=document.createElement('div');labour.className='film-package-labour';labour.innerHTML='<div><small>Labour</small><strong>'+service.wrench+' h</strong><small>'+service.crew+' mechanics × '+num(service.duration)+' h</small></div><div><small>Parts</small><strong>Rp '+num(service.partsCost)+'</strong></div><div><small>Consumables</small><strong>Rp '+num(service.consumablesCost)+'</strong></div>';pkg.querySelector('.worksheet-section-body').prepend(labour);nodes.push(labour);
  const links=document.createElementNS('http://www.w3.org/2000/svg','svg');links.classList.add('film-connections');links.setAttribute('aria-hidden','true');panel.prepend(links);nodes.push(links);
  const sections=[fleet,meter,pkg,workload,staff,finance];
  sections.forEach((el,i)=>el.dataset.filmStep=String(i<4?i:i===4?3:4));
  const average=panel.querySelector('#rough-mechanic-estimate');average.dataset.filmStep='3';
  panel.querySelectorAll('.worksheet-fleet tbody tr').forEach((row,i)=>{row.style.setProperty('--film-row',i);const label=document.createElement('span');label.className='film-model-code';label.textContent=scenario.fleets[i].model;row.children[1].prepend(label);nodes.push(label);});
  pkg.open=true;fleet.open=true;staff.open=true;finance.open=true;
  pkg.querySelectorAll('.worksheet-package-table tbody tr').forEach((row,i)=>row.dataset.filmItem=i<service.parts.length?'parts':'consumables');
  panel.classList.add('film-sheet');
  function setTarget(){
    const mobile=viewport.clientWidth<700,el=[fleet,meter,pkg,workload,finance,finance][Math.max(0,phase)],r=el.getBoundingClientRect(),p=panel.getBoundingClientRect(),unit=p.width/panel.offsetWidth,x=(r.left-p.left)/unit,y=(r.top-p.top)/unit;
    const s=mobile?1:Math.min(1.6,(viewport.clientWidth-60)/el.offsetWidth,(viewport.clientHeight-50)/el.offsetHeight);
    if(phase===5){const progress=Math.min(1,(time-29)/5),wide=mobile?1:Math.min(1,viewport.clientWidth/panel.offsetWidth);target={x:0,y:-y*wide*(1-progress),s:wide};}
    else target={x:(viewport.clientWidth-el.offsetWidth*s)/2-x*s,y:16-y*s,s};
  }
  function geometry(){
    panel.style.width=(viewport.clientWidth<700?viewport.clientWidth:Math.max(1000,Math.min(1180,viewport.clientWidth)))+'px';
    const box=panel.getBoundingClientRect(),unit=box.width/panel.offsetWidth,points=sections.map(el=>{const r=el.getBoundingClientRect();return{x:(r.left-box.left)/unit+12,y:(r.top-box.top)/unit+18};});
    links.setAttribute('viewBox','0 0 '+panel.offsetWidth+' '+panel.scrollHeight);
    links.innerHTML=points.slice(1).map((p,i)=>'<path d="M'+points[i].x+','+points[i].y+' H7 V'+p.y+' H'+p.x+'"/>').join('');
    setTarget();if(!playing&&!finished&&!raf)raf=requestAnimationFrame(tick);
  }
  function finish(){
    finished=true;playing=false;time=35;phase=5;cancelAnimationFrame(raf);shell.classList.remove('film-playing');shell.classList.add('film-finished');
    panel.inert=false;camera.style.transform='none';viewport.style.height='auto';play.textContent='Replay ↗';play.setAttribute('aria-label','Replay the animation in a new tab');shell.querySelector('#film-finish').textContent='Calculator ↗';
    shell.querySelector('#film-phase').textContent='Explore';shell.dataset.phase='5';slider.value='35';clock.textContent='35 / 35s';sections.forEach(el=>el.dataset.filmRevealed='true');panel.style.setProperty('--film-chart-reveal',1);
    meter.querySelector('#film-meter-value').textContent=num(first.end)+' h';meter.querySelector('.film-meter-track>i').style.width='100%';meter.querySelectorAll('[data-threshold]').forEach(el=>el.classList.add('is-due'));
  }
  function update(){
    const next=time<5?0:time<10?1:time<16?2:time<23?3:time<29?4:5;
    shell.dataset.phase=String(next);panel.dataset.filmFactor=time<12?'labour':time<14?'parts':time<16?'consumables':time<19?'work':time<21?'travel':time<25?'revenue':time<27?'cost':'profit';
    if(phase!==next){phase=next;shell.querySelector('#film-phase').textContent=names[next];setTarget();}
    if(phase===5)setTarget();
    sections.forEach(el=>{el.dataset.filmRevealed=String(Number(el.dataset.filmStep)<=phase);el.classList.toggle('film-focus',el===[fleet,meter,pkg,workload,finance,finance][phase]);});
    average.dataset.filmRevealed=String(phase>=3);
    links.querySelectorAll('path').forEach((p,i)=>p.classList.toggle('is-traced',i<phase));
    const value=Math.floor(first.start+first.hours*Math.max(0,Math.min(1,(time-5)/3.5)));
    meter.querySelector('#film-meter-value').textContent=num(value)+' h';meter.querySelector('.film-meter-track>i').style.width=(value-first.start)/first.hours*100+'%';meter.querySelectorAll('[data-threshold]').forEach(el=>el.classList.toggle('is-due',value>=Number(el.dataset.threshold)));
    panel.style.setProperty('--film-chart-reveal',Math.max(0,Math.min(1,(time-23)/6)));slider.value=String(time);slider.setAttribute('aria-valuetext',num(time,1)+' of 35 seconds');clock.textContent=String(Math.floor(time)).padStart(2,'0')+' / 35s';
    if(phase===5){const base=Math.max(560,Math.min(innerHeight-150,820));viewport.style.height=(base+(panel.scrollHeight-base)*Math.min(1,(time-29)/6))+'px';}
    if(time>=35)finish();
  }
  function tick(now){
    if(playing&&!document.hidden){if(last)time=Math.min(35,time+Math.min((now-last)/1000,.1));update();}
    if(finished)return;
    last=now;for(const key of ['x','y','s'])current[key]+=(target[key]-current[key])*.12;
    camera.style.transform='translate('+current.x+'px,'+current.y+'px) scale('+current.s+')';
    raf=playing||['x','y','s'].some(key=>Math.abs(target[key]-current[key])>.01)?requestAnimationFrame(tick):0;
  }
  function start(){
    if(reduced.matches){finish();return;}
    finished=false;playing=true;last=0;time=0;phase=-1;panel.inert=true;shell.classList.add('film-playing');shell.classList.remove('film-finished');play.textContent='Pause';geometry();current={...target};update();raf=requestAnimationFrame(tick);
  }
  play.addEventListener('click',()=>{if(finished){window.open(location.href,'_blank','noopener');return;}playing=!playing;last=0;play.textContent=playing?'Pause':'Play';shell.classList.toggle('film-paused',!playing);if(playing&&!raf)raf=requestAnimationFrame(tick);});
  shell.querySelector('#film-finish').addEventListener('click',()=>{if(!finished)finish();else panel.querySelector('#fleet-unit-0').focus({preventScroll:false});});
  slider.addEventListener('input',()=>{if(disposed||reduced.matches){finish();return;}if(finished){finished=false;shell.classList.add('film-playing');shell.classList.remove('film-finished');panel.inert=true;raf=requestAnimationFrame(tick);}playing=false;shell.classList.add('film-paused');play.textContent='Play';time=Number(slider.value);last=0;update();current={...target};camera.style.transform='translate('+current.x+'px,'+current.y+'px) scale('+current.s+')';});
  const resize=new ResizeObserver(()=>{if(!finished)geometry();});resize.observe(viewport);
  document.addEventListener('visibilitychange',()=>last=0);
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!finished)finish();});
  reduced.addEventListener('change',()=>{if(reduced.matches)finish();});
  document.addEventListener('fmc:rendered',()=>{finish();disposed=true;slider.disabled=true;panel.classList.remove('film-sheet');resize.disconnect();nodes.forEach(n=>n.remove());},{once:true});
  window.fmcFilm={snapshot:()=>({time,phase,playing,finished,reduced:reduced.matches,unit:first.unit,firstMonth:{start:first.start,end:first.end},serviceId:service.id})};
  start();
}
