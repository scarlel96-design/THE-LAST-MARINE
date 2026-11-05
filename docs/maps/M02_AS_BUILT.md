# M02 고립된 전선 — SCX 실측 배치

상태: **SCX·소스 대조 완료 / 실게임 NOT RUN**. 아래 값은 패키지 안의 초기 배치를 설명한다.
런타임 배치와 지역별 제작 의도는 [M02 현장 명세](M02_FIELD.md)를 참조한다.

## 1. 규격과 근거

| 항목 | 값 |
| --- | --- |
| 대상 플레이 맵 | [M02_ISOLATED_FRONT.scx](../../WO-PROD-02/maps/M02_ISOLATED_FRONT.scx) |
| 편집 소스 맵 | [M02_ISOLATED_FRONT_SOURCE.scx](../../WO-PROD-02/maps/M02_ISOLATED_FRONT_SOURCE.scx) |
| 동일 배치의 비교 맵 | [M02_CARRY_7877e9b59f.scx](../../WO-PROD-02/maps/M02_CARRY_7877e9b59f.scx) |
| 빌드 기록 | [기존 구조 검사 및 경로 기록](../../WO-PROD-02/reports/M02_ISOLATED_FRONT.json) |
| 지형 / 포맷 | Badlands / SCX / CHK ERA 0 / VER 206 |
| 크기 | 224×224타일 / 7168×7168px |
| 그리드 | [M02_MTXM.csv](M02_MTXM.csv) / x=열, y=행, 십진 MTXM 원시값 |
| MTXM SHA-256 (리틀엔디언 uint16) | 3d9fbcb9e453522b8f9c4119fcf415d2eaa8cc083ab3ef373323bf3c3ee57757 |
| ISOM SHA-256 (리틀엔디언 uint16) | e03965398f067327e19f6bfa3f5a022877769bc21abd3cde0d7fcb029df96e17 |
| 플레이 SCX SHA-256 | 847e75da4a0eeb1c8c3c387d534531147ed3862f69b777347b03f990874deef7 |
| UNIT / 명명 MRGN / DD2 / THG2 | 34 / 20 / 0 / 0 |
| 기본 트리거 / 브리핑 | 77 / 1 (소스 및 비교 맵은 별도) |
| 네이티브 동맹 행동 | 0 |

편집 소스 맵, 플레이 맵, 비교 맵의 MTXM·ISOM·MRGN이 일치한다. UNIT은 소유자·좌표·종류·유효 HP가 일치한다.
UNIT의 기본 HP 필드 기록 방식과 트리거·브리핑은 맵별로 다를 수 있다.
UNIT의 건물 크기는 소스의 배치 여유 검사값이다. 엔진의 충돌 상자나 애드온 요구 치수와 구분한다.

## 2. 소유권과 세력

| 슬롯 | OWNR / IOWN | SIDE | FORC(0부터) | 역할 |
| --- | --- | --- | --- | --- |
| P1 | 6 / 6 | 1 | 0 | 플레이어 |
| P2 | 5 / 5 | 0 | 1 | 저그 |
| P3 | 5 / 5 | 1 | 0 | 연합군 |
| P4 | 5 / 5 | 1 | 0 | 민간인 슬롯 |
| P5 | 5 / 5 | 1 | 0 | 연합군 구조 슬롯 |
| P6 | 5 / 5 | 0 | 1 | 저그 별동대 |
| P7 | 5 / 5 | 0 | 1 | 저그 별동대 |
| P8 | 5 / 5 | 0 | 1 | 저그 별동대 |
| P9 | 7 / 7 | 4 | — | 비활성 |
| P10 | 7 / 7 | 4 | — | 비활성 |
| P11 | 7 / 7 | 4 | — | 비활성 |
| P12 | 7 / 7 | 4 | — | 중립 배치 |

FORC 플래그 원시값: 14, 10, 0, 0. 맵 설정 사용(Use Map Settings)을 기준으로 한다.

