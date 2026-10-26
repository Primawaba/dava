import {passageArchitecture,passagePalette} from './passages.js';
import {visualRoom,sharedBossRoom,sharedFormation} from './room-modules.js';
import {terrainNoise,shaderSmooth,shaderMix,materialLightsAt} from './material-shader.js';
export const CAVE_PORTS=[{dx:0,dy:-1,bit:1},{dx:1,dy:0,bit:2},{dx:0,dy:1,bit:4},{dx:-1,dy:0,bit:8}];
// Blob normalization gives the standard 47 valid configurations. A diagonal
// cannot erase a wall unless both cardinal passages are really open.
export function normalizeCaveMask(mask){for(const [diagonal,sides]of [[16,3],[32,6],[64,12],[128,9]])if((mask&sides)!==sides)mask&=~diagonal;return mask;}
export function caveMask(game,r){let mask=0;for(const p of CAVE_PORTS)if(game.linked(r,game.room(r.x+p.dx,r.y+p.dy)))mask|=p.bit;for(const [dx,dy,bit,sides]of [[1,-1,16,3],[1,1,32,6],[-1,1,64,12],[-1,-1,128,9]]){const d=game.room(r.x+dx,r.y+dy),a=game.room(r.x+dx,r.y),b=game.room(r.x,r.y+dy);if((mask&sides)===sides&&d&&game.linked(a,d)&&game.linked(b,d))mask|=bit;}return normalizeCaveMask(mask);}
export function caveTerrainRoom(game,r){return !!r&&!r.playerBuilt&&!r.craterRoot&&!['gate','surface','shaft','elevator','crater','bridge','drawbridge'].includes(r.type)&&passageArchitecture(visualRoom(game,r))==='cavern';}
export function caveEdgeWide(game,a,b){return !!b&&(sharedBossRoom(game,a,b)||sharedFormation(a,b)||a.cavernGroup&&a.cavernGroup===b.cavernGroup);}
const terrainBox=(x,y,hx,hy,r)=>{const qx=Math.abs(x)-hx+r,qy=Math.abs(y)-hy+r;return Math.hypot(Math.max(qx,0),Math.max(qy,0))+Math.min(Math.max(qx,qy),0)-r;};
export class CaveAutotiler{
 constructor(renderer){this.renderer=renderer;this.geometry=new Map();this.sources=new WeakMap();}
 eligible(r){return caveTerrainRoom(this.renderer.game,r)&&!this.renderer.wholeRoom(r);}
 descriptor(r){const game=this.renderer.game;return CAVE_PORTS.filter(p=>game.linked(r,game.room(r.x+p.dx,r.y+p.dy))).map(p=>({...p,room:{...visualRoom(game,game.room(r.x+p.dx,r.y+p.dy)),hazards:game.roomHazards(game.room(r.x+p.dx,r.y+p.dy))},wide:!!caveEdgeWide(game,r,game.room(r.x+p.dx,r.y+p.dy))}));}
 lights(r){const renderer=this.renderer,game=renderer.game;if(this.lightFrame!==renderer.passageTime||this.lightGame!==game){this.lightFrame=renderer.passageTime;this.lightGame=game;this.lightBuckets=new Map();const add=source=>{const x=Math.round(source.x/180),y=Math.round(source.y/144);for(let dx=-2;dx<=2;dx++)for(let dy=-2;dy<=2;dy++){const id=`${x+dx},${y+dy}`;if(!this.lightBuckets.has(id))this.lightBuckets.set(id,[]);this.lightBuckets.get(id).push(source);}};for(const cell of game.rooms){const v=visualRoom(game,cell);if(['crystal','lava','crater','forge','portal','void'].includes(v.type))add({x:cell.x*180,y:cell.y*144-8,radius:140,intensity:.20,period:v.type==='void'?2600:v.type==='crystal'?1300:480});if(passageArchitecture(v)==='built')for(const [dx,dy]of [[1,0],[0,1]]){const n=game.room(cell.x+dx,cell.y+dy);if(n&&game.linked(cell,n)&&passageArchitecture(visualRoom(game,n))==='built'&&!game.barricade(cell,n))add({x:(cell.x+n.x)*90,y:(cell.y+n.y)*72-13,radius:100,intensity:.17,period:270});}}}return this.lightBuckets.get(`${r.x},${r.y}`)||[];}

