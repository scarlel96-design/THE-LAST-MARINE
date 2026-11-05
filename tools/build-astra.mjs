import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {registerHooks,createRequire} from 'node:module';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import * as m01 from '../src/m01-astra/layout.mjs';
import * as m02 from '../src/m02/layout.mjs';
import {M01_BRUSHES,M02_BRUSHES,seeded,auditTerrain} from '../src/campaign/terrain.mjs';
import {ASTRA_BRUSHES} from '../src/m01-astra/terrain.mjs';
import {resolveM02} from '../src/m02/transfer.mjs';
import {openingAlliances,auditOpening} from '../src/campaign/opening-check.mjs';

const args=process.argv.slice(2);
const codeAt=args.indexOf('--code');
const options=['--m01-only','--opening-fix',...args.filter((_,i)=>codeAt<0||(i!==codeAt&&i!==codeAt+1))];
const openingFix=options.includes('--opening-fix');
if((codeAt>=0&&!args[codeAt+1])||options.some(a=>!['--terrain-only','--m02-only','--m01-only','--carry-example','--opening-fix'].includes(a))||
   (openingFix&&!options.includes('--m01-only'))||
   (options.includes('--m01-only')&&(options.includes('--m02-only')||codeAt>=0||options.includes('--carry-example')))||
   (codeAt>=0&&options.includes('--carry-example')))throw Error('Usage: build-production.mjs [--m01-only|--m02-only] [--terrain-only] [--carry-example|--code CODE] [--opening-fix with --m01-only]');
