import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const work = join(import.meta.dirname, '../../../work');
const root = join(import.meta.dirname, '..');
const editor = join(work, 'scm-js');
const output = process.argv[2] ?? join(root, 'docs/maps');
const editorModule = (file) => import(pathToFileURL(join(editor, file)));
const projectModule = (file) => import(pathToFileURL(join(root, file)));
await editorModule('scripts/lib/load-ts.mjs');
const { parseScenario } = await editorModule('src/formats/chk/scenario.ts');
const { loadMap, readMembers } = await editorModule('src/formats/mpq/scm.ts');
const { ActionType } = await editorModule('src/formats/chk/sections/triggers.ts');
const { M01_BRUSHES, M02_BRUSHES } = await projectModule('src/campaign/terrain.mjs');
const layout1 = await projectModule('src/m01/layout.mjs');
const layout2 = await projectModule('src/m02/layout.mjs');
const vendor = await readFile(join(work, 'plugin-trigscript/vendor/units.ts'), 'utf8');
const names = [...vendor.split('= [')[1].split('];')[0].matchAll(/"([^"]*)"/g)].map((m) => m[1]);
const sha = (b) => createHash('sha256').update(b).digest('hex');
const json = async (p) => JSON.parse(await readFile(join(root, p), 'utf8'));
const xy = (x, y) => '(' + x + ', ' + y + ')';
const typeId = (v) => typeof v === 'number' ? v : names.indexOf(v);
const tileName = { 2: 'Dirt', 3: 'High Dirt', 4: 'Mud', 5: 'Water', 6: 'Grass', 14: 'Asphalt', 15: 'Rocky Ground', 18: 'Structure' };
const layoutA = await projectModule('src/m01-astra/layout.mjs');
const {ASTRA_BRUSHES} = await projectModule('src/m01-astra/terrain.mjs');
const configs = [
 {id:'M01_ASTRA', sourceId:'m01-astra',title:'노스 릿지 재설계',label:'M01_NORTH_RIDGE_ASTRA',folder:'ASTRA-PROD-01',layout:layoutA,brushes:ASTRA_BRUSHES,seed:172},
  { id: 'M01', title: '마지막 생존자', label: 'M01_NORTH_RIDGE_START_FIX', folder: 'WO-PROD-02-HOTFIX', layout: layout1, brushes: M01_BRUSHES, seed: 172 },
  { id: 'M02', title: '고립된 전선', label: 'M02_ISOLATED_FRONT', folder: 'WO-PROD-02', layout: layout2, brushes: M02_BRUSHES, seed: 417 },
];
const results = [];

function table(headers, rows) {
  return [
    '| ' + headers.join(' | ') + ' |',
    '| ' + headers.map(() => '---').join(' | ') + ' |',
    ...rows.map((row) => '| ' + row.join(' | ') + ' |'),
  ].join('\n');
}
function reportLink(cfg) {
  return '../../' + cfg.folder + '/reports/' + cfg.label + '.json';
}
function mapPath(cfg) {
  return cfg.folder + '/maps/' + cfg.label + '.scx';
}
function tileCSV(map) {
  const rows = ['y,' + Array.from({ length: map.width }, (_, x) => x).join(',')];
  for (let y = 0; y < map.height; y++) {
    rows.push(y + ',' + map.tiles.slice(y * map.width, (y + 1) * map.width).join(','));
  }
  return rows.join('\n') + '\n';
}
function tileBuffers(a) {
  return Buffer.from(a.buffer, a.byteOffset, a.byteLength);
}
function unitKey(u) {
  return [u.serial, u.unitId, u.owner, u.x, u.y, (u.validStates & 2) ? u.hitPointsPercent : 100, u.stateFlags];
}
function locationKey(z, map) {
  return [map.strings.strings[z.nameIndex], z.left, z.top, z.right, z.bottom, z.elevationFlags];
}
async function extract(cfg, label = cfg.label, folder = cfg.folder) {
  const path = folder + '/maps/' + label + '.scx';
  const bytes = await readFile(join(root, path));
  const reopened = await loadMap(bytes);
  return { path, bytes, reopened, map: parseScenario(reopened.chk) };
}

