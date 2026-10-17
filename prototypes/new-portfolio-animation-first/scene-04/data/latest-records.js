// Visitor records win same-date ties so recycled demo rows cannot mask their updates.
export function latestRecords(rows,key){
 const map=new Map();
 for(const row of rows){const id=key(row),prior=map.get(id);if(!prior||row.date>prior.date||row.date===prior.date&&(row.origin==='manual'||prior.origin!=='manual'))map.set(id,row);}
 return [...map.values()];
}
