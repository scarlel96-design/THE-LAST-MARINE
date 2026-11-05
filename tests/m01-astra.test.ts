import {test, expect, locations, type Sim} from 'trigscript';
function heroOf(sim:Sim) { return sim.units({owner:0,type:20})[0]; }
function go(sim:Sim,at:any) { sim.move(heroOf(sim),at).frames(2); }
function use(sim:Sim,at:any) { go(sim,at); sim.press('G').frames(2); }
function startBattle(sim:Sim) { sim.frames(2); use(sim,locations.Armory); use(sim,locations.Outpost); sim.frames(100); clear(sim,7,37); sim.frames(3); }
function wake(sim:Sim) { startBattle(sim); sim.press('Escape').frames(3); }
function clear(sim:Sim,owner:number,type:number) { for(const u of sim.units({owner,type}))sim.kill(u); sim.frames(2); }
function finish(sim:Sim) {
 wake(sim); use(sim,locations.Medical); clear(sim,1,38); use(sim,locations.Settlement);
 clear(sim,5,37); use(sim,locations.Relay); clear(sim,6,37); use(sim,locations.Supply); use(sim,locations.Exit);
}

test('M01 starts with routine duty and locked medical skill',sim=>{
 sim.frames(3); expect(sim.program('m01').phase).toBe(0); expect(sim.program('m01').kits).toBe(0);
 sim.press('W').frames(2); expect(sim.program('m01').wUntil).toBe(0); expect(sim).toHavePrinted('의료 모듈 필요');
});
test('M01 interaction requires the hero at the objective',sim=>{
 sim.frames(3).press('G').frames(2); expect(sim.program('m01').phase).toBe(0);
 use(sim,locations.Armory); expect(sim.program('m01').phase).toBe(1); expect(sim.program('m01').qUnlocked).toBe(true);
});
test('M01 attack order is finite and cannot finish from a timer alone',sim=>{
 startBattle(sim); sim.frames(2400); expect(sim.program('m01').phase).toBe(2);
 expect(sim.count(1,37)).toBe(18); expect(sim.program('m01').outerIssued).toBe(true);
});
test('M01 exterior victory has a separate withdrawal outcome',sim=>{
 startBattle(sim); clear(sim,1,37); go(sim,locations.Outer);
 expect(sim.program('m01').outerOutcome).toBe(2); expect(sim.program('m01').phase).toBe(3);
});
test('M01 structural damage drives a breached withdrawal',sim=>{
 startBattle(sim); sim.kill(sim.units({owner:2,type:125,at:locations.Outer})[0]); go(sim,locations.Outer);
 expect(sim.program('m01').outerOutcome).toBe(1); expect(sim.program('m01').phase).toBe(3);
});
test('M01 normal collapse requires both movement and physical wreck states',sim=>{
 startBattle(sim); clear(sim,1,37); go(sim,locations.Outer); go(sim,locations.Inner);
 clear(sim,5,38); go(sim,locations.Evac); sim.press('G').frames(2);
 expect(sim.program('m01').phase).toBe(6);
 sim.move(sim.units({owner:2,type:11})[0],locations.Crash).frames(3);
 expect(sim.program('m01').dropshipCrashed).toBe(true); clear(sim,6,38); sim.kill(sim.units({owner:2,type:109,at:locations.Ammo})[0]); go(sim,locations.Shelter); sim.frames(110);
 expect(sim.program('m01').ammoExploded).toBe(true); sim.press('G').frames(3);
 expect(sim.program('m01').phase).toBe(10); expect(sim.program('m01').collapseCompletions).toBe(1);
});
test('M01 skip reaches canonical survival without rescue awards',sim=>{
 wake(sim); sim.press('Escape').frames(2);
 expect(sim.program('m01').phase).toBe(10); expect(sim.program('m01').collapseCompletions).toBe(1);
 expect(sim.program('m01').sceneState).toBe(4); expect(sim.program('m01').maraState).toBe(0);
 expect(sim.count(1,38)).toBe(5); expect(sim.count(5,37)).toBe(5); expect(sim.count(6,37)).toBe(6);
});
test('M01 rescue needs actor arrival and records it once',sim=>{
 startBattle(sim); clear(sim,1,37); go(sim,locations.Outer); use(sim,locations.MaraStart);
 expect(sim.program('m01').maraState).toBe(0);
 sim.move(sim.units({owner:2,type:10})[0],locations.Evac).frames(2);
 expect(sim.program('m01').maraState).toBe(1); sim.frames(5); expect(sim.count(2,10)).toBe(0);
});
test('M01 lost actor cannot receive a rescue award',sim=>{
 startBattle(sim); sim.kill(sim.units({owner:2,type:10})[0]); sim.frames(2);
 expect(sim.program('m01').maraState).toBe(2); sim.press('Escape').frames(2); expect(sim.program('m01').maraState).toBe(2);
});
test('M01 medical supplies are a single committed transaction',sim=>{
 wake(sim); use(sim,locations.Medical); use(sim,locations.Medical);
 expect(sim.program('m01').kits).toBe(3); expect(sim.program('m01').materials).toBe(8);
 sim.press('F9').frames(3); use(sim,locations.Medical); expect(sim.program('m01').kits).toBe(3);
});
test('M01 successful W consumes one kit and persists that cost',sim=>{
 wake(sim); use(sim,locations.Medical); sim.press('W').frames(76);
 expect(sim.program('m01').kits).toBe(2); expect(sim.program('m01').wReady).toBeGreaterThan(0);
 sim.press('F9').frames(3); expect(sim.program('m01').kits).toBe(2); expect(sim.count(0,20)).toBe(1);
});
test('M01 interrupted W consumes neither inventory nor cooldown',sim=>{
 wake(sim); use(sim,locations.Medical); sim.press('W').frames(10); go(sim,locations.Salvage);
 expect(sim.program('m01').kits).toBe(3); expect(sim.program('m01').wReady).toBe(0);
});
test('M01 Q restores armor and retains independent cooldown',sim=>{
 startBattle(sim); sim.press('Q').frames(2); expect(sim.program('m01').qUntil).toBeGreaterThan(0);
 go(sim,locations.Inner); expect(sim.program('m01').qUntil).toBe(0); expect(sim.program('m01').qReady).toBeGreaterThan(0);
});
test('M01 optional records and salvage cannot duplicate after checkpoint',sim=>{
 wake(sim); use(sim,locations.Medical); use(sim,locations.Archive); use(sim,locations.Salvage);
 sim.press('F9').frames(3); use(sim,locations.Archive); use(sim,locations.Salvage);
 expect(sim.program('m01').parts).toBe(1); expect(sim.program('m01').explosives).toBe(1);
});
test('M01 route choice is exclusive and persisted',sim=>{
 wake(sim); use(sim,locations.NorthRoute); use(sim,locations.SouthRoute);
 expect(sim.program('m01').routeChoice).toBe(1); sim.press('F9').frames(3); expect(sim.program('m01').routeChoice).toBe(1);
});
test('M01 mandatory path completes with no optional rewards',sim=>{
 finish(sim); expect(sim.program('m01').phase).toBe(15); expect(sim.program('m01').milestoneFlags).toBe(7);
 expect(sim.program('m01').missionComplete).toBe(true); expect(sim.program('m01').maraState).toBe(0);
 expect(sim.program('m01').transferCheck).toBeGreaterThanOrEqual(0); expect(sim).toHavePrinted('TLM1-2:');
});
test('M01 permanent upgrades charge once and survive restoration',sim=>{
 wake(sim); use(sim,locations.Medical); clear(sim,1,38); use(sim,locations.Settlement); clear(sim,5,37); use(sim,locations.Relay);
 sim.press('U').frames(2).press('U').frames(2); expect(sim.program('m01').weaponTier).toBe(1);
 expect(sim.program('m01').materials).toBe(10); sim.press('F9').frames(3); expect(sim.program('m01').weaponTier).toBe(1);
});
test('M01 death recovery keeps committed inventory without duplicating the hero',sim=>{
 wake(sim); use(sim,locations.Medical); sim.kill(heroOf(sim)).frames(80);
 expect(sim.count(0,20)).toBe(1); expect(sim.program('m01').kits).toBe(3); expect(sim.program('m01').phase).toBe(11);
});

