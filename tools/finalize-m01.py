"""Create the offline M01 handoff from observed build results."""
from pathlib import Path
import difflib
import hashlib
import json
import subprocess

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'WO-PROD-01'
WORKSPACE = ROOT.parent.parent
def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()
build = json.loads((OUT / 'reports/M01.build.json').read_text(encoding='utf8'))
tests = json.loads((OUT / 'reports/M01.tests.json').read_text(encoding='utf8'))
assert build['status'] == 'BUILT AND REOPENED'
assert tests['diagnostics'] == []
assert len(tests['tests']['results']) == 29
assert all(row['status'] == 'passed' for row in tests['tests']['results'])
assert digest(ROOT / 'src/m01/main.ts') == build['templateSha256']
assert digest(OUT / 'maps/M01_THE_LAST_SURVIVOR.scx') == build['mapSha256']
assert digest(OUT / 'generated/M01.runtime.ts') == build['sourceSha256']
original = ROOT / 'baseline/WO-PROD-01/main.ts'
modified = ROOT / 'src/m01/main.ts'
assert digest(original) == '93f98bc452e2fed63afee5bb3be79aaf648b4add176fea71d89a8d94aae76795'
assert digest(OUT / 'reports/rollback-copy.ts') == digest(original)
assert digest(modified) != digest(original)
patch = ''.join(difflib.unified_diff(original.read_text(encoding='utf8').splitlines(True),modified.read_text(encoding='utf8').splitlines(True),fromfile='baseline/WO-PROD-01/main.ts',tofile='src/m01/main.ts',n=0))
(OUT / 'DIFF.patch').write_text(patch,encoding='utf8',newline='\n')
commit = subprocess.check_output(['git','-C',str(ROOT),'rev-parse','HEAD'],text=True).strip()
baseline_command = 'python -X utf8 outputs/The-Last-Marine/tools/verify-m01-preservation.py'
build_command = 'node outputs/The-Last-Marine/tools/build-m01.mjs'
codec_command = 'node --test outputs/The-Last-Marine/tests/m01-transfer.test.mjs'
rollback_command = "& 'C:/Program Files/Git/bin/bash.exe' outputs/The-Last-Marine/WO-PROD-01/ROLLBACK.sh '" + (OUT / 'reports/rollback-copy.ts').as_posix() + "'"
verification = f'''WO-PROD-01 / PARTIAL
Branch: codex/wo-prod-01
Implementation commit: {commit}
Changed branch/field: M01 phase 0 -> 15; actor arrival records; inventory journal; CampaignTransfer schemaVersion=1.
MODIFIED_FILE={modified}
DIFF_FILE={OUT / 'DIFF.patch'}
VERIFICATION={OUT / 'VERIFICATION.txt'}
ROLLBACK={OUT / 'ROLLBACK.sh'}
Original SHA256={digest(original)}
Modified template SHA256={digest(modified)}
Generated runtime SHA256={build['sourceSha256']}
SCX SHA256={build['mapSha256']}
Working directory for the exact commands below: {WORKSPACE}

BASELINE
Command: {baseline_command}
Input: existing source, UI probe map, runner files, baseline copy; no game process input.
Literal output: BASELINE: 9 protected files unchanged
Exit status: 0

MODIFIED
Command: {build_command} > outputs/The-Last-Marine/WO-PROD-01/reports/build.log 2>&1
Input: src/m01/main.ts, content.json, layout.mjs, tests/m01.test.ts; existing scmJS/TrigScript.
Literal output:
{(OUT / 'reports/build.log').read_text(encoding='utf8').strip()}
Exit status: 0
Command: {codec_command}
Input: tests/m01-transfer.test.mjs and src/m01/campaign-transfer.mjs.
Literal result: tests 8; pass 8; fail 0; cancelled 0; skipped 0; todo 0.
Exit status: 0

ROLLBACK
Preparation: copy MODIFIED_FILE to WO-PROD-01/reports/rollback-copy.ts.
Command: {rollback_command}
Input: disposable rollback-copy.ts; preserved original baseline/WO-PROD-01/main.ts.
Literal output: ROLLBACK: original bytes restored; production source retained
Exit status: 0
Restored status: disposable copy SHA256 equals original SHA256; active M01 source remains modified.
Restored behavior: original source bytes restored on the disposable copy. Restored game behavior: NOT RUN.
Earlier rollback attempt: Git Bash named-object access returned 0xC0000022, exit 1.
Second attempt: Get-FileHash was absent from the child PowerShell environment, exit 1.
Correction: use .NET hashing and file copy. The same shell wrapper then returned exit 0.

LIVE GAME: NOT RUN. No launcher, game window input, installed-map deployment, or client modification was used.
The simulator does not move units, calculate combat, render UI, play audio, or validate engine pathfinding.
No live compatibility or release GO is claimed.
'''
(OUT / 'VERIFICATION.txt').write_text(verification,encoding='utf8')
report = f'''# WO-PROD-01 — M01 통합 제작 결과

판정: **PARTIAL**. M01 콘텐츠 소스와 SCX 생성·구조 검사를 완료했다.
실게임 검증은 **NOT RUN**이다. 게임 실행과 화면 입력은 수행하지 않았다.

## 제작물

- 실행용 빌드: `maps/M01_THE_LAST_SURVIVOR.scx`.
- 편집용 맵: `maps/M01_SOURCE.scx`.
- 런타임 템플릿: `../src/m01/main.ts`.
- 완성된 대사 포함 소스: `generated/M01.runtime.ts`.
- 브리핑·인물·대사: `../src/m01/content.json`.
- 장소·유닛·조우 배치: `../src/m01/layout.mjs`.
- 계승 코덱: `../src/m01/campaign-transfer.mjs`.
- 빌더: `../tools/build-m01.mjs`.

위 경로는 이 보고서 위치를 기준으로 한다.
전체 절대 경로와 해시는 `ARTIFACT_MANIFEST.json`에 기록한다.
SCX는 192×192이며, 초기 배치 유닛은 143개다.
적 72개체를 미리 배치했다. 반복 적 생성은 없다.
컴파일된 시작 트리거는 77개다. 내부 실행 그래프는 {build['compilerStats']['graphTriggers']}개다.
실행용 SCX는 {build['bytes']}바이트다.
SCX SHA-256: `{build['mapSha256']}`.

## 통합 콘텐츠

| 구간 | 구현한 진행 | 실제 맵 동작 |
|---|---|---|
| 정상 근무 | 연합 제17병참연대의 경계 임무 | 무기고 조사, SCV 순찰, Q 해금 |
| 이상 징후 | 진동 감지, 예비 통신 회선 장애 | 감시초소 조사, 외곽 공격 명령 |
| 외곽 방어 | 북부 진입로 방어 | 저글링 18개체, 아군 4명, 벙커 피격 검사 |
| 내부 방어 | 철수와 고립 인원 구조 | 히드라리스크 20개체, 두 번째 방어선 |
| 선택 구조 | 베일·렌·모로, 군인 3명, 주민 5명 | 이동 명령 후 도착한 개체만 기록 |
| 철수 실패 | 연료 이상 수송선의 비상 착륙 | 수송선 이동·파괴, 적 14개체의 탄약고 공격 |
| 기지 붕괴 | 차폐벽 대피와 폭발 후 의식 회복 | 탄약고 파괴, 건물 붕괴, 의료시설로 전환 |
| 고립 생존 | 의료 모듈, 키트, 정착지 보급 | W 해금, 이동·피해 중단, 유한한 잔존 적 |
| 군사 기록 | 통신중계소와 선택 자료 확보 | 필수 기록, 자료실·폐차량·제한 구역 조사 |
| 장비 성장 | 소총·전투복 개량, 숙련 인정 | 비용 차감, 공격 업그레이드, 방어력·최대 체력 변화 |
| M02 연결 | 임시 보급시설 복구와 결과 작성 | 상태 코드 발급, I 재표시, N 승리 처리 |

방어선은 위치와 유닛·시설 상태를 함께 검사한다.
적 부대가 통과하지 못하면 감시 타이머가 이동 명령을 다시 보낸다.
타이머는 전투를 자동 성공으로 처리하지 않는다.
카메라는 하나의 소유권으로 관리한다. 장면 카메라는 2초 뒤 주인공으로 돌아간다.
플레이어 조작은 유지된다. Escape는 붕괴 구간을 정규 생존 상태로 정리한다.
스킵은 선택 구조 실적을 새로 지급하지 않는다.
음향은 기존 폭발음과 이번에 생성한 짧은 무전 신호음을 사용한다.
음성 녹음과 완성형 음향 믹싱은 구현하지 않았다.

## 인물과 서사 회수

주인공은 경계 임무를 수행하는 이병이다.
마라 베일 하사는 외곽 후미를 엄호한다. 구조 기록은 M02 조기 경보와 M04 증언에 연결한다.
이언 렌 기술병은 연료 계통 이상을 사전에 보고한다. 구조 기록은 M02 정비 부품에 연결한다.
엘라 모로는 민간 대피를 안내한다. 구조 기록은 M02 민간 보급망에 연결한다.
통제소의 마지막 저장 기록은 M03 통신 복구에서 회수할 서사 근거다.

대피 인원은 착륙장 지하 통로의 도착 경계에서 맵을 이탈한다.
이 경계는 동부 집결지로 이어지는 통로를 추상화한다.
주인공은 후미 경계 때문에 고장 난 수송선을 기다린다.
따라서 수송선 추락이 먼저 이탈한 인원의 생존 기록을 취소하지 않는다.
렌이 사망하면 탄약고 경고는 통제소 자동 경보로 바뀐다.
이후 미션의 장면과 대사는 아직 제작하지 않았다.

브리핑은 네 개 문장 묶음과 초상 슬롯을 사용한다.
MBRF에는 17개 동작이 들어 있다.
대사 데이터에는 무전 45개가 들어 있다.
한국어 브리핑 문자열은 SCX 저장 후 재읽기에서 원문과 일치했다.

## 생존·보급·기록 연결

G는 표식 조사와 대피 명령이다. I는 현재 기록을 표시한다.
Q/F7은 6초 방어 자세다. 쿨타임은 18초다.
이동 명령, 실제 좌표 변화, 지속시간 종료는 기본 방어력을 복원한다.
W/F8은 3초 치료다. 성공하면 체력 25를 회복하고 키트 1개를 소비한다.
W 쿨타임은 성공 후 40초다. 이동 또는 5 이상 피해는 소비 없이 중단한다.
키트가 없으면 W를 차단한다.
E는 M02, R은 M03 해금 안내만 표시한다. M01에는 E/R 전투 효과가 없다.

상단 미네랄 수치는 키트 수량과 연결했다.
상단 가스 수치는 보관 폭약 수량과 연결했다.
수치 변경 때만 해당 자원을 갱신한다.
군수자재와 특수부품은 별도 변수로 관리한다.
한국어 상단 명칭과 네이티브 버튼은 이 맵에 연결하지 않았다.
현재 기록은 I와 임무 목표로 표시한다. 지속적인 텍스트 덮어쓰기는 사용하지 않는다.

U는 자재 10으로 소총을 한 단계 개량한다.
B는 자재 12와 부품 1로 전투복을 한 단계 개량한다.
중계소 확보는 숙련 단계와 최대 체력 55를 해금한다.
선택 보급품 없이도 필수 진행이 가능하도록 기본 보급을 지급한다.
선택 보급은 자료실, 폐차량, 제한 구역에서 각각 한 번만 지급한다.
북쪽 우회로는 조기 경보를 제공한다. 남쪽 우회로는 자재를 제공한다.
두 경로 선택은 상호 배타적이다.

F9와 사망 복구는 마지막 유효 거점으로 주인공을 재배치한다.
보급과 소비는 즉시 기록에 반영한다. 복원 후 같은 보급품을 다시 지급하지 않는다.
기록은 장비·소모품·필수 진행·전공·시설 사건 완료 여부를 유지한다.
적 사망과 구조 인원의 이탈은 되돌리지 않는다.
전투 도중의 모든 유닛 위치와 피해를 재현하는 저장 기능은 구현하지 않았다.
복원은 진행 가능한 거점 상태를 구성한다. 실게임 경로·배치 안정성은 NOT RUN이다.

## 미션 계승 기반

코드 형식은 `TLM1-2:A:B:C:CHECK`다.
스키마 버전 1과 목적 미션 2를 고정한다.
A는 인물 상태, 경로 선택, 구조 인원이다.
B는 특수 장비, 영구 강화, 숙련, 군사 정보, 필수 전공이다.
C는 다음 미션의 자재·부품·키트·폭약·조기 경보다.
검사값은 `(A*3+B*5+C*7+54)%9973`이다. 인증 기능은 아니다.

인물 상태 0은 미확인, 1은 대피 완료, 2는 사망 확인이다.
생존자와 전공의 독립 맵 자동 전달은 가정하지 않는다.
M01은 코드를 출력한다. 호스트 코덱은 버전·범위·오타를 검사한다.
M02 호스트 어댑터는 장비·기록·인물·보급을 분리한 시작 상태를 만든다.
실게임 코드 입력 화면과 M02 SCX 복원은 아직 구현하지 않았다.

다음 미션의 기본 자재는 20이다. 추가 자재는 기본 10, 군인 구조 5, 남쪽 경로 10이다.
추가 부품은 렌 구조 1과 내열 라이닝 확보 1이다.
키트는 최대 7개, 폭약은 최대 3개를 계승한다.
베일 구조 또는 북쪽 경로는 조기 경보를 해금한다.
소비형 자재의 잔액 전부를 전달하지 않는다. 명시한 보너스 규칙으로 변환한다.

최소 완료 시험 코드는 `TLM1-2:0:30339:5130:8145`다.
소스 시뮬레이터의 계산값과 호스트 코덱의 계산값이 일치했다.

## 검증 결과

| 검사 | 결과 | 근거 |
|---|---|---|
| 소스 타입·컴파일 | PASS | 진단 0건 |
| M01 통합 소스 시뮬레이션 | PASS | 29개 성공, 0개 실패 |
| 계승 코덱 | PASS | 8개 성공, 0개 실패 |
| SCX 생성·재열기 | PASS | 크기·유닛·트리거·브리핑 확인 |
| 내장 소스·음향 보존 | PASS | 6개 멤버의 바이트 해시 비교 |
| 한국어 브리핑 저장 | PASS | 재읽은 문자열과 원문 비교 |
| 이동로 초안 | PASS | 건물 여유 폭을 포함한 격자 연결 12개 |
| 기준 파일 보존 | PASS | 기존 소스·UI 맵·실행기와 원본 복사본 9개 |
| 복사본 되돌리기 | PASS | 원본 해시 일치, M01 소스 유지 |
| 실제 게임 실행·입력·전투·복구 | NOT RUN | 사용자 실행 금지 |
| 실제 한국어 표시·음향·브리핑 시간 | NOT RUN | 사용자 실행 금지 |
| 실제 길 찾기·시네마틱·프레임·밸런스 | NOT RUN | 사용자 실행 금지 |

시뮬레이터는 이동과 전투를 자동으로 계산하지 않는다.
테스트는 인원의 이동과 적 사망을 직접 설정해 진행 조건을 확인한다.
이 결과는 실제 전투 난이도와 화면 품질의 검증 근거가 아니다.
기존 테스트 실행기와 과거 실게임 증거는 수정하지 않았다.
이번 작업에서 기존 기능의 실게임 회귀 검사는 실행하지 않았다.

검증 중 Q 좌표 이동 해제 누락을 수정했다.
동맹 플래그, 무전 파일 경로, 테스트 API 선언을 수정했다.
죽은 렌의 경고 대사를 자동 경보로 대체했다.
SCX 문자열 검사의 문자열 테이블 접근을 수정했다.
되돌리기는 PowerShell 모듈 의존성을 제거한 뒤 성공했다.

## 실행 방법

작업 폴더: `{WORKSPACE}`.

1. 실행하라: `{build_command}`.
2. 검사하라: `{codec_command}`.
3. 검사하라: `{baseline_command}`.
4. 해독하라: `node outputs/The-Last-Marine/tools/campaign-code.mjs --decode TLM1-2:0:30339:5130:8145`.

위 명령은 게임 클라이언트를 실행하지 않는다.
빌더는 기존 `work/scm-js`와 `work/plugin-trigscript` 및 설치된 Node를 사용한다.
새 프로그램 설치나 게임 원본 수정은 수행하지 않는다.
맵은 프로젝트 내부에만 생성한다. 게임 설치 폴더로 복사하지 않는다.

되돌리기 시험에는 `ROLLBACK.sh`와 `ROLLBACK.ps1`을 사용한다.
대상은 `reports` 안의 폐기 가능한 복사본으로 제한한다.
이 스크립트는 기존 실행 중인 프로젝트나 맵을 자동 교체하지 않는다.
프로젝트 기준 소스는 `2a05ceb2241969e621aaa1bc7b93315815c71bdc`에 보존했다.

## 미완성·미검증과 다음 제작

P0: M01 실제 실행 안정성, 길 찾기, 전투 진행, 사망·F9 복구는 출시 전에 검증해야 한다.
WO-UI-02 네이티브 Q의 ACCESS_VIOLATION 원인은 미해결이다. 해당 경로는 분리했다.
네이티브 W와 상단 한국어 자원 명칭은 미검증이다.
이 UI 문제는 M01 콘텐츠 제작을 중단시키지 않는다.
M01 영웅의 원본 계급 표시 문제는 남아 있다. 논리 계급은 이병이다.

P1: 지형 장식, 절벽·잔해 미술, 전투 배치, 조명 대비를 다듬어야 한다.
현재 지형은 통행 가능한 흙 지형과 건물·표식의 제작용 배치다.
프로로그 8~12분과 전체 60~90분은 설계 목표다. 실제 시간을 측정하지 않았다.
음성, 긴 장면의 음향 믹싱, 한국어 가독성, 화면 배율은 미완성 또는 미검증이다.
F9 텍스트 잔류와 깜빡임의 화면 회귀 검증은 NOT RUN이다.
M02 실게임 코드 입력과 복원은 다음 통합 제작 범위다.

다음 제작은 이 M01 소스의 지형·전투 배치 조정과 M02 군수기지 콘텐츠다.
게임 점유 검증은 별도 승인 뒤 주요 시나리오를 묶어서 진행한다.

## Git과 변경 이력

브랜치: `codex/wo-prod-01`.
구현 커밋: `{commit}`.
외부 저장소 게시: 수행하지 않음.
이 보고서와 검증 기록은 후속 문서 커밋으로 보존한다.
`DIFF.patch`는 원본 UI 소스 복사본과 새 M01 런타임 템플릿의 차이다.
추가 파일 전체는 Git 변경 목록에서 확인한다.
정확한 명령, 입력, 출력, 종료 상태는 `VERIFICATION.txt`에서 확인한다.
'''
(OUT / 'FINAL_REPORT.md').write_text(report,encoding='utf8')
paths = [ROOT / '.gitattributes',ROOT / 'tools/build-m01.mjs',ROOT / 'tools/campaign-code.mjs',ROOT / 'tools/verify-m01-preservation.py',Path(__file__).resolve(),ROOT / 'tests/m01.test.ts',ROOT / 'tests/m01-transfer.test.mjs',original]
paths += sorted((ROOT / 'src/m01').glob('*'))
paths += sorted(p for p in OUT.rglob('*') if p.is_file() and p.name != 'ARTIFACT_MANIFEST.json')
manifest=[]
for path in paths:
    data=path.read_bytes()
    assert data, path
    if path.suffix == '.json': json.loads(data.decode('utf8'))
    manifest.append({'path':str(path),'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest(),'reopened':True})
(OUT / 'ARTIFACT_MANIFEST.json').write_text(json.dumps({'implementationCommit':commit,'files':manifest,'liveGame':'NOT RUN'},indent=2,ensure_ascii=False),encoding='utf8')
assert json.loads((OUT / 'ARTIFACT_MANIFEST.json').read_text(encoding='utf8'))['files'] == manifest
print(f'PACKAGE: {len(manifest)} artifacts reopened; SCX and source hashes match; live game NOT RUN')
