import {chromium} from '@playwright/test';
import {mkdir,readFile,writeFile} from 'node:fs/promises';

// Fixed pixel profiles keep the walkable band identical at every tile boundary.
// Source texture adds ink grain; geometry and edge continuity are deterministic.
await mkdir('public/assets/passages',{recursive:true});
const source=(await readFile('public/assets/corridor-atlas.png')).toString('base64');
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
try{
 const page=await browser.newPage();
 const files=await page.evaluate(async({source})=>{
  const sheet=new Image();sheet.src='data:image/png;base64,'+source;await sheet.decode();
  const sample=document.createElement('canvas');sample.width=sheet.width;sample.height=sheet.height;const sc=sample.getContext('2d');sc.drawImage(sheet,0,0);const pixels=sc.getImageData(0,0,sheet.width,sheet.height).data;
  const ink=['#161714','#35342b','#5b5645','#898068','#baaf92','#e5ddc6'];
  const grain=(x,y,v)=>{const sx=(x*17+v*53)%sheet.width,sy=(y*23+v*37)%sheet.height,i=(sy*sheet.width+sx)*4;return (pixels[i]+pixels[i+1]+pixels[i+2])/3};
  const out={};
  function tile(name,w,h,paint){const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;const c=canvas.getContext('2d');c.imageSmoothingEnabled=false;paint(c);out[name]=canvas.toDataURL('image/png').split(',')[1]}
  function pixel(c,x,y,color){c.fillStyle=color;c.fillRect(x,y,1,1)}
  function horizontal(c,w,v,door=false){
   for(let x=0;x<w;x++)for(let y=0;y<16;y++){
    const edge=x<2||x>=w-2;const hash=(x*13+y*7+v*19)%11;
    if(y>=5&&y<=10){pixel(c,x,y,ink[y===10?1:0]);continue}
    if(y>=3&&y<=12){pixel(c,x,y,ink[y<5?2:3]);continue}
    if(y===2||y===13){pixel(c,x,y,ink[hash<3?4:2]);continue}
    if(!edge&&(y===1||y===14)&&hash<7)pixel(c,x,y,ink[grain(x,y,v)>150?4:1]);
    if(!edge&&(y===0||y===15)&&hash<2)pixel(c,x,y,ink[2]);
   }
   // Scattered pixel cracks and rock highlights, never across the open center.
   for(let x=1;x<w;x+=4){pixel(c,x,3,ink[grain(x,3,v)>128?4:1]);pixel(c,x+1,12,ink[2])}
   if(door){for(let x=0;x<3;x++){pixel(c,x,3+x,ink[4]);pixel(c,x,12-x,ink[2])}}
  }
  function vertical(c,h,v,door=false){
   for(let y=0;y<h;y++)for(let x=0;x<16;x++){
    const edge=y<2||y>=h-2,hash=(x*7+y*13+v*17)%11;
    if(x>=5&&x<=10){pixel(c,x,y,ink[0]);continue}
    if(x>=3&&x<=12){pixel(c,x,y,ink[x<5?2:3]);continue}
    if(x===2||x===13){pixel(c,x,y,ink[hash<3?4:2]);continue}
    if(!edge&&(x===1||x===14)&&hash<7)pixel(c,x,y,ink[grain(x,y,v)>150?4:1]);
    if(!edge&&(x===0||x===15)&&hash<2)pixel(c,x,y,ink[2]);
   }
   c.fillStyle=ink[3];c.fillRect(5,0,1,h);c.fillRect(10,0,1,h);
   for(let y=2;y<h;y+=4){c.fillStyle=ink[4];c.fillRect(6,y,4,1);c.fillStyle=ink[2];c.fillRect(6,y+1,4,1)}
   if(door){for(let y=0;y<3;y++){pixel(c,3+y,y,ink[4]);pixel(c,12-y,y,ink[2])}}
  }
  for(const v of [0,1]){tile('h-'+v,16,16,c=>horizontal(c,16,v));tile('v-'+v,16,16,c=>vertical(c,16,v))}
  tile('door-e',24,16,c=>horizontal(c,24,2,true));
  tile('door-w',24,16,c=>{c.translate(24,0);c.scale(-1,1);horizontal(c,24,2,true)});
  tile('door-s',16,24,c=>vertical(c,24,2,true));
  tile('door-n',16,24,c=>{c.translate(0,24);c.scale(1,-1);vertical(c,24,2,true)});
  tile('grate',16,16,c=>{c.fillStyle=ink[0];c.fillRect(3,3,10,10);for(let x=4;x<13;x+=3){c.fillStyle=ink[4];c.fillRect(x,3,1,10);c.fillStyle=ink[2];c.fillRect(x+1,3,1,10)}c.fillStyle=ink[3];c.fillRect(3,4,10,1);c.fillRect(3,11,10,1)});
  return out;
 },{source});
 for(const[name,data]of Object.entries(files))await writeFile(`public/assets/passages/${name}.png`,Buffer.from(data,'base64'));
 console.log(`${Object.keys(files).length} pixel passage modules generated.`);
}finally{await browser.close()}
