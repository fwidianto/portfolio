export const SITES = [
 {id:'01',name:'Loading bay',role:'Equipment reporting',color:'#cf9e69'},
 {id:'02',name:'Service workshop',role:'Maintenance reporting',color:'#86afb8'},
 {id:'03',name:'Parts store',role:'Parts consumption',color:'#bda484'},
 {id:'04',name:'Field office',role:'Breakdown reporting',color:'#ba8e83'},
 {id:'05',name:'Maintenance depot',role:'Consumables & labor',color:'#9dad88'},
 {id:'06',name:'Service camp',role:'Equipment reporting',color:'#a99bb8'},
 {id:'07',name:'Fleet yard',role:'Maintenance reporting',color:'#91aa9c'},
 {id:'08',name:'Workshop annex',role:'Labor reporting',color:'#bc9d87'},
];
const str=(key,label)=>({key,label,type:'text',required:true});
const num=(key,label,min=0,integer=false)=>({key,label,type:'number',min,integer,required:true});
const choice=(key,label,options)=>({key,label,type:'select',options,required:true});
const date={key:'date',label:'Date',type:'date',required:true};
export const TABS = [
 {id:'unit',name:'Unit Status',master:'Unit Status',fields:[date,str('unit','Unit ID'),num('meter','Meter Hours'),num('operating','Operating Hours'),num('downtime','Downtime Hours'),choice('status','Status',['Operating','Standby','Breakdown'])]},
 {id:'breakdown',name:'Breakdown Report',master:'Breakdown',fields:[str('incident','Breakdown ID'),str('unit','Unit ID'),date,str('issue','Issue'),num('downtime','Downtime Hours'),choice('status','Status',['Open','Under Repair','Resolved'])]},
 {id:'maintenance',name:'Maintenance Report',master:'Maintenance',fields:[str('workOrder','Work Order'),str('unit','Unit ID'),date,choice('type','Maintenance Type',['Preventive','Corrective']),str('activity','Activity'),choice('result','Result',['Completed','Pending'])]},
 {id:'parts',name:'Spare Parts',master:'Spare Parts',fields:[str('workOrder','Work Order'),str('unit','Unit ID'),str('part','Part Number'),str('description','Description'),num('quantity','Qty',0.001),choice('uom','Unit',['PCS','SET'])]},
 {id:'consumables',name:'Consumables',master:'Consumables',fields:[str('workOrder','Work Order'),str('unit','Unit ID'),str('item','Item'),num('quantity','Quantity',0.001),choice('uom','Unit',['L','KG','PCS']),date]},
 {id:'labor',name:'Labor / Service',master:'Labor',fields:[str('workOrder','Work Order'),str('unit','Unit ID'),str('activity','Activity'),num('technicians','Technician Count',1,true),num('hours','Hours / Technician'),{key:'manHours',label:'Total Man-Hours',type:'calculated'}]},
];
export const tabById = id => TABS.find(t=>t.id===id);
export const seedRows = (site,tab) => {
 const n=Number(site),unit=`EXC-${site.padStart(3,'0')}`,workOrder=`WO-${site}01`,date='2026-01-15';
 const rows={
  unit:[{date,unit,meter:1600+n*200,operating:site==='04'?4:8,downtime:site==='04'?4:0,status:site==='04'?'Breakdown':'Operating'}],
  breakdown:[{incident:`BD-${site}01`,unit,date,issue:site==='04'?'Hydraulic pressure loss':'Inspect and replace worn hose',downtime:site==='04'?4:2,status:site==='04'?'Open':'Resolved'}],
  maintenance:[{workOrder,unit,date,type:site==='04'?'Corrective':'Preventive',activity:site==='04'?'Inspect hydraulic circuit':'Periodic filter and fluid service',result:site==='04'?'Pending':'Completed'}],
  parts:[{workOrder,unit,part:'P-010',description:'O-ring seal',quantity:2,uom:'PCS'},{workOrder,unit,part:'P-011',description:'Drive belt',quantity:1,uom:'PCS'},{workOrder,unit,part:'P-012',description:'Hydraulic hose',quantity:1,uom:'PCS'}],
  consumables:[{workOrder,unit,item:'Hydraulic oil',quantity:4,uom:'L',date}],
  labor:[{workOrder,unit,activity:'Inspection and scheduled service',technicians:2,hours:2,manHours:4}],
 };
 return rows[tab].map((values,i)=>({id:`seed-${site}-${tab}-${i}`,site,tab,submission:`BASE-${site}`,origin:'seed',...values}));
};
export const DEMO_STEPS = [
 {site:'01',tab:'unit',rows:[{date:'2026-01-16',unit:'EXC-001',meter:1808,operating:8,downtime:0,status:'Operating'}],message:'A day of equipment operation becomes one standardized record.'},
 {site:'02',tab:'maintenance',rows:[{workOrder:'WO-0202',unit:'EXC-002',date:'2026-01-16',type:'Preventive',activity:'Replace filter and inspect hoses',result:'Completed'}],message:'The workshop records the work order, activity and result.'},
 {site:'03',tab:'parts',rows:[{workOrder:'WO-0301',unit:'EXC-003',part:'P-001',description:'Oil Filter',quantity:2,uom:'PCS'},{workOrder:'WO-0301',unit:'EXC-003',part:'P-002',description:'Air Filter',quantity:1,uom:'PCS'},{workOrder:'WO-0301',unit:'EXC-003',part:'P-003',description:'Fuel Filter',quantity:1,uom:'PCS'}],message:'One work order. Three parts. Three traceable rows in the master sheet.'},
 {site:'04',tab:'breakdown',rows:[{incident:'BD-0401',unit:'EXC-004',date:'2026-01-16',issue:'Hydraulic diagnosis in progress',downtime:4,status:'Under Repair'}],message:'The field office updates a breakdown; HQ keeps its source and incident ID.'},
 {site:'05',tab:'consumables',rows:[{workOrder:'WO-0501',unit:'EXC-005',item:'Grease',quantity:1.5,uom:'KG',date:'2026-01-16'}],message:'Consumables stay linked to the unit and work order.'},
 {site:'05',tab:'labor',rows:[{workOrder:'WO-0501',unit:'EXC-005',activity:'Lubrication and service',technicians:2,hours:3.5,manHours:7}],message:'Two technicians × 3.5 hours = seven man-hours in the same reporting system.'},
 {site:'06',tab:'unit',rows:[{date:'2026-01-16',unit:'EXC-006',meter:2807,operating:7,downtime:0,status:'Operating'}],message:'Site 06 uses the same equipment-reporting structure.'},
 {site:'07',tab:'maintenance',rows:[{workOrder:'WO-0702',unit:'EXC-007',date:'2026-01-16',type:'Preventive',activity:'Inspect cooling system',result:'Completed'}],message:'Site 07 contributes another standardized maintenance record.'},
 {site:'08',tab:'labor',rows:[{workOrder:'WO-0801',unit:'EXC-008',activity:'Inspection and servicing',technicians:2,hours:2.5,manHours:5}],message:'Site 08 records five man-hours against the related work order.'},
];
export const STEP_SECONDS=14;
export const DEMO_SECONDS=DEMO_STEPS.length*STEP_SECONDS;
