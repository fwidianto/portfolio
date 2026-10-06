import {rebuild,profitability,billingPayment,utilization,processIntegrity,orchestrate} from '../chapter-05-assembly/behavior-controllers.js';

const section=document.getElementById('chapter-05');
const scene=section.querySelector('#chapter-v-scene');
const pulse=scene.querySelector('#amber-signal');
const timeline=section.querySelector('#timeline');
const playButton=section.querySelector('#play');
const readout=section.querySelector('#time');
const duration=23.4;
const clamp=(n,min=0,max=1)=>Math.max(min,Math.min(max,n));
const clips=[
  {name:'Rebuild',start:0,duration:7.2,mount:rebuild},
  {name:'Profitability',start:7.2,duration:2.8,prefix:'v2',mount:profitability},
  {name:'Billing / Payment',start:10,duration:2.8,prefix:'v3',mount:billingPayment},
  {name:'Utilization',start:12.8,duration:3,prefix:'v4',mount:utilization},
  {name:'Process Integrity',start:15.8,duration:3.2,prefix:'v5',mount:processIntegrity},
  {name:'Orchestrate',start:19,duration:4.4,prefix:'v6',mount:orchestrate}
];
const sharedIds=new Map([
  ['amber-signal','amber-signal'],['backbone-active-line','backbone-active-line'],
  ['backbone-active-core','backbone-active-core'],['pi-unresolved-handoff-point','pi-unresolved-handoff-point'],
  ['orch-amber-datum','pi-unresolved-handoff-point'],['orch-datum-collar','pi-handoff-collar'],
  ['orch-datum-core','pi-handoff-core'],['orch-datum-pip','pi-handoff-pip']
]);
const scopeFor=prefix=>({
  readyState:'complete',
  getElementById(id){return scene.querySelector(`#${CSS.escape(prefix?(sharedIds.get(id)||`${prefix}-${id}`):id)}`);},
  querySelectorAll(selector){return scene.querySelectorAll(selector);},
  addEventListener(){}
});
const runtimeWindow={location:{search:'?t=0',hash:''},matchMedia:()=>({matches:false}),addEventListener(){}};
const quietFrame=()=>0;
const datum=scene.querySelector('#pi-unresolved-handoff-point');
const clipsReady=clips.map(clip=>{
  const parent=clip.prefix?scene.querySelector(`#${clip.prefix}-behavior`):scene;
  clip.controller=clip.mount(scopeFor(clip.prefix),runtimeWindow,quietFrame,()=>{});
  clip.controller.pause();
  clip.controller.setTime(0);
  clip.parent=parent;
  clip.last=-1;
  clip.step=-1;
  clip.nodes=[...(clip.prefix?parent.querySelectorAll('*'):scene.querySelector('#ch05-camera-world').querySelectorAll('*')),parent,pulse].filter((node,i,list)=>node&&list.indexOf(node)===i);
  clip.initial=clip.nodes.map(node=>[node,[...node.attributes].map(attr=>[attr.name,attr.value])]);
  return clip;
});
clipsReady[0].controller.setTime(0);
clipsReady[0].initial=clipsReady[0].nodes.map(node=>[node,[...node.attributes].map(attr=>[attr.name,attr.value])]);

