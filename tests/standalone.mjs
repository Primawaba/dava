import {chromium,expect} from '@playwright/test';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';

const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
let url=pathToFileURL(resolve('releases/CONQUER-Jogar.html')).href+'?test=1';
let fileProtocolVerified=true;const html=await readFile('releases/CONQUER-Jogar.html','utf8');
const virtualUrl='http://127.0.0.1:4176/CONQUER-Jogar.html?test=1';
const errors=[],requests=[];let checks=0;
const pass=text=>{checks++;console.log('PASS',text)};
await mkdir('artifacts',{recursive:true});
try{
 const context=await browser.newContext({viewport:{width:1366,height:900},acceptDownloads:true});
 await context.setOffline(true);const page=await context.newPage();
 page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(/^https?:/.test(r.url())&&r.url()!==virtualUrl)requests.push(r.url())});
 try{await page.goto(url)}catch(e){if(!e.message.includes('ERR_BLOCKED_BY_ADMINISTRATOR'))throw e;fileProtocolVerified=false;url=virtualUrl;await context.route(url,route=>route.fulfill({status:200,contentType:'text/html; charset=utf-8',body:html}));await page.goto(url);console.log('NOTE environment policy blocks file://; validating identical standalone HTML via intercepted loopback document, without a server.')}await expect(page.locator('h1')).toHaveText('CONQUER');await page.evaluate(()=>document.fonts.ready);
 await expect.poll(()=>page.evaluate(()=>Object.keys(window.__CONQUER__.renderer.images).length)).toBe(524);
 assert((await page.locator('.title-art').evaluate(el=>getComputedStyle(el).backgroundImage)).includes('data:image/png;base64,'));
 assert.equal(await page.evaluate(()=>Object.keys(window.__CONQUER__.renderer.wholeImages).length),38);
 await page.screenshot({path:'artifacts/standalone-menu.png'});pass('self-contained HTML runs offline with 294 room images, 144 damaged variants, 34 unit sprites, 43 colony sprites, 38 whole-room paintings and 9 passage modules embedded');
 await page.click('#new-game');await page.fill('#fortress-input','Teste sem instalação');await page.fill('#seed-input','standalone');await page.click('button[type=submit]');await page.click('[data-modal=close]');
 await page.evaluate(()=>window.__CONQUER__.game.s.deck=[{suit:'♥',rank:8}]);await page.click('#end-turn');await expect(page.locator('.room-title')).toHaveText('Caverna vazia');
 await page.click('[data-tab=build]');await page.click('[data-action=build][data-arg=barracks]');await expect(page.locator('.room-title')).toHaveText('Quartel');
 await page.click('[data-tab=army]');await page.click('[data-action=recruit][data-arg=soldier]');await expect(page.locator('#troops')).toHaveText('6');pass('new campaign, explore, build and recruit from the standalone file');
 await page.click('#quick-save');await page.click('[data-modal=slot-save][data-arg="1"]');await page.click('[data-modal=close]');await page.reload();await page.click('#continue-game');await expect(page.locator('#troops')).toHaveText('6');pass('saving persists after reloading the standalone document');
 await page.click('#quick-save');const downloaded=page.waitForEvent('download');await page.click('[data-modal=export]');await(await downloaded).saveAs('artifacts/standalone-save.json');await page.click('[data-modal=close]');await page.locator('#import-file').setInputFiles('artifacts/standalone-save.json');await expect(page.locator('#toast')).toContainText('carregada');pass('save export and import without a server');
 await page.evaluate(()=>{const g=window.__CONQUER__.game;g.s.units=[];for(let i=0;i<6;i++)g.addUnit('archer',0,0,true);g.spawnEnemies(g.room(0,1),8);g.beginCombat()});
 await expect.poll(()=>page.evaluate(()=>window.__CONQUER__.game.s.combat),{timeout:12000}).toBe(false);assert.equal(await page.evaluate(()=>window.__CONQUER__.game.s.status),'playing');pass('real-time AI combat resolves in the standalone file');
 await page.screenshot({path:'artifacts/standalone-game.png'});
 const mobile=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});await mobile.setOffline(true);if(!fileProtocolVerified)await mobile.route(url,route=>route.fulfill({status:200,contentType:'text/html; charset=utf-8',body:html}));const mp=await mobile.newPage();mp.on('pageerror',e=>errors.push(e.message));await mp.goto(url);await mp.tap('#new-game');await mp.fill('#fortress-input','Fortaleza portátil');await mp.tap('button[type=submit]');await mp.tap('[data-modal=close]');await expect(mp.locator('#game-screen')).toBeVisible();assert.equal(await mp.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);pass('390px touch layout opens and starts offline');
 await page.evaluate(()=>{window.__CONQUER__.game.effect('Euforia','A fortaleza celebra.','good')});await expect(page.locator('.event-card-art')).toBeVisible();await expect.poll(()=>page.locator('.event-card-art').evaluate(i=>i.complete&&i.naturalWidth===192&&i.src.startsWith('data:image/png;base64,'))).toBe(true);await page.click('[data-event-continue]');pass('new event artwork is embedded and displays offline without asset requests');
 await page.click('#export-fortress');await expect(page.locator('.fortress-export-preview')).toBeVisible();const imageDownload=page.waitForEvent('download');await page.click('a[download="CONQUER-fortaleza.png"]');await(await imageDownload).saveAs('artifacts/standalone-fortress.png');await page.click('[data-modal=close]');pass('standalone exports a complete PNG without canvas security errors');
await page.evaluate(()=>{const {Game}=window.__CONQUER__,g=new Game({seed:91});const r=g.addRoom(0,1,'crystal');g.connectRooms(g.target,r);g.s.gold=0;g.s.deck=[{suit:'♥',rank:7}];window.__CONQUER__.setGame(g);g.income();});await expect(page.locator('[data-producer="0,1"] img')).toHaveAttribute('src',/^data:image\/png;base64,/);assert(await page.evaluate(()=>document.querySelector('[data-producer="0,1"] img').complete));pass('dedicated producer icons, worker variants and whole paintings are available offline');
  assert.deepEqual(errors,[]);assert.deepEqual(requests,[]);pass('no JavaScript exceptions and no HTTP/HTTPS requests');
 await writeFile('artifacts/standalone-results.json',JSON.stringify({passed:true,checks,errors,networkRequests:requests,protocol:new URL(url).protocol,fileProtocolVerified,validationMode:fileProtocolVerified?'local-file':'intercepted-loopback-document',offline:true},null,2));
}finally{await browser.close()}
