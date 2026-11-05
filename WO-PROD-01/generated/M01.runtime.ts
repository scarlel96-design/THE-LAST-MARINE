import { program, first, unitsOf, countUnits as count, bring, createUnit, moveUnit, killUnitAt, removeUnitAt,
  centerView, print, keyPressed, nextFrame, stats, units, upgrades, orders, playWav,
  setMissionObjectives, talkingPortrait, victory, setResources, P1, P2, P3, P4, P5, P6, P7, P8, locations } from "trigscript";
import { now, SECOND } from "trigscript/timers";

// Build the radio table from content.json. Do not import the native UI probe.
program(async () => {
  let phase = 0;
  let entered = -1;
  let phaseAt = now();
  let checkpointId = 0;
  let sceneState = 0;
  let collapseCompletions = 0;
  let sceneSkipped = false;
  let missionComplete = false;
  let victoryIssued = false;
  let cameraOwner = 0;
  let cameraUntil = 0;
  let recoveryAt = 0;
  let watchdogAt = 0;
  let qUnlocked = false;
  let wUnlocked = false;
  let qUntil = 0;
  let qReady = 0;
  let qX = 0;
  let qY = 0;
  let wUntil = 0;
  let wReady = 0;
  let castHp = 0;
  let castX = 0;
  let castY = 0;
  let materials = 0;
  let parts = 0;
  let kits = 0;
  let explosives = 0;
  let weaponTier = 0;
  let armorTier = 0;
  let experienceTier = 0;
  let equipmentFlags = 0;
  let intelFlags = 0;
  let milestoneFlags = 0;
  let lootFlags = 0;
  let routeChoice = 0;
  let outerOutcome = 0;
  let maraState = 0;
  let wrenState = 0;
  let ellaState = 0;
  let maraMoving = false;
  let wrenMoving = false;
  let civMoving = false;
  let soldiersMoving = false;
  let soldierCount = 0;
  let civilianCount = 0;
  let outerIssued = false;
  let innerIssued = false;
  let depotIssued = false;
  let dropshipStarted = false;
  let dropshipCrashed = false;
  let ammoExploded = false;
  let settlementIssued = false;
  let relayIssued = false;
  let supplyIssued = false;
  let restrictedIssued = false;
  let transferA = 0;
  let transferB = 0;
  let transferC = 0;
  let transferCheck = 0;
  let bonusMaterials = 0;
  let bonusParts = 0;
  let earlyWarning = 0;
  let cpPhase = 0;
  let cpMaterials = 0;
  let cpParts = 0;
  let cpKits = 0;
  let cpExplosives = 0;
  let cpWeapon = 0;
  let cpArmor = 0;
  let cpExperience = 0;
  let cpEquipment = 0;
  let cpIntel = 0;
  let cpMilestones = 0;
  let cpLoot = 0;
  let cpRoute = 0;
  let cpHp = 40;
  let shownKits = -1;
  let shownExplosives = -1;
  let hero = first({owner:P1,type:units.JimRaynorMarine});
  let mara = first({owner:P3,type:units.GuiMontagFirebat});
  let wren = first({owner:P3,type:units.TerranSCV,at:locations.WrenStart});
  let ella = first({owner:P4,type:units.TerranCivilian,at:locations.EllaStart});
  let outer = first({owner:P3,type:units.TerranBunker,at:locations.Outer});
  let inner = first({owner:P3,type:units.TerranBunker,at:locations.Inner});
  let ammo = first({owner:P3,type:units.TerranSupplyDepot,at:locations.Ammo});
  let ship = first({owner:P3,type:units.TerranDropship});
  stats(units.JimRaynorMarine).maxHp = 40;
  stats(units.JimRaynorMarine).armor = 0;
  if (hero) hero.hp = 40;
  // Survival encounters contain wounded remnants. The reserve armies keep normal health.
  for (const foe of unitsOf(P8)) foe.hp = Math.max(1,Math.floor(foe.maxHp * 0.65));

  for (const foe of unitsOf(P2,{type:units.ZergHydralisk})) foe.hp=Math.max(1,Math.floor(foe.maxHp*0.65));
  for (const foe of unitsOf(P6,{type:units.ZergZergling})) foe.hp=Math.max(1,Math.floor(foe.maxHp*0.65));
  for (const foe of unitsOf(P7,{type:units.ZergZergling})) foe.hp=Math.max(1,Math.floor(foe.maxHp*0.65));

  function radio(id:number) { if(id==1) { print("[마라 베일] 근무 교대다. 무기고 표식에서 G를 눌러 장비를 확인해."); talkingPortrait(10,1500); playWav("staredit\\wav\\m01-radio.wav",160); }
if(id==2) { print("[이언 렌] 정비차량은 작업 중이다. 수송선 누유 경고가 남아 있어. 북부 초소를 먼저 확인해 줘."); talkingPortrait(7,1500); playWav("staredit\\wav\\m01-radio.wav",160); }
if(id==3) { print("[마라 베일] 소총 이상 없다. 방어 자세 Q 또는 F7을 기억해. 이동하면 자세가 풀린다. 북부 감시초소로 이동해."); talkingPortrait(10,1500); playWav("staredit\\wav\\m01-radio.wav",160); }
if(id==4) { print("[노스 릿지 통제소] 북부 센서에 지하 진동이 잡힌다. 중계 응답이 간헐적으로 끊긴다."); talkingPortrait(0,1500); playWav("staredit\\wav\\m01-radio.wav",160); }
if(id==5) { print("[마라 베일] 철조망 밖에 접촉! 벙커 옆 사선을 지켜. 적은 북쪽 골짜기를 따라 접근한다."); talkingPortrait(10,1500); playWav("staredit\\wav\\m01-radio.wav",160); }
if(id==6) { print("[노스 릿지 통제소] 외곽 방어시설이 피격됐다. 두 번째 방어선으로 철수하라. 경계조는 후미를 엄호한다."); talkingPortrait(0,1500); playWav("staredit\\wav\\m01-radio.wav",160); }
if(id==7) { print("[마라 베일] 첫 공격은 막았다. 하지만 동쪽 통로에 새 접촉이 있다. 명령이다. 외곽을 비우고 안쪽 방어선으로 이동해."); talkingPortrait(10,1500); playWav("staredit\\wav\\m01-radio.wav",160); }
if(id==8) { print("[노스 릿지 통제소] 예비 회선도 응답이 없다. 착륙장을 사수하라. 고립된 분대와 민간인은 현장 판단으로 구조한다."); talkingPortrait(0,1500); playWav("staredit\\wav\\m01-radio.wav",160); }
if(id==9) { print("[마라 베일] 나는 정비구역 쪽 후미를 맡는다. 돌아올 여유가 있으면 이 표식으로 와. 혼자 버틸 시간은 길지 않다."); talkingPortrait(10,1500); playWav("staredit\\wav\\m01-radio.wav",160); }
if(id==10) { print("[이언 렌] 탄약고가 위험하다. 회수할 정비 기록이 여기 있다. 나를 대피 지점까지 안내하면 군수기지 좌표를 남기겠다."); talkingPortrait(7,1500); playWav("staredit\\wav\\m01-radio.wav",160); }
if(id==11) { print("[엘라 모로] 정착지 주민이 통로에 갇혔어요. 이쪽 표식에서 G를 누르면 제 뒤를 따라 대피하게 할게요."); talkingPortrait(15,1500); playWav("staredit\\wav\\m01-radio.wav",160); }
if(id==12) { print("[노스 릿지 통제소] 착륙장 지하 대피통로를 개방한다. 도착한 인원은 동부 집결지로 먼저 이탈한다. 후미 경계병은 수송선을 기다려라."); talkingPortrait(0,1500); playWav("staredit\\wav\\m01-radio.wav",160); }
if(id==13) { print("[노스 릿지 통제소] 수송선: 유도 신호가 끊겼다. 연료 압력이 떨어진다! 비상 착륙한다!"); talkingPortrait(0,1500); playWav("staredit\\wav\\m01-radio.wav",160); }
if(id==14) { print("[이언 렌] 탄약고가 피격됐다. 연쇄 폭발이 임박했다. 남쪽 차폐벽 뒤로 물러서!"); talkingPortrait(7,1500); playWav("staredit\\wav\\m01-radio.wav",160); }
if(id==15) { print("[주인공 해병] 마지막 통신이 끊겼다. 차폐벽 뒤로...!"); talkingPortrait(20,1500); playWav("staredit\\wav\\m01-radio.wav",160); }
if(id==16) { print("[주인공 해병] ...응답하라. 누구든. 의료시설 표식부터 확인한다."); talkingPortrait(20,1500); playWav("staredit\\wav\\m01-radio.wav",160); }
if(id==17) { print("[주인공 해병] 의료 모듈과 키트를 확보했다. 긴급 지혈 W 또는 F8. 움직이거나 큰 피해를 받으면 중단된다."); talkingPortrait(20,1500); playWav("staredit\\wav\\m01-radio.wav",160); }
if(id==18) { print("[주인공 해병] 정착지는 비었다. 보급 상자와 대피 기록을 확인하고 남은 통신중계소로 이동한다."); talkingPortrait(20,1500); playWav("staredit\\wav\\m01-radio.wav",160); }
if(id==19) { print("[노스 릿지 통제소] 저장 기록: 베스퍼 군수망 단절. 즉시 구조 전력 없음. 북동쪽 군수기지의 수동 중계 장비를 사용하라."); talkingPortrait(0,1500); playWav("staredit\\wav\\m01-radio.wav",160); }
if(id==20) { print("[주인공 해병] 구조가 바로 오지는 않는다. 기록을 보존했다. 군수기지까지 살아서 가야 한다."); talkingPortrait(20,1500); playWav("staredit\\wav\\m01-radio.wav",160); }
if(id==21) { print("[주인공 해병] 잔존 저그를 제거하고 보급시설의 전원을 복구한다. 선택 보급품이 없어도 이 시설은 가동할 수 있다."); talkingPortrait(20,1500); playWav("staredit\\wav\\m01-radio.wav",160); }
if(id==22) { print("[주인공 해병] 보급시설 확보. 다음 목표는 군수기지 재가동이다. 현장 기록을 정리한 뒤 북쪽 출구로 이동한다."); talkingPortrait(20,1500); playWav("staredit\\wav\\m01-radio.wav",160); }
if(id==23) { print("[마라 베일] 베일 하사, 대피 지점 도착. 네 이름을 기억해 두겠다. 북부 접근로는 정면보다 동쪽이 약하다."); talkingPortrait(10,1500); playWav("staredit\\wav\\m01-radio.wav",160); }
if(id==24) { print("[이언 렌] 렌, 대피 지점 도착. 군수기지 정비 절차를 단말기에 남겼다. 반드시 그곳을 되살려."); talkingPortrait(7,1500); playWav("staredit\\wav\\m01-radio.wav",160); }
if(id==25) { print("[엘라 모로] 모로입니다. 대피통로에 도착했어요. 뒤따르는 주민도 확인해 주세요. 보급망 지도를 군사 단말기에 남겼습니다."); talkingPortrait(15,1500); playWav("staredit\\wav\\m01-radio.wav",160); }
if(id==26) { print("[노스 릿지 통제소] 구조 분대 도착 확인. 귀환 인원만 작전 기록에 포함한다."); talkingPortrait(0,1500); playWav("staredit\\wav\\m01-radio.wav",160); }
if(id==27) { print("[주인공 해병] 군사 자료 회수. 북부 저그 접근로와 손상된 중계망의 기록이다."); talkingPortrait(20,1500); playWav("staredit\\wav\\m01-radio.wav",160); }
if(id==28) { print("[주인공 해병] 폐차량에서 군수자재와 폭약을 회수했다. 폭약 전투 기술은 아직 운용하지 못한다."); talkingPortrait(20,1500); playWav("staredit\\wav\\m01-radio.wav",160); }
if(id==29) { print("[주인공 해병] 제한 구역에서 내열 라이닝과 특수부품을 확보했다."); talkingPortrait(20,1500); playWav("staredit\\wav\\m01-radio.wav",160); }
if(id==30) { print("[주인공 해병] 북쪽 우회로를 기록했다. 군수기지의 조기 경보에 사용할 수 있다."); talkingPortrait(20,1500); playWav("staredit\\wav\\m01-radio.wav",160); }
if(id==31) { print("[주인공 해병] 남쪽 보급로를 기록했다. 군수기지 정비에 쓸 자재를 추가 회수한다."); talkingPortrait(20,1500); playWav("staredit\\wav\\m01-radio.wav",160); }
if(id==32) { print("[주인공 해병] 정비 단말기: 소총 개량 완료. 개인 장비 강화는 전공 기록과 별도로 보존한다."); talkingPortrait(20,1500); playWav("staredit\\wav\\m01-radio.wav",160); }
if(id==33) { print("[주인공 해병] 정비 단말기: 전투복 개량 완료. 장갑을 믿고 포위 속으로 들어가지는 않는다."); talkingPortrait(20,1500); playWav("staredit\\wav\\m01-radio.wav",160); }
if(id==34) { print("[주인공 해병] 최종 기록: 생존 확인, 통신 자료 보존, 임시 보급시설 확보. M02 — 고립된 전선으로 이어진다."); talkingPortrait(20,1500); playWav("staredit\\wav\\m01-radio.wav",160); }
if(id==35) { print("[주인공 해병] 통로를 다시 확인한다. 길이 막혔다면 이전 표식까지 돌아가 우회해야 한다."); talkingPortrait(20,1500); playWav("staredit\\wav\\m01-radio.wav",160); }
if(id==36) { print("[주인공 해병] 현장 기록을 복원했다. 이미 확보한 물자는 다시 지급되지 않는다."); talkingPortrait(20,1500); playWav("staredit\\wav\\m01-radio.wav",160); }
if(id==37) { print("[주인공 해병] 교전에서 빠져나왔다. 마지막 현장 기록 위치에서 다시 움직인다."); talkingPortrait(20,1500); playWav("staredit\\wav\\m01-radio.wav",160); }
if(id==38) { print("[마라 베일] 대피 명령을 수신했다. 착륙장까지 이동한다. 그곳에 도착하기 전에는 구조 완료가 아니다."); talkingPortrait(10,1500); playWav("staredit\\wav\\m01-radio.wav",160); }
if(id==39) { print("[이언 렌] 정비 자료를 챙겼다. 착륙장으로 이동한다."); talkingPortrait(7,1500); playWav("staredit\\wav\\m01-radio.wav",160); }
if(id==40) { print("[엘라 모로] 주민 여러분, 이동합니다. 군인이 통로를 확보했습니다."); talkingPortrait(15,1500); playWav("staredit\\wav\\m01-radio.wav",160); }
if(id==41) { print("[주인공 해병] 철수 실패 기록을 유지한 채 의식 회복 지점으로 이동한다. 구조하지 않은 인원에게 구조 전공을 부여하지 않는다."); talkingPortrait(20,1500); playWav("staredit\\wav\\m01-radio.wav",160); }
if(id==42) { print("[주인공 해병] 전력이 돌아왔다. 응급처치 키트와 최소 개량 자재를 확보했다."); talkingPortrait(20,1500); playWav("staredit\\wav\\m01-radio.wav",160); }
if(id==43) { print("[주인공 해병] 이곳에는 이미 회수한 물자만 남아 있다."); talkingPortrait(20,1500); playWav("staredit\\wav\\m01-radio.wav",160); }
if(id==44) { print("[주인공 해병] 교전 중에는 단말기를 사용하지 않는다. 남은 저그를 처리하거나 경로를 우회한다."); talkingPortrait(20,1500); playWav("staredit\\wav\\m01-radio.wav",160); }
if(id==45) { print("[노스 릿지 통제소] 탄약고 피격 경보. 남쪽 차폐벽으로 대피하라. 정비조 응답은 없다."); talkingPortrait(0,1500); playWav("staredit\\wav\\m01-radio.wav",160); } }
  function journal() {
    print(`M01 | 단계 ${phase} | 응급처치 키트 ${kits} | 폭약 ${explosives} (R 미해금)`);
    print(`군수자재 ${materials} | 특수부품 ${parts} | 소총 ${weaponTier} | 전투복 ${armorTier} | 숙련 ${experienceTier}`);
    print(`구조: 베일 ${maraState} / 렌 ${wrenState} / 모로 ${ellaState} | 군인 ${soldierCount} / 민간인 ${civilianCount}`);
    print("Q/F7 방어 자세 | W/F8 긴급 지혈 | G 조사·구조 | U 소총·B 전투복 개량 | I 기록 | F9 복원");
  }
  function save() {
    cpPhase=phase; cpMaterials=materials; cpParts=parts; cpKits=kits; cpExplosives=explosives;
    cpWeapon=weaponTier; cpArmor=armorTier; cpExperience=experienceTier; cpEquipment=equipmentFlags;
    cpIntel=intelFlags; cpMilestones=milestoneFlags; cpLoot=lootFlags; cpRoute=routeChoice;
    if (hero) cpHp=Math.max(10,hero.hp);
  }
  function advance(next:number,site:number) {
    phase=next; checkpointId=site; phaseAt=now(); watchdogAt=phaseAt+45*SECOND; save();
  }
  function cancelSkills() {
    qUntil=0; wUntil=0; stats(units.JimRaynorMarine).armor=armorTier;
    cameraOwner=0; cameraUntil=0;
  }
  function restoreJournal() {
    phase=cpPhase; materials=cpMaterials; parts=cpParts; kits=cpKits; explosives=cpExplosives;
    weaponTier=cpWeapon; armorTier=cpArmor; experienceTier=cpExperience; equipmentFlags=cpEquipment;
    intelFlags=cpIntel; milestoneFlags=cpMilestones; lootFlags=cpLoot; routeChoice=cpRoute;
    cancelSkills(); qReady=0; wReady=0; entered=-1; phaseAt=now(); watchdogAt=phaseAt+45*SECOND;
    stats(units.JimRaynorMarine).maxHp=experienceTier>0?55:40;
    stats(units.JimRaynorMarine).armor=armorTier;
    stats(P1).upgrades[upgrades.TerranInfantryWeapons]=weaponTier;
    if (hero) hero.hp=cpHp;
    if (checkpointId==0) moveUnit(P1,units.JimRaynorMarine,1,locations.Anywhere,locations.Barracks);
    if (checkpointId==1) moveUnit(P1,units.JimRaynorMarine,1,locations.Anywhere,locations.Inner);
    if (checkpointId==2) moveUnit(P1,units.JimRaynorMarine,1,locations.Anywhere,locations.Shelter);
    if (checkpointId==3) moveUnit(P1,units.JimRaynorMarine,1,locations.Anywhere,locations.Medical);
    if (checkpointId==4) moveUnit(P1,units.JimRaynorMarine,1,locations.Anywhere,locations.Settlement);
    if (checkpointId==5) moveUnit(P1,units.JimRaynorMarine,1,locations.Anywhere,locations.Relay);
    if (checkpointId==6) moveUnit(P1,units.JimRaynorMarine,1,locations.Anywhere,locations.Supply);
    if (hero) { hero.locate(locations.Focus); centerView(locations.Focus); }
    radio(36);
  }
  function shot(id:number) {
    if (cameraOwner==0) {
      cameraOwner=id; cameraUntil=now()+2*SECOND;
      if (id==1) centerView(locations.Outer);
      if (id==2) centerView(locations.Crash);
      if (id==3) centerView(locations.Ammo);
    }
  }
  function wake(skipped:boolean) {
    if (collapseCompletions==0) {
      cancelSkills(); collapseCompletions=1; sceneSkipped=skipped; sceneState=skipped?4:3;
      // Finish the same physical wreck state without granting optional rescue records.
      if (ammo) ammo.kill();
      if (ship) ship.kill();
      ammoExploded=true; dropshipCrashed=true;
      for (const foe of unitsOf(P2,{type:units.ZergZergling})) foe.remove();
      for (const foe of unitsOf(P6,{type:units.ZergHydralisk})) foe.remove();
      for (const foe of unitsOf(P7,{type:units.ZergHydralisk})) foe.remove();
      for (const ally of unitsOf(P3,{type:units.TerranMarine})) ally.remove();
      for (const facility of unitsOf(P3,{type:units.TerranBarracks})) facility.kill();
      for (const facility of unitsOf(P3,{type:units.TerranFactory})) facility.kill();
      for (const facility of unitsOf(P3,{type:units.TerranMissileTurret})) facility.kill();
      if (maraState==0 && mara) mara.remove();
      if (wrenState==0 && wren) wren.remove();
      for (const ally of unitsOf(P4)) ally.remove();
      for (const ally of unitsOf(P5)) ally.remove();
      maraMoving=false; wrenMoving=false; civMoving=false; soldiersMoving=false;
      qUnlocked=true; wUnlocked=false;
      moveUnit(P1,units.JimRaynorMarine,1,locations.Anywhere,locations.Medical);
      if (hero) hero.hp=12;
      milestoneFlags=milestoneFlags|1;
      radio(skipped?41:16);
      advance(10,3); centerView(locations.Medical);
    }
  }
  function makeTransfer() {
    bonusMaterials=Math.min(99,10+(soldierCount>0?5:0)+(routeChoice==2?10:0));
    bonusParts=Math.min(7,(wrenState==1?1:0)+((equipmentFlags&4)>0?1:0));
    earlyWarning=(maraState==1 || routeChoice==1)?1:0;
    transferA=maraState+wrenState*4+ellaState*16+routeChoice*64+Math.min(15,soldierCount)*256+Math.min(7,civilianCount)*4096;
    transferB=equipmentFlags+weaponTier*8+armorTier*32+experienceTier*128+intelFlags*512+milestoneFlags*4096;
    transferC=bonusMaterials+bonusParts*128+Math.min(7,kits)*1024+Math.min(3,explosives)*8192+earlyWarning*32768;
    transferCheck=(transferA*3+transferB*5+transferC*7+54)%9973;
  }
  function showTransfer() {
    print(`M02 진행 코드: TLM1-2:${transferA}:${transferB}:${transferC}:${transferCheck}`);
    print(`M02 혜택 | 자재 ${bonusMaterials} | 부품 ${bonusParts} | 조기경보 ${earlyWarning}`);
    print("코드는 수동 기록용이다. 독립 SCX 자동 전달과 실게임 입력·복원은 미검증이다. I: 다시 표시 / N: 임무 종료");
  }
  save(); centerView(locations.Barracks);

  while (true) {
    const frame=now();
    const interact=keyPressed(P1,"G");
    const qPress=keyPressed(P1,"Q") || keyPressed(P1,"F7");
    const wPress=keyPressed(P1,"W") || keyPressed(P1,"F8");
    const retry=keyPressed(P1,"F9");
    const skip=keyPressed(P1,"Escape");
    const inspect=keyPressed(P1,"I");

    if (!hero && recoveryAt==0 && !missionComplete) {
      cancelSkills(); recoveryAt=frame+3*SECOND; radio(37);
    }
    if ((!hero && recoveryAt>0 && frame>=recoveryAt) || (hero && retry && !missionComplete)) {
      if (!hero) {
        createUnit(P1,units.JimRaynorMarine,1,locations.Medical);
        await nextFrame();
        hero=first({owner:P1,type:units.JimRaynorMarine});
      }
      recoveryAt=0; restoreJournal();
    }
    if (cameraOwner>0 && frame>=cameraUntil) {
      if (hero) { hero.locate(locations.Focus); centerView(locations.Focus); }
      cameraOwner=0;
    }
    if (hero && inspect) { journal(); if (missionComplete) showTransfer(); }
    if (kits!=shownKits) { setResources(P1,"set",kits,"ore"); shownKits=kits; }
    if (explosives!=shownExplosives) { setResources(P1,"set",explosives,"gas"); shownExplosives=explosives; }
    if (hero && keyPressed(P1,"E")) print("E 잠김: 전술 연사는 M02에서 해금된다.");
    if (hero && keyPressed(P1,"R")) print("R 잠김: 폭약 설치는 M03에서 해금된다. M01에서는 폭약을 보관한다.");

    // Arrival is the rescue transaction. A dead or missing actor never receives credit.
    if (phase<10) {
      if (maraState==0 && maraMoving && mara && bring(P3,units.GuiMontagFirebat,locations.Evac,">=",1)) {
        maraState=1; maraMoving=false; mara.remove(); radio(23); save();
      }
      if (wrenState==0 && wrenMoving && wren && bring(P3,units.TerranSCV,locations.Evac,">=",1)) {
        wrenState=1; wrenMoving=false; wren.remove(); radio(24); save();
      }
      if (ellaState==0 && civMoving && ella && ella.x>=3520 && ella.x<=4032 && ella.y>=3520 && ella.y<=4032) {
        ellaState=1; ella.remove(); radio(25); save();
      }
      if (maraState==0 && !mara) { maraState=2; maraMoving=false; save(); }
      if (wrenState==0 && !wren) { wrenState=2; wrenMoving=false; save(); }
      if (ellaState==0 && !ella) { ellaState=2; save(); }
      if (soldiersMoving) {
        const arrived=count(P5,units.TerranMarine,locations.Evac);
        if (arrived>0) {
          soldierCount=Math.min(3,soldierCount+arrived);
          removeUnitAt(P5,units.TerranMarine,0,locations.Evac); radio(26); save();
        }
      }
      if (civMoving) {
        const arrived=count(P4,units.TerranCivilian,locations.Evac);
        if (arrived>0) {
          civilianCount=Math.min(5,civilianCount+arrived);
          removeUnitAt(P4,units.TerranCivilian,0,locations.Evac); save();
        }
      }
      if (hero && interact && phase>=3) {
        if (maraState==0 && mara && bring(P1,units.JimRaynorMarine,locations.MaraStart,">=",1)) { maraMoving=true; mara.order("move",locations.Evac); radio(38); }
        if (wrenState==0 && wren && bring(P1,units.JimRaynorMarine,locations.WrenStart,">=",1)) { wrenMoving=true; wren.order("move",locations.Evac); radio(39); }
        if (!soldiersMoving && bring(P1,units.JimRaynorMarine,locations.Soldiers,">=",1)) {
          soldiersMoving=true; for (const ally of unitsOf(P5)) ally.order("move",locations.Evac); radio(12);
        }
        if (!civMoving && (bring(P1,units.JimRaynorMarine,locations.Civilians,">=",1) || bring(P1,units.JimRaynorMarine,locations.EllaStart,">=",1))) {
          civMoving=true; for (const ally of unitsOf(P4)) ally.order("move",locations.Evac); radio(40);
        }
      }
    }

    if (hero && phase!=entered) {
      entered=phase;
      if (phase==0) { sceneState=1; radio(1); radio(2); setMissionObjectives("M01 마지막 생존자\n무기고 표식에서 G로 장비 확인. I로 현장 기록 확인."); if (wren) wren.order("patrol",locations.Workshop); }
      if (phase==1) { radio(3); setMissionObjectives("북부 감시초소를 조사하라. 표식에서 G."); }
      if (phase==2) { sceneState=2; radio(4); radio(5); setMissionObjectives("북부 외곽 방어선에 합류하라. 벙커와 아군의 실제 교전을 지원하라."); }
      if (phase==3) { radio(outerOutcome==1?6:7); radio(9); setMissionObjectives("내부 방어선으로 후퇴하라. 선택: 베일 하사와 고립 분대 구조."); }
      if (phase==4) { radio(8); radio(10); radio(11); setMissionObjectives("착륙장으로 이동하라. 선택: 렌, 모로와 고립 인원을 G로 대피시켜라. 실제 도착만 구조로 기록한다."); }
      if (phase==5) { radio(12); setMissionObjectives("착륙장 표식에서 G로 철수를 요청하라. 구조 인원의 도착을 기다릴 수 있다."); }
      if (phase==6) { radio(13); setMissionObjectives("수송선의 비상 착륙을 확인하라. 플레이어 조작은 유지된다."); }
      if (phase==7) { radio(wrenState==2?45:14); setMissionObjectives("탄약고 남쪽 차폐벽 뒤로 대피하라. 적의 공격과 탄약고 파괴 상태를 확인한다."); }
      if (phase==8) { radio(15); setMissionObjectives("차폐벽 안에서 G로 몸을 낮춰라. 폭발 이후 의식 회복 지점으로 전환한다."); }
      if (phase==10) { setMissionObjectives("파괴된 의료시설 표식에서 G. 의료 모듈과 응급처치 키트를 확보하라."); }
      if (phase==11) { radio(18); setMissionObjectives("정착지를 통과하고 보급 상자를 조사하라. 선택: 군사 자료·폐차량·제한 구역·북/남 우회로."); }
      if (phase==12) { setMissionObjectives("통신중계소를 조사하라. 통로를 지키는 저그를 제거한 뒤 표식에서 G."); }
      if (phase==13) { radio(20); radio(21); setMissionObjectives("임시 보급시설의 잔존 저그를 제거하라. 표식에서 G로 전원을 복구하라."); }
      if (phase==14) { radio(22); setMissionObjectives("보급시설 확보. U: 소총 개량 / B: 전투복 개량. 북쪽 출구 표식에서 G로 M02 연결 기록 작성."); }
      if (phase==15) { radio(34); setMissionObjectives("M01 완료. I로 진행 코드를 다시 확인하라. 코드를 기록한 뒤 N으로 임무를 종료하라."); showTransfer(); }
    }

    if (hero && !missionComplete) {
      if (phase==0 && interact && bring(P1,units.JimRaynorMarine,locations.Armory,">=",1)) { qUnlocked=true; advance(1,0); }
      else if (phase==1 && interact && bring(P1,units.JimRaynorMarine,locations.Outpost,">=",1)) { intelFlags=intelFlags|1; advance(2,0); }
      else if (phase==2) {
        if (!outerIssued) { outerIssued=true; for (const foe of unitsOf(P2,{type:units.ZergZergling})) foe.order("attack",locations.Outer); }
        if (bring(P1,units.JimRaynorMarine,locations.Outer,">=",1) && (!outer || outer.hp<outer.maxHp-70 || count(P2,units.ZergZergling)==0)) {
          outerOutcome=(!outer || outer.hp<outer.maxHp)?1:2;
          for (const ally of unitsOf(P3,{type:units.TerranMarine,at:locations.Outer})) ally.order("move",locations.Inner);
          shot(1); advance(3,1);
        }
      }
      else if (phase==3 && bring(P1,units.JimRaynorMarine,locations.Inner,">=",1)) {
        if (!innerIssued) { innerIssued=true; for (const foe of unitsOf(P6,{type:units.ZergHydralisk})) foe.order("attack",locations.Inner); }
        advance(4,1);
      }
      else if (phase==4 && bring(P1,units.JimRaynorMarine,locations.Evac,">=",1) && (!inner || inner.hp<inner.maxHp-70 || count(P6,units.ZergHydralisk)==0)) advance(5,2);
      else if (phase==5 && interact && bring(P1,units.JimRaynorMarine,locations.Evac,">=",1)) {
        if (ship) ship.order("move",locations.Crash);
        dropshipStarted=true; advance(6,2);
      }
      else if (phase==6) {
        if (!depotIssued) { depotIssued=true; for (const foe of unitsOf(P7,{type:units.ZergHydralisk})) foe.order("attack",locations.Ammo); }
        if (!ship || bring(P3,units.TerranDropship,locations.Crash,">=",1)) {
          // The briefing and workshop establish the leaking fuel system before this event.
          if (ship) ship.kill();
          dropshipCrashed=true; playWav("staredit\\wav\\tlm-blast.wav",750); shot(2); advance(7,2);
        }
      }
      else if (phase==7) {
        if ((!ammo || ammo.hp<ammo.maxHp-50 || count(P7,units.ZergHydralisk)==0) && bring(P1,units.JimRaynorMarine,locations.Shelter,">=",1)) {
          if (ammo) ammo.kill();
          ammoExploded=true; playWav("staredit\\wav\\tlm-blast.wav",750); shot(3); advance(8,2);
        }
      }
      else if (phase==8 && interact && bring(P1,units.JimRaynorMarine,locations.Shelter,">=",1)) wake(false);
      else if (phase==10 && interact && bring(P1,units.JimRaynorMarine,locations.Medical,">=",1)) {
        if ((lootFlags&1)==0) { lootFlags=lootFlags|1; equipmentFlags=equipmentFlags|1; kits+=3; materials+=8; wUnlocked=true; radio(17); }
        advance(11,3);
      }
      else if (phase==11 && bring(P1,units.JimRaynorMarine,locations.Settlement,">=",1)) {
        if (!settlementIssued) { settlementIssued=true; for (const foe of unitsOf(P2,{type:units.ZergHydralisk})) foe.order("attack",locations.Settlement); }
        if (interact) {
          if (count(P2,units.ZergHydralisk)==0) {
            if ((lootFlags&2)==0) { lootFlags=lootFlags|2; materials+=12; kits+=1; radio(42); }
            advance(12,4);
          } else radio(44);
        }
      }
      else if (phase==12 && bring(P1,units.JimRaynorMarine,locations.Relay,">=",1)) {
        if (!relayIssued) { relayIssued=true; for (const foe of unitsOf(P6,{type:units.ZergZergling})) foe.order("attack",locations.Relay); }
        if (interact) {
          if (count(P6,units.ZergZergling)==0) {
            equipmentFlags=equipmentFlags|2; intelFlags=intelFlags|2; milestoneFlags=milestoneFlags|2;
            experienceTier=1; stats(units.JimRaynorMarine).maxHp=55; radio(19); advance(13,5);
          } else radio(44);
        }
      }
      else if (phase==13 && bring(P1,units.JimRaynorMarine,locations.Supply,">=",1)) {
        if (!supplyIssued) { supplyIssued=true; for (const foe of unitsOf(P7,{type:units.ZergZergling})) foe.order("attack",locations.Supply); }
        if (interact) {
          if (count(P7,units.ZergZergling)==0) {
            if ((lootFlags&4)==0) { lootFlags=lootFlags|4; materials+=12; parts+=1; kits+=1; }
            milestoneFlags=milestoneFlags|4; advance(14,6);
          } else radio(44);
        }
      }
      else if (phase==14 && interact && bring(P1,units.JimRaynorMarine,locations.Exit,">=",1)) {
        missionComplete=true; phase=15; makeTransfer(); save();
      }

      if (phase>=10 && interact) {
        if (bring(P1,units.JimRaynorMarine,locations.Archive,">=",1) && (lootFlags&8)==0) { lootFlags=lootFlags|8; intelFlags=intelFlags|4; parts+=1; radio(27); save(); }
        if (bring(P1,units.JimRaynorMarine,locations.Salvage,">=",1) && (lootFlags&16)==0) { lootFlags=lootFlags|16; materials+=10; explosives+=1; radio(28); save(); }
        if (bring(P1,units.JimRaynorMarine,locations.Restricted,">=",1)) {
          if (!restrictedIssued) { restrictedIssued=true; for (const foe of unitsOf(P8,{at:locations.RestrictedFight})) foe.order("attack",locations.Restricted); }
          if ((lootFlags&32)==0 && count(P8,units.AnyUnit)==0) { lootFlags=lootFlags|32; equipmentFlags=equipmentFlags|4; parts+=1; radio(29); save(); }
        }
        if (routeChoice==0 && bring(P1,units.JimRaynorMarine,locations.NorthRoute,">=",1)) { routeChoice=1; radio(30); save(); }
        else if (routeChoice==0 && bring(P1,units.JimRaynorMarine,locations.SouthRoute,">=",1)) { routeChoice=2; materials+=6; radio(31); save(); }
      }
      if (phase>=10 && (bring(P1,units.JimRaynorMarine,locations.Relay,">=",1) || bring(P1,units.JimRaynorMarine,locations.Supply,">=",1))) {
        if (keyPressed(P1,"U") && weaponTier==0 && materials>=10) {
          materials-=10; weaponTier=1; stats(P1).upgrades[upgrades.TerranInfantryWeapons]=1; radio(32); save();
        }
        if (keyPressed(P1,"B") && armorTier==0 && materials>=12 && parts>=1 && qUntil==0) {
          materials-=12; parts-=1; armorTier=1; stats(units.JimRaynorMarine).armor=1; radio(33); save();
        }
      }
      if (skip && phase>=2 && phase<=8) wake(true);
      if (frame>=watchdogAt && phase>=2 && phase<=7) {
        radio(35); watchdogAt=frame+45*SECOND;
        if (phase==2) for (const foe of unitsOf(P2,{type:units.ZergZergling})) foe.order("attack",locations.Outer);
        if (phase==4) for (const foe of unitsOf(P6,{type:units.ZergHydralisk})) foe.order("attack",locations.Inner);
        if (phase==6 && ship) ship.order("move",locations.Crash);
        if (phase==7) for (const foe of unitsOf(P7,{type:units.ZergHydralisk})) foe.order("attack",locations.Ammo);
      }
    }

    if (hero && qUntil>0 && (frame>=qUntil || hero.speed>0 || hero.orderId==orders.Move || hero.x!=qX || hero.y!=qY)) {
      qUntil=0; stats(units.JimRaynorMarine).armor=armorTier; print("Q 종료: 기본 방호 상태 복귀");
    }
    if (hero && wUntil>0) {
      if (hero.speed>0 || hero.orderId==orders.Move || hero.x!=castX || hero.y!=castY || castHp-hero.hp>=5) {
        wUntil=0; print("W 중단: 키트와 쿨타임 소비 없음");
      } else if (frame>=wUntil) {
        hero.heal(25); kits--; wReady=frame+40*SECOND; wUntil=0; save(); print(`W 완료: 응급처치 키트 ${kits}`);
      }
    }
    if (hero && !missionComplete && (qPress || wPress)) {
      if (recoveryAt>0 || qUntil>0 || wUntil>0) print("스킬 대기: 다른 행동 진행 중");
      else if (qPress) {
        if (!qUnlocked) print("Q 잠김: 무기고 확인 필요");
        else if (frame<qReady) print("Q 대기: 쿨타임");
        else if (hero.speed>0 || hero.orderId==orders.Move) print("Q 대기: 먼저 정지");
        else { qX=hero.x; qY=hero.y; stats(units.JimRaynorMarine).armor=armorTier+2; qUntil=frame+6*SECOND; qReady=frame+18*SECOND; print("Q 방어 자세: 방호 +2, 이동 시 해제"); }
      } else {
        if (!wUnlocked) print("W 잠김: 의료 모듈 필요");
        else if (kits<1) print("W 차단: 응급처치 키트 부족");
        else if (frame<wReady) print("W 대기: 쿨타임");
        else if (hero.hp>=hero.maxHp) print("W 차단: 체력 최대");
        else if (hero.speed>0 || hero.orderId==orders.Move) print("W 대기: 먼저 정지");
        else { castHp=hero.hp; castX=hero.x; castY=hero.y; wUntil=frame+3*SECOND; print("W 긴급 지혈: 3초간 정지, 완료 시 키트 1개 소비"); }
      }
    }
    if (missionComplete && !victoryIssued && keyPressed(P1,"N")) { victoryIssued=true; victory(); }
    await nextFrame();
  }
},{owner:P1,name:"m01"});
