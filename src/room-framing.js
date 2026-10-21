// Match the footprint of the old room illustrations without stretching the art.
export class RoomFraming{
 constructor(){this.frames=new WeakMap();this.mouths=new WeakMap()}
 frame(image){
  if(!image)return image;if(this.frames.has(image))return this.frames.get(image);
  const source=document.createElement('canvas');source.width=image.width;source.height=image.height;const s=source.getContext('2d');s.drawImage(image,0,0);const pixels=s.getImageData(0,0,source.width,source.height).data;
  let left=source.width,right=-1,top=source.height,bottom=-1;
  for(let y=0;y<source.height;y++)for(let x=0;x<source.width;x++){const i=(y*source.width+x)*4;if(pixels[i+3]>=32&&pixels[i]<200){left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y)}}
  if(right<left)return image;
  const canvas=document.createElement('canvas');canvas.width=128;canvas.height=86;const c=canvas.getContext('2d');c.imageSmoothingEnabled=false;c.fillStyle='#e5ddc6';c.fillRect(0,0,128,86);
  const width=right-left+1,height=bottom-top+1,scale=Math.min(124/width,80/height),w=Math.round(width*scale),h=Math.round(height*scale);
  c.drawImage(source,left,top,width,height,Math.round((128-w)/2),Math.round(43-h/2),w,h);this.frames.set(image,canvas);return canvas;
 }
 ports(image){
  if(!image)return{east:12,west:12,north:12,south:12};if(this.mouths.has(image))return this.mouths.get(image);
  const canvas=document.createElement('canvas');canvas.width=128;canvas.height=86;const c=canvas.getContext('2d');c.drawImage(image,0,0,128,86);const pixels=c.getImageData(0,0,128,86).data;
  const solid=(x,y)=>{const i=(y*128+x)*4;return pixels[i+3]>=32&&pixels[i]<200};
  const edge=(horizontal,reverse)=>{const count=horizontal?128:86;for(let n=0;n<count;n++){const p=reverse?count-1-n:n;let hits=0;for(let k=-4;k<=4;k++)if(solid(horizontal?p:64+k,horizontal?47+k:p))hits++;if(hits>=3)return p}return horizontal?64:47};
  const ports={west:Math.max(0,Math.min(32,(edge(true,false)-64)*1.25+6+64)),east:Math.max(0,Math.min(32,64-((edge(true,true)-64)*1.25-6))),north:Math.max(0,Math.min(32,edge(false,false)*113.33/86-62+6+48)),south:Math.max(0,Math.min(32,42-(edge(false,true)*113.33/86-62-6)))};
  this.mouths.set(image,ports);return ports;
 }
}
