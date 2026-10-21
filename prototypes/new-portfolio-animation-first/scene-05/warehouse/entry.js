import {expandWarehouse} from './entry-transition.js';

const chapter=new URLSearchParams(location.search).get('chapter')==='1';
const entry=document.getElementById('question-entry'),frame=document.getElementById('game-frame'),button=document.getElementById('start-game'),status=document.getElementById('load-status');
const motion=matchMedia('(prefers-reduced-motion:reduce)');
let active=!chapter,loading=false,entered=false,timeout=0,pendingInspection=false,speed=8,inspectionObserver=null;
const site=()=>frame.contentWindow.siteMap;
const game=()=>site()?.operation.source;
const available=()=>active&&!document.hidden;
function inspect(){
 if(!entered){pendingInspection=true;button.click();return;}
 pendingInspection=false;
 frame.contentDocument.getElementById('operation-inspect').click();
}
function failed(){
 if(!loading)return;
 clearTimeout(timeout);loading=false;game()?.setActive(false);frame.src='about:blank';frame.hidden=true;frame.inert=false;
 entry.hidden=false;entry.inert=false;button.disabled=false;button.removeAttribute('aria-busy');status.textContent='The game could not load. Please try again.';
}
window.WarehouseScene05={
 state:()=>game()?.state()||{time:0,duration:2400,playing:false,speed,reduced:motion.matches,started:false,finished:false,continuous:true,manual:false,seekable:false,active},
 play:()=>{if(available()&&entered&&game()?.state().started)game().play();},
 pause:()=>game()?.pause(),
 setActive:value=>{active=!!value;game()?.setActive(available());},
 setSpeed:value=>{if([1,2,4,8,12,16].includes(value)){speed=value;game()?.setSpeed(value);}},
 replay:()=>{game()?.restart();site()?.operation.refresh();},
 inspect
};
function keyboard(event){
 if(!chapter||event.key!==' '||event.altKey||event.ctrlKey||event.metaKey||game()?.state().manual||event.target.closest('button,input,select,textarea,a,dialog,[contenteditable]'))return;
 event.preventDefault();event.stopImmediatePropagation();parent.postMessage({type:'ch03:toggle'},location.origin);
}
document.addEventListener('keydown',keyboard,true);
button.addEventListener('click',()=>{
 if(loading||entered)return;
 loading=true;button.disabled=true;button.setAttribute('aria-busy','true');status.textContent='Opening the warehouse…';
 frame.hidden=false;frame.inert=true;frame.style.opacity='0';frame.src='./site-3d/?entry=guided';timeout=setTimeout(failed,20000);
});
addEventListener('message',async event=>{
 if(!loading||event.origin!==location.origin||event.source!==frame.contentWindow||event.data?.type!=='ch03:ready')return;
 const source=game();if(!source)return;
 clearTimeout(timeout);source.setActive(available());source.setSpeed(speed);
 try{
  const sourceFrame=frame.contentDocument.getElementById('operation-source');
  if(chapter){
   await (await import('../../chapter-03-inspection.js?v=ch03-20261021-a12')).installInspection(sourceFrame.contentWindow);
   frame.contentDocument.addEventListener('keydown',keyboard,true);sourceFrame.contentDocument.addEventListener('keydown',keyboard,true);
   const dialog=sourceFrame.contentDocument.getElementById('game-calculations');
   inspectionObserver=new MutationObserver(()=>frame.contentDocument.body.classList.toggle('chapter-inspection',dialog.open));
   inspectionObserver.observe(dialog,{attributes:true,attributeFilter:['open']});
  }
  await expandWarehouse(entry,frame);
  loading=false;entered=true;document.body.dataset.view='game';source.setActive(available());frame.inert=false;frame.focus();
  sourceFrame.contentDocument.getElementById('guide-next')?.focus({preventScroll:true});
  if(pendingInspection)inspect();
 }catch(error){failed();console.error(error);}
});
frame.addEventListener('error',failed);
document.addEventListener('visibilitychange',()=>game()?.setActive(available()),true);
addEventListener('pagehide',()=>{clearTimeout(timeout);inspectionObserver?.disconnect();game()?.setActive(false);});
if(chapter){
 document.documentElement.dataset.chapterPresentation='true';
 document.documentElement.dataset.ch03Ready='true';parent.postMessage({type:'ch03:ready'},location.origin);
}
