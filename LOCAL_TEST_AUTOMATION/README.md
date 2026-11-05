# 로컬 테스트 실행기

판정: PARTIAL. 메뉴 자동 검사는 검증했다. 전체 게임 검증에는 P0가 남아 있다.

## 실행 환경

기존 Python 3.14와 Windows 기능을 사용한다.
추가 프로그램과 Python 패키지는 설치하지 않았다.
화면 문자는 설치된 한국어 Windows OCR로 읽는다.
영어 OCR 언어는 현재 설치되어 있지 않다.

## 실행 방법

1. 로컬 싱글 플레이 시험 환경을 확인한다.
2. 게임과 Codex를 일반 사용자 권한으로 실행한다.
3. 실행 중 키보드와 마우스를 비워 둔다.
4. 원하는 시나리오를 실행한다.
5. 생성된 `result.json`과 실패 화면을 검토한다.

PowerShell에서 다음 명령을 실행한다.

```powershell
$P = '<USERPROFILE>\Documents\Codex\2026-11-03\starcraft-the-last-marine-v1-0-2\outputs\The-Last-Marine\LOCAL_TEST_AUTOMATION'
& "$P\START_LOCAL_TESTS.ps1" -Scenario menu-roundtrip -LocalOffline
```

`menu-roundtrip`은 시험 맵이 열린 상태에서 시작한다.
`ui02-consumption`은 해당 시험 맵의 생존 모드에서 시작한다.
`native-card`는 현재 P0 재현 시나리오다. 일반 회귀 실행에서 제외한다.
Q 네이티브 경로의 ACCESS_VIOLATION 원인을 먼저 해결한다.

시작 화면 검사에는 다음 명령을 사용한다.

```powershell
& "$P\START_LOCAL_TESTS.ps1" -Scenario lifecycle -LocalOffline -LaunchGame
```

시작 화면 검사는 이번 실행에서 포커스 손실로 중단됐다.
맵 진입과 브리핑의 자동 상태 판정은 아직 NOT RUN이다.
공식 실행기는 기존 `WO-UI-02/LAUNCH_PERMISSION_FIX/START_TLM.ps1`을 재사용한다.

직접 지정한 프로세스에는 다음 형식을 사용한다.
새 실행 폴더 이름을 사용한다.

```powershell
python -X utf8 "$P\runner.py" "$P\scenarios\ui02-consumption.json" --pid GAME_PID --out "$P\runs\NEW_RUN_NAME" --local-offline
```

`GAME_PID`를 실제 시험 게임의 프로세스 번호로 바꾼다.
`NEW_RUN_NAME`을 새로운 실행 이름으로 바꾼다.

## 판정과 증거

- PASS: 선언된 화면 상태를 확인했다.
- FAIL: 상태 판정, 입력 전달 또는 실행 보호 조건이 실패했다.
- SKIP: 해당 기능이 시험 맵에 구현되어 있지 않다.
- NOT RUN: 선행 실패 또는 미완성 판정 조건으로 실행하지 않았다.

입력 API의 성공만으로 PASS를 기록하지 않는다.
OCR 실패와 게임 기능 실패를 구분한다.
최종 보고서의 수동 화면 검토는 원래 자동 판정을 덮어쓰지 않는다.
영문 진단 문구에는 한국어 OCR의 오인식이 발생했다.
현재 시나리오는 `kits/klts`, `10/IO`의 확인된 문자 혼동을 허용한다.
다른 오인식은 FAIL로 보존한다.

`events.jsonl`은 단계별 시각, 요청, OCR 결과와 판정을 저장한다.
`result.json`은 시나리오 결과와 시간 구성을 저장한다.
`manifest.json`은 실행 파일의 해시를 저장한다.
현재 버전은 실행 당시 코드와 시나리오도 `source_snapshot`에 저장한다.
이전 개발 실행에는 코드 사본이 없으므로 동일 소스 재현을 보장하지 않는다.

원본 BMP와 OCR 확대 화면은 로컬 실행 폴더에 보존한다.
원본 BMP는 Git에서 제외한다.
주요 화면의 PNG 사본은 `evidence`에 저장했다.
전체 원본 증거를 이동할 때는 `runs` 폴더도 함께 복사한다.

## 입력 보호

실행기는 프로세스 번호, 실행 파일 경로와 SHA-256을 확인한다.
실행기는 입력 전에 게임의 전경 상태를 확인한다.
실행기는 클릭 위치의 실제 창을 확인한다.
실행기는 외부 입력, 전경 손실과 창 교체에서 중단한다.
실행기는 중단 시 자신이 누른 키와 버튼을 해제한다.
실행기는 외부 키의 실제 값을 기록하지 않는다.
실행기는 게임 메모리, DLL과 클라이언트 파일을 변경하지 않는다.

`-LocalOffline`은 실행자의 로컬 시험 확인이다.
이 옵션은 온라인 여부의 자동 탐지 기능이 아니다.
온라인 대전에서는 실행하지 않는다.
현재 시나리오에는 온라인 메뉴를 선택하는 입력이 없다.

메뉴 검사는 실제 메뉴의 파란 패널 비율을 사용한다.
검은 화면은 닫힌 메뉴로 판정하지 않는다.
메뉴 판정은 현재 클라이언트 화면에서 보정했다.
새 UI 테마와 해상도에서는 임계값을 다시 검증한다.
좌표 입력은 클라이언트 영역의 0~1 비율을 사용한다.

## 향후 통합 작업 지침

1. 관련 시나리오를 한 실행 묶음으로 선택한다.
2. 이미 통과한 변경 없는 검사를 제외한다.
3. 미구현 기능을 SKIP으로 기록한다.
4. 필수 상태 판정을 먼저 정의한다.
5. 입력과 상태 확인을 실행기 안에서 묶는다.
6. 실패 화면과 로그를 한 번에 검토한다.
7. 수정 영향이 있는 검사만 다시 실행한다.
8. 필수 UI의 실게임 증거 전에는 GO를 선언하지 않는다.

재사용할 Codex 작업 지시는 다음과 같다.

```text
THE LAST MARINE 통합 로컬 검증을 진행한다.
LOCAL_TEST_AUTOMATION/FINAL_REPORT.md와 AGENTS.md를 먼저 읽는다.
원래 소스, SCX, 클라이언트 해시를 보존한다.
네이티브 Q의 ACCESS_VIOLATION P0를 먼저 조사한다.
현재 실패 후보를 일반 회귀 실행에 포함하지 않는다.
시나리오의 화면 판정을 준비한 뒤 로컬 실행기로 묶어 실행한다.
AI는 각 입력을 해석하지 않고 실행 결과와 주요 화면을 한 번에 검토한다.
OCR FAIL, 기능 FAIL, SKIP과 NOT RUN을 구분한다.
검증한 결과와 미검증 항목을 하나의 최종 보고서에 기록한다.
```

## 참고 API

입력 전달은 Windows의 [SendInput](https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-sendinput)을 사용한다.
입력 충돌 감지는 [LowLevelKeyboardProc](https://learn.microsoft.com/en-us/windows/win32/winmsg/lowlevelkeyboardproc)의 주입 입력 표시를 구분한다.
문자 인식은 [Windows OCR](https://learn.microsoft.com/en-us/uwp/api/windows.media.ocr.ocrengine.trycreatefromuserprofilelanguages)을 사용한다.
