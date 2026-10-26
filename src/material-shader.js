import {passagePalette} from './passages.js';
export const shaderClamp=x=>Math.max(0,Math.min(1,x));
export const shaderSmooth=(a,b,x)=>{const t=shaderClamp((x-a)/(b-a));return t*t*(3-2*t);};
export function terrainNoise(x,y){let n=Math.imul(Math.floor(x),374761393)^Math.imul(Math.floor(y),668265263);n=Math.imul(n^(n>>>13),1274126177);return ((n^(n>>>16))>>>0)/4294967296;}
export function shaderMix(a,b,t){return a.map((v,i)=>Math.round(v+(b[i]-v)*t));}
// Canonical half-edge interpolation: both endpoints evaluate the same palette
// at the seam. No room image is stretched, displaced or blended with paper.
export function materialPaletteAt(room,x,y,width,height,neighbors=[]){
 const own=room.palette||passagePalette(room),out={floor:[...own.floor],wall:[...own.wall],light:[...own.light]};
 for(const edge of neighbors){const d=edge.dx<0?x:edge.dx>0?width-1-x:edge.dy<0?y:height-1-y,length=edge.dx?width:height,t=.5*(1-shaderSmooth(0,Math.min(36,length/3),d));if(t<=0)continue;const p=edge.palette||passagePalette(edge.room);for(const channel of ['floor','wall','light'])out[channel]=shaderMix(out[channel],p[channel],t);}
 return out;
}
export function materialLightsAt(x,y,lights=[],time=0,reduced=false){let light=0;for(const source of lights){const distance=Math.hypot(x-source.x,y-source.y),falloff=1-shaderSmooth(0,source.radius||100,distance),pulse=reduced?1:.9+.1*Math.sin(time/(source.period||1300)+(source.x+source.y)*.02);light+=falloff*falloff*(source.intensity??.2)*pulse;}return Math.min(.38,light);}
