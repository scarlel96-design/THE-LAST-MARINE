# WO-UI-01 자원 UI 기술 검증

기준일: 2026-11-03. 대상: StarCraft: Remastered 1.23.10.13515.
현재 판정: **BLOCKED**. 조사한 맵 전용 경로에서 아이콘·상단 명칭 교체를 검증하지 못했다.
승인된 동등 대안도 없다. 숫자 연동 PoC를 UI 완료로 판정하지 않는다.
이 판정은 조사한 도구와 실행 환경에 한정한다. 모든 미래 도구의 불가능성을 뜻하지 않는다.

## 1. 경로 비교

|경로|확인한 근거|아이콘·명칭|배포·제약|판정|
|---|---|---|---|---|
|SCX 표준 데이터|CHK 섹션 목록, UNIx 설정, STRx 문자열, 자원 트리거 소스|수량과 유닛 이름은 설정 가능. 상단 자원 그림·제목 바인딩 필드는 확인되지 않음|맵 한 개. 파일 내 이미지 첨부만으로 UI가 그림을 읽는다는 근거 없음|아이콘·명칭 경로 미확보|
|TrigScript EUD|고정 4.1.0의 tables.ts, declarations.ts, jsx.ts|자원 수량과 텍스트 지원. 조사한 API에는 상단 그림·명칭 교체 필드가 없음|기존 툴체인 사용. 검증된 고수준 API만 적용|수량 PoC 구현. 전체 요구 실패|
|독립 맵 패널|ui.lines, Screen, Snake 제작자 예제|ui.lines는 게임 텍스트 영역. Screen은 유닛 픽셀을 지도·미니맵에 표시|미니맵·전장 공간과 유닛 예산을 소비. 상단 슬롯 대체와 다름|동등성 미검증·미승인|
|기존 UI 가림|조사한 공개 API에 자원 영역만 가리는 기능 없음|텍스트·지형으로 고정 상단 UI를 덮는 경로 미확보|좌표·배율 의존 외부 오버레이는 별도 프로그램 필요|채택 안 함|
|클라이언트 자산·플러그인|Animosity 제작자 문서, samase_plugin 선언|그래픽 파일 변환과 렌더러·대화상자 훅은 별도 클라이언트 계층|설치·버전·HD/HD2/SD 자산 검증 필요. 현재 게임 호환성 NOT TESTED|사용자 승인 전 필수화 안 함|

표의 API 부재는 소스 조사 결과다. 모든 EUD 조합의 불가능성을 증명한 결과는 아니다.
현재 상단 슬롯은 원래 광물·가스 그림을 유지한다. 스크린샷 01~04에서 확인한다.
한국어 명칭은 별도 텍스트 영역에만 보인다. 요구한 상단 이름·군수품 그림은 구현되지 않았다.

## 2. 공식 문서와 도구 소스

