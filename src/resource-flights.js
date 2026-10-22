import {ProducerDock} from './producers.js';
// One particle per credited unit; presentation never delays the actual balance.
export class ResourceFlights{
 constructor(){this.dock=new ProducerDock();this.game=null;this.items=[];this.pending={resources:0,gold:0};this.reduced=false;this.layer=null;this.glyphs={}}
 reset(game=null){this.dock.reset(game);this.items=[];this.pending={resources:0,gold:0};this.game=game;this.clear();this.paint()}
 clear(){if(this.layer){this.layer.getContext('2d').clearRect(0,0,this.layer.width,this.layer.height);this.layer.hidden=true}}
 finish(){this.items=[];this.pending={resources:0,gold:0};this.clear();this.paint()}
 collect(game,card=null){
  if(this.game!==game)this.reset(game);this.dock.sync(game);
  const keep=[];for(const event of game.events){if(event.type==='resource-gain')this.receive(event,event.source?this.dock.origin(event):event.originElement||card);else if(event.type==='producer-trigger')this.dock.origin(event);else if(event.type==='producer-destroyed')this.dock.destroy(event,this.reduced);else keep.push(event)}game.events=keep;
 }
 receive(event,card=null){
  if(!this.game)return;
  if(this.reduced||document.hidden){this.paint();return}
  const origin=card?.querySelector('.card-suit')||card||document.querySelector('.room-portrait')||document.querySelector('#map');
  const rect=origin?.getBoundingClientRect(),sx=rect?.width?rect.left+rect.width/2:innerWidth/2,sy=rect?.height?rect.top+rect.height/2:innerHeight*.5;
  const now=performance.now();
  for(const type of ['resources','gold']){
   const count=Math.max(0,Math.floor(event[type]||0));this.pending[type]+=count;
   for(let i=0;i<count;i++)this.items.push({type,origin:card?origin:null,sx:sx/innerWidth,sy:sy/innerHeight,delay:now+320+(count>1?i*Math.min(40,850/(count-1)):0),duration:650+i%5*28,index:i,started:false});
  }
  if(this.items.length)this.ensureLayer();this.paint();
 }
 ensureLayer(){
  if(!this.layer){this.layer=document.createElement('canvas');this.layer.className='resource-flight-layer';this.layer.setAttribute('aria-hidden','true');document.body.append(this.layer)}
  this.layer.hidden=false;
 }
 glyph(type){
  if(this.glyphs[type])return this.glyphs[type];
  const canvas=document.createElement('canvas');canvas.width=64;canvas.height=64;const c=canvas.getContext('2d');
  c.font='bold 46px Georgia';c.textAlign='center';c.textBaseline='middle';c.lineWidth=4;c.strokeStyle='#1c2923';c.fillStyle=type==='resources'?'#ca896a':'#dcc37c';
  c.strokeText(type==='resources'?'♥':'♦',32,34);c.fillText(type==='resources'?'♥':'♦',32,34);this.glyphs[type]=canvas;return canvas;
 }
 paint(){
  if(!this.game)return;
  for(const type of ['resources','gold']){const el=document.getElementById(type);if(!el)continue;const text=String(Math.max(0,Math.floor(this.game.s[type])-this.pending[type]));if(el.textContent!==text)el.textContent=text}
 }
 tick(now){
  if(!this.items.length)return;
  if(this.reduced||document.hidden){this.finish();return}
  const dpr=Math.min(devicePixelRatio||1,2),width=Math.round(innerWidth*dpr),height=Math.round(innerHeight*dpr);
  if(this.layer.width!==width||this.layer.height!==height){this.layer.width=width;this.layer.height=height}
  const ctx=this.layer.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,innerWidth,innerHeight);
  const targets={};for(const type of ['resources','gold']){const el=document.getElementById(type),r=el.closest('.resource').querySelector('.resource-symbol').getBoundingClientRect();targets[type]={x:r.left+r.width/2,y:r.top+r.height/2}}
  const remaining=[],arrived=new Set();
  for(const item of this.items){
   if(now<item.delay){remaining.push(item);continue}
   if(!item.started){item.started=true;if(item.origin?.isConnected){const r=item.origin.getBoundingClientRect();item.sx=(r.left+r.width/2)/innerWidth;item.sy=(r.top+r.height/2)/innerHeight}item.origin=null}
   const t=Math.min(1,(now-item.delay)/item.duration),target=targets[item.type];
   if(t>=1){this.pending[item.type]--;arrived.add(item.type);continue}
   const start={x:item.sx*innerWidth+(item.index%5-2)*5,y:item.sy*innerHeight+(item.index%3-1)*5};
   const bend=(item.index%2?1:-1)*(30+item.index%4*12),control={x:(start.x+target.x)/2+bend,y:Math.min(start.y,target.y)-45};
   const q=t*t*(3-2*t),u=1-q,x=u*u*start.x+2*u*q*control.x+q*q*target.x,y=u*u*start.y+2*u*q*control.y+q*q*target.y,size=22+Math.sin(t*Math.PI)*6;
   ctx.globalAlpha=Math.min(1,t*10,(1-t)*12);ctx.drawImage(this.glyph(item.type),x-size/2,y-size/2,size,size);remaining.push(item);
  }
  for(const type of arrived){const badge=document.getElementById(type).closest('.resource');badge.classList.remove('resource-arrival');void badge.offsetWidth;badge.classList.add('resource-arrival')}
  ctx.globalAlpha=1;this.items=remaining;this.paint();if(!this.items.length)this.clear();
 }
}
