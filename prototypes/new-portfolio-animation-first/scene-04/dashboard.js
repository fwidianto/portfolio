import {SITES} from './data/synthetic-records.js';
import {latestRecords} from './data/latest-records.js';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const n=v=>Number(v).toLocaleString('en-US',{maximumFractionDigits:4});
export function dashboardData(model,site='all'){
 const locations=SITES.filter(s=>site==='all'||s.id===site),units=latestRecords(model.master('unit',site),r=>r.site+'|'+r.unit);
 const issues=latestRecords(model.master('breakdown',site),r=>r.site+'|'+r.incident).filter(r=>r.status!=='Resolved');
 const hours=locations.map(s=>{const rows=units.filter(r=>r.site===s.id);return {site:s.id,operating:rows.reduce((a,r)=>a+r.operating,0),downtime:rows.reduce((a,r)=>a+r.downtime,0),ids:rows.map(r=>r.id)};});
 const parts=new Map();for(const r of model.master('parts',site)){const key=r.part+'|'+r.uom,p=parts.get(key)||{part:r.part,description:r.description,uom:r.uom,quantity:0,ids:[]};p.quantity+=r.quantity;p.ids.push(r.id);parts.set(key,p);}
 const labor=locations.map(s=>{const rows=model.master('labor',site).filter(r=>r.site===s.id);return {site:s.id,hours:rows.reduce((a,r)=>a+r.manHours,0),ids:rows.map(r=>r.id)};});
 return {summary:{...model.overview(site),units:units.length,breakdowns:issues.length},hours,parts:[...parts.values()],labor,issues};
}
export function dashboardMarkup(model,site='all',uom='PCS'){
 const d=dashboardData(model,site),recent=new Set(model.recent),hit=ids=>ids.some(id=>recent.has(id));
 const parts=d.parts.filter(r=>r.uom===uom).sort((a,b)=>b.quantity-a.quantity||a.part.localeCompare(b.part));
 const maxHours=Math.max(1,...d.hours.map(r=>r.operating+r.downtime)),maxParts=Math.max(1,...parts.map(r=>r.quantity)),maxLabor=Math.max(1,...d.labor.map(r=>r.hours));
 const route=(tab,s)=>`data-dashboard-tab="${tab}" data-dashboard-site="${s}"`;
 const bar=(value,max,kind)=>`<span class="db-bar ${kind}" style="--bar-width:${value/max*100}%"></span>`;
 return `<div class="dashboard-content"><div class="db-heading"><div><p>HQ / OPERATIONAL OVERVIEW</p><h3>From records to an operating picture.</h3></div><span class="db-synthetic">SYNTHETIC DATA</span></div>
 <div class="db-summary">${[['Reporting sites',d.summary.sites],['Units reporting',d.summary.units],['Open breakdowns',d.summary.breakdowns],['Maintenance records',d.summary.maintenance]].map(([label,value])=>`<div><span>${label}</span><strong>${n(value)}</strong></div>`).join('')}</div>
 <div class="db-grid"><section class="db-chart db-hours"><header><h4>Operating time & downtime</h4><span>Latest report per unit · hours</span></header><div class="db-legend"><span>● Operating</span><span>● Recorded downtime</span></div>${d.hours.map(r=>`<button class="db-row ${hit(r.ids)?'db-recent':''}" ${route('unit',r.site)} aria-label="Site ${r.site}: ${n(r.operating)} operating hours, ${n(r.downtime)} downtime hours. Inspect source records."><span>Site ${r.site}</span><span class="db-track">${bar(r.operating,maxHours,'operating')}${bar(r.downtime,maxHours,'downtime')}</span><strong>${n(r.operating)} / ${n(r.downtime)} h</strong></button>`).join('')}</section>
 <section class="db-chart"><header><h4>Parts consumed</h4><label>Unit <select class="db-parts-unit" aria-label="Parts measurement unit">${[...new Set(['PCS','SET',...d.parts.map(r=>r.uom)])].map(unit=>`<option ${unit===uom?'selected':''}>${esc(unit)}</option>`).join('')}</select></label></header>${parts.length?parts.map(r=>`<button class="db-row db-part-row ${hit(r.ids)?'db-recent':''}" ${route('parts',site)} data-part="${esc(r.part)}" data-quantity="${r.quantity}" title="${esc(r.part+' · '+r.description)}"><span>${esc(r.description)}<small>${esc(r.part)}</small></span><span class="db-track">${bar(r.quantity,maxParts,'parts')}</span><strong>${n(r.quantity)} ${esc(uom)}</strong></button>`).join(''):'<p class="db-empty">No parts recorded in this unit.</p>'}<p class="db-note">${n(parts.reduce((a,r)=>a+r.quantity,0))} ${esc(uom)} · quantities stay separate by unit</p></section>
 <section class="db-chart"><header><h4>Labor effort</h4><span>Technicians × hours each</span></header>${d.labor.map(r=>`<button class="db-row ${hit(r.ids)?'db-recent':''}" ${route('labor',r.site)}><span>Site ${r.site}</span><span class="db-track">${bar(r.hours,maxLabor,'labor')}</span><strong>${n(r.hours)} mh</strong></button>`).join('')}</section>
 <section class="db-chart db-issues"><header><h4>Issues still requiring attention</h4><span>Latest status per incident</span></header>${d.issues.length?d.issues.map(r=>`<button class="db-issue" ${route('breakdown',r.site)}><span>Site ${r.site} · ${esc(r.unit)}<small>${esc(r.incident)}</small></span><span>${esc(r.issue)}</span><strong>${esc(r.status)}</strong></button>`).join(''):'<p class="db-empty">No open breakdowns in the selected records.</p>'}</section></div>
 <p class="db-method">Click a chart row to inspect its source worksheet. Latest dates determine unit and incident status; visitor entries take precedence on equal dates. Reported hours are not an availability percentage.</p></div>`;
}

