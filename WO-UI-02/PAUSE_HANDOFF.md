> 이전 중단 시점의 기록이다. 현재 상태는 RESOURCE_UI_TEST_RESULTS.md와 VERIFICATION.txt를 적용한다.

# WO-UI-02 중간 저장

판정: **PARTIAL**. 테스트는 사용자 지시로 일시중단했다.
현재 게임 창에 추가 입력을 보내지 않았다.
현재 패키지는 최종 완료본이 아니다.

## 저장한 구현

- 요구 조건 인덱스를 572에서 상대 인덱스 6으로 수정했다.
- 종결자 값이 다른 경우 추가 버튼 설치를 중단하도록 수정했다.
- 첫 문자열 복사 길이를 확인하는 조건을 추가했다.
- 지휘 모드 전환 시 원래 자원 명칭 오프셋을 복원하도록 수정했다.
- 다음 빌드 결과에 소스·검사·빌더 해시를 기록하도록 수정했다.
- 통합 개발 및 검사 재개 절차를 정리했다.

이 변경은 소스에만 저장했다.
현재 SCX는 중단 이전 소스의 시험 맵이다.
현재 소스로 빌드하거나 실제 게임에서 검사하지 않았다.
기존 UI01 소스와 숫자 소비 증거를 보존했다.
기준 브랜치는 codex/wo-ui-01이다.
작업 브랜치는 codex/wo-ui-02다.
기준 커밋은 28f5fcd55c5a1e372ed5c2bb66a8d9dc00ab3040이다.

## 파일

- src/native-ui/main.ts: 현재 수정 소스.
- baseline/WO-UI-02/pre-pause-native-main.ts: 중단 직전 소스.
- baseline/WO-UI-02/main.ts: UI01 기준 소스.
- WO-UI-02/NATIVE_UI_PROBE.scx: 중단 전 생성 맵.
- WO-UI-02/DIFF.patch: UI01 기준과 현재 소스의 차이.
- WO-UI-02/PAUSE_EDITS.patch: 중단 직전과 현재 소스의 차이.
- WO-UI-02/VERIFICATION.txt: 명령, 해시, 미실행 상태.
- WO-UI-02/ROLLBACK.sh: 대상 복사본을 지정하는 복원 스크립트.

복원 스크립트의 실행 결과는 NOT RUN이다.
복원 후 동작도 NOT RUN이다.
현재 소스는 수정 상태로 남아 있다.
