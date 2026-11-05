import assert from 'node:assert/strict';

const crews=[[0,2,3,4],[1,5,6,7]];
export const ownerBytes=[6,5,5,5,5,5,5,5,7,7,7,7];
export const forceSlots=[0,1,0,0,0,1,1,1];

export function openingAlliances(api){
 const {emptyTrigger,emptyCondition,emptyAction,ActionType,AllianceStatus,ConditionType}=api;
 return crews.flatMap((crew,i)=>crew.map(owner=>{
  const t=emptyTrigger();t.players[owner]=1;
  t.conditions.push({...emptyCondition(),type:ConditionType.Always});
  const stance=i===0?AllianceStatus.AlliedVictory:AllianceStatus.Ally;
  for(const target of crew)if(target!==owner){
   t.actions.push({...emptyAction(),type:ActionType.SetAllianceStatus,player:target,unitId:stance,flags:4});
  }
  return t;
 }));
}

export function auditOpening(map,site,prefix,api){
 const {ActionType,ConditionType}=api;
 assert.deepEqual(map.playerTypes,ownerBytes,'Player 1 must be the only human');
 assert.deepEqual(map.editorPlayerTypes,ownerBytes,'OWNR and IOWN must agree');
 assert.deepEqual(map.forces.playerForce,forceSlots,'Unexpected force assignment');
 assert.deepEqual(map.forces.flags,[14,10,0,0],'Random start or ally flags changed');
 const heroes=map.units.filter(u=>u.unitId===20);
 assert.equal(heroes.length,1);
 const hero=heroes[0],starts=map.units.filter(u=>u.unitId===214);
 assert.equal(hero.owner,0,'Hero is not owned by Player 1');
 assert.deepEqual(starts.map(u=>[u.owner,u.x,u.y]),[[0,hero.x,hero.y]],'Player 1 start must match hero');
 const within=u=>u.x>=site.left&&u.x<=site.right&&u.y>=site.top&&u.y<=site.bottom;
 assert(within(hero),'Hero starts outside Barracks');
 const nearby=map.units.filter(within);
 assert(nearby.every(u=>crews[0].includes(u.owner)||u.owner===11),'Hostile unit at the opening location');
 const buildings=nearby.filter(u=>[106,111,112].includes(u.unitId));
 assert(buildings.length>=2&&buildings.every(u=>u.owner===2),'Barracks and command structures must be Player 3');
 assert.equal(new Set(map.units.filter(u=>u.x===hero.x&&u.y===hero.y).map(u=>u.unitId)).size,2,'Hero overlaps a map unit');
 assert.equal(prefix.length,8);
 let allianceActions=0;
 for(const [i,expected] of prefix.entries()){
  const t=map.triggers[i];assert(t,'Missing engine opening trigger');
  assert.deepEqual(t.players,expected.players);
  assert.deepEqual(t.conditions.map(c=>c.type),[ConditionType.Always]);
  assert.deepEqual(t.actions,expected.actions);
  assert(t.actions.every(a=>a.type===ActionType.SetAllianceStatus));
  allianceActions+=t.actions.length;
 }
 return {humanSlot:1,heroOwner:1,startingBarracksOwner:3,nativeTriggers:prefix.length,allianceActions,automaticCameraActions:0};
}
