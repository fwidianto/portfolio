(() => {
 'use strict';
 async function init(){
  const $=id=>document.getElementById(id),chapter=$('chapter-03'),stage=$('ch03-stage');
  if(!chapter?.classList.contains('chapter-03-unified'))return;
  const frames=[$('ch03-scene02-frame'),$('ch03-scene03-frame'),$('ch03-scene04-frame'),$('ch03-scene05-frame')],layers=[1,2,3,4,5].map(n=>$(`ch03-layer-${n}`));
  const tabs=[...chapter.querySelectorAll('[data-ch03-scene]')],info=$('ch03-info-dialog');
  const names=['Service profitability','Fuel-card cost control','Purchase request control','Multi-site operations reporting','Forklift maintenance-contract economics'];
  const actions=['Inspect sample report','Inspect fuel transaction','Inspect purchase request','Explore HQ dashboard','Inspect calculations'];
  const hashes=['#chapter-03','#chapter-03-scene-02','#chapter-03-scene-03','#chapter-03-scene-04','#chapter-03-scene-05'];
  function sceneIndexForHash(hash){return hashes.indexOf(hash==='#working-experience'?'#chapter-03':hash);}
  const details=[
   ['Service activity across the national office network needed a common view of branch and division profitability.','I consolidated SAP service records and prepared branch and division profitability analysis for management review.','Extract transactions, group by branch, aggregate revenue and cost, then calculate profit and revenue-weighted division margin.','SAP records and Excel reporting. The office is a stylized reconstruction.','Inspect the live sample report, switch branch and division views, and trace the calculations.','The 16-office network is owner-confirmed. Every financial figure is synthetic; no company performance or live ERP connection is represented.'],
   ['Mechanics advanced personal money for fuel, collected receipts and submitted reimbursement claims.','I researched vendors, contacted Pertamina Retail, helped establish the corporate arrangement, and reviewed usage, balances and top-up requirements.','Company funding supports vehicle-specific cards. Purchase and odometer records support manual usage review; top-ups remain company decisions.','Pertamina Retail supplied the RFID cards and transaction reporting system. My work was process improvement and coordination.','Inspect three illustrative fuel transactions and their odometer comparisons. Approximately 40 vehicles and IDR 50 million in monthly funding are owner-supplied context.','Vehicles, purchase amounts, odometers and interfaces are synthetic. No quantified savings or fraud-prevention result is claimed.'],
   ['Branch purchase requests needed a consistent path into HQ checks and management approval.','I helped centralize purchase request and purchase proposal processing for the Service Division.','Structured intake, request IDs and document checks prepare a visible queue. HQ judgment, manager review and general manager approval remain human decisions.','Google Forms, Google Sheets, formulas and Apps Script supported the lightweight internal workflow.','Inspect example requests, supporting checks and the traceable approval path.','Request IDs, amounts, issue assignments, layouts and timing are synthetic examples. This was not a full ERP replacement or automatic SAP purchase-order generation.'],
   ['Equipment, breakdown, maintenance, parts, consumables and labor records were maintained across customer sites.','I developed a Google Sheets-based reporting system that standardized site records and centralized the reporting view.','Each site maintains its own source workbook. IMPORTRANGE pulls ranges into the HQ Master; updates can take time.','Google Sheets and IMPORTRANGE. Traveling packets visualize spreadsheet refresh rather than an API push or real-time telemetry.','Edit a source draft, submit rows, then inspect the same synchronized records in HQ charts and their source worksheets.','All sites, units, records and characters are synthetic. Drafts and visitor submissions persist in this browser tab. Reported hours do not establish an availability percentage.'],
   ['Positive division results do not reveal how much each maintenance contract contributes or its exposure to repairs.','My analysis connected machine use, complete maintenance packages, wrench hours, mechanic location and contract costs.','Configure the fleet and service team before starting. Follow work, service obligations, finite crew capacity and event-backed contract costs through the mission.','This local JavaScript study and worksheet share deterministic maintenance, workforce and finance calculation sources.','Inspect actuals, jobs, stock, event ledgers, resource capacity and forecasts. The warehouse, workshop and mechanic’s office share the same mission state.','All units, standards, values, reliability rates and scenario inputs are synthetic. Ownership, financing, depreciation and insurance are excluded. This is not manufacturer guidance or a verified industrial dispatch plan.']
  ];
  const dev=['dev','edit','controls'].some(k=>new URLSearchParams(location.search).get(k)==='1'),motion=matchMedia('(prefers-reduced-motion:reduce)');
  const states=names.map(()=>({entered:false,resume:false,userPaused:false}));
  let current=Math.max(0,sceneIndexForHash(location.hash)),visible=false,scheduled=false,inspection=null,pendingInspection=null,pendingScene=null,transition=0,parentReady=false,filmTimer=null,passage=null;
  const blocked=new Map(),resetKeyDocuments=new WeakSet(),resetKeyFrames=new WeakSet();
  function adapter(i=current){return i===0?window.Ch03Scene01:frames[i-1].contentWindow[['FuelFilm','Scene03','ReportingScene04','WarehouseScene05'][i-1]];}
  function read(i=current){const a=adapter(i);if(!a||!parentReady||(i>0&&frames[i-1].contentDocument?.documentElement.dataset.ch03Ready!=='true'))return {ready:false};const s=a.state();return {...s,ready:true,duration:i===0?a.data.TIMES.duration:s.duration,reduced:!!(s.reduced??s.staticMode)};}
  function pause(i=current){adapter(i)?.pause();}
  function filmSteps(){return [...(frames[current-1]?.contentDocument?.querySelectorAll('.act-nav [data-act]')||[])];}
  function syncFilmControls(){
   const film=current===1||current===2,controls=$('ch03-film-controls');controls.hidden=!film;if(!film)return;
   const s=read(),button=$('ch03-film-toggle');button.disabled=!s.ready;$('ch03-film-replay').disabled=!s.ready;
   if(!s.ready){button.textContent='Play';return;}
   if(s.reduced){const steps=filmSteps(),index=steps.findIndex(step=>step.getAttribute('aria-current')==='step');button.textContent='Next step';button.disabled=index<0||index===steps.length-1;}
   else button.textContent=s.playing?'Pause':s.time>=s.duration?'Play again':'Play';
  }
  function updateFilmControls(){
   const active=visible&&(current===1||current===2);
   if(active&&filmTimer===null)filmTimer=setInterval(syncFilmControls,200);
   else if(!active&&filmTimer!==null){clearInterval(filmTimer);filmTimer=null;}
   syncFilmControls();
  }
  function start(){
   const s=read(),a=adapter();if(!s.ready||!visible||inspection||passage)return;
   a.setActive?.(true);if(s.reduced)return;
   if(!states[current].entered){states[current].entered=true;a.play();}
   else if(states[current].resume&&(s.continuous||s.time<s.duration))a.play();
   states[current].resume=false;
  }
  function updateUI(){
   layers.forEach((layer,i)=>{layer.inert=i!==current;layer.setAttribute('aria-hidden',String(i!==current));layer.classList.toggle('is-active',i===current);});
   tabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===current));tab.tabIndex=i===current?0:-1;});
   $('ch03-previous').disabled=current===0;$('ch03-next').disabled=current===names.length-1;
   $('ch03-information').setAttribute('aria-label',`Information: ${names[current]}`);$('ch03-information').title=names[current];
   $('ch03-announcement').textContent=`Scene ${current+1} of 5: ${names[current]}`;
   updateFilmControls();
   if(visible){window.PortfolioLeftNav?.setActiveChapter('chapter-03');const status=document.querySelector('.portfolio-header__status-text');if(status)status.textContent=`03.${String(current+1).padStart(2,'0')} // EXPERIENCE`;}
  }
  function clearPassage(){
   if(!passage)return;
   cancelAnimationFrame(passage.raf);passage=null;
   const overlay=$('ch03-passage');overlay.hidden=true;overlay.style.opacity='0';
   overlay.querySelector('.ch03-passage__rays').style.opacity='0';
   overlay.querySelector('.ch03-passage__glow').style.opacity='0';
   layers[1].classList.remove('is-arriving');layers[1].style.transform='';layers[1].style.opacity='';
   chapter.classList.remove('ch03-passing');
   adapter(0)?.setExitProgress?.(0);
  }
  function goToScene(index,{updateHash=true,scroll=false,passageSwitch=false}={}){
   if(typeof index==='string')index=sceneIndexForHash(index.startsWith('#')?index:'#'+index);
   if(inspection||!Number.isInteger(index)||index<0||index>=names.length)return;
   if(passage&&!passageSwitch)clearPassage();
   if(!read(index).ready){pendingScene={index,updateHash,scroll};return;}
   pendingScene=null;
   if(index!==current){
    states[current].resume=!!read().playing;pause();adapter()?.setActive?.(false);
    clearTimeout(transition);layers.forEach(l=>l.classList.remove('is-leaving'));layers[current].classList.add('is-leaving');
    current=index;void chapter.offsetWidth;
    transition=setTimeout(()=>{layers.forEach(l=>l.classList.remove('is-leaving'));},280);
   }
   updateUI();if(updateHash)history.replaceState(null,'',hashes[index]);
   if(scroll)window.scrollTo({top:scrollY+chapter.getBoundingClientRect().top,behavior:'instant'});
   schedule();start();window.dispatchEvent(new CustomEvent('ch03:scenechange',{detail:{sceneIndex:current,name:names[current]}}));
  }
  function viewport(){
   scheduled=false;
   const r=stage.getBoundingClientRect(),header=document.querySelector('.portfolio-header'),top=header?Math.max(0,header.getBoundingClientRect().bottom):0;
   const ratio=Math.max(0,Math.min(innerHeight,r.bottom)-Math.max(top,r.top))/Math.max(1,Math.min(innerHeight-top,r.height)),next=ratio>=.35&&!document.hidden;
   if(visible&&!next){if(passage)clearPassage();states[current].resume=!!read().playing;pause();adapter()?.setActive?.(false);}
   const entered=!visible&&next;visible=next;chapter.classList.toggle('is-in-view',visible);
   names.forEach((_,i)=>{if(i!==current){pause(i);adapter(i)?.setActive?.(false);}});
   if(visible){updateUI();if(entered)start();}else updateFilmControls();
  }
  function schedule(){if(!scheduled){scheduled=true;requestAnimationFrame(viewport);}}
  function toggle(){if(inspection)return;if(passage)clearPassage();const s=read();if(!s.ready)return;if(s.playing){states[current].userPaused=true;states[current].resume=false;pause();}else if(visible){states[current].userPaused=false;states[current].entered=true;adapter().play();}}
  function seek(t){if(inspection||read().seekable===false)return;if(passage)clearPassage();pause();states[current].entered=true;states[current].userPaused=true;states[current].resume=false;adapter()?.seek(t);}
  function replay(){if(!visible||inspection)return;if(passage)clearPassage();states[current].entered=true;states[current].userPaused=false;states[current].resume=false;adapter()?.replay();}
  function continueToFuel(){
   const source=read(0),destination=read(1);
   if(passage||inspection||!visible||current!==0||!source.ready||source.time<source.duration||!destination.ready)return;
   stage.focus({preventScroll:true});pause(0);adapter(1).seek(0);
   states[0].resume=false;states[1].entered=false;states[1].resume=false;states[1].userPaused=false;
   const reduced=motion.matches||source.reduced||destination.reduced,duration=reduced?360:3500;
   const overlay=$('ch03-passage'),rays=overlay.querySelector('.ch03-passage__rays'),glow=overlay.querySelector('.ch03-passage__glow');
   if(!reduced&&!rays.hasChildNodes()){
    const svg='http://www.w3.org/2000/svg';
    for(let i=0;i<28;i++){
     const group=document.createElementNS(svg,'g'),line=document.createElementNS(svg,'line');
     group.setAttribute('transform',`rotate(${(i*137.508)%360})`);
     group.setAttribute('opacity',String(.45+(i%5)*.1));
     line.setAttribute('stroke',i%5===0?'#adcbd1':'#e7ae7d');
     line.setAttribute('stroke-width',i%6===0?'2':'1.3');
     group.append(line);rays.append(group);
    }
   }
   const streaks=[...rays.querySelectorAll('line')];
   overlay.hidden=false;chapter.classList.add('ch03-passing');
   const run=passage={raf:0,start:null,switched:false};
   const smooth=(value,a,b)=>{const p=Math.max(0,Math.min(1,(value-a)/(b-a)));return p*p*(3-2*p);};
   function step(now){
    if(passage!==run)return;
    if(run.start===null)run.start=now;
    const p=Math.min(1,(now-run.start)/duration);
    if(reduced){overlay.style.opacity=String(p<.5?smooth(p,0,.5):1-smooth(p,.5,1));rays.style.opacity='0';glow.style.opacity='0';}
    else{
     if(!run.switched&&p<.46)adapter(0).setExitProgress(Math.min(1,p/.4));
     overlay.style.opacity=String(smooth(p,.3,.45));
     rays.style.opacity=String(.9*smooth(p,.27,.39)*(1-smooth(p,.78,.93)));
     glow.style.opacity=String(.52*smooth(p,.34,.45)*(1-smooth(p,.88,1)));
     const warp=Math.max(0,Math.min(1,(p-.28)/.62));
     streaks.forEach((line,i)=>{
      const head=(warp*3+((i*13)%31)/31)%1,radius=16+560*head*head,length=8+warp*70+head*70;
      line.setAttribute('x1',String(radius));line.setAttribute('x2',String(radius+length));
     });
    }
    if(!run.switched&&p>=(reduced?.5:.72)){
     run.switched=true;goToScene(1,{passageSwitch:true});
     if(current!==1){clearPassage();return;}
     if(!reduced)layers[1].classList.add('is-arriving');
    }
    if(run.switched&&!reduced){
     const arrival=smooth(p,.72,1);
     layers[1].style.transform=`scale(${.22+.78*arrival})`;
     layers[1].style.opacity=String(smooth(p,.72,.82));
    }
    if(p>=1){clearPassage();start();updateFilmControls();return;}
    run.raf=requestAnimationFrame(step);
   }
   run.raf=requestAnimationFrame(step);
  }
  function useFilmControl(){
   const s=read();if(!visible||inspection||!s.ready)return;
   if(s.reduced){
    const steps=filmSteps(),index=steps.findIndex(step=>step.getAttribute('aria-current')==='step');
    if(index>=0&&index+1<steps.length){states[current].entered=true;states[current].userPaused=true;states[current].resume=false;pause();steps[index+1].click();}
   }else toggle();
   syncFilmControls();
  }
  function replayFilm(){
   const s=read();if(!visible||inspection||!s.ready)return;
   if(s.reduced)seek(0);else replay();
   syncFilmControls();
  }
  function handleResetKey(event,index){
   if(event.key.toLowerCase()!=='r'||event.repeat||event.isComposing||event.altKey||event.ctrlKey||event.metaKey||event.defaultPrevented||index!==current||!visible||inspection)return false;
   if(event.target.closest?.('input,select,textarea,[contenteditable],dialog,[role="textbox"],[role="searchbox"],[role="slider"]')||document.querySelector('dialog[open]')||event.target.ownerDocument?.querySelector('dialog[open]'))return false;
   const s=read();if(!s.ready||(index===4&&!s.started))return false;
   event.preventDefault();event.stopImmediatePropagation();
   if(passage)clearPassage();
   if(s.reduced&&index<=2)seek(index===0?s.duration:0);
   else{replay();if(s.reduced)pause();}
   syncFilmControls();return true;
  }
  function bindResetKeys(doc,index){
   if(!doc)return;
   if(!resetKeyDocuments.has(doc)){resetKeyDocuments.add(doc);doc.addEventListener('keydown',event=>handleResetKey(event,index),true);}
   doc.querySelectorAll('iframe').forEach(frame=>{
    if(!resetKeyFrames.has(frame)){resetKeyFrames.add(frame);frame.addEventListener('load',()=>bindResetKeys(frame.contentDocument,index));}
    bindResetKeys(frame.contentDocument,index);
   });
  }
  function restoreParent(){blocked.forEach((inert,el)=>el.inert=inert);blocked.clear();chapter.classList.remove('ch03-embedded-inspection');document.documentElement.classList.remove('ch03-inspecting');}
  function inspectionOpened(win,dialog,wasPlaying){
   if(!inspection)inspection={scene:current,playing:pendingInspection?.playing??wasPlaying??!!read().playing,focus:pendingInspection?.focus};
   pendingInspection=null;inspection.win=win;inspection.dialog=dialog;
   pause();
   // Workbook submissions still need their existing refresh clock while the demonstration is paused.
   adapter()?.setActive?.(current===3&&win!==window&&visible);
   restoreParent();
   if(win!==window){
    chapter.classList.add('ch03-embedded-inspection');document.documentElement.classList.add('ch03-inspecting');
    let node=frames[current-1];
    while(node&&node!==document.body){for(const sibling of node.parentElement.children)if(sibling!==node){blocked.set(sibling,sibling.inert);sibling.inert=true;}node=node.parentElement;}
   }
   $('ch03-information').setAttribute('aria-expanded',String(dialog===info));
  }
  function inspectionClosed(win,dialog){
   if(!inspection||inspection.win!==win||inspection.dialog!==dialog)return;
   const saved=inspection;inspection=null;restoreParent();$('ch03-information').setAttribute('aria-expanded','false');
   if(visible)adapter()?.setActive?.(true);
   if(saved.playing){states[current].resume=true;start();}
   if(saved.focus?.isConnected)saved.focus.focus({preventScroll:true});
  }
  function openInfo(){
   if(passage||inspection||!read().ready)return;
   pendingInspection={playing:!!read().playing,focus:$('ch03-information')};
   const content=$('ch03-info-content');content.replaceChildren();
   ['Business problem','My contribution','Process / business logic','Technology','Explore the evidence','Context & limitations'].forEach((label,i)=>{const section=document.createElement('section'),heading=document.createElement('h3'),p=document.createElement('p');heading.textContent=label;p.textContent=details[current][i];section.append(heading,p);content.append(section);});
   $('ch03-info-title').textContent=names[current];$('ch03-info-example').textContent=actions[current]+' ↗';info.showModal();
  }
  function openPrimary(){
   if(passage||!read().ready||inspection&&inspection.dialog!==info)return;
   pendingInspection={playing:inspection?.playing??!!read().playing,focus:inspection?.focus||document.activeElement};
   if(info.open)info.close();
   if(current===4)adapter().inspect();
   else (current===0?$('inspect'):frames[current-1].contentDocument.getElementById(current===3?'view-dashboard':'inspect'))?.click();
  }
  $('ch03-information').addEventListener('click',openInfo);$('ch03-info-example').addEventListener('click',openPrimary);
  $('ch03-film-toggle').addEventListener('click',useFilmControl);$('ch03-film-replay').addEventListener('click',replayFilm);
  $('ch03-continue').addEventListener('click',event=>{event.stopPropagation();continueToFuel();});
  $('ch03-previous').addEventListener('click',()=>goToScene(current-1));$('ch03-next').addEventListener('click',()=>goToScene(current+1));tabs.forEach((tab,i)=>tab.addEventListener('click',()=>goToScene(i)));
  let swipe;
  const nativeContext=target=>target.closest('button,input,select,textarea,a,dialog,[role="tab"],[role="slider"],[contenteditable],.inspection-table');
  stage.addEventListener('pointerdown',e=>{swipe=!inspection&&!nativeContext(e.target)?{x:e.clientX,y:e.clientY}:null;},{passive:true});
  stage.addEventListener('pointerup',e=>{if(swipe&&!inspection&&Math.abs(e.clientX-swipe.x)>70&&Math.abs(e.clientX-swipe.x)>Math.abs(e.clientY-swipe.y)*1.4)goToScene(current+(e.clientX<swipe.x?1:-1));swipe=null;},{passive:true});stage.addEventListener('pointercancel',()=>swipe=null,{passive:true});
  function ready(){if(pendingScene){const p=pendingScene;goToScene(p.index,p);}else start();$('ch03-continue').disabled=!read(1).ready;updateFilmControls();schedule();}
  window.addEventListener('message',event=>{
   if(event.origin!==location.origin||!frames.some(f=>f.contentWindow===event.source))return;
   if(event.data?.type==='ch03:ready'){ready();return;}
   if(event.source!==frames[current-1]?.contentWindow||inspection)return;
   if(event.data?.type==='ch03:navigate'&&[-1,1].includes(event.data.direction))goToScene(current+event.data.direction);
   else if(event.data?.type==='ch03:toggle'&&visible)toggle();
  });
  document.addEventListener('keydown',event=>{
   if(handleResetKey(event,current))return;
   if(!visible||inspection||event.altKey||event.ctrlKey||event.metaKey||document.querySelector('dialog[open]')||event.target.closest('input,select,textarea,[role="tab"],[role="slider"],[contenteditable],dialog,.inspection-table'))return;
   if(['ArrowLeft','ArrowRight'].includes(event.key)){event.preventDefault();event.stopImmediatePropagation();goToScene(current+(event.key==='ArrowRight'?1:-1));stage.focus({preventScroll:true});}
   else if(event.key===' '&&!event.target.closest('button,a')){event.preventDefault();event.stopImmediatePropagation();toggle();}
  },true);
  document.addEventListener('click',event=>{const link=event.target.closest('a[href^="#"]');if(!link)return;const idx=sceneIndexForHash(link.getAttribute('href'));if(idx<0)return;event.preventDefault();event.stopImmediatePropagation();goToScene(idx,{scroll:true});},true);
  window.addEventListener('hashchange',()=>{const idx=sceneIndexForHash(location.hash);if(idx<0)return;if(inspection){history.replaceState(null,'',hashes[current]);return;}goToScene(idx,{updateHash:location.hash==='#working-experience',scroll:true});});
  window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule,{passive:true});document.addEventListener('visibilitychange',viewport,true);
  motion.addEventListener('change',()=>{if(passage)clearPassage();pause();states[current].resume=false;schedule();});new IntersectionObserver(schedule,{threshold:[0,.06,.2,.35,.6,1]}).observe(stage);
  frames.forEach((frame,n)=>{
   const index=n+1;
   frame.addEventListener('load',()=>{
    bindResetKeys(frame.contentDocument,index);
    if(index===current&&visible&&!inspection&&read(index).playing)states[index].resume=true;
    pause(index);adapter(index)?.setActive?.(false);ready();
   });
   bindResetKeys(frame.contentDocument,index);
  });
  $('ch03-dev-controls').hidden=!dev;chapter.classList.toggle('ch03-has-controls',dev);
  $('ch03-dev-play').addEventListener('click',toggle);$('ch03-dev-replay').addEventListener('click',replay);$('ch03-dev-timeline').addEventListener('input',e=>seek(Number(e.target.value)));
  $('ch03-dev-speed').addEventListener('change',e=>{if(adapter()?.setSpeed){adapter().setSpeed(Number(e.target.value));return;}const select=current===0?$('speed'):frames[current-1].contentDocument.getElementById('speed');if(!select)return;if(![...select.options].some(o=>o.value===e.target.value))select.add(new Option(e.target.value+'×',e.target.value));select.value=e.target.value;select.dispatchEvent(new Event('change',{bubbles:true}));});
  function tick(){const s=read();if(s.ready){$('ch03-dev-timeline').hidden=s.seekable===false;$('ch03-dev-timeline').disabled=s.seekable===false;$('ch03-dev-timeline').max=s.duration;$('ch03-dev-timeline').value=s.time;$('ch03-dev-time').textContent=s.time.toFixed(1);$('ch03-dev-play').textContent=s.playing?'Pause':'Play';$('ch03-dev-speed').value=String(s.speed);}requestAnimationFrame(tick);}
  window.Chapter03Controller={goToScene,play:()=>{if(visible&&!inspection){states[current].entered=true;states[current].userPaused=false;adapter()?.play();}},pause:()=>{states[current].userPaused=true;states[current].resume=false;pause();},seek,replay,openInfo,openPrimary,inspectionOpened,inspectionClosed,getCurrentSceneIndex:()=>current,state:()=>({sceneIndex:current,visible,dev,inspecting:!!inspection,scenes:names.map((_,i)=>({...read(i),...states[i]}))})};
  await (await import('./chapter-03-inspection.js?v=ch03-20261021-a12')).installInspection(window);parentReady=true;
  if(dev)requestAnimationFrame(tick);
  updateUI();names.forEach((_,i)=>{pause(i);adapter(i)?.setActive?.(false);});
  if(sceneIndexForHash(location.hash)>=0)window.scrollTo({top:scrollY+chapter.getBoundingClientRect().top,behavior:'instant'});
  schedule();ready();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
