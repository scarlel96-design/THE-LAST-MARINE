# 무인 실행 경로 검증 결과

판정: PARTIAL. 승인창 재발 방지 경로는 검증했다.
기존 승인창의 무인 취소는 접근 거부 상태다.

## 적용한 해결책

START_TLM.cmd는 같은 폴더의 START_TLM.ps1을 실행한다.
실행기는 설치된 x86_64/StarCraft.exe에 -launch 인수를 전달한다.
실행기는 UseShellExecute=false를 사용한다.
관리자 실행 동사는 지정하지 않는다.
관리자 권한 호출과 RUNASADMIN 설정이 있으면 실행을 중단한다.
같은 실행 파일의 게임이 있으면 기존 프로세스를 재사용한다.
설치 파일, UAC 정책, 보안 서비스는 변경하지 않는다.

## 실제 검사

|검사|결과|
|---|---|
|새 게임 실행|PASS: 시험 PID 4956의 MEDIUM 권한 확인|
|새 관리자 확인창|PASS: 실행 전후 PID 27152 한 개 유지, 새 확인창 0개|
|기존 실행 파일 보존|PASS: 실행 전후 SHA256 일치|
|중복 실행 방지|PASS: ALREADY_RUNNING, PID 66512 유지|
|현재 게임 권한|PASS: PID 66512와 도구 PID 61180 모두 MEDIUM|
|실행기 복사본 롤백|PASS: 새 실행기 두 파일만 제거, 종료 코드 0|
|실행기 문법 검사|PASS|
|현재 실게임 입력|NOT RUN: 기존 승인창이 남아 있음|

종료 직후 첫 검사는 종료 중인 프로세스의 경로를 읽지 못해 중단됐다.
이전 프로세스의 종료를 확인한 뒤 재검사를 수행했다.
CMD 출력을 변수로 수집한 검사는 게임의 상속된 출력 핸들 때문에 대기했다.
권한과 확인창 수를 확인한 뒤 시험 게임을 종료해 수집을 완료했다.
현재 게임은 PowerShell 실행기로 다시 시작해 유지했다.
이 기록을 실게임 UI 기능 PASS로 사용하지 않는다.

## 남은 승인창

기존 창은 consent.exe PID 27152가 유지한다.
도구의 창 활성화와 취소는 거부됐다.
프로세스 정리도 접근 거부를 반환했다.
창을 만든 원래 호출자의 신원은 현재 읽기 범위에서 미확정이다.
임의의 Windows 서비스나 다른 프로세스를 종료하지 않았다.
현재 제공된 조작 경로에서 무인 취소 성공은 검증되지 않았다.
이 상태에서 반복적인 취소 시도를 추가하지 않는다.

현재 PromptOnSecureDesktop 값은 0이다.
따라서 보안 데스크톱 설정 때문에 차단됐다고 확정하지 않는다.
높은 권한의 UI와 일반 권한 입력 사이의 제약을 함께 고려한다.
[Microsoft SendInput 문서](https://learn.microsoft.com/windows/win32/api/winuser/nf-winuser-sendinput)
[Microsoft UAC 설명](https://learn.microsoft.com/windows/security/application-security/application-control/user-account-control/how-it-works)

## 사용과 복원

일반 권한으로 START_TLM.cmd를 실행한다.
자동 검사에서는 START_TLM.ps1을 직접 호출한다.
복원이 필요하면 ROLLBACK_LAUNCHER.sh에 대상 폴더를 전달한다.
복원 스크립트는 알려진 해시의 실행기 두 파일만 제거한다.
원본 게임과 Windows 설정은 복원 대상에 포함하지 않는다.

정확한 입력, 명령, 결과는 LAUNCHER_VERIFICATION.json에 있다.
실게임 명령창과 자원 명칭 검증은 기존 승인창 해제 이후에 수행한다.
