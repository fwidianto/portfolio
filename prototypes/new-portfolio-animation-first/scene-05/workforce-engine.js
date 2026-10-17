import {sum} from './maintenance-engine.js';
export const REGULAR_HOURS=8*22;
export function logistics(m,site) {
  const l=site.logistics,home=m.homeSite===site.id;
  if(home&&m.location==='mess')return {hours:l.rotationHours*l.rotations,travel:l.rotationCost*l.rotations+l.localTransport,accommodation:l.mess,allowance:l.allowance,trips:l.rotations,mode:'Rotation + mess'};
  if(home&&m.location==='site')return {hours:0,travel:l.localTransport,accommodation:m.dedicatedAccommodation?l.mess:0,allowance:m.dedicatedAccommodation?l.allowance:0,trips:0,mode:'Customer site'};
  if(home&&m.location==='local')return {hours:l.commuteHours*l.commuteTrips,travel:l.commuteCost*l.commuteTrips,accommodation:0,allowance:0,trips:l.commuteTrips,mode:'Local return'};
  const branch=m.location==='branch';
  return {hours:(branch?l.branchHours:l.satelliteHours)*l.trips,travel:(branch?l.branchCost:l.satelliteCost)*l.trips,accommodation:0,allowance:0,trips:l.trips,mode:branch?'Branch trips':'Satellite / intersite trips'};
}
const empty=()=>({wrench:0,personnel:0,travelHours:0,reserved:0,capacity:0,covered:0,otHours:0,shortfall:0,regularPayroll:0,additionalPayroll:0,overtime:0,travel:0,accommodation:0,allowance:0,assignments:[],issues:[],events:[]});
function regularMonth(s,events,mechanics) {
  const sites=Object.fromEntries(s.sites.map(site=>[site.id,empty()]));
  let unallocatedPayroll=0;
  for(const m of mechanics){
    let allocatedPay=0,reservedSoFar=0;
    for(const site of s.sites){
      const hours=m.alloc[site.id]||0;if(hours<=0)continue;
      reservedSoFar+=hours;
      // Cumulative rupiah rounding preserves the payroll total even for very small salaries.
      const a=sites[site.id],l=logistics(m,site),pay=Math.round(m.salary*reservedSoFar/176)-allocatedPay,capacity=Math.max(0,hours-l.hours);
      a.reserved+=hours;a.travelHours+=l.hours;a.capacity+=capacity;
      a[m.additional?'additionalPayroll':'regularPayroll']+=pay;allocatedPay+=pay;
      a.travel+=l.travel;a.accommodation+=l.accommodation;a.allowance+=l.allowance;
      a.assignments.push({id:m.id,name:m.name,hours,capacity,pay,...l,otHours:0,additional:!!m.additional});
      // Keep reservation separate from travel hours in the inspectable record.
      a.assignments.at(-1).reserved=hours;
      if(l.hours>hours)a.issues.push(`${m.name}: ${l.hours.toFixed(1)} travel hours exceed ${hours.toFixed(1)} reserved hours.`);
    }
    unallocatedPayroll+=Math.round(m.salary)-allocatedPay;
  }
  for(const site of s.sites){
    const a=sites[site.id];a.events=events.filter(e=>e.site===site.id);a.wrench=sum(a.events.map(e=>e.wrench));a.personnel=sum(a.events.map(e=>e.personnel));
    a.covered=Math.min(a.personnel,a.capacity);a.shortfall=Math.max(0,a.personnel-a.capacity);
    a.requiredMechanics=Math.ceil((a.personnel+a.travelHours)/176);
  }
  return {sites,unallocatedPayroll,payroll:sum(mechanics.map(m=>Math.round(m.salary))),mechanics};
}
function reassign(s,events,mechanics) {
  let report=regularMonth(s,events,mechanics),moves=[];
  for(const m of mechanics){
    let need=report.sites[s.target].shortfall;if(need<=1e-8)break;
    const target=s.sites.find(x=>x.id===s.target),existing=m.alloc[s.target]||0;
    const newTravel=existing?0:logistics(m,target).hours;
    let free=176-sum(Object.values(m.alloc));
    const donors=s.sites.filter(x=>x.id!==s.target).map(x=>{
      const r=report.sites[x.id],assignment=r.assignments.find(a=>a.id===m.id);
      return {id:x.id,spare:Math.max(0,Math.min(assignment?.capacity||0,r.capacity-r.personnel))};
    });
    const available=free+sum(donors.map(d=>d.spare));
    if(available<=newTravel)continue;
    let move=Math.min(need+newTravel,available),remaining=Math.max(0,move-free);
    for(const d of donors){const take=Math.min(d.spare,remaining);m.alloc[d.id]-=take;remaining-=take;}
    m.alloc[s.target]=existing+move;moves.push({mechanic:m.id,hours:move,addedTravel:newTravel});
    report=regularMonth(s,events,mechanics);
  }
  return {report,moves};
}
export function workforce(s,forecast,strategy=s.strategy) {
  const months=[];
  for(let month=1;month<=s.months;month++){
    let mechanics=structuredClone(s.mechanics),events=forecast.events.filter(e=>e.month===month),moves=[];
    if(strategy==='hire')mechanics.push({...s.hire,id:'H01',name:'Additional mechanic',homeSite:s.target,alloc:Object.fromEntries(s.sites.map(site=>[site.id,site.id===s.target?176:0])),additional:true});
    let report;
    if(strategy==='share')({report,moves}=reassign(s,events,mechanics));else report=regularMonth(s,events,mechanics);
    if(strategy==='overtime'){
      const a=report.sites[s.target];
      for(const assignment of a.assignments){
        const m=mechanics.find(x=>x.id===assignment.id),hours=Math.min(a.shortfall,m.otLimit);
        assignment.otHours=hours;a.otHours+=hours;a.overtime+=Math.round(hours*m.otRate);a.covered+=hours;a.shortfall-=hours;
      }
    }
    for(const site of s.sites){
      const a=report.sites[site.id],crew=a.assignments.filter(x=>x.capacity>0||x.otHours>0).length;
      const crewIssues=a.events.filter(e=>e.crew>crew),durationIssues=a.events.filter(e=>e.duration>e.windowDays*8+1e-8);
      if(crewIssues.length)a.issues.push(`${crewIssues.length} job(s) require more simultaneous mechanics than assigned.`);
      if(durationIssues.length)a.issues.push(`${durationIssues.length} job(s) exceed their service-window duration.`);
      a.shortfall=Math.max(0,a.shortfall);a.remaining=Math.max(0,a.capacity-a.personnel);a.personnelHours=a.personnel+a.travelHours;
      a.feasible=a.shortfall<1e-8&&a.issues.length===0;
      a.status=a.feasible?'Aggregate covered · daily sequence unverified':'Infeasible under current constraints';
    }
    months.push({month,...report,moves});
  }
  return months;
}
