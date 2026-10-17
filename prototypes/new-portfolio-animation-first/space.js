// Small perspective drawing vocabulary for this scene; no engine or scene graph.
export const mix = (a, b, p) => a + (b - a) * p;
export const clamp = n => Math.max(0, Math.min(1, n));
export const ease = n => { const p = clamp(n); return p * p * (3 - 2 * p); };
export const range = (t, a, b) => ease((t - a) / (b - a));
export const NEAR_CLIP=.25;
const FAR_CLIP=10000;
const CLIP_A=(FAR_CLIP+NEAR_CLIP)/(FAR_CLIP-NEAR_CLIP);
const CLIP_B=-2*FAR_CLIP*NEAR_CLIP/(FAR_CLIP-NEAR_CLIP);
const sub = (a, b) => a.map((v, i) => v - b[i]);
const dot = (a, b) => a.reduce((s, v, i) => s + v * b[i], 0);
const cross = (a, b) => [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]];
const unit = a => { const n = Math.hypot(...a); return a.map(v => v / n); };

export function perspective(eye, target, width, height) {
  const forward = unit(sub(target, eye));
  const right = unit(cross(forward, [0, 1, 0]));
  const up = cross(right, forward);
  const focal = Math.min(width * .85, height * 1.35);
  const view = p => { const d = sub(p, eye); return [dot(d, right), dot(d, up), dot(d, forward)]; };
  const screen = p => [width / 2 + p[0] * focal / p[2], height / 2 - p[1] * focal / p[2], p[2]];
  return { view, screen, focal, eye, right, up, forward, point: p => screen(view(p)) };
}

export function plane(points, color, edge) { return { points, color, edge }; }

