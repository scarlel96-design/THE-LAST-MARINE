# M01 마지막 생존자 — SCX 실측 배치

상태: **SCX·소스 대조 완료 / 실게임 NOT RUN**. 아래 값은 패키지 안의 초기 배치를 설명한다.
런타임 배치와 지역별 제작 의도는 [M01 현장 명세](M01_FIELD.md)를 참조한다.

## 1. 규격과 근거

| 항목 | 값 |
| --- | --- |
| 대상 플레이 맵 | [M01_NORTH_RIDGE_START_FIX.scx](../../WO-PROD-02-HOTFIX/maps/M01_NORTH_RIDGE_START_FIX.scx) |
| 편집 소스 맵 | [M01_NORTH_RIDGE_START_FIX_SOURCE.scx](../../WO-PROD-02-HOTFIX/maps/M01_NORTH_RIDGE_START_FIX_SOURCE.scx) |
| 동일 배치의 비교 맵 | [M01_CONTROL_CHECK.scx](../../WO-PROD-02-HOTFIX/maps/M01_CONTROL_CHECK.scx) |
| 빌드 기록 | [기존 구조 검사 및 경로 기록](../../WO-PROD-02-HOTFIX/reports/M01_NORTH_RIDGE_START_FIX.json) |
| 지형 / 포맷 | Badlands / SCX / CHK ERA 0 / VER 206 |
| 크기 | 192×192타일 / 6144×6144px |
| 그리드 | [M01_MTXM.csv](M01_MTXM.csv) / x=열, y=행, 십진 MTXM 원시값 |
| MTXM SHA-256 (리틀엔디언 uint16) | 78964526639371faf3e5e59a293026a3f311b84628855939c98917a6f7b737af |
| ISOM SHA-256 (리틀엔디언 uint16) | 891bdb01b266023bb4f26aa7fda79c73049a8da34a412875496106811842898f |
| 플레이 SCX SHA-256 | 46ad3e3fcc8b8876263ab8e5b3569f74db6784f0ed9e665bc4039e3941457f91 |
| UNIT / 명명 MRGN / DD2 / THG2 | 151 / 34 / 0 / 0 |
| 기본 트리거 / 브리핑 | 85 / 1 (소스 및 비교 맵은 별도) |
| 네이티브 동맹 행동 | 24 |

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
| 1 | Barracks | 28, 128, 52, 152 | 896, 4096, 1664, 4864 | (1280, 4480) | 0 |
| 2 | Armory | 60, 124, 76, 140 | 1920, 3968, 2432, 4480 | (2176, 4224) | 0 |
| 3 | Outpost | 32, 84, 48, 100 | 1024, 2688, 1536, 3200 | (1280, 2944) | 0 |
| 4 | Outer | 48, 78, 72, 94 | 1536, 2496, 2304, 3008 | (1920, 2752) | 0 |
| 5 | Inner | 66, 94, 86, 110 | 2112, 3008, 2752, 3520 | (2432, 3264) | 0 |
| 6 | MaraStart | 76, 88, 84, 96 | 2432, 2816, 2688, 3072 | (2560, 2944) | 0 |
| 7 | Workshop | 92, 82, 108, 98 | 2944, 2624, 3456, 3136 | (3200, 2880) | 0 |
| 8 | WrenStart | 96, 84, 104, 92 | 3072, 2688, 3328, 2944 | (3200, 2816) | 0 |
| 9 | Soldiers | 82, 106, 96, 120 | 2624, 3392, 3072, 3840 | (2848, 3616) | 0 |
| 10 | Civilians | 94, 118, 106, 130 | 3008, 3776, 3392, 4160 | (3200, 3968) | 0 |
| 11 | EllaStart | 98, 124, 104, 130 | 3136, 3968, 3328, 4160 | (3232, 4064) | 0 |
| 12 | Evac | 110, 110, 126, 126 | 3520, 3520, 4032, 4032 | (3776, 3776) | 0 |
| 13 | Inbound | 140, 112, 150, 124 | 4480, 3584, 4800, 3968 | (4640, 3776) | 0 |
| 14 | Crash | 128, 108, 138, 118 | 4096, 3456, 4416, 3776 | (4256, 3616) | 0 |
| 15 | Ammo | 112, 82, 124, 92 | 3584, 2624, 3968, 2944 | (3776, 2784) | 0 |
| 16 | Shelter | 104, 96, 114, 106 | 3328, 3072, 3648, 3392 | (3488, 3232) | 0 |
| 17 | Medical | 20, 156, 40, 174 | 640, 4992, 1280, 5568 | (960, 5280) | 0 |
| 18 | Settlement | 56, 152, 76, 170 | 1792, 4864, 2432, 5440 | (2112, 5152) | 0 |
| 19 | Relay | 90, 152, 110, 174 | 2880, 4864, 3520, 5568 | (3200, 5216) | 0 |
| 20 | Supply | 146, 142, 166, 162 | 4672, 4544, 5312, 5184 | (4992, 4864) | 0 |
| 21 | Exit | 160, 124, 174, 138 | 5120, 3968, 5568, 4416 | (5344, 4192) | 0 |
| 22 | Archive | 84, 132, 96, 144 | 2688, 4224, 3072, 4608 | (2880, 4416) | 0 |
| 23 | Salvage | 44, 174, 56, 186 | 1408, 5568, 1792, 5952 | (1600, 5760) | 0 |
| 24 | Restricted | 128, 164, 144, 180 | 4096, 5248, 4608, 5760 | (4352, 5504) | 0 |
| 25 | NorthRoute | 72, 142, 84, 150 | 2304, 4544, 2688, 4800 | (2496, 4672) | 0 |
| 26 | SouthRoute | 76, 174, 88, 182 | 2432, 5568, 2816, 5824 | (2624, 5696) | 0 |
| 27 | OuterReserve | 36, 52, 50, 68 | 1152, 1664, 1600, 2176 | (1376, 1920) | 0 |
| 28 | InnerReserve | 78, 62, 90, 76 | 2496, 1984, 2880, 2432 | (2688, 2208) | 0 |
| 29 | DepotReserve | 132, 68, 148, 80 | 4224, 2176, 4736, 2560 | (4480, 2368) | 0 |
| 30 | SettlementFight | 60, 148, 78, 168 | 1920, 4736, 2496, 5376 | (2208, 5056) | 0 |
| 31 | RelayFight | 94, 148, 112, 170 | 3008, 4736, 3584, 5440 | (3296, 5088) | 0 |
| 32 | SupplyFight | 142, 138, 168, 162 | 4544, 4416, 5376, 5184 | (4960, 4800) | 0 |
| 33 | RestrictedFight | 126, 162, 146, 182 | 4032, 5184, 4672, 5824 | (4352, 5504) | 0 |
| 34 | Focus | 2, 2, 4, 4 | 64, 64, 128, 128 | (96, 96) | 0 |

