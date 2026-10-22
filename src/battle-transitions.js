// Presentation trajectories follow the opened graph; combat bookkeeping and
// saves already hold the settled result while the visible troops walk home.
export class BattleTransitions{
 constructor(renderer){this.renderer=renderer;this.white=new WeakMap();this.returns=new Map();this.returnUntil=0;this.game=null;this.banished=[];this.shards=[]}
 returnHome(units,time){
  const r=this.renderer,g=r.game;this.game=g;this.returns.clear();this.returnUntil=time;this.returnStart=time;const queues=new Map();
  for(const u of units){const live=g.s.units.find(v=>v.id===u.id&&v.team==='ally'&&v.hp>0),home=g.s.rooms[u.home];if(!live||!home||g.unitData(u).speed<=0)continue;
   const first=g.s.rooms[u.moveTarget]||g.room(Math.round(u.x),Math.round(u.y));if(!first)continue;const route=g.path(first,home,'ally',u);if(route===null)continue;
   const points=[{x:u.x,y:u.y},first,...route].filter((p,i,a)=>!i||Math.hypot(p.x-a[i-1].x,p.y-a[i-1].y)>.00001);if(points.length<2)continue;
   const lengths=[];let total=0;for(let i=1;i<points.length;i++){total+=Math.hypot(points[i].x-points[i-1].x,points[i].y-points[i-1].y);lengths.push(total)}
   const id=points.slice(1).map(p=>`${p.x},${p.y}`).join('|'),rank=queues.get(id)||0;queues.set(id,rank+1);const speed=g.unitData(u).speed*(g.s.artifacts.includes('speed')?1.15:1),start=time+rank*280,duration=total/speed*1000;
   this.returns.set(u.id,{points,lengths,total,start,duration,walk:u.walk||0});this.returnUntil=Math.max(this.returnUntil,start+duration);
  }
 }
 renderUnits(time){
  const r=this.renderer,g=r.game;if(r.exporting||this.game!==g||time>=this.returnUntil)return g.s.units;
  return g.s.units.map(u=>{const track=this.returns.get(u.id);if(!track||time>=track.start+track.duration)return u;
   const travel=Math.max(0,Math.min(track.total,(time-track.start)/track.duration*track.total));let i=track.lengths.findIndex(n=>n>=travel);if(i<0)i=track.lengths.length-1;const a=track.points[i],b=track.points[i+1],before=i?track.lengths[i-1]:0,f=(travel-before)/Math.max(.00001,track.lengths[i]-before);
   return{...u,x:a.x+(b.x-a.x)*f,y:a.y+(b.y-a.y)*f,walk:track.walk+travel*12,attack:0,facing:b.x!==a.x?Math.sign(b.x-a.x):u.facing};
  });
 }
 silhouette(image){if(!image)return null;if(this.white.has(image))return this.white.get(image);const c=document.createElement('canvas');c.width=image.width;c.height=image.height;const ctx=c.getContext('2d');ctx.drawImage(image,0,0);ctx.globalCompositeOperation='source-in';ctx.fillStyle='#ffffff';ctx.fillRect(0,0,c.width,c.height);this.white.set(image,c);return c}
 defeat(units,time,reduced){
  const r=this.renderer;this.game=r.game;this.returns.clear();this.returnUntil=0;this.banished=r.unitFormation(units).map(p=>({...p,start:time,life:reduced?300:1100}));this.shards=[];
  const count=Math.max(3,Math.min(reduced?5:18,Math.floor(4000/Math.max(1,units.length))));
  for(const p of this.banished)for(let i=0;i<count;i++){const a=i*2.399963+p.u.id,speed=14+(i*13%39)*(p.u.size||1);this.shards.push({x:p.x,y:p.y-12*(p.u.size||1),vx:Math.cos(a)*speed,vy:Math.sin(a)*speed-10,start:time+(reduced?50:180),life:reduced?250:900,color:['#ffffff','#b9f0ed','#7cd3e1'][i%3],size:1+i%3})}
 }
 draw(time){const r=this.renderer;if(r.exporting||this.game!==r.game)return;const c=r.ctx;c.save();
  this.banished=this.banished.filter(p=>time-p.start<p.life);for(const p of this.banished){const t=(time-p.start)/p.life,alpha=t<.2?1:Math.max(0,1-(t-.2)/.2),image=this.silhouette(r.images[`unit-${p.u.type}`]||r.images['unit-goblin']),size=36*(p.u.size||1);if(!image||!alpha)continue;c.globalAlpha=alpha;c.save();c.translate(Math.round(p.x),Math.round(p.y));if(p.u.facing<0)c.scale(-1,1);c.drawImage(image,-size/2,15-size,size,size);c.restore()}
  this.shards=this.shards.filter(p=>time-p.start<p.life);for(const p of this.shards){const t=(time-p.start)/1000;if(t<0)continue;c.globalAlpha=Math.max(0,1-(time-p.start)/p.life);c.fillStyle=p.color;c.fillRect(Math.round(p.x+p.vx*t),Math.round(p.y+p.vy*t+25*t*t),p.size,p.size)}c.restore();
 }
}
