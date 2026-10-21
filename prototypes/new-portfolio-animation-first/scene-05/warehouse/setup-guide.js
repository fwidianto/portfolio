// Shared progressive setup; all values still use the existing controller's input handlers.
export function mountSetupGuide(doc,game,{onStart=()=>doc.getElementById('play-mission').click(),onStarted=()=>{},onReset=()=>{}}={}){
  const app=doc.querySelector('.warehouse-app'),panel=doc.getElementById('operations'),decision=doc.getElementById('decision');
  const guide=doc.createElement('section');guide.className='setup-guide';guide.setAttribute('aria-live','polite');
  guide.innerHTML='<span class="eyebrow" id="guide-progress"></span><h2 id="guide-title"></h2><p id="guide-description"></p>';
  panel.insertBefore(guide,decision);
  const actions=doc.createElement('div');actions.className='guide-actions';actions.innerHTML='<button id="guide-back">Back</button><button id="guide-next">Continue →</button>';panel.append(actions);
  const steps=[
    ['fleet','Choose your forklift fleet.','Your operation has ten forklifts. Review each model in the table before planning its workload and maintenance team.'],
    ['game-hours','How busy is each forklift?','Set the planned operating hours for each unit this month. More use means more service exposure.'],
    ['game-fee','What does each unit earn?','This is your monthly rental revenue per forklift, in rupiah. Maintenance costs come out of that revenue.'],
    ['game-placement','Where is your service team?','Onsite keeps the team at the operation. Mobile brings the team in from the office.'],
    ['game-distance','How far is the office?','Set the office distance in kilometres. The existing model uses this with your service arrangement.'],
    ['game-mechanics','How many mechanics?','Use the forecast as a starting point, then choose your team. The game still lets you test a smaller or larger crew.'],
    ['review','Ready for your first month?','Watch the operation unfold, then explore the costs and result. You can open or close this panel at any time.']
  ];
  const route=()=>steps.filter(s=>s[0]!=='game-distance'||doc.getElementById('game-placement')?.value==='hybrid');
  let step=0,wasStarted=false;
  function present(){
    const started=game.state().started;app.dataset.guided=String(!started);guide.hidden=actions.hidden=started;
    if(started){
      if(!wasStarted)onStarted();wasStarted=true;
      const roster=decision.querySelector('.fleet-roster');
      if(roster&&!roster.querySelector('table')){
        const table=doc.createElement('table');table.className='fleet-status-table';
        const head=table.createTHead().insertRow();for(const title of ['Unit / model','Current work']){const cell=doc.createElement('th');cell.scope='col';cell.textContent=title;head.append(cell);}
        const body=table.createTBody();for(const button of [...roster.querySelectorAll('button')]){
          const row=body.insertRow(),status=button.querySelector('span').textContent;button.querySelector('span').remove();row.insertCell().append(button);row.insertCell().textContent=status;
        }roster.append(table);
      }
      return;
    }
    if(wasStarted){step=0;wasStarted=false;onReset();}
    const activeSteps=route();step=Math.min(step,activeSteps.length-1);const [id,title,description]=activeSteps[step];
    doc.getElementById('guide-progress').textContent=`SETUP ${step+1} / ${activeSteps.length}`;
    doc.getElementById('guide-title').textContent=title;doc.getElementById('guide-description').textContent=description;
    decision.querySelectorAll('.guide-current').forEach(el=>el.classList.remove('guide-current'));
    const ids=id==='fleet'?[]:[id];
    for(const inputId of ids)doc.getElementById(inputId)?.closest('label').classList.add('guide-current');
    if(id==='fleet'){
      if(!doc.getElementById('fleet-table')){
        const fleet=game.snapshot().scenario.fleets,table=doc.createElement('div');table.id='fleet-table';
        table.innerHTML='<table><caption>10 forklifts · one model per unit</caption><thead><tr><th scope="col">Unit</th><th scope="col">Model</th><th scope="col">Opening meter</th></tr></thead><tbody></tbody></table>';
        fleet.forEach((unit,index)=>{
          const row=table.querySelector('tbody').insertRow();row.insertCell().textContent=String(index+1).padStart(2,'0');
          const select=doc.getElementById('game-model').cloneNode(true);select.removeAttribute('id');select.value=unit.model;select.setAttribute('aria-label',`Model for forklift ${index+1}`);
          select.onchange=()=>{
            const chosen=select.value,unitInput=doc.getElementById('game-unit');unitInput.value=String(index);unitInput.dispatchEvent(new Event('change',{bubbles:true}));
            const model=doc.getElementById('game-model');model.value=chosen;model.dispatchEvent(new Event('change',{bubbles:true}));
          };
          row.insertCell().append(select);row.insertCell().textContent=unit.start+' h';
        });decision.append(table);
      }
    }else doc.getElementById('fleet-table')?.remove();
    if(id==='game-hours'||id==='game-fee'){
      const input=doc.getElementById(id),label=input.closest('label');
      if(!label.querySelector('output')){
        const output=doc.createElement('output');output.htmlFor=id;output.className='slider-value';
        const format=value=>id==='game-hours'?`${value} h / unit / month`:`Rp ${Number(value).toLocaleString('en-US')} / unit / month`;
        output.textContent=format(input.value);label.prepend(output);
        if(id==='game-hours')input.type='range';
        else{
          const slider=doc.createElement('input');slider.type='range';slider.min=input.min;slider.max=String(Math.max(50000000,Number(input.value)));slider.step=input.step;slider.value=input.value;slider.className='revenue-slider';slider.setAttribute('aria-label','Monthly revenue per forklift');
          slider.oninput=()=>{input.value=slider.value;output.textContent=format(slider.value);};
          slider.onchange=()=>input.dispatchEvent(new Event('change',{bubbles:true}));label.insertBefore(slider,input);input.setAttribute('aria-label','Exact monthly revenue per forklift in rupiah');
        }
        input.oninput=()=>{output.textContent=format(input.value);};
      }
    }
    if(id==='game-placement'&&!doc.getElementById('placement-toggle')){
      const select=doc.getElementById(id),group=doc.createElement('div');group.id='placement-toggle';group.setAttribute('role','group');group.setAttribute('aria-label','Service team location');
      for(const [value,text] of [['dedicated','Onsite'],['hybrid','Mobile']]){
        const button=doc.createElement('button');button.type='button';button.textContent=text;button.setAttribute('aria-pressed',String(select.value===value));button.onclick=()=>{select.value=value;select.dispatchEvent(new Event('change',{bubbles:true}));};group.append(button);
      }select.closest('label').append(group);
    }
    if(id==='game-mechanics'&&!doc.getElementById('crew-suggestion')){
      const {scenario,advice}=game.snapshot(),option=advice.options.find(o=>o.key===scenario.worksheet.placement),hint=doc.createElement('div');hint.id='crew-suggestion';
      hint.innerHTML=`<strong>Forecast suggests ${option.count} mechanics</strong><p>For ${scenario.fleets.length} forklifts: ${Math.round(advice.averageWrenchHours)} average maintenance wrench-hours / month; ${Math.round(advice.peak)} peak monthly personnel-hours across the ${scenario.months}-month forecast. Includes job crew requirements and ${option.key==='hybrid'?'mobile travel':'onsite capacity'}.</p><p>This is the planning forecast, not a guarantee against random repairs or bay queues.${option.count>8?' The forecast exceeds the game’s eight-mechanic limit; review the workload.':''}</p>`;
      if(option.count<=8){const use=doc.createElement('button');use.type='button';use.textContent=`Use ${option.count} mechanics`;use.onclick=()=>{const input=doc.getElementById('game-mechanics');input.value=String(option.count);input.dispatchEvent(new Event('change',{bubbles:true}));};hint.append(use);}
      doc.getElementById(id).closest('label').after(hint);
    }
    if(id!=='game-mechanics')doc.getElementById('crew-suggestion')?.remove();
    doc.getElementById('guide-back').disabled=step===0;
    doc.getElementById('guide-next').textContent=id==='review'?(game.state().continuous?'Start operation →':'Start month →'):'Continue →';
    if(id==='review')decision.querySelector('.assumptions')?.classList.add('guide-current');
    if(id==='review'&&!doc.getElementById('guide-review')){
      const values=['game-hours','game-fee','game-mechanics','game-placement','game-distance'].map(key=>doc.getElementById(key).value);
      const review=doc.createElement('div');review.id='guide-review';
      review.textContent=`10 forklifts · ${values[0]} h each · Rp ${Number(values[1]).toLocaleString('en-US')} / unit / month · ${values[2]} mechanics · ${values[3]==='dedicated'?'Onsite':`Mobile · Office ${values[4]} km`}`;
      const note=doc.createElement('small');note.textContent='Synthetic scenario. Ownership, financing, depreciation and insurance are excluded.';review.append(note);decision.append(review);
    }else if(id!=='review')doc.getElementById('guide-review')?.remove();
  }
  doc.getElementById('guide-back').onclick=()=>{step=Math.max(0,step-1);present();};
  doc.getElementById('guide-next').onclick=()=>{
    const inputs=[...decision.querySelectorAll('label.guide-current input, details.guide-current input')];
    if(inputs.some(input=>!input.reportValidity()))return;
    if(route()[step][0]==='review'){onStart();present();}
    else{step++;present();decision.scrollTop=0;}
  };
  const observer=new MutationObserver(present);observer.observe(decision,{childList:true});
  present();return {present,dispose:()=>observer.disconnect()};
}
