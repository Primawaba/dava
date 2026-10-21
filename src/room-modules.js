import {ROOMS} from './data.js';
export const BOSS_EXTENSION_FAMILIES={dragon:'palace',largelair:'troll',elemental:'elemental',golemforge:'forge',void:'void',hive:'hive',burrow:'burrow',vault:'vault',tomb:'tomb',challenge:'arena',hungry:'hungry'};
export const EXTENSION_FAMILIES=[...new Set(Object.values(BOSS_EXTENSION_FAMILIES)),'cavern'];
export function bossRoomRoot(game,room){
 if(!room?.bossRoot)return null;const root=game?.s.rooms[room.bossRoot];return root&&root.bossRoot===room.bossRoot&&!root.playerBuilt&&ROOMS[root.type]?.r===undefined?root:null;
}
export function visualRoom(game,room){const built=room?.builtPartOf&&game?.s.rooms[room.builtPartOf];if(built)return{...room,type:built.type,builtExtension:true};if(room?.sourceType&&['bridge','drawbridge'].includes(room.type))return{...room,type:room.sourceType,bridgeSurface:true};const root=bossRoomRoot(game,room);return root&&root!==room&&(room.type==='cave'||room.discoveryRoot===room.bossRoot&&room.type===root.type)&&!room.playerBuilt?{...room,type:root.type,bossExtension:true,bossFamily:BOSS_EXTENSION_FAMILIES[root.type]||'cavern',dragonAwake:root.dragonAwake}:room}
export function masonryRoom(room){return !!room&&ROOMS[room.type]?.r!==undefined}
export function sharedBossRoom(game,a,b){const first=bossRoomRoot(game,a),second=bossRoomRoot(game,b);return !!first&&first===second&&(a===first||a.type==='cave')&&(b===first||b.type==='cave')&&!a.playerBuilt&&!b.playerBuilt}

export function sharedFormation(a,b){return !!a.discoveryRoot&&a.discoveryRoot===b.discoveryRoot&&(!a.playerBuilt||!!a.sourceType)&&(!b.playerBuilt||!!b.sourceType)}
