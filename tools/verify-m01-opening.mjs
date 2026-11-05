import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {auditOpening,openingAlliances} from '../src/campaign/opening-check.mjs';
import {locations} from '../src/m01/layout.mjs';

const root=resolve(import.meta.dirname,'..'),editor=resolve(root,'../../work/scm-js');
await import(pathToFileURL(join(editor,'scripts/lib/load-ts.mjs')));
const load=path=>import(pathToFileURL(join(editor,path)));
const {parseScenario}=await load('src/formats/chk/scenario.ts');
const {loadMap,readMembers}=await load('src/formats/mpq/scm.ts');
const api=await load('src/formats/chk/sections/triggers.ts');
const out=join(root,'WO-PROD-02-HOTFIX'),site=locations.find(x=>x.name==='Barracks');
const read=(folder,name)=>readFileSync(join(out,folder,name));
const hash=b=>createHash('sha256').update(b).digest('hex');
const old=read('baseline','M01_NORTH_RIDGE.scx');
assert.equal(hash(old),'623598884471e2af5052254bccbea45642c450aab53b2acdac46d433309a812b');
const before=parseScenario((await loadMap(old)).chk);
assert.equal(before.units.find(u=>u.unitId===20).owner,0);
assert.equal(before.playerTypes[0],6);
assert.equal(before.triggers.flatMap(t=>t.actions).filter(a=>a.type===api.ActionType.SetAllianceStatus).length,0);
console.log('BEFORE: P1 hero and P1 human were already correct; 0 native alliance actions');

const report=JSON.parse(read('reports','M01_NORTH_RIDGE_START_FIX.json').toString('utf8'));
assert.equal(report.tests.passed,34);assert.equal(report.tests.failed,0);
for(const m of report.maps){
 const bytes=read('maps',m.name);assert.equal(hash(bytes),m.sha256,m.name);
 const reopened=await loadMap(bytes),map=parseScenario(reopened.chk);
 auditOpening(map,site,openingAlliances(api),api);
 assert.deepEqual(map.tiles,before.tiles,'Terrain changed during opening fix');
 assert.deepEqual(map.isom,before.isom,'ISOM changed during opening fix');
 assert.deepEqual(map.units.map(u=>[u.unitId,u.owner,u.x,u.y]),before.units.map(u=>[u.unitId,u.owner,u.x,u.y]));
 if(m.kind==='CONTROL'){
  const files=await readMembers(reopened.archive,reopened.files);
  assert.equal(files.extras.size,0);
  assert.equal(map.triggers.length,9);
  assert(map.triggers.flatMap(t=>t.actions).every(a=>[api.ActionType.SetAllianceStatus,api.ActionType.DisplayText].includes(a.type)));
 }else if(m.kind==='PLAY')assert.equal(map.triggers.length,before.triggers.length+8);
}
console.log('AFTER: 3 SCX reopened; terrain and unit placements unchanged; 24 native ally stances; control map uses only alliances and text');
