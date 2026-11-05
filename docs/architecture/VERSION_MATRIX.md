# 버전 매트릭스

조사일: 2026-11-03. 설치 버전과 온라인 최신 버전을 구분한다.

|도구|확인값|근거|실행 상태|
|---|---|---|---|
|StarCraft x86 / x86_64|1.23.10.13515|설치 EXE FileVersion과 `.build.info`|게임 창 검증 진행; 자동 시작 결과 미확정|
|scmJS|0.8.5|package.json|맵 생성·읽기·저장 실행|
|scmJS 커밋|f4fe24e7519096c2cdd9c1af887f9340317d7af7|로컬 Git HEAD|고정|
|TrigScript|4.1.0|scmJS 기본 플러그인 태그|실제 컴파일러·백엔드 실행|
|TrigScript 커밋|40243398aeb04fcf2893aabb420a3cba92f0d3ac|v4.1.0 태그가 가리키는 커밋|고정|
|Node.js|24.16.0|node --version|실행 확인|
|npm|12.2.1|npm --version|실행 확인|
|Python|3.14.7|python --version|문서·자산·해시 작업 실행|
|ScmDraft 2|공식 배포 목록 0.9.10|공식 다운로드 페이지|설치·실행 NOT RUN|
|euddraft|공식 릴리스 v0.11.0.0|공식 Releases|설치·빌드 NOT RUN|
|eudplib|euddraft 릴리스가 0.81.0을 명시|공식 Releases|설치·빌드 NOT RUN|
|epScript|eudplib 내 컴파일러|공식 README|설치·빌드 NOT RUN|

Node의 기본 타입 제거는 upstream `private declare()` 메서드에서 구문 오류를 냈다.
프로젝트 빌드 로더는 TypeScript transpileModule을 사용한다. upstream 소스는 수정하지 않았다.
