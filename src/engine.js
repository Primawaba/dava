import {DIRS,ROOMS,UNITS,SUITS,NATURAL,REMNANTS,PLANES,DIFFICULTIES,ENEMIES} from './data.js';
export const key=(x,y)=>`${x},${y}`;
export const distance=(a,b)=>Math.abs(a.x-b.x)+Math.abs(a.y-b.y);
export const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export class Game {
 constructor({seed=Date.now(),name='A Última Fortaleza',difficulty='normal'}={}){
  this.s={version:1,rulesVersion:2,seed:(Number(seed)>>>0)||123456789,name:String(name).slice(0,40),difficulty:DIFFICULTIES[difficulty]?difficulty:'normal',turn:1,resources:20,gold:20,baseMorale:10,rooms:{},units:[],deck:[],discard:[],jokerAdded:false,combat:false,paused:false,speed:1,status:'playing',built:false,traded:false,turnReady:true,kills:0,battles:0,maxDepth:0,blessings:0,inventions:0,trophies:0,artifacts:[],expedition:null,voidDefeated:false,log:[],nextId:1,seconds:0,card:null};
  this.projectiles=[];this.effects=[];this.dead=[];this.events=[];this.tickBudget=0;
  this.addRoom(0,0,'gate');for(let i=0;i<5;i++){const u=this.addUnit('soldier',0,0,true);u.order=i<2?'guard':'defend'}
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
 addRoom(x,y,type){const r={x,y,type,variant:this.roll(3)-1,damaged:false,closed:false,prisoners:0,usedTurn:0,trap:null,barricade:null,secret:false,contaminant:null};this.s.rooms[key(x,y)]=r;return r}
 addUnit(type,x,y,loyal=false,team='ally',power=null){
  const d=(team==='enemy'?ENEMIES[type]:UNITS[type])||UNITS[type]||{power:power||5,speed:0.65,range:0.42};const p=power||d.power||5;
  const u={id:this.s.nextId++,type,team,loyal:loyal||d.mutiny===0,power:p,hp:p*8,maxHp:p*8,shield:0,x,y,home:key(x,y),cooldown:this.random()*0.6,attack:0,walk:0,shot:false,stun:0,order:'defend',size:d.size||1,facing:1};this.s.units.push(u);return u;
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
 passable(r,team='ally',unit=null){return !!r&&!r.closed&&!(team==='enemy'&&r.secret)&&!(r.trap?.level===3)&&!(unit&&this.lethalHazard(r,unit))}
 neighbors(r,team='ally',unit=null){return DIRS.map(([dx,dy])=>this.room(r.x+dx,r.y+dy)).filter(n=>this.passable(n,team,unit))}
 anchor(u){return this.s.rooms[u.moveTarget]||this.room(Math.round(u.x),Math.round(u.y))}
 path(start,end,team='ally',unit=null){
  const sk=typeof start==='string'?start:key(Math.round(start.x),Math.round(start.y));
  const ek=typeof end==='string'?end:key(Math.round(end.x),Math.round(end.y));
  const ck=`${sk}|${ek}|${team}|${unit?.type||'-'}|${unit?.team||'-'}`;if(this._routeCache?.has(ck))return this._routeCache.get(ck);
  const finish=result=>{this._routeCache?.set(ck,result);return result};
  if(!this.s.rooms[sk]||!this.s.rooms[ek])return finish(null);
  if(sk===ek)return finish([]);
  if(!this.passable(this.s.rooms[ek],team,unit))return finish(null);
  const open=[{k:sk,cost:0}],cost=new Map([[sk,0]]),prev=new Map([[sk,null]]);
  while(open.length){
   open.sort((a,b)=>a.cost-b.cost);const {k,cost:spent}=open.shift();if(spent!==cost.get(k))continue;
   if(k===ek){const out=[];let t=ek;while(t!==sk){out.unshift(this.s.rooms[t]);t=prev.get(t)}return finish(out)}
   for(const n of this.neighbors(this.s.rooms[k],team,unit)){
    const nk=key(n.x,n.y),step=['mud','labyrinth'].includes(n.type)?2:team==='enemy'&&n.type==='puzzle'?3:1;
    const nc=spent+step;if(nc>=(cost.get(nk)??Infinity))continue;cost.set(nk,nc);prev.set(nk,k);open.push({k:nk,cost:nc});
   }
  }return finish(null);
 }
 supported(r){return r.y>=-1||!!this.room(r.x,r.y+1)&&!this.room(r.x,r.y+1).damaged&&this.supported(this.room(r.x,r.y+1))}
 active(r){return !!r&&this.supported(r)&&!r.damaged&&!this.roomHazards(r).length&&this.passable(r)&&this.path(r,this.target,'ally',{type:'soldier'})!==null}
 has(type){return this.rooms.some(r=>r.type===type&&this.active(r))}
 nearby(r,type,radius=2){return this.rooms.filter(n=>n.type===type&&Math.abs(n.x-r.x)<=radius&&Math.abs(n.y-r.y)<=radius&&this.active(n))}
 capacities(){return{resources:50+50*this.rooms.filter(r=>r.type==='warehouse'&&this.active(r)).length,gold:50+50*this.rooms.filter(r=>r.type==='treasury'&&this.active(r)).length}}
 gain(r=0,g=0){const c=this.capacities();this.s.resources=clamp(this.s.resources+r,0,c.resources);this.s.gold=clamp(this.s.gold+g,0,c.gold)}
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
 frontier(){const out=new Map();for(const r of this.rooms){if(!this.active(r))continue;for(const[dx,dy]of DIRS){const x=r.x+dx,y=r.y+dy;if(x< -20||x>20||y<0||y>30||this.room(x,y))continue;out.set(key(x,y),{x,y})}}return [...out.values()]}
 explore(x,y){
  if(this.s.status!=='playing'||this.s.combat)return{ok:false,reason:'Resolva o combate antes de explorar.'};
  if(y<0)return{ok:false,reason:'A superfície não precisa ser explorada. Construa diretamente.'};
  if(!this.frontier().some(p=>p.x===x&&p.y===y))return{ok:false,reason:'Escolha um espaço adjacente conectado.'};
  if(!this.s.turnReady){this.s.turn++;this.s.built=false;this.s.traded=false;this.income();if(this.s.combat){this.s.turnReady=true;return{ok:false,reason:'Um portal iniciou uma invasão antes da exploração.'}}}
  this.s.turnReady=false;this.s.maxDepth=Math.max(this.s.maxDepth,y);let c=this.draw(y);
  while(y<=1&&c.suit==='♠')c=this.draw(y);
  const approach=DIRS.map(([dx,dy])=>this.room(x+dx,y+dy)).filter(r=>r&&this.active(r)).sort((a,b)=>(this.path(a,this.target)?.length??999)-(this.path(b,this.target)?.length??999))[0];
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
   if(n===12)msg='Uma criatura imortal bloqueia esta câmara. Aprisione-a para avançar.';
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
  const r=this.addRoom(x,y,type);r.rewardPending=enemy>0;r.flowActive=!(['water','lava','crater'].includes(type)&&approach?.x===x&&approach?.y===y-1);if(c.suit==='♠'&&c.rank===7)r.damaged=true;
  this.note(msg,enemy?'danger':'good');
  if(type==='invincible')r.closed=true;
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
 build(type,x,y){let r=this.site(x,y);const reason=this.buildReason(type,r);if(reason)return{ok:false,reason};const c=this.cost(type,r);if(!this.room(x,y))r=this.addRoom(x,y,'cave');this.s.resources-=c.resources;this.s.gold-=c.gold;r.type=type;r.variant=this.roll(3)-1;r.contaminant=null;this.s.built=true;
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
 trade(direction,amount=1){if(this.s.status!=='playing'||this.s.combat||this.s.traded)return{ok:false,reason:'Uma troca por turno, fora de combate.'};if(!Number.isInteger(amount)||amount<1)return{ok:false,reason:'Quantidade inválida.'};const c=this.capacities();if(direction==='gold'){amount=Math.min(amount,this.s.gold,Math.floor((c.resources-this.s.resources)/2));if(amount<1)return{ok:false,reason:'Sem riquezas ou espaço no armazém.'};this.s.gold-=amount;this.s.resources+=amount*2;}else{amount=Math.min(amount,Math.floor(this.s.resources/2),c.gold-this.s.gold);if(amount<1)return{ok:false,reason:'Sem recursos ou espaço na tesouraria.'};this.s.resources-=amount*2;this.s.gold+=amount}this.s.traded=true;this.note(`Troca concluída: ${amount}${direction==='gold'?'♦ → '+amount*2+'♥':'♦ recebidas por '+amount*2+'♥'}.`);return{ok:true}}
 checkMutiny(){const morale=this.morale();for(const u of this.allies){const threshold=UNITS[u.type]?.mutiny||0;if(!u.loyal&&morale<threshold){u.team='enemy';this.note(`${UNITS[u.type].name} se amotinou! Moral ${morale} < ${threshold}.`,'danger')}}if(this.enemies.length&&!this.s.combat)this.beginCombat()}
 spawnEnemies(r,total,type='raider'){
  total=Math.max(1,Math.round(total*DIFFICULTIES[this.s.difficulty].enemy));const d=ENEMIES[type]||ENEMIES.raider;
  const n=d.single?1:Math.min(8,Math.max(1,Math.ceil(total/8)));
  for(let i=0;i<n;i++){const u=this.addUnit(type,r.x,r.y,true,'enemy',total/n);u.range=d.range;u.size=d.size;u.enemyName=d.name;}
 }
 ensureGuards(){const guards=this.allies.filter(u=>u.order==='guard');if(guards.length>=2)return;const candidates=this.allies.filter(u=>u.order!=='guard'&&this.unitData(u).range<=.5&&this.unitData(u).speed>0).sort((a,b)=>distance(a,this.target)-distance(b,this.target)||b.power-a.power||a.id-b.id);for(const u of candidates.slice(0,2-guards.length))u.order='guard'}
 beginCombat(){if(this.s.combat)return;this.s.combat=true;this.s.paused=false;this.dead=[];this.ensureGuards();
  for(const u of this.s.units){u.shot=false;u.cooldown=this.random();u.shield=0;u.moveTarget=null;u.targetId=null;
   if(u.team==='ally'){const r=this.s.rooms[u.home];if(r){u.x=r.x;u.y=r.y}if(this.has('temple'))u.shield+=20}
  }
  this.spreadHazards();
  this.note('Às armas! A guarnição mantém o último reduto; as outras tropas interceptam os invasores.','danger');this.events.push({type:'combat'});
 }
 lineOfSight(a,b){
  const eps=.015,vertical=Math.abs(a.x-b.x)<eps,horizontal=Math.abs(a.y-b.y)<eps;
  if(!vertical&&!horizontal)return false;
  if(vertical&&Math.abs(a.x-Math.round(a.x))>eps)return false;
  if(horizontal&&Math.abs(a.y-Math.round(a.y))>eps)return false;
  const ax=Math.round(a.x),ay=Math.round(a.y),bx=Math.round(b.x),by=Math.round(b.y);
  const dx=Math.sign(bx-ax),dy=Math.sign(by-ay),n=Math.abs(bx-ax)+Math.abs(by-ay);
  for(let i=0;i<=n;i++){const r=this.room(ax+dx*i,ay+dy*i);if(!r||r.closed||r.trap?.level===3||this.roomHazards(r).includes('blindgas')||(r.barricade?.kind==='defensive'&&r.barricade.hp>0))return false}return true;
 }
 unitData(u){return (u.team==='enemy'?ENEMIES[u.type]:UNITS[u.type])||UNITS[u.type]||{range:u.range||.42,speed:.6,power:u.power}}
 defenseGoal(u){
  const here=this.anchor(u),objective=this.target;if(!here)return objective;
  if(u.order==='guard')return objective;
  const threats=this.enemies.map(e=>({e,route:this.path(this.anchor(e)||e,objective,'enemy',e)})).filter(t=>t.route!==null).sort((a,b)=>a.route.length-b.route.length||a.e.id-b.e.id);
  if(!threats.length)return objective;
  const threat=threats[0],data=this.unitData(u);
  if(data.range>.5){
   const choices=this.rooms.filter(r=>this.path(r,objective,'ally',u)!==null&&distance(r,objective)<=2&&distance(r,threat.e)<=data.range&&this.lineOfSight(r,threat.e));
   choices.sort((a,b)=>(this.path(here,a,'ally',u)?.length??999)-(this.path(here,b,'ally',u)?.length??999)||distance(a,objective)-distance(b,objective));
   return choices[0]||objective;
  }
  const route=threat.route;const intercept=route.length>2?route[route.length-3]:(this.anchor(threat.e)||objective);
  return this.path(here,intercept,'ally',u)!==null?intercept:objective;
 }
 moveUnit(u,next,dt){
  const at=this.room(Math.round(u.x),Math.round(u.y))||next,d=this.unitData(u);
  let speed=d.speed;if(u.team==='ally'&&['elevator','rails','shaft'].includes(at.type))speed*=2;
  if(['mud','labyrinth'].includes(at.type))speed*=.5;if(u.team==='enemy'&&at.type==='puzzle')speed*=.35;
  if(u.team==='ally'&&this.s.artifacts.includes('speed'))speed*=1.15;
  const dx=next.x-u.x,dy=next.y-u.y,len=Math.hypot(dx,dy),step=Math.min(len,speed*dt);
  if(len>0){u.x+=dx/len*step;u.y+=dy/len*step;u.walk+=step*12;if(dx)u.facing=Math.sign(dx)}
  u.moveTarget=key(next.x,next.y);
  if(len<=speed*dt+.00001){u.x=next.x;u.y=next.y;u.moveTarget=null;u.cooldown=Math.max(u.cooldown,d.range>.5?.18:0)}
 }
 damage(u,amount){if(u.hp<=0)return;const absorb=Math.min(u.shield,amount);u.shield-=absorb;u.hp-=amount-absorb;this.effects.push({x:u.x,y:u.y,kind:'hit',life:0.35});if(u.hp<=0){u.hp=0;this.effects.push({x:u.x,y:u.y,kind:'death',life:0.8});if(u.team==='enemy'){this.s.kills++;if(u.type==='guardian'&&this.s.rooms[u.home]?.type==='void')this.s.voidDefeated=true}else this.dead.push({...u});this.events.push({type:'death',team:u.team})}}
 update(dt){
  if(!this.s.combat||this.s.paused||this.s.status!=='playing')return;
  dt=Math.min(dt,0.1)*this.s.speed;this.s.seconds+=dt;
  for(const e of this.effects)e.life-=dt;this.effects=this.effects.filter(e=>e.life>0);
  for(const p of this.projectiles){p.t+=dt/p.duration;if(p.t>=1){const t=this.s.units.find(u=>u.id===p.target);if(t&&t.hp>0&&this.lineOfSight({x:p.x,y:p.y},t)&&Math.hypot(t.x-p.tx,t.y-p.ty)<.6)this.damage(t,p.damage)}}this.projectiles=this.projectiles.filter(p=>p.t<1);
  this._routeCache=new Map();this.ensureGuards();const actors=[...this.s.units].filter(u=>u.hp>0);const hits=[];
  for(const u of actors){
   u.attack=Math.max(0,u.attack-dt);u.cooldown-=dt;u.stun=Math.max(0,u.stun-dt);if(u.stun>0)continue;
   const d=this.unitData(u),at=this.room(Math.round(u.x),Math.round(u.y));if(!at)continue;
   if(this.lethalHazard(at,u)){this.damage(u,Number.MAX_SAFE_INTEGER);continue}
   const crossingFoe=d.range<=.5&&actors.some(v=>v.team!==u.team&&v.hp>0&&distance(u,v)<=d.range&&(Math.abs(u.x-v.x)<.02||Math.abs(u.y-v.y)<.02));
   if(u.moveTarget&&!crossingFoe){const destination=this.s.rooms[u.moveTarget];if(destination&&this.passable(destination,u.team,u)){this.moveUnit(u,destination,dt);continue}u.moveTarget=null;u.x=Math.round(u.x);u.y=Math.round(u.y);}
   if(u.team==='enemy'&&at.type==='arena'&&!u.loyal){this.damage(u,99999);this.s.baseMorale+=10;continue}
   if(u.team==='enemy'&&at.trap?.armed){if(at.trap.kind==='damage')this.damage(u,at.trap.level*10*8);else u.stun=at.trap.level*2;at.trap.armed=false;if(u.hp<=0)continue}
   if(u.type==='trapper'){for(const r of this.rooms)if(r.trap&&distance(r,u)<1.5)r.trap.armed=true}
   if(u.type==='cleric'&&u.team==='ally'&&u.cooldown<=0){for(const v of this.allies)if(distance(u,v)<=1.5)v.shield=Math.min(16,v.shield+16);u.cooldown=2.5;u.attack=0.3;continue}
   const opponents=actors.filter(v=>v.team!==u.team&&v.hp>0).sort((a,b)=>distance(u,a)-distance(u,b)||a.id-b.id);
   let target=opponents.find(v=>distance(u,v)<=d.range&&(d.range>.5?this.lineOfSight(u,v):(Math.abs(u.x-v.x)<.02||Math.abs(u.y-v.y)<.02)&&this.path(u,v,u.team,u)!==null));
   const barrier=u.team==='enemy'&&at.barricade?.hp>0?at.barricade:null;
   if(barrier){if(u.cooldown<=0){barrier.hp-=u.power*1.8;if(barrier.kind==='offensive')this.damage(u,20*barrier.level);u.cooldown=1;u.attack=0.3}continue}
   if(target&&!(u.type==='siege'&&u.shot)){
    if(u.cooldown<=0){let damage=u.power*1.8;if(u.team==='ally'){damage*=1+this.s.blessings*0.06+this.s.inventions*0.15;if(this.nearby(at,'kitchen',1).length)damage*=1.5;damage+=this.s.trophies*2;if(this.s.artifacts.includes('power'))damage*=1.1;if(this.s.artifacts.includes('invention'))damage*=1.2}
     if(target.x!==u.x)u.facing=Math.sign(target.x-u.x);u.attack=0.35;u.cooldown=u.type==='archer'?1.35:u.type==='mage'?1.5:1.1;u.shot=true;this.events.push({type:'attack',ranged:d.range>0.5});
     if(d.range>0.5){this.projectiles.push({x:u.x,y:u.y,tx:target.x,ty:target.y,target:target.id,damage,t:0,duration:Math.max(0.18,distance(u,target)*0.2),kind:u.type==='archer'?'arrow':u.type==='siege'?'bolt':u.type==='alchemist'?'flask':'orb',team:u.team})}else hits.push({target,damage});
    }continue;
   }
   if(d.speed<=0)continue;
   let goal=u.team==='enemy'?this.target:this.defenseGoal(u);if(!goal)continue;
   let route=this.path(u,goal,u.team,u);
   if(route===null&&u.team==='enemy'){
    if(u.cooldown<=0){if(!at.captured){at.captured=true;at.damaged=at.type!=='gate'&&at.type!=='throne';this.note(`${ROOMS[at.type].name} tomada pelos invasores.`, 'warn')}const next=this.neighbors(at,'enemy').find(r=>!r.captured);if(next)goal=next;else{at.garrison??=[];at.garrison.push({type:u.type,power:u.power});u.hp=0;this.note('Invasores se instalaram na área desconectada. Reconecte para retomá-la.','warn');continue}route=this.path(u,goal,'enemy');u.cooldown=1}
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
  if(action==='toggle'&&r.type==='drawbridge'){r.closed=!r.closed;if(r.closed){for(const u of this.enemies)if(Math.round(u.x)===x&&Math.round(u.y)===y)this.damage(u,400)}this.note(`Ponte levadiça ${r.closed?'fechada':'aberta'}.`);if(!r.closed)this.reconnectCaptured();this.spreadHazards();return{ok:true}}
  if(this.s.combat)return{ok:false,reason:'Indisponível em combate.'};
  if(action==='repair'){if(this.roomHazards(r).length)return{ok:false,reason:'Drene o fluido ou gás antes de reparar.'};const c=this.cost(r.type,r)||{resources:10,gold:0};const a=Math.floor(c.resources/2),b=Math.floor(c.gold/2);if(!r.damaged||this.s.resources<a||this.s.gold<b)return{ok:false,reason:'Sem dano ou recursos para reparar.'};this.s.resources-=a;this.s.gold-=b;r.damaged=false;if(r.captured){r.captured=false;this.spawnEnemies(r,r.type==='void'?110:20+Math.max(0,r.y)*5,r.type==='void'?'guardian':'raider');this.beginCombat()}return{ok:true}}
  if(action==='drain'){
   const hazards=this.roomHazards(r),magma=hazards.some(h=>['lava','crater'].includes(h)),cost=magma?20:5;
   if(!hazards.length||this.s.gold<cost)return {ok:false,reason:'Riquezas insuficientes ou nenhum perigo.'};
   this.s.gold-=cost;r.drainedSources=this.rooms.filter(n=>ROOMS[n.type]?.hazard).map(n=>key(n.x,n.y));
   if(ROOMS[r.type].hazard)r.type='cave';r.fluid=null;r.gas=null;r.contaminant=null;
   if(magma)r.damaged=true;
   this.note(magma?'Magma drenado. A sala permanece danificada e precisa de reparo.':'Sala drenada. A construção original foi preservada.','good');return {ok:true};
  }
  if(action==='sealImmortal'&&r.type==='invincible'){if(this.s.gold<20)return{ok:false,reason:'Aprisionar custa 20♦.'};this.s.gold-=20;r.type='cave';r.closed=false;this.note('O imortal foi aprisionado nas profundezas da pedra.','good');return{ok:true}}
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
   const kind=arg;const trap=kind==='damage'||kind==='delay';if(!['damage','delay','defensive','offensive','secret'].includes(kind))return{ok:false,reason:'Defesa inválida.'};if(!this.has(trap?'forge':'masonry'))return{ok:false,reason:trap?'Exige Forja.':'Exige Pedraria.'};
   const resources=kind==='damage'?20:kind==='delay'?15:0,gold=kind==='defensive'?10:kind==='offensive'?20:kind==='secret'?50:0;
   if(r.trap||r.barricade||r.secret)return{ok:false,reason:'A sala já tem uma defesa.'};if(this.s.resources<resources||this.s.gold<gold)return{ok:false,reason:'Recursos insuficientes.'};this.s.resources-=resources;this.s.gold-=gold;if(trap)r.trap={kind,level:1,armed:true};else if(kind==='secret')r.secret=true;else r.barricade={kind,level:1,hp:kind==='defensive'?400:160};this.note('Defesa instalada.','good');return{ok:true};
  }
  if(action==='upgrade'){
   const d=r.trap||r.barricade;if(!d||d.level>=3)return{ok:false,reason:'Sem defesa aprimorável.'};const cost=r.trap?20:10;if(this.s.resources<cost)return{ok:false,reason:'Recursos insuficientes.'};this.s.resources-=cost;d.level++;if(r.barricade)d.hp+=d.kind==='defensive'?400:160;this.note('Defesa aprimorada. Nível '+d.level+'.','good');return{ok:true};
  }
  return{ok:false,reason:'Ação indisponível.'};
 }
 reconnectCaptured(){for(const r of this.rooms){if(!r.captured||this.path(r,this.target)===null)continue;r.captured=false;const guards=r.garrison||[];if(guards.length){for(const u of guards)this.spawnEnemies(r,u.power/DIFFICULTIES[this.s.difficulty].enemy,u.type);r.garrison=[]}else this.spawnEnemies(r,20+Math.max(0,r.y)*5,r.type==='void'?'guardian':'raider');this.note('A reconexão despertou os ocupantes de '+ROOMS[r.type].name+'.','danger')}if(this.enemies.length)this.beginCombat()}
 magic(good){if(good){const n=this.roll(4);if(n===1){this.s.blessings++;this.note('Magia boa · Metal vivo: +6% de dano permanente.','good')}if(n===2){this.s.baseMorale+=5;this.note('Magia boa · Euforia: +5 moral.','good')}if(n===3){this.gain(15,10);this.note('Magia boa · Fortuna: +15♥ e +10♦.','good')}if(n===4){this.addUnit('soldier',this.target.x,this.target.y,true);this.note('Magia boa · Um guerreiro leal jura proteger a fortaleza.','good')}}else{if(this.has('temple')){this.note('O Templo dissipou uma maldição.','good');return}const n=this.roll(3);if(n===1){this.s.baseMorale-=3;this.note('Magia ruim · Sussurros: −3 moral.','danger')}if(n===2){this.s.gold=Math.max(0,this.s.gold-10);this.note('Magia ruim · Ferrugem: −10♦.','danger')}if(n===3){this.s.resources=Math.max(0,this.s.resources-10);this.note('Magia ruim · Praga: −10♥.','danger')}}}
 applyHazards(){
  let casualties=0;for(const u of this.s.units){if(u.hp<=0)continue;const r=this.room(Math.round(u.x),Math.round(u.y));if(r&&this.lethalHazard(r,u)){this.damage(u,Number.MAX_SAFE_INTEGER);casualties++}}
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
    if(r!==source&&(r.closed||!gas&&['pump','bridge','drawbridge'].includes(r.type)||r.barricade?.kind==='defensive'&&r.barricade.hp>0||r.drainedSources?.includes(sourceKey)))continue;
    if(gas)r.gas=source.type;else r.fluid=source.type;
    if(!gas&&['lava','crater'].includes(source.type)&&!['pump','bridge','lava','crater'].includes(r.type))r.damaged=true;
    if(!gas&&source.flowActive===false)continue;
    for(const[dx,dy]of DIRS){if(gas&&dy===1||!gas&&dy===-1||dx&&lateral>=2)continue;const n=this.room(r.x+dx,r.y+dy);if(n)queue.push({r:n,lateral:lateral+(dx?1:0)})}
   }
  }
  const ignition=this.rooms.some(r=>r.gas==='flammable'&&['forge','tavern','barracks'].includes(r.type));
  if(ignition){
   for(const r of this.rooms){if(r.gas!=='flammable'&&r.type!=='flammable')continue;if(ROOMS[r.type].r!==undefined)r.damaged=true;
    for(const u of this.s.units)if(u.hp>0&&Math.round(u.x)===r.x&&Math.round(u.y)===r.y)this.damage(u,Number.MAX_SAFE_INTEGER);
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
  const validUnit=u=>u&&(u.size===undefined||finite(u.size)&&u.size>0&&u.size<=5)&&(u.order===undefined||['guard','defend'].includes(u.order))&&(u.facing===undefined||[-1,1].includes(u.facing))&&knownType(u.type)&&['ally','enemy'].includes(u.team)&&['id','x','y','hp','maxHp','power','cooldown','shield','attack','walk','stun'].every(n=>finite(u[n]))&&u.maxHp>0&&u.power>0&&Math.abs(u.x)<=100&&Math.abs(u.y)<=100&&s.rooms[u.home];
  const ids=new Set();for(const u of s.units){if(!validUnit(u)||!['ally','enemy'].includes(u.team)||!finite(u.id)||ids.has(u.id)||!finite(u.x)||!finite(u.y)||Math.abs(u.x)>100||Math.abs(u.y)>100||!finite(u.hp)||!finite(u.maxHp)||!finite(u.power)||!finite(u.cooldown)||!finite(u.shield)||typeof u.type!=='string'||!s.rooms[u.home]||u.power<=0||u.maxHp<=0)throw Error('Unidade inválida.');ids.add(u.id)}
  for(const c of s.deck)if(!c||!SUITS.concat('★').includes(c.suit)||!Number.isInteger(c.rank)||c.rank<0||c.rank>13)throw Error('Baralho inválido.');
  for(const e of s.log)if(!e||typeof e.text!=='string'||e.text.length>2000||!finite(e.turn))throw Error('Crônica inválida.');
  if(!Array.isArray(data.projectiles)||data.projectiles.length>1000||!Array.isArray(data.dead)||data.dead.length>3000)throw Error('Combate inválido.');
  for(const p of data.projectiles)for(const n of ['x','y','tx','ty','target','damage','t','duration'])if(!finite(p[n])||p.duration<=0)throw Error('Projétil inválido.');
  if(data.dead.some(u=>!validUnit(u)))throw Error('Unidade caída inválida.');
  for(const r of Object.values(s.rooms)){if(r.garrison&&(!Array.isArray(r.garrison)||r.garrison.length>3000||r.garrison.some(u=>!knownType(u.type)||!finite(u.power)||u.power<=0)))throw Error('Guarnição inválida.')}
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
  const g=new Game();g.s=s;g.s.name=s.name.slice(0,40);g.s.paused=s.combat;for(const u of s.units){u.order??=(u.team==='ally'&&u.home==='0,0'&&u.loyal&&u.type==='soldier'&&u.id<=2)?'guard':'defend';u.size??=(u.team==='enemy'?ENEMIES[u.type]?.size:1)||1;u.facing??=1;if(u.moveTarget&&!s.rooms[u.moveTarget])u.moveTarget=null;}g.projectiles=data.projectiles;g.dead=data.dead;g.events=[];return g;
 }
}
