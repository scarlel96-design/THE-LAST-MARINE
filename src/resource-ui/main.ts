import { program, first, unitsOf, createUnit, killUnitAt, moveUnit, centerView,
  print, keyPressed, nextFrame, stats, units, orders, playWav, P1, P2, P3, locations, setResources, ui } from "trigscript";
import { now, SECOND } from "trigscript/timers";

// Build variants replace this constant before compilation.
const SKILL_LAB = true;

program(async () => {
  let sceneState = 1;
  let checkpoint = 0;
  let stage = 0;
  let completed = 0;
  let recovery = 0;
  let cameraOwner = 0;
  let forced = false;
  let paused = false;
  let qUnlocked = true;
  let wUnlocked = SKILL_LAB;
  let kits = 3;
  let explosives = 2;
  let rUntil = 0;
  let rReady = 0;
  let installed = 0;
  let rX = 0;
  let rY = 0;
  let mode = 0;
  let campaignKits = 0;
  let campaignExplosives = 0;
  let qLeft = 0;
  let wLeft = 0;
  let rLeft = 0;
  let notice = "RESOURCE UI DIAGNOSTIC: icons unchanged; not an approved replacement";
  function report(text: string) { notice = text; print(text); }
  ui.lines(P1, () => `WO-UI-01 진단용 | 아이콘 미교체 | UI 승인 전
응급처치 키트 [W/F8] : ${kits}개 | 치료 성공 시 1개 소비
전술 폭약 [R/L] : ${explosives}개 | 설치 성공 시 1개 소비
Q ${qLeft}s | W ${wLeft}s | R ${rLeft}s | 설치 ${installed}회
F9: 체크포인트 | D: 체력 10 시험 | C: RTS 전환 시험
${mode == 0 ? "생존 모드: 상단 수량은 진단용 복사본" : "지휘 모드: 미네랄/가스는 생산 자원"}
${notice}`);
  let qUntil = 0;
  let qReady = 0;
  let wUntil = 0;
  let wReady = 0;
  let castHp = 0;
  let castX = 0;
  let castY = 0;
  let baseArmor = 0;
  let retryAt = 0;
  let hudAt = 0;
  let epoch = now();
  let hero = first({ owner: P1, type: units.JimRaynorMarine });
  stats(units.JimRaynorMarine).armor = 0;
  stats(units.JimRaynorMarine).maxHp = 40;
  if (hero) hero.hp = 30;
  baseArmor = stats(units.JimRaynorMarine).armor;
  sceneState = SKILL_LAB ? 3 : 2;
  if (SKILL_LAB) checkpoint = 1;
  centerView(locations.Home);
  report("THE LAST MARINE | Q/F7: brace | W/F8: first aid | ESC: skip | F9: checkpoint");

  while (true) {
    const frame = now();
    const qPress = keyPressed(P1, "Q") || keyPressed(P1, "F7");
    const wPress = keyPressed(P1, "W") || keyPressed(P1, "F8");
    const skip = keyPressed(P1, "Escape");
    const retry = keyPressed(P1, "F9");
    const rPress = keyPressed(P1, "R") || keyPressed(P1, "L");
    const damageProbe = keyPressed(P1, "D");
    const commandProbe = keyPressed(P1, "C");
    if (damageProbe && hero && mode == 0) { hero.hp = 10; report("TEST DAMAGE | HP=10"); }
    if (commandProbe && mode == 0 && qUntil == 0 && wUntil == 0 && rUntil == 0) {
      campaignKits = kits;
      campaignExplosives = explosives;
      mode = 1;
      setResources(P1, "set", 500, "ore");
      setResources(P1, "set", 250, "gas");
      report("RTS | inventory snapshot kept; production resources=500/250");
    }
    const elapsed = frame - epoch;

    // A dead unit reference never identifies its reused engine slot.
    if (!hero) {
      if (retryAt == 0) {
        qUntil = 0;
        wUntil = 0;
        stats(units.JimRaynorMarine).armor = baseArmor;
        cameraOwner = 0;
        forced = false;
        retryAt = frame + 3 * SECOND;
        report("HERO DOWN | checkpoint recovery in 3 seconds");
      }
    }
    if ((!hero && retryAt > 0 && frame >= retryAt) || (retry && checkpoint == 1)) {
      // Reuse a live hero; acquire a newly created hero after the next frame.
      if (hero) {
        moveUnit(P1, units.JimRaynorMarine, 1, locations.Anywhere, locations.Safe);
      } else {
        createUnit(P1, units.JimRaynorMarine, 1, locations.Safe);
        await nextFrame();
        hero = first({ owner: P1, type: units.JimRaynorMarine });
      }
      centerView(locations.Safe);
      if (hero) hero.hp = 30;
      kits = 3;
      explosives = 2;
      rUntil = 0;
      rReady = 0;
      installed = 0;
      qUntil = 0;
      wUntil = 0;
      qReady = 0;
      wReady = 0;
      retryAt = 0;
      stats(units.JimRaynorMarine).armor = baseArmor;
      if (checkpoint == 0) recovery = 1;
      report("CHECKPOINT | canonical inventory and skill state restored");
    }

    if (!SKILL_LAB && sceneState == 2) {
      if (stage == 0) {
        for (const ally of unitsOf(P3, { type: units.TerranMarine })) ally.order("move", locations.Outer);
        report("[00] CONTROL: Routine watch. Check the northern perimeter.");
        stage = 1;
      }
      if (stage == 1 && elapsed >= 15 * SECOND) {
        report("[15] OUTPOST: Movement beyond the wire... signal lost.");
        stage = 2;
      }
      if (stage == 2 && elapsed >= 30 * SECOND) {
        for (const foe of unitsOf(P2)) foe.order("attack", locations.Outer);
        report("[30] CONTROL: Northern contact. Hold the bunker approach.");
        stage = 3;
      }
      if (stage == 3 && elapsed >= 45 * SECOND) {
        const bunker = first({ owner: P3, type: units.TerranBunker });
        if (!bunker || bunker.hp < bunker.maxHp) {
          report("[45] CONTROL: The outer line is breached. Fall back south.");
          for (const ally of unitsOf(P3, { type: units.TerranMarine })) ally.order("move", locations.Safe);
          for (const foe of unitsOf(P2)) foe.order("attack", locations.Relay);
          stage = 4;
        } else if (elapsed >= 60 * SECOND) {
          recovery = 1;
          for (const foe of unitsOf(P2)) foe.order("attack", locations.Outer);
        }
      }
      if (stage == 4 && elapsed >= 65 * SECOND) {
        report("[65] ENGINEER: Relay hit. Ammunition storage is burning.");
        stage = 5;
      }
      if (stage == 5 && elapsed >= 80 * SECOND) {
        const depot = first({ owner: P3, type: units.TerranSupplyDepot });
        if (!depot || depot.hp < depot.maxHp) {
          if (depot) depot.kill();
          cameraOwner = 1;
          centerView(locations.Relay);
          report("[80] CONTROL: Storage detonation. Take cover!");
          playWav("staredit\\wav\\tlm-blast.wav", 750);
          stage = 6;
        }
      }
      if (cameraOwner == 1 && elapsed >= 81 * SECOND) {
        if (hero) { hero.locate(locations.Focus); centerView(locations.Focus); }
        cameraOwner = 0;
      }
      if (skip || (elapsed >= 90 * SECOND && stage >= 6) || elapsed >= 110 * SECOND || !hero) {
        const normal = stage >= 6 && recovery == 0 && !!hero;
        sceneState = skip ? 4 : normal ? 3 : 5;
        // Every ending uses the same canonical world transition exactly once.
        killUnitAt(P3, units.TerranBunker, 0, locations.Anywhere);
        killUnitAt(P3, units.TerranSupplyDepot, 0, locations.Anywhere);
        killUnitAt(P3, units.TerranDropship, 0, locations.Anywhere);
        for (const foe of unitsOf(P2)) foe.remove();
        for (const ally of unitsOf(P3, { type: units.TerranMarine })) ally.remove();
        if (hero) moveUnit(P1, units.JimRaynorMarine, 1, locations.Anywhere, locations.Safe);
        qUntil = 0;
        wUntil = 0;
        qReady = 0;
        wReady = 0;
        kits = 3;
        stats(units.JimRaynorMarine).armor = baseArmor;
        wUnlocked = true;
        cameraOwner = 0;
        forced = false;
        checkpoint = 1;
        completed++;
        centerView(locations.Safe);
        report(`SURVIVAL READY | scene=${sceneState} completions=${completed}`);
        report("Recover at the supply refuge. W/F8 is now unlocked.");
      }
    }

    if (hero && qUntil > 0 && (frame >= qUntil || hero.speed > 0 || hero.orderId == orders.Move || forced)) {
      stats(units.JimRaynorMarine).armor = baseArmor;
      qUntil = 0;
      report("Q ended | base armor restored");
    }
    if (hero && wUntil > 0) {
      if (hero.speed > 0 || hero.orderId == orders.Move || hero.x != castX || hero.y != castY || castHp - hero.hp >= 5 || forced) {
        wUntil = 0;
        report("W interrupted | no kit or cooldown consumed");
      } else if (frame >= wUntil) {
        hero.heal(25);
        kits--;
        wReady = frame + 40 * SECOND;
        wUntil = 0;
        report(`W completed | kits=${kits}`);
      }
    }
    if (qPress || wPress) {
      if (!hero || retryAt > 0) print("BLOCKED: hero unavailable");
      else if (mode != 0) report("BLOCKED: command mode");
      else if (paused || forced) print("BLOCKED: forced cinematic control");
      else if (qUntil > 0 || wUntil > 0 || rUntil > 0) print("BLOCKED: another skill active");
      else if (qPress) {
        if (!qUnlocked) print("BLOCKED: Q locked");
        else if (frame < qReady) print("BLOCKED: Q cooldown");
        else if (hero.speed > 0 || hero.orderId == orders.Move) print("BLOCKED: stop moving before Q");
        else {
          stats(units.JimRaynorMarine).armor = baseArmor + 2;
          qUntil = frame + 6 * SECOND;
          qReady = frame + 18 * SECOND;
          report("Q active | armor +2 | movement cancels");
        }
      } else {
        if (!wUnlocked) print("BLOCKED: W locked");
        else if (kits < 1) print("BLOCKED: no medical kits");
        else if (frame < wReady) print("BLOCKED: W cooldown");
        else if (hero.hp >= hero.maxHp) print("BLOCKED: full health");
        else if (hero.speed > 0 || hero.orderId == orders.Move) print("BLOCKED: stop moving before W");
        else {
          castHp = hero.hp;
          castX = hero.x;
          castY = hero.y;
          wUntil = frame + 3 * SECOND;
          report("W casting | 3 seconds | movement or 5 damage interrupts");
        }
      }
    }
    // R tests installation consumption only. It applies no combat damage.
    if (rUntil > 0) {
      if (!hero || hero.speed > 0 || hero.orderId == orders.Move || hero.x != rX || hero.y != rY || forced) {
        rUntil = 0;
        report("R interrupted | no explosive or cooldown consumed");
      } else if (frame >= rUntil) {
        explosives--;
        installed++;
        rReady = frame + 60 * SECOND;
        rUntil = 0;
        report("R TEST installed | one explosive consumed | NO COMBAT EFFECT");
      }
    }
    if (rPress) {
      if (!hero || mode != 0 || forced || paused) report("BLOCKED: R state");
      else if (qUntil > 0 || wUntil > 0 || rUntil > 0) report("BLOCKED: another skill active");
      else if (explosives < 1) report("BLOCKED: no tactical explosives");
      else if (frame < rReady) report("BLOCKED: R cooldown");
      else if (hero.speed > 0 || hero.orderId == orders.Move) report("BLOCKED: stop moving before R");
      else {
        rX = hero.x;
        rY = hero.y;
        rUntil = frame + 3 * SECOND;
        report("R TEST installing | 3 seconds | no combat damage");
      }
    }
    qLeft = Math.max(0, Math.ceil((qReady - frame) / SECOND));
    wLeft = Math.max(0, Math.ceil((wReady - frame) / SECOND));
    rLeft = Math.max(0, Math.ceil((rReady - frame) / SECOND));
    if (mode == 0) {
      setResources(P1, "set", kits, "ore");
      setResources(P1, "set", explosives, "gas");
    }
    await nextFrame();
  }
}, { owner: P1, name: "poc" });
