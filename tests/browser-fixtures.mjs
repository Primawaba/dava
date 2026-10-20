// Explicit edges for the older fully connected combat/rendering scenarios.
// Does not override Game.addRoom or affect exploration in the real UI.
export async function installConnectedFixtures(page){
 const install=()=>{window.__addConnectedFixture=(g,...args)=>{const r=g.addRoom(...args);for(const [dx,dy]of [[0,-1],[1,0],[0,1],[-1,0]])g.connectRooms(r,g.room(r.x+dx,r.y+dy));return r}};
 await page.addInitScript(install);await page.evaluate(install);
}
