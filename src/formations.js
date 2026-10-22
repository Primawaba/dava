import {DIRS} from './data.js';
const formationKey=(x,y)=>`${x},${y}`;
export const BUILD_FOOTPRINTS={temple:2,museum:2,breeder:4,meadhall:2,dragonforge:2,trapmaster:2};
// A deterministic preview must never consume the world RNG while the UI redraws.
export function planFormation(game,root,count,{axis=null,build=false}={}){
 const result=[{x:root.x,y:root.y}],seen=new Set([formationKey(root.x,root.y)]),valid=(x,y)=>{
  if(x< -20||x>20||y>30||y< -6||(!build&&y<0&&![0,5].includes(game.s.activePlane))||game.sealedBlock(x,y))return false;
  if(y<=1&&Math.abs(x)<=2&&['lava','crater'].includes(game.fluidSource(root)))return false;
  const r=game.room(x,y);if(r&&(!build||r.type!=='cave'||r.exhausted||r.builtPartOf||game.roomHazards(r).length))return false;
  if(build&&(root.y<0)!==(y<0))return false;
  if(build&&y< -1&&(!game.room(x,y+1)||game.room(x,y+1).damaged))return false;
  return true;
 };
 if(axis){const vectors=axis==='down'?[[0,1]]:axis==='up'?[[0,-1]]:[[1,0],[-1,0]],options=vectors.map(([dx,dy])=>{const line=[result[0]];for(let i=1;i<count;i++){const x=root.x+dx*i,y=root.y+dy*i;if(!valid(x,y))break;line.push({x,y})}return line});return options.sort((a,b)=>b.length-a.length)[0]}
 const dirs=[[1,0],[0,1],[-1,0],[0,-1]];for(let i=0;i<result.length&&result.length<count;i++)for(const [dx,dy]of dirs){const x=result[i].x+dx,y=result[i].y+dy,k=formationKey(x,y);if(seen.has(k)||!valid(x,y))continue;seen.add(k);result.push({x,y});if(result.length>=count)break}return result;
}