기본 Anywhere는 위 명명 위치 수에서 제외한다.

## 4. 모든 초기 UNIT 레코드

픽셀은 배치 중심이다. 타일 칸은 픽셀에 32를 나누고 내림한 값이다. HP의 —는 개별 지정 없음이다.
건물 여유는 중심과 크기로 계산한다. 좌상단 = floor(중심 px / 32 − 크기 / 2).
시작 위치 마커와 비콘도 누락 없이 포함한다. 시작 위치 마커는 전투 개체가 아니다.

| 일련번호 | 소스 ID | 엔진 종류 / ID | 소유자 | 중심 px | 중심 타일 칸 | HP % | 건물 여유(타일) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | start | Start Location / 214 | P1 | (1280, 4480) | (40, 140) | — | — |
| 2 | hero | Jim Raynor (Marine) / 20 | P1 | (1280, 4480) | (40, 140) | — | — |
| 3 | mara | Gui Montag (Firebat) / 10 | P3 | (2560, 2944) | (80, 92) | — | — |
| 4 | wren | Terran SCV / 7 | P3 | (3200, 2816) | (100, 88) | — | — |
| 5 | ella | Terran Civilian / 15 | P4 | (3232, 4064) | (101, 127) | — | — |
| 6 | command | Terran Command Center / 106 | P3 | (1120, 4280) | (35, 133) | — | 4×3 |
| 7 | barracks | Terran Barracks / 111 | P3 | (1440, 4320) | (45, 135) | — | 4×3 |
| 8 | armory | Terran Armory / 123 | P3 | (2336, 4224) | (73, 132) | — | 3×2 |
| 9 | sensor | Terran Missile Turret / 124 | P3 | (1152, 2944) | (36, 92) | — | 2×2 |
| 10 | outer-bunker | Terran Bunker / 125 | P3 | (1920, 2656) | (60, 83) | — | 3×2 |
| 11 | inner-bunker | Terran Bunker / 125 | P3 | (2432, 3152) | (76, 98) | — | 3×2 |
| 12 | workshop | Terran Factory / 113 | P3 | (3328, 2768) | (104, 86) | — | 4×3 |
| 13 | ammo-depot | Terran Supply Depot / 109 | P3 | (3776, 2784) | (118, 87) | — | 3×2 |
| 14 | dropship | Terran Dropship / 11 | P3 | (4640, 3776) | (145, 118) | — | — |
| 15 | hospital | Terran Academy / 112 | P3 | (800, 5184) | (25, 162) | 45 | 3×2 |
| 16 | relay | Terran Engineering Bay / 122 | P3 | (3392, 5136) | (106, 160) | — | 4×3 |
| 17 | supply | Terran Supply Depot / 109 | P3 | (5184, 4960) | (162, 155) | — | 3×2 |
| 18 | supply-command | Terran Command Center / 106 | P3 | (5216, 4672) | (163, 146) | — | 4×3 |
| 19 | archive | Terran Comsat Station / 107 | P3 | (3008, 4416) | (94, 138) | — | 2×2 |
| 20 | restricted | Terran Armory / 123 | P3 | (4544, 5536) | (142, 173) | — | 3×2 |
| 21 | outer-guard-0 | Terran Marine / 0 | P3 | (1808, 2832) | (56, 88) | — | — |
| 22 | outer-guard-1 | Terran Marine / 0 | P3 | (1856, 2832) | (58, 88) | — | — |
| 23 | outer-guard-2 | Terran Marine / 0 | P3 | (1904, 2832) | (59, 88) | — | — |
| 24 | outer-guard-3 | Terran Marine / 0 | P3 | (1952, 2832) | (61, 88) | — | — |
| 25 | inner-guard-0 | Terran Marine / 0 | P3 | (2320, 3328) | (72, 104) | — | — |
| 26 | inner-guard-1 | Terran Marine / 0 | P3 | (2368, 3328) | (74, 104) | — | — |
| 27 | inner-guard-2 | Terran Marine / 0 | P3 | (2416, 3328) | (75, 104) | — | — |
| 28 | inner-guard-3 | Terran Marine / 0 | P3 | (2464, 3328) | (77, 104) | — | — |
| 29 | rescue-soldier-0 | Terran Marine / 0 | P5 | (2784, 3616) | (87, 113) | — | — |
| 30 | rescue-soldier-1 | Terran Marine / 0 | P5 | (2848, 3616) | (89, 113) | — | — |
| 31 | rescue-soldier-2 | Terran Marine / 0 | P5 | (2912, 3616) | (91, 113) | — | — |
| 32 | civilian-0 | Terran Civilian / 15 | P4 | (3104, 3968) | (97, 124) | — | — |
| 33 | civilian-1 | Terran Civilian / 15 | P4 | (3152, 3968) | (98, 124) | — | — |
| 34 | civilian-2 | Terran Civilian / 15 | P4 | (3200, 3968) | (100, 124) | — | — |
| 35 | civilian-3 | Terran Civilian / 15 | P4 | (3248, 3968) | (101, 124) | — | — |
| 36 | civilian-4 | Terran Civilian / 15 | P4 | (3296, 3968) | (103, 124) | — | — |
| 37 | outer-zerg-0 | Zerg Zergling / 37 | P2 | (1248, 1824) | (39, 57) | — | — |
| 38 | outer-zerg-1 | Zerg Zergling / 37 | P2 | (1304, 1824) | (40, 57) | — | — |
| 39 | outer-zerg-2 | Zerg Zergling / 37 | P2 | (1360, 1824) | (42, 57) | — | — |
| 40 | outer-zerg-3 | Zerg Zergling / 37 | P2 | (1416, 1824) | (44, 57) | — | — |
| 41 | outer-zerg-4 | Zerg Zergling / 37 | P2 | (1472, 1824) | (46, 57) | — | — |
| 42 | outer-zerg-5 | Zerg Zergling / 37 | P2 | (1248, 1880) | (39, 58) | — | — |
| 43 | outer-zerg-6 | Zerg Zergling / 37 | P2 | (1304, 1880) | (40, 58) | — | — |
| 44 | outer-zerg-7 | Zerg Zergling / 37 | P2 | (1360, 1880) | (42, 58) | — | — |
| 45 | outer-zerg-8 | Zerg Zergling / 37 | P2 | (1416, 1880) | (44, 58) | — | — |
| 46 | outer-zerg-9 | Zerg Zergling / 37 | P2 | (1472, 1880) | (46, 58) | — | — |
| 47 | outer-zerg-10 | Zerg Zergling / 37 | P2 | (1248, 1936) | (39, 60) | — | — |
| 48 | outer-zerg-11 | Zerg Zergling / 37 | P2 | (1304, 1936) | (40, 60) | — | — |
| 49 | outer-zerg-12 | Zerg Zergling / 37 | P2 | (1360, 1936) | (42, 60) | — | — |
| 50 | outer-zerg-13 | Zerg Zergling / 37 | P2 | (1416, 1936) | (44, 60) | — | — |
| 51 | outer-zerg-14 | Zerg Zergling / 37 | P2 | (1472, 1936) | (46, 60) | — | — |
| 52 | outer-zerg-15 | Zerg Zergling / 37 | P2 | (1248, 1992) | (39, 62) | — | — |
| 53 | outer-zerg-16 | Zerg Zergling / 37 | P2 | (1304, 1992) | (40, 62) | — | — |
| 54 | outer-zerg-17 | Zerg Zergling / 37 | P2 | (1360, 1992) | (42, 62) | — | — |
| 55 | inner-zerg-0 | Zerg Hydralisk / 38 | P6 | (2560, 2112) | (80, 66) | — | — |
| 56 | inner-zerg-1 | Zerg Hydralisk / 38 | P6 | (2616, 2112) | (81, 66) | — | — |
| 57 | inner-zerg-2 | Zerg Hydralisk / 38 | P6 | (2672, 2112) | (83, 66) | — | — |
| 58 | inner-zerg-3 | Zerg Hydralisk / 38 | P6 | (2728, 2112) | (85, 66) | — | — |
| 59 | inner-zerg-4 | Zerg Hydralisk / 38 | P6 | (2784, 2112) | (87, 66) | — | — |
| 60 | inner-zerg-5 | Zerg Hydralisk / 38 | P6 | (2560, 2168) | (80, 67) | — | — |
| 61 | inner-zerg-6 | Zerg Hydralisk / 38 | P6 | (2616, 2168) | (81, 67) | — | — |
| 62 | inner-zerg-7 | Zerg Hydralisk / 38 | P6 | (2672, 2168) | (83, 67) | — | — |
| 63 | inner-zerg-8 | Zerg Hydralisk / 38 | P6 | (2728, 2168) | (85, 67) | — | — |
| 64 | inner-zerg-9 | Zerg Hydralisk / 38 | P6 | (2784, 2168) | (87, 67) | — | — |
| 65 | inner-zerg-10 | Zerg Hydralisk / 38 | P6 | (2560, 2224) | (80, 69) | — | — |
| 66 | inner-zerg-11 | Zerg Hydralisk / 38 | P6 | (2616, 2224) | (81, 69) | — | — |
| 67 | inner-zerg-12 | Zerg Hydralisk / 38 | P6 | (2672, 2224) | (83, 69) | — | — |
| 68 | inner-zerg-13 | Zerg Hydralisk / 38 | P6 | (2728, 2224) | (85, 69) | — | — |
| 69 | inner-zerg-14 | Zerg Hydralisk / 38 | P6 | (2784, 2224) | (87, 69) | — | — |
| 70 | inner-zerg-15 | Zerg Hydralisk / 38 | P6 | (2560, 2280) | (80, 71) | — | — |
| 71 | inner-zerg-16 | Zerg Hydralisk / 38 | P6 | (2616, 2280) | (81, 71) | — | — |
| 72 | inner-zerg-17 | Zerg Hydralisk / 38 | P6 | (2672, 2280) | (83, 71) | — | — |
| 73 | inner-zerg-18 | Zerg Hydralisk / 38 | P6 | (2728, 2280) | (85, 71) | — | — |
| 74 | inner-zerg-19 | Zerg Hydralisk / 38 | P6 | (2784, 2280) | (87, 71) | — | — |
| 75 | depot-zerg-0 | Zerg Hydralisk / 38 | P7 | (4368, 2272) | (136, 71) | — | — |
| 76 | depot-zerg-1 | Zerg Hydralisk / 38 | P7 | (4424, 2272) | (138, 71) | — | — |
| 77 | depot-zerg-2 | Zerg Hydralisk / 38 | P7 | (4480, 2272) | (140, 71) | — | — |
| 78 | depot-zerg-3 | Zerg Hydralisk / 38 | P7 | (4536, 2272) | (141, 71) | — | — |
| 79 | depot-zerg-4 | Zerg Hydralisk / 38 | P7 | (4368, 2328) | (136, 72) | — | — |
| 80 | depot-zerg-5 | Zerg Hydralisk / 38 | P7 | (4424, 2328) | (138, 72) | — | — |
| 81 | depot-zerg-6 | Zerg Hydralisk / 38 | P7 | (4480, 2328) | (140, 72) | — | — |
| 82 | depot-zerg-7 | Zerg Hydralisk / 38 | P7 | (4536, 2328) | (141, 72) | — | — |
| 83 | depot-zerg-8 | Zerg Hydralisk / 38 | P7 | (4368, 2384) | (136, 74) | — | — |
| 84 | depot-zerg-9 | Zerg Hydralisk / 38 | P7 | (4424, 2384) | (138, 74) | — | — |
| 85 | depot-zerg-10 | Zerg Hydralisk / 38 | P7 | (4480, 2384) | (140, 74) | — | — |
| 86 | depot-zerg-11 | Zerg Hydralisk / 38 | P7 | (4536, 2384) | (141, 74) | — | — |
| 87 | depot-zerg-12 | Zerg Hydralisk / 38 | P7 | (4368, 2440) | (136, 76) | — | — |
| 88 | depot-zerg-13 | Zerg Hydralisk / 38 | P7 | (4424, 2440) | (138, 76) | — | — |
| 89 | SettlementFight-0 | Zerg Hydralisk / 38 | P2 | (2112, 5008) | (66, 156) | 65 | — |
| 90 | SettlementFight-1 | Zerg Hydralisk / 38 | P2 | (2176, 5008) | (68, 156) | 65 | — |
| 91 | SettlementFight-2 | Zerg Hydralisk / 38 | P2 | (2240, 5008) | (70, 156) | 65 | — |
| 92 | SettlementFight-3 | Zerg Hydralisk / 38 | P2 | (2304, 5008) | (72, 156) | 65 | — |
| 93 | SettlementFight-4 | Zerg Hydralisk / 38 | P2 | (2112, 5072) | (66, 158) | 65 | — |
| 94 | RelayFight-0 | Zerg Zergling / 37 | P6 | (3200, 5040) | (100, 157) | 65 | — |
| 95 | RelayFight-1 | Zerg Zergling / 37 | P6 | (3264, 5040) | (102, 157) | 65 | — |
| 96 | RelayFight-2 | Zerg Zergling / 37 | P6 | (3328, 5040) | (104, 157) | 65 | — |
| 97 | RelayFight-3 | Zerg Zergling / 37 | P6 | (3392, 5040) | (106, 157) | 65 | — |
| 98 | RelayFight-4 | Zerg Zergling / 37 | P6 | (3200, 5104) | (100, 159) | 65 | — |
| 99 | SupplyFight-0 | Zerg Zergling / 37 | P7 | (4864, 4752) | (152, 148) | 65 | — |
| 100 | SupplyFight-1 | Zerg Zergling / 37 | P7 | (4928, 4752) | (154, 148) | 65 | — |
| 101 | SupplyFight-2 | Zerg Zergling / 37 | P7 | (4992, 4752) | (156, 148) | 65 | — |
| 102 | SupplyFight-3 | Zerg Zergling / 37 | P7 | (5056, 4752) | (158, 148) | 65 | — |
| 103 | SupplyFight-4 | Zerg Zergling / 37 | P7 | (4864, 4816) | (152, 150) | 65 | — |
| 104 | SupplyFight-5 | Zerg Zergling / 37 | P7 | (4928, 4816) | (154, 150) | 65 | — |
| 105 | RestrictedFight-0 | Zerg Zergling / 37 | P8 | (4256, 5456) | (133, 170) | 65 | — |
| 106 | RestrictedFight-1 | Zerg Zergling / 37 | P8 | (4320, 5456) | (135, 170) | 65 | — |
| 107 | RestrictedFight-2 | Zerg Zergling / 37 | P8 | (4384, 5456) | (137, 170) | 65 | — |
| 108 | RestrictedFight-3 | Zerg Zergling / 37 | P8 | (4448, 5456) | (139, 170) | 65 | — |
| 109 | Barracks-wall-0 | Terran Supply Depot / 109 | P3 | (1024, 4576) | (32, 143) | — | 3×2 |
| 110 | Barracks-wall-1 | Terran Supply Depot / 109 | P3 | (1024, 4704) | (32, 147) | — | 3×2 |
| 111 | Barracks-wall-2 | Terran Supply Depot / 109 | P3 | (1536, 4704) | (48, 147) | — | 3×2 |
| 112 | Armory-wall-0 | Terran Supply Depot / 109 | P3 | (2000, 4064) | (62, 127) | — | 3×2 |
| 113 | Armory-wall-1 | Terran Supply Depot / 109 | P3 | (2352, 4064) | (73, 127) | — | 3×2 |
| 114 | Outer-wall-0 | Terran Supply Depot / 109 | P3 | (1632, 2624) | (51, 82) | — | 3×2 |
| 115 | Outer-wall-1 | Terran Supply Depot / 109 | P3 | (2208, 2624) | (69, 82) | — | 3×2 |
| 116 | Outer-wall-2 | Terran Supply Depot / 109 | P3 | (1632, 2880) | (51, 90) | — | 3×2 |
| 117 | Outer-wall-3 | Terran Supply Depot / 109 | P3 | (2208, 2880) | (69, 90) | — | 3×2 |
| 118 | Inner-wall-0 | Terran Supply Depot / 109 | P3 | (2112, 3120) | (66, 97) | — | 3×2 |
| 119 | Inner-wall-1 | Terran Supply Depot / 109 | P3 | (2752, 3120) | (86, 97) | — | 3×2 |
| 120 | Workshop-wall-0 | Terran Supply Depot / 109 | P3 | (2944, 2976) | (92, 93) | — | 3×2 |
| 121 | Workshop-wall-1 | Terran Supply Depot / 109 | P3 | (3456, 3008) | (108, 94) | — | 3×2 |
| 122 | Evac-wall-0 | Terran Supply Depot / 109 | P3 | (3520, 3616) | (110, 113) | — | 3×2 |
| 123 | Evac-wall-1 | Terran Supply Depot / 109 | P3 | (4032, 3616) | (126, 113) | — | 3×2 |
| 124 | Settlement-wall-0 | Terran Supply Depot / 109 | P3 | (1856, 4960) | (58, 155) | — | 3×2 |
| 125 | Settlement-wall-1 | Terran Supply Depot / 109 | P3 | (2368, 5344) | (74, 167) | — | 3×2 |
| 126 | Supply-wall-0 | Terran Supply Depot / 109 | P3 | (4704, 4736) | (147, 148) | — | 3×2 |
| 127 | Supply-wall-1 | Terran Supply Depot / 109 | P3 | (4704, 4992) | (147, 156) | — | 3×2 |
| 128 | Supply-wall-2 | Terran Supply Depot / 109 | P3 | (5280, 4992) | (165, 156) | — | 3×2 |
| 129 | quarters-academy | Terran Academy / 112 | P3 | (960, 4432) | (30, 138) | — | 3×2 |
| 130 | landing-control | Terran Missile Turret / 124 | P3 | (3968, 3856) | (124, 120) | — | 2×2 |
| 131 | refuge-clinic | Terran Academy / 112 | P12 | (3200, 4096) | (100, 128) | — | 3×2 |
| 132 | relay-backup | Terran Supply Depot / 109 | P12 | (3008, 5296) | (94, 165) | 48 | 3×2 |
| 133 | beacon-Armory | Terran Beacon / 195 | P12 | (2176, 4224) | (68, 132) | — | — |
| 134 | beacon-Outpost | Terran Beacon / 195 | P12 | (1280, 2944) | (40, 92) | — | — |
| 135 | beacon-MaraStart | Terran Beacon / 195 | P12 | (2560, 2944) | (80, 92) | — | — |
| 136 | beacon-WrenStart | Terran Beacon / 195 | P12 | (3200, 2816) | (100, 88) | — | — |
| 137 | beacon-Soldiers | Terran Beacon / 195 | P12 | (2848, 3616) | (89, 113) | — | — |
| 138 | beacon-Civilians | Terran Beacon / 195 | P12 | (3200, 3968) | (100, 124) | — | — |
| 139 | beacon-Workshop | Terran Beacon / 195 | P12 | (3200, 2880) | (100, 90) | — | — |
| 140 | beacon-Evac | Terran Beacon / 195 | P12 | (3776, 3776) | (118, 118) | — | — |
| 141 | beacon-Shelter | Terran Beacon / 195 | P12 | (3488, 3232) | (109, 101) | — | — |
| 142 | beacon-Medical | Terran Beacon / 195 | P12 | (960, 5280) | (30, 165) | — | — |
| 143 | beacon-Settlement | Terran Beacon / 195 | P12 | (2112, 5152) | (66, 161) | — | — |
| 144 | beacon-Relay | Terran Beacon / 195 | P12 | (3200, 5216) | (100, 163) | — | — |
| 145 | beacon-Supply | Terran Beacon / 195 | P12 | (4992, 4864) | (156, 152) | — | — |
| 146 | beacon-Archive | Terran Beacon / 195 | P12 | (2880, 4416) | (90, 138) | — | — |
| 147 | beacon-Salvage | Terran Beacon / 195 | P12 | (1600, 5760) | (50, 180) | — | — |
| 148 | beacon-Restricted | Terran Beacon / 195 | P12 | (4352, 5504) | (136, 172) | — | — |
| 149 | beacon-NorthRoute | Terran Beacon / 195 | P12 | (2496, 4672) | (78, 146) | — | — |
| 150 | beacon-SouthRoute | Terran Beacon / 195 | P12 | (2624, 5696) | (82, 178) | — | — |
| 151 | beacon-Exit | Terran Beacon / 195 | P12 | (5344, 4192) | (167, 131) | — | — |