test('M01 all evacuation groups credit actual arrivals without counting Ella twice',sim=>{
 startBattle(sim); clear(sim,1,37); go(sim,locations.Outer);
 use(sim,locations.WrenStart); use(sim,locations.Soldiers); use(sim,locations.Civilians);
 sim.move(sim.units({owner:2,type:7})[0],locations.Evac);
 for(const u of sim.units({owner:4,type:0}))sim.move(u,locations.Evac);
 for(const u of sim.units({owner:3,type:15}))sim.move(u,locations.Evac);
 sim.frames(3);
 expect(sim.program('m01').wrenState).toBe(1); expect(sim.program('m01').ellaState).toBe(1);
 expect(sim.program('m01').soldierCount).toBe(3); expect(sim.program('m01').civilianCount).toBe(5);
 sim.frames(10); expect(sim.program('m01').civilianCount).toBe(5);
});

test('M01 enemy pursuit beyond a facility cannot falsely clear that facility',sim=>{
 wake(sim); use(sim,locations.Medical);
 for(const u of sim.units({owner:1,type:38}))sim.move(u,locations.Salvage);
 use(sim,locations.Settlement); expect(sim.program('m01').phase).toBe(11);
 expect(sim).toHavePrinted('교전');
});

test('M01 W damage interrupt does not spend a kit',sim=>{
 wake(sim); use(sim,locations.Medical); sim.press('W').frames(8);
 // Mutate only the simulator fixture to represent incoming combat damage.
 (heroOf(sim) as any).hp-=5; sim.frames(2);
 expect(sim.program('m01').wUntil).toBe(0); expect(sim.program('m01').kits).toBe(3);
 expect(sim.program('m01').wReady).toBe(0);
});

