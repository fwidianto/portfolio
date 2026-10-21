export const CONTINUOUS_PALLETS=60;
export const CONTINUOUS_MONTH_SECONDS=2400;
export function storageWorkZone(id){const [,r,slot]=id.split('-');if(!id.startsWith('rack-'))return null;const row=Number(r)%2,back=slot.startsWith('b');return Math.floor(Number(r)/2)+':'+(row?(back?2:1):(back?1:0));}
export function openContinuous(s,openingStock=true){
 if(!s.config.continuous)return;
 s.contractPeriods=1;s.archive={moves:0,dispatched:0,received:0,services:0,faults:0,revenue:0,costs:{},ledgerCount:0,actionCount:0};
 s.physical.generated=s.pallets.length;s.physical.serial=s.pallets.length;s.physical.opening=12;s.physical.workflow={phase:'fill',capacity:s.spots.filter(p=>p.type==='storage').length,maxStored:2,cycle:1};
 // Opening stock is already on the racks. Its receiving move is not invented as live work.
 for(const [index,pallet] of (openingStock?s.pallets.slice(0,4):[]).entries()){
  const job=s.jobs.find(j=>j.pallet===pallet.id),from=s.spots.find(p=>p.id===pallet.location),reserved=s.spots.find(p=>p.id===job.destination),to=index<2?s.spots.filter(p=>p.type==='outbound')[index]:reserved;
  from.pallet=null;reserved.reserved=null;to.pallet=pallet.id;pallet.location=to.id;pallet.stage=index<2?3:1;if(index<2)pallet.departure=3;s.jobs=s.jobs.filter(j=>j!==job);s.transfers.find(t=>t.pallet===pallet.id&&t.from==='offsite').to=to.id;
 }
}
export function continueStock(s){
 if(!s.config.continuous)return;
 for(const u of s.units)if(!u.job&&!['handling','dock-exit'].includes(u.physical.phase)){u.workZone=null;u.workZonePort=null;}
 const work=s.physical.workflow,stored=s.spots.filter(p=>p.type==='storage'&&p.pallet).length;work.maxStored=Math.max(work.maxStored,stored);
 if(work.phase==='fill'&&stored===work.capacity){work.phase='dispatch';work.fullAt=s.time;}else if(work.phase==='dispatch'&&stored<=work.capacity/2){work.phase='fill';work.cycle++;}
 for(const old of [...s.pallets].filter(p=>p.location==='dispatched')){
  const jobs=s.jobs.filter(j=>j.pallet===old.id);if(jobs.some(j=>j.status!=='completed'))throw Error('Cannot recycle unfinished stock.');
  s.archive.moves+=jobs.length;s.archive.dispatched++;s.archive.received+=s.transfers.filter(t=>t.pallet===old.id&&t.from==='offsite').length;
  s.jobs=s.jobs.filter(j=>j.pallet!==old.id);s.transfers=s.transfers.filter(t=>t.pallet!==old.id);
  const next={id:'P'+String(++s.physical.serial).padStart(3,'0'),location:'offsite',stage:0,arrival:s.time+s.config.arrivalSeconds};s.pallets[s.pallets.indexOf(old)]=next;s.physical.generated++;
 }
 const complete=s.events.filter(e=>e.status==='completed');
 for(const old of complete.slice(0,Math.max(0,complete.length-64))){if(old.kind==='service')s.archive.services++;if(['minor','major'].includes(old.kind))s.archive.faults++;s.events.splice(s.events.indexOf(old),1);}
 if(s.ledger.length>512)for(const entry of s.ledger.splice(0,s.ledger.length-512)){s.archive.ledgerCount++;if(entry.category==='revenue')s.archive.revenue+=entry.amount;else s.archive.costs[entry.category]=(s.archive.costs[entry.category]||0)+entry.amount;}
 if(s.actions.length>512){s.archive.actionCount+=s.actions.length-512;s.actions.splice(0,s.actions.length-512);}
}
export function assignContinuous(s,u){
 if(!s.config.continuous)return false;
 if(!s.scenario.fleets[u.index].hours)return true;
 const rank={dispatch:0,replenish:1,receive:2},port=s.physical.ports;
 const filling=s.physical.workflow.phase==='fill';
 const approachClear=job=>{const from=port[job.source];if(from.type!=='inbound')return true;return !s.units.some(v=>{const other=s.jobs.find(j=>j.id===v.job);if(!other||port[other.source]?.type!=='inbound')return false;const source=port[other.source];return (!v.load||Math.hypot(v.physical.pose.x-source.approach.x,v.physical.pose.z-source.approach.z)<4)&&Math.abs(source.z-from.z)<4.5;});};
 const zonePort=j=>j.type==='receive'?j.destination:j.source,zoneClear=j=>{const zone=storageWorkZone(zonePort(j));return !zone||!s.units.some(v=>v!==u&&v.workZone===zone);};
 const jobs=s.jobs.filter(j=>j.status==='waiting'&&!(u.skippedJobs?.revision===s.physical.revision&&u.skippedJobs.ids.includes(j.id))&&(!filling||j.type!=='replenish')&&approachClear(j)&&zoneClear(j)).sort((a,b)=>(filling?{receive:0,dispatch:1,replenish:2}:rank)[a.type]-(filling?{receive:0,dispatch:1,replenish:2}:rank)[b.type]||a.created-b.created||Math.hypot(port[a.source].approach.x-u.physical.pose.x,port[a.source].approach.z-u.physical.pose.z)-Math.hypot(port[b.source].approach.x-u.physical.pose.x,port[b.source].approach.z-u.physical.pose.z));
 if(jobs.length){const job=jobs[0];job.owner=u.id;job.status='assigned';u.job=job.id;u.workZonePort=zonePort(job);u.workZone=storageWorkZone(u.workZonePort);u.phase='pickup';u.reason='Travel to '+job.source;}
 return true;
}
