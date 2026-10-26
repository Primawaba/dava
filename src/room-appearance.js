import {materialPaletteAt,materialLightsAt,shaderSmooth} from './material-shader.js';
import {passagePalette} from './passages.js';
const ROOM_HAZARD_COLORS={slime:[[22,37,15],[74,108,38],[151,180,84]],water:[[15,39,49],[39,95,117],[118,183,197]],lava:[[45,23,17],[143,65,28],[229,143,60]],crater:[[45,23,17],[143,65,28],[229,143,60]],gas:[[24,36,18],[72,106,39],[161,190,92]],miasma:[[33,24,39],[99,71,114],[171,141,184]],blindgas:[[31,34,34],[89,100,103],[168,186,186]],flammable:[[39,34,20],[116,105,49],[195,184,105]]};
const roomMix=(a,b,t)=>a.map((v,i)=>Math.round(v+(b[i]-v)*t));
function roomTone(lum,palette){return lum<95?roomMix(palette[0],palette[1],Math.max(0,(lum-20)/75)):roomMix(palette[1],palette[2],Math.min(1,(lum-95)/100))}
export class RoomAppearance{
 constructor(limit=384){this.cache=new Map();this.identities=new WeakMap();this.nextId=1;this.limit=limit;this.prepared=new Map();this.preparedBytes=0;this.latest=new Map();this.frameWork=undefined}
 beginFrame(){this.frameWork=0;}
 endFrame(){this.frameWork=undefined;}
 get(image,type,hazards=[],time=0,reduced=false,options={}){
  if(!image)return null;
  // Cache visual inputs only: production counters, captives and other gameplay
  // fields must never create a different shader texture.
  options={...options,neighbors:(options.neighbors||[]).map(e=>({dx:e.dx,dy:e.dy,room:{type:e.room.type,worldLayer:e.room.worldLayer||0,hazards:e.room.hazards||[],contaminant:e.room.contaminant}}))};
  const origin=options.origin||{x:0,y:0},scale=options.scale||1;
  options.lights=(options.lights||[]).filter(l=>l.x+(l.radius||100)>=origin.x&&l.x-(l.radius||100)<=origin.x+image.width*scale&&l.y+(l.radius||100)>=origin.y&&l.y-(l.radius||100)<=origin.y+image.height*scale);
  const shadeRoom={type,worldLayer:options.worldLayer||0,hazards:hazards.filter(h=>ROOM_HAZARD_COLORS[h])};shadeRoom.palette=passagePalette(shadeRoom);for(const e of options.neighbors)e.palette=passagePalette(e.room);
  const crystal=type==='crystal',layers=hazards.filter(h=>ROOM_HAZARD_COLORS[h]);
  if(!this.identities.has(image))this.identities.set(image,this.nextId++);
  const phase=(crystal||options.lights?.length)&&!reduced?Math.floor((time+((origin.x*7+origin.y*11)%500+500)%500)/500)%16:0,key=`${this.identities.get(image)}|${type}|${layers.join(',')}|${phase}|${JSON.stringify(options)}`;
  if(this.cache.has(key)){const value=this.cache.get(key);this.cache.delete(key);this.cache.set(key,value);return value}
  if(!options.staticTint&&(crystal||options.lights.length)){
   const spec=`${this.identities.get(image)}|${type}|${layers.join(',')}|${JSON.stringify(options)}`;
   // Spread animated re-shading across frames instead of updating every
   // illuminated room at the same phase boundary. Static changes never wait.
   if(this.frameWork>=3)return this.latest.get(spec)||this.get(image,type,layers,0,true,{neighbors:options.neighbors,staticTint:true,worldLayer:options.worldLayer||0});
   if(this.frameWork!==undefined)this.frameWork++;
   let prepared=this.prepared.get(spec);
   if(!prepared){
    const base=this.get(image,type,layers,0,true,{neighbors:options.neighbors,staticTint:true,worldLayer:options.worldLayer||0});
    const bc=base.getContext('2d'),frame=bc.getImageData(0,0,base.width,base.height),data=frame.data,targets=new Uint8ClampedArray(data.length),lum=new Float32Array(data.length/4),masks=options.lights.map(()=>new Uint8Array(data.length/4));
    const rc=document.createElement('canvas');rc.width=image.width;rc.height=image.height;rc.getContext('2d').drawImage(image,0,0);const raw=rc.getContext('2d').getImageData(0,0,rc.width,rc.height).data;
    for(let n=0;n<lum.length;n++){const i=n*4;if(raw[i+3]<32||Math.abs(raw[i]-229)+Math.abs(raw[i+1]-221)+Math.abs(raw[i+2]-198)<36)continue;lum[n]=raw[i]*.299+raw[i+1]*.587+raw[i+2]*.114;const x=n%image.width,y=Math.floor(n/image.width),palette=materialPaletteAt(shadeRoom,x,y,image.width,image.height,options.neighbors);targets[i]=palette.light[0];targets[i+1]=palette.light[1];targets[i+2]=palette.light[2];for(let k=0;k<options.lights.length;k++){const l=options.lights[k],d=Math.hypot(origin.x+x*scale-l.x,origin.y+y*scale-l.y),f=1-shaderSmooth(0,l.radius||100,d);masks[k][n]=Math.round(f*f*255);}}
    prepared={frame,targets,lum,masks,bytes:frame.data.byteLength+targets.byteLength+lum.byteLength+masks.reduce((sum,m)=>sum+m.byteLength,0)};this.prepared.set(spec,prepared);this.preparedBytes+=prepared.bytes;while(this.prepared.size>96||this.preparedBytes>24*1024*1024&&this.prepared.size>1){const oldest=this.prepared.keys().next().value;this.preparedBytes-=this.prepared.get(oldest).bytes;this.prepared.delete(oldest);}
   }
   const canvas=document.createElement('canvas');canvas.width=image.width;canvas.height=image.height;const c=canvas.getContext('2d'),frame=c.createImageData(canvas.width,canvas.height);frame.data.set(prepared.frame.data);const p=frame.data,pulse=(1-Math.cos(phase/16*Math.PI*2))*.5,weights=options.lights.map(l=>(l.intensity??.2)/255*(reduced?1:.9+.1*Math.sin(phase*500/(l.period||1300)+(l.x+l.y)*.02)));
   for(let n=0;n<prepared.lum.length;n++){const lum=prepared.lum[n];if(!lum)continue;const i=n*4;let light=0;for(let k=0;k<weights.length;k++)light+=prepared.masks[k][n]*weights[k];light=Math.min(.38,light);const shine=crystal&&lum>95?pulse*.22*Math.min(1,(lum-95)/90):0;for(let k=0;k<3;k++){const base=p[i+k]+([176,220,247][k]-p[i+k])*shine;p[i+k]=Math.round(base+(prepared.targets[i+k]-base)*light);}}
   c.putImageData(frame,0,0);this.cache.set(key,canvas);this.latest.set(spec,canvas);if(this.latest.size>192)this.latest.delete(this.latest.keys().next().value);if(this.cache.size>this.limit)this.cache.delete(this.cache.keys().next().value);return canvas;
  }
  const canvas=document.createElement('canvas');canvas.width=image.width;canvas.height=image.height;const c=canvas.getContext('2d');c.drawImage(image,0,0);
  const frame=c.getImageData(0,0,canvas.width,canvas.height),p=frame.data,w=canvas.width,pulse=(1-Math.cos(phase/16*Math.PI*2))*.5;
  const material=passagePalette(shadeRoom),palette=[material.floor,material.wall,material.light];
  for(let i=0;i<p.length;i+=4){
   const original=[p[i],p[i+1],p[i+2]],paperDistance=Math.abs(p[i]-229)+Math.abs(p[i+1]-221)+Math.abs(p[i+2]-198);
   if(p[i+3]<32||paperDistance<36)continue;const lum=original[0]*.299+original[1]*.587+original[2]*.114,x=i/4%w,y=Math.floor(i/4/w);
   const surface=options.neighbors?.length?materialPaletteAt(shadeRoom,x,y,canvas.width,canvas.height,options.neighbors):null;let color=roomTone(lum,surface?[surface.floor,surface.wall,surface.light]:palette);
   if(crystal&&lum>95)color=roomMix(color,[176,220,247],pulse*.22*Math.min(1,(lum-95)/90));
   for(const hazard of layers){const hMaterial=passagePalette({type:hazard,worldLayer:options.worldLayer||0}),palette=surface&&hazard===layers[0]?[surface.floor,surface.wall,surface.light]:[hMaterial.floor,hMaterial.wall,hMaterial.light],liquid=['water','lava','crater'].includes(hazard),depth=y/canvas.height;
    color=roomMix(color,roomTone(lum,palette),liquid?(.4+.52*shaderSmooth(.38,.70,depth)):.72);
    // Wet glints and wisps modify only existing foreground pixels, never a box.
    if(liquid&&depth>.52&&(y%9===2&&x%13<7))color=roomMix(color,palette[2],.5);
    if(!liquid&&(x+y*2)%23<2)color=roomMix(color,palette[2],.22);
   }
   if(options.lights?.length){const origin=options.origin||{x:0,y:0},scale=options.scale||1,light=materialLightsAt(origin.x+x*scale,origin.y+y*scale,options.lights,phase*500,reduced);color=roomMix(color,surface?.light||material.light,light);}
   p[i]=color[0];p[i+1]=color[1];p[i+2]=color[2];
  }
  c.putImageData(frame,0,0);this.cache.set(key,canvas);if(this.cache.size>this.limit)this.cache.delete(this.cache.keys().next().value);return canvas;
 }
 url(image,type,hazards,time,reduced,options={}){const result=this.get(image,type,hazards,time,reduced,options);if(!result)return null;if(result instanceof HTMLCanvasElement){result.roomDataURL??=result.toDataURL('image/png');return result.roomDataURL}return result.src}
}
