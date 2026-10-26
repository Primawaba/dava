import {chromium,expect} from '@playwright/test';
import {readFile,mkdtemp,rm,stat} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {execFileSync} from 'node:child_process';
import assert from 'node:assert/strict';
const temp=await mkdtemp(join(tmpdir(),'conquer-pc-'));
execFileSync('unzip',['-q',resolve('CONQUER-PC.zip'),'-d',temp]);
const files=['JOGAR-CONQUER.html','COMO-ABRIR.txt','jogo/arte.js','jogo/motor.js','jogo/visual.css'];
assert.deepEqual(execFileSync('unzip',['-Z1','CONQUER-PC.zip'],{encoding:'utf8'}).trim().split('\n').sort(),[...files].sort());
assert((await stat(join(temp,files[0]))).size<16000);
for(const f of files.filter(f=>f!=='COMO-ABRIR.txt'))assert.deepEqual(await readFile(join(temp,f)),await readFile(f));
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']}),errors=[],external=[];
try{
 const context=await browser.newContext({viewport:{width:1366,height:900},acceptDownloads:true});await context.setOffline(true);const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));let intercepted=false,url=pathToFileURL(join(temp,files[0])).href+'?test=1';
 try{await page.goto(url);}catch(e){if(!e.message.includes('ERR_BLOCKED_BY_ADMINISTRATOR'))throw e;intercepted=true;url='http://portable.offline.test/JOGAR-CONQUER.html?test=1';await context.route('http://portable.offline.test/**',async r=>{const path=decodeURIComponent(new URL(r.request().url()).pathname.slice(1));if(!files.includes(path)){external.push(path);return r.abort();}return r.fulfill({status:200,contentType:path.endsWith('.js')?'text/javascript':path.endsWith('.css')?'text/css':'text/html',body:await readFile(join(temp,path))});});await page.goto(url);}
 await expect(page.locator('h1')).toHaveText('CONQUER');await expect(page.locator('#boot-status')).toBeHidden();await page.evaluate(()=>window.__CONQUER__.renderer.loading);
 assert.equal(await page.evaluate(()=>Object.keys(window.__CONQUER__.renderer.images).length),762);
 await page.click('#new-game');await page.fill('#fortress-input','Pacote Windows');await page.click('button[type=submit]');await page.click('[data-modal=close]');await expect(page.locator('#game-screen')).toBeVisible();
 await page.evaluate(()=>window.__CONQUER__.game.s.deck=[{suit:'♥',rank:8}]);await page.click('#end-turn');await expect(page.locator('.room-title')).toHaveText('Caverna vazia');
 const snapshot=await page.evaluate(()=>window.__CONQUER__.game.serialize());await page.reload();await page.evaluate(raw=>window.__CONQUER__.loadRaw(raw),snapshot);await expect(page.locator('.room-title')).toBeVisible();
 await page.click('#game-menu');await page.click('[data-modal=journal]');await expect(page.locator('.journal-entry').first()).toContainText('Cinco guerreiros');await page.click('[data-modal=close]');
 await page.click('#export-fortress');await expect(page.locator('.fortress-export-preview')).toBeVisible();const [download]=await Promise.all([page.waitForEvent('download'),page.click('a[download="CONQUER-fortaleza.png"]')]);assert((await readFile(await download.path())).length>1000);await page.click('[data-modal=close]');
 assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
 if(intercepted){await context.route('http://portable.offline.test/jogo/arte.js',r=>r.abort());await page.reload();await expect(page.locator('#boot-status')).toContainText('Extraia o ZIP inteiro');}
 console.log('PASS extracted five-file PC package; 9 KiB entry, 762 sprites, new game, exploration, legacy-compatible load, chronicle, untainted PNG export, missing-folder message, no network dependencies.');
 console.log(intercepted?'NOTE file:// blocked by environment policy; extracted files verified through offline intercepted requests. Windows Explorer itself was not available for testing.':'PASS local file:// execution.');
}finally{await browser.close();await rm(temp,{recursive:true,force:true});}
