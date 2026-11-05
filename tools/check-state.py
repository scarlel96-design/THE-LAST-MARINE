from pathlib import Path
import sys

text = Path(sys.argv[1]).read_text(encoding='utf-8-sig')
line = next(line for line in text.splitlines() if line.startswith('현재 단계:'))
print('PHASE=NOT_STARTED' if line.endswith('Phase 1 시작 전') else 'PHASE=TECHNICAL_VALIDATION' if line.endswith('Phase 1 기술 검증 중') else 'PHASE=UNKNOWN')
