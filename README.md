# STARCRAFT: THE LAST MARINE

Phase 1 / WO-01~WO-05. 기준일: 2026-11-03. 상태: 기술 검증 중.

본 폴더는 기초 설계, 실제 TrigScript 소스, 시험용 SCX 두 개를 포함한다.
전체 캠페인과 Phase 2 승인 산출물은 아직 제작하지 않았다.
`reports/WO-01_05_REPORT.md`에서 현재 판정과 실게임 검증 상태를 확인한다.

WO-UI-01의 현재 판정은 BLOCKED다. `WO-UI-01/FINAL_REPORT.md`와 실제 화면 증거를 확인한다.
`WO-UI-01/RESOURCE_UI_POC.scx`는 소비 로직 진단용이다. 그림·상단 명칭 교체는 미충족이다.

## 실행

1. `maps/poc/SKILL_POC.scx`를 스타크래프트 맵 선택 화면에서 연다.
2. 게임 유형을 Use Map Settings로 설정한다.
3. 게임 속도를 Fastest로 설정한다.
4. Q 또는 F7로 방어 자세를 사용한다.
5. W 또는 F8로 긴급 지혈을 사용한다.
6. `COLLAPSE_90S_POC.scx`에서 Escape로 장면을 건너뛴다.
7. 생존 구간에서 F9로 체크포인트를 다시 구성한다.

실게임 실행 성공은 별도 보고서의 증거가 있어야 인정한다.
시험 맵의 무전과 HUD는 컴파일 및 실행 진단을 위해 영어로 작성했다.
최종 캠페인의 한국어 대사와 HUD는 별도 검증 대상이다.

## 재빌드

작업 폴더의 `work/scm-js`와 `work/plugin-trigscript`를 사용한다.
각 저장소에서 `npm ci --ignore-scripts --no-audit --no-fund`를 실행한다.
프로젝트 상위 작업 폴더에서 다음 명령을 실행한다.

```powershell
node outputs/The-Last-Marine/tools/build.mjs
```

고정 커밋과 버전은 `docs/architecture/VERSION_MATRIX.md`를 확인한다.
소스 맵과 배포용 맵은 각기 다른 폴더에 둔다.
`maps/release`는 출시 게이트 통과 전까지 비워 둔다.