// The proof showed painter sorting fails at the roof/window. Native depth testing
// handles those intersections with one static vertex buffer and one draw call.
export function createBuildingRenderer(canvas, faces) {
  const gl = canvas.getContext('webgl', { antialias: true, alpha: true, premultipliedAlpha: false });
  if (!gl) return null;
  const compile = (type, source) => {
    const s=gl.createShader(type); gl.shaderSource(s,source); gl.compileShader(s);
    if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  };
  const program=gl.createProgram();
  gl.attachShader(program,compile(gl.VERTEX_SHADER,`
    attribute vec3 position; attribute vec3 color; attribute vec3 normal;
    varying vec3 vColor; varying vec3 vWorld; varying vec3 vNormal;
    uniform vec3 eye, right, up, forward; uniform vec2 resolution; uniform float focal;
    void main(){
      vec3 d=position-eye; float z=dot(d,forward);
      gl_Position=vec4(dot(d,right)*focal*2.0/resolution.x,dot(d,up)*focal*2.0/resolution.y,${CLIP_A}*z+(${CLIP_B}),z);
      vColor=color; vWorld=position;vNormal=normal;
    }`));
  gl.attachShader(program,compile(gl.FRAGMENT_SHADER,`
    precision mediump float; varying vec3 vColor; varying vec3 vWorld; varying vec3 vNormal; uniform float fog;
    void main(){
      float taskLight=exp(-length((vWorld-vec3(2.0,5.8,-2.0))*vec3(.65,1.0,.6)));
      float windowLight=exp(-length((vWorld-vec3(2.0,6.8,3.5))*vec3(.2,.7,.35)));
      vec3 light=vec3(.025,.05,.065)*taskLight+vec3(.11,.055,.025)*windowLight;
      float distanceTone=clamp(length(vWorld.xz)/1600.0,0.0,.32);
      float diffuse=max(dot(normalize(vNormal),normalize(vec3(-.35,.8,.45))),0.0);
      vec3 color=mix(vColor*(.55+.30*diffuse)+light,vec3(.025,.03,.045),distanceTone);
      gl_FragColor=vec4(mix(color,vec3(.20,.23,.26),fog),1.0);
    }`));
  gl.bindAttribLocation(program,0,'position');gl.bindAttribLocation(program,1,'color');gl.bindAttribLocation(program,2,'normal');gl.linkProgram(program);
  if(!gl.getProgramParameter(program,gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
  gl.useProgram(program);
  const data=[];
  for(const face of faces) {
    const rgb=face.color.match(/[a-f\d]{2}/gi).map(v=>parseInt(v,16)/255);
    const raw=cross(sub(face.points[1],face.points[0]),sub(face.points[2],face.points[0]));
    const normal=Math.hypot(...raw)>1e-8?unit(raw):[0,1,0];
    for(let i=1;i<face.points.length-1;i++)for(const j of [0,i,i+1])data.push(...face.points[j],...rgb,...(face.normals?.[j]??normal));
  }
  const mesh=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,mesh);
  gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.STATIC_DRAW);
  const backgroundCount=faces[0]?.background?(faces[0].points.length-2)*3:0;
  for(const [name,offset] of [['position',0],['color',12],['normal',24]]) {
    const loc=gl.getAttribLocation(program,name);gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,3,gl.FLOAT,false,36,offset);
  }
  const viewUniforms=pr=>Object.fromEntries(['eye','right','up','forward','resolution','focal'].map(n=>[n,gl.getUniformLocation(pr,n)]));
  const uniforms=viewUniforms(program),fogUniform=gl.getUniformLocation(program,'fog');
  const textured=gl.createProgram();
  gl.attachShader(textured,compile(gl.VERTEX_SHADER,`
    attribute vec3 position; attribute vec2 uv; varying vec2 vUv; varying vec3 vWorld;
    uniform vec3 eye,right,up,forward; uniform vec2 resolution; uniform float focal,distant;
    void main(){
      vec3 d=position-eye;float z=dot(d,forward);vUv=uv;vWorld=position;
      float clipZ=distant>.5?z-${2*NEAR_CLIP}:${CLIP_A}*z+(${CLIP_B});
      gl_Position=vec4(dot(d,right)*focal*2.0/resolution.x,dot(d,up)*focal*2.0/resolution.y,clipZ,z);
    }`));
  gl.attachShader(textured,compile(gl.FRAGMENT_SHADER,`
    precision mediump float;varying vec2 vUv;varying vec3 vWorld;
    uniform sampler2D picture;uniform float kind,opacity,selected;uniform highp vec3 eye;
    void main(){
      vec4 tex=texture2D(picture,vUv);if(tex.a<.008)discard;vec3 color=tex.rgb;
      if(kind<.5){color*=.82;}
      else if(kind<1.5){
        float edge=smoothstep(0.0,.02,min(min(vUv.x,1.0-vUv.x),min(vUv.y,1.0-vUv.y)));
        float angle=1.0-abs(normalize(eye-vWorld).z);
        float reflection=.018*exp(-pow((vUv.x+.4*vUv.y-.72)/.22,2.0))+.012*angle;
        color=color*(.80+.08*edge)+vec3(.75,.86,1.0)*reflection;
        color+=(1.0-edge)*selected*vec3(.20,.055,.01);
      }
      gl_FragColor=vec4(color,tex.a*opacity);
    }`));
  gl.bindAttribLocation(textured,0,'position');gl.bindAttribLocation(textured,1,'uv');gl.linkProgram(textured);
  if(!gl.getProgramParameter(textured,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(textured));
  const texView=viewUniforms(textured),texUniforms=Object.fromEntries(['kind','opacity','distant','picture','selected'].map(n=>[n,gl.getUniformLocation(textured,n)]));
  const quadBuffer=gl.createBuffer(),textures=new WeakMap();
  const setView=(u,p,w,h)=>{
    for(const n of ['eye','right','up','forward'])gl.uniform3fv(u[n],p[n]);
    gl.uniform2f(u.resolution,w,h);gl.uniform1f(u.focal,p.focal);
  };
  gl.enable(gl.DEPTH_TEST);gl.clearColor(0,0,0,0);
  return (p,width,height,dpr=1,surfaces=[],fog=0)=>{
    const w=Math.round(width*dpr),h=Math.round(height*dpr);
    if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h);}
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    gl.useProgram(program);gl.bindBuffer(gl.ARRAY_BUFFER,mesh);gl.depthMask(true);gl.disable(gl.BLEND);
    gl.enableVertexAttribArray(2);gl.vertexAttribPointer(0,3,gl.FLOAT,false,36,0);gl.vertexAttribPointer(1,3,gl.FLOAT,false,36,12);gl.vertexAttribPointer(2,3,gl.FLOAT,false,36,24);
    setView(uniforms,p,width,height);gl.uniform1f(fogUniform,fog);
    // The 100 km ground backdrop crosses the clip volume. Its interpolated
    // depth can hide the road on Intel/ANGLE; it must not occlude foreground.
    if(backgroundCount){gl.depthMask(false);gl.drawArrays(gl.TRIANGLES,0,backgroundCount);gl.depthMask(true);}
    gl.drawArrays(gl.TRIANGLES,backgroundCount,data.length/9-backgroundCount);
    gl.useProgram(textured);setView(texView,p,width,height);gl.activeTexture(gl.TEXTURE0);gl.uniform1i(texUniforms.picture,0);
    gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
    gl.disableVertexAttribArray(2);
    for(const surface of surfaces){
      if(!surface.source||surface.opacity===0)continue;
      let entry=textures.get(surface.source);
      if(!entry){entry={texture:gl.createTexture(),version:-1};textures.set(surface.source,entry);}
      gl.bindTexture(gl.TEXTURE_2D,entry.texture);
      if(entry.version!==(surface.version??0)){
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,false);gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,false);
        gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,surface.source);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
        entry.version=surface.version??0;
      }
      const uv=surface.uv??[[0,0],[1,0],[1,1],[0,1]],verts=[];
      for(const i of [0,1,2,0,2,3])verts.push(...surface.quad[i],...uv[i]);
      gl.bindBuffer(gl.ARRAY_BUFFER,quadBuffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(verts),gl.STREAM_DRAW);
      gl.vertexAttribPointer(0,3,gl.FLOAT,false,20,0);gl.vertexAttribPointer(1,2,gl.FLOAT,false,20,12);
      gl.uniform1f(texUniforms.kind,surface.kind??0);gl.uniform1f(texUniforms.opacity,surface.opacity??1);gl.uniform1f(texUniforms.distant,surface.kind===2?1:0);
      gl.uniform1f(texUniforms.selected,surface.active?1:0);
      gl.depthMask(surface.kind===1);
      if(surface.kind===0){gl.enable(gl.POLYGON_OFFSET_FILL);gl.polygonOffset(-1,-1);}
      gl.drawArrays(gl.TRIANGLES,0,6);gl.disable(gl.POLYGON_OFFSET_FILL);
    }
    gl.depthMask(true);gl.disable(gl.BLEND);
  };
}

