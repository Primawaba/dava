import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {ROOMS} from '../src/data.js';
test('every natural and encounter room has dedicated compositions instead of a shared cavern family',async()=>{const manifest=JSON.parse(await readFile('scripts/unique-room-manifest.json','utf8')),types=manifest.flat().map(r=>r.type),required=Object.entries(ROOMS).filter(([type,d])=>d.r===undefined&&!['surface','gate','dragon','shaft'].includes(type)).map(([type])=>type);assert.deepEqual(types.slice().sort(),required.sort());const hashes=new Set();for(const type of types)for(let variant=0;variant<3;variant++){const image=await readFile(`public/assets/rooms/${type}-${variant}.png`),hash=createHash('sha256').update(image).digest('hex');assert(!hashes.has(hash),`${type}-${variant} repeats another illustration`);hashes.add(hash)}assert.equal(hashes.size,types.length*3)});
