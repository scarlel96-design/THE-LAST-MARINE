# API 호환성

DOC는 문서 근거다. COMPILE은 컴파일 증거다. SIM은 시뮬레이터 증거다.
GAME은 해당 게임 버전의 실제 실행 증거다. 각 증거는 다른 증거를 대신하지 않는다.

|기능|사용 API|DOC|COMPILE/SIM|GAME|대안 또는 조건|
|---|---|---|---|---|---|
|Q/W 입력|keyPressed(P1, key)|확인|테스트 보고서|NOT RUN|F7/F8 병행|
|쿨타임|now(), SECOND|확인|테스트 보고서|NOT RUN|Fastest 기준|
|방어 강화|stats(JimRaynorMarine).armor|소스 확인|테스트 보고서|NOT RUN|해당 타입은 주인공 전용|
|이동 중단|speed, orderId, x/y 읽기|확인|테스트 보고서|NOT RUN|직접 위치 쓰기 금지|
|치료|Unit.heal(25)|확인|테스트 보고서|NOT RUN|완료 시 키트 소비|
|아군 이동|Unit.order('move', location)|확인|컴파일·명령 생성|NOT RUN|길 찾기 실게임 시험|
|적 교전|Unit.order('attack', location)|확인|컴파일·명령 생성|NOT RUN|유한한 사전 배치 병력|
|시설 파괴|Unit.kill(), killUnitAt|확인|스킵 상태 시험|NOT RUN|정상 장면은 시설 피해 확인|
|카메라|centerView(location)|확인|상태·명령 시험|NOT RUN|단일 소유자, 1초 종료|
|효과음|playWav, MPQ WAV 멤버|확인|컴파일·아카이브 재열기|NOT RUN|실제 청취 필요|
|체크포인트|createUnit, moveUnit, 상태 초기화|확인|재구성 시험|NOT RUN|PoC의 정규 상태만 지원|
|E 공격주기|후보 조사 단계|미확정|NOT RUN|NOT RUN|효과 변경은 승인 필요|
|R 범위 피해|후보 조사 단계|미확정|NOT RUN|NOT RUN|아군 피해 포함 검증|
|미션 간 저장|고정 시작 A|설계|NOT RUN|NOT RUN|수동 코드 B 검증 전까지 A|

`matrix`는 250 보호막을 제공하므로 Q 대안으로 채택하지 않았다.
그 효과는 초반 해병의 생존 위협을 크게 바꾼다.
