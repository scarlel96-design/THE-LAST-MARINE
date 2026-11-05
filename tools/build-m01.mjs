import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {registerHooks,createRequire} from 'node:module';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {width,height,locations,centres,placements,encounterBudget,routeChecks} from '../src/m01/layout.mjs';
const root=resolve(import.meta.dirname,'..'), workspace=resolve(root,'../..');
const out=join(root,'WO-PROD-01'), reports=join(out,'reports');
mkdirSync(reports,{recursive:true}); mkdirSync(join(out,'generated'),{recursive:true});mkdirSync(join(out,'maps'),{recursive:true});
writeFileSync(join(reports,'M01.build.json'),JSON.stringify({status:'BUILD IN PROGRESS',liveGame:'NOT RUN'},null,2));
const sha=data=>createHash('sha256').update(data).digest('hex');
const editor=join(workspace,'work/scm-js'),plugin=join(workspace,'work/plugin-trigscript');
await import(pathToFileURL(join(editor,'scripts/lib/load-ts.mjs')));
const require=createRequire(join(plugin,'package.json')),ts=require('typescript');
registerHooks({load(url,context,next){
 const result=next(url,context);
 if(url.endsWith('.ts')&&result.source)return {format:'module',source:ts.transpileModule(String(result.source),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText};
 return result;
}});
const load=p=>import(pathToFileURL(p));
const {compileScript}=await load(join(plugin,'compiler/compiler.ts'));
const {scriptNames}=await load(join(plugin,'compiler/names.ts'));
const {buildOwnMap,isRefused}=await load(join(plugin,'compiler/backend/build.ts'));
const {defaultLib}=await load(join(plugin,'bundle/lib.mjs'));
const {resolveStrings}=await load(join(plugin,'script.ts'));
const {UNIT_NAMES}=await load(join(plugin,'vendor/units.ts'));
const {createScenario}=await load(join(editor,'src/formats/chk/create.ts'));
const {serializeScenario,parseScenario,setMapVersion}=await load(join(editor,'src/formats/chk/scenario.ts'));
const {saveMap,loadMap,readMembers}=await load(join(editor,'src/formats/mpq/scm.ts'));
const {internString}=await load(join(editor,'src/editor/settings.ts'));
const {flatTerrain}=await load(join(editor,'src/formats/tileset/terrain.ts'));
const {makeUnit}=await load(join(editor,'src/editor/units.ts'));
const {emptyTrigger,emptyCondition,emptyAction,BriefingActionType:BA,ConditionType:CT}=await load(join(editor,'src/formats/chk/sections/triggers.ts'));
const {UnitUsed}=await load(join(editor,'src/formats/chk/sections/objects.ts'));
const data=JSON.parse(readFileSync(join(root,'src/m01/content.json'),'utf8'));
const template=readFileSync(join(root,'src/m01/main.ts'),'utf8');
assert.equal((template.match(/\/\* @RADIO_TABLE \*\//g)||[]).length,1);
assert(!/setMemory|nativeQueue|nativeTransport|tblPointer|buttonSet/.test(template),'Native UI probe must remain isolated');
assert.equal(new Set(data.radio.map(row=>row[0])).size,data.radio.length,'Duplicate dialogue ID');
const radioIds=new Set(data.radio.map(row=>row[0]));
for(const match of template.matchAll(/radio\((\d+)\)/g))assert(radioIds.has(Number(match[1])),`Missing dialogue ${match[1]}`);
const radioTable=data.radio.map(([id,speaker,unit,text])=>`if(id==${id}) { print(${JSON.stringify('['+data.characters.find(c=>c.id===speaker).name+'] '+text)}); talkingPortrait(${unit},1500); playWav(${JSON.stringify('staredit\\wav\\m01-radio.wav')},160); }`).join('\n');
const source=template.replace('/* @RADIO_TABLE */',radioTable);
const generated=join(out,'generated/M01.runtime.ts');writeFileSync(generated,source);
const mapUnits=placements.map(p=>({...p,type:typeof p.type==='number'?p.type:UNIT_NAMES.indexOf(p.type)}));
assert(mapUnits.every(p=>p.type>=0&&p.type<=227));
const stats={20:{hp:40},0:{hp:40},7:{hp:60},10:{hp:160},15:{hp:40},11:{hp:150},37:{hp:35},38:{hp:80},106:{hp:1500},109:{hp:500},111:{hp:1000},112:{hp:600},113:{hp:1250},122:{hp:850},123:{hp:750},124:{hp:200},125:{hp:350}};
const world={players:[0,1,2,3,4,5,6,7],computers:[1,2,3,4,5,6,7],forces:{0:0,1:1,2:0,3:0,4:0,5:1,6:1,7:1},
 locations:Object.fromEntries(locations.map(z=>[z.index,{left:z.left,top:z.top,right:z.right,bottom:z.bottom}])),
 units:mapUnits.filter(p=>p.type!==214).map(p=>({owner:p.owner,type:p.type,x:p.x,y:p.y,hp:stats[p.type]?.hp??100,maxHp:stats[p.type]?.hp??100})),unitStats:stats};
const names=scriptNames({locations:locations.map(z=>({index:z.index-1,name:z.name}))});
const testSource=readFileSync(join(root,'tests/m01.test.ts'),'utf8');
const compiled=compileScript(ts,{'main.ts':source,'m01.test.ts':testSource},names,{lib:defaultLib(),tests:{world}});
writeFileSync(join(reports,'M01.tests.json'),JSON.stringify({sourceSha256:sha(source),templateSha256:sha(template),validation:'Source simulator only. No automatic movement, combat, pathfinding, or client execution.',diagnostics:compiled.diagnostics,tests:compiled.tests},null,2));
if(compiled.diagnostics.length){console.error(JSON.stringify(compiled.diagnostics,null,2));process.exit(1);}
const failed=compiled.tests?.results.filter(t=>t.status!=='passed')??[];
console.log(`M01 SOURCE: ${compiled.tests?.results.filter(t=>t.status==='passed').length??0} PASS / ${failed.length} FAIL`);
for(const t of failed)console.error(`${t.id}: ${t.message}`);
if(failed.length)process.exit(1);
if(process.argv.includes('--test-only'))process.exit(0);

const fill=flatTerrain(width,height,{id:2,group:2},null,()=>0,0);
const scn=createScenario({width,height,era:0,name:'THE LAST MARINE — M01 마지막 생존자',description:'WO-PROD-01 콘텐츠 통합판. Use Map Settings / Fastest. G 조사, I 기록, Q/F7, W/F8, F9 복원. 실게임 NOT RUN.',...fill});
setMapVersion(scn,'remastered');
scn.playerTypes=[6,5,5,5,5,5,5,5,7,7,7,7];scn.editorPlayerTypes=[...scn.playerTypes];
scn.playerRaces=[1,0,1,1,1,0,0,0,4,4,4,4];
scn.forces.playerForce=[0,1,0,0,0,1,1,1];scn.forces.flags=[14,10,0,0];
scn.forces.nameIndex[0]=internString(scn,'테란 연합 / 노스 릿지');
scn.forces.nameIndex[1]=internString(scn,'베스퍼 저그 군락');
scn.playerColors=[0,6,1,2,3,6,6,6];
for(const z of locations)scn.locations[z.index-1]={nameIndex:internString(scn,z.name),left:z.left,top:z.top,right:z.right,bottom:z.bottom,elevationFlags:0};
let serial=1;
for(const p of mapUnits){
 const unit=makeUnit(null,p.type,p.owner,p.x,p.y,serial++);
 if(p.wounded){unit.validStates|=UnitUsed.HitPoints;unit.hitPointsPercent=65;}
 scn.units.push(unit);
}
for(const [id,hp,name] of [[20,40,'연합군 이병 / 마지막 해병'],[10,160,'마라 베일 하사'],[7,60,'이언 렌 기술병']]){
 scn.unitSettings.useDefault[id]=0;scn.unitSettings.hitPoints[id]=hp*256;scn.unitSettings.armor[id]=0;scn.unitSettings.nameIndex[id]=internString(scn,name);
}
scn.unitSettings.weaponDamage[1]=6;
// Use native briefing records. Keep portrait slots and timed text within the documented layout.
const briefing=emptyTrigger();briefing.players[0]=1;briefing.conditions=[{...emptyCondition(),type:CT.Briefing}];
briefing.actions.push({...emptyAction(),type:BA.MissionObjectives,text:internString(scn,'정상 근무를 수행하라.\n기지 붕괴에서 생존하라.\n통신 기록과 임시 보급시설을 확보하라.\n선택: 군인·민간인 구조와 군사 자료 회수.')});
for(const line of data.briefing){
 briefing.actions.push({...emptyAction(),type:BA.ShowPortrait,unitId:line.unit,player:line.slot});
 briefing.actions.push({...emptyAction(),type:BA.TextMessage,text:internString(scn,'['+data.characters.find(c=>c.id===line.speaker).name+'] '+line.text),time:line.duration_ms});
 briefing.actions.push({...emptyAction(),type:BA.Wait,time:line.duration_ms});
 briefing.actions.push({...emptyAction(),type:BA.HidePortrait,player:line.slot});
}
scn.briefing=[briefing];
scn.triggers=resolveStrings(compiled,t=>internString(scn,t));
const chk=serializeScenario(scn);
const built=buildOwnMap({chk,compiled:{...compiled,triggers:[]},maps:true});
if(isRefused(built))throw Error(built.refused);
// Generate an original short radio cue. Do not distribute third-party recordings.
const rate=11025,samples=Math.round(rate*.16),radio=Buffer.alloc(44+samples*2);
radio.write('RIFF');radio.writeUInt32LE(radio.length-8,4);radio.write('WAVEfmt ',8);radio.writeUInt32LE(16,16);radio.writeUInt16LE(1,20);radio.writeUInt16LE(1,22);radio.writeUInt32LE(rate,24);radio.writeUInt32LE(rate*2,28);radio.writeUInt16LE(2,32);radio.writeUInt16LE(16,34);radio.write('data',36);radio.writeUInt32LE(samples*2,40);
for(let n=0;n<samples;n++)radio.writeInt16LE(Math.round(Math.sin(n/rate*2*Math.PI*1350)*5000*Math.sin(n/samples*Math.PI)),44+n*2);
const extras=new Map([['trigscript\\main.ts',new TextEncoder().encode(source)],['source\\content.json',new TextEncoder().encode(JSON.stringify(data))],['source\\layout.mjs',new Uint8Array(readFileSync(join(root,'src/m01/layout.mjs')))],['source\\campaign-transfer.mjs',new Uint8Array(readFileSync(join(root,'src/m01/campaign-transfer.mjs')))],['staredit\\wav\\m01-radio.wav',new Uint8Array(radio)],['staredit\\wav\\tlm-blast.wav',new Uint8Array(readFileSync(join(root,'assets/audio/tlm-blast.wav')))]]);
writeFileSync(join(out,'maps/M01_SOURCE.scx'),await saveMap(chk,{extras,compress:'pkware',listfile:true}));
const bytes=await saveMap(built.chk,{extras,compress:'pkware',listfile:true});
const mapPath=join(out,'maps/M01_THE_LAST_SURVIVOR.scx');writeFileSync(mapPath,bytes);
const reopened=await loadMap(new Uint8Array(readFileSync(mapPath)));
const parsed=parseScenario(reopened.chk);
const archived=await readMembers(reopened.archive,reopened.files);
for(const [name,bytes] of extras)assert.equal(sha(archived.extras.get(name)),sha(bytes),`Archive mismatch: ${name}`);
for(const match of source.matchAll(/playWav\(("(?:\\.|[^"\\])*")/g))assert(extras.has(JSON.parse(match[1])),`Missing WAV: ${match[1]}`);
assert.equal(parsed.width,width);assert.equal(parsed.height,height);assert.equal(parsed.briefing.length,1);
assert.equal(parsed.forces.flags[0],14);assert.equal(parsed.forces.flags[1],10);
assert.equal(parsed.units.length,mapUnits.length);assert(parsed.triggers.length>0);
assert.equal(parsed.units.filter(u=>u.owner===0&&u.unitId===20).length,1);
const enemyCount=parsed.units.filter(u=>[1,5,6,7].includes(u.owner)).length;
assert.equal(enemyCount,encounterBudget.total);
assert(parsed.briefing[0].actions.length<=64);
assert(parsed.briefing[0].actions.filter(a=>a.type===BA.TextMessage).length===data.briefing.length);
const briefingTexts=parsed.briefing[0].actions.filter(a=>a.type===BA.TextMessage).map(a=>parsed.strings.strings[a.text]);
for(const [index,line] of data.briefing.entries())assert.equal(briefingTexts[index],'['+data.characters.find(c=>c.id===line.speaker).name+'] '+line.text);
assert.equal(parsed.tiles.length,width*height);
assert.equal(parsed.isom.length,(width/2+1)*(height+1)*4);
assert(!template.includes('createUnit(P2')&&!template.includes('createUnit(P6')&&!template.includes('createUnit(P7')&&!template.includes('createUnit(P8'));

// Check a conservative blockout grid. This does not replace engine pathfinding validation.
const blocked=new Set();
for(const p of mapUnits.filter(p=>p.footprint)){
 const [fw,fh]=p.footprint,x=Math.floor(p.x/32-fw/2),y=Math.floor(p.y/32-fh/2);
 for(let j=y-1;j<y+fh+1;j++)for(let i=x-1;i<x+fw+1;i++)blocked.add(i+','+j);
}
const paths=[];
for(const [from,to] of routeChecks){
 const a=[Math.floor(centres[from].x/32),Math.floor(centres[from].y/32)],b=[Math.floor(centres[to].x/32),Math.floor(centres[to].y/32)];
 const queue=[a],seen=new Set([a.join(',')]);let index=0,found=false;
 while(index<queue.length){const [x,y]=queue[index++];if(x===b[0]&&y===b[1]){found=true;break;}
  for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const xx=x+dx,yy=y+dy,key=xx+','+yy;if(xx<2||yy<2||xx>=width-2||yy>=height-2||blocked.has(key)||seen.has(key))continue;seen.add(key);queue.push([xx,yy]);}}
 paths.push({from,to,connected:found});assert(found,`Blockout route disconnected: ${from} -> ${to}`);
}
const result={status:'BUILT AND REOPENED',liveGame:'NOT RUN — WO-PROD-01 prohibits game execution and input automation',
 mapPath,mapSha256:sha(bytes),bytes:bytes.length,sourceSha256:sha(source),templateSha256:sha(template),contentSha256:sha(readFileSync(join(root,'src/m01/content.json'))),
 dimensions:[width,height],placedUnits:mapUnits.length,enemyCount,encounterBudget,briefingRecords:parsed.briefing.length,briefingActions:parsed.briefing[0].actions.length,triggerRecords:parsed.triggers.length,
 terrain:'Authored building-and-road blockout on passable Badlands dirt. Finished terrain art is incomplete. Engine pathfinding is NOT RUN.',
 archivedMembersVerified:extras.size,radioLines:data.radio.length,forceFlags:parsed.forces.flags,
 blockoutRoutes:paths,compilerStats:built.stats,compilerWarnings:built.warnings,
 toolchain:'Existing scmJS and TrigScript. No native-UI compiler adapter or client patch.',
 inputPolicy:'No game launcher, Computer Use, OS input, local live runner, or installed-map deployment was invoked.'};
writeFileSync(join(reports,'M01.build.json'),JSON.stringify(result,null,2));
console.log(`M01 BUILD: ${width}x${height}; ${mapUnits.length} units; ${enemyCount} finite enemies; ${bytes.length} bytes; ${parsed.triggers.length} trigger records`);
console.log(`M01 STRUCTURE: briefing, sections, hero, finite budget, ${paths.length} blockout routes PASS; LIVE GAME NOT RUN`);
