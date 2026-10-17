import {SITES,TABS,tabById,seedRows,DEMO_STEPS} from './data/synthetic-records.js';
import {latestRecords} from './data/latest-records.js';
export const STORAGE_KEY='portfolio-ch03-multisite-sheets-v1';
const clone=v=>structuredClone(v);
const worksheets=()=>Object.fromEntries(TABS.map(t=>[t.id,[]]));
export function validateRow(tab,raw) {
 const values={},errors={};
 for(const field of tabById(tab).fields){
  if(field.type==='calculated')continue;
  const value=String(raw[field.key]??'').trim();
  if(!value){errors[field.key]=`${field.label} is required.`;continue;}
  if(value.length>160){errors[field.key]=`${field.label} must be at most 160 characters.`;continue;}
  if(field.type==='number'){
   const n=Number(value);
   if(!Number.isFinite(n)||n<field.min||(field.integer&&!Number.isInteger(n)))errors[field.key]=`${field.label} must be ${field.integer?'a whole number ':''}${field.min>0?'greater than zero':'zero or greater'}.`;
   else values[field.key]=n;
  }else if(field.type==='select'){
   if(!field.options.includes(value))errors[field.key]='Choose a listed option.';else values[field.key]=value;
  }else if(field.type==='date'){
   const d=new Date(value+'T00:00:00Z');if(!/^\d{4}-\d{2}-\d{2}$/.test(value)||!Number.isFinite(+d)||d.toISOString().slice(0,10)!==value)errors[field.key]='Enter a valid reporting date.';else values[field.key]=value;
  }else values[field.key]=value;
 }
 if(tab==='unit'&&values.operating+values.downtime>24)errors.operating='Operating hours plus downtime cannot exceed 24 hours for a daily record.';
 if(tab==='labor'&&!Object.keys(errors).length)values.manHours=Math.round(values.technicians*values.hours*10000)/10000;
 return {valid:!Object.keys(errors).length,values,errors};
}
export class Simulation {
 constructor(storage=null){
  this.storage=storage;this.listeners=new Set();this.counter=0;this.storageWarning='';
  this.sources=Object.fromEntries(SITES.map(s=>[s.id,Object.fromEntries(TABS.map(t=>[t.id,seedRows(s.id,t.id)]))]));
  this.mirrors=clone(this.sources);this.drafts=Object.fromEntries(SITES.map(s=>[s.id,worksheets()]));this.jobs=[];this.recent=[];
  if(storage)try{const p=JSON.parse(storage.getItem(STORAGE_KEY)||'null');if(p&&p.version===1){
   // Restore each existing site; newly introduced sites keep their seeded worksheets.
   for(const s of SITES)if(TABS.every(t=>Array.isArray(p.sources?.[s.id]?.[t.id])&&Array.isArray(p.mirrors?.[s.id]?.[t.id])&&Array.isArray(p.drafts?.[s.id]?.[t.id]))){this.sources[s.id]=p.sources[s.id];this.mirrors[s.id]=p.mirrors[s.id];this.drafts[s.id]=p.drafts[s.id];}
   this.counter=p.counter||0;this.jobs=p.jobs||[];this.recent=p.recent||[];
  }}catch{this.storageWarning='Browser session storage is unavailable. Work remains in this open page.';}
 }
 onChange(fn){this.listeners.add(fn);return()=>this.listeners.delete(fn);}
 emit(type,detail={}){this.persist();this.listeners.forEach(fn=>fn({type,...detail}));}
 persist(){if(this.storage)try{this.storage.setItem(STORAGE_KEY,JSON.stringify({version:1,sources:this.sources,mirrors:this.mirrors,drafts:this.drafts,counter:this.counter,jobs:this.jobs,recent:this.recent}));}catch{this.storageWarning='Session storage is full or unavailable. Keep this page open to retain your work.';}}
 addDraft(site,tab,values={}){const row={draftId:`draft-${++this.counter}`,...Object.fromEntries(tabById(tab).fields.filter(f=>f.type!=='calculated').map(f=>[f.key,''])),...values};this.drafts[site][tab].push(row);this.emit('draft',{site,tab});return row;}
 editDraft(site,tab,id,field,value){const row=this.drafts[site][tab].find(r=>r.draftId===id);if(!row||!tabById(tab).fields.some(f=>f.key===field&&f.type!=='calculated'))return;row[field]=value;this.persist();}
 deleteDraft(site,tab,id){this.drafts[site][tab]=this.drafts[site][tab].filter(r=>r.draftId!==id);this.emit('draft',{site,tab});}
 pending(site,tab){return this.jobs.some(j=>j.site===site&&j.tab===tab);}
 submit(site,tab){
  if(this.pending(site,tab))return {ok:false,message:'This worksheet is synchronizing. Your draft rows are kept.'};
  const drafts=this.drafts[site][tab];if(!drafts.length)return {ok:false,message:'Add a draft row before submitting.'};
  const checked=drafts.map(r=>({draft:r,...validateRow(tab,r)}));
  if(checked.some(r=>!r.valid))return {ok:false,message:'Correct the highlighted cells. No rows have been saved.',errors:Object.fromEntries(checked.filter(r=>!r.valid).map(r=>[r.draft.draftId,r.errors]))};
  const submission=`SUB-${site}-${String(++this.counter).padStart(4,'0')}`;
  const records=checked.map((r,i)=>({id:`${submission}-${i+1}`,site,tab,submission,origin:'manual',...r.values}));
  this.sources[site][tab].push(...records);this.drafts[site][tab]=[];
  const job=this.queue(site,tab,records,submission,'manual');this.emit('saved',{site,tab,job});return {ok:true,records,job};
 }
 queue(site,tab,records,submission,origin){const job={site,tab,ids:records.map(r=>r.id),submission,origin,elapsed:0,duration:2.8+Math.max(0,records.length-1)*.28};this.jobs.push(job);return job;}
 commitDemo(stepIndex){
  const step=DEMO_STEPS[stepIndex],{site,tab}=step;if(this.pending(site,tab))return false;
  const submission=`DEMO-${site}-${tab}`;
  const rows=step.rows.map((row,i)=>({id:`loop-${stepIndex}-${i}`,site,tab,submission,origin:'demo',...validateRow(tab,row).values}));
  const ids=new Set(rows.map(r=>r.id));this.sources[site][tab]=this.sources[site][tab].filter(r=>!ids.has(r.id)).concat(rows);
  const job=this.queue(site,tab,rows,submission,'demo');this.emit('saved',{site,tab,job});return true;
 }
 tick(dt,demoScale=1){
  for(const job of this.jobs)job.elapsed+=dt*(job.origin==='demo'?demoScale:1);
  const ready=this.jobs.filter(j=>j.elapsed>=j.duration);if(!ready.length)return;
  this.jobs=this.jobs.filter(j=>j.elapsed<j.duration);
  for(const job of ready){this.refresh(job.site,job.tab);this.recent=job.ids;this.emit('synced',{site:job.site,tab:job.tab,job});}
 }
 refresh(site,tab){this.mirrors[site][tab]=clone(this.sources[site][tab]);}
 master(tab,site='all'){return SITES.filter(s=>site==='all'||s.id===site).flatMap(s=>this.mirrors[s.id][tab]);}
 overview(site='all'){
  const all=TABS.flatMap(t=>this.master(t.id,site)),units=new Set(this.master('unit',site).map(r=>r.site+'|'+r.unit));
  const incidents=latestRecords(this.master('breakdown',site),r=>r.site+'|'+r.incident);
  const parts={};for(const r of this.master('parts',site))parts[r.uom]=(parts[r.uom]||0)+r.quantity;
  return {sites:new Set(all.map(r=>r.site)).size,records:all.length,units:units.size,breakdowns:incidents.filter(r=>r.status!=='Resolved').length,maintenance:this.master('maintenance',site).length,parts,labor:this.master('labor',site).reduce((n,r)=>n+r.manHours,0)};
 }
 manualCount(){return SITES.reduce((n,s)=>n+TABS.reduce((a,t)=>a+this.sources[s.id][t.id].filter(r=>r.origin==='manual').length,0),0);}
 draftCount(){return SITES.reduce((n,s)=>n+TABS.reduce((a,t)=>a+this.drafts[s.id][t.id].length,0),0);}
 resetDemo(){
  for(const site of SITES)for(const tab of TABS){this.sources[site.id][tab.id]=this.sources[site.id][tab.id].filter(r=>r.origin!=='demo');this.mirrors[site.id][tab.id]=this.mirrors[site.id][tab.id].filter(r=>r.origin!=='demo');}
  this.jobs=this.jobs.filter(j=>j.origin==='manual');this.recent=[];this.emit('reset');
 }
}
