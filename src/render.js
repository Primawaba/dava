import {ROOMS,DIRS,SPRITE_FRAMES,PASSAGES} from './data.js';
import {key} from './engine.js';
export const CW=180,CH=144;
export class Renderer{
 constructor(canvas,onSelect,onHover){this.canvas=canvas;this.ctx=canvas.getContext('2d');this.zoom=1;this.camera={x:0,y:80};this.images={};this.selected={x:0,y:0};this.hover=null;this.game=null;this.reduced=false;this.pointers=new Map();this.drag=null;this.pinch=null;this.onSelect=onSelect;this.onHover=onHover;this.setupInput();this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(canvas);this.resize()}
 async load(){
  const assets=Object.keys(ROOMS).flatMap(type=>[0,1,2].map(v=>({id:`${type}-${v}`,src:`./assets/rooms/${type}-${v}.png`})));
  assets.push(...Object.keys(SPRITE_FRAMES).map(type=>({id:`unit-${type}`,src:`./assets/sprites/${type}.png`})));
  assets.push(...PASSAGES.map(name=>({id:`passage-${name}`,src:`./assets/passages/${name}.png`})));
  await Promise.all(assets.map(({id,src})=>new Promise(resolve=>{const i=new Image();i.onload=()=>{this.images[id]=i;resolve()};i.onerror=()=>resolve();i.src=src})));
 }
 resize(){const r=this.canvas.getBoundingClientRect();this.width=r.width;this.height=r.height;const dpr=Math.min(devicePixelRatio||1,2);this.canvas.width=Math.round(r.width*dpr);this.canvas.height=Math.round(r.height*dpr);this.dpr=dpr}
 screenToWorld(x,y){return{x:(x-this.width/2)/this.zoom+this.camera.x,y:(y-this.height/2)/this.zoom+this.camera.y}}
 point(event){const r=this.canvas.getBoundingClientRect();return{x:event.clientX-r.left,y:event.clientY-r.top}}
 tile(x,y){const p=this.screenToWorld(x,y);return{x:Math.round(p.x/CW),y:Math.round(p.y/CH)}}
 setupInput(){const c=this.canvas;
  c.addEventListener('pointerdown',e=>{const p=this.point(e);this.pointers.set(e.pointerId,p);c.setPointerCapture(e.pointerId);this.drag={start:p,last:p,moved:false};if(this.pointers.size===2){const a=[...this.pointers.values()];this.pinch={distance:Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y),zoom:this.zoom};this.drag.moved=true}this.onHover(null)});
  c.addEventListener('pointermove',e=>{const p=this.point(e);if(this.pointers.has(e.pointerId)){this.pointers.set(e.pointerId,p);if(this.pointers.size===2&&this.pinch){const a=[...this.pointers.values()];this.zoom=Math.max(.35,Math.min(2.2,this.pinch.zoom*Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y)/Math.max(1,this.pinch.distance)));return}if(this.drag){const d=this.drag;if(Math.hypot(p.x-d.start.x,p.y-d.start.y)>5)d.moved=true;if(d.moved){this.camera.x-=(p.x-d.last.x)/this.zoom;this.camera.y-=(p.y-d.last.y)/this.zoom}d.last=p}return}this.hover=this.tile(p.x,p.y);this.onHover({tile:this.hover,point:p})});
  c.addEventListener('pointerup',e=>{const p=this.point(e);const clicked=this.drag&&!this.drag.moved&&!this.pinch;this.pointers.delete(e.pointerId);if(clicked){const t=this.tile(p.x,p.y);this.selected=t;this.onSelect(t)}if(!this.pointers.size){this.drag=null;this.pinch=null}else if(this.drag)this.drag.moved=true});
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
  const variant=Math.abs(r.x+r.y+n.x+n.y)%2,tile=this.images[`passage-${vertical?'v':'h'}-${variant}`];
  c.save();c.imageSmoothingEnabled=false;
  const start=vertical?y+24:x+40,end=vertical?ny-24:nx-40;
  c.beginPath();if(vertical)c.rect(x-16,start,32,end-start);else c.rect(start,y-16,end-start,32);c.clip();
  for(let p=Math.floor(start/32)*32;p<end;p+=32){
   if(tile){if(vertical)c.drawImage(tile,x-16,p,32,32);else c.drawImage(tile,p,y-16,32,32)}
   else{c.fillStyle='#161714';if(vertical)c.fillRect(x-12,p,24,32);else c.fillRect(p,y-12,32,24)}
  }c.restore();
  const image=name=>this.images['passage-'+name];
  if(vertical){if(image('door-s'))c.drawImage(image('door-s'),x-16,y+24,32,48);if(image('door-n'))c.drawImage(image('door-n'),nx-16,ny-72,32,48)}
  else{if(image('door-e'))c.drawImage(image('door-e'),x+40,y-16,48,32);if(image('door-w'))c.drawImage(image('door-w'),nx-88,ny-16,48,32)}
  if((r.closed||n.closed)&&image('grate'))c.drawImage(image('grate'),(x+nx)/2-16,(y+ny)/2-16,32,32);
 }
 draw(time=0){const c=this.ctx,w=this.width,h=this.height;if(!w||!h)return;c.setTransform(this.dpr,0,0,this.dpr,0,0);c.imageSmoothingEnabled=false;c.fillStyle='#e5ddc6';c.fillRect(0,0,w,h);if(!this.game)return;
  c.save();c.translate(w/2,h/2);c.scale(this.zoom,this.zoom);c.translate(-this.camera.x,-this.camera.y);
  const bounds={left:this.camera.x-w/2/this.zoom-CW,right:this.camera.x+w/2/this.zoom+CW,top:this.camera.y-h/2/this.zoom-CH,bottom:this.camera.y+h/2/this.zoom+CH};
  c.strokeStyle='#6e77551c';c.lineWidth=.65;for(let x=Math.floor(bounds.left/CW);x<=Math.ceil(bounds.right/CW);x++){c.beginPath();c.moveTo((x+.5)*CW,bounds.top);c.lineTo((x+.5)*CW,bounds.bottom);c.stroke()}for(let y=Math.floor(bounds.top/CH);y<=Math.ceil(bounds.bottom/CH);y++){c.beginPath();c.moveTo(bounds.left,(y+.5)*CH);c.lineTo(bounds.right,(y+.5)*CH);c.stroke();c.fillStyle='#7d82624a';c.font='9px Georgia';c.textAlign='left';c.fillText(y>=0?String(y).padStart(2,'0'):`+${-y}`,bounds.left+CW*.7,y*CH)}
  c.fillStyle='#d7dfd332';c.fillRect(bounds.left,bounds.top,bounds.right-bounds.left,Math.max(0,-CH*.5-bounds.top));
  // Ground boundary remains readable when the map scrolls underground.
  c.strokeStyle='#777b5e55';c.setLineDash([4,4]);c.beginPath();c.moveTo(bounds.left,-CH*.5);c.lineTo(bounds.right,-CH*.5);c.stroke();c.setLineDash([]);
  const visible=this.game.rooms.filter(r=>r.x*CW>bounds.left&&r.x*CW<bounds.right&&r.y*CH>bounds.top&&r.y*CH<bounds.bottom);
  for(const r of visible){const x=r.x*CW,y=r.y*CH;if(r.y<0&&(r.y===-1||this.game.room(r.x,r.y+1))){c.fillStyle='#57594a';const bottom=r.y===-1?CH*.5:CH-54;for(const ox of [-53,47])c.fillRect(x+ox,y+40,6,bottom-40);c.fillStyle='#b1a889';for(const ox of [-51,49])c.fillRect(x+ox,y+40,2,bottom-40);}const image=this.images[`${r.type}-${r.variant}`];if(image)c.drawImage(image,x-80,y-62,160,113.33);else{c.fillStyle='#d9cfb1';c.fillRect(x-72,y-45,144,90)}
  }
  // Composite every room first, then its doorway aprons; no room PNG can cover a neighbor's connection.
  for(const r of visible)for(const[dx,dy]of [[1,0],[0,1]]){const n=this.game.room(r.x+dx,r.y+dy);if(n)this.corridor(r,n)}
  for(const r of visible){const x=r.x*CW,y=r.y*CH;
   if(this.game.roomHazards(r).length){c.fillStyle=['lava','crater'].includes(r.type)||['lava','crater'].includes(r.contaminant)?'#b66d3f33':'#79927344';c.fillRect(x-65,y-35,130,65)}
   if(r.damaged){c.strokeStyle='#9e634b';c.lineWidth=2;c.beginPath();c.moveTo(x-35,y-26);c.lineTo(x-16,y-5);c.lineTo(x-23,y+5);c.lineTo(x+8,y+30);c.moveTo(x+32,y-30);c.lineTo(x+16,y-3);c.stroke()}
   if(r.trap){c.strokeStyle='#9c6149';c.lineWidth=1.5;c.beginPath();for(let i=0;i<6;i++){const px=x-17+i*7;c.moveTo(px,y+34);c.lineTo(px+4,y+25);c.lineTo(px+7,y+34)}c.stroke()}
   if(r.barricade?.hp>0){c.fillStyle='#897b5d';c.strokeStyle='#4c5040';c.lineWidth=1;c.fillRect(x-32,y+27,64,10);c.strokeRect(x-32,y+27,64,10)}
   const selected=this.selected.x===r.x&&this.selected.y===r.y;if(selected){c.strokeStyle='#8a7447';c.lineWidth=1.2;this.corners(x-83,y-64,166,121)}
   c.textAlign='center';c.font='10px Georgia';c.fillStyle=r.damaged?'#925a40':'#505541';const label=ROOMS[r.type].name;const tw=c.measureText(label).width,labelX=this.game.room(r.x,r.y+1)?x-24-tw/2:x;c.fillStyle='#e5ddc6ee';c.fillRect(labelX-tw/2-4,y+54,tw+8,14);c.fillStyle=r.damaged?'#925a40':'#505541';c.fillText(label,labelX,y+64);
  }
  if(!this.game.s.combat&&this.game.s.status==='playing')for(const f of this.game.frontier()){const x=f.x*CW,y=f.y*CH;if(x<bounds.left||x>bounds.right||y<bounds.top||y>bounds.bottom)continue;const hover=this.hover?.x===f.x&&this.hover?.y===f.y,selected=this.selected.x===f.x&&this.selected.y===f.y;c.strokeStyle=selected?'#897447':hover?'#7a8461':'#8a947349';c.fillStyle=selected?'#b4a67b20':hover?'#d6d1b377':'#ddd8bd24';c.lineWidth=selected?1.4:1;c.setLineDash([3,5]);c.fillRect(x-64,y-43,128,86);c.strokeRect(x-64,y-43,128,86);c.setLineDash([]);c.strokeStyle=selected?'#8a7447':'#8e987759';c.lineWidth=1;c.beginPath();c.moveTo(x-6,y-3);c.lineTo(x+6,y-3);c.moveTo(x,y-9);c.lineTo(x,y+3);c.stroke();c.font='7px Arial';c.textAlign='center';c.fillStyle=selected?'#897447':'#8e987788';c.fillText('EXPLORAR',x,y+19)}
  if(!this.game.s.combat&&this.game.s.status==='playing')for(const f of this.game.surfaceSites()){
   const x=f.x*CW,y=f.y*CH;if(x<bounds.left||x>bounds.right||y<bounds.top||y>bounds.bottom)continue;
   const reason=this.game.surfaceReason(f),selected=this.selected.x===f.x&&this.selected.y===f.y;
   c.strokeStyle=reason?'#aa695566':selected?'#866c3e':'#7e8a6766';c.fillStyle=reason?'#ae6c5110':'#adc19918';c.setLineDash([4,4]);c.fillRect(x-65,y-43,130,86);c.strokeRect(x-65,y-43,130,86);c.setLineDash([]);
   c.fillStyle=reason?'#9b5c49':'#63734d';c.font='8px Arial';c.textAlign='center';c.fillText(reason?'SEM APOIO / CONEXÃO':'CONSTRUIR · SUPERFÍCIE',x,y+5);
  }
  for(const u of this.game.s.units){if(u.hp<=0)continue;const same=this.game.s.units.filter(v=>v.hp>0&&Math.hypot(v.x-u.x,v.y-u.y)<.12),idx=same.findIndex(v=>v.id===u.id);const spread=Math.min(5,same.length);const ox=(idx%spread-(spread-1)/2)*12,oy=Math.floor(idx/spread)*9;this.unit(u,u.x*CW+ox,u.y*CH+oy,time)}
  for(const p of this.game.projectiles){const x=(p.x+(p.tx-p.x)*p.t)*CW,y=(p.y+(p.ty-p.y)*p.t)*CH;c.save();c.translate(x,y);c.rotate(Math.atan2((p.ty-p.y)*CH,(p.tx-p.x)*CW));c.strokeStyle=p.team==='enemy'?'#a4563e':'#2f6853';c.fillStyle=c.strokeStyle;c.lineWidth=2;if(p.kind==='arrow'||p.kind==='bolt'){c.beginPath();c.moveTo(-13,0);c.lineTo(9,0);c.moveTo(4,-4);c.lineTo(10,0);c.lineTo(4,4);c.stroke();c.lineWidth=1;c.moveTo(-8,0);c.lineTo(-12,-3);c.stroke()}else{c.shadowColor=c.fillStyle;c.shadowBlur=10;c.beginPath();c.arc(0,0,p.kind==='flask'?4:5,0,Math.PI*2);c.fill();c.shadowBlur=0;c.strokeStyle='#b9c9a4';c.lineWidth=1;c.beginPath();c.moveTo(-5,0);c.lineTo(-17,0);c.stroke()}c.restore()}
  if(!this.reduced)for(const e of this.game.effects){c.globalAlpha=Math.min(1,e.life*2);c.strokeStyle=e.kind==='death'?'#a16e51':'#a16e51';c.lineWidth=1.5;c.beginPath();c.arc(e.x*CW,e.y*CH,(1-e.life)*20+5,0,Math.PI*2);c.stroke();c.globalAlpha=1}
  c.restore();
 }
 corners(x,y,w,h){const c=this.ctx,l=12;c.beginPath();c.moveTo(x,y+l);c.lineTo(x,y);c.lineTo(x+l,y);c.moveTo(x+w-l,y);c.lineTo(x+w,y);c.lineTo(x+w,y+l);c.moveTo(x+w,y+h-l);c.lineTo(x+w,y+h);c.lineTo(x+w-l,y+h);c.moveTo(x+l,y+h);c.lineTo(x,y+h);c.lineTo(x,y+h-l);c.stroke()}
 unit(u,x,y,time){
  const c=this.ctx,ally=u.team==='ally',image=this.images[`unit-${u.type}`]||this.images['unit-goblin'];
  const size=36*(u.size||1),bob=this.reduced?0:Math.round(Math.sin(u.walk||0)*1.5),attack=this.reduced?0:Math.round(u.attack*7);
  c.save();c.translate(Math.round(x),Math.round(y)+bob);c.imageSmoothingEnabled=false;
  c.fillStyle='#26302138';c.fillRect(-size*.22,13,size*.44,3);
  if(u.facing<0)c.scale(-1,1);
  if(image)c.drawImage(image,Math.round(-size/2)+attack,Math.round(15-size),Math.round(size),Math.round(size));
  else{c.fillStyle=ally?'#436d4b':'#9a563b';c.fillRect(-5,-10,10,22)}
  if(u.facing<0)c.scale(-1,1);
  const marker=ally?'#356a4e':'#a44732';c.fillStyle=marker;c.fillRect(-3,17,6,3);
  if(u.order==='guard'&&ally){c.fillStyle='#a28748';c.fillRect(-2,21,4,2)}
  if(this.game.s.combat){const width=Math.max(22,size*.55),top=12-size;
   c.fillStyle='#302f26';c.fillRect(-width/2-1,top-1,width+2,5);c.fillStyle=marker;c.fillRect(-width/2,top,width*Math.max(0,u.hp/u.maxHp),3);
   if(u.shield>0){c.fillStyle='#79a0a2';c.fillRect(-width/2,top-4,width*Math.min(1,u.shield/20),2)}
  }c.restore();
 }
}
