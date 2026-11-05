from hashlib import sha256
from pathlib import Path
import sys

package = Path(__file__).resolve().parent
expected = 'e380ee7b241c51bbc33b01dbbef1eaf7bf4d260c38d62d3c3add9d8162b4cc08'
if len(sys.argv) != 2:
    raise SystemExit('Usage: ROLLBACK.sh reports/rollback-copy.ts')
target = Path(sys.argv[1]).resolve()
if target != (package / 'reports').resolve() / 'rollback-copy.ts':
    raise SystemExit('Use the disposable rollback-copy.ts in the reports directory.')
original = (package / 'baseline/M01.runtime.ts').read_bytes()
if sha256(original).hexdigest() != expected:
    raise SystemExit('Baseline digest mismatch.')
active = package.parent / 'src/m01/main.ts'
if target.read_bytes() != active.read_bytes():
    raise SystemExit('Start with a disposable copy of the active M01 template.')
target.write_bytes(original)
if sha256(target.read_bytes()).hexdigest() != expected:
    raise SystemExit('Restored digest mismatch.')
print('ROLLBACK: M01 baseline SHA-256 restored in disposable copy')
