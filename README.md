# THE LAST MARINE

스타크래프트: 리마스터 사용자 지정 캠페인입니다.

## 플레이용 맵

- [M01 노스 릿지 — 시작 수정판](maps/M01_NORTH_RIDGE_START_FIX.scx)
- [M01 조작 비교 맵](maps/M01_CONTROL_CHECK.scx)
- [M02 고립된 전선 — 일반 시작](maps/M02_ISOLATED_FRONT.scx)
- [M02 고립된 전선 — 계승 예제](maps/M02_CARRY_7877e9b59f.scx)

SCX를 스타크래프트 문서의 Maps 폴더에 넣고 **맵 설정 사용(Use Map Settings)**으로 시작하세요. 비교 맵은 미션 진행 없이 해병 선택, 아군 시설, 화면 이동을 확인하는 용도입니다.

M01은 시작 시 아군 관계를 지정하고 해병을 한 번 선택합니다. 화면은 자동으로 움직이지 않습니다. J를 누르면 해병을 선택하고 위치를 찾습니다. M02는 군수기지 복구와 3차 방어, M03 계승 기록까지 구현했습니다.

M01 시작 수정판은 소스 시뮬레이션 34개와 SCX 재열기 검사를 통과했습니다. 수정판의 실제 게임 테스트는 아직 실행하지 않았습니다. M02의 실게임 상태도 미검증입니다.

## 소스

`src/m01`, `src/m02`, `src/campaign`에 미션과 지형 소스가 있습니다. `tests`에는 자동 검사 소스가 있습니다.

빌드를 하려면 저장소를 작업 공간의 `outputs/The-Last-Marine`에 두고 기존 scmJS와 TrigScript를 `work/scm-js`, `work/plugin-trigscript`에 각각 준비하세요. 확인에 사용한 리비전은 scmJS `f4fe24e`, TrigScript `4024339`입니다. 빌더는 로컬 설치의 지형 데이터를 읽으며 게임을 실행하지 않습니다.

```powershell
node tools/build-production.mjs --m01-only --opening-fix
node tools/build-production.mjs --m02-only --carry-example
```

`maps/SHA256SUMS.txt`에서 배포 맵의 해시를 확인할 수 있습니다.
