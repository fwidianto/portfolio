// Runs inside the same-origin Scene 04 frame; imports share its existing module instance.
import './scene-04/animation.js';
import {DEMO_SECONDS} from './scene-04/data/synthetic-records.js';
if(new URLSearchParams(location.search).get('chapter')==='1'){
 const sim=window.ReportingSim;
 // Keep the live dashboard section and its delegated listeners inside the shared inspection surface.
 const dashboard=sim.dashboard,root=dashboard.root,dialog=document.createElement('dialog');dialog.id='ch03-dashboard-dialog';dialog.setAttribute('aria-label','HQ operational dashboard');
 document.body.append(dialog);dialog.append(root);
 const start=dashboard.start.bind(dashboard),close=dashboard.close.bind(dashboard);
 dashboard.start=(...args)=>{if(dashboard.mode!=='world')return;start(...args);root.hidden=false;dialog.showModal();};
 dashboard.close=()=>{close();if(dialog.open)dialog.close();};
 dialog.addEventListener('close',()=>{if(dialog.returnValue!=='ch03-suspend'&&dashboard.mode!=='world')close();});
 window.ReportingScene04={
  state:()=>{const s=sim.state();return {...s,time:s.clock%DEMO_SECONDS,duration:DEMO_SECONDS,playing:s.idle,reduced:s.reduced,seekable:false};},
  play:()=>sim.resume(),pause:()=>sim.pause(),setActive:active=>sim.setActive(active),
  replay:()=>{if(sim.dashboard.mode!=='world')sim.dashboard.close();sim.dashboard.autoShown=false;document.getElementById('reset-demo').click();sim.resume();},
 };
 await (await import('./chapter-03-inspection.js')).installInspection(window);
 const navigate=direction=>parent.postMessage({type:'ch03:navigate',direction},location.origin);
 const busy=()=>!!document.querySelector('dialog[open]')||sim.state().dashboard!=='world';
 let swipe;
 document.addEventListener('pointerdown',e=>{swipe=!busy()&&!e.target.closest('button,a,input,select,dialog')?{x:e.clientX,y:e.clientY}:null;},{passive:true});
 document.addEventListener('pointerup',e=>{if(swipe&&!busy()&&Math.abs(e.clientX-swipe.x)>70&&Math.abs(e.clientX-swipe.x)>Math.abs(e.clientY-swipe.y)*1.4)navigate(e.clientX<swipe.x?1:-1);swipe=null;},{passive:true});
 document.addEventListener('pointercancel',()=>{swipe=null;});
 document.addEventListener('keydown',e=>{if(busy()||e.altKey||e.ctrlKey||e.metaKey||e.target.closest('button,input,select,textarea,a'))return;if(['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();navigate(e.key==='ArrowRight'?1:-1);}else if(e.key===' '){e.preventDefault();parent.postMessage({type:'ch03:toggle'},location.origin);}});
 document.documentElement.dataset.ch03Ready='true';parent.postMessage({type:'ch03:ready'},location.origin);
}