let now=0,playing=false,last=null,frameId=null,inView=false,entered=false,resumeOnEnter=false;
let resumeOnVisibility=false;
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function restore(clip){
  for(const [node,attrs]of clip.initial){
    for(const attr of [...node.attributes])node.removeAttribute(attr.name);
    for(const [name,value]of attrs)node.setAttribute(name,value);
  }
  clip.last=-1;clip.step=-1;
}
function sample(clip,time){
  if(time<clip.last)restore(clip);
  const step=Math.floor(time*120+1e-7);
  for(let i=clip.step+1;i<=step;i++)clip.controller.setTime(i/120);
  clip.controller.setTime(time);clip.step=step;clip.last=time;
}
function pulseAt(time){const phase=((time-6)%1.4+1.4)%1.4;return{x:180+920*phase/1.4,opacity:Math.min(clamp(phase/.08),clamp((1.4-phase)/.08))};}
function render(time){
  now=clamp(time,0,duration);
  let active=clipsReady[0];
  for(const clip of clipsReady){
    const isActive=now>=clip.start&&(now<clip.start+clip.duration||now===duration&&clip.name==='Orchestrate');
    if(isActive)active=clip;
    sample(clip,clamp(now-clip.start,0,clip.duration));
    if(clip.parent!==scene)clip.parent.setAttribute('visibility',isActive||clip.name==='Process Integrity'&&now>=19?'visible':'hidden');
  }
  active.controller.setTime(clamp(now-active.start,0,active.duration));
  if(now>=19){
    const u=now-19,release=clamp((u-3.5)/.3),ease=release<.5?2*release*release:1-(-2*release+2)**2/2,incoming=pulseAt(19);
    if(u<3.8){pulse.setAttribute('transform',`translate(${(Math.min(698,incoming.x+u*920/1.4)+24*ease).toFixed(1)}, 360)`);pulse.style.opacity='1';}
    else{const q=clamp((u-3.8)/.55);pulse.setAttribute('transform',`translate(${(722+378*(1-(1-q)*(1-q))).toFixed(1)}, 360)`);pulse.style.opacity=String(u>=4.35?clamp(1-(u-4.35)/.05):.9);}
  }else if(now>=6){const p=pulseAt(now);pulse.setAttribute('transform',`translate(${p.x.toFixed(1)}, 360)`);pulse.style.opacity=String(p.opacity);}
  else if(now>5.92)pulse.style.opacity=String(clamp((6-now)/.08));
  for(const animation of scene.getAnimations({subtree:true}))if(animation instanceof CSSAnimation){animation.pause();animation.currentTime=now*1000;}
  timeline.value=String(now);timeline.setAttribute('aria-valuetext',`${now.toFixed(2)} seconds`);readout.value=`${now.toFixed(2)} / ${duration.toFixed(2)} s`;
}
function pause(){playing=false;last=null;if(frameId!==null)cancelAnimationFrame(frameId);frameId=null;playButton.textContent='Play';}
function play(){if(!inView)return;if(document.hidden){resumeOnVisibility=true;return;}if(now>=duration)render(0);playing=true;last=null;playButton.textContent='Pause';if(frameId===null)frameId=requestAnimationFrame(tick);}
function seek(time){pause();render(time);}
function replay(){render(0);play();}
function tick(stamp){
  frameId=null;
  if(document.hidden){resumeOnVisibility=playing;pause();return;}
  if(!playing||!inView){last=null;return;}
  if(last!==null){render(now+(stamp-last)/1000);if(now>=duration){pause();return;}}
  last=stamp;frameId=requestAnimationFrame(tick);
}

for(const button of section.querySelectorAll('[data-time]'))button.addEventListener('click',()=>seek(Number(button.dataset.time)));
playButton.addEventListener('click',()=>playing?pause():play());
section.querySelector('#replay').addEventListener('click',replay);
timeline.addEventListener('input',()=>seek(Number(timeline.value)));

render(reducedMotion?duration:0);
section.querySelector('#loading').remove();
playButton.disabled=false;timeline.disabled=false;section.querySelector('#replay').disabled=false;
const globalStatusText=document.querySelector('.portfolio-header__status-text');
const previousSection=document.getElementById('chapter-04');
function visibleRatio(element){const rect=element.getBoundingClientRect();return Math.max(0,Math.min(innerHeight,rect.bottom)-Math.max(0,rect.top))/Math.max(1,rect.height);}
function syncGlobalHeader(){if(visibleRatio(section)>=.25&&visibleRatio(previousSection)<.25&&globalStatusText&&globalStatusText.textContent!=='05 // OPERATING SYSTEM')globalStatusText.textContent='05 // OPERATING SYSTEM';}
function setInView(visible){
  if(!visible){if(inView)resumeOnEnter=playing||resumeOnVisibility;resumeOnVisibility=false;inView=false;pause();return;}
  inView=true;syncGlobalHeader();
  if(reducedMotion||visibleRatio(previousSection)>=.25)return;
  if(!entered||now>=duration){entered=true;resumeOnEnter=false;play();}
  else if(resumeOnEnter){resumeOnEnter=false;play();}
}
const observer=new IntersectionObserver(entries=>{
  for(const entry of entries)setInView(entry.isIntersecting&&entry.intersectionRatio>=.25);
},{threshold:[0,.25,.75]});
observer.observe(section);
window.addEventListener('scroll',()=>{setInView(visibleRatio(section)>=.25);syncGlobalHeader();},{passive:true});
window.addEventListener('load',()=>{setInView(visibleRatio(section)>=.25);syncGlobalHeader();},{once:true});
setInView(visibleRatio(section)>=.25);
document.addEventListener('visibilitychange',()=>{
  if(document.hidden){resumeOnVisibility=playing;pause();}
  else if(resumeOnVisibility&&inView){resumeOnVisibility=false;play();}
});
window.addEventListener('pagehide',pause,{once:true});
window.PortfolioChapter05={seek,play,pause,replay,getState:()=>({time:now,duration,playing,clips:clipsReady.map(({name,start,duration})=>({name,start,duration}))})};