test('M01 empty kits block W and top counters follow committed inventory',sim=>{
 wake(sim); use(sim,locations.Medical);
 for(let i=0;i<3;i++){(heroOf(sim) as any).hp=12;sim.press('W').frames(76).frames(1000);}
 expect(sim.program('m01').kits).toBe(0); expect(sim.resources(0).ore).toBe(0);
 (heroOf(sim) as any).hp=12;sim.press('W').frames(3);
 expect(sim.program('m01').wUntil).toBe(0);expect(sim).toHavePrinted('키트 부족');
});

test('M01 armor and Q restore the permanent level after completion',sim=>{
 wake(sim); use(sim,locations.Medical);clear(sim,1,38);use(sim,locations.Settlement);
 clear(sim,5,37);use(sim,locations.Relay);use(sim,locations.Archive);go(sim,locations.Relay);
 sim.press('B').frames(3);expect(sim.program('m01').armorTier).toBe(1);
 sim.press('Q').frames(150);expect(sim.program('m01').qUntil).toBe(0);
 sim.press('F9').frames(3);expect(sim.program('m01').armorTier).toBe(1);expect(sim.program('m01').parts).toBe(0);
});

test('M01 inaccessible transport reorders without awarding progress on a timer',sim=>{
 startBattle(sim);clear(sim,1,37);go(sim,locations.Outer);go(sim,locations.Inner);
 clear(sim,5,38);use(sim,locations.Evac);sim.frames(1200);
 expect(sim.program('m01').phase).toBe(6);expect(sim.program('m01').dropshipCrashed).toBe(false);
 sim.kill(sim.units({owner:2,type:11})[0]).frames(3);expect(sim.program('m01').phase).toBe(7);
});

test('M01 transfer values match the host codec minimum path vector',sim=>{
 finish(sim);const state=sim.program('m01');
 expect(state.transferA).toBe(0);expect(state.transferB).toBe(30339);
 expect(state.transferC).toBe(5130);expect(state.transferCheck).toBe(8145);
});

test('M01 locked E and R preserve inventory and do not create combat effects',sim=>{
 wake(sim);use(sim,locations.Salvage);sim.press('E').frames(2).press('R').frames(100);
 expect(sim.program('m01').explosives).toBe(1);expect(sim.resources(0).gas).toBe(1);
 expect(sim).toHavePrinted('M03에서 해금');
});

test('M01 result stays readable until an explicit ending confirmation',sim=>{
 finish(sim);sim.frames(20);expect(sim.program('m01').victoryIssued).toBe(false);
 sim.press('I').frames(2);expect(sim).toHavePrinted('TLM1-2:');
 sim.press('N').frames(3);expect(sim.program('m01').victoryIssued).toBe(true);
});

test('M01 optional campaign outcomes combine with mandatory completion',sim=>{
 startBattle(sim);clear(sim,1,37);go(sim,locations.Outer);
 use(sim,locations.MaraStart);use(sim,locations.WrenStart);use(sim,locations.Soldiers);use(sim,locations.Civilians);
 for(const u of sim.units({owner:2,type:10}))sim.move(u,locations.Evac);
 for(const u of sim.units({owner:2,type:7}))sim.move(u,locations.Evac);
 for(const u of sim.units({owner:4,type:0}))sim.move(u,locations.Evac);
 for(const u of sim.units({owner:3,type:15}))sim.move(u,locations.Evac);
 sim.frames(3).press('Escape').frames(3);
 use(sim,locations.Medical);use(sim,locations.Archive);use(sim,locations.Salvage);use(sim,locations.SouthRoute);
 clear(sim,7,37);use(sim,locations.Restricted);
 clear(sim,1,38);use(sim,locations.Settlement);clear(sim,5,37);use(sim,locations.Relay);
 sim.press('U').frames(2).press('B').frames(2);
 clear(sim,6,37);use(sim,locations.Supply);use(sim,locations.Exit);
 const state=sim.program('m01');
 expect(state.transferA).toBe(21397);expect(state.transferB).toBe(32431);expect(state.transferC).toBe(46361);
 expect(state.missionComplete).toBe(true);expect(state.weaponTier).toBe(1);expect(state.armorTier).toBe(1);
});

test('M01 idle journal and F9 do not create continuously repeated text',sim=>{
 wake(sim);use(sim,locations.Medical);sim.press('F9').frames(4);
 const before=sim.printed().length;sim.frames(100);expect(sim.printed().length).toBe(before);
});
