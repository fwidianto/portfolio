// Presentation totals only; the calculation engines remain the source of costs.
export function financeTimeline(months,basis='cumulative',year=1){
  let revenue=0,cost=0;
  let points=[{month:0,revenue:0,cost:0}];
  for(const m of months){
    revenue+=m.revenue;cost+=m.direct+m.overhead;
    points.push({month:m.month,revenue,cost});
  }
  const years=[];
  for(let i=0;i<months.length;i+=12){
    const period=months.slice(i,i+12),end=points[i+period.length],start=points[i];
    const r=end.revenue-start.revenue,c=end.cost-start.cost;
    years.push({number:years.length+1,start:period[0].month,end:period.at(-1).month,months:period.length,revenue:r,cost:c,profit:r-c,cumulativeRevenue:end.revenue,cumulativeCost:end.cost,cumulativeProfit:end.revenue-end.cost});
  }
  if(basis==='monthly'){
    const start=Math.max(0,Math.min(year-1,years.length-1))*12;
    points=months.slice(start,start+12).map(m=>({month:m.month,revenue:m.revenue,cost:m.direct+m.overhead}));
  }
  const maximum=Math.max(1,...points.flatMap(point=>[point.revenue,point.cost])),magnitude=10**Math.floor(Math.log10(maximum));
  const ceiling=[1,1.5,2,3,5,7.5,10].find(n=>n*magnitude>=maximum)*magnitude;
  return{points,years,ceiling,basis};
}

export function financeChart(timeline){
  const width=680,height=230,{points}=timeline,monthly=timeline.basis==='monthly',lastMonth=Math.max(1,points.at(-1)?.month||1);
  const x=month=>monthly?(month-points[0].month+.5)/points.length*width:month/lastMonth*width,y=amount=>height-amount/timeline.ceiling*height;
  const path=key=>monthly&&points.length===1?`M0,${y(points[0][key]).toFixed(2)} L${width},${y(points[0][key]).toFixed(2)}`:points.map((p,i)=>`${i?'L':'M'}${x(p.month).toFixed(2)},${y(p[key]).toFixed(2)}`).join(' ');
  const firstX=monthly&&points.length===1?0:points.length?x(points[0].month):0,lastX=monthly&&points.length===1?width:points.length?x(points.at(-1).month):0;
  const area=key=>points.length?`${path(key)} L${lastX},${height} L${firstX},${height} Z`:'';
  const values=monthly?points.map(p=>({number:p.month,year:Math.floor((p.month-1)/12)+1,month:p.month,revenue:p.revenue,cost:p.cost})):timeline.years.map(year=>({number:year.number,year:year.number,month:year.end,revenue:year.cumulativeRevenue,cost:year.cumulativeCost}));
  const slot=width/Math.max(1,values.length),barWidth=Math.min(36,slot*.28),gap=Math.min(2,slot*.04);
  const markers=monthly?points.map(p=>({x:x(p.month),revenueY:y(p.revenue),costY:y(p.cost)})):timeline.years.map(year=>({x:x(year.end),revenueY:y(year.cumulativeRevenue),costY:y(year.cumulativeCost)}));
  return{width,height,revenuePath:path('revenue'),costPath:path('cost'),revenueArea:area('revenue'),costArea:area('cost'),markers,bars:values.map((value,i)=>({...value,revenueX:(i+.5)*slot-barWidth-gap,costX:(i+.5)*slot+gap,width:barWidth,revenueY:y(value.revenue),costY:y(value.cost),revenueHeight:height-y(value.revenue),costHeight:height-y(value.cost)}))};
}

export function financeCostMix(financial){
  const costs=financial.costs,labourKeys=['regularPayroll','overtime','additionalPayroll'],partKeys=['parts','repairParts'],mainKeys=[...labourKeys,...partKeys,'consumables'];
  const amount=keys=>keys.reduce((total,key)=>total+(costs[key]||0),0);
  const groups=[
    {key:'labour',label:'Labour',color:'#52788a',amount:amount(labourKeys)},
    {key:'parts',label:'Parts',color:'#bd9460',amount:amount(partKeys)},
    {key:'consumables',label:'Consumables',color:'#6b967a',amount:costs.consumables||0},
    {key:'others',label:'Others',color:'#a79a94',amount:amount(Object.keys(costs).filter(key=>!mainKeys.includes(key)))+financial.overhead}
  ];
  const total=groups.reduce((sum,group)=>sum+group.amount,0);
  return{total,groups:groups.map(group=>({...group,percent:total?group.amount/total*100:0}))};
}
