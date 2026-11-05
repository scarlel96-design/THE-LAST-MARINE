"""Remove verified new runner files from a rollback test copy."""
from pathlib import Path
import hashlib
import json
import sys
package=Path(__file__).resolve().parent
work=package.parents[2]/'work'
target=Path(sys.argv[1]).resolve()
if target==work.resolve() or not target.is_relative_to(work.resolve()):
    raise SystemExit('ROLLBACK STOP: target must be a separate workspace/work copy')
manifest=json.loads((package/'ROLLBACK_MANIFEST.json').read_text(encoding='utf-8'))
for name,digest in manifest.items():
    path=(target/name).resolve()
    if not path.is_relative_to(target) or not path.is_file() or hashlib.sha256(path.read_bytes()).hexdigest()!=digest:
        raise SystemExit('ROLLBACK STOP: copy or hash differs: '+name)
for name in manifest:
    (target/name).unlink()
print('ROLLBACK: verified runner copy removed; original project artifacts retained')
