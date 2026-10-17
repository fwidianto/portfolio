import {SITES,TABS,tabById} from './data/synthetic-records.js';
import {drawTransfer} from './assets/world.js';
import {dashboardMarkup} from './dashboard.js';
const $=id=>document.getElementById(id);
export const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const display=v=>typeof v==='number'?v.toLocaleString('en-US',{maximumFractionDigits:4}):String(v??'');
export class SheetsUI {
 constructor(model,callbacks){
  this.model=model;this.callbacks=callbacks;this.site='01';this.tab='unit';this.filter='all';this.partsUnit='PCS';this.errors={};this.lastTab={};this.focusReturn=null;this.lastJob=null;
  $('site-filter').innerHTML='<option value="all">All sites</option>'+SITES.map(s=>`<option value="${s.id}">Site ${s.id}</option>`).join('');
  $('computer-buttons').addEventListener('click',e=>{const b=e.target.closest('[data-computer]');if(b)this.open(b.dataset.computer);});
  $('open-hq').addEventListener('click',()=>this.open('HQ'));$('close-workbook').addEventListener('click',()=>this.close());$('back-overview').addEventListener('click',()=>this.close());
  $('workbook-dialog').addEventListener('close',()=>{this.callbacks.closed();if(this.focusReturn?.isConnected)this.focusReturn.focus();else document.querySelector(`[data-computer="${this.returnSite}"]`)?.focus();});
  $('to-hq').addEventListener('click',()=>this.open('HQ',this.tab==='overview'?'overview':this.tab));
  $('workbook-tabs').addEventListener('click',e=>{const b=e.target.closest('[data-tab]');if(b)this.selectTab(b.dataset.tab);});
  $('workbook-tabs').addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const buttons=[...$('workbook-tabs').querySelectorAll('button')],i=buttons.indexOf(document.activeElement),next=e.key==='Home'?0:e.key==='End'?buttons.length-1:(i+(e.key==='ArrowRight'?1:-1)+buttons.length)%buttons.length;this.selectTab(buttons[next].dataset.tab);$('workbook-tabs').querySelector(`[data-tab="${this.tab}"]`).focus();});
  $('site-filter').addEventListener('change',e=>{this.filter=e.target.value;this.renderBody();});
  $('add-row').addEventListener('click',()=>{if(this.site==='HQ')return;const d=model.addDraft(this.site,this.tab);this.renderBody();const input=$('workbook-body').querySelector(`[data-draft="${d.draftId}"] input`);input?.focus();input?.scrollIntoView({block:'nearest',inline:'nearest'});});
  $('workbook-body').addEventListener('input',e=>this.edit(e));$('workbook-body').addEventListener('change',e=>{if(e.target.tagName==='SELECT')this.edit(e);});
  $('workbook-body').addEventListener('focusin',e=>{if(e.target.dataset.field){const f=tabById(this.tab).fields.findIndex(f=>f.key===e.target.dataset.field),row=e.target.closest('tr');$('active-cell').textContent=String.fromCharCode(65+f)+row.dataset.row;$('formula-bar').textContent=`${tabById(this.tab).fields[f].label} · draft at Site ${this.site}`;}});
  $('workbook-body').addEventListener('click',e=>{const b=e.target.closest('[data-delete]');if(b){model.deleteDraft(this.site,this.tab,b.dataset.delete);this.renderBody();$('add-row').focus();}const s=e.target.closest('[data-source]');if(s){this.filter=s.dataset.source;$('site-filter').value=this.filter;this.selectTab('unit');}});
  $('submit-rows').addEventListener('click',()=>this.submit());
  $('workbook-body').addEventListener('change',e=>{if(e.target.matches('.db-parts-unit')){this.partsUnit=e.target.value;this.renderBody();$('workbook-body').querySelector('.db-parts-unit')?.focus({preventScroll:true});}});
  $('workbook-body').addEventListener('click',e=>{const b=e.target.closest('[data-dashboard-tab]');if(b){this.filter=b.dataset.dashboardSite;$('site-filter').value=this.filter;this.selectTab(b.dataset.dashboardTab);}});
  model.onChange(event=>{
   $('saved-count').textContent=model.manualCount()+' visitor records';
   if(event.type==='synced'){
    this.lastJob=event.job;if($('workbook-dialog').open&&this.site==='HQ')this.renderBody();
    if($('workbook-dialog').open&&this.site===event.site&&this.tab===event.tab){this.updateSavedStates();this.message(`${event.job.ids.length} row${event.job.ids.length===1?'':'s'} synchronized. Find ${event.job.submission} in HQ → ${tabById(event.tab).master}.`);$('submit-rows').disabled=false;}
    this.callbacks.synced(event);
   }
  });
 }
 open(site,tab){
  this.callbacks.opened(site);this.site=site;this.tab=tab||(site==='HQ'?'overview':this.lastTab[site]||'unit');this.filter='all';this.errors={};this.lastJob=null;
  if(!$('workbook-dialog').open){this.focusReturn=document.activeElement;this.returnSite=site;this.openedAt=performance.now();$('workbook-dialog').classList.add('focusing');$('workbook-dialog').showModal();}
  $('workbook-dialog').scrollTop=0;this.render();$('workbook-body').scrollLeft=0;$('workbook-body').scrollTop=0;
 }
 close(){$('workbook-dialog').close();}
 selectTab(tab){this.tab=tab;if(this.site!=='HQ')this.lastTab[this.site]=tab;this.errors={};this.render();$('workbook-body').scrollLeft=0;$('workbook-body').scrollTop=0;}
 message(message,error=false){$('worksheet-status').textContent=message;$('worksheet-status').classList.toggle('error',error);}
 edit(e){
  const field=e.target.dataset.field,row=e.target.closest('[data-draft]');if(!field||!row)return;
  this.model.editDraft(this.site,this.tab,row.dataset.draft,field,e.target.value);
  if(this.errors[row.dataset.draft])delete this.errors[row.dataset.draft][field];
  e.target.removeAttribute('aria-invalid');e.target.removeAttribute('title');
  if(this.tab==='labor'){const draft=this.model.drafts[this.site][this.tab].find(d=>d.draftId===row.dataset.draft),n=Number(draft.technicians)*Number(draft.hours);row.querySelector('.calculated').textContent=draft.technicians!==''&&draft.hours!==''&&Number.isFinite(n)?display(Math.round(n*10000)/10000):'—';}
 }
 render(){
  const hq=this.site==='HQ',tabs=hq?[{id:'overview',name:'Overview'},...TABS.map(t=>({id:t.id,name:t.master}))]:TABS;
  $('scroll-hint').hidden=this.tab==='overview';
  $('workbook-name').textContent=hq?'HQ Master · Operations register':`Site ${this.site} · Operations register`;
  $('workbook-subtitle').textContent=hq?'Consolidated using Google Sheets · IMPORTRANGE':'Google Sheets · standardized source template · synthetic data';
  $('site-filter-label').hidden=!hq;$('site-filter').value=this.filter;$('to-hq').hidden=hq;
  $('workbook-tabs').setAttribute('role','tablist');$('workbook-tabs').innerHTML=tabs.map(t=>`<button role="tab" aria-selected="${t.id===this.tab}" tabindex="${t.id===this.tab?0:-1}" data-tab="${t.id}">${escape(t.name)}</button>`).join('');
  $('workbook-tabs').querySelector('[aria-selected="true"]')?.scrollIntoView({block:'nearest',inline:'nearest'});
  $('add-row').hidden=hq;$('submit-rows').hidden=hq;$('submit-rows').disabled=!hq&&this.model.pending(this.site,this.tab);
  $('formula-bar').textContent=hq?'IMPORTRANGE · source worksheets → central mirror':'Source worksheet · drafts stay here until you submit.';$('active-cell').textContent='A1';
  $('workbook-foot-note').textContent=hq?'Read-only mirror. Every row retains its source site and submission ID.':'Saved rows are read-only. Drafts are editable and stay with their site and tab.';
  this.renderBody();this.message(hq?'Filter by site to trace a record back to its source.':this.model.pending(this.site,this.tab)?'Source saved. Waiting for the HQ mirror…':'Add draft rows, edit their cells, then submit this worksheet.');
 }
 renderBody(){
  const body=$('workbook-body'),left=body.scrollLeft,top=body.scrollTop;
  if(this.tab==='overview'){
   body.innerHTML=dashboardMarkup(this.model,this.filter,this.partsUnit);
   return;
  }
  const schema=tabById(this.tab),hq=this.site==='HQ',saved=hq?this.model.master(this.tab,this.filter):this.model.sources[this.site][this.tab],drafts=hq?[]:this.model.drafts[this.site][this.tab];
  const fields=hq?[{key:'site',label:'Source Site'},...schema.fields,{key:'submission',label:'Submission ID'}]:schema.fields;
  let html=`<table class="data-table"><caption>${hq?'HQ mirror':`Site ${this.site} source`} · ${escape(schema.name)} · ${saved.length} saved row${saved.length===1?'':'s'}${hq?'':` · ${drafts.length} draft${drafts.length===1?'':'s'}`}</caption><thead><tr class="letters"><th class="row-number"></th>${fields.map((f,i)=>`<th>${String.fromCharCode(65+i)}</th>`).join('')}<th class="state-col"></th>${hq?'':'<th class="delete-col"></th>'}</tr><tr class="field-head"><th class="row-number">#</th>${fields.map(f=>`<th scope="col">${escape(f.label)}</th>`).join('')}<th>State</th>${hq?'':'<th aria-label="Delete draft"></th>'}</tr></thead><tbody>`;
  saved.forEach((row,i)=>{const recent=hq&&this.model.recent.includes(row.id),synced=this.model.mirrors[row.site][this.tab].some(r=>r.id===row.id);html+=`<tr data-record="${escape(row.id)}" class="${recent?'recent':''}"><th class="row-number" scope="row">${i+1}</th>${fields.map(f=>`<td><span class="cell-value" title="${escape(display(row[f.key]))}">${escape(f.key==='site'?'Site '+row.site:display(row[f.key]))}</span></td>`).join('')}<td class="record-state">${recent?'Just synced':hq?'Mirrored':synced?'Saved · synced':'Saved · pending'}</td>${hq?'':'<td></td>'}</tr>`;});
  drafts.forEach((row,i)=>{html+=`<tr class="draft-row" data-draft="${row.draftId}" data-row="${saved.length+i+1}"><th class="row-number">${saved.length+i+1}</th>${fields.map(f=>{const value=row[f.key]??'',error=this.errors[row.draftId]?.[f.key],attributes=`data-field="${f.key}" aria-label="${escape(f.label)} · draft ${i+1}" ${error?`aria-invalid="true" title="${escape(error)}"`:''}`;if(f.type==='calculated'){const n=Number(row.technicians)*Number(row.hours);return `<td class="calculated">${row.technicians!==''&&row.hours!==''&&Number.isFinite(n)?display(n):'—'}</td>`;}return `<td>${f.type==='select'?`<select ${attributes}><option value="">Select…</option>${f.options.map(v=>`<option ${value===v?'selected':''}>${escape(v)}</option>`).join('')}</select>`:`<input ${attributes} type="${f.type}" value="${escape(value)}" ${f.type==='number'?`min="${f.min}" step="${f.integer?'1':'any'}"`:f.type==='text'?'maxlength="160"':''} autocomplete="off">`}</td>`;}).join('')}<td class="record-state">Draft</td><td><button class="delete-row" data-delete="${row.draftId}" aria-label="Delete draft row ${i+1}">×</button></td></tr>`;});
  if(!saved.length&&!drafts.length)html+=`<tr class="empty-row"><td colspan="${fields.length+3}">${hq?'No mirrored records for this selection.':'Use Add Row to enter your first record.'}</td></tr>`;
  body.innerHTML=html+'</tbody></table>';body.scrollLeft=left;body.scrollTop=top;
 }
 updateSavedStates(){for(const row of $('workbook-body').querySelectorAll('[data-record]')){const synced=this.model.mirrors[this.site]?.[this.tab]?.some(r=>r.id===row.dataset.record);row.querySelector('.record-state').textContent=synced?'Saved · synced':'Saved · pending';}}
 submit(){
  const result=this.model.submit(this.site,this.tab);this.errors=result.errors||{};
  if(!result.ok){this.renderBody();this.message(result.message,true);$('workbook-body').querySelector('[aria-invalid="true"]')?.focus();return;}
  this.lastJob=result.job;this.renderBody();$('submit-rows').disabled=true;this.message(`${result.records.length} rows saved at Site ${this.site}. Refreshing the HQ mirror…`);this.callbacks.submitted(result);
 }
 frame(reduced){
  if(!$('workbook-dialog').open)return;
  if(reduced||performance.now()-this.openedAt>=340)$('workbook-dialog').classList.remove('focusing');
  const job=this.model.jobs.find(j=>j.origin==='manual'&&(this.site==='HQ'||j.site===this.site))||null;
  $('transfer-view').hidden=!job;
  if(job){drawTransfer($('transfer-canvas'),job,reduced);$('transfer-status').textContent=`${job.ids.length} saved source rows · ${job.submission} → HQ / ${tabById(job.tab).master}`;}
 }
}
