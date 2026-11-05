# M01_ASTRA 노스 릿지 재설계 — SCX 실측 배치

상태: **SCX·소스 대조 완료 / 실게임 NOT RUN**. 아래 값은 패키지 안의 초기 배치를 설명한다.
런타임 배치와 지역별 제작 의도는 [M01_ASTRA 현장 명세](M01_ASTRA_FIELD.md)를 참조한다.

## 1. 규격과 근거

| 항목 | 값 |
| --- | --- |
| 대상 플레이 맵 | [M01_NORTH_RIDGE_ASTRA.scx](../../ASTRA-PROD-01/maps/M01_NORTH_RIDGE_ASTRA.scx) |
| 편집 소스 맵 | [M01_NORTH_RIDGE_ASTRA_SOURCE.scx](../../ASTRA-PROD-01/maps/M01_NORTH_RIDGE_ASTRA_SOURCE.scx) |
| 동일 배치의 비교 맵 | [M01_CONTROL_CHECK.scx](../../ASTRA-PROD-01/maps/M01_CONTROL_CHECK.scx) |
| 빌드 기록 | [기존 구조 검사 및 경로 기록](../../ASTRA-PROD-01/reports/M01_NORTH_RIDGE_ASTRA.json) |
| 지형 / 포맷 | Badlands / SCX / CHK ERA 0 / VER 206 |
| 크기 | 192×192타일 / 6144×6144px |
| 그리드 | [M01_ASTRA_MTXM.csv](M01_ASTRA_MTXM.csv) / x=열, y=행, 십진 MTXM 원시값 |
| MTXM SHA-256 (리틀엔디언 uint16) | 8f0553121eadf257e9cdc0be9641935ab38b6fabbfa3f9e4b2e275bf988b46a0 |
| ISOM SHA-256 (리틀엔디언 uint16) | 72904776490a2ac87f37d3cf2435de79580ff481d9ea6e257f51c13f3496217b |
| 플레이 SCX SHA-256 | 105fdd47b0f5014e1bdd875aa56c991e95efca41ab685bbde04bf658fa79756c |
| UNIT / 명명 MRGN / DD2 / THG2 | 114 / 52 / 0 / 0 |
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
| 1 | Barracks | 28, 120, 52, 144 | 896, 3840, 1664, 4608 | (1280, 4224) | 0 |
| 2 | Armory | 54, 116, 70, 130 | 1728, 3712, 2240, 4160 | (1984, 3936) | 0 |
| 3 | Outpost | 32, 42, 48, 58 | 1024, 1344, 1536, 1856 | (1280, 1600) | 0 |
| 4 | Outer | 50, 60, 70, 76 | 1600, 1920, 2240, 2432 | (1920, 2176) | 0 |
| 5 | Inner | 70, 82, 90, 98 | 2240, 2624, 2880, 3136 | (2560, 2880) | 0 |
| 6 | MaraStart | 68, 70, 76, 78 | 2176, 2240, 2432, 2496 | (2304, 2368) | 0 |
| 7 | Workshop | 104, 94, 124, 114 | 3328, 3008, 3968, 3648 | (3648, 3328) | 0 |
| 8 | WrenStart | 112, 98, 120, 106 | 3584, 3136, 3840, 3392 | (3712, 3264) | 0 |
| 9 | Soldiers | 90, 100, 102, 114 | 2880, 3200, 3264, 3648 | (3072, 3424) | 0 |
| 10 | Civilians | 126, 128, 142, 144 | 4032, 4096, 4544, 4608 | (4288, 4352) | 0 |
| 11 | EllaStart | 130, 132, 138, 140 | 4160, 4224, 4416, 4480 | (4288, 4352) | 0 |
| 12 | Evac | 136, 104, 152, 120 | 4352, 3328, 4864, 3840 | (4608, 3584) | 0 |
| 13 | Inbound | 166, 103, 180, 117 | 5312, 3296, 5760, 3744 | (5536, 3520) | 0 |
| 14 | Crash | 155, 96, 165, 106 | 4960, 3072, 5280, 3392 | (5120, 3232) | 0 |
| 15 | Ammo | 112, 72, 128, 84 | 3584, 2304, 4096, 2688 | (3840, 2496) | 0 |
| 16 | Shelter | 110, 120, 122, 132 | 3520, 3840, 3904, 4224 | (3712, 4032) | 0 |
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
| 27 | OuterReserve | 28, 20, 40, 32 | 896, 640, 1280, 1024 | (1088, 832) | 0 |
| 28 | InnerReserve | 88, 40, 100, 52 | 2816, 1280, 3200, 1664 | (3008, 1472) | 0 |
| 29 | DepotReserve | 145, 52, 159, 64 | 4640, 1664, 5088, 2048 | (4864, 1856) | 0 |
| 30 | SettlementFight | 60, 148, 78, 168 | 1920, 4736, 2496, 5376 | (2208, 5056) | 0 |
| 31 | RelayFight | 94, 148, 112, 170 | 3008, 4736, 3584, 5440 | (3296, 5088) | 0 |
| 32 | SupplyFight | 142, 138, 168, 162 | 4544, 4416, 5376, 5184 | (4960, 4800) | 0 |
| 33 | RestrictedFight | 126, 162, 146, 182 | 4032, 5184, 4672, 5824 | (4352, 5504) | 0 |
| 34 | Focus | 2, 2, 4, 4 | 64, 64, 128, 128 | (96, 96) | 0 |
| 35 | Command | 76, 108, 92, 124 | 2432, 3456, 2944, 3968 | (2688, 3712) | 0 |
| 36 | MotorPool | 126, 88, 142, 102 | 4032, 2816, 4544, 3264 | (4288, 3040) | 0 |
| 37 | Artillery | 86, 74, 102, 86 | 2752, 2368, 3264, 2752 | (3008, 2560) | 0 |
| 38 | CargoWest | 52, 102, 60, 110 | 1664, 3264, 1920, 3520 | (1792, 3392) | 0 |
| 39 | CargoEast | 126, 116, 134, 124 | 4032, 3712, 4288, 3968 | (4160, 3840) | 0 |
| 40 | PatrolWest | 34, 74, 42, 82 | 1088, 2368, 1344, 2624 | (1216, 2496) | 0 |
| 41 | PatrolEast | 54, 86, 62, 94 | 1728, 2752, 1984, 3008 | (1856, 2880) | 0 |
| 42 | ScoutReserve | 20, 28, 28, 36 | 640, 896, 896, 1152 | (768, 1024) | 0 |
| 43 | ScoutContact | 28, 36, 36, 44 | 896, 1152, 1152, 1408 | (1024, 1280) | 0 |
| 44 | CivilSafe | 142, 130, 150, 138 | 4544, 4160, 4800, 4416 | (4672, 4288) | 0 |
| 45 | RefugeEntry | 106, 128, 114, 136 | 3392, 4096, 3648, 4352 | (3520, 4224) | 0 |
| 46 | RelayReserve | 117, 183, 123, 189 | 3744, 5856, 3936, 6048 | (3840, 5952) | 0 |
| 47 | SupplyReserve | 172, 173, 180, 181 | 5504, 5536, 5760, 5792 | (5632, 5664) | 0 |
| 48 | SettlementReserve | 76, 158, 84, 166 | 2432, 5056, 2688, 5312 | (2560, 5184) | 0 |
| 49 | RestrictedReserve | 169, 169, 175, 175 | 5408, 5408, 5600, 5600 | (5504, 5504) | 0 |
| 50 | TourHQ | 76, 108, 92, 124 | 2432, 3456, 2944, 3968 | (2688, 3712) | 0 |
| 51 | TourIndustry | 104, 94, 142, 114 | 3328, 3008, 4544, 3648 | (3936, 3328) | 0 |
| 52 | TourDefence | 50, 60, 70, 76 | 1600, 1920, 2240, 2432 | (1920, 2176) | 0 |

