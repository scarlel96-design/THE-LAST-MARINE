from hashlib import sha256
from pathlib import Path
import json
import subprocess
import sys

root = Path(__file__).resolve().parents[1]
package = root / 'WO-PROD-02'
base = 'c49752898df8d31570aa86dcd21b7af6efd50d67'
protected = [
    'WO-PROD-01', 'src/m01/campaign-transfer.mjs', 'src/native-ui',
    'WO-UI-02', 'LOCAL_TEST_AUTOMATION'
]
baseline = 'e380ee7b241c51bbc33b01dbbef1eaf7bf4d260c38d62d3c3add9d8162b4cc08'

def digest(path):
    return sha256(path.read_bytes()).hexdigest()

assert digest(package / 'baseline/M01.runtime.ts') == baseline
subprocess.run(['git', '-C', str(root), 'diff', '--exit-code', base, '--', *protected], check=True)
if '--baseline' in sys.argv:
    print('BASELINE: M01 template hash and five protected paths match')
    raise SystemExit(0)

assert digest(root / 'src/m01/main.ts') != baseline
assert digest(package / 'reports/rollback-copy.ts') == baseline
reports = [json.loads(p.read_text(encoding='utf8')) for p in sorted((package / 'reports').glob('M*.json'))]
assert len(reports) == 3
assert sorted(r['tests']['passed'] for r in reports) == [19, 19, 32]
assert all(r['tests']['failed'] == 0 and r['status'] == 'BUILT AND REOPENED' and r['live'] == 'NOT RUN' for r in reports)
for r in reports:
    assert digest(package / 'generated' / (r['label']+'.ts')) == r['sourceSha256']
    template = root / 'src' / r['label'][:3].lower() / 'main.ts'
    assert digest(template) == r['templateSha256']
    for m in r['maps']:
        assert digest(package / 'maps' / m['name']) == m['sha256']
paths = list(p for p in package.rglob('*') if p.is_file() and p.name != 'ARTIFACT_MANIFEST.json')
for src in ['src/m01', 'src/m02', 'src/campaign']:
    paths.extend(p for p in (root / src).rglob('*') if p.is_file())
paths.extend(root / name for name in [
    'tools/build-production.mjs','tools/production-code.mjs','tools/verify-production.py',
    'tests/m01.test.ts','tests/m01-prod02.append.ts','tests/m02.test.ts','tests/production-transfer.test.mjs'
])
reopened = []
for path in sorted(paths):
    data = path.read_bytes()
    assert data
    if path.suffix == '.json':
        json.loads(data.decode('utf8'))
    reopened.append({'file':path.relative_to(root).as_posix(),'bytes':len(data),'sha256':sha256(data).hexdigest()})
manifest = package / 'ARTIFACT_MANIFEST.json'
manifest.write_text(json.dumps({'baseline':base,'live':'NOT RUN','files':reopened},indent=2)+'\n',encoding='utf8',newline='\n')
assert json.loads(manifest.read_text(encoding='utf8'))['files'] == reopened
print('PACKAGE: '+str(len(reopened))+' files reopened; 6 SCX hashes match; active M01 and baseline both preserved')
