import {sum} from './maintenance-engine.js';
export const COST_LABELS={parts:'Replacement parts',consumables:'Consumables',regularPayroll:'Regular payroll',overtime:'Overtime',additionalPayroll:'Additional manpower',travel:'Travel / transport',accommodation:'Accommodation / mess',allowance:'Living allowances',other:'Other operating costs',repairParts:'Repair stress test parts'};
export function finance(s,forecast,work) {
  return s.sites.map(site=>{
    const months=work.map(w=>{
      const a=w.sites[site.id],events=forecast.events.filter(e=>e.site===site.id&&e.month===w.month),costs={};
      costs.parts=sum(events.filter(e=>!e.repair).map(e=>e.partsCost));costs.consumables=sum(events.map(e=>e.consumablesCost));
      for(const key of ['regularPayroll','overtime','additionalPayroll','travel','accommodation','allowance'])costs[key]=a[key];
      costs.other=site.other;costs.repairParts=sum(events.filter(e=>e.repair).map(e=>e.partsCost));
      const revenue=site.revenueBasis==='annual'?site.revenue/12:site.revenue,direct=sum(Object.values(costs)),contribution=revenue-direct,profit=contribution-site.overhead;
      return {month:w.month,revenue,costs,direct,contribution,overhead:site.overhead,profit,margin:revenue?profit/revenue*100:null,feasible:a.feasible};
    });
    const total={site:site.id,months,costs:Object.fromEntries(Object.keys(COST_LABELS).map(k=>[k,sum(months.map(m=>m.costs[k]))]))};
    for(const key of ['revenue','direct','contribution','overhead','profit'])total[key]=sum(months.map(m=>m[key]));
    total.margin=total.revenue?total.profit/total.revenue*100:null;total.feasible=months.every(m=>m.feasible);
    return total;
  });
}