export function box(x, y, z, w, h, d, color = ['#283440', '#151f2a', '#202c38']) {
  const a = [x,y,z], b = [x+w,y,z], c = [x+w,y+h,z], e = [x,y+h,z];
  const f = [x,y,z-d], g = [x+w,y,z-d], j = [x+w,y+h,z-d], k = [x,y+h,z-d];
  return [plane([a,b,c,e],color[0]),plane([b,g,j,c],color[1]),plane([e,c,j,k],color[2]),plane([f,a,e,k],color[1]),plane([g,f,k,j],color[1]),plane([a,f,g,b],color[1])];
}

export function roundedBox(x,y,z,w,h,d,r,color=['#283440','#151f2a','#202c38']){
  r=Math.min(r,w/2,d/2);const bevel=Math.min(.035,h*.25,r*.4);
  const ring=(inset,yy)=>{
    const rr=r-inset,centers=[[x+w-r,z-r],[x+r,z-r],[x+r,z-d+r],[x+w-r,z-d+r]],out=[];
    for(let corner=0;corner<4;corner++)for(let j=0;j<=3;j++){
      const angle=(corner*90+j*30)*Math.PI/180;
      out.push({p:[centers[corner][0]+Math.cos(angle)*rr,yy,centers[corner][1]+Math.sin(angle)*rr],n:[Math.cos(angle),0,Math.sin(angle)]});
    }return out;
  };
  const low=ring(0,y),high=ring(0,y+h-bevel),top=ring(bevel,y+h),faces=[];
  faces.push({...plane(top.map(v=>v.p),color[2]),normals:top.map(()=>[0,1,0])});
  faces.push({...plane(low.map(v=>v.p).reverse(),color[1]),normals:low.map(()=>[0,-1,0])});
  for(let i=0;i<low.length;i++){
    const j=(i+1)%low.length,n=low[i].n,nn=low[j].n,bn=unit([n[0],1,n[2]]),bnn=unit([nn[0],1,nn[2]]);
    faces.push({...plane([low[i].p,high[i].p,high[j].p,low[j].p],color[0]),normals:[n,n,nn,nn]});
    faces.push({...plane([high[i].p,top[i].p,top[j].p,high[j].p],color[2]),normals:[bn,bn,bnn,bnn]});
  }return faces;
}

