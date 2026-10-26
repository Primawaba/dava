import {chromium} from '@playwright/test';import {readFile,writeFile,mkdir,copyFile} from 'node:fs/promises';import {createHash} from 'node:crypto';
import {ENEMIES,SPRITE_FRAMES} from '../src/data.js';import {LAYER_STYLES} from '../src/layer-data.js';
const names=['magma','graveyard','skitter','leylines','riches','dungeon','nightmare'];
const primary=['immortal','goblin','skeleton','insect','insectqueen','cultist','miner','automaton','cavewolf','worm','dragon','guardian','troll','elemental','fairy','champion','lich','spider','beast','golem','undead','raider'];
const auxiliary=['soldier','archer','mage','cleric','dog','rat','thug','alchemist','trapper','siege','hero','berserker'];
if(process.argv[2]){const originals=JSON.parse(await readFile(process.argv[2],'utf8'));await mkdir('art/layers',{recursive:true});for(const name of [...names,'aux'])await copyFile(originals[name],`art/layers/${name}-atlas.png`);}
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});const manifest={size:64,primary,auxiliary,layers:LAYER_STYLES,assets:[]};await mkdir('public/assets/layer-enemies',{recursive:true});
try{const page=await browser.newPage();for(const name of [...names,'aux']){const raw=await readFile(`art/layers/${name}-atlas.png`),url='data:image/png;base64,'+raw.toString('base64');const sprites=await page.evaluate(async({url,name,primary,auxiliary,names})=>{
 const im=new Image();im.src=url;await im.decode();const source=document.createElement('canvas');source.width=im.width;source.height=im.height;const ctx=source.getContext('2d',{willReadFrequently:true});ctx.drawImage(im,0,0);const pixels=ctx.getImageData(0,0,im.width,im.height).data,rows=name==='aux'?7:4,cols=name==='aux'?12:6,out=[];
 // Locate low-occupancy gutters near the regular atlas boundaries. This keeps
 // tall horns and broad wings inside their own cells without stretching them.
 const rowCounts=Array.from({length:im.height},(_,y)=>{let count=0;for(let x=0;x<im.width;x++)if(pixels[(y*im.width+x)*4+3]>=90)count++;return count});
 const cut=(counts,ideal,radius)=>{let best=Math.round(ideal),score=Infinity;for(let p=Math.max(1,Math.round(ideal-radius));p<=Math.min(counts.length-2,Math.round(ideal+radius));p++){const s=counts[p]+Math.abs(p-ideal)*.2;if(s<score){score=s;best=p;}}return best};
 const ys=[0,...Array.from({length:rows-1},(_,n)=>cut(rowCounts,(n+1)*im.height/rows,im.height/rows*.12)),im.height];
 for(let row=0;row<rows;row++){
  const counts=Array.from({length:im.width},(_,x)=>{let count=0;for(let y=ys[row];y<ys[row+1];y++)if(pixels[(y*im.width+x)*4+3]>=90)count++;return count});
  const xs=[0,...Array.from({length:cols-1},(_,n)=>cut(counts,(n+1)*im.width/cols,im.width/cols*.18)),im.width];
  for(let col=0;col<cols;col++){const index=row*cols+col,type=name==='aux'?auxiliary[col]:primary[index];if(!type)continue;
   const cellW=xs[col+1]-xs[col],cellH=ys[row+1]-ys[row],cell=ctx.getImageData(xs[col],ys[row],cellW,cellH),seen=new Uint8Array(cellW*cellH),components=[];
   for(let p=0;p<seen.length;p++){if(seen[p]||cell.data[p*4+3]<64)continue;const points=[p];seen[p]=1;let left=cellW,right=0,top=cellH,bottom=0;for(let q=0;q<points.length;q++){const at=points[q],x=at%cellW,y=Math.floor(at/cellW);left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const nx=x+dx,ny=y+dy,n=ny*cellW+nx;if(nx<0||nx>=cellW||ny<0||ny>=cellH||seen[n]||cell.data[n*4+3]<64)continue;seen[n]=1;points.push(n);}}components.push({points,left,right,top,bottom});}
   components.sort((a,b)=>b.points.length-a.points.length);if(!components.length)throw Error('Empty sprite '+name+' '+type);const main=components[0],chosen=[main];let changed=true;while(changed){changed=false;for(const part of components){if(chosen.includes(part)||part.points.length<5)continue;const near=chosen.some(c=>Math.max(0,c.left-part.right,part.left-c.right)<=5&&Math.max(0,c.top-part.bottom,part.top-c.bottom)<=5);if(near){chosen.push(part);changed=true;}}}
   const keep=new Uint8Array(seen.length);for(const part of chosen)for(const p of part.points){const x=p%cellW,y=Math.floor(p/cellW);for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)if(x+dx>=0&&x+dx<cellW&&y+dy>=0&&y+dy<cellH)keep[(y+dy)*cellW+x+dx]=1;}
   let left=cellW,right=-1,top=cellH,bottom=-1;for(let p=0;p<keep.length;p++){if(!keep[p])cell.data[p*4+3]=0;if(cell.data[p*4+3]>=64){const x=p%cellW,y=Math.floor(p/cellW);left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);}}const isolated=document.createElement('canvas');isolated.width=cellW;isolated.height=cellH;isolated.getContext('2d').putImageData(cell,0,0);
   const target=document.createElement('canvas');target.width=target.height=64;const c=target.getContext('2d');c.imageSmoothingEnabled=false;const w=right-left+1,h=bottom-top+1,scale=Math.min(58/w,58/h),dw=Math.max(1,Math.round(w*scale)),dh=Math.max(1,Math.round(h*scale));c.drawImage(isolated,left,top,w,h,Math.round((64-dw)/2),61-dh,dw,dh);const alpha=c.getImageData(0,0,64,64).data;let solid=0,transparent=0,border=0;for(let y=0;y<64;y++)for(let x=0;x<64;x++){const a=alpha[(y*64+x)*4+3];if(a>100)solid++;if(a===0)transparent++;if((x<2||x>61||y<2||y>61)&&a>0)border++;}out.push({type,layer:name==='aux'?row+1:names.indexOf(name)+1,bounds:[xs[col]+left,ys[row]+top,w,h],alpha:{solid,transparent,border},png:target.toDataURL().split(',')[1]});}
 }
 return out;
 },{url,name,primary,auxiliary,names});
 for(const s of sprites){const path=`public/assets/layer-enemies/${s.layer}-${s.type}.png`,png=Buffer.from(s.png,'base64');if(s.alpha.solid<30||s.alpha.transparent<500||s.alpha.border)throw Error('Invalid transparent sprite: '+path+' '+JSON.stringify(s.alpha));await writeFile(path,png);delete s.png;manifest.assets.push({...s,path,sha256:createHash('sha256').update(png).digest('hex')});}
 }
 for(let layer=1;layer<=7;layer++)for(const type of Object.keys(SPRITE_FRAMES))if(!manifest.assets.some(a=>a.layer===layer&&a.type===type))throw Error('Missing '+layer+' '+type);
 await writeFile('art/layers/manifest.json',JSON.stringify(manifest,null,2)+'\n');console.log(`Built ${manifest.assets.length} unique transparent layer sprites (${Object.keys(ENEMIES).length} enemy species plus ${auxiliary.length} rebel/unit species across seven layers).`);
}finally{await browser.close();}
