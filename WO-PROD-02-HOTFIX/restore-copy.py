from hashlib import sha256
from pathlib import Path
import sys

package = Path(__file__).resolve().parent
expected = '6f1817576a919bd45c3ceee710513262bcf6cb522f0e99dbad07b0ec3670364e'
if len(sys.argv) != 2:
    raise SystemExit('Pass the disposable reports/rollback-copy.ts.')
target = Path(sys.argv[1]).resolve()
if target != (package / 'reports').resolve() / 'rollback-copy.ts':
    raise SystemExit('Use the disposable rollback-copy.ts in the reports directory.')
original = (package / 'baseline/main.ts').read_bytes()
if sha256(original).hexdigest() != expected:
    raise SystemExit('Baseline digest mismatch.')
active = package.parent / 'src/m01/main.ts'
if target.read_bytes() != active.read_bytes():
    raise SystemExit('Start with a disposable copy of the active M01 template.')
target.write_bytes(original)
if sha256(target.read_bytes()).hexdigest() != expected:
    raise SystemExit('Restored digest mismatch.')
print('ROLLBACK: original M01 opening restored in disposable copy; active fix unchanged')
