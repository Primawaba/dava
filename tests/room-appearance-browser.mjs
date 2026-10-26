import {SPRITE_FRAMES} from '../src/data.js';
import {chromium,expect} from '@playwright/test';
import {spawn} from 'node:child_process';
import {mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const server=spawn(process.execPath,['scripts/serve.mjs','dist'],{env:{...process.env,PORT:'4182'},stdio:'pipe'});await new Promise((resolve,reject)=>{server.stdout.once('data',resolve);server.once('error',reject)});
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});const errors=[];let checks=0;const pass=s=>{checks++;console.log('PASS',s)};
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}});page.on('pageerror',e=>errors.push(e.message));await page.goto('http://127.0.0.1:4182/?test=1');
 await page.evaluate(()=>{localStorage.setItem('conquer-tutorial-seen','1');window.__CONQUER__.startGame({seed:52})});await expect.poll(()=>page.evaluate(()=>Object.keys(window.__CONQUER__.renderer.images).length)).toBe(524+Object.keys(SPRITE_FRAMES).length*7);
 const materials=await page.evaluate(async()=>{
  const {ROOMS}=await import('./src/data.js'),{passagePalette}=await import('./src/passages.js'),r=window.__CONQUER__.renderer;
  let checked=0,foreground=0,preserved=0;const families=new Set();
  const mix=(a,b,t)=>a.map((v,i)=>Math.round(v+(b[i]-v)*t));
  for(const type of Object.keys(ROOMS))for(const prefix of ['','damaged-']){
   const raw=r.images[`${prefix}${type}-0`];if(!raw)continue;
   const palette=passagePalette({type});families.add(JSON.stringify(palette));
   const tinted=r.appearance.get(raw,type,[],0),c=document.createElement('canvas');c.width=raw.width;c.height=raw.height;const ctx=c.getContext('2d');ctx.drawImage(raw,0,0);const source=ctx.getImageData(0,0,c.width,c.height).data;ctx.clearRect(0,0,c.width,c.height);ctx.drawImage(tinted,0,0);const pixels=ctx.getImageData(0,0,c.width,c.height).data;
   for(let i=0;i<source.length;i+=4){
    const rgb=Array.from(source.slice(i,i+3)),paper=rgb.reduce((n,v,k)=>n+Math.abs(v-[229,221,198][k]),0)<36;
    let expected=rgb;
    if(source[i+3]>=32&&!paper){const lum=rgb[0]*.299+rgb[1]*.587+rgb[2]*.114;expected=lum<95?mix(palette.floor,palette.wall,Math.max(0,(lum-20)/75)):mix(palette.wall,palette.light,Math.min(1,(lum-95)/100));foreground++}else preserved++;
    if(expected.some((v,k)=>Math.abs(v-pixels[i+k])>1)||pixels[i+3]!==source[i+3])throw new Error(`Incorrect palette/background: ${prefix}${type}, pixel ${i/4}`);
   }
   if(type!=='crystal'&&r.appearance.get(raw,type,[],4000)!==tinted)throw new Error(`Unexpected pulse: ${type}`);
   checked++;
  }
  return{checked,foreground,preserved,families:families.size};
 });assert(materials.checked>=132);assert.equal(materials.families,14);assert(materials.foreground>10000&&materials.preserved>10000);pass('every room type and damaged variant uses its corridor palette, preserves background/alpha and only crystal pulses');
 const visuals=await page.evaluate(()=>{
  const r=window.__CONQUER__.renderer,raw=r.images['barracks-0'],effect=r.appearance;
  const frame=image=>{const canvas=document.createElement('canvas');canvas.width=image.width;canvas.height=image.height;const c=canvas.getContext('2d');c.drawImage(image,0,0);return c.getImageData(0,0,canvas.width,canvas.height).data};
  const base=frame(raw),hazards=['water','lava','crater','gas','miasma','blindgas','flammable'];let changed=0,paper=0,invalid=0;const hashes=[];
  for(const hazard of hazards){const image=effect.get(raw,'barracks',[hazard]),pixels=frame(image);hashes.push(image.toDataURL());for(let i=0;i<base.length;i+=4){const isPaper=base[i]===229&&base[i+1]===221&&base[i+2]===198;if(isPaper){paper++;if(pixels[i]!==base[i]||pixels[i+1]!==base[i+1]||pixels[i+2]!==base[i+2]||pixels[i+3]!==base[i+3])invalid++}else if(pixels[i]!==base[i]||pixels[i+1]!==base[i+1]||pixels[i+2]!==base[i+2])changed++}}
  const crystal=r.images['crystal-0'],normal=effect.get(crystal,'crystal',[],0,false),bright=effect.get(crystal,'crystal',[],4000,false),loop=effect.get(crystal,'crystal',[],8000,false),frozen=effect.get(crystal,'crystal',[],4000,true);let blue=0;const pixels=frame(normal);for(let i=0;i<pixels.length;i+=4)if(pixels[i+2]>pixels[i]+20)blue++;
  return{changed,paper,invalid,unique:new Set(hashes).size,cached:effect.get(raw,'barracks',['water'])===effect.get(raw,'barracks',['water']),blue,pulse:normal.toDataURL()!==bright.toDataURL(),loop:normal.toDataURL()===loop.toDataURL(),reduced:normal.toDataURL()===frozen.toDataURL()};
 });assert(visuals.changed>1000&&visuals.paper>1000);assert.equal(visuals.invalid,0);assert.equal(visuals.unique,6);assert(visuals.cached);pass('all hazard states tint actual foreground pixels while paper/background stays unchanged');
 assert(visuals.blue>100&&visuals.pulse&&visuals.loop&&visuals.reduced);pass('crystal foreground is blue, pulses slowly over eight seconds, and freezes under reduced motion');
 await page.evaluate(()=>{const {Game,renderer:r}=window.__CONQUER__,g=new Game({seed:52});g.s.rooms={};g.s.passages={};g.s.units=[];g.s.combat=true;g.s.paused=true;const rows=[['cave','barracks','barracks'],['cave','barracks','forge'],['crystal','crystal','crystal'],['cave','cave','cave']];rows.forEach((row,y)=>row.forEach((type,i)=>{const room=g.addRoom(i-1,y,type);room.variant=i%3;if(y===0&&i===2||y===1&&i===2)room.damaged=true;if(y===1&&i===0)room.fluid=room.contaminant='water';if(y===1&&i===1)room.gas=room.contaminant='gas';if(y===1&&i===2)room.fluid=room.contaminant='lava';if(y===3)room.gas=room.contaminant=['miasma','blindgas','flammable'][i]}));for(const room of g.rooms)for(const [dx,dy]of [[1,0],[0,1]])g.connectRooms(room,g.room(room.x+dx,room.y+dy));window.__CONQUER__.setGame(g);r.camera={x:0,y:215};r.zoom=1.05;r.selected={x:99,y:99};r.draw(0)});
 await mkdir('artifacts',{recursive:true});await page.screenshot({path:'artifacts/room-states-crystal-and-damage.png'});
 const repaired=await page.evaluate(()=>{const {game:g,renderer:r}=window.__CONQUER__,room=g.room(1,0);const before=r.rawRoomImage(room).src;g.s.combat=false;g.s.resources=100;const result=g.action('repair',1,0);return{ok:result.ok,before,after:r.rawRoomImage(room).src}});assert(repaired.ok);assert(repaired.before.includes('damaged-rooms'));assert(repaired.after.includes('/rooms/'));pass('damaged sprite is replaced by the intact sprite when repaired');
 await page.setViewportSize({width:390,height:844});await page.evaluate(()=>{const r=window.__CONQUER__.renderer;r.resize();r.zoom=.55;r.camera={x:0,y:215};r.draw(0)});await page.screenshot({path:'artifacts/room-states-mobile.png'});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);pass('room states remain usable in the mobile viewport');
 assert.deepEqual(errors,[]);pass('no browser exceptions');await writeFile('artifacts/room-appearance-results.json',JSON.stringify({checks,materials,visuals,errors},null,2));
}finally{await browser.close();server.kill()}
