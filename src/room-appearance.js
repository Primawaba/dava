import {materialPaletteAt,materialLightsAt,shaderSmooth} from './material-shader.js';
import {passagePalette} from './passages.js';
const ROOM_HAZARD_COLORS={slime:[[22,37,15],[74,108,38],[151,180,84]],water:[[15,39,49],[39,95,117],[118,183,197]],lava:[[45,23,17],[143,65,28],[229,143,60]],crater:[[45,23,17],[143,65,28],[229,143,60]],gas:[[24,36,18],[72,106,39],[161,190,92]],miasma:[[33,24,39],[99,71,114],[171,141,184]],blindgas:[[31,34,34],[89,100,103],[168,186,186]],flammable:[[39,34,20],[116,105,49],[195,184,105]]};
const roomMix=(a,b,t)=>a.map((v,i)=>Math.round(v+(b[i]-v)*t));
function roomTone(lum,palette){return lum<95?roomMix(palette[0],palette[1],Math.max(0,(lum-20)/75)):roomMix(palette[1],palette[2],Math.min(1,(lum-95)/100))}
export class RoomAppearance{
 constructor(limit=384){this.cache=new Map();this.identities=new WeakMap();this.nextId=1;this.limit=limit}
 get(image,type,hazards=[],time=0,reduced=false,options={}){
  if(!image)return null;const crystal=type==='crystal',layers=hazards.filter(h=>ROOM_HAZARD_COLORS[h]);
  if(!this.identities.has(image))this.identities.set(image,this.nextId++);
  const phase=(crystal||options.lights?.length)&&!reduced?Math.floor(time/500)%16:0,key=`${this.identities.get(image)}|${type}|${layers.join(',')}|${phase}|${JSON.stringify(options)}`;
  if(this.cache.has(key)){const value=this.cache.get(key);this.cache.delete(key);this.cache.set(key,value);return value}
  const canvas=document.createElement('canvas');canvas.width=image.width;canvas.height=image.height;const c=canvas.getContext('2d');c.drawImage(image,0,0);
  const frame=c.getImageData(0,0,canvas.width,canvas.height),p=frame.data,w=canvas.width,pulse=(1-Math.cos(phase/16*Math.PI*2))*.5;
  const material=passagePalette({type,hazards:layers}),palette=[material.floor,material.wall,material.light];
  for(let i=0;i<p.length;i+=4){
   const original=[p[i],p[i+1],p[i+2]],paperDistance=Math.abs(p[i]-229)+Math.abs(p[i+1]-221)+Math.abs(p[i+2]-198);
   if(p[i+3]<32||paperDistance<36)continue;const lum=original[0]*.299+original[1]*.587+original[2]*.114,x=i/4%w,y=Math.floor(i/4/w);
   const surface=options.neighbors?.length?materialPaletteAt({type,hazards:layers},x,y,canvas.width,canvas.height,options.neighbors):null;let color=roomTone(lum,surface?[surface.floor,surface.wall,surface.light]:palette);
   if(crystal&&lum>95)color=roomMix(color,[176,220,247],pulse*.22*Math.min(1,(lum-95)/90));
   for(const hazard of layers){const hMaterial=passagePalette({type:hazard}),palette=surface&&hazard===layers[0]?[surface.floor,surface.wall,surface.light]:[hMaterial.floor,hMaterial.wall,hMaterial.light],liquid=['water','lava','crater'].includes(hazard),depth=y/canvas.height;
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
 url(image,type,hazards,time,reduced){const result=this.get(image,type,hazards,time,reduced);if(!result)return null;if(result instanceof HTMLCanvasElement){result.roomDataURL??=result.toDataURL('image/png');return result.roomDataURL}return result.src}
}