await mkdir(output, { recursive: true });
for (const cfg of configs) {
  const { map, bytes, reopened } = await extract(cfg);
  const { layout, brushes, id } = cfg;
  const report = await json(cfg.folder + '/reports/' + cfg.label + '.json');
  const pack = report.maps.find((m) => m.kind === 'PLAY');
  assert.equal(sha(bytes), pack.sha256, id + ' source hash');
  assert.equal(map.width, layout.width);
  assert.equal(map.height, layout.height);
  assert.equal(map.era, 0);
  assert.equal(map.tiles.length, layout.width * layout.height);
  assert.equal(map.units.length, layout.placements.length);
  assert.equal(map.units.length, report.units);
  assert.equal(map.triggers.length, pack.triggers);
  const exact = layout.placements.map((p, i) => {
    const u = map.units[i];
    const hp = p.hpPercent ?? (p.wounded ? 65 : null);
    assert.deepEqual([u.serial, u.unitId, u.owner, u.x, u.y], [i + 1, typeId(p.type), p.owner, p.x, p.y], p.id);
    assert.equal(u.validStates & 2 ? u.hitPointsPercent : null, hp, p.id + ' HP');
    return { p, u, hp };
  });
  for (const z of layout.locations) {
    assert.deepEqual(locationKey(map.locations[z.index - 1], map), [z.name, z.left, z.top, z.right, z.bottom, 0]);
  }
  const members = await readMembers(reopened.archive, reopened.files);
  const brushPath = 'source\\terrain-plan.json';
  assert.deepEqual(JSON.parse(Buffer.from(members.extras.get(brushPath)).toString('utf8')), brushes);
  assert.deepEqual(Buffer.from(members.extras.get('source\\layout.mjs')), await readFile(join(root, 'src', cfg.sourceId ?? id.toLowerCase(), 'layout.mjs')));
  const alternateLabel = id.startsWith('M01') ? 'M01_CONTROL_CHECK' : 'M02_CARRY_7877e9b59f';
  const alt = await extract(cfg, alternateLabel);
  const source = await extract(cfg, cfg.label + '_SOURCE');
  const altReport = id.startsWith('M01') ? report : await json(cfg.folder + '/reports/' + alternateLabel + '.json');
  assert.equal(sha(source.bytes), report.maps.find((m) => m.kind === 'SOURCE').sha256);
  assert.equal(sha(alt.bytes), altReport.maps.find((m) => m.kind === (id.startsWith('M01') ? 'CONTROL' : 'PLAY')).sha256);
  for (const other of [alt, source]) {
    assert.deepEqual(other.map.tiles, map.tiles, other.path);
    assert.deepEqual(other.map.isom, map.isom, other.path);
    assert.deepEqual(other.map.units.map(unitKey), map.units.map(unitKey), other.path);
    assert.deepEqual(other.map.locations.map((z) => locationKey(z, other.map)), map.locations.map((z) => locationKey(z, map)), other.path);
  }
  const grid = tileCSV(map);
  const gridFile = id + '_MTXM.csv';
  await writeFile(join(output, gridFile), grid);
  const reopenedGrid = (await readFile(join(output, gridFile), 'utf8')).trimEnd().split('\n');
  assert.equal(reopenedGrid.length, map.height + 1);
  for (let y = 0; y < map.height; y++) {
    const cells = reopenedGrid[y + 1].split(',').map(Number);
    assert.equal(cells.shift(), y);
    assert.deepEqual(cells, Array.from(map.tiles.slice(y * map.width, (y + 1) * map.width)));
  }

  const rows = [
    '# ' + id + ' ' + cfg.title + ' — SCX 실측 배치',
    '',
    '상태: **SCX·소스 대조 완료 / 실게임 NOT RUN**. 아래 값은 패키지 안의 초기 배치를 설명한다.',
    '런타임 배치와 지역별 제작 의도는 [' + id + ' 현장 명세](' + id + '_FIELD.md)를 참조한다.',
    '',
    '## 1. 규격과 근거',
    '',
    table(['항목', '값'], [
      ['대상 플레이 맵', '[' + cfg.label + '.scx](../../' + mapPath(cfg) + ')'],
      ['편집 소스 맵', '[' + cfg.label + '_SOURCE.scx](../../' + source.path + ')'],
      ['동일 배치의 비교 맵', '[' + alternateLabel + '.scx](../../' + alt.path + ')'],
      ['빌드 기록', '[기존 구조 검사 및 경로 기록](' + reportLink(cfg) + ')'],
      ['지형 / 포맷', 'Badlands / SCX / CHK ERA ' + map.era + ' / VER ' + map.fileVersion],
      ['크기', map.width + '×' + map.height + '타일 / ' + map.width * 32 + '×' + map.height * 32 + 'px'],
      ['그리드', '[' + gridFile + '](' + gridFile + ') / x=열, y=행, 십진 MTXM 원시값'],
      ['MTXM SHA-256 (리틀엔디언 uint16)', sha(tileBuffers(map.tiles))],
      ['ISOM SHA-256 (리틀엔디언 uint16)', sha(tileBuffers(map.isom))],
      ['플레이 SCX SHA-256', sha(bytes)],
      ['UNIT / 명명 MRGN / DD2 / THG2', [map.units.length, layout.locations.length, map.doodads.length, map.sprites.length].join(' / ')],
      ['기본 트리거 / 브리핑', map.triggers.length + ' / ' + map.briefing.length + ' (소스 및 비교 맵은 별도)'],
      ['네이티브 동맹 행동', map.triggers.flatMap((t) => t.actions).filter((a) => a.type === ActionType.SetAllianceStatus).length],
    ]),
    '',
    '편집 소스 맵, 플레이 맵, 비교 맵의 MTXM·ISOM·MRGN이 일치한다. UNIT은 소유자·좌표·종류·유효 HP가 일치한다.',
    'UNIT의 기본 HP 필드 기록 방식과 트리거·브리핑은 맵별로 다를 수 있다.',
    'UNIT의 건물 크기는 소스의 배치 여유 검사값이다. 엔진의 충돌 상자나 애드온 요구 치수와 구분한다.',
    '',
    '## 2. 소유권과 세력',
    '',
    table(['슬롯', 'OWNR / IOWN', 'SIDE', 'FORC(0부터)', '역할'], map.playerTypes.map((owner, i) => [
      'P' + (i + 1), owner + ' / ' + map.editorPlayerTypes[i], map.playerRaces[i], map.forces.playerForce[i] ?? '—',
      ['플레이어', '저그', '연합군', '민간인 슬롯', '연합군 구조 슬롯', '저그 별동대', '저그 별동대', '저그 별동대', '비활성', '비활성', '비활성', '중립 배치'][i],
    ])),
    '',
    'FORC 플래그 원시값: ' + map.forces.flags.join(', ') + '. 맵 설정 사용(Use Map Settings)을 기준으로 한다.',
    '',
    '## 3. 모든 트리거 위치',
    '',
    '사각형은 (좌, 상, 우, 하) 순서다. 중심은 이동·생성 명령의 기준점이다. Focus는 런타임이 옮기는 작업용 위치다.',
    '',
    table(['MRGN', '이름', '타일 사각형', '픽셀 사각형', '중심 px', '고도 제외 플래그'], layout.zones.map(([name, l, t, r, b], i) => [
      i + 1, name, [l, t, r, b].join(', '), [l, t, r, b].map((v) => v * 32).join(', '), xy(layout.centres[name].x, layout.centres[name].y), 0,
    ])),
    '',
    '기본 Anywhere는 위 명명 위치 수에서 제외한다.',
    '',
    '## 4. 모든 초기 UNIT 레코드',
    '',
    '픽셀은 배치 중심이다. 타일 칸은 픽셀에 32를 나누고 내림한 값이다. HP의 —는 개별 지정 없음이다.',
    '건물 여유는 중심과 크기로 계산한다. 좌상단 = floor(중심 px / 32 − 크기 / 2).',
    '시작 위치 마커와 비콘도 누락 없이 포함한다. 시작 위치 마커는 전투 개체가 아니다.',
    '',
    table(['일련번호', '소스 ID', '엔진 종류 / ID', '소유자', '중심 px', '중심 타일 칸', 'HP %', '건물 여유(타일)'], exact.map(({ p, u, hp }) => [
      u.serial, p.id, names[u.unitId] + ' / ' + u.unitId, 'P' + (u.owner + 1), xy(u.x, u.y), xy(u.x >> 5, u.y >> 5),
      hp ?? '—', p.footprint?.join('×') ?? '—',
    ])),
    '',
    '## 5. 지형 도색 순서',
    '',
    '시드 ' + cfg.seed + ', 기반 CV5 지형 2(Dirt)에서 시작한다. 표 순서대로 전환 브러시를 적용한다.',
    '중심 좌표는 타일 단위다. extent는 브러시 인수다. 도색 결과의 직사각형 폭을 뜻하지 않는다.',
    '최종 지형의 모든 셀은 MTXM CSV를 참조한다. 브러시 ID는 CV5 지형 종류다. 저장된 ISOM 값과 개별 MTXM 값은 별도다.',
    '',
    table(['순서', '지형 항목', '중심 타일', 'CV5 지형 ID', '지형', 'extent'], brushes.map(([name, x, y, type, extent], i) => [
      i + 1, name, xy(x, y), type, tileName[type] ?? '—', extent,
    ])),
    '',
    '## 6. 기존 정적 통행 기록',
    '',
    cfg.id==='M01_ASTRA'?'아래 값은 이번 ASTRA 제작본 빌드에서 실행한 정적 검사 결과다.':'아래 값은 기존 빌드 기록에서 가져왔다. 원본 M01/M02의 기능 검사를 반복하지 않았다.',
    '검사 방법: 16개 미니타일이 모두 보행 가능해야 한다. 건물 주위에 한 타일을 추가한다. 4방향 탐색으로 연결을 확인한다.',
    '단계 수는 정적 탐색 거리다. 스타크래프트 엔진의 이동 거리, 소요 시간, 길찾기를 보장하지 않는다.',
    '',
    table(['지표', '기존 기록'], [
      ['고도별 타일 수', Object.entries(report.terrain.heights).map(([k, v]) => k + ': ' + v).join(' / ')],
      ['지형 보행 제한 타일', report.terrain.blockedTiles],
      ['절벽 플래그 / 시야 차단 플래그 타일', report.terrain.cliffFlagTiles + ' / ' + report.terrain.viewFlagTiles],
      ['경로 수', report.terrain.routes.length],
    ]),
    '',
    table(['출발', '도착', '4방향 탐색 단계'], report.terrain.routes.map((r) => [r.from, r.to, r.steps])),
    '',
  ];
  assert.deepEqual(report.terrain.routes.map((r) => [r.from, r.to]), layout.routeChecks);
  const docFile = join(output, id + '_AS_BUILT.md');
  await writeFile(docFile, rows.join('\n'));
  assert.equal(await readFile(docFile, 'utf8'), rows.join('\n'));
  results.push({ id, records: exact.length, tiles: map.tiles.length, locations: layout.zones.length, brushes: brushes.length, routes: report.terrain.routes.length, alternates: 2, doodads: map.doodads.length, sprites: map.sprites.length });
}
console.log(JSON.stringify(results));
