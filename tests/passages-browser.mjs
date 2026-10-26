import {RENDER_ASSET_COUNT} from './render-assets.mjs';
import {installConnectedFixtures} from './browser-fixtures.mjs';
import {chromium,expect} from '@playwright/test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {mkdir,writeFile} from 'node:fs/promises';
const server=spawn(process.execPath,['scripts/serve.mjs','dist'],{env:{...process.env,PORT:'4177'},stdio:'pipe'});
await new Promise((resolve,reject)=>{server.stdout.once('data',resolve);server.once('error',reject)});
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];await installConnectedFixtures(page);page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:4177/?test=1');
 await expect.poll(()=>page.evaluate(()=>Object.keys(window.__CONQUER__.renderer.images).length)).toBe(RENDER_ASSET_COUNT);
 await page.evaluate(()=>{localStorage.setItem('conquer-tutorial-seen','1');window.__CONQUER__.startGame({seed:3});window.__CONQUER__.renderer.resize()});
 const results=await page.evaluate(()=>{
  const {Game,renderer:r}=window.__CONQUER__,failures=[];let samples=0;
  for(const zoom of [.5,1,1.5,2])for(let mask=0;mask<16;mask++){
   const g=new Game({seed:mask+1});g.s.rooms={};g.s.units=[];g.s.combat=true;g.s.paused=true;
   window.__addConnectedFixture(g,0,0,'barracks');const dirs=[[0,-1],[1,0],[0,1],[-1,0]];
   dirs.forEach(([x,y],bit)=>{if(mask&(1<<bit))window.__addConnectedFixture(g,x,y,'cave')});
   r.game=g;r.camera={x:0,y:0};r.zoom=zoom;r.selected={x:99,y:99};r.draw();
   const frame=r.ctx.getImageData(0,0,r.canvas.width,r.canvas.height);
   for(let bit=0;bit<4;bit++)if(mask&(1<<bit)){
    const [dx,dy]=dirs[bit],vertical=!!dy,start=vertical?(dy<0?50:44):66,end=vertical?(dy<0?100:94):114;
    for(let p=start;p<=end;p+=2){
     const x=r.width/2+dx*p*zoom,y=r.height/2+dy*p*zoom;
     const index=(Math.floor(y*r.dpr)*frame.width+Math.floor(x*r.dpr))*4,rgba=frame.data.subarray(index,index+4);samples++;
     if(rgba[0]>=220||rgba[3]!==255)failures.push({mask,zoom,bit,p,rgba:[...rgba]});
    }
   }
  }
  const g=new Game({seed:3});g.s.rooms={};g.s.units=[];g.s.combat=true;g.s.paused=true;
  for(let mask=0;mask<16;mask++){const cx=mask%4*4,cy=Math.floor(mask/4)*4;window.__addConnectedFixture(g,cx,cy,'barracks');[[0,-1],[1,0],[0,1],[-1,0]].forEach(([dx,dy],bit)=>{if(mask&(1<<bit))window.__addConnectedFixture(g,cx+dx,cy+dy,'cave')})}
  window.__CONQUER__.setGame(g);r.camera={x:1080,y:864};r.zoom=.25;r.draw();
  return{samples,failures};
 });
 const procedural=await page.evaluate(()=>{
  const r=window.__CONQUER__.renderer,Generator=r.passages.constructor,p=new Generator(16);
  const types=['cave','barracks','mine','water','forge','hive','forest','crypt','crystal','gas'];
  const room=(type,x=0,y=0)=>({type,x,y,variant:0,damaged:false,contaminant:null});
  let checked=0;const fingerprints=[];
  for(const vertical of [false,true])for(const ta of types)for(const tb of types){
   const a=room(ta),b=room(tb,vertical?0:1,vertical?1:0),e=p.get(a,b,vertical,r.images);
   const data=e.canvas.getContext('2d').getImageData(0,10,e.length,1).data;
   for(let x=0;x<e.length;x++){if(data[x*4+3]!==255||Math.abs(data[x*4]-229)+Math.abs(data[x*4+1]-221)+Math.abs(data[x*4+2]-198)<50)throw Error('Broken material transition '+ta+tb)}
   checked++;if(!vertical&&ta==='cave')fingerprints.push(e.canvas.toDataURL());
  }
  const a=room('cave'),b=room('mine',1),first=p.get(a,b,false,r.images),repeat=p.get(a,b,false,r.images);
  const cached=first===repeat,original=first.canvas.toDataURL();
  b.type='hive';const rebuilt=p.get(a,b,false,r.images).canvas.toDataURL()!==original;
  b.type='mine';b.contaminant='water';const flooded=p.get(a,b,false,r.images).canvas.toDataURL()!==original;
  b.contaminant=null;const restored=p.get(a,b,false,r.images).canvas.toDataURL()===original;
  const p2=new Generator(),deterministic=p2.get(a,b,false,r.images).canvas.toDataURL()===original;
  const frame=(time,reduced)=>{const canvas=document.createElement('canvas');canvas.width=180;canvas.height=60;const c=canvas.getContext('2d');c.translate(-40,25);p2.draw(c,room('cave'),room('water',1),false,r.images,time,reduced);return canvas.toDataURL()};
  const architectureFrame=(left,right,time)=>{const canvas=document.createElement('canvas');canvas.width=180;canvas.height=90;const c=canvas.getContext('2d');c.translate(-40,45);p2.draw(c,room(left),room(right,1),false,r.images,time,false);return canvas.toDataURL()};
  const cavernUnlit=architectureFrame('cave','cave',0)===architectureFrame('cave','cave',160),mixedUnlit=architectureFrame('barracks','cave',0)===architectureFrame('barracks','cave',160),builtTorch=architectureFrame('barracks','library',0)!==architectureFrame('barracks','library',160);
  return{cavernUnlit,mixedUnlit,builtTorch,checked,distinct:new Set(fingerprints).size,cached,rebuilt,flooded,restored,deterministic,bounded:p.cache.size<=16,animated:frame(0,false)!==frame(240,false),reduced:frame(0,true)===frame(240,true)};
 });
 assert.equal(procedural.checked,200);assert.equal(procedural.distinct,10);
 for(const [key,value]of Object.entries(procedural))if(typeof value==='boolean')assert(value,key);
 assert.deepEqual(results.failures.slice(0,12),[]);assert(results.samples>3000);assert.deepEqual(errors,[]);
 await mkdir('artifacts',{recursive:true});await page.screenshot({path:'artifacts/passages-16-masks.png'});
 await page.evaluate(()=>{
  const {Game,renderer:r}=window.__CONQUER__,g=new Game({seed:17});g.s.rooms={};g.s.units=[];g.s.combat=true;g.s.paused=true;
  [['cave','mine','forge'],['water','cave','forest'],['hive','crypt','crystal'],['gas','barracks','lava']].forEach((row,y)=>row.forEach((type,x)=>window.__addConnectedFixture(g,x-1,y,type)));
  window.__CONQUER__.setGame(g);r.camera={x:0,y:210};r.zoom=1.15;r.selected={x:99,y:99};r.draw(240);
 });
 await page.screenshot({path:'artifacts/procedural-materials-desktop.png'});
 await page.evaluate(()=>{
  const {Game,renderer:r}=window.__CONQUER__,g=new Game({seed:11});g.s.rooms={};g.s.passages={};g.s.units=[];g.s.combat=true;g.s.paused=true;
  [['cave','cave'],['barracks','cave'],['barracks','library']].forEach((pair,i)=>{const a=g.addRoom(0,i*2,pair[0]),b=g.addRoom(1,i*2,pair[1]);g.connectRooms(a,b)});
  window.__CONQUER__.setGame(g);r.camera={x:90,y:288};r.zoom=.86;r.selected={x:99,y:99};r.draw(0);
 });
 await page.screenshot({path:'artifacts/doorway-architecture-cases.png'});
 await page.setViewportSize({width:390,height:844});await page.evaluate(()=>{const r=window.__CONQUER__.renderer;r.resize();r.zoom=.6;r.draw(240)});
 await page.screenshot({path:'artifacts/procedural-materials-mobile.png'});
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assert.deepEqual(errors,[]);
 await writeFile('artifacts/passages-results.json' ,JSON.stringify({...results,procedural},null,2));
 console.log(`PASS: ${results.samples} opaque passage centerline samples, 16 masks × 4 zoom levels; 524 PNG assets; 200 material/orientation pairs, cache invalidation, deterministic textures and reduced motion; three architectural cases and torch behavior; no browser errors.`);
}finally{await browser.close();server.kill()}
