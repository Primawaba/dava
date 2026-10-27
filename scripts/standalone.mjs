import {readFile,readdir,mkdir,writeFile,rm,copyFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {resolve} from 'node:path';

// Self-contained build for opening directly with file://, without a server.
const mime={svg:'image/svg+xml',png:'image/png',ttf:'font/ttf'};
async function dataUrl(path){const ext=path.split('.').at(-1);return `data:${mime[ext]};base64,${(await readFile('public/assets/'+path)).toString('base64')}`}
const embeddedAssets={};
for(const dir of ['layer-enemies','rooms','sprites','passages','damaged-rooms','events','caverns','modules','colony','whole','producers'])for(const name of (await readdir('public/assets/'+dir)).filter(n=>n.endsWith('.png')))embeddedAssets[dir+'/'+name]=await dataUrl(dir+'/'+name);
let css=await readFile('style.css','utf8');
for(const name of ['serif.ttf','fortress.png'])css=css.replaceAll(`./assets/${name}`,await dataUrl(name));
let bundle=`(()=>{'use strict';\nconst embeddedAssets=${JSON.stringify(embeddedAssets)};\n`;
for(const name of ['data','narrative','layer-data','research','captivity','icons','tactics','formations','rise','colony','rule-catalogue','advanced-rules','encounters','worlds','wyrd','monsters','challenges','artifacts','chronicle','interactions','incursions','occupation','engine','passages','material-shader','room-appearance','room-framing','room-modules','cavern-modules','battle-transitions','colony-view','whole-rooms','terrain-autotile','render','audio','producers','resource-flights','event-art','event-cards','hover','app']){
 let source=await readFile(`src/${name}.js`,'utf8');
 source=source.replace(/^import[^\n]*\n/gm,'').replace(/^export /gm,'');
 if(name==='render'){
  if(!source.includes('i.src=src'))throw Error('Asset loader changed; update standalone mapping.');
  source=source.replace('i.src=src',"i.src=embeddedAssets[src.replace('./assets/','')]");
 }
 if(name==='app'){
  for(const needle of ['src="./assets/rooms/${r.type}-${r.variant}.png"','src="./assets/sprites/${t}.png"']){
   if(!source.includes(needle))throw Error('Asset portrait changed; update standalone mapping.');
   const mapped=needle.includes('/rooms/')?'src="${embeddedAssets[`rooms/${r.type}-${r.variant}.png`]}"':'src="${embeddedAssets[`sprites/${t}.png`]}"';
   source=source.replaceAll(needle,mapped);
  }
  source=source.replace(/^if\('serviceWorker'in navigator\).*$/m,'// All assets are embedded: no service worker required.');
 }
 bundle+=`\n// ${name}.js\n${source}\n`;
}
bundle+='})();';
let html=await readFile('index.html','utf8');
html=html.replace('<link rel="manifest" href="./manifest.webmanifest">','')
 .replace('href="./assets/icon.svg"',`href="${await dataUrl('icon.svg')}"`)
 .replace('<link rel="stylesheet" href="./style.css">',`<style>${css}</style>`)
 .replace('<script type="module" src="./src/app.js"></script>',()=>`<script>${bundle.replace(/<\/script/gi,'<\\/script')}</script>`);
if(/(?:src|href)=["']\.\//.test(html)||/url\(['"]?\.\/assets\//.test(html))throw Error('Unembedded external asset remains.');
await mkdir('releases',{recursive:true});
await writeFile('releases/CONQUER-Jogar.html',html);
// The player-facing entry is small; keep the large single-file edition optional.
const portable='releases/portable';
await rm(portable,{recursive:true,force:true});await mkdir(portable+'/jogo',{recursive:true});
const assetDeclaration=`const embeddedAssets=${JSON.stringify(embeddedAssets)};`;
const motor=bundle.replace(assetDeclaration,'const embeddedAssets=window.CONQUER_ART;');
await writeFile(portable+'/jogo/arte.js',`window.CONQUER_ART=${JSON.stringify(embeddedAssets)};`);
await writeFile(portable+'/jogo/motor.js',motor+`\nif(window.conquerBoot)window.conquerBoot(true);`);
await writeFile(portable+'/jogo/visual.css',css);
let entry=await readFile('index.html','utf8');
entry=entry.replace('<link rel="manifest" href="./manifest.webmanifest">','')
 .replace('href="./assets/icon.svg"',`href="${await dataUrl('icon.svg')}"`)
 .replace('href="./style.css"','href="./jogo/visual.css"')
 .replace('<script type="module" src="./src/app.js"></script>',`<script defer src="./jogo/arte.js" onerror="conquerBoot(false)"></script><script defer src="./jogo/motor.js" onerror="conquerBoot(false)"></script>`)
 .replace('<body>',`<body><div id="boot-status" role="status" style="position:fixed;top:0;left:0;right:0;z-index:99999;padding:12px;background:#17201c;color:#e7e1ce;font:14px Arial;text-align:center">Carregando o jogo…</div><script>window.conquerBoot=function(ok){var e=document.getElementById('boot-status');if(ok)e.hidden=true;else{e.hidden=false;e.textContent='Não foi possível abrir o jogo. Extraia o ZIP inteiro e mantenha a pasta jogo junto deste HTML. Depois abra o HTML no Chrome ou Edge.';}};</script>`);
const instructions='CONQUER — COMO ABRIR\r\n\r\n1. Clique com o botão direito no ZIP e escolha Extrair tudo.\r\n2. Abra a pasta extraída.\r\n3. Abra JOGAR-CONQUER.html no Chrome ou Edge.\r\n\r\nMantenha a pasta jogo junto do HTML. Não abra o HTML dentro do ZIP.\r\nNão é necessário instalar programas nem iniciar servidor.\r\nPara usar uma partida exportada, escolha Carregar e importe o JSON.\r\n';
await writeFile(portable+'/JOGAR-CONQUER.html',entry);
await writeFile(portable+'/COMO-ABRIR.txt',instructions);
await writeFile('JOGAR-CONQUER.html',entry);
await mkdir('jogo',{recursive:true});
for(const file of ['arte.js','motor.js','visual.css'])await copyFile(portable+'/jogo/'+file,'jogo/'+file);
await rm('CONQUER-PC.zip',{force:true});
execFileSync('zip',['-q','-9',resolve('CONQUER-PC.zip'),'JOGAR-CONQUER.html','COMO-ABRIR.txt','jogo/arte.js','jogo/motor.js','jogo/visual.css'],{cwd:portable});
console.log(`PC package ready: CONQUER-PC.zip; entry HTML ${(Buffer.byteLength(entry)/1024).toFixed(1)} KiB.`);
const checksum=createHash('sha256').update(html).digest('hex');
await writeFile('releases/CONQUER-Jogar.sha256',`${checksum}  CONQUER-Jogar.html\n`);
console.log(`Standalone ready: releases/CONQUER-Jogar.html (${(Buffer.byteLength(html)/1024/1024).toFixed(2)} MiB). No server or installation required.`);
