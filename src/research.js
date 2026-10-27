import {ROOMS,BUILDABLE} from './data.js';
export const BUILD_TIERS={barracks:0,kennel:0,hut:0,warehouse:0,treasury:0,bridge:0,persuasion:0,library:1,forge:1,siegepost:1,laboratory:1,solitary:1,prison:1,quarters:1,dormitory:1,laundry:1,arena:1,masonry:1,elevator:1,rails:1,pump:1,columns:1,kitchen:2,parlor:2,games:2,sewer:2,inspection:2,hospital:2,tavern:2,mansion:2,puzzle:2,drawbridge:2,workshop:3,altar:3,temple:3,hiring:3,museum:3,artificer:3,breeder:3,throne:3,stabilizer:3};
export const RESEARCH_PROJECTS=[
 {id:'military',tier:1,rooms:['forge','siegepost','rails'],name:'Engenharia militar'},
 {id:'masonry',tier:1,rooms:['masonry','columns'],name:'Alvenaria e sustentação'},
 {id:'captives',tier:3,rooms:['solitary','hiring'],name:'Recrutamento de prisioneiros'},
 ...BUILDABLE.filter(t=>BUILD_TIERS[t]>0&&!['forge','siegepost','rails','masonry','columns','solitary','hiring'].includes(t)).map(t=>({id:t,tier:BUILD_TIERS[t],rooms:[t],name:ROOMS[t].name})),
 {id:'offensive',tier:2,rooms:[],requires:['masonry'],name:'Porta ofensiva'},
 {id:'secret',tier:3,rooms:[],requires:['masonry'],name:'Passagem secreta'}
];
export function newResearch(legacy=false){return {version:1,intel:0,unlocked:legacy?RESEARCH_PROJECTS.map(p=>p.id):[]};}
export function validateResearch(s){const r=s.research;if(r===undefined)return;if(!r||r.version!==1||!Number.isInteger(r.intel)||r.intel<0||r.intel>1e9||!Array.isArray(r.unlocked)||r.unlocked.length>RESEARCH_PROJECTS.length||new Set(r.unlocked).size!==r.unlocked.length||r.unlocked.some(id=>!RESEARCH_PROJECTS.some(p=>p.id===id))||r.species!==undefined&&(!Array.isArray(r.species)||r.species.length>100||r.species.some(t=>typeof t!=='string'||t.length>50)))throw Error('Pesquisa inválida.');}
export function installResearch(Game){
 const prior={};for(const n of ['buildReason','information','resolveEffect','requestEngineering','fortifyPassage','action','colonyChoices','damage'])prior[n]=Game.prototype[n];
 Object.assign(Game.prototype,{
  researchState(){return this.s.research??=newResearch(true);},
  constructionUnlocked(type){if(BUILD_TIERS[type]===0)return true;const p=RESEARCH_PROJECTS.find(p=>p.rooms.includes(type)||p.id===type);return !p||this.researchState().unlocked.includes(p.id);},
  researchReason(id){const p=RESEARCH_PROJECTS.find(p=>p.id===id),r=this.researchState();if(!p)return'Projeto inválido.';if(r.unlocked.includes(id))return'Projeto já desbloqueado.';if(this.s.combat||this.s.status!=='playing')return'Pesquise fora de combate.';
   if(p.tier>1&&!r.unlocked.some(id=>RESEARCH_PROJECTS.find(p=>p.id===id)?.tier===p.tier-1))return`Desbloqueie primeiro um projeto de Tier ${p.tier-1}.`;
   const required=p.requires||p.rooms.flatMap(t=>ROOMS[t].requires||[]).filter(t=>!p.rooms.includes(t));if(required.some(t=>!this.constructionUnlocked(t)))return`Desbloqueie: ${[...new Set(required)].map(t=>ROOMS[t]?.name||t).join(', ')}.`;
   if(id==='stabilizer'&&!this.rooms.some(r=>['portal','stabilizer'].includes(r.type)))return'Descubra um portal planar.';
   if(id==='breeder'&&(!this.s.discoveredInventions?.includes(4)||!this.allies.some(u=>u.kennelMonster||u.bredMonster||u.monstrosity)))return'Exige Feromônios e uma criatura aliada para matriz.';
   if(id==='museum'&&!r.species?.length)return'Registre uma espécie vencendo uma criatura grande.';
   if(r.intel<p.tier)return`Exige ${p.tier} informação(ões).`;return'';
  },
  researchProject(id){const reason=this.researchReason(id);if(reason)return{ok:false,reason};const p=RESEARCH_PROJECTS.find(p=>p.id===id),r=this.researchState();r.intel-=p.tier;r.unlocked.push(id);this.note(`Os segredos arrancados dos prisioneiros inspiraram os artífices: ${p.name} passou a fazer parte dos planos da fortaleza.`,'good');this.effect('Projeto desbloqueado',`${p.name}: ${p.rooms.length?p.rooms.map(t=>ROOMS[t].name).join(', '):p.name}. Construção e uso continuam exigindo seus custos e requisitos.`,'good');return{ok:true};},
  gainInformation(amount=1){const r=this.researchState();r.intel=Math.min(1e9,r.intel+amount);this.effect('Conhecimento extraído',`+${amount} informação para pesquisar construções. Saldo: ${r.intel}. Abra Construções → Pesquisas.`,'good');},
  damage(u,amount,options){const wasAlive=u.hp>0;prior.damage.call(this,u,amount,options);if(wasAlive&&u.hp<=0&&u.team==='enemy'&&(u.monstrosity||u.size>1.5)){const r=this.researchState();r.species??=[];if(!r.species.includes(u.type))r.species.push(u.type);}},
  information(cell){this.gainInformation();return prior.information.call(this,cell);},
  buildReason(type,r){if(!this.constructionUnlocked(type))return'Projeto bloqueado. Desbloqueie em Pesquisas com informações de prisioneiros.';return prior.buildReason.call(this,type,r);},
  engineeringLock(tool){const type=['damage','delay'].includes(tool)?'forge':tool==='defensive'?'masonry':tool;const project=RESEARCH_PROJECTS.find(p=>p.rooms.includes(type)||p.id===type);return this.constructionUnlocked(type)?'':`Projeto bloqueado: pesquise ${project?.name||type} em Construções → Pesquisas.`;},
  requestEngineering(mode,tool,...args){const reason=this.engineeringLock(tool);return reason?{ok:false,reason}:prior.requestEngineering.call(this,mode,tool,...args);},
  fortifyPassage(a,b,kind){const reason=this.engineeringLock(kind);return reason?{ok:false,reason}:prior.fortifyPassage.call(this,a,b,kind);},
  action(name,x,y,arg){const tool=name==='defense'?arg:name==='rails'?'rails':null,reason=tool&&this.engineeringLock(tool);return reason?{ok:false,reason}:prior.action.call(this,name,x,y,arg);},
  colonyChoices(card){if(card.input?.action==='engineering'&&this.engineeringLock(card.input.tool))return[];return prior.colonyChoices.call(this,card);}
 });
}
