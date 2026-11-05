import test from 'node:test';
import assert from 'node:assert/strict';
import {encode,decode,pack,m02Start} from '../src/m01/campaign-transfer.mjs';
const minimum=()=>({people:{mara:'unknown',wren:'unknown',ella:'unknown'},choices:{route:0,soldiers:0,civilians:0},equipmentFlags:3,hero:{weaponTier:0,armorTier:0,experienceTier:1},intelFlags:3,milestoneFlags:7,bonus:{materials:10,parts:0,medicalKits:5,explosives:0,earlyWarning:0}});
const raw=(a,b,c)=>`TLM1-2:${a}:${b}:${c}:${(a*3+b*5+c*7+54)%9973}`;
test('Host codec matches the simulator minimum completion vector',()=>{
 assert.equal(encode(minimum()),'TLM1-2:0:30339:5130:8145');
 assert.deepEqual(pack(minimum()),{a:0,b:30339,c:5130,check:8145});
});
test('Named survivors and bounded choices round trip',()=>{
 for(const mara of ['unknown','survived','lost'])for(const wren of ['unknown','survived','lost'])for(const ella of ['unknown','survived','lost'])for(let route=0;route<=2;route++){
  const state=minimum();state.people={mara,wren,ella};state.choices={route,soldiers:3,civilians:5};
  state.equipmentFlags=7;state.hero={weaponTier:1,armorTier:1,experienceTier:1};
  state.intelFlags=7;state.bonus={materials:99,parts:7,medicalKits:7,explosives:3,earlyWarning:1};
  const restored=decode(encode(state));
  assert.deepEqual(restored,{schemaVersion:1,sourceMission:1,targetMission:2,...state});
 }
});
test('Single decimal transcription errors are detected',()=>{
 const code=encode(minimum());
 for(let i=7;i<code.length;i++)if(/\d/.test(code[i])){
  const changed=code.slice(0,i)+(Number(code[i])+1)%10+code.slice(i+1);
  assert.throws(()=>decode(changed));
 }
});
test('Unsupported versions, missions, and malformed groups are rejected',()=>{
 for(const code of ['TLM2-2:0:30339:5130:8145','TLM1-3:0:30339:5130:8145','TLM1-2:-1:2:3:4','TLM1-2:999999:0:0:0','TLM1-2:0:0:0:9999',''])assert.throws(()=>decode(code));
});
test('Reserved fields cannot bypass validation with a recomputed checksum',()=>{
 for(const a of [3,192,1024,6*4096])assert.throws(()=>decode(raw(a,30339,5130)));
 for(const b of [30339+16,30339+64,30339+256,30339+32768])assert.throws(()=>decode(raw(0,b,5130)));
 assert.throws(()=>decode(raw(0,30339,127)));
});
test('Incomplete or inconsistent M01 completion is rejected',()=>{
 for(const change of [s=>s.milestoneFlags=3,s=>s.equipmentFlags=1,s=>s.intelFlags=1,s=>s.hero.experienceTier=0]){
  const state=minimum();change(state);assert.throws(()=>encode(state));
 }
});
test('Invalid inventory and inherited property names are rejected',()=>{
 for(const change of [s=>s.bonus.medicalKits=8,s=>s.bonus.explosives=-1,s=>s.hero.armorTier=2,s=>s.people.mara='constructor',s=>s.choices.soldiers=4]){
  const state=minimum();change(state);assert.throws(()=>encode(state));
 }
});
test('M02 host adapter separates supply bonuses from equipment and records',()=>{
 const state=minimum();state.people.ella='survived';state.bonus.parts=2;
 const m02=m02Start(state);
 assert.equal(m02.missionId,2);assert.equal(m02.inventory.materials,30);
 assert.equal(m02.inventory.specialParts,2);assert.equal(m02.inventory.medicalKits,5);
 assert.equal(m02.support.civilianSupplyRoute,true);assert.equal(m02.liveValidation,'NOT RUN');
 assert.equal(m02.records.milestoneFlags,7);
});
