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
 expect(sim.count(2,106,locations.Barracks)).toBe(1);
 expect(sim.count(2,111,locations.Barracks)).toBe(1);
 expect(sim.count(1,37,locations.Barracks)).toBe(0);
});