const example='TLM1-2:21397:32431:46361:'+((21397*3+32431*5+46361*7+54)%9973);
const code=codeAt>=0?args[codeAt+1]:options.includes('--carry-example')?example:undefined;
// Reject invalid input before loading assets, creating directories, or touching any output.
const starter=resolveM02(code);
const sha=data=>createHash('sha256').update(data).digest('hex');
const root=resolve(import.meta.dirname,'..'),workspace=resolve(root,'../..');
const editor=join(workspace,'work/scm-js'),plugin=join(workspace,'work/plugin-trigscript');
const out=join(root,'ASTRA-PROD-01');
await import(pathToFileURL(join(editor,'scripts/lib/load-ts.mjs')));
const require=createRequire(join(plugin,'package.json')),ts=require('typescript');
const editorRequire=createRequire(join(editor,'package.json'));
registerHooks({load(url,context,next){
 const r=next(url,context);
 if(url.endsWith('.ts')&&r.source)return {format:'module',source:ts.transpileModule(String(r.source),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText};
 return r;
}});
const {Storage}=editorRequire('kascade');
const {nodeSource}=editorRequire('kascade/node');
const storage=await Storage.open(nodeSource(process.env.TLM_SC_INSTALL??'C:/Program Files (x86)/StarCraft'));
const raw=Object.fromEntries(await Promise.all(['cv5','vf4','vr4','vx4ex','wpe'].map(async ext=>[ext,await storage.readFile('tileset/badlands.'+ext)])));
const load=p=>import(pathToFileURL(p));
const tilesApi=await load(join(editor,'src/formats/tileset/decode.ts'));
const tileset=tilesApi.loadTileset({...raw,vx4:raw.vx4ex,vx4Extended:true});
const {baseTerrain,flatTerrain}=await load(join(editor,'src/formats/tileset/terrain.ts'));
const {paintIsom,diamondAt,checkIsom}=await load(join(editor,'src/editor/isom.ts'));
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
const {makeUnit}=await load(join(editor,'src/editor/units.ts'));
const triggerApi=await load(join(editor,'src/formats/chk/sections/triggers.ts'));
const {emptyTrigger,emptyCondition,emptyAction,BriefingActionType:BA,ConditionType:CT,encodeTriggers}=triggerApi;
const {Sections}=await load(join(plugin,'compiler/backend/chk.ts'));
const {UnitUsed}=await load(join(editor,'src/formats/chk/sections/objects.ts'));
const files={maps:join(out,'maps'),generated:join(out,'generated'),reports:join(out,'reports')};

function cue(){
 const rate=11025,samples=Math.round(rate*.16),b=Buffer.alloc(44+samples*2);
 b.write('RIFF');b.writeUInt32LE(b.length-8,4);b.write('WAVEfmt ',8);b.writeUInt32LE(16,16);b.writeUInt16LE(1,20);b.writeUInt16LE(1,22);b.writeUInt32LE(rate,24);b.writeUInt32LE(rate*2,28);b.writeUInt16LE(2,32);b.writeUInt16LE(16,34);b.write('data',36);b.writeUInt32LE(samples*2,40);
 for(let n=0;n<samples;n++)b.writeInt16LE(Math.round(Math.sin(n/rate*2*Math.PI*1350)*5000*Math.sin(n/samples*Math.PI)),44+n*2);
 return b;
}
const objective1='정상 근무를 수행하라.\n기지 붕괴에서 생존하라.\n통신 기록과 임시 보급시설을 확보하라.\n선택: 군인·민간인 구조와 군사 자료 회수.';
function carryBriefing(start){
 const actor=(name,state)=>name+(state===1?' 대피 확인':state===2?' 사망 확인':' 상태 미확인');
 const line=actor('베일',start.mara)+' / '+actor('렌',start.wren)+' / '+actor('모로',start.ella)+'. 구조 군인 '+start.soldiers+'명, 주민 '+start.civilians+'명.';
 const route=['경로 선택 없음','북쪽 관측로 자료','남쪽 보급로 자료'][start.route];
 const gear='자재 '+start.materials+' / 부품 '+start.parts+' / 의료 '+start.kits+' / 폭약 '+start.explosives+' / 소총 '+start.weapon+' / 전투복 '+start.armor+'.';
 return [{speaker:'log',unit:0,slot:0,duration_ms:6000,text:line},{speaker:'log',unit:0,slot:0,duration_ms:6000,text:route+' 확보 기록을 대조했다. '+gear}];
}
const baseStats={20:{hp:40},0:{hp:40},7:{hp:60},10:{hp:160},15:{hp:40},11:{hp:150},37:{hp:35},38:{hp:80},
 106:{hp:1500},109:{hp:500},110:{hp:750},111:{hp:1000},112:{hp:600},113:{hp:1250},116:{hp:850},122:{hp:850},123:{hp:750},124:{hp:200},125:{hp:350},131:{hp:1250}};

function makeScenario(layout,brushes,mission,label,start){
 const {width,height}=layout,data=JSON.parse(readFileSync(join(root,'src',mission==='m01'?'m01-astra':mission,'content.json'),'utf8'));
 const random=seeded(mission==='m01'?172:417);
 const fill=flatTerrain(width,height,baseTerrain(tileset,2),tileset,random,0);
 const scn=createScenario({width,height,era:0,name:'THE LAST MARINE — '+data.mission+' '+data.title+(openingFix?' (ASTRA 제작본)':start?.carried?' (계승)':''),
  description:openingFix?'ASTRA-PROD-01 / Use Map Settings / G 조사 / J 영웅 / V 기지 안내 / LIVE NOT RUN':'WO-PROD-02 / Use Map Settings / Fastest. G 조사, I 기록. 게임 검증 NOT RUN.',...fill});
 setMapVersion(scn,'remastered');
 for(const [name,x,y,id,extent] of brushes)assert(paintIsom(scn,tileset,diamondAt(x*32,y*32),id,extent,random),'Missing brush: '+name);
 const mapUnits=layout.placements.map(p=>({...p,type:typeof p.type==='number'?p.type:UNIT_NAMES.indexOf(p.type)}));
 assert(mapUnits.every(p=>p.type>=0&&p.type<=227));
 assert.equal(new Set(mapUnits.map(p=>p.id)).size,mapUnits.length);
 // Check placement envelopes separately from terrain reachability.
 for(const building of mapUnits.filter(p=>p.footprint)) {
  for(const unit of mapUnits) {
   if(unit===building||unit.air||unit.type===214||unit.type===195)continue;
   const ux=unit.footprint?unit.footprint[0]*16:12;
   const uy=unit.footprint?unit.footprint[1]*16:12;
   assert(!(Math.abs(unit.x-building.x)<building.footprint[0]*16+ux && Math.abs(unit.y-building.y)<building.footprint[1]*16+uy), 'Placement envelopes overlap: '+building.id+' / '+unit.id);
  }
 }
 const terrain=auditTerrain(scn,tileset,tilesApi,layout,mapUnits);
 const isom=checkIsom(scn,tileset);
 assert.equal(isom.mismatched,0);
 console.log(label+' TERRAIN: '+Object.keys(terrain.heights).length+' elevation levels; '+terrain.routes.length+' routes; '+terrain.blockedTiles+' restricted tiles');
 return {scn,data,mapUnits,terrain,isom};
}

async function build(mission,label,layout,brushes,start){
 const {width,height,locations,encounterBudget}=layout;
 const {scn,data,mapUnits,terrain,isom}=makeScenario(layout,brushes,mission,label,start);
 if(options.includes('--terrain-only'))return;
 for(const dir of Object.values(files))mkdirSync(dir,{recursive:true});
 const template=readFileSync(join(root,'src',mission==='m01'?'m01-astra':mission,'main.ts'),'utf8');
 assert(!/setMemory|nativeQueue|nativeTransport|tblPointer|buttonSet/.test(template),'Native UI probe must remain isolated');
 assert.equal((template.match(/\/\* @RADIO_TABLE \*\//g)||[]).length,1);
 const radioIds=new Set(data.radio.map(row=>row[0]));
 assert.equal(radioIds.size,data.radio.length);
 for(const match of template.matchAll(/radio\((\d+)\)/g))assert(radioIds.has(Number(match[1])),'Missing radio '+match[1]);
 const speakers=new Map(data.characters.map(c=>[c.id,c.name]));
 const speakerLine=(speaker,message)=>{assert(speakers.has(speaker));return '['+speakers.get(speaker)+'] '+message;};
 const wav='staredit\\wav\\'+mission+'-radio.wav';
 const radio=data.radio.map(([id,speaker,unit,message])=>'if(id=='+id+'){print('+JSON.stringify(speakerLine(speaker,message))+');talkingPortrait('+unit+',1500);playWav('+JSON.stringify(wav)+',160);}').join('\n');
 let source=template.replace('/* @RADIO_TABLE */',radio);
 if(start){
  assert(source.includes('/* @START_DATA */'));
  source=source.replace('/* @START_DATA */',Object.entries(start).map(([k,v])=>'const START_'+k.toUpperCase()+':'+typeof v+'='+JSON.stringify(v)+';').join('\n'));
 }
 const stats={...baseStats,20:{hp:mission==='m01'?40:55}};
 const forces={0:0,1:1,2:0,3:0,4:0,5:1,6:1,7:1};
 const world={players:[0,1,2,3,4,5,6,7],computers:[1,2,3,4,5,6,7],forces,
  locations:Object.fromEntries(locations.map(z=>[z.index,{left:z.left,top:z.top,right:z.right,bottom:z.bottom}])),
  units:mapUnits.filter(p=>p.type!==214).map(p=>{
   const maxHp=stats[p.type]?.hp??100;
   return {owner:p.owner,type:p.type,x:p.x,y:p.y,hp:Math.floor(maxHp*(p.hpPercent??(p.wounded?65:100))/100),maxHp};
  }),unitStats:stats};
 const names=scriptNames({locations:locations.map(z=>({index:z.index-1,name:z.name}))});
 const tests=readFileSync(join(root,'tests',mission==='m01'?'m01-astra.test.ts':mission+'.test.ts'),'utf8')+
  (mission==='m01'?'\n'+readFileSync(join(root,'tests/m01-astra.append.ts'),'utf8'):'');
 const testSource=start?tests.replace('/* @EXPECTED_START */','const expected='+JSON.stringify(start)+';'):tests;
 const compiled=compileScript(ts,{'main.ts':source,[mission+'.test.ts']:testSource},names,{lib:defaultLib(),tests:{world}});
 const failures=compiled.tests?.results.filter(t=>t.status!=='passed')??[];
 const passed=compiled.tests?.results.filter(t=>t.status==='passed').length??0;
 const resultPath=join(files.reports,label+'.json');
 const report={label,status:'CHECKS IN PROGRESS',live:'NOT RUN',sourceSha256:sha(source),templateSha256:sha(template),terrain,isom,
   diagnostics:compiled.diagnostics,tests:{passed,failed:failures.length,results:compiled.tests?.results.map(t=>({id:t.id,status:t.status,message:t.message??null}))??[]}};
 writeFileSync(resultPath,JSON.stringify(report,null,2)+'\n');
 if(compiled.diagnostics.length)throw Error(JSON.stringify(compiled.diagnostics,null,2));
 for(const t of failures)console.error(t.id+': '+t.message);
 assert(passed>0&&failures.length===0,'Simulator gate failed: '+label);
 console.log(label+' SOURCE: '+passed+' PASS / 0 FAIL');

 scn.playerTypes=[6,5,5,5,5,5,5,5,7,7,7,7];scn.editorPlayerTypes=[...scn.playerTypes];
 scn.playerRaces=[1,0,1,1,1,0,0,0,4,4,4,4];
 scn.forces.playerForce=Object.values(forces);scn.forces.flags=[14,10,0,0];
 scn.forces.nameIndex[0]=internString(scn,'테란 연합 제17병참연대');
 scn.forces.nameIndex[1]=internString(scn,'베스퍼 저그 군락');
 scn.playerColors=[0,6,1,2,3,6,6,6];
 for(const z of locations)scn.locations[z.index-1]={nameIndex:internString(scn,z.name),left:z.left,top:z.top,right:z.right,bottom:z.bottom,elevationFlags:0};
 for(const [i,p] of mapUnits.entries()){
  const unit=makeUnit(null,p.type,p.owner,p.x,p.y,i+1);
  if(p.hpPercent!==undefined||p.wounded){unit.validStates|=UnitUsed.HitPoints;unit.hitPointsPercent=p.hpPercent??65;}
  scn.units.push(unit);
 }
 for(const [id,hp,name] of [[20,stats[20].hp,'연합군 이병 / 마지막 해병'],[10,160,'마라 베일 하사'],[7,60,'연합군 정비병']]){
  scn.unitSettings.useDefault[id]=0;scn.unitSettings.hitPoints[id]=hp*256;scn.unitSettings.armor[id]=0;
  scn.unitSettings.nameIndex[id]=internString(scn,name);
 }
 scn.unitSettings.weaponDamage[1]=6;
 const briefing=emptyTrigger();briefing.players[0]=1;briefing.conditions=[{...emptyCondition(),type:CT.Briefing}];
 briefing.actions.push({...emptyAction(),type:BA.MissionObjectives,text:internString(scn,data.objectives??objective1)});
 const brief=[...data.briefing,...(start?.carried?carryBriefing(start):[])];
 for(const line of brief){
  briefing.actions.push({...emptyAction(),type:BA.ShowPortrait,unitId:line.unit,player:line.slot});
  briefing.actions.push({...emptyAction(),type:BA.TextMessage,text:internString(scn,speakerLine(line.speaker,line.text)),time:line.duration_ms});
  briefing.actions.push({...emptyAction(),type:BA.Wait,time:line.duration_ms});
  briefing.actions.push({...emptyAction(),type:BA.HidePortrait,player:line.slot});
 }
 assert(briefing.actions.length<=64);
 scn.briefing=[briefing];scn.triggers=resolveStrings(compiled,t=>internString(scn,t));
 const chk=serializeScenario(scn),built=buildOwnMap({chk,compiled:{...compiled,triggers:[]},maps:true});
 if(isRefused(built))throw Error(built.refused);
 const prefix=openingFix?openingAlliances(triggerApi):[];
 let playChk=built.chk,sourceChk=chk,controlChk;
 if(openingFix){
  const play=new Sections(built.chk),boot=play.all('TRIG');
  const native=encodeTriggers(prefix);
  // Prepend only. The compiler boot sequence still owns the last native trigger.
  play.set('TRIG',Buffer.concat([native,boot]));
  assert.deepEqual(Buffer.from(play.all('TRIG').subarray(native.length)),Buffer.from(boot));
  playChk=play.bytes();
  const originalSourceTriggers=scn.triggers;
  scn.triggers=[...prefix,...originalSourceTriggers];
  sourceChk=serializeScenario(scn);
  const control=parseScenario(sourceChk);
  const message=emptyTrigger();
  message.players[0]=1;message.conditions.push({...emptyCondition(),type:CT.Always});
  message.actions.push({...emptyAction(),type:triggerApi.ActionType.DisplayText,flags:4,text:internString(control,'조작 점검용 맵. 해병 선택과 화면 스크롤만 확인하세요. 임무 트리거와 단축키는 없습니다.')});
  control.triggers=[...prefix,message];
  const {markDirty}=await load(join(editor,'src/formats/chk/scenario.ts'));
  control.nameIndex=internString(control,'TLM M01 — 조작 점검용');
  markDirty(control,'SPRP');
  markDirty(control,'TRIG');
  controlChk=serializeScenario(control);
 }
 const extras=new Map([
  ['trigscript\\main.ts',Buffer.from(source)],
  ['source\\content.json',Buffer.from(JSON.stringify({...data,briefing:brief}))],
  ['source\\layout.mjs',readFileSync(join(root,'src',mission==='m01'?'m01-astra':mission,'layout.mjs'))],
  ['source\\terrain-plan.json',Buffer.from(JSON.stringify(brushes))],
  ['source\\campaign-transfer-v1.mjs',readFileSync(join(root,'src/m01/campaign-transfer.mjs'))],
  [wav,cue()],['staredit\\wav\\tlm-blast.wav',readFileSync(join(root,'assets/audio/tlm-blast.wav'))]
 ]);
 if(start)extras.set('source\\m02-transfer.mjs',readFileSync(join(root,'src/m02/transfer.mjs')));
 for(const match of source.matchAll(/playWav\(("(?:\\.|[^"\\])*")/g))assert(extras.has(JSON.parse(match[1])));
 const saved=[];
 for(const [kind,raw] of [['SOURCE',sourceChk],['PLAY',playChk],...(controlChk?[['CONTROL',controlChk]]:[])]){
  const name=kind==='SOURCE'?label+'_SOURCE.scx':kind==='CONTROL'?'M01_CONTROL_CHECK.scx':label+'.scx',path=join(files.maps,name);
  const archivedExtras=kind==='CONTROL'?new Map():extras;
  const bytes=await saveMap(raw,{extras:archivedExtras,compress:'pkware',listfile:true});
  const reopened=await loadMap(bytes),parsed=parseScenario(reopened.chk);
  const members=await readMembers(reopened.archive,reopened.files);
  for(const [member,expected] of archivedExtras)assert.equal(sha(members.extras.get(member)),sha(expected),member);
  assert.equal(parsed.width,width);assert.equal(parsed.height,height);
  assert.equal(sha(Buffer.from(parsed.tiles.buffer)),sha(Buffer.from(scn.tiles.buffer)));
  assert.equal(sha(Buffer.from(parsed.isom.buffer)),sha(Buffer.from(scn.isom.buffer)));
  assert.equal(parsed.units.length,mapUnits.length);
  assert.equal(parsed.units.filter(u=>u.owner===0&&u.unitId===20).length,1);
  assert.deepEqual(parsed.forces.flags,[14,10,0,0]);
  assert.equal(parsed.briefing.length,1);
  const messages=parsed.briefing[0].actions.filter(a=>a.type===BA.TextMessage).map(a=>parsed.strings.strings[a.text]);
  assert.deepEqual(messages,brief.map(line=>speakerLine(line.speaker,line.text)));
  if(kind==='PLAY')assert(parsed.triggers.length>0);
  if(openingFix){
   const site=locations.find(z=>z.name==='Barracks');
   report.opening=auditOpening(parsed,site,prefix,triggerApi);
   assert.equal(parsed.units.filter(u=>[1,5,6,7].includes(u.owner)).length,0,'No opening Zerg');
   if(kind==='CONTROL')assert.equal(parsed.triggers.length,9,'Control map must not contain EUD startup');
  }
  assert.equal(parsed.units.filter(u=>[1,5,6,7].includes(u.owner)).length,mission==='m01'?0:1);
  writeFileSync(path,bytes);
  assert.equal(sha(readFileSync(path)),sha(bytes));
  saved.push({name,kind,bytes:bytes.length,sha256:sha(bytes),triggers:parsed.triggers.length});
 }
 writeFileSync(join(files.generated,label+'.ts'),source);
 report.status='BUILT AND REOPENED';report.maps=saved;report.units=mapUnits.length;report.encounterBudget=encounterBudget;
 report.briefingLines=brief.length;report.radioLines=data.radio.length;report.members=extras.size;
 report.compiler={warnings:built.warnings,stats:built.stats};report.start=start??null;
 report.tileset={installedVersion:storage.build.version,sha256:Object.fromEntries(Object.entries(raw).map(([name,bytes])=>[name,sha(bytes)]))};
 writeFileSync(resultPath,JSON.stringify(report,null,2)+'\n');
 console.log(label+' BUILD: '+width+'x'+height+'; '+mapUnits.length+' placed units; '+saved[1].bytes+' bytes; SCX and briefing reopened; LIVE NOT RUN');
 if(openingFix)console.log('OPENING: sole human P1; P1 hero; P3 barracks; 24 native ally stances; control map without EUD');
}
if(!options.includes('--m02-only'))await build('m01','M01_NORTH_RIDGE_ASTRA',m01,ASTRA_BRUSHES);
if(!options.includes('--m01-only')) {
 await build('m02','M02_ISOLATED_FRONT',m02,M02_BRUSHES,resolveM02());
 if(code!==undefined)await build('m02','M02_CARRY_'+sha(JSON.stringify(starter)).slice(0,10),m02,M02_BRUSHES,starter);
}
