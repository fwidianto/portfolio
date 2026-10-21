import {compileRoad,exits,arrival} from './road-path.js';
import {entryRoad,line,docks} from '../layout/site-layout.js';
export const receiveArrival=compileRoad([...entryRoad,line([64,43],[docks.receiving.x,43])]);
export const dockRoadSeconds=path=>path.length/3+2;
export function updateDockVisits(s){
 if(!s.config.continuous)return;
 const dock=s.physical.dock||=( {serial:0,receiveOrdinal:0,dispatchOrdinal:0,rounds:[],completedExit:null} );
 function round(id){let r=dock.rounds.find(r=>r.id===id);if(!r){r={id,receiveAt:null,dispatchAt:null,start:null,exitEnd:null};dock.rounds.push(r);dock.rounds.sort((a,b)=>a.id-b.id);}return r;}
 for(const transfer of s.transfers){if(transfer.dockSerial!==undefined)continue;transfer.dockSerial=++dock.serial;const time=transfer.tick*s.config.stepSeconds;if(transfer.from==='offsite'&&time>0){const n=++dock.receiveOrdinal;if(n%2)round((n-1)/2).receiveAt=time;}if(transfer.to==='dispatched'){const n=++dock.dispatchOrdinal;if(n%2)round((n-1)/2).dispatchAt=time;}}
 let previous=null;for(const r of dock.rounds){r.start=r.id===0?0:previous?(previous.exitEnd===null?null:previous.exitEnd+4):dock.completedExit!==null?dock.completedExit+4:null;
  if(r.start!==null){r.receiveDock=r.id===0?0:r.start+dockRoadSeconds(receiveArrival);r.dispatchArrival=r.id===0?0:r.start+8;r.dispatchDock=r.dispatchArrival+dockRoadSeconds(arrival);r.receiveStart=r.receiveAt===null?null:Math.max(r.receiveDock+2,r.receiveAt+2);r.receiveDepart=r.receiveStart===null?null:r.receiveStart+62;r.dispatchStart=r.dispatchAt===null?null:Math.max(r.dispatchDock+2,r.dispatchAt+6);r.dispatchDepart=r.dispatchStart===null||r.receiveDepart===null?null:Math.max(r.dispatchStart+62,r.receiveDepart+4);r.exitEnd=r.dispatchDepart===null?null:r.dispatchDepart+dockRoadSeconds(exits.dispatch);}
  previous=r;
 }
 while(dock.rounds.length>1&&dock.rounds[0].exitEnd!==null&&dock.rounds[0].exitEnd<s.time-30){dock.completedExit=dock.rounds.shift().exitEnd;}
}
