import {baseline,example} from './data/synthetic.js';
import {calculate} from './model.js';
import {units,sum,jobDuration} from './maintenance-engine.js';
import {COST_LABELS} from './finance-engine.js';
import {financeTimeline,financeChart,financeCostMix} from './finance-view.js';
import {logistics} from './workforce-engine.js';
import {ACTS,startAnimation} from './animation.js';
import {worksheetBaseline,SITE_TRAVEL_TYPES,applyDistanceTravel,averageMechanicComparison,comparePlacement,emptyWorksheetResult} from './worksheet-model.js';
const $=s=>document.querySelector(s),esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const n=(v,d=0)=>Number(v).toLocaleString('en-US',{maximumFractionDigits:d});
const rp=v=>'Rp '+n(v),compact=v=>'Rp '+(v/1e6).toLocaleString('en-US',{maximumFractionDigits:2})+'m';
const rpSummary=v=>Math.abs(v)>=1e9?'Rp '+n(v/1e9,2)+'B':Math.abs(v)>=1e6?'Rp '+n(v/1e6,2)+'M':rp(v);
const moneyShort=v=>Math.abs(v)>=1e9?n(v/1e9,2)+'B':Math.abs(v)>=1e6?n(v/1e6,1)+'M':Math.abs(v)>=1e3?n(v/1e3,1)+'K':n(v);
const moneyCell=v=>`<span class="money-full">${rp(v)}</span><span class="money-short" title="${rp(v)}" aria-label="${rp(v)}">${moneyShort(v)}</span>`;
const percent=v=>v===null?'—':v.toFixed(1)+'%',signed=v=>(v>=0?'+':'−')+n(Math.abs(v),1);
const worksheetView=new URLSearchParams(location.search).get('view')!=='demo';
const modules=worksheetView?[['fleet','Fleet & Site'],['forecast','Forecast'],['workforce','Manpower'],['logistics','Travel Assumptions'],['profit','Economics']]:[['fleet','Customer fleet'],['forecast','Maintenance'],['workforce','Workforce'],['logistics','Logistics'],['profit','Profitability']];
let manual=worksheetView?worksheetBaseline():baseline(),result=worksheetView?emptyWorksheetResult(manual):calculate(manual),selectedSite='A',selectedMonth=1,activeModule='fleet',standardModel=worksheetView?'FG-25':'WL-50',standardPackage=worksheetView?'250':'500';
let worksheetCalculated=false,worksheetAdvice=null;
let selectedFinanceYear=5,selectedFinanceChart='line',selectedFinanceBasis='cumulative',financeObserver;
let packageModelKey='FG-25',packageInterval=250;
let idle=!worksheetView,playing=!worksheetView&&!matchMedia('(prefers-reduced-motion: reduce)').matches,elapsed=0,lastTick=0,act=0,changeCount=0,cycles=0,pausedTime=0;
const demoBaseline=baseline(),demoPressure=example('pressure'),demoResult=calculate(demoBaseline),demoPressureResult=calculate(demoPressure);
const names={regular:'Current team',overtime:'A · Capped overtime',hire:'B · Additional mechanic',share:'C · Shared capacity'};
const locations=[['satellite','Satellite service office'],['branch','Main service branch'],['local','Local residence'],['site','Customer site'],['mess','Site accommodation / mess']];
function get(path,obj=manual){return path.split('.').reduce((a,k)=>a[k],obj);}
function set(path,value,obj){const keys=path.split('.'),last=keys.pop();keys.reduce((a,k)=>a[k],obj)[last]=value;}
function field(label,path,{min=0,max,step='any',type='number',help=''}={}){
  const id='f-'+path.replaceAll('.','-'),value=get(path);
  return `<label for="${id}">${esc(label)}<input id="${id}" data-path="${path}" type="${type}" value="${esc(value)}" ${type==='number'?`min="${min}" ${max!==undefined?`max="${max}"`:''} step="${step}"`:''}>${help?`<span class="field-help">${esc(help)}</span>`:''}</label>`;
}
function revenueSlider(){
  const id='f-sites-0-revenue',value=Number(get('sites.0.revenue')),count=sum(manual.fleets.map(f=>f.qty));
  return `<label class="worksheet-revenue-control" for="${id}"><span>Revenue / unit / month <output id="contract-revenue-value" for="${id}">${rp(value)}</output></span><input id="${id}" data-path="sites.0.revenue" type="range" min="0" max="20000000" step="100000" value="${value}" aria-label="Monthly contract revenue per unit in rupiah" aria-valuetext="${rp(value)}"><small class="worksheet-range-limits"><span>Rp 0</span><span>Rp 20m</span></small><small class="worksheet-revenue-total" id="revenue-total-preview">${n(count)} units · ${rp(value*count)} / month</small></label>`;
}
function averageStaffing(){
  const maintenance=worksheetCalculated&&worksheetAdvice?worksheetAdvice.maintenance:emptyWorksheetResult(manual).maintenance;
  const average=sum(maintenance.events.filter(e=>!e.repair).map(e=>e.wrench))/manual.months,travel=manual.sites[0].logistics.satelliteHours*manual.sites[0].logistics.trips;
  return{average,travel,...averageMechanicComparison(average,manual.worksheet.overtimeCap,travel)};
}
function roughMechanicEstimateMarkup(){
  if(!manual.fleets.some(f=>f.model))return '<div class="worksheet-quick-staff worksheet-empty">Select a unit to estimate staffing.</div>';
  const a=averageStaffing(),count=v=>Number.isFinite(v)?n(v):'—';
  return `<div class="worksheet-quick-staff" aria-live="polite"><span>Average month</span><dl><div><dt>Service hours</dt><dd>${n(a.average,1)}</dd></div><div><dt>Onsite</dt><dd>${count(a.dedicatedMechanics)}</dd></div><div><dt>Mobile</dt><dd>${count(a.mobileMechanics)}</dd></div><div><dt>Mobile + OT</dt><dd>${count(a.withOvertimeMechanics)}</dd></div></dl><button type="button" data-staffing-explain aria-label="Inspect staffing calculation">Details ↗</button></div>`;
}
function staffingDetails(){
  const a=averageStaffing(),cap=manual.worksheet.overtimeCap,fewer=a.mobileMechanics-1,extra=Number.isFinite(fewer)&&fewer>0?Math.max(0,a.average-fewer*a.mobileHours):0;
  $('#detail-title').textContent='Staffing calculation';
  $('#detail-body').innerHTML=table(['Average month','Hours / mechanic','Mechanics'],[['Onsite','176',n(a.dedicatedMechanics)],['Mobile',n(a.mobileHours,1),Number.isFinite(a.mobileMechanics)?n(a.mobileMechanics):'Unavailable'],['Mobile + overtime',n(a.mobileHours+cap,1),Number.isFinite(a.withOvertimeMechanics)?n(a.withOvertimeMechanics):'Unavailable']])+`<p class="note">${n(a.average,1)} service h/month ÷ available hours; rounded up.</p>`+table(['Input','Value'],[['Regular hours','22 × 8 = 176 h'],['Mobile travel',n(a.travel,1)+' h/month'],['OT limit',n(cap)+' h/person/month'],['OT needed',n(a.overtimeHours,1)+' h/month total']])+(a.travelExceedsWorkMonth?'<p class="note">Travel exceeds regular hours. Review the route.</p>':fewer>0&&a.withOvertimeMechanics===a.mobileMechanics?`<p class="note">${n(fewer)} mobile mechanic${fewer===1?' needs':'s need'} ${n(extra/fewer,1)} OT h each; limit ${n(cap)} h.</p>`:'')+'<p class="note">Average only. Final staffing checks peak months and crew limits.</p>';
  showDetailDialog();
}
function worksheetTravelEstimateMarkup(){
  const l=manual.sites[0].logistics,available=Math.max(0,176-l.satelliteHours*l.trips);
  return `<div class="worksheet-travel-estimate"><span>Round trip <strong>${n(l.satelliteHours,2)} h</strong></span><span>Mobile <strong>${n(available,1)} h/month</strong></span><button type="button" data-travel-explain aria-label="Inspect travel calculation">Details ↗</button></div>`;
}
function travelDetails(){
  const type=SITE_TRAVEL_TYPES[manual.worksheet.areaType],speed=(type.minSpeed+type.maxSpeed)/2,l=manual.sites[0].logistics;
  $('#detail-title').textContent='Travel calculation';
  $('#detail-body').innerHTML=table(['Item','Calculation'],[['Speed',`${type.label}: ${type.minSpeed}–${type.maxSpeed} km/h; midpoint ${speed}`],['Round trip',`${n(manual.worksheet.distanceKm)} km × 2 ÷ ${speed} = ${n(l.satelliteHours,2)} h`],['Monthly travel',`${n(l.satelliteHours,2)} h × ${n(l.trips)} days = ${n(l.satelliteHours*l.trips,1)} h`],['Mobile work',`176 − ${n(l.satelliteHours*l.trips,1)} = ${n(Math.max(0,176-l.satelliteHours*l.trips),1)} h/month`],['Onsite work','176 h/month; no travel']]);
  showDetailDialog();
}
function updateRoughMechanicEstimate(){const target=$('#rough-mechanic-estimate');if(target)target.innerHTML=roughMechanicEstimateMarkup();}
function selectField(label,path,options){const id='f-'+path.replaceAll('.','-');return `<label for="${id}">${esc(label)}<select id="${id}" data-path="${path}">${options.map(([v,l])=>`<option value="${esc(v)}" ${String(get(path))===String(v)?'selected':''}>${esc(l)}</option>`).join('')}</select></label>`;}
function monthName(m,s=manual,long=false){const [year,month]=s.start.split('-').map(Number);return new Date(Date.UTC(year,month+m-2,1)).toLocaleDateString('en-GB',{month:long?'long':'short',year:'numeric',timeZone:'UTC'});}
function estimatedDueDate(e,s=manual,r=result){
  const meter=r.maintenance.meters.find(m=>m.unit===e.unit&&m.month===e.month);
  if(!meter||meter.hours<=0)return monthName(e.month,s);
  const [year,month]=s.start.split('-').map(Number),monthStart=new Date(Date.UTC(year,month+e.month-2,1)),days=new Date(Date.UTC(monthStart.getUTCFullYear(),monthStart.getUTCMonth()+1,0)).getUTCDate();
  const dailyHours=meter.hours/days,day=Math.min(days,Math.max(1,Math.ceil((e.threshold-meter.start)/dailyHours)));
  return new Date(Date.UTC(monthStart.getUTCFullYear(),monthStart.getUTCMonth(),day)).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric',timeZone:'UTC'});
}
function siteIndex(){return manual.sites.findIndex(x=>x.id===selectedSite);}
function stats(entries){return `<div class="stats">${entries.map(([label,value,unit])=>`<div class="stat"><span>${label}</span><strong>${value}</strong><small>${unit||''}</small></div>`).join('')}</div>`;}
function title(h,p,tag=''){return `<div class="panel-title"><div><h3>${h}</h3><p>${p}</p></div>${tag?`<span>${tag}</span>`:''}</div>`;}
function table(headers,rows,cls=''){return `<div class="table-wrap"><table class="${cls}"><thead><tr>${headers.map(h=>`<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map(v=>`<td>${v}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;}
function enterManual(){
  if(idle){idle=false;playing=false;lastTick=0;updateScene();$('#change-note').textContent='Interactive mode · your scenario is active. Every accepted change recalculates the connected model.';}
}
function effective(){
  if(!idle)return {scenario:manual,result,site:selectedSite,month:selectedMonth};
  return {scenario:act===5?demoPressure:demoBaseline,result:act===5?demoPressureResult:demoResult,site:'A',month:Math.min(6,1+Math.floor(elapsed/8.2))};
}
function panelFleet(){
  if(worksheetView)return panelFleetWorksheet();
  const i=siteIndex(),s=manual.sites[i];
  return title('An existing contract. A real operating pattern.','Set the fleet assumptions that drive the maintenance forecast. Each unit retains its lifetime hour meter.',esc(s.contract))+
    `<div class="fields">${field('Customer / site name',`sites.${i}.name`,{type:'text'})}${field('Contract identifier',`sites.${i}.contract`,{type:'text'})}${field('Analysis starts','start',{type:'month'})}${field('Contract period · months','months',{min:1,max:24,step:1})}${field('Existing contract revenue · Rp',`sites.${i}.revenue`)}${selectField('Revenue basis',`sites.${i}.revenueBasis`,[['monthly','Per month'],['annual','Per year (÷ 12)']])}${field('Other operating cost · Rp / month',`sites.${i}.other`)}${field('Allocated overhead · Rp / month',`sites.${i}.overhead`)}</div>`+
    manual.fleets.map((f,i)=>f.site!==selectedSite?'':`<section class="fleet-group"><div class="group-heading"><span></span><strong>${esc(f.id)} / ${esc(manual.models[f.model].name)}</strong><em>${f.qty} unit${f.qty===1?'':'s'} · ${f.qty?`${esc(f.id)}-01 → ${esc(f.id)}-${String(f.qty).padStart(2,'0')}`:'empty group'}</em></div><div class="fields six">${selectField('Machine model',`fleets.${i}.model`,Object.entries(manual.models).map(([k,v])=>[k,k+' · '+v.name]))}${field('Units in this group',`fleets.${i}.qty`,{max:120,step:1})}${field('First unit meter · h',`fleets.${i}.start`,{max:1e6})}${field('Meter gap / unit · h',`fleets.${i}.stagger`,{max:10000,help:'Next unit meter = previous + gap.'})}${field('Hours / unit / month',`fleets.${i}.hours`,{max:744})}${field('Utilization change · %',`fleets.${i}.change`,{min:-100,max:200})}${field('Change begins in month',`fleets.${i}.changeMonth`,{min:1,max:24,step:1})}</div></section>`).join('')+
    `<div class="note">Unit n starts at <strong>first meter + (n − 1) × stagger</strong>. From the selected change month, hours = baseline × (1 + change %). The shift is a step change, not monthly compounding. A threshold exactly at the starting meter is assumed already serviced.</div><button class="primary" data-open="forecast">Run / inspect maintenance forecast →</button><p class="source-stamp">All calculations update automatically. Fleet limit: 120 units per group; up to 24 forecast months.</p>`;
}
function panelFleetWorksheet(){
  const total=sum(manual.fleets.map(f=>f.qty)),averageWork=worksheetCalculated?sum(result.maintenance.events.filter(e=>!e.repair).map(e=>e.wrench))/manual.months:0;
  const scheduledFor=f=>worksheetCalculated?result.maintenance.events.filter(e=>!e.repair&&e.unit.startsWith(f.id+'-')):[];
  return `<div class="worksheet-toolbar"><div class="worksheet-experience-links"><a href="?view=game" target="_blank" rel="noopener">Play the simulator ↗</a><a href="?view=film" target="_blank" rel="noopener">Watch calculation ↗</a></div><div><button id="load-worksheet-example">Sample</button><button id="clear-worksheet">Clear</button><button type="button" data-settings>Settings</button></div></div>
    <details class="worksheet-section" id="worksheet-section-fleet" open><summary class="worksheet-sheet-heading"><span>1</span><span class="worksheet-section-title">Fleet</span><small>${n(total)} units</small></summary><div class="worksheet-section-body">
    <div class="worksheet-fleet-wrap"><table class="worksheet-fleet"><thead><tr><th scope="col">No</th><th scope="col">Unit</th><th scope="col">Opening h</th><th scope="col">Hours/month</th><th scope="col">Schedule</th><th scope="col">Service h/month</th></tr></thead><tbody>
    ${manual.fleets.map((f,i)=>{const schedule=scheduledFor(f);return `<tr><th scope="row">${i+1}</th><td><select id="fleet-unit-${i}" data-path="fleets.${i}.model" aria-label="Row ${i+1} unit"><option value="">Select unit</option>${Object.entries(manual.models).map(([key,m])=>`<option value="${key}" ${key===f.model?'selected':''}>${esc(m.name)}</option>`).join('')}</select></td><td><input id="fleet-start-${i}" data-path="fleets.${i}.start" type="number" min="0" max="1000000" step="1" value="${f.start}" aria-label="Row ${i+1} opening meter in hours"></td><td><input id="fleet-hours-${i}" data-path="fleets.${i}.hours" type="number" min="0" max="744" step="1" value="${f.hours}" aria-label="Row ${i+1} operating hours per month"></td><td>${worksheetCalculated&&f.model?`<button type="button" class="unit-schedule-trigger" data-unit-schedule="${f.id}" aria-label="View maintenance schedule for row ${i+1}">${n(schedule.length)} services ↗</button>`:'—'}</td><td class="worksheet-formula-cell">${worksheetCalculated&&f.model?n(sum(schedule.map(e=>e.wrench))/manual.months,1):'—'}</td></tr>`;}).join('')}
    </tbody><tfoot><tr><th colspan="2" scope="row">${n(total)} units</th><td colspan="3">${worksheetCalculated?n(result.maintenance.events.length)+' services':''}</td><td id="worksheet-total-workload"><button type="button" class="workload-explain-trigger" data-workload-explain aria-label="Inspect monthly fleet workload"><span class="workload-pulse-node" aria-hidden="true"></span><span>${worksheetCalculated?n(averageWork,1)+' h/month':'—'}</span></button></td></tr></tfoot></table></div>
    </div></details><div id="rough-mechanic-estimate">${roughMechanicEstimateMarkup()}</div>
    <details class="worksheet-section" id="worksheet-section-site" open><summary class="worksheet-sheet-heading"><span>2</span><span class="worksheet-section-title">Contract</span></summary><div class="worksheet-section-body">
    <div class="fields">${field('Office distance · km','worksheet.distanceKm',{min:0,max:2000,step:1,help:'One way'})}${selectField('Area','worksheet.areaType',[['urban','Urban'],['rural','Rural']])}${field('Period · months','months',{min:1,max:60,step:1})}${field('Start month','start',{type:'month'})}</div>
    ${worksheetTravelEstimateMarkup()}<div class="worksheet-revenue-row worksheet-revenue-monthly">${revenueSlider()}</div>
    </div></details><div class="worksheet-action-row"><button class="primary" id="calculate-worksheet">Calculate</button><span id="worksheet-calculation-status" role="status">${worksheetCalculated?'Updated':total?'Ready':'Select a unit'}</span></div>
    ${worksheetCalculated?worksheetOutput():''}${worksheetPackageCalculator()}${worksheetSettings()}`;
}
function worksheetSettings(){
  const usage=manual.fleets.map((f,i)=>[`${i+1} · ${f.model?esc(manual.models[f.model].name):'Unused'}`,`<input id="fleet-change-${i}" data-path="fleets.${i}.change" type="number" min="-100" max="200" step="1" value="${f.change}" aria-label="Row ${i+1} operating hours change in percent">`,`<input id="fleet-change-month-${i}" data-path="fleets.${i}.changeMonth" type="number" min="1" max="60" step="1" value="${f.changeMonth}" aria-label="Row ${i+1} utilization change starts in month">`]);
  return `<details class="worksheet-section worksheet-settings" id="calculator-settings"><summary class="worksheet-sheet-heading"><span class="worksheet-section-title">Settings</span><small>Advanced</small></summary><div class="worksheet-section-body">
    <details class="worksheet-assumptions" id="contract-assumptions"><summary>Payroll & costs</summary><div class="fields">${field('Customer','sites.0.name',{type:'text'})}${field('Payroll / mechanic / month · Rp','worksheet.salary')}${field('OT limit · h/month','worksheet.overtimeCap',{max:80})}${field('Other costs / month · Rp','sites.0.other',{max:1e10})}${field('Overhead / month · Rp','sites.0.overhead',{max:1e10})}</div></details>
    <details class="worksheet-assumptions" id="travel-assumptions"><summary>Travel & stay</summary><div class="fields three">${field('Trips/month','sites.0.logistics.trips',{max:31,step:1})}${field('Cost / trip · Rp','sites.0.logistics.satelliteCost')}${field('Accommodation / month · Rp','sites.0.logistics.mess')}${field('Allowance / month · Rp','sites.0.logistics.allowance')}${field('Local transport / month · Rp','sites.0.logistics.localTransport')}<label class="check-label"><input type="checkbox" id="dedicated-accommodation" data-path="worksheet.dedicatedAccommodation" ${manual.worksheet.dedicatedAccommodation?'checked':''}>Onsite accommodation</label></div><p class="settings-note">Defaults: 22 workdays × 8 h. Travel time is automatic.</p></details>
    <details class="worksheet-assumptions" id="usage-settings"><summary>Usage changes</summary>${table(['Unit','Change %','From month'],usage,'worksheet-usage-table')}</details>
    ${standards()}${worksheetCalculated?'<button id="export-button">Export calculation</button>':''}</div></details>`;
}
function worksheetPackageCalculator(){
  const model=manual.models[packageModelKey],pkg=model.packages[packageInterval],events=worksheetCalculated?result.maintenance.events.filter(e=>e.model===packageModelKey&&e.package===packageInterval):[];
  const items=[...pkg.parts.map(i=>({...i,kind:'Part'})),...pkg.consumables.map(i=>({...i,kind:'Consumable'}))],perService=sum(items.map(i=>i.qty*i.price)),forecastTotal=perService*events.length;
  return `<details class="worksheet-section" id="worksheet-section-package"><summary class="worksheet-sheet-heading"><span>${worksheetCalculated?'5':'3'}</span><span class="worksheet-section-title">Parts & consumables</span></summary><div class="worksheet-section-body">
    <div class="worksheet-package-selectors"><label for="package-model-select">Model<select id="package-model-select">${Object.entries(manual.models).map(([key,value])=>`<option value="${key}" ${key===packageModelKey?'selected':''}>${esc(value.name)}</option>`).join('')}</select></label><label for="package-interval-select">Service<select id="package-interval-select">${[250,500,1000,2000].map(h=>`<option value="${h}" ${h===packageInterval?'selected':''}>${n(h)} h</option>`).join('')}</select></label><div class="worksheet-package-count">${worksheetCalculated?n(events.length)+' services · '+rp(forecastTotal)+' forecast':''}</div></div>
    <div class="worksheet-fleet-wrap"><table class="worksheet-package-table"><thead><tr><th scope="col">Type</th><th scope="col">Item</th><th scope="col">Qty</th><th scope="col">Price</th><th scope="col">Total</th></tr></thead><tbody>${items.map(i=>`<tr><td>${i.kind}</td><td>${esc(i.name)}</td><td>${n(i.qty,2)}</td><td>${rp(i.price)}</td><td>${rp(i.qty*i.price)}</td></tr>`).join('')}</tbody><tfoot><tr><th colspan="4" scope="row">Per service</th><td>${rp(perService)}</td></tr></tfoot></table></div>
    ${worksheetCalculated?`<details class="worksheet-assumptions" id="package-forecast"><summary>Forecast totals</summary>${table(['Item','Qty','Amount'],items.map(i=>[esc(i.name),n(i.qty*events.length,2),rp(i.qty*i.price*events.length)]))}</details>`:''}</div></details>`;
}
function worksheetOutput(){
  const a=worksheetAdvice,events=result.maintenance.events;
  const options=a.options.map(o=>[`${o.key==='dedicated'?'Onsite':'Mobile'}${a.suggested===o.key?'<small>Suggested</small>':''}${!o.feasible?'<small class="mobile-constraint negative">Review</small>':''}`,n(o.count),moneyCell(o.staffingCost/manual.months),o.feasible?'Covered':'Review',`<button data-placement="${o.key}" aria-label="${manual.worksheet.placement===o.key?'Selected':'Use'} ${o.key==='dedicated'?'onsite':'mobile'} plan" ${manual.worksheet.placement===o.key?'disabled':''}>${manual.worksheet.placement===o.key?'<span class="money-full">Selected</span><span class="money-short" aria-hidden="true">✓</span>':'Use'}</button>`]);
  const capacity=a.options.map(o=>{const count=o.count,travel=count?o.travelHours/manual.months/count:0,usable=count?sum(o.result.work.map(m=>m.sites.A.capacity))/manual.months/count:0;return[o.key==='dedicated'?'Onsite':'Mobile',count?'176':'0',n(travel,1),n(usable,1),n(o.peakShortfall,1)];});
  return `<details class="worksheet-section" id="worksheet-section-results" open><summary class="worksheet-sheet-heading"><span>3</span><span class="worksheet-section-title">Staffing</span><small>Peak workload</small></summary><div class="worksheet-section-body">${table(['Plan','<span class="money-full">Mechanics</span><span class="money-short">Team</span>','Staff cost/month','Status',''],options,'worksheet-plan-table')}
    <details class="worksheet-assumptions" id="staffing-capacity"><summary>Capacity details</summary>${table(['Item','Result'],[['Services',n(events.length)],['Work hours',n(sum(events.map(e=>e.wrench)),1)],['Peak h/month',n(a.peak,1)],['Minimum crew',n(a.crew)],...a.options.map(o=>[(o.key==='dedicated'?'Onsite':'Mobile')+' staff/month',rp(o.staffingCost/manual.months)])])}${table(['Per mechanic','Regular h','Travel h','Work h','Peak gap h'],capacity)}${a.options.filter(o=>!o.feasible).map(o=>`<p class="note">${o.key==='dedicated'?'Onsite':'Mobile'}: ${esc(o.issues.join(' ')||'Insufficient work hours.')}</p>`).join('')}<p class="settings-note">Monthly capacity check. Daily dispatch is not modeled.</p></details></div></details>${worksheetFinancialForecast()}`;
}
function worksheetFinancialForecast(){
  const f=result.financial[0],timeline=financeTimeline(f.months,selectedFinanceBasis,selectedFinanceYear),chart=financeChart(timeline),{years}=timeline,monthly=selectedFinanceBasis==='monthly';
  selectedFinanceYear=Math.min(selectedFinanceYear,years.length);
  const selected=years[selectedFinanceYear-1],marker=monthly?chart.markers.at(-1):chart.markers[selectedFinanceYear-1],firstNonnegativeMonth=years.find(y=>y.cumulativeProfit>=0)?.end;
  const hasRevenue=Number(manual.sites[0].revenue)>0,horizon=manual.months%12===0?`${manual.months/12} ${manual.months===12?'year':'years'}`:`${manual.months} ${manual.months===1?'month':'months'}`;
  const profitState=!hasRevenue?'is-pending':f.profit>0?'is-positive':f.profit<0?'is-negative':'is-even',verdict=!hasRevenue?'Set monthly revenue':f.profit>0?'Profitable':f.profit<0?'Loss':'Break-even';
  return `<details class="worksheet-section" id="worksheet-section-financial" open><summary class="worksheet-sheet-heading"><span>4</span><span class="worksheet-section-title">Revenue & cost</span><small>${horizon} · ${manual.worksheet.placement==='dedicated'?'Onsite':'Mobile'}</small></summary><div class="worksheet-section-body">
    <div class="finance-overview"><span>Contract total · ${horizon}</span><p class="worksheet-profit-status ${profitState}"><strong>${verdict}</strong>${!f.feasible?' · Review staffing':''}</p></div>
    <div class="worksheet-finance-summary"><div><span>Revenue</span><strong title="${rp(f.revenue)}" aria-label="${rp(f.revenue)}">${rpSummary(f.revenue)}</strong></div><div><span>Cost</span><strong title="${rp(f.direct+f.overhead)}" aria-label="${rp(f.direct+f.overhead)}">${rpSummary(f.direct+f.overhead)}</strong></div><div class="finance-profit ${f.profit<0?'is-loss':''}"><span>Profit</span><strong class="${f.profit>=0?'positive':'negative'}" title="${rp(f.profit)}" aria-label="${rp(f.profit)}">${rpSummary(f.profit)}</strong></div><div><span>Margin</span><strong>${percent(f.margin)}</strong></div></div>
    <div class="finance-dashboard"><figure class="finance-forecast" id="finance-forecast" data-chart-type="${selectedFinanceChart}" data-chart-basis="${selectedFinanceBasis}">
      <figcaption class="finance-chart-heading"><span class="finance-basis-control"><span class="finance-view-selector" role="group" aria-label="Forecast basis">${['cumulative','monthly'].map(basis=>`<button type="button" data-finance-basis="${basis}" aria-pressed="${selectedFinanceBasis===basis}" aria-controls="finance-plot">${basis[0].toUpperCase()+basis.slice(1)}</button>`).join('')}</span><small>${monthly?'Year '+selectedFinanceYear+' · ':''}Rp</small></span><span class="finance-view-selector" role="group" aria-label="Chart type">${['line','bars','area'].map(type=>`<button type="button" data-finance-chart="${type}" aria-pressed="${selectedFinanceChart===type}" aria-controls="finance-plot">${type[0].toUpperCase()+type.slice(1)}</button>`).join('')}</span></figcaption>
      <div class="worksheet-finance-legend"><span><i></i>Revenue</span><span><i class="cost"></i>Cost</span></div>
      <div class="finance-chart"><div class="finance-axis" aria-hidden="true">${[1,.75,.5,.25,0].map(t=>`<span style="top:${(1-t)*100}%">${moneyShort(timeline.ceiling*t)}</span>`).join('')}</div>
        <div class="finance-plot" id="finance-plot" style="${financeMarkerStyle(marker,chart)}">
          <svg viewBox="0 0 ${chart.width} ${chart.height}" preserveAspectRatio="none" role="img" aria-label="${monthly?'Monthly revenue and cost in rupiah for '+monthName(selected.start)+' to '+monthName(selected.end):'Cumulative revenue and cost in rupiah over '+horizon}"><title>${monthly?'Monthly revenue and cost · Year '+selectedFinanceYear:`Revenue ${rp(f.revenue)}; cost ${rp(f.direct+f.overhead)}`}</title><desc id="finance-chart-description">${financeChartDescription()}</desc>
            ${[0,.25,.5,.75,1].map(t=>`<line class="finance-grid" x1="0" x2="${chart.width}" y1="${t*chart.height}" y2="${t*chart.height}"/>`).join('')}
            <g class="finance-areas"><path class="finance-area" d="${chart.revenueArea}"/><path class="finance-area finance-cost-area" d="${chart.costArea}"/></g>
            <path class="finance-line finance-revenue-line" d="${chart.revenuePath}"/>
            <path class="finance-line finance-cost-line" d="${chart.costPath}"/>
            <g class="finance-bars">${chart.bars.map(bar=>`<g data-finance-bar-year="${bar.year}" data-selected="${bar.year===selectedFinanceYear}"><title>${monthly?monthName(bar.month):'Year '+bar.number+': cumulative'} revenue ${rp(bar.revenue)}, cost ${rp(bar.cost)}</title><rect class="finance-bar revenue" x="${bar.revenueX}" y="${bar.revenueY}" width="${bar.width}" height="${bar.revenueHeight}" rx="3"/><rect class="finance-bar cost" x="${bar.costX}" y="${bar.costY}" width="${bar.width}" height="${bar.costHeight}" rx="3"/></g>`).join('')}</g>
          </svg><div class="finance-guide" aria-hidden="true"></div><i class="finance-dot revenue" aria-hidden="true"></i><i class="finance-dot cost" aria-hidden="true"></i>
        </div><div class="finance-dates" id="finance-dates" aria-hidden="true">${financeDateLabels(timeline)}</div>
      </div><div class="finance-year-selector" role="group" aria-label="Inspect annual figures">${years.map(y=>`<button type="button" data-finance-year="${y.number}" aria-pressed="${y.number===selectedFinanceYear}" aria-controls="finance-year-readout">Year ${y.number}</button>`).join('')}</div>
      <div id="finance-year-readout" class="finance-year-readout" aria-live="polite" aria-atomic="true">${financeYearReadout(selected)}</div>
    </figure>${financeCostMixMarkup(f)}</div>
    <details class="worksheet-assumptions" id="forecast-details"><summary>Details</summary>${monthly?table(['Month','Revenue','Cost','Profit'],timeline.points.map(p=>[monthName(p.month),rp(p.revenue),rp(p.cost),rp(p.revenue-p.cost)]),'worksheet-monthly-exact'):''}${table(['Year','Revenue','Cost','Profit','Cumulative profit'],years.map(y=>[y.number,rp(y.revenue),rp(y.cost),rp(y.profit),rp(y.cumulativeProfit)]),'worksheet-forecast-exact')}${table(['Cost breakdown','Amount'],[...Object.entries(f.costs).filter(([,v])=>v!==0).map(([key,value])=>[esc(COST_LABELS[key]||key),rp(value)]),['Overhead',rp(f.overhead)],['Total',`<strong>${rp(f.direct+f.overhead)}</strong>`]])}${table(['Item','Value'],[['Monthly revenue',`${n(manual.fleets.filter(f=>f.model).length)} units × ${rp(manual.sites[0].revenue)}`],['Break-even year-end',hasRevenue&&firstNonnegativeMonth?monthName(firstNonnegativeMonth):'—'],['Cost includes','Parts, consumables, payroll, travel and overhead']])}<p class="settings-note">Flat rates. Meter-based services. No escalation.</p></details></div></details>`;
}
function financeDateLabels(timeline){
  if(selectedFinanceBasis==='monthly')return timeline.points.map((point,i)=>`<span style="left:${(i+.5)/timeline.points.length*100}%">${monthName(point.month).split(' ')[0].slice(0,3)}</span>`).join('');
  return selectedFinanceChart==='bars'?timeline.years.map((year,i)=>`<span style="left:${(i+.5)/timeline.years.length*100}%">Year ${year.number}</span>`).join(''):`<span>${monthName(1)}</span>${manual.months>2?`<span>${monthName(Math.ceil(manual.months/2))}</span>`:''}${manual.months>1?`<span>${monthName(manual.months)}</span>`:''}`;
}
function financeCostMixMarkup(financial){
  const mix=financeCostMix(financial);let position=0;
  const segments=mix.groups.map(group=>{const start=position;position+=group.percent;return `${group.color} ${start}% ${position}%`;});
  return `<section class="finance-cost-mix" aria-labelledby="finance-cost-title"><div class="finance-mix-heading"><strong id="finance-cost-title">Cost mix</strong><small>Contract total</small></div><div class="finance-mix-body"><div class="finance-donut" style="background:${mix.total?`conic-gradient(${segments.join(',')})`:'#e7ece4'}" aria-hidden="true"><div><span>Total cost</span><strong>${rpSummary(mix.total)}</strong></div></div><dl class="finance-mix-list">${mix.groups.map(group=>`<div data-cost-kind="${group.key}"><dt${group.key==='others'?' title="Travel, stay, allowances, overhead and other costs"':''}><i style="background:${group.color}" aria-hidden="true"></i>${group.label}</dt><dd><strong title="${rp(group.amount)}" aria-label="${rp(group.amount)}">${rpSummary(group.amount)}</strong><span>${n(group.percent,1)}%</span></dd></div>`).join('')}</dl></div></section>`;
}
function selectFinanceChart(type){
  selectedFinanceChart=type;$('#finance-forecast').dataset.chartType=type;
  $('#finance-dates').innerHTML=financeDateLabels(financeTimeline(result.financial[0].months,selectedFinanceBasis,selectedFinanceYear));
  $('#finance-chart-description').textContent=financeChartDescription();
  document.querySelectorAll('[data-finance-chart]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.financeChart===type)));
}
function financeChartDescription(){return(selectedFinanceBasis==='monthly'?'Separate monthly amounts for Year '+selectedFinanceYear+'.':selectedFinanceChart==='bars'?'Cumulative year-end totals.':'Cumulative monthly totals.')+' Exact values are in Details.';}
function selectFinanceBasis(basis){
  selectedFinanceBasis=basis;renderPanel();document.querySelector(`[data-finance-basis="${basis}"]`).focus({preventScroll:true});
}
function financeYearReadout(year){
  return `<div class="finance-year-label"><strong>Year ${year.number}</strong><span>${monthName(year.start)} – ${monthName(year.end)}</span></div><dl>${[['Revenue',year.revenue],['Cost',year.cost],['Profit',year.profit]].map(([label,value])=>`<div><dt>${label}</dt><dd class="${label==='Profit'?(value<0?'negative':'positive'):''}" title="${rp(value)}" aria-label="${rp(value)}">${rpSummary(value)}</dd></div>`).join('')}</dl>`;
}
function financeMarkerStyle(marker,chart){return `--finance-x:${marker.x/chart.width*100}%;--finance-revenue-y:${marker.revenueY/chart.height*100}%;--finance-cost-y:${marker.costY/chart.height*100}%`;}
function selectFinanceYear(year){
  if(selectedFinanceBasis==='monthly'){selectedFinanceYear=year;renderPanel();document.querySelector(`[data-finance-year="${year}"]`).focus({preventScroll:true});return;}
  const timeline=financeTimeline(result.financial[0].months),chart=financeChart(timeline);
  selectedFinanceYear=year;$('#finance-year-readout').innerHTML=financeYearReadout(timeline.years[year-1]);
  $('#finance-plot').style.cssText=financeMarkerStyle(chart.markers[year-1],chart);
  document.querySelectorAll('[data-finance-year]').forEach(button=>button.setAttribute('aria-pressed',String(+button.dataset.financeYear===year)));
  document.querySelectorAll('[data-finance-bar-year]').forEach(group=>group.dataset.selected=String(+group.dataset.financeBarYear===year));
}
function animateFinanceChart(){
  financeObserver?.disconnect();const chart=$('#finance-forecast');
  if(!chart||matchMedia('(prefers-reduced-motion: reduce)').matches||!('IntersectionObserver' in window))return;
  chart.classList.add('can-animate');
  financeObserver=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){chart.classList.add('is-visible');financeObserver.disconnect();}},{threshold:.15});
  financeObserver.observe(chart);
}
function panelWorksheetManpower(){
  const a=worksheetAdvice;
  return title('Dedicated or mobile / moving?','The same maintenance workload is compared with onsite mechanics and mobile mechanics whose paid travel time reduces usable work hours.','176 regular h / mechanic')+
    `<p class="worksheet-suggestion"><strong>Planning suggestion: ${a.suggested==='hybrid'?'Mobile / moving':a.suggested==='dedicated'?'Dedicated onsite':a.suggested==='none'?'No scheduled service':'Review'}</strong><br>${esc(a.reason)}</p>`+
    table(['Arrangement','Mechanics','Regular h / mechanic / month','Travel h / mechanic / month','Usable work h / mechanic / month','Peak uncovered h','Staffing + delivery / period','Constraint assessment'],a.options.map(o=>{const count=o.count,regular=count?sum(o.scenario.mechanics.map(m=>m.alloc.A))/count:0,travel=count?o.travelHours/manual.months/count:0,usable=count?sum(o.result.work.map(m=>m.sites.A.capacity))/manual.months/count:0;return[o.key==='dedicated'?'Dedicated onsite':'Mobile / moving between sites',n(count),n(regular,1),n(travel,1),n(usable,1),n(o.peakShortfall,1),rp(o.staffingCost),o.feasible?'Aggregate covered · daily schedule unverified':'Infeasible · '+esc(o.issues.join(' '))];}))+
    `<div class="worksheet-plan-actions">${a.options.map(o=>`<button data-placement="${o.key}" ${manual.worksheet.placement===o.key?'disabled':''}>${manual.worksheet.placement===o.key?'Selected: ':'Use '}${o.key==='dedicated'?'dedicated':'mobile / moving'}</button>`).join('')}</div>`+
    `<h3 class="subheading">Month-by-month coverage</h3>`+table(['Month','Wrench h','Occupied crew h','Dedicated usable h','Mobile usable h','Mobile shortfall h'],Array.from({length:manual.months},(_,i)=>{const d=a.options[0].result.work[i].sites.A,h=a.options[1].result.work[i].sites.A;return[monthName(i+1),n(d.wrench,1),n(d.personnel,1),n(d.capacity,1),n(h.capacity,1),n(h.shortfall,1)];}))+
    `<p class="note">The dedicated headcount covers peak monthly occupied time and the package’s simultaneous crew requirement. Dedicated mechanics are modeled onsite with no travel hours. Mobile mechanic need is calculated from peak occupied hours divided by 176 regular hours less each mechanic’s grouped travel time, while also meeting simultaneous crew requirements. Both options charge assigned payroll once; travel expenses remain separate. No overtime is added automatically.</p>`;
}
function panelWorksheetTravel(){
  return title('Travel and placement assumptions','Mobile travel time reduces its 176 regular monthly hours. Dedicated mechanics are onsite and have no travel hours.','Planning inputs')+
    `<div class="fields">${field('One-way distance to nearest satellite / branch office · km','worksheet.distanceKm',{min:0,max:2000,step:1})}${selectField('Site area','worksheet.areaType',Object.entries(SITE_TRAVEL_TYPES).map(([k,p])=>[k,p.label]))}</div>${worksheetTravelEstimateMarkup()}
    <div class="fields">${field('Round trips / mobile mechanic / month','sites.0.logistics.trips',{max:31,step:1,help:'Default: one round trip each workday (22 per month).'})}${field('Mobile travel · Rp / round trip','sites.0.logistics.satelliteCost')}</div>
    <label class="check-label"><input type="checkbox" id="dedicated-accommodation" data-path="worksheet.dedicatedAccommodation" ${manual.worksheet.dedicatedAccommodation?'checked':''}>Dedicated arrangement needs site accommodation</label>
    <div class="fields three">${field('Accommodation · Rp / mechanic / month','sites.0.logistics.mess')}${field('Living allowance · Rp / month','sites.0.logistics.allowance')}${field('Local transport · Rp / month','sites.0.logistics.localTransport')}</div>
    <p class="note">Dedicated mechanics start onsite and carry no modeled travel hours. Accommodation costs can still be included. Mobile mechanics’ paid round trips reduce their available work capacity.</p><button class="primary" id="calculate-worksheet">Recalculate arrangements</button>`;
}
function pendingWorksheet(){return `<div class="worksheet-pending"><h3>Calculate the fleet worksheet first.</h3><p>Enter the unit types, quantities, office distance and area in Fleet & Site. The forecast and staffing assessment will appear after calculation.</p><button data-open="fleet">Go to Fleet & Site</button></div>`;}
function updateWorksheetStatus(){
  const total=sum(manual.fleets.map(f=>f.qty));$('#worksheet-total-units')&&($('#worksheet-total-units').textContent=n(total));
  const status=$('#worksheet-calculation-status');if(status)status.textContent=worksheetCalculated?'Updated':manual.fleets.some(f=>f.model)?'Ready':'Select a unit';
}
function runWorksheet(placement=null){
  try{
    worksheetAdvice=comparePlacement(manual);
    const recommendation=worksheetAdvice.suggested,optionKey=['hybrid','dedicated'].includes(placement)?placement:['hybrid','dedicated'].includes(recommendation)?recommendation:recommendation==='none'?'dedicated':manual.worksheet.placement;
    manual.worksheet.placement=optionKey;const option=worksheetAdvice.options.find(o=>o.key===optionKey);manual.mechanics=structuredClone(option.scenario.mechanics);result=option.result;
    worksheetCalculated=true;selectedMonth=Math.min(selectedMonth,manual.months);$('#input-error').hidden=true;renderSelectors();renderPanel();
    $('#change-note').textContent='Calculated from the current fleet, operating assumptions and site. '+worksheetAdvice.reason;
  }catch(error){worksheetCalculated=false;renderPanel();showError(error.message);}
}
function commitWorksheet(next,label,input){
  if(input&&['number','range'].includes(input.type)){
    const value=get(input.dataset.path,next),min=input.min===''?0:+input.min,max=input.max===''?Infinity:+input.max;
    if(!Number.isFinite(value)||value<min||value>max||(input.step==='1'&&!Number.isInteger(value))){showError(`${label}: enter a valid ${input.step==='1'?'whole ':''}number.`,input);const old=get(input.dataset.path);input.value=input.dataset.path.endsWith('.qty')&&!old?'':old;return false;}
  }
  if(input&&['worksheet.distanceKm','worksheet.areaType'].includes(input.dataset.path)){
    try{applyDistanceTravel(next);}catch(error){showError(error.message,input);input.value=get(input.dataset.path);return false;}
  }
  const hadResults=worksheetCalculated;
  manual=next;worksheetCalculated=false;worksheetAdvice=null;changeCount++;$('#input-error').hidden=true;
  if(hadResults){runWorksheet(manual.worksheet.placement);if(input?.id)document.getElementById(input.id)?.focus({preventScroll:true});return true;}
  $('#change-note').textContent='Worksheet inputs changed. Calculate to refresh the maintenance and manpower estimate.';
  updateWorksheetStatus();
  const rerender=hadResults||input?.dataset.path?.startsWith('models.')||input?.dataset.path?.endsWith('.model')||input?.dataset.path==='months'||input?.dataset.path==='worksheet.distanceKm'||input?.dataset.path==='worksheet.areaType'||input?.dataset.path==='sites.0.revenueBasis'||!input;
  if(rerender){renderSelectors();renderPanel();if(input?.id)document.getElementById(input.id)?.focus({preventScroll:true});}
  else updateRoughMechanicEstimate();
  return true;
}
function standards(){
  const base=`models.${standardModel}.packages.${standardPackage}`,p=get(base),model=manual.models[standardModel];
  const rows=['parts','consumables'].flatMap(kind=>p[kind].map((item,i)=>`<tr><td>${kind==='parts'?'Part':'Consumable'}</td><td><input type="text" data-path="${base}.${kind}.${i}.name" aria-label="${kind==='parts'?'Part':'Consumable'} item ${i+1} name" value="${esc(item.name)}"></td><td><input type="number" min="0" step="any" data-path="${base}.${kind}.${i}.qty" aria-label="${kind==='parts'?'Part':'Consumable'} item ${i+1} quantity" value="${item.qty}"></td><td><input type="number" min="0" step="1" data-path="${base}.${kind}.${i}.price" aria-label="${kind==='parts'?'Part':'Consumable'} item ${i+1} unit price" value="${item.price}"></td><td class="package-line-total">${rp(item.qty*item.price)}</td><td><button data-remove-item="${kind}:${i}" aria-label="Remove ${esc(item.name)}">×</button></td></tr>`));
  const packageTotal=sum([...p.parts,...p.consumables].map(item=>item.qty*item.price));
  return `<details class="standards" id="standards-editor"><summary>${worksheetView?'Service standards':'Inspect & edit synthetic maintenance standards'}</summary><div class="package-selectors"><label for="standard-model">Model<select id="standard-model">${Object.keys(manual.models).map(k=>`<option value="${k}" ${k===standardModel?'selected':''}>${esc(worksheetView?manual.models[k].name:k)}</option>`).join('')}</select></label><label for="standard-package">Service<select id="standard-package">${Object.keys(model.packages).map(k=>`<option value="${k}" ${k===standardPackage?'selected':''}>${k}h ${k==='2000'?' / overhaul':''}</option>`).join('')}</select></label><span>Sample values</span></div>
    <div class="fields three">${field(worksheetView?'Work h':'Standard wrench man-hours',base+'.wrench',{max:1000})}${field(worksheetView?'Crew':'Required / planned crew',base+'.crew',{min:1,max:10,step:1})}${field(worksheetView?'Efficiency':'Practical crew efficiency',base+'.efficiency',{min:.1,max:1,step:.05})}${field(worksheetView?'Min. duration · h':'Minimum elapsed hours',base+'.minDuration',{max:176})}${field(worksheetView?'Window · days':'Service window · workdays',base+'.windowDays',{min:1,max:22,step:1})}</div>
    <div class="note">${worksheetView?`Complete package · ${n(jobDuration(p.wrench,p.crew,p.efficiency,p.minDuration).elapsed,2)} h elapsed. Lower packages are not added.`:`This is one complete ${standardPackage}h package. Lower packages are never added again. Ideal duration = ${p.wrench} ÷ ${p.crew} = ${n(p.wrench/p.crew,2)}h. Practical duration = max(wrench ÷ crew ÷ efficiency, minimum) = ${n(jobDuration(p.wrench,p.crew,p.efficiency,p.minDuration).elapsed,2)}h.`}</div>
    <div class="standards-table"><table class="package-editor-table"><thead><tr><th>Type</th><th>Item</th><th>Qty</th><th>Price</th><th>Subtotal</th><th></th></tr></thead><tbody>${rows.join('')}</tbody><tfoot><tr><th colspan="4">Total</th><td>${rp(packageTotal)}</td><td></td></tr></tfoot></table></div>
    <div class="package-editor-actions"><button data-add-item="parts">＋ Part</button><button data-add-item="consumables">＋ Consumable</button></div><p class="source-stamp">Cycle: ${model.cycle} h · lifetime meter.</p></details>`;
}
function panelForecast(){
  const all=result.maintenance.events.filter(e=>e.site===selectedSite),events=all.filter(e=>e.month===selectedMonth),meters=result.maintenance.meters.filter(m=>m.site===selectedSite&&m.month===selectedMonth);
  return title('Operating hours become scheduled work.','Select a month, then inspect any service record. Material subtotals use that event’s complete package; payroll and logistics are allocated separately.',all.length+' EVENTS / PERIOD')+
    `<div class="calendar">${Array.from({length:manual.months},(_,i)=>{const e=all.filter(e=>e.month===i+1);return `<button data-month="${i+1}" class="${selectedMonth===i+1?'active':''}" aria-pressed="${selectedMonth===i+1}"><span>${monthName(i+1).toUpperCase()}</span><b>${e.length} events</b><em>${n(sum(e.map(x=>x.wrench)),1)} wrench h</em></button>`;}).join('')}</div>`+
    table(['Unit / record','Model','Meter due','Complete package','Wrench h','Crew / elapsed','Material subtotal'],events.slice(0,400).map(e=>[`<button data-event="${e.id}">${esc(e.unit)} ↗</button>`,e.model,e.threshold===null?'Repair':n(e.threshold)+'h',e.package==='Repair'?'Repair':n(e.package)+'h',n(e.wrench,1),`${e.crew} / ${n(e.duration,1)}h`,rp(e.partsCost+e.consumablesCost)]))+
    (events.length===0?'<p class="note">No thresholds crossed in this month. Reserved payroll and selected logistics still apply.</p>':'')+
    (events.length>400?'<p class="note">First 400 records displayed. Every event remains included in the totals and exported calculation.</p>':'')+
    `<details class="standards"><summary>Inspect unit meter progression · ${monthName(selectedMonth)}</summary>${table(['Unit','Starting meter','Operating hours','Ending meter'],meters.map(m=>[esc(m.unit),n(m.start,1),n(m.hours,1),n(m.end,1)]))}</details>`+standards();
}
function comparison(){
  const choices=manual.target===selectedSite?result.options:calculate({...manual,target:selectedSite}).options;
  const base=choices.find(o=>o.strategy==='regular'),bf=base.financial.find(f=>f.site===selectedSite);
  const pool=o=>sum(o.financial.map(f=>f.direct))+sum(o.work.map(w=>w.unallocatedPayroll));
  return `<h3 class="subheading">Overtime, hiring or shared capacity?</h3><p>Capacity columns show <strong>${monthName(selectedMonth)}</strong>. Costs and profit cover all <strong>${manual.months} contract months</strong>. Applying an option targets ${esc(manual.sites[siteIndex()].name)} only.</p>`+
    table(['Workforce decision','Covered / demand','Shortfall / spare','Δ contract cost','Δ underlying pool cost','Contract margin','Constraint status'],choices.map(o=>{
      const w=o.work[selectedMonth-1].sites[selectedSite],f=o.financial.find(f=>f.site===selectedSite),l=f.costs;
      const applied=o.strategy===manual.strategy&&(manual.target===selectedSite||manual.strategy==='regular');
      return [`<strong>${names[o.strategy]}</strong><small>${applied?'ACTIVE ASSUMPTION':''}</small><button data-strategy="${o.strategy}" ${applied?'disabled':''}>${applied?'Applied':'Apply option'}</button>`,`${n(w.covered,1)} / ${n(w.personnel,1)}h<small>${n(w.otHours,1)}h overtime</small>`,`${n(w.shortfall,1)}h gap<small>${n(w.remaining,1)}h spare regular</small>`,`${compact(f.direct-bf.direct)}<small>Travel ${compact(l.travel)}<br>Mess ${compact(l.accommodation)}</small>`,`${compact(pool(o)-pool(base))}<small>Includes unallocated payroll</small>`,`${percent(f.margin)}<small>${compact(f.profit)} profit</small>`,w.feasible?'Aggregate covered<small>Daily sequence unverified</small>':`<span class="neg">Infeasible</span><small>${w.shortfall>0?'Monthly capacity shortfall. ':''}${esc(w.issues.join(' '))}</small>`];
    }),'comparison-table')+
    `<div class="note">Overtime is paid at the configured hourly cost, capped once per person for the target site. Hiring adds one fully loaded mechanic for the whole period. Sharing draws only on unallocated or surplus regular hours after protecting the other site's workload; it adds travel when a new route is opened. A lower bound is not a daily dispatch guarantee.</div><div class="fields three">${field('New mechanic · loaded Rp / month','hire.salary')}${selectField('New mechanic starting location','hire.location',locations)}<div class="field-help">The hiring alternative uses regular hours only. If one new mechanic is insufficient, the remaining gap stays visible.</div></div>`;
}
function panelWorkforce(){
  if(worksheetView)return worksheetCalculated?panelWorksheetManpower():pendingWorksheet();
  const month=result.work[selectedMonth-1],a=month.sites[selectedSite];
  return title('One person. One shared capacity budget.','Reserve hours across the two contracts. Unreserved salary remains in the pool; reserved idle time stays attributable to the contract.','8 × 22 = 176h')+
    `<div class="worker-board">${manual.mechanics.map((m,i)=>`<section class="worker"><div class="worker-heading"><span class="worker-avatar" aria-hidden="true"></span><div><h4>${esc(m.name)}</h4><small>${m.id} · ${n(m.salary/1e6,1)}m / month</small></div></div><div><div class="capacity"><span class="A" style="width:${(m.alloc.A||0)/176*100}%"></span><span class="B" style="width:${(m.alloc.B||0)/176*100}%"></span></div><div class="capacity-legend"><span>A · ${n(m.alloc.A||0)}h</span><span>B · ${n(m.alloc.B||0)}h</span><span>${n(176-sum(Object.values(m.alloc)))}h free</span></div></div><div class="fields">${manual.sites.map(site=>field(`Reserve to ${site.id} · hours`,`mechanics.${i}.alloc.${site.id}`,{max:176})).join('')}</div><div class="allocation-note"><span class="field-help">${esc(locations.find(x=>x[0]===m.location)[1])}</span><button data-dedicate="${i}">Dedicate to ${selectedSite}</button></div><details><summary>Payroll & overtime assumptions</summary><div class="fields">${field('Loaded payroll · Rp / month',`mechanics.${i}.salary`)}${field('Overtime · Rp / extra hour',`mechanics.${i}.otRate`)}${field('Overtime cap · h / month',`mechanics.${i}.otLimit`,{max:80})}</div></details></section>`).join('')}</div>`+
    stats([['Scheduled wrench work',n(a.wrench,1),'man-hours'],['Practical occupied time',n(a.personnel,1),'crew hours before travel'],['Paid travel',n(a.travelHours,1),'personnel-hours'],['Lower-bound mechanics',a.requiredMechanics,'ceil((occupied + travel) ÷ 176)']])+
    `<p class="note ${a.feasible?'':'danger'}">${a.feasible?'Aggregate monthly workload is covered. Daily sequencing and concurrent-job availability remain unverified.':`Infeasible: ${n(a.shortfall,1)} maintenance personnel-hours remain uncovered. ${esc(a.issues.join(' '))}`}</p>`+
    table(['Mechanic / origin','Reserved h','Travel h','Usable regular h','Overtime h','Allocated payroll'],a.assignments.map(x=>[`${x.id} · ${x.mode}`,n(x.reserved,1),n(x.hours,1),n(x.capacity,1),n(x.otHours,1),rp(x.pay)]))+
    `<p class="source-stamp">${monthName(selectedMonth)}: allocated payroll ${rp(sum(Object.values(month.sites).map(a=>a.regularPayroll+a.additionalPayroll)))} + unallocated pool ${rp(month.unallocatedPayroll)} = underlying payroll ${rp(month.payroll)}.</p>`+comparison();
}
function panelLogistics(){
  if(worksheetView)return panelWorksheetTravel();
  const i=siteIndex(),base=`sites.${i}.logistics`,a=result.work[selectedMonth-1].sites[selectedSite];
  return title('Location changes both cost and capacity.','Trips are planned per assigned mechanic per month and may bundle many jobs. Paid travel reduces the regular hours available for maintenance.','ROUND TRIPS')+
    `<div class="worker-board">${manual.mechanics.map((m,i)=>`<section class="worker"><div class="worker-heading"><span class="worker-avatar" aria-hidden="true"></span><div><h4>${esc(m.name)}</h4><small>${m.id} / ORIGIN</small></div></div><div class="fields">${selectField('Starting location',`mechanics.${i}.location`,locations)}${selectField('Home / resident site',`mechanics.${i}.homeSite`,manual.sites.map(s=>[s.id,s.id+' · '+s.name]))}</div><button data-mess="${i}">${m.location==='mess'?'Remove mess · use satellite':'Add mess at selected site'}</button></section>`).join('')}</div>`+
    `<div class="note">Local residents incur the selected commute assumptions, without accommodation. A mechanic based at a customer site incurs local transport only. Mess residents use rotation travel, mess, allowance and local transport; routine office trips are excluded. Assignments away from a home site use the editable satellite / intersite route.</div>`+
    `<h3>Office travel · ${esc(manual.sites[i].name)}</h3><div class="fields">${field('Satellite round trip · paid h',base+'.satelliteHours',{max:176})}${field('Satellite round trip · Rp',base+'.satelliteCost')}${field('Branch round trip · paid h',base+'.branchHours',{max:176})}${field('Branch round trip · Rp',base+'.branchCost')}${field('Grouped round trips / month',base+'.trips',{max:31,step:1})}</div>`+
    `<h3 class="subheading">Local return assignments</h3><div class="fields three">${field('Commute round trip · paid h',base+'.commuteHours',{max:176})}${field('Commute round trip · Rp',base+'.commuteCost')}${field('Commute trips / month',base+'.commuteTrips',{max:31,step:1})}</div>`+
    `<h3 class="subheading">Remote stay / mess</h3><div class="fields three">${field('Rotation round trip · paid h',base+'.rotationHours',{max:176})}${field('Rotation round trip · Rp',base+'.rotationCost')}${field('Rotations / month',base+'.rotations',{max:31,step:1})}${field('Mess · Rp / person / month',base+'.mess')}${field('Living allowance · Rp / month',base+'.allowance')}${field('Local transport · Rp / month',base+'.localTransport')}</div>`+
    stats([['Paid travel',n(a.travelHours,1),'personnel-hours / month'],['Travel / transport',compact(a.travel),monthName(selectedMonth)],['Accommodation',compact(a.accommodation),'selected residents only'],['Living allowance',compact(a.allowance),'selected residents only']]);
}
function panelProfit(){
  const f=result.financial.find(f=>f.site===selectedSite),i=siteIndex(),repair=manual.repair;
  const warning=f.margin===null?'Margin is undefined at zero revenue. The cost forecast still applies.':f.margin<0?'Planned costs exceed existing contract revenue under these assumptions.':f.margin<10?'Limited margin remains for unexpected repairs and other contract risks.':'This synthetic scenario retains more room for unexpected costs. It is not a guarantee of future profitability.';
  const ledger=Object.entries(COST_LABELS).map(([key,label])=>[label,rp(f.costs[key])]);
  return title('What does this contract actually contribute?','Revenue and costs use the same forecast period. Contribution is before allocated overhead; estimated operating profit is after it.',`${manual.months} MONTHS / ${monthName(1)} → ${monthName(manual.months)}`)+
    `<div class="profit-summary"><div class="big ${f.margin<0?'negative':''}">${percent(f.margin)}</div><div><p><strong>${warning}</strong></p><p>${repair.enabled?'Includes the optional hypothetical repair.':'Maintenance-only estimate. Unexpected repairs are excluded.'}</p></div></div>`+
    (!f.feasible?'<p class="note danger">Staffing or job constraints are infeasible in at least one month. All forecast materials are costed, but uncovered work is not treated as completed. This is a conditional cost plan, not a fully staffed delivery plan.</p>':'<p class="note">Aggregate capacity and simple crew / duration bounds pass. Daily dispatch scheduling remains unverified.</p>')+
    `<div class="two-col"><div><table class="cost-ledger"><tbody><tr class="total"><td>Existing revenue</td><td>${rp(f.revenue)}</td></tr>${ledger.map(([label,value])=>`<tr><td>${label}</td><td>${value}</td></tr>`).join('')}<tr class="total"><td>Total direct cost</td><td>${rp(f.direct)}</td></tr><tr class="total"><td>Contract contribution</td><td>${rp(f.contribution)}</td></tr><tr><td>Allocated overhead</td><td>${rp(f.overhead)}</td></tr><tr class="profit"><td>Estimated operating profit</td><td>${rp(f.profit)}</td></tr></tbody></table></div><div><h3>Inspectable assumptions</h3><div class="fields">${field('Existing revenue · Rp',`sites.${i}.revenue`)}${selectField('Revenue period',`sites.${i}.revenueBasis`,[['monthly','Monthly'],['annual','Annual (÷ 12)']])}${field('Other cost · Rp / month',`sites.${i}.other`)}${field('Overhead · Rp / month',`sites.${i}.overhead`)}</div><p class="note">Payroll allocation = loaded monthly salary × reserved contract hours ÷ 176. Reserved idle time stays with the contract. Unallocated salary stays in the mechanic pool. Overhead is an explicit planning allocation, not a claim of perfect attribution.</p><p>Current workforce decision: <strong>${names[manual.strategy]}</strong>. The repair test does not silently add overtime.</p><button data-open="workforce">Compare workforce decisions →</button><button id="export-button">Export reproducible calculation ↓</button></div></div>`+
    `<h3 class="subheading">Month-by-month economics</h3>`+table(['Month','Revenue','Direct cost','Contribution','Overhead','Operating profit','Margin','Capacity'],f.months.map(m=>[monthName(m.month),rp(m.revenue),rp(m.direct),rp(m.contribution),rp(m.overhead),rp(m.profit),percent(m.margin),m.feasible?'Aggregate covered':'Infeasible']))+
    `<section class="repair-box"><label class="check-label" for="repair-enabled"><input type="checkbox" id="repair-enabled" data-path="repair.enabled" ${repair.enabled?'checked':''}><strong>Simulate Breakdown · optional repair stress test</strong></label><p>Hypothetical sensitivity only. Repair cost and capacity demand apply only while enabled. Recorded downtime is informational; forecast operating hours and revenue are held constant. No availability guarantee or penalty is invented.</p>${repair.enabled?`<div class="fields three">${selectField('Affected unit','repair.unit',units(manual).map(u=>[u.id,u.id+' · '+u.model]))}${field('Repair month','repair.month',{min:1,max:manual.months,step:1})}${field('Repair wrench man-hours','repair.wrench',{max:1000})}${field('Repair parts · Rp','repair.parts')}${field('Required repair crew','repair.crew',{min:1,max:10,step:1})}${field('Additional downtime · days','repair.downtime',{max:30})}<label class="check-label"><input type="checkbox" id="repair-urgent" data-path="repair.urgent" ${repair.urgent?'checked':''}>Urgent · one workday window</label></div><p class="note warning">${repair.downtime} days of hypothetical downtime. ${repair.urgent?'8':'40'} working hours allowed for the job; wrench ÷ crew = ${n(repair.wrench/repair.crew,1)}h elapsed. Inspect crew and capacity warnings in Workforce.</p>`:''}</section>`;
}
function renderPanel(){
  const oldDetails=[...$('#panel').querySelectorAll('details')].map((d,index)=>({id:d.id,index,open:d.open}));
  if(worksheetView&&!worksheetCalculated&&['forecast','profit'].includes(activeModule))$('#panel').innerHTML=pendingWorksheet()+(activeModule==='forecast'?standards():'');
  else $('#panel').innerHTML=({fleet:panelFleet,forecast:panelForecast,workforce:panelWorkforce,logistics:panelLogistics,profit:panelProfit})[activeModule]();
  for(const state of oldDetails){const detail=state.id?document.getElementById(state.id):$('#panel').querySelectorAll('details')[state.index];if(detail)detail.open=state.open;}
  if(worksheetView)animateFinanceChart();
  document.dispatchEvent(new Event('fmc:rendered'));
  const tabs=$('#module-tabs');if(tabs)tabs.innerHTML=modules.map(([key,label],i)=>`<button data-module="${key}" class="${key===activeModule?'active':''}" aria-current="${key===activeModule?'page':'false'}"><b>${String(i+1).padStart(2,'0')}</b>${label}</button>`).join('');
}
function renderSelectors(){
  if(worksheetView)return;
  $('#contract-select').innerHTML=(worksheetView?manual.sites.slice(0,1):manual.sites).map(s=>`<option value="${s.id}" ${s.id===selectedSite?'selected':''}>${esc(s.contract)} · ${esc(s.name)}</option>`).join('');
  $('#month-select').innerHTML=Array.from({length:manual.months},(_,i)=>`<option value="${i+1}" ${i+1===selectedMonth?'selected':''}>${monthName(i+1)}</option>`).join('');
  $('#period-label').textContent=manual.months+' MONTH CONTRACT FORECAST';
}
function updateScene(){
  if(worksheetView){updateWorksheetStatus();return;}
  const {scenario:s,result:r,site,month}=effective(),a=r.work[month-1].sites[site],f=r.financial.find(f=>f.site===site),siteData=s.sites.find(x=>x.id===site);
  const fleet=s.fleets.filter(g=>g.site===site),totalUnits=sum(fleet.map(g=>g.qty)),events=r.maintenance.events.filter(e=>e.site===site&&e.month===month),operating=sum(r.maintenance.meters.filter(m=>m.site===site&&m.month===month).map(m=>m.hours));
  $('#mode-label').textContent=idle?(playing?'GUIDED DEMO':'DEMO PAUSED'):'INTERACTIVE';$('#mode-button').textContent=idle?'Take control ↗':'Return to demo ↗';
  $('#world-contract').textContent=siteData.contract+' · '+siteData.name.toUpperCase();
  $('#act-number').textContent=idle?String(act+1).padStart(2,'0')+' / 08':'LIVE MODEL';$('#story-month').textContent=monthName(month,s).toUpperCase();
  $('#act-title').textContent=idle?ACTS[act].title:({fleet:'Hours drive the forecast.',forecast:'A complete package. Once.',workforce:'Capacity has a limit.',logistics:'Distance has a cost.',profit:'Follow the contract margin.'}[activeModule]);
  $('#act-copy').textContent=idle?ACTS[act].copy:`${totalUnits} units. ${events.length} service events this month. ${a.shortfall>0?n(a.shortfall,1)+' personnel-hours remain uncovered.':'Monthly workload fits aggregate capacity.'} Change an assumption to follow its consequences.`;
  $('#mini-ledger').innerHTML=[['Revenue',f.revenue],['Materials',f.costs.parts+f.costs.consumables+f.costs.repairParts],['People + logistics',f.direct-f.costs.parts-f.costs.consumables-f.costs.repairParts-f.costs.other],['Other + overhead',f.costs.other+f.overhead]].map(([k,v])=>`<div><span>${k}</span><b>${compact(v)}</b></div>`).join('');
  $('#hero-margin').textContent=percent(f.margin);$('#hero-margin').style.color=f.margin<0?'#e2a493':'#dcba85';$('#margin-label').textContent='OPERATING MARGIN / '+s.months+' MONTHS';
  $('#hero-status').textContent=!f.feasible?'Capacity / job constraints remain infeasible.':f.margin!==null&&f.margin<10?'Limited room for unexpected repairs.':'After explicitly allocated overhead.';
  $('#hero-margin').style.fontSize='';
  if(idle&&act<5){
    const materials=f.costs.parts+f.costs.consumables,payroll=f.costs.regularPayroll+f.costs.additionalPayroll+f.costs.overtime,travel=f.costs.travel+f.costs.accommodation+f.costs.allowance;
    $('#mini-ledger').innerHTML=[['Existing revenue',compact(f.revenue)],['Materials',act>=2?compact(materials):'To forecast'],['Payroll',act>=3?compact(payroll):'To allocate'],['Logistics',act>=4?compact(travel):'To inspect']].map(([k,v])=>`<div><span>${k}</span><b>${v}</b></div>`).join('');
    $('#margin-label').textContent=act===0?'SERVICE DIVISION / AGGREGATE':'IDENTIFIED COST / '+s.months+' MONTHS';
    $('#hero-margin').textContent=act===0?'Positive':act<2?'—':compact(materials+(act>=3?payroll:0)+(act>=4?travel:0));
    $('#hero-margin').style.fontSize=act===0?'30px':act<2?'46px':'27px';
    $('#hero-status').textContent=act===0?'Qualitative context. No historical amount implied.':act<2?'Operating assumptions come first.':'The cost model builds as each assumption enters.';
  }
  if(idle&&act===5){
    $('#mini-ledger').innerHTML=r.options.map(o=>{const w=o.work[month-1].sites[site];return `<div><span>${{regular:'Current team',overtime:'Capped overtime',hire:'One additional hire',share:'Shared capacity'}[o.strategy]}</span><b>${n(w.shortfall,1)}h gap</b></div>`;}).join('');
    $('#hero-status').textContent='Stress fixture · compare remaining workload above.';
  }
  const chain=[['fleet','OPERATING HOURS',n(operating,0)+'h',totalUnits+' units / month'],['forecast','MAINTENANCE',events.length, n(sum(events.map(e=>e.wrench)),1)+' wrench man-hours'],['workforce','PEOPLE',n(a.personnel,1)+'h',n(a.capacity,1)+'h usable regular'],['logistics','LOGISTICS',n(a.travelHours,1)+'h',compact(a.travel+a.accommodation+a.allowance)+' / month'],['profit','CONTRACT MARGIN',percent(f.margin),s.months+' months · after overhead']];
  $('#causal-chain').innerHTML=chain.map(([key,label,value,note])=>`<button class="chain-step" data-module="${key}"><span>${label}</span><strong>${value}</strong><small>${note}</small></button>`).join('');
  const group=manual.fleets.find(g=>g.site===selectedSite)||manual.fleets[0];
  $('#hours-slider').max=Math.min(744,Math.floor(744/Math.max(1,1+group.change/100)));$('#hours-slider').value=group.hours;$('#hours-value').innerHTML=n(group.hours)+' <small>h / unit / month</small>';
  $('#slider-group').textContent=group.id+' · '+group.model+' · '+manual.sites.find(s=>s.id===group.site).name+' (your scenario)';
  $('#play-button').textContent=idle&&playing?'Ⅱ Pause':idle?'▶ Play':'▶ Demo';$('#play-button').setAttribute('aria-label',idle&&playing?'Pause guided demonstration':'Play guided demonstration');
  for(const button of $('#act-track').children){button.classList.toggle('active',idle&&+button.dataset.act===act);button.setAttribute('aria-current',idle&&+button.dataset.act===act?'step':'false');}
}
function showError(message,target){$('#input-error').hidden=false;$('#input-error').textContent=message+(worksheetView?'':' Previous valid results remain displayed.');target?.setAttribute('aria-invalid','true');$('#change-note').textContent='Input not applied: '+message;}
function commit(next,label,{panel=true,focusId=null}={}){
  if(worksheetView)return commitWorksheet(next,label,focusId?document.getElementById(focusId):null);
  try{
    const nextResult=calculate(next),old=result.financial.find(f=>f.site===selectedSite),fresh=nextResult.financial.find(f=>f.site===selectedSite);
    const oldEvents=result.maintenance.events.filter(e=>e.site===selectedSite).length,newEvents=nextResult.maintenance.events.filter(e=>e.site===selectedSite).length;
    const oldW=sum(result.work.map(w=>w.sites[selectedSite].wrench)),newW=sum(nextResult.work.map(w=>w.sites[selectedSite].wrench));
    manual=next;result=nextResult;selectedMonth=Math.min(selectedMonth,manual.months);changeCount++;
    $('#input-error').hidden=true;renderSelectors();if(panel)renderPanel();updateScene();
    $('#change-note').textContent=`${label} · ${signed(newEvents-oldEvents)} service events · ${signed(newW-oldW)} wrench hours · ${compact(fresh.profit-old.profit)} change in period profit. All dependent results recalculated.`;
    if(focusId)document.getElementById(focusId)?.focus({preventScroll:true});
    return true;
  }catch(error){showError(error.message,focusId?document.getElementById(focusId):null);return false;}
}
function openModule(module,scroll=false){enterManual();activeModule=module;renderPanel();updateScene();if(scroll)$('#workbench').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});}
function startDemo(reset=false){idle=true;playing=!matchMedia('(prefers-reduced-motion: reduce)').matches;if(reset)elapsed=0;act=Math.floor(elapsed/7)%8;lastTick=0;updateScene();$('#change-note').textContent='Guided demonstration · your editable scenario is preserved below. Reduced-motion users can select each numbered act.';}
function showDetailDialog(){const dialog=$('#detail-dialog');if(!dialog.open)dialog.showModal();}
function eventDetails(id,returnUnit=null){
  const e=result.maintenance.events.find(e=>e.id===id);if(!e)return;
  const materials=e.partsCost+e.consumablesCost,labor=worksheetView?e.wrench*manual.worksheet.salary/176:0;
  $('#detail-title').textContent=`${e.unit} · ${e.package==='Repair'?'Repair':e.package+' h service'}`;
  $('#detail-body').innerHTML=(returnUnit?`<button type="button" class="detail-back" data-unit-schedule="${esc(returnUnit)}" data-return-workload="true">← ${esc(returnUnit)} schedule</button>`:'')+
    `<p>${monthName(e.month)} · ${e.model} · ${e.threshold===null?'Optional hypothetical event':'Lifetime meter '+n(e.threshold)+'h'}</p>`+stats([['Work',n(e.wrench,2),'man-hours'],['Crew',e.crew,'mechanics'],['Ideal time',n(e.ideal,2),'hours'],['Elapsed time',n(e.duration,2),'hours']])+`<p class="note">Crew time: ${n(e.personnel,2)} h · window: ${e.windowDays} days.</p>`+
    (worksheetView?stats([['Parts',rp(e.partsCost),''],['Consumables',rp(e.consumablesCost),''],['Labour',rp(labor),'work h × payroll ÷ 176'],['Total',rp(materials+labor),'per service']]):'')+
    ['parts','consumables'].map(k=>`<h3>${k==='parts'?'Parts':'Consumables'}</h3>`+table(['Item','Qty','Price','Total'],e[k].map(i=>[esc(i.name),n(i.qty,2),rp(i.price),rp(i.total)]))).join('')+`<p>Material subtotal: <strong>${rp(materials)}</strong>. Travel and overhead are counted in the forecast.</p>`;
  showDetailDialog();
}
function unitSchedule(unitId,returnToWorkload=false){
  const fleet=manual.fleets.find(f=>f.id===unitId);if(!fleet?.model)return;
  const model=manual.models[fleet.model],events=result.maintenance.events.filter(e=>!e.repair&&e.unit.startsWith(unitId+'-'));
  const laborRate=manual.worksheet.salary/176,labor=e=>e.wrench*laborRate,materials=sum(events.map(e=>e.partsCost+e.consumablesCost)),laborTotal=sum(events.map(labor)),wrenchTotal=sum(events.map(e=>e.wrench));
  $('#detail-title').textContent=`${unitId} · ${model.name}`;
  $('#detail-body').innerHTML=(returnToWorkload?'<button type="button" class="detail-back" data-workload-explain>← Fleet</button>':'')+
    `<p>${n(events.length)} services · ${manual.months} months · ${n(fleet.hours)} h/month · opening ${n(fleet.start)} h</p>`+
    stats([['Work hours',n(wrenchTotal,1),''],['Materials',rp(materials),''],['Labour',rp(laborTotal),''],['Total',rp(materials+laborTotal),'forecast']])+
    `<p class="note">Labour = work h × monthly payroll ÷ 176. Select a service for items.</p>`+
    (events.length?`<div class="table-wrap unit-schedule-wrap"><table class="unit-schedule-table"><thead><tr><th scope="col">Est. date</th><th scope="col">Meter h</th><th scope="col">Service</th><th scope="col">Work h</th><th scope="col">Parts</th><th scope="col">Consumables</th><th scope="col">Labour</th><th scope="col">Est. total</th></tr></thead><tbody>${events.map(e=>{const material=e.partsCost+e.consumablesCost,label=Number(e.package)===2000?'Overhaul':n(e.package)+'h';return `<tr><td>~${estimatedDueDate(e,manual,result)}</td><td>${n(e.threshold)}h</td><td><button type="button" class="unit-service-detail" data-event="${esc(e.id)}" data-return-unit="${esc(unitId)}" aria-label="Inspect parts, consumables and labour for ${esc(unitId)} ${esc(label)} service">${label} ↗</button></td><td>${n(e.wrench,1)}</td><td>${rp(e.partsCost)}</td><td>${rp(e.consumablesCost)}</td><td>${rp(labor(e))}</td><td><strong>${rp(material+labor(e))}</strong></td></tr>`;}).join('')}</tbody><tfoot><tr><th colspan="3" scope="row">Schedule total</th><td>${n(wrenchTotal,1)}h</td><td>${rp(sum(events.map(e=>e.partsCost)))}</td><td>${rp(sum(events.map(e=>e.consumablesCost)))}</td><td>${rp(laborTotal)}</td><td>${rp(materials+laborTotal)}</td></tr></tfoot></table></div>`:'<p class="note">No services due in this period.</p>');
  showDetailDialog();
}
function workloadCalculationDetails(){
  const units=manual.fleets.filter(f=>f.model&&f.qty>0),events=worksheetCalculated?result.maintenance.events.filter(e=>!e.repair):[],total=worksheetCalculated?sum(events.map(e=>e.wrench)):0,average=total/manual.months;
  $('#detail-title').textContent='Monthly workload';
  $('#detail-body').innerHTML=`<p>Monthly average = total service hours ÷ forecast months.</p>`+
    (worksheetCalculated?stats([['Service hours',n(total,1),'total'],['Period',n(manual.months),'months'],['Monthly average',n(average,1),'hours']])+table(['Unit','Services','Total hours','Hours/month'],units.map(f=>{const eventsForUnit=events.filter(e=>e.unit.startsWith(f.id+'-')),hours=sum(eventsForUnit.map(e=>e.wrench));return[`<button type="button" class="workload-unit-trigger" data-unit-schedule="${esc(f.id)}" data-return-workload="true" aria-label="Inspect ${esc(f.id)} maintenance schedule with parts, consumables and labour">${esc(f.id)} · ${esc(manual.models[f.model].name)} ↗</button>`,n(eventsForUnit.length),n(hours,1)+' h',n(hours/manual.months,1)+' h / month'];})):`<p class="note">Calculate to view each unit’s service hours.</p>`)+
    `<p class="note">Average over ${n(manual.months)} months; peaks can be higher.</p>`;
  showDetailDialog();
}
document.addEventListener('click',event=>{
  if(event.target.closest('#workbench summary'))enterManual();
  const button=event.target.closest('button');if(!button)return;
  if(worksheetView&&button.id==='calculate-worksheet'){runWorksheet();return;}
  if(worksheetView&&['load-worksheet-example','clear-worksheet'].includes(button.id)){
    manual=worksheetBaseline(button.id==='load-worksheet-example');result=emptyWorksheetResult(manual);worksheetCalculated=false;worksheetAdvice=null;selectedMonth=1;$('#input-error').hidden=true;renderSelectors();renderPanel();if(button.id==='load-worksheet-example')runWorksheet();updateWorksheetStatus();$('#change-note').textContent=button.id==='load-worksheet-example'?'Synthetic sample fleet loaded at Rp 20,000,000 per unit per month. Review the assumptions before calculating.':'Ten blank fleet rows are ready for entry.';return;
  }
  if(worksheetView&&button.dataset.placement){runWorksheet(button.dataset.placement);return;}
  if(worksheetView&&button.dataset.financeYear){selectFinanceYear(+button.dataset.financeYear);return;}
  if(worksheetView&&button.dataset.financeChart){selectFinanceChart(button.dataset.financeChart);return;}
  if(worksheetView&&button.dataset.financeBasis){selectFinanceBasis(button.dataset.financeBasis);return;}
  if(worksheetView&&button.dataset.settings!==undefined){const settings=$('#calculator-settings');settings.open=true;settings.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});settings.querySelector('summary').focus({preventScroll:true});return;}
  if(button.dataset.staffingExplain!==undefined){staffingDetails();return;}
  if(button.dataset.travelExplain!==undefined){travelDetails();return;}
  if(button.dataset.module){openModule(button.dataset.module,button.classList.contains('scene-hit'));return;}
  if(button.dataset.open){openModule(button.dataset.open);return;}
  if(button.dataset.month){enterManual();selectedMonth=+button.dataset.month;renderSelectors();renderPanel();updateScene();return;}
  if(button.dataset.workloadExplain!==undefined){workloadCalculationDetails();return;}
  if(button.dataset.unitSchedule){unitSchedule(button.dataset.unitSchedule,button.dataset.returnWorkload==='true');return;}
  if(button.dataset.event){enterManual();eventDetails(button.dataset.event,button.dataset.returnUnit||null);return;}
  if(button.dataset.act!==undefined){idle=true;playing=false;act=+button.dataset.act;elapsed=act*7+.2;lastTick=0;updateScene();return;}
  if(button.dataset.strategy){enterManual();const next=structuredClone(manual);next.strategy=button.dataset.strategy;next.target=selectedSite;commit(next,names[next.strategy]+' applied');return;}
  if(button.dataset.dedicate!==undefined){enterManual();const next=structuredClone(manual),m=next.mechanics[+button.dataset.dedicate];m.alloc=Object.fromEntries(next.sites.map(s=>[s.id,s.id===selectedSite?176:0]));commit(next,m.name+' dedicated to '+selectedSite);return;}
  if(button.dataset.mess!==undefined){enterManual();const next=structuredClone(manual),m=next.mechanics[+button.dataset.mess];m.location=m.location==='mess'?'satellite':'mess';m.homeSite=selectedSite;commit(next,m.name+' location changed');return;}
  if(button.dataset.addItem||button.dataset.removeItem){enterManual();const next=structuredClone(manual),p=next.models[standardModel].packages[standardPackage];if(button.dataset.addItem)p[button.dataset.addItem].push({name:'Synthetic item',qty:1,price:0});else{const[k,i]=button.dataset.removeItem.split(':');p[k].splice(+i,1);}commit(next,'Complete service package edited');$('#standards-editor').open=true;return;}
  switch(button.id){
    case 'mode-button':idle?enterManual():startDemo();break;
    case 'play-button':if(!idle)startDemo();else{playing=!playing;lastTick=0;updateScene();}break;
    case 'replay-button':startDemo(true);break;
    case 'return-demo':if(worksheetView){location.href='?view=demo';break;}startDemo();window.scrollTo({top:0,behavior:'smooth'});break;
    case 'story-action':openModule(idle?ACTS[act].module:activeModule,true);break;
    case 'reset-button':enterManual();manual=baseline();selectedSite='A';selectedMonth=1;result=calculate(manual);$('#example-select').value='baseline';$('#input-error').hidden=true;renderSelectors();renderPanel();updateScene();$('#change-note').textContent='Synthetic baseline restored. Repair stress test is off; current team uses regular hours.';break;
    case 'about-button':enterManual();$('#about-dialog').showModal();break;
    case 'close-about':$('#about-dialog').close();break;
    case 'close-detail':$('#detail-dialog').close();break;
    case 'export-button':{const scenario=worksheetView?worksheetAdvice.options.find(o=>o.key===manual.worksheet.placement).scenario:manual;const file=new Blob([JSON.stringify({schema:worksheetView?'fmc-worksheet-v1':'scene05-fmc-v1',synthetic:true,...(worksheetView?{worksheet:manual,packageSelection:{model:packageModelKey,interval:packageInterval}}:{}),scenario,result},null,2)],{type:'application/json'}),url=URL.createObjectURL(file),a=document.createElement('a');a.href=url;a.download=worksheetView?'fmc-worksheet-calculation.json':'fmc-synthetic-calculation.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);break;}
  }
});
document.addEventListener('change',event=>{
  const input=event.target;
  if(worksheetView&&input.id==='package-model-select'){packageModelKey=input.value;standardModel=packageModelKey;renderPanel();return;}
  if(worksheetView&&input.id==='package-interval-select'){packageInterval=+input.value;standardPackage=String(packageInterval);renderPanel();return;}
  if(input.dataset.path){enterManual();const next=structuredClone(manual),value=input.type==='checkbox'?input.checked:['number','range'].includes(input.type)?(worksheetView&&input.value===''?0:input.valueAsNumber):input.value;set(input.dataset.path,value,next);
    if(worksheetView){
      const match=/^fleets\.(\d+)\.model$/.exec(input.dataset.path);
      if(match){const row=next.fleets[+match[1]];row.qty=value?1:0;row.stagger=0;}
      commitWorksheet(next,input.getAttribute('aria-label')||input.closest('label')?.childNodes[0]?.textContent?.trim()||'Worksheet input',input);return;
    }
    commit(next,input.closest('label')?.childNodes[0]?.textContent?.trim()||'Assumption changed',{focusId:input.id});return;}
  if(input.id==='contract-select'){enterManual();selectedSite=input.value;renderPanel();updateScene();return;}
  if(input.id==='month-select'){enterManual();selectedMonth=+input.value;renderPanel();updateScene();return;}
  if(input.id==='example-select'){enterManual();manual=example(input.value);result=calculate(manual);selectedSite='A';selectedMonth=1;$('#input-error').hidden=true;renderSelectors();renderPanel();updateScene();$('#change-note').textContent='Synthetic example loaded: '+input.selectedOptions[0].textContent+'.';return;}
  if(input.id==='standard-model'||input.id==='standard-package'){enterManual();if(input.id==='standard-model')standardModel=input.value;else standardPackage=input.value;renderPanel();$('#standards-editor').open=true;}
});
document.addEventListener('input',event=>{
  const slider=event.target;if(worksheetView&&slider.id==='f-sites-0-revenue'){const value=slider.valueAsNumber,count=sum(manual.fleets.map(f=>f.qty));$('#contract-revenue-value').textContent=rp(value);$('#revenue-total-preview').textContent=`${n(count)} units · ${rp(value*count)} / month`;slider.setAttribute('aria-valuetext',rp(value));}
});
$('#hours-slider').addEventListener('input',event=>{enterManual();const next=structuredClone(manual),i=manual.fleets.findIndex(g=>g.site===selectedSite);next.fleets[i<0?0:i].hours=+event.target.value;commit(next,'Monthly operating hours changed',{panel:true});});
$('#workbench').addEventListener('focusin',event=>{if(event.target.matches('input,select'))enterManual();});
$('#hours-slider').addEventListener('focus',enterManual);
document.addEventListener('visibilitychange',()=>{lastTick=0;});
$('#act-track').innerHTML=ACTS.map((a,i)=>`<button data-act="${i}" aria-label="Act ${i+1}: ${a.title}">${String(i+1).padStart(2,'0')}</button>`).join('');
if(worksheetView){
  document.documentElement.classList.add('calculator-view');document.title='FMC Calculator';
  $('.intro')?.remove();$('footer').innerHTML='<span>Synthetic defaults · adjust in Settings.</span>';
  $('.workbench-heading')?.remove();$('#workbench').removeAttribute('aria-labelledby');$('#workbench').setAttribute('aria-label','Full maintenance contract worksheet');
  $('.selection-bar').remove();$('#module-tabs').remove();
  $('#change-note').textContent='Enter your fleet, opening meters, operating hours, office distance and site area in this worksheet, then calculate workload and mechanic options.';
}else document.title='The Hidden Economics of Maintenance · Scene 05';
renderSelectors();renderPanel();updateScene();
const animation=worksheetView?{metrics:{frames:0,totalRenderMs:0,maxRenderMs:0},media:matchMedia('(prefers-reduced-motion: reduce)')}:startAnimation(()=>({...effective(),idle,playing,act,time:idle?elapsed:pausedTime}), (now,reduced)=>{
  if(lastTick&&idle&&playing&&!reduced){elapsed+=(now-lastTick)/1000;if(elapsed>=56){elapsed%=56;cycles++;}}
  if(!reduced)pausedTime+=lastTick?Math.min((now-lastTick)/1000,.1):0;
  lastTick=now;const next=Math.floor(elapsed/7)%8;
  if(next!==act){act=next;updateScene();}
  const demoMonth=Math.min(6,1+Math.floor(elapsed/8.2));if(idle&&$('#story-month').textContent!==monthName(demoMonth,demoBaseline).toUpperCase())updateScene();
  $('#demo-time').textContent=String(Math.floor(elapsed)).padStart(2,'0')+' / 56s';
});
animation.media.addEventListener('change',()=>{playing=false;lastTick=0;updateScene();});
// Read-only snapshot for reproducible browser acceptance, no mutation API.
window.fmc={snapshot:()=>structuredClone({scenario:manual,result,selectedSite,selectedMonth,activeModule,idle,playing,elapsed,act,cycles,changeCount,worksheetView,worksheetCalculated,worksheetAdvice,metrics:animation.metrics})};
if(worksheetView&&new URLSearchParams(location.search).get('view')==='film'){
  $('#load-worksheet-example').click();
  packageInterval=1000;renderPanel();
  const {startWorksheetFilm}=await import('./worksheet-film.js');
  startWorksheetFilm({panel:$('#panel'),scenario:manual,result,advice:worksheetAdvice});
}
