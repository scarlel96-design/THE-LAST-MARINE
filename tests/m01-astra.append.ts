import {orders} from 'trigscript';

test('M01 attack follows an outer breach and defenders withdraw',sim=>{
 startBattle(sim);
 expect(sim.units({owner:1,type:37}).every(u=>u.orderId===orders.AttackMove)).toBe(true);
 sim.kill(sim.units({owner:2,type:125,at:locations.Outer})[0]);
 go(sim,locations.Outer);
 expect(sim.program('m01').phase).toBe(3);
 expect(sim).toHavePrinted('방향을 바꿨다');
 expect(sim.units({owner:2,type:0,at:locations.Outer}).every(u=>u.orderId===orders.Move)).toBe(true);
});
test('M01 reports actor death without granting rescue credit',sim=>{
 startBattle(sim);sim.kill(sim.units({owner:2,type:10})[0]).frames(3);
 expect(sim).toHavePrinted('베일 하사 전사 확인');
 sim.press('Escape').frames(3);
 expect(sim.program('m01').maraState).toBe(2);
 expect(sim.program('m01').soldierCount).toBe(0);
});
test('M01 opening, breach, skip and recovery never recenter the camera automatically',sim=>{
 sim.frames(6).moveCamera(300,480);
 startBattle(sim);clear(sim,1,37);go(sim,locations.Outer);
 sim.press('Escape').frames(3).press('F9').frames(3);
 expect(sim.program('m01').phase).toBe(10);
 expect(sim.events.filter(e=>e.text.startsWith('Center View'))).toHaveLength(0);
});
test('M01 J focuses once and leaves the mission state unchanged',sim=>{
 sim.frames(5).moveCamera(300,480).press('J').frames(40);
 expect(sim.events.filter(e=>e.text.startsWith('Center View'))).toHaveLength(1);
 expect(sim.program('m01').phase).toBe(0);
 expect(sim.count(0,20)).toBe(1);
});
test('M01 opening has one human hero and the command buildings belong to the garrison',sim=>{
 sim.frames(8);
 expect(sim.count(0,20,locations.Barracks)).toBe(1);
 expect(sim.count(2,106,locations.Command)).toBe(1);
 expect(sim.count(2,111,locations.Barracks)).toBe(1);
 expect(sim.count(1,37,locations.Barracks)).toBe(0);
});

test('ASTRA opening contains no enemies and ten friendly visibility points',sim=>{
 sim.frames(1800);
 for(const owner of [1,5,6,7])expect(sim.units({owner})).toHaveLength(0);
 expect(sim.count(0,101)).toBe(10);
 expect(sim.program('m01').spawnedTotal).toBe(0);
});

test('ASTRA optional tour stops on Escape without advancing or awarding rescue',sim=>{
 sim.frames(3).press('V').frames(3);
 expect(sim.events.filter(e=>e.text.startsWith('Center View'))).toHaveLength(1);
 sim.press('Escape').frames(400);
 expect(sim.events.filter(e=>e.text.startsWith('Center View'))).toHaveLength(1);
 expect(sim.program('m01').phase).toBe(0);
 expect(sim.program('m01').soldierCount).toBe(0);
});

test('ASTRA duty routes issue movement to guards and workers, not Wren',sim=>{
 sim.frames(4);
 expect(sim.units({owner:2,type:2})[0].orderId).toBe(orders.Move);
 const workers=sim.units({owner:2,type:7});
 expect(workers.filter(u=>u.orderId===orders.Move)).toHaveLength(2);
 expect(sim.units({owner:2,type:0,at:locations.PatrolWest})[0].orderId).toBe(orders.Move);
});

test('ASTRA prebattle introductions preserve the mission and rescue flags',sim=>{
 sim.frames(3);use(sim,locations.MaraStart);use(sim,locations.WrenStart);use(sim,locations.Civilians);use(sim,locations.Command);
 const p=sim.program('m01');
 expect(p.metMara).toBe(true);expect(p.metWren).toBe(true);expect(p.metElla).toBe(true);expect(p.inspectedHQ).toBe(true);
 expect(p.phase).toBe(0);expect(p.maraState).toBe(0);expect(p.civilianCount).toBe(0);
});

test('ASTRA visible reserve defers deployment without an empty-wave victory',sim=>{
 sim.frames(3);use(sim,locations.Armory);use(sim,locations.Outpost);
 go(sim,locations.OuterReserve);sim.frames(200);
 expect(sim.program('m01').contactIssued).toBe(false);
 expect(sim.program('m01').outerIssued).toBe(false);
 expect(sim.program('m01').phase).toBe(2);
 go(sim,locations.Barracks);sim.frames(70);
 expect(sim.count(7,37)).toBe(4);
});

test('ASTRA collapse removes base vision and does not repeat survival waves after F9',sim=>{
 wake(sim);expect(sim.count(0,101)).toBe(0);
 const total=sim.program('m01').spawnedTotal;
 clear(sim,1,38);sim.press('F9').frames(120);
 expect(sim.program('m01').spawnedTotal).toBe(total);
 expect(sim.count(1,38)).toBe(0);
});

test('ASTRA cleared depot raid needs an explicit demolition interaction',sim=>{
 startBattle(sim);clear(sim,1,37);go(sim,locations.Outer);go(sim,locations.Inner);
 clear(sim,5,38);use(sim,locations.Evac);
 sim.move(sim.units({owner:2,type:11})[0],locations.Crash).frames(3);
 clear(sim,6,38);go(sim,locations.Shelter);sim.frames(200);
 expect(sim.program('m01').phase).toBe(7);
 sim.press('G').frames(2);expect(sim.program('m01').phase).toBe(8);
 expect(sim.program('m01').blastStep).toBe(1);
 sim.frames(100);expect(sim.count(2,106,locations.Command)).toBe(0);
 sim.press('G').frames(3);expect(sim.program('m01').phase).toBe(10);
 expect(sim.program('m01').spawnedTotal).toBe(77);
});
