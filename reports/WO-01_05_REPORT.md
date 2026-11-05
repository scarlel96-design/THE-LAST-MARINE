# STARCRAFT: THE LAST MARINE 작업 보고서

작업 번호: WO-01~WO-05.
담당 단계: Phase 1.
현재 상태: PARTIAL. 호스트 빌드·시뮬레이터 검사는 PASS다. 실게임 재시도는 부분 검증했다.

## 1. 구현 내용

scmJS와 TrigScript 고정 버전을 확보했다. 64×64 시험 맵 두 개를 빌드했다.
Q 방어 자세와 W 지혈, HUD, 대체 키, 사망·체크포인트 복구를 구현했다.
유한한 사전 배치 적과 아군의 공격·후퇴 명령을 구현했다.
시설 피해 조건과 스킵·110초 감시 복구를 구현했다.
5개 미션의 설계 초안과 시네마틱 사건 표를 작성했다.

## 2. 수정 및 생성 파일

README, docs, src/poc/main.ts, tests/poc.test.ts, tools/build.mjs를 생성했다.
maps/source는 미컴파일 원본 맵이다. maps/poc는 런타임을 포함한 생성 맵이다.
assets/audio/tlm-blast.wav는 직접 합성했다. 원본 작업 지시서는 baseline에 보존했다.
docs/WORK_ORDER.md의 현재 단계만 기술 검증 중으로 변경했다.
DIFF.patch, VERIFICATION.txt, ROLLBACK.sh와 ROLLBACK.ps1을 작성했다.

## 3. 사용한 제작 도구와 버전

StarCraft 1.23.10.13515 설치를 확인했다. scmJS 0.8.5와 TrigScript 4.1.0을 실행했다.
Node.js 24.16.0, npm 12.2.1, Python 3.14.7을 사용했다.
ScmDraft 2와 대체 euddraft 경로는 조사 단계다.

## 4. 빌드 결과

COLLAPSE_90S_POC.scx: 246883 bytes. SKILL_POC.scx: 246068 bytes.
두 SCX를 실제 MPQ 리더로 다시 읽었다. 각각 64×64와 67개 시작 트리거 레코드를 확인했다.
67은 EUD payload 내부 트리거 총수가 아니다. 실제 payload 통계는 build.json에 있다.
전체 편집기 UI 빌드는 NOT RUN이다.

## 5. 자동화 테스트 결과

node outputs/The-Last-Marine/tools/build.mjs: exit 0.
COLLAPSE_90S_POC: 15 PASS / 0 FAIL.
SKILL_POC: 15 PASS / 0 FAIL.
입력 반복, 쿨타임, 소비, 중단, 사망, 초기·중간 스킵, NPC 소실, 감시 복구를 검사했다.
동일 시험의 두 변형을 합산한 30건이다. 시험 범위는 TEST_MATRIX와 원시 JSON을 확인한다.
별도 복사본에서 PowerShell과 Bash 복구를 검사했다. 원본 SHA256과 일치했다.
초기 제한 실행의 Bash 오류는 추가 실행에서 복구했다. 실패 이력은 VERIFICATION.txt에 남겼다.

## 6. 실제 스타크래프트 테스트 결과

창 조작을 복구하고 SKILL_POC를 유즈맵 설정으로 실행했다.
해병 선택·이동, Q 발동·종료 메시지, W 체력 회복을 확인했다.
키트 3→2 소비와 쿨타임 중 재사용 거절을 확인했다.
단발 입력 누락과 F9 복원 후 해병 유지에는 추가 검사가 필요하다.
Q 실제 방어력, 실제 교전, 효과음, 카메라, 정상 90초 완료는 미검증이다.
상세 입력과 관찰 결과는 LIVE_UI_RETRY.md를 확인한다.

## 7. 확인된 문제

정상 장면의 자연 전투 타이밍은 미확정이다. 110초 복구를 90초 정상 완료로 인정하지 않는다.
현재 수송선은 파괴된 최종 상태만 보장한다. 전체 피격·추락 연출은 미구현이다.
음성 무전과 완전한 HUD는 미구현이다. 시험 무전은 영어 텍스트다.
Node 기본 타입 제거의 구문 문제는 프로젝트 로더에서 TypeScript 변환으로 해결했다.

## 8. 미검증 항목

강제 제어·일시정지의 실게임 입력, 한국어 렌더링, 전용 타입의 실제 능력치, 성능은 NOT RUN이다.
WO-06 두 독립 맵 데이터 전달, WO-07 수직 슬라이스는 아직 구현하지 않았다.
전체 체크포인트·상자·전공 중복 방지와 E/R 스킬은 후속 작업이다.
WO-02/03 문서는 초안이다. 전체 연표와 최종 지형을 확정하지 않았다.

## 9. 설계 변경 여부

프로젝트 정체성과 Phase 2 승인 순서를 유지했다.
전용 영웅 타입, Q 방어력 +2, Fastest 기준은 PoC 한정 구현안이다.
세부 날짜와 최종 제작 도구는 아직 확정하지 않았다.

## 10. 커밋 및 기준 버전

로컬 Git의 codex/phase1-poc 브랜치에 산출물을 기록한다.
패키지의 BUILD_PROVENANCE.json에 기준 커밋과 맵 해시를 기록한다.
GitHub 원격 게시와 정식 출시는 수행하지 않았다.

## 11. 다음 작업

단발 입력과 F9 해병 유지 문제를 먼저 재현한다.
Q 실제 방어력과 중단 동작을 검사한다. 정상 90초 장면과 스킵 증거를 확보한다.
WO-06과 WO-07을 완료한 뒤 Phase 1 → Phase 2 게이트를 다시 평가한다.