기본 Anywhere는 위 명명 위치 수에서 제외한다.

## 4. 모든 초기 UNIT 레코드

픽셀은 배치 중심이다. 타일 칸은 픽셀에 32를 나누고 내림한 값이다. HP의 —는 개별 지정 없음이다.
건물 여유는 중심과 크기로 계산한다. 좌상단 = floor(중심 px / 32 − 크기 / 2).
시작 위치 마커와 비콘도 누락 없이 포함한다. 시작 위치 마커는 전투 개체가 아니다.

| 일련번호 | 소스 ID | 엔진 종류 / ID | 소유자 | 중심 px | 중심 타일 칸 | HP % | 건물 여유(타일) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | start | Start Location / 214 | P1 | (1280, 4224) | (40, 132) | — | — |
| 2 | hero | Jim Raynor (Marine) / 20 | P1 | (1280, 4224) | (40, 132) | — | — |
| 3 | mara | Gui Montag (Firebat) / 10 | P3 | (2304, 2368) | (72, 74) | — | — |
| 4 | wren | Terran SCV / 7 | P3 | (3712, 3264) | (116, 102) | — | — |
| 5 | ella | Terran Civilian / 15 | P4 | (4288, 4352) | (134, 136) | — | — |
| 6 | barracks | Terran Barracks / 111 | P3 | (1472, 4000) | (46, 125) | — | 4×3 |
| 7 | quarters-academy | Terran Academy / 112 | P3 | (1056, 4000) | (33, 125) | — | 3×2 |
| 8 | quarters-store | Terran Supply Depot / 109 | P3 | (1088, 4448) | (34, 139) | — | 3×2 |
| 9 | command | Terran Command Center / 106 | P3 | (2688, 3584) | (84, 112) | — | 4×3 |
| 10 | command-radio | Terran Comsat Station / 107 | P3 | (2848, 3584) | (89, 112) | — | 2×2 |
| 11 | armory | Terran Armory / 123 | P3 | (2080, 3808) | (65, 119) | — | 3×2 |
| 12 | sensor | Terran Missile Turret / 124 | P3 | (1152, 1472) | (36, 46) | — | 2×2 |
| 13 | outpost-store | Terran Supply Depot / 109 | P3 | (1408, 1472) | (44, 46) | — | 3×2 |
| 14 | outer-bunker | Terran Bunker / 125 | P3 | (1824, 2048) | (57, 64) | — | 3×2 |
| 15 | outer-east-bunker | Terran Bunker / 125 | P3 | (2112, 2080) | (66, 65) | — | 3×2 |
| 16 | inner-bunker | Terran Bunker / 125 | P3 | (2432, 2752) | (76, 86) | — | 3×2 |
| 17 | inner-east-bunker | Terran Bunker / 125 | P3 | (2752, 2752) | (86, 86) | — | 3×2 |
| 18 | workshop | Terran Factory / 113 | P3 | (3520, 3104) | (110, 97) | — | 4×3 |
| 19 | motor-armory | Terran Armory / 123 | P3 | (4352, 2912) | (136, 91) | — | 3×2 |
| 20 | motor-depot | Terran Supply Depot / 109 | P3 | (4160, 3136) | (130, 98) | — | 3×2 |
| 21 | ammo-depot | Terran Supply Depot / 109 | P3 | (3840, 2400) | (120, 75) | — | 3×2 |
| 22 | ammo-secondary | Terran Supply Depot / 109 | P3 | (4032, 2432) | (126, 76) | — | 3×2 |
| 23 | ammo-control | Terran Missile Turret / 124 | P3 | (3616, 2432) | (113, 76) | — | 2×2 |
| 24 | landing-control | Terran Missile Turret / 124 | P3 | (4768, 3392) | (149, 106) | — | 2×2 |
| 25 | landing-store | Terran Supply Depot / 109 | P3 | (4416, 3776) | (138, 118) | — | 3×2 |
| 26 | hospital | Terran Academy / 112 | P3 | (800, 5088) | (25, 159) | — | 3×2 |
| 27 | refuge-clinic | Terran Academy / 112 | P3 | (4448, 4480) | (139, 140) | — | 3×2 |
| 28 | civil-house-a | Terran Supply Depot / 109 | P3 | (4096, 4160) | (128, 130) | — | 3×2 |
| 29 | civil-house-b | Terran Supply Depot / 109 | P3 | (4512, 4192) | (141, 131) | — | 3×2 |
| 30 | shelter-access | Terran Academy / 112 | P3 | (3552, 3968) | (111, 124) | — | 3×2 |
| 31 | relay | Terran Engineering Bay / 122 | P3 | (3392, 5120) | (106, 160) | — | 4×3 |
| 32 | relay-backup | Terran Supply Depot / 109 | P3 | (3008, 5312) | (94, 166) | — | 3×2 |
| 33 | supply | Terran Supply Depot / 109 | P3 | (5184, 4960) | (162, 155) | — | 3×2 |
| 34 | supply-command | Terran Command Center / 106 | P3 | (5216, 4640) | (163, 145) | — | 4×3 |
| 35 | archive | Terran Comsat Station / 107 | P3 | (3008, 4320) | (94, 135) | — | 2×2 |
| 36 | restricted | Terran Armory / 123 | P3 | (4544, 5472) | (142, 171) | — | 3×2 |
| 37 | logistics-store-0 | Terran Supply Depot / 109 | P3 | (1664, 3488) | (52, 109) | — | 3×2 |
| 38 | logistics-store-1 | Terran Supply Depot / 109 | P3 | (1920, 3488) | (60, 109) | — | 3×2 |
| 39 | logistics-store-2 | Terran Supply Depot / 109 | P3 | (3328, 3456) | (104, 108) | — | 3×2 |
| 40 | logistics-store-3 | Terran Supply Depot / 109 | P3 | (3904, 3776) | (122, 118) | — | 3×2 |
| 41 | logistics-store-4 | Terran Supply Depot / 109 | P3 | (4064, 3936) | (127, 123) | — | 3×2 |
| 42 | logistics-store-5 | Terran Supply Depot / 109 | P3 | (4864, 5056) | (152, 158) | — | 3×2 |
| 43 | perimeter-sensor-0 | Terran Missile Turret / 124 | P3 | (896, 2592) | (28, 81) | — | 2×2 |
| 44 | perimeter-sensor-1 | Terran Missile Turret / 124 | P3 | (960, 2816) | (30, 88) | — | 2×2 |
| 45 | perimeter-sensor-2 | Terran Missile Turret / 124 | P3 | (2272, 2016) | (71, 63) | — | 2×2 |
| 46 | perimeter-sensor-3 | Terran Missile Turret / 124 | P3 | (2944, 2656) | (92, 83) | — | 2×2 |
| 47 | outer-guard-0 | Terran Marine / 0 | P3 | (1696, 2176) | (53, 68) | — | — |
| 48 | outer-guard-1 | Terran Marine / 0 | P3 | (1760, 2272) | (55, 71) | — | — |
| 49 | outer-guard-2 | Terran Marine / 0 | P3 | (2048, 2208) | (64, 69) | — | — |
| 50 | outer-guard-3 | Terran Marine / 0 | P3 | (2144, 2304) | (67, 72) | — | — |
| 51 | outer-guard-4 | Terran Marine / 0 | P3 | (1856, 1920) | (58, 60) | — | — |
| 52 | outer-guard-5 | Terran Marine / 0 | P3 | (2016, 1952) | (63, 61) | — | — |
| 53 | inner-guard-0 | Terran Marine / 0 | P3 | (2336, 2880) | (73, 90) | — | — |
| 54 | inner-guard-1 | Terran Marine / 0 | P3 | (2400, 3008) | (75, 94) | — | — |
| 55 | inner-guard-2 | Terran Marine / 0 | P3 | (2656, 2880) | (83, 90) | — | — |
| 56 | inner-guard-3 | Terran Marine / 0 | P3 | (2784, 3008) | (87, 94) | — | — |
| 57 | inner-guard-4 | Terran Marine / 0 | P3 | (2528, 2624) | (79, 82) | — | — |
| 58 | inner-guard-5 | Terran Marine / 0 | P3 | (2752, 2592) | (86, 81) | — | — |
| 59 | outpost-guard-0 | Terran Marine / 0 | P3 | (1216, 1536) | (38, 48) | — | — |
| 60 | outpost-guard-1 | Terran Marine / 0 | P3 | (1408, 1632) | (44, 51) | — | — |
| 61 | quarters-guard-0 | Terran Marine / 0 | P3 | (1376, 4160) | (43, 130) | — | — |
| 62 | quarters-guard-1 | Terran Marine / 0 | P3 | (1504, 4384) | (47, 137) | — | — |
| 63 | quarters-guard-2 | Terran Marine / 0 | P3 | (1120, 4288) | (35, 134) | — | — |
| 64 | command-guard-0 | Terran Marine / 0 | P3 | (2560, 3648) | (80, 114) | — | — |
| 65 | command-guard-1 | Terran Marine / 0 | P3 | (2816, 3744) | (88, 117) | — | — |
| 66 | landing-guard-0 | Terran Marine / 0 | P3 | (4448, 3520) | (139, 110) | — | — |
| 67 | landing-guard-1 | Terran Marine / 0 | P3 | (4704, 3680) | (147, 115) | — | — |
| 68 | patrol-west | Terran Marine / 0 | P3 | (1216, 2496) | (38, 78) | — | — |
| 69 | patrol-east | Terran Marine / 0 | P3 | (1856, 2880) | (58, 90) | — | — |
| 70 | repair-west | Terran SCV / 7 | P3 | (3424, 3264) | (107, 102) | — | — |
| 71 | repair-east | Terran SCV / 7 | P3 | (3872, 3392) | (121, 106) | — | — |
| 72 | cargo-vulture | Terran Vulture / 2 | P3 | (1792, 3392) | (56, 106) | — | — |
| 73 | motor-goliath | Terran Goliath / 3 | P3 | (4288, 3072) | (134, 96) | — | — |
| 74 | artillery-a | Terran Siege Tank (Tank Mode) / 5 | P3 | (2912, 2496) | (91, 78) | — | — |
| 75 | artillery-b | Terran Siege Tank (Tank Mode) / 5 | P3 | (3136, 2592) | (98, 81) | — | — |
| 76 | dropship | Terran Dropship / 11 | P3 | (5536, 3520) | (173, 110) | — | — |
| 77 | rescue-soldier-0 | Terran Marine / 0 | P5 | (3008, 3360) | (94, 105) | — | — |
| 78 | rescue-soldier-1 | Terran Marine / 0 | P5 | (3168, 3488) | (99, 109) | — | — |
| 79 | rescue-soldier-2 | Terran Marine / 0 | P5 | (3008, 3552) | (94, 111) | — | — |
| 80 | civilian-0 | Terran Civilian / 15 | P4 | (4160, 4320) | (130, 135) | — | — |
| 81 | civilian-1 | Terran Civilian / 15 | P4 | (4416, 4288) | (138, 134) | — | — |
| 82 | civilian-2 | Terran Civilian / 15 | P4 | (4224, 4448) | (132, 139) | — | — |
| 83 | civilian-3 | Terran Civilian / 15 | P4 | (4352, 4512) | (136, 141) | — | — |
| 84 | civilian-4 | Terran Civilian / 15 | P4 | (4128, 4544) | (129, 142) | — | — |
| 85 | beacon-Armory | Terran Beacon / 195 | P12 | (1984, 3936) | (62, 123) | — | — |
| 86 | beacon-Outpost | Terran Beacon / 195 | P12 | (1280, 1600) | (40, 50) | — | — |
| 87 | beacon-MaraStart | Terran Beacon / 195 | P12 | (2304, 2368) | (72, 74) | — | — |
| 88 | beacon-WrenStart | Terran Beacon / 195 | P12 | (3712, 3264) | (116, 102) | — | — |
| 89 | beacon-Soldiers | Terran Beacon / 195 | P12 | (3072, 3424) | (96, 107) | — | — |
| 90 | beacon-Civilians | Terran Beacon / 195 | P12 | (4288, 4352) | (134, 136) | — | — |
| 91 | beacon-Workshop | Terran Beacon / 195 | P12 | (3648, 3328) | (114, 104) | — | — |
| 92 | beacon-Evac | Terran Beacon / 195 | P12 | (4608, 3584) | (144, 112) | — | — |
| 93 | beacon-Shelter | Terran Beacon / 195 | P12 | (3712, 4032) | (116, 126) | — | — |
| 94 | beacon-Medical | Terran Beacon / 195 | P12 | (960, 5280) | (30, 165) | — | — |
| 95 | beacon-Settlement | Terran Beacon / 195 | P12 | (2112, 5152) | (66, 161) | — | — |
| 96 | beacon-Relay | Terran Beacon / 195 | P12 | (3200, 5216) | (100, 163) | — | — |
| 97 | beacon-Supply | Terran Beacon / 195 | P12 | (4992, 4864) | (156, 152) | — | — |
| 98 | beacon-Archive | Terran Beacon / 195 | P12 | (2880, 4416) | (90, 138) | — | — |
| 99 | beacon-Salvage | Terran Beacon / 195 | P12 | (1600, 5760) | (50, 180) | — | — |
| 100 | beacon-Restricted | Terran Beacon / 195 | P12 | (4352, 5504) | (136, 172) | — | — |
| 101 | beacon-NorthRoute | Terran Beacon / 195 | P12 | (2496, 4672) | (78, 146) | — | — |
| 102 | beacon-SouthRoute | Terran Beacon / 195 | P12 | (2624, 5696) | (82, 178) | — | — |
| 103 | beacon-Exit | Terran Beacon / 195 | P12 | (5344, 4192) | (167, 131) | — | — |
| 104 | beacon-Command | Terran Beacon / 195 | P12 | (2688, 3712) | (84, 116) | — | — |
| 105 | friendly-vision-0 | Map Revealer / 101 | P1 | (1312, 4256) | (41, 133) | — | — |
| 106 | friendly-vision-1 | Map Revealer / 101 | P1 | (1984, 3936) | (62, 123) | — | — |
| 107 | friendly-vision-2 | Map Revealer / 101 | P1 | (2688, 3712) | (84, 116) | — | — |
| 108 | friendly-vision-3 | Map Revealer / 101 | P1 | (3648, 3328) | (114, 104) | — | — |
| 109 | friendly-vision-4 | Map Revealer / 101 | P1 | (4288, 4352) | (134, 136) | — | — |
| 110 | friendly-vision-5 | Map Revealer / 101 | P1 | (4608, 3584) | (144, 112) | — | — |
| 111 | friendly-vision-6 | Map Revealer / 101 | P1 | (2560, 2880) | (80, 90) | — | — |
| 112 | friendly-vision-7 | Map Revealer / 101 | P1 | (1920, 2176) | (60, 68) | — | — |
| 113 | friendly-vision-8 | Map Revealer / 101 | P1 | (1280, 1600) | (40, 50) | — | — |
| 114 | friendly-vision-9 | Map Revealer / 101 | P1 | (3840, 2496) | (120, 78) | — | — |

