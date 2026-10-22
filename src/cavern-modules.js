import {passagePalette} from './passages.js';
import {RoomAppearance} from './room-appearance.js';
// Original room sprites remain intact. Only the shared opening receives a
// painted patch, cropped and scaled uniformly, never warped.
export class CavernModules{
 constructor(){this.cache=new Map();this.ids=new WeakMap();this.nextId=1;this.appearance=new RoomAppearance()}
 identity(image){if(!this.ids.has(image))this.ids.set(image,this.nextId++);return this.ids.get(image)}
 patch(a,b,vertical,images){
  const variant=(a.variant+b.variant)%2,architecture=a.joinArchitecture==='built'&&b.joinArchitecture==='built'?'built':'cavern',raw=images[`${architecture}-${vertical?'vertical':'horizontal'}-${variant}`];if(!raw)return null;
  const first=this.appearance.get(raw,a.type,a.hazards||[a.contaminant].filter(Boolean),0,true),second=this.appearance.get(raw,b.type,b.hazards||[b.contaminant].filter(Boolean),0,true),id=`${this.identity(first)}:${this.identity(second)}:${vertical}`;if(this.cache.has(id))return this.cache.get(id);
  const tile=document.createElement('canvas');tile.width=vertical?60:80;tile.height=vertical?80:56;const ctx=tile.getContext('2d');ctx.imageSmoothingEnabled=false;
  const crop=image=>{const unit=document.createElement('canvas');unit.width=unit.height=80;const c=unit.getContext('2d');c.imageSmoothingEnabled=false;c.drawImage(image,0,0,80,80);return unit};
  ctx.drawImage(crop(first),vertical?10:0,vertical?0:12,tile.width,tile.height,0,0,tile.width,tile.height);const left=ctx.getImageData(0,0,tile.width,tile.height);ctx.clearRect(0,0,tile.width,tile.height);ctx.drawImage(crop(second),vertical?10:0,vertical?0:12,tile.width,tile.height,0,0,tile.width,tile.height);const right=ctx.getImageData(0,0,tile.width,tile.height),p=left.data;
  // The room palettes meet at the centre; hazards stay on their own side.
  for(let y=0;y<tile.height;y++)for(let x=0;x<tile.width;x++){const axis=vertical?y:x,length=vertical?tile.height:tile.width,blend=Math.max(0,Math.min(1,(axis/length-.38)/.24)),i=(y*tile.width+x)*4;if(architecture==='built'&&(vertical?x>14&&x<46:y>17&&y<45)&&Math.abs(p[i]-229)+Math.abs(p[i+1]-221)+Math.abs(p[i+2]-198)<60){const pa=passagePalette(a).floor,pb=passagePalette(b).floor;for(let k=0;k<3;k++){p[i+k]=pa[k];right.data[i+k]=pb[k]}}for(let k=0;k<3;k++)p[i+k]=Math.round(p[i+k]*(1-blend)+right.data[i+k]*blend);p[i+3]=Math.max(p[i+3],right.data[i+3]);if((vertical?x>16&&x<44:y>19&&y<43)&&p[i+3]<255){const floor=passagePalette(axis<length/2?a:b).floor;p[i]=floor[0];p[i+1]=floor[1];p[i+2]=floor[2];p[i+3]=255;}}
  ctx.putImageData(left,0,0);this.cache.set(id,tile);if(this.cache.size>128)this.cache.delete(this.cache.keys().next().value);return tile;
 }
 draw(ctx,a,b,first,second,images){
  if(!first||!second)return;const vertical=a.x===b.x,tile=this.patch({...a,image:first},{...b,image:second},vertical,images);if(!tile)return;
  const x=(a.x+b.x)*90,y=(a.y+b.y)*72;
  ctx.save();ctx.imageSmoothingEnabled=false;ctx.drawImage(tile,x-tile.width*.625,y-5-tile.height*.625,tile.width*1.25,tile.height*1.25);ctx.restore();
 }
}
