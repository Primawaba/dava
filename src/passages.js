import {ROOMS,CRYSTAL_PALETTE} from './content.js';
// Shared material definitions only. Directional openings are baked by tiles.js;
// there is deliberately no cross-room corridor renderer.
const PASSAGE_MATERIALS={
 rock:{wall:[89,84,66],light:[163,153,119],floor:[27,29,24]},
 masonry:{wall:[99,95,78],light:[176,166,134],floor:[30,31,27]},
 mine:{wall:[103,82,55],light:[173,146,99],floor:[33,29,22]},
 gold:{wall:[137,100,30],light:[238,202,91],floor:[47,35,13]},
 water:{wall:[39,95,117],light:[118,183,197],floor:[15,39,49]},
 fire:{wall:[109,71,47],light:[191,135,75],floor:[47,28,22]},
 organic:{wall:[105,97,51],light:[177,159,90],floor:[38,35,21]},
 forest:{wall:[69,86,53],light:[138,157,98],floor:[25,35,23]},
 crypt:{wall:[91,89,77],light:[175,169,140],floor:[28,28,25]},
 crystal:CRYSTAL_PALETTE,
 miasma:{wall:[99,71,114],light:[171,141,184],floor:[33,24,39]},
 blindgas:{wall:[89,100,103],light:[168,186,186],floor:[31,34,34]},
 flammable:{wall:[116,105,49],light:[195,184,105],floor:[39,34,20]},
 gas:{wall:[82,96,61],light:[147,165,104],floor:[29,40,25]}
};
export function passageArchitecture(room){return room.planarConstruction||ROOMS[room.type]?.r!==undefined||['meadhall','dragon','golemforge','challenge','desolate','gate','crypt','ancienttemple','ancientlibrary','ancientprison','rivalhold','city','tomb','sealed','vault'].includes(room.type)?'built':'cavern'}
export function passageMaterial(room){
 let type=room.hazards?.[0]||room.contaminant||room.type;type=({wyrd1:'crypt',wyrd2:'slime',wyrd3:'slime',wyrd4:'portal',wyrd5:'forest',wyrd6:'forest',wyrd7:'crystal',wyrd8:'crypt',wyrd9:'mine',wyrd10:'crystal',wyrd11:'library',wyrd12:'cave',wyrd13:'gold',wyrd14:'crystal',wyrd15:'crypt',wyrd16:'water'})[type]||type;
 if(['miasma','blindgas','flammable'].includes(type))return type;
 if(['water','sewer','well','laundry','pump','springs','mud'].includes(type))return 'water';
 if(['treasury','vault','dragon','city','rivalmine','mine','parlor','gold','games'].includes(type))return 'gold';
 if(['lava','crater','forge','golemforge','kitchen','dragonforge'].includes(type))return 'fire';
 if(['gas','flammable','miasma','blindgas'].includes(type))return 'gas';
 if(['hive','nest','breeder','slime'].includes(type))return 'organic';
 if(['forest','fungus','fungi','mushrooms'].includes(type))return 'forest';
 if(['mine','rivalmine','rails','shaft','elevator','workshop'].includes(type))return 'mine';
 if(['crypt','tomb','ancientprison','desolate'].includes(type))return 'crypt';
 if(['crystal','portal','stabilizer','artifact','ritual','chaos','endersgate','orefinder'].includes(type))return 'crystal';
 if(['cave','surface','ruins','chasm'].includes(type))return 'rock';
 return 'masonry';
}
export function passagePalette(room){return PASSAGE_MATERIALS[passageMaterial(room)]}
