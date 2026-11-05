import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { registerHooks, createRequire } from 'node:module';
const root = resolve(import.meta.dirname, '..');
const workspace = resolve(root, '../..');
const editor = join(workspace, 'work/scm-js');
const plugin = join(workspace, 'work/plugin-trigscript');
await import(pathToFileURL(join(editor, 'scripts/lib/load-ts.mjs')));
const require = createRequire(join(plugin, 'package.json'));
const ts = require('typescript');
registerHooks({load(url,context,next){
 const result=next(url,context);
 if(url.endsWith('.ts') && result.source) return {format:'module',source:ts.transpileModule(String(result.source),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText};
 return result;
}});
const load = (p) => import(pathToFileURL(p));
const {compileScript} = await load(join(plugin,'compiler/compiler.ts'));
const {scriptNames} = await load(join(plugin,'compiler/names.ts'));
const {buildOwnMap,isRefused} = await load(join(plugin,'compiler/backend/build.ts'));
const {defaultLib} = await load(join(plugin,'bundle/lib.mjs'));
const {resolveStrings} = await load(join(plugin,'script.ts'));
const {createScenario} = await load(join(editor,'src/formats/chk/create.ts'));
const {serializeScenario,parseScenario,setMapVersion} = await load(join(editor,'src/formats/chk/scenario.ts'));
const {saveMap,loadMap} = await load(join(editor,'src/formats/mpq/scm.ts'));
const {internString} = await load(join(editor,'src/editor/settings.ts'));
const {flatTerrain} = await load(join(editor,'src/formats/tileset/terrain.ts'));
const {makeUnit} = await load(join(editor,'src/editor/units.ts'));
const locations = [
  ['Home',700,700,1100,1000], ['Outer',1100,400,1500,700],
  ['Relay',1000,1000,1400,1300], ['Safe',500,1400,800,1600],
  ['Focus',500,500,564,564], ['Spawn',1600,300,1850,600]
];
const names = scriptNames({locations:locations.map(([name],index)=>({index,name}))});
const source = readFileSync(join(root,'src/poc/main.ts'),'utf8');
const testsPath = join(root,'tests/poc.test.ts');
const testsText = readFileSync(testsPath,'utf8');
const world = {
 players:[0,1,2],computers:[1,2],forces:{0:0,1:1,2:0},
 locations:Object.fromEntries(locations.map(([,left,top,right,bottom],i)=>[i+1,{left,top,right,bottom}])),
 units:[{owner:0,type:20,x:900,y:800,hp:30,maxHp:40},{owner:2,type:125,x:1300,y:550,hp:350,maxHp:350},{owner:2,type:109,x:1200,y:1150,hp:250,maxHp:250},{owner:2,type:11,x:850,y:1250},{owner:2,type:0,x:1000,y:800},{owner:1,type:37,x:1700,y:450}],
 unitStats:{20:{hp:40},125:{hp:350},109:{hp:250}}
};
let failures=0;
for (const skillLab of [false,true]) {
 const code=source.replace('const SKILL_LAB = false;',`const SKILL_LAB = ${skillLab};`);
 const r=compileScript(ts,{'main.ts':code,'poc.test.ts':testsText},names,{lib:defaultLib(),tests:{world}});
 const label=skillLab?'SKILL_POC':'COLLAPSE_90S_POC';
 mkdirSync(join(root,'reports'),{recursive:true});
 writeFileSync(join(root,`reports/${label}.tests.json`),JSON.stringify({variant:label,diagnostics:r.diagnostics,tests:r.tests},null,2));
 if(r.diagnostics.length){ console.error(JSON.stringify(r.diagnostics,null,2)); failures++;continue; }
 const testFailures=r.tests?.results.filter(t=>t.status!=='passed')??[];
 console.log(`${label}: ${r.tests?.results.filter(t=>t.status==='passed').length??0} PASS / ${testFailures.length} FAIL`);
 for(const t of testFailures)console.error(`${t.id}: ${t.message}`);
 if(testFailures.length){failures++;continue;}
 const fill=flatTerrain(64,64,{id:2,group:2},null,()=>0,0);
 const scn=createScenario({width:64,height:64,era:0,name:`TLM ${label}`,description:'Phase 1 technical proof. Use Map Settings. Fastest. Q/F7 W/F8 Escape.',...fill});
 setMapVersion(scn,'remastered');
 scn.playerTypes=[6,5,5,0,0,0,0,0,7,7,7,7];
 scn.editorPlayerTypes=[...scn.playerTypes];
 scn.playerRaces=[1,0,1,7,7,7,7,7,4,4,4,4];
 scn.forces.playerForce=[0,1,0,2,2,2,2,2];
 scn.forces.flags=[14,0,0,0];
 for(const [i,[name,left,top,right,bottom]] of locations.entries())scn.locations[i]={nameIndex:internString(scn,name),left,top,right,bottom,elevationFlags:0};
 let serial=1;
 const place=(type,owner,x,y)=>scn.units.push(makeUnit(null,type,owner,x,y,serial++));
 place(214,0,900,800);place(20,0,900,800);
 if(!skillLab){
   place(125,2,1300,550);place(109,2,1200,1150);place(11,2,850,1250);
   place(111,2,600,650);place(112,2,600,950);
   for(let i=0;i<5;i++)place(0,2,1000+i*32,800);
   for(let i=0;i<20;i++)place(37,1,1650+(i%5)*32,350+Math.floor(i/5)*32);
   for(let i=0;i<5;i++)place(38,1,1850,350+i*48);
 }
 scn.unitSettings.useDefault[20]=0;
 scn.unitSettings.hitPoints[20]=40*256;
 scn.unitSettings.armor[20]=0;
 scn.unitSettings.weaponDamage[0]=6;
 scn.unitSettings.weaponDamage[1]=6;
 scn.unitSettings.nameIndex[20]=internString(scn,'Last Marine');
 scn.triggers=resolveStrings(r,t=>internString(scn,t));
 const chk=serializeScenario(scn);
 const built=buildOwnMap({chk,compiled:{...r,triggers:[]},maps:true});
 if(isRefused(built)){console.error(built.refused);failures++;continue;}
 const extras=new Map([['trigscript\\main.ts',new TextEncoder().encode(code)],['staredit\\wav\\tlm-blast.wav',new Uint8Array(readFileSync(join(root,'assets/audio/tlm-blast.wav')))]]);
 mkdirSync(join(root,'maps/source'),{recursive:true});
 writeFileSync(join(root,`maps/source/${label}.scx`),await saveMap(chk,{extras,compress:'pkware',listfile:true}));
 const bytes=await saveMap(built.chk,{extras,compress:'pkware',listfile:true});
 mkdirSync(join(root,'maps/poc'),{recursive:true});
 const out=join(root,`maps/poc/${label}.scx`);
 writeFileSync(out,bytes);
 const reopened=await loadMap(new Uint8Array(readFileSync(out)));
 const parsed=parseScenario(reopened.chk);
 if(parsed.width!==64||parsed.height!==64||!parsed.units.some(u=>u.unitId===20)||parsed.triggers.length===0)throw Error('SCX read-back failed');
 writeFileSync(join(root,`reports/${label}.build.json`),JSON.stringify({stats:built.stats,lines:built.lines,warnings:built.warnings,bytes:bytes.length,readBack:{width:parsed.width,height:parsed.height,units:parsed.units.length,triggers:parsed.triggers.length}},null,2));
 console.log(`${label}: BUILT ${bytes.length} bytes; SCX reopened; ${parsed.triggers.length} trigger records`);
}
process.exitCode=failures?1:0;
