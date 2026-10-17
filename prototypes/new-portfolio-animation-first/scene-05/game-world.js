import {RACKS} from './warehouse-model.js';
const COLORS={'FG-25':['#e6ad3e','#ffe2a0','#9d6823'],'FB-20':['#58a8a2','#b0ded7','#326963'],'FD-25':['#d47e36','#ffc28c','#8f4925']};
const PARKING=[[825,635],[975,565],[1040,505],[700,535],[795,465],[905,425],[600,445],[495,405],[355,350],[720,310]];
export const CAMERA={overview:[800,500,1],fleet:[810,480,1.32],service:[335,705,1.65],office:[1185,310,1.35]};

export function forkliftSymbol(){
  const asset=new URL('./assets/game/forklifts.png',import.meta.url).href;
  return '<clipPath id="game-sprite-clip"><rect width="724" height="724"/></clipPath>'+Object.keys(COLORS).map((model,i)=>'<symbol id="game-forklift-'+model+'" viewBox="0 0 724 724"><g clip-path="url(#game-sprite-clip)"><image href="'+asset+'" x="'+(-724*i)+'" width="2172" height="724"/></g></symbol>').join('');
}
export function mountWorld(root,{onUnit,onInspect}={}){
  root.classList.add('game-world');
  root.innerHTML=`<div class="world-plane"><img class="world-ground" src="${new URL('./assets/game/aerial-worksite.png',import.meta.url).href}" alt="Aerial view of a customer warehouse, open service workshop, mechanic's office and connecting road"><svg class="world-actors" viewBox="0 0 1600 1000" aria-hidden="true"><defs>${forkliftSymbol()}<filter id="actor-shadow"><feDropShadow dx="0" dy="4" stdDeviation="3" flood-color="#203b2d" flood-opacity=".25"/></filter></defs><path id="office-route" d="M1180 300 Q1100 215 935 160 M1180 300 Q1360 420 1355 625 Q1340 720 1260 805" fill="none" stroke="#ffd581" stroke-width="8" stroke-linecap="round" stroke-dasharray="12 10" opacity="0"/><g id="fleet-actors"></g><g id="service-workers"></g><g id="service-van" opacity="0" filter="url(#actor-shadow)"><ellipse cy="12" rx="37" ry="16" fill="#163b2b" opacity=".2"/><path d="M-31 -8 L-13 -22 33 -3 34 16 15 28 -30 8Z" fill="#e4e8dc" stroke="#657c6e"/><path d="M-13 -22 L33 -3 13 9 -31 -8Z" fill="#fffaf0"/><path d="M13 9 L33 -3 34 16 15 28Z" fill="#afc4b8"/><path d="M-26 -5 L-13 -13 0 -8 -12 -1Z" fill="#2c6450"/><ellipse cx="-18" cy="12" rx="7" ry="8" fill="#203b31"/><ellipse cx="23" cy="21" rx="7" ry="8" fill="#203b31"/><path d="M-2 -3 L9 2 10 12 0 7Z" fill="#447e63"/></g><g id="service-beacon" opacity="0"><circle r="26" fill="#ffc974" opacity=".2"/><circle r="12" fill="#e7b256" stroke="#fff1bd" stroke-width="3"/><path d="M-5 3 L5 -7 M-5 -6 L0 -1 M0 8 L7 1" stroke="#fff8dc" stroke-width="3"/></g><g id="loading-pallet" opacity="0"><path d="M-16 -6 L0 -15 24 -7 9 3Z" fill="#d2ab77"/><path d="M-16 -6 L9 3 9 18 -16 8Z" fill="#a17c4d"/><path d="M9 3 L24 -7 24 9 9 18Z" fill="#b5915e"/><path d="M-15 0 L9 9 23 0" fill="none" stroke="#ecd3a9" stroke-width="3"/></g></svg><div class="site-pins"><button type="button" class="site-pin pin-fleet" data-world-inspect="fleet">Customer fleet <span>10 units</span></button><button type="button" class="site-pin pin-service" data-world-inspect="maintenance">Service bay <span>Inspect a package ↗</span></button><button type="button" class="site-pin pin-office" data-world-inspect="capacity">Mechanic's office <span>Travel & capacity ↗</span></button></div></div>`;
  const plane=root.querySelector('.world-plane'),svg=root.querySelector('svg.world-actors');
  let models=[],selected=0,step=0,reduced=false,progress=0;
  const actorGroup=svg.querySelector('#fleet-actors');
  actorGroup.innerHTML=PARKING.map(([x,y],i)=>`<g class="unit-actor" data-unit="${i}" transform="translate(${x} ${y})"><ellipse class="unit-ring" cy="20" rx="65" ry="30" fill="none" stroke="#e8cf7c" stroke-width="5" opacity="0"/><svg x="-64" y="-88" width="128" height="128"><use href="#game-forklift-FG-25" width="128" height="128"/></svg><text class="unit-id" x="0" y="62" text-anchor="middle">${String(i+1).padStart(2,'0')}</text></g>`).join('');
  const actors=[...actorGroup.children];
  const worker=([x,y],i)=>`<g class="worker-actor" transform="translate(${x} ${y})"><ellipse cy="13" rx="13" ry="6" fill="#233f2d" opacity=".2"/><path d="M-4 2 L-6 14 M4 2 L6 14" stroke="#263f39" stroke-width="5"/><path d="M-7 -12 L6 -12 8 2 -7 3Z" fill="${i===0?'#598b6f':'#567c95'}"/><path d="M-6 -7 L-13 0 M7 -7 L13 -1" stroke="#d6b48d" stroke-width="4"/><circle cy="-17" r="6" fill="#deb98d"/><path d="M-7 -19 Q0 -29 7 -19Z" fill="#eccf78"/></g>`;
  function paint({scenario,unit=0,phase=0,crew=3,motionReduced=false}){
    models=scenario.fleets.map(f=>f.model);selected=unit;step=phase;reduced=motionReduced;
    root.dataset.phase=String(phase);root.dataset.placement=scenario.worksheet.placement;
    actors.forEach((actor,i)=>{actor.querySelector('use').setAttribute('href','#game-forklift-'+models[i]);actor.classList.toggle('is-selected',i===selected);actor.style.opacity=String(i===selected?1:.95);actor.querySelector('.unit-ring').setAttribute('opacity',i===selected?'1':'0');});
    const locations=phase===3?[[285,720],[405,710]]:scenario.worksheet.placement==='dedicated'?[[300,685],[385,730],[450,675],[490,740]]:[[1220,335],[1260,365],[1300,340],[1280,400]];
    svg.querySelector('#service-workers').innerHTML=(phase>=3?locations.slice(0,Math.min(crew,4)):[]).map(worker).join('');
    svg.querySelector('#office-route').setAttribute('opacity',phase>=4&&scenario.worksheet.placement==='hybrid'?'.9':'0');
    svg.querySelector('#service-van').setAttribute('opacity',phase>=4&&scenario.worksheet.placement==='hybrid'?'1':'0');
    root.querySelector('.pin-fleet span').textContent=scenario.fleets.length+' units · select one';
    setProgress(phase>=3?1:0);
  }
  function setProgress(p){
    progress=Math.max(0,Math.min(1,p));
    actors.forEach((actor,i)=>{if(i!==selected){const [x,y]=PARKING[i];actor.setAttribute('transform',`translate(${x} ${y})`);}});
    let [x,y]=PARKING[selected];
    if(step===2&&progress>0){const run=progress<=.5?progress*2:(1-progress)*2;x+=(545-x)*run;y+=(370-y)*run;}
    if(step===3){x=345;y=735;}
    actors[selected].setAttribute('transform',`translate(${x} ${y})`);
    const beacon=svg.querySelector('#service-beacon');beacon.setAttribute('transform',`translate(${x+47} ${y-57})`);beacon.setAttribute('opacity',step===3||step===2&&progress>=.12?'1':'0');
    const pallet=svg.querySelector('#loading-pallet');pallet.setAttribute('transform',`translate(${x-47} ${y-10})`);pallet.setAttribute('opacity',step===2&&progress>0&&progress<.5?'1':'0');
  }
  function vanProgress(p){const t=Math.max(0,Math.min(1,p)),x=1180+Math.sin(t*Math.PI)*175,y=300+t*505;svg.querySelector('#service-van').setAttribute('transform',`translate(${x} ${y})`);}
  function focus(zone='overview'){
    const [x,y,scale]=CAMERA[zone]||CAMERA.overview;
    plane.style.transformOrigin=`${x/16}% ${y/10}%`;plane.style.setProperty('--world-scale',String(scale));
    root.dataset.camera=zone;
  }
  svg.addEventListener('click',event=>{const actor=event.target.closest('[data-unit]');if(actor)onUnit?.(Number(actor.dataset.unit));});
  root.addEventListener('click',event=>{const pin=event.target.closest('[data-world-inspect]');if(pin)onInspect?.(pin.dataset.worldInspect);});
  return {paint,setProgress,vanProgress,focus,get metrics(){return{actors:actors.length,progress,selected,phase:step,reduced};}};
}

