/* Scene 03: one finite material batch, supported contacts and constituent identity.
   Machinery is a schematic adaptation of rail-cage sterilization, cage tipping,
   rotary stripping, screw pressing, gravity clarification and pumped storage.
   Graphic capacities are normalized for this diagram, not plant yield data. */
(function initScene03Animation() {
  'use strict';
  const stageSvg = document.getElementById('scene-03-svg');
  if (!stageSvg) return;
  const inspectBtn = document.getElementById('scene-03-inspect-btn');
  const evidencePanel = document.getElementById('scene-03-evidence-panel');
  const processBtn = document.getElementById('scene-03-process-btn');
  const processPanel = document.getElementById('scene-03-process-panel');
  const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let isReducedMotion = reduceMotionQuery.matches;
  let currentTime = 0, isPlaying = false, lastTimestamp = null, rafId = null, resumeAfterHidden = false;
  const svgNS = 'http://www.w3.org/2000/svg';
  const G = 300, R = 13.65, N = 6, LEAVES = 8, COUNT = N * LEAVES;
  const OIL_SHARE = 0.65; // Schematic phase proportions; no production quantity is implied.
  const ENTRY_HOLD = 0.8; // Allow layer crossfade to settle before mechanical motion
  const clamp = (v,a,b) => Math.max(a,Math.min(b,v));
  const mix = (a,b,u) => a+(b-a)*u;
  const smoothstep = (a,b,t) => { const u=clamp((t-a)/(b-a),0,1); return u*u*(3-2*u); };
  const ramp = (t,a,d) => clamp((t-a)/d,0,1);
  const angle = d => d*Math.PI/180;
  function rotate(p,origin,degrees) { const c=Math.cos(angle(degrees)),s=Math.sin(angle(degrees)),x=p.x-origin.x,y=p.y-origin.y; return {x:origin.x+c*x-s*y,y:origin.y+s*x+c*y}; }
  function blend(a,b,u) { return {x:mix(a.x,b.x,u),y:mix(a.y,b.y,u),ang:mix(a.ang||0,b.ang||0,u)}; }
  function attr(el,name,value) { value=String(value); if(el.getAttribute(name)!==value)el.setAttribute(name,value); }
  function motionAttribute(el,name,value) { if(el)attr(el,name,value); }
  function node(tag,attrs={},parent=stageSvg) { const el=document.createElementNS(svgNS,tag);Object.entries(attrs).forEach(([k,v])=>el.setAttribute(k,String(v)));parent.appendChild(el);return el; }
  const defs=node('defs',{id:'physical-defs'});
  const fruitGradient=stageSvg.querySelector('#fruit-bunch-cluster').cloneNode(true);fruitGradient.id='physical-fruit-gradient';defs.appendChild(fruitGradient);
  const fruitStops=[...fruitGradient.querySelectorAll('stop')].map(el=>({el,color:el.getAttribute('stop-color')}));
  const geometry=node('g',{id:'physical-geometry','pointer-events':'none'});
  const material=node('g',{id:'physical-material','pointer-events':'none'});
  const lastText=stageSvg.querySelector('#layer-text-zones');
  if(lastText){stageSvg.insertBefore(geometry,lastText);stageSvg.insertBefore(material,lastText);}
  function hide(el) { if(el)el.style.display='none'; }
  stageSvg.querySelectorAll('[data-physical-legacy],.ffb-bunch').forEach(hide);
  ['anim-s01-cart-discharge','anim-s01-incline-flights','anim-s01-incline-fruit','anim-s01-bridge-fruit','anim-s02-cages','anim-s03-tumbling-fruit','anim-s03-efb-stream','anim-s03-efb-pile','s03-efb-chute-assembly','anim-s03-bridge-stream','anim-s03-descent-stream','anim-s03-ramp-stream','anim-conveyor-return-stream','anim-s04-feed-descent','anim-s04-feed-chute','anim-s04-conduit-stream','anim-s04-cpo-stream','s04-cake-discharge','anim-s04-fiber-stream','anim-s04-fiber-pile','anim-s05-oil-layer','anim-s05-sludge-stream','anim-s05-sludge-pile','anim-s05-pipe-stream','anim-s06-oil-pool'].forEach(id=>hide(document.getElementById(id)));
  stageSvg.querySelectorAll('path[d="M 627 818 L 627 752 Q 627 742 637 742 L 644 742"]').forEach(hide);
  stageSvg.querySelectorAll('#anim-s04-screw-flights path[fill="url(#press-pulp-glow)"],#anim-s04-screw-flights circle').forEach(hide);

  const s06Arrow = stageSvg.querySelector('#s06-outflow-arrow');
  const outflowEl = document.getElementById('anim-s06-outflow-stream');
  if (s06Arrow && outflowEl && s06Arrow.parentNode) {
    s06Arrow.parentNode.insertBefore(s06Arrow, outflowEl);
    hide(s06Arrow.querySelector('line'));
    const outflowPoly = s06Arrow.querySelector('polygon');
    if (outflowPoly) {
      attr(outflowPoly, 'fill', '#101823');
      attr(outflowPoly, 'stroke', '#b87920');
      attr(outflowPoly, 'stroke-width', '1.4');
    }
  }
  // The scaffold's fixed fruit symbols were illustrations, not this batch.
  // Preserve inspection bolts and remove only the documented fruit glyphs.
  const oldFruitPoints=new Set(['1636,568','1628,574','1620,576','1612,578','1602,578','1592,578','1582,578','1572,578','1562,578','368,582','371.5,588','364,599','370,604','376,614','382.5,624','389,634','396,644','402.5,654','409,664','416,674','422.5,684','427,691','432,697','436,705','440,713']);
  stageSvg.querySelectorAll('circle').forEach(el=>{const x=Number(el.getAttribute('cx')),y=Number(el.getAttribute('cy')),point=`${x},${y}`,fill=el.getAttribute('fill'),fruitOnBelt=y===581&&x>=360&&x<=1550&&['#995500','#884400'].includes(fill);if(oldFruitPoints.has(point)&&fill==='#ff8800'||fruitOnBelt){attr(el,'data-physical-legacy-material','true');hide(el);}});
  // One variable-pitch helical flight, projected about the unchanged shaft.
  // Each model point keeps its axial x; only its radial angle rotates. Near
  // and far portions meet at the same points and are occluded by the shaft.
  const screwGroup=document.getElementById('anim-s04-screw-flights');
  const screwShaft=screwGroup.querySelector('polygon[fill="url(#s04-shaft-metal)"]');
  screwGroup.querySelectorAll('path').forEach(el=>{if(['#a87434','#ffbb33','#fff0aa'].includes(el.getAttribute('stroke')))hide(el);});
  const screwRear=node('g',{id:'physical-screw-rear'},screwGroup);
  screwGroup.insertBefore(screwRear,screwShaft);
  const screwFront=node('g',{id:'physical-screw-front'},screwGroup);
  const screwRearWeb=node('path',{fill:'#8e6331',opacity:.2},screwRear);
  const screwFrontWeb=node('path',{fill:'#d99e44',opacity:.22},screwFront);
  const screwRearRim=node('path',{fill:'#77532c',stroke:'#aa7739','stroke-width':.5},screwRear);
  const screwFrontRim=node('path',{fill:'url(#s04-flight-grad)',stroke:'#ffbb33','stroke-width':.7},screwFront);
  const screwRearRoot=node('path',{fill:'none',stroke:'#875f32','stroke-width':.7},screwRear);
  const screwFrontRoot=node('path',{fill:'none',stroke:'#d69a46','stroke-width':.8},screwFront);
  const screwHighlight=node('path',{fill:'none',stroke:'#fff0aa','stroke-width':.8},screwFront);
  const screwWitness=node('path',{id:'physical-screw-witness',fill:'none',stroke:'#fff6ca','stroke-width':1.3},screwFront);
  const screwStations=[472,486,500,513,526,538,550,561,572,582,592,601,610,618,626,633];
  const screwSamples=[];
  for(let i=0;i<screwStations.length-1;i++)for(let j=0;j<32;j++)screwSamples.push({x:mix(screwStations[i],screwStations[i+1],j/32),theta:(i+j/32)*Math.PI});
  screwSamples.push({x:633,theta:15*Math.PI});
  function screwPoint(p,phase){const a=p.theta-phase;return {...p,y:742-24*Math.cos(a),root:742-(7+(p.x-460)*4/174)*Math.cos(a),near:Math.sin(a)>=0};}
  function screwCoords(points,root=false,offset=0){return points.map(p=>`${(p.x+offset).toFixed(3)},${(root?p.root:p.y).toFixed(3)}`).join(' L ');}
  let lastScrewPhase;
  function renderScrew(phase){
    if(phase===lastScrewPhase)return;
    lastScrewPhase=phase;
    const paths={front:[],rear:[],rootFront:[],rootRear:[],webFront:[],webRear:[],shine:[]};
    let run=[],near;
    function flush(){
      if(run.length<2)return;
      const reverse=[...run].reverse();
      paths[near?'front':'rear'].push('M '+screwCoords(run)+' L '+screwCoords(reverse,false,4.2)+' Z');
      paths[near?'rootFront':'rootRear'].push('M '+screwCoords(run,true));
      paths[near?'webFront':'webRear'].push('M '+screwCoords(run)+' L '+screwCoords(reverse,true)+' Z');
      if(near)paths.shine.push('M '+screwCoords(run,false,1.1));
    }
    for(const model of screwSamples){
      const p=screwPoint(model,phase);
      if(near===undefined)near=p.near;
      if(p.near!==near){
        const a=run.at(-1),theta=Math.ceil((a.theta-phase)/Math.PI)*Math.PI+phase;
        const cross=screwPoint({x:mix(a.x,p.x,(theta-a.theta)/(p.theta-a.theta)),theta},phase);
        run.push(cross);flush();run=[cross];near=p.near;
      }
      run.push(p);
    }
    flush();
    for(const [el,segments] of [[screwFrontRim,paths.front],[screwRearRim,paths.rear],[screwFrontRoot,paths.rootFront],[screwRearRoot,paths.rootRear],[screwFrontWeb,paths.webFront],[screwRearWeb,paths.webRear],[screwHighlight,paths.shine]])attr(el,'d',segments.join(' '));
    // A small weld mark revolves with the rim at a fixed axial station.
    const x=548,i=screwStations.findIndex((s,j)=>j+1<screwStations.length&&x>=s&&x<=screwStations[j+1]);
    const p=screwPoint({x,theta:(i+(x-screwStations[i])/(screwStations[i+1]-screwStations[i]))*Math.PI},phase);
    const side=p.near?screwFront:screwRear;if(screwWitness.parentNode!==side)side.appendChild(screwWitness);
    attr(screwWitness,'stroke',p.near?'#fff6ca':'#b9894e');
    attr(screwWitness,'d',`M ${(p.x+1.1).toFixed(3)} ${p.y.toFixed(3)} H ${(p.x+3.1).toFixed(3)}`);
  }
  // Sampling existing SVG paths once avoids hot-loop DOM geometry queries.
  function path(d) {
    const el=node('path',{d,fill:'none',stroke:'none'},defs),length=el.getTotalLength(),points=[];
    for(let i=0;i<=Math.ceil(length);i++){const p=el.getPointAtLength(Math.min(i,length));points.push({x:p.x,y:p.y});}
    function at(s){s=clamp(s,0,length);const i=Math.min(points.length-2,Math.floor(s)),span=Math.min(1,length-i),f=span?(s-i)/span:0;const a=points[i],b=points[i+1];return {x:mix(a.x,b.x,f),y:mix(a.y,b.y,f)};}
    function pose(s,r=0){const p=at(s),a=at(Math.max(0,s-.6)),b=at(Math.min(length,s+.6)),dx=b.x-a.x,dy=b.y-a.y,l=Math.hypot(dx,dy)||1;let nx=dy/l,ny=-dx/l;if(ny>0){nx=-nx;ny=-ny;}let pitch=Math.atan2(dy,dx)*180/Math.PI;if(pitch>90)pitch-=180;if(pitch<-90)pitch+=180;return {x:p.x+nx*r,y:p.y+ny*r,ang:pitch,support:{x:p.x,y:p.y,nx,ny,r}};}
    return {d,length,at,pose};
  }
  function traverse(route,elapsed,speed,r=0){return route.pose(clamp(elapsed*speed,0,route.length),r);}
  function pipe(route,width=8,parent=geometry){node('path',{d:route.d,fill:'none',stroke:'#070a10','stroke-width':width+3,'stroke-linecap':'round','stroke-linejoin':'round'},parent);node('path',{d:route.d,fill:'none',stroke:'#b87920','stroke-width':width,'stroke-linecap':'round','stroke-linejoin':'round'},parent);node('path',{d:route.d,fill:'none',stroke:'#101823','stroke-width':width-2,'stroke-linecap':'round','stroke-linejoin':'round'},parent);}
  function pan(route,depth=10,parent=geometry){const top=[],bottom=[];for(let s=0;s<=route.length;s+=5){const p=route.at(s);top.push(`${p.x},${p.y}`);bottom.push(`${p.x},${p.y+depth}`);}const p=route.at(route.length);top.push(`${p.x},${p.y}`);bottom.push(`${p.x},${p.y+depth}`);node('polygon',{points:top.concat(bottom.reverse()).join(' '),fill:'#131c28',stroke:'#bb7e25','stroke-width':1.5},parent);node('path',{d:route.d,fill:'none',stroke:'#ffbc50','stroke-width':1.5},parent);}
  function clip(id,shape){const c=node('clipPath',{id,clipPathUnits:'userSpaceOnUse'},defs);node(shape.tag,shape.attrs,c);return `url(#${id})`;}
  const vesselClip=clip('physical-clarifier-clip',{tag:'polygon',attrs:{points:'1026,654 1193,654 1193,786 1113,846 1107,846 1026,786'}});
  const tankClip=clip('physical-storage-clip',{tag:'rect',attrs:{x:1371,y:746,width:156,height:82}});
  const sludgeClip=clip('physical-sludge-clip',{tag:'rect',attrs:{x:1073,y:895,width:74,height:29}});
  const pressClip=clip('physical-press-clip',{tag:'rect',attrs:{x:451,y:716,width:181,height:51}});
  const drumClip=clip('physical-drum-clip',{tag:'path',attrs:{d:'M 1338 260 H 1432 V 350 H 1430 V 364 H 1395 V 350 H 1338 Z'}});
  // A gate/apron meets the receiver; all support surfaces are continuous.
  const hinge={x:426,y:322},gateHinge={x:425,y:324};
  const floorStart=rotate({x:314,y:324},hinge,22),floorEnd=rotate(gateHinge,hinge,22);
  const gateEnd=rotate(rotate({x:428,y:278},gateHinge,110),hinge,22);
  const slideSupport=path(`M ${floorStart.x} ${floorStart.y} L ${floorEnd.x-5} ${floorEnd.y-2} Q ${floorEnd.x} ${floorEnd.y} ${floorEnd.x+5} ${floorEnd.y+5} L ${gateEnd.x} ${gateEnd.y} C 469 367 489 368 512 368`);
  const belt=path('M 512 368 L 521 368 Q 530 368 537 364 L 682 292 Q 690 288 698 288 L 744 288');
  node('path',{d:`M ${gateEnd.x} ${gateEnd.y} C 469 367 489 368 512 368`,fill:'none',stroke:'#ffb445','stroke-width':2.2});
  pan(belt,12);
  node('path',{d:'M 530 380 L 681 304 L 744 304',fill:'none',stroke:'#91561c','stroke-width':1,'stroke-dasharray':'4 4'},geometry);
  for(const [x,y] of [[562,357],[650,318]]){node('path',{d:`M ${x} ${y} V 390 M ${x-7} 390 H ${x+7}`,fill:'none',stroke:'#c88b31','stroke-width':2},geometry);}
  const intakeFlights=Array.from({length:N},(_,i)=>node('line',{id:`physical-intake-flight-${i}`,stroke:'#ffd064','stroke-width':2},geometry));
  const hopper=document.getElementById('anim-s01-cart-hopper');
  hopper.querySelectorAll('path[d="M 428,278 Q 446,288 452,306 L 446,314 Q 440,300 425,324 Z"],path[d="M 430,281 Q 444,290 449,306"]').forEach(hide);
  // Open the end wall and let the real hinged apron carry the load.
  const cartOpening=node('path',{d:'M 416 281 L 429 278 L 428 323 L 416 323 Z',fill:'#07090d',stroke:'#c88a2d','stroke-width':1},hopper);
  const cartGate=node('g',{id:'physical-cart-gate'},hopper);
  node('path',{d:'M 425 324 L 428 278',fill:'none',stroke:'#ffbb44','stroke-width':3},cartGate);
  node('path',{d:'M 421 323 L 424 280',fill:'none',stroke:'#785129','stroke-width':1},cartGate);
  // Working rail basket, docking rails and a supported tipping cradle.
  const cage=node('g',{id:'physical-rail-basket'},geometry);
  node('rect',{x:0,y:302,width:174,height:36,rx:2,fill:'rgba(212,132,30,.08)',stroke:'#d9942c','stroke-width':1.8},cage);
  node('line',{x1:0,y1:334,x2:174,y2:334,stroke:'#ffc65b','stroke-width':1.8},cage);
  for(let x=12;x<174;x+=14)node('line',{x1:x,y1:306,x2:x,y2:334,stroke:'#936428','stroke-width':.8},cage);
  for(const x of [15,157]){node('line',{x1:x,y1:338,x2:x,y2:341,stroke:'#eaa23d','stroke-width':2},cage);node('circle',{cx:x,cy:341,r:4,fill:'#101a27',stroke:'#e2a041','stroke-width':1.2},cage);}
  const cageGate=node('line',{x1:174,y1:302,x2:174,y2:336,stroke:'#ffd16a','stroke-width':2.5},cage);
  node('path',{d:'M 704 345 H 1302 M 704 351 H 1302',fill:'none',stroke:'#bd8028','stroke-width':1.5},geometry);
  node('path',{d:'M 1115 350 H 1303 V 365 H 1115 Z M 1140 351 L 1166 365 L 1191 351 L 1216 365 L 1242 351 L 1268 365 L 1292 351',fill:'#101926',stroke:'#9f691f','stroke-width':1},geometry);
  node('path',{d:'M 1252 365 L 1298 336 L 1298 377 M 1285 377 H 1310',fill:'none',stroke:'#d18b27','stroke-width':2},geometry);
  node('circle',{cx:1298,cy:336,r:5,fill:'#172332',stroke:'#ffc24c','stroke-width':1.6},geometry);
  const tipCylinder=node('line',{x1:1170,y1:369,x2:1160,y2:334,stroke:'#aabacb','stroke-width':3},geometry);
  const receivingPan=path('M 1298 336 H 1358');pan(receivingPan,9);
  const meter=node('line',{x1:1319,y1:311,x2:1319,y2:337,stroke:'#ffca59','stroke-width':2.4},geometry);
  node('path',{d:'M 1320 282 H 1328 V 304 H 1320 Z M 1324 304 V 310',fill:'#172231',stroke:'#b58235','stroke-width':1.1},geometry);
  const doorIn=document.getElementById('anim-s02-door-in'),doorOut=document.getElementById('anim-s02-door-out');
  for(const [door,x] of [[doorIn,750],[doorOut,1085]]){const port=node('g',{},door.parentNode);node('rect',{x,y:258,width:39,height:89,rx:7,fill:'#05070b',stroke:'#b28137','stroke-width':1.5},port);door.parentNode.insertBefore(port,door);}
  const steamVent=node('g',{id:'physical-steam-vent',fill:'none',stroke:'#b8ceda','stroke-width':1.2,'stroke-linecap':'round'},geometry);
  for(const dx of [-4,0,4])node('path',{d:`M ${968+dx} 222 Q ${961+dx} 211 ${968+dx} 202 T ${971+dx} 184`},steamVent);
  // An enlarged inspection opening keeps the complete lifted bunch visible.
  const front=document.querySelector('#s03-thresher-front-casing > path');
  if(front)attr(front,'d','M 1324 246 L 1438 246 L 1462 274 L 1462 358 L 1438 366 L 1324 366 L 1306 358 L 1306 274 Z M 1350 260 H 1420 Q 1432 260 1432 272 V 338 Q 1432 350 1420 350 H 1350 Q 1338 350 1338 338 V 272 Q 1338 260 1350 260 Z');
  node('path',{d:'M 1298 307 H 1348 V 342 H 1298 Z',fill:'#070b12',stroke:'#c9953a','stroke-width':1.5},geometry);
  node('path',{d:'M 1338 336 H 1358 M 1367 340 H 1430 M 1380 344 V 364 H 1367 V 344',fill:'none',stroke:'#cb9130','stroke-width':1.2},geometry);
  const collector=path('M 1370 363 H 1657');pan(collector,9);
  const roller=(x,y)=>{const g=node('g',{},geometry);node('circle',{cx:x,cy:y,r:4,fill:'#0d1520',stroke:'#e3a748','stroke-width':1},g);node('path',{d:`M ${x-3} ${y} H ${x+3} M ${x} ${y-3} V ${y+3}`,fill:'none',stroke:'#d69b39','stroke-width':.8},g);return {g,x,y};};
  const collectorRollers=[roller(1370,367),roller(1657,367)],returnRollers=[roller(1652,582.6),roller(365,586.5)];
  stageSvg.querySelectorAll('circle[cx="365"][cy="581"]').forEach(el=>attr(el,'cy','586.5'));
  function rawFlightNodes(stroke='#d99b38',width=1){return Array.from({length:N},()=>node('line',{stroke,'stroke-width':width},geometry));}
  const collectorFlights=rawFlightNodes('#ffc65b',1.8),returnFlights=rawFlightNodes('#e5a53e',1.4);
  node('path',{d:'M 1633 351 H 1660 V 368 H 1633',fill:'#070b12',stroke:'#cf9131','stroke-width':1.3},geometry);
  const descent=path('M 1657 363 V 548');
  const returnRoute=path('M 1657 545.6 Q 1648 573.6 1610 575.6 L 1560 578.6 L 365 578.6');
  const efbTail='L 1310 370 L 1310 385 Q 1310 397 1325 405 L 1376 410 Q 1388.244 410 1390 420';
  const guideStart=path('M 1408 340 C 1398 340 1382 344 1366 350 '+efbTail);pan(guideStart,8);
  node('path',{d:'M 1370 448 L 1450 448 L 1467 503 H 1354 Z',fill:'#0d141e',stroke:'#996a33','stroke-width':1.3},geometry);
  const efbLabel=stageSvg.querySelector('text[x="1410"][y="495"]');if(efbLabel){attr(efbLabel,'y','519');efbLabel.textContent='EMPTY FRUIT BUNCHES (EFB)';}hide(stageSvg.querySelector('text[x="1410"][y="510"]'));
  const transferChute=path('M 354 603 Q 365 610 373 616 L 450 686');pan(transferChute,8);
  const transferCentre=path('M 354 600.6 Q 365 607.6 373 613.6 L 450 683.6'),headWallX=358.2;
  const headCatchS=solve(s=>transferCentre.at(s).x-headWallX,0,transferCentre.length),headCatch=transferCentre.at(headCatchS),chuteDuration=slideTime(transferCentre.length-headCatchS,180,210);
  node('rect',{x:438,y:684,width:25,height:8,fill:'#060a10',stroke:'#b68332','stroke-width':1},geometry);
  const mixer=node('g',{id:'physical-digestion-rotor'},geometry);
  node('circle',{cx:450,cy:704,r:8.5,fill:'none',stroke:'#bb8a38','stroke-width':.8},mixer);
  node('path',{d:'M 443 704 H 457 M 450 697 V 711',fill:'none',stroke:'#ffd46e','stroke-width':1.8},mixer);
  node('rect',{x:444,y:713,width:14,height:10,fill:'#080c13',stroke:'#c99a43','stroke-width':1.1},geometry);
  const digestGate=node('line',{x1:444,y1:718,x2:458,y2:718,stroke:'#ffc14e','stroke-width':2},geometry);
  const pressFeed=path('M 450 718 V 744 Q 450 758 456 758');pipe(pressFeed,8);
  node('rect',{x:444,y:737,width:15,height:10,fill:'#090f18',stroke:'#d19330','stroke-width':1},geometry);
  for(const x of [586,591,596,601,606,611])node('rect',{x:x-2,y:761,width:4,height:8,fill:'#080c12',stroke:'#81572a','stroke-width':.5},geometry);
  const cakeRoute=path('M 633 758 V 792 L 650 808 Q 650 817 637 823 L 556 853 L 556 880');pipe(cakeRoute,6);
  node('path',{d:'M 548 850 H 564 V 866 L 605 883 V 895 H 507 V 883 L 548 866 Z',fill:'#0d151f',stroke:'#cc8d29','stroke-width':1.8},geometry);
  node('path',{d:'M 507 895 V 911 H 605 V 895',fill:'none',stroke:'#a5742e','stroke-width':1.3},geometry);
  node('path',{d:'M 620 730 L 632 736 L 632 748 L 620 754 Z',fill:'#172332',stroke:'#e5a43c','stroke-width':1.3},geometry);
  const gutter=path('M 590 796 L 610 804 L 600 818');
  node('path',{d:'M 463 779 H 617 L 610 808 H 480 Z',fill:'#101823',stroke:'#be862c','stroke-width':1.5},geometry);
  pan(gutter,4);
  const outflowDrops=Array.from({length:6},(_,i)=>node('circle',{cx:1554,cy:801,r:2.2,fill:'#d39b3c',stroke:'#ffea77','stroke-width':.7,opacity:0,'data-material-id':`cpo-outflow-drop-${i}`},material));
  const toPump=path('M 600 818 H 414 V 854 Q 414 863 414 867');pipe(toPump,7);
  const toClarifier=path('M 405 888 V 965 H 930 V 742 H 1044');pipe(toClarifier,8);
  node('rect',{x:927,y:923,width:6,height:3,fill:'#ffaa22'},geometry);
  const pumpBody=(x,y,id)=>{const g=node('g',{id},geometry);node('circle',{cx:x,cy:y,r:14,fill:'#101a28',stroke:'#dba03f','stroke-width':1.5},g);const rotor=node('path',{d:`M ${x-7} ${y} H ${x+7} M ${x} ${y-7} V ${y+7}`,fill:'none',stroke:'#ffce69','stroke-width':1.6},g);node('path',{d:`M ${x-12} ${y+12} L ${x-17} ${y+25} H ${x+17} L ${x+12} ${y+12}`,fill:'#111b28',stroke:'#946b32','stroke-width':1.2},g);return {g,rotor,x,y};};
  const liquorPump=pumpBody(405,874,'physical-liquor-pump');
  node('polygon',{points:'1174,776 1186,776 1186,788 1174,785',fill:'#182333',stroke:'#ffaa22','stroke-width':1.5},geometry);
  node('line',{x1:1174,y1:776,x2:1186,y2:776,stroke:'#ffe066','stroke-width':2,'stroke-linecap':'round'},geometry);
  node('rect',{x:1193,y:776,width:6,height:12,fill:'#182333',stroke:'#ff9900','stroke-width':1.4},geometry);
  const cpoDelivery=path('M 1180 782 H 1250 Q 1256 782 1256 788 V 794 Q 1256 800 1262 800 H 1371 Q 1378 800 1378 807 V 812');pipe(cpoDelivery,8);
  const sludgeOut=path('M 1110 846 V 865');pipe(sludgeOut,7);
  const sludgeValve=node('line',{x1:1104,y1:850,x2:1116,y2:850,stroke:'#e1ad4e','stroke-width':1.8},geometry);
  const tankText=stageSvg.querySelector('#stage-06-cpo-storage text');
  const storageMaterial=node('g',{id:'physical-storage-liquid','clip-path':tankClip,'pointer-events':'none'},tankText?.parentNode||material);
  if(tankText){tankText.parentNode.insertBefore(storageMaterial,tankText);tankText.style.fill='#fff0cc';const gauge=stageSvg.querySelector('#s06-level-gauge');if(gauge)tankText.parentNode.insertBefore(gauge,tankText);}
  const clarifiedMaterial=node('g',{id:'physical-clarifier-liquid','clip-path':vesselClip,'pointer-events':'none'},material);
  const sludgeMaterial=node('g',{id:'physical-sludge-liquid','clip-path':sludgeClip,'pointer-events':'none'},material);
  // These nodes are born once in the trolley. Their constituents separate only
  // through visible stripping, compression and gravity separation.
  const leafOffsets=[[-7,-6],[0,-9],[7,-6],[9,2],[5,8],[-2,9],[-9,4],[-3,0]];
  const stemPoints=[[-1,-11],[0,13],[-13,0],[13,0],[-10,-6],[10,-5],[-11,2],[10,5],[-8,10]];
  const bunches=[],cells=[];
  for(let i=0;i<N;i++){
    const stem=node('g',{'data-material-id':`bunch-${i}-rachis`},material);
    node('path',{d:'M -13 0 H 13 M -1 -11 L 0 13 M -1 -8 L -10 -6 M 0 -5 L 10 -5 M 0 -1 L -11 2 M 0 2 L 10 5 M 0 6 L -8 10',fill:'none',stroke:'#8d5729','stroke-width':1.3,'stroke-linecap':'round'},stem);
    node('path',{d:'M 0 -9 L 1 12 M 0 -4 L 8 -3 M 0 4 L -7 7',fill:'none',stroke:'#b87938','stroke-width':.65},stem);
    bunches.push({stem});
    for(let j=0;j<LEAVES;j++){
      const id=i*LEAVES+j,[ox,oy]=leafOffsets[j],body=node('ellipse',{'data-material-id':`b${i}-f${j}-oil`,cx:0,cy:0,rx:3.2,ry:2.4,fill:'url(#fruit-bunch-cluster)',stroke:'#562000','stroke-width':.55},material);
      const aqueous=node('ellipse',{'data-material-id':`b${i}-f${j}-aqueous`,cx:0,cy:0,rx:1.1,ry:.7,fill:'#d3913e'},material);
      const core=node('g',{'data-material-id':`b${i}-f${j}-cake`},material);
      node('ellipse',{cx:0,cy:0,rx:.85,ry:.65,fill:'#67351b',stroke:'#9b5c25','stroke-width':.35},core);
      const fibre=node('path',{d:'M -.7 -.5 Q 0 -1 .8 -.2 M -.6 .4 Q 0 .9 .8 .3',fill:'none',stroke:'#9f7239','stroke-width':.35},core);
      const fine=node('circle',{'data-material-id':`b${i}-f${j}-fines`,cx:0,cy:0,r:.55,fill:'#4b2817'},material);
      cells.push({id,bunch:i,j,ox,oy,body,aqueous,core,fibre,fine});
    }
  }
  function poseNode(el,p){attr(el,'transform',`translate(${p.x.toFixed(3)},${p.y.toFixed(3)}) rotate(${(p.ang||0).toFixed(3)})`);}
  let materialOrderDirty=true;
  function put(el,parent){if(el.parentNode!==parent){parent.appendChild(el);materialOrderDirty=true;}}
  function order(parent,sequence){let next=parent.firstElementChild;for(const el of sequence){if(el===next)next=next.nextElementSibling;else parent.insertBefore(el,next);}}
  function supported(route,s,r=R){return route.pose(s,r);}
  function slideDistance(t,a=160,v=130){t=Math.max(0,t);const tr=v/a;return t<tr?.5*a*t*t:.5*a*tr*tr+v*(t-tr);}
  function slideTime(d,a=160,v=130){return d<v*v/(2*a)?Math.sqrt(2*d/a):v/a+(d-v*v/(2*a))/v;}
  function solve(f,lo,hi){for(let k=0;k<40;k++){const m=(lo+hi)/2;if(f(m)>0)hi=m;else lo=m;}return (lo+hi)/2;}
  function supportedAtX(route,x){let lo=0,hi=route.length;for(let k=0;k<40;k++){const m=(lo+hi)/2;if(route.pose(m,R).x<x)lo=m;else hi=m;}return {s:(lo+hi)/2,...route.pose((lo+hi)/2,R)};}
  const origins=[{x:416,y:310.35},{x:416,y:285.05},{x:376,y:310.35},{x:376,y:285.05},{x:334,y:310.35},{x:334,y:285.05}];
  const raw=[];
  const beltDuration=belt.length/185;
  for(let i=0;i<N;i++){
    const origin=rotate(origins[i],hinge,22),landing=supportedAtX(slideSupport,origin.x),drop=Math.sqrt(Math.max(0,2*(landing.y-origin.y)/G)),slide=slideTime(slideSupport.length-landing.s);
    const release=1.1+i*.5,slideStart=release+drop,beltStart=slideStart+slide,flightStart=beltStart+beltDuration;
    const flightDuration=Math.sqrt(2*(334-288)/G),arrival=flightStart+flightDuration;
    raw.push({i,origin,landing,release,slideStart,beltStart,flightStart,flightDuration,arrival});
  }
  const basketImpactX=744+185*raw[0].flightDuration,basketStartX=basketImpactX-154;
  const loadedAt=Math.max(...raw.map(r=>r.arrival))+.12,sealAt=loadedAt,sealEnd=sealAt+.55,cookStart=sealEnd+.1,cookEnd=cookStart+2.0,ventEnd=cookEnd+.65,doorOpenEnd=ventEnd+.6;
  const basketDockX=1298-174,extractStart=doorOpenEnd+.1,extractEnd=extractStart+1.75,tiltStart=extractEnd+.2,tiltEnd=tiltStart+.7;
  const omega=1.8,liftPeriod=Math.PI/3/omega,firstRelease=tiltEnd+.15,panTravel=.48;
  const entryPoint={x:1358,y:336-R},drumCentre={x:1384,y:308},drumRadius=Math.hypot(entryPoint.x-1384,entryPoint.y-308),entryAngle=Math.atan2(entryPoint.y-308,entryPoint.x-1384),liftDuration=(1.5*Math.PI-entryAngle)/omega;
  const releaseAngle=(1.5*Math.PI-entryAngle)*180/Math.PI;
  const freeDuration=solve(t=>308-drumRadius+.5*G*t*t+extent(releaseAngle+omega*t*180/Math.PI,0,1)-340,0,1);
  for(const r of raw){r.meter=firstRelease+r.i*liftPeriod;r.lift=r.meter+panTravel;r.air=r.lift+liftDuration;r.hit=r.air+freeDuration;r.impact={x:1384+drumRadius*omega*freeDuration,y:340-R,ang:0};r.strip=r.hit+.28;r.efb=r.strip+.26;}
  const rotorStart=raw[0].lift;
  const returnDuration=returnRoute.length/330;
  for(const c of cells){const r=raw[c.bunch];c.detach=r.strip+c.j*.027;c.detached={x:r.impact.x+c.ox,y:r.impact.y+c.oy,ang:0};c.slotX=[1399.5,1408.5,1417.5,1426.5].reduce((x,v)=>Math.abs(v-c.detached.x)<Math.abs(x-c.detached.x)?v:x);c.screenHit=c.detach+Math.sqrt(2*Math.max(0,340-2.4-c.detached.y)/G);c.screenExit=c.screenHit+.12;c.panStart=c.screenExit+Math.sqrt(2*(363-340)/G);c.bridgeStart=c.panStart+(1657-c.slotX)/240;c.towerTime=Math.sqrt(2*(548-363)/G);c.returnStart=c.bridgeStart+c.towerTime;c.headFlight=c.returnStart+returnDuration;c.headWall=c.headFlight+(365-headWallX)/330;c.chuteAt=c.headFlight+Math.sqrt(2*(headCatch.y-578.6)/G);c.hopperEntry=c.chuteAt+chuteDuration;c.hopperArrive=c.hopperEntry+Math.sqrt(2*(716-686)/G);}
  for(const r of raw){r.efb=Math.max(...cells.filter(c=>c.bunch===r.i).map(c=>c.screenExit))+.06;r.efbGuide=path(`M ${r.impact.x} 340 L 1408 340 C 1398 340 1382 344 1366 350 ${efbTail}`);r.efbDrop=r.efb+r.efbGuide.length/125;r.efbOrigin=r.efbGuide.pose(r.efbGuide.length,R);const a=r.efbGuide.pose(r.efbGuide.length-.6,R);r.efbVelocity={x:(r.efbOrigin.x-a.x)*125/.6,y:(r.efbOrigin.y-a.y)*125/.6};}
  const rotorEnd=Math.max(...raw.map(r=>r.efb));
  // Six empty rachises: gravity, receiving walls and earlier bunch contacts.
  // Precompute this small fixed batch so seeking has no simulation history.
  const efbStep=1/120,efbFrames=[],efbBodies=[],efbEnd=Math.max(...raw.map(r=>r.efbDrop))+12;
  for(let frame=0;frame<=Math.ceil(efbEnd/efbStep);frame++){
    const t=frame*efbStep;
    for(const r of raw){if(t<r.efbDrop)continue;let p=efbBodies[r.i],dt=efbStep;if(!p){p=efbBodies[r.i]={...r.efbOrigin,vx:r.efbVelocity.x,vy:r.efbVelocity.y,hasContact:false};dt=t-r.efbDrop;}p.contact=false;p.vy+=G*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;}
    for(let iteration=0;iteration<12;iteration++){
      for(let i=0;i<N;i++){const a=efbBodies[i];if(!a)continue;for(let j=0;j<i;j++){const b=efbBodies[j];if(!b)continue;const dx=a.x-b.x,dy=a.y-b.y,d=Math.hypot(dx,dy)||.001,overlap=2*R-d;if(overlap>0){a.contact=b.contact=true;const nx=dx/d,ny=dy/d;a.x+=nx*overlap*.505;a.y+=ny*overlap*.505;b.x-=nx*overlap*.505;b.y-=ny*overlap*.505;const v=(a.vx-b.vx)*nx+(a.vy-b.vy)*ny;if(v<0){const impulse=-v*.52;a.vx+=nx*impulse;a.vy+=ny*impulse;b.vx-=nx*impulse;b.vy-=ny*impulse;}}}}
      for(const p of efbBodies){if(!p)continue;if(p.y>503-R){p.contact=true;p.y=503-R;if(p.vy>0)p.vy*=-.05;p.vx*=Math.exp(-8*efbStep/12);}for(const [x,dx] of [[1450,17],[1370,-16]]){const u=clamp(((p.x-x)*dx+(p.y-448)*55)/(dx*dx+55*55),0,1),qx=x+u*dx,qy=448+u*55,vx=p.x-qx,vy=p.y-qy,d=Math.hypot(vx,vy);if(d<R&&d>0){p.contact=true;const nx=vx/d,ny=vy/d;p.x+=nx*(R-d);p.y+=ny*(R-d);const v=p.vx*nx+p.vy*ny;if(v<0){p.vx-=nx*v*1.08;p.vy-=ny*v*1.08;}}}}
    }
    for(const p of efbBodies){if(!p)continue;p.hasContact||=p.contact;p.vx*=Math.exp(-(p.contact?8:.2)*efbStep);if(p.contact)p.vy*=Math.exp(-8*efbStep);if(p.contact)p.ang+=p.vx/R*efbStep*180/Math.PI;}
    efbFrames.push(efbBodies.map(p=>p&&({...p})));
  }
  for(const r of raw){r.efbRest=efbEnd;for(let k=efbFrames.length-1;k>=0;k--){const p=efbFrames[k][r.i];if(p&&Math.hypot(p.vx,p.vy)>2){r.efbRest=Math.min(efbEnd,(k+1)*efbStep+.1);break;}}const last=efbFrames.at(-1)[r.i];if(last.x<1354||last.x>1467||last.y<420||last.y>504)throw new Error('EFB receiver does not contain bunch '+r.i);}
  function efbCaught(r,t){const k=Math.min(efbFrames.length-1,Math.floor(t/efbStep)),a=efbFrames[k][r.i]||r.efbOrigin,b=efbFrames[Math.min(k+1,efbFrames.length-1)][r.i]||a,start=Math.max(k*efbStep,r.efbDrop),u=clamp((t-start)/(efbStep*(k+1)-start),0,1),p=blend(a,b,u);return {...p,kind:t>=r.efbRest?'efb-stored':a.hasContact?'efb-settling':'efb-landing',container:'efb-bin'};}

  const hopperOrder=[...cells].sort((a,b)=>a.hopperEntry-b.hopperEntry);
  hopperOrder.forEach((c,j)=>c.hopperRank=j);
  function hopperTarget(c,removed=0){const rank=Math.max(0,c.hopperRank-removed),y=713.6-rank*.55,w=42-(y-690)*.46;return {x:clamp(438+(c.hopperRank%8)*4.2,450-w/2+3.2,450+w/2-3.2),y,ang:0};}
  // Fruit is caught by the actual earlier parcels at the entry column, then
  // rolls into the hopper's pile. It never falls through an occupied receiver.
  for(let j=0;j<COUNT;j++){
    const c=hopperOrder[j],floorFall=Math.sqrt(2*(716-686)/G);let previous=0;
    const contactY=t=>{let y=713.6;for(let k=0;k<j;k++){const a=hopperOrder[k];if(t<a.hopperArrive)continue;const p=blend(a.hopperContact,hopperTarget(a),smoothstep(a.hopperArrive,a.hopperArrive+.18,t)),dx=450-p.x;if(Math.abs(dx)<6.4)y=Math.min(y,p.y-4.8*Math.sqrt(1-dx*dx/(6.4*6.4)));}return y;};
    for(let tau=0;tau<=floorFall+.006;tau+=.004){const t=c.hopperEntry+tau,y=683.6+.5*G*tau*tau;if(y>=contactY(t)){const hit=solve(v=>683.6+.5*G*v*v-contactY(c.hopperEntry+v),previous,tau);c.hopperArrive=c.hopperEntry+hit;c.hopperContact={x:450,y:683.6+.5*G*hit*hit,ang:0};break;}previous=tau;}
    if(!c.hopperContact)throw new Error('No hopper catch for fruit '+c.id);
  }
  const hopperLoaded=Math.max(...cells.map(c=>c.hopperArrive)),mashReady=hopperLoaded+2.0,pressSpeed=88,pressDuration=(633-456)/pressSpeed;
  for(const c of cells){c.feed=mashReady+c.hopperRank*.032;c.press=c.feed+.10+pressFeed.length/120;c.expression=c.press+pressDuration*.77;c.coreOut=c.press+pressDuration;const p=pressPose(c,c.expression);c.expressionPos=p;c.oilPort={x:591+(c.id%4)*5,y:768};c.gutterContact={x:c.oilPort.x,y:796+(c.oilPort.x-590)*.4-2.4};c.gutterRoute=path(`M ${c.gutterContact.x} ${c.gutterContact.y} L 609 801.6 Q 609 806 604 810 L 600 818`);c.gutterHit=c.expression+.22+Math.sqrt(2*(c.gutterContact.y-768)/G);c.gutterEnd=c.gutterHit+c.gutterRoute.length/160;c.pumpArrival=c.gutterEnd+toPump.length/220;}
  const cakeOrder=[...cells].sort((a,b)=>a.coreOut-b.coreOut);
  // Press cake is a projected bulk pile. It drops vertically, catches the
  // growing heap, and compacts after contact rather than fanning out in air.
  cakeOrder.forEach((c,j)=>{c.cakeRank=j;c.cakeDrop=c.coreOut+cakeRoute.length/180;const surface=t=>893.8-.2*cakeOrder.slice(0,j).reduce((n,a)=>n+smoothstep(a.cakeHit,a.cakeHit+.18,t),0),tau=solve(v=>880+180*v+.5*G*v*v-surface(c.cakeDrop+v),0,.2);c.cakeHit=c.cakeDrop+tau;c.cakeContact={x:556,y:880+180*tau+.5*G*tau*tau};});
  const pumpOrder=[...cells].sort((a,b)=>a.pumpArrival-b.pumpArrival);pumpOrder.forEach((c,j)=>c.pumpRank=j);const pumpStart=pumpOrder[2].pumpArrival+.2;
  for(const c of cells){c.pumpRelease=Math.max(pumpStart+c.pumpRank*.04,c.pumpArrival+.1);c.liquorStart=c.pumpRelease+.16;c.liquorEntry=c.liquorStart+toClarifier.length/470;}
  const capacity=5190+167*84,unit=capacity/COUNT;
  function level(qty){const v=clamp(qty,0,COUNT)*unit;return v<=5190?846-(-6+Math.sqrt(36+4*(161/120)*v))/(2*161/120):786-(v-5190)/167;}
  function vesselWidth(y){return y<=786?167:6+(846-y)*161/60;}
  const liquorOrder=[...cells].sort((a,b)=>a.liquorEntry-b.liquorEntry);
  liquorOrder.forEach((c,j)=>c.liquorRank=j);
  function wetReceived(t,limit=COUNT){let n=0;for(let j=0;j<limit;j++){const c=liquorOrder[j];if(c.contact!==undefined)n+=smoothstep(c.contact,c.contact+.2,t);}return n;}
  function jet(c,t){const u=t-c.liquorEntry;if(u<.075)return {x:mix(1044,1062,clamp(u/.075,0,1)),y:742};const v=u-.075,y=742+.5*G*v*v;if(y<809)return {x:1062,y};const s=clamp((v-Math.sqrt(2*(809-742)/G))*120,0,61);return {x:1062+s*.79,y:809+s*.6};}
  // Find actual collision with the current liquid surface / conical floor.
  for(let j=0;j<COUNT;j++){
    const c=liquorOrder[j];let previous=0;
    const lastCatch=.075+Math.sqrt(2*(809-742)/G)+61/120+.05;
    for(let tau=0;tau<=lastCatch;tau+=.005){const t=c.liquorEntry+tau,p=jet(c,t),n=wetReceived(t,j),surface=level(n),inside=Math.abs(p.x-1110)<vesselWidth(p.y)/2+2;
      if((n>0&&p.y+2.4>=surface&&inside)||p.y+2.4>=846){const hit=solve(v=>{const pp=jet(c,c.liquorEntry+v),lv=level(wetReceived(c.liquorEntry+v,j));return Math.max(pp.y+2.4-lv,pp.y+2.4-846);},previous,tau);c.contact=c.liquorEntry+hit;c.contactPos=jet(c,c.contact);break;}previous=tau;}
    if(c.contact===undefined)throw new Error('No physical clarifier catch for parcel '+c.id);
  }
  const settledStart=Math.max(...cells.map(c=>c.contact))+.22,separationEnd=settledStart+2.5;
  const finesTargets=[];let count=0;
  for(const [row,slots] of [4,6,9,11,14,4].entries())for(let k=0;k<slots&&count<COUNT;k++)finesTargets[count++]={x:1110+(k-(slots-1)/2)*1.8,y:845.1-row*1.85};
  function band(a,b){const top=level(b),bottom=level(a),y=(top+bottom)/2;return {x:1110,y,rx:vesselWidth(y)*.9,ry:Math.max(.35,(bottom-top)*.85)};}
  function mixedBand(c,water,t){let prefix=0;for(let j=0;j<c.liquorRank;j++)prefix+=smoothstep(liquorOrder[j].contact,liquorOrder[j].contact+.2,t);const q=smoothstep(c.contact,c.contact+.2,t),split=1-OIL_SHARE;return water?band(prefix,prefix+split*q):band(prefix+split*q,prefix+q);}
  const oilTransferStart=separationEnd+.25,DRAW=.062,drawDuration=.22;
  function drawn(c,t){return smoothstep(c.draw,c.draw+drawDuration,t);}
  for(const c of cells){c.draw=oilTransferStart+(COUNT-1-c.liquorRank)*DRAW;c.tube=c.draw+drawDuration;}const oilEmpty=Math.max(...cells.map(c=>c.tube)),waterDrainStart=oilEmpty+.2;for(const c of cells){c.waterDraw=waterDrainStart+c.liquorRank*.05;c.waterTube=c.waterDraw+.22;}
  function remainingOil(t){return cells.reduce((n,c)=>n+1-drawn(c,t),0);}
  const cpoSpeed=cpoDelivery.length/1.205;
  for(const c of cells){c.tube=c.draw+drawDuration;c.tankEntry=c.tube+cpoDelivery.length/cpoSpeed;}
  function storedBefore(t,j){let n=0;for(let k=0;k<j;k++)n+=smoothstep(cells[k].tankHit,cells[k].tankHit+.22,t);return n;}
  for(const c of [...cells].reverse()){const fall=Math.sqrt(2*(828-812)/G);c.tankHit=c.tankEntry+fall;}

  for(const c of cells){c.sludgeHit=c.waterTube+sludgeOut.length/110+Math.sqrt(2*(924-865)/G);}

  // Receiver contacts use the existing liquid surface, including submerged inlets.
  const arrivalOrder=[...cells].sort((a,b)=>a.tankEntry-b.tankEntry);
  arrivalOrder.forEach((c,j)=>{c.storeRank=j;const before=t=>arrivalOrder.slice(0,j).reduce((n,a)=>n+smoothstep(a.tankHit,a.tankHit+.22,t),0);const surface=t=>828-64*before(t)/COUNT;const tau=surface(c.tankEntry)<=812+2.4?0:solve(v=>812+.5*G*v*v+2.4-surface(c.tankEntry+v),0,.5);c.tankHit=c.tankEntry+tau;c.tankContactPos={x:1378,y:812+.5*G*tau*tau};});
  liquorOrder.forEach((c,j)=>{const fallStart=c.waterTube+sludgeOut.length/110;const before=t=>liquorOrder.slice(0,j).reduce((n,a)=>n+smoothstep(a.sludgeHit,a.sludgeHit+.22,t),0);const tau=solve(v=>865+.5*G*v*v+2-(924-28*before(fallStart+v)/COUNT),0,1);c.sludgeHit=fallStart+tau;c.sludgeContactPos={x:1110,y:865+.5*G*tau*tau};});
  node('path',{d:'M 1395 342 H 1432 V 364 H 1395',fill:'#060a11',stroke:'#b67e2c','stroke-width':1.1},geometry);
  for(let x=1395;x<1432;x+=9)node('line',{x1:x,y1:338,x2:x,y2:342,stroke:'#d59b3a','stroke-width':1},geometry);
  for(const [x,y,w] of [[1643,376,29],[1643,527,29],[397,919,16],[922,919,16]])node('rect',{x,y,width:w,height:16,fill:'#06090f',stroke:'#76572c','stroke-width':1.2},geometry);
  const finish=Math.max(...cells.map(c=>Math.max(c.tankHit+.22,c.sludgeHit+.22)))+1.1;
  const TOTAL_DURATION=Math.ceil((finish+ENTRY_HOLD)*10)/10;
  const STAGES=[{index:1,name:'STAGE 01 // FFB INTAKE & CART',time:0},{index:2,name:'STAGE 02 // STERILIZATION',time:sealAt+ENTRY_HOLD},{index:3,name:'STAGE 03 // THRESHING & EFB SPLIT',time:raw[0].lift+ENTRY_HOLD},{index:4,name:'STAGE 04 // DIGESTION & PRESSING',time:Math.min(...cells.map(c=>c.hopperArrive))+ENTRY_HOLD},{index:5,name:'STAGE 05 // CLARIFICATION & SLUDGE',time:Math.min(...cells.map(c=>c.liquorEntry))+ENTRY_HOLD},{index:6,name:'STAGE 06 // CPO STORAGE',time:Math.min(...cells.map(c=>c.tankEntry))+ENTRY_HOLD}];
  const PITCH=27.3,slots=raw.map((_,i)=>154-i*PITCH);
  function extent(degrees,dx,dy){const c=Math.cos(angle(degrees)),s=Math.sin(angle(degrees));let v=-Infinity;for(const [x,y] of stemPoints)v=Math.max(v,dx*(c*x-s*y)+dy*(s*x+c*y)+.65);for(const [x,y] of leafOffsets){const cx=c*x-s*y,cy=s*x+c*y;v=Math.max(v,dx*cx+dy*cy+Math.hypot(3.2*(dx*c+dy*s),2.4*(-dx*s+dy*c)));}return v;}
  function basketAt(t){let x=basketStartX;for(let i=0;i<N-1;i++)x+=PITCH*smoothstep(raw[i].arrival+.08,raw[i+1].arrival-.06,t);const full=basketStartX+PITCH*(N-1);if(t>=extractStart)x=mix(full,basketDockX,smoothstep(extractStart,extractEnd,t));let tilt=55*smoothstep(tiltStart,tiltEnd,t);const returnAt=raw[N-1].lift+.1;if(t>returnAt){tilt*=1-smoothstep(returnAt,returnAt+.6,t);if(t>returnAt+.65)x=mix(basketDockX,full,smoothstep(returnAt+.65,returnAt+2.35,t));}return {x,tilt,pivot:{x:x+174,y:336},full,returnAt};}
  function holdPoint(b){const phi=angle(b.tilt),nx=Math.sin(phi),ny=-Math.cos(phi),p=rotate({x:b.x+174,y:334},b.pivot,b.tilt);if(Math.abs(nx)<.1)return {x:b.x+154,y:334-R,local:154};const x=1319-extent(b.tilt,1,0),y=p.y+(R-nx*(x-p.x))/ny;return {x,y,local:rotate({x,y},b.pivot,-b.tilt).x-b.x};}
  function bunchPose(i,t){const r=raw[i],tip=22*smoothstep(.25,.95,t),initial=rotate(origins[i],hinge,tip);
    if(t<r.release)return {...initial,ang:tip,kind:'trolley'};
    if(t<r.slideStart){const dt=t-r.release;return {x:r.origin.x,y:r.origin.y+.5*G*dt*dt,ang:22,kind:'fall-to-apron'};}
    if(t<r.beltStart){const s=r.landing.s+slideDistance(t-r.slideStart),p=slideSupport.pose(s,R),flat=smoothstep(slideSupport.length-4,slideSupport.length,s),surface=slideSupport.at(s);p.x=mix(p.x,surface.x,flat);p.y=mix(p.y,surface.y-R,flat);p.ang=mix(22,p.ang,smoothstep(r.slideStart,Math.min(r.slideStart+.1,r.beltStart),t))*(1-flat);return {...p,kind:'apron-contact'};}
    if(t<r.flightStart)return {...traverse(belt,t-r.beltStart,185,R),kind:'belt-contact'};
    if(t<r.arrival){const dt=t-r.flightStart;return {x:744+185*dt,y:288-R+.5*G*dt*dt,ang:0,kind:'basket-flight'};}
    const b=basketAt(t),hp=holdPoint(b);
    if(t<r.meter){let shift=(hp.local-154)*smoothstep(tiltStart,tiltEnd,t);for(let j=0;j<i;j++)shift+=PITCH*smoothstep(raw[j].meter,raw[j].meter+.4,t);const local=Math.min(hp.local,slots[i]+shift);const p=rotate({x:b.x+local,y:334-R},b.pivot,b.tilt);return {...p,ang:b.tilt,kind:'basket',container:'rail-basket'};}
    if(t<r.lift){const fullBasket={...b,x:basketDockX,tilt:55,pivot:{x:1298,y:336}},a=holdPoint(fullBasket),u=smoothstep(r.meter,r.lift,t),rot=55*(1-u),p=blend({...a,ang:55},entryPoint,u);const endY=336-extent(rot,0,1);p.y=mix(a.y,endY,smoothstep(r.meter,r.meter+.07,t));return {...p,ang:rot,kind:'metered-feed'};}
    if(t<r.air){const theta=entryAngle+omega*(t-r.lift);return {x:1384+drumRadius*Math.cos(theta),y:308+drumRadius*Math.sin(theta),ang:(theta-entryAngle)*180/Math.PI,kind:'rotor-lift'};}
    if(t<r.hit){const dt=t-r.air;return {x:1384+drumRadius*omega*dt,y:308-drumRadius+.5*G*dt*dt,ang:releaseAngle+omega*dt*180/Math.PI,kind:'rotor-fall'};}
    if(t<r.strip){const rot=(releaseAngle+omega*freeDuration*180/Math.PI)*(1-smoothstep(r.hit,r.strip,t));return {x:r.impact.x,y:340-extent(rot,0,1),ang:rot,kind:'screen-impact'};}
    if(t<r.efb)return {...r.impact,kind:'stripping'};
    const travel=(t-r.efb)*125;
    if(travel<r.efbGuide.length)return {...r.efbGuide.pose(travel,R),kind:'efb-chute'};
    return efbCaught(r,t);
  }
  function child(p,c){const v=rotate({x:p.x+c.ox,y:p.y+c.oy},{x:p.x,y:p.y},p.ang||0);return {...v,ang:p.ang||0};}
  function hopperSlot(c,t){let removed=0;for(const a of cells)if(a.hopperRank<c.hopperRank)removed+=smoothstep(a.feed,a.feed+.1,t);const p=hopperTarget(c,removed),w=42-(p.y-690)*.46,stir=smoothstep(hopperLoaded,hopperLoaded+.2,t)*(1-smoothstep(mashReady-.3,mashReady,t));return {x:clamp(p.x+Math.sin((t-hopperLoaded)*7+c.id)*1.1*stir,450-w/2+3.2,450+w/2-3.2),y:Math.min(713.6,p.y+Math.cos((t-hopperLoaded)*7+c.id)*.65*stir),ang:Math.sin(t*8+c.id)*12*stir};}
  function pressPose(c,t){const u=clamp((t-c.press)/pressDuration,0,1);return {x:456+177*u,y:758+Math.sin(u*Math.PI*5+c.id*.5)*4*smoothstep(0,.10,u)*(1-u),ang:Math.sin(u*8)*18,kind:'compression',compression:u};}
  function fruitPose(c,t){if(t<c.detach)return {...child(bunchPose(c.bunch,t),c),kind:'attached-fruit'};
    if(t<c.screenHit){const dt=t-c.detach;return {x:c.detached.x,y:c.detached.y+.5*G*dt*dt,ang:0,kind:'screen-impact-fruit'};}
    if(t<c.screenExit)return {x:mix(c.detached.x,c.slotX,smoothstep(c.screenHit,c.screenExit,t)),y:340-2.4,ang:0,kind:'screen-contact'};
    if(t<c.panStart){const dt=t-c.screenExit;return {x:c.slotX,y:340-2.4+.5*G*dt*dt,ang:0,kind:'screen-discharge'};}
    if(t<c.bridgeStart)return {x:c.slotX+(t-c.panStart)*240,y:363-2.4,ang:0,kind:'fruit-conveyor',support:{x:c.detached.x+(t-c.panStart)*240,y:363}};
    if(t<c.returnStart){const dt=t-c.bridgeStart;return {x:1657,y:363-2.4+.5*G*dt*dt,ang:0,kind:'gravity-shaft'};}
    if(t<c.headFlight)return {...traverse(returnRoute,t-c.returnStart,330),kind:'return-conveyor'};
    if(t<c.chuteAt){const dt=t-c.headFlight;return {x:Math.max(headWallX,365-330*dt),y:578.6+.5*G*dt*dt,ang:0,kind:t<c.headWall?'head-guide-flight':'head-guide-drop'};}
    if(t<c.hopperEntry){const p=transferCentre.pose(headCatchS+slideDistance(t-c.chuteAt,180,210));p.ang*=smoothstep(c.chuteAt,c.chuteAt+.1,t);p.ang*=1-smoothstep(c.hopperEntry-.08,c.hopperEntry,t);return {...p,kind:'gravity-feed-chute'};}
    if(t<c.hopperArrive){const dt=t-c.hopperEntry;return {x:450,y:686-2.4+.5*G*dt*dt,ang:0,kind:'hopper-drop'};}
    if(t<c.feed){const b=hopperSlot(c,t);return {...blend(c.hopperContact,b,smoothstep(c.hopperArrive,c.hopperArrive+.18,t)),kind:t<hopperLoaded?'hopper-contained':'digestion',container:'digestion-intake'};}
    if(t<c.press){const a=hopperSlot(c,c.feed),u=ramp(t,c.feed,.10);if(u<1)return {...blend(a,pressFeed.at(0),u),kind:'feed-gate'};return {...traverse(pressFeed,t-c.feed-.1,120),kind:'press-throat'};}
    const p=pressPose(c,t);return t<c.coreOut?p:{...p,kind:'constituents-separated'};
  }
  function corePose(c,t){if(t<c.coreOut)return fruitPose(c,t);const travel=(t-c.coreOut)*180;if(t<c.cakeDrop)return {...cakeRoute.at(travel),ang:pressPose(c,c.coreOut).ang*(1-smoothstep(c.coreOut,c.coreOut+.12,t)),kind:'cake-chute'};if(t<c.cakeHit){const dt=t-c.cakeDrop;return {x:556,y:880+180*dt+.5*G*dt*dt,ang:0,kind:'cake-landing'};}const target={x:556,y:893.8-Math.floor(c.cakeRank/12)*2.4,ang:0};return {...blend(c.cakeContact,target,smoothstep(c.cakeHit,c.cakeHit+.18,t)),kind:'cake-stored',container:'cake-bin'};}
  function pumpHeld(c,t){const target={x:405+Math.sin(c.id*1.7)*4,y:874+Math.cos(c.id*1.7)*4};return blend({x:414,y:867},target,smoothstep(c.pumpArrival,c.pumpArrival+.08,t));}
  function crudePose(c,t){if(t<c.expression)return fruitPose(c,t);
    if(t<c.expression+.22)return {...blend(c.expressionPos,c.oilPort,smoothstep(c.expression,c.expression+.22,t)),kind:'oil-expression'};
    if(t<c.gutterHit){const dt=t-c.expression-.22;return {x:c.oilPort.x,y:768+.5*G*dt*dt,kind:'liquor-drop'};}
    if(t<c.gutterEnd)return {...traverse(c.gutterRoute,t-c.gutterHit,160),kind:'gutter-contact'};
    if(t<c.pumpArrival)return {...traverse(toPump,t-c.gutterEnd,220),kind:'gravity-liquor-pipe'};
    if(t<c.pumpRelease)return {...pumpHeld(c,t),kind:'liquor-pump-held'};
    if(t<c.liquorStart)return {...blend(pumpHeld(c,c.pumpRelease),{x:405,y:888},smoothstep(c.pumpRelease,c.liquorStart,t)),kind:'liquor-pump'};
    if(t<c.liquorEntry)return {...traverse(toClarifier,t-c.liquorStart,470),kind:'pressurized-liquor'};
    if(t<c.contact)return {...jet(c,t),kind:'feedwell-contact'};
    return {...c.contactPos,kind:'liquor-caught'};
  }
  function totalStored(t){return cells.reduce((q,c)=>q+smoothstep(c.tankHit,c.tankHit+.22,t),0);}
  function remainingWater(t){return cells.reduce((q,c)=>q+1-smoothstep(c.waterDraw,c.waterDraw+.22,t),0);}
  function phaseBand(c,water,t){if(t<settledStart)return mixedBand(c,water,t);let before=0;for(let j=0;j<c.liquorRank;j++){const a=liquorOrder[j];before+=water?(1-OIL_SHARE)*(1-smoothstep(a.waterDraw,a.waterDraw+.22,t)):OIL_SHARE*(1-drawn(a,t));}if(!water)before+=(1-OIL_SHARE)*remainingWater(t);const q=water?(1-OIL_SHARE)*(1-smoothstep(c.waterDraw,c.waterDraw+.22,t)):OIL_SHARE*(1-drawn(c,t));const sorted=band(before,before+q),mixed=mixedBand(c,water,settledStart);const u=smoothstep(settledStart,separationEnd,t);return {...blend(mixed,sorted,u),rx:mix(mixed.rx,sorted.rx,u),ry:mix(mixed.ry,sorted.ry,u)};}
  function liquidPose(c,t,water=false){const basic=crudePose(c,t);if(t<c.contact){const digest=smoothstep(hopperLoaded,mashReady,t),compressed=smoothstep(c.press,c.expression,t),rx=t<c.expression?mix(3.2+digest*1.4,2.4,compressed):2.4,ry=t<c.expression?mix(2.4-digest*.8,2.4,compressed):2.4;return {...basic,rx:water?(t<c.expression?1.1:1.7):rx,ry:water?(t<c.expression?.7:1.7):ry,clip:null};}
    const q=smoothstep(c.contact,c.contact+.2,t),held=phaseBand(c,water,t);const p={...blend(c.contactPos,held,q),rx:mix(water?1.7:2.4,held.rx,q),ry:mix(water?1.7:2.4,held.ry,q),clip:vesselClip,kind:t<separationEnd?'clarifier-mixture':'clarified-phase'};
    const drawStart=water?c.waterDraw:c.draw;if(t<drawStart)return p;
    const drawnQ=smoothstep(drawStart,drawStart+.22,t);
    if(drawnQ<1){const target=water?{x:1110,y:846}:{x:1180,y:782};return {...blend(p,target,drawnQ),rx:mix(p.rx,water?2:2.4,drawnQ),ry:mix(p.ry,water?2:2.4,drawnQ),clip:vesselClip,kind:water?'sludge-withdrawal':'oil-skimming'};}
    if(water){const downStart=c.waterTube,downEnd=downStart+sludgeOut.length/110;if(t<downEnd)return {...traverse(sludgeOut,t-downStart,110),rx:2,ry:2,clip:null,kind:'sludge-drain'};if(t<c.sludgeHit){const dt=t-downEnd;return {x:1110,y:865+.5*G*dt*dt,rx:2,ry:2,clip:null,kind:'sludge-landing'};}let before=0;for(let j=0;j<c.liquorRank;j++)before+=smoothstep(liquorOrder[j].sludgeHit,liquorOrder[j].sludgeHit+.22,t);const merged=smoothstep(c.sludgeHit,c.sludgeHit+.22,t),target={x:1110,y:924-28*(before+merged*.5)/COUNT};return {...blend(c.sludgeContactPos,target,merged),rx:mix(2,66,merged),ry:mix(2,.52,merged),clip:sludgeClip,kind:'sludge-stored'};}
    if(t<c.tankEntry)return {...traverse(cpoDelivery,t-c.tube,cpoSpeed),rx:2.4,ry:2.4,clip:null,kind:'storage-inflow'};
    if(t<c.tankHit){const dt=t-c.tankEntry;return {x:1378,y:812+.5*G*dt*dt,rx:2.4,ry:2.4,clip:null,kind:'storage-landing'};}
    let before=0;for(const a of cells)if(a.storeRank<c.storeRank)before+=smoothstep(a.tankHit,a.tankHit+.22,t);const merged=smoothstep(c.tankHit,c.tankHit+.22,t),target={x:1449,y:828-64*(before+merged*.5)/COUNT},start=c.tankContactPos;return {...blend(start,target,merged),rx:mix(2.4,140,merged),ry:mix(2.4,1.0,merged),clip:tankClip,kind:'oil-stored'};
  }
  function fineEntry(c,t){const wet=liquidPose(c,t,true);if(t<c.contact)return {...wet,rx:.55,ry:.55};const spread=smoothstep(c.contact,c.contact+.2,t),room=Math.max(0,Math.min(50,vesselWidth(wet.y)/2-Math.abs(wet.x-1110)-1));return {...wet,x:wet.x+Math.sin(c.id*1.3)*room*spread,rx:.55,ry:.55};}
  function finePose(c,t){const wet=liquidPose(c,t,true);if(t<settledStart)return fineEntry(c,t);const target=finesTargets[c.liquorRank],start=fineEntry(c,settledStart),dy=Math.max(0,target.y-start.y),fallTime=.20+dy/72,u=smoothstep(settledStart,settledStart+fallTime,t),y=mix(start.y,target.y,u),width=vesselWidth(y),x=clamp(start.x,1110-width/2+1,1110+width/2-1);if(t<c.waterDraw)return {x,y,rx:.85,ry:.85,clip:vesselClip,kind:u<1?'gravity-settling':'sediment-contained'};
    const drain=smoothstep(c.waterDraw,c.waterTube,t);if(drain<1)return {...blend({x,y},{x:1110,y:846},drain),rx:.85,ry:.85,clip:vesselClip,kind:'sediment-drain'};
    if(t<c.sludgeHit)return {...wet,rx:.85,ry:.85,clip:null,kind:'sludge-carried'};const final={x:1078+(c.id%12)*5.7,y:924-.9-Math.floor(c.id/12)*1.8};return {...blend(c.sludgeContactPos,final,smoothstep(c.sludgeHit,c.sludgeHit+.22,t)),rx:.85,ry:.85,clip:sludgeClip,kind:'fines-stored'};
  }
  function color(a,b,u){const aa=a.match(/[0-9a-f]{2}/gi).map(v=>parseInt(v,16)),bb=b.match(/[0-9a-f]{2}/gi).map(v=>parseInt(v,16));return '#'+aa.map((v,i)=>Math.round(mix(v,bb[i],u)).toString(16).padStart(2,'0')).join('');}
  let lastPhysicalState=null;
  function paintLiquid(el,p,water,c,t){const container=p.clip===tankClip?storageMaterial:p.clip===vesselClip?clarifiedMaterial:p.clip===sludgeClip?sludgeMaterial:material;put(el,container);attr(el,'clip-path',p.clip||'none');attr(el,'cx',p.x.toFixed(3));attr(el,'cy',p.y.toFixed(3));attr(el,'rx',Math.max(.1,p.rx||2.4).toFixed(3));attr(el,'ry',Math.max(.1,p.ry||2.4).toFixed(3));attr(el,'transform',`rotate(${(p.ang||0).toFixed(2)},${p.x.toFixed(3)},${p.y.toFixed(3)})`);
    const separated=smoothstep(settledStart+1.75,separationEnd,t);
    const fill=t<c.expression?(water?'#d3913e':'url(#physical-fruit-gradient)'):(water?color('#bf7e25','#76501f',separated):color('#bf7e25','#d39b3c',separated));
    attr(el,'fill',fill);
    if(!water){
      const isLooseFruit=t>=c.detach&&t<c.hopperArrive;
      const isExpressing=p.kind==='oil-expression'||p.kind==='liquor-drop'||p.kind==='gutter-contact';
      const strokeColor=isExpressing?'#ffdd55':(isLooseFruit?'#ffaa33':'#ae6f2d');
      const strokeWidth=isExpressing?'1.2':(isLooseFruit?'0.9':'.55');
      attr(el,'stroke',t<c.contact?strokeColor:'none');
      attr(el,'stroke-width',strokeWidth);
    }
    attr(el,'data-material-state',p.kind);attr(el,'data-holder',p.container||p.kind);
  }
  function renderFrame(rawT){const t=Math.max(0,clamp(rawT,0,TOTAL_DURATION)-ENTRY_HOLD);const b=basketAt(t),tip=22*smoothstep(.25,.95,t),gate=110*smoothstep(.45,.95,t);attr(hopper,'transform',`rotate(${tip.toFixed(3)},426,322)`);attr(cartGate,'transform',`rotate(${gate.toFixed(3)},425,324)`);
    fruitStops.forEach(({el,color:rawColor})=>attr(el,'stop-color',color(rawColor,'#805018',smoothstep(cookStart,cookEnd,t)*.25)));
    attr(cage,'transform',`translate(${b.x.toFixed(3)},0) rotate(${b.tilt.toFixed(3)},174,336)`);
    const gateReady=smoothstep(extractEnd,tiltEnd,t)*(1-smoothstep(b.returnAt,b.returnAt+.6,t));attr(cageGate,'transform',`rotate(${((90-b.tilt)*gateReady).toFixed(3)},174,336)`);
    const rear=rotate({x:b.x+25,y:334},b.pivot,b.tilt);
    const tipEngaged=smoothstep(extractStart,extractEnd,t)*(1-smoothstep(b.returnAt+.6,b.returnAt+1.2,t));
    attr(tipCylinder,'opacity',tipEngaged.toFixed(3));
    const cradleRest={x:1160,y:355};
    const tipTarget=t>=extractEnd&&t<=b.returnAt+.6?rear:blend(cradleRest,rear,tipEngaged);
    attr(tipCylinder,'x2',tipTarget.x.toFixed(3));attr(tipCylinder,'y2',tipTarget.y.toFixed(3));
    const poses=raw.map(r=>bunchPose(r.i,t));const loaded=poses.filter(p=>p.kind==='basket').length;
    const sealed=smoothstep(sealAt,sealEnd,t),pressure=loaded===N&&t<ventEnd?smoothstep(cookStart,cookStart+.55,t)*(1-smoothstep(cookEnd,ventEnd,t)):0;
    const inlet=1-sealed,outlet=smoothstep(ventEnd,doorOpenEnd,t)*(1-smoothstep(b.returnAt+2.35,b.returnAt+2.95,t));
    attr(doorIn,'transform',`rotate(${(110*inlet).toFixed(3)},778,255)`);attr(doorOut,'transform',`rotate(${(-110*outlet).toFixed(3)},1092,255)`);
    motionAttribute(document.getElementById('anim-s02-cook-glow'),'opacity',(pressure*.8).toFixed(3));motionAttribute(document.getElementById('anim-s02-gauge-needle'),'transform',`rotate(${(48*pressure).toFixed(3)},882,238)`);
    const vent=smoothstep(cookEnd,cookEnd+.12,t)*(1-smoothstep(ventEnd-.15,ventEnd,t));attr(steamVent,'opacity',(vent*.7).toFixed(3));
    const meterOpen=Math.max(0,...raw.map(r=>smoothstep(r.meter-.10,r.meter,t)*(1-smoothstep(r.meter+.28,r.meter+.45,t))));attr(meter,'transform',`translate(0,${(-33*meterOpen).toFixed(3)})`);
    const rotorAngle=(entryAngle+omega*clamp(t-rotorStart,0,rotorEnd-rotorStart))*180/Math.PI;motionAttribute(document.getElementById('anim-s03-rotor'),'transform',`rotate(${rotorAngle.toFixed(3)},1384,308)`);
    poses.forEach((p,i)=>{poseNode(bunches[i].stem,p);attr(bunches[i].stem,'clip-path',p.kind.startsWith('rotor')||p.kind==='screen-impact'||p.kind==='stripping'?drumClip:'none');attr(bunches[i].stem,'data-material-state',p.kind);});
    intakeFlights.forEach((el,i)=>{const p=poses[i];if(p.kind==='belt-contact'){const r=raw[i],s=Math.max(0,(t-r.beltStart)*185-R),f=belt.pose(s,0),up=belt.pose(s,14);attr(el,'x1',f.x.toFixed(3));attr(el,'y1',f.y.toFixed(3));attr(el,'x2',up.x.toFixed(3));attr(el,'y2',up.y.toFixed(3));attr(el,'visibility','visible');}else attr(el,'visibility','hidden');});
    const fruit=cells.map(c=>fruitPose(c,t)),oil=cells.map(c=>liquidPose(c,t,false)),water=cells.map(c=>liquidPose(c,t,true)),fines=cells.map(c=>finePose(c,t)),cores=cells.map(c=>corePose(c,t));
    const collectorStart=Math.min(...cells.map(c=>c.panStart)),collectorEnd=Math.max(...cells.map(c=>c.bridgeStart)),returnStart=Math.min(...cells.map(c=>c.returnStart)),returnEnd=Math.max(...cells.map(c=>c.headFlight));
    for(const [rollers,start,end,speed] of [[collectorRollers,collectorStart,collectorEnd,240],[returnRollers,returnStart,returnEnd,-330]])for(const r of rollers)attr(r.g,'transform',`rotate(${(clamp(t-start,0,end-start)*speed/4*180/Math.PI).toFixed(3)},${r.x},${r.y})`);
    collectorFlights.forEach((el,i)=>{const p=fruit[i*LEAVES],visible=p.kind==='fruit-conveyor';attr(el,'visibility',visible?'visible':'hidden');if(visible){attr(el,'x1',(p.x-4).toFixed(3));attr(el,'x2',(p.x-4).toFixed(3));attr(el,'y1','363');attr(el,'y2','356.5');}});
    returnFlights.forEach((el,i)=>{const c=cells[i*LEAVES],visible=fruit[i*LEAVES].kind==='return-conveyor';attr(el,'visibility',visible?'visible':'hidden');if(visible){const s=Math.max(0,(t-c.returnStart)*330-4),floor=returnRoute.pose(s,-2.4),tip=returnRoute.pose(s,3.5);for(const [key,value] of Object.entries({x1:floor.x,y1:floor.y,x2:tip.x,y2:tip.y}))attr(el,key,value.toFixed(3));}});
    const pressActive=fruit.some((p,i)=>t>=cells[i].press&&t<cells[i].coreOut),mixerActive=t>=hopperLoaded&&t<mashReady;
    attr(mixer,'transform',`rotate(${(clamp(t-hopperLoaded,0,mashReady-hopperLoaded)*270).toFixed(3)},450,704)`);attr(digestGate,'transform',`translate(${(t>=mashReady&&t<Math.max(...cells.map(c=>c.press))?13:0)},0)`);
    const screwPhase=clamp(t-Math.min(...cells.map(c=>c.press)),0,Math.max(...cells.map(c=>c.coreOut))-Math.min(...cells.map(c=>c.press)))*8;
    renderScrew(screwPhase);
    const liquorWet=oil.some(p=>p.kind==='liquor-pump'||p.kind==='liquor-pump-held'),oilWet=oil.some(p=>p.kind==='storage-inflow');
    attr(liquorPump.rotor,'transform',`rotate(${(clamp(t-pumpStart,0,Math.max(...cells.map(c=>c.liquorStart))-pumpStart)*430).toFixed(3)},405,874)`);
    attr(sludgeValve,'transform',`rotate(${(t>=waterDrainStart&&t<cells.at(-1).waterTube?90:0)},1110,850)`);
    cells.forEach((c,i)=>{paintLiquid(c.body,oil[i],false,c,t);paintLiquid(c.aqueous,water[i],true,c,t);put(c.core,material);poseNode(c.core,cores[i]);attr(c.core,'clip-path',cores[i].kind==='compression'?pressClip:'none');attr(c.core,'data-material-state',cores[i].kind);attr(c.fibre,'transform',`scale(${(1+2*smoothstep(c.expression,c.coreOut,t)).toFixed(3)})`);const f=fines[i];put(c.fine,f.clip===vesselClip?clarifiedMaterial:f.clip===sludgeClip?sludgeMaterial:material);attr(c.fine,'clip-path',f.clip||'none');attr(c.fine,'cx',f.x.toFixed(3));attr(c.fine,'cy',f.y.toFixed(3));attr(c.fine,'r',(f.rx||.55).toFixed(3));attr(c.fine,'data-material-state',f.kind||fruit[i].kind);});
    if(materialOrderDirty){const all=cells.flatMap(c=>[c.body,c.aqueous,c.core,c.fine]);order(material,[clarifiedMaterial,sludgeMaterial,...bunches.map(b=>b.stem),...all.filter(el=>el.parentNode===material),...outflowDrops]);for(const pool of [clarifiedMaterial,storageMaterial,sludgeMaterial])order(pool,[...cells.map(c=>c.aqueous),...cells.map(c=>c.body),...cells.map(c=>c.fine)].filter(el=>el.parentNode===pool));materialOrderDirty=false;}
    const stored=totalStored(t);const sight=stageSvg.querySelector('#s06-level-gauge line[x1="1525"]');if(sight)attr(sight,'y1',(826-62*stored/COUNT).toFixed(3));
    const outflowEl=document.getElementById('anim-s06-outflow-stream');
    if(outflowEl){
      if(t>=46.2){
        const advance=smoothstep(46.2,46.6,t);
        attr(outflowEl,'x1','1554');
        attr(outflowEl,'y1','801');
        attr(outflowEl,'y2','801');
        attr(outflowEl,'x2',mix(1554,1658,advance).toFixed(2));
        attr(outflowEl,'stroke','#d39b3c');
        attr(outflowEl,'stroke-width','3.6');
        attr(outflowEl,'stroke-linecap','round');
        attr(outflowEl,'opacity',(advance*0.95).toFixed(3));
        outflowEl.removeAttribute('stroke-dasharray');
        outflowEl.removeAttribute('stroke-dashoffset');
      }else{
        attr(outflowEl,'opacity','0');
      }
    }
    if(t>=46.5){
      const duration=0.52,elapsed=t-46.5;
      outflowDrops.forEach((drop,i)=>{
        const dropPhase=((elapsed+i*(duration/6))%duration)/duration;
        const x=mix(1554,1658,dropPhase);
        attr(drop,'cx',x.toFixed(2));
        attr(drop,'cy','801');
        const edgeFade=smoothstep(0,0.08,dropPhase)*(1-smoothstep(0.92,1.0,dropPhase));
        const startFade=smoothstep(46.5,46.7,t);
        attr(drop,'opacity',(startFade*edgeFade*0.95).toFixed(3));
      });
    }else{
      outflowDrops.forEach(drop=>attr(drop,'opacity','0'));
    }
    const received=wetReceived(t);lastPhysicalState={time:rawT,duration:TOTAL_DURATION,bunches:poses.map((p,i)=>({id:`bunch-${i}`,...p})),fruit:fruit.map((p,i)=>({id:cells[i].id,...p})),oil:oil.map((p,i)=>({id:cells[i].id,...p})),aqueous:water.map((p,i)=>({id:cells[i].id,...p})),cake:cores.map((p,i)=>({id:cells[i].id,...p})),fines:fines.map((p,i)=>({id:cells[i].id,...p})),inventory:{bunches:N,cells:COUNT,oilStored:stored,oilClarifier:Math.max(0,received-COUNT+remainingOil(t)),waterClarifier:Math.max(0,received-COUNT+remainingWater(t))},machines:{inletOpen:inlet,outletOpen:outlet,basketLoaded:loaded,pressure,rotorActive:t>=rotorStart&&t<rotorEnd,mixerActive,pressActive,liquorWet,oilWet,dispatchClosed:t<46.5}};
  }
  // =========================================================================
  // ANIMATION LOOP & CONTROLS
  // =========================================================================
  function tick(timestamp) {
    rafId = null;
    if (!isPlaying || isReducedMotion) return;
    if (lastTimestamp === null) lastTimestamp = timestamp;
    const dt = Math.min((timestamp - lastTimestamp) / 1000.0, 0.1);
    lastTimestamp = timestamp;

    if (isPlaying && !isReducedMotion) {
      currentTime += dt;
      if (currentTime >= TOTAL_DURATION) {
        currentTime = TOTAL_DURATION;
        isPlaying = false;
        renderFrame(currentTime);
        if (typeof window.Ch02Scene03.onComplete === 'function') {
          window.Ch02Scene03.onComplete();
        }
        return;
      }
      renderFrame(currentTime);
    }

    rafId = requestAnimationFrame(tick);
  }

  function play() {
    isReducedMotion = reduceMotionQuery.matches;
    resumeAfterHidden = false;
    if (isReducedMotion) {
      pause();
      seek(TOTAL_DURATION);
      return;
    }
    if (currentTime >= TOTAL_DURATION) {
      currentTime = 0.0;
      renderFrame(currentTime);
    }
    isPlaying = true;
    lastTimestamp = null;
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    rafId = requestAnimationFrame(tick);
  }

  function pause() {
    isPlaying = false;
    resumeAfterHidden = false;
    lastTimestamp = null;
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  function replay() {
    isReducedMotion = reduceMotionQuery.matches;
    if (isReducedMotion) {
      seek(TOTAL_DURATION);
      return;
    }
    pause();
    currentTime = 0.0;
    renderFrame(0.0);
    play();
  }

  function seek(t) {
    currentTime = clamp(t, 0.0, TOTAL_DURATION);
    lastTimestamp = null;
    renderFrame(currentTime);
  }

  function stop() {
    pause();
    currentTime = 0.0;
    renderFrame(0.0);
  }

  // Suspend local time while the tab is hidden; resume without a skipped beat.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      const wasPlaying = isPlaying;
      pause();
      resumeAfterHidden = wasPlaying;
    } else if (resumeAfterHidden) {
      play();
    }
  });

  // Keep stage restart on the accepted machine artwork, without new UI.
  if (stageSvg) {
    const machines = stageSvg.querySelectorAll('#layer-machinery > g[id^="stage-"]');
    machines.forEach((machine, index) => {
      const stage = STAGES[index];
      if (!stage) return;
      machine.setAttribute('role', 'button');
      machine.setAttribute('tabindex', '0');
      machine.setAttribute('aria-label', `Restart ${stage.name}`);
      // Filled interiors and gaps in the drawing share one stage hit region.
      const bounds = machine.getBBox();
      const hitRegion = document.createElementNS(svgNS, 'rect');
      hitRegion.setAttribute('x', String(bounds.x));
      hitRegion.setAttribute('y', String(bounds.y));
      hitRegion.setAttribute('width', String(bounds.width));
      hitRegion.setAttribute('height', String(bounds.height));
      hitRegion.setAttribute('fill', 'transparent');
      hitRegion.setAttribute('pointer-events', 'all');
      hitRegion.style.cursor = 'pointer';
      machine.insertBefore(hitRegion, machine.firstChild);
      const restart = () => {
        seek(isReducedMotion ? TOTAL_DURATION : stage.time);
        play();
      };
      machine.addEventListener('click', restart);
      machine.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          restart();
        }
      });
    });
  }

  // =========================================================================
  // INSPECTION & PROCESS EXPLAINER MODALS
  // =========================================================================
  function openEvidencePanel() {
    if (!evidencePanel) return;
    if (processPanel && !processPanel.hidden) closeProcessPanel();
    evidencePanel.hidden = false;
    if (inspectBtn) inspectBtn.setAttribute('aria-expanded', 'true');
    const closeBtn = evidencePanel.querySelector('.archival-dossier__close');
    if (closeBtn) closeBtn.focus();
  }

  function closeEvidencePanel() {
    if (!evidencePanel) return;
    evidencePanel.hidden = true;
    if (inspectBtn) {
      inspectBtn.setAttribute('aria-expanded', 'false');
      inspectBtn.focus();
    }
  }

  function openProcessPanel() {
    if (!processPanel) return;
    if (evidencePanel && !evidencePanel.hidden) closeEvidencePanel();
    processPanel.hidden = false;
    if (processBtn) processBtn.setAttribute('aria-expanded', 'true');
    const closeBtn = processPanel.querySelector('.archival-dossier__close');
    if (closeBtn) closeBtn.focus();
  }

  function closeProcessPanel() {
    if (!processPanel) return;
    processPanel.hidden = true;
    if (processBtn) {
      processBtn.setAttribute('aria-expanded', 'false');
      processBtn.focus();
    }
  }

  function initModals() {
    if (inspectBtn) {
      inspectBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (evidencePanel && evidencePanel.hidden) {
          openEvidencePanel();
        } else {
          closeEvidencePanel();
        }
      });
    }

    if (processBtn) {
      processBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (processPanel && processPanel.hidden) {
          openProcessPanel();
        } else {
          closeProcessPanel();
        }
      });
    }

    if (evidencePanel) {
      evidencePanel.addEventListener('click', (e) => {
        if (e.target.dataset && e.target.dataset.close === 'true') {
          closeEvidencePanel();
        }
      });
    }

    if (processPanel) {
      processPanel.addEventListener('click', (e) => {
        if (e.target.dataset && e.target.dataset.close === 'true') {
          closeProcessPanel();
        }
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (evidencePanel && !evidencePanel.hidden) closeEvidencePanel();
        if (processPanel && !processPanel.hidden) closeProcessPanel();
      }
    });
  }

  // Motion preference handling
  if (typeof reduceMotionQuery.addEventListener === 'function') {
    reduceMotionQuery.addEventListener('change', (e) => {
      isReducedMotion = e.matches;
      if (isReducedMotion) {
        pause();
        seek(TOTAL_DURATION);
      }
    });
  }

  // Initialize
  initModals();

  if (isReducedMotion) {
    seek(TOTAL_DURATION);
  } else {
    renderFrame(0.0);
  }

  // =========================================================================
  // CHAPTER 02 ADAPTER CONTRACT EXPORT
  // =========================================================================
  window.Ch02Scene03 = {
    id: 'scene-03',
    name: '03 // ASTRA MILL',
    shortName: '03 Astra',
    duration: TOTAL_DURATION,
    init: function () {
      if (isReducedMotion) {
        seek(TOTAL_DURATION);
      } else {
        renderFrame(0.0);
      }
    },
    play: play,
    pause: pause,
    replay: replay,
    stop: stop,
    resize: function () {},
    getCurrentTime: function () {
      return Math.min(currentTime, TOTAL_DURATION);
    },
    seek: seek,
    onComplete: null
  };

  // Expose for testing harness / CDP inspection
  window.__SCENE_03_CONTROLLER__ = {
    seek,
    play,
    pause,
    replay,
    getCurrentTime: () => currentTime,
    renderFrame,
    getTotalDuration: () => TOTAL_DURATION,
    getStages: () => STAGES,
    getPhysicalState: () => lastPhysicalState,
    getMaterialIds: () => [...stageSvg.querySelectorAll("[data-material-id]")].map(el=>el.getAttribute("data-material-id")),
    getMaterialPose: (type,index,tRaw) => { const t = Math.max(0, clamp(tRaw, 0, TOTAL_DURATION) - ENTRY_HOLD); return ({bunches:i=>bunchPose(i,t),oil:i=>liquidPose(cells[i],t,false),aqueous:i=>liquidPose(cells[i],t,true),cake:i=>corePose(cells[i],t),fines:i=>finePose(cells[i],t)})[type](index); }
  };
})();
