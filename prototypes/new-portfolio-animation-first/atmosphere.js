import {range} from './space.js';
const fraction=n=>n-Math.floor(n);
const noise=(n,seed)=>fraction(Math.sin(n*12.9898+seed*78.233)*43758.5453);

function cloudTexture(seed){
  const canvas=document.createElement('canvas');canvas.width=512;canvas.height=512;
  const c=canvas.getContext('2d');
  for(let i=0;i<32;i++){
    const x=70+noise(i+1,seed)*372,y=70+noise(i+33,seed)*372;
    const rx=34+noise(i+65,seed)*66,ry=20+noise(i+97,seed)*40;
    c.save();c.translate(x,y);c.scale(rx,ry);
    const g=c.createRadialGradient(-.18,-.2,.08,0,0,1);
    g.addColorStop(0,'rgba(166,180,192,.50)');g.addColorStop(.38,'rgba(135,152,168,.30)');g.addColorStop(.72,'rgba(103,123,144,.10)');g.addColorStop(1,'rgba(82,106,129,0)');
    c.fillStyle=g;c.fillRect(-1,-1,2,2);c.restore();
  }
  return canvas;
}

export function createAtmosphere(){
  const layers=[
    {height:18000,span:150000,seed:2,dx:18000,dz:12000,strength:.82},
    {height:3800,span:26000,seed:5,dx:-2000,dz:2000,strength:.82},
    {height:1200,span:8000,seed:9,dx:1000,dz:-700,strength:.84},
    {height:450,span:2400,seed:13,dx:-400,dz:150,strength:.80}
  ].map(l=>{
    const s=l.span/2;
    return {...l,source:cloudTexture(l.seed),quad:[[l.dx-s,l.height,l.dz-s],[l.dx+s,l.height,l.dz-s],[l.dx+s,l.height,l.dz+s],[l.dx-s,l.height,l.dz+s]],kind:2};
  });
  return {
    layers(t,projector){
      const envelope=range(t,4.15,4.55)*(1-range(t,6.15,6.55));
      if(!envelope)return [];
      return layers.map(l=>({...l,opacity:envelope*l.strength,depth:projector.view([l.dx,l.height,l.dz])[2]})).sort((a,b)=>b.depth-a.depth);
    },
    haze(t,altitude){return range(t,4.5,4.9)*(1-range(t,6.0,6.5))*.12*Math.exp(-Math.pow((altitude-1600)/1600,2));}
  };
}
