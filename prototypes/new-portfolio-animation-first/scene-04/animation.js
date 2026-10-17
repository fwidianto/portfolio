import {World} from './assets/world.js';
import {Simulation} from './simulation.js';
import {SheetsUI} from './sheets-ui.js';
import {DashboardTransition} from './dashboard.js';
import {DEMO_STEPS,DEMO_SECONDS,STEP_SECONDS,tabById} from './data/synthetic-records.js';
const $=id=>document.getElementById(id),media=matchMedia('(prefers-reduced-motion: reduce)');
let storage;try{storage=sessionStorage;}catch{}
const model=new Simulation(storage),world=new World($('world-canvas'),$('computer-buttons'));
let presentationActive=new URLSearchParams(location.search).get('chapter')!=='1';
let reduced=media.matches,idle=!reduced&&presentationActive,clock=0,worldTime=0,speed=1,last=0,focus=null,committedStep=-1,raf=0;
let suspendedAnimations=[];
function setActive(active){if(presentationActive===active)return;presentationActive=active;last=0;if(!active){pause();suspendedAnimations=document.getAnimations().filter(a=>a.playState==='running');suspendedAnimations.forEach(a=>a.pause());}else{suspendedAnimations.forEach(a=>{if(a.playState==='paused')a.play();});suspendedAnimations=[];}}
let demoStep=0,demoPhase=0,selected='01',lastEvent='';
let dashboard;
const status=message=>{$('status').textContent=message;};
function updateControls(){document.body.classList.toggle('motion-reduced',reduced);document.body.classList.toggle('demo-paused',!idle);$('autoplay').textContent=idle?'Ⅱ Pause demo':'▶ Resume demo';$('mode-label').textContent=idle?'AUTOMATIC DEMONSTRATION':dashboard&&dashboard.mode!=='world'?'HQ / OPERATIONAL DASHBOARD':focus?'INTERACTIVE WORKBOOK':'DEMO PAUSED · YOUR WORK IS KEPT';$('motion-toggle').setAttribute('aria-pressed',reduced);$('motion-toggle').textContent=reduced?'Motion reduced':'Reduce motion';$('saved-count').textContent=model.manualCount()+' visitor records';}
function pause(){idle=false;updateControls();}
function resume(){if($('workbook-dialog').open||$('about-dialog').open)return;if(dashboard&&dashboard.mode!=='world')dashboard.close();idle=true;updateControls();status('Automatic demonstration resumed. Your drafts and submitted rows remain available.');}
const ui=new SheetsUI(model,{
 opened(site){pause();focus=site;selected=site;updateControls();},
 closed(){focus=dashboard&&dashboard.mode!=='world'?'HQ':null;updateControls();status(`Workbook closed. ${model.draftCount()} draft rows and ${model.manualCount()} submitted visitor rows kept. Use Resume demo when ready.`);},
 submitted(result){status(`${result.records.length} rows committed to Site ${result.job.site}. The HQ mirror is refreshing.`);},
 synced(event){if(event.job.origin==='manual')status(`Synchronized ${event.job.ids.length} rows from Site ${event.site} into HQ / ${tabById(event.tab).master}. Submission ${event.job.submission}.`);},
});
dashboard=new DashboardTransition(model,ui,{settled(){status('HQ dashboard ready. Select a site or click a chart row to inspect the source records.');},start(){pause();focus='HQ';selected='HQ';updateControls();status('Following the source records into the HQ dashboard…');},close(){focus=null;updateControls();status('Returned to the eight sites. Your work is kept. Resume the demonstration when ready.');}});
$('view-dashboard').addEventListener('click',()=>dashboard.start());
function tick(stamp){
 const dt=last?Math.min(.08,(stamp-last)/1000):0;last=stamp;
 if(!document.hidden&&presentationActive){
  if(idle||model.jobs.length||document.activeElement?.matches('input,select'))worldTime+=dt;
  model.tick(dt,idle?speed:1);
  if(idle){clock+=dt*speed;const stepNumber=Math.floor(clock/STEP_SECONDS);demoStep=stepNumber%DEMO_STEPS.length;demoPhase=clock%STEP_SECONDS;selected=demoPhase>=10.6?'HQ':DEMO_STEPS[demoStep].site;
   if(demoPhase>=7&&committedStep!==stepNumber){if(model.commitDemo(demoStep))committedStep=stepNumber;}
  }
  dashboard.frame(dt,reduced);world.render({time:worldTime,active:focus||selected,phase:demoPhase,jobs:model.jobs,focus,reduced,dt});ui.frame(reduced);
 }
 raf=requestAnimationFrame(tick);
}
$('autoplay').addEventListener('click',()=>idle?pause():resume());$('speed').addEventListener('change',e=>{speed=Number(e.target.value);});
$('reset-demo').addEventListener('click',()=>{model.resetDemo();clock=0;demoStep=0;demoPhase=0;committedStep=-1;selected='01';status(`Demo reset. ${model.manualCount()} visitor records and ${model.draftCount()} draft rows were kept.`);});
$('motion-toggle').addEventListener('click',()=>{reduced=!reduced;if(reduced)pause();updateControls();status(reduced?'Reduced motion: static characters and endpoint transfer cues. Resume demo to advance the worksheet examples.':'Full motion enabled. Use Resume demo to continue.');});
media.addEventListener('change',()=>{reduced=media.matches;if(reduced)pause();updateControls();});
document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();last=0;});
let aboutFocus=null;$('about').addEventListener('click',()=>{pause();aboutFocus=document.activeElement;$('about-dialog').showModal();});$('about-dialog').querySelector('button').addEventListener('click',()=>$('about-dialog').close());$('about-dialog').addEventListener('close',()=>aboutFocus?.focus());
model.onChange(e=>{lastEvent=e.type+':'+(e.site||'');if(e.type==='synced'&&e.job.origin==='demo'&&e.site==='03'&&e.tab==='parts'&&idle&&!dashboard.autoShown&&!$('workbook-dialog').open&&!$('about-dialog').open)dashboard.start(e);});
fetch('assets/approved-night-sky.svg').then(r=>{if(!r.ok)throw new Error('Approved sky asset unavailable');return r.text();}).then(svg=>{$('sky-mount').innerHTML=svg;}).catch(console.error);
updateControls();if(model.storageWarning)status(model.storageWarning);raf=requestAnimationFrame(tick);
// Review controls use the production state path, without a separate demonstration database.
window.ReportingSim={model,ui,dashboard,pause,resume,setActive,state:()=>({idle,clock,step:demoStep,phase:demoPhase,cycles:Math.floor(clock/DEMO_SECONDS),speed,reduced,focus,lastEvent,pending:model.jobs.length,manual:model.manualCount(),drafts:model.draftCount(),overview:model.overview(),dashboard:dashboard.mode,presentationActive}),showDemo(step,phase=0){pause();clock=step*STEP_SECONDS+phase;demoStep=step%DEMO_STEPS.length;demoPhase=phase;committedStep=-1;selected=DEMO_STEPS[demoStep].site;},stepSeconds:STEP_SECONDS};