## 3. 모든 트리거 위치

사각형은 (좌, 상, 우, 하) 순서다. 중심은 이동·생성 명령의 기준점이다. Focus는 런타임이 옮기는 작업용 위치다.

| MRGN | 이름 | 타일 사각형 | 픽셀 사각형 | 중심 px | 고도 제외 플래그 |
| --- | --- | --- | --- | --- | --- |
| 1 | Entry | 26, 179, 42, 191 | 832, 5728, 1344, 6112 | (1088, 5920) | 0 |
| 2 | Wreck | 54, 164, 66, 176 | 1728, 5248, 2112, 5632 | (1920, 5440) | 0 |
| 3 | Reactor | 92, 149, 108, 165 | 2944, 4768, 3456, 5280 | (3200, 5024) | 0 |
| 4 | Depot | 69, 144, 81, 158 | 2208, 4608, 2592, 5056 | (2400, 4832) | 0 |
| 5 | Motor | 124, 152, 138, 166 | 3968, 4864, 4416, 5312 | (4192, 5088) | 0 |
| 6 | Mineral | 42, 121, 56, 135 | 1344, 3872, 1792, 4320 | (1568, 4096) | 0 |
| 7 | WestGate | 72, 121, 86, 135 | 2304, 3872, 2752, 4320 | (2528, 4096) | 0 |
| 8 | EastGate | 125, 122, 139, 134 | 4000, 3904, 4448, 4288 | (4224, 4096) | 0 |
| 9 | Drain | 141, 123, 153, 135 | 4512, 3936, 4896, 4320 | (4704, 4128) | 0 |
| 10 | Shelter | 151, 150, 163, 162 | 4832, 4800, 5216, 5184 | (5024, 4992) | 0 |
| 11 | Garrison | 98, 122, 112, 136 | 3136, 3904, 3584, 4352 | (3360, 4128) | 0 |
| 12 | Watch | 87, 101, 101, 115 | 2784, 3232, 3232, 3680 | (3008, 3456) | 0 |
| 13 | Relay | 139, 85, 155, 101 | 4448, 2720, 4960, 3232 | (4704, 2976) | 0 |
| 14 | NorthLane | 102, 85, 114, 97 | 3264, 2720, 3648, 3104 | (3456, 2912) | 0 |
| 15 | WestLane | 47, 105, 61, 117 | 1504, 3360, 1952, 3744 | (1728, 3552) | 0 |
| 16 | DrainLane | 150, 108, 164, 120 | 4800, 3456, 5248, 3840 | (5024, 3648) | 0 |
| 17 | Nest | 121, 49, 137, 61 | 3872, 1568, 4384, 1952 | (4128, 1760) | 0 |
| 18 | NestLane | 109, 64, 123, 76 | 3488, 2048, 3936, 2432 | (3712, 2240) | 0 |
| 19 | Extraction | 142, 28, 156, 42 | 4544, 896, 4992, 1344 | (4768, 1120) | 0 |
| 20 | Focus | 2, 2, 4, 4 | 64, 64, 128, 128 | (96, 96) | 0 |

기본 Anywhere는 위 명명 위치 수에서 제외한다.

## 4. 모든 초기 UNIT 레코드

픽셀은 배치 중심이다. 타일 칸은 픽셀에 32를 나누고 내림한 값이다. HP의 —는 개별 지정 없음이다.
건물 여유는 중심과 크기로 계산한다. 좌상단 = floor(중심 px / 32 − 크기 / 2).
시작 위치 마커와 비콘도 누락 없이 포함한다. 시작 위치 마커는 전투 개체가 아니다.

