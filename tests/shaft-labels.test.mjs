import test from 'node:test';
import assert from 'node:assert/strict';
import {Renderer} from '../src/render.js';
import {Game} from '../src/engine.js';
function setup(){const r=Object.create(Renderer.prototype);r.game=new Game({seed:52});for(let y=1;y<=4;y++)r.game.addRoom(1,y,y===2?'elevator':'shaft');return r}
test('a connected vertical elevator sequence shows exactly one label on its lowest tile',()=>{const r=setup(),g=r.game;for(let y=1;y<4;y++)g.connectRooms(g.room(1,y),g.room(1,y+1));assert.deepEqual([1,2,3,4].map(y=>r.roomLabel(g.room(1,y))),['','','','Elevador'])});
test('unopened walls split labels while individual shafts and ordinary rooms keep their names',()=>{const r=setup(),g=r.game;g.connectRooms(g.room(1,1),g.room(1,2));g.connectRooms(g.room(1,3),g.room(1,4));assert.deepEqual([1,2,3,4].map(y=>r.roomLabel(g.room(1,y))),['','Elevador','','Elevador']);const isolated=g.addRoom(2,2,'shaft');assert.equal(r.roomLabel(isolated),'Fosso de elevador');assert.equal(r.roomLabel(g.room(0,0)),'Portão da Fortaleza')});
