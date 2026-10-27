import {CaveAutotiler} from './terrain-autotile.js';
import {installWholeRooms,WHOLE_ASSETS} from './whole-rooms.js';
import {installColonyView} from './colony-view.js';
import {visualRoom,sharedBossRoom,masonryRoom,sharedFormation,EXTENSION_FAMILIES} from './room-modules.js';
import {passageArchitecture,passagePalette} from './passages.js';
import {BattleTransitions} from './battle-transitions.js';
import {CavernModules} from './cavern-modules.js';
import {RoomFraming} from './room-framing.js';
import {RoomAppearance} from './room-appearance.js';
import {ProceduralPassages} from './passages.js';
import {ROOMS,DIRS,SPRITE_FRAMES,PASSAGES,DAMAGEABLE_ROOMS} from './data.js';
import {key} from './engine.js';
export const CW=180,CH=144;
export class Renderer{
 constructor(canvas,onSelect,onHover){this.canvas=canvas;this.ctx=canvas.getContext('2d');this.zoom=1;this.camera={x:0,y:80};this.images={};this.wholeImages={};this.cavernImages={};this.extensionImages={};this.appearance=new RoomAppearance();this.framing=new RoomFraming();this.caverns=new CavernModules();this.terrain=new CaveAutotiler(this);this.transitions=new BattleTransitions(this);this.passages=new ProceduralPassages();this.selected={x:0,y:0};this.hover=null;this.game=null;this.reduced=false;this.pointers=new Map();this.directionMarkers=[];this.drag=null;this.pinch=null;this.onSelect=onSelect;this.onHover=onHover;this.setupInput();if(typeof ResizeObserver!=='undefined'){this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(canvas)}else window.addEventListener('resize',()=>this.resize());this.resize()}
 async load(){
  const assets=Object.keys(ROOMS).flatMap(type=>[0,1,2].map(v=>({id:`${type}-${v}`,src:`./assets/rooms/${type}-${v}.png`})));
  assets.push(...[0,1,2].map(v=>({id:`awake-dragon-${v}`,src:`./assets/rooms/awake-dragon-${v}.png`})));
  assets.push(...Object.keys(SPRITE_FRAMES).map(type=>({id:`unit-${type}`,src:`./assets/sprites/${type}.png`})));
  assets.push(...Array.from({length:7},(_,i)=>i+1).flatMap(layer=>Object.keys(SPRITE_FRAMES).map(type=>({id:`layer-${layer}-${type}`,src:`./assets/layer-enemies/${layer}-${type}.png`}))));
  assets.push(...DAMAGEABLE_ROOMS.flatMap(type=>[0,1,2].map(v=>({id:`damaged-${type}-${v}`,src:`./assets/damaged-rooms/${type}-${v}.png`}))));
  assets.push(...['horizontal-0','horizontal-1','vertical-0','vertical-1'].map(name=>({id:'cavern-'+name,src:`./assets/caverns/${name}.png`})));
  assets.push(...['horizontal-0','horizontal-1','vertical-0','vertical-1'].map(name=>({id:'built-'+name,src:`./assets/modules/built-${name}.png`})));
  assets.push({id:'extension-liquid-bridge',src:'./assets/modules/liquid-bridge.png'});
  assets.push(...EXTENSION_FAMILIES.flatMap(family=>[0,1,2].map(v=>({id:`extension-${family}-${v}`,src:`./assets/modules/${family}-${v}.png`}))));
  assets.push(...['mystic-0','mystic-1','mystic-2','mystic-3','mystic-4','mystic-5','long-0','long-1','long-2','long-3','chasm-0','chasm-1','deep-portal',...['smith','mason','scholar','cook','engineer','attendant','miner','lumberjack'].flatMap(job=>[0,1,2].map(v=>`${job}-${v}`)),...['damage','delay'].flatMap(kind=>[1,2,3].map(v=>`trap-${kind}-${v}`))].map(name=>({id:'colony-'+name,src:`./assets/colony/${name}.png`})) );
  assets.push(...WHOLE_ASSETS.map(name=>({id:'whole-'+name,src:`./assets/whole/${name}.png`})));
  assets.push(...PASSAGES.map(name=>({id:`passage-${name}`,src:`./assets/passages/${name}.png`})));
  await Promise.all(assets.map(({id,src})=>new Promise(resolve=>{const i=new Image();i.onload=()=>{(id.startsWith('whole-')?this.wholeImages:id.startsWith('extension-')?this.extensionImages:id.startsWith('cavern-')||id.startsWith('built-')?this.cavernImages:this.images)[id.startsWith('whole-')?id.slice(6):id]=i;resolve()};i.onerror=()=>resolve();i.src=src})));
  this.passages.cache.clear();this.appearance.cache.clear();this.terrain.geometry.clear();
  if(this.images['unit-immortal']){const outline=document.createElement('canvas');outline.width=outline.height=64;const c=outline.getContext('2d');c.drawImage(this.images['unit-immortal'],0,0,64,64);c.globalCompositeOperation='source-in';c.fillStyle='#b5a56f';c.fillRect(0,0,64,64);this.immortalOutline=outline}
 }
 bridgeRoomImage(r){const source=this.images[`${r.sourceType}-${r.variant}`],overlay=this.extensionImages['extension-liquid-bridge'];if(!source||!overlay)return source;this.bridgeSprites??=new Map();const id=`${r.sourceType}:${r.variant}:${r.damaged}`;if(this.bridgeSprites.has(id))return this.bridgeSprites.get(id);const tile=document.createElement('canvas');tile.width=128;tile.height=86;const c=tile.getContext('2d');c.imageSmoothingEnabled=false;c.drawImage(source,0,0,128,86);c.drawImage(overlay,0,0);if(r.damaged){c.fillStyle='#201f1b';c.fillRect(46,62,2,9);c.fillRect(82,65,2,8)}this.bridgeSprites.set(id,tile);return tile}
 rawRoomImage(r){if(r.sourceType&&['bridge','drawbridge'].includes(r.type))return this.bridgeRoomImage(r);const view=visualRoom(this.game,r);if(view.builtExtension)return this.images[`${view.damaged&&DAMAGEABLE_ROOMS.includes(view.type)?'damaged-':''}${view.type}-${view.variant}`]||this.images[`${view.type}-${view.variant}`];if(view.bossExtension)return this.extensionImages[`extension-${view.bossFamily}-${view.variant}`]||this.images[`${view.type}-${view.variant}`];if(r.type==='dragon'&&r.dragonAwake)return this.images[`awake-dragon-${r.variant}`]||this.images[`dragon-${r.variant}`];return this.images[`${r.damaged&&DAMAGEABLE_ROOMS.includes(r.type)?'damaged-':''}${r.type}-${r.variant}`]||this.images[`${r.type}-${r.variant}`]}
 framedRoomImage(r){const raw=this.rawRoomImage(r);return ROOMS[r.type]?.r===undefined&&!['gate','surface','shaft'].includes(r.type)?this.framing.frame(raw):raw}
 roomImage(r,time=0){return this.appearance.get(this.framedRoomImage(r),visualRoom(this.game,r).type,this.game?.roomHazards(r)||[],time,this.reduced,this.game?this.terrain.shaderOptions(r,128,86):{})}
 roomURL(r,time=0){const spec=this.wholeRoom(r);return this.appearance.url(spec?this.wholeImage(spec):this.framedRoomImage(r),spec?(spec.type==='lost'?'artifact':spec.type.startsWith('desolate-')?'desolate':spec.type):visualRoom(this.game,r).type,this.game?.roomHazards(r)||[],time,this.reduced,{worldLayer:r.worldLayer||0})}
 resize(){const r=this.canvas.getBoundingClientRect();this.width=r.width;this.height=r.height;const dpr=Math.min(devicePixelRatio||1,2);this.canvas.width=Math.round(r.width*dpr);this.canvas.height=Math.round(r.height*dpr);this.dpr=dpr}
 screenToWorld(x,y){return{x:(x-this.width/2)/this.zoom+this.camera.x,y:(y-this.height/2)/this.zoom+this.camera.y}}
 point(event){const r=this.canvas.getBoundingClientRect();return{x:event.clientX-r.left,y:event.clientY-r.top}}
 tile(x,y){const p=this.screenToWorld(x,y);return{x:Math.round(p.x/CW),y:Math.round(p.y/CH)}}
 directionAt(p){
  if(!this.game)return null;
  // Recompute against the current camera: focus/resize can precede the next frame.
  for(const d of this.game.directions()){
   const screenX=this.width/2+(d.from.x*CW+d.dx*CW/2-this.camera.x)*this.zoom,screenY=this.height/2+(d.from.y*CH+d.dy*CH/2-this.camera.y)*this.zoom;
   if(Math.hypot(screenX-p.x,screenY-p.y)<=22)return {...d,screenX,screenY};
  }return null;
 }
 setupInput(){const c=this.canvas;
  c.addEventListener('pointerdown',e=>{const p=this.point(e);this.pointers.set(e.pointerId,p);c.setPointerCapture?.(e.pointerId);this.drag={start:p,last:p,moved:false};if(this.pointers.size===2){const a=[...this.pointers.values()];this.pinch={distance:Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y),zoom:this.zoom};this.drag.moved=true}this.onHover(null)});
  c.addEventListener('pointermove',e=>{const p=this.point(e);if(this.pointers.has(e.pointerId)){this.pointers.set(e.pointerId,p);if(this.pointers.size===2&&this.pinch){const a=[...this.pointers.values()];this.zoom=Math.max(.35,Math.min(2.2,this.pinch.zoom*Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y)/Math.max(1,this.pinch.distance)));return}if(this.drag){const d=this.drag;if(Math.hypot(p.x-d.start.x,p.y-d.start.y)>5)d.moved=true;if(d.moved){this.camera.x-=(p.x-d.last.x)/this.zoom;this.camera.y-=(p.y-d.last.y)/this.zoom}d.last=p}return}this.hover=this.tile(p.x,p.y);this.onHover({tile:this.hover,point:p,direction:this.directionAt(p)})});
  c.addEventListener('pointerup',e=>{const p=this.point(e);const clicked=this.drag&&!this.drag.moved&&!this.pinch;this.pointers.delete(e.pointerId);if(clicked){const arrow=this.directionAt(p);if(arrow)this.onSelect({...arrow,action:'direction'});else{const t=this.tile(p.x,p.y);this.selected=t;this.onSelect(t)}}if(!this.pointers.size){this.drag=null;this.pinch=null}else if(this.drag)this.drag.moved=true});
  c.addEventListener('pointercancel',e=>{this.pointers.delete(e.pointerId);this.drag=null;this.pinch=null});c.addEventListener('pointerleave',()=>{this.hover=null;this.onHover(null)});
  c.addEventListener('wheel',e=>{e.preventDefault();const p=this.point(e),before=this.screenToWorld(p.x,p.y);this.zoom=Math.max(.35,Math.min(2.2,this.zoom*Math.exp(-e.deltaY*.001)));const after=this.screenToWorld(p.x,p.y);this.camera.x+=before.x-after.x;this.camera.y+=before.y-after.y},{passive:false});
  c.addEventListener('keydown',e=>{const dirs={ArrowUp:[0,-1],ArrowRight:[1,0],ArrowDown:[0,1],ArrowLeft:[-1,0]};if(dirs[e.key]){e.preventDefault();const[dx,dy]=dirs[e.key];this.selected={x:this.selected.x+dx,y:this.selected.y+dy};if(!this.eventTargets?.length)this.onSelect(this.selected);this.focus(this.selected)}if(e.key==='Enter'){e.preventDefault();this.onSelect(this.selected)}});
 }
 center(){this.camera={x:0,y:70};this.zoom=this.width<500?.85:1;this.selected={x:0,y:0}}
 focus(tile){const x=tile.x*CW,y=tile.y*CH;const sx=(x-this.camera.x)*this.zoom+this.width/2,sy=(y-this.camera.y)*this.zoom+this.height/2;if(sx<100||sx>this.width-100)this.camera.x=x;if(sy<90||sy>this.height-90)this.camera.y=y}
 setZoom(factor){this.zoom=Math.max(.35,Math.min(2.2,this.zoom*factor))}
 corridor(r,n){
  const c=this.ctx,vertical=r.x===n.x;if(vertical&&r.craterRoot&&r.craterRoot===n.craterRoot)return;
  if(!vertical&&r.y!==n.y)return;
  if((vertical&&r.y>n.y)||(!vertical&&r.x>n.x))[r,n]=[n,r];
  const x=r.x*CW,y=r.y*CH,nx=n.x*CW,ny=n.y*CH;
  const door=this.game.barricade(r,n);
  const wa=this.wholeRoom(r),wb=this.wholeRoom(n);if(wa&&wb&&wa.key===wb.key){if(door)this.widePassageDoor((x+nx)/2,(y+ny)/2-5,vertical,door,vertical?75:70,passagePalette(visualRoom(this.game,r)),passagePalette(visualRoom(this.game,n)));return;}

  const boss=sharedBossRoom(this.game,r,n),a={...visualRoom(this.game,r),hazards:this.game.roomHazards(r)},b={...visualRoom(this.game,n),hazards:this.game.roomHazards(n)},built=masonryRoom(a)&&masonryRoom(b),chamber=boss||sharedFormation(r,n)||r.type==='cave'&&n.type==='cave'&&!r.playerBuilt&&!n.playerBuilt&&r.cavernGroup&&r.cavernGroup===n.cavernGroup,wide=(built||chamber)&&!(vertical&&this.shaftLinked(r,n));
  if(wide){const architecture=built||chamber&&passageArchitecture(a)==='built'&&passageArchitecture(b)==='built'?'built':'cavern';c.save();c.beginPath();if(vertical)c.rect(x-38,y+35,76,CH-75);else c.rect(x+55,y-44,CW-110,78);c.clip();this.caverns.draw(c,{...a,joinArchitecture:architecture},{...b,joinArchitecture:architecture},this.roomImage(r,this.passageTime||0),this.roomImage(n,this.passageTime||0),this.cavernImages);c.restore();if(!door&&architecture==='built')this.joinTorch((x+nx)/2,(y+ny)/2,vertical)}
  if(!wide&&!(vertical&&this.shaftLinked(r,n)))this.passages.draw(c,a,b,vertical,this.images,this.passageTime||0,this.reduced,door,{start:this.framing.ports(this.framedRoomImage(r))[vertical?'south':'east'],end:this.framing.ports(this.framedRoomImage(n))[vertical?'north':'west']});
  if(door){if(wide)this.widePassageDoor((x+nx)/2,(y+ny)/2-5,vertical,door,vertical?75:70,passagePalette(a),passagePalette(b));else this.passageDoor((x+nx)/2,(y+ny)/2,vertical,door);}
  const image=name=>this.images['passage-'+name];
  if((r.closed||n.closed)&&image('grate'))c.drawImage(image('grate'),(x+nx)/2-16,(y+ny)/2-16,32,32);
 }
 roomLabel(r){if(r.craterRoot&&r.craterRoot!==key(r.x,r.y)&&!r.perforated)return '';if(r.type==='gate'&&this.game.s.activePlane!=null)return 'Portal de Retorno';if(visualRoom(this.game,r).bossExtension||visualRoom(this.game,r).builtExtension||r.discoveryRoot&&r.discoveryRoot!==key(r.x,r.y))return '';if(this.shaftLinked(r,this.game.room(r.x,r.y+1)))return '';return this.continuousShaft(r)?'Elevador':r.displayName||ROOMS[r.type].name}
 shaftLinked(a,b){return !!a&&!!b&&['shaft','elevator'].includes(a.type)&&['shaft','elevator'].includes(b.type)&&a.x===b.x&&Math.abs(a.y-b.y)===1&&this.game.linked(a,b)}
 continuousShaft(r){return ['shaft','elevator'].includes(r.type)&&(this.shaftLinked(r,this.game.room(r.x,r.y-1))||this.shaftLinked(r,this.game.room(r.x,r.y+1)))}
 shaftTile(r,image){if(image)this.ctx.drawImage(image,r.x*CW-80,r.y*CH-62,160,113.33)}
 shaftSeam(a,b){
  const first=this.roomImage(a,this.passageTime||0),second=this.roomImage(b,this.passageTime||0);if(!first||!second)return;
  this.shaftStitches??=new WeakMap();let pairs=this.shaftStitches.get(first);if(!pairs){pairs=new WeakMap();this.shaftStitches.set(first,pairs)}let tile=pairs.get(second);
  if(!tile){
   // Build only the connecting neck. Room sprites keep their original proportions.
   tile=document.createElement('canvas');tile.width=64;tile.height=86;const c=tile.getContext('2d');c.imageSmoothingEnabled=false;
   c.fillStyle='#211f19';c.fillRect(10,0,44,86);
   for(let y=0;y<86;y+=12){const image=y<43?first:second,phase=Math.floor(y/12)%3;
    for(const side of [-1,1]){const x=side<0?6+phase:46-phase;c.drawImage(image,side<0?9:108,18+phase*6,12,12,x,y,12,12)}
   }
   // Discrete timber braces and ropes match the old cavern cutaway art.
   c.fillStyle='#746446';c.fillRect(22,0,2,86);c.fillStyle='#b6a37a';c.fillRect(22,0,1,86);c.fillStyle='#857454';c.fillRect(40,0,1,86);
   for(let y=10;y<86;y+=24){c.fillStyle='#4e4432';c.fillRect(18,y,28,3);c.fillStyle='#a38e64';c.fillRect(18,y,28,1)}
   pairs.set(second,tile);
  }
  this.ctx.drawImage(tile,a.x*CW-40,a.y*CH+28,80,107.5);
 }
 joinTorch(x,y,vertical){const c=this.ctx,phase=this.reduced?0:Math.floor((this.passageTime||0)/160)%3;c.save();c.translate(x+(vertical?18:0),y-17);c.fillStyle='#c6954528';c.fillRect(-9,-13,20,26);c.fillStyle='#302a20';c.fillRect(-2,0,6,11);c.fillStyle='#8a6238';c.fillRect(0,2,2,7);c.fillStyle='#b87936';c.fillRect(-3,-4,8,6);c.fillStyle='#d7a148';c.fillRect(-1,-8-phase*2,4,8+phase*2);c.fillStyle='#ead9a0';c.fillRect(0,-5-phase*2,2,5);c.restore()}
 widePassageDoor(x,y,vertical,door,height,first,second){
  if(door.kind==='prison')return this.cageDoor(x,y,vertical,door,height);
  const c=this.ctx,half=height/2,rgb=a=>`rgb(${a.join(',')})`,wall=first.wall.map((v,i)=>Math.round((v+second.wall[i])*.5)),light=first.light.map((v,i)=>Math.round((v+second.light[i])*.5));c.save();c.translate(x,y);if(vertical)c.rotate(Math.PI/2);
  if(door.hp<=0){c.fillStyle=rgb(wall);for(let i=0;i<7;i++)c.fillRect(-8+i%3*4,half-9-i*3,4,3);c.restore();return}
  // Repeat native-size planks and straps to cover the wider opening, never scale a door sprite.
  c.fillStyle='#24271f';c.fillRect(-10,-half,20,height);c.fillStyle=rgb(light);c.fillRect(-10,-half,3,height);c.fillRect(7,-half,3,height);c.fillStyle=rgb(wall);c.fillRect(-7,-half+2,14,height-4);
  c.fillStyle=rgb(light.map(v=>Math.round(v*.72)));for(let i=-5;i<=5;i+=4)c.fillRect(i,-half+3,2,height-6);
  for(let py=-half+7;py<half-3;py+=14){c.fillStyle='#333b38';c.fillRect(-8,py,16,4);c.fillStyle='#b4b49a';c.fillRect(-6,py+1,2,1);c.fillRect(4,py+1,2,1);if(door.kind==='offensive'){c.fillStyle=rgb(light);c.fillRect(-14,py,6,2);c.fillRect(8,py,6,2)}}
  for(let i=1;i<door.level;i++){c.fillStyle='#a2a490';c.fillRect(-9,-half+i*height/door.level,18,2)}
  if(this.game.s.combat&&!this.exporting){const maximum=(door.kind==='defensive'?400:160)*door.level;c.fillStyle='#252920';c.fillRect(-13,half+3,26,4);c.fillStyle='#c0a667';c.fillRect(-12,half+4,24*Math.min(1,door.hp/maximum),2)}c.restore();
 }
 cageDoor(x,y,vertical,door,height=40){const c=this.ctx;c.save();c.translate(x,y);if(vertical)c.rotate(Math.PI/2);c.fillStyle='#383f3d';c.fillRect(-11,-height/2,22,height);c.fillStyle='#a0aaa0';for(let dy=-height/2+3;dy<height/2;dy+=7)c.fillRect(-10,dy,20,2);c.fillStyle='#424b48';c.fillRect(-10,-height/2,3,height);c.fillRect(7,-height/2,3,height);c.restore();}
 passageDoor(x,y,vertical,door){if(door.kind==='prison')return this.cageDoor(x,y,vertical,door);
  const c=this.ctx;c.save();c.translate(x,y);if(vertical)c.rotate(Math.PI/2);c.imageSmoothingEnabled=false;
  if(door.hp<=0){c.fillStyle='#5b4830';for(let i=0;i<5;i++)c.fillRect(-8+i*3,8-i%2*3,4,3);c.restore();return}
  c.fillStyle='#24271f';c.fillRect(-9,-20,18,40);c.fillStyle='#c0b18c';c.fillRect(-9,-20,3,40);c.fillRect(6,-20,3,40);
  c.fillStyle='#76603e';c.fillRect(-6,-18,12,36);c.fillStyle='#9b8155';for(let i=-4;i<=4;i+=4)c.fillRect(i,-17,2,34);
  c.fillStyle='#393c33';for(const py of [-13,-2,11])c.fillRect(-7,py,14,4);c.fillStyle='#b4b49a';for(const py of [-12,-1,12]){c.fillRect(-5,py,2,1);c.fillRect(3,py,2,1)}
  for(let i=1;i<door.level;i++){c.fillStyle='#a2a490';c.fillRect(-8,-18+i*13,16,2)}
  if(door.kind==='offensive'){c.fillStyle='#b99b72';for(const py of [-14,-6,2,10]){c.fillRect(-13,py,4,2);c.fillRect(9,py,4,2)}}
  if(this.game.s.combat){const maximum=(door.kind==='defensive'?400:160)*door.level;c.fillStyle='#252920';c.fillRect(-13,23,26,4);c.fillStyle='#c0a667';c.fillRect(-12,24,24*Math.min(1,door.hp/maximum),2)}
  c.restore();
 }
 draw(time=0){this.appearance.beginFrame();try{return this.game?this.game.withQueryCache(()=>this.drawFrame(time)):this.drawFrame(time)}finally{this.appearance.endFrame()}}
 drawFrame(time=0){this.passageTime=time;const c=this.ctx,w=this.width,h=this.height;if(!w||!h)return;c.setTransform(this.dpr,0,0,this.dpr,0,0);c.imageSmoothingEnabled=false;c.fillStyle='#e5ddc6';c.fillRect(0,0,w,h);if(!this.game){this.directionMarkers=[];return;}
  c.save();c.translate(w/2,h/2);c.scale(this.zoom,this.zoom);c.translate(-this.camera.x,-this.camera.y);
  const bounds={left:this.camera.x-w/2/this.zoom-CW,right:this.camera.x+w/2/this.zoom+CW,top:this.camera.y-h/2/this.zoom-CH,bottom:this.camera.y+h/2/this.zoom+CH};
  if(!this.exporting){c.strokeStyle='#6e77551c';c.lineWidth=.65;for(let x=Math.floor(bounds.left/CW);x<=Math.ceil(bounds.right/CW);x++){c.beginPath();c.moveTo((x+.5)*CW,bounds.top);c.lineTo((x+.5)*CW,bounds.bottom);c.stroke()}for(let y=Math.floor(bounds.top/CH);y<=Math.ceil(bounds.bottom/CH);y++){c.beginPath();c.moveTo(bounds.left,(y+.5)*CH);c.lineTo(bounds.right,(y+.5)*CH);c.stroke();c.fillStyle='#7d82624a';c.font='9px Georgia';c.textAlign='left';c.fillText(y>=0?String(y).padStart(2,'0'):`+${-y}`,bounds.left+CW*.7,y*CH)}
  c.fillStyle='#d7dfd332';c.fillRect(bounds.left,bounds.top,bounds.right-bounds.left,Math.max(0,-CH*.5-bounds.top));
  // Ground boundary remains readable when the map scrolls underground.
  c.strokeStyle='#777b5e55';c.setLineDash([4,4]);c.beginPath();c.moveTo(bounds.left,-CH*.5);c.lineTo(bounds.right,-CH*.5);c.stroke();c.setLineDash([]);
  }
  const visible=this.game.rooms.filter(r=>r.x*CW>bounds.left&&r.x*CW<bounds.right&&r.y*CH>bounds.top&&r.y*CH<bounds.bottom);
  for(const r of visible){if(this.wholeRoom(r)||r.craterRoot)continue;const x=r.x*CW,y=r.y*CH;const image=this.roomImage(r,time);if(this.continuousShaft(r))this.shaftTile(r,image);else if(image)c.drawImage(image,x-80,y-62,160,113.33);else{c.fillStyle='#d9cfb1';c.fillRect(x-72,y-45,144,90)}
  }
  this.drawWholeRooms(visible,time);
  for(const r of visible){const below=this.game.room(r.x,r.y+1);if(this.shaftLinked(r,below))this.shaftSeam(r,below)}
  // Composite every room first, then its doorway aprons; no room PNG can cover a neighbor's connection.
  for(const r of visible)for(const[dx,dy]of [[1,0],[0,1]]){const n=this.game.room(r.x+dx,r.y+dy);if(n&&this.game.linked(r,n))this.corridor(r,n)}
  this.drawVolcanoes?.(time);
  if(!this.exporting){
  const directions=this.game.directions();
  for(const r of visible){const x=r.x*CW,y=r.y*CH;
   if(r.trap){c.strokeStyle='#9c6149';c.lineWidth=1.5;c.beginPath();for(let i=0;i<6;i++){const px=x-17+i*7;c.moveTo(px,y+34);c.lineTo(px+4,y+25);c.lineTo(px+7,y+34)}c.stroke()}
   const selected=this.selected.x===r.x&&this.selected.y===r.y;if(selected){c.strokeStyle='#8a7447';c.lineWidth=1.2;this.corners(x-83,y-64,166,121)}
   c.textAlign='center';c.font='10px Georgia';c.fillStyle=r.damaged?'#925a40':'#505541';const label=this.roomLabel(r);if(!label)continue;const tw=c.measureText(label).width,labelX=(this.game.linked(r,this.game.room(r.x,r.y+1))||directions.some(d=>d.from.x===r.x&&d.from.y===r.y&&d.dy===1))?x-30-tw/2:x;c.fillStyle='#e5ddc6ee';c.fillRect(labelX-tw/2-4,y+54,tw+8,14);c.fillStyle=r.damaged?'#925a40':'#505541';c.fillText(label,labelX,y+64);
  }
  // The arrow encodes its source room, never just the destination cell.
  this.directionMarkers=[];const seen=new Set();
  for(const d of directions){
   const origin=this.game.room(d.from.x,d.from.y),destination=this.game.room(d.x,d.y),id=destination?this.game.passageKey(origin,destination):`${d.from.x},${d.from.y}>${d.x},${d.y}`;
   if(seen.has(id))continue;seen.add(id);
   const x=d.from.x*CW+d.dx*CW/2,y=d.from.y*CH+d.dy*CH/2;
   const screenX=w/2+(x-this.camera.x)*this.zoom,screenY=h/2+(y-this.camera.y)*this.zoom;
   if(screenX< -22||screenX>w+22||screenY< -22||screenY>h+22)continue;
   this.directionMarkers.push({...d,screenX,screenY});
   c.save();c.translate(x,y);c.scale(1/this.zoom,1/this.zoom);
   c.fillStyle=d.kind==='passage'?'#e0cca0':'#e5ddc6';c.strokeStyle=d.kind==='passage'?'#8c6b32':'#566447';c.lineWidth=1.5;
   c.fillRect(-16,-16,32,32);c.strokeRect(-16,-16,32,32);
   c.rotate(Math.atan2(d.dy,d.dx));c.beginPath();c.moveTo(-8,0);c.lineTo(8,0);c.moveTo(1,-6);c.lineTo(8,0);c.lineTo(1,6);c.stroke();
   if(d.kind==='passage'){c.fillStyle='#8c6b32';c.fillRect(-11,-10,3,3);c.fillRect(-11,7,3,3)}
   c.restore();
  }
  if(!this.game.s.combat&&this.game.s.status==='playing')for(const f of this.game.surfaceSites()){
   const x=f.x*CW,y=f.y*CH;if(x<bounds.left||x>bounds.right||y<bounds.top||y>bounds.bottom)continue;
   const reason=this.game.surfaceReason(f),selected=this.selected.x===f.x&&this.selected.y===f.y;
   c.strokeStyle=reason?'#aa695566':selected?'#866c3e':'#7e8a6766';c.fillStyle=reason?'#ae6c5110':'#adc19918';c.setLineDash([4,4]);c.fillRect(x-65,y-43,130,86);c.strokeRect(x-65,y-43,130,86);c.setLineDash([]);
   c.fillStyle=reason?'#9b5c49':'#63734d';c.font='8px Arial';c.textAlign='center';c.fillText(reason?'SEM APOIO / CONEXÃO':'CONSTRUIR · SUPERFÍCIE',x,y+5);
  }
  const seal=this.game.room(this.selected.x,this.selected.y);
  if(seal?.type==='sealed')for(let dx=-1;dx<=1;dx++)for(let dy=-1;dy<=1;dy++){
   const x=seal.x+dx,y=seal.y+dy;if(this.game.room(x,y)||y<0)continue;
   c.strokeStyle='#965b4d66';c.fillStyle='#965b4d0c';c.setLineDash([3,4]);c.fillRect(x*CW-62,y*CH-40,124,80);c.strokeRect(x*CW-62,y*CH-40,124,80);c.setLineDash([]);c.fillStyle='#965b4d';c.font='9px Georgia';c.textAlign='center';c.fillText('SELADO',x*CW,y*CH+3);
  }
  if(this.eventTargets?.length)for(const target of this.eventTargets){c.strokeStyle='#b4934b';c.lineWidth=2;this.corners(target.x*CW-82,target.y*CH-63,164,118)}
  }
  if(!this.exporting)this.gateGems(time);
  const formation=this.unitFormation([...this.transitions.renderUnits(time),...(this.game.campUnits?.()||[])]);
  for(const {u,x,y} of formation)this.unit(u,x,y,time);
  this.transitions.draw(time);
  for(const p of this.game.projectiles){const x=(p.x+(p.tx-p.x)*p.t)*CW,y=(p.y+(p.ty-p.y)*p.t)*CH+this.floorOffset(p.x,p.y)*(1-p.t)+this.floorOffset(p.tx,p.ty)*p.t;c.save();c.translate(x,y);c.rotate(Math.atan2((p.ty-p.y)*CH,(p.tx-p.x)*CW));c.strokeStyle=p.team==='enemy'?'#a4563e':'#2f6853';c.fillStyle=c.strokeStyle;c.lineWidth=2;if(p.kind==='arrow'||p.kind==='bolt'){if(p.kind==='bolt'){c.lineWidth=4;c.strokeStyle='#bd9a58';c.beginPath();c.moveTo(-26,0);c.lineTo(12,0);c.stroke();c.lineWidth=2;c.strokeStyle=p.team==='enemy'?'#a4563e':'#2f6853';}c.beginPath();c.moveTo(-13,0);c.lineTo(9,0);c.moveTo(4,-4);c.lineTo(10,0);c.lineTo(4,4);c.stroke();c.lineWidth=1;c.moveTo(-8,0);c.lineTo(-12,-3);c.stroke()}else{c.shadowColor=c.fillStyle;c.shadowBlur=10;c.beginPath();c.arc(0,0,p.kind==='flask'?4:5,0,Math.PI*2);c.fill();c.shadowBlur=0;c.strokeStyle='#b9c9a4';c.lineWidth=1;c.beginPath();c.moveTo(-5,0);c.lineTo(-17,0);c.stroke()}c.restore()}
  if(!this.reduced)for(const e of this.game.effects){c.globalAlpha=Math.min(1,e.life*2);c.strokeStyle=e.kind==='death'?'#a16e51':'#a16e51';c.lineWidth=1.5;c.beginPath();c.arc(e.x*CW,e.y*CH+this.floorOffset(e.x,e.y),(1-e.life)*20+5,0,Math.PI*2);c.stroke();c.globalAlpha=1}
  c.restore();
 }
 returnHome(units,time){this.transitions.returnHome(units,time)}
 transitioning(game,time){return this.gemAnimating(game,time)||this.voidGame===game&&time<(this.voidAnimationUntil||0)||this.transitions.game===game&&time<this.transitions.returnUntil}
 voidDefeat(enemies,time){this.transitions.defeat(enemies,time,this.reduced);this.voidGame=this.game;this.voidAnimationUntil=time+(this.reduced?300:1100);}
 gemAnimating(game,time){return this.gemGame===game&&time<(this.gemAnimationUntil||0)}
 gemBurst(index,time,enemies=[]){this.transitions.defeat(enemies,time,this.reduced);this.gemGame=this.game;this.gemAnimationUntil=time+(this.reduced?300:1100);this.gemFragments??=[];for(let i=0;i<(this.reduced?6:26);i++){const angle=i*2.399963+index,speed=18+(i*17%53);this.gemFragments.push({x:(index-1)*22,y:-80,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed-24,start:time,life:this.reduced?300:1100,color:['#77d4db','#d6f3e9','#448ca4','#b6ded4'][i%4],size:i%3+1})}}
 gateGems(time){
  if(this.gemGame!==this.game){this.gemGame=this.game;this.gemFragments=[]}
  const c=this.ctx,remaining=this.game.s.lives??3;c.save();
  for(let i=0;i<3;i++){const x=(i-1)*22,y=-80,alive=i<remaining;
   c.fillStyle=alive?'#233e45':'#777866';c.fillRect(x-4,y-10,8,2);c.fillRect(x-7,y-8,14,10);c.fillRect(x-5,y+2,10,4);c.fillRect(x-2,y+6,4,3);
   if(alive){c.fillStyle='#448da1';c.fillRect(x-5,y-7,10,8);c.fillRect(x-3,y+1,6,4);c.fillStyle='#83ced1';c.fillRect(x-4,y-7,5,7);c.fillStyle='#daf0db';c.fillRect(x-3,y-7,3,2);c.fillStyle='#326a81';c.fillRect(x+1,y-6,4,7)}else{c.fillStyle='#e5ddc6';c.fillRect(x-3,y-7,6,8);c.fillRect(x-1,y+1,2,4);c.fillRect(x,y-10,2,6);c.fillRect(x-4,y+2,3,3)}
  }
  if(!this.exporting){this.gemFragments=(this.gemFragments||[]).filter(p=>time-p.start<p.life);for(const p of this.gemFragments){const t=(time-p.start)/1000;c.globalAlpha=Math.max(0,1-(time-p.start)/p.life);c.fillStyle=p.color;c.fillRect(Math.round(p.x+p.vx*t),Math.round(p.y+p.vy*t+(this.reduced?0:70*t*t)),p.size,p.size)}}
  c.restore();
 }
 // Export the entire fortress through the same renderer, excluding every overlay.
 exportCanvas(){
  if(!this.game)throw Error('Inicie uma fortaleza primeiro.');
  const rooms=this.game.rooms,left=Math.min(...rooms.map(r=>r.x))*CW-CW/2-32,right=Math.max(...rooms.map(r=>r.x))*CW+CW/2+32,top=Math.min(...rooms.map(r=>r.y))*CH-CH/2-32,bottom=Math.max(...rooms.map(r=>r.y))*CH+CH/2+32;
  const width=right-left,height=bottom-top,scale=Math.min(2,4096/width,4096/height,Math.sqrt(12000000/(width*height))),canvas=document.createElement('canvas');canvas.width=Math.ceil(width*scale);canvas.height=Math.ceil(height*scale);
  const saved={ctx:this.ctx,width:this.width,height:this.height,dpr:this.dpr,zoom:this.zoom,camera:this.camera,exporting:this.exporting,directionMarkers:this.directionMarkers,passageTime:this.passageTime};
  try{Object.assign(this,{ctx:canvas.getContext('2d'),width:canvas.width,height:canvas.height,dpr:1,zoom:scale,camera:{x:(left+right)/2,y:(top+bottom)/2},exporting:true});this.draw(0)}finally{Object.assign(this,saved)}
  return canvas;
 }
 // Feet rest at y + 35 inside rooms; the offset fades to the corridor centre.
 floorOffset(x,y){const distance=Math.max(Math.abs(x-Math.round(x)),Math.abs(y-Math.round(y))),room=this.game?.room?.(Math.round(x),Math.round(y)),spec=room&&this.wholeRoom(room);let floor=room?.sourceType&&['bridge','drawbridge'].includes(room.type)?4:20;if(spec?.vertical){const index=Math.round(y)-Math.min(...spec.cells.map(p=>p.y)),feet=spec.top+(spec.height-10)*(index+1)/spec.cells.length;floor=feet-Math.round(y)*144-15;}return floor*Math.max(0,1-distance/.45)}

 unitFormation(units=this.game.s.units){
  const living=units.filter(u=>u.hp>0),groups=new Map(),positions=[];
  for(const u of living){const rx=Math.round(u.x),ry=Math.round(u.y),distance=Math.max(Math.abs(u.x-rx),Math.abs(u.y-ry));
   if(distance>=.12){positions.push({u,x:u.x*CW,y:u.y*CH+this.floorOffset(u.x,u.y)});continue}
   const id=`${rx},${ry}:${u.team}`;if(!groups.has(id))groups.set(id,[]);groups.get(id).push(u);
  }
  for(const group of groups.values()){
   group.sort((a,b)=>a.id-b.id);
   const size=Math.max(...group.map(u=>((u.size||1)<=1?42:36*(u.size||1)))),columns=Math.min(group.length,5,Math.max(1,Math.floor(140/Math.max(22,size*.65)))),rows=Math.ceil(group.length/columns),step=Math.min(Math.max(24,size*.62),112/(columns-.5)),rise=rows>1?Math.min(10,30/(rows-1)):0;
   group.forEach((u,index)=>{
    const row=Math.floor(index/columns),count=Math.min(columns,group.length-row*columns),column=index%columns,weight=Math.max(0,1-Math.max(Math.abs(u.x-Math.round(u.x)),Math.abs(u.y-Math.round(u.y)))/.12);
    // Keep one column grid even for incomplete ranks: alternate half a slot.
    const slot=column+Math.floor((columns-count)/2),offset=(slot-(columns-1)/2)*step+(rows>1?(row%2?.25:-.25)*step:0);
    positions.push({u,x:u.x*CW+offset*weight+(!this.game.s.combat?(u.idleRoomOffset||0)*weight:0),y:u.y*CH+this.floorOffset(u.x,u.y)-row*rise*weight});
   });
  }
  // Rear ranks and northern rooms first, so foreground feet occlude naturally.
  return positions.sort((a,b)=>a.y-b.y||a.u.id-b.u.id);
 }
 corners(x,y,w,h){const c=this.ctx,l=12;c.beginPath();c.moveTo(x,y+l);c.lineTo(x,y);c.lineTo(x+l,y);c.moveTo(x+w-l,y);c.lineTo(x+w,y);c.lineTo(x+w,y+l);c.moveTo(x+w,y+h-l);c.lineTo(x+w,y+h);c.lineTo(x+w-l,y+h);c.moveTo(x+l,y+h);c.lineTo(x,y+h);c.lineTo(x,y+h-l);c.stroke()}
 unitImage(u){const undead=u.isUndead||u.uncapturable,layer=undead?2:(u.spawnLayer??(u.team!=='ally'?this.game?.layer(this.game.room(Math.round(u.x),Math.round(u.y))):0))||0;return this.images[`layer-${layer}-${u.type}`]||this.images[`unit-${u.type}`]||this.images['unit-goblin'];}
 unit(u,x,y,time){
  const c=this.ctx,ally=u.team==='ally',image=this.unitImage(u);
  const size=((u.size||1)<=1?42:36*(u.size||1)),bob=this.reduced?0:Math.round(Math.sin(u.walk||0)*1.5),attack=this.reduced?0:Math.round(u.attack*7);
  c.save();c.translate(Math.round(x),Math.round(y)+bob);c.imageSmoothingEnabled=false;
  c.fillStyle='#26302138';c.fillRect(-size*.22,13,size*.44,3);
  if(u.facing<0)c.scale(-1,1);
  if(u.type==='immortal'&&this.immortalOutline)for(const [dx,dy]of [[-2,0],[2,0],[0,-2],[0,2]])c.drawImage(this.immortalOutline,Math.round(-size/2)+dx,Math.round(15-size)+dy,Math.round(size),Math.round(size));
  if(image)c.drawImage(image,Math.round(-size/2)+attack,Math.round(15-size),Math.round(size),Math.round(size));
  else{c.fillStyle=ally?'#436d4b':'#9a563b';c.fillRect(-5,-10,10,22)}
  if(u.facing<0)c.scale(-1,1);
  if(!this.exporting){const marker=u.team==='neutral'?'#b5a56f':ally?'#356a4e':'#a44732';c.fillStyle=marker;c.fillRect(-3,17,6,3);
  if(u.type==='immortal'){c.fillStyle='#d8c692';c.font='bold 17px Georgia';c.textAlign='center';c.fillText('∞',0,9-size);}
  if(this.game.s.combat&&u.type!=='immortal'){const width=Math.max(22,size*.55),top=12-size;
   c.fillStyle='#302f26';c.fillRect(-width/2-1,top-1,width+2,5);c.fillStyle=marker;c.fillRect(-width/2,top,width*Math.max(0,u.hp/u.maxHp),3);
   if(u.shield>0){c.fillStyle='#79a0a2';c.fillRect(-width/2,top-4,width*Math.min(1,u.shield/20),2)}
  }}c.restore();
 }
}

installColonyView(Renderer);

installWholeRooms(Renderer);