export function cylinderBetween(a,b,r,color='#34434e',segments=10){
  const axis=sub(b,a);if(Math.hypot(...axis)<1e-8)return [];
  const n=unit(axis),u=unit(cross(n,Math.abs(n[1])>.9?[1,0,0]:[0,1,0])),v=cross(n,u),start=[],end=[],normals=[],faces=[];
  for(let i=0;i<segments;i++){
    const t=i/segments*Math.PI*2,normal=u.map((q,j)=>q*Math.cos(t)+v[j]*Math.sin(t));
    start.push(a.map((q,j)=>q+normal[j]*r));end.push(b.map((q,j)=>q+normal[j]*r));normals.push(normal);
  }
  for(let i=0;i<segments;i++){const j=(i+1)%segments;faces.push({...plane([start[i],end[i],end[j],start[j]],color),normals:[normals[i],normals[i],normals[j],normals[j]]});}
  faces.push({...plane(start,color),normals:start.map(()=>n.map(q=>-q))});faces.push({...plane(end,color),normals:end.map(()=>n)});return faces;
}

export function ellipsoid(center,radii,color,segments=10,rings=5){
  const at=(j,i)=>{
    const p=j/rings*Math.PI,t=i/segments*Math.PI*2,s=[Math.sin(p)*Math.cos(t),Math.cos(p),Math.sin(p)*Math.sin(t)];
    return {p:center.map((q,k)=>q+s[k]*radii[k]),n:unit(s.map((q,k)=>q/radii[k]))};
  },faces=[];
  for(let j=0;j<rings;j++)for(let i=0;i<segments;i++){
    const a=at(j,i),b=at(j,i+1),c=at(j+1,i+1),d=at(j+1,i);
    const verts=j===0?[a,c,d]:j===rings-1?[a,b,c]:[a,b,c,d];
    faces.push({...plane(verts.map(v=>v.p),color),normals:verts.map(v=>v.n)});
  }return faces;
}

// CSS projective transform maps a semantic HTML surface onto a camera-space quad.
export function quadMatrix(q, width, height) {
  const [[x0,y0],[x1,y1],[x2,y2],[x3,y3]] = q;
  const dx1=x1-x2, dx2=x3-x2, dx3=x0-x1+x2-x3;
  const dy1=y1-y2, dy2=y3-y2, dy3=y0-y1+y2-y3;
  const det=dx1*dy2-dx2*dy1;
  const g=Math.abs(det)<1e-8?0:(dx3*dy2-dx2*dy3)/det;
  const h=Math.abs(det)<1e-8?0:(dx1*dy3-dx3*dy1)/det;
  return `matrix3d(${(x1-x0+g*x1)/width},${(y1-y0+g*y1)/width},0,${g/width},${(x3-x0+h*x3)/height},${(y3-y0+h*y3)/height},0,${h/height},0,0,1,0,${x0},${y0},0,1)`;
}