 shaderOptions(r,width=180,height=144){return{worldLayer:r.worldLayer||0,neighbors:this.descriptor(r),origin:{x:r.x*180-(width===180?90:80),y:r.y*144-(height===144?72:62)},scale:(width===180?180:160)/width,lights:this.lights(r)};}
 source(image){if(!image)return null;if(this.sources.has(image))return this.sources.get(image);const c=document.createElement('canvas');c.width=180;c.height=144;const ctx=c.getContext('2d');ctx.imageSmoothingEnabled=false;ctx.drawImage(image,10,10,160,107.5);const p=ctx.getImageData(0,0,180,144).data;this.sources.set(image,p);return p;}
 tile(r,time){const renderer=this.renderer,game=renderer.game,ports=this.descriptor(r),mask=caveMask(game,r),raw=renderer.framedRoomImage(r),art=this.source(raw),signature=[r.x,r.y,r.type,r.variant,r.artPanel,mask,ports.map(p=>p.wide?1:0).join(''),r.enchanted,r.enchantedIndex,r.dragonAwake].join(':');let canvas=this.geometry.get(signature);
  if(!canvas){canvas=document.createElement('canvas');canvas.width=180;canvas.height=144;const ctx=canvas.getContext('2d'),frame=ctx.createImageData(180,144),p=frame.data;
   for(let sy=0;sy<144;sy+=2)for(let sx=0;sx<180;sx+=2){const x=sx-90,y=sy-67,wx=r.x*180+x,wy=r.y*144+sy-72,grain=terrainNoise(Math.floor(wx/4),Math.floor(wy/4)),distance=terrainBox(x,y,77,49,22);let d=distance+(terrainNoise(Math.floor(wx/8),Math.floor(wy/8))-.5)*5,arm=Infinity;
    for(const port of ports){const radius=port.wide?30:14;const edge=port.dx?Math.abs(y)-radius:Math.abs(x)-radius;const along=port.dx?x*port.dx:y*port.dy;if(along>=(port.dx?54:34))arm=Math.min(arm,edge);}
    for(const [dx,dy,bit]of [[1,-1,16],[1,1,32],[-1,1,64],[-1,-1,128]])if(mask&bit&&ports.some(p=>p.dx===dx&&p.wide)&&ports.some(p=>p.dy===dy&&p.wide)&&x*dx>=36&&y*dy>=25)d=Math.min(d,-10);
    d=Math.min(d,arm);if(d>7)continue;let color=d<-2?[28+grain*6,27+grain*5,22+grain*4]:d<2?[66+grain*21,59+grain*19,44+grain*15]:[120+grain*27,107+grain*23,79+grain*17];
    // Native room illustrations supply contents; only the standardized port
    // aprons and walls are replaced. The source is never stretched or warped.
    const i=(sy*180+sx)*4;if(art&&distance<-7&&arm>8&&art[i+3]>128&&Math.abs(art[i]-229)+Math.abs(art[i+1]-221)+Math.abs(art[i+2]-198)>48)color=[art[i],art[i+1],art[i+2]];
    for(let dy=0;dy<2;dy++)for(let dx=0;dx<2;dx++)p.set([...color.map(Math.round),255],((sy+dy)*180+sx+dx)*4);
   }ctx.putImageData(frame,0,0);this.geometry.set(signature,canvas);if(this.geometry.size>256)this.geometry.delete(this.geometry.keys().next().value);
  }
  return renderer.appearance.get(canvas,visualRoom(game,r).type,game.roomHazards(r),time,renderer.reduced,this.shaderOptions(r));
 }
 drawConnection(a,b,time){const renderer=this.renderer,c=renderer.ctx,game=renderer.game,vertical=a.x===b.x,wide=!!caveEdgeWide(game,a,b),half=wide?30:14,pa=passagePalette({...visualRoom(game,a),hazards:game.roomHazards(a)}),pb=passagePalette({...visualRoom(game,b),hazards:game.roomHazards(b)}),cx=(a.x+b.x)*90,cy=(a.y+b.y)*72+(vertical?0:-5),lights=this.lights(a);
  // World-space integer grain and shared endpoints prevent transparent seams.
  for(let along=-42;along<42;along+=2)for(let across=-half-8;across<half+8;across+=2){const x=cx+(vertical?across:along),y=cy+(vertical?along:across),noise=terrainNoise(Math.floor(x/4),Math.floor(y/4)),depth=Math.abs(across),blend=shaderSmooth(-42,42,along),role=depth<half-2?'floor':depth<half+2?'wall':'light';let color=shaderMix(pa[role],pb[role],blend);const illumination=materialLightsAt(x,y,lights,time,renderer.reduced);color=shaderMix(color,shaderMix(pa.light,pb.light,blend),illumination);if(role!=='floor'){const architecture=passageArchitecture(visualRoom(game,along<0?a:b));if(architecture==='built'){const course=Math.floor((across+half+8)/6);if(Math.floor(across+half+8)%6<2||((Math.floor(along)+course%2*8)%16+16)%16<2)color=shaderMix(pa.floor,pb.floor,blend);}else color=color.map(v=>Math.round(v*(.80+noise*.25)));}c.fillStyle=`rgb(${color.join(',')})`;c.fillRect(x,y,2,2);}
 }
}
