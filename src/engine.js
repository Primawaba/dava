import {planDefense} from './tactics.js';
import {DIRS,ROOMS,UNITS,SUITS,NATURAL,REMNANTS,PLANES,DIFFICULTIES,ENEMIES,DAMAGEABLE_ROOMS} from './data.js';
export const key=(x,y)=>`${x},${y}`;
export const distance=(a,b)=>Math.abs(a.x-b.x)+Math.abs(a.y-b.y);
export const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export class Game {
 constructor({seed=Date.now(),name='A Última Fortaleza',difficulty='normal'}={}){
  this.s={version:1,rulesVersion:2,immortalVersion:1,barricadeVersion:1,barricades:{},passageVersion:1,passages:{},seed:(Number(seed)>>>0)||123456789,name:String(name).slice(0,40),difficulty:DIFFICULTIES[difficulty]?difficulty:'normal',turn:1,resources:20,gold:20,baseMorale:10,rooms:{},units:[],deck:[],discard:[],jokerAdded:false,combat:false,paused:false,speed:1,status:'playing',built:false,traded:false,turnReady:true,kills:0,battles:0,maxDepth:0,blessings:0,inventions:0,trophies:0,artifacts:[],expedition:null,voidDefeated:false,log:[],nextId:1,seconds:0,card:null};
  this.projectiles=[];this.effects=[];this.dead=[];this.events=[];this.tickBudget=0;
  this.addRoom(0,0,'gate');for(let i=0;i<5;i++)this.addUnit('soldier',0,0,true);
  this.shuffleDeck();
  this.note('Os portões se abrem. Cinco guerreiros leais aguardam suas ordens.','good');
 }
 get rooms(){return Object.values(this.s.rooms)}
 get allies(){return this.s.units.filter(u=>u.team==='ally'&&u.hp>0)}
 get enemies(){return this.s.units.filter(u=>u.team==='enemy'&&u.hp>0)}
 get target(){return this.rooms.find(r=>r.type==='throne'&&!r.damaged)||this.room(0,0)}
 random(){let t=this.s.seed+=0x6D2B79F5;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);this.s.seed>>>=0;return((t^t>>>14)>>>0)/4294967296}
 roll(n){return 1+Math.floor(this.random()*n)}
 note(text,kind='info'){this.s.log.unshift({text,kind,turn:this.s.turn});this.s.log=this.s.log.slice(0,100);this.events.push({type:'log',text,kind})}
 room(x,y){return this.s.rooms[key(x,y)]}
 addRoom(x,y,type){const r={x,y,type,variant:this.roll(3)-1,damaged:false,closed:false,prisoners:0,usedTurn:0,trap:null,barricade:null,secret:false,contaminant:null};this.s.rooms[key(x,y)]=r;if(type==='invincible')this.placeImmortal(r);return r}
 passageKey(a,b){return [key(a.x,a.y),key(b.x,b.y)].sort().join('|')}
 linked(a,b){return !!a&&!!b&&distance(a,b)===1&&this.s.passages[this.passageKey(a,b)]===true}
 connectRooms(a,b){if(!a||!b||!this.room(a.x,a.y)||!this.room(b.x,b.y)||distance(a,b)!==1)return false;this.s.passages[this.passageKey(a,b)]=true;this._routeCache=null;this._tacticsDirty=true;return true}
 barricade(a,b){const d=a&&b&&this.s.barricades[this.passageKey(a,b)];return d?.hp>0?d:null}
 passageDefenses(r){return DIRS.map(([dx,dy])=>this.room(r.x+dx,r.y+dy)).filter(n=>n&&this.linked(r,n)).map(n=>({room:n,id:this.passageKey(r,n),door:this.s.barricades[this.passageKey(r,n)]||null}))}
 fortifyPassage(a,b,kind){
  if(this.s.status!=='playing'||this.s.combat)return{ok:false,reason:'Instale portas fora de combate.'};
  if(!a||!b||!this.linked(a,b))return{ok:false,reason:'Escolha uma passagem já aberta entre duas salas.'};
  if(!['defensive','offensive'].includes(kind))return{ok:false,reason:'Tipo de barricada inválido.'};
  if(!this.has('masonry'))return{ok:false,reason:'Exige Pedraria.'};
  if(!this.active(a)&&!this.active(b))return{ok:false,reason:'A passagem precisa alcançar uma sala ativa.'};
  if(this.barricade(a,b))return{ok:false,reason:'Esta passagem já tem uma porta reforçada.'};
  const gold=kind==='defensive'?10:20;if(this.s.gold<gold)return{ok:false,reason:'Riquezas insuficientes.'};
  this.s.gold-=gold;this.s.barricades[this.passageKey(a,b)]={kind,level:1,hp:kind==='defensive'?400:160};this._routeCache=null;this._tacticsDirty=true;
  this.note('Porta reforçada instalada no corredor. Bloqueia invasores, tiros, líquidos e gases.','good');return{ok:true};
 }
 upgradePassage(a,b){
  const d=this.barricade(a,b);if(this.s.combat||this.s.status!=='playing'||!d||d.level>=3)return{ok:false,reason:'Porta indisponível para aprimorar.'};
  if(this.s.resources<10)return{ok:false,reason:'Aprimorar custa 10♥.'};this.s.resources-=10;d.level++;d.hp+=d.kind==='defensive'?400:160;this._routeCache=null;this._tacticsDirty=true;return{ok:true};
 }
 damageBarricade(a,b,amount){
  const d=this.barricade(a,b);if(!d)return;d.hp=Math.max(0,d.hp-amount);
  if(d.hp===0){this._routeCache=null;this._tacticsDirty=true;this.note('Uma porta reforçada foi destruída. O corredor ficou desprotegido.','danger');this.spreadHazards();this.events.push({type:'door-destroyed'})}
 }
 directions(origin=null){
  const out=[];if(this.s.status!=='playing'||this.s.combat)return out;
  for(const r of origin?[origin]:this.rooms){if(!this.active(r))continue;
   for(const [dx,dy]of DIRS){const x=r.x+dx,y=r.y+dy,n=this.room(x,y);
    if(x< -20||x>20||y< -6||y>30||this.linked(r,n))continue;
    // Empty surface cells are built directly; they are never explored.
    if(!n&&y<0)continue;
    out.push({x,y,from:{x:r.x,y:r.y},dx,dy,kind:n?'passage':'explore'});
   }
  }return out;
 }
 explorationTurn(){
  if(!this.s.turnReady){this.s.turn++;this.s.built=false;this.s.traded=false;this.income();if(this.s.combat){this.s.turnReady=true;return false}}
  this.s.turnReady=false;return true;
 }
 openPassage(from,to){
  if(this.s.status!=='playing'||this.s.combat)return{ok:false,reason:'Resolva o combate antes de abrir passagens.'};
  const a=from&&this.room(from.x,from.y),b=to&&this.room(to.x,to.y);
  if(!a||!b||distance(a,b)!==1)return{ok:false,reason:'Escolha duas salas vizinhas já descobertas.'};
  if(this.linked(a,b))return{ok:false,reason:'Essa passagem já está aberta.'};
  if(!this.active(a))return{ok:false,reason:'Abra a passagem a partir de uma sala ativa da fortaleza.'};
  if(!this.explorationTurn())return{ok:false,reason:'Um portal iniciou uma invasão antes da abertura.'};
  this.connectRooms(a,b);if(['water','lava','crater'].includes(b.type))b.flowActive=true;if(['water','lava','crater'].includes(a.type))a.flowActive=true;
  this.note(`Passagem aberta entre ${ROOMS[a.type].name} e ${ROOMS[b.type].name}.`,'good');
  this.spreadHazards();this.checkMutiny();this.reconnectCaptured();
  return{ok:true,room:b,passage:true};
 }
 addUnit(type,x,y,loyal=false,team='ally',power=null){
  const d=(team!=='ally'?ENEMIES[type]:UNITS[type])||UNITS[type]||{power:power||5,speed:0.65,range:0.42};const p=power||d.power||5;
  const u={id:this.s.nextId++,type,team,loyal:loyal||d.mutiny===0,power:p,hp:p*8,maxHp:p*8,shield:0,x,y,home:key(x,y),cooldown:this.random()*0.6,attack:0,walk:0,shot:false,stun:0,order:'defend',size:d.size||1,facing:1};this.s.units.push(u);this._tacticsDirty=true;return u;
 }
 shuffleDeck(){this.s.deck=[];for(const suit of SUITS)for(let rank=1;rank<=13;rank++)this.s.deck.push({suit,rank});if(this.s.jokerAdded)this.s.deck.push({suit:'★',rank:0},{suit:'★',rank:0});for(let i=this.s.deck.length-1;i>0;i--){const j=Math.floor(this.random()*(i+1));[this.s.deck[i],this.s.deck[j]]=[this.s.deck[j],this.s.deck[i]]}}
 draw(depth=0){
  if(depth>=5&&!this.s.jokerAdded){this.s.jokerAdded=true;this.s.deck.splice(Math.floor(this.random()*(this.s.deck.length+1)),0,{suit:'★',rank:0});this.s.deck.splice(Math.floor(this.random()*(this.s.deck.length+1)),0,{suit:'★',rank:0});this.note('Profundidade 5. Os coringas despertam no baralho.','warn')}
  if(!this.s.deck.length){this.shuffleDeck();this.s.discard=[]}
  const c=this.s.deck.pop();this.s.discard.push(c);return c;
 }
 roomHazards(r){
  if(!r)return [];
  let hazards=[...new Set([ROOMS[r.type]?.hazard?r.type:null,r.fluid,r.gas,r.contaminant].filter(Boolean))];
  if(['bridge','drawbridge','pump'].includes(r.type))hazards=hazards.filter(h=>!['water','lava','crater'].includes(h));
  return hazards;
 }
 immune(u,h){return u.type==='golem'||u.type==='automaton'||(u.team==='ally'&&h==='water'&&this.s.artifacts.includes('water'))||(u.team==='ally'&&['lava','crater'].includes(h)&&this.s.artifacts.includes('lava'))}
 lethalHazard(r,u){return this.roomHazards(r).some(h=>['water','lava','crater','gas'].includes(h)&&!this.immune(u,h))}
 blockedByImmortal(r){return !!r?.immortalId&&this.s.units.some(u=>u.id===r.immortalId&&u.type==='immortal'&&u.hp>0)}
 placeImmortal(r){
  const existing=this.s.units.find(u=>u.type==='immortal'&&u.home===key(r.x,r.y)&&u.hp>0);if(existing){r.immortalId=existing.id;return existing}
  const u=this.addUnit('immortal',r.x,r.y,true,'neutral',1);r.immortalId=u.id;r.closed=false;return u;
 }
 passable(r,team='ally',unit=null){return !!r&&!r.closed&&!this.blockedByImmortal(r)&&!(team==='enemy'&&r.secret)&&!(r.trap?.level===3)&&!(unit&&this.lethalHazard(r,unit))}
 neighbors(r,team='ally',unit=null){return DIRS.map(([dx,dy])=>this.room(r.x+dx,r.y+dy)).filter(n=>this.linked(r,n)&&this.passable(n,team,unit))}
 anchor(u){return this.s.rooms[u.moveTarget]||this.room(Math.round(u.x),Math.round(u.y))}
 path(start,end,team='ally',unit=null){
  const sk=typeof start==='string'?start:key(Math.round(start.x),Math.round(start.y));
  const ek=typeof end==='string'?end:key(Math.round(end.x),Math.round(end.y));
  const ck=`${sk}|${ek}|${team}|${unit?.type||'-'}|${unit?.team||'-'}|${unit?.power||'-'}`;if(this._routeCache?.has(ck))return this._routeCache.get(ck);
  const finish=result=>{this._routeCache?.set(ck,result);return result};
  if(!this.s.rooms[sk]||!this.s.rooms[ek])return finish(null);
  if(sk===ek)return finish([]);
  if(!this.passable(this.s.rooms[ek],team,unit))return finish(null);
  const open=[{k:sk,cost:0}],cost=new Map([[sk,0]]),prev=new Map([[sk,null]]);
  while(open.length){
   open.sort((a,b)=>a.cost-b.cost);const {k,cost:spent}=open.shift();if(spent!==cost.get(k))continue;
   if(k===ek){const out=[];let t=ek;while(t!==sk){out.unshift(this.s.rooms[t]);t=prev.get(t)}return finish(out)}
   for(const n of this.neighbors(this.s.rooms[k],team,unit)){
    const nk=key(n.x,n.y),door=this.barricade(this.s.rooms[k],n),step=(team==='enemy'&&door?door.hp/Math.max(1,(unit?.power||10)*1.8)*(unit?this.unitData(unit).speed:.65):0)+(['mud','labyrinth'].includes(n.type)?2:team==='enemy'&&n.type==='puzzle'?3:1);
    const nc=spent+step;if(nc>=(cost.get(nk)??Infinity))continue;cost.set(nk,nc);prev.set(nk,k);open.push({k:nk,cost:nc});
   }
  }return finish(null);
 }
 damageable(r){return !!r&&DAMAGEABLE_ROOMS.includes(r.type)}
 supported(r){return r.y>=-1||!!this.room(r.x,r.y+1)&&!this.room(r.x,r.y+1).damaged&&this.supported(this.room(r.x,r.y+1))}
 active(r){return !!r&&this.supported(r)&&!r.damaged&&!this.roomHazards(r).length&&this.passable(r)&&this.path(r,this.target,'ally',{type:'soldier'})!==null}
 has(type){return this.rooms.some(r=>r.type===type&&this.active(r))}
 nearby(r,type,radius=2){return this.rooms.filter(n=>n.type===type&&Math.abs(n.x-r.x)<=radius&&Math.abs(n.y-r.y)<=radius&&this.active(n))}
 capacities(){return{resources:50+50*this.rooms.filter(r=>r.type==='warehouse'&&this.active(r)).length,gold:50+50*this.rooms.filter(r=>r.type==='treasury'&&this.active(r)).length}}
 gain(r=0,g=0){const c=this.capacities(),before={resources:this.s.resources,gold:this.s.gold};this.s.resources=clamp(this.s.resources+r,0,c.resources);this.s.gold=clamp(this.s.gold+g,0,c.gold);const resources=Math.max(0,this.s.resources-before.resources),gold=Math.max(0,this.s.gold-before.gold);if(resources||gold)this.events.push({type:'resource-gain',resources,gold})}
 morale(){let m=this.s.baseMorale;for(const r of this.rooms){if(this.roomHazards(r).includes('miasma')&&this.isHousing(r))m-=3;if(!this.active(r))continue;m+=({tavern:5,arena:5,parlor:15,games:10,sewer:20,springs:2,quarters:1,mansion:5,miasma:-3}[r.type]||0);if(r.type==='laundry')m+=2*this.rooms.filter(n=>this.isHousing(n)&&distance(r,n)<=2).length}m-=this.allies.filter(u=>u.type==='rat').length;if(this.s.artifacts.includes('morale'))m+=20;if(this.s.artifacts.includes('cat'))m+=10;return Math.round(m)}
 isHousing(r){return Object.values(UNITS).some(u=>u.homes.includes(r.type))}
 surfaceSites(){
  const out=new Map();for(const r of this.rooms)for(const [dx,dy]of DIRS){const x=r.x+dx,y=r.y+dy;
   if(y>=0||y< -6||Math.abs(x)>20||this.room(x,y))continue;
   out.set(key(x,y),{x,y,type:'surface',variant:0,damaged:false});
  }return [...out.values()];
 }
 site(x,y){return this.room(x,y)||this.surfaceSites().find(r=>r.x===x&&r.y===y)}
 surfaceReason(r){
  if(!r||r.y>=0)return 'Escolha um terreno na superfície.';
  if(r.y< -1&&!this.room(r.x,r.y+1))return 'Sem apoio: construa primeiro a sala imediatamente abaixo.';
  if(r.y< -1&&this.room(r.x,r.y+1).damaged)return 'Repare a sala de apoio abaixo antes de construir.';
  if(!DIRS.some(([dx,dy])=>{const n=this.room(r.x+dx,r.y+dy);return n&&this.active(n)}))return 'Conecte a construção à fortaleza.';
  return '';
 }
 advanceTurn(){
  if(this.s.status!=='playing'||this.s.combat)return {ok:false,reason:'Resolva o combate antes de encerrar o turno.'};
  this.s.turn++;this.s.built=false;this.s.traded=false;this.s.turnReady=true;this.income();this.spreadHazards();this.checkMutiny();this.note('Um novo turno começa. Prepare a fortaleza antes de explorar.');return {ok:true};
 }
 frontier(){const out=new Map();for(const d of this.directions())if(d.kind==='explore')out.set(key(d.x,d.y),{x:d.x,y:d.y});return [...out.values()]}
 explore(x,y,from=null){
  if(this.s.status!=='playing'||this.s.combat)return{ok:false,reason:'Resolva o combate antes de explorar.'};
  if(y<0)return{ok:false,reason:'A superfície não precisa ser explorada. Construa diretamente.'};
  const choices=this.directions().filter(d=>d.x===x&&d.y===y&&d.kind==='explore');
  const choice=from?choices.find(d=>d.from.x===from.x&&d.from.y===from.y):choices.length===1?choices[0]:null;
  if(!choice)return{ok:false,reason:'Escolha a seta da sala de origem para explorar nessa direção.'};
  const approach=this.room(choice.from.x,choice.from.y);
  if(!this.explorationTurn())return{ok:false,reason:'Um portal iniciou uma invasão antes da exploração.'};
  this.s.maxDepth=Math.max(this.s.maxDepth,y);let c=this.draw(y);
  while(y<=1&&c.suit==='♠')c=this.draw(y);
  this.s.card=c;let type='cave',enemy=0,enemyType='raider';let msg='';
  if(y>=12&&!this.rooms.some(r=>r.type==='void')&&!this.s.artifacts.includes('void')){type='void';enemy=110;enemyType='guardian';msg='O Cristal do Vazio! Seu guardião ancestral desperta.'}
  else if(c.suit==='♥'||c.suit==='♦'){
   let value=c.rank+Math.max(0,y);
   if(c.suit==='♦'&&this.rooms.some(r=>r.type==='inspection'&&Math.abs(r.x-x)<=2&&Math.abs(r.y-y)<=2&&this.active(r)))value*=2;
   if(c.suit==='♦'&&this.rooms.some(r=>r.type==='altar'&&Math.abs(r.x-x)<=3&&Math.abs(r.y-y)<=3&&this.allies.some(u=>u.type==='cleric'&&u.home===key(r.x,r.y))))value+=3;
   this.gain(c.suit==='♥'?value:0,c.suit==='♦'?value:0);msg=`${c.suit} ${c.rank} · Você encontrou ${value} ${c.suit==='♥'?'recursos':'riquezas'}.`;
   if(c.rank===13&&c.suit==='♦'&&this.has('games')){this.s.gold=Math.floor(this.s.gold/2);this.note('A banca quebrou: a Sala de Jogos perdeu metade das riquezas.','warn')}
  }else if(c.suit==='♣'){
   let n=c.rank;if(n===1&&y>=5)n=13+this.roll(7);type=NATURAL[n-1];
   if(n===2)type=['gas','flammable','miasma','blindgas'][this.roll(4)-1];
   if(n===3){this.magic(this.roll(2)===1);type='cave'}
   if(n===4)type=this.roll(2)===1?'water':'lava';
   if(n===7){enemy=10+Math.max(0,y)*5;enemyType='insect'}
   if(n===9){enemy=10+Math.max(0,y)*5;enemyType='cavewolf'}
   if(n===10){enemy=40+Math.max(0,y)*5;enemyType='troll'}
   if(n===11){enemy=20+Math.max(0,y)*5;enemyType='worm'}
   if(n===12)msg='Uma criatura imortal bloqueia a câmara. Apenas morte instantânea pode derrotá-la.';
   if(n===13){this.s.baseMorale+=1;msg='Uma criatura perdida atravessa a caverna e desaparece. +1 moral.'}
   if(n===16)this.magic(this.roll(2)===1);
   if(n===18){enemy=10*this.roll(8)+Math.max(0,y)*5;enemyType='elemental'}
   if(n===19){const count=this.roll(4);enemy=10*count+Math.max(0,y)*5;enemyType=count===4?'insectqueen':'insect'}
   if(n===20){enemy=40+Math.max(0,y)*5;enemyType='troll'}
   msg=msg||`♣ ${c.rank} · ${ROOMS[type].name}.`;
  }else if(c.suit==='♠'){
   const n=c.rank<=10?c.rank:10+this.roll(14);type=REMNANTS[n-1];
   if([1,2,10].includes(n)){enemy=({1:10,2:20,10:40,11:40,13:50}[n])+Math.max(0,y)*5;enemyType=n===2?'skeleton':n===10?'golem':'goblin'}
   if(n===5)this.gain(0,20+2*y);
   if(n===7){type=['barracks','library','warehouse','kitchen'][this.roll(4)-1]}
   if(n===8)this.magic(true);
   if(n===11){this.s.blessings++;this.note('Um artefato encantado concede +6% de dano permanente.','good')}
   if(n===13||n===14||n===15||n===17||n===18||n===21||n===23||n===24){enemy=({13:50,14:30,15:30,17:40,18:50,21:40,23:60,24:70}[n])+Math.max(0,y)*5;enemyType=n===21?'golem':n===15?'miner':n===23?'champion':n===18?'lich':'goblin'}
   if(n===16)this.magic(false);
   msg=`♠ ${c.rank} · ${ROOMS[type].name}.`;
  }else{type='vault';this.magic(true);this.gain(15,15);msg='★ Descoberta lendária: um artefato fortalece suas tropas.';this.s.blessings++}
  if(y<=1&&type==='burrow'){type='cave';enemy=0;msg=`${c.suit} ${c.rank} · Caverna vazia.`;}
  // Protect the gate's starting strip before hazards can spread or kill units.
  if(y<=1&&Math.abs(x)<=2&&['lava','crater'].includes(type)){type='cave';msg=`${c.suit} ${c.rank} · Uma caverna de rocha vulcânica fria.`;}
  const r=this.addRoom(x,y,type);this.connectRooms(approach,r);r.rewardPending=enemy>0;r.flowActive=!(['water','lava','crater'].includes(type)&&approach?.x===x&&approach?.y===y-1);if(c.suit==='♠'&&c.rank===7)r.damaged=true;
  this.note(msg,enemy?'danger':'good');
  if(type==='mushrooms'){if(this.roll(2)===1)this.s.baseMorale+=5;else this.gain(10,0)}
  if(enemy>0)this.spawnEnemies(r,enemy,enemyType);
  this.spreadHazards();
  this.checkMutiny();
  if(this.enemies.length)this.beginCombat();
  this.events.push({type:'explore',room:r,card:c});return{ok:true,room:r,card:c};
 }
 income(){
  let res=0,gold=0;
  for(const r of this.rooms){if(!this.active(r))continue;
   res+=r.type==='forest'?2:0;gold+=({mine:2,parlor:2,elemental:4,city:3}[r.type]||0);if(r.type==='hive')res+=2;
   if(r.type==='crystal'){const card=this.draw(Math.max(0,r.y));if(card.suit==='♦'&&card.rank===1){r.type='cave';r.exhausted=true;this.note('Uma caverna de cristal se esgotou. O espaço continua transitável.','warn')}else gold+=card.rank+Math.max(0,r.y)}
   if(r.type==='prison'){r.prisoners=Math.min(20,r.prisoners+1);if(r.prisoners===20)gold+=20}
   if(r.type==='games')gold+=5*this.rooms.filter(n=>this.isHousing(n)&&Math.abs(n.x-r.x)<=2&&Math.abs(n.y-r.y)<=2).length;
   if(r.type==='persuasion'&&this.roll(4)===4)res+=10;
   if(r.type==='hiring'&&this.roll(4)===4){const cell=this.rooms.find(n=>n.type==='solitary'&&n.prisoners);if(cell){cell.prisoners=0;this.addUnit('thug',r.x,r.y,false);this.note('Um prisioneiro se juntou à sua causa.','good')}}
   if(r.type==='portal'&&this.roll(4)===1)this.spawnEnemies(r,20+Math.max(0,r.y)*5,'raider');
  }
  if(this.s.artifacts.includes('forest'))res+=4;if(this.s.artifacts.includes('honey'))res+=10;if(this.s.artifacts.includes('museum'))gold+=5;
  if(this.s.artifacts.includes('magic'))this.magic(true);
  this.gain(res,gold);if(res||gold)this.note(`Produção da fortaleza: +${res}♥ · +${gold}♦.`,'good');
  if(this.enemies.length)this.beginCombat();
 }
 cost(type,r){const d=ROOMS[type];if(!d||d.r===undefined)return null;let res=d.r+Math.max(0,-r.y),gold=d.g||0;if(type==='solitary'&&this.rooms.some(n=>n.type==='prison'&&distance(n,r)===1))res=5;if(this.nearby(r,'workshop').length){res=Math.ceil(res/2);gold=Math.ceil(gold/2)}return{resources:res,gold}}
 buildReason(type,r){
  if(!r)return'Selecione uma sala explorada.';const d=ROOMS[type];if(!d||d.r===undefined)return'Construção inválida.';
  if(this.s.status!=='playing')return'A campanha terminou.';if(this.s.combat)return'Construção indisponível em combate.';if(this.s.built)return'Uma sala por turno. Explore para iniciar outro turno.';
  if(r.exhausted)return'A caverna esgotada não pode receber construções.';
  if(r.y<0){const reason=this.surfaceReason(r);if(reason)return reason;}
  else if(['bridge','drawbridge'].includes(type)&&this.roomHazards(r).length){if(r.damaged)return'Drene e repare a sala danificada antes de construir.';if(this.path(r,this.target)===null)return'A ponte precisa estar conectada.';}
  else if(!this.active(r))return this.roomHazards(r).length?'Drene o fluido ou gás antes de usar a sala.':'A sala precisa estar conectada e reparada.';
  if(d.on&&r.type!==d.on)return`Exige ${ROOMS[d.on].name}.`;
  if(!d.on&&!['surface','smalllair','largelair','burrow','wandering','elemental','hive','hungry','artifact','desolate','shaft','rivalmine','city','tomb','challenge','rivalhold','cave','forest','nest','ruins','mine','crystal','mushrooms','springs','fairy','vault','columns','mud','labyrinth','ancientlibrary','ancienttemple'].includes(r.type)&&!(d.hazard||['bridge','drawbridge'].includes(type)&&ROOMS[r.type].hazard))return'Essa sala já está ocupada.';
  if(this.roomHazards(r).some(h=>!['water','lava','crater'].includes(h)))return'Drene o gás antes de construir.';
  if(this.roomHazards(r).length&&!['bridge','drawbridge'].includes(type))return'Drene o perigo ou construa uma Ponte.';
  if(d.unique&&this.has(type))return'Só uma construção deste tipo é permitida.';
  if(d.requires?.some(t=>!this.has(t)))return`Exige: ${d.requires.map(t=>ROOMS[t].name).join(', ')}.`;
  const c=this.cost(type,r);if(this.s.resources<c.resources||this.s.gold<c.gold)return'Recursos insuficientes.';return'';
 }
 build(type,x,y){let r=this.site(x,y);const reason=this.buildReason(type,r);if(reason)return{ok:false,reason};const c=this.cost(type,r);if(!this.room(x,y)){const source=(y<0&&this.active(this.room(x,y+1))?this.room(x,y+1):null)||DIRS.map(([dx,dy])=>this.room(x+dx,y+dy)).find(n=>n&&this.active(n));r=this.addRoom(x,y,'cave');this.connectRooms(source,r);}this.s.resources-=c.resources;this.s.gold-=c.gold;r.type=type;r.variant=this.roll(3)-1;r.contaminant=null;this.s.built=true;
  if(type==='library')this.magic(true);if(type==='altar')this.addUnit('cleric',x,y,true);if(type==='tavern')this.addUnit('hero',x,y,true);this.spreadHazards();this.note(`${ROOMS[type].name} construída. −${c.resources}♥${c.gold?` −${c.gold}♦`:''}.`,'good');return{ok:true};
 }
 housing(type){const d=UNITS[type];if(!d)return[];if(d.requires&&!this.has(d.requires))return[];return this.rooms.filter(r=>d.homes.includes(r.type)&&this.active(r)&&this.capacity(r)>this.allies.filter(u=>u.home===key(r.x,r.y)).length&&(!(r.type==='hut'||r.type==='quarters')||this.allies.filter(u=>u.home===key(r.x,r.y)).reduce((a,u)=>a+u.power,0)+d.power<=(r.type==='hut'?30:50)))}
 capacity(r){const base={barracks:10,kennel:5,library:5,temple:3,altar:1,sewer:20,laboratory:10,forge:2,siegepost:2,golemforge:2,hut:10,quarters:10,tavern:1,crypt:20,breeder:1,meadhall:10}[r.type]||0;return base+2*this.rooms.filter(n=>n.type==='dormitory'&&distance(n,r)===1&&this.active(n)).length}
 recruitmentReason(type){
  const d=UNITS[type];if(!d)return 'Unidade inválida.';
  if(this.s.status!=='playing'||this.s.combat)return 'Recrutamento indisponível agora.';
  if(!this.s.artifacts.includes('loyal')&&d.mutiny>0&&this.morale()-(type==='rat'?1:0)<d.mutiny)return `Moral insuficiente: exige ${d.mutiny}${type==='rat'?' após recrutar o rato':''}. Motim imediato bloqueado.`;
  if(this.s.gold<d.cost)return 'Riquezas insuficientes.';
  if(!this.housing(type).length)return 'Construa um abrigo apropriado com vagas.';
  return '';
 }
 recruit(type,home=null){
  const blocked=this.recruitmentReason(type);if(blocked)return{ok:false,reason:blocked};const d=UNITS[type];if(!d)return{ok:false,reason:'Unidade inválida.'};if(this.s.gold<d.cost)return{ok:false,reason:'Riquezas insuficientes.'};const homes=this.housing(type);const r=(home&&homes.find(r=>key(r.x,r.y)===home))||homes[0];if(!r)return{ok:false,reason:'Construa um abrigo apropriado com vagas.'};
  this.s.gold-=d.cost;this.addUnit(type,r.x,r.y,this.s.artifacts.includes('loyal'));this.note(`${d.name} recrutado em ${ROOMS[r.type].name}.`,'good');this.checkMutiny();return{ok:true};
 }
 trade(direction,amount=1){if(this.s.status!=='playing'||this.s.combat||this.s.traded)return{ok:false,reason:'Uma troca por turno, fora de combate.'};if(!Number.isInteger(amount)||amount<1)return{ok:false,reason:'Quantidade inválida.'};const c=this.capacities();if(direction==='gold'){amount=Math.min(amount,this.s.gold,Math.floor((c.resources-this.s.resources)/2));if(amount<1)return{ok:false,reason:'Sem riquezas ou espaço no armazém.'};this.s.gold-=amount;this.s.resources+=amount*2;this.events.push({type:'resource-gain',resources:amount*2,gold:0});}else{amount=Math.min(amount,Math.floor(this.s.resources/2),c.gold-this.s.gold);if(amount<1)return{ok:false,reason:'Sem recursos ou espaço na tesouraria.'};this.s.resources-=amount*2;this.s.gold+=amount;this.events.push({type:'resource-gain',resources:0,gold:amount})}this.s.traded=true;this.note(`Troca concluída: ${amount}${direction==='gold'?'♦ → '+amount*2+'♥':'♦ recebidas por '+amount*2+'♥'}.`);return{ok:true}}
 checkMutiny(){const morale=this.morale();for(const u of this.allies){const threshold=UNITS[u.type]?.mutiny||0;if(!u.loyal&&morale<threshold){u.team='enemy';this.note(`${UNITS[u.type].name} se amotinou! Moral ${morale} < ${threshold}.`,'danger')}}if(this.enemies.length&&!this.s.combat)this.beginCombat()}
 spawnEnemies(r,total,type='raider'){
  total=Math.max(1,Math.round(total*DIFFICULTIES[this.s.difficulty].enemy));const d=ENEMIES[type]||ENEMIES.raider;
  const n=d.single?1:Math.min(8,Math.max(1,Math.ceil(total/8)));
  for(let i=0;i<n;i++){const u=this.addUnit(type,r.x,r.y,true,'enemy',total/n);u.range=d.range;u.size=d.size;u.enemyName=d.name;}
 }
 beginCombat(){if(this.s.combat)return;this.s.combat=true;this.s.paused=false;this.dead=[];this._tactics=null;this._tacticsDirty=true;
  for(const u of this.s.units){u.shot=false;u.cooldown=this.random();u.shield=0;u.moveTarget=null;u.targetId=null;
   if(u.team==='ally'){u.order='defend';u.frontTarget=null;const r=this.s.rooms[u.home];if(r){u.x=r.x;u.y=r.y}if(this.has('temple'))u.shield+=20}
  }
  this.spreadHazards();
  this.note('Às armas! Os defensores se dividem entre os núcleos inimigos por força, distância e urgência.','danger');this.events.push({type:'combat'});
 }
 lineOfSight(a,b,melee=false){
  const eps=.015,vertical=Math.abs(a.x-b.x)<eps,horizontal=Math.abs(a.y-b.y)<eps;
  if(!vertical&&!horizontal)return false;
  if(vertical&&Math.abs(a.x-Math.round(a.x))>eps)return false;
  if(horizontal&&Math.abs(a.y-Math.round(a.y))>eps)return false;
  const ax=Math.round(a.x),ay=Math.round(a.y),bx=Math.round(b.x),by=Math.round(b.y);
  const dx=Math.sign(bx-ax),dy=Math.sign(by-ay),n=Math.abs(bx-ax)+Math.abs(by-ay);
  for(let i=0;i<=n;i++){const r=this.room(ax+dx*i,ay+dy*i);if(i>0){const previous=this.room(ax+dx*(i-1),ay+dy*(i-1));if(!this.linked(previous,r)||this.barricade(previous,r))return false;}if(!r||r.closed||this.blockedByImmortal(r)||r.trap?.level===3||!melee&&this.roomHazards(r).includes('blindgas'))return false}return true;
 }
 meleeContact(a,b){
  if(a.team==='neutral'||b.team==='neutral')return false;
  const ad=this.unitData(a),bd=this.unitData(b),reach=bd.range<=.5?Math.max(ad.range,bd.range):ad.range;
  return distance(a,b)<=reach+.00001&&(Math.abs(a.x-b.x)<.02||Math.abs(a.y-b.y)<.02)&&this.lineOfSight(a,b,true)&&this.path(a,b,a.team,a)!==null;
 }
 unitData(u){return (u.team==='enemy'?ENEMIES[u.type]:UNITS[u.type])||UNITS[u.type]||{range:u.range||.42,speed:.6,power:u.power}}
 refreshDefensePlan(){
  const roster=this.enemies.map(e=>e.id).join(',')+'|'+this.allies.map(u=>u.id).join(',');
  if(!this._tactics||this._tacticsDirty||this._tacticsRoster!==roster||this.s.seconds-this._tactics.at>=.6){this._tactics=planDefense(this);this._tacticsRoster=roster;this._tacticsDirty=false}
 }
 defenseGoal(u){this.refreshDefensePlan();return this._tactics.assignments.get(u.id)?.goal||this.target}
 movementOrigin(u,next){const dx=next.x-u.x,dy=next.y-u.y;if(Math.abs(dx)>.00001)return this.room(next.x-Math.sign(dx),next.y);if(Math.abs(dy)>.00001)return this.room(next.x,next.y-Math.sign(dy));return null}
 attackPassageDoor(u,origin,next){
  const door=this.barricade(origin,next);if(!door)return false;
  if(u.cooldown<=0){this.damageBarricade(origin,next,u.power*1.8);if(door.kind==='offensive')this.damage(u,20*door.level);u.cooldown=1;u.attack=.3;this.events.push({type:'door-hit',unit:u.id})}
  return true;
 }
 moveUnit(u,next,dt){
  const at=this.room(Math.round(u.x),Math.round(u.y))||next,d=this.unitData(u);
  let speed=d.speed;if(u.team==='ally'&&['elevator','rails','shaft'].includes(at.type))speed*=2;
  if(['mud','labyrinth'].includes(at.type))speed*=.5;if(u.team==='enemy'&&at.type==='puzzle')speed*=.35;
  if(u.team==='ally'&&this.s.artifacts.includes('speed'))speed*=1.15;
  const origin=this.movementOrigin(u,next),door=u.team==='enemy'&&origin&&this.barricade(origin,next);
  if(door){
   const dx=next.x-origin.x,dy=next.y-origin.y,stop={x:origin.x+dx*.46,y:origin.y+dy*.46};
   if(distance(origin,u)>=.46-.00001){u.moveTarget=key(next.x,next.y);this.attackPassageDoor(u,origin,next);return}
   const travel=Math.min(speed*dt,distance(u,stop));u.x+=dx*travel;u.y+=dy*travel;u.walk+=travel*12;if(dx)u.facing=Math.sign(dx);u.moveTarget=key(next.x,next.y);return;
  }
  const dx=next.x-u.x,dy=next.y-u.y,len=Math.hypot(dx,dy),step=Math.min(len,speed*dt);
  if(len>0){u.x+=dx/len*step;u.y+=dy/len*step;u.walk+=step*12;if(dx)u.facing=Math.sign(dx)}
  u.moveTarget=key(next.x,next.y);
  if(len<=speed*dt+.00001){u.x=next.x;u.y=next.y;u.moveTarget=null;u.cooldown=Math.max(u.cooldown,d.range>.5?.18:0)}
 }
 damage(u,amount,{instant=false}={}){if(u.hp<=0||u.type==='immortal'&&!instant)return;if(instant)amount=u.hp+u.shield;const absorb=Math.min(u.shield,amount);u.shield-=absorb;u.hp-=amount-absorb;this.effects.push({x:u.x,y:u.y,kind:'hit',life:0.35});if(u.hp<=0){this._tacticsDirty=true;u.hp=0;this.effects.push({x:u.x,y:u.y,kind:'death',life:0.8});if(u.team==='enemy'){this.s.kills++;if(u.type==='guardian'&&this.s.rooms[u.home]?.type==='void')this.s.voidDefeated=true}else if(u.team==='ally')this.dead.push({...u});if(u.type==='immortal'){this.s.units=this.s.units.filter(v=>v.id!==u.id);const r=this.s.rooms[u.home];if(r){r.immortalId=null;if(r.type==='invincible')r.type='cave';r.closed=false;}this._routeCache=null;this.note('A criatura imortal foi eliminada por morte instantânea. A passagem está livre.','good')}this.events.push({type:'death',team:u.team})}}
 killInstant(u){this.damage(u,u.hp+u.shield,{instant:true})}
 update(dt){
  if(!this.s.combat||this.s.paused||this.s.status!=='playing')return;
  dt=Math.min(dt,0.1)*this.s.speed;this.s.seconds+=dt;
  for(const e of this.effects)e.life-=dt;this.effects=this.effects.filter(e=>e.life>0);
  for(const p of this.projectiles){p.t+=dt/p.duration;if(p.t>=1){const t=this.s.units.find(u=>u.id===p.target);if(t&&t.hp>0&&this.lineOfSight({x:p.x,y:p.y},t)&&Math.hypot(t.x-p.tx,t.y-p.ty)<.6)this.damage(t,p.damage)}}this.projectiles=this.projectiles.filter(p=>p.t<1);
  this._routeCache=new Map();this.refreshDefensePlan();const actors=[...this.s.units].filter(u=>u.hp>0&&u.team!=='neutral');const hits=[];
  for(const u of actors){
   u.attack=Math.max(0,u.attack-dt);u.cooldown-=dt;u.stun=Math.max(0,u.stun-dt);if(u.stun>0)continue;
   const d=this.unitData(u),at=this.room(Math.round(u.x),Math.round(u.y));if(!at)continue;
   if(this.lethalHazard(at,u)){this.killInstant(u);continue}
   const crossingFoe=d.range<=.5&&actors.some(v=>v.team!==u.team&&v.hp>0&&this.meleeContact(u,v));
   if(u.moveTarget&&!crossingFoe){const destination=this.s.rooms[u.moveTarget];if(destination&&this.passable(destination,u.team,u)&&((at.x===destination.x&&at.y===destination.y)||this.linked(at,destination))){this.moveUnit(u,destination,dt);continue}u.moveTarget=null;u.x=Math.round(u.x);u.y=Math.round(u.y);}
   if(u.team==='enemy'&&at.type==='arena'&&!u.loyal){this.damage(u,99999);this.s.baseMorale+=10;continue}
   if(u.team==='enemy'&&at.trap?.armed){if(at.trap.kind==='damage')this.damage(u,at.trap.level*10*8);else u.stun=at.trap.level*2;at.trap.armed=false;if(u.hp<=0)continue}
   if(u.type==='trapper'){for(const r of this.rooms)if(r.trap&&distance(r,u)<1.5)r.trap.armed=true}
   if(u.type==='cleric'&&u.team==='ally'&&u.cooldown<=0){for(const v of this.allies)if(distance(u,v)<=1.5)v.shield=Math.min(16,v.shield+16);u.cooldown=2.5;u.attack=0.3;continue}
   const opponents=actors.filter(v=>v.team!==u.team&&v.hp>0).sort((a,b)=>distance(u,a)-distance(u,b)||a.id-b.id);
   let target=opponents.find(v=>d.range>.5?distance(u,v)<=d.range&&this.lineOfSight(u,v):this.meleeContact(u,v));
   if(target&&!(u.type==='siege'&&u.shot)){
    if(u.cooldown<=0){let damage=u.power*1.8;if(u.team==='ally'){damage*=1+this.s.blessings*0.06+this.s.inventions*0.15;if(this.nearby(at,'kitchen',1).length)damage*=1.5;damage+=this.s.trophies*2;if(this.s.artifacts.includes('power'))damage*=1.1;if(this.s.artifacts.includes('invention'))damage*=1.2}
     if(target.x!==u.x)u.facing=Math.sign(target.x-u.x);u.attack=0.35;u.cooldown=u.type==='archer'?1.35:u.type==='mage'?1.5:1.1;u.shot=true;this.events.push({type:'attack',ranged:d.range>0.5,attacker:u.id,target:target.id,team:u.team});
     if(d.range>0.5){this.projectiles.push({x:u.x,y:u.y,tx:target.x,ty:target.y,target:target.id,damage,t:0,duration:Math.max(0.18,distance(u,target)*0.2),kind:u.type==='archer'?'arrow':u.type==='siege'?'bolt':u.type==='alchemist'?'flask':'orb',team:u.team})}else hits.push({target,damage});
    }continue;
   }
   if(d.speed<=0)continue;
   let goal=u.team==='enemy'?this.target:this.defenseGoal(u);if(!goal)continue;
   let route=this.path(u,goal,u.team,u);
   if(route===null&&u.team==='enemy'){
    if(u.cooldown<=0){if(!at.captured){at.captured=true;at.damaged=this.damageable(at);this.note(`${ROOMS[at.type].name} tomada pelos invasores.`, 'warn')}const next=this.neighbors(at,'enemy').find(r=>!r.captured);if(next)goal=next;else{at.garrison??=[];at.garrison.push({type:u.type,power:u.power});u.hp=0;this.note('Invasores se instalaram na área desconectada. Reconecte para retomá-la.','warn');continue}route=this.path(u,goal,'enemy');u.cooldown=1}
   }
   let next=route?.[0];
   if(!next){if(u.team==='enemy'&&distance(u,this.target)<.25&&!this.allies.some(a=>distance(a,this.target)<.55)){this.lose();break}continue}
   this.moveUnit(u,next,dt);

  }
  for(const h of hits)this.damage(h.target,h.damage);
  this.s.units=this.s.units.filter(u=>u.hp>0);
  if(this.s.status==='playing'&&!this.enemies.length)this.endCombat();
  this._routeCache=null;
 }
 endCombat(){this.s.combat=false;this.s.paused=false;this.s.battles++;this.projectiles=[];this.effects=[];
  const revived=new Set();for(const h of this.rooms.filter(r=>r.type==='hospital'&&this.active(r))){const u=this.dead.find(u=>!revived.has(u.id)&&Math.abs(u.x-h.x)<=2&&Math.abs(u.y-h.y)<=2);if(u){revived.add(u.id);u.hp=u.maxHp;this.s.units.push(u);this.note('O Hospital trouxe um defensor de volta.','good')}}
  for(const u of this.dead){if(!revived.has(u.id)&&u.type==='undead'&&this.roll(2)===2){u.hp=u.maxHp;this.s.units.push(u)}}
  for(const u of this.allies){u.hp=u.maxHp;u.shield=0;u.moveTarget=null;const r=this.s.rooms[u.home];if(r){u.x=r.x;u.y=r.y}}
  this.applyHazards();
  for(const r of this.rooms){if(r.trap)r.trap.armed=true;if(r.type==='solitary'&&!r.prisoners)r.prisoners=1;if(r.rewardPending&&!r.captured){r.rewardPending=false;if(r.type==='vault')this.gain(0,25);if(r.type==='rivalmine')this.gain(20,0);if(r.type==='tomb')this.magic(true);if(r.type==='challenge')this.addUnit('soldier',this.target.x,this.target.y,true);if(r.type==='rivalhold')this.gain(0,30)}}
  this.dead=[];this.gain(0,3+Math.floor(this.s.maxDepth/2));this.s.baseMorale+=1;if(this.has('museum'))this.s.trophies=Math.min(4,this.s.trophies+1);
  this.note('Vitória! Os sobreviventes se recuperam. +1 moral e espólios de guerra.','good');this.events.push({type:'victory'});
  if(this.s.expedition!==null){const p=PLANES[this.s.expedition];this.s.artifacts.push(p.effect);this.note(`Expedição vitoriosa: ${p.artifact}!`,'good');if(p.effect==='berserker'){const free=this.rooms.find(r=>r.type==='cave');if(free)free.type='meadhall'}this.s.expedition=null}
  if(this.s.voidDefeated&&this.rooms.some(r=>r.type==='void'&&!r.captured)){this.s.artifacts.push('void');this.s.status='won';this.note('O Cristal do Vazio é seu. A fortaleza conquistou o abismo.','good');this.events.push({type:'won'})}
 }
 lose(){this.s.status='lost';this.s.combat=false;this.note('Um invasor atravessou o último reduto. Sua fortaleza caiu.','danger');this.events.push({type:'lost'})}
 action(action,x,y,arg){
  const r=this.room(x,y);if(!r||this.s.status!=='playing')return{ok:false,reason:'Sala indisponível.'};
  if(action==='toggle'&&r.type==='drawbridge'){this._tacticsDirty=true;r.closed=!r.closed;if(r.closed){for(const u of this.enemies)if(Math.round(u.x)===x&&Math.round(u.y)===y)this.damage(u,400)}this.note(`Ponte levadiça ${r.closed?'fechada':'aberta'}.`);if(!r.closed)this.reconnectCaptured();this.spreadHazards();return{ok:true}}
  if(this.s.combat)return{ok:false,reason:'Indisponível em combate.'};
  if(action==='repair'){if(this.roomHazards(r).length)return{ok:false,reason:'Drene o fluido ou gás antes de reparar.'};const c=this.cost(r.type,r)||{resources:10,gold:0};const a=Math.floor(c.resources/2),b=Math.floor(c.gold/2);if(!r.damaged||this.s.resources<a||this.s.gold<b)return{ok:false,reason:'Sem dano ou recursos para reparar.'};this.s.resources-=a;this.s.gold-=b;r.damaged=false;if(r.captured){r.captured=false;this.spawnEnemies(r,r.type==='void'?110:20+Math.max(0,r.y)*5,r.type==='void'?'guardian':'raider');this.beginCombat()}return{ok:true}}
  if(action==='drain'){
   const hazards=this.roomHazards(r),magma=hazards.some(h=>['lava','crater'].includes(h)),cost=magma?20:5;
   if(!hazards.length||this.s.gold<cost)return {ok:false,reason:'Riquezas insuficientes ou nenhum perigo.'};
   this.s.gold-=cost;r.drainedSources=this.rooms.filter(n=>ROOMS[n.type]?.hazard).map(n=>key(n.x,n.y));
   if(ROOMS[r.type].hazard)r.type='cave';r.fluid=null;r.gas=null;r.contaminant=null;
   if(magma&&this.damageable(r))r.damaged=true;
   this.note(magma?'Magma drenado. A sala permanece danificada e precisa de reparo.':'Sala drenada. A construção original foi preservada.','good');return {ok:true};
  }
  if(action==='release'&&r.type==='ancientprison'){r.type='cave';if(this.roll(4)===4){this.addUnit('beast',x,y,true);this.note('A criatura libertada jurou lealdade.','good')}else{this.spawnEnemies(r,60+Math.max(0,y)*5,'beast');this.beginCombat()}return{ok:true}}
  if(action==='festival'){if(this.s.gold<10)return{ok:false,reason:'O festival custa 10♦.'};this.s.gold-=10;this.s.baseMorale+=5;this.note('Um festival aquece os corações. +5 moral.','good');return{ok:true}}
  if(action==='magic'&&['well','ancienttemple','sealed','ritual','chaos'].includes(r.type)){if(r.usedTurn===this.s.turn)return{ok:false,reason:'Já utilizado neste turno.'};if(r.type==='well'&&this.s.gold<10)return{ok:false,reason:'O desejo custa 10♦.'};if(r.type==='well')this.s.gold-=10;if(r.type==='chaos'){this.magic(false);this.gain(20,20)}this.magic(r.type==='ritual'||r.type==='chaos'?true:r.type==='sealed'?false:this.roll(2)===1);r.usedTurn=this.s.turn;if(r.type!=='well')r.type='cave';return{ok:true}}
  if(action==='steal'&&r.type==='dragon'){if(r.usedTurn===this.s.turn)return{ok:false,reason:'Um roubo por turno.'};r.usedTurn=this.s.turn;this.gain(0,20);if(this.roll(4)===1){this.spawnEnemies(r,100+Math.max(0,y)*5,'dragon');r.type='cave';this.beginCombat()}else this.note('20♦ roubadas. O dragão continua dormindo.','good');return{ok:true}}
  if(action==='closePortal'&&r.type==='portal'){if(this.s.gold<20)return{ok:false,reason:'Selar custa 20♦ nesta adaptação.'};this.s.gold-=20;r.type='cave';this.note('Portal selado. Não haverá novas invasões nesta sala.','good');return{ok:true}}
  if(action==='invention'&&r.type==='artificer'){if(this.s.gold<50)return{ok:false,reason:'Uma invenção custa 50♦.'};this.s.gold-=50;this.s.inventions++;this.note('Engenharia extraordinária: +15% de dano permanente.','good');return{ok:true}}
  if(action==='expedition'&&r.type==='stabilizer'){
   if(!Number.isInteger(arg)||!PLANES[arg]||this.s.artifacts.includes(PLANES[arg].effect))return{ok:false,reason:'Expedição inválida ou concluída.'};if(this.s.gold<20)return{ok:false,reason:'A expedição custa 20♦.'};this.s.gold-=20;this.s.expedition=arg;this.spawnEnemies(r,40+arg*5,'guardian');this.note(`Expedição: ${PLANES[arg].name}. Uma força do plano cruza o portal!`,'danger');this.beginCombat();return{ok:true};
  }
  if(action==='defense'){
   const kind=arg;if(['defensive','offensive'].includes(kind))return{ok:false,reason:'Escolha o corredor onde instalar a porta reforçada.'};const trap=kind==='damage'||kind==='delay';if(!['damage','delay','defensive','offensive','secret'].includes(kind))return{ok:false,reason:'Defesa inválida.'};if(!this.has(trap?'forge':'masonry'))return{ok:false,reason:trap?'Exige Forja.':'Exige Pedraria.'};
   const resources=kind==='damage'?20:kind==='delay'?15:0,gold=kind==='defensive'?10:kind==='offensive'?20:kind==='secret'?50:0;
   if(r.trap||r.secret)return{ok:false,reason:'A sala já tem uma defesa.'};if(this.s.resources<resources||this.s.gold<gold)return{ok:false,reason:'Recursos insuficientes.'};this.s.resources-=resources;this.s.gold-=gold;if(trap)r.trap={kind,level:1,armed:true};else if(kind==='secret')r.secret=true;this.note('Defesa instalada.','good');return{ok:true};
  }
  if(action==='upgrade'){
   const d=r.trap;if(!d||d.level>=3)return{ok:false,reason:'Sem defesa aprimorável.'};const cost=20;if(this.s.resources<cost)return{ok:false,reason:'Recursos insuficientes.'};this.s.resources-=cost;d.level++;this.note('Defesa aprimorada. Nível '+d.level+'.','good');return{ok:true};
  }
  return{ok:false,reason:'Ação indisponível.'};
 }
 reconnectCaptured(){for(const r of this.rooms){if(!r.captured||this.path(r,this.target)===null)continue;r.captured=false;const guards=r.garrison||[];if(guards.length){for(const u of guards)this.spawnEnemies(r,u.power/DIFFICULTIES[this.s.difficulty].enemy,u.type);r.garrison=[]}else this.spawnEnemies(r,20+Math.max(0,r.y)*5,r.type==='void'?'guardian':'raider');this.note('A reconexão despertou os ocupantes de '+ROOMS[r.type].name+'.','danger')}if(this.enemies.length)this.beginCombat()}
 magic(good){if(good){const n=this.roll(4);if(n===1){this.s.blessings++;this.note('Magia boa · Metal vivo: +6% de dano permanente.','good')}if(n===2){this.s.baseMorale+=5;this.note('Magia boa · Euforia: +5 moral.','good')}if(n===3){this.gain(15,10);this.note('Magia boa · Fortuna: +15♥ e +10♦.','good')}if(n===4){this.addUnit('soldier',this.target.x,this.target.y,true);this.note('Magia boa · Um guerreiro leal jura proteger a fortaleza.','good')}}else{if(this.has('temple')){this.note('O Templo dissipou uma maldição.','good');return}const n=this.roll(3);if(n===1){this.s.baseMorale-=3;this.note('Magia ruim · Sussurros: −3 moral.','danger')}if(n===2){this.s.gold=Math.max(0,this.s.gold-10);this.note('Magia ruim · Ferrugem: −10♦.','danger')}if(n===3){this.s.resources=Math.max(0,this.s.resources-10);this.note('Magia ruim · Praga: −10♥.','danger')}}}
 applyHazards(){
  let casualties=0;for(const u of this.s.units){if(u.hp<=0)continue;const r=this.room(Math.round(u.x),Math.round(u.y));if(r&&this.lethalHazard(r,u)){this.killInstant(u);casualties++}}
  if(casualties)this.note(`${casualties} unidade(s) foram derrotadas imediatamente por fluidos ou gás venenoso.`,'danger');
 }
 spreadHazards(){
  const gasTypes=['gas','flammable','miasma','blindgas'];
  // Fluid occupation persists after a source stops, closes or is drained elsewhere.
  for(const r of this.rooms){if(r.contaminant){if(gasTypes.includes(r.contaminant))r.gas??=r.contaminant;else r.fluid??=r.contaminant}}
  for(const source of this.rooms.filter(r=>ROOMS[r.type]?.hazard)){
   const gas=gasTypes.includes(source.type),sourceKey=key(source.x,source.y),queue=[{r:source,lateral:0}],seen=new Map();
   for(let i=0;i<queue.length;i++){
    const {r,lateral}=queue[i],rk=key(r.x,r.y);if((seen.get(rk)??Infinity)<=lateral)continue;seen.set(rk,lateral);
    if(r!==source&&(r.closed||!gas&&['pump','bridge','drawbridge'].includes(r.type)||r.drainedSources?.includes(sourceKey)))continue;
    if(gas)r.gas=source.type;else r.fluid=source.type;
    if(!gas&&['lava','crater'].includes(source.type)&&this.damageable(r)&&!['pump','bridge','drawbridge'].includes(r.type))r.damaged=true;
    if(!gas&&source.flowActive===false)continue;
    for(const[dx,dy]of DIRS){if(gas&&dy===1||!gas&&dy===-1||dx&&lateral>=2)continue;const n=this.room(r.x+dx,r.y+dy);if(n&&this.linked(r,n)&&!this.barricade(r,n))queue.push({r:n,lateral:lateral+(dx?1:0)})}
   }
  }
  const burning=this.rooms.filter(r=>r.gas==='flammable'&&['forge','tavern','barracks'].includes(r.type)),ignited=new Set();
  for(let i=0;i<burning.length;i++){const r=burning[i],rk=key(r.x,r.y);if(ignited.has(rk))continue;ignited.add(rk);
   for(const [dx,dy]of DIRS){const n=this.room(r.x+dx,r.y+dy);if(n&&this.linked(r,n)&&!this.barricade(r,n)&&!r.closed&&!n.closed&&(n.gas==='flammable'||n.type==='flammable')&&!ignited.has(key(n.x,n.y)))burning.push(n)}
  }
  if(ignited.size){
   for(const rk of ignited){const r=this.s.rooms[rk];if(this.damageable(r))r.damaged=true;
    for(const u of this.s.units)if(u.hp>0&&Math.round(u.x)===r.x&&Math.round(u.y)===r.y)this.killInstant(u);
    r.gas=null;r.contaminant=null;if(r.type==='flammable')r.type='cave';
   }this.note('Gás inflamável alcançou uma forja, taverna ou quartel: explosão! Todas as salas atingidas foram danificadas.','danger');
  }
  for(const r of this.rooms)r.contaminant=r.gas||r.fluid||null;
  this.applyHazards();
 }
 serialize(){return JSON.stringify({format:'conquer-save',version:1,state:this.s,projectiles:this.projectiles,dead:this.dead,savedAt:new Date().toISOString()})}
 static restore(json){
  let data;try{data=JSON.parse(json)}catch{throw Error('Arquivo de salvamento inválido.')}
  const s=data?.state;if(data?.format!=='conquer-save'||data.version!==1||!s||typeof s!=='object')throw Error('Formato de salvamento incompatível.');
  const finite=n=>typeof n==='number'&&Number.isFinite(n);const coordinate=n=>Number.isInteger(n)&&Math.abs(n)<=100;
  if(!s.rooms||Array.isArray(s.rooms)||Object.keys(s.rooms).length>2000||!s.rooms['0,0']||!Array.isArray(s.units)||s.units.length>3000||!Array.isArray(s.deck)||s.deck.length>54||!Array.isArray(s.log)||s.log.length>100||!['playing','lost','won'].includes(s.status)||!DIFFICULTIES[s.difficulty]||!finite(s.seed)||typeof s.name!=='string'||!Array.isArray(s.artifacts)||s.artifacts.length>30)throw Error('Estado de jogo inválido.');
  if(typeof s.combat!=='boolean'||typeof s.paused!=='boolean'||![.5,1,2].includes(s.speed)||!Number.isInteger(s.nextId)||s.nextId<1||!(s.expedition===null||Number.isInteger(s.expedition)&&s.expedition>=0&&s.expedition<PLANES.length))throw Error('Estado de combate inválido.');
  for(const n of ['turn','resources','gold','baseMorale','nextId','seconds','blessings','inventions','trophies','maxDepth','kills','battles'])if(!finite(s[n])||Math.abs(s[n])>1e9)throw Error('Valores inválidos no salvamento.');
  for(const[k,r]of Object.entries(s.rooms)){if(!r||!coordinate(r.x)||!coordinate(r.y)||key(r.x,r.y)!==k||!Object.hasOwn(ROOMS,r.type)||!Number.isInteger(r.variant)||r.variant<0||r.variant>2)throw Error('Mapa inválido.');if(r.trap&&(!['damage','delay'].includes(r.trap.kind)||![1,2,3].includes(r.trap.level)))throw Error('Armadilha inválida.');if(r.barricade&&(!['defensive','offensive'].includes(r.barricade.kind)||!finite(r.barricade.hp)))throw Error('Barricada inválida.')}
  const knownType=t=>Object.hasOwn(UNITS,t)||Object.hasOwn(ENEMIES,t);
  const validUnit=u=>u&&(u.frontTarget===undefined||u.frontTarget===null||Number.isInteger(u.frontTarget)&&u.frontTarget>0)&&(u.size===undefined||finite(u.size)&&u.size>0&&u.size<=5)&&(u.order===undefined||['guard','defend'].includes(u.order))&&(u.facing===undefined||[-1,1].includes(u.facing))&&knownType(u.type)&&(['ally','enemy'].includes(u.team)&&u.type!=='immortal'||u.team==='neutral'&&u.type==='immortal')&&['id','x','y','hp','maxHp','power','cooldown','shield','attack','walk','stun'].every(n=>finite(u[n]))&&u.maxHp>0&&u.power>0&&Math.abs(u.x)<=100&&Math.abs(u.y)<=100&&s.rooms[u.home];
  const ids=new Set();for(const u of s.units){if(!validUnit(u)||!['ally','enemy','neutral'].includes(u.team)||!finite(u.id)||ids.has(u.id)||!finite(u.x)||!finite(u.y)||Math.abs(u.x)>100||Math.abs(u.y)>100||!finite(u.hp)||!finite(u.maxHp)||!finite(u.power)||!finite(u.cooldown)||!finite(u.shield)||typeof u.type!=='string'||!s.rooms[u.home]||u.power<=0||u.maxHp<=0)throw Error('Unidade inválida.');ids.add(u.id)}
  for(const c of s.deck)if(!c||!SUITS.concat('★').includes(c.suit)||!Number.isInteger(c.rank)||c.rank<0||c.rank>13)throw Error('Baralho inválido.');
  for(const e of s.log)if(!e||typeof e.text!=='string'||e.text.length>2000||!finite(e.turn))throw Error('Crônica inválida.');
  if(!Array.isArray(data.projectiles)||data.projectiles.length>1000||!Array.isArray(data.dead)||data.dead.length>3000)throw Error('Combate inválido.');
  for(const p of data.projectiles)for(const n of ['x','y','tx','ty','target','damage','t','duration'])if(!finite(p[n])||p.duration<=0)throw Error('Projétil inválido.');
  if(data.dead.some(u=>!validUnit(u)))throw Error('Unidade caída inválida.');
  for(const r of Object.values(s.rooms)){if(r.garrison&&(!Array.isArray(r.garrison)||r.garrison.length>3000||r.garrison.some(u=>!knownType(u.type)||!finite(u.power)||u.power<=0)))throw Error('Guarnição inválida.')}
  const passageLegacy=s.passageVersion===undefined;
  if(!passageLegacy){
   if(s.passageVersion!==1||!s.passages||typeof s.passages!=='object'||Array.isArray(s.passages)||Object.keys(s.passages).length>4000)throw Error('Passagens inválidas.');
   for(const [id,value]of Object.entries(s.passages)){const ends=id.split('|'),a=s.rooms[ends[0]],b=s.rooms[ends[1]];if(value!==true||ends.length!==2||!a||!b||distance(a,b)!==1||ends.slice().sort().join('|')!==id)throw Error('Ligação inválida no mapa.');}
  }else{s.passages={};for(const r of Object.values(s.rooms))for(const [dx,dy]of [[1,0],[0,1]]){const n=s.rooms[key(r.x+dx,r.y+dy)];if(n)s.passages[[key(r.x,r.y),key(n.x,n.y)].sort().join('|')]=true}s.passageVersion=1;}
  if(s.barricadeVersion===undefined){
   s.barricades={};const oldRoomPath=(from,to)=>{const queue=[from],previous=new Map([[key(from.x,from.y),null]]);for(let i=0;i<queue.length;i++){const r=queue[i];if(r===to){let k=key(to.x,to.y);while(previous.get(k)&&previous.get(k)!==key(from.x,from.y))k=previous.get(k);return s.rooms[k]===from?null:s.rooms[k]}
    for(const [dx,dy]of DIRS){const n=s.rooms[key(r.x+dx,r.y+dy)];if(n&&s.passages[[key(r.x,r.y),key(n.x,n.y)].sort().join('|')]&&!previous.has(key(n.x,n.y))){previous.set(key(n.x,n.y),key(r.x,r.y));queue.push(n)}}}return null};
   for(const r of Object.values(s.rooms))if(r.barricade){const n=oldRoomPath(r,s.rooms['0,0'])||DIRS.map(([dx,dy])=>s.rooms[key(r.x+dx,r.y+dy)]).find(n=>n&&s.passages[[key(r.x,r.y),key(n.x,n.y)].sort().join('|')]);if(n)s.barricades[[key(r.x,r.y),key(n.x,n.y)].sort().join('|')]={...r.barricade,hp:Math.max(0,r.barricade.hp)};r.barricade=null;}s.barricadeVersion=1;
  }else if(s.barricadeVersion!==1||!s.barricades||typeof s.barricades!=='object'||Array.isArray(s.barricades))throw Error('Portas inválidas.');
  for(const [edge,d]of Object.entries(s.barricades)){if(!s.passages[edge]||!d||!['defensive','offensive'].includes(d.kind)||![1,2,3].includes(d.level)||!finite(d.hp)||d.hp<0||d.hp>1e7)throw Error('Porta reforçada inválida.');}
  const legacy=!s.rulesVersion;if(legacy){
   const typeByRoom={largelair:'troll',hungry:'troll',burrow:'worm',elemental:'elemental',golemforge:'golem',vault:'golem',void:'guardian',dragon:'dragon',crypt:'skeleton',nest:'insect',hive:'insect'};
   const groups=new Map(),remap=new Map(),merged=[];
   for(const u of s.units){
    if(u.team==='enemy'){
     const type=typeByRoom[s.rooms[u.home]?.type];if(type){u.type=type;u.enemyName=ENEMIES[type].name;u.size=ENEMIES[type].size;u.range=ENEMIES[type].range}
     else if(u.type==='raider')u.type='goblin';
     if(ENEMIES[u.type]?.single){const k=u.home+':'+u.type,first=groups.get(k);if(first){first.power+=u.power;first.hp+=u.hp;first.maxHp+=u.maxHp;first.shield+=u.shield;remap.set(u.id,first.id);continue}groups.set(k,u)}
    }
    if(Math.abs(u.x-Math.round(u.x))>.001&&Math.abs(u.y-Math.round(u.y))>.001){u.x=Math.round(u.x);u.y=Math.round(u.y);u.moveTarget=null}
    merged.push(u);
   }s.units=merged;for(const projectile of data.projectiles)projectile.target=remap.get(projectile.target)||projectile.target;s.rulesVersion=2;
  }
  for(const r of Object.values(s.rooms))if(!DAMAGEABLE_ROOMS.includes(r.type))r.damaged=false;
  const g=new Game();g.s=s;g.s.name=s.name.slice(0,40);g.s.paused=s.combat;for(const u of s.units){u.order='defend';if(u.frontTarget&&!s.units.some(e=>e.id===u.frontTarget&&e.team==='enemy'&&e.hp>0))u.frontTarget=null;u.size??=(u.team!=='ally'?ENEMIES[u.type]?.size:1)||1;u.facing??=1;if(u.moveTarget&&!s.rooms[u.moveTarget])u.moveTarget=null;}g.projectiles=data.projectiles;g.dead=data.dead;
  if(s.immortalVersion!==undefined&&s.immortalVersion!==1)throw Error('Versão de criatura imortal inválida.');
  for(const r of g.rooms){if(r.type==='invincible'){
   if(s.immortalVersion===undefined){r.closed=false;g.placeImmortal(r)}
   else if(!g.blockedByImmortal(r)||r.closed)throw Error('Criatura imortal ausente ou câmara inválida.');
  }else if(r.immortalId)throw Error('Criatura imortal fora da câmara.');}
  for(const u of g.s.units)if(u.type==='immortal'&&(u.hp<=0||u.team!=='neutral'||g.s.rooms[u.home]?.type!=='invincible'||g.s.rooms[u.home].immortalId!==u.id||u.x!==g.s.rooms[u.home].x||u.y!==g.s.rooms[u.home].y))throw Error('Criatura imortal inválida.');
  g.s.immortalVersion=1;g.events=[];return g;
 }
}