| 일련번호 | 소스 ID | 엔진 종류 / ID | 소유자 | 중심 px | 중심 타일 칸 | HP % | 건물 여유(타일) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | p1-start | Start Location / 214 | P1 | (1088, 5920) | (34, 185) | — | — |
| 2 | hero | Jim Raynor (Marine) / 20 | P1 | (1088, 5920) | (34, 185) | — | — |
| 3 | broken-convoy | Terran Supply Depot / 109 | P12 | (1808, 5376) | (56, 168) | 48 | 3×2 |
| 4 | convoy-escort-wreck | Terran Supply Depot / 109 | P12 | (2064, 5520) | (64, 172) | 50 | 3×2 |
| 5 | reactor | Terran Command Center / 106 | P3 | (3200, 4864) | (100, 152) | 48 | 4×3 |
| 6 | capacitor-a | Terran Supply Depot / 109 | P12 | (2976, 5024) | (93, 157) | 50 | 3×2 |
| 7 | capacitor-b | Terran Supply Depot / 109 | P12 | (3424, 5024) | (107, 157) | 50 | 3×2 |
| 8 | munitions | Terran Supply Depot / 109 | P12 | (2400, 4704) | (75, 147) | 45 | 3×2 |
| 9 | depot-wall | Terran Supply Depot / 109 | P12 | (2272, 4832) | (71, 151) | — | 3×2 |
| 10 | motor-factory | Terran Factory / 113 | P12 | (4192, 4928) | (131, 154) | 45 | 4×3 |
| 11 | motor-store | Terran Supply Depot / 109 | P12 | (4368, 5152) | (136, 161) | 50 | 3×2 |
| 12 | pump | Terran Refinery / 110 | P12 | (4864, 4128) | (152, 129) | 48 | 4×2 |
| 13 | civilian-refuge | Terran Academy / 112 | P12 | (5024, 4864) | (157, 152) | 60 | 3×2 |
| 14 | watch-station | Terran Missile Turret / 124 | P12 | (3008, 3328) | (94, 104) | 48 | 2×2 |
| 15 | broken-comms | Terran Science Facility / 116 | P12 | (4704, 2816) | (147, 88) | 45 | 4×3 |
| 16 | west-bunker | Terran Bunker / 125 | P3 | (2528, 3968) | (79, 124) | 55 | 3×2 |
| 17 | east-bunker | Terran Bunker / 125 | P3 | (4224, 3968) | (132, 124) | 60 | 3×2 |
| 18 | garrison-barracks | Terran Barracks / 111 | P12 | (3536, 4048) | (110, 126) | 48 | 4×3 |
| 19 | mineral-shed | Terran Supply Depot / 109 | P12 | (1440, 4016) | (45, 125) | 45 | 3×2 |
| 20 | zerg-burrow-node | Zerg Hatchery / 131 | P2 | (4128, 1632) | (129, 51) | 50 | 4×3 |
| 21 | marker-Wreck | Terran Beacon / 195 | P12 | (1920, 5440) | (60, 170) | — | — |
| 22 | marker-Reactor | Terran Beacon / 195 | P12 | (3200, 5024) | (100, 157) | — | — |
| 23 | marker-Depot | Terran Beacon / 195 | P12 | (2400, 4832) | (75, 151) | — | — |
| 24 | marker-Motor | Terran Beacon / 195 | P12 | (4192, 5088) | (131, 159) | — | — |
| 25 | marker-Mineral | Terran Beacon / 195 | P12 | (1568, 4096) | (49, 128) | — | — |
| 26 | marker-WestGate | Terran Beacon / 195 | P12 | (2528, 4096) | (79, 128) | — | — |
| 27 | marker-EastGate | Terran Beacon / 195 | P12 | (4224, 4096) | (132, 128) | — | — |
| 28 | marker-Drain | Terran Beacon / 195 | P12 | (4704, 4128) | (147, 129) | — | — |
| 29 | marker-Shelter | Terran Beacon / 195 | P12 | (5024, 4992) | (157, 156) | — | — |
| 30 | marker-Garrison | Terran Beacon / 195 | P12 | (3360, 4128) | (105, 129) | — | — |
| 31 | marker-Watch | Terran Beacon / 195 | P12 | (3008, 3456) | (94, 108) | — | — |
| 32 | marker-Relay | Terran Beacon / 195 | P12 | (4704, 2976) | (147, 93) | — | — |
| 33 | marker-Nest | Terran Beacon / 195 | P12 | (4128, 1760) | (129, 55) | — | — |
| 34 | marker-Extraction | Terran Beacon / 195 | P12 | (4768, 1120) | (149, 35) | — | — |

