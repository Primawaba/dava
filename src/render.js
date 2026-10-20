import {ROOMS,DIRS} from './data.js';
import {key} from './engine.js';
export const CW=180,CH=144;
export class Renderer{
 constructor(canvas,onSelect,onHover){this.canvas=canvas;this.ctx=canvas.getContext('2d');this.zoom=1;this.camera={x:0,y:80};this.images={};this.selected={x:0,y:0};this.hover=null;this.game=null;this.reduced=false;this.pointers=new Map();this.drag=null;this.pinch=null;this.onSelect=onSelect;this.onHover=onHover;this.setupInput();this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(canvas);this.resize()}
 async load(){await Promise.all(Object.keys(ROOMS).flatMap(type=>[0,1,2].map(v=>new Promise(resolve=>{const i=new Image();i.onload=()=>{this.images[`${type}-${v}`]=i;resolve()};i.onerror=()=>resolve();i.src=`./assets/rooms/${type}-${v}.svg`}))));}
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
 corridor(r,n,overlay=false){const c=this.ctx;let x=r.x*CW,y=r.y*CH,nx=n.x*CW,ny=n.y*CH;
  if(overlay){const dx=Math.sign(nx-x),dy=Math.sign(ny-y);x+=dx*CW*.34;y+=dy*CH*.21;nx=r.x*CW+dx*CW*.56;ny=r.y*CH+dy*CH*.56}
  c.lineCap='butt';c.strokeStyle='#676b55';c.lineWidth=19;c.beginPath();c.moveTo(x,y);c.lineTo(nx,ny);c.stroke();c.strokeStyle='#e4dac0';c.lineWidth=15;c.stroke();
  if(r.closed||n.closed){c.strokeStyle='#555b4a';c.lineWidth=2;const mx=(r.x*CW+n.x*CW)/2,my=(r.y*CH+n.y*CH)/2;for(let i=-6;i<=6;i+=4){c.beginPath();if(r.x!==n.x){c.moveTo(mx-3,my+i);c.lineTo(mx+3,my+i)}else{c.moveTo(mx+i,my-3);c.lineTo(mx+i,my+3)}c.stroke()}}
 }
 draw(time=0){const c=this.ctx,w=this.width,h=this.height;if(!w||!h)return;c.setTransform(this.dpr,0,0,this.dpr,0,0);c.fillStyle='#e5ddc6';c.fillRect(0,0,w,h);if(!this.game)return;
  c.save();c.translate(w/2,h/2);c.scale(this.zoom,this.zoom);c.translate(-this.camera.x,-this.camera.y);
  const bounds={left:this.camera.x-w/2/this.zoom-CW,right:this.camera.x+w/2/this.zoom+CW,top:this.camera.y-h/2/this.zoom-CH,bottom:this.camera.y+h/2/this.zoom+CH};
  c.strokeStyle='#6e77551c';c.lineWidth=.65;for(let x=Math.floor(bounds.left/CW);x<=Math.ceil(bounds.right/CW);x++){c.beginPath();c.moveTo((x+.5)*CW,bounds.top);c.lineTo((x+.5)*CW,bounds.bottom);c.stroke()}for(let y=Math.floor(bounds.top/CH);y<=Math.ceil(bounds.bottom/CH);y++){c.beginPath();c.moveTo(bounds.left,(y+.5)*CH);c.lineTo(bounds.right,(y+.5)*CH);c.stroke();c.fillStyle='#7d82624a';c.font='9px Georgia';c.textAlign='left';c.fillText(y>=0?String(y).padStart(2,'0'):`+${-y}`,bounds.left+CW*.7,y*CH)}
  // Ground boundary remains readable when the map scrolls underground.
  c.strokeStyle='#777b5e55';c.setLineDash([4,4]);c.beginPath();c.moveTo(bounds.left,-CH*.5);c.lineTo(bounds.right,-CH*.5);c.stroke();c.setLineDash([]);
  const visible=this.game.rooms.filter(r=>r.x*CW>bounds.left&&r.x*CW<bounds.right&&r.y*CH>bounds.top&&r.y*CH<bounds.bottom);
  for(const r of visible)for(const[dx,dy]of [[1,0],[0,1]]){const n=this.game.room(r.x+dx,r.y+dy);if(n)this.corridor(r,n)}
  for(const r of visible){const x=r.x*CW,y=r.y*CH;const image=this.images[`${r.type}-${r.variant}`];if(image)c.drawImage(image,x-80,y-62,160,113.33);else{c.fillStyle='#d9cfb1';c.fillRect(x-72,y-45,144,90)}
   for(const[dx,dy]of DIRS){const n=this.game.room(r.x+dx,r.y+dy);if(n)this.corridor(r,n,true)}
   if(r.contaminant||ROOMS[r.type].hazard){c.fillStyle=['lava','crater'].includes(r.type)||['lava','crater'].includes(r.contaminant)?'#b66d3f33':'#79927344';c.fillRect(x-65,y-35,130,65)}
   if(r.damaged){c.strokeStyle='#9e634b';c.lineWidth=2;c.beginPath();c.moveTo(x-35,y-26);c.lineTo(x-16,y-5);c.lineTo(x-23,y+5);c.lineTo(x+8,y+30);c.moveTo(x+32,y-30);c.lineTo(x+16,y-3);c.stroke()}
   if(r.trap){c.strokeStyle='#9c6149';c.lineWidth=1.5;c.beginPath();for(let i=0;i<6;i++){const px=x-17+i*7;c.moveTo(px,y+34);c.lineTo(px+4,y+25);c.lineTo(px+7,y+34)}c.stroke()}
   if(r.barricade?.hp>0){c.fillStyle='#897b5d';c.strokeStyle='#4c5040';c.lineWidth=1;c.fillRect(x-32,y+27,64,10);c.strokeRect(x-32,y+27,64,10)}
   const selected=this.selected.x===r.x&&this.selected.y===r.y;if(selected){c.strokeStyle='#8a7447';c.lineWidth=1.2;this.corners(x-83,y-64,166,121)}
   c.textAlign='center';c.font='10px Georgia';c.fillStyle=r.damaged?'#925a40':'#505541';const label=ROOMS[r.type].name;const tw=c.measureText(label).width;c.fillStyle='#e5ddc6ee';c.fillRect(x-tw/2-4,y+54,tw+8,14);c.fillStyle=r.damaged?'#925a40':'#505541';c.fillText(label,x,y+64);
  }
  if(!this.game.s.combat&&this.game.s.status==='playing')for(const f of this.game.frontier()){const x=f.x*CW,y=f.y*CH;if(x<bounds.left||x>bounds.right||y<bounds.top||y>bounds.bottom)continue;const hover=this.hover?.x===f.x&&this.hover?.y===f.y,selected=this.selected.x===f.x&&this.selected.y===f.y;c.strokeStyle=selected?'#897447':hover?'#7a8461':'#8a947349';c.fillStyle=selected?'#b4a67b20':hover?'#d6d1b377':'#ddd8bd24';c.lineWidth=selected?1.4:1;c.setLineDash([3,5]);c.fillRect(x-64,y-43,128,86);c.strokeRect(x-64,y-43,128,86);c.setLineDash([]);c.strokeStyle=selected?'#8a7447':'#8e987759';c.lineWidth=1;c.beginPath();c.moveTo(x-6,y-3);c.lineTo(x+6,y-3);c.moveTo(x,y-9);c.lineTo(x,y+3);c.stroke();c.font='7px Arial';c.textAlign='center';c.fillStyle=selected?'#897447':'#8e987788';c.fillText('EXPLORAR',x,y+19)}
  for(const u of this.game.s.units){if(u.hp<=0)continue;const same=this.game.s.units.filter(v=>v.hp>0&&Math.hypot(v.x-u.x,v.y-u.y)<.12),idx=same.findIndex(v=>v.id===u.id);const spread=Math.min(5,same.length);const ox=(idx%spread-(spread-1)/2)*12,oy=Math.floor(idx/spread)*9;this.unit(u,u.x*CW+ox,u.y*CH+oy,time)}
  for(const p of this.game.projectiles){const x=(p.x+(p.tx-p.x)*p.t)*CW,y=(p.y+(p.ty-p.y)*p.t)*CH;c.save();c.translate(x,y);c.rotate(Math.atan2((p.ty-p.y)*CH,(p.tx-p.x)*CW));c.strokeStyle=p.team==='enemy'?'#a4563e':'#2f6853';c.fillStyle=c.strokeStyle;c.lineWidth=2;if(p.kind==='arrow'||p.kind==='bolt'){c.beginPath();c.moveTo(-13,0);c.lineTo(9,0);c.moveTo(4,-4);c.lineTo(10,0);c.lineTo(4,4);c.stroke();c.lineWidth=1;c.moveTo(-8,0);c.lineTo(-12,-3);c.stroke()}else{c.shadowColor=c.fillStyle;c.shadowBlur=10;c.beginPath();c.arc(0,0,p.kind==='flask'?4:5,0,Math.PI*2);c.fill();c.shadowBlur=0;c.strokeStyle='#b9c9a4';c.lineWidth=1;c.beginPath();c.moveTo(-5,0);c.lineTo(-17,0);c.stroke()}c.restore()}
  if(!this.reduced)for(const e of this.game.effects){c.globalAlpha=Math.min(1,e.life*2);c.strokeStyle=e.kind==='death'?'#a16e51':'#a16e51';c.lineWidth=1.5;c.beginPath();c.arc(e.x*CW,e.y*CH,(1-e.life)*20+5,0,Math.PI*2);c.stroke();c.globalAlpha=1}
  c.restore();
 }
 corners(x,y,w,h){const c=this.ctx,l=12;c.beginPath();c.moveTo(x,y+l);c.lineTo(x,y);c.lineTo(x+l,y);c.moveTo(x+w-l,y);c.lineTo(x+w,y);c.lineTo(x+w,y+l);c.moveTo(x+w,y+h-l);c.lineTo(x+w,y+h);c.lineTo(x+w-l,y+h);c.moveTo(x+l,y+h);c.lineTo(x,y+h);c.lineTo(x,y+h-l);c.stroke()}
 unit(u,x,y,time){const c=this.ctx;const ally=u.team==='ally';const color=ally?'#346c55':'#994f39';const bob=this.reduced?0:Math.sin(u.walk||0)*1.7;const attack=this.reduced?0:u.attack*10;c.save();c.translate(x,y-1+bob);c.fillStyle='#293b2330';c.beginPath();c.ellipse(0,12,8,3,0,0,Math.PI*2);c.fill();c.strokeStyle='#303a2d';c.lineWidth=1.2;
  if(u.type==='dog'||u.type==='rat'||u.type==='beast'){c.fillStyle=color;c.beginPath();c.ellipse(0,5,u.type==='beast'?10:7,5,0,0,Math.PI*2);c.fill();c.stroke();c.beginPath();c.moveTo(-7,8);c.lineTo(-7,13);c.moveTo(5,8);c.lineTo(5,13);c.moveTo(-7,3);c.lineTo(-12,-2);c.stroke();c.beginPath();c.arc(7,1,4,0,Math.PI*2);c.fill();c.stroke()}
  else if(u.type==='dragon'||u.type==='guardian'){c.fillStyle=color;c.beginPath();c.moveTo(-16,5);c.lineTo(-23,-12);c.lineTo(-7,-5);c.lineTo(0,-17);c.lineTo(8,-4);c.lineTo(24,-12);c.lineTo(17,7);c.lineTo(0,13);c.closePath();c.fill();c.stroke();c.fillStyle='#ebd9a6';c.fillRect(-5,-3,3,2);c.fillRect(3,-3,3,2)}
  else{c.fillStyle=color;c.beginPath();c.moveTo(-4,-1);c.lineTo(5,-1);c.lineTo(8,11);c.lineTo(-7,11);c.closePath();c.fill();c.stroke();c.fillStyle='#d7c69f';c.beginPath();c.arc(0,-5,4,0,Math.PI*2);c.fill();c.stroke();c.beginPath();c.moveTo(-3,11);c.lineTo(-4,15);c.moveTo(3,11);c.lineTo(4,15);c.stroke();
   if(['mage','cleric','alchemist'].includes(u.type)){c.fillStyle=color;c.beginPath();c.moveTo(-6,-7);c.lineTo(1,-17);c.lineTo(6,-7);c.closePath();c.fill();c.stroke();c.beginPath();c.moveTo(9,12);c.lineTo(9,-10);c.stroke();c.fillStyle=ally?'#7aab8a':'#ae6b48';c.beginPath();c.arc(9,-11,2.5,0,Math.PI*2);c.fill()}
   else if(u.type==='archer'){c.beginPath();c.arc(9,2,8,-1.3,1.3);c.stroke();c.beginPath();c.moveTo(11,-6);c.lineTo(11,10);c.stroke()}
   else if(u.type==='siege'){c.fillStyle='#918567';c.fillRect(-13,1,27,7);c.strokeRect(-13,1,27,7);c.beginPath();c.arc(-7,11,4,0,7);c.arc(8,11,4,0,7);c.stroke();c.lineWidth=3;c.beginPath();c.moveTo(-4,1);c.lineTo(16,-9);c.stroke()}
   else{c.fillStyle='#9c9d82';c.beginPath();c.moveTo(-5,-5);c.lineTo(-5,-9);c.quadraticCurveTo(0,-14,5,-9);c.lineTo(5,-5);c.fill();c.stroke();c.beginPath();c.moveTo(7,5);c.lineTo(12+attack,-6+attack);c.stroke();c.fillStyle='#b1af8a';c.beginPath();c.ellipse(-7,4,4,6,0,0,7);c.fill();c.stroke()}
  }
  if(this.game.s.combat){c.fillStyle='#595f4855';c.fillRect(-10,-22,20,2.5);c.fillStyle=color;c.fillRect(-10,-22,20*Math.max(0,u.hp/u.maxHp),2.5);if(u.shield>0){c.strokeStyle='#6f9da6';c.lineWidth=1;c.beginPath();c.arc(0,0,13,0,7);c.stroke()}}else{c.fillStyle=color;c.beginPath();c.arc(0,19,1.8,0,7);c.fill()}
  c.restore();
 }
}
