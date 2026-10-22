import {chromium} from '@playwright/test';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {DAMAGEABLE_ROOMS} from '../src/data.js';
import {ROOM_ART_FAMILIES} from './room-families.mjs';
await mkdir('public/assets/damaged-rooms',{recursive:true});
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
try{
 const page=await browser.newPage(),source=(await readFile('public/assets/damaged-room-atlas.png')).toString('base64');
 const files=await page.evaluate(async({source,types,families})=>{
  const sheet=new Image();sheet.src='data:image/png;base64,'+source;await sheet.decode();const out={};
  const palette=[[22,23,20],[53,52,43],[91,86,69],[137,128,104],[186,175,146],[229,221,198]];
  for(const type of types)for(let variant=0;variant<3;variant++){
   const canvas=document.createElement('canvas');canvas.width=128;canvas.height=86;const c=canvas.getContext('2d');c.imageSmoothingEnabled=false;
   const index=(families[type]??8)*2+(variant===1?1:0),cw=sheet.width/6,ch=sheet.height/6;
   c.fillStyle='#e5ddc6';c.fillRect(0,0,128,86);c.save();if(variant===2){c.translate(128,0);c.scale(-1,1)}c.drawImage(sheet,index%6*cw,Math.floor(index/6)*ch,cw,ch,0,0,128,86);c.restore();
   const image=c.getImageData(0,0,128,86),p=image.data;for(let i=0;i<p.length;i+=4){const lum=p[i]*.299+p[i+1]*.587+p[i+2]*.114,color=palette[Math.min(5,Math.floor(lum/43))];p[i]=color[0];p[i+1]=color[1];p[i+2]=color[2];p[i+3]=255}c.putImageData(image,0,0);
   let seed=variant;for(const ch of type)seed=(Math.imul(seed,31)+ch.charCodeAt(0))>>>0;
   // Individual debris pieces in the illustration, never an identifier plaque.
   for(let j=0;j<12;j++){const x=38+(seed+j*17)%52,y=61+(seed+j*3)%9,i=(y*128+x)*4;if(p[i]<200){c.fillStyle=j%2?'#35342b':'#898068';c.fillRect(x,y,2+(seed+j)%3,1+(j%2))}}
   out[`${type}-${variant}`]=canvas.toDataURL('image/png').split(',')[1];
  }return out;
 },{source,types:DAMAGEABLE_ROOMS,families:ROOM_ART_FAMILIES});
 for(const [name,data]of Object.entries(files))await writeFile(`public/assets/damaged-rooms/${name}.png`,Buffer.from(data,'base64'));
 console.log(`${Object.keys(files).length} damaged PNG sprites: ${DAMAGEABLE_ROOMS.length} constructed room types × 3 variants.`);
}finally{await browser.close()}

// Dedicated invention rooms retain their own silhouettes in the damaged set.
await import('./invention-art.mjs');