Blizzard는 EUD를 에뮬레이터로 지원한다고 설명했다.
해당 발표는 모든 과거 기능과 그래픽 조작을 지원한다는 보장을 하지 않는다.
따라서 알려지지 않은 UI 주소에 쓰는 방식은 시험 맵에 넣지 않았다.
[Blizzard EUD 지원 발표](https://news.blizzard.com/en-us/article/21313396/patch-1-21-0-the-return-of-eud-maps)

TrigScript UI 문서는 텍스트 영역을 구성하는 Panel, Meter, MenuList 등을 설명한다.
현재 로컬 선언도 ui.lines를 플레이어 텍스트 줄로 정의한다.
JSX 요소는 line, span, cell, bar다. 이미지 요소와 상단 자원 슬롯 위젯은 없다.
[UI 문서](https://docs.scmjs.dev/trigscript-library/ui/)
[고정 버전 선언](https://github.com/scm-js/plugin-trigscript/blob/40243398aeb04fcf2893aabb420a3cba92f0d3ac/compiler/declarations.ts)
[고정 버전 JSX 소스](https://github.com/scm-js/plugin-trigscript/blob/40243398aeb04fcf2893aabb420a3cba92f0d3ac/compiler/jsx.ts)

scmJS의 api.ui.overlay와 DOM 패널은 편집기 UI다.
이 API를 게임 안의 UI로 간주하지 않았다.
[편집기 화면 API](https://docs.scmjs.dev/plugins/putting-things-on-screen/)
[CHK 소스](https://github.com/scm-js/scm-js/blob/f4fe24e7519096c2cdd9c1af887f9340317d7af7/docs/chk-format.md)

eudplib의 f_settbl은 게임 문자열을 수정하는 구현을 갖는다.
이것만으로 상단 자원 이름·아이콘을 모두 바꾸는 경로가 성립하지 않는다.
본 작업에서는 해당 문자열 API의 현재 게임 호환성을 실행 검사하지 않았다.
[eudplib tblprint.py](https://github.com/armoha/eudplib/blob/main/src/eudplib/string/tblprint.py)

## 3. 제작 사례의 구분

TrigScript 제작자의 Snake는 Screen으로 유닛 픽셀을 미니맵에 그리는 실제 코드 사례다.
Screen 문서도 같은 구현을 설명한다. 이 사례는 상단 UI 이미지 주입의 증거가 아니다.
[Snake 소스](https://github.com/scm-js/plugin-trigscript/blob/40243398aeb04fcf2893aabb420a3cba92f0d3ac/probes/snake.tsx)
[Screen 문서](https://docs.scmjs.dev/trigscript-library/screen/)

Animosity는 SC:R 그래픽 변환 도구다. 제작자 문서는 dds.grp와 해상도별 자산 작업을 설명한다.
samase_plugin에는 렌더러·파일 읽기·대화상자 훅 선언이 있다.
이들은 맵 트리거와 다른 설치·실행 경로다. 현재 클라이언트에서 실행하지 않았다.
[Animosity 제작자 문서](https://github.com/neivv/animosity/blob/master/Readme.md)
[samase_plugin 소스](https://github.com/neivv/samase_plugin/blob/master/src/lib.rs)

SC2의 SC2Interface, Assets.txt, Frame XML 예제는 SC1의 구현 근거에서 제외했다.
일반 웹 검색 결과의 SC2 자료도 채택하지 않았다.

## 4. 클라이언트 모드 검토

설치안은 별도 프로필과 자산 묶음, 호환되는 로더를 요구할 수 있다. 정확한 로더는 미선정이다.
배포안은 자체 제작 의료 키트·폭약 그림과 필요한 설정만 포함해야 한다.
게임 원본 자산을 묶어 배포하는 방식은 채택하지 않았다.
업데이트는 UI 파일 구조와 플러그인 ABI를 바꿀 수 있다.
HD, HD2, SD 및 한국어·다른 언어의 UI 파일을 함께 검사해야 한다.
외부 실행 파일과 DLL은 출처·서명·무결성·업데이트 정책 검토가 필요하다.
프로세스 훅은 충돌과 외부 보안 도구의 탐지를 일으킬 수 있다. 현재 발생 여부는 NOT TESTED다.
가설적 위험만으로 NO-GO를 확정하지 않았다.
클라이언트 변경·로더 설치·보안 설정 변경은 수행하지 않았다.

## 5. 다음 결정

맵 전용의 문서화된 그래픽 UI 경로가 발견되면 별도 소형 PoC로 먼저 검사한다.
대안은 두 종류의 군수품 그림, 한국어 이름, 수량을 동시에 제시해야 한다.
대안은 기존 광물·가스 그림의 의미 혼동을 해결해야 한다.
실게임의 동등 직관성과 사용자 승인이 모두 있어야 CONDITIONAL GO를 검토한다.
현재 텍스트·숫자 PoC는 승인 요청용 완성 대안이 아니다.
