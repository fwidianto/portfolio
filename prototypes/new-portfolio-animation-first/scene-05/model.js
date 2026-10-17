import {forecast} from './maintenance-engine.js';
import {workforce} from './workforce-engine.js';
import {finance} from './finance-engine.js';
export function calculate(s,{compare=true}={}) {
  const maintenance=forecast(s),work=workforce(s,maintenance),financial=finance(s,maintenance,work);
  const result={maintenance,work,financial};
  if(compare)result.options=['regular','overtime','hire','share'].map(strategy=>{
    const w=strategy===s.strategy?work:workforce(s,maintenance,strategy),f=finance(s,maintenance,w);
    return {strategy,work:w,financial:f};
  });
  return result;
}
