// Presentation only: progress and availability come from the original controller.

const clamp=x=>Math.max(0,Math.min(1,x));

const smooth=x=>{x=clamp(x);return x*x*(3-2*x);};

export function maintenancePose(unit,mechanic,time){

 const event=unit.fault||unit.service,p=event?clamp(event.progress/event.duration):0;

 const assigned=!!event&&event.status==='in-progress'&&event.mechanics.includes(mechanic.id);

 const available=assigned&&!mechanic.travel&&!unit.moving&&!(unit.fault&&event.kind==='service');

 const approach=smooth(p/.18),clear=smooth((p-.80)/.18),engagement=approach*(1-clear)*availability(mechanic,time);

 const slot=Math.max(0,event?.mechanics.indexOf(mechanic.id)),side=event?.physicalSides?.[slot]??(slot%2?1:-1),station=event?.physicalSlots?.[slot]?.station??-1.95;

 const local=unit.physical?{x:station+.5+.30*engagement,z:side*.95}:{x:-3+1.85*engagement,z:side*(1.25-.30*engagement)};

 const c=Math.cos(unit.pose.yaw),s=Math.sin(unit.pose.yaw),work=available&&engagement>.999&&p>=.25&&p<.70;

 return {id:mechanic.id,event:event?.id||null,unit:unit.id,visible:assigned&&!unit.moving,working:work,

  phase:!available?'unavailable':p<.18?'approach':p<.25?'open access':p<.70?'tool work':p<.80?'close and clear':'return',

  pose:{x:unit.pose.x+local.x*c-local.z*s,y:unit.pose.y,z:unit.pose.z+local.x*s+local.z*c,yaw:unit.pose.yaw-side*Math.PI/2},

  local,side,progress:p,walking:engagement>0&&engagement<1,walkDistance:(unit.physical?.30:1.874)*engagement,...(unit.physical?{walkStart:{x:station+.5,z:side*.95},walkEnd:{x:station+.8,z:side*.95},walkLength:.30}:{}),

  ...(unit.physical&&station> -1?{contactTarget:[unit.pose.x+.20*c-side*.59*s,unit.pose.y+.78,unit.pose.z+.20*s+side*.59*c]}:{}),

  hood:available?availability(mechanic,time)*smooth((p-.15)/.10)*(1-smooth((p-.72)/.08)):0,

  toolAngle:work?Math.sin(event.progress*5)*.28:0,time};

}



function availability(m,time){

 if(!m.travelBudget)return 1;

 const duration=m.monthSeconds-m.start,interval=duration/22,travelDuration=Math.min(interval,m.travelBudget/22/(176/m.monthSeconds));

 const phase=(Math.max(0,time-m.start)%interval);

 return smooth((phase-travelDuration-.05)/.65)*smooth((interval-phase-.05)/.65);

}
