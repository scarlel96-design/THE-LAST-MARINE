> 최신 상태: 기존 PID 7176은 종료됐다. 새 PID 66192는 MEDIUM 권한이다. 이전 실행의 권한 확인창 취소 후 입력 재검사가 남아 있다.

# 실게임 입력 진단

현재 맵 선택창의 자동 입력이 선택 상태를 바꾸지 않는다.
창 재선택, 더블클릭, 방향키, Enter, 창 모드 전환을 시도했다.
입력 연결을 초기화한 뒤에도 같은 결과를 관찰했다.

|프로세스|PID|실행 무결성|UIAccess|
|---|---:|---|---|
|StarCraft.exe|7176|HIGH, 12288|false|
|codex-computer-use.exe|9864|MEDIUM, 8192|false|
|codex-computer-use.exe|19720|MEDIUM, 8192|false|

이 값은 프로세스 토큰에서 읽었다.
입력 도구는 SendInput을 사용한다.
Microsoft는 SendInput의 대상이 같거나 낮은 무결성 수준이어야 한다고 설명한다.
[Microsoft SendInput 문서](https://learn.microsoft.com/windows/win32/api/winuser/nf-winuser-sendinput)

관찰한 권한 차이는 UIPI에 의한 입력 차단을 뒷받침한다.
같은 권한 수준의 비교 실행은 NOT RUN이다.
따라서 권한을 맞춘 뒤의 성공까지 확인한 결과는 아니다.
게임이나 도구의 권한 설정은 변경하지 않았다.
클라이언트 원본, 보안 설정, 외부 DLL도 변경하지 않았다.

## 재개 조건

1. 게임을 일반 사용자 권한으로 실행한다.
2. 맵 목록에서 자동 입력의 선택 반영을 확인한다.
3. 현재 시험 맵을 로드한다.
4. RESOURCE_UI_TEST_RESULTS.md의 실게임 검증 묶음을 실행한다.

현재 결과는 UI 기능 실패 판정이 아니다.
현재 맵의 명령 콜백과 한국어 명칭 검사는 NOT RUN이다.


## 2026-11-05 최신 상태

로컬 실행기의 입력 유지와 화면 판정으로 실제 입력 수신을 확인했다.
이 문서의 이전 권한 차이와 메뉴 무반응은 과거 증거다.
최신 P0는 네이티브 Q 입력 뒤 발생한 ACCESS_VIOLATION이다.
근거는 ../LOCAL_TEST_AUTOMATION/CRASH_EVIDENCE.json에 있다.
