import {mkdir,cp,rm,readdir,writeFile,readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
await rm('dist',{recursive:true,force:true});await mkdir('dist',{recursive:true});
for(const p of ['index.html','style.css','src'])await cp(p,`dist/${p}`,{recursive:true});
await cp('public','dist',{recursive:true});
// Generation sheets are source material; the runtime uses the sliced PNGs.
for(const atlas of ['gem-break-source.png','cavern-seams-atlas.png','event-atlas.png','event-artifacts-atlas.png','room-atlas.png','unit-atlas.png','corridor-atlas.png','immortal-source.png','damaged-room-atlas.png','dragon-room-atlas.png','unique-room-atlas-1.png','unique-room-atlas-2.png','unique-room-atlas-3.png','unique-room-atlas-4.png'])await rm('dist/assets/'+atlas,{force:true});
async function walk(p='dist'){let out=[];for(const d of await readdir(p,{withFileTypes:true})){const q=`${p}/${d.name}`;out.push(...(d.isDirectory()?await walk(q):[q.slice(5)]));}return out;}
const files=(await walk()).filter(f=>f!=='sw.js');
const digest=createHash('sha256');for(const f of files.sort())digest.update(await readFile('dist/'+f));
await writeFile('dist/sw.js',`const CACHE='conquer-${digest.digest('hex').slice(0,12)}';const FILES=${JSON.stringify(files.map(f=>'./'+f))};self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('conquer-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||new URL(e.request.url).origin!==self.location.origin)return;e.respondWith(caches.open(CACHE).then(async c=>{if(e.request.mode==='navigate'){const page=await c.match(new URL('./index.html',self.registration.scope).href);if(page)return page;}return (await c.match(e.request,{ignoreSearch:true}))||fetch(e.request)}))});`);
console.log(`Built ${files.length} offline files in dist/`);
