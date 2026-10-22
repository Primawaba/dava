import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {Game} from '../src/engine.js';
import {Renderer} from '../src/render.js';
test('awakening preserves the palace room, removes treasure access and spawns one real dragon',()=>{const g=new Game({seed:52}),room=g.addRoom(1,0,'dragon');g.connectRooms(g.room(0,0),room);g.roll=()=>1;assert(g.action('steal',1,0).ok);assert(room.dragonAwake);assert.equal(room.type,'dragon');assert.equal(g.enemies.filter(u=>u.type==='dragon').length,1);assert(!g.action('steal',1,0).ok);const loaded=Game.restore(g.serialize());assert(loaded.room(1,0).dragonAwake)});
test('sleeping and awake palace variants select the corresponding sprite',()=>{const r=Object.create(Renderer.prototype);r.images={'dragon-0':{},'awake-dragon-0':{}};assert.equal(r.rawRoomImage({type:'dragon',variant:0}),r.images['dragon-0']);assert.equal(r.rawRoomImage({type:'dragon',variant:0,dragonAwake:true}),r.images['awake-dragon-0'])});
test('three matching palace states have distinct raster sprites',async()=>{for(let v=0;v<3;v++){const asleep=await readFile(`public/assets/rooms/dragon-${v}.png`),awake=await readFile(`public/assets/rooms/awake-dragon-${v}.png`);assert(!asleep.equals(awake));assert.equal(awake.subarray(1,4).toString(),'PNG')}});
test('shaft rooms are rendered at the original dimensions without stretching any source region',()=>{const r=Object.create(Renderer.prototype),calls=[];r.ctx={drawImage:(...args)=>calls.push(args)};const image={width:128,height:86};r.shaftTile({x:2,y:3},image);assert.deepEqual(calls,[[image,280,370,160,113.33]])});
