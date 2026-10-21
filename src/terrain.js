import {passageArchitecture,passagePalette} from './passages.js';
// Cached Canvas software fragment shader. World-space noise keeps adjoining
// tiles aligned, including negative coordinates, without a WebGL dependency.
const terrainNoise=(x,y)=>{let n=Math.imul(x,374761393)^Math.imul(y,668265263);n=Math.imul(n^(n>>>13),1274126177);return((n^(n>>>16))>>>0)/4294967296};
export class Terrain{
 constructor(){this.cache=new Map();this.foregrounds=new WeakMap();this.modules=new Map()}
 foreground(image){
  if(!image)return image;if(this.foregrounds.has(image))return this.foregrounds.get(image);
  const tile=document.createElement('canvas');tile.width=image.width;tile.height=image.height;const c=tile.getContext('2d');c.drawImage(image,0,0);const frame=c.getImageData(0,0,tile.width,tile.height),p=frame.data;
  for(let i=0;i<p.length;i+=4)if(Math.abs(p[i]-229)+Math.abs(p[i+1]-221)+Math.abs(p[i+2]-198)<36)p[i+3]=0;
  c.putImageData(frame,0,0);this.foregrounds.set(image,tile);return tile;
 }
 tile(room,game){
  const w=180,h=144,m=16,built=passageArchitecture(room)==='built',palette=passagePalette(room),neighbors=[];
  for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)if(game.room(room.x+dx,room.y+dy))neighbors.push([dx,dy]);
  const occupied=new Set(neighbors.map(([dx,dy])=>`${dx},${dy}`)),edges=[];
  for(const [dx,dy]of neighbors){const l=dx*w,t=dy*h;for(const [sx,sy,ax,ay,bx,by]of [[0,-1,l,t,l+w,t],[1,0,l+w,t,l+w,t+h],[0,1,l,t+h,l+w,t+h],[-1,0,l,t,l,t+h]])if(!occupied.has(`${dx+sx},${dy+sy}`))edges.push([ax,ay,bx,by])}
  const id=[room.x,room.y,built,palette.wall.join(','),neighbors.flat().join(',')].join('|');if(this.cache.has(id))return this.cache.get(id);
  const tile=document.createElement('canvas');tile.width=w+m*2;tile.height=h+m*2;const c=tile.getContext('2d'),frame=c.createImageData(tile.width,tile.height),p=frame.data;
  for(let y=0;y<tile.height;y++)for(let x=0;x<tile.width;x++){
   const lx=x-m,ly=y-m,wx=room.x*w-w/2+lx,wy=room.y*h-h/2+ly;
   // Signed distance to the union of discovered cells: shared edges never feather.
   const inside=neighbors.some(([dx,dy])=>lx>=dx*w&&lx<(dx+1)*w&&ly>=dy*h&&ly<(dy+1)*h);let nearest=Infinity;
   for(const [ax,ay,bx,by]of edges){const px=Math.max(Math.min(ax,bx),Math.min(Math.max(ax,bx),lx)),py=Math.max(Math.min(ay,by),Math.min(Math.max(ay,by),ly));nearest=Math.min(nearest,Math.hypot(lx-px,ly-py))}const distance=inside?nearest:-nearest;
   const coarse=terrainNoise(Math.floor(wx/7),Math.floor(wy/7)),grain=terrainNoise(wx,wy),edge=distance+(coarse-.5)*12+(grain-.5)*3;
   const alpha=Math.max(0,Math.min(1,(edge+8)/12));if(!alpha)continue;
   // Tile owns its interior; outside pixels only add the unfinished ink fringe.
   if((lx<0||lx>=w||ly<0||ly>=h)&&distance>=0)continue;
   const i=(y*tile.width+x)*4;let color=[0,0,0];
   if(built){const row=Math.floor(wy/10),joint=((wx+(row%2)*12)%24+24)%24<2||((wy%10+10)%10)<2,shade=joint?.22:.42+grain*.07;color=palette.wall.map(v=>Math.round(v*shade));if(!joint&&((wy%10+10)%10)===2)color=palette.wall.map(v=>Math.round(v*.57))}
   p[i]=color[0];p[i+1]=color[1];p[i+2]=color[2];p[i+3]=Math.round(alpha*255);
  }
  c.putImageData(frame,0,0);this.cache.set(id,tile);if(this.cache.size>256)this.cache.delete(this.cache.keys().next().value);return tile;
 }
 draw(ctx,room,game){ctx.drawImage(this.tile(room,game),room.x*180-106,room.y*144-88)}
 cavern(output,room,game,image){
  const same=(dx,dy)=>{const n=game.room(room.x+dx,room.y+dy);return n?.type==='cave'&&n.cavernGroup===room.cavernGroup&&game.linked(room,n)},n=same(0,-1),e=same(1,0),s=same(0,1),w=same(-1,0),x=room.x*180,y=room.y*144;
  // Modular rocky perimeter. Only outer chamber edges carry rock; shared
  // interiors remain continuous black, with no cut-out rectangles or scaled art.
  const palette=passagePalette(room),id=[room.x,room.y,room.variant,n,e,s,w,palette.wall.join(',')].join('|');if(this.modules.has(id)){output.drawImage(this.modules.get(id),x-90,y-72);return}
  const tile=document.createElement('canvas');tile.width=180;tile.height=144;const ctx=tile.getContext('2d');ctx.save();ctx.translate(90-x,72-y);
  for(let py=-70;py<72;py+=2)for(let px=-90;px<90;px+=2){
   const wx=x+px,wy=y+py,noise=terrainNoise(Math.floor(wx/6),Math.floor(wy/6)),grain=terrainNoise(wx,wy);
   const top=!n?py-(-57+Math.round(noise*7)):Infinity,bottom=!s?(48-Math.round(noise*7))-py:Infinity,left=!w?px-(-80+Math.round(noise*7)):Infinity,right=!e?(80-Math.round(noise*7))-px:Infinity;
   const edge=Math.min(top,bottom,left,right);if(edge<0||edge>10)continue;
   const shade=edge<3?.8:edge<7?.5:.28,color=palette.wall.map((v,i)=>Math.round(v*shade+palette.light[i]*grain*.13));ctx.fillStyle=`rgb(${color.join(',')})`;ctx.fillRect(wx,wy,2,2);
  }
  // Three variant layouts of rock details retain distinct empty-room art.
  for(let i=0;i<3;i++){const px=-60+i*48+(room.variant-1)*7,height=5+Math.floor(terrainNoise(x+i+room.variant*17,y)*10);ctx.fillStyle=`rgb(${palette.wall.join(',')})`;
   if(!n)for(let k=0;k<height;k+=2)ctx.fillRect(x+px+k/3,y-49+k,Math.max(2,10-k/2),2);
   if(!s&&i!==1)for(let k=0;k<height;k+=2)ctx.fillRect(x+px-k/3,y+35-k,Math.max(2,12-k/2),2);
  }
  // A thin floor ledge gives troops a footing without splitting the open room.
  ctx.fillStyle='#38392c';ctx.fillRect(x-(w?90:68),y+36,(w?90:68)+(e?90:68),2);ctx.restore();this.modules.set(id,tile);if(this.modules.size>256)this.modules.delete(this.modules.keys().next().value);output.drawImage(tile,x-90,y-72);
 }
}
