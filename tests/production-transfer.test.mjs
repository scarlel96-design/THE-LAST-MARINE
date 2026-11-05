import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {decode,encode} from '../src/m01/campaign-transfer.mjs';
import {resolveM02,encodeM03,decodeM03} from '../src/m02/transfer.mjs';

const m01=(a,b,c)=>'TLM1-2:'+a+':'+b+':'+c+':'+((a*3+b*5+c*7+54)%9973);
const example=m01(21397,32431,46361);
const minimum={a:0,b:480,c:16680,d:0,e:7};
test('M01 v1 is preserved byte-for-byte for known codes',()=>{
 for(const code of ['TLM1-2:0:30339:5130:8145',example])assert.equal(encode(decode(code)),code);
});
test('default M02 starts with fixed supplies and no presumed survival',()=>{
 const s=resolveM02();assert.equal(s.carried,false);assert.equal(s.materials,20);assert.equal(s.kits,2);
 assert.equal(s.weapon,0);assert.equal(s.mara+s.wren+s.ella,0);
});
test('M02 carried setup preserves people, choices, gear, intel and all stocks',()=>{
 const s=resolveM02(example);
 assert.deepEqual([s.mara,s.wren,s.ella,s.route,s.soldiers,s.civilians],[1,1,1,2,3,5]);
 assert.deepEqual([s.weapon,s.armor,s.experience,s.equipment,s.intel],[1,1,1,7,7]);
 assert.deepEqual([s.materials,s.parts,s.kits,s.explosives,s.warning],[45,2,5,1,1]);
});
test('unconfirmed and lost contacts stay distinct',()=>{
 const s=resolveM02(m01(34,30339,0));
 assert.deepEqual([s.mara,s.wren,s.ella],[2,0,2]);
 assert.deepEqual([s.kits,s.explosives,s.warning],[0,0,0]);
});
test('invalid carry rejects rather than silently becoming new game',()=>{
 for(const code of ['',null,'TLM2-2:0:30339:5130:8145','TLM1-2:0:30339:5130:8144',m01(3,30339,5130)])
  assert.throws(()=>resolveM02(code));
});
test('bad CLI code fails before reading the installation',()=>{
 const path=fileURLToPath(new URL('../tools/build-production.mjs',import.meta.url));
 const r=spawnSync(process.execPath,[path,'--m02-only','--code','TLM1-2:0:30339:5130:8144'],
  {encoding:'utf8',env:{...process.env,TLM_SC_INSTALL:'Z:/not-a-game'}});
 assert.equal(r.status,1);assert.match(r.stderr,/Code checksum mismatch/);assert.equal(r.stdout,'');
});
test('M03 codec roundtrips the mandatory path and all inventory fields',()=>{
 const code=encodeM03(minimum);assert.equal(code,'TLM1-3:0:480:16680:0:7:9619');
 const s=decodeM03(code);assert.deepEqual(s.groups,minimum);
 assert.deepEqual(s.inventory,{materials:40,parts:1,kits:4,explosives:0});
 assert.deepEqual(s.hero,{weaponTier:0,armorTier:0,experienceTier:2,skills:7});
 assert.equal(s.inheritedM01,null);
});
test('M03 retains optional M02 records and M01 actor outcomes',()=>{
 const code=encodeM03({a:21397,b:491,c:519173,d:32431,e:255}),s=decodeM03(code);
 assert.equal(s.inheritedM01.people.ella,'survived');assert.equal(s.inheritedM01.choices.route,2);
 assert.equal(s.records.drainSealed&&s.records.watchRestored&&s.records.motorRestored&&s.records.civilianCache,true);
 assert.equal(s.records.mineralCache,true);assert.equal(s.equipmentFlags,15);assert.equal(s.intelFlags,31);
 assert.equal(Object.hasOwn(s.inheritedM01,'bonus'),false);
 assert.equal(encodeM03(s.groups),code);
});
test('M03 rejects missing mandatory records, overflow and tampered codes',()=>{
 assert.throws(()=>encodeM03({...minimum,e:6}));
 assert.throws(()=>encodeM03({...minimum,c:524288}));
 assert.throws(()=>encodeM03({...minimum,a:1,d:0}));
 assert.throws(()=>decodeM03('TLM1-3:0:480:16680:0:7:9618'));
 assert.throws(()=>decodeM03('TLM1-2:0:30339:5130:8145'));
});
