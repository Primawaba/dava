import test from 'node:test';
import assert from 'node:assert/strict';
import {Game} from '../src/engine.js';
test('gain emits exactly the credited amount after capacity limits',()=>{const g=new Game();g.s.resources=47;g.s.gold=49;g.events=[];g.gain(14,9);assert.deepEqual(g.events,[{type:'resource-gain',resources:3,gold:1}]);assert.equal(g.s.resources,50);assert.equal(g.s.gold,50);g.events=[];g.gain(14,9);assert.deepEqual(g.events,[])});
test('losses do not produce gain particles and rewards remain immediate in saves',()=>{const g=new Game();g.events=[];g.gain(-3,14);assert.deepEqual(g.events,[{type:'resource-gain',resources:0,gold:14}]);const loaded=Game.restore(g.serialize());assert.equal(loaded.s.resources,17);assert.equal(loaded.s.gold,34);assert.equal(loaded.events.length,0)});
test('both trade directions emit only their received currency',()=>{for(const direction of ['gold','resources']){const g=new Game();g.events=[];assert(g.trade(direction,5).ok);const e=g.events.find(e=>e.type==='resource-gain');assert.deepEqual(e,direction==='gold'?{type:'resource-gain',resources:10,gold:0}:{type:'resource-gain',resources:0,gold:5})}});
