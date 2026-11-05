import { test, expect } from 'trigscript';

test('Q grants armor and restores it after six seconds',sim=>{
 sim.frames(5).press('F7').frames(2);
 expect(sim.program('poc').qUntil).toBeGreaterThan(0);
 sim.frames(145);
 expect(sim.program('poc').qUntil).toBe(0);
 expect(sim).toHavePrinted('Q ended | base armor restored');
});
test('Q repeated input does not restart the active skill',sim=>{
 sim.frames(5).press('F7').frames(2);
 const until=sim.program('poc').qUntil;
 sim.press('F7').frames(2);
 expect(sim.program('poc').qUntil).toBe(until);
 expect(sim).toHavePrinted('BLOCKED: another skill active');
});
test('Q cooldown rejects a second use',sim=>{
 sim.frames(5).press('F7').frames(150).press('F7').frames(2);
 expect(sim).toHavePrinted('BLOCKED: Q cooldown');
});
test('movement cancels brace',sim=>{
 sim.frames(5).press('F7').frames(2);
 const hero:any=sim.units({owner:0,type:20})[0];
 hero.speed=2;
 sim.frames(2);
 expect(sim.program('poc').qUntil).toBe(0);
});
test('W unlock and successful heal consume exactly one kit',sim=>{
 sim.frames(5);
 if(sim.program('poc').checkpoint===0)sim.press('Escape').frames(2);
 const hero:any=sim.units({owner:0,type:20})[0];
 hero.hp=10;
 sim.press('F8').frames(76);
 expect(hero.hp).toBe(35);
 expect(sim.program('poc').kits).toBe(2);
 sim.press('F8').frames(2);
 expect(sim.program('poc').kits).toBe(2);
 expect(sim).toHavePrinted('BLOCKED: W cooldown');
});
test('movement interrupts W without resource or cooldown loss',sim=>{
 sim.frames(5);
 if(sim.program('poc').checkpoint===0)sim.press('Escape').frames(2);
 sim.press('F8').frames(10);
 sim.move(sim.units({owner:0,type:20})[0],{x:600,y:1500}).frames(2);
 expect(sim.program('poc').kits).toBe(3);
 expect(sim.program('poc').wReady).toBe(0);
 expect(sim.program('poc').wUntil).toBe(0);
});
test('five damage interrupts W without consuming a kit',sim=>{
 sim.frames(5);
 if(sim.program('poc').checkpoint===0)sim.press('Escape').frames(2);
 sim.press('F8').frames(10);
 const hero:any=sim.units({owner:0,type:20})[0];
 hero.hp-=5;
 sim.frames(2);
 expect(sim.program('poc').wUntil).toBe(0);
 expect(sim.program('poc').kits).toBe(3);
});
test('death clears effects and reconstructs checkpoint',sim=>{
 sim.frames(5).press('F7').frames(2);
 sim.kill(sim.units({owner:0,type:20})[0]).frames(2);
 expect(sim.program('poc').qUntil).toBe(0);
 sim.frames(75);
 expect(sim.count(0,20)).toBe(1);
 expect(sim.program('poc').kits).toBe(3);
});
test('scene skip finalizes once and releases the camera',sim=>{
 sim.frames(5);
 const inScene=sim.program('poc').checkpoint===0;
 sim.press('Escape').frames(3).press('Escape').frames(3);
 expect(sim.program('poc').completed).toBe(inScene?1:0);
 expect(sim.program('poc').cameraOwner).toBe(0);
 if(inScene){expect(sim.count(2,125)).toBe(0);expect(sim.count(2,109)).toBe(0);expect(sim.count(1,37)).toBe(0);}
});
test('missing NPC and off-route hero do not prevent skip recovery',sim=>{
 sim.frames(5);
 for(const u of sim.units({owner:2}))sim.kill(u);
 sim.move(sim.units({owner:0,type:20})[0],{x:1800,y:1800});
 sim.press('Escape').frames(3);
 expect(sim.program('poc').checkpoint).toBe(1);
 expect(sim.program('poc').cameraOwner).toBe(0);
});
test('watchdog reports recovery instead of successful combat',sim=>{
 sim.frames(5);
 const inScene=sim.program('poc').checkpoint===0;
 sim.frames(2700);
 if(inScene){expect(sim.program('poc').sceneState).toBe(5);expect(sim.program('poc').completed).toBe(1);}
 expect(sim.program('poc').checkpoint).toBe(1);
});
test('F7 and F8 provide alternative skill keys',sim=>{
 sim.frames(5).press('F7').frames(2);
 expect(sim.program('poc').qUntil).toBeGreaterThan(0);
 sim.frames(146);
 if(sim.program('poc').checkpoint===0)sim.press('Escape').frames(2);
 sim.press('F8').frames(2);
 expect(sim.program('poc').wUntil).toBeGreaterThan(0);
});
test('W remains locked before the survival transition',sim=>{
 sim.frames(5);
 if(sim.program('poc').checkpoint===0){
   sim.press('F8').frames(2);
   expect(sim).toHavePrinted('BLOCKED: W locked');
   expect(sim.program('poc').kits).toBe(3);
   expect(sim.program('poc').wUntil).toBe(0);
 }else expect(sim.program('poc').wUnlocked).toBe(true);
});
test('empty inventory rejects W without underflow',sim=>{
 sim.frames(5);
 if(sim.program('poc').checkpoint===0)sim.press('Escape').frames(2);
 // These writes inject simulator damage. They do not reproduce engine combat.
 const hero:any=sim.units({owner:0,type:20})[0];
 for(let i=0;i<3;i++){
   hero.hp=10;
   sim.press('F8').frames(76).frames(961);
 }
 expect(sim.program('poc').kits).toBe(0);
 hero.hp=10;
 sim.press('F8').frames(2);
 expect(sim).toHavePrinted('BLOCKED: no medical kits');
 expect(sim.program('poc').kits).toBe(0);
});
test('midpoint skip uses the same canonical state',sim=>{
 sim.frames(1000);
 const inScene=sim.program('poc').checkpoint===0;
 sim.press('Escape').frames(3);
 expect(sim.program('poc').checkpoint).toBe(1);
 expect(sim.program('poc').kits).toBe(3);
 expect(sim.program('poc').qUntil).toBe(0);
 expect(sim.program('poc').wUntil).toBe(0);
 if(inScene){expect(sim.program('poc').sceneState).toBe(4);expect(sim.program('poc').completed).toBe(1);}
});


