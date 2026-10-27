// Deterministic squad allocation on the opened-passage graph. No random draws.
const tacticalDistance=(a,b)=>Math.abs(a.x-b.x)+Math.abs(a.y-b.y);
// Departure/contact order: melee first, then descending current HP, stable IDs.
export function engagementPriority(game,a,b){const melee=u=>game.unitData(u).range<=.5;return Number(!melee(a))-Number(!melee(b))||(melee(a)&&melee(b)?b.hp-a.hp:0)||a.id-b.id;}
export function combatStrength(game,u){
 const health=Math.max(0,(u.hp+u.shield)/u.maxHp);
 const upgrades=u.team==='ally'?1+game.s.blessings*.06+game.s.inventions*.15:1;
 if(u.type==='siege'&&u.shot)return 0;
 return (u.power*upgrades+(u.team==='ally'?game.s.trophies*1.1:0))*health*(u.stun>0?.65:1);
}
export function travelTime(game,u,destination){
 const start=game.anchor(u);if(!start||!destination)return Infinity;
 const route=game.path(start,destination,u.team,u);if(route===null)return Infinity;
 const data=game.unitData(u);if(data.speed<=0)return tacticalDistance(u,destination)<.001?0:Infinity;
 let seconds=tacticalDistance(u,start)/data.speed;
 if(u.team==='enemy'&&u.moveTarget){const origin=game.movementOrigin(u,start),door=origin&&game.barricade(origin,start);if(door&&tacticalDistance(u,origin)<.5)seconds+=door.hp/Math.max(1,u.power*1.8)}
 let previous=start;for(const r of route){const door=game.barricade(previous,r);if(u.team==='enemy'&&door)seconds+=door.hp/Math.max(1,u.power*1.8);previous=r;let speed=data.speed;if(u.team==='ally'&&(['elevator','rails','shaft'].includes(r.type)||r.transport==='rails'))speed*=2;if(r.type==='mud')speed*=.5;if(u.team==='enemy'&&r.type==='puzzle')speed*=.35;if(u.team==='ally'&&game.s.artifacts.includes('speed'))speed*=1.15;seconds+=1/speed}
 return seconds;
}
export function enemyClusters(game){
 const enemies=game.enemies.sort((a,b)=>a.id-b.id),remaining=new Set(enemies),groups=[];
 for(const first of enemies){if(!remaining.delete(first))continue;const members=[first];
  for(let i=0;i<members.length;i++)for(const other of remaining){
   const a=game.anchor(members[i]),b=game.anchor(other);if(!a||!b||tacticalDistance(members[i],other)>1.5)continue;
   const physicalA=game.room(Math.round(members[i].x),Math.round(members[i].y)),physicalB=game.room(Math.round(other.x),Math.round(other.y));if(game.barricade(physicalA,physicalB)||game.barricade(a,b))continue;
   const route=game.path(a,b,'enemy');if(route!==null&&route.length<=1){members.push(other);remaining.delete(other)}
  }
  const threat=members.reduce((best,e)=>travelTime(game,e,game.target)<travelTime(game,best,game.target)?e:best,first);
  const eta=travelTime(game,threat,game.target),power=members.reduce((n,e)=>n+combatStrength(game,e),0);
  groups.push({id:Math.min(...members.map(e=>e.id)),members,threat,eta,power,demand:power*(1.15+.3/(1+(Number.isFinite(eta)?eta:1000))),priority:(1+Math.sqrt(power))/(2+(Number.isFinite(eta)?eta:1000)),assigned:[],assignedPower:0});
 }return groups;
}
function candidate(game,u,group){
 const data=game.unitData(u),enemy=group.threat,at=game.anchor(enemy);if(!at)return null;
 const canShoot=data.range>.5&&group.members.some(e=>(u.type==='siege'||tacticalDistance(u,e)<=data.range)&&game.lineOfSight(u,e));
 if(data.speed<=0)return canShoot&&!u.shot?{goal:game.anchor(u),eta:0}:null;
 let goal=at,eta=travelTime(game,u,goal);
 if(!Number.isFinite(eta)){
  const advance=game.path(at,game.target,'enemy',enemy)||[];
  goal=advance.find(r=>Number.isFinite(travelTime(game,u,r)));if(!goal)return null;eta=travelTime(game,u,goal);
 }
 if(data.range>.5){
  if(canShoot){goal=game.anchor(u);eta=0}
  else{const route=game.path(game.anchor(u),goal,'ally',u)||[];const firing=[game.anchor(u),...route].find(r=>r&&tacticalDistance(r,enemy)<=data.range&&game.lineOfSight(r,enemy));if(firing){goal=firing;eta=travelTime(game,u,goal)}}
 }
 return {goal,eta};
}
export function planDefense(game){
 const groups=enemyClusters(game),allies=game.defenders.sort((a,b)=>a.id-b.id),assignments=new Map(),available=new Set(allies);
 const choices=new Map();for(const u of allies){const options=new Map();for(const g of groups){const c=candidate(game,u,g);if(c)options.set(g.id,c)}choices.set(u.id,options)}
 const availability=new Map(groups.map(g=>[g.id,allies.filter(u=>choices.get(u.id).has(g.id)).length]));
 function assign(u,g){const c=choices.get(u.id).get(g.id);assignments.set(u.id,{groupId:g.id,targetId:g.threat.id,goal:c.goal,eta:c.eta});g.assigned.push(u.id);g.assignedPower+=combatStrength(game,u);available.delete(u);for(const id of choices.get(u.id).keys())availability.set(id,availability.get(id)-1);u.frontTarget=g.threat.id}
 // Units already exchanging melee blows do not abandon contact for a new score.
 for(const u of allies)if(game.unitData(u).range<=.5){const engaged=groups.find(g=>choices.get(u.id).has(g.id)&&g.members.some(e=>game.meleeContact(u,e)));if(engaged)assign(u,engaged)}
 function bestUnit(g){
  let best=null,score=Infinity;
  for(const u of available){const c=choices.get(u.id).get(g.id);if(!c)continue;
   const power=combatStrength(game,u);if(power<=0)continue;
   // Keep continuity unless another front is materially cheaper or unprotected.
   const retained=g.members.some(e=>e.id===u.frontTarget),overkill=Math.max(0,power-Math.max(1,g.demand-g.assignedPower))/Math.max(1,g.demand);
   const scarce=groups.filter(other=>!other.assigned.length&&other.id!==g.id&&choices.get(u.id).has(other.id)&&availability.get(other.id)===1).length;
   const cost=c.eta+(retained?-1.4:0)+overkill*2+(u.type==='cleric'?3:0)+scarce*100;
   if(cost<score||cost===score&&u.id<best?.id){best=u;score=cost}
  }return best;
 }
 // Cover reachable independent fronts first, including when the army is weaker.
 const fronts=[...groups].sort((a,b)=>{
  const count=g=>availability.get(g.id);
  return count(a)-count(b)||b.priority-a.priority||a.id-b.id;
 });
 for(const g of fronts)if(!g.assigned.length){const u=bestUnit(g);if(u)assign(u,g)}
 const maxPriority=Math.max(.001,...groups.map(g=>g.priority));
 while(available.size){
  let selected=null,unit=null,score=-Infinity;
  for(const g of groups){const u=bestUnit(g);if(!u)continue;
   const coverage=g.demand/Math.max(.1,g.assignedPower),urgency=1+.25*g.priority/maxPriority;
   const value=coverage*urgency;
   if(value>score||value===score&&g.id<selected?.id){selected=g;unit=u;score=value}
  }if(!unit)break;assign(unit,selected);
 }
 for(const u of available)u.frontTarget=null;
 return {groups,assignments,at:game.s.seconds};
}
