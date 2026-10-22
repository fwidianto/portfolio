import {World} from './assets/world.js';
export const ACTS=[
  {title:'Profitable as a division.',copy:'Aggregate results are positive. One existing contract is selected for a closer look.',module:'profit'},
  {title:'Every machine keeps a meter.',copy:'Different starting meters and operating hours lead to different service dates. The lifetime meter never resets.',module:'fleet'},
  {title:'Hours become maintenance.',copy:'250, 500, 1,000 and 2,000-hour thresholds select complete packages. Parts and wrench time are counted once.',module:'forecast'},
  {title:'Work needs people.',copy:'Each mechanic brings 176 regular hours per month. Reservations must fit across every customer site.',module:'workforce'},
  {title:'Distance has a cost.',copy:'Paid travel consumes capacity. A remote stay adds mess and allowances, using rotation travel instead of routine office trips.',module:'logistics'},
  {title:'What if utilization rises?',copy:'A bounded high-utilization example now puts the same team under pressure. Compare capped overtime, hiring and shared capacity.',module:'workforce'},
  {title:'A narrow margin remains.',copy:'Back at the original utilization, maintenance and allocated overhead consume most revenue. Unexpected repairs have little room.',module:'profit'},
  {title:'Understand the contract.',copy:'Fleet → maintenance → people → logistics → economics. Take control to trace a different set of assumptions.',module:'fleet'}
];
export function startAnimation(getView,onTick){
  const world=new World(document.querySelector('#world-canvas')),media=matchMedia('(prefers-reduced-motion: reduce)');
  let lastDraw=0;const metrics={frames:0,totalRenderMs:0,maxRenderMs:0};
  function frame(now){
    if(!document.hidden&&now-lastDraw>=32){
      lastDraw=now;
      // Timeline is advanced by the controller; Canvas only reads its snapshot.
      onTick(now,media.matches);
      const current=getView(),start=performance.now();
      world.render({...current,time:media.matches?0:current.time,dt:.033,reduced:media.matches});
      const cost=performance.now()-start;metrics.frames++;metrics.totalRenderMs+=cost;metrics.maxRenderMs=Math.max(metrics.maxRenderMs,cost);
      if(world.positions){
        const p=world.positions;
        for(const button of document.querySelectorAll('.scene-hit')){
          const point=p[button.dataset.spot];
          const x=p.W/2+(point[0]-world.focusX)*world.zoom,y=p.H/2+(point[1]-world.focusY)*world.zoom;
          button.style.left=x/p.W*100+'%';button.style.top=y/p.H*100+'%';
        }
      }
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  return {metrics,media,world};
}