test('UI01 projects inventory into both resource slots', sim => {
 sim.frames(5);
 expect(sim.program('poc').kits).toBe(3);
 expect(sim.program('poc').explosives).toBe(2);
 expect(sim.resources(0).ore).toBe(3);
 expect(sim.resources(0).gas).toBe(2);
 // Native labels need actual game evidence.

});

test('UI02 W leaves explosives unchanged', sim => {
 sim.frames(5).press('F8').frames(76);
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
 sim.frames(5).press('R').frames(76).press('F8').frames(76).press('F9').frames(5);
 expect(sim.program('poc').kits).toBe(3);
 expect(sim.program('poc').explosives).toBe(2);
 expect(sim.program('poc').wReady).toBe(0);
 expect(sim.program('poc').rReady).toBe(0);
 expect(sim.count(0,20)).toBe(1);
 expect(sim.resources(0).ore).toBe(3);
 expect(sim.resources(0).gas).toBe(2);
});

test('UI08 command transition snapshots consumables separately', sim => {
 sim.frames(5).press('R').frames(76).press('F8').frames(76).press('C').frames(5);
 expect(sim.program('poc').mode).toBe(1);
 expect(sim.program('poc').campaignKits).toBe(2);
 expect(sim.program('poc').campaignExplosives).toBe(1);
 expect(sim.resources(0).ore).toBe(500);
 expect(sim.resources(0).gas).toBe(250);
 sim.press('F8').frames(76).press('R').frames(76);
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
 sim.frames(5).press('F8').frames(10).press('C').frames(2);
 expect(sim.program('poc').mode).toBe(0);
 expect(sim.program('poc').kits).toBe(3);
 sim.frames(66);
 expect(sim.program('poc').kits).toBe(2);
});

test('UI11 W and R share a cast lock but not cooldowns', sim => {
 sim.frames(5).press('R').frames(10).press('F8').frames(2);
 expect(sim.program('poc').wUntil).toBe(0);
 sim.frames(66).press('F8').frames(76);
 expect(sim.program('poc').kits).toBe(2);
 expect(sim.program('poc').explosives).toBe(1);
 expect(sim.program('poc').rReady).toBeGreaterThan(0);
 expect(sim.program('poc').wReady).toBeGreaterThan(0);
});

// Native queue protocol tests. These do not emulate the native button callback.

test('Native Q queue slot 0 dispatches once and clears the queue', sim => {
 sim.frames(5);
 const hero:any = sim.units({owner:0,type:20})[0];
 hero.nativeQueue01 = 92;
 sim.frames(2);
 expect(sim.program('poc').qUntil).toBeGreaterThan(0);
 expect(hero.nativeQueue01).toBe(14942436);
 expect(hero.nativeQueue23).toBe(14942436);
 expect(hero.nativeQueue4).toBe(228);
 expect(hero.nativeQueueSlot).toBe(0);
});

test('Native Q queue slot 1 dispatches once and clears the queue', sim => {
 sim.frames(5);
 const hero:any = sim.units({owner:0,type:20})[0];
 hero.nativeQueue01 = 6029312;
 sim.frames(2);
 expect(sim.program('poc').qUntil).toBeGreaterThan(0);
 expect(hero.nativeQueue01).toBe(14942436);
 expect(hero.nativeQueue23).toBe(14942436);
 expect(hero.nativeQueue4).toBe(228);
 expect(hero.nativeQueueSlot).toBe(0);
});

test('Native Q queue slot 2 dispatches once and clears the queue', sim => {
 sim.frames(5);
 const hero:any = sim.units({owner:0,type:20})[0];
 hero.nativeQueue23 = 92;
 sim.frames(2);
 expect(sim.program('poc').qUntil).toBeGreaterThan(0);
 expect(hero.nativeQueue01).toBe(14942436);
 expect(hero.nativeQueue23).toBe(14942436);
 expect(hero.nativeQueue4).toBe(228);
 expect(hero.nativeQueueSlot).toBe(0);
});

