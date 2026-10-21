import {RoomAppearance} from './room-appearance.js';
import {ProceduralPassages} from './passages.js';
import {ROOMS,DIRS,SPRITE_FRAMES,PASSAGES,DAMAGEABLE_ROOMS} from './data.js';
import {key} from './engine.js';
export const CW=180,CH=144;
export class Renderer{
 constructor(canvas,onSelect,onHover){this.canvas=canvas;this.ctx=canvas.getContext('2d');this.zoom=1;this.camera={x:0,y:80};this.images={};this.appearance=new RoomAppearance();this.passages=new ProceduralPassages();this.selected={x:0,y:0};this.hover=null;this.game=null;this.reduced=false;this.pointers=new Map();this.directionMarkers=[];this.drag=null;this.pinch=null;this.onSelect=onSelect;this.onHover=onHover;this.setupInput();this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(canvas);this.resize()}
 async load(){
  const assets=Object.keys(ROOMS).flatMap(type=>[0,1,2].map(v=>({id:`${type}-${v}`,src:`./assets/rooms/${type}-${v}.png`})));
  assets.push(...Object.keys(SPRITE_FRAMES).map(type=>({id:`unit-${type}`,src:`./assets/sprites/${type}.png`})));
  assets.push(...DAMAGEABLE_ROOMS.flatMap(type=>[0,1,2].map(v=>({id:`damaged-${type}-${v}`,src:`./assets/damaged-rooms/${type}-${v}.png`}))));
  assets.push(...PASSAGES.map(name=>({id:`passage-${name}`,src:`./assets/passages/${name}.png`})));
  await Promise.all(assets.map(({id,src})=>new Promise(resolve=>{const i=new Image();i.onload=()=>{this.images[id]=i;resolve()};i.onerror=()=>resolve();i.src=src})));
  this.passages.cache.clear();this.appearance.cache.clear();
  if(this.images['unit-immortal']){const outline=document.createElement('canvas');outline.width=outline.height=64;const c=outline.getContext('2d');c.drawImage(this.images['unit-immortal'],0,0,64,64);c.globalCompositeOperation='source-in';c.fillStyle='#b5a56f';c.fillRect(0,0,64,64);this.immortalOutline=outline}
 }
 rawRoomImage(r){return this.images[`${r.damaged&&DAMAGEABLE_ROOMS.includes(r.type)?'damaged-':''}${r.type}-${r.variant}`]||this.images[`${r.type}-${r.variant}`]}
 roomImage(r,time=0){return this.appearance.get(this.rawRoomImage(r),r.type,this.game?.roomHazards(r)||[],time,this.reduced)}
 roomURL(r,time=0){return this.appearance.url(this.rawRoomImage(r),r.type,this.game?.roomHazards(r)||[],time,this.reduced)}
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
  c.addEventListener('pointerdown',e=>{const p=this.point(e);this.pointers.set(e.pointerId,p);c.setPointerCapture(e.pointerId);this.drag={start:p,last:p,moved:false};if(this.pointers.size===2){const a=[...this.pointers.values()];this.pinch={distance:Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y),zoom:this.zoom};this.drag.moved=true}this.onHover(null)});
  c.addEventListener('pointermove',e=>{const p=this.point(e);if(this.pointers.has(e.pointerId)){this.pointers.set(e.pointerId,p);if(this.pointers.size===2&&this.pinch){const a=[...this.pointers.values()];this.zoom=Math.max(.35,Math.min(2.2,this.pinch.zoom*Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y)/Math.max(1,this.pinch.distance)));return}if(this.drag){const d=this.drag;if(Math.hypot(p.x-d.start.x,p.y-d.start.y)>5)d.moved=true;if(d.moved){this.camera.x-=(p.x-d.last.x)/this.zoom;this.camera.y-=(p.y-d.last.y)/this.zoom}d.last=p}return}this.hover=this.tile(p.x,p.y);this.onHover({tile:this.hover,point:p,direction:this.directionAt(p)})});
  c.addEventListener('pointerup',e=>{const p=this.point(e);const clicked=this.drag&&!this.drag.moved&&!this.pinch;this.pointers.delete(e.pointerId);if(clicked){const arrow=this.directionAt(p);if(arrow)this.onSelect({...arrow,action:'direction'});else{const t=this.tile(p.x,p.y);this.selected=t;this.onSelect(t)}}if(!this.pointers.size){this.drag=null;this.pinch=null}else if(this.drag)this.drag.moved=true});
  c.addEventListener('pointercancel',e=>{this.pointers.delete(e.pointerId);this.drag=null;this.pinch=null});c.addEventListener('pointerleave',()=>{this.hover=null;this.onHover(null)});
  c.addEventListener('wheel',e=>{e.preventDefault();const p=this.point(e),before=this.screenToWorld(p.x,p.y);this.zoom=Math.max(.35,Math.min(2.2,this.zoom*Math.exp(-e.deltaY*.001)));const after=this.screenToWorld(p.x,p.y);this.camera.x+=before.x-after.x;this.camera.y+=before.y-after.y},{passive:false});
  c.addEventListener('keydown',e=>{const dirs={ArrowUp:[0,-1],ArrowRight:[1,0],ArrowDown:[0,1],ArrowLeft:[-1,0]};if(dirs[e.key]){e.preventDefault();const[dx,dy]=dirs[e.key];this.selected={x:this.selected.x+dx,y:this.selected.y+dy};this.onSelect(this.selected);this.focus(this.selected)}if(e.key==='Enter'){e.preventDefault();this.onSelect(this.selected)}});
 }
 center(){this.camera={x:0,y:70};this.zoom=this.width<500?.85:1;this.selected={x:0,y:0}}
 focus(tile){const x=tile.x*CW,y=tile.y*CH;const sx=(x-this.camera.x)*this.zoom+this.width/2,sy=(y-this.camera.y)*this.zoom+this.height/2;if(sx<100||sx>this.width-100)this.camera.x=x;if(sy<90||sy>this.height-90)this.camera.y=y}
 setZoom(factor){this.zoom=Math.max(.35,Math.min(2.2,this.zoom*factor))}
 corridor(r,n){
  const c=this.ctx,vertical=r.x===n.x;
  if(!vertical&&r.y!==n.y)return;
  if((vertical&&r.y>n.y)||(!vertical&&r.x>n.x))[r,n]=[n,r];
  const x=r.x*CW,y=r.y*CH,nx=n.x*CW,ny=n.y*CH;
  const door=this.game.s.barricades[this.game.passageKey(r,n)];
  if(!(vertical&&this.shaftLinked(r,n)))this.passages.draw(c,r,n,vertical,this.images,this.passageTime||0,this.reduced,door);
  if(door)this.passageDoor((x+nx)/2,(y+ny)/2,vertical,door);
  const image=name=>this.images['passage-'+name];
  if((r.closed||n.closed)&&image('grate'))c.drawImage(image('grate'),(x+nx)/2-16,(y+ny)/2-16,32,32);
 }
 roomLabel(r){if(this.shaftLinked(r,this.game.room(r.x,r.y+1)))return '';return this.continuousShaft(r)?'Elevador':ROOMS[r.type].name}
 shaftLinked(a,b){return !!a&&!!b&&['shaft','elevator'].includes(a.type)&&['shaft','elevator'].includes(b.type)&&a.x===b.x&&Math.abs(a.y-b.y)===1&&this.game.linked(a,b)}
 continuousShaft(r){return ['shaft','elevator'].includes(r.type)&&(this.shaftLinked(r,this.game.room(r.x,r.y-1))||this.shaftLinked(r,this.game.room(r.x,r.y+1)))}
 shaftTile(r,image){
  if(!image)return;
  const up=this.shaftLinked(r,this.game.room(r.x,r.y-1)),down=this.shaftLinked(r,this.game.room(r.x,r.y+1));
  // Retain the original cavern illustration, furnishings and irregular walls.
  // Connected ends use the inside of the shaft instead of its rock cap.
  const sy=up?18:0,ey=down?62:86,top=up?-CH/2:-62,bottom=down?CH/2:51.33;
  this.ctx.drawImage(image,0,sy,image.width,ey-sy,r.x*CW-80,r.y*CH+top,160,bottom-top);
 }
 shaftSeam(a,b){
  const first=this.roomImage(a,this.passageTime||0),second=this.roomImage(b,this.passageTime||0);if(!first||!second)return;
  this.shaftStitches??=new WeakMap();let pairs=this.shaftStitches.get(first);if(!pairs){pairs=new WeakMap();this.shaftStitches.set(first,pairs)}let tile=pairs.get(second);
  if(!tile){
   const above=document.createElement('canvas'),below=document.createElement('canvas');above.width=below.width=160;above.height=below.height=24;
   const ac=above.getContext('2d'),bc=below.getContext('2d');ac.imageSmoothingEnabled=bc.imageSmoothingEnabled=false;
   ac.drawImage(first,0,54,first.width,8,0,0,160,24);bc.drawImage(second,0,18,second.width,8,0,0,160,24);
   const frame=ac.getImageData(0,0,160,24),other=bc.getImageData(0,0,160,24),p=frame.data,q=other.data;
   // Pixel dithering joins both actual illustrations without blurry blending.
   const thresholds=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5];
   for(let y=0;y<24;y++)for(let x=0;x<160;x++){const t=y/23;if(t>(thresholds[(y%4)*4+x%4]+.5)/16){const i=(y*160+x)*4;for(let k=0;k<4;k++)p[i+k]=q[i+k]}}
   ac.putImageData(frame,0,0);tile=above;pairs.set(second,tile);
  }
  this.ctx.drawImage(tile,a.x*CW-80,(a.y+.5)*CH-12);
 }
 passageDoor(x,y,vertical,door){
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
 draw(time=0){this.passageTime=time;const c=this.ctx,w=this.width,h=this.height;if(!w||!h)return;c.setTransform(this.dpr,0,0,this.dpr,0,0);c.imageSmoothingEnabled=false;c.fillStyle='#e5ddc6';c.fillRect(0,0,w,h);if(!this.game){this.directionMarkers=[];return;}
  c.save();c.translate(w/2,h/2);c.scale(this.zoom,this.zoom);c.translate(-this.camera.x,-this.camera.y);
  const bounds={left:this.camera.x-w/2/this.zoom-CW,right:this.camera.x+w/2/this.zoom+CW,top:this.camera.y-h/2/this.zoom-CH,bottom:this.camera.y+h/2/this.zoom+CH};
  c.strokeStyle='#6e77551c';c.lineWidth=.65;for(let x=Math.floor(bounds.left/CW);x<=Math.ceil(bounds.right/CW);x++){c.beginPath();c.moveTo((x+.5)*CW,bounds.top);c.lineTo((x+.5)*CW,bounds.bottom);c.stroke()}for(let y=Math.floor(bounds.top/CH);y<=Math.ceil(bounds.bottom/CH);y++){c.beginPath();c.moveTo(bounds.left,(y+.5)*CH);c.lineTo(bounds.right,(y+.5)*CH);c.stroke();c.fillStyle='#7d82624a';c.font='9px Georgia';c.textAlign='left';c.fillText(y>=0?String(y).padStart(2,'0'):`+${-y}`,bounds.left+CW*.7,y*CH)}
  c.fillStyle='#d7dfd332';c.fillRect(bounds.left,bounds.top,bounds.right-bounds.left,Math.max(0,-CH*.5-bounds.top));
  // Ground boundary remains readable when the map scrolls underground.
  c.strokeStyle='#777b5e55';c.setLineDash([4,4]);c.beginPath();c.moveTo(bounds.left,-CH*.5);c.lineTo(bounds.right,-CH*.5);c.stroke();c.setLineDash([]);
  const visible=this.game.rooms.filter(r=>r.x*CW>bounds.left&&r.x*CW<bounds.right&&r.y*CH>bounds.top&&r.y*CH<bounds.bottom);
  for(const r of visible){const x=r.x*CW,y=r.y*CH;if(r.y<0&&(r.y===-1||this.game.room(r.x,r.y+1))){c.fillStyle='#57594a';const bottom=r.y===-1?CH*.5:CH-54;for(const ox of [-53,47])c.fillRect(x+ox,y+40,6,bottom-40);c.fillStyle='#b1a889';for(const ox of [-51,49])c.fillRect(x+ox,y+40,2,bottom-40);}const image=this.roomImage(r,time);if(this.continuousShaft(r))this.shaftTile(r,image);else if(image)c.drawImage(image,x-80,y-62,160,113.33);else{c.fillStyle='#d9cfb1';c.fillRect(x-72,y-45,144,90)}
  }
  for(const r of visible){const below=this.game.room(r.x,r.y+1);if(this.shaftLinked(r,below))this.shaftSeam(r,below)}
  // Composite every room first, then its doorway aprons; no room PNG can cover a neighbor's connection.
  for(const r of visible)for(const[dx,dy]of [[1,0],[0,1]]){const n=this.game.room(r.x+dx,r.y+dy);if(n&&this.game.linked(r,n))this.corridor(r,n)}
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
  const formation=this.unitFormation();
  for(const {u,x,y} of formation)this.unit(u,x,y,time);
  for(const p of this.game.projectiles){const x=(p.x+(p.tx-p.x)*p.t)*CW,y=(p.y+(p.ty-p.y)*p.t)*CH+this.floorOffset(p.x,p.y)*(1-p.t)+this.floorOffset(p.tx,p.ty)*p.t;c.save();c.translate(x,y);c.rotate(Math.atan2((p.ty-p.y)*CH,(p.tx-p.x)*CW));c.strokeStyle=p.team==='enemy'?'#a4563e':'#2f6853';c.fillStyle=c.strokeStyle;c.lineWidth=2;if(p.kind==='arrow'||p.kind==='bolt'){c.beginPath();c.moveTo(-13,0);c.lineTo(9,0);c.moveTo(4,-4);c.lineTo(10,0);c.lineTo(4,4);c.stroke();c.lineWidth=1;c.moveTo(-8,0);c.lineTo(-12,-3);c.stroke()}else{c.shadowColor=c.fillStyle;c.shadowBlur=10;c.beginPath();c.arc(0,0,p.kind==='flask'?4:5,0,Math.PI*2);c.fill();c.shadowBlur=0;c.strokeStyle='#b9c9a4';c.lineWidth=1;c.beginPath();c.moveTo(-5,0);c.lineTo(-17,0);c.stroke()}c.restore()}
  if(!this.reduced)for(const e of this.game.effects){c.globalAlpha=Math.min(1,e.life*2);c.strokeStyle=e.kind==='death'?'#a16e51':'#a16e51';c.lineWidth=1.5;c.beginPath();c.arc(e.x*CW,e.y*CH+this.floorOffset(e.x,e.y),(1-e.life)*20+5,0,Math.PI*2);c.stroke();c.globalAlpha=1}
  c.restore();
 }
 // Feet rest at y + 35 inside rooms; the offset fades to the corridor centre.
 floorOffset(x,y){const distance=Math.max(Math.abs(x-Math.round(x)),Math.abs(y-Math.round(y)));return 20*Math.max(0,1-distance/.45)}
 unitFormation(){
  const living=this.game.s.units.filter(u=>u.hp>0),groups=new Map(),positions=[];
  for(const u of living){const rx=Math.round(u.x),ry=Math.round(u.y),distance=Math.max(Math.abs(u.x-rx),Math.abs(u.y-ry));
   if(distance>=.12){positions.push({u,x:u.x*CW,y:u.y*CH+this.floorOffset(u.x,u.y)});continue}
   const id=`${rx},${ry}:${u.team}`;if(!groups.has(id))groups.set(id,[]);groups.get(id).push(u);
  }
  for(const group of groups.values()){
   group.sort((a,b)=>a.id-b.id);
   const size=Math.max(...group.map(u=>36*(u.size||1))),columns=Math.min(group.length,5,Math.max(1,Math.floor(118/Math.max(22,size*.65)))),rows=Math.ceil(group.length/columns),step=Math.min(24,112/(columns-.5)),rise=rows>1?Math.min(10,30/(rows-1)):0;
   group.forEach((u,index)=>{
    const row=Math.floor(index/columns),count=Math.min(columns,group.length-row*columns),column=index%columns,weight=Math.max(0,1-Math.max(Math.abs(u.x-Math.round(u.x)),Math.abs(u.y-Math.round(u.y)))/.12);
    // Keep one column grid even for incomplete ranks: alternate half a slot.
    const slot=column+Math.floor((columns-count)/2),offset=(slot-(columns-1)/2)*step+(rows>1?(row%2?.25:-.25)*step:0);
    positions.push({u,x:u.x*CW+offset*weight,y:u.y*CH+this.floorOffset(u.x,u.y)-row*rise*weight});
   });
  }
  // Rear ranks and northern rooms first, so foreground feet occlude naturally.
  return positions.sort((a,b)=>a.y-b.y||a.u.id-b.u.id);
 }
 corners(x,y,w,h){const c=this.ctx,l=12;c.beginPath();c.moveTo(x,y+l);c.lineTo(x,y);c.lineTo(x+l,y);c.moveTo(x+w-l,y);c.lineTo(x+w,y);c.lineTo(x+w,y+l);c.moveTo(x+w,y+h-l);c.lineTo(x+w,y+h);c.lineTo(x+w-l,y+h);c.moveTo(x+l,y+h);c.lineTo(x,y+h);c.lineTo(x,y+h-l);c.stroke()}
 unit(u,x,y,time){
  const c=this.ctx,ally=u.team==='ally',image=this.images[`unit-${u.type}`]||this.images['unit-goblin'];
  const size=36*(u.size||1),bob=this.reduced?0:Math.round(Math.sin(u.walk||0)*1.5),attack=this.reduced?0:Math.round(u.attack*7);
  c.save();c.translate(Math.round(x),Math.round(y)+bob);c.imageSmoothingEnabled=false;
  c.fillStyle='#26302138';c.fillRect(-size*.22,13,size*.44,3);
  if(u.facing<0)c.scale(-1,1);
  if(u.type==='immortal'&&this.immortalOutline)for(const [dx,dy]of [[-2,0],[2,0],[0,-2],[0,2]])c.drawImage(this.immortalOutline,Math.round(-size/2)+dx,Math.round(15-size)+dy,Math.round(size),Math.round(size));
  if(image)c.drawImage(image,Math.round(-size/2)+attack,Math.round(15-size),Math.round(size),Math.round(size));
  else{c.fillStyle=ally?'#436d4b':'#9a563b';c.fillRect(-5,-10,10,22)}
  if(u.facing<0)c.scale(-1,1);
  const marker=u.team==='neutral'?'#b5a56f':ally?'#356a4e':'#a44732';c.fillStyle=marker;c.fillRect(-3,17,6,3);
  if(u.type==='immortal'){c.fillStyle='#d8c692';c.font='bold 17px Georgia';c.textAlign='center';c.fillText('∞',0,9-size);}
  if(this.game.s.combat&&u.type!=='immortal'){const width=Math.max(22,size*.55),top=12-size;
   c.fillStyle='#302f26';c.fillRect(-width/2-1,top-1,width+2,5);c.fillStyle=marker;c.fillRect(-width/2,top,width*Math.max(0,u.hp/u.maxHp),3);
   if(u.shield>0){c.fillStyle='#79a0a2';c.fillRect(-width/2,top-4,width*Math.min(1,u.shield/20),2)}
  }c.restore();
 }
}
