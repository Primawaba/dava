import {readFile,readdir,mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';

// Self-contained build for opening directly with file://, without a server.
const mime={svg:'image/svg+xml',png:'image/png',ttf:'font/ttf'};
async function dataUrl(path){const ext=path.split('.').at(-1);return `data:${mime[ext]};base64,${(await readFile('public/assets/'+path)).toString('base64')}`}
const embeddedAssets={};
for(const name of (await readdir('public/assets/rooms')).filter(n=>n.endsWith('.svg')))embeddedAssets['rooms/'+name]=await dataUrl('rooms/'+name);
let css=await readFile('style.css','utf8');
for(const name of ['serif.ttf','fortress.png'])css=css.replaceAll(`./assets/${name}`,await dataUrl(name));
let bundle=`(()=>{'use strict';\nconst embeddedAssets=${JSON.stringify(embeddedAssets)};\n`;
for(const name of ['data','icons','engine','render','audio','app']){
 let source=await readFile(`src/${name}.js`,'utf8');
 source=source.replace(/^import[^\n]*\n/gm,'').replace(/^export /gm,'');
 if(name==='render'){
  const needle='i.src=`./assets/rooms/${type}-${v}.svg`';
  if(!source.includes(needle))throw Error('Room renderer changed; update standalone asset mapping.');
  source=source.replace(needle,'i.src=embeddedAssets[`rooms/${type}-${v}.svg`]');
 }
 if(name==='app'){
  const needle='src="./assets/rooms/${r.type}-${r.variant}.svg"';
  if(!source.includes(needle))throw Error('Room portrait changed; update standalone asset mapping.');
  source=source.replace(needle,'src="${embeddedAssets[`rooms/${r.type}-${r.variant}.svg`]}"');
  source=source.replace(/^if\('serviceWorker'in navigator\).*$/m,'// Standalone needs no service worker: all files are embedded.');
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
await writeFile('JOGAR-CONQUER.html',html);
const checksum=createHash('sha256').update(html).digest('hex');
await writeFile('releases/CONQUER-Jogar.sha256',`${checksum}  CONQUER-Jogar.html\n`);
console.log(`Standalone ready: releases/CONQUER-Jogar.html (${(Buffer.byteLength(html)/1024/1024).toFixed(2)} MiB). No server or installation required.`);