## 5. 지형 도색 순서

시드 417, 기반 CV5 지형 2(Dirt)에서 시작한다. 표 순서대로 전환 브러시를 적용한다.
중심 좌표는 타일 단위다. extent는 브러시 인수다. 도색 결과의 직사각형 폭을 뜻하지 않는다.
최종 지형의 모든 셀은 MTXM CSV를 참조한다. 브러시 ID는 CV5 지형 종류다. 저장된 ISOM 값과 개별 MTXM 값은 별도다.

| 순서 | 지형 항목 | 중심 타일 | CV5 지형 ID | 지형 | extent |
| --- | --- | --- | --- | --- | --- |
| 1 | entry convoy track | (34, 185) | 14 | Asphalt | 6 |
| 2 | southern wreck field | (60, 170) | 15 | Rocky Ground | 7 |
| 3 | reactor apron | (100, 157) | 14 | Asphalt | 8 |
| 4 | depot loading yard | (75, 151) | 14 | Asphalt | 6 |
| 5 | motor pool hardstand | (131, 159) | 14 | Asphalt | 7 |
| 6 | west mineral yard | (49, 128) | 15 | Rocky Ground | 6 |
| 7 | west high ground | (29, 113) | 3 | High Dirt | 9 |
| 8 | east escarpment | (193, 111) | 3 | High Dirt | 12 |
| 9 | drain basin | (147, 129) | 4 | Mud | 7 |
| 10 | west bank | (67, 96) | 5 | Water | 6 |
| 11 | north observation apron | (94, 108) | 14 | Asphalt | 5 |
| 12 | north high ground | (122, 99) | 3 | High Dirt | 5 |
| 13 | east choke | (132, 128) | 15 | Rocky Ground | 4 |
| 14 | garrison bunker apron | (105, 129) | 14 | Asphalt | 6 |
| 15 | relay hardstand | (147, 93) | 14 | Asphalt | 6 |
| 16 | north ridge | (172, 67) | 3 | High Dirt | 9 |
| 17 | zerg approach rock | (119, 71) | 15 | Rocky Ground | 7 |
| 18 | nest basin | (129, 55) | 4 | Mud | 8 |
| 19 | exit ridge road | (149, 35) | 14 | Asphalt | 7 |
| 20 | northwest wash | (77, 64) | 5 | Water | 9 |
| 21 | south floodplain | (175, 188) | 5 | Water | 12 |
| 22 | eastern shelter grove | (157, 156) | 6 | Grass | 5 |
| 23 | west gate apron | (79, 128) | 14 | Asphalt | 5 |
| 24 | broken convoy road | (34, 185) | 14 | Asphalt | 2 |
| 25 | broken convoy road | (37, 184) | 14 | Asphalt | 2 |
| 26 | broken convoy road | (39, 184) | 14 | Asphalt | 2 |
| 27 | broken convoy road | (42, 183) | 14 | Asphalt | 2 |
| 28 | broken convoy road | (44, 183) | 14 | Asphalt | 2 |
| 29 | broken convoy road | (47, 182) | 14 | Asphalt | 2 |
| 30 | broken convoy road | (49, 180) | 14 | Asphalt | 2 |
| 31 | broken convoy road | (52, 179) | 14 | Asphalt | 2 |
| 32 | broken convoy road | (54, 177) | 14 | Asphalt | 2 |
| 33 | cargo road | (75, 151) | 14 | Asphalt | 3 |
| 34 | cargo road | (77, 152) | 14 | Asphalt | 3 |
| 35 | cargo road | (80, 153) | 14 | Asphalt | 3 |
| 36 | cargo road | (82, 154) | 14 | Asphalt | 3 |
| 37 | cargo road | (84, 155) | 14 | Asphalt | 3 |
| 38 | cargo road | (87, 156) | 14 | Asphalt | 3 |
| 39 | cargo road | (89, 157) | 14 | Asphalt | 3 |
| 40 | cargo road | (92, 157) | 14 | Asphalt | 3 |
| 41 | cargo road | (95, 157) | 14 | Asphalt | 3 |
| 42 | cargo road | (97, 157) | 14 | Asphalt | 3 |
| 43 | cargo road | (100, 157) | 14 | Asphalt | 3 |
| 44 | cargo road | (103, 158) | 14 | Asphalt | 3 |
| 45 | cargo road | (105, 158) | 14 | Asphalt | 3 |
| 46 | cargo road | (108, 159) | 14 | Asphalt | 3 |
| 47 | cargo road | (111, 159) | 14 | Asphalt | 3 |
| 48 | cargo road | (113, 160) | 14 | Asphalt | 3 |
| 49 | cargo road | (116, 160) | 14 | Asphalt | 3 |
| 50 | cargo road | (119, 160) | 14 | Asphalt | 3 |
| 51 | cargo road | (121, 160) | 14 | Asphalt | 3 |
| 52 | cargo road | (124, 160) | 14 | Asphalt | 3 |
| 53 | cargo road | (126, 159) | 14 | Asphalt | 3 |
| 54 | cargo road | (129, 159) | 14 | Asphalt | 3 |
| 55 | cargo road | (131, 159) | 14 | Asphalt | 3 |
| 56 | west defence road | (79, 128) | 14 | Asphalt | 2 |
| 57 | west defence road | (82, 129) | 14 | Asphalt | 2 |
| 58 | west defence road | (85, 130) | 14 | Asphalt | 2 |
| 59 | west defence road | (87, 130) | 14 | Asphalt | 2 |
| 60 | west defence road | (90, 131) | 14 | Asphalt | 2 |
| 61 | west defence road | (93, 131) | 14 | Asphalt | 2 |
| 62 | west defence road | (95, 130) | 14 | Asphalt | 2 |
| 63 | west defence road | (98, 130) | 14 | Asphalt | 2 |
| 64 | west defence road | (100, 130) | 14 | Asphalt | 2 |
| 65 | west defence road | (103, 129) | 14 | Asphalt | 2 |
| 66 | west defence road | (105, 129) | 14 | Asphalt | 2 |
| 67 | west defence road | (106, 131) | 14 | Asphalt | 2 |
| 68 | west defence road | (108, 133) | 14 | Asphalt | 2 |
| 69 | west defence road | (109, 136) | 14 | Asphalt | 2 |
| 70 | west defence road | (111, 138) | 14 | Asphalt | 2 |
| 71 | west defence road | (112, 140) | 14 | Asphalt | 2 |
| 72 | west defence road | (110, 142) | 14 | Asphalt | 2 |
| 73 | west defence road | (109, 145) | 14 | Asphalt | 2 |
| 74 | west defence road | (107, 147) | 14 | Asphalt | 2 |
| 75 | west defence road | (105, 150) | 14 | Asphalt | 2 |
| 76 | west defence road | (103, 152) | 14 | Asphalt | 2 |
| 77 | west defence road | (102, 155) | 14 | Asphalt | 2 |
| 78 | west defence road | (100, 157) | 14 | Asphalt | 2 |
| 79 | east defence road | (131, 159) | 14 | Asphalt | 2 |
| 80 | east defence road | (131, 156) | 14 | Asphalt | 2 |
| 81 | east defence road | (131, 153) | 14 | Asphalt | 2 |
| 82 | east defence road | (130, 151) | 14 | Asphalt | 2 |
| 83 | east defence road | (130, 148) | 14 | Asphalt | 2 |
| 84 | east defence road | (130, 145) | 14 | Asphalt | 2 |
| 85 | east defence road | (130, 142) | 14 | Asphalt | 2 |
| 86 | east defence road | (131, 139) | 14 | Asphalt | 2 |
| 87 | east defence road | (131, 137) | 14 | Asphalt | 2 |
| 88 | east defence road | (131, 134) | 14 | Asphalt | 2 |
| 89 | east defence road | (132, 131) | 14 | Asphalt | 2 |
| 90 | east defence road | (132, 128) | 14 | Asphalt | 2 |
| 91 | watch access spur | (105, 129) | 14 | Asphalt | 2 |
| 92 | watch access spur | (103, 127) | 14 | Asphalt | 2 |
| 93 | watch access spur | (101, 126) | 14 | Asphalt | 2 |
| 94 | watch access spur | (98, 124) | 14 | Asphalt | 2 |
| 95 | watch access spur | (96, 123) | 14 | Asphalt | 2 |
| 96 | watch access spur | (94, 121) | 14 | Asphalt | 2 |
| 97 | watch access spur | (94, 118) | 14 | Asphalt | 2 |
| 98 | watch access spur | (94, 116) | 14 | Asphalt | 2 |
| 99 | watch access spur | (94, 113) | 14 | Asphalt | 2 |
| 100 | watch access spur | (94, 111) | 14 | Asphalt | 2 |
| 101 | watch access spur | (94, 108) | 14 | Asphalt | 2 |
| 102 | broken north relay road | (147, 93) | 14 | Asphalt | 2 |
| 103 | broken north relay road | (148, 91) | 14 | Asphalt | 2 |
| 104 | broken north relay road | (148, 88) | 14 | Asphalt | 2 |
| 105 | broken north relay road | (149, 86) | 14 | Asphalt | 2 |
| 106 | broken north relay road | (149, 83) | 14 | Asphalt | 2 |
| 107 | broken north relay road | (150, 81) | 14 | Asphalt | 2 |
| 108 | broken north relay road | (149, 79) | 14 | Asphalt | 2 |
| 109 | broken north relay road | (149, 77) | 14 | Asphalt | 2 |
| 110 | broken north relay road | (148, 75) | 14 | Asphalt | 2 |

