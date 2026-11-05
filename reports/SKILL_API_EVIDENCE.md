# WO-04 API 증거

고정 TrigScript 커밋: 40243398aeb04fcf2893aabb420a3cba92f0d3ac.
`compiler/api.ts`는 `killUnitAt(player, unit, count, location)` 인수를 정의한다.
`moveUnit`는 player, unit, count, from, to를 받는다.
`wav` 인수는 Sound, Clip, string을 받는다.
`stdlib/timers.ts`는 게임 프레임을 읽는다. SECOND는 24다.
`docs/trigscript-language.md`는 hp·armor·speed·orderId의 쓰기 가능 범위를 설명한다.
Q는 stats(type).armor를 사용한다. W는 Unit.heal(25)를 사용한다.
keyPressed의 Q/W와 F7/F8은 실제 공식 컴파일러와 시뮬레이터로 검사했다.
시뮬레이터 피해·속도 주입은 시험 데이터 변경이다. 실게임 API 호출을 대신하지 않는다.
실게임 EUD 허용 여부, 기본 키 충돌, 조작 지연은 NOT RUN이다.
