// Shared material and sprite identities. All effects read the room's stored id.
export const LAYER_STYLES=[
 {id:'normal',name:'Normal',color:[105,99,78]},
 {id:'magma',name:'Magma',color:[173,76,40]},
 {id:'graveyard',name:'Cemitério',color:[91,137,132]},
 {id:'skitter',name:'Rastejantes',color:[116,133,62]},
 {id:'leylines',name:'Linhas Arcanas',color:[118,87,166]},
 {id:'riches',name:'Riquezas',color:[192,148,55]},
 {id:'dungeon',name:'Masmorra',color:[118,88,99]},
 {id:'nightmare',name:'Pesadelo',color:[92,54,116]}
];
export function layerMaterialPalette(id,material){const style=LAYER_STYLES[id];if(!style||!id)return material;const c=style.color,tint={floor:c.map(v=>Math.round(v*.26)),wall:c,light:c.map(v=>Math.min(255,Math.round(v*.7+90)))};return Object.fromEntries(['floor','wall','light'].map(k=>[k,material[k].map((v,i)=>Math.round(v*.56+tint[k][i]*.44))]));}
