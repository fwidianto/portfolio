export async function expandWarehouse(entry,frame){
  const image=entry.querySelector('.world-preview img'),rect=image.getBoundingClientRect(),cover=image.cloneNode();
  Object.assign(cover.style,{position:'fixed',zIndex:20,left:`${rect.left}px`,top:`${rect.top}px`,width:`${rect.width}px`,height:`${rect.height}px`,objectFit:'cover',pointerEvents:'none',filter:'brightness(.35) saturate(.66)'});
  document.body.append(cover);entry.inert=true;frame.style.opacity='0';frame.hidden=false;
  const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;
  cover.animate({opacity:[0,1]},{duration:reduced?0:350,fill:'forwards'});
  const animation=cover.animate([{left:`${rect.left}px`,top:`${rect.top}px`,width:`${rect.width}px`,height:`${rect.height}px`,filter:'brightness(.35) saturate(.66)'},{left:'0px',top:'0px',width:`${innerWidth}px`,height:`${innerHeight}px`,filter:'brightness(.88) saturate(.88)'}],{duration:reduced?0:1000,easing:'cubic-bezier(.22,.7,.2,1)',fill:'forwards'});
  entry.animate({opacity:[1,0]},{duration:reduced?0:450,fill:'forwards'});
  await animation.finished;
  entry.hidden=true;frame.style.opacity='1';
  await cover.animate({opacity:[1,0]},{duration:reduced?0:300,fill:'forwards'}).finished;
  cover.remove();
}