## 5. 지형 도색 순서

시드 172, 기반 CV5 지형 2(Dirt)에서 시작한다. 표 순서대로 전환 브러시를 적용한다.
중심 좌표는 타일 단위다. extent는 브러시 인수다. 도색 결과의 직사각형 폭을 뜻하지 않는다.
최종 지형의 모든 셀은 MTXM CSV를 참조한다. 브러시 ID는 CV5 지형 종류다. 저장된 ISOM 값과 개별 MTXM 값은 별도다.

| 순서 | 지형 항목 | 중심 타일 | CV5 지형 ID | 지형 | extent |
| --- | --- | --- | --- | --- | --- |
| 1 | northern rock ridge | (18, 69) | 3 | High Dirt | 10 |
| 2 | north surveillance apron | (40, 92) | 14 | Asphalt | 5 |
| 3 | outer trench banks | (59, 68) | 3 | High Dirt | 4 |
| 4 | outer firing lane | (60, 86) | 15 | Rocky Ground | 4 |
| 5 | inner bunker apron | (76, 103) | 14 | Asphalt | 6 |
| 6 | mara ridge | (102, 65) | 3 | High Dirt | 6 |
| 7 | industrial yard | (101, 90) | 14 | Asphalt | 6 |
| 8 | ammo pad | (118, 87) | 14 | Asphalt | 4 |
| 9 | eastern ravine | (156, 86) | 5 | Water | 9 |
| 10 | hangar approach | (134, 108) | 14 | Asphalt | 4 |
| 11 | evacuation hardstand | (118, 118) | 14 | Asphalt | 5 |
| 12 | civilian grove | (99, 125) | 6 | Grass | 4 |
| 13 | barracks hardstand | (40, 140) | 14 | Asphalt | 7 |
| 14 | barracks living area | (27, 130) | 6 | Grass | 4 |
| 15 | armory apron | (68, 132) | 14 | Asphalt | 5 |
| 16 | relay and archive apron | (99, 158) | 14 | Asphalt | 6 |
| 17 | hospital rubble | (31, 164) | 15 | Rocky Ground | 5 |
| 18 | abandoned settlement | (64, 161) | 4 | Mud | 5 |
| 19 | quartermaster yard | (156, 152) | 14 | Asphalt | 7 |
| 20 | restricted ravine | (136, 180) | 3 | High Dirt | 4 |
| 21 | west basin | (14, 113) | 5 | Water | 6 |
| 22 | eastern road | (166, 133) | 14 | Asphalt | 5 |
| 23 | barracks supply road | (40, 140) | 14 | Asphalt | 3 |
| 24 | barracks supply road | (43, 140) | 14 | Asphalt | 3 |
| 25 | barracks supply road | (46, 140) | 14 | Asphalt | 3 |
| 26 | barracks supply road | (49, 140) | 14 | Asphalt | 3 |
| 27 | barracks supply road | (52, 140) | 14 | Asphalt | 3 |
| 28 | barracks supply road | (54, 138) | 14 | Asphalt | 3 |
| 29 | barracks supply road | (56, 136) | 14 | Asphalt | 3 |
| 30 | barracks supply road | (58, 134) | 14 | Asphalt | 3 |
| 31 | barracks supply road | (60, 132) | 14 | Asphalt | 3 |
| 32 | barracks supply road | (63, 132) | 14 | Asphalt | 3 |
| 33 | barracks supply road | (65, 132) | 14 | Asphalt | 3 |
| 34 | barracks supply road | (68, 132) | 14 | Asphalt | 3 |
| 35 | north patrol road | (52, 140) | 14 | Asphalt | 2 |
| 36 | north patrol road | (52, 137) | 14 | Asphalt | 2 |
| 37 | north patrol road | (51, 135) | 14 | Asphalt | 2 |
| 38 | north patrol road | (51, 132) | 14 | Asphalt | 2 |
| 39 | north patrol road | (50, 129) | 14 | Asphalt | 2 |
| 40 | north patrol road | (50, 127) | 14 | Asphalt | 2 |
| 41 | north patrol road | (49, 124) | 14 | Asphalt | 2 |
| 42 | north patrol road | (48, 121) | 14 | Asphalt | 2 |
| 43 | north patrol road | (48, 119) | 14 | Asphalt | 2 |
| 44 | north patrol road | (47, 116) | 14 | Asphalt | 2 |
| 45 | north patrol road | (46, 113) | 14 | Asphalt | 2 |
| 46 | north patrol road | (45, 110) | 14 | Asphalt | 2 |
| 47 | north patrol road | (45, 108) | 14 | Asphalt | 2 |
| 48 | north patrol road | (44, 105) | 14 | Asphalt | 2 |
| 49 | north patrol road | (43, 102) | 14 | Asphalt | 2 |
| 50 | north patrol road | (42, 100) | 14 | Asphalt | 2 |
| 51 | north patrol road | (42, 97) | 14 | Asphalt | 2 |
| 52 | north patrol road | (41, 95) | 14 | Asphalt | 2 |
| 53 | north patrol road | (40, 92) | 14 | Asphalt | 2 |
| 54 | internal ammunition road | (76, 103) | 14 | Asphalt | 3 |
| 55 | internal ammunition road | (79, 103) | 14 | Asphalt | 3 |
| 56 | internal ammunition road | (82, 103) | 14 | Asphalt | 3 |
| 57 | internal ammunition road | (85, 103) | 14 | Asphalt | 3 |
| 58 | internal ammunition road | (87, 101) | 14 | Asphalt | 3 |
| 59 | internal ammunition road | (89, 99) | 14 | Asphalt | 3 |
| 60 | internal ammunition road | (92, 98) | 14 | Asphalt | 3 |
| 61 | internal ammunition road | (94, 96) | 14 | Asphalt | 3 |
| 62 | internal ammunition road | (96, 94) | 14 | Asphalt | 3 |
| 63 | internal ammunition road | (98, 93) | 14 | Asphalt | 3 |
| 64 | internal ammunition road | (99, 91) | 14 | Asphalt | 3 |
| 65 | internal ammunition road | (101, 90) | 14 | Asphalt | 3 |
| 66 | internal ammunition road | (104, 90) | 14 | Asphalt | 3 |
| 67 | internal ammunition road | (107, 89) | 14 | Asphalt | 3 |
| 68 | internal ammunition road | (110, 89) | 14 | Asphalt | 3 |
| 69 | internal ammunition road | (112, 88) | 14 | Asphalt | 3 |
| 70 | internal ammunition road | (115, 88) | 14 | Asphalt | 3 |
| 71 | internal ammunition road | (118, 87) | 14 | Asphalt | 3 |
| 72 | evacuation service road | (101, 90) | 14 | Asphalt | 2 |
| 73 | evacuation service road | (102, 92) | 14 | Asphalt | 2 |
| 74 | evacuation service road | (103, 95) | 14 | Asphalt | 2 |
| 75 | evacuation service road | (103, 97) | 14 | Asphalt | 2 |
| 76 | evacuation service road | (104, 100) | 14 | Asphalt | 2 |
| 77 | evacuation service road | (105, 102) | 14 | Asphalt | 2 |
| 78 | evacuation service road | (106, 105) | 14 | Asphalt | 2 |
| 79 | evacuation service road | (108, 107) | 14 | Asphalt | 2 |
| 80 | evacuation service road | (109, 110) | 14 | Asphalt | 2 |
| 81 | evacuation service road | (110, 112) | 14 | Asphalt | 2 |
| 82 | evacuation service road | (112, 114) | 14 | Asphalt | 2 |
| 83 | evacuation service road | (114, 115) | 14 | Asphalt | 2 |
| 84 | evacuation service road | (116, 117) | 14 | Asphalt | 2 |
| 85 | evacuation service road | (118, 118) | 14 | Asphalt | 2 |
| 86 | evacuation service road | (120, 117) | 14 | Asphalt | 2 |
| 87 | evacuation service road | (123, 115) | 14 | Asphalt | 2 |
| 88 | evacuation service road | (125, 114) | 14 | Asphalt | 2 |
| 89 | evacuation service road | (127, 112) | 14 | Asphalt | 2 |
| 90 | evacuation service road | (129, 111) | 14 | Asphalt | 2 |
| 91 | evacuation service road | (132, 109) | 14 | Asphalt | 2 |
| 92 | evacuation service road | (134, 108) | 14 | Asphalt | 2 |
| 93 | surviving relay spur | (91, 157) | 14 | Asphalt | 2 |
| 94 | surviving relay spur | (94, 157) | 14 | Asphalt | 2 |
| 95 | surviving relay spur | (96, 158) | 14 | Asphalt | 2 |
| 96 | surviving relay spur | (99, 158) | 14 | Asphalt | 2 |
| 97 | surviving relay spur | (102, 159) | 14 | Asphalt | 2 |
| 98 | surviving relay spur | (105, 159) | 14 | Asphalt | 2 |
| 99 | surviving relay spur | (107, 160) | 14 | Asphalt | 2 |
| 100 | surviving relay spur | (110, 160) | 14 | Asphalt | 2 |

