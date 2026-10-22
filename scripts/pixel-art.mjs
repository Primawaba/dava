import {chromium} from '@playwright/test';
import {readFile,writeFile,mkdir,readdir,unlink} from 'node:fs/promises';
import {ROOMS,SPRITE_FRAMES} from '../src/data.js';

// Build-time slicing of original generated raster sheets, using nearest pixels.
// The source artwork is retained so every exported PNG can be reproduced.
import {ROOM_ART_FAMILIES as families} from './room-families.mjs';
// Hand checked bounds for the generated sheet; generous monsters have wider cells.
const regions=Array.from({length:32},(_,i)=>[(i%8)*224,Math.floor(i/8)*224,224,224]);
regions[18]=[390,442,320,220];
regions[24]=[0,663,340,233];regions[25]=[340,663,180,233];regions[26]=[520,663,185,233];
regions[27]=[705,663,245,233];regions[28]=[950,663,160,233];regions[29]=[1110,663,220,233];
regions[30]=[1330,663,190,233];regions[31]=[1520,663,272,233];
await mkdir('public/assets/sprites',{recursive:true});
await mkdir('public/assets/rooms',{recursive:true});
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
try{
 const page=await browser.newPage();
 const rooms=(await readFile('public/assets/room-atlas.png')).toString('base64');
 const units=(await readFile('public/assets/unit-atlas.png')).toString('base64');
 await page.evaluate(async({rooms,units})=>{
  window.roomSheet=new Image();roomSheet.src='data:image/png;base64,'+rooms;
  window.unitSheet=new Image();unitSheet.src='data:image/png;base64,'+units;
  await Promise.all([roomSheet.decode(),unitSheet.decode()]);
 },{rooms,units});
 for(const [type,d]of Object.entries(ROOMS))for(let variant=0;variant<3;variant++){
  const result=await page.evaluate(({family,variant,type})=>{
   const c=document.createElement('canvas');c.width=128;c.height=86;const ctx=c.getContext('2d');ctx.imageSmoothingEnabled=false;
   const index=family*2+(variant===1?1:0),sx=index%6*256,sy=Math.floor(index/6)*(1024/6);
   ctx.fillStyle='#e5ddc6';ctx.fillRect(0,0,128,86);
   ctx.save();if(variant===2){ctx.translate(128,0);ctx.scale(-1,1)}
   ctx.drawImage(roomSheet,sx,sy,256,1024/6,0,0,128,86);ctx.restore();
   // Preserve ink hatching as crisp palette-limited pixels, with no antialiasing.
   const img=ctx.getImageData(0,0,128,86),p=img.data;
   const palette=[[22,23,20],[53,52,43],[91,86,69],[137,128,104],[186,175,146],[229,221,198]];
   for(let i=0;i<p.length;i+=4){const lum=p[i]*.299+p[i+1]*.587+p[i+2]*.114;const k=Math.min(5,Math.floor(lum/43));let color=palette[k];
    if(p[i]>p[i+1]*1.4&&p[i]>120)color=[178,104,66];
    p[i]=color[0];p[i+1]=color[1];p[i+2]=color[2];p[i+3]=255;
   }ctx.putImageData(img,0,0);
   // Different room functions also receive an individual small pixel furnishing.
   let hash=0;for(const ch of type)hash=(hash*31+ch.charCodeAt(0))>>>0;
   ctx.fillStyle='#b8aa88';ctx.fillRect(14,61,13,9);ctx.fillStyle='#35342b';
   for(let i=0;i<12;i++)if((hash>>i)&1)ctx.fillRect(15+(i%4)*3,62+Math.floor(i/4)*2,2,1);
   if(variant===2){ctx.fillStyle='#e5ddc6';ctx.fillRect(104,15,2,3);ctx.fillStyle='#35342b';ctx.fillRect(105,18,1,8)}
   return c.toDataURL('image/png').split(',')[1];
  },{family:families[type]??8,variant,type});
  await writeFile(`public/assets/rooms/${type}-${variant}.png`,Buffer.from(result,'base64'));
 }
 for(const [type,frame]of Object.entries(SPRITE_FRAMES)){
  if(type==='immortal'){await import('./immortal-art.mjs');continue}
  const result=await page.evaluate(({region})=>{
   const c=document.createElement('canvas');c.width=64;c.height=64;const ctx=c.getContext('2d');ctx.imageSmoothingEnabled=false;
   const [x,y,w,h]=region,scale=Math.min(60/w,60/h),dw=Math.round(w*scale),dh=Math.round(h*scale);
   ctx.drawImage(unitSheet,x*unitSheet.width/1792,y*unitSheet.height/896,w*unitSheet.width/1792,h*unitSheet.height/896,Math.round((64-dw)/2),Math.round((64-dh)/2),dw,dh);
   return c.toDataURL('image/png').split(',')[1];
  },{region:regions[frame]});
  await writeFile(`public/assets/sprites/${type}.png`,Buffer.from(result,'base64'));
 }
 for(const f of await readdir('public/assets/rooms'))if(f.endsWith('.svg'))await unlink('public/assets/rooms/'+f);
 console.log(`${Object.keys(ROOMS).length*3} raster room variants and ${Object.keys(SPRITE_FRAMES).length} distinct sprite files ready.`);
}finally{await browser.close()}

// Preserve the dedicated discovery and dragon-state artwork on a full rebuild.
await import('./unique-room-art.mjs');
await import('./dragon-art.mjs');
