"""Check the preserved baseline without starting a game or sending input."""
from pathlib import Path
import hashlib
import json
import subprocess

ROOT = Path(__file__).resolve().parents[1]
BASE = '2a05ceb2241969e621aaa1bc7b93315815c71bdc'
EXPECTED = {
    'src/resource-ui/main.ts': '93f98bc452e2fed63afee5bb3be79aaf648b4add176fea71d89a8d94aae76795',
    'src/native-ui/main.ts': 'f1ab2fdd94fcb265c4621d3ad7d949905205d0cee96e9cf95735868e180f50fe',
    'WO-UI-02/NATIVE_UI_PROBE.scx': '809daf00164bf8f7319d9303473a421aa25278f94a3b4f4e726d330e05b6c038',
    'baseline/WO-PROD-01/main.ts': '93f98bc452e2fed63afee5bb3be79aaf648b4add176fea71d89a8d94aae76795',
}
for name, digest in EXPECTED.items():
    assert hashlib.sha256((ROOT / name).read_bytes()).hexdigest() == digest, name
runner_files = ['runner.py', 'win32_host.py', 'ocr.ps1', 'vision.py', 'START_LOCAL_TESTS.ps1']
for name in runner_files:
    path = 'LOCAL_TEST_AUTOMATION/' + name
    expected = subprocess.check_output(['git', '-C', str(ROOT), 'rev-parse', BASE + ':' + path]).strip()
    actual = subprocess.check_output(['git', '-C', str(ROOT), 'hash-object', path]).strip()
    assert actual == expected, path
print('BASELINE: 9 protected files unchanged')
