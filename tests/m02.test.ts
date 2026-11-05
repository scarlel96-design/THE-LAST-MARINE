import {test,expect,locations,orders,type Sim,type Location} from 'trigscript';
/* @EXPECTED_START */
const state=(sim:Sim)=>sim.program('m02');
const hero=(sim:Sim)=>sim.units({owner:0,type:20})[0];
const reactor=(sim:Sim)=>sim.units({owner:2,type:106})[0];
function go(sim:Sim,at:Location){sim.move(hero(sim),at).frames(2);}
function g(sim:Sim,at:Location){go(sim,at);sim.press('G').frames(3);}
function clear(sim:Sim,owner:number,type:number){
 for(const u of sim.units({owner,type}))sim.kill(u);
 sim.frames(3);
}
function start(sim:Sim){sim.frames(3);g(sim,locations.Wreck);g(sim,locations.Reactor);}
function prep(sim:Sim){start(sim);clear(sim,5,37);g(sim,locations.Depot);}
function wave(sim:Sim){sim.frames(145);}
function clearRaid(sim:Sim){clear(sim,1,37);clear(sim,1,38);}
function outage(sim:Sim){g(sim,locations.Garrison);wave(sim);clearRaid(sim);wave(sim);clearRaid(sim);}
function counter(sim:Sim){prep(sim);outage(sim);g(sim,locations.Relay);g(sim,locations.Garrison);wave(sim);clearRaid(sim);}
function finish(sim:Sim){
 counter(sim);go(sim,locations.NestLane);clearRaid(sim);
 sim.kill(sim.units({owner:1,type:131})[0]).frames(3);
 g(sim,locations.Nest);g(sim,locations.Extraction);
}
test('M02 start applies validated gear and inventory',sim=>{
 sim.frames(4);
 expect(state(sim).weaponTier).toBe(expected.weapon);
 expect(state(sim).armorTier).toBe(expected.armor);
 expect(state(sim).experience).toBe(expected.experience);
 expect(state(sim).materials).toBe(expected.materials);
 expect(state(sim).equipment).toBe(expected.equipment);
 expect(state(sim).intel).toBe(expected.intel);
 expect(sim.resources(0).ore).toBe(expected.kits);
 expect(sim.resources(0).gas).toBe(expected.explosives);
 expect(hero(sim).hp).toBe(expected.carried?55:45);
 if(expected.route===2)expect(sim).toHavePrinted('남쪽 회수로');
});
test('M02 intro skips only the camera',sim=>{
 sim.frames(2);sim.press('Escape').frames(3);
 expect(state(sim).introUntil).toBe(0);
 expect(state(sim).phase).toBe(0);
 expect(state(sim).materials).toBe(expected.materials);
});
test('M02 mandatory fuse requires interaction at the wreck',sim=>{
 sim.frames(2);g(sim,locations.Reactor);
 expect(state(sim).phase).toBe(0);expect(state(sim).fuse).toBe(false);
 g(sim,locations.Wreck);g(sim,locations.Wreck);
 expect(state(sim).phase).toBe(1);expect(state(sim).materials).toBe(expected.materials+8);
});
test('M02 repair restores physical HP and activates only four scouts',sim=>{
 start(sim);
 expect(reactor(sim).hp).toBe(reactor(sim).maxHp);
 expect(sim.count(0,125)).toBe(2);
 expect(sim.units({owner:0,type:125}).every(u=>u.hp===u.maxHp)).toBe(true);
 expect(sim.count(5,37)).toBe(4);expect(state(sim).issuedCount).toBe(4);
 g(sim,locations.Reactor);sim.frames(240);
 expect(sim.count(5,37)).toBe(4);
 expect(state(sim).parts).toBe(expected.parts+(expected.wren===1?1:0));
 if(expected.wren===1)expect(sim).toHavePrinted('렌이다');
});
test('M02 depot needs scouts gone and deploys evacuated soldiers once',sim=>{
 start(sim);g(sim,locations.Depot);
 expect(state(sim).phase).toBe(2);expect(state(sim).eUnlocked).toBe(false);
 clear(sim,5,37);g(sim,locations.Depot);g(sim,locations.Depot);
 expect(state(sim).phase).toBe(3);expect(state(sim).eUnlocked).toBe(true);
 expect(state(sim).kits).toBe(expected.kits+2);
 expect(sim.count(0,0)).toBe(expected.soldiers);
});
test('M02 defensive wave waits for the longer inherited warning',sim=>{
 prep(sim);g(sim,locations.Garrison);sim.frames(60);
 expect(sim.count(1,37)).toBe(expected.warning?0:8);
 wave(sim);expect(sim.count(1,37)).toBe(8);
 expect(sim.count(1,37,locations.WestLane)).toBe(8);
 if(expected.mara===1)expect(sim).toHavePrinted('베일이다');
});
test('M02 sealing drain reroutes wave two and restored watch extends lead time',sim=>{
 prep(sim);g(sim,locations.Drain);g(sim,locations.Watch);
 expect(state(sim).sealed).toBe(true);expect(state(sim).watch).toBe(true);
 g(sim,locations.Garrison);sim.frames(60);
 expect(sim.count(1,37)).toBe(0);
 wave(sim);clearRaid(sim);wave(sim);
 expect(state(sim).waveLane).toBe(2);
 expect(sim.count(1,37,locations.NorthLane)).toBe(7);
 expect(sim.count(1,37,locations.DrainLane)).toBe(0);
});
test('M02 unchanged drain carries the second wave and cannot be sealed mid-raid',sim=>{
 prep(sim);g(sim,locations.Garrison);wave(sim);clearRaid(sim);wave(sim);
 g(sim,locations.Drain);
 expect(state(sim).sealed).toBe(false);
 expect(state(sim).waveLane).toBe(3);
 expect(sim.count(1,37,locations.DrainLane)).toBe(7);
});
test('M02 raids do not advance by timer or respawn after F9',sim=>{
 prep(sim);g(sim,locations.Garrison);wave(sim);
 sim.press('F9').frames(1500);
 expect(state(sim).phase).toBe(4);
 expect(state(sim).launchedWaves).toBe(1);
 expect(state(sim).issuedCount).toBe(12);
 expect(sim.count(1,37)).toBe(8);
});
test('M02 brownout requires manual relay and current thermal equipment changes damage',sim=>{
 prep(sim);outage(sim);
 expect(state(sim).phase).toBe(6);
 expect(state(sim).powered).toBe(false);
 g(sim,locations.Motor);expect(state(sim).motor).toBe(false);
 expect(reactor(sim).hp).toBe(reactor(sim).maxHp-((expected.equipment&4)?200:400));
 g(sim,locations.Garrison);expect(state(sim).phase).toBe(6);
 g(sim,locations.Relay);expect(state(sim).phase).toBe(7);
 expect(state(sim).powered).toBe(true);
 const relay=sim.units({owner:11,type:116})[0];
 expect(relay.hp).toBe(relay.maxHp);
 expect(state(sim).intel).toBe(expected.intel|8);
 if(expected.intel&4)expect(sim).toHavePrinted('주파수 기록을 대조했다');
});
test('M02 third attack has two finite columns',sim=>{
 prep(sim);outage(sim);g(sim,locations.Relay);g(sim,locations.Garrison);wave(sim);
 expect(sim.count(1,37,locations.NorthLane)).toBe(9);
 expect(sim.count(1,38,locations.DrainLane)).toBe(5);
 expect(sim.units({owner:1,type:38}).every(u=>u.orderId===orders.AttackMove)).toBe(true);
 expect(state(sim).launchedWaves).toBe(3);
});
test('M02 loss of reactor is terminal, not a checkpoint award',sim=>{
 prep(sim);g(sim,locations.Garrison);wave(sim);
 sim.kill(reactor(sim)).frames(3);
 expect(state(sim).phase).toBe(90);
 sim.press('F9').frames(6);
 expect(state(sim).phase).toBe(90);expect(state(sim).flags).toBe(0);
 sim.press('N').frames(3);expect(state(sim).ended).toBe(true);
});
test('M02 surviving contacts change optional cache without duplication',sim=>{
 prep(sim);const kits=state(sim).kits,materials=state(sim).materials;
 g(sim,locations.Shelter);g(sim,locations.Shelter);sim.press('F9').frames(3);
 expect(state(sim).kits).toBe(kits+(expected.ella===1?3:1));
 expect(state(sim).materials).toBe(materials+(expected.civilians>0?6:0));
 if(expected.ella===1)expect(sim).toHavePrinted('모로입니다');
});
test('M02 motor support and upgrades debit only once per purchase',sim=>{
 prep(sim);const before=state(sim).materials;
 g(sim,locations.Motor);g(sim,locations.Motor);
 expect(sim.count(0,2)).toBe(1);expect(state(sim).materials).toBe(before-10);
 sim.press('U').frames(3);
 expect(state(sim).weaponTier).toBe(expected.weapon+1);
 expect(state(sim).materials).toBe(before-10-(expected.weapon===0?10:12));
 sim.press('B').frames(3);
 expect(state(sim).armorTier).toBe(expected.armor+1);
 sim.press('F9').frames(3);expect(sim.count(0,2)).toBe(1);
});
test('M02 E stays locked before depot and cancels on movement',sim=>{
 sim.frames(3).press('E').frames(3);expect(state(sim).eUntil).toBe(0);
 prep(sim);sim.press('E').frames(3);expect(state(sim).eUntil>0).toBe(true);
 go(sim,locations.Motor);expect(state(sim).eUntil).toBe(0);
 sim.press('E').frames(3);expect(state(sim).eUntil).toBe(0);
});
test('M02 Q reverts on movement and W interruption preserves stock',sim=>{
 prep(sim);
 sim.press('F7').frames(3);expect(state(sim).qUntil>0).toBe(true);
 go(sim,locations.Motor);expect(state(sim).qUntil).toBe(0);
 (hero(sim) as any).hp=25;const kits=state(sim).kits;
 sim.press('F8').frames(4);go(sim,locations.Mineral);
 expect(state(sim).wUntil).toBe(0);expect(state(sim).kits).toBe(kits);
 sim.press('W').frames(76);expect(state(sim).kits).toBe(kits-1);
 expect(sim.resources(0).ore).toBe(kits-1);
});
test('M02 hero death recovers one hero without restoring loot or enemies',sim=>{
 prep(sim);g(sim,locations.Garrison);wave(sim);
 const before=state(sim).materials;
 sim.kill(hero(sim)).frames(80);
 expect(sim.count(0,20)).toBe(1);
 expect(state(sim).materials).toBe(before);
 expect(state(sim).phase).toBe(4);
 expect(state(sim).issuedCount).toBe(12);
});
test('M02 counterattack requires ground travel, the hatchery and all guards',sim=>{
 counter(sim);
 expect(state(sim).phase).toBe(9);
 expect(state(sim).issuedCount).toBe(33);
 g(sim,locations.Extraction);expect(state(sim).phase).toBe(9);
 go(sim,locations.NestLane);
 expect(state(sim).issuedCount).toBe(43);
 expect(sim.units({owner:1,type:131})[0].invincible).toBe(false);
 clearRaid(sim);g(sim,locations.Nest);expect(state(sim).phase).toBe(9);
 sim.kill(sim.units({owner:1,type:131})[0]).frames(3);
 g(sim,locations.Nest);expect(state(sim).phase).toBe(10);
});
test('M02 minimal path emits M03 v1 and wins once',sim=>{
 finish(sim);
 const end=state(sim),a=expected.legacyA,d=expected.legacyB;
 expect(end.phase).toBe(11);expect(end.flags).toBe(7);expect(end.issuedCount).toBe(43);
 expect(end.experience).toBe(2);
 const b=480+expected.weapon+4*expected.armor;
 const c=expected.materials+20+(expected.parts+1+(expected.wren===1?1:0))*256+(expected.kits+2)*4096+expected.explosives*65536;
 const checksum=(a*3+b*5+c*7+d*11+7*13+71)%9973;
 expect(end.resultB).toBe(b);expect(end.resultC).toBe(c);expect(end.resultCheck).toBe(checksum);
 expect(sim).toHavePrinted('TLM1-3:'+a+':'+b+':'+c+':'+d+':7:'+checksum);
 sim.press('N').frames(3);expect(state(sim).ended).toBe(true);
});
