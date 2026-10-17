import {BRANCHES,RECORDS,TOTAL,TIMES,REPORT_STEPS,number,percent} from './data.js';
import {range,clamp} from './space.js';

export function createMonitorDisplay(onReady) {
  const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=576;
  const c=canvas.getContext('2d');let lastKey='',version=0,fontVersion=0;
  const icons={};
  for(const [name,path] of [['sap','logo-sap.svg'],['excel','logo-excel.svg']]){
    const img=new Image();img.src=new URL('./assets/'+path,import.meta.url).href;icons[name]=img;
    img.onload=()=>{lastKey='';onReady();};
  }
  document.fonts.ready.then(()=>{fontVersion++;lastKey='';onReady();});
  const rect=(x,y,w,h,color)=>{c.fillStyle=color;c.fillRect(x,y,w,h);};
  const text=(value,x,y,size=14,color='#d3dde3',align='left',mono=false)=>{
    c.font=`${size}px ${mono?'"JetBrains Mono"':'Inter'}, sans-serif`;c.textAlign=align;c.fillStyle=color;c.fillText(value,x,y);
  };
  const rule=y=>rect(20,y,984,1,'#2a3841');
  const bar=(excel)=>{
    rect(0,0,1024,42,excel?'#174334':'#12354b');
    const icon=icons[excel?'excel':'sap'];if(icon.complete&&icon.naturalWidth)c.drawImage(icon,20,9,excel?26:43,24);
    text(excel?'Service profitability':'Financial records',excel?60:77,29,20,'#e6ede8');
    text('SYNTHETIC SAMPLE · IDR m',1000,26,11,'#b1c2c7','right',true);
  };
  function sap(t){
    rect(0,0,1024,576,'#111d28');bar(false);
    text('ERP EXTRACTION',24,77,12,'#8eafc0','left',true);
    text('Service transaction records',24,112,27,'#e1e7e8');
    text(`${BRANCHES.length} Head & Branch Offices · Revenue & costs`,24,139,13,'#a5b8c2');
    rect(20,164,984,29,'#203242');
    ['Work order','Branch','Account','IDR m'].forEach((v,i)=>text(v,[35,380,650,982][i],184,13,'#b8c8d2',i===3?'right':'left'));
    RECORDS.slice(0,6).forEach((r,i)=>{
      const y=205+i*38,p=range(t,10.42+i*.12,10.68+i*.12);c.save();c.globalAlpha=p;
      text(r.order,35+(1-p)*12,y+17,16);text(BRANCHES.find(b=>b.id===r.branch).name,380,y+17,16);
      text(r.account,650,y+17,16);text(number(r.amount),982,y+17,16,'#d3dde3','right');c.restore();rule(y+29);
    });
    const progress=range(t,10.4,11.55);rect(24,486,976,4,'#213645');rect(24,486,976*progress,4,'#4d9fc5');
    text(`${Math.round(TOTAL.records*progress)}/${TOTAL.records} records · 6-row preview`,24,522,13,'#a4b8c4');
    text(t<11.5?'Preparing export ↗':'Transfer to Excel ↗',1000,522,15,'#8ac4df','right');
  }
  function excel(t,index){
    rect(0,0,1024,576,'#131d24');bar(true);
    const s=REPORT_STEPS[index];
    ['Import','Group','Aggregate','Profit','Margin','Compare'].forEach((v,i)=>text(v,24+i*130,64,12,i===s[4]?'#c1e8ce':i<s[4]?'#aabfb0':'#597366','left',true));
    rect(0,75,1024,66,'#1b3327');text(s[1],24,95,11,'#aec7b5','left',true);text(s[2],24,124,24,'#d0e9d6','left',true);
    text(s[3],1000,123,12,'#a7c4b1','right');
    rect(20,144,984,25,'#1b2a2d');
    ['Branch','Revenue','Cost','Profit','Margin'].forEach((v,i)=>text(v,[34,562,704,846,986][i],161,12,'#9cb8b2',i?'right':'left',true));
    BRANCHES.forEach((b,i)=>{
      const y=174+i*22,entry=range(t,TIMES.group+i*.025,TIMES.group+.17+i*.025);c.save();c.globalAlpha=entry;
      if(i===0)rect(21,y-5,982,22,'#1d362b');
      text(b.name+(b.headOffice?' · HO':''),34,y+11,14,'#d6dfd9');
      const threshold=i===0?[TIMES.revenue,TIMES.cost,TIMES.profit,TIMES.margin]:[0,1,2,3].map(k=>TIMES.compare+(i-1)*.035+k*.02);
      ['revenue','cost','profit','margin'].forEach((key,k)=>{
        const a=range(t,threshold[k],threshold[k]+.16),x=[562,704,846,986][k];
        const inputs=(k<2&&t>=TIMES.profit-.3&&t<TIMES.profit+.2)||((k===0||k===2)&&t>=TIMES.margin-.25&&t<TIMES.margin+.2);
        if(i===0&&(inputs||(t>=threshold[k]-.13&&t<threshold[k]+.4)))rect(x-116,y-5,130,22,'#31533d');
        c.save();c.globalAlpha*=a;text(key==='margin'?percent(b[key]):number(b[key]),x,y+11,14,key==='profit'?'#a6d7b7':'#d6dfd9','right');c.restore();
      });c.restore();rule(y+16);
    });
    c.save();c.globalAlpha=range(t,TIMES.finish-.1,TIMES.finish+.25);rect(20,529,984,27,'#254234');text('Division total',34,548,14,'#d5eadb');
    ['revenue','cost','profit','margin'].forEach((k,i)=>text(k==='margin'?percent(TOTAL[k]):number(TOTAL[k]),[562,704,846,986][i],548,14,'#d5eadb','right'));c.restore();
    text(`${TOTAL.records} records / ${TOTAL.orders} work orders`,1000,569,10,'#8caaa0','right',true);
  }
  return {
    canvas,
    update(t){
      const index=Math.max(0,REPORT_STEPS.findLastIndex(s=>t>=s[0]));
      const frame=Math.floor(Math.max(10.4,Math.min(t,TIMES.finish+.5))*30),key=`${frame}:${index}:${fontVersion}`;
      if(key!==lastKey){
        const stamp=frame/30,swap=range(stamp,11.8,12.3);c.clearRect(0,0,1024,576);
        sap(stamp);if(swap>0){c.save();c.globalAlpha=swap;excel(stamp,index);c.restore();}
        if(t>=11.55&&t<12.3){
          for(let i=0;i<3;i++){const p=clamp((stamp-11.55-i*.09)/.58);c.save();c.globalAlpha=Math.sin(p*Math.PI)*.5;rect(140+p*80,218+i*36-p*65,750,20,'#6ea6a4');c.restore();}
        }
        lastKey=key;version++;
      }
      return {source:canvas,version};
    }
  };
}
