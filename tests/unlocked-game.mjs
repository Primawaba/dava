import {Game as CampaignGame} from '../src/engine.js';
import {newResearch} from '../src/research.js';
// Isolated legacy rule scenarios start with every project researched.
export class Game extends CampaignGame{constructor(options){super(options);this.s.research=newResearch(true)}}
export {key,distance,clamp} from '../src/engine.js';