export class DashboardTransition {
 constructor(model,ui,callbacks){
  this.model=model;this.ui=ui;this.callbacks=callbacks;this.mode='world';this.elapsed=0;this.event=null;this.filter='all';this.uom='PCS';this.autoShown=false;
  const root=document.createElement('section');root.id='hq-presentation';root.hidden=true;root.setAttribute('aria-label','HQ monitor dashboard');
  root.innerHTML=`<div class="hq-bezel"><div class="hq-monitor-top"><span>HQ MASTER / GOOGLE SHEETS</span><button id="dashboard-back">← Return to sites</button></div><div class="hq-screen"><div class="hq-dashboard-toolbar"><span id="dashboard-stage-label">Receiving source records</span><label>Source <select id="dashboard-site-filter" aria-label="Dashboard source site"><option value="all">All sites</option>${SITES.map(s=>`<option value="${s.id}">Site ${s.id}</option>`).join('')}</select></label><button id="dashboard-inspect">Inspect workbook ↗</button></div><div id="dashboard-evidence"></div><div id="dashboard-charts"></div></div><div class="hq-monitor-bottom"><span class="hq-led"></span><span>IMPORTRANGE · SOURCE WORKSHEETS → HQ MIRROR</span></div></div><div class="hq-monitor-stand"></div>`;
  document.getElementById('world').append(root);this.root=root;
  root.querySelector('.hq-screen').tabIndex=0;root.querySelector('.hq-screen').setAttribute('aria-label','Scrollable HQ dashboard and charts');
  document.getElementById('dashboard-back').onclick=()=>this.close();document.getElementById('dashboard-inspect').onclick=()=>ui.open('HQ','overview');
  document.getElementById('dashboard-site-filter').onchange=e=>{this.filter=e.target.value;this.paint();};
  root.addEventListener('change',e=>{if(e.target.matches('.db-parts-unit')){this.uom=e.target.value;this.paint();this.root.querySelector('.db-parts-unit')?.focus({preventScroll:true});}});
  root.addEventListener('click',e=>{const b=e.target.closest('[data-dashboard-tab]');if(b){ui.open('HQ',b.dataset.dashboardTab);ui.filter=b.dataset.dashboardSite;ui.render();}});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&this.mode!=='world'&&!document.querySelector('dialog[open]')){e.preventDefault();this.close();}});
  model.onChange(e=>{if(e.type==='synced'){this.event=e;if(this.mode==='waiting'&&e.tab==='parts')this.uom=model.master('parts',e.site).find(r=>e.job.ids.includes(r.id))?.uom||'PCS';if(this.mode!=='world')this.paint();}else if(e.type==='reset'&&this.mode!=='world')this.paint();});
 }
 start(event=this.event){if(this.mode!=='world')return;this.event=event;this.filter='all';document.getElementById('dashboard-site-filter').value='all';this.uom=event?.tab==='parts'?this.model.master('parts',event.site).find(r=>event.job.ids.includes(r.id))?.uom||'PCS':'PCS';this.autoShown=true;this.mode=this.model.jobs.length?'waiting':'arrival';this.elapsed=0;this.lastMode=null;this.root.querySelector('.hq-screen').scrollTop=0;this.returnFocus=document.activeElement;this.callbacks.start();document.getElementById('world').classList.add('dashboard-active');this.paint();}
 close(){this.mode='world';this.root.hidden=true;this.root.querySelectorAll('.db-flying-row').forEach(e=>e.remove());document.getElementById('world').classList.remove('dashboard-active','dashboard-visible');this.callbacks.close();const back=this.returnFocus?.isConnected&&this.returnFocus.matches('button,a,input,select,[tabindex]')?this.returnFocus:document.getElementById('view-dashboard');back.focus({preventScroll:true});}
 paint(){
  document.getElementById('dashboard-charts').innerHTML=dashboardMarkup(this.model,this.filter,this.uom);
  const e=this.event,rows=e?this.model.master(e.tab,e.site).filter(r=>e.job.ids.includes(r.id)):[];
  this.evidenceRows=rows;
  if(rows.length&&(this.filter==='all'||this.filter===e.site)){const amounts={};for(const r of rows)if(r.quantity!=null)amounts[r.uom]=(amounts[r.uom]||0)+r.quantity;const quantity=Object.entries(amounts).map(([u,q])=>`${n(q)} ${esc(u)}`).join(' · ');document.querySelector('#dashboard-charts .db-heading').insertAdjacentHTML('afterend',`<p class="db-batch-note">Site ${esc(e.site)} · ${rows.length} mirrored rows${quantity?' · '+quantity+' in this batch':''}</p>`);}
  const description=rows.map(r=>r.description||r.activity||r.issue||r.unit).join(' · ');
  const evidence=document.getElementById('dashboard-evidence');
  evidence.innerHTML=rows.length?`<div class="db-arrival-label">SOURCE RECEIVED / SITE ${esc(e.site)} / ${esc(e.job.submission)}</div><h3>${rows.length} source rows. One consolidated view.</h3><div class="db-received-rows">${rows.map(r=>`<div><span>${esc(r.unit)}</span><strong>${esc(r.description||r.activity||r.issue||r.status)}</strong><span>${r.quantity!=null?`${n(r.quantity)} ${esc(r.uom)}`:r.manHours!=null?`${n(r.manHours)} mh`:'Recorded'}</span></div>`).join('')}</div><p>${esc(description)}</p>`:`<div class="db-arrival-label">HQ MASTER / SOURCE WORKSHEETS CONSOLIDATED</div><h3>Eight sources. One operating picture.</h3><p>The following charts read the same mirrored records as the master workbook.</p>`;
 }
 frame(dt,reduced){
  if(this.mode==='world')return;
  if(this.mode==='waiting'){if(this.model.jobs.length)return;this.mode='arrival';this.elapsed=0;this.paint();}
  this.elapsed+=dt;const t=reduced?7:this.elapsed;
  this.mode=t<.8?'arrival':t<2.4?'zoom':t<4.4?'records':t<6.6?'charts':'settled';
  const sources=this.mode==='charts'&&this.lastMode!=='charts'?[...this.root.querySelectorAll('.db-received-rows>div')].map(e=>({box:e.getBoundingClientRect(),html:e.innerHTML})):[];
  this.root.hidden=t<2;this.root.dataset.stage=this.mode;
  this.root.style.setProperty('--monitor-reveal',Math.min(1,Math.max(0,(t-2)/.65)));
  document.getElementById('dashboard-evidence').hidden=t>=4.4;
  document.getElementById('dashboard-charts').hidden=t<4.4;
  document.getElementById('world').classList.toggle('dashboard-visible',t>=2.4);
  if(sources.length&&!reduced){const bounds=this.root.getBoundingClientRect(),screen=this.root.querySelector('.hq-screen').getBoundingClientRect();sources.forEach((source,i)=>{const row=this.evidenceRows[i],target=[...this.root.querySelectorAll('[data-part]')].find(e=>e.dataset.part===row?.part);if(!target)return;const box=target.getBoundingClientRect();if(box.top<screen.top||box.bottom>screen.bottom)return;const copy=document.createElement('div');copy.className='db-flying-row';copy.innerHTML=source.html;copy.style.cssText=`left:${source.box.left-bounds.left}px;top:${source.box.top-bounds.top}px;width:${source.box.width}px`;this.root.append(copy);const animation=copy.animate([{transform:'translate(0,0) scale(1)',opacity:1},{transform:`translate(${box.left-source.box.left}px,${box.top-source.box.top}px) scale(.65)`,opacity:.15}],{duration:1050+i*90,easing:'cubic-bezier(.3,.65,.2,1)',fill:'forwards'});animation.finished.then(()=>copy.remove()).catch(()=>copy.remove());});}
  document.getElementById('dashboard-stage-label').textContent=t<4.4?'Source rows mirrored at HQ':'Overview / Operational dashboard';
  if(this.lastMode!==this.mode){if(this.mode==='settled'){document.getElementById('dashboard-back').focus({preventScroll:true});this.callbacks.settled?.();}this.lastMode=this.mode;}
 }
}