// Directional vectors share the simulation's floor coordinates and depth order.
const project=(x,y,z=0)=>[650+(x-y)*26,100+(x+y)*13-z];
const points=ps=>ps.map(p=>p.join(',')).join(' ');
function box(x,y,w,d,z,h,color,light,dark){
  const a=project(x,y,z+h),b=project(x+w,y,z+h),c=project(x+w,y+d,z+h),e=project(x,y+d,z+h),f=project(x+w,y,z),g=project(x+w,y+d,z),j=project(x,y+d,z);
  return `<polygon points="${points([b,c,g,f])}" fill="${dark}"/><polygon points="${points([e,c,g,j])}" fill="${color}"/><polygon points="${points([a,b,c,e])}" fill="${light}" stroke="${dark}" stroke-width=".6"/>`;
}
function palletSymbol(){return box(-.38,-.38,.76,.76,1,4,'#a47c4e','#d9b57f','#88663e')+box(-.34,-.34,.68,.68,5,17,'#ba996c','#edcca0','#97774f')+'<path d="M0 -34v16 M-10 -29l18 9" stroke="#fff0cf" stroke-width="2" opacity=".75"/>';}
function directionalForklift(model,heading){
  const angle=heading*Math.PI/2,spin=(x,y,z=0)=>project(x*Math.cos(angle)-y*Math.sin(angle),x*Math.sin(angle)+y*Math.cos(angle),z).map((v,i)=>v-[650,100][i]);
  const cuboid=(x,y,w,d,z,h,colors)=>{
    const p=[[x,y],[x+w,y],[x+w,y+d],[x,y+d]],lower=p.map(([a,b])=>spin(a,b,z)),upper=p.map(([a,b])=>spin(a,b,z+h));
    const faces=p.map((_,i)=>({i,depth:lower[i][1]+lower[(i+1)%4][1]})).sort((a,b)=>a.depth-b.depth).slice(2);
    return faces.map(({i},k)=>`<polygon points="${points([upper[i],upper[(i+1)%4],lower[(i+1)%4],lower[i]])}" fill="${colors[k===0?2:0]}"/>`).join('')+`<polygon points="${points(upper)}" fill="${colors[1]}" stroke="${colors[2]}" stroke-width=".8"/>`;
  };
  const line=(a,b,stroke,width=2)=>`<path d="M${spin(...a).join(' ')} L${spin(...b).join(' ')}" stroke="${stroke}" stroke-width="${width}"/>`;
  let body='<ellipse cy="4" rx="25" ry="11" fill="#19342b" opacity=".2"/>';
  for(const x of [-.34,.24])for(const y of [-.28,.28]){const p=spin(x,y,4);body+=`<ellipse cx="${p[0]}" cy="${p[1]}" rx="5" ry="6" fill="#253a34" stroke="#65766b" stroke-width="1"/>`;}
  body+=cuboid(-.48,-.24,.75,.48,5,11,COLORS[model]);
  body+=cuboid(-.23,-.17,.3,.34,16,6,['#314b42','#5f7365','#203b32']);
  for(const x of [-.3,.22])for(const y of [-.24,.24])body+=line([x,y,14],[x,y,33],'#2e453d',2);
  body+=cuboid(-.34,-.28,.65,.56,32,2,['#3d554b','#64776a','#243f34']);
  for(const y of [-.2,.2]){body+=line([.36,y,4],[.36,y,34],'#344940',3);body+=line([.36,y,6],[1.03,y,6],'#667a6c',3);}
  const load=cuboid(.55,-.3,.6,.6,7,18,['#bf9f71','#f0d2a4','#8d734f']);
  return `<symbol id="living-${model}-${heading}" overflow="visible">${body}</symbol><symbol id="loaded-${model}-${heading}" overflow="visible">${body}${load}</symbol>`;
}
export function mountLivingWorld(root,{onUnit,onEnter,onInspect}={}){
  root.className='living-world';
  const floor=(x,y,w,d,fill,extra='')=>`<polygon points="${points([[x,y],[x+w,y],[x+w,y+d],[x,y+d]].map(([a,b])=>project(a,b)))}" fill="${fill}" ${extra}/>`;
  let grid='';for(let x=0;x<=26;x++)grid+=`<path d="M${project(x,0)} L${project(x,18)}"/>`;for(let y=0;y<=18;y++)grid+=`<path d="M${project(0,y)} L${project(26,y)}"/>`;
  const text=(x,y,label,cls='floor-label')=>`<text x="${project(x,y)[0]}" y="${project(x,y)[1]}" class="${cls}" text-anchor="middle">${label}</text>`;
  const racks=RACKS.map((r,i)=>{
    let out=box(r.x-.1,r.y-.1,4.2,3.2,0,4,'#697d6d','#8fa18a','#5e7163');
    for(const z of [7,32,57]){
      for(const y of [r.y,r.y+2.9])out+=box(r.x,y,4,.1,z,3,'#637c6b','#9cae8e','#456250');
      for(const x of [r.x,r.x+3.9])out+=box(x,r.y,.1,3,z,3,'#637c6b','#9cae8e','#456250');
      for(const x of [r.x,r.x+4])for(const y of [r.y,r.y+3]){const a=project(x,y,4),b=project(x,y,60);out+=`<path d="M${a} L${b}" stroke="#375448" stroke-width="3"/>`;}
    }
    out+=text(r.x+2,r.y+2,'R'+(i+1),'rack-label');
    return {depth:r.x+r.y+6,node:`<g class="warehouse-rack">${out}</g>`};
  });
  root.innerHTML=`<svg viewBox="0 0 1500 870" class="living-svg" aria-label="Live isometric warehouse. Unit selection and operations are also available in the fleet controls." role="img"><defs><pattern id="asphalt" width="12" height="12" patternUnits="userSpaceOnUse"><rect width="12" height="12" fill="#8c9c8b"/><circle cx="3" cy="6" r=".7" fill="#b8c5ae"/></pattern><symbol id="living-pallet" overflow="visible"><g transform="translate(-650 -100)">${palletSymbol()}</g></symbol>${Object.keys(COLORS).flatMap(m=>[0,1,2,3].map(h=>directionalForklift(m,h))).join('')}</defs><g class="warehouse-camera"><image class="site-surround" href="${new URL('./assets/game/aerial-worksite.png',import.meta.url).href}" x="0" y="-30" width="1500" height="940" preserveAspectRatio="xMidYMid slice" opacity=".27"/><path d="M0 0H1500V870H0Z" fill="#cad3bd" opacity=".5"/>${floor(-4,-5,35,28,'url(#asphalt)')}${floor(-1,-3.6,28,24,'#b5bc9f','stroke="#e3e5c9" stroke-width="3"')}${box(-.6,-.4,27,18.8,0,8,'#b9c0aa','#d8d8c0','#7f927c')}${floor(0,0,26,18,'#c9cbb6')}<g stroke="#a4ad98" stroke-width=".65" opacity=".6">${grid}</g>${floor(0,14,26,4,'#c3c6ac')}${floor(0,0,26,2,'#bdc6a7')}<g fill="none" stroke="#f0dda0" stroke-width="2" stroke-dasharray="10 12">${[2,8,14].map(y=>`<path d="M${project(1,y)} L${project(25,y)}"/>`).join('')}</g>${floor(0,4,2.3,3,'#91a89c','stroke="#f9e8b8" stroke-width="2"')}${floor(0,10,2.3,3,'#91a89c','stroke="#f9e8b8" stroke-width="2"')}${text(1,4,'BAY 1')}${text(1,10,'BAY 2')}${text(13,20,'RECEIVING  →')}${text(13,-3.7,'←  DISPATCH')}${text(13,-.9,'STAGING')}${text(1,8.3,'SERVICE')}<g class="warehouse-slots"></g><g class="warehouse-depth"></g><g class="warehouse-crew"></g><g class="warehouse-roof" pointer-events="none">${floor(-.7,-.5,27.4,18.7,'#416956','opacity=".08" stroke="#416956" stroke-width="4"')}${text(13,8.8,'CUSTOMER WAREHOUSE · ROOF CUTAWAY','roof-label')}</g></g></svg>`;
  root.insertAdjacentHTML('beforeend',`<div class="site-exterior"><img class="exterior-image" src="${new URL('./assets/game/aerial-worksite.png',import.meta.url).href}" alt="Customer warehouse and receiving yard, separate open service workshop, mechanic’s office and connecting road"><button type="button" class="exterior-pin exterior-warehouse" data-enter-warehouse>Enter warehouse <span class="exterior-fleet-count">10 units inside ↗</span></button><button type="button" class="exterior-pin exterior-workshop" data-site-inspect="workshop">Service workshop <span class="exterior-service-count">1 bay available</span></button><button type="button" class="exterior-pin exterior-office" data-site-inspect="capacity">Mechanic’s office <span class="exterior-crew-count">Crew & paid travel ↗</span></button><div class="exterior-operation" aria-live="off">The live operation continues inside.</div></div>`);
  const svg=root.querySelector('svg.living-svg'),camera=root.querySelector('.warehouse-camera'),depth=root.querySelector('.warehouse-depth'),slots=root.querySelector('.warehouse-slots');
  const secondBayLabel=[...camera.querySelectorAll('.floor-label')].find(e=>e.textContent==='BAY 2');
  const secondBayFloor=secondBayLabel.previousElementSibling.previousElementSibling;
  const actors=Array.from({length:10},(_,i)=>{const node=document.createElementNS('http://www.w3.org/2000/svg','g');node.classList.add('living-unit');node.dataset.unit=i;node.innerHTML=`<ellipse class="selected-halo" rx="29" ry="14" fill="#f4d37c" opacity="0" stroke="#fff3bb" stroke-width="2"/><use/><text class="living-unit-label" text-anchor="middle" y="22">${i+1}</text><text class="unit-warning" text-anchor="middle" y="-42"></text>`;return node;});
  const rackNodes=racks.map(r=>{const node=document.createElementNS(svg.namespaceURI,'g');node.innerHTML=r.node;return {...r,node};});
  const palletNodes=new Map();let view='overview',zoom=1;
  function setView(next,scale=zoom,focus=null){view=next;zoom=scale;root.dataset.camera=view;const factor=(view==='interior'?1.18:1)*zoom,anchor=focus?project(focus.x,focus.y):[750,430],targetX=focus&&root.clientWidth<760?500:750;camera.setAttribute('transform',`translate(${targetX-anchor[0]*factor} ${430-anchor[1]*factor}) scale(${factor})`);root.querySelector('.warehouse-roof').style.display=view==='interior'?'none':'';}
  function render(s,selected=0,{reduced=false}={}){
    root.dataset.reduced=String(reduced);
    root.querySelector('.exterior-fleet-count').textContent=s.units.filter(u=>!u.fault&&!u.service).length+' / 10 available · live floor ↗';
    root.querySelector('.exterior-service-count').textContent=s.bays.filter(b=>b.unit).length+' / '+s.bays.length+' bays occupied';
    root.querySelector('.exterior-crew-count').textContent=s.mechanics.length+' mechanics · '+(s.scenario.worksheet.placement==='dedicated'?'Onsite':'Mobile');
    root.querySelector('.exterior-operation').textContent=s.jobs.filter(j=>j.status==='completed').length+' moves completed · '+s.jobs.filter(j=>j.owner&&j.status!=='completed').length+' active jobs inside';
    secondBayLabel.textContent=s.bays.length>1?'BAY 2':'SPARE SPACE';secondBayFloor.setAttribute('fill',s.bays.length>1?'#91a89c':'#b9c1ab');secondBayFloor.setAttribute('stroke-dasharray',s.bays.length>1?'none':'5 5');
    if(view==='interior'&&s.units[selected].mode==='manual'&&!reduced&&zoom>1)setView(view,zoom,s.units[selected]);
    if(!slots.children.length)slots.innerHTML=s.spots.map(p=>floor(p.x-.4,p.y-.4,.8,.8,p.type==='inbound'?'#e6d7ab':p.type==='outbound'?'#a5baa7':'#b9bea2','stroke="#7d927d" stroke-width="1"')).join('');
    const layers=[...rackNodes];
    for(const p of s.pallets){
      let node=palletNodes.get(p.id);if(!node){node=document.createElementNS(svg.namespaceURI,'g');node.setAttribute('class','stock-pallet');node.innerHTML='<use href="#living-pallet"/><title></title>';palletNodes.set(p.id,node);}
      const spot=s.spots.find(x=>x.id===p.location);
      if(!spot){node.remove();continue;}
      const z=spot.type==='storage'?35:0,pos=project(spot.x,spot.y,z);node.setAttribute('transform',`translate(${pos})`);node.querySelector('title').textContent=p.id+' · '+spot.type;
      layers.push({depth:spot.x+spot.y+.6,node});
    }
    s.units.forEach((u,i)=>{
      const p=u.edge?{x:u.x+(u.edge.to.x-u.x)*u.edge.progress,y:u.y+(u.edge.to.y-u.y)*u.edge.progress}:u;
      const pos=project(p.x,p.y),node=actors[i];node.setAttribute('transform',`translate(${pos})`);node.querySelector('use').setAttribute('href',`#${u.load?'loaded':'living'}-${u.model}-${u.heading}`);
      node.querySelector('.selected-halo').setAttribute('opacity',i===selected?'.85':'0');
      node.querySelector('.unit-warning').textContent=u.fault?'!':u.service?'⚒':u.mode==='manual'?'YOU':'';
      node.setAttribute('aria-label',`Unit ${i+1}, ${u.model}, ${u.reason}`);layers.push({depth:p.x+p.y+.65,node});
    });
    layers.sort((a,b)=>a.depth-b.depth);layers.forEach((layer,i)=>{if(depth.children[i]!==layer.node)depth.insertBefore(layer.node,depth.children[i]||null);});
    root.querySelector('.warehouse-crew').innerHTML=s.mechanics.map((m,i)=>{const event=s.events.find(e=>e.id===m.event),unit=s.units.find(u=>u.id===event?.unit),pos=unit?project(unit.x-.5+(i%2)*.8,unit.y+.8):project(.25,5+i*.6);return `<g transform="translate(${pos})"><circle cy="-11" r="4" fill="${m.travel?'#d6b25f':m.event?'#e4bb6d':'#547d8b'}"/><path d="M0 -6V5M-5 0H5M0 4L-4 11M0 4L4 11" stroke="#335a4b" stroke-width="3"/><title>${m.id}: ${m.travel?'Paid travel':m.event?'Assigned '+m.event:'Available'}</title></g>`;}).join('');
  }
  svg.addEventListener('click',e=>{const actor=e.target.closest('[data-unit]');if(actor)onUnit?.(Number(actor.dataset.unit));});
  root.addEventListener('click',e=>{if(e.target.closest('[data-enter-warehouse]'))onEnter?.();const pin=e.target.closest('[data-site-inspect]');if(pin)onInspect?.(pin.dataset.siteInspect);});
  setView('overview');
  return {render,setView,get metrics(){return {actors:actors.length,camera:view,zoom};}};
}