## 6. 기존 정적 통행 기록

아래 값은 기존 빌드 기록에서 가져왔다. 원본 M01/M02의 기능 검사를 반복하지 않았다.
검사 방법: 16개 미니타일이 모두 보행 가능해야 한다. 건물 주위에 한 타일을 추가한다. 4방향 탐색으로 연결을 확인한다.
단계 수는 정적 탐색 거리다. 스타크래프트 엔진의 이동 거리, 소요 시간, 길찾기를 보장하지 않는다.

| 지표 | 기존 기록 |
| --- | --- |
| 고도별 타일 수 | 0: 35913 / 1: 951 |
| 지형 보행 제한 타일 | 1317 |
| 절벽 플래그 / 시야 차단 플래그 타일 | 0 / 0 |
| 경로 수 | 25 |

| 출발 | 도착 | 4방향 탐색 단계 |
| --- | --- | --- |
| Barracks | Armory | 36 |
| Armory | Outpost | 68 |
| Outpost | Outer | 26 |
| Outer | Inner | 32 |
| Inner | Soldiers | 24 |
| Soldiers | Evac | 34 |
| Workshop | Shelter | 20 |
| Shelter | Medical | 143 |
| Medical | Settlement | 40 |
| Settlement | Relay | 36 |
| Relay | Supply | 67 |
| Supply | Exit | 32 |
| OuterReserve | Outpost | 35 |
| OuterReserve | Outer | 43 |
| InnerReserve | Inner | 41 |
| DepotReserve | Shelter | 58 |
| MaraStart | Evac | 64 |
| WrenStart | Evac | 48 |
| Civilians | Evac | 24 |
| Evac | Shelter | 26 |
| Relay | Archive | 35 |
| Medical | Salvage | 35 |
| Relay | NorthRoute | 39 |
| Relay | SouthRoute | 33 |
| Supply | Restricted | 40 |
