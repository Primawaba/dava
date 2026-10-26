import {UNITS,ENEMIES} from './data.js';
export const CAPTURE_ROOMS=['persuasion','solitary','prison','kennel'];
export const INTELLIGENT_CAPTIVES=['goblin','miner','cultist','raider','champion','lich','fairy','soldier','archer','mage','cleric','alchemist','trapper','thug','berserker','hero'];
export const MONSTER_CAPTIVES=['cavewolf','worm','dragon','troll','spider','beast','insect','insectqueen','elemental','golem'];
export function captiveKind(c){if(c?.monstrosity)return'monster';return INTELLIGENT_CAPTIVES.includes(c?.type)?'person':MONSTER_CAPTIVES.includes(c?.type)?'monster':null;}
export function validCaptive(c){return !!c&&(Object.hasOwn(ENEMIES,c.type)||Object.hasOwn(UNITS,c.type))&&Number.isFinite(c.power)&&c.power>0&&c.power<=1e7&&typeof c.name==='string'&&c.name.length<=200&&Number.isFinite(c.range)&&c.range>=0&&c.range<=5&&Number.isFinite(c.size)&&c.size>0&&c.size<=5&&Number.isInteger(c.mutiny)&&c.mutiny>=0&&c.mutiny<=100&&(c.sourceId===undefined||Number.isInteger(c.sourceId)&&c.sourceId>0)&&(c.monstrosity===undefined||typeof c.monstrosity==='boolean')&&(c.traits===undefined||Array.isArray(c.traits)&&c.traits.length<=13&&c.traits.every(n=>Number.isInteger(n)&&n>=1&&n<=13));}
export function heldCaptives(r){return r?.captives?.length?r.captives:r?.captive?[r.captive]:[];}
export function clearCaptives(r){r.captive=null;r.captives=[];r.prisoners=0;}
