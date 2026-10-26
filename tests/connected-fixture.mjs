import {newResearch} from '../src/research.js';
import {Game} from '../src/engine.js';
// Existing rule/combat scenarios were authored as fully connected maps. Their
// fixture explicitly opens each edge; production addRoom never opens an edge.
export class ConnectedFixture extends Game{
 constructor(options){super(options);this.s.research=newResearch(true)}
 addRoom(x,y,type){const r=super.addRoom(x,y,type);for(const [dx,dy]of [[0,-1],[1,0],[0,1],[-1,0]])this.connectRooms(r,this.room(x+dx,y+dy));return r}
}