test('Native Q queue slot 3 dispatches once and clears the queue', sim => {
 sim.frames(5);
 const hero:any = sim.units({owner:0,type:20})[0];
 hero.nativeQueue23 = 6029312;
 sim.frames(2);
 expect(sim.program('poc').qUntil).toBeGreaterThan(0);
 expect(hero.nativeQueue01).toBe(14942436);
 expect(hero.nativeQueue23).toBe(14942436);
 expect(hero.nativeQueue4).toBe(228);
 expect(hero.nativeQueueSlot).toBe(0);
});

test('Native Q queue slot 4 dispatches once and clears the queue', sim => {
 sim.frames(5);
 const hero:any = sim.units({owner:0,type:20})[0];
 hero.nativeQueue4 = 92;
 sim.frames(2);
 expect(sim.program('poc').qUntil).toBeGreaterThan(0);
 expect(hero.nativeQueue01).toBe(14942436);
 expect(hero.nativeQueue23).toBe(14942436);
 expect(hero.nativeQueue4).toBe(228);
 expect(hero.nativeQueueSlot).toBe(0);
});

test('Native W queue slot 0 dispatches once and clears the queue', sim => {
 sim.frames(5);
 const hero:any = sim.units({owner:0,type:20})[0];
 hero.nativeQueue01 = 93;
 sim.frames(2);
 expect(sim.program('poc').wUntil).toBeGreaterThan(0);
 expect(hero.nativeQueue01).toBe(14942436);
 expect(hero.nativeQueue23).toBe(14942436);
 expect(hero.nativeQueue4).toBe(228);
 expect(hero.nativeQueueSlot).toBe(0);
 sim.frames(76);
 expect(sim.program('poc').kits).toBe(2);
 expect(sim.resources(0).ore).toBe(2);
 sim.frames(76);
 expect(sim.program('poc').kits).toBe(2);
});

test('Native W queue slot 1 dispatches once and clears the queue', sim => {
 sim.frames(5);
 const hero:any = sim.units({owner:0,type:20})[0];
 hero.nativeQueue01 = 6094848;
 sim.frames(2);
 expect(sim.program('poc').wUntil).toBeGreaterThan(0);
 expect(hero.nativeQueue01).toBe(14942436);
 expect(hero.nativeQueue23).toBe(14942436);
 expect(hero.nativeQueue4).toBe(228);
 expect(hero.nativeQueueSlot).toBe(0);
 sim.frames(76);
 expect(sim.program('poc').kits).toBe(2);
 expect(sim.resources(0).ore).toBe(2);
 sim.frames(76);
 expect(sim.program('poc').kits).toBe(2);
});

test('Native W queue slot 2 dispatches once and clears the queue', sim => {
 sim.frames(5);
 const hero:any = sim.units({owner:0,type:20})[0];
 hero.nativeQueue23 = 93;
 sim.frames(2);
 expect(sim.program('poc').wUntil).toBeGreaterThan(0);
 expect(hero.nativeQueue01).toBe(14942436);
 expect(hero.nativeQueue23).toBe(14942436);
 expect(hero.nativeQueue4).toBe(228);
 expect(hero.nativeQueueSlot).toBe(0);
 sim.frames(76);
 expect(sim.program('poc').kits).toBe(2);
 expect(sim.resources(0).ore).toBe(2);
 sim.frames(76);
 expect(sim.program('poc').kits).toBe(2);
});

test('Native W queue slot 3 dispatches once and clears the queue', sim => {
 sim.frames(5);
 const hero:any = sim.units({owner:0,type:20})[0];
 hero.nativeQueue23 = 6094848;
 sim.frames(2);
 expect(sim.program('poc').wUntil).toBeGreaterThan(0);
 expect(hero.nativeQueue01).toBe(14942436);
 expect(hero.nativeQueue23).toBe(14942436);
 expect(hero.nativeQueue4).toBe(228);
 expect(hero.nativeQueueSlot).toBe(0);
 sim.frames(76);
 expect(sim.program('poc').kits).toBe(2);
 expect(sim.resources(0).ore).toBe(2);
 sim.frames(76);
 expect(sim.program('poc').kits).toBe(2);
});

test('Native W queue slot 4 dispatches once and clears the queue', sim => {
 sim.frames(5);
 const hero:any = sim.units({owner:0,type:20})[0];
 hero.nativeQueue4 = 93;
 sim.frames(2);
 expect(sim.program('poc').wUntil).toBeGreaterThan(0);
 expect(hero.nativeQueue01).toBe(14942436);
 expect(hero.nativeQueue23).toBe(14942436);
 expect(hero.nativeQueue4).toBe(228);
 expect(hero.nativeQueueSlot).toBe(0);
 sim.frames(76);
 expect(sim.program('poc').kits).toBe(2);
 expect(sim.resources(0).ore).toBe(2);
 sim.frames(76);
 expect(sim.program('poc').kits).toBe(2);
});
