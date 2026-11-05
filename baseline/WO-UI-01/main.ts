import { program, first, unitsOf, createUnit, killUnitAt, moveUnit, centerView,
  print, keyPressed, nextFrame, stats, units, orders, playWav, P1, P2, P3, locations } from "trigscript";
import { now, SECOND } from "trigscript/timers";

// Build variants replace this constant before compilation.
const SKILL_LAB = false;

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
  print("THE LAST MARINE | Q/F7: brace | W/F8: first aid | ESC: skip | F9: checkpoint");

  while (true) {
    const frame = now();
    const qPress = keyPressed(P1, "Q") || keyPressed(P1, "F7");
    const wPress = keyPressed(P1, "W") || keyPressed(P1, "F8");
    const skip = keyPressed(P1, "Escape");
    const retry = keyPressed(P1, "F9");
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
        print("HERO DOWN | checkpoint recovery in 3 seconds");
      }
    }
    if ((!hero && retryAt > 0 && frame >= retryAt) || (retry && checkpoint == 1)) {
      if (hero) hero.remove();
      createUnit(P1, units.JimRaynorMarine, 1, locations.Safe);
      hero = first({ owner: P1, type: units.JimRaynorMarine });
      if (hero) hero.hp = 30;
      kits = 3;
      qUntil = 0;
      wUntil = 0;
      qReady = 0;
      wReady = 0;
      retryAt = 0;
      stats(units.JimRaynorMarine).armor = baseArmor;
      if (checkpoint == 0) recovery = 1;
      print("CHECKPOINT | canonical inventory and skill state restored");
    }

    if (!SKILL_LAB && sceneState == 2) {
      if (stage == 0) {
        for (const ally of unitsOf(P3, { type: units.TerranMarine })) ally.order("move", locations.Outer);
        print("[00] CONTROL: Routine watch. Check the northern perimeter.");
        stage = 1;
      }
      if (stage == 1 && elapsed >= 15 * SECOND) {
        print("[15] OUTPOST: Movement beyond the wire... signal lost.");
        stage = 2;
      }
      if (stage == 2 && elapsed >= 30 * SECOND) {
        for (const foe of unitsOf(P2)) foe.order("attack", locations.Outer);
        print("[30] CONTROL: Northern contact. Hold the bunker approach.");
        stage = 3;
      }
      if (stage == 3 && elapsed >= 45 * SECOND) {
        const bunker = first({ owner: P3, type: units.TerranBunker });
        if (!bunker || bunker.hp < bunker.maxHp) {
          print("[45] CONTROL: The outer line is breached. Fall back south.");
          for (const ally of unitsOf(P3, { type: units.TerranMarine })) ally.order("move", locations.Safe);
          for (const foe of unitsOf(P2)) foe.order("attack", locations.Relay);
          stage = 4;
        } else if (elapsed >= 60 * SECOND) {
          recovery = 1;
          for (const foe of unitsOf(P2)) foe.order("attack", locations.Outer);
        }
      }
      if (stage == 4 && elapsed >= 65 * SECOND) {
        print("[65] ENGINEER: Relay hit. Ammunition storage is burning.");
        stage = 5;
      }
      if (stage == 5 && elapsed >= 80 * SECOND) {
        const depot = first({ owner: P3, type: units.TerranSupplyDepot });
        if (!depot || depot.hp < depot.maxHp) {
          if (depot) depot.kill();
          cameraOwner = 1;
          centerView(locations.Relay);
          print("[80] CONTROL: Storage detonation. Take cover!");
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
        print(`SURVIVAL READY | scene=${sceneState} completions=${completed}`);
        print("Recover at the supply refuge. W/F8 is now unlocked.");
      }
    }

    if (hero && qUntil > 0 && (frame >= qUntil || hero.speed > 0 || hero.orderId == orders.Move || forced)) {
      stats(units.JimRaynorMarine).armor = baseArmor;
      qUntil = 0;
      print("Q ended | base armor restored");
    }
    if (hero && wUntil > 0) {
      if (hero.speed > 0 || hero.orderId == orders.Move || hero.x != castX || hero.y != castY || castHp - hero.hp >= 5 || forced) {
        wUntil = 0;
        print("W interrupted | no kit or cooldown consumed");
      } else if (frame >= wUntil) {
        hero.heal(25);
        kits--;
        wReady = frame + 40 * SECOND;
        wUntil = 0;
        print(`W completed | kits=${kits}`);
      }
    }
    if (qPress || wPress) {
      if (!hero || retryAt > 0) print("BLOCKED: hero unavailable");
      else if (paused || forced) print("BLOCKED: forced cinematic control");
      else if (qUntil > 0 || wUntil > 0) print("BLOCKED: another skill active");
      else if (qPress) {
        if (!qUnlocked) print("BLOCKED: Q locked");
        else if (frame < qReady) print("BLOCKED: Q cooldown");
        else if (hero.speed > 0 || hero.orderId == orders.Move) print("BLOCKED: stop moving before Q");
        else {
          stats(units.JimRaynorMarine).armor = baseArmor + 2;
          qUntil = frame + 6 * SECOND;
          qReady = frame + 18 * SECOND;
          print("Q active | armor +2 | movement cancels");
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
          print("W casting | 3 seconds | movement or 5 damage interrupts");
        }
      }
    }
    if (frame >= hudAt) {
      const qLeft = Math.max(0, Math.ceil((qReady - frame) / SECOND));
      const wLeft = Math.max(0, Math.ceil((wReady - frame) / SECOND));
      print(`Q/F7 brace ${qLeft}s | W/F8 first aid ${wUnlocked ? "unlocked" : "locked"} ${wLeft}s | kits ${kits}`);
      hudAt = frame + 5 * SECOND;
    }
    await nextFrame();
  }
}, { owner: P1, name: "poc" });
