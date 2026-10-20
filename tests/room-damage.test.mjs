import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {Game} from '../src/engine.js';
import {DAMAGEABLE_ROOMS} from '../src/data.js';
function scene(types){const g=new Game();let last=g.room(0,0);for(let i=0;i<types.length;i++){const r=g.addRoom(i+1,0,types[i]);g.connectRooms(last,r);last=r}return g}
test('magma contaminates natural caverns without damaging them, but damages constructions',()=>{const g=scene(['cave','barracks','lava']);g.spreadHazards();assert.equal(g.room(2,0).damaged,true);assert.equal(g.room(1,0).fluid,'lava');assert.equal(g.room(1,0).damaged,false);assert(g.damageable(g.room(2,0)));assert(!g.damageable(g.room(1,0)))});
test('draining natural magma creates a clean undamaged cave',()=>{const g=scene(['lava']);g.s.gold=50;g.spreadHazards();assert(g.action('drain',1,0).ok);assert.equal(g.room(1,0).type,'cave');assert.equal(g.room(1,0).damaged,false);assert.deepEqual(g.roomHazards(g.room(1,0)),[])});
test('gas explosions damage built rooms while leaving natural cave structure intact',()=>{const g=scene(['cave','flammable','forge']);g.spreadHazards();assert(!g.room(1,0).damaged);assert(!g.room(2,0).damaged);assert(g.room(3,0).damaged)});
test('old saves discard invalid natural cave damage but retain construction damage',()=>{const g=scene(['cave','barracks']);g.room(1,0).damaged=true;g.room(2,0).damaged=true;const loaded=Game.restore(g.serialize());assert(!loaded.room(1,0).damaged);assert(loaded.room(2,0).damaged)});
test('every damageable room has three distinct damaged PNGs that differ from intact art',async()=>{assert.equal(DAMAGEABLE_ROOMS.length,42);for(const type of DAMAGEABLE_ROOMS){const variants=[];for(let v=0;v<3;v++){const damaged=await readFile(new URL(`../public/assets/damaged-rooms/${type}-${v}.png`,import.meta.url)),intact=await readFile(new URL(`../public/assets/rooms/${type}-${v}.png`,import.meta.url));assert.equal(damaged.subarray(1,4).toString(),'PNG');assert(!damaged.equals(intact),type);variants.push(damaged.toString('base64'))}assert.equal(new Set(variants).size,3,type)}});
