'use strict';
// Original vector artwork. Tool marks are simplified visual references, not screenshots.
window.SceneArt = function buildScene(mobile) {
  const W=mobile?600:1040, H=mobile?1050:650, f=mobile?21:16, sw=mobile?560:870;
  const text=(x,y,value,size=16,fill='#dfe6e3',extra='')=>`<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" ${extra}>${value}</text>`;
  const rect=(x,y,w,h,fill,rx=5,extra='')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" ${extra}/>`;
  const line=(x1,y1,x2,y2,color='#344750',extra='')=>`<path d="M${x1} ${y1}H${x2}" stroke="${color}" ${y1===y2?'':`transform="rotate(${Math.atan2(y2-y1,x2-x1)*180/Math.PI} ${x1} ${y1})"`} fill="none" ${extra}/>`;
  const icon=(kind,x,y,size=35)=>`<use href="#icon-${kind}" x="${x}" y="${y}" width="${size}" height="${size}"/>`;
  const pill=(x,y,w,label,color='#97cdb0',size=13)=>`${rect(x,y,w,27,color,13,'fill-opacity=".12"')}${text(x+w/2,y+18,label,size,color,'text-anchor="middle"')}`;
  const person=(x,y,color='#a8bad0')=>`<circle cx="${x}" cy="${y}" r="22" fill="#192b38" stroke="${color}" stroke-opacity=".45"/><circle cx="${x}" cy="${y-5}" r="6" fill="none" stroke="${color}" stroke-width="1.7"/><path d="M${x-10} ${y+11}Q${x} ${y-4} ${x+10} ${y+11}" stroke="${color}" fill="none" stroke-width="1.7"/>`;
  let html=`<defs>
    <linearGradient id="paper" x2="0.1" y2="1"><stop stop-color="#f0f1e9"/><stop offset="1" stop-color="#dce3dd"/></linearGradient>
    <linearGradient id="panel" x2=".4" y2="1"><stop stop-color="#1b2d39"/><stop offset="1" stop-color="#111c27"/></linearGradient>
    <linearGradient id="glass" x2="1" y2="1"><stop stop-color="#45565f" stop-opacity=".2"/><stop offset="1" stop-color="#1a2732" stop-opacity="0"/></linearGradient>
    <filter id="shadow" x="-30%" y="-30%" width="160%" height="180%"><feDropShadow dx="0" dy="14" stdDeviation="13" flood-color="#000" flood-opacity=".35"/></filter>
    <pattern id="grid" width="55" height="55" patternUnits="userSpaceOnUse"><path d="M55 0H0V55" fill="none" stroke="#728a96" stroke-opacity=".06"/></pattern>
    <symbol id="icon-forms" viewBox="0 0 40 44"><path d="M5 1h22l10 10v31H5z" fill="#8959b7"/><path d="M27 1v11h10" fill="#b894d7"/><path d="M17 20h13M17 27h13M17 34h13" stroke="white" stroke-width="2.5"/><path d="M10 20h3M10 27h3M10 34h3" stroke="white" stroke-width="2.5"/></symbol>
    <symbol id="icon-sheets" viewBox="0 0 40 44"><path d="M5 1h22l10 10v31H5z" fill="#34a168"/><path d="M27 1v11h10" fill="#a1d8b7"/><path d="M12 20h18v15H12zM12 25h18M12 30h18M20 20v15" fill="none" stroke="white" stroke-width="2"/></symbol>
    <symbol id="icon-script" viewBox="0 0 44 44"><path d="M18 7 4 22l14 15 6-6-8-9 8-9z" fill="#6699e8"/><path d="m27 7 14 15-14 15-6-6 8-9-8-9z" fill="#97b5e8"/><path d="m18 7 9 0-6 9-7-5z" fill="#e8bc5f"/><path d="m27 37-9 0 6-9 7 5z" fill="#75b899"/></symbol>
    <symbol id="icon-doc" viewBox="0 0 40 44"><path d="M6 2h21l9 9v31H6z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M27 2v10h9M13 21h16M13 27h16M13 33h10" fill="none" stroke="currentColor" stroke-width="2"/></symbol>
    <symbol id="check" viewBox="0 0 24 24"><path d="m5 12 4 4L20 5" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></symbol>
  </defs><rect width="${W}" height="${H}" fill="url(#grid)"/><ellipse cx="${W*.58}" cy="${mobile?730:510}" rx="${W*.43}" ry="52" fill="#000" opacity=".13"/>
  <g id="flow-lines" opacity="0"><path id="form-sheet-line" d="" stroke="#729dc4" stroke-width="2" fill="none"/><path id="sheet-script-line" d="" stroke="#68b291" stroke-width="2" fill="none"/><circle id="flow-dot" r="5" fill="#bde2c8"/></g>`;
  // Complete branch list from Scene 01's LOCATIONS, excluding Jakarta Head Office.
  // Each issue is a narrative example, not a historical finding about that branch.
  const cards=[
    ['MEDAN','Cost needs review','EMAIL THREAD','mail'],
    ['JAMBI','Missing quotation','LOOSE DOCUMENT','doc'],
    ['LAMPUNG','No job reference','REQUEST FILE','doc'],
    ['PADANG','Quantity unclear','SPREADSHEET','grid'],
    ['PALEMBANG','Duplicate submission','FORWARDED EMAIL','mail'],
    ['PEKANBARU','Outdated attachment','ATTACHMENT','doc'],
    ['BANDUNG','Business reason missing','REQUEST FILE','doc'],
    ['SEMARANG','Request date missing','SPREADSHEET','grid'],
    ['SURABAYA','Docs sent separately','EMAIL + ATTACHMENT','mail'],
    ['BANJARMASIN','Approval status unknown','CHAT MESSAGE','chat'],
    ['PONTIANAK','Item details conflict','SPREADSHEET','grid'],
    ['SAMARINDA','Estimate needs checking','COST PROPOSAL','doc'],
    ['SAMPIT','Requester not identified','LOOSE DOCUMENT','doc'],
    ['MAKASSAR','Waiting for clarification','EMAIL THREAD','mail'],
    ['JAYAPURA','Follow-up in chat','CHAT MESSAGE','chat']
  ];
  const intakePose=mobile?[318,132,.6]:[650,95,.88];
  const hub=mobile?[292,480]:[592,312];
  const routeEnd=[intakePose[0],hub[1]];
  const routes=cards.map((_,i)=>{
    const start=[mobile?246:370,(mobile?116:99)+i*(mobile?48:35)];
    return [start,[start[0]+(mobile?22:74),start[1]],[hub[0]-(mobile?18:72),hub[1]],hub];
  });
  html+='<g id="branch-network"><g id="branch-lines" aria-hidden="true">';
  routes.forEach(([start,c1,c2,end],i)=>{
    const d=`M${start[0]} ${start[1]}C${c1[0]} ${c1[1]} ${c2[0]} ${c2[1]} ${end[0]} ${end[1]}`;
    html+=`<path data-branch-route="${i}" d="${d}" fill="none" stroke="#526d80" stroke-width="1.3" stroke-opacity=".5"/><path id="branch-active-${i}" d="${d}" pathLength="1" fill="none" stroke="#9bbdd7" stroke-width="1.5" stroke-dasharray="1" stroke-dashoffset="1"/><circle id="branch-signal-${i}" r="${mobile?4:3.8}" fill="#d4e9ed" opacity="0"/><circle cx="${start[0]}" cy="${start[1]}" r="2.4" fill="#8c9da7"/>`;
  });
  html+=`<path id="intake-trunk" d="M${hub[0]} ${hub[1]}H${routeEnd[0]}" fill="none" stroke="#96b9d1" stroke-width="2"/><path d="m${routeEnd[0]-9} ${routeEnd[1]-5} 8 5-8 5" fill="none" stroke="#b9d9e7" stroke-width="2"/><circle id="intake-halo" cx="${hub[0]}" cy="${hub[1]}" r="12" fill="#80b2c5" fill-opacity=".06" stroke="#81adbf" stroke-opacity=".5"/><circle cx="${hub[0]}" cy="${hub[1]}" r="4" fill="#c2dfe3"/><circle id="intake-signal" r="4" fill="#e1ece3" opacity="0"/></g>`;
  html+='<g id="fragments">';
  cards.forEach((c,i)=>{
    const x=mobile?22:50,y=routes[i][0][1];
    html+=`<g id="fragment-${i}">${text(x,y-24,c[0],mobile?20:18,'#d9dfdb','class="svg-mono" data-branch-name="'+c[0]+'"')}${text(x,y-7,c[1],mobile?13:13,'#c7ac8b','data-branch-issue=""')}${line(x,y,routes[i][0][0],y,'#52626c','stroke-opacity=".36"')}</g>`;
  });
  html+=`</g><g id="fragment-label">${text(mobile?22:50,mobile?43:34,'15 BRANCHES / REQUEST ORIGINS',mobile?15:13,'#b2c1c5','class="svg-mono"')}${text(mobile?318:650,mobile?286:54,'ONE STANDARD INTAKE',mobile?16:13,'#baa5d3','class="svg-mono"')}<g transform="translate(${mobile?320:650} ${mobile?680:546})">${text(0,0,'JAKARTA · HEAD OFFICE',mobile?17:14,'#aec5d5','class="svg-mono"')}${text(0,27,'One visible request queue.',mobile?17:15,'#a9bdc5')}</g></g></g>`;
  const fw=mobile?430:355, fh=mobile?486:461;
  html+=`<g id="form" opacity="0"><g>${rect(7,9,fw,fh,'#13181b',9)}${rect(0,0,fw,fh,'url(#paper)',9)}${rect(0,0,fw,8,'#8c64b9',4)}</g>${icon('forms',23,23,36)}${text(71,44,'Google Forms',mobile?25:22,'#354342')}${text(24,89,'Purchase request',mobile?26:25,'#263c3a')}${text(24,115,'One standard entry point.',mobile?18:15,'#677974')}`;
  const fields=[['Branch / Unit','Medan'],['Item / Service','Service parts'],['Quantity / Estimated cost','02 / IDR 2,400,000'],['Related customer / job','DEMO JOB-08'],['Business reason','Planned service work'],['Supporting documents','Quotation + job reference']];
  fields.forEach((c,i)=>{const y=140+i*44;html+=`<g>${text(24,y,c[0],mobile?15:11,'#5a6d68')}${rect(24,y+7,fw-48,25,'#c7d2ca',3,'fill-opacity=".7"')}<g id="form-field-${i}">${text(33,y+25,c[1],mobile?17:13,'#324e45')}</g></g>`;});
  html+=`${rect(24,fh-41,130,26,'#7950a2',3)}${text(89,fh-23,'Submit request',mobile?15:12,'#f6f3fb','text-anchor="middle"')}<g id="form-submitted" opacity="0">${rect(fw-160,fh-44,138,31,'#e0eadd',4)}${text(fw-91,fh-23,'Entry received ✓',mobile?15:12,'#35765c','text-anchor="middle"')}</g><circle id="form-pulse" cx="${fw/2}" cy="${fh/2}" r="60" fill="none" stroke="#b79bd8" stroke-width="2" opacity="0"/></g>`;
  html+=`<g id="sheet" opacity="0"><g>${rect(0,0,sw,415,'#182e2b',7,'stroke="#5c967f" stroke-opacity=".6"')}</g>${icon('sheets',21,17,37)}${text(71,40,'Google Sheets',mobile?25:23,'#e0ede6')}${text(71,61,'HQ · Purchase request control',mobile?16:13,'#9ab6a9')}${pill(sw-146,25,122,'CENTRAL LOG','#91c6a6',12)}${rect(12,83,sw-24,313,'url(#paper)',3)}${rect(12,83,sw-24,38,'#c8d8cc',2)}${text(29,108,'ƒx',18,'#577864')}${text(65,108,'Forms intake → structured records',mobile?17:14,'#526b5b')}`;
  const columns=mobile?[['REQUEST',31],['UNIT',187],['DOCS',300],['STATUS',417]]:[['REQUEST ID',32],['BRANCH',168],['ITEM / SERVICE',282],['EST. COST',457],['DOCS',581],['REVIEW',677],['STAGE',773]];
  html+=`${rect(12,121,sw-24,34,'#afc6b7',0)}`+columns.map(c=>text(c[1],143,c[0],mobile?16:11,'#365748','class="svg-mono"')).join('');
  ['024','025','026','027'].forEach((id,i)=>{
    const y=156+i*49;
    html+=`<g id="sheet-row-${i}" data-request="${i}" role="button" tabindex="-1" aria-label="Inspect illustrative request DEMO-${id}">${rect(13,y,sw-26,48,i===0?'#d7e8da':i%2?'#dce4dd':'#e3e9e1',0)}${rect(13,y,4,48,i===0?'#48a476':'#a8bcad',0)}${text(32,y+30,`DEMO-${id}`,f-1,'#315a4d','class="svg-mono"')}${text(mobile?187:168,y+30,['Medan','Surabaya','Makassar','Jayapura'][i],mobile?18:15,'#466356')}<text id="row-id-${i}" x="32" y="${y+30}" font-size="${f-1}" fill="#315a4d" class="svg-mono"></text>`;
    if(!mobile) html+=`${text(282,y+30,['Service parts','Workshop tools','Field service','Consumables'][i],15,'#385a4b')}${text(457,y+30,['2,400,000','1,250,000','3,600,000','850,000'][i],13,'#466356','class="svg-mono"')}`;
    html+=`<text id="docs-${i}" x="${mobile?300:581}" y="${y+30}" font-size="${f-1}" fill="#6e7d6f">Pending</text><text id="status-${i}" x="${mobile?417:677}" y="${y+30}" font-size="${f-1}" fill="#506d7e">Logged</text>`;
    if(!mobile) html+=`<text id="gate-${i}" x="773" y="${y+30}" font-size="13" fill="#526e62">Intake</text>`;
    html+=`${rect(17,y+2,sw-34,43,'none',0,'class="row-outline"')}</g>`;
  });
  html+=`${line(24,362,sw-24,362,'#bacfc0')}${text(29,385,'REQUEST LOG',mobile?15:12,'#37795d','class="svg-mono"')}${text(sw-30,385,'HQ CONTROL',mobile?15:12,'#5f7c6c','text-anchor="end" class="svg-mono"')}<rect id="scan" x="15" y="156" width="${sw-30}" height="48" fill="#6cbd96" fill-opacity=".18" stroke="#308765" stroke-opacity=".65" opacity="0"/></g>`;
  const aw=mobile?560:680;
  html+=`<g id="automation" opacity="0"><g>${rect(0,0,aw,220,'#132331',8,'stroke="#6d9b99" stroke-opacity=".7"')}</g>${rect(0,0,4,220,'#75c7a0',2)}${icon('script',23,21,37)}${text(74,43,'Apps Script',mobile?26:23,'#dce8ef')}${text(74,65,'ON FORM SUBMISSION',mobile?14:11,'#87a8b6','class="svg-mono"')}${pill(aw-145,28,123,'TRIGGERED','#93cdae',12)}${line(23,82,aw-23,82,'#304b57')}`;
  [['01','Assign request ID','DEMO-024'],['02','Check documents','Complete'],['03','Update review queue','Ready for review']].forEach((c,i)=>{
    const y=112+i*37;
    html+=`<g id="automation-step-${i}">${text(25,y,c[0],13,'#72a3b6','class="svg-mono"')}${text(62,y,c[1],mobile?20:17,'#c1d1d6')}${text(aw-27,y,c[2],mobile?18:16,'#a0d4b5','text-anchor="end"')}</g>`;
  });
  html+=`<g id="automation-exception" opacity="0">${rect(25,236,aw-50,42,'#30252c',5,'stroke="#925d60" stroke-opacity=".5"')}${text(45,263,'DEMO-025  ·  Missing quotation → Hold',mobile?19:16,'#e2b1a6')}</g></g>`;
  const rw=mobile?560:655;
  html+=`<g id="review" opacity="0"><g>${rect(0,0,rw,477,'url(#panel)',8,'stroke="#63819a" stroke-opacity=".6"')}</g>${person(43,43)}${text(81,40,'HQ review',mobile?27:25,'#e6e8e0')}${text(81,63,'COST CONTROL / HUMAN JUDGMENT',mobile?14:12,'#9cb1c0','class="svg-mono"')}${pill(rw-157,31,132,'DEMO-024','#95b8d4',13)}${line(24,85,rw-24,85,'#304755')}${text(26,119,'Medan · Service parts',mobile?25:25,'#e4e9e5')}${text(26,151,'Estimated cost',mobile?18:16,'#92a9b7')}${text(rw-27,151,'IDR 2,400,000',mobile?21:20,'#c9d9e2','text-anchor="end"')}${text(26,190,'SUPPORTING DOCUMENTS',mobile?15:12,'#89a2b3','class="svg-mono"')}`;
  [['Quotation attached','✓'],['Job reference · DEMO JOB-08','✓'],['Business reason · Planned service','✓']].forEach((c,i)=>{const y=222+i*34;html+=`<g id="review-check-${i}">${text(28,y,c[1],21,'#99cdac')}${text(59,y,c[0],mobile?20:18,'#b8cbd2')}</g>`;});
  html+=`${rect(25,314,rw-50,79,'#24343b',4)}${text(42,339,'BUSINESS JUSTIFICATION',mobile?15:12,'#d2b18a','class="svg-mono"')}${text(42,368,'Check job context, cost &amp; profitability.',mobile?20:19,'#d1d8d6')}<g id="review-ready" opacity="0">${pill(25,420,212,'Ready for approval','#a6d1b5',mobile?19:17)}${text(rw-27,441,'Reviewed by a person',mobile?17:15,'#9eb3bd','text-anchor="end"')}</g></g>`;
  html+='<g id="approval" opacity="0">';
  const gw=mobile?560:940;
  html+=`${text(gw/2,0,'HEADQUARTERS / HUMAN APPROVAL GATES',mobile?16:13,'#91a8b8','text-anchor="middle" class="svg-mono"')}`;
  for(let i=0;i<3;i++){
    const x=mobile?35:i*320, y=mobile?30+i*157:49, w=mobile?490:295, h=mobile?132:209;
    if(i<2) html+=mobile?`<path d="M280 ${y+h}v25" stroke="#556e7e" stroke-width="2"/>`:`<path d="M${x+w} ${y+105}h25" stroke="#556e7e" stroke-width="2"/>`;
    html+=`<g id="approval-${i}">${rect(x,y,w,h,'url(#panel)',6,'stroke="#465f70"')}${person(x+44,y+42)}${text(x+mobile*45+32,y+(mobile?40:104),['Cost Control','Manager','General Manager'][i],mobile?24:23,'#dce4e1')}${text(x+(mobile?78:32),y+(mobile?67:130),['Review','Review','Approval'][i],mobile?20:17,'#a3bac7')}<text id="approval-status-${i}" x="${x+(mobile?78:32)}" y="${y+(mobile?104:176)}" font-size="${mobile?19:15}" fill="#819cad">Awaiting review</text><use id="approval-check-${i}" href="#check" x="${x+w-44}" y="${y+(mobile?81:154)}" width="24" height="24" style="color:#a6d6b7" opacity="0"/></g>`;
  }
  html+=`<g id="approval-note">${text(gw/2,mobile?549:304,'Automation prepares. People decide.',mobile?21:20,'#d6b287','text-anchor="middle"')}</g></g>`;
  html+='<g id="overview" opacity="0">';
  if(mobile){
    html+=`${text(300,41,'ONE CONTROLLED WORKFLOW',17,'#9db7c1','text-anchor="middle" class="svg-mono"')}<path d="M150 143H450V276H150V409H450V546H300" fill="none" stroke="#598279" stroke-width="2"/>`;
    const nodes=[['doc','15 branches','Structured submission',40,73],['forms','Google Forms','One standard intake',320,73],['sheets','Google Sheets','One HQ control layer',180,226],['script','Apps Script','Checks & status flow',180,378]];
    nodes.forEach(([kind,title,note,x,y])=>{html+=`${rect(x,y,240,106,'#17252e',7,'stroke="#49646c"')}${icon(kind,x+15,y+14,35)}${text(x+61,y+38,title,20,'#dce5e0')}${text(x+18,y+80,note,16,'#9db4bd')}`;});
    html+=`${rect(31,526,538,90,'#1b2e2c',6,'stroke="#547c68"')}${text(300,562,'HQ review → Manager → GM approval',20,'#dce9df','text-anchor="middle"')}${text(300,591,'HUMAN DECISIONS · VISIBLE STAGES',14,'#9fc7ae','text-anchor="middle" class="svg-mono"')}`;
  }else{
    html+=`${text(520,59,'MANY REQUESTS. ONE HQ-CONTROLLED PROCESS.',15,'#a7b9bd','text-anchor="middle" class="svg-mono"')}<path id="overview-routing" d="M145 242H250M395 242H450M695 347v70H237v31M435 522h63" fill="none" stroke="#5b8c81" stroke-width="2"/><path d="m242 237 7 5-7 5m196-10 7 5-7 5m51 275 7 5-7 5" fill="none" stroke="#93c3aa" stroke-width="2"/>`;
    html+=`${rect(48,145,145,176,'#101d27',4,'stroke="#3c515d"')}${rect(36,156,145,176,'#13212b',4,'stroke="#49606b"')}${rect(24,167,145,176,'#1b2a34',4,'stroke="#677887"')}${text(43,205,'BRANCH NETWORK',11,'#c7b18e','class="svg-mono"')}${text(43,264,'15',50,'#eadbc3')}${text(43,296,'requests in view',13,'#aabcc5')}${text(43,320,'One intake path →',12,'#c0d1d8')}${text(104,382,'ALL 15 BRANCHES',13,'#b9a07d','text-anchor="middle" class="svg-mono"')}${text(326,382,'STANDARDIZED INTAKE',12,'#baa3d0','text-anchor="middle" class="svg-mono"')}${text(729,382,'CENTRALIZED CONTROL',12,'#98c8ac','id="centralized-label" text-anchor="start" class="svg-mono"')}${text(743,446,'PREPARED RECORDS → HUMAN DECISIONS',12,'#a9c5ba','text-anchor="middle" class="svg-mono"')}`;
    for(let i=0;i<3;i++){
      const x=500+i*166;
      html+=`${rect(x,470,157,111,'#1a2b31',5,'stroke="#628672"')}${person(x+26,498,'#9ec9ae')}${text(x+17,540,['Cost Control','Manager','General Mgr'][i],17,'#d9e6dc')}${text(x+17,563,['Reviewed ✓','Checked ✓','Approved ✓'][i],14,'#96c3a4')}`;
    }
  }
  html+='</g>';
  html+=`<g id="handoff" opacity="0">${rect(-57,-23,114,46,'#d4e7d8',4,'stroke="#77b294"')}${text(0,5,'DEMO-024',14,'#315d4a','class="svg-mono" text-anchor="middle"')}</g>`;
  return {html,W,H,sw,fw,fh,aw,rw,routes,intakePose,hub,routeEnd};
};
