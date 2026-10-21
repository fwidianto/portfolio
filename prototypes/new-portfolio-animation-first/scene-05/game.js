import {gameBaseline,evaluateGame,changeGame} from './game-model.js';
import {mountLivingWorld} from './game-world.js';
import {createWarehouse,stepWarehouse,warehouseAction,warehouseActuals,improvementQuote,assertWarehouse,exits,cellKey,warehouseRisk} from './warehouse-model.js';
import {WAREHOUSE_DEFAULTS} from './warehouse-config.js';
import {financeTimeline,financeChart,financeCostMix} from './finance-view.js';
import {COST_LABELS} from './finance-engine.js';

const sheet=document.createElement('link');sheet.rel='stylesheet';sheet.href=new URL('./game.css',import.meta.url).href;
await new Promise((resolve,reject)=>{sheet.onload=resolve;sheet.onerror=reject;document.head.append(sheet);});
const $=s=>document.querySelector(s),n=(v,d=0)=>Number(v).toLocaleString('en-US',{maximumFractionDigits:d}),rp=v=>'Rp '+n(v);
const short=v=>Math.abs(v)>=1e6?'Rp '+n(v/1e6,2)+'m':rp(v);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const stat=(name,value)=>`<div><span>${name}</span><strong>${value}</strong></div>`;
const table=(headers,rows)=>`<div class="inspection-table"><table><thead><tr>${headers.map(h=>`<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
const presentation=window.FMC_PRESENTATION||{};
const playbackSpeeds=presentation.speeds||[1,2,4],maximumSpeed=Math.max(...playbackSpeeds);
let scenario=gameBaseline(),derived=evaluateGame(scenario),config=structuredClone({...WAREHOUSE_DEFAULTS,...presentation.config}),mission=createWarehouse(scenario,config),runtime=null;
let selected=0,tab='operation',view='overview',zoom=1,playing=false,speed=presentation.speed||1,last=0,accumulator=0,frame=0,lastPanel=0,detail='actuals',inspectMonth=1,inspectEvent=null;
let held=null,pressAt=0,lastRuntimeStep=0,lastRuntimePaint=0,runtimeError=null;
let presentationActive=new URLSearchParams(location.search).get('chapter')!=='1';
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const metrics={updates:0,updateMs:0,maxUpdateMs:0,renders:0,renderMs:0,maxRenderMs:0,frames:0,frameMs:0,maxFrameMs:0};
document.documentElement.className='game-view';document.title='FIELDWORK · A living forklift warehouse';
document.body.innerHTML=`<a class="game-skip" href="#operations">Skip to warehouse controls</a><main class="game-shell warehouse-app"><header class="game-header"><a class="game-wordmark" href="?view=game">FIELDWORK<span>A LIVING FORKLIFT OPERATION</span></a><div class="game-context"><span>10 units · one month</span><span class="synthetic-badge">Synthetic scenario</span></div><button class="quiet-button" data-inspect="actuals">Inspect ↗</button></header><div class="mission-heading"><div><span class="eyebrow">THE MAINTENANCE CONTRACT</span><h1>Keep the work moving.</h1></div><div class="mission-time"><span id="mission-clock">Day 1 / 30</span><progress id="mission-progress" max="240" value="0" aria-label="Mission month elapsed"></progress><small>One month ≈ ${n(config.monthSeconds/60,1)} minutes at 1×</small></div></div><div class="warehouse-layout"><section class="warehouse-stage" aria-label="Live warehouse"><div class="live-strip"><span id="live-state">READY TO OPEN</span><span id="live-work">72 pallets · 216 moves</span></div><div id="game-world"></div><div class="warehouse-tools" role="group" aria-label="Warehouse camera"><button data-view="overview" aria-pressed="true">Back to site</button><button data-view="interior" aria-pressed="false">Enter warehouse</button><button data-action="zoom" aria-label="Move closer to the selected forklift">Zoom +</button></div><div id="world-selected" class="selected-caption"></div><div id="driving-controls" hidden></div><div class="clock-controls"><button id="play-mission" data-action="play">Start month →</button><button data-action="advance" aria-label="Advance ten simulation seconds">+10s</button><label>Speed<select id="mission-speed" aria-label="Playback speed">${playbackSpeeds.map(value=>`<option value="${value}">${value}×</option>`).join('')}</select></label><button data-action="restart" aria-label="Restart the same seeded mission">↺ Replay</button></div></section><aside class="ops-panel" id="operations" aria-label="Warehouse decisions"><nav class="ops-tabs" aria-label="Management panels"><button data-panel="operation" aria-pressed="true">Fleet</button><button data-panel="workshop" aria-pressed="false">Workshop</button><button data-panel="result" aria-pressed="false">Result</button></nav><div id="decision"></div></aside></div><div class="warehouse-stats" id="warehouse-stats"></div><footer class="game-footer"><span>OPERATIONS → BUSINESS LOGIC → EVIDENCE</span><p>Synthetic maintenance-contract economics. Ownership costs are outside this model.</p><a href="./" target="_blank" rel="noopener">Open worksheet ↗</a></footer><p id="game-feedback" role="status" aria-live="polite"></p></main><dialog class="game-dialog" id="game-calculations" aria-labelledby="calculation-title"><header class="inspection-header"><div><span class="eyebrow">FOLLOW THE EVIDENCE</span><h2 id="calculation-title">Behind the operation</h2></div><button data-action="close-details" aria-label="Close inspection">×</button></header><nav class="calculation-tabs" id="calculation-tabs" aria-label="Inspection sections"></nav><div id="calculation-content"></div></dialog>`;
const world=presentation.only3D?{render(){},setView(){},metrics:{renderer:'external-3d'}}:mountLivingWorld($('#game-world'),{onUnit:i=>selectUnit(i),onEnter:()=>changeView('interior'),onInspect:section=>{if(section==='workshop'){tab='workshop';renderPanel();}else openDetails(section);}});
function runtimeFailure(error){if(error.name==='AbortError')return;runtimeError=error.message;const failed=runtime;runtime=null;failed?.dispose();pause('Simulation paused · '+error.message+'. Resume to retry.');}
function watch(promise){promise.catch(runtimeFailure);return promise;}
function ensureRuntime(){
 if(runtime||!window.fmcRuntimeFactory)return true;
 try{runtimeError=null;
 runtime=window.fmcRuntimeFactory({onState(next,work){mission=next;metrics.updateThread='worker';metrics.updates+=work.count;metrics.updateMs+=work.computeMs;metrics.maxUpdateMs=Math.max(metrics.maxUpdateMs,work.computeMs);metrics.routeCache=work.routeCache;const now=performance.now();if(!playing||now-lastRuntimePaint>=75){lastRuntimePaint=now;renderWorld();}document.dispatchEvent(new Event('fmc-state'));if(!work.count)renderPanel();if(mission.finished){pause();tab='result';renderPanel();feedback('Month complete. Inspect the financial and operational result.');}},onError:runtimeFailure});watch(runtime.reset(mission));return true;
 }catch(error){runtimeFailure(error);return false;}
}
function act(type,value,index=selected){if(!runtime)return warehouseAction(mission,type,value,index);watch(runtime.reset(mission));watch(runtime.action(type,value,index));return true;}
function unitSelect(id='game-unit'){return `<label class="unit-selector" for="${id}">Selected unit<select id="${id}">${mission.units.map((u,i)=>`<option value="${i}" ${i===selected?'selected':''}>${String(i+1).padStart(2,'0')} · ${u.model}</option>`).join('')}</select></label>`;}
function setup(){
  const u=mission.units[selected];
  return `<span class="eyebrow">YOUR FIRST SHIFT</span><h2>Ten machines.<br>One living operation.</h2><p>Choose your fleet and service team. Receive, replenish and dispatch ${config.pallets} pallets.</p>${unitSelect()}<label>Model<select id="game-model">${Object.keys(scenario.models).map(m=>`<option ${m===u.model?'selected':''}>${m}</option>`).join('')}</select></label><div class="setup-pair"><label>Planned h / unit<input id="game-hours" type="number" min="0" max="744" step="1" value="${scenario.fleets[0].hours}"></label><label>Mechanics<input id="game-mechanics" type="number" min="0" max="8" step="1" value="${config.mechanics}"></label></div><label>Revenue / unit / month (Rp)<input id="game-fee" type="number" min="0" max="1000000000" step="100000" value="${scenario.sites[0].revenue}"></label><div class="setup-pair"><label>Service team<select id="game-placement"><option value="dedicated" ${scenario.worksheet.placement==='dedicated'?'selected':''}>Onsite</option><option value="hybrid" ${scenario.worksheet.placement==='hybrid'?'selected':''}>Mobile</option></select></label><label>Office km<input id="game-distance" type="number" min="0" max="200" value="${scenario.worksheet.distanceKm}"></label></div><details class="assumptions"><summary>Seed & synthetic reliability</summary><label>Scenario seed<input id="game-seed" type="number" min="0" max="4294967295" value="${config.seed}"></label><label>Minor faults / operating h<input id="minor-rate" type="number" min="0" max=".1" step=".0001" value="${config.minorRate}"></label><label>Major repairs / operating h<input id="major-rate" type="number" min="0" max=".1" step=".00005" value="${config.majorRate}"></label><button class="ticket-link" data-inspect="rules">Inspect clock & assumptions ↗</button></details><button class="primary-button" data-action="play">Open the warehouse →</button><p class="microcopy">Management is enough to play. Driving one unit is optional.</p>`;
}
function fleetPanel(){
  const u=mission.units[selected],j=mission.jobs.find(j=>j.id===u.job),target=j&&mission.spots.find(p=>p.id===(u.load?j.destination:j.source));
  const due=mission.events.filter(e=>e.unit===u.id&&e.status!=='completed');
  const risk=warehouseRisk(mission,u);
  return `<span class="eyebrow">THE FLOOR IS YOURS</span><h2>Every move<br>does real work.</h2>${unitSelect()}<div class="unit-status"><b>${esc(u.reason)}</b><span>${n(u.meter,1)} lifetime h · ${n(u.condition*100)}% condition</span><span>${n(risk.overdueHours,1)} h overdue · risk ×${n(risk.risk,2)}</span><span>${u.load?'Carrying '+u.load:'Forks empty'} · ${u.completed} moves completed</span>${j?`<span>${j.type.toUpperCase()} · ${j.pallet}<br>${j.source} → ${j.destination}</span>`:'<span>Waiting for the next assignment</span>'}${target?`<span>Target aisle: (${target.access.x}, ${target.access.y}) · current (${u.x}, ${u.y})</span>`:''}</div><button class="primary-button" data-action="control" ${u.mode!=='manual'&&(u.fault||u.service)?'disabled':''}>${u.mode==='manual'?'Return to automatic →':'Drive this forklift ↗'}</button>${due.length?`<p class="queue-note">${due.length} service / repair obligation${due.length>1?'s':''} waiting or underway.</p>`:''}<details class="fleet-roster"><summary>All ten units</summary>${mission.units.map((v,i)=>`<button data-select="${i}"><b>${i+1} · ${v.model}</b><span>${esc(v.reason)} · ${v.completed} moves</span></button>`).join('')}</details><button class="ticket-link" data-inspect="inventory">Inspect jobs & stock ↗</button>`;
}
function workshopPanel(){
  const pending=mission.events.filter(e=>e.status!=='completed'),busy=mission.mechanics.filter(m=>m.event).length;
  return `<span class="eyebrow">KEEP THEM AVAILABLE</span><h2>Time, people<br>and a place to work.</h2><label>Preventive policy<select id="service-policy"><option value="immediate" ${mission.policy==='immediate'?'selected':''}>Service when due</option><option value="after-job" ${mission.policy==='after-job'?'selected':''}>Finish current job first</option><option value="defer" ${mission.policy==='defer'?'selected':''}>Defer routine service</option></select></label><p class="microcopy">Deferral keeps work moving now and raises overdue-related risk. Repairs stop the unit until a crew is available.</p><div class="workshop-summary"><b>${mission.mechanics.length} mechanics · ${busy} assigned</b><span>${mission.bays.length} bay${mission.bays.length>1?'s':''} · ${pending.length} obligations pending</span></div><div class="queue-list">${pending.slice(0,6).map(e=>`<button data-event="${e.id}"><b>${e.unit.slice(0,3)} · ${e.name}</b><span>${e.status} · ${e.crew} crew${e.status==='in-progress'?' · '+n(e.progress,1)+' / '+e.duration+' h':''}</span></button>`).join('')||'<p>No service is due yet.</p>'}</div><div class="improvement-options"><button data-offer="mechanic">Add a mechanic <span>Review price ↗</span></button><button data-offer="bay" ${mission.bays.length>=2?'disabled':''}>Lease a second bay <span>Review price ↗</span></button><button data-offer="component" ${mission.units[selected].componentRequested?'disabled':''}>Replace unit ${selected+1} drive component <span>Review price ↗</span></button></div><button class="ticket-link" data-inspect="capacity">Inspect resources ↗</button>`;
}
function resultPanel(){
  const a=warehouseActuals(mission),status=a.revenue===0?'REVENUE UNSET':a.profit<0?'NEGATIVE RESULT':a.remaining>0?'CONTRIBUTION · WORK REMAINS':'MONTH COMPLETE';
  return `<span class="eyebrow">${config.continuous?'RUNNING CONTRACT · MONTH '+(mission.contractPeriods||1):mission.finished?'YOUR MONTH, CLOSED':'BOOKED THIS MONTH'}</span><h2>${a.profit<0?'The contract<br>needs a rethink.':'Did the plan<br>hold up?'}</h2><div class="verdict ${a.profit<0?'verdict-loss':''}">${status}</div><p>Maintenance-contract scope. Revenue is fixed; incomplete work creates no invented penalty.</p><div class="result-numbers">${stat('Revenue',short(a.revenue))}${stat('Booked cost',short(a.cost))}${stat('Contribution',short(a.contribution))}${stat('After overhead',short(a.profit))}${stat('Margin',a.margin===null?'Undefined':n(a.margin,2)+'%')}${config.continuous?'':stat('Cost vs plan',(a.variance>=0?'+':'')+short(a.variance))}</div><div class="outcome-note">${a.remaining}${config.continuous?'':' / '+config.pallets*3} moves unfinished · ${a.backlog} service / repair obligations open.<br>${a.dispatched}${config.continuous?'':' / '+config.pallets} pallets dispatched · ${(a.availability===null?'—':n(a.availability,1))}% availability.</div><button class="primary-button" data-inspect="actuals">Trace the result ↗</button><button class="ticket-link" data-inspect="forecast">Open the 60-month forecast ↗</button><button class="ticket-link" data-action="new-plan">Change inputs & replay →</button>`;
}
function renderPanel(){
  const focus=document.activeElement?.id;
  $('#decision').innerHTML=!mission.started?setup():tab==='operation'?fleetPanel():tab==='workshop'?workshopPanel():resultPanel();
  for(const b of document.querySelectorAll('[data-panel]'))b.setAttribute('aria-pressed',String(b.dataset.panel===tab));
  if(focus)document.getElementById(focus)?.focus({preventScroll:true});
}
function renderWorld(){
  const t=performance.now();world.render(mission,selected,{reduced:reduced.matches});const elapsed=performance.now()-t;
  metrics.renders++;metrics.renderMs+=elapsed;metrics.maxRenderMs=Math.max(metrics.maxRenderMs,elapsed);
  const a=warehouseActuals(mission),u=mission.units[selected],month=mission.contractPeriods||1,monthTime=mission.time%config.monthSeconds,day=Math.min(30,Math.floor(monthTime/config.monthSeconds*30)+1);
  $('#mission-clock').textContent=config.continuous?`Month ${month} · Day ${day} / 30 · ${n(mission.time)}s`:mission.finished?'Month complete':`Day ${Math.min(30,Math.floor(mission.time/config.monthSeconds*30)+1)} / 30 · ${n(mission.time)}s`;
  $('#mission-progress').value=config.continuous?monthTime:mission.time;$('#mission-progress').max=config.monthSeconds;
  $('#live-state').textContent=mission.finished?'MONTH CLOSED':!mission.started?'READY TO OPEN':playing?'OPERATION LIVE':'PAUSED';
  if(mission.started&&!mission.finished)$('#live-state').textContent=(playing?'LIVE':'PAUSED')+(config.continuous?' · MONTH '+month+' · DAY '+day+'/30':' · DAY '+Math.min(30,Math.floor(mission.time/config.monthSeconds*30)+1)+'/30');
  $('#live-work').textContent=a.completed+' moves · '+a.dispatched+' dispatched';
  $('#world-selected').textContent=`${String(selected+1).padStart(2,'0')} / ${u.model} · ${u.reason}${u.load?' · '+u.load:''}`;
  $('#warehouse-stats').innerHTML=stat('Moves completed',config.continuous?a.completed:a.completed+' / '+config.pallets*3)+stat('Operating hours',n(a.exposure,1)+' h')+stat('Service / faults',a.services+' / '+a.faults)+stat('Booked contribution',short(a.contribution));
  $('#play-mission').textContent=mission.finished?'Month complete':!mission.started?config.continuous?'Start operation →':'Start month →':playing?'Ⅱ Pause':'▶ Resume';$('#play-mission').disabled=mission.finished;
  renderDriving();
  for(const button of document.querySelectorAll('[data-view]'))button.setAttribute('aria-pressed',String(button.dataset.view===view));
}
function changeView(next){view=next;zoom=1;world.setView(view,zoom);held=null;renderWorld();}
function renderDriving(){
  const root=$('#driving-controls'),u=mission.units[selected];root.hidden=u.mode!=='manual'||!mission.started||mission.finished||view!=='interior';
  if(root.hidden){held=null;return;}
  const next=exits(u).map(cellKey),blocked=new Set(mission.units.filter(v=>v!==u).flatMap(v=>[cellKey(v),...(v.edge?[cellKey(v.edge.to)]:[])])),dirs=[['up','W ↗',u.x,u.y-1],['left','A ↖',u.x-1,u.y],['down','S ↙',u.x,u.y+1],['right','D ↘',u.x+1,u.y]];
  const j=mission.jobs.find(j=>j.id===u.job),target=j&&mission.spots.find(p=>p.id===(u.load?j.destination:j.source)),canHandle=target&&cellKey(u)===cellKey(target.access)&&!u.edge&&!u.service&&!u.fault;
  if(!root.children.length)root.innerHTML='<span>WASD / arrows · one-way aisles · Space to lift / place</span><div class="drive-pad">'+dirs.map(([key,label])=>`<button data-drive="${key}" aria-label="Drive ${key}">${label}</button>`).join('')+'</div><button data-action="handle" class="handle-button">Lift / place · Space</button>';
  for(const [key,,x,y] of dirs){const b=root.querySelector(`[data-drive="${key}"]`);b.disabled=!!u.service||!!u.fault||!next.includes(`${x},${y}`)||blocked.has(`${x},${y}`);}
  root.querySelector('[data-action="handle"]').disabled=!canHandle;root.querySelector('[data-action="handle"]').textContent=u.load?'Place '+u.load+' · Space':'Lift pallet · Space';
}
function render(){renderPanel();renderWorld();}
function selectUnit(i){selected=i;$('#driving-controls').innerHTML='';render();}
function pause(message){playing=false;last=0;accumulator=0;held=null;cancelAnimationFrame(frame);frame=0;if(runtime?.busy)watch(runtime.reset(mission));if(message)feedback(message);renderWorld();}
function feedback(message){$('#game-feedback').textContent=message;}
function simulate(count,manual=false){
  if(window.fmcRuntimeFactory){if(!ensureRuntime())return false;if(!manual&&runtime.busy)return false;watch(runtime.step(count,{drive:held,unit:selected,stream:!manual}));return true;}
  const start=performance.now();stepWarehouse(mission,count);const elapsed=performance.now()-start;
  metrics.updates+=count;metrics.updateMs+=elapsed;metrics.maxUpdateMs=Math.max(metrics.maxUpdateMs,elapsed/count);
  if(mission.finished){pause();tab='result';renderPanel();feedback('Month complete. Inspect the financial and operational result.');}
}
function tick(now){
  if(!playing||document.hidden)return;
  const delta=last?Math.max(0,(now-last)/1000):0;last=now;
  accumulator+=delta*speed;
  if(delta){metrics.frames++;metrics.frameMs+=delta*1000;metrics.maxFrameMs=Math.max(metrics.maxFrameMs,delta*1000);}
  // Accelerated playback needs catch-up headroom while preserving the fixed physical step.
  if(runtime){const count=Math.min(Math.min(32,Math.max(8,Math.ceil(speed*4))),Math.floor((accumulator+1e-9)/config.stepSeconds));if(count&&now-lastRuntimeStep>=50&&simulate(count)){accumulator-=count*config.stepSeconds;lastRuntimeStep=now;}accumulator=Math.min(accumulator,2*speed);}
  else while(accumulator+1e-9>=config.stepSeconds&&playing){
    if(held&&mission.tick>=pressAt){act('move',held,selected);pressAt=mission.tick+1;}
    simulate(1);accumulator-=config.stepSeconds;
  }
  if(!runtime)renderWorld();if(now-lastPanel>750&&!document.activeElement?.matches('#decision select,#decision input')){renderPanel();lastPanel=now;}
  if(playing)frame=requestAnimationFrame(tick);
}
function play(){
  if(!presentationActive||document.hidden||mission.finished)return;if(playing){pause();renderPanel();return;}
  if(!mission.started){mission.started=true;renderPanel();}
  if(reduced.matches){pause('Reduced motion: use +10s to advance the same simulation.');renderPanel();return;}
  if(!ensureRuntime())return;playing=true;last=0;frame=requestAnimationFrame(tick);renderWorld();
}
function restart(changeInputs=false){pause();runtimeError=null;mission=createWarehouse(scenario,config);selected=0;tab='operation';$('#driving-controls').innerHTML='';if(!changeInputs){mission.started=true;feedback('Same seed and assumptions restored. Press Resume or +10s.');}else feedback('Edit the inputs, then open a fresh month.');if(runtime)watch(runtime.reset(mission));render();}
function commit(change){
  try{const next=changeGame(scenario,change);const fresh=createWarehouse(next.scenario,config);scenario=next.scenario;derived=next;mission=fresh;if(runtime)watch(runtime.reset(mission));render();feedback('Plan updated.');}
  catch(e){feedback(e.message);}
}
function chart(){const c=financeChart(financeTimeline(derived.financial.months));return `<figure class="game-profit-chart"><figcaption>Cumulative 60-month forecast · Rp</figcaption><svg viewBox="0 0 ${c.width} ${c.height}" role="img" aria-label="Source-calculated cumulative revenue and cost"><path class="chart-revenue-area" d="${c.revenueArea}"/><path class="chart-revenue" d="${c.revenuePath}"/><path class="chart-cost" d="${c.costPath}"/></svg><div class="game-chart-legend"><span>Revenue</span><span>Cost</span></div></figure>`;}
function openDetails(which){pause('Inspection pauses the clock. Resume when ready.');detail=which;inspectEvent=null;renderDetails();$('#game-calculations').showModal();}
function renderDetails(){
  const tabs=[['actuals','Actuals'],['inventory','Jobs & stock'],['events','Events'],['capacity','Resources'],['forecast','Forecast'],['rules','Assumptions']];
  $('#calculation-tabs').innerHTML=tabs.map(([key,name])=>`<button data-detail-tab="${key}" aria-pressed="${detail===key}">${name}</button>`).join('');
  const a=warehouseActuals(mission);let html='';
  if(detail==='actuals'){
    const categories={...COST_LABELS,repairParts:'Incident / component parts',overhead:'Allocated overhead'};
    html=`<h3>${config.continuous?'Opening monthly plan → running actuals':'One-month plan → mission actuals'}</h3><p>${config.continuous?'Running totals cover '+(mission.contractPeriods||1)+' opened months. Each month books its fixed revenue, payroll and placement allocations. The plan column is the opening month reference.':mission.finished?'Closed month.':'Live booked totals: the full month’s fixed revenue, reserved payroll and placement allocations are booked at opening.'} Materials are booked once when a service or repair starts. Queued work is uncharged.</p>`+table(['Item','Month 1 plan',config.continuous?'Running actual':'Mission actual'],[['Revenue',rp(mission.plan.revenue),rp(a.revenue)],...Object.entries({...Object.fromEntries(Object.keys(categories).map(k=>[k,0])),...a.costs}).map(([key,cost])=>[categories[key]||key,rp(key==='overhead'?mission.plan.overhead:mission.plan.costs[key]||0),`<button data-category="${key}">${rp(cost)} ↗</button>`]),['Total cost',rp(mission.plan.direct+mission.plan.overhead),rp(a.cost)],['Contribution',rp(mission.plan.contribution),rp(a.contribution)],['After overhead',rp(mission.plan.profit),rp(a.profit)],['Margin',mission.plan.margin===null?'Undefined':n(mission.plan.margin,2)+'%',a.margin===null?'Undefined at zero revenue':n(a.margin,2)+'%']]);
    html+=`<p class="inspection-note">${a.remaining} moves unfinished; ${a.backlog} obligations open. Lower cost can reflect work not yet performed. Fixed maintenance revenue is unchanged by downtime. Purchase, finance, depreciation, insurance and rental ownership returns are outside this result.</p><h3>Operational result</h3>`+table(['Measure','Actual'],[['Completed / still required moves',a.completed+' / '+a.remaining],['Waiting or active generated jobs',a.waiting],['Dispatched pallets',config.continuous?a.dispatched+' cumulative':a.dispatched+' / '+config.pallets],['Operating exposure',n(a.exposure,3)+' h'],['Potential operating hours lost to service / faults',n(a.downtime,3)+' h'],['Availability',a.availability===null?'Not yet measurable':n(a.availability,2)+'%'],['Completed services / faults observed',a.services+' / '+a.faults],['Consumed crew person-hours',n(a.personnel,3)],['Paid mechanic travel',n(a.travel,3)+' h']]);
    html+=(mission.archive?.ledgerCount?'<p>'+mission.archive.ledgerCount+' earlier bookings are summarized in the exported archive totals.</p>':'')+'<details><summary>Recent booked entries · unit → event → items</summary>'+ledgerTable(mission.ledger)+'</details><button class="quiet-button" data-action="export">Export mission evidence JSON</button>';
  }else if(detail==='inventory'){
    html=`<h3>Shared inventory · ${mission.pallets.length} active pallet records</h3>${config.continuous?'<p>Completed deliveries replenish the arrival pool with new IDs. Earlier completed work is summarized; current reservations and loads retain their IDs.</p>':''}<p>Each pallet occupies one slot, one unit, the arrival pool or dispatch. Three jobs per pallet: receiving → replenishment → dispatch. Reservations survive view changes and faults.</p>`+table(['Unit','Model','State','Job','Load','Lifetime h'],mission.units.map(u=>[u.id,u.model,esc(u.reason),u.job||'—',u.load||'—',n(u.meter,3)]))+`<details open><summary>Jobs</summary>${table(['Job','Unit','State','Source → destination'],mission.jobs.map(j=>[j.id,j.owner||'Waiting',j.status,j.source+' → '+j.destination]))}</details><details><summary>Every pallet</summary>${table(['Pallet','Location','Stage'],mission.pallets.map(p=>[p.id,p.location,p.stage+' / 3']))}</details>`;
  }else if(detail==='events'){
    const e=mission.events.find(e=>e.id===inspectEvent);
    html='<h3>Actual obligations & incidents</h3>'+table(['Event','Unit','Status','Crew','Elapsed / standard h','Person h'],mission.events.map(e=>[`<button data-event="${e.id}">${e.id} ↗</button>`,e.unit,e.status,e.crew,n(e.progress,2)+' / '+e.duration,n(e.personHours,2)]));
    if(e)html+=`<h3>${esc(e.name)} · ${e.unit}</h3><p>Created tick ${e.created}; started ${e.started??'not started'}; completed ${e.completed??'open'}. Lifetime threshold ${e.threshold??'not applicable'}. ${e.wrench} standard wrench person-hours; ${e.crew} crew; ${e.duration} mechanic elapsed h.</p>`+table(['Item','Qty','Unit price','Total'],[...e.parts,...e.consumables].map(i=>[esc(i.name),i.qty,rp(i.price),rp(i.total)]))+ledgerTable(mission.ledger.filter(x=>x.event===e.id));
    html+='<p class="inspection-note">Due, queued, in-progress and completed are separate states. A complete package is counted once at each crossed threshold. Ordinary payroll is reserved once, not charged again per event.</p>';
  }else if(detail==='capacity'){
    html=`<h3>Finite people & bays</h3><p>${mission.mechanics.length} mechanics, ${mission.bays.length} bays. Each person has 176 paid hours for a full month; forklift planned hours are a separate clock. Mobile’s existing grouped travel consumes that person’s capacity. A two-person service requires two available mechanics.</p>`+table(['Mechanic','Reserved h','Consumed crew h','Paid travel h','Travel budget h','Current event'],mission.mechanics.map(m=>[m.id,n(m.reserved,3),n(m.used,3),n(m.travelUsed,3),n(m.travelBudget,3),m.event||'Available']))+table(['Bay','Reserved unit'],mission.bays.map(b=>[b.id+1,b.unit||'Free']))+`<p class="inspection-note">Travel is distributed over 22 equal mission windows using the existing monthly grouped trips. Service pauses during paid travel; a reserved bay remains occupied. This is a compressed resource schedule, not a validated industrial roster.</p>`;
  }else if(detail==='forecast'){
    const f=derived.financial,mix=financeCostMix(f),events=derived.result.maintenance.events.filter(e=>e.unit===scenario.fleets[selected].id+'-01'&&e.month===inspectMonth),e=events.find(e=>e.id===inspectEvent)||events.find(e=>e.package===1000)||events[0];
    html=`<h3>Original deterministic forecast · ${scenario.months} months</h3><p>Full contract: ${derived.option.count} automatically sized ${scenario.worksheet.placement==='dedicated'?'Onsite':'Mobile'} mechanics. The mission month plan uses your opening team of ${config.mechanics}; its amounts are calculated separately by the same engines.</p>`+table(['Item','60-month forecast'],[['Revenue',rp(f.revenue)],['Direct cost',rp(f.direct)],['Allocated overhead',rp(f.overhead)],['Profit after overhead',rp(f.profit)],['Margin',f.margin===null?'Undefined':n(f.margin,5)+'%']])+chart()+table(['Cost mix','Amount'],mix.groups.map(g=>[g.label,rp(g.amount)]))+`<h3>Inspect a complete service</h3>${unitSelect('inspect-unit')}<label>Forecast month<select id="inspect-month">${Array.from({length:scenario.months},(_,i)=>`<option value="${i+1}" ${inspectMonth===i+1?'selected':''}>${i+1}</option>`).join('')}</select></label>`+table(['Lifetime threshold','Complete package','Wrench person h','Materials'],events.map(e=>[`<button data-forecast-event="${e.id}">${e.threshold} h ↗</button>`,e.package+' h',e.wrench,rp(e.partsCost+e.consumablesCost)]));
    if(e)html+=`<h3>${e.package} h package · unit ${selected+1}</h3><p>${e.wrench} labour person-hours ÷ ${e.crew} mechanics = ${n(e.ideal,2)} ideal elapsed h. Modeled elapsed ${n(e.duration,2)} h. Materials ${rp(e.partsCost+e.consumablesCost)}.</p>`+table(['Type','Item','Quantity','Unit price','Amount'],[...e.parts.map(i=>({...i,type:'Part'})),...e.consumables.map(i=>({...i,type:'Consumable'}))].map(i=>[i.type,esc(i.name),i.qty,rp(i.price),rp(i.total)]));
    html+='<details><summary>Month-by-month financials</summary>'+table(['Month','Revenue','Cost + overhead','Profit'],f.months.map(m=>[m.month,rp(m.revenue),rp(m.direct+m.overhead),rp(m.profit)]))+'</details>';
  }else{
    html=`<h3>Editable synthetic gameplay assumptions</h3><p>These are game defaults, not manufacturer standards or observed field reliability. The original maintenance package items, labour, crew and payroll semantics remain authoritative for this synthetic calculator.</p>`+table(['Rule','Default / selected'],[['Mission duration',config.monthSeconds+' seconds at 1×'],['Fixed simulation step',config.stepSeconds+' seconds'],['One tile / pickup or placement',config.tileSeconds+'s / '+config.handlingSeconds+'s'],['Forklift exposure','Engine-on travel, handling and assigned-job idling; '+scenario.fleets[0].hours+' h over an uninterrupted month'],['Engine off','No work, waiting for a bay/crew, active service and faults'],['Mechanic clock','176 h per full month, including travel'],['Workload',config.pallets+' seeded pallet arrivals × 3 moves'],['Incident sampling','Every '+config.opportunityHours+' actual operating hours, keyed by seed / unit / opportunity'],['Minor / major base rate',config.minorRate+' / '+config.majorRate+' per operating h'],['Risk factor','1 + (1 − condition) × '+config.wearRisk+' + oldest overdue hours / service step × '+config.overdueRisk],['Initial condition / wear',config.initialCondition+' / '+config.wearPerHour+' per operating h'],['Minor fault',rp(config.minor.parts)+' parts; '+config.minor.wrench+' person h; '+config.minor.crew+' crew'],['Major repair',rp(config.major.parts)+' parts; '+config.major.wrench+' person h; '+config.major.crew+' crew'],['Service recovery','+'+n(config.serviceRecovery*100)+' condition points; residual base risk remains'],['Navigation','One-way aisles; current and next tiles reserved; waiting units reroute/yield'],['Seed',config.seed]])+`<p>View changes, speed, pause and reduced motion change presentation only. A travel/handling cycle is a symbolic physical action; operating exposure comes from the continuous clock, never from trip counts. Availability excludes service/fault lost hours; engine-off unused capacity is visible through actual exposure and unfinished work.</p><p>Incident rates are editable before opening. Other explicit gameplay parameters live in <code>warehouse-config.js</code>. Repairs occur in place and retain loads. There are no inventory lead times or industrial driving physics.</p><p>Second bay: temporary monthly operating lease, not an owned asset. Extra staff: prorated salary plus placement cost. Components: consumed parts at work start. Cash and expense coincide for these assumptions; no capital/depreciation model is introduced.</p>`;
  }
  $('#calculation-content').innerHTML=html;
}
function ledgerTable(entries){return table(['Booking','Unit / event','Category','Amount','Consumed items'],entries.map(e=>[e.label+' · tick '+e.tick,(e.unit||'Contract')+(e.event?' / '+e.event:''),e.category,rp(e.amount),e.items.map(i=>esc(i.name)+' × '+i.qty+' @ '+rp(i.price)).join('<br>')||'Allocation / commitment']));}
function offer(kind){
  pause('Decision preview pauses the clock so its quoted price stays exact.');detail='offer';const quote=improvementQuote(mission,kind,selected);$('#calculation-tabs').innerHTML='';
  $('#calculation-content').innerHTML=`<span class="eyebrow">REVIEW THIS DECISION</span><h3>${{mechanic:'Add one mechanic',bay:'Lease a second service bay',component:'Replace unit '+(selected+1)+' drive component'}[kind]}</h3><div class="offer-price">${rp(quote.cost)}</div><p><b>Timing:</b> ${quote.timing}</p><p><b>Benefit:</b> ${quote.benefit}</p><p><b>Tradeoff:</b> ${quote.tradeoff}</p><p>Cash and operating expense use the same amount here. A queued component job is uncharged until work begins.</p><button class="primary-button" data-buy="${kind}" ${quote.disabled?'disabled':''}>${quote.disabled?'Already applied / unavailable':'Apply this decision →'}</button>`;
  $('#game-calculations').showModal();
}
document.addEventListener('click',event=>{
  const b=event.target.closest('button');if(!b)return;
  if(b.dataset.drive){act('move',b.dataset.drive,selected);return;}
  if(b.dataset.panel){tab=b.dataset.panel;renderPanel();return;}
  if(b.dataset.select!==undefined){selectUnit(Number(b.dataset.select));return;}
  if(b.dataset.view){changeView(b.dataset.view);return;}
  if(b.dataset.inspect){openDetails(b.dataset.inspect);return;}
  if(b.dataset.detailTab){detail=b.dataset.detailTab;inspectEvent=null;renderDetails();document.querySelector(`[data-detail-tab="${detail}"]`).focus();return;}
  if(b.dataset.event){pause();inspectEvent=b.dataset.event;detail='events';renderDetails();if(!$('#game-calculations').open)$('#game-calculations').showModal();return;}
  if(b.dataset.forecastEvent){inspectEvent=b.dataset.forecastEvent;renderDetails();return;}
  if(b.dataset.category){$('#calculation-content').innerHTML='<h3>'+esc(b.dataset.category)+' · booked entries</h3>'+ledgerTable(mission.ledger.filter(e=>e.category===b.dataset.category));return;}
  if(b.dataset.offer){offer(b.dataset.offer);return;}
  if(b.dataset.buy){act('improve',b.dataset.buy,selected);$('#game-calculations').close();render();feedback('Decision applied once. Inspect the queue and ledger for its effect.');return;}
  const action=b.dataset.action;
  if(action==='play')play();
  if(action==='advance'){pause();simulate(200,true);render();if($('#game-calculations').open)renderDetails();}
  if(action==='restart')restart();
  if(action==='new-plan')restart(true);
  if(action==='zoom'){if(view==='overview')changeView('interior');zoom=zoom>=2.2?1:zoom+.6;world.setView(view,zoom,zoom>1?mission.units[selected]:null);b.textContent=zoom===1?'Zoom +':'Zoom '+n(zoom,1)+'×';}
  if(action==='control'){const value=mission.units[selected].mode==='manual'?'auto':'manual';act('control',value,selected);if(value==='manual'){view='interior';zoom=1.4;world.setView(view,zoom,mission.units[selected]);if(reduced.matches)feedback('Reduced motion: use arrow buttons then +10s, or return to automatic control.');}render();}
  if(action==='handle'){act('handle',null,selected);if(!playing&&reduced.matches){simulate(12);render();}}
  if(action==='close-details')$('#game-calculations').close();
  if(action==='export'){const blob=new Blob([JSON.stringify({scenario,config,mission,actuals:warehouseActuals(mission)},null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='fieldwork-mission-'+config.seed+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
});
document.addEventListener('change',event=>{
  const e=event.target;
  if(e.id==='game-unit'||e.id==='inspect-unit'){selected=Number(e.value);render();if($('#game-calculations').open){inspectEvent=null;renderDetails();}return;}
  if(e.id==='mission-speed'){window.fmcGame.setSpeed(Number(e.value));return;}
  if(e.id==='service-policy'){act('policy',e.value,selected);feedback('Preventive policy updated. Existing obligations remain.');return;}
  if(e.id==='inspect-month'){inspectMonth=Number(e.value);inspectEvent=null;renderDetails();return;}
  if(mission.started)return;
  if(e.id==='game-model')commit(s=>s.fleets[selected].model=e.value);
  if(e.id==='game-hours')commit(s=>s.fleets.forEach(f=>f.hours=e.valueAsNumber));
  if(e.id==='game-fee')commit(s=>s.sites[0].revenue=e.valueAsNumber);
  if(e.id==='game-distance')commit(s=>s.worksheet.distanceKm=e.valueAsNumber);
  if(e.id==='game-placement')commit(s=>s.worksheet.placement=e.value);
  const configKey={'game-mechanics':'mechanics','game-seed':'seed','minor-rate':'minorRate','major-rate':'majorRate'}[e.id];
  if(configKey){try{const next={...config,[configKey]:e.valueAsNumber},fresh=createWarehouse(scenario,next);config=next;mission=fresh;if(runtime)watch(runtime.reset(mission));render();}catch(error){feedback(error.message);e.setAttribute('aria-invalid','true');}}
});
const keys={w:'up',ArrowUp:'up',s:'down',ArrowDown:'down',a:'left',ArrowLeft:'left',d:'right',ArrowRight:'right'};
document.addEventListener('keydown',event=>{
  if(/INPUT|SELECT|TEXTAREA/.test(event.target.tagName)||$('#game-calculations').open)return;
  if(mission.units[selected].mode!=='manual'||view!=='interior')return;
  const direction=keys[event.key]||keys[event.key.toLowerCase()];
  if(direction){event.preventDefault();act('move',direction,selected);held=direction;pressAt=mission.tick+1;if(!playing)renderWorld();}
  if(event.code==='Space'){event.preventDefault();act('handle',null,selected);}
});
document.addEventListener('keyup',()=>held=null);
document.addEventListener('pointerdown',event=>{const b=event.target.closest('[data-drive]');if(!b||b.disabled)return;event.preventDefault();held=b.dataset.drive;act('move',held,selected);pressAt=mission.tick+1;if(!playing)renderWorld();});
document.addEventListener('pointerup',()=>held=null);document.addEventListener('pointercancel',()=>held=null);
window.addEventListener('blur',()=>held=null);
document.addEventListener('visibilitychange',()=>{if(document.hidden)pause('Paused while this tab is hidden. Resume when ready.');last=0;accumulator=0;});
reduced.addEventListener('change',()=>{pause();zoom=1;world.setView(view,zoom);render();});
window.fmcGame={
  metrics:()=>({...metrics}),
  controlState:()=>{const u=mission.units[selected],j=mission.jobs.find(j=>j.id===u.job);return {unit:{job:u.job,load:u.load,fault:u.fault,service:u.service,phase:u.physical?.phase??u.phase},job:j?{source:j.source,destination:j.destination}:null};},
  // Scene updates need current facts, not a copy of forecast history and every planned route node.
  snapshot:({presentation:lean=false}={})=>structuredClone(lean?{mission:presentation.projectMission?presentation.projectMission(mission):{...mission,units:mission.units.map(u=>u.physical?{...u,physical:{pose:u.physical.pose,phase:u.physical.phase,fork:u.physical.fork,tilt:u.physical.tilt}}:u)},actuals:warehouseActuals(mission),unit:selected,playing,speed,reduced:reduced.matches}:{scenario,result:derived.result,advice:derived.advice,mission,actuals:warehouseActuals(mission),unit:selected,playing,speed,reduced:reduced.matches,metrics,world:world.metrics}),verify:()=>assertWarehouse(mission),
  state:()=>({time:mission.time,duration:config.monthSeconds,playing,speed,reduced:reduced.matches,started:mission.started,finished:mission.finished,continuous:!!config.continuous,error:runtimeError,manual:mission.units.some(u=>u.mode==='manual'),seekable:false,active:presentationActive}),
  play:()=>{if(!playing)play();},pause:()=>pause(),restart:()=>restart(),inspect:openDetails,enter:()=>changeView('interior'),
  selectUnit:index=>{if(Number.isInteger(index)&&index>=0&&index<mission.units.length)selectUnit(index);},
  setActive:active=>{if(presentationActive===!!active)return;presentationActive=!!active;if(!active)pause();},
  setSpeed:value=>{if(!Number.isFinite(value)||value<.25||value>maximumSpeed)return;speed=value;const select=$('#mission-speed');if(![...select.options].some(o=>Number(o.value)===value))select.add(new Option(value+'×',String(value)));select.value=String(value);}
};
render();
if(presentation.speed)window.fmcGame.setSpeed(presentation.speed);
addEventListener('pagehide',()=>runtime?.dispose());
