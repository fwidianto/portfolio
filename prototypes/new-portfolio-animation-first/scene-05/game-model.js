import {worksheetBaseline,comparePlacement,applyDistanceTravel} from './worksheet-model.js';

export function gameBaseline(){
  const scenario=worksheetBaseline(true);
  scenario.worksheet.placement='dedicated';
  return scenario;
}

export function evaluateGame(scenario){
  const advice=comparePlacement(scenario);
  const option=advice.options.find(o=>o.key===scenario.worksheet.placement);
  if(!option)throw new Error('Choose Onsite or Mobile.');
  const financial=option.result.financial[0];
  const verdict=!option.feasible?'capacity':financial.revenue===0?'revenue':financial.profit>0?'profit':financial.profit<0?'loss':'even';
  return {advice,option,result:option.result,financial,verdict};
}

export function changeGame(scenario,change){
  const next=structuredClone(scenario);
  change(next);
  applyDistanceTravel(next);
  return {scenario:next,...evaluateGame(next)};
}