## 5. 지형 도색 순서

시드 172, 기반 CV5 지형 2(Dirt)에서 시작한다. 표 순서대로 전환 브러시를 적용한다.
중심 좌표는 타일 단위다. extent는 브러시 인수다. 도색 결과의 직사각형 폭을 뜻하지 않는다.
최종 지형의 모든 셀은 MTXM CSV를 참조한다. 브러시 ID는 CV5 지형 종류다. 저장된 ISOM 값과 개별 MTXM 값은 별도다.

| 순서 | 지형 항목 | 중심 타일 | CV5 지형 ID | 지형 | extent |
| --- | --- | --- | --- | --- | --- |
| 1 | West observation ridge | (15, 50) | 3 | High Dirt | 12 |
| 2 | North ravine lip | (66, 24) | 3 | High Dirt | 14 |
| 3 | Northeast ridge | (121, 30) | 3 | High Dirt | 14 |
| 4 | Eastern escarpment | (177, 67) | 3 | High Dirt | 13 |
| 5 | Northern attack divider | (79, 55) | 3 | High Dirt | 6 |
| 6 | Eastern approach divider | (104, 65) | 3 | High Dirt | 6 |
| 7 | Western basin | (14, 111) | 5 | Water | 10 |
| 8 | Eastern drainage | (172, 88) | 5 | Water | 7 |
| 9 | Southern floodplain | (103, 185) | 5 | Water | 4 |
| 10 | Southern rock | (18, 185) | 3 | High Dirt | 5 |
| 11 | Quarters grove | (27, 133) | 6 | Grass | 5 |
| 12 | Civilian green | (151, 138) | 6 | Grass | 3 |
| 13 | Western scrub | (23, 72) | 6 | Grass | 4 |
| 14 | Northern worn ground | (42, 34) | 15 | Rocky Ground | 4 |
| 15 | Outer gun apron | (60, 68) | 14 | Asphalt | 9 |
| 16 | Inner gun apron | (80, 90) | 14 | Asphalt | 8 |
| 17 | Command yard | (84, 116) | 14 | Asphalt | 8 |
| 18 | Barracks yard | (40, 132) | 14 | Asphalt | 10 |
| 19 | Armory apron | (62, 123) | 14 | Asphalt | 6 |
| 20 | Industry apron | (114, 104) | 14 | Asphalt | 10 |
| 21 | Motor pool | (134, 95) | 14 | Asphalt | 7 |
| 22 | Ammunition court | (120, 78) | 14 | Asphalt | 7 |
| 23 | Landing hardstand | (144, 112) | 14 | Asphalt | 9 |
| 24 | Civil settlement | (134, 136) | 14 | Asphalt | 9 |
| 25 | Medical court | (30, 165) | 14 | Asphalt | 7 |
| 26 | Relay court | (100, 163) | 14 | Asphalt | 9 |
| 27 | Reserve supply | (156, 152) | 14 | Asphalt | 10 |
| 28 | Shelter court | (116, 126) | 14 | Asphalt | 7 |
| 29 | Restricted platform | (136, 172) | 14 | Asphalt | 7 |
| 30 | Archive platform | (90, 138) | 14 | Asphalt | 6 |
| 31 | Abandoned residential | (66, 161) | 4 | Mud | 7 |
| 32 | Salvage rubble | (50, 180) | 15 | Rocky Ground | 6 |
| 33 | North route dirt | (78, 146) | 15 | Rocky Ground | 4 |
| 34 | Main logistics | (40, 132) | 14 | Asphalt | 3 |
| 35 | Main logistics | (43, 131) | 14 | Asphalt | 3 |
| 36 | Main logistics | (46, 130) | 14 | Asphalt | 3 |
| 37 | Main logistics | (48, 129) | 14 | Asphalt | 3 |
| 38 | Main logistics | (51, 128) | 14 | Asphalt | 3 |
| 39 | Main logistics | (54, 126) | 14 | Asphalt | 3 |
| 40 | Main logistics | (57, 125) | 14 | Asphalt | 3 |
| 41 | Main logistics | (59, 124) | 14 | Asphalt | 3 |
| 42 | Main logistics | (62, 123) | 14 | Asphalt | 3 |
| 43 | Main logistics | (62, 123) | 14 | Asphalt | 3 |
| 44 | Main logistics | (65, 122) | 14 | Asphalt | 3 |
| 45 | Main logistics | (68, 121) | 14 | Asphalt | 3 |
| 46 | Main logistics | (70, 120) | 14 | Asphalt | 3 |
| 47 | Main logistics | (73, 120) | 14 | Asphalt | 3 |
| 48 | Main logistics | (76, 119) | 14 | Asphalt | 3 |
| 49 | Main logistics | (79, 118) | 14 | Asphalt | 3 |
| 50 | Main logistics | (81, 117) | 14 | Asphalt | 3 |
| 51 | Main logistics | (84, 116) | 14 | Asphalt | 3 |
| 52 | Main logistics | (84, 116) | 14 | Asphalt | 3 |
| 53 | Main logistics | (87, 116) | 14 | Asphalt | 3 |
| 54 | Main logistics | (90, 116) | 14 | Asphalt | 3 |
| 55 | Main logistics | (92, 117) | 14 | Asphalt | 3 |
| 56 | Main logistics | (95, 117) | 14 | Asphalt | 3 |
| 57 | Main logistics | (98, 117) | 14 | Asphalt | 3 |
| 58 | Main logistics | (98, 117) | 14 | Asphalt | 3 |
| 59 | Main logistics | (100, 115) | 14 | Asphalt | 3 |
| 60 | Main logistics | (103, 113) | 14 | Asphalt | 3 |
| 61 | Main logistics | (105, 111) | 14 | Asphalt | 3 |
| 62 | Main logistics | (107, 110) | 14 | Asphalt | 3 |
| 63 | Main logistics | (109, 108) | 14 | Asphalt | 3 |
| 64 | Main logistics | (112, 106) | 14 | Asphalt | 3 |
| 65 | Main logistics | (114, 104) | 14 | Asphalt | 3 |
| 66 | Main logistics | (114, 104) | 14 | Asphalt | 3 |
| 67 | Main logistics | (117, 105) | 14 | Asphalt | 3 |
| 68 | Main logistics | (119, 105) | 14 | Asphalt | 3 |
| 69 | Main logistics | (122, 106) | 14 | Asphalt | 3 |
| 70 | Main logistics | (125, 107) | 14 | Asphalt | 3 |
| 71 | Main logistics | (128, 108) | 14 | Asphalt | 3 |
| 72 | Main logistics | (130, 108) | 14 | Asphalt | 3 |
| 73 | Main logistics | (133, 109) | 14 | Asphalt | 3 |
| 74 | Main logistics | (136, 110) | 14 | Asphalt | 3 |
| 75 | Main logistics | (139, 111) | 14 | Asphalt | 3 |
| 76 | Main logistics | (141, 111) | 14 | Asphalt | 3 |
| 77 | Main logistics | (144, 112) | 14 | Asphalt | 3 |
| 78 | Northern duty | (40, 132) | 14 | Asphalt | 2 |
| 79 | Northern duty | (40, 129) | 14 | Asphalt | 2 |
| 80 | Northern duty | (40, 127) | 14 | Asphalt | 2 |
| 81 | Northern duty | (39, 124) | 14 | Asphalt | 2 |
| 82 | Northern duty | (39, 122) | 14 | Asphalt | 2 |
| 83 | Northern duty | (39, 119) | 14 | Asphalt | 2 |
| 84 | Northern duty | (39, 116) | 14 | Asphalt | 2 |
| 85 | Northern duty | (38, 114) | 14 | Asphalt | 2 |
| 86 | Northern duty | (38, 111) | 14 | Asphalt | 2 |
| 87 | Northern duty | (38, 111) | 14 | Asphalt | 2 |
| 88 | Northern duty | (38, 108) | 14 | Asphalt | 2 |
| 89 | Northern duty | (38, 105) | 14 | Asphalt | 2 |
| 90 | Northern duty | (38, 102) | 14 | Asphalt | 2 |
| 91 | Northern duty | (38, 99) | 14 | Asphalt | 2 |
| 92 | Northern duty | (38, 96) | 14 | Asphalt | 2 |
| 93 | Northern duty | (38, 93) | 14 | Asphalt | 2 |
| 94 | Northern duty | (38, 90) | 14 | Asphalt | 2 |
| 95 | Northern duty | (38, 87) | 14 | Asphalt | 2 |
| 96 | Northern duty | (38, 84) | 14 | Asphalt | 2 |
| 97 | Northern duty | (38, 81) | 14 | Asphalt | 2 |
| 98 | Northern duty | (38, 78) | 14 | Asphalt | 2 |
| 99 | Northern duty | (38, 78) | 14 | Asphalt | 2 |
| 100 | Northern duty | (38, 75) | 14 | Asphalt | 2 |
| 101 | Northern duty | (38, 72) | 14 | Asphalt | 2 |
| 102 | Northern duty | (39, 70) | 14 | Asphalt | 2 |
| 103 | Northern duty | (39, 67) | 14 | Asphalt | 2 |
| 104 | Northern duty | (39, 64) | 14 | Asphalt | 2 |
| 105 | Northern duty | (39, 61) | 14 | Asphalt | 2 |
| 106 | Northern duty | (39, 58) | 14 | Asphalt | 2 |
| 107 | Northern duty | (40, 56) | 14 | Asphalt | 2 |
| 108 | Northern duty | (40, 53) | 14 | Asphalt | 2 |
| 109 | Northern duty | (40, 50) | 14 | Asphalt | 2 |
| 110 | Perimeter withdrawal | (40, 50) | 14 | Asphalt | 3 |
| 111 | Perimeter withdrawal | (42, 52) | 14 | Asphalt | 3 |
| 112 | Perimeter withdrawal | (43, 54) | 14 | Asphalt | 3 |
| 113 | Perimeter withdrawal | (45, 56) | 14 | Asphalt | 3 |
| 114 | Perimeter withdrawal | (46, 58) | 14 | Asphalt | 3 |
| 115 | Perimeter withdrawal | (48, 60) | 14 | Asphalt | 3 |
| 116 | Perimeter withdrawal | (48, 60) | 14 | Asphalt | 3 |
| 117 | Perimeter withdrawal | (50, 62) | 14 | Asphalt | 3 |
| 118 | Perimeter withdrawal | (53, 63) | 14 | Asphalt | 3 |
| 119 | Perimeter withdrawal | (55, 65) | 14 | Asphalt | 3 |
| 120 | Perimeter withdrawal | (58, 66) | 14 | Asphalt | 3 |
| 121 | Perimeter withdrawal | (60, 68) | 14 | Asphalt | 3 |
| 122 | Perimeter withdrawal | (60, 68) | 14 | Asphalt | 3 |
| 123 | Perimeter withdrawal | (62, 70) | 14 | Asphalt | 3 |
| 124 | Perimeter withdrawal | (64, 72) | 14 | Asphalt | 3 |
| 125 | Perimeter withdrawal | (65, 74) | 14 | Asphalt | 3 |
| 126 | Perimeter withdrawal | (67, 76) | 14 | Asphalt | 3 |
| 127 | Perimeter withdrawal | (69, 78) | 14 | Asphalt | 3 |
| 128 | Perimeter withdrawal | (69, 78) | 14 | Asphalt | 3 |
| 129 | Perimeter withdrawal | (71, 80) | 14 | Asphalt | 3 |
| 130 | Perimeter withdrawal | (73, 82) | 14 | Asphalt | 3 |
| 131 | Perimeter withdrawal | (75, 84) | 14 | Asphalt | 3 |
| 132 | Perimeter withdrawal | (76, 86) | 14 | Asphalt | 3 |
| 133 | Perimeter withdrawal | (78, 88) | 14 | Asphalt | 3 |
| 134 | Perimeter withdrawal | (80, 90) | 14 | Asphalt | 3 |
| 135 | Perimeter withdrawal | (80, 90) | 14 | Asphalt | 3 |
| 136 | Perimeter withdrawal | (82, 92) | 14 | Asphalt | 3 |
| 137 | Perimeter withdrawal | (84, 94) | 14 | Asphalt | 3 |
| 138 | Perimeter withdrawal | (86, 96) | 14 | Asphalt | 3 |
| 139 | Perimeter withdrawal | (88, 99) | 14 | Asphalt | 3 |
| 140 | Perimeter withdrawal | (90, 101) | 14 | Asphalt | 3 |
| 141 | Perimeter withdrawal | (92, 103) | 14 | Asphalt | 3 |
| 142 | Perimeter withdrawal | (94, 105) | 14 | Asphalt | 3 |
| 143 | Perimeter withdrawal | (96, 107) | 14 | Asphalt | 3 |
| 144 | Perimeter withdrawal | (96, 107) | 14 | Asphalt | 3 |
| 145 | Perimeter withdrawal | (98, 109) | 14 | Asphalt | 3 |
| 146 | Perimeter withdrawal | (100, 111) | 14 | Asphalt | 3 |
| 147 | Perimeter withdrawal | (102, 113) | 14 | Asphalt | 3 |
| 148 | Perimeter withdrawal | (104, 115) | 14 | Asphalt | 3 |
| 149 | Perimeter withdrawal | (106, 117) | 14 | Asphalt | 3 |
| 150 | Perimeter withdrawal | (108, 118) | 14 | Asphalt | 3 |
| 151 | Perimeter withdrawal | (110, 120) | 14 | Asphalt | 3 |
| 152 | Perimeter withdrawal | (112, 122) | 14 | Asphalt | 3 |
| 153 | Perimeter withdrawal | (114, 124) | 14 | Asphalt | 3 |
| 154 | Perimeter withdrawal | (116, 126) | 14 | Asphalt | 3 |
| 155 | Perimeter withdrawal | (116, 126) | 14 | Asphalt | 3 |
| 156 | Perimeter withdrawal | (119, 125) | 14 | Asphalt | 3 |
| 157 | Perimeter withdrawal | (121, 123) | 14 | Asphalt | 3 |
| 158 | Perimeter withdrawal | (124, 122) | 14 | Asphalt | 3 |
| 159 | Perimeter withdrawal | (126, 121) | 14 | Asphalt | 3 |
| 160 | Perimeter withdrawal | (129, 120) | 14 | Asphalt | 3 |
| 161 | Perimeter withdrawal | (131, 118) | 14 | Asphalt | 3 |
| 162 | Perimeter withdrawal | (134, 117) | 14 | Asphalt | 3 |
| 163 | Perimeter withdrawal | (136, 116) | 14 | Asphalt | 3 |
| 164 | Perimeter withdrawal | (139, 115) | 14 | Asphalt | 3 |
| 165 | Perimeter withdrawal | (141, 113) | 14 | Asphalt | 3 |
| 166 | Perimeter withdrawal | (144, 112) | 14 | Asphalt | 3 |
| 167 | Industrial service | (80, 90) | 14 | Asphalt | 3 |
| 168 | Industrial service | (83, 90) | 14 | Asphalt | 3 |
| 169 | Industrial service | (86, 90) | 14 | Asphalt | 3 |
| 170 | Industrial service | (88, 89) | 14 | Asphalt | 3 |
| 171 | Industrial service | (91, 89) | 14 | Asphalt | 3 |
| 172 | Industrial service | (94, 89) | 14 | Asphalt | 3 |
| 173 | Industrial service | (94, 89) | 14 | Asphalt | 3 |
| 174 | Industrial service | (96, 91) | 14 | Asphalt | 3 |
| 175 | Industrial service | (98, 92) | 14 | Asphalt | 3 |
| 176 | Industrial service | (101, 94) | 14 | Asphalt | 3 |
| 177 | Industrial service | (103, 96) | 14 | Asphalt | 3 |
| 178 | Industrial service | (105, 97) | 14 | Asphalt | 3 |
| 179 | Industrial service | (107, 99) | 14 | Asphalt | 3 |
| 180 | Industrial service | (110, 101) | 14 | Asphalt | 3 |
| 181 | Industrial service | (112, 102) | 14 | Asphalt | 3 |
| 182 | Industrial service | (114, 104) | 14 | Asphalt | 3 |
| 183 | Industrial service | (114, 104) | 14 | Asphalt | 3 |
| 184 | Industrial service | (117, 103) | 14 | Asphalt | 3 |
| 185 | Industrial service | (119, 102) | 14 | Asphalt | 3 |
| 186 | Industrial service | (122, 101) | 14 | Asphalt | 3 |
| 187 | Industrial service | (124, 100) | 14 | Asphalt | 3 |
| 188 | Industrial service | (127, 98) | 14 | Asphalt | 3 |
| 189 | Industrial service | (129, 97) | 14 | Asphalt | 3 |
| 190 | Industrial service | (132, 96) | 14 | Asphalt | 3 |
| 191 | Industrial service | (134, 95) | 14 | Asphalt | 3 |
| 192 | Ammunition supply | (114, 104) | 14 | Asphalt | 2 |
| 193 | Ammunition supply | (115, 102) | 14 | Asphalt | 2 |
| 194 | Ammunition supply | (116, 99) | 14 | Asphalt | 2 |
| 195 | Ammunition supply | (118, 97) | 14 | Asphalt | 2 |
| 196 | Ammunition supply | (119, 94) | 14 | Asphalt | 2 |
| 197 | Ammunition supply | (120, 92) | 14 | Asphalt | 2 |
| 198 | Ammunition supply | (120, 92) | 14 | Asphalt | 2 |
| 199 | Ammunition supply | (120, 89) | 14 | Asphalt | 2 |
| 200 | Ammunition supply | (120, 86) | 14 | Asphalt | 2 |
| 201 | Ammunition supply | (120, 84) | 14 | Asphalt | 2 |
| 202 | Ammunition supply | (120, 81) | 14 | Asphalt | 2 |
| 203 | Ammunition supply | (120, 78) | 14 | Asphalt | 2 |
| 204 | Civilian evacuation | (134, 136) | 14 | Asphalt | 3 |
| 205 | Civilian evacuation | (136, 136) | 14 | Asphalt | 3 |
| 206 | Civilian evacuation | (139, 135) | 14 | Asphalt | 3 |
| 207 | Civilian evacuation | (141, 135) | 14 | Asphalt | 3 |
| 208 | Civilian evacuation | (144, 134) | 14 | Asphalt | 3 |
| 209 | Civilian evacuation | (146, 134) | 14 | Asphalt | 3 |
| 210 | Civilian evacuation | (146, 134) | 14 | Asphalt | 3 |
| 211 | Civilian evacuation | (147, 131) | 14 | Asphalt | 3 |
| 212 | Civilian evacuation | (149, 129) | 14 | Asphalt | 3 |
| 213 | Civilian evacuation | (150, 126) | 14 | Asphalt | 3 |
| 214 | Civilian evacuation | (150, 126) | 14 | Asphalt | 3 |
| 215 | Civilian evacuation | (149, 124) | 14 | Asphalt | 3 |
| 216 | Civilian evacuation | (148, 121) | 14 | Asphalt | 3 |
| 217 | Civilian evacuation | (147, 119) | 14 | Asphalt | 3 |
| 218 | Civilian evacuation | (146, 117) | 14 | Asphalt | 3 |
| 219 | Civilian evacuation | (145, 114) | 14 | Asphalt | 3 |
| 220 | Civilian evacuation | (144, 112) | 14 | Asphalt | 3 |
| 221 | Cargo circuit | (56, 106) | 14 | Asphalt | 2 |
| 222 | Cargo circuit | (58, 107) | 14 | Asphalt | 2 |
| 223 | Cargo circuit | (61, 108) | 14 | Asphalt | 2 |
| 224 | Cargo circuit | (63, 110) | 14 | Asphalt | 2 |
| 225 | Cargo circuit | (66, 111) | 14 | Asphalt | 2 |
| 226 | Cargo circuit | (68, 112) | 14 | Asphalt | 2 |
| 227 | Cargo circuit | (68, 112) | 14 | Asphalt | 2 |
| 228 | Cargo circuit | (71, 113) | 14 | Asphalt | 2 |
| 229 | Cargo circuit | (73, 113) | 14 | Asphalt | 2 |
| 230 | Cargo circuit | (76, 114) | 14 | Asphalt | 2 |
| 231 | Cargo circuit | (79, 115) | 14 | Asphalt | 2 |
| 232 | Cargo circuit | (81, 115) | 14 | Asphalt | 2 |
| 233 | Cargo circuit | (84, 116) | 14 | Asphalt | 2 |
| 234 | Cargo circuit | (84, 116) | 14 | Asphalt | 2 |
| 235 | Cargo circuit | (87, 116) | 14 | Asphalt | 2 |
| 236 | Cargo circuit | (89, 116) | 14 | Asphalt | 2 |
| 237 | Cargo circuit | (92, 117) | 14 | Asphalt | 2 |
| 238 | Cargo circuit | (95, 117) | 14 | Asphalt | 2 |
| 239 | Cargo circuit | (97, 117) | 14 | Asphalt | 2 |
| 240 | Cargo circuit | (100, 117) | 14 | Asphalt | 2 |
| 241 | Cargo circuit | (103, 118) | 14 | Asphalt | 2 |
| 242 | Cargo circuit | (105, 118) | 14 | Asphalt | 2 |
| 243 | Cargo circuit | (108, 118) | 14 | Asphalt | 2 |
| 244 | Cargo circuit | (108, 118) | 14 | Asphalt | 2 |
| 245 | Cargo circuit | (111, 118) | 14 | Asphalt | 2 |
| 246 | Cargo circuit | (114, 119) | 14 | Asphalt | 2 |
| 247 | Cargo circuit | (116, 119) | 14 | Asphalt | 2 |
| 248 | Cargo circuit | (119, 119) | 14 | Asphalt | 2 |
| 249 | Cargo circuit | (122, 119) | 14 | Asphalt | 2 |
| 250 | Cargo circuit | (125, 120) | 14 | Asphalt | 2 |
| 251 | Cargo circuit | (127, 120) | 14 | Asphalt | 2 |
| 252 | Cargo circuit | (130, 120) | 14 | Asphalt | 2 |
| 253 | Medical evacuation | (116, 126) | 14 | Asphalt | 2 |
| 254 | Medical evacuation | (115, 129) | 14 | Asphalt | 2 |
| 255 | Medical evacuation | (113, 131) | 14 | Asphalt | 2 |
| 256 | Medical evacuation | (112, 134) | 14 | Asphalt | 2 |
| 257 | Medical evacuation | (110, 136) | 14 | Asphalt | 2 |
| 258 | Medical evacuation | (109, 139) | 14 | Asphalt | 2 |
| 259 | Medical evacuation | (109, 139) | 14 | Asphalt | 2 |
| 260 | Medical evacuation | (106, 140) | 14 | Asphalt | 2 |
| 261 | Medical evacuation | (104, 141) | 14 | Asphalt | 2 |
| 262 | Medical evacuation | (101, 142) | 14 | Asphalt | 2 |
| 263 | Medical evacuation | (98, 142) | 14 | Asphalt | 2 |
| 264 | Medical evacuation | (95, 143) | 14 | Asphalt | 2 |
| 265 | Medical evacuation | (93, 144) | 14 | Asphalt | 2 |
| 266 | Medical evacuation | (90, 145) | 14 | Asphalt | 2 |
| 267 | Medical evacuation | (90, 145) | 14 | Asphalt | 2 |
| 268 | Medical evacuation | (87, 146) | 14 | Asphalt | 2 |
| 269 | Medical evacuation | (85, 146) | 14 | Asphalt | 2 |
| 270 | Medical evacuation | (82, 147) | 14 | Asphalt | 2 |
| 271 | Medical evacuation | (79, 148) | 14 | Asphalt | 2 |
| 272 | Medical evacuation | (77, 148) | 14 | Asphalt | 2 |
| 273 | Medical evacuation | (74, 149) | 14 | Asphalt | 2 |
| 274 | Medical evacuation | (71, 150) | 14 | Asphalt | 2 |
| 275 | Medical evacuation | (69, 150) | 14 | Asphalt | 2 |
| 276 | Medical evacuation | (66, 151) | 14 | Asphalt | 2 |
| 277 | Medical evacuation | (66, 151) | 14 | Asphalt | 2 |
| 278 | Medical evacuation | (63, 151) | 14 | Asphalt | 2 |
| 279 | Medical evacuation | (61, 152) | 14 | Asphalt | 2 |
| 280 | Medical evacuation | (58, 152) | 14 | Asphalt | 2 |
| 281 | Medical evacuation | (55, 152) | 14 | Asphalt | 2 |
| 282 | Medical evacuation | (52, 152) | 14 | Asphalt | 2 |
| 283 | Medical evacuation | (50, 153) | 14 | Asphalt | 2 |
| 284 | Medical evacuation | (47, 153) | 14 | Asphalt | 2 |
| 285 | Medical evacuation | (44, 153) | 14 | Asphalt | 2 |
| 286 | Medical evacuation | (44, 153) | 14 | Asphalt | 2 |
| 287 | Medical evacuation | (42, 155) | 14 | Asphalt | 2 |
| 288 | Medical evacuation | (40, 156) | 14 | Asphalt | 2 |
| 289 | Medical evacuation | (38, 158) | 14 | Asphalt | 2 |
| 290 | Medical evacuation | (36, 160) | 14 | Asphalt | 2 |
| 291 | Medical evacuation | (34, 162) | 14 | Asphalt | 2 |
| 292 | Medical evacuation | (32, 163) | 14 | Asphalt | 2 |
| 293 | Medical evacuation | (30, 165) | 14 | Asphalt | 2 |
| 294 | Survival supply | (30, 165) | 14 | Asphalt | 2 |
| 295 | Survival supply | (33, 165) | 14 | Asphalt | 2 |
| 296 | Survival supply | (36, 164) | 14 | Asphalt | 2 |
| 297 | Survival supply | (38, 164) | 14 | Asphalt | 2 |
| 298 | Survival supply | (41, 164) | 14 | Asphalt | 2 |
| 299 | Survival supply | (44, 163) | 14 | Asphalt | 2 |
| 300 | Survival supply | (47, 163) | 14 | Asphalt | 2 |
| 301 | Survival supply | (49, 163) | 14 | Asphalt | 2 |
| 302 | Survival supply | (52, 163) | 14 | Asphalt | 2 |
| 303 | Survival supply | (55, 162) | 14 | Asphalt | 2 |
| 304 | Survival supply | (58, 162) | 14 | Asphalt | 2 |
| 305 | Survival supply | (60, 162) | 14 | Asphalt | 2 |
| 306 | Survival supply | (63, 161) | 14 | Asphalt | 2 |
| 307 | Survival supply | (66, 161) | 14 | Asphalt | 2 |
| 308 | Survival supply | (66, 161) | 14 | Asphalt | 2 |
| 309 | Survival supply | (69, 161) | 14 | Asphalt | 2 |
| 310 | Survival supply | (72, 161) | 14 | Asphalt | 2 |
| 311 | Survival supply | (75, 162) | 14 | Asphalt | 2 |
| 312 | Survival supply | (77, 162) | 14 | Asphalt | 2 |
| 313 | Survival supply | (80, 162) | 14 | Asphalt | 2 |
| 314 | Survival supply | (83, 162) | 14 | Asphalt | 2 |
| 315 | Survival supply | (86, 162) | 14 | Asphalt | 2 |
| 316 | Survival supply | (89, 162) | 14 | Asphalt | 2 |
| 317 | Survival supply | (92, 163) | 14 | Asphalt | 2 |
| 318 | Survival supply | (94, 163) | 14 | Asphalt | 2 |
| 319 | Survival supply | (97, 163) | 14 | Asphalt | 2 |
| 320 | Survival supply | (100, 163) | 14 | Asphalt | 2 |
| 321 | Survival supply | (100, 163) | 14 | Asphalt | 2 |
| 322 | Survival supply | (103, 162) | 14 | Asphalt | 2 |
| 323 | Survival supply | (106, 161) | 14 | Asphalt | 2 |
| 324 | Survival supply | (108, 160) | 14 | Asphalt | 2 |
| 325 | Survival supply | (111, 159) | 14 | Asphalt | 2 |
| 326 | Survival supply | (114, 157) | 14 | Asphalt | 2 |
| 327 | Survival supply | (117, 156) | 14 | Asphalt | 2 |
| 328 | Survival supply | (119, 155) | 14 | Asphalt | 2 |
| 329 | Survival supply | (122, 154) | 14 | Asphalt | 2 |
| 330 | Survival supply | (125, 153) | 14 | Asphalt | 2 |
| 331 | Survival supply | (125, 153) | 14 | Asphalt | 2 |
| 332 | Survival supply | (128, 153) | 14 | Asphalt | 2 |
| 333 | Survival supply | (131, 153) | 14 | Asphalt | 2 |
| 334 | Survival supply | (133, 153) | 14 | Asphalt | 2 |
| 335 | Survival supply | (136, 153) | 14 | Asphalt | 2 |
| 336 | Survival supply | (139, 153) | 14 | Asphalt | 2 |
| 337 | Survival supply | (142, 152) | 14 | Asphalt | 2 |
| 338 | Survival supply | (145, 152) | 14 | Asphalt | 2 |
| 339 | Survival supply | (148, 152) | 14 | Asphalt | 2 |
| 340 | Survival supply | (150, 152) | 14 | Asphalt | 2 |
| 341 | Survival supply | (153, 152) | 14 | Asphalt | 2 |
| 342 | Survival supply | (156, 152) | 14 | Asphalt | 2 |
| 343 | Survival supply | (156, 152) | 14 | Asphalt | 2 |
| 344 | Survival supply | (157, 149) | 14 | Asphalt | 2 |
| 345 | Survival supply | (159, 147) | 14 | Asphalt | 2 |
| 346 | Survival supply | (160, 144) | 14 | Asphalt | 2 |
| 347 | Survival supply | (162, 142) | 14 | Asphalt | 2 |
| 348 | Survival supply | (163, 139) | 14 | Asphalt | 2 |
| 349 | Survival supply | (164, 136) | 14 | Asphalt | 2 |
| 350 | Survival supply | (166, 134) | 14 | Asphalt | 2 |
| 351 | Survival supply | (167, 131) | 14 | Asphalt | 2 |
| 352 | Archive spur | (90, 138) | 14 | Asphalt | 2 |
| 353 | Archive spur | (92, 140) | 14 | Asphalt | 2 |
| 354 | Archive spur | (93, 142) | 14 | Asphalt | 2 |
| 355 | Archive spur | (95, 144) | 14 | Asphalt | 2 |
| 356 | Archive spur | (97, 146) | 14 | Asphalt | 2 |
| 357 | Archive spur | (98, 148) | 14 | Asphalt | 2 |
| 358 | Archive spur | (100, 150) | 14 | Asphalt | 2 |
| 359 | Archive spur | (100, 150) | 14 | Asphalt | 2 |
| 360 | Archive spur | (100, 153) | 14 | Asphalt | 2 |
| 361 | Archive spur | (100, 155) | 14 | Asphalt | 2 |
| 362 | Archive spur | (100, 158) | 14 | Asphalt | 2 |
| 363 | Archive spur | (100, 160) | 14 | Asphalt | 2 |
| 364 | Archive spur | (100, 163) | 14 | Asphalt | 2 |
| 365 | Southern salvage | (30, 165) | 14 | Asphalt | 2 |
| 366 | Southern salvage | (32, 167) | 14 | Asphalt | 2 |
| 367 | Southern salvage | (33, 169) | 14 | Asphalt | 2 |
| 368 | Southern salvage | (35, 171) | 14 | Asphalt | 2 |
| 369 | Southern salvage | (37, 173) | 14 | Asphalt | 2 |
| 370 | Southern salvage | (38, 175) | 14 | Asphalt | 2 |
| 371 | Southern salvage | (40, 177) | 14 | Asphalt | 2 |
| 372 | Southern salvage | (40, 177) | 14 | Asphalt | 2 |
| 373 | Southern salvage | (43, 178) | 14 | Asphalt | 2 |
| 374 | Southern salvage | (45, 179) | 14 | Asphalt | 2 |
| 375 | Southern salvage | (48, 179) | 14 | Asphalt | 2 |
| 376 | Southern salvage | (50, 180) | 14 | Asphalt | 2 |
| 377 | Southern salvage | (50, 180) | 14 | Asphalt | 2 |
| 378 | Southern salvage | (53, 180) | 14 | Asphalt | 2 |
| 379 | Southern salvage | (56, 180) | 14 | Asphalt | 2 |
| 380 | Southern salvage | (59, 179) | 14 | Asphalt | 2 |
| 381 | Southern salvage | (62, 179) | 14 | Asphalt | 2 |
| 382 | Southern salvage | (65, 179) | 14 | Asphalt | 2 |
| 383 | Southern salvage | (67, 179) | 14 | Asphalt | 2 |
| 384 | Southern salvage | (70, 179) | 14 | Asphalt | 2 |
| 385 | Southern salvage | (73, 179) | 14 | Asphalt | 2 |
| 386 | Southern salvage | (76, 178) | 14 | Asphalt | 2 |
| 387 | Southern salvage | (79, 178) | 14 | Asphalt | 2 |
| 388 | Southern salvage | (82, 178) | 14 | Asphalt | 2 |
| 389 | Southern salvage | (82, 178) | 14 | Asphalt | 2 |
| 390 | Southern salvage | (84, 176) | 14 | Asphalt | 2 |
| 391 | Southern salvage | (87, 174) | 14 | Asphalt | 2 |
| 392 | Southern salvage | (89, 172) | 14 | Asphalt | 2 |
| 393 | Southern salvage | (91, 171) | 14 | Asphalt | 2 |
| 394 | Southern salvage | (93, 169) | 14 | Asphalt | 2 |
| 395 | Southern salvage | (96, 167) | 14 | Asphalt | 2 |
| 396 | Southern salvage | (98, 165) | 14 | Asphalt | 2 |
| 397 | Southern salvage | (100, 163) | 14 | Asphalt | 2 |
| 398 | Heat shield cache | (156, 152) | 14 | Asphalt | 2 |
| 399 | Heat shield cache | (155, 154) | 14 | Asphalt | 2 |
| 400 | Heat shield cache | (154, 157) | 14 | Asphalt | 2 |
| 401 | Heat shield cache | (153, 159) | 14 | Asphalt | 2 |
| 402 | Heat shield cache | (152, 162) | 14 | Asphalt | 2 |
| 403 | Heat shield cache | (151, 164) | 14 | Asphalt | 2 |
| 404 | Heat shield cache | (151, 164) | 14 | Asphalt | 2 |
| 405 | Heat shield cache | (149, 165) | 14 | Asphalt | 2 |
| 406 | Heat shield cache | (146, 167) | 14 | Asphalt | 2 |
| 407 | Heat shield cache | (144, 168) | 14 | Asphalt | 2 |
| 408 | Heat shield cache | (141, 169) | 14 | Asphalt | 2 |
| 409 | Heat shield cache | (139, 171) | 14 | Asphalt | 2 |
| 410 | Heat shield cache | (136, 172) | 14 | Asphalt | 2 |

