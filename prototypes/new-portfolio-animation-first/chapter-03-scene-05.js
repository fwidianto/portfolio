import './scene-05/game.js';
if(new URLSearchParams(location.search).get('chapter')==='1'){
 const style=document.createElement('link');style.rel='stylesheet';style.href=new URL('./chapter-03-scene-05.css',import.meta.url).href;
 await new Promise((resolve,reject)=>{style.onload=resolve;style.onerror=reject;document.head.append(style);});
 const game=window.fmcGame;
 const app=document.querySelector('.warehouse-app'),panel=document.getElementById('operations');
 const manage=document.createElement('button');manage.type='button';manage.className='chapter-management';manage.textContent='Configure scenario';manage.setAttribute('aria-controls','operations');
 document.querySelector('.game-header').insertBefore(manage,document.querySelector('.game-header .quiet-button'));
 const close=document.createElement('button');close.type='button';close.className='chapter-close-management';close.textContent='×';close.setAttribute('aria-label','Close management panel');document.querySelector('.ops-tabs').append(close);
 panel.insertBefore(document.getElementById('game-feedback'),document.getElementById('decision'));
 const setManagement=open=>{app.dataset.management=open?'open':'closed';panel.inert=!open;panel.setAttribute('aria-hidden',String(!open));manage.setAttribute('aria-expanded',String(open));manage.textContent=game.state().started?'Manage operation':'Configure scenario';};
 setManagement(false);manage.addEventListener('click',()=>setManagement(app.dataset.management!=='open'));close.addEventListener('click',()=>{setManagement(false);manage.focus();});
 const decisions=document.getElementById('decision');decisions.tabIndex=0;decisions.setAttribute('aria-label','Scrollable fleet and maintenance decisions');
 document.addEventListener('click',event=>{
  if(event.target.closest('[data-site-inspect="workshop"],[data-unit]'))setManagement(true);
  if(event.target.closest('[data-action="play"],#play-mission'))queueMicrotask(()=>{manage.textContent=game.state().started?'Manage operation':'Configure scenario';});
 },true);
 window.WarehouseScene05={
  state:game.state,pause:game.pause,setActive:game.setActive,setSpeed:game.setSpeed,
  play:()=>{if(game.state().started)game.play();},
  replay:()=>{game.restart();game.play();},
  inspect:()=>game.inspect('actuals')
 };
 const about=document.createElement('div');about.id='about-dialog';about.hidden=true;
 about.innerHTML='<p>A profitable service division can still contain maintenance contracts with limited room for unexpected repairs. This interactive study connects fleet use, complete maintenance packages, mechanic capacity and travel to contract contribution.</p><p>Run a ten-forklift warehouse, compare maintenance and resource decisions, then trace actual costs and unfinished work back to their events. The worksheet and warehouse use the same deterministic calculation sources.</p><p><strong>All units, contract values, standards and reliability rates are synthetic.</strong> The game demonstrates analytical reasoning, not historical company results or manufacturer guidance. Ownership, financing, depreciation and insurance are outside its maintenance-contract economics.</p>';
 document.body.append(about);
 await (await import('./chapter-03-inspection.js')).installInspection(window);
 document.addEventListener('keydown',event=>{
  if(game.state().manual||document.querySelector('dialog[open]')||event.altKey||event.ctrlKey||event.metaKey||event.target.closest('button,input,select,textarea,a'))return;
  if(['ArrowLeft','ArrowRight'].includes(event.key)){event.preventDefault();parent.postMessage({type:'ch03:navigate',direction:event.key==='ArrowRight'?1:-1},location.origin);}
 });
 document.documentElement.dataset.ch03Ready='true';parent.postMessage({type:'ch03:ready'},location.origin);
}
