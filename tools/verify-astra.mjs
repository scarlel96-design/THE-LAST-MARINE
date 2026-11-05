import {readFileSync,readdirSync,statSync} from 'node:fs';
import {resolve,join,dirname} from 'node:path';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const root=resolve(import.meta.dirname,'..');
const sha=b=>createHash('sha256').update(b).digest('hex');
const backup=join(root,'ASTRA-PROD-01/prototype');
const manifest=JSON.parse(readFileSync(join(backup,'SHA256.json')));
for(const [p,h]of Object.entries(manifest)) {
 assert.equal(sha(readFileSync(join(root,p))),h,'Original changed: '+p);
 assert.equal(sha(readFileSync(join(backup,p))),h,'Backup changed: '+p);
}
const report=JSON.parse(readFileSync(join(root,'ASTRA-PROD-01/reports/M01_NORTH_RIDGE_ASTRA.json')));
assert.equal(sha(readFileSync(join(root,'src/m01-astra/main.ts'))),report.templateSha256,'Build template changed');
for(const m of report.maps)assert.equal(sha(readFileSync(join(root,'ASTRA-PROD-01/maps',m.name))),m.sha256);
assert.notEqual(sha(readFileSync(join(root,'src/m01-astra/main.ts'))),manifest['src/m01/main.ts']);
const files=[];
function walk(dir){for(const name of readdirSync(dir)){const p=join(dir,name);if(statSync(p).isDirectory())walk(p);else files.push(p);}}
walk(join(root,'docs/maps'));
for(const path of files.filter(p=>p.endsWith('.md'))) {
 const text=readFileSync(path,'utf8');
 assert(!text.includes('\uFFFD'),'Replacement character: '+path);
 for(const [,link]of text.matchAll(/\]\(([^)]+)\)/g)){
  if(/^(https?:|#)/.test(link))continue;
  assert(statSync(resolve(dirname(path),link.split('#')[0])).isFile(),'Missing link: '+link);
 }
}
console.log('PRESERVATION PASS: 10 originals and 10 backups unchanged; 3 new maps match build hashes');
console.log('DOCUMENT PASS: '+files.filter(p=>p.endsWith('.md')).length+' map documents reopened; local links resolve');
console.log('LIVE NOT RUN');
