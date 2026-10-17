// Integer IDR-million inputs, invented solely for this public demonstration.
// Location coordinates are city-level anchors, never claimed as exact offices.
export const LOCATIONS = [
  {id:'JKT',name:'Jakarta',region:'Java',headOffice:true,lon:106.90,lat:-6.19,jobs:[[420,310],[180,126]]},
  {id:'JMB',name:'Jambi',region:'Sumatra',lon:103.61,lat:-1.61,jobs:[[110,80],[70,54]]},
  {id:'LMP',name:'Lampung',region:'Sumatra',lon:105.26,lat:-5.43,jobs:[[100,75],[70,50]]},
  {id:'MDN',name:'Medan',region:'Sumatra',lon:98.67,lat:3.59,jobs:[[190,140],[130,94]]},
  {id:'PDG',name:'Padang',region:'Sumatra',lon:100.35,lat:-.95,jobs:[[100,78],[60,46]]},
  {id:'PLM',name:'Palembang',region:'Sumatra',lon:104.75,lat:-2.97,jobs:[[130,98],[90,66]]},
  {id:'PKU',name:'Pekanbaru',region:'Sumatra',lon:101.45,lat:.51,jobs:[[180,133],[110,82]]},
  {id:'BDG',name:'Bandung',region:'Java',lon:107.61,lat:-6.91,jobs:[[120,92],[80,59]]},
  {id:'SMG',name:'Semarang',region:'Java',lon:110.42,lat:-6.99,jobs:[[130,98],[80,58]]},
  {id:'SBY',name:'Surabaya',region:'Java',lon:112.75,lat:-7.25,jobs:[[280,206],[160,114]]},
  {id:'BJM',name:'Banjarmasin',region:'Kalimantan',lon:114.59,lat:-3.32,jobs:[[180,138],[100,74]]},
  {id:'PTK',name:'Pontianak',region:'Kalimantan',lon:109.34,lat:-.02,jobs:[[150,118],[90,70]]},
  {id:'SMD',name:'Samarinda',region:'Kalimantan',lon:117.15,lat:-.5,jobs:[[240,182],[140,102]]},
  {id:'SMT',name:'Sampit',region:'Kalimantan',lon:112.95,lat:-2.53,jobs:[[140,107],[90,69]]},
  {id:'MKS',name:'Makassar',region:'Sulawesi',lon:119.43,lat:-5.15,jobs:[[160,118],[100,72]]},
  {id:'DJJ',name:'Jayapura',region:'Papua',lon:140.72,lat:-2.53,jobs:[[110,87],[70,53]]}
];
export const RECORDS = LOCATIONS.flatMap(b=>b.jobs.flatMap(([revenue,cost],i)=>[
  {branch:b.id,order:`DEMO-${b.id}-${i+1}`,account:'Revenue',amount:revenue},
  {branch:b.id,order:`DEMO-${b.id}-${i+1}`,account:'Cost',amount:cost}
]));
export function aggregate(records) {
  const revenue=records.filter(r=>r.account==='Revenue').reduce((s,r)=>s+r.amount,0);
  const cost=records.filter(r=>r.account==='Cost').reduce((s,r)=>s+r.amount,0);
  const profit=revenue-cost;
  return {revenue,cost,profit,margin:revenue?profit/revenue*100:0,orders:new Set(records.map(r=>r.order)).size,records:records.length};
}
export const BRANCHES=LOCATIONS.map(({jobs,...b})=>({...b,...aggregate(RECORDS.filter(r=>r.branch===b.id))}));
export const TOTAL=aggregate(RECORDS);
export const number=n=>new Intl.NumberFormat('en-US',{maximumFractionDigits:0}).format(n);
export const percent=n=>`${n.toFixed(1)}%`;
export const TIMES={import:12.2,group:12.9,revenue:13.7,cost:14.55,profit:15.4,margin:16.35,compare:17.25,finish:18.2,duration:23.2};
const example=BRANCHES[0];
export const REPORT_STEPS=[
  [TIMES.import,'IMPORT TRANSACTION RECORDS','SAP → Excel',`${TOTAL.records} illustrative financial records`,0],
  [TIMES.group,'GROUP BY BRANCH','Branch = Jakarta',`${example.records} records → one comparable branch`,1],
  [TIMES.revenue,'AGGREGATE REVENUE',`${LOCATIONS[0].jobs.map(j=>number(j[0])).join(' + ')} = ${number(example.revenue)}`,'Jakarta · revenue · IDR million',2],
  [TIMES.cost,'AGGREGATE COST',`${LOCATIONS[0].jobs.map(j=>number(j[1])).join(' + ')} = ${number(example.cost)}`,'Jakarta · service costs · IDR million',2],
  [TIMES.profit,'CALCULATE PROFIT',`${number(example.revenue)} − ${number(example.cost)} = ${number(example.profit)}`,'Revenue − cost = profit',3],
  [TIMES.margin,'CALCULATE PROFITABILITY MARGIN',`${number(example.profit)} ÷ ${number(example.revenue)} = ${percent(example.margin)}`,'Profit ÷ revenue × 100',4],
  [TIMES.compare,'POPULATE THE BRANCH COMPARISON','One method. Every branch.','Apply the same calculations to each branch',5],
  [TIMES.finish,'CONSOLIDATED SERVICE REPORT',`${number(TOTAL.revenue)} − ${number(TOTAL.cost)} = ${number(TOTAL.profit)}`,`Division profit · ${percent(TOTAL.margin)} weighted margin`,5]
];
export const BEATS=[
  {time:0,nav:'Network',place:'INDONESIA',detail:`${LOCATIONS.length} Head & Branch Offices`,title:'A national operation. One reporting question.',description:`${LOCATIONS.length} offices across Indonesia. One consolidated view of service performance.`},
  {time:3.2,nav:'Jakarta',place:'JAKARTA · HEAD OFFICE',detail:'From nationwide to one workplace',title:'Follow the records to Head Office.',description:'Branch activity converges on the reporting team in Pulogadung, Jakarta.'},
  {time:9.15,nav:'Workplace',place:'PULOGADUNG',detail:'The analyst’s workstation',title:'The analytical work happens here.',description:'Fauzan connects ERP records to a consistent reporting structure.'},
  {time:10.4,nav:'Extract',place:'SAP → EXCEL',detail:'From records to a working spreadsheet',title:'Bring the records into focus.',description:'Extract service transactions and prepare them for branch-level analysis.'},
  {time:12.2,nav:'Transform',place:'ANALYTICAL WORK',detail:'Make every branch comparable',title:'Turn transactions into a common view.',description:'Group by branch. Aggregate revenue and costs. Calculate profit and margin.'},
  {time:TIMES.finish,nav:'Visibility',place:'MANAGEMENT VISIBILITY',detail:'Branch detail. Division perspective.',title:'Service performance, made visible.',description:'Structured branch comparisons and a consolidated view for management review.'}
];
