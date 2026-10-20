import {ROOMS,CRYSTAL_PALETTE} from './data.js';
// Software pixel shader: evaluate a mask, material transition and lighting once
// per connection. Canvas 2D keeps the same result offline and on mobile GPUs.
const PASSAGE_MATERIALS={
 rock:{wall:[89,84,66],light:[163,153,119],floor:[27,29,24]},
 masonry:{wall:[99,95,78],light:[176,166,134],floor:[30,31,27]},
 mine:{wall:[103,82,55],light:[173,146,99],floor:[33,29,22]},
 water:{wall:[66,91,80],light:[125,164,145],floor:[24,47,43]},
 fire:{wall:[109,71,47],light:[191,135,75],floor:[47,28,22]},
 organic:{wall:[105,97,51],light:[177,159,90],floor:[38,35,21]},
 forest:{wall:[69,86,53],light:[138,157,98],floor:[25,35,23]},
 crypt:{wall:[91,89,77],light:[175,169,140],floor:[28,28,25]},
 crystal:CRYSTAL_PALETTE,
 gas:{wall:[82,96,61],light:[147,165,104],floor:[29,40,25]}
};
export function passageArchitecture(room){return ROOMS[room.type]?.r!==undefined||['gate','crypt','ancienttemple','ancientlibrary','ancientprison','rivalhold','city','tomb','sealed','vault'].includes(room.type)?'built':'cavern'}
export function passageMaterial(room){
 const type=room.contaminant||room.type;
 if(['water','sewer','well','laundry','pump','springs','mud'].includes(type))return 'water';
 if(['lava','crater','forge','golemforge','kitchen','dragon'].includes(type))return 'fire';
 if(['gas','flammable','miasma','blindgas'].includes(type))return 'gas';
 if(['hive','nest','breeder'].includes(type))return 'organic';
 if(['forest','fungus','fungi','mushrooms'].includes(type))return 'forest';
 if(['mine','rivalmine','rails','shaft','elevator','workshop'].includes(type))return 'mine';
 if(['crypt','tomb','ancientprison','desolate'].includes(type))return 'crypt';
 if(['crystal','portal','stabilizer','artifact','ritual','chaos'].includes(type))return 'crystal';
 if(['cave','surface','ruins','chasm'].includes(type))return 'rock';
 return 'masonry';
}
function passageNoise(x,y,seed){let n=Math.imul(x+seed,374761393)^Math.imul(y+seed,668265263);n=Math.imul(n^(n>>>13),1274126177);return((n^(n>>>16))>>>0)/4294967296}
function passageHash(text){let n=2166136261;for(const char of text)n=Math.imul(n^char.charCodeAt(0),16777619);return n>>>0}
function passageMix(a,b,t){return a.map((v,i)=>Math.round(v+(b[i]-v)*t))}
function passageRGB(a){return `rgb(${a.join(',')})`}
export class ProceduralPassages{
 constructor(limit=256){this.cache=new Map();this.textures=new WeakMap();this.limit=limit;this.generated=0}
 texture(image){
  if(!image)return null;if(this.textures.has(image))return this.textures.get(image);
  const tile=document.createElement('canvas');tile.width=32;tile.height=24;
  const ctx=tile.getContext('2d',{willReadFrequently:true});ctx.drawImage(image,0,0,32,24);
  const data=ctx.getImageData(0,0,32,24).data;this.textures.set(image,data);return data;
 }
 get(a,b,vertical,images){
  const signature=r=>`${r.x},${r.y}:${r.type}:${r.variant}:${r.contaminant||''}:${!!r.damaged}`;
  const id=`${vertical?'v':'h'}|${signature(a)}|${signature(b)}`;
  if(this.cache.has(id)){const entry=this.cache.get(id);this.cache.delete(id);this.cache.set(id,entry);return entry}
  const ma=passageMaterial(a),mb=passageMaterial(b),aa=passageArchitecture(a),ab=passageArchitecture(b),pa=PASSAGE_MATERIALS[ma],pb=PASSAGE_MATERIALS[mb];
  const seed=passageHash(id),length=vertical?27:26,height=20,canvas=document.createElement('canvas');canvas.width=length;canvas.height=height;
  const ctx=canvas.getContext('2d'),pixels=ctx.createImageData(length,height);
  const textures=[this.texture(images[`${a.type}-${a.variant}`]),this.texture(images[`${b.type}-${b.variant}`])];
  // Distort only the walls: the central walkable strip stays straight, matching
  // gameplay paths and ranged line of sight. All evaluation is in integer pixels.
  for(let x=0;x<length;x++){
   const t=x/(length-1),blend=aa===ab?t*t*(3-2*t):t<.5?0:1,envelope=Math.sin(t*Math.PI),architecture=t<.5?aa:ab;
   const warp=architecture==='built'?0:Math.round((passageNoise(Math.floor(x/4),0,seed)-.5)*3*envelope);
   for(let y=0;y<height;y++){
    const side=y<10?-1:1,edge=side<0?(architecture==='built'?3:2+Math.round(envelope*2)+warp):(architecture==='built'?16:17-Math.round(envelope*2)+warp),distance=side<0?y-edge:edge-y;
    const noise=passageNoise(x,y,seed);if(distance<0&&(architecture==='built'||distance<-2||noise>.45))continue;
    const center=y>=7&&y<=12;
    let color=center?passageMix(pa.floor,pb.floor,blend):passageMix(pa.wall,pb.wall,blend);
    if(!center){
     if(architecture==='built'&&((y===5||y===14)||(x+(y<7?0:3))%6===0))color=[46,43,34];
     if(distance<=1)color=passageMix(pa.light,pb.light,blend);
     else if(noise<.24)color=color.map(v=>Math.round(v*.62));
     else if(noise>.8)color=passageMix(color,passageMix(pa.light,pb.light,blend),.45);
     // Grain from the actual room illustrations, dithered across the transition.
     const source=textures[noise<blend?1:0];
     if(source){const i=((y%24)*32+(x%32))*4,lum=(source[i]+source[i+1]+source[i+2])/3;if(source[i+3]>128&&lum<190&&lum>25)color=passageMix(color,[source[i],source[i+1],source[i+2]],.3)}
    }
    if((a.damaged&&t<.5||b.damaged&&t>.5)&&((x+y*2)%13===0))color=[39,32,27];
    const index=(y*length+x)*4;pixels.data.set([...color,255],index);
   }
  }
  ctx.putImageData(pixels,0,0);
  // Material-specific details fade out before the other room's entrance.
  for(let x=2;x<length-2;x++){
   const t=x/(length-1),material=aa!==ab?(t<.5?ma:mb):passageNoise(x,21,seed)<t?mb:ma;
   const palette=PASSAGE_MATERIALS[material];ctx.fillStyle=passageRGB(palette.light);
   if(vertical){if(x%4===0)ctx.fillRect(x,7,1,6);ctx.fillStyle=passageRGB(palette.wall);ctx.fillRect(x,6,1,1);ctx.fillRect(x,13,1,1)}
   if(material==='mine'){
    if(!vertical){ctx.fillRect(x,7,1,1);ctx.fillRect(x,12,1,1);if(x%7===0){ctx.fillStyle='#66563a';ctx.fillRect(x,3,2,4);ctx.fillRect(x,13,2,4)}}
   }else if(material==='masonry'||material==='crypt'){
    if(x%6===0){ctx.fillStyle='#302f27';ctx.fillRect(x,3,1,3);ctx.fillRect(x+2,14,1,3)}
    if(material==='crypt'&&x%13===0){ctx.fillStyle='#b0a68a';ctx.fillRect(x,4,2,2);ctx.fillStyle='#24251f';ctx.fillRect(x,5,1,1)}
   }else if(material==='forest'||material==='organic'){
    if(x%3===0){ctx.fillRect(x,5,2,1);ctx.fillRect(x+1,6,1,1)}
    if(material==='organic'&&x%5===0){ctx.fillStyle='#494325';ctx.fillRect(x,14,3,2);ctx.fillStyle='#9c8a4f';ctx.fillRect(x+1,14,1,1)}
   }else if(material==='fire'&&x%4===0){ctx.fillStyle='#b67d44';ctx.fillRect(x,14,2,1)}
   else if(material==='water'&&x%5===0){ctx.fillStyle='#709789';ctx.fillRect(x,12,3,1)}
   else if(material==='crystal'&&x%8===0){ctx.fillRect(x,3,1,3);ctx.fillRect(x-1,4,3,1)}
  }
  // Door jambs belong only to the built endpoint. Cavern mouths retain rough rock.
  for(const [architecture,x]of [[aa,0],[ab,length-3]])if(architecture==='built'){
   ctx.fillStyle='#302e25';ctx.fillRect(x,2,3,5);ctx.fillRect(x,13,3,5);
   ctx.fillStyle='#b3a783';ctx.fillRect(x,2,2,1);ctx.fillRect(x,13,2,1);
   ctx.fillStyle='#777057';ctx.fillRect(x,3,2,3);ctx.fillRect(x,14,2,3);
  }
  const entry={canvas,ma,mb,aa,ab,seed,length,vertical};this.cache.set(id,entry);this.generated++;
  if(this.cache.size>this.limit)this.cache.delete(this.cache.keys().next().value);
  return entry;
 }
 draw(ctx,a,b,vertical,images,time,reduced,fortification=null){
  const entry=this.get(a,b,vertical,images),{canvas,length,ma,mb,seed}=entry;
  ctx.save();ctx.imageSmoothingEnabled=false;
  // Local X always follows the connection, so the same mask joins all 4 ports.
  ctx.translate(a.x*180+(vertical?0:64),a.y*144+(vertical?42:0));if(vertical)ctx.rotate(Math.PI/2);
  ctx.drawImage(canvas,0,-20,length*2,40);
  const phase=reduced?0:Math.floor(time/240)%8;
  for(let x=2;x<length-2;x+=4){
   const t=x/(length-1),material=t<.5?ma:mb;
   if(material==='water'||material==='fire'){
    ctx.fillStyle=material==='water'?'#80a899':'#c38c50';const y=material==='water'?10:14;
    ctx.fillRect((x+(phase+Math.floor(seed%3))%3)*2,(y-10)*2,4,2);
   }else if(material==='gas'){
    ctx.fillStyle='#8c9c6077';const y=6+(x+phase)%7;ctx.fillRect(x*2,(y-10)*2,6,2);
   }
  }
  ctx.restore();
  if(!fortification&&entry.aa==='built'&&entry.ab==='built'){
   const x=Math.round((a.x+b.x)*90+(vertical?15:0)),y=Math.round((a.y+b.y)*72+(vertical?-2:-13));
   const flicker=reduced?0:Math.floor(time/160)%3;
   ctx.save();ctx.translate(x,y);ctx.fillStyle='#d6a44918';ctx.fillRect(-12,-14,26,28);ctx.fillStyle='#c6954528';ctx.fillRect(-7,-9,16,17);
   ctx.fillStyle='#302a20';ctx.fillRect(-2,0,6,11);ctx.fillStyle='#8a6238';ctx.fillRect(0,2,2,7);
   ctx.fillStyle='#b87936';ctx.fillRect(-3,-4,8,6);ctx.fillStyle='#d7a148';ctx.fillRect(-1,-8-flicker*2,4,8+flicker*2);ctx.fillStyle='#ead9a0';ctx.fillRect(0,-5-flicker*2,2,5);ctx.restore();
  }
 }
}
