# WO-01 제작 도구 조사

## 실행한 경로

scmJS와 scmJS가 고정한 TrigScript v4.1.0을 작업 폴더에 확보했다.
`createScenario`로 기본 맵을 생성한다. `compileScript`로 스크립트와 시뮬레이터 테스트를 검사한다.
`resolveStrings`로 문자열을 적용한다. `buildOwnMap`으로 Remastered용 프로그램을 CHK에 배치한다.
`saveMap`으로 MPQ SCX를 저장한다. `loadMap`과 `parseScenario`로 결과를 다시 읽는다.
이 경로는 upstream `scripts/build-fixture.mts`의 빌드 절차를 따른다.
전체 편집기 UI의 프로덕션 빌드는 이번 검사에 포함하지 않았다.

## 제약

`trigger()`는 일반 트리거다. `program()`은 Remastered가 필요한 런타임 코드다.
이번 PoC는 `program()`을 사용하므로 Brood War 1.16.1 호환을 보장하지 않는다.
시뮬레이터는 자원·유닛·조건·스위치와 프로그램 상태를 다룬다.
시뮬레이터는 이동·충돌·전투·실제 음향을 재현하지 않는다.
실제 게임에서 실행하지 않은 항목은 NOT RUN으로 기록한다.
공식 EUD 지원은 모든 메모리 접근의 지원을 의미하지 않는다.
키 입력은 동기화 지연을 가진다. 기본 게임 단축키도 함께 작동한다.
F2~F6는 입력 API에서 사용할 수 없다. F7/F8을 대체 키로 시험한다.
24프레임을 1초로 계산한다. Fastest 이외의 속도에서는 벽시계 시간이 달라진다.

## 보조·대체 도구

ScmDraft 2는 지형·배치·기본 트리거의 수동 편집 후보로 둔다.
공식 사이트의 구버전 안내와 0.9.10 배포 목록이 일치하지 않는다.
실제 설치본과 라이선스 조건은 미확인이다. 설치 후 버전을 다시 기록한다.
eudplib은 Python 기반 맵·트리거 라이브러리다. epScript는 그 안의 별도 언어 컴파일러다.
euddraft는 실행 가능한 배포와 플러그인 조합을 제공한다.
대체 경로는 별도 가상환경에서 동일한 P0 시험을 통과해야 한다.
제작 도구 전환은 Astra 설계 심사 대상이다.

## 출처

- [scmJS 공식 저장소](https://github.com/scm-js/scm-js)
- [TrigScript 공식 저장소 v4.1.0](https://github.com/scm-js/plugin-trigscript/tree/v4.1.0)
- [공식 키 입력 문서](https://docs.scmjs.dev/trigscript-language/keys-the-mouse-and-chat/)
- [공식 타이머 문서](https://docs.scmjs.dev/trigscript-library/timers/)
- [공식 시네마틱 문서](https://docs.scmjs.dev/trigscript-library/cutscenes/)
- [공식 시뮬레이터 범위](https://docs.scmjs.dev/trigscript/testing-and-simulate/)
- [블리자드 EUD 지원 발표](https://news.blizzard.com/ko-kr/article/21313396/1-21-0-eud)
- [ScmDraft 2 공식 배포](https://www.stormcoast-fortress.net/downloads/scmdraft2/)
- [eudplib 공식 저장소](https://github.com/armoha/eudplib)
- [euddraft 공식 릴리스](https://github.com/armoha/euddraft/releases)