## 6. 기존 정적 통행 기록

아래 값은 기존 빌드 기록에서 가져왔다. 원본 M01/M02의 기능 검사를 반복하지 않았다.
검사 방법: 16개 미니타일이 모두 보행 가능해야 한다. 건물 주위에 한 타일을 추가한다. 4방향 탐색으로 연결을 확인한다.
단계 수는 정적 탐색 거리다. 스타크래프트 엔진의 이동 거리, 소요 시간, 길찾기를 보장하지 않는다.

| 지표 | 기존 기록 |
| --- | --- |
| 고도별 타일 수 | 0: 48441 / 1: 1735 |
| 지형 보행 제한 타일 | 2396 |
| 절벽 플래그 / 시야 차단 플래그 타일 | 0 / 0 |
| 경로 수 | 24 |

| 출발 | 도착 | 4방향 탐색 단계 |
| --- | --- | --- |
| Entry | Wreck | 41 |
| Wreck | Reactor | 53 |
| Reactor | Depot | 31 |
| Depot | Motor | 64 |
| Depot | Mineral | 53 |
| Mineral | WestGate | 30 |
| WestGate | Garrison | 27 |
| Motor | EastGate | 36 |
| EastGate | Drain | 16 |
| Drain | Shelter | 37 |
| Garrison | Watch | 32 |
| Garrison | Reactor | 33 |
| WestLane | WestGate | 42 |
| DrainLane | EastGate | 39 |
| NorthLane | Garrison | 41 |
| Garrison | Relay | 78 |
| Relay | Nest | 56 |
| NestLane | Nest | 28 |
| Nest | Extraction | 40 |
| WestLane | Depot | 65 |
| NorthLane | EastGate | 61 |
| WestLane | Reactor | 92 |
| DrainLane | Reactor | 100 |
| Watch | NestLane | 60 |
