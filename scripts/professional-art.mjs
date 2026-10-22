import {chromium} from '@playwright/test';
import {readFile,writeFile} from 'node:fs/promises';
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
try{const page=await browser.newPage();const files=await page.evaluate(async source=>{
 const image=new Image();image.src='data:image/png;base64,'+source;await image.decode();const out={};
 for(let n=0;n<6;n++){
  const c=document.createElement('canvas');c.width=c.height=64;const ctx=c.getContext('2d');ctx.imageSmoothingEnabled=false;
  // Uniformly downsample a cell with genuine alpha. No color-keying of highlights.
  ctx.drawImage(image,n%3*image.width/3,Math.floor(n/3)*image.height/2,image.width/3,image.height/2,0,0,64,64);
  const frame=ctx.getImageData(0,0,64,64),p=frame.data;for(let i=0;i<p.length;i+=4){if(p[i+3]<200)p[i+3]=0;else {p[i+3]=255;const v=Math.floor((p[i]*.299+p[i+1]*.587+p[i+2]*.114)/24)*24;p[i]=Math.min(210,v);p[i+1]=Math.min(195,Math.round(v*.92));p[i+2]=Math.min(160,Math.round(v*.72));}}
  ctx.putImageData(frame,0,0);out[(n<3?'miner':'lumberjack')+'-'+n%3]=c.toDataURL().split(',')[1];
 }return out;
},(await readFile('public/assets/professionals-source.png')).toString('base64'));for(const[name,data]of Object.entries(files))await writeFile('public/assets/colony/'+name+'.png',Buffer.from(data,'base64'));console.log('Exported 6 sepia professionals with binary alpha.');}finally{await browser.close();}
