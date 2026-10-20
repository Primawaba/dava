import {chromium,expect} from '@playwright/test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {mkdir,writeFile} from 'node:fs/promises';
const server=spawn(process.execPath,['scripts/serve.mjs','dist'],{env:{...process.env,PORT:'4177'},stdio:'pipe'});
await new Promise((resolve,reject)=>{server.stdout.once('data',resolve);server.once('error',reject)});
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:4177/?test=1');
 await expect.poll(()=>page.evaluate(()=>Object.keys(window.__CONQUER__.renderer.images).length)).toBe(315);
 await page.evaluate(()=>{localStorage.setItem('conquer-tutorial-seen','1');window.__CONQUER__.startGame({seed:3});window.__CONQUER__.renderer.resize()});
 const results=await page.evaluate(()=>{
  const {Game,renderer:r}=window.__CONQUER__,failures=[];let samples=0;
  for(const zoom of [.5,1,1.5,2])for(let mask=0;mask<16;mask++){
   const g=new Game({seed:mask+1});g.s.rooms={};g.s.units=[];g.s.combat=true;g.s.paused=true;
   g.addRoom(0,0,'barracks');const dirs=[[0,-1],[1,0],[0,1],[-1,0]];
   dirs.forEach(([x,y],bit)=>{if(mask&(1<<bit))g.addRoom(x,y,'cave')});
   r.game=g;r.camera={x:0,y:0};r.zoom=zoom;r.selected={x:99,y:99};r.draw();
   const frame=r.ctx.getImageData(0,0,r.canvas.width,r.canvas.height);
   for(let bit=0;bit<4;bit++)if(mask&(1<<bit)){
    const [dx,dy]=dirs[bit],vertical=!!dy,start=vertical?26:42,end=vertical?118:138;
    for(let p=start;p<=end;p+=2){
     const x=r.width/2+dx*p*zoom,y=r.height/2+dy*p*zoom;
     const index=(Math.floor(y*r.dpr)*frame.width+Math.floor(x*r.dpr))*4,rgba=frame.data.subarray(index,index+4);samples++;
     if(rgba[0]>=220||rgba[3]!==255)failures.push({mask,zoom,bit,p,rgba:[...rgba]});
    }
   }
  }
  const g=new Game({seed:3});g.s.rooms={};g.s.units=[];g.s.combat=true;g.s.paused=true;
  for(let mask=0;mask<16;mask++){const cx=mask%4*4,cy=Math.floor(mask/4)*4;g.addRoom(cx,cy,'barracks');[[0,-1],[1,0],[0,1],[-1,0]].forEach(([dx,dy],bit)=>{if(mask&(1<<bit))g.addRoom(cx+dx,cy+dy,'cave')})}
  window.__CONQUER__.setGame(g);r.camera={x:1080,y:864};r.zoom=.25;r.draw();
  return{samples,failures};
 });
 assert.deepEqual(results.failures.slice(0,12),[]);assert(results.samples>6000);assert.deepEqual(errors,[]);
 await mkdir('artifacts',{recursive:true});await page.screenshot({path:'artifacts/passages-16-masks.png'});
 await writeFile('artifacts/passages-results.json',JSON.stringify(results,null,2));
 console.log(`PASS: ${results.samples} opaque passage centerline samples, 16 masks × 4 zoom levels; 315 PNG assets; no browser errors.`);
}finally{await browser.close();server.kill()}