## 6. 기존 정적 통행 기록

아래 값은 이번 ASTRA 제작본 빌드에서 실행한 정적 검사 결과다.
검사 방법: 16개 미니타일이 모두 보행 가능해야 한다. 건물 주위에 한 타일을 추가한다. 4방향 탐색으로 연결을 확인한다.
단계 수는 정적 탐색 거리다. 스타크래프트 엔진의 이동 거리, 소요 시간, 길찾기를 보장하지 않는다.

| 지표 | 기존 기록 |
| --- | --- |
| 고도별 타일 수 | 0: 33039 / 1: 3825 |
| 지형 보행 제한 타일 | 2425 |
| 절벽 플래그 / 시야 차단 플래그 타일 | 0 / 0 |
| 경로 수 | 36 |

| 출발 | 도착 | 4방향 탐색 단계 |
| --- | --- | --- |
| Barracks | Armory | 31 |
| Armory | Outpost | 95 |
| Outpost | Outer | 38 |
| Outer | Inner | 42 |
| Inner | Soldiers | 33 |
| Soldiers | Evac | 53 |
| Workshop | Shelter | 24 |
| Shelter | Medical | 125 |
| Medical | Settlement | 40 |
| Settlement | Relay | 36 |
| Relay | Supply | 67 |
| Supply | Exit | 32 |
| OuterReserve | Outpost | 30 |
| OuterReserve | Outer | 68 |
| InnerReserve | Inner | 58 |
| DepotReserve | Ammo | 52 |
| MaraStart | Evac | 110 |
| WrenStart | Evac | 38 |
| Civilians | Evac | 34 |
| Evac | Shelter | 42 |
| Relay | Archive | 35 |
| Medical | Salvage | 35 |
| Relay | NorthRoute | 39 |
| Relay | SouthRoute | 33 |
| Supply | Restricted | 40 |
| Barracks | Command | 60 |
| Command | Workshop | 42 |
| Workshop | MotorPool | 29 |
| Artillery | Inner | 24 |
| PatrolWest | PatrolEast | 32 |
| CargoWest | CargoEast | 88 |
| ScoutReserve | Outpost | 34 |
| SettlementReserve | Settlement | 15 |
| RelayReserve | Relay | 43 |
| SupplyReserve | Supply | 45 |
| RestrictedReserve | Restricted | 38 |
