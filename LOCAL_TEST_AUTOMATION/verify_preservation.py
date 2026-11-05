"""Verify the preserved project and the baseline's missing local runner."""
from pathlib import Path
import hashlib
import subprocess
root=Path(__file__).resolve().parents[1]
expected={
    root/'src/native-ui/main.ts':'f1ab2fdd94fcb265c4621d3ad7d949905205d0cee96e9cf95735868e180f50fe',
    root/'WO-UI-02/NATIVE_UI_PROBE.scx':'809daf00164bf8f7319d9303473a421aa25278f94a3b4f4e726d330e05b6c038',
    Path(r'C:\Program Files (x86)\StarCraft\x86_64\StarCraft.exe'):'ce3ab05dc9a6aa35418947e5d95e19651ad6fbcd5e2c1856cd729c5b7c31281c'
}
for path,digest in expected.items():
    if hashlib.sha256(path.read_bytes()).hexdigest()!=digest:
        raise SystemExit('FAIL: preserved artifact differs: '+str(path))
result=subprocess.run(['git','-C',str(root),'ls-tree','-r','--name-only','d1bdc31cd9db7131601d5b432d526dfa9d8ee3a8','LOCAL_TEST_AUTOMATION'],capture_output=True,text=True,check=True)
if result.stdout.strip():raise SystemExit('FAIL: local runner already exists in baseline')
print('BASELINE: source/map/client hashes unchanged; tracked local runner absent at d1bdc31')
