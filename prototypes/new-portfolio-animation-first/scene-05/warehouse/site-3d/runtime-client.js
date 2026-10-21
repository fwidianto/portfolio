export function createWarehouseRuntime({onState=()=>{},onError=()=>{}}={}){
 const worker=new Worker(new URL('./runtime-worker.js',import.meta.url),{type:'module'}),pending=new Map(),cache=new Map();let epoch=0,next=0,ready=false,closed=false,initializing=Promise.resolve();
 function send(type,data={}){return new Promise((resolve,reject)=>{if(closed){reject(Error('Simulation is closed.'));return;}const id=++next;pending.set(id,{resolve,reject});worker.postMessage({id,epoch,type,...data});});}
 function abort(){const error=new DOMException('Superseded by the current visible state.','AbortError');for(const request of pending.values())request.reject(error);pending.clear();}
 async function whenReady(type,data){const generation=epoch;await initializing;if(generation!==epoch)throw new DOMException('Superseded command.','AbortError');return send(type,data);}
 worker.onmessage=({data:m})=>{
  if(m.epoch!==epoch)return;const request=pending.get(m.id);if(!request)return;if(!m.partial)pending.delete(m.id);
  if(m.error){const error=Error(m.error);request.reject(error);onError(error);return;}
  const active=new Set();for(const {id,value} of m.attachments)cache.set(id,value);
  function unpack(p){if(!p)return;for(const [field,id] of Object.entries(p.__runtimeRefs||{})){if(!cache.has(id))throw Error('Missing immutable route '+id);p[field]=cache.get(id);active.add(id);}delete p.__runtimeRefs;}
  try{m.state.units.forEach(u=>unpack(u.physical));unpack(m.state.physical.recovery);for(const id of cache.keys())if(!active.has(id))cache.delete(id);ready=true;onState(m.state,{computeMs:m.computeMs,count:m.count,routeCache:cache.size,partial:!!m.partial});if(!m.partial)request.resolve(m.state);}catch(error){request.reject(error);onError(error);}
 };
 worker.onerror=event=>{const error=Error(event.message||'Simulation worker failed.');for(const p of pending.values())p.reject(error);pending.clear();onError(error);};
 return {
  get busy(){return !ready||pending.size>0;},get pending(){return pending.size;},get cacheSize(){return cache.size;},
  reset(state){abort();epoch++;ready=false;cache.clear();initializing=send('reset',{state});return initializing;},
  step(count,options={}){return whenReady('step',{count,...options});},
  action(action,value,unit){return whenReady('action',{action,value,unit});},
  verify(){return whenReady('verify');},
  dispose(){closed=true;abort();cache.clear();worker.terminate();}
 };
}
