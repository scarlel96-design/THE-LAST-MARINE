# 캠페인 상태와 전달

```text
CampaignState(schemaVersion, missionId, checkpointId)
  hero(weaponTier, armorTier, experienceTier, unlockedSkills)
  inventory(materials, specialParts, medicalKits, explosives)
  records(milestoneFlags, optionalMissionFlags, commendationTier)
  command(rank, authorityLevel, supportUnlocks)
  metadata(difficulty, completionFlags)
```

이 구조는 논리 명세다. 엔진 저장 형식이 아니다.

|방식|장점|필수 검증|현 상태|
|---|---|---|---|
|A 고정 시작|독립 맵으로 재현 가능|미션별 최소 장비·대사 정합성|현재 개발 기준|
|B 수동 코드|핵심 장비·전공을 전달|버전·미션·값 범위·체크값·재입력·두 맵 복원|권장 후보, NOT RUN|
|C 외부 런처|큰 데이터 저장 가능|설치·파일 접근·버전·오류 복구|확장 후보, NOT RUN|

Death Counter와 Switch가 맵 사이에서 자동 전달된다고 가정하지 않는다.
기본 게임 저장을 EUD 필수 저장 수단으로 사용하지 않는다.
수동 코드의 체크값은 입력 오류 검출용이다. 보안 기능으로 설명하지 않는다.
M04는 검증된 작전 ID와 본인 보고를 구분한다. 필수 심사는 선택 점수에 관계없이 진행한다.
맵 내부 체크포인트는 위치, 장비, 소모품, 임무 플래그를 복원한다.
필요한 적·아군, 시설 파괴, 연출 상태도 함께 재구성한다.
이번 PoC는 하나의 생존 정규 상태만 복구한다. WO-06의 캠페인 전달 완료를 의미하지 않는다.
