"""Export an allowlisted, public release without local test evidence."""
from hashlib import sha256
from pathlib import Path
import re
import subprocess

root = Path(__file__).resolve().parents[1]
workspace = root.parent.parent
revision = subprocess.check_output(['git', '-C', str(root), 'rev-parse', 'HEAD'], text=True).strip()
out = workspace / 'work' / ('tlm-public-' + revision[:12])
paths = {
    'README.md': 'docs/PUBLIC_RELEASE.md',
    '.gitattributes': '.gitattributes',
    'maps/M01_NORTH_RIDGE_START_FIX.scx': 'WO-PROD-02-HOTFIX/maps/M01_NORTH_RIDGE_START_FIX.scx',
    'maps/M01_CONTROL_CHECK.scx': 'WO-PROD-02-HOTFIX/maps/M01_CONTROL_CHECK.scx',
    'maps/M02_ISOLATED_FRONT.scx': 'WO-PROD-02/maps/M02_ISOLATED_FRONT.scx',
    'maps/M02_CARRY_7877e9b59f.scx': 'WO-PROD-02/maps/M02_CARRY_7877e9b59f.scx',
}
for path in (
    'src/m01/main.ts', 'src/m01/layout.mjs', 'src/m01/content.json', 'src/m01/campaign-transfer.mjs',
    'src/m02/main.ts', 'src/m02/layout.mjs', 'src/m02/content.json', 'src/m02/transfer.mjs',
    'src/campaign/terrain.mjs', 'src/campaign/opening-check.mjs',
    'tests/m01.test.ts', 'tests/m01-prod02.append.ts', 'tests/m01-transfer.test.mjs',
    'tests/m02.test.ts', 'tests/production-transfer.test.mjs',
    'tools/build-production.mjs', 'tools/production-code.mjs',
    'assets/audio/tlm-blast.wav', 'assets/manifests/ASSETS.md'
):
    paths[path] = path

restricted = re.compile(rb'[A-Za-z]:[/\\]+Users[/\\]+|github_pat_[A-Za-z0-9_]+|gh[pousr]_[A-Za-z0-9]{20,}|BEGIN (?:RSA |OPENSSH )?PRIVATE KEY', re.I)
data = {dest: (root / src).read_bytes() for dest, src in paths.items()}
for name, content in data.items():
    if not content or restricted.search(content):
        raise SystemExit('Public export validation failed: ' + name)
data['maps/SHA256SUMS.txt'] = ''.join(
    sha256(content).hexdigest() + '  ' + Path(name).name + '\n'
    for name, content in sorted(data.items()) if name.endswith('.scx')
).encode()
out.mkdir(parents=True, exist_ok=False)
for name, content in sorted(data.items()):
    target = out / name
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_bytes(content)
    assert target.read_bytes() == content
print('EXPORT: ' + str(len(data)) + ' allowlisted files; 4 SCX; local evidence excluded')
print(out.as_posix())
