import test from 'node:test';
import assert from 'node:assert/strict';
import {Game} from '../src/engine.js';
function discover(x,y,rank){
 const g=new Game({seed:41});let from=g.room(0,0);
 // Explicitly construct a safe approach; use lateral discovery so a magma
 // reservoir would flow immediately if the generation protection were absent.
 if(y===1&&x!==0){const below=g.addRoom(0,1,'barracks');g.connectRooms(from,below);from=below}
 if(y===2){for(let depth=1;depth<=2;depth++){const n=g.addRoom(0,depth,'cave');g.connectRooms(from,n);from=n}}
 const sign=Math.sign(x);for(let col=sign;col!==x;col+=sign){if(!sign)break;const n=g.addRoom(col,y,'cave');g.connectRooms(from,n);from=n}
 g.s.deck=[{suit:'♣',rank}];g.roll=n=>n===2?2:1;
 const result=g.explore(x,y,from);assert(result.ok,result.reason);return{g,r:result.room};
}
test('magma and volcanic craters cannot spawn anywhere in the starting strip',()=>{
 for(const y of [0,1])for(const x of [-2,-1,0,1,2])for(const rank of [4,8]){
  if(x===0&&y===0)continue;
  const {g,r}=discover(x,y,rank);assert.equal(r.type,'cave',`${x},${y},♣${rank}`);
  assert(g.rooms.every(room=>!g.roomHazards(room).some(h=>['lava','crater'].includes(h))));
  assert(g.allies.every(u=>u.hp===u.maxHp));assert(!g.room(0,0).damaged);assert.equal(g.s.discard.length,1);
 }
});
test('magma and craters remain discoverable beyond either side of the protected strip',()=>{
 for(const x of [-3,3])for(const rank of [4,8]){const {r}=discover(x,1,rank);assert.equal(r.type,rank===4?'lava':'crater')}
});
test('the next underground layer retains magma and crater encounters',()=>{
 for(const x of [-1,1])for(const rank of [4,8]){const {r}=discover(x,2,rank);assert.equal(r.type,rank===4?'lava':'crater')}
});
