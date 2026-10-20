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
 await expect.poll(()=>page.evaluate(()=>Object.keys(window.__CONQUER__.renderer.images).length)).toBe(442);
 assert((await page.locator('.title-art').evaluate(el=>getComputedStyle(el).backgroundImage)).includes('data:image/png;base64,'));
 await page.screenshot({path:'artifacts/standalone-menu.png'});pass('self-contained HTML runs offline with 273 room images, 126 damaged variants, 34 sprites and 9 passage modules embedded');
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
 assert.deepEqual(errors,[]);assert.deepEqual(requests,[]);pass('no JavaScript exceptions and no HTTP/HTTPS requests');
 await writeFile('artifacts/standalone-results.json',JSON.stringify({passed:true,checks,errors,networkRequests:requests,protocol:new URL(url).protocol,fileProtocolVerified,validationMode:fileProtocolVerified?'local-file':'intercepted-loopback-document',offline:true},null,2));
}finally{await browser.close()}
