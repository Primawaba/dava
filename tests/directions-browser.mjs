import {chromium,expect} from '@playwright/test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {mkdir,writeFile} from 'node:fs/promises';
const server=spawn(process.execPath,['scripts/serve.mjs','dist'],{env:{...process.env,PORT:'4178'},stdio:'pipe'});
await new Promise((resolve,reject)=>{server.stdout.once('data',resolve);server.once('error',reject)});
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
const errors=[];let checks=0;const pass=label=>{checks++;console.log('PASS',label)};
async function prepare(page){
 page.on('pageerror',e=>errors.push(e.message));await page.goto('http://127.0.0.1:4178/?test=1');
 await page.evaluate(()=>{localStorage.setItem('conquer-tutorial-seen','1');window.__CONQUER__.startGame({seed:47});window.__CONQUER__.renderer.resize()});
 await expect.poll(()=>page.evaluate(()=>Object.keys(window.__CONQUER__.renderer.images).length)).toBe(316);
}
async function arrow(page,from,to,touch=false){
 await page.evaluate(()=>{window.__CONQUER__.game.s.deck=[{suit:'♥',rank:2}]});
 await expect.poll(()=>page.evaluate(({from,to})=>window.__CONQUER__.renderer.directionMarkers.some(d=>d.from.x===from.x&&d.from.y===from.y&&d.x===to.x&&d.y===to.y),{from,to})).toBe(true);
 const point=await page.evaluate(({from,to})=>{const r=window.__CONQUER__.renderer,d=r.directionMarkers.find(d=>d.from.x===from.x&&d.from.y===from.y&&d.x===to.x&&d.y===to.y),b=r.canvas.getBoundingClientRect();return{x:b.left+d.screenX,y:b.top+d.screenY}},{from,to});
 if(touch)await page.touchscreen.tap(point.x,point.y);else await page.mouse.click(point.x,point.y);
}
const graph=page=>page.evaluate(()=>{const g=window.__CONQUER__.game;return{rooms:g.rooms.length,edges:Object.keys(g.s.passages).length,turn:g.s.turn,direct:g.linked(g.room(0,0),g.room(1,0)),path:g.path({x:0,y:0},{x:1,y:0})?.length}});
try{
 await mkdir('artifacts',{recursive:true});const page=await browser.newPage({viewport:{width:1440,height:1000}});await prepare(page);
 await expect.poll(()=>page.evaluate(()=>window.__CONQUER__.renderer.directionMarkers.length)).toBe(3);
 await arrow(page,{x:0,y:0},{x:0,y:1});await expect(page.locator('.room-title')).toHaveText('Caverna vazia');assert.equal((await graph(page)).edges,1);pass('clicking an arrow explores immediately from its own origin');
 await arrow(page,{x:0,y:1},{x:1,y:1});await arrow(page,{x:1,y:1},{x:1,y:0});assert.deepEqual(await graph(page),{rooms:4,edges:3,turn:3,direct:false,path:3});pass('three discoveries create three edges and leave the adjacent gate wall intact');
 await page.screenshot({path:'artifacts/directions-before-opening.png'});
 const unopened=await page.evaluate(()=>{const r=window.__CONQUER__.renderer,g=window.__CONQUER__.game;g.s.combat=true;g.s.paused=true;r.draw(0);const p=r.ctx.getImageData(Math.floor((r.width/2+(90-r.camera.x)*r.zoom)*r.dpr),Math.floor((r.height/2-r.camera.y*r.zoom)*r.dpr),1,1).data[0];g.s.combat=false;return p});assert(unopened>=200);pass('a missing edge draws no corridor behind the opening arrow');
 const before=await page.evaluate(()=>{const g=window.__CONQUER__.game;return{deck:JSON.stringify(g.s.deck),card:g.s.card,resources:g.s.resources,gold:g.s.gold}});
 // No scripted draw here: opening a known edge must leave the deck untouched.
 await expect.poll(()=>page.evaluate(()=>window.__CONQUER__.renderer.directionMarkers.some(d=>d.kind==='passage'))).toBe(true);
 const opening=await page.evaluate(()=>{const r=window.__CONQUER__.renderer,d=r.directionMarkers.find(d=>d.kind==='passage'),b=r.canvas.getBoundingClientRect();return{x:b.left+d.screenX,y:b.top+d.screenY}});await page.mouse.click(opening.x,opening.y);
 assert.deepEqual(await graph(page),{rooms:4,edges:4,turn:4,direct:true,path:1});assert.deepEqual(await page.evaluate(()=>{const g=window.__CONQUER__.game;return{deck:JSON.stringify(g.s.deck),card:g.s.card,resources:g.s.resources,gold:g.s.gold}}),before);pass('opening a known edge changes only the route and action turn, without card, reward or extra room');
 await page.screenshot({path:'artifacts/directions-after-opening.png'});
 const saved=await page.evaluate(()=>window.__CONQUER__.game.serialize());await page.evaluate(raw=>window.__CONQUER__.loadRaw(raw),saved);assert.equal((await graph(page)).edges,4);pass('opening is saved and restored as an explicit edge');
 // Accessible panel controls preserve the source when several rooms face one target.
 await page.evaluate(()=>{const {Game}=window.__CONQUER__,g=new Game({seed:9});g.s.deck=[{suit:'♥',rank:2}];g.explore(0,1,{x:0,y:0});g.s.deck=[{suit:'♥',rank:2}];g.explore(1,1,{x:0,y:1});window.__CONQUER__.setGame(g)});
 const east=page.locator('[data-action=direction][data-from="0,0"][data-to="1,0"]');await east.focus();await page.keyboard.press('Enter');assert.equal((await graph(page)).direct,true);assert.equal(await page.evaluate(()=>window.__CONQUER__.game.linked(window.__CONQUER__.game.room(1,0),window.__CONQUER__.game.room(1,1))),false);pass('keyboard panel action retains the chosen source for an ambiguous target');
 const mobile=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2});await prepare(mobile);
 await arrow(mobile,{x:0,y:0},{x:0,y:1},true);await expect(mobile.locator('.room-title')).toHaveText('Caverna vazia');assert.equal((await graph(mobile)).edges,1);
 await mobile.screenshot({path:'artifacts/directions-mobile.png'});assert.equal(await mobile.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);pass('mobile touch opens exactly one passage and keeps the layout usable');
 assert.deepEqual(errors,[]);pass('no browser exceptions');await writeFile('artifacts/directions-results.json',JSON.stringify({checks,errors},null,2));
}finally{await browser.close();server.kill()}
