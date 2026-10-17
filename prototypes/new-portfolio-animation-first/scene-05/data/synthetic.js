// Educational fixtures only: no manufacturer standards or company records.
const item = (name, qty, price) => ({name, qty, price});
function packages(multiplier, hours) {
  return Object.fromEntries([250,500,1000,2000].map((interval,i) => [interval, {
    wrench: hours[i], crew: i < 2 ? 1 : 2, efficiency: 1,
    minDuration: [2,3,5,10][i], windowDays: i === 3 ? 5 : 3,
    parts: [item('Oil filter',1,Math.round(180000*multiplier)),
      ...(i >= 1 ? [item('Fuel filter',1,Math.round(270000*multiplier))] : []),
      ...(i >= 2 ? [item('Air filter',1,Math.round(480000*multiplier))] : []),
      ...(i === 3 ? [item('Synthetic overhaul kit',1,Math.round(3800000*multiplier))] : [])],
    consumables: [item('Engine oil · litre',[8,8,12,16][i],Math.round(65000*multiplier)),
      item('Grease · cartridge',[1,2,3,4][i],85000),
      ...(i >= 2 ? [item('Hydraulic oil · litre',i === 2 ? 8 : 24,60000)] : [])]
  }]));
}
export const MODEL_TEMPLATES = {
  'FL-30': {name:'Forklift', color:'#d8b070', cycle:2000, step:250, sequence:[250,500,250,1000,250,500,250,2000], packages:packages(.8,[4,8,18,40])},
  'WL-50': {name:'Wheel loader', color:'#d59b53', cycle:2000, step:250, sequence:[250,500,250,1000,250,500,250,2000], packages:packages(1.2,[6,12,28,64])},
  'EX-20': {name:'Excavator', color:'#a9b899', cycle:2000, step:250, sequence:[250,500,250,1000,250,500,250,2000], packages:packages(1,[5,10,24,56])}
};
const logistics = () => ({satelliteHours:4, satelliteCost:350000, branchHours:8, branchCost:650000,
  trips:4, commuteHours:.5, commuteCost:25000, commuteTrips:22,
  rotationHours:8, rotationCost:650000, rotations:1, mess:2200000, allowance:900000, localTransport:200000});
export function baseline() {
  return {
    name:'FMC planning study', start:'2026-01', months:6,
    models:structuredClone(MODEL_TEMPLATES),
    sites:[
      {id:'A', name:'East Quarry', contract:'FMC-SYN-041', revenue:37500000, revenueBasis:'monthly', other:400000, overhead:1600000, logistics:logistics()},
      {id:'B', name:'River Depot', contract:'FMC-SYN-072', revenue:13000000, revenueBasis:'monthly', other:250000, overhead:700000, logistics:logistics()}
    ],
    fleets:[
      {id:'Q-L',site:'A',model:'WL-50',qty:8,start:170,stagger:95,hours:180,change:20,changeMonth:4},
      {id:'Q-E',site:'A',model:'EX-20',qty:4,start:710,stagger:135,hours:160,change:0,changeMonth:4},
      {id:'D-F',site:'B',model:'FL-30',qty:5,start:40,stagger:85,hours:125,change:0,changeMonth:4}
    ],
    mechanics:[
      {id:'M01',name:'Adi',salary:8000000,otRate:100000,otLimit:32,location:'satellite',homeSite:'A',alloc:{A:112,B:64}},
      {id:'M02',name:'Bima',salary:8500000,otRate:110000,otLimit:32,location:'mess',homeSite:'A',alloc:{A:176,B:0}},
      {id:'M03',name:'Citra',salary:7500000,otRate:95000,otLimit:24,location:'local',homeSite:'B',alloc:{A:0,B:96}}
    ],
    hire:{salary:9000000,location:'satellite',otRate:110000,otLimit:32},
    repair:{enabled:false,unit:'Q-L-01',month:3,wrench:36,parts:8500000,crew:2,downtime:2,urgent:true},
    strategy:'regular', target:'A'
  };
}
export function example(name) {
  const s=baseline();
  if(name==='headroom') {s.sites[0].revenue=48000000;s.fleets[0].hours=130;s.fleets[1].hours=120;}
  if(name==='pressure') {s.fleets[0].hours=480;s.fleets[1].hours=400;}
  return s;
}
