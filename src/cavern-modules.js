import {RoomAppearance} from './room-appearance.js';
// Keep every original room sprite intact. Only the shared opening receives a
// separately painted patch, cropped and scaled uniformly, never warped.
export class CavernModules{
 constructor(){this.cache=new Map();this.ids=new WeakMap();this.nextId=1;this.appearance=new RoomAppearance()}
 identity(image){if(!this.ids.has(image))this.ids.set(image,this.nextId++);return this.ids.get(image)}
 patch(a,b,vertical,images){
  const variant=(a.variant+b.variant)%2,raw=images[`cavern-${vertical?'vertical':'horizontal'}-${variant}`],source=raw&&this.appearance.get(raw,'cave',[a.contaminant,b.contaminant].filter(Boolean),0,true);if(!source)return null;
  const id=`${this.identity(source)}:${this.identity(a.image)}:${this.identity(b.image)}:${vertical}`;if(this.cache.has(id))return this.cache.get(id);
  const tile=document.createElement('canvas');tile.width=vertical?60:80;tile.height=vertical?80:56;const ctx=tile.getContext('2d');ctx.imageSmoothingEnabled=false;
  // All generated modules are square. Central crops change the footprint, not
  // the shape of individual pixels; the final draw uses one uniform scale.
  const unit=document.createElement('canvas');unit.width=unit.height=80;unit.getContext('2d').drawImage(source,0,0,80,80);ctx.drawImage(unit,vertical?10:0,vertical?0:12,tile.width,tile.height,0,0,tile.width,tile.height);
  const data=ctx.getImageData(0,0,tile.width,tile.height),p=data.data;
  // Feather the two ends into the preserved room interior, with pixel steps.
  for(let y=0;y<tile.height;y++)for(let x=0;x<tile.width;x++){const axis=vertical?y:x,length=vertical?tile.height:tile.width,fade=Math.min(1,(axis+1)/9,(length-axis)/9);p[(y*tile.width+x)*4+3]=Math.round(p[(y*tile.width+x)*4+3]*fade)}
  ctx.putImageData(data,0,0);this.cache.set(id,tile);if(this.cache.size>128)this.cache.delete(this.cache.keys().next().value);return tile;
 }
 draw(ctx,a,b,first,second,images){
  if(!first||!second)return;const vertical=a.x===b.x,tile=this.patch({...a,image:first},{...b,image:second},vertical,images);if(!tile)return;
  const x=(a.x+b.x)*90,y=(a.y+b.y)*72;
  ctx.save();ctx.imageSmoothingEnabled=false;ctx.drawImage(tile,x-tile.width*.625,y-5-tile.height*.625,tile.width*1.25,tile.height*1.25);ctx.restore();
 }
}
