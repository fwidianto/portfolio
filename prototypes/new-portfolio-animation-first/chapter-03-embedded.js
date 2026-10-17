// Presentation only: isolate each renderer while sharing the chapter's backdrop and controls.
(async () => {
  if(new URLSearchParams(location.search).get('chapter')!=='1')return;
  document.documentElement.dataset.chapterPresentation='true';
  const scene02=!!window.FuelFilm;
  const css=`html,body{background:transparent!important;overflow:hidden!important;margin:0!important;height:100%!important}.page,.viewer,main,.film,.stage,.art-window{background:transparent!important;border:0!important;border-radius:0!important;margin:0!important;padding:0!important;max-width:none!important}.viewer,.page,main,.film{width:100%!important;height:100%!important;min-height:0!important;display:block!important}.stage{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;min-height:0!important;max-height:none!important;aspect-ratio:auto!important}.masthead,.intro,.film-top,.stage-bottom,.player,footer,.sample-tag,.skip{display:none!important}.art-window{position:absolute!important;inset:0!important;width:100%!important;height:100%!important}#scene{width:100%!important;height:100%!important;object-fit:contain!important;${scene02?'mask-image:linear-gradient(to right,transparent,#000 4%,#000 96%,transparent);':''}}#scene>rect[fill="url(#grid)"]{display:none}dialog{max-height:85vh!important}#about-dialog .close{font-size:24px}`;
  const style=document.createElement('style');style.textContent=css;document.head.append(style);
  style.textContent+='#stage{touch-action:pan-y}';
  if(scene02){
    style.textContent+='#scene{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:min(100vw,160vh)!important;height:min(100vh,62.5vw)!important;mask-image:linear-gradient(to right,transparent,#000 5%,#000 95%,transparent),linear-gradient(to bottom,transparent,#000 10%,#000 94%,transparent);mask-composite:intersect}.ch03-fuel-cue{position:absolute;bottom:7px;left:18px;right:18px;margin:0;text-align:center;font:11px/1.6 Inter,sans-serif;color:#cfbea7;pointer-events:none}@media(max-width:600px) and (orientation:portrait){#scene{inset:0 0 35px!important;transform:none!important;width:100%!important;height:calc(100% - 35px)!important;mask-image:none!important}}';
    const draw=window.PixelScene.draw,source=document.createElement('canvas'),canvas=document.getElementById('scene');source.width=640;source.height=400;
    const cue=document.createElement('p');cue.className='ch03-fuel-cue';document.getElementById('stage').append(cue);
    const cues=['Personal payment → reimbursement','Vendor research → corporate arrangement','Company balance → vehicle cards','Vehicle card → recorded purchase','Transaction history → manual review','Central payment → vehicle cost visibility'];
    window.PixelScene.draw=(target,time)=>{
      const portrait=innerWidth<=600&&innerHeight>innerWidth;
      cue.hidden=!portrait;cue.textContent=cues[Math.max(0,window.FuelFilm.acts.findLastIndex(a=>time>=a.time))];
      if(!portrait){if(target.width!==640||target.height!==400){target.width=640;target.height=400;}draw(target,time);return;}
      draw(source,time);if(target.width!==360||target.height!==650){target.width=360;target.height=650;}
      const c=target.getContext('2d');c.imageSmoothingEnabled=false;c.fillStyle='#040508';c.fillRect(0,0,360,650);
      const crop=(x,y,w,h,dx,dy,dw)=>c.drawImage(source,x,y,w,h,dx,dy,dw,dw*h/w);
      if(time<6){crop(0,0,640,400,0,25,360);crop(92,110,224,230,30,300,290);}
      else if(time<11){crop(0,0,640,400,0,25,360);crop(300,45,318,228,0,320,360);}
      else if(time<17){crop(0,0,640,400,0,25,360);crop(222,40,184,84,48,278,264);crop(38,174,188,218,96,408,185);}
      else if(time<24){crop(449,19,182,82,70,0,220);crop(40,50,400,335,0,96,360);crop(450,137,174,203,75,402,210);}
      else if(time<31){crop(79,39,485,255,0,75,360);crop(96,223,250,47,10,330,340);crop(350,223,196,47,10,414,340);crop(290,313,245,65,10,505,340);}
      else{crop(0,0,640,400,0,15,360);crop(27,45,184,84,15,285,225);crop(105,205,350,115,0,450,360);}
    };
    window.PixelScene.draw(canvas,window.FuelFilm.state().time);
    window.addEventListener('resize',()=>window.PixelScene.draw(canvas,window.FuelFilm.state().time),{passive:true});
  }
  else{
    const art=document.getElementById('scene');
    const editorial=new Set(['ONE CONTROLLED WORKFLOW','MANY REQUESTS. ONE HQ-CONTROLLED PROCESS.','HUMAN DECISIONS · VISIBLE STAGES','Automation prepares. People decide.','PREPARED RECORDS → HUMAN DECISIONS','One visible request queue.']);
    const quiet=()=>art.querySelectorAll('text').forEach(text=>{if(editorial.has(text.textContent))text.style.display='none';});
    quiet();new MutationObserver(quiet).observe(art,{childList:true});
  }
  let swipe;
  document.addEventListener('pointerdown',event=>{if(!event.target.closest('dialog,button,input,select,a'))swipe={x:event.clientX,y:event.clientY};},{passive:true});
  document.addEventListener('pointerup',event=>{if(swipe&&Math.abs(event.clientX-swipe.x)>70&&Math.abs(event.clientX-swipe.x)>Math.abs(event.clientY-swipe.y)*1.4)parent.postMessage({type:'ch03:navigate',direction:event.clientX<swipe.x?1:-1},location.origin);swipe=null;},{passive:true});
  document.addEventListener('pointercancel',()=>{swipe=null;},{passive:true});
  document.addEventListener('keydown',event=>{
    if(document.querySelector('dialog[open]')||/INPUT|SELECT|TEXTAREA/.test(event.target.tagName))return;
    if(['ArrowLeft','ArrowRight'].includes(event.key)){event.preventDefault();event.stopImmediatePropagation();parent.postMessage({type:'ch03:navigate',direction:event.key==='ArrowRight'?1:-1},location.origin);}
    else if(event.key===' '&&!event.target.closest('button,a,[role="button"]')){event.preventDefault();event.stopImmediatePropagation();parent.postMessage({type:'ch03:toggle'},location.origin);}
  },true);
  const scene=window.FuelFilm||window.Scene03;scene?.pause();scene?.seek(0);
  await (await import('./chapter-03-inspection.js')).installInspection(window);
  document.documentElement.dataset.ch03Ready='true';parent.postMessage({type:'ch03:ready'},location.origin);
  document.getElementById('stage')?.setAttribute('aria-label','Animation. Use left and right arrows to change scenes. Open the chapter information node for project details.');
})();
