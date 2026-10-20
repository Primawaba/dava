import test from 'node:test';
import assert from 'node:assert/strict';
import {Game} from '../src/engine.js';
function discover(x,y){
 const g=new Game({seed:52});let from=g.room(0,0);
 if(y){for(let depth=1;depth<=y;depth++){if(depth===y&&x===0)break;const r=g.addRoom(0,depth,'cave');g.connectRooms(from,r);from=r}}
 const direction=Math.sign(x);for(let col=direction;direction&&col!==x;col+=direction){const r=g.addRoom(col,y,'cave');g.connectRooms(from,r);from=r}
 g.s.deck=[{suit:'♣',rank:11}];const result=g.explore(x,y,from);assert(result.ok,result.reason);return{g,result};
}
test('burrow card reveals a safe cave across the entire first row and gate line',()=>{
 for(const y of [0,1])for(const x of [-20,-3,-1,0,1,3,20]){
  if(x===0&&y===0)continue;const {g,result}=discover(x,y);
  assert.equal(result.room.type,'cave',`${x},${y}`);assert.equal(g.enemies.length,0);assert.equal(g.s.combat,false);assert.equal(result.room.rewardPending,false);assert.equal(g.allies.length,5);assert(g.allies.every(u=>u.hp===u.maxHp));assert.equal(g.s.discard.length,1);
 }
});
test('burrows still spawn their single large worm in the second layer',()=>{
 for(const x of [-1,0,1]){const {g,result}=discover(x,2);assert.equal(result.room.type,'burrow');assert.equal(g.enemies.length,1);assert.equal(g.enemies[0].type,'worm');assert(g.s.combat)}
});
