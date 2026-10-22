import {BUILD_FOOTPRINTS} from './formations.js';
const wholeKey=r=>`${r.x},${r.y}`;
export function wholeRoomSpec(game,r){
 if(!game||!r)return null;const root=game.s.rooms[r.builtPartOf||r.discoveryRoot]||r;let type=root.type,cells;
 if(BUILD_FOOTPRINTS[type]&&root.footprint)cells=root.footprint.map(id=>game.s.rooms[id]).filter(Boolean);
 else if(root.type==='desolate'&&root.discoveryMembers){cells=root.discoveryMembers.map(id=>game.s.rooms[id]).filter(p=>p&&p.discoveryRoot===wholeKey(root));type='desolate-'+cells.length;}
 else if(root.wyrdId===13){type='lost';cells=(root.discoveryMembers||[wholeKey(root)]).map(id=>game.s.rooms[id]).filter(p=>p&&p.discoveryRoot===wholeKey(root));}
 else if(['river','magmaflow'].includes(root.sourceKind)||root.wyrdId===5){type=root.sourceType||root.type;cells=(root.discoveryMembers||[wholeKey(root)]).map(id=>game.s.rooms[id]).filter(p=>p&&p.discoveryRoot===wholeKey(root));}
 if(!cells||cells.length<2)return null;const vertical=cells.every(p=>p.x===cells[0].x);if(!vertical&&!cells.every(p=>p.y===cells[0].y))return null;
 const left=Math.min(...cells.map(p=>p.x))*180-80,top=Math.min(...cells.map(p=>p.y))*144-62,width=vertical?160:180*(cells.length-1)+160,height=vertical?144*(cells.length-1)+113.33:113.33;
 return{root,cells,type,vertical,left,top,width,height,key:wholeKey(root)};
}
export const WHOLE_ASSETS=[...[2,3,4,5,6].flatMap(count=>[0,1].map(v=>`desolate-${count}-horizontal-${v}`)),...['museum','temple','dragonforge','trapmaster','meadhall','lost','breeder','water','lava'].flatMap(type=>[0,1].map(v=>`${type}-horizontal-${v}`)),...['temple','dragonforge','trapmaster','meadhall','breeder'].flatMap(type=>[0,1].map(v=>`${type}-vertical-${v}`))];
export function installWholeRooms(Renderer){const oldRaw=Renderer.prototype.rawRoomImage,oldFrame=Renderer.prototype.framedRoomImage;
 Object.assign(Renderer.prototype,{
  wholeRoom(r){const spec=wholeRoomSpec(this.game,r);return spec&&this.wholeImages?.[`${spec.type}-${spec.vertical?'vertical':'horizontal'}-${spec.root.variant%2}`]?spec:null;},
  wholeImage(spec){return this.wholeImages[`${spec.type}-${spec.vertical?'vertical':'horizontal'}-${spec.root.variant%2}`];},
  rawRoomImage(r){const spec=this.wholeRoom(r);if(!spec)return oldRaw.call(this,r);const image=this.wholeImage(spec);this.wholeSlices??=new Map();const id=`${spec.key}:${spec.type}:${spec.root.variant}:${r.x},${r.y}:${spec.cells.length}`;if(this.wholeSlices.has(id))return this.wholeSlices.get(id);const c=document.createElement('canvas');c.width=128;c.height=91;const ctx=c.getContext('2d');ctx.imageSmoothingEnabled=false;ctx.fillStyle='#e5ddc6';ctx.fillRect(0,0,128,91);const sx=(r.x*180-80-spec.left)/1.25,sy=(r.y*144-62-spec.top)/1.25;ctx.drawImage(image,sx,sy,128,91,0,0,128,91);this.wholeSlices.set(id,c);if(this.wholeSlices.size>500)this.wholeSlices.delete(this.wholeSlices.keys().next().value);return c;},
  framedRoomImage(r){return this.wholeRoom(r)?this.rawRoomImage(r):oldFrame.call(this,r);},
  drawWholeRooms(visible,time){const c=this.ctx,seen=new Set();for(const r of visible){const spec=this.wholeRoom(r);if(!spec||seen.has(spec.key))continue;seen.add(spec.key);const source=this.wholeImage(spec),base=this.appearance.get(source,spec.type==='lost'?'artifact':spec.type.startsWith('desolate-')?'desolate':spec.type,[],time,this.reduced);c.drawImage(base,spec.left,spec.top,source.width*1.25,source.height*1.25);
    for(const part of spec.cells){const hazards=this.game.roomHazards(part);if(hazards.length||part.damaged){c.save();c.beginPath();c.rect(part.x*180-90,part.y*144-72,180,144);c.clip();const tint=this.appearance.get(source,spec.type==='lost'?'artifact':spec.type.startsWith('desolate-')?'desolate':spec.type,hazards,time,this.reduced);c.drawImage(tint,spec.left,spec.top,source.width*1.25,source.height*1.25);if(part.damaged){c.strokeStyle='#241c17';c.lineWidth=3;for(let i=0;i<5;i++){const x=part.x*180-54+i*23,y=part.y*144-42+i%2*9;c.beginPath();c.moveTo(x,y);c.lineTo(x+4,y+15);c.lineTo(x-2,y+29);c.stroke();}}c.restore();}
      if(['bridge','drawbridge'].includes(part.type)){const bridge=this.extensionImages['extension-liquid-bridge'];if(bridge)c.drawImage(bridge,part.x*180-80,part.y*144-62,160,113.33);}
    }
   }
  }
 });
}
