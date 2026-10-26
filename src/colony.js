import {CAPTURE_ROOMS,captiveKind,validCaptive,heldCaptives,clearCaptives} from './captivity.js';
import {ROOMS,UNITS,ENEMIES,DIRS} from './data.js';
import {planFormation,BUILD_FOOTPRINTS} from './formations.js';
export const SUPPORT_JOBS={crystal:'miner',mine:'miner',rivalmine:'miner',forest:'lumberjack',hive:'attendant',elemental:'miner',city:'attendant',games:'attendant',parlor:'attendant',prison:'attendant',concert:'engineer',brewery:'cook',dragonforge:'smith',trapmaster:'engineer',endersgate:'scholar',orefinder:'engineer',forge:'smith',masonry:'mason',library:'scholar',kitchen:'cook',workshop:'engineer',artificer:'engineer',laboratory:'scholar',warehouse:'attendant',treasury:'attendant',museum:'attendant',inspection:'scholar',laundry:'attendant',hospital:'attendant',persuasion:'attendant',hiring:'scholar'};
export const ROOM_AURAS={kitchen:[1,1],workshop:[2,2],inspection:[2,2],laundry:[2,2],tavern:[2,2],games:[2,2],arena:[2,2],parlor:[2,2],altar:[3,3],temple:[3,2],museum:[3,2],hospital:[2,2],sewer:[2,2]};
const colonyKey=r=>`${r.x},${r.y}`;
const colonyDistance=(a,b)=>Math.abs(a.x-b.x)+Math.abs(a.y-b.y);
export function installColony(Game){
 const original={};for(const name of ['build','buildFootprint','income','endCombat','update','effectTargets','resolveEffect','damageBarricade','barricade','expandFormation','expandEmptyCavern','releaseCaptive','checkPrisonEscapes','lose','morale','unitData','threshold'])original[name]=Game.prototype[name];
 Object.assign(Game.prototype,{
  captureRooms(){return this.rooms.filter(r=>CAPTURE_ROOMS.includes(r.type)&&!r.builtPartOf&&this.active(r));},
  captureRoomAvailable(r){
   if(!r||!CAPTURE_ROOMS.includes(r.type)||!this.active(r))return false;
   if(r.type==='kennel')return !this.allies.some(u=>u.home===colonyKey(r)&&u.kennelMonster)&&this.allies.filter(u=>u.home===colonyKey(r)).length<this.capacity(r);
   return r.type==='prison'?(r.prisoners||0)<20:!r.captive;
  },
  captureAccepts(r,c){return this.captureRoomAvailable(r)&&captiveKind(c)===(r.type==='kennel'?'monster':'person');},
  captureSlots(card){return (card.input.slots||this.captureRooms().map(colonyKey)).map(id=>this.s.rooms[id]).filter(r=>r&&CAPTURE_ROOMS.includes(r.type));},
  captureChoices(card){
   const i=card.input,a=i.assignments||{},out=[];
   for(const r of this.captureSlots(card)){
    const id=colonyKey(r);out.push({value:id+'#none',label:'Não usar '+ROOMS[r.type].name});
    for(const [n,c]of i.captives.entries())if(this.captureAccepts(r,c)&&!Object.entries(a).some(([other,index])=>other!==id&&index===n))out.push({value:id+'#'+n,label:c.name+' → '+ROOMS[r.type].name});
   }
   out.push({value:'confirm',label:'Confirmar capturas'});
   if(!i.slots)for(const [index,c]of i.captives.entries())if(this.captureSlots(card).some(r=>this.captureAccepts(r,c)))out.push({value:String(index),label:'Capturar '+c.name});
   return out;
  },
  resolveCapture(card,selection){
   const i=card.input;i.assignments??={};
   if(selection==='cancel'){this.s.effectCards.shift();return{ok:true};}
   if(!this.captureChoices(card).some(o=>o.value===String(selection)))return{ok:false,reason:'Escolha uma combinação válida de criatura e estrutura.'};
   if(/^\d+$/.test(String(selection))&&!i.slots){const index=Number(selection),r=this.captureSlots(card).find(r=>this.captureAccepts(r,i.captives[index]));i.assignments[colonyKey(r)]=index;selection='confirm';}
   if(selection!=='confirm'){
    const [id,index]=String(selection).split('#');if(index==='none')delete i.assignments[id];else i.assignments[id]=Number(index);
    return{ok:true,pending:true};
   }
   const chosen=Object.entries(i.assignments),used=new Set(),slots=new Set(this.captureSlots(card).map(colonyKey));
   for(const [id,index]of chosen){if(!slots.has(id)||!Number.isInteger(index)||!i.captives[index]||used.has(index)||!this.captureAccepts(this.s.rooms[id],i.captives[index]))return{ok:false,reason:'Uma das capturas ficou indisponível. Revise as escolhas antes de confirmar.'};used.add(index);}
   for(const [id,index]of chosen){
    const r=this.s.rooms[id],record={...i.captives[index],...(i.captives[index].traits?{traits:[...i.captives[index].traits]}:{})};
    if(r.type==='kennel'){
     const u=this.addUnit(record.type,r.x,r.y,true,'ally',record.power);u.range=record.range;u.size=record.size;u.enemyName=record.name;u.kennelMonster=true;u.capturedSource=record.sourceId;u.traits=[...(record.traits||[])];if(record.monstrosity)u.monstrosity=true;
     this.effect('Monstro capturado',`${record.name}, de ${Math.round(record.power)} STR, juntou-se à fortaleza e passou a morar no Canil.`,'good');
    }else{
     if(r.type==='prison'){
      const records=[...heldCaptives(r)];while(records.length<(r.prisoners||0))records.push({type:'raider',power:1,name:'Prisioneiro de uma jornada anterior',range:.42,size:1,mutiny:12});
      r.captives=[...records,record];r.captive=r.captives[0];r.prisoners=r.captives.length;
     }else {r.captive=record;r.prisoners=1;}
     this.effect('Prisioneiro capturado',`${record.name} foi levado a ${ROOMS[r.type].name}.`,'neutral');
    }
   }
   this.s.effectCards.shift();this.syncPrisonBars();this._tacticsDirty=true;return{ok:true};
  },
  confineRats(){
   for(const u of this.s.units.filter(u=>u.type==='rat'&&u.hp>0)){
    const home=this.s.rooms[u.home],sewer=home?.type==='sewer'?home:this.rooms.find(r=>r.type==='sewer');
    if(!sewer){u.hp=0;this.effect('Colônia dispersa','Sem um esgoto, os ratos deixaram a fortaleza.','neutral');continue;}
    u.home=colonyKey(sewer);u.x=sewer.x;u.y=sewer.y;u.moveTarget=null;u.walk=0;delete u.frontTarget;delete u.casualPlan;
   }
  },

  auraCells(r){if(!r)return[];const root=r.builtPartOf?this.s.rooms[r.builtPartOf]:r;if(!root)return[];const radius=ROOM_AURAS[root.type];if(!radius)return[];const members=(root.footprint||[colonyKey(root)]).map(id=>this.s.rooms[id]).filter(Boolean),cx=members.reduce((sum,p)=>sum+p.x,0)/members.length,cy=members.reduce((sum,p)=>sum+p.y,0)/members.length,width=['museum','temple'].includes(root.type)?6:radius[0]*2+1,height=radius[1]*2+1,left=Math.ceil(cx-(width-1)/2),top=Math.ceil(cy-(height-1)/2);return Array.from({length:width*height},(_,i)=>({x:left+i%width,y:top+Math.floor(i/width)}));},
  inAura(r,target){return this.auraCells(r).some(p=>p.x===Math.round(target.x)&&p.y===Math.round(target.y));},
  morale(){let value=original.morale.call(this);for(const r of this.rooms)if(this.active(r)){value-=({games:10,tavern:5,sewer:20}[r.type]||0);if(r.type==='laundry')value-=2*this.rooms.filter(n=>this.isHousing(n)&&Math.abs(n.x-r.x)<=2&&Math.abs(n.y-r.y)<=2&&this.active(n)).length;}return value;},
  moraleFor(){return this.morale();},
  localTolerance(u,home=this.s.rooms[u?.home]){const at=Number.isFinite(u?.x)&&Number.isFinite(u?.y)?u:home;if(!at)return 0;let value=0;for(const r of this.rooms)if(this.active(r)&&this.inAura(r,at)){value+=({games:10,tavern:5,sewer:20}[r.type]||0);if(r.type==='laundry'&&home&&this.isHousing(home)&&this.inAura(r,home))value+=2;}return value;},
  threshold(u,home=this.s.rooms[u.home]){return original.threshold.call(this,u,home)-this.localTolerance(u,home);},
  queueColony(action,title,description,data={}){return this.effect(title,description,'neutral',{kind:'colony',action,...data})},
  placementOptions(type,r){const count=BUILD_FOOTPRINTS[type]||1;if(count===1)return[];const out=[];for(const [dx,dy]of DIRS){if(type==='museum'&&dy)continue;const line=Array.from({length:count},(_,i)=>({x:r.x+dx*i,y:r.y+dy*i}));const valid=line.slice(1).every(p=>{const q=this.room(p.x,p.y);return p.x>=-20&&p.x<=20&&p.y>=-6&&p.y<=30&&!this.sealedBlock(p.x,p.y)&&(!q||q.type==='cave'&&!q.builtPartOf&&!q.exhausted&&!this.roomHazards(q).length)&&!(p.y<0&&this.surfaceReason(q||{...p,type:'surface'}));});if(valid)out.push({value:`${dx},${dy}`,label:dx===1?'À direita':dx===-1?'À esquerda':dy===1?'Abaixo':'Acima',cells:line});}return out;},
  buildFootprint(type,r){if(!r)return[];const requested=this._chosenFootprint;if(requested?.type===type&&requested.x===r.x&&requested.y===r.y)return requested.cells;return this.placementOptions(type,r)[0]?.cells||(BUILD_FOOTPRINTS[type]?[]:original.buildFootprint.call(this,type,r))},
  build(type,x,y,placement=null){const r=this.site(x,y);if(BUILD_FOOTPRINTS[type]&&!placement&&this.presentationEnabled){const reason=this.buildReason(type,r);if(reason)return{ok:false,reason};this.queueColony('placement','Área da construção','Escolha onde a sala continuará. O custo será cobrado apenas após confirmar.',{type,x,y});return{ok:true,pending:true};}if(placement){const option=this.placementOptions(type,r).find(o=>o.value===placement);if(!option)return{ok:false,reason:'A área escolhida deixou de estar disponível.'};this._chosenFootprint={type,x,y,cells:option.cells};}
   const group=r?.discoveryRoot,oldType=r?.type;let result;try{result=original.build.call(this,type,x,y)}finally{this._chosenFootprint=null;}if(result.ok){for(const p of [r,...(r.footprint||[]).map(id=>this.s.rooms[id])].filter(Boolean)){delete p.longCave;delete p.longPanel;delete p.enchanted;delete p.enchantedIndex;delete p.artPanel;}if(r.footprint)r.footprint.forEach((id,i)=>{const part=this.s.rooms[id];part.variant=(r.variant+i)%3;part.artPanel=i;});if(group&&!this.fluidSource(r)&&r.type!==oldType){const members=this.rooms.filter(p=>p!==r&&p.discoveryRoot===group&&p.type===oldType&&!p.playerBuilt);for(const p of this.rooms.filter(p=>p.discoveryRoot===group))delete p.discoveryRoot;if(members.length){const id=colonyKey(members[0]);for(const p of members)p.discoveryRoot=id;members[0].discoveryMembers=members.map(colonyKey);members[0].formationSize=members.length;}}this.syncWorkers();}return result;
  },
  expandFormation(root,count,options={}){if(['water','lava'].includes(root.type))options={...options,axis:'horizontal'};const members=original.expandFormation.call(this,root,count,options);this.varyFormation(members);return members},
  expandEmptyCavern(root,count){const members=original.expandEmptyCavern.call(this,root,count);this.varyFormation(members);return members},
  varyFormation(members){if(!members?.length)return;const offset=members[0].variant;members.forEach((p,i)=>{p.variant=(offset+i)%3;p.artPanel=i;});},
  colonyChoices(card){const i=card.input;if(i.action==='placement')return this.placementOptions(i.type,this.site(i.x,i.y));if(i.action==='capture')return this.captureChoices(card);return[]},
  resolveEffect(id,selection){const c=this.s.effectCards?.[0];if(c?.id!==id||c.input?.kind!=='colony')return original.resolveEffect.call(this,id,selection);if(c.input.action==='capture')return this.resolveCapture(c,String(selection));if(selection==='cancel'){this.s.effectCards.shift();return{ok:true}}if(!this.colonyChoices(c).some(o=>o.value===String(selection)))return{ok:false,reason:'Escolha uma opção válida.'};let result={ok:true};if(c.input.action==='placement')result=this.build(c.input.type,c.input.x,c.input.y,String(selection));if(result.ok)this.s.effectCards.shift();return result},
  releaseCaptive(r){
   const records=[...heldCaptives(r)],anonymous=Math.max(0,(r.prisoners||0)-records.length);if(!records.length&&!anonymous)return;
   clearCaptives(r);for(const c of records){const u=this.addUnit(c.type,r.x,r.y,true,'enemy',c.power);u.enemyName=c.name;u.range=c.range;u.size=c.size;u.traits=[...(c.traits||[])];if(c.monstrosity)u.monstrosity=true;}
   if(anonymous)this.spawnEnemies(r,anonymous,'raider');this.effect('Fuga de prisioneiros','Os ocupantes escaparam de '+ROOMS[r.type].name+' e se tornaram hostis.','bad');this._tacticsDirty=true;this.syncPrisonBars();if(this.enemies.length)this.beginCombat();
  },
  checkPrisonEscapes(){for(const r of this.rooms)if((r.captive||r.prisoners>0)&&(!CAPTURE_ROOMS.includes(r.type)||r.damaged||!this.active(r)))this.releaseCaptive(r);},
  syncPrisonBars(){this.s.cellBars??={};for(const r of this.rooms){if(!(CAPTURE_ROOMS.includes(r.type)&&(r.captive||r.prisoners>0)))continue;for(const [dx,dy]of DIRS){const n=this.room(r.x+dx,r.y+dy);if(!this.linked(r,n))continue;const edge=this.passageKey(r,n),old=this.s.cellBars[edge];if(!old)this.s.cellBars[edge]={kind:'prison',hp:200,level:1,cells:[colonyKey(r)]};else if(!old.cells.includes(colonyKey(r)))old.cells.push(colonyKey(r));}}for(const [edge,d]of Object.entries(this.s.cellBars)){d.cells=d.cells.filter(id=>{const r=this.s.rooms[id];return r&&(r.captive||r.prisoners>0)});if(!d.cells.length)delete this.s.cellBars[edge];}},
  barricade(a,b){const built=original.barricade.call(this,a,b);if(built)return built;const bar=this.s.cellBars?.[this.passageKey(a,b)];return bar?.hp>0?bar:null},
  damageBarricade(a,b,amount){const edge=this.passageKey(a,b),built=this.s.barricades[edge];if(built?.hp>0)return original.damageBarricade.call(this,a,b,amount);const bar=this.s.cellBars?.[edge];if(!bar)return;bar.hp=Math.max(0,bar.hp-amount);if(!bar.hp){for(const id of bar.cells){const r=this.s.rooms[id];if(r?.captive)this.releaseCaptive(r);else if(r?.prisoners){const count=r.prisoners;r.prisoners=0;this.spawnEnemies(r,count,'raider');}}delete this.s.cellBars[edge];this.syncPrisonBars();this._routeCache=null;this.effect('Grades rompidas','A cela foi violada. Seus prisioneiros estão livres e hostis.','bad');if(this.enemies.length)this.beginCombat();}},
  unitData(u){const d=original.unitData.call(this,u);if(u.worker)return{...d,speed:u.fleeing ? .95 : .45,range:0};return d;},
  syncWorkers(){this.s.workers??=[];for(const r of this.rooms){const job=SUPPORT_JOBS[r.type];if(!job||r.builtPartOf)continue;const resource=['miner','lumberjack'].includes(job),crew=this.s.workers.filter(w=>w.home===colonyKey(r));r.workerCount=resource?(Number.isInteger(r.workerCount)&&r.workerCount>=2&&r.workerCount<=3?r.workerCount:2+Math.floor(this.random()*2)):1;for(let n=crew.length;n<r.workerCount;n++)this.s.workers.push({home:colonyKey(r),job,variant:n%3,localX:(n-(r.workerCount-1)/2)*20,x:r.x,y:r.y,alive:true});for(const w of crew)w.job=job;}this.s.workers=this.s.workers.filter(w=>SUPPORT_JOBS[this.s.rooms[w.home]?.type]);for(const [i,w]of this.s.workers.entries()){Object.assign(w,{worker:true,type:'soldier',team:'ally',id:-(i+1),hp:w.alive?1:0,maxHp:1,power:0,shield:0,size:.8});w.cooldown??=0;w.walk??=0;const at=this.room(Math.round(w.x),Math.round(w.y))||this.s.rooms[w.home],fx=Math.abs(w.x-Math.round(w.x)),fy=Math.abs(w.y-Math.round(w.y));if(fx>.00001&&fy>.00001){w.x=at.x;w.y=at.y;w.moveTarget=null;}else if(fx>.00001||fy>.00001){const next=this.s.rooms[w.moveTarget]||at,from=this.movementOrigin(w,next);if(from&&this.linked(from,next))w.moveTarget=colonyKey(next);else{w.x=at.x;w.y=at.y;w.moveTarget=null;}}}},
  casualPlan(u,home){const choices=this.rooms.filter(r=>r!==home&&this.active(r)&&colonyDistance(r,home)<=2&&this.path(home,r,'ally',u)!==null),social=choices.filter(r=>!!ROOM_AURAS[r.type]||r.type==='springs'),pick=pool=>pool.length?pool[Math.floor(this.random()*pool.length)]:home,popular=pick(social),wander=pick(choices.filter(r=>r!==popular)),speed=Math.max(.05,this.unitData(u).speed*.30),length=(a,b)=>this.path(a,b,'ally',u)?.length||0,travel=(length(home,popular)+length(popular,wander)+length(wander,home))/speed,cycle=Math.max(60,travel*5);return{popular:colonyKey(popular),wander:colonyKey(wander),homeTime:Math.max(cycle*.5,u.idleAway||0),socialTime:cycle*.3,wanderTime:Math.max(0,cycle*.2-travel)};},
  idleUpdate(dt){this.syncWorkers();for(const u of this.allies){if(this.unitData(u).speed<=0)continue;const home=this.s.rooms[u.home];if(!home)continue;u.casualPlan??=this.casualPlan(u,home);u.idlePhase??='home';u.idleRemaining??=u.casualPlan.homeTime;const atHome=colonyDistance(u,home)<.02&&!u.moveTarget;
    if(!atHome)u.idleAway=(u.idleAway||0)+dt;
    if(u.idlePhase==='home')u.idleGoal=u.home;else if(u.idlePhase==='social')u.idleGoal=u.casualPlan.popular;else if(u.idlePhase==='wander')u.idleGoal=u.casualPlan.wander;else u.idleGoal=u.home;
    let goal=this.s.rooms[u.idleGoal]||home;if(goal!==home&&(!this.active(goal)||this.path(this.anchor(u),goal,'ally',u)===null)){u.idlePhase='return';u.idleGoal=u.home;goal=home;}const arrived=colonyDistance(u,goal)<.02&&!u.moveTarget;
    if(arrived){u.walk=0;u.idleRemaining-=dt;u.idleShuffleTimer=(u.idleShuffleTimer||0)-dt;if(u.idleShuffleTimer<=0){u.idleShuffleTimer=4+this.random()*8;u.idleRoomGoal=-5+this.random()*10;}const delta=(u.idleRoomGoal||0)-(u.idleRoomOffset||0);u.idleRoomOffset=(u.idleRoomOffset||0)+Math.sign(delta)*Math.min(Math.abs(delta),dt*3);if(Math.abs(delta)>.05)u.walk+=dt;
      if(u.idlePhase==='return'){const away=u.idleAway||0;u.casualPlan=this.casualPlan(u,home);u.idlePhase='home';u.idleRemaining=Math.max(u.casualPlan.homeTime,away);u.idleAway=0;}
      else if(u.idleRemaining<=0){if(u.idlePhase==='home'){u.idlePhase='social';u.idleRemaining=u.casualPlan.socialTime;}else if(u.idlePhase==='social'){u.idlePhase='wander';u.idleRemaining=u.casualPlan.wanderTime;}else u.idlePhase='return';}
    }else {let next=u.moveTarget?this.s.rooms[u.moveTarget]:this.path(this.anchor(u),goal,'ally',u)?.[0];if(next&&!this.passable(next,'ally',u)){const origin=this.movementOrigin(u,next);next=origin&&this.passable(origin,'ally',u)?origin:null;u.moveTarget=next?colonyKey(next):null;}if(next)this.moveUnit(u,next,dt*.30);else u.walk=0;}
  }},
  workerUpdate(dt){this.syncWorkers();for(const w of this.s.workers){const home=this.s.rooms[w.home];if(!w.alive){if(this.s.combat||!this.active(home))continue;w.variant=(w.variant+1)%3;w.alive=true;w.hp=1;w.x=home.x;w.y=home.y;w.moveTarget=null;}const at=this.room(Math.round(w.x),Math.round(w.y))||home;if(!home||!at)continue;if(this.lethalHazard(at,w)){w.hp=0;w.alive=false;continue;}const enemy=this.enemies.filter(u=>{if(colonyDistance(u,w)>=2.2)return false;const path=this.path(this.anchor(u),at,'enemy',u);return path!==null&&path.length<=2;}).sort((a,b)=>colonyDistance(a,w)-colonyDistance(b,w))[0];w.fleeing=!!enemy;
    if(enemy&&colonyDistance(enemy,w)<.24){w.alive=false;w.hp=0;continue;}
    // A committed corridor must finish before either flight or return can turn.
    if(w.moveTarget){const next=this.s.rooms[w.moveTarget],origin=next&&this.movementOrigin(w,next);if(next&&origin&&this.linked(origin,next)&&this.passable(next,'ally',w))this.moveUnit(w,next,dt);else {w.moveTarget=null;w.x=at.x;w.y=at.y;}continue;}
    if(enemy){w.localX=w.localY=0;const choices=this.neighbors(at,'ally',w).filter(r=>!this.roomHazards(r).length).sort((a,b)=>colonyDistance(b,enemy)-colonyDistance(a,enemy));if(choices[0])this.moveUnit(w,choices[0],dt);}
    else if(colonyDistance(w,home)>.01){if(this.enemies.some(u=>{const p=this.path(this.anchor(u),home,'enemy',u);return p!==null&&p.length<=2;}))continue;const next=this.path(at,home,'ally',w)?.[0];if(next)this.moveUnit(w,next,dt);}
    else {w.localX??=0;w.localY??=0;w.localTimer=(w.localTimer||0)-dt;if(w.localTimer<=0){w.localTimer=2+this.random()*5;w.localGoal=-32+this.random()*64;}const delta=(w.localGoal||0)-w.localX;if(Math.abs(delta)>.2)w.facing=Math.sign(delta);w.localX+=Math.sign(delta)*Math.min(Math.abs(delta),dt*8);w.walk+=Math.abs(delta)>.2?dt:0;}
    if(w.hp<=0)w.alive=false;
  }},
  income(){const before=this.events.length;original.income.call(this);for(const r of this.rooms.filter(r=>r.type==='sewer'&&this.active(r))){if(this.roll(100)>5)continue;const count=this.roll(3);for(let j=0;j<count;j++)this.addUnit('rat',r.x,r.y,false);this.effect('Ninhada no esgoto',`${count} rato(s) saíram da galeria. Eles não custaram recursos e afetam a moral normalmente.`,'neutral');}this.syncPrisonBars();this.checkMutiny();},
  endCombat(){const captures=[...(this.s.capturePool||[])];this.s.capturePool=[];original.endCombat.call(this);delete this.s.returnPhase;
   const slots=this.captureRooms();if(captures.length&&slots.length)this.queueColony('capture','Escolher capturas','Distribua os inimigos derrotados entre as estruturas. Cada inimigo só pode ser escolhido uma vez; cada estrutura recebe no máximo uma captura nesta batalha.',{captives:captures.slice(0,3000),slots:slots.map(colonyKey),assignments:{}});
   for(const w of this.s.workers||[]){const r=this.s.rooms[w.home];if(r){if(!w.alive){w.variant=(w.variant+1)%3;w.alive=true;w.x=r.x;w.y=r.y;w.moveTarget=null;w.localX=0;}}}this.syncPrisonBars();},
  lose(){const result=original.lose.call(this);for(const w of this.s.workers||[]){const r=this.s.rooms[w.home];if(r){if(!w.alive){w.variant=(w.variant+1)%3;w.alive=true;w.x=r.x;w.y=r.y;w.moveTarget=null;w.localX=0;}}}return result;},
  update(dt){if(this.s.status!=='playing'||this.s.paused||this.presentationEnabled&&this.s.effectCards?.length)return;dt=Math.min(.1,dt);this.confineRats();this.syncPrisonBars();if(!this.s.combat)this.idleUpdate(dt);this.workerUpdate(dt);return original.update.call(this,dt)}
 });
}
export function validateColony(s){if(s.workers!==undefined&&(!Array.isArray(s.workers)||s.workers.length>2000||s.workers.some(w=>!s.rooms[w.home]||!Object.values(SUPPORT_JOBS).includes(w.job)||![0,1,2].includes(w.variant)||!Number.isFinite(w.x)||!Number.isFinite(w.y)||typeof w.alive!=='boolean')))throw Error('Profissionais inválidos.');if(s.cellBars!==undefined)for(const [edge,d]of Object.entries(s.cellBars)){if(!s.passages[edge]||d.kind!=='prison'||!Number.isFinite(d.hp)||d.hp<0||d.hp>200||!Array.isArray(d.cells)||d.cells.some(id=>!s.rooms[id]))throw Error('Grades inválidas.');}}
export function validColonyInput(i,s){if(i?.kind!=='colony')return false;if(i.action==='engineering')return ['defense','infrastructure'].includes(i.mode)&&(i.mode==='infrastructure'?['rails','columns','bridge','drawbridge','elevator']:['defensive','offensive','secret','damage','delay']).includes(i.tool)&&Number.isInteger(i.x)&&Number.isInteger(i.y)&&Math.abs(i.x)<=20&&i.y>=-6&&i.y<=30;if(i.action==='placement')return !!BUILD_FOOTPRINTS[i.type]&&Number.isInteger(i.x)&&Number.isInteger(i.y)&&Math.abs(i.x)<=20&&i.y>=-6&&i.y<=30&&(!!s.rooms[`${i.x},${i.y}`]||i.y<0);if(i.action!=='capture'||!Array.isArray(i.captives)||i.captives.length>3000||i.captives.some(c=>!validCaptive(c)))return false;
 if(i.slots!==undefined&&(!Array.isArray(i.slots)||i.slots.length>2000||new Set(i.slots).size!==i.slots.length||i.slots.some(id=>typeof id!=='string'||!s.rooms[id])))return false;
 if(i.assignments!==undefined){if(!i.assignments||typeof i.assignments!=='object'||Array.isArray(i.assignments))return false;const entries=Object.entries(i.assignments),values=entries.map(([,n])=>n);if(new Set(values).size!==values.length||entries.some(([id,n])=>!s.rooms[id]||i.slots&&!i.slots.includes(id)||!Number.isInteger(n)||n<0||n>=i.captives.length||captiveKind(i.captives[n])!==(s.rooms[id].type==='kennel'?'monster':'person')))return false;}
 return true;
}
