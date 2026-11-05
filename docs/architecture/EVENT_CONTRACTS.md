# 이벤트 계약 초안

각 사건은 고유 ID와 한 명의 상태 소유자를 가진다.
MissionDirector만 목표 완료를 확정한다. CinematicDirector는 장면 결과를 반환한다.
IDLE → PREPARED → RUNNING → COMPLETED / SKIPPED / RECOVERED 순서를 사용한다.
완료한 ID는 같은 체크포인트 구간에서 다시 완료하지 않는다.
스킵·사망·복구는 동일한 정리 함수를 통과한다. 카메라와 시전 효과를 먼저 해제한다.
RECOVERED는 전투 성공과 다르다. 복구 원인을 로그에 남긴다.
감시 타이머는 이동 명령을 재발급한 후 복구 가능성을 검사한다.
복구 종료는 점수나 선택 전공을 지급하지 않는다.

PoC 숫자 상태: 1 PREPARED, 2 RUNNING, 3 COMPLETED, 4 SKIPPED, 5 RECOVERED.
IDLE은 아직 시작하지 않은 외부 미션 관리자의 상태로 예약한다.
PoC는 한 프로그램이 카메라와 스킬 상태를 소유한다. Phase 3 모듈 구조의 최종 승인이 아니다.
