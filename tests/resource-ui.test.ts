
test('UI01 projects inventory into both resource slots', sim => {
 sim.frames(5);
 expect(sim.program('poc').kits).toBe(3);
 expect(sim.program('poc').explosives).toBe(2);
 expect(sim.resources(0).ore).toBe(3);
 expect(sim.resources(0).gas).toBe(2);
 expect(sim).toHavePrinted('응급처치 키트');
 expect(sim).toHavePrinted('전술 폭약');
});

test('UI02 W leaves explosives unchanged', sim => {
 sim.frames(5).press('W').frames(76);
 expect(sim.program('poc').kits).toBe(2);
 expect(sim.program('poc').explosives).toBe(2);
 expect(sim.resources(0).ore).toBe(2);
 expect(sim.resources(0).gas).toBe(2);
});

test('UI03 R consumes only after installation completes', sim => {
 sim.frames(5).press('R').frames(10);
 expect(sim.program('poc').explosives).toBe(2);
 sim.frames(66);
 expect(sim.program('poc').explosives).toBe(1);
 expect(sim.program('poc').kits).toBe(3);
 expect(sim.program('poc').installed).toBe(1);
 expect(sim.resources(0).ore).toBe(3);
 expect(sim.resources(0).gas).toBe(1);
});

test('UI04 repeated R never duplicates installation', sim => {
 sim.frames(5).press('R').frames(10).press('R').frames(66).press('R').frames(2);
 expect(sim.program('poc').explosives).toBe(1);
 expect(sim.program('poc').installed).toBe(1);
 expect(sim).toHavePrinted('BLOCKED: R cooldown');
});

test('UI05 movement cancels R without consumption or cooldown', sim => {
 sim.frames(5).press('R').frames(10);
 sim.move(sim.units({owner:0,type:20})[0],{x:950,y:800}).frames(2);
 expect(sim.program('poc').explosives).toBe(2);
 expect(sim.program('poc').rReady).toBe(0);
 expect(sim.program('poc').rUntil).toBe(0);
});

test('UI06 empty explosives deny R without underflow', sim => {
 sim.frames(5).press('R').frames(76).frames(1441).press('R').frames(76).frames(1441).press('R').frames(2);
 expect(sim.program('poc').explosives).toBe(0);
 expect(sim.program('poc').installed).toBe(2);
 expect(sim).toHavePrinted('BLOCKED: no tactical explosives');
});

test('UI07 checkpoint restores both inventory values and cancels casts', sim => {
 sim.frames(5).press('R').frames(76).press('W').frames(76).press('F9').frames(5);
 expect(sim.program('poc').kits).toBe(3);
 expect(sim.program('poc').explosives).toBe(2);
 expect(sim.program('poc').wReady).toBe(0);
 expect(sim.program('poc').rReady).toBe(0);
 expect(sim.count(0,20)).toBe(1);
 expect(sim.resources(0).ore).toBe(3);
 expect(sim.resources(0).gas).toBe(2);
});

test('UI08 command transition snapshots consumables separately', sim => {
 sim.frames(5).press('R').frames(76).press('W').frames(76).press('C').frames(5);
 expect(sim.program('poc').mode).toBe(1);
 expect(sim.program('poc').campaignKits).toBe(2);
 expect(sim.program('poc').campaignExplosives).toBe(1);
 expect(sim.resources(0).ore).toBe(500);
 expect(sim.resources(0).gas).toBe(250);
 sim.press('W').frames(76).press('R').frames(76);
 expect(sim.program('poc').kits).toBe(2);
 expect(sim.program('poc').explosives).toBe(1);
 expect(sim.resources(0).ore).toBe(500);
 expect(sim.resources(0).gas).toBe(250);
});

test('UI09 L alternative invokes R installation', sim => {
 sim.frames(5).press('L').frames(76);
 expect(sim.program('poc').installed).toBe(1);
});

test('UI10 command transition waits for active W', sim => {
 sim.frames(5).press('W').frames(10).press('C').frames(2);
 expect(sim.program('poc').mode).toBe(0);
 expect(sim.program('poc').kits).toBe(3);
 sim.frames(66);
 expect(sim.program('poc').kits).toBe(2);
});

test('UI11 W and R share a cast lock but not cooldowns', sim => {
 sim.frames(5).press('R').frames(10).press('W').frames(2);
 expect(sim.program('poc').wUntil).toBe(0);
 sim.frames(66).press('W').frames(76);
 expect(sim.program('poc').kits).toBe(2);
 expect(sim.program('poc').explosives).toBe(1);
 expect(sim.program('poc').rReady).toBeGreaterThan(0);
 expect(sim.program('poc').wReady).toBeGreaterThan(0);
});
