// Reuse the original game controller and its native clock/decision controls.
// The iframe remains visible so the controller's animation clock is not hidden-frame throttled.
export function connectOperation({frame,onSnapshot,onError,onReady}){
 let game=null,sourceDoc=null,observer=null,lastClock='',dirty=true,queued=false,disposed=false;
 const timeout=setTimeout(()=>onError(new Error('The existing operation did not finish loading. Reload to retry.')),20000);
 function read(){
  queued=false;if(!game||disposed)return;
  const state=game.state(),key=[state.time,state.playing,state.speed,state.started,state.finished,state.reduced,state.error].join(':');
  if(!dirty&&key===lastClock)return;dirty=false;lastClock=key;onSnapshot(game.snapshot({presentation:true}));if(state.error)onError(new Error('Simulation paused · '+state.error+'. Resume to retry.'));
 }
 function schedule(force=false){dirty||=force;if(!queued){queued=true;requestAnimationFrame(read);}}
 function visibility(){game?.setActive(!document.hidden);schedule(true);}
 function inspectionNote(){const content=sourceDoc?.getElementById('calculation-content');if(!sourceDoc?.querySelector('#game-calculations[open]')||content.querySelector('#dock-illustration-note'))return;const note=sourceDoc.createElement('p');note.id='dock-illustration-note';note.className='inspection-note';note.textContent='Dock motion shows successive representative loads per truck visit. Site loaders are support equipment. DOCK loads illustrate handling; source inventory, moves and financial totals remain the aggregate results, with no extra stock or billable units.';content.prepend(note);}
 function input(){inspectionNote();schedule(true);}
 frame.addEventListener('load',async()=>{
  if(disposed)return;
  try{
   if(frame.contentWindow.location.href==='about:blank')return;
   for(let attempt=0;attempt<200&&!disposed;attempt++){game=frame.contentWindow.fmcGame;if(game)break;await new Promise(resolve=>setTimeout(resolve,50));}
   if(disposed)return;if(!game)throw new Error('The operation controller is unavailable.');sourceDoc=frame.contentDocument;clearTimeout(timeout);
   const style=sourceDoc.createElement('link');style.rel='stylesheet';style.href=new URL('./operation-source.css',import.meta.url).href;sourceDoc.body.classList.add('source-3d');await new Promise((resolve,reject)=>{style.onload=resolve;style.onerror=()=>reject(new Error('Operation controls could not load.'));sourceDoc.head.append(style);});
   observer=new MutationObserver(records=>schedule(records.some(record=>record.target.closest?.('#decision')||record.target.id==='decision')));
   observer.observe(sourceDoc.getElementById('live-state'),{childList:true});observer.observe(sourceDoc.getElementById('decision'),{childList:true,subtree:true});
   sourceDoc.addEventListener('change',input);sourceDoc.addEventListener('click',input);sourceDoc.addEventListener('fmc-state',input);
   sourceDoc.getElementById('game-calculations').addEventListener('close',()=>schedule(true));
   game.setActive(!document.hidden);onReady?.();schedule(true);
  }catch(error){clearTimeout(timeout);onError(error);}
 });
 const sourceURL=new URL('./physical-controller.html?view=game',import.meta.url);if(new URLSearchParams(location.search).get('finite')==='1')sourceURL.searchParams.set('finite','1');frame.src=sourceURL.href;
 document.addEventListener('visibilitychange',visibility,true);
 return {
  get source(){return game;},snapshot:()=>game?.snapshot(),refresh:()=>schedule(true),
  selectUnit(index){if(!game)return;if(game.selectUnit)game.selectUnit(index);else{const select=sourceDoc.getElementById('game-unit');if(select){select.value=String(index);select.dispatchEvent(new frame.contentWindow.Event('change',{bubbles:true}));}else sourceDoc.querySelector(`.living-unit[data-unit="${index}"]`)?.dispatchEvent(new frame.contentWindow.MouseEvent('click',{bubbles:true}));}schedule(true);},
  expand(open){sourceDoc?.body.classList.toggle('source-expanded',open);if(!open)sourceDoc?.querySelector('dialog[open]')?.close();},
  inspect(){game?.inspect('actuals');inspectionNote();},
  dispose(){disposed=true;clearTimeout(timeout);observer?.disconnect();sourceDoc?.removeEventListener('change',input);sourceDoc?.removeEventListener('click',input);sourceDoc?.removeEventListener('fmc-state',input);document.removeEventListener('visibilitychange',visibility,true);game?.setActive(false);}
 };
}
