// Chapter presentation only. The live renderer nodes, handlers and models stay in their document.
export async function installInspection(win){
 const doc=win.document;
 if(doc.documentElement.dataset.ch03Inspection)return;
 doc.documentElement.dataset.ch03Inspection='loading';
 const sheet=doc.createElement('link');sheet.rel='stylesheet';sheet.href=new URL('./chapter-03-inspection.css',import.meta.url).href;
 await new Promise((resolve,reject)=>{sheet.onload=resolve;sheet.onerror=reject;doc.head.append(sheet);});
 const controller=()=>win.parent.Chapter03Controller||win.Chapter03Controller;
 let current=null,intent=null;
 const suspended=[],returns=new WeakMap(),native=new WeakMap();
 function remember(event){
  if(event.type==='keydown'&&!['Enter',' '].includes(event.key))return;
  intent={playing:event.target.closest('[data-offer]')?false:controller()?.state().scenes[controller().getCurrentSceneIndex()]?.playing,focus:doc.activeElement};
  queueMicrotask(()=>intent=null);
 }
 doc.addEventListener('click',remember,true);doc.addEventListener('keydown',remember,true);
 for(const dialog of doc.querySelectorAll('dialog')){
  dialog.classList.add('ch03-inspection');
  const close=dialog.querySelector('[aria-label^="Close"],#dashboard-back');
  if(close){close.classList.add('ch03-inspection-close');close.setAttribute('aria-label','Close inspection');}
  const show=dialog.showModal.bind(dialog),closeNative=dialog.close.bind(dialog);
  native.set(dialog,{show,close:closeNative});
  dialog.showModal=()=>{
   if(dialog.open)return;
   if(current&&current!==dialog){suspended.push(current);native.get(current).close('ch03-suspend');}
   returns.set(dialog,intent?.focus||doc.activeElement);
   current=dialog;
   controller()?.inspectionOpened(win,dialog,intent?.playing);
   dialog.returnValue='';show();dialog.scrollTop=0;close?.focus({preventScroll:true});
  };
  dialog.addEventListener('close',()=>{
   if(dialog.returnValue==='ch03-suspend')return;
   if(current!==dialog)return;
   current=suspended.pop()||null;
   if(current){current.returnValue='';native.get(current).show();controller()?.inspectionOpened(win,current);}
   else controller()?.inspectionClosed(win,dialog);
   const focus=returns.get(dialog);
   if(focus?.isConnected&&!focus.closest('[hidden]')&&focus.getClientRects().length)focus.focus({preventScroll:true});
  });
  dialog.addEventListener('click',event=>{
   if(event.target!==dialog)return;
   const r=dialog.getBoundingClientRect();
   if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();
  });
 }
 doc.documentElement.dataset.ch03Inspection='true';
}
