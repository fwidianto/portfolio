'use strict';
(() => {
  const $=id=>document.getElementById(id), clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
  const lerp=(a,b,p)=>a+(b-a)*p, smooth=p=>p*p*(3-2*p);
  const progress=(t,a,b)=>smooth(clamp((t-a)/(b-a)));
  const PACE=1.5, DURATION=30/PACE;
  const ACTS=[
    {start:0,label:'BRANCH REQUESTS',title:'Fifteen branches.<br>One intake path.',description:'Each branch keeps its own visible route into one Google Form. Request signals travel along the connections.',factLabel:'THE STARTING POINT',fact:'Scattered → standardized',note:'A process worth rebuilding.',color:'#d4a768',still:1.8},
    {start:4,label:'GOOGLE FORMS / INTAKE',title:'A better process<br>starts at the source.',description:'I helped create one structured entry point, so every branch could submit the context HQ needed.',factLabel:'STANDARDIZE THE INPUT',fact:'One form. A common language.',note:'Request details and supporting documents, together.',color:'#b9a2d2',still:6.5},
    {start:8,label:'GOOGLE SHEETS / CONTROL',title:'One sheet.<br>The whole picture.',description:'Submissions become a shared control log. HQ can track requests, documents and review stages in one place.',factLabel:'CENTRALIZE THE WORK',fact:'From entries to visibility.',note:'Google Sheets + formulas support tracking and monitoring.',color:'#93c4ab',still:11.4},
    {start:13,label:'APPS SCRIPT / AUTOMATION',title:'Less repetition.<br>More control.',description:'A submission triggers practical checks and status updates. Complete requests enter the review queue; exceptions stay visible.',factLabel:'AUTOMATE THE ADMIN',fact:'Identify. Check. Route.',note:'Apps Script supports the process, step by step.',color:'#96cdb4',still:16.8},
    {start:18,label:'HQ REVIEW / BUSINESS LOGIC',title:'Better prepared.<br>Still human-reviewed.',description:'HQ checks the documents, the cost and the business reason against the related job. Judgment stays with people.',factLabel:'KEEP THE BUSINESS LOGIC',fact:'Context before approval.',note:'Automation prepares the record. HQ reviews its meaning.',color:'#9dbadc',still:21.5},
    {start:23,label:'HQ / APPROVAL PIPELINE',title:'Clear gates.<br>Visible responsibility.',description:'A reviewed request moves through Cost Control, Manager Review and General Manager Approval.',factLabel:'MAKE THE PATH TRACEABLE',fact:'Prepared ≠ approved.',note:'Each approval remains a human decision.',color:'#a4cbb3',still:26.1},
    {start:27,label:'THE TRANSFORMATION',title:'Simple tools.<br>A better process.',description:'Standardized intake. Smarter tracking. Cleaner approval flow.',factLabel:'MY CONTRIBUTION',fact:'I helped build the workflow.',note:'Practical automation with HQ in control.',color:'#a2cfb6',still:30}
  ].map(act=>({...act,start:act.start/PACE}));
  const EXAMPLES=[
    {id:'DEMO-024',branch:'Medan',item:'Service parts',cost:'IDR 2,400,000',job:'DEMO JOB-08',docs:'Quotation + job reference',check:'Complete → review queue',review:'Business reason reviewed by HQ',approval:'Manager reviewed → GM approved',final:'Approved',note:'An illustrative complete record. Apps Script prepares the queue; HQ, the manager and the general manager make the review and approval decisions.'},
    {id:'DEMO-025',branch:'Surabaya',item:'Workshop tools',cost:'IDR 1,250,000',job:'DEMO JOB-11',docs:'Quotation missing',check:'Missing document → Hold',review:'Clarification requested',approval:'Not routed to approval',final:'Hold',note:'The exception is kept visible. Missing supporting documentation prevents this example from moving into the approval-ready path.'},
    {id:'DEMO-026',branch:'Makassar',item:'Field service',cost:'IDR 3,600,000',job:'DEMO JOB-15',docs:'Quotation + job reference',check:'Complete → review queue',review:'Job justification needs clarification',approval:'Awaiting HQ business review',final:'Need clarification',note:'Document completeness does not prove business suitability. This example has the documents, but still needs human clarification about the related job.'},
    {id:'DEMO-027',branch:'Jayapura',item:'Consumables',cost:'IDR 850,000',job:'DEMO JOB-18',docs:'Quotation + job reference',check:'Complete → review queue',review:'Awaiting Cost Control review',approval:'Not yet ready for approval',final:'Ready for review',note:'A complete example can still be waiting for a human reviewer. Entering the review queue is a process status, not an approval.'}
  ];
  const scene=$('scene'), narrow=matchMedia('(max-width:700px)'), motion=matchMedia('(prefers-reduced-motion:reduce)');
  let mobile=narrow.matches, reduced=motion.matches, time=0, playing=false, speed=1, raf=null, lastStamp=null, activeAct=-1, art;
  const nodes={};
  const node=id=>nodes[id]||(nodes[id]=$(id));
  function opacity(id,n){const el=node(id);el.setAttribute('opacity',n.toFixed(4));el.setAttribute('aria-hidden',n<.05?'true':'false');el.style.pointerEvents=n<.05?'none':'inherit';}
  function pose(id,x,y,s=1,a=1,r=0){if(mobile&&!id.startsWith('fragment-'))y+=200;node(id).setAttribute('transform',`translate(${x.toFixed(3)} ${y.toFixed(3)}) scale(${s.toFixed(4)}) rotate(${r.toFixed(3)})`);opacity(id,a);}
  function tween(t,keys){
    if(t<=keys[0][0])return keys[0].slice(1);
    for(let i=1;i<keys.length;i++)if(t<=keys[i][0]){const p=progress(t,keys[i-1][0],keys[i][0]);return keys[i].slice(1).map((v,j)=>lerp(keys[i-1][j+1],v,p));}
    return keys.at(-1).slice(1);
  }
  function track(id,t,keys){pose(id,...tween(t,keys));}
  const actAt=t=>ACTS.findLastIndex(a=>t>=a.start);
  function build(){
    art=SceneArt(mobile);
    Object.keys(nodes).forEach(k=>delete nodes[k]);
    scene.setAttribute('viewBox',`0 0 ${art.W} ${art.H}`);
    scene.innerHTML='<title id="scene-title"></title><desc id="scene-desc"></desc>'+art.html;
    [...node('fragments').children].reverse().forEach(el=>node('fragments').appendChild(el));
    if(!mobile)scene.insertBefore(node('overview'),node('branch-network'));
    for(const id of ['overview','flow-lines'])node(id).setAttribute('transform',mobile?'translate(0 200)':'translate(0 0)');
    render();
  }
  function render(){
    const act=actAt(time), data=ACTS[act], t=reduced?data.still:time*PACE;
    if(activeAct!==act){
      activeAct=act;
      $('current-act').textContent=`${String(act+1).padStart(2,'0')} / ${data.label}`;
      document.documentElement.style.setProperty('--accent',data.color);
      document.querySelectorAll('[data-act]').forEach((el,i)=>{if(i===act)el.setAttribute('aria-current','step');else el.removeAttribute('aria-current');});
      $('announcement').textContent=`Act ${act+1} of 7. ${data.title.replace('<br>',' ')} ${data.description}`;
    }
    $('scene-title').textContent=data.title.replace('<br>',' ');
    $('scene-desc').textContent=data.description+' All example records are synthetic.';
    $('timeline').value=time;
    $('timeline').style.setProperty('--progress',`${time/DURATION*100}%`);
    $('timeline').setAttribute('aria-valuetext',`${time.toFixed(1)} seconds. Act ${act+1}: ${data.label.toLowerCase()}`);
    $('time').innerHTML=`00:${Math.floor(time).toString().padStart(2,'0')} <span>/ 00:${DURATION.toString().padStart(2,'0')}</span>`;
    $('play-label').textContent=playing?(reduced?'Pause story':'Pause film'):time===DURATION?'Play again':reduced?'Play story':'Play film';
    $('play-icon').textContent=playing?'Ⅱ':'▶';
    $('play').setAttribute('aria-label',playing?'Pause film':time===DURATION?'Play again':'Play film');
    $('mode-label').textContent=reduced?'REDUCED MOTION / STORY FRAMES':time===DURATION?'STORY COMPLETE / EXPLORE':'INTERACTIVE CASE STUDY';
    $('motion').textContent=reduced?'Motion: reduced':'Motion: full';
    $('motion').setAttribute('aria-pressed',String(reduced));

    // Every visible attribute derives from this time. Seeking has no event history.
    // The origins stay still; only request signals travel into the Form.
    const networkAlpha=1-progress(t,6.9,7.1);
    opacity('branch-network',networkAlpha);
    opacity('fragments',1);
    opacity('fragment-label',1);
    let arrivalPulse=0;
    art.routes.forEach(([start,c1,c2,end],i)=>{
      const begins=1.05+i*.14,ends=begins+1.45;
      const p=progress(t,begins,ends),q=1-p;
      const x=q*q*q*start[0]+3*q*q*p*c1[0]+3*q*p*p*c2[0]+p*p*p*end[0];
      const y=q*q*q*start[1]+3*q*q*p*c1[1]+3*q*p*p*c2[1]+p*p*p*end[1];
      node(`branch-active-${i}`).setAttribute('stroke-dashoffset',String(1-p));
      node(`branch-active-${i}`).setAttribute('opacity',p===1?'.58':'.88');
      node(`branch-signal-${i}`).setAttribute('cx',x);
      node(`branch-signal-${i}`).setAttribute('cy',y);
      opacity(`branch-signal-${i}`,p>0&&p<1?1:0);
      arrivalPulse+=Math.max(0,1-Math.abs(t-ends)/.22);
    });
    node('intake-halo').setAttribute('r',String(12+Math.min(1,arrivalPulse)*6));
    const trunkProgress=clamp((t-2.5)/2.25);
    const packet=(t*2.4)%1;
    node('intake-signal').setAttribute('cx',lerp(art.hub[0],art.routeEnd[0],packet));
    node('intake-signal').setAttribute('cy',art.hub[1]);
    opacity('intake-signal',trunkProgress>0&&trunkProgress<1?1:0);
    const [formX,formY,formScale]=art.intakePose;
    const formKeys=mobile?[
      [0,formX,formY,formScale,1,0],[7.1,formX,formY,formScale,1,0],[7.95,10,20,.33,.6,0],[11.8,10,20,.33,.6,0],[12.95,-70,0,.25,0,0]
    ]:[
      [0,formX,formY,formScale,1,0],[7.1,formX,formY,formScale,1,0],[7.95,33,197,.55,1,0],[11.8,33,197,.55,1,0],[12.95,-10,205,.42,0,0],[17.15,-10,205,.42,0,0],[17.95,-70,230,.3,0,0],[26.65,250,145,.44,0,0],[27.85,250,145,.44,1,0]
    ];
    track('form',t,formKeys);
    for(let i=0;i<6;i++)opacity(`form-field-${i}`,progress(t,4.4+i*.27,4.8+i*.27));
    opacity('form-submitted',progress(t,6.2,6.8));
    const submitP=progress(t,6.5,7.7);
    node('form-pulse').setAttribute('r',String(lerp(60,340,submitP)));
    opacity('form-pulse',Math.sin(submitP*Math.PI)*.4);

    const sheetKeys=mobile?[
      [0,20,126,.97,0,0],[7.2,80,165,.8,0,0],[7.95,20,126,1,1,0],[11.8,20,126,1,1,0],[12.95,42,11,.92,.72,0],[17.15,42,11,.92,.72,0],[17.95,15,50,.88,.12,0],[22.25,15,50,.88,.12,0],[22.95,20,-40,.75,0,0]
    ]:[
      [0,279,156,.83,0,0],[7.2,390,240,.25,0,0],[7.95,271,127,.84,1,0],[11.8,271,127,.84,1,0],[12.95,142,66,.93,.83,0],[17.15,142,66,.93,.83,0],[17.95,10,160,.72,.14,-3],[22.25,10,160,.72,.14,-3],[22.95,-80,205,.55,0,-4],[26.65,446,110,.57,0,0],[27.85,446,110,.57,1,0]
    ];
    track('sheet',t,sheetKeys);
    for(let i=0;i<4;i++){
      const rowP=progress(t,7.8+i*.64,8.3+i*.64);
      node(`sheet-row-${i}`).setAttribute('transform',`translate(0 ${lerp(15,0,rowP).toFixed(3)})`);
      opacity(`sheet-row-${i}`,rowP);
      const hasID=t>=13.8+i*.12, checked=t>=14.65+i*.23, routed=t>=15.55+i*.23;
      // The original illustrative label is hidden until the ID assignment runs.
      const idText=node(`sheet-row-${i}`).querySelector('text');
      idText.textContent=hasID?`DEMO-0${24+i}`:'New entry';
      const docs=node(`docs-${i}`),status=node(`status-${i}`),gate=mobile?null:node(`gate-${i}`);
      docs.textContent=checked?(i===1?'Missing':'Complete'):'Pending';
      docs.setAttribute('fill',checked&&i===1?'#994f4b':checked?'#24734d':'#6e7d6f');
      status.textContent=routed?(i===1?'Hold':i===2&&t>=21?'Clarify':i===0&&t>=26.1?'Approved':i===0&&t>=21.6?'Checked':'Review'):'Logged';
      status.setAttribute('fill',routed&&i===1?'#994f4b':i===0&&t>=26.1?'#24734d':'#426d83');
      if(gate)gate.textContent=routed?(i===1?'Hold':i===0&&t>=26.1?'Approved':i===0&&t>=21.6?'Manager':'HQ review'):'Intake';
      const inspectable=t>=8.5&&(t<17.6||t>27.7&&!mobile);
      node(`sheet-row-${i}`).setAttribute('tabindex',inspectable?'0':'-1');
      node(`sheet-row-${i}`).setAttribute('aria-label',`Inspect illustrative request DEMO-0${24+i}. ${status.textContent}`);
      node(`sheet-row-${i}`).style.pointerEvents=inspectable?'auto':'none';
    }
    const scanP=progress(t,14,16.5);
    node('scan').setAttribute('y',String(156+Math.floor(scanP*3)*49));
    opacity('scan',t>13.6&&t<17?Math.sin(clamp((t-13.6)/3.4)*Math.PI)*.85:0);
    track('automation',t,mobile?[
      [0,20,350,1,0,0],[12.15,20,388,1,0,0],[12.95,20,348,1,1,0],[17.15,20,348,1,1,0],[17.85,20,394,.96,0,0]
    ]:[
      [0,254,353,1,0,0],[12.15,254,401,1,0,0],[12.95,254,353,1,1,0],[17.15,254,353,1,1,0],[17.85,254,411,.9,0,0],[26.65,42,448,.58,0,0],[27.85,42,448,.58,1,0]
    ]);
    for(let i=0;i<3;i++){
      const p=progress(t,13.2+i*.85,13.75+i*.85);
      opacity(`automation-step-${i}`,lerp(.22,1,p));
      node(`automation-step-${i}`).setAttribute('transform',`translate(${lerp(8,0,p)} 0)`);
    }
    opacity('automation-exception',progress(t,16,16.65)*(1-progress(t,26.4,27.5)));
    track('review',t,mobile?[
      [0,20,66,1,0,0],[17.15,20,100,1,0,0],[17.95,20,66,1,1,0],[22.15,20,66,1,1,0],[22.95,20,0,.8,0,0]
    ]:[
      [0,270,69,1,0,0],[17.15,300,95,.93,0,0],[17.95,270,69,1,1,0],[22.15,270,69,1,1,0],[22.95,405,179,.58,0,0]
    ]);
    for(let i=0;i<3;i++)opacity(`review-check-${i}`,lerp(.3,1,progress(t,18.4+i*.55,19+i*.55)));
    opacity('review-ready',progress(t,21,21.65));
    track('approval',t,mobile?[
      [0,20,48,1,0,0],[22.15,20,69,1,0,0],[22.95,20,48,1,1,0],[26.65,20,48,1,1,0],[27.8,20,98,.88,0,0]
    ]:[
      [0,47,159,1,0,0],[22.15,47,191,1,0,0],[22.95,47,159,1,1,0],[26.65,47,159,1,1,0],[27.85,500,453,.53,0,0]
    ]);
    const doneTimes=[21.65,24.8,26.1];
    for(let i=0;i<3;i++){
      const done=t>=doneTimes[i],p=progress(t,doneTimes[i]-.3,doneTimes[i]+.2);
      node(`approval-status-${i}`).textContent=done?['Reviewed by HQ','Checked by manager','Approved by GM'][i]:i===0?'Ready for review':t>=doneTimes[i-1]?'Awaiting decision':'Awaiting prior review';
      node(`approval-status-${i}`).setAttribute('fill',done?'#a6d6b7':'#8ea7b4');
      opacity(`approval-check-${i}`,p);
      node(`approval-${i}`).querySelector('rect').setAttribute('stroke',done?'#6eac8a':'#465f70');
    }
    opacity('approval-note',1-progress(t,26.3,27.6));
    opacity('overview',progress(t,26.5,27.85));
    opacity('flow-lines',(progress(t,7.1,8.5)*(1-progress(t,11.9,13.2))));
    const start=mobile?[148,110]:[230,311],end=mobile?[295,145]:[285,289];
    node('form-sheet-line').setAttribute('d',`M${start[0]} ${start[1]}C${start[0]+45} ${start[1]} ${end[0]-25} ${end[1]} ${end[0]} ${end[1]}`);
    node('sheet-script-line').setAttribute('d','');
    const flowP=clamp((t-7.8)/1.2);
    node('flow-dot').setAttribute('cx',lerp(start[0],end[0],flowP));
    node('flow-dot').setAttribute('cy',lerp(start[1],end[1],flowP));
    node('handoff').querySelector('text').textContent=t<13.8?'New entry':'DEMO-024';
    const transfer=progress(t,7,8.3), reviewTransfer=progress(t,17.15,17.95);
    if(t>=7&&t<=8.3)pose('handoff',lerp(mobile?300:537,mobile?300:388,transfer),lerp(mobile?470:510,mobile?270:283,transfer),lerp(.8,1,transfer),Math.sin(transfer*Math.PI));
    else if(t>=17.15&&t<=17.95)pose('handoff',lerp(mobile?160:377,mobile?460:848,reviewTransfer),lerp(mobile?200:235,mobile?107:113,reviewTransfer),1,Math.sin(reviewTransfer*Math.PI));
    else pose('handoff',0,0,1,0);
    const beats=[
      'Each branch has a route. Every request reaches the same Form.',
      t<6.4?'Branch, item, business reason, job reference and documents.':'A structured submission carries the context forward.',
      t<10?'A submission becomes a row. The control log grows.':'Multiple branches. One place to track the work.',
      t<14.5?'A form submission activates Apps Script.':t<16?'Request ID assigned. Documents checked. Review status updated.':'A missing quotation is flagged. The request stays on hold.',
      t<21?'Completeness is a starting point. HQ checks the business case.':'HQ marks the reviewed example ready for approval.',
      t<25?'Responsibility moves through a visible sequence of human reviews.':'The example is approved by the GM; the exception remains on hold.',
      'Standardized intake. Smarter tracking. Cleaner approval flow.'
    ];
    $('beat').textContent=beats[act];
  }
  function pause(){playing=false;if(raf!==null)cancelAnimationFrame(raf);raf=null;lastStamp=null;render();}
  function seek(value){pause();time=clamp(Number.isFinite(Number(value))?Number(value):0,0,DURATION);render();}
  function tick(stamp){
    if(!playing)return;
    if(lastStamp!==null)time=Math.min(DURATION,time+(stamp-lastStamp)/1000*speed);
    lastStamp=stamp;
    if(time>=DURATION){playing=false;raf=null;lastStamp=null;render();return;}
    render();raf=requestAnimationFrame(tick);
  }
  function play(){if(playing)return;if(time===DURATION)time=0;playing=true;lastStamp=null;render();raf=requestAnimationFrame(tick);}
  function replay(){seek(0);play();}
  const toggle=()=>playing?pause():play();
  $('play').addEventListener('click',toggle);
  $('replay').addEventListener('click',replay);
  $('timeline').addEventListener('input',e=>seek(e.target.value));
  $('speed').addEventListener('change',e=>{speed=Number(e.target.value);lastStamp=null;});
  document.querySelectorAll('[data-act]').forEach(el=>el.addEventListener('click',()=>seek(ACTS[Number(el.dataset.act)].start)));
  $('stage').addEventListener('keydown',e=>{
    if(e.altKey||e.ctrlKey||e.metaKey||e.target.closest('[data-request]'))return;
    if(e.key===' '){e.preventDefault();toggle();}
    else if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();seek(time+(e.key==='ArrowLeft'?-.5:.5));}
    else if(e.key==='Home'||e.key==='End'){e.preventDefault();seek(e.key==='Home'?0:DURATION);}
    else if(e.key.toLowerCase()==='r'){e.preventDefault();replay();}
  });
  function setReduced(value){pause();reduced=value;render();}
  $('motion').addEventListener('click',()=>setReduced(!reduced));
  motion.addEventListener('change',e=>setReduced(e.matches));
  narrow.addEventListener('change',e=>{mobile=e.matches;build();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&playing)pause();});
  function openDialog(id){pause();$(id).showModal();}
  function showExample(index){
    const r=EXAMPLES[index];
    const fields=[['Request ID',r.id],['Branch / Unit',r.branch],['Item / Service',r.item],['Estimated cost',r.cost],['Related job',r.job],['Documents',r.docs],['Automation support',r.check],['HQ business review',r.review],['Approval path',r.approval],['Final state',r.final]];
    $('request-details').replaceChildren(...fields.map(([label,value])=>{const div=document.createElement('div'),dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;dd.textContent=value;div.append(dt,dd);return div;}));
    $('review-note').textContent=r.note;
  }
  $('about').addEventListener('click',()=>openDialog('about-dialog'));
  $('inspect').addEventListener('click',()=>{showExample(Number($('request-select').value));openDialog('request-dialog');});
  $('request-select').addEventListener('change',e=>showExample(Number(e.target.value)));
  const inspectRow=el=>{const index=Number(el.dataset.request);$('request-select').value=index;showExample(index);openDialog('request-dialog');};
  scene.addEventListener('click',e=>{const row=e.target.closest('[data-request]');if(row&&row.getAttribute('tabindex')==='0')inspectRow(row);});
  scene.addEventListener('keydown',e=>{const row=e.target.closest('[data-request]');if(row&&(e.key==='Enter'||e.key===' ')){e.preventDefault();inspectRow(row);}});
  const query=new URLSearchParams(location.search);
  document.documentElement.classList.toggle('is-embedded',query.get('embed')==='1');
  if(query.get('embed')==='1'){
    $('about').textContent='Project & role ↗';
    document.querySelector('.secondary-controls').append($('about'),$('motion'));
  }
  $('timeline').max=DURATION;
  if(query.has('t'))time=clamp(Number(query.get('t'))||0,0,DURATION);
  window.Scene03=Object.freeze({seek,play,pause,replay,state:()=>({time,playing,speed,reduced,mobile,act:actAt(time)+1,duration:DURATION})});
  build();
  if(query.get('autoplay')==='1'&&!reduced)play();
})();
