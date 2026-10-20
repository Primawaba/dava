import {chromium} from '@playwright/test';
import {readFile,writeFile} from 'node:fs/promises';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
try{
 const page=await browser.newPage(),source=(await readFile('public/assets/immortal-source.png')).toString('base64');
 const sprite=await page.evaluate(async source=>{
  const image=new Image();image.src='data:image/png;base64,'+source;await image.decode();
  const canvas=document.createElement('canvas');canvas.width=64;canvas.height=64;const c=canvas.getContext('2d');c.imageSmoothingEnabled=false;
  c.drawImage(image,99,17,1344,990,2,10,60,44);const pixels=c.getImageData(0,0,64,64),p=pixels.data,palette=[[22,23,20],[53,52,43],[91,86,69],[137,128,104],[186,175,146],[229,221,198]];
  for(let i=0;i<p.length;i+=4){if(p[i+3]<180){p[i+3]=0;continue}const lum=p[i]*.299+p[i+1]*.587+p[i+2]*.114,color=palette[Math.min(5,Math.floor(lum/43))];p[i]=color[0];p[i+1]=color[1];p[i+2]=color[2];p[i+3]=255}
  c.putImageData(pixels,0,0);return canvas.toDataURL('image/png').split(',')[1];
 },source);await writeFile('public/assets/sprites/immortal.png',Buffer.from(sprite,'base64'));console.log('Immortal sprite exported: 64×64, transparent, six-color pixel palette.');
}finally{await browser.close()}
