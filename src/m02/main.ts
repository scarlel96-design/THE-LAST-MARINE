import {program, first, unitsOf, countUnits as count, bring, createUnit, moveUnit, centerView, print,
 keyPressed, nextFrame, stats, units, upgrades, orders, playWav, setMissionObjectives, talkingPortrait,
 victory, defeat, setResources, P1, P2, P3, P6, P12, locations} from "trigscript";
import {now,SECOND} from "trigscript/timers";

/* @START_DATA */

program(async ()=>{
 let phase=0, entered=-1, checkpoint=0, restored=0, introUntil=0;
 let materials=START_MATERIALS, parts=START_PARTS, kits=START_KITS, explosives=START_EXPLOSIVES;
 let weaponTier=START_WEAPON, armorTier=START_ARMOR, experience=START_EXPERIENCE;
 let shownKits=-1, shownExplosives=-1;
 let equipment=START_EQUIPMENT, intel=START_INTEL;
 let wrenStock=false, soldierSupport=false, fuse=false, eUnlocked=false, powered=false;
 let sealed=false, watch=false, motor=false, mineral=false, cache=false;
 let waveIssued=false, issuedCount=0, warningAt=0, nextOrder=0, waveLane=0, launchedWaves=0;
 let flags=0, resultB=0,resultC=0,resultCheck=0, ended=false;
 let recoveryAt=0, qUntil=0,qReady=0,wUntil=0,wReady=0,eUntil=0,eReady=0;
 let castX=0,castY=0,castHP=0;
 let hero=first({owner:P1,type:units.JimRaynorMarine});
 let reactor=first({owner:P3,type:units.TerranCommandCenter,at:locations.Reactor});
 let nest=first({owner:P2,type:units.ZergHatchery,at:locations.Nest});
 if(nest)nest.invincible=true;
 function radio(id:number){ /* @RADIO_TABLE */ }
 function applyGear(){
  stats(units.JimRaynorMarine).maxHp=experience>=2?65:55;
  stats(units.JimRaynorMarine).armor=armorTier;
  stats(P1).upgrades[upgrades.TerranInfantryWeapons]=weaponTier;
 }
 function locateHero(){
  if(hero){hero.locate(locations.Focus);centerView(locations.Focus);}
 }
 function go(next:number,site:number){
  phase=next;checkpoint=site;waveIssued=false;
  warningAt=now()+((watch||START_WARNING>0)?5:2)*SECOND;
  nextOrder=0;
 }
 function cancelSkill(){
  qUntil=0;wUntil=0;eUntil=0;
  stats(units.JimRaynorMarine).armor=armorTier;
  if(hero)hero.stim=0;
 }
 function restorePosition(){
  cancelSkill();introUntil=0;
  if(checkpoint==0)moveUnit(P1,units.JimRaynorMarine,1,locations.Anywhere,locations.Entry);
  else if(checkpoint==1)moveUnit(P1,units.JimRaynorMarine,1,locations.Anywhere,locations.Reactor);
  else if(checkpoint==2)moveUnit(P1,units.JimRaynorMarine,1,locations.Anywhere,locations.Garrison);
  else if(checkpoint==3)moveUnit(P1,units.JimRaynorMarine,1,locations.Anywhere,locations.Relay);
  else moveUnit(P1,units.JimRaynorMarine,1,locations.Anywhere,locations.Watch);
  restored++;locateHero();radio(21);
 }
 function raiders(){
  return count(P2,units.ZergZergling)+count(P2,units.ZergHydralisk);
 }
 function ordersForWave(){
  for(const foe of unitsOf(P2,{type:units.ZergZergling})){
   if(phase==4)foe.order("attack",locations.WestGate);
   else if(phase==5)foe.order("attack",locations.EastGate);
   else if(phase==8)foe.order("attack",locations.Garrison);
   else if(phase==9)foe.order("attack",locations.Nest);
  }
  for(const foe of unitsOf(P2,{type:units.ZergHydralisk})){
   if(phase==8)foe.order("attack",locations.Reactor);
   else if(phase==9)foe.order("attack",locations.Nest);
  }
 }
 function launch(){
  waveIssued=true;launchedWaves++;
  if(phase==4){
   waveLane=1;createUnit(P2,units.ZergZergling,8,locations.WestLane);issuedCount+=8;
  } else if(phase==5){
   if(sealed){waveLane=2;createUnit(P2,units.ZergZergling,7,locations.NorthLane);}
   else{waveLane=3;createUnit(P2,units.ZergZergling,7,locations.DrainLane);}
   issuedCount+=7;
  } else if(phase==8){
   waveLane=4;createUnit(P2,units.ZergZergling,9,locations.NorthLane);
   if(sealed)createUnit(P2,units.ZergHydralisk,5,locations.WestLane);
   else createUnit(P2,units.ZergHydralisk,5,locations.DrainLane);
   issuedCount+=14;
  }
 }
 function buildResult(){
  resultB=weaponTier+armorTier*4+experience*16+7*64;
  resultC=Math.min(255,materials)+Math.min(15,parts)*256+Math.min(15,kits)*4096+Math.min(7,explosives)*65536;
  resultCheck=(START_LEGACYA*3+resultB*5+resultC*7+START_LEGACYB*11+flags*13+71)%9973;
 }
 function journal(){
  print("M02 | 자재 "+materials+" | 부품 "+parts+" | 응급처치 키트 "+kits+" | 폭약 "+explosives);
  print("소총 "+weaponTier+" / 전투복 "+armorTier+" / 숙련 "+experience+" | 전공 "+flags);
  print("G 조사·복구 / Q·F7 방어 / W·F8 지혈 / E 연사 / U 소총 / B 전투복 / F9 현장 위치");
  if(phase==11)print("M03 진행 코드: TLM1-3:"+START_LEGACYA+":"+resultB+":"+resultC+":"+START_LEGACYB+":"+flags+":"+resultCheck);
 }

 applyGear();
 if(hero)hero.hp=START_CARRIED?55:45;
 centerView(locations.Wreck);introUntil=now()+SECOND;
 radio(1);
 if(START_ROUTE==1)radio(23);
 if(START_ROUTE==2)radio(24);
 if(START_MARA==2)radio(25);
 if(START_WREN==2)radio(26);
 if(START_ELLA==2)radio(27);
 while(true){
  const frame=now(), g=keyPressed(P1,"G"), retry=keyPressed(P1,"F9");
  if(introUntil>0&&(frame>=introUntil||g||keyPressed(P1,"Escape"))){introUntil=0;locateHero();}
  if(phase>=2&&phase<=10&&!reactor){cancelSkill();phase=90;}
  if(!hero&&phase<11){
   if(recoveryAt==0){cancelSkill();recoveryAt=frame+3*SECOND;}
   if(frame>=recoveryAt){
    createUnit(P1,units.JimRaynorMarine,1,locations.Entry);
    await nextFrame();
    hero=first({owner:P1,type:units.JimRaynorMarine});
    if(hero){applyGear();hero.hp=experience>=2?42:36;recoveryAt=0;restorePosition();}
    else recoveryAt=now()+SECOND;
   }
  } else if(hero&&retry&&phase<11)restorePosition();
  if(kits!=shownKits){shownKits=kits;setResources(P1,"set",kits,"ore");}
  if(explosives!=shownExplosives){shownExplosives=explosives;setResources(P1,"set",explosives,"gas");}
  if(keyPressed(P1,"I"))journal();
  if(entered!=phase){
   entered=phase;
   if(phase==0)setMissionObjectives("M02 고립된 전선\n남쪽 차량 잔해에서 G로 접속기를 회수하라.");
   if(phase==1)setMissionObjectives("배전기 표식에서 G로 주 전원을 연결하라.");
   if(phase==2)setMissionObjectives("군수창고에 접근하는 저그 정찰대를 제거하라. 창고 표식에서 G.");
   if(phase==3)setMissionObjectives("집결소 G로 방어 개시. 양쪽 벙커 사용 가능. 먼저 배수로·감시시설·차고·광물 야드·피난소를 조사할 수 있다.");
   if(phase==4){radio(START_MARA==1?7:8);setMissionObjectives("1차 방어: 서문. 배전기를 잃지 마라.");}
   if(phase==5){radio(9);setMissionObjectives(sealed?"2차 방어: 배수로 봉쇄로 적이 북동쪽을 돌아 동문으로 접근한다.":"2차 방어: 배수로에서 동문으로 접근하는 적을 막아라.");}
   if(phase==6){radio(10);setMissionObjectives("북동 중계소에서 G로 예비 회선을 연결하라.");}
   if(phase==7)setMissionObjectives("중계 기록을 확보했다. 집결소 G로 마지막 공격에 대비하라.");
   if(phase==8){radio(31);setMissionObjectives("3차 방어: 북문 저글링과 배전기로 우회하는 히드라리스크를 막아라.");}
   if(phase==9){radio(12);setMissionObjectives("북쪽 전초 군락. 방어 병력과 부화장을 제거하고 표식에서 G로 좌표를 회수하라.");}
   if(phase==10)setMissionObjectives("북쪽 진입로 표식에서 G. M03 계승 기록을 확정한다.");
   if(phase==11){radio(22);setMissionObjectives("M02 완료. I로 코드를 다시 확인하고 N으로 종료하라.");journal();}
   if(phase==90){radio(20);setMissionObjectives("배전기 파괴. N으로 종료하라.");}
   if(phase==91)setMissionObjectives("조우 병력 배치 오류. N으로 종료하고 맵을 다시 시작하라.");
  }
  if((phase==11||phase>=90)&&keyPressed(P1,"N")&&!ended){
   ended=true;if(phase==11)victory();else defeat();
  }
  if(hero&&phase<11){
   if(phase==0&&g&&bring(P1,units.JimRaynorMarine,locations.Wreck,">=",1)){
    fuse=true;materials+=8;radio(2);go(1,0);
   } else if(phase==1&&g&&fuse&&bring(P1,units.JimRaynorMarine,locations.Reactor,">=",1)){
    if(reactor){
     reactor.hp=reactor.maxHp;
     powered=true;
     for(const fort of unitsOf(P3,{type:units.TerranBunker})){fort.hp=fort.maxHp;fort.give(P1);}
     if(START_WREN==1&&!wrenStock){parts++;wrenStock=true;radio(3);}
     else radio(4);
     createUnit(P6,units.ZergZergling,4,locations.WestLane);issuedCount+=4;
     await nextFrame();
     if(count(P6,units.ZergZergling)==0)phase=91;
     else{
      for(const foe of unitsOf(P6,{type:units.ZergZergling}))foe.order("attack",locations.Depot);
      radio(5);go(2,1);
     }
    } else phase=90;
   } else if(phase==2&&g&&bring(P1,units.JimRaynorMarine,locations.Depot,">=",1)){
    if(count(P6,units.ZergZergling)==0){
     kits+=2;materials+=12;parts++;eUnlocked=true;equipment=equipment|8;
     if(START_SOLDIERS>0&&!soldierSupport){
      createUnit(P1,units.TerranMarine,START_SOLDIERS,locations.Garrison);
      soldierSupport=true;
     }
     radio(6);go(3,1);
    } else print("창고 접근로의 정찰대가 남아 있다.");
   } else if(phase==3&&g&&bring(P1,units.JimRaynorMarine,locations.Garrison,">=",1)){
    radio(30);go(4,2);
   } else if(phase==6&&g&&bring(P1,units.JimRaynorMarine,locations.Relay,">=",1)){
    if(reactor)reactor.hp=Math.min(reactor.maxHp,reactor.hp+250);
    const radioStation=first({owner:P12,type:units.TerranScienceFacility,at:locations.Relay});
    if(radioStation)radioStation.hp=radioStation.maxHp;
    powered=true;
    if((equipment&4)>0)radio(29);
    if((intel&4)>0)radio(28);
    flags=flags|2;intel=intel|8;radio(11);go(7,3);
   } else if(phase==7&&g&&bring(P1,units.JimRaynorMarine,locations.Garrison,">=",1)){
    go(8,2);
   } else if(phase==9&&(bring(P1,units.JimRaynorMarine,locations.NestLane,">=",1)||bring(P1,units.JimRaynorMarine,locations.Nest,">=",1))){
    if(!waveIssued){
     waveIssued=true;waveLane=5;
     if(nest)nest.invincible=false;
     createUnit(P2,units.ZergZergling,6,locations.NestLane);
     createUnit(P2,units.ZergHydralisk,4,locations.Nest);
     issuedCount+=10;await nextFrame();
     if(raiders()==0)phase=91;
     else{ordersForWave();nextOrder=now()+30*SECOND;}
    } else if(g&&bring(P1,units.JimRaynorMarine,locations.Nest,">=",1)&&!nest&&raiders()==0){
     flags=flags|4;intel=intel|16;experience=2;applyGear();radio(13);
     playWav("staredit\\wav\\tlm-blast.wav",750);
     go(10,4);
    }
   } else if(phase==10&&g&&bring(P1,units.JimRaynorMarine,locations.Extraction,">=",1)){
    buildResult();cancelSkill();phase=11;
   }

   if((phase==4||phase==5||phase==8)&&!waveIssued&&frame>=warningAt){
    launch();await nextFrame();
    if(raiders()==0)phase=91;
    else{ordersForWave();nextOrder=now()+30*SECOND;}
   } else if((phase==4||phase==5||phase==8)&&waveIssued&&raiders()==0){
    if(phase==4)go(5,2);
    else if(phase==5){
     powered=false;
     if(reactor)reactor.hp=Math.min(reactor.hp,reactor.maxHp-((equipment&4)>0?200:400));
     playWav("staredit\\wav\\tlm-blast.wav",750);go(6,2);
    }else{flags=flags|1;go(9,4);}
   }
   if((phase==4||phase==5||phase==8||phase==9)&&waveIssued&&frame>=nextOrder){
    ordersForWave();nextOrder=frame+30*SECOND;
   }

   if(g&&phase>=2&&phase<=8){
    if(!mineral&&bring(P1,units.JimRaynorMarine,locations.Mineral,">=",1)){
     mineral=true;flags=flags|128;materials+=14;parts++;radio(19);
    }
    if(!cache&&bring(P1,units.JimRaynorMarine,locations.Shelter,">=",1)){
     cache=true;flags=flags|64;kits+=START_ELLA==1?3:1;
     if(START_CIVILIANS>0)materials+=6;
     radio(START_ELLA==1?14:15);
    }
    if(powered&&!motor&&materials>=10&&bring(P1,units.JimRaynorMarine,locations.Motor,">=",1)){
     materials-=10;motor=true;flags=flags|32;
     createUnit(P1,units.TerranVulture,1,locations.Motor);radio(18);
    }
    if(phase<=3&&!sealed&&materials>=8&&bring(P1,units.JimRaynorMarine,locations.Drain,">=",1)){
     materials-=8;sealed=true;flags=flags|8;radio(16);
    }
    if(phase<=3&&!watch&&parts>0&&bring(P1,units.JimRaynorMarine,locations.Watch,">=",1)){
     const sensor=first({owner:P12,type:units.TerranMissileTurret,at:locations.Watch});
     if(sensor)sensor.hp=sensor.maxHp;
     parts--;watch=true;flags=flags|16;radio(17);
    }
   }
   if(powered&&phase>=2&&(bring(P1,units.JimRaynorMarine,locations.Depot,">=",1)||bring(P1,units.JimRaynorMarine,locations.Motor,">=",1))){
    const weaponCost=weaponTier==0?10:weaponTier==1?12:18;
    if(keyPressed(P1,"U")&&weaponTier<3&&materials>=weaponCost&&(weaponTier<2||parts>0)){
     materials-=weaponCost;if(weaponTier==2)parts--;weaponTier++;applyGear();print("소총 개량: "+weaponTier);
    }
    if(keyPressed(P1,"B")&&armorTier<2&&materials>=12&&parts>0&&qUntil==0){
     materials-=12;parts--;armorTier++;applyGear();print("전투복 개량: "+armorTier);
    }
   }

   const moving=hero.speed>0||hero.orderId==orders.Move||hero.x!=castX||hero.y!=castY;
   if(qUntil>0&&(frame>=qUntil||moving)){qUntil=0;applyGear();}
   if(eUntil>0&&(frame>=eUntil||moving)){eUntil=0;hero.stim=0;}
   if(wUntil>0){
    if(moving||hero.hp<=castHP-5){wUntil=0;print("지혈 중단. 키트 미사용.");}
    else if(frame>=wUntil){wUntil=0;hero.heal(25);kits--;wReady=frame+40*SECOND;print("지혈 완료. 키트 1개 사용.");}
   }
   if(qUntil==0&&wUntil==0&&eUntil==0&&hero.speed==0&&hero.orderId!=orders.Move){
    if((keyPressed(P1,"Q")||keyPressed(P1,"F7"))&&frame>=qReady){
     castX=hero.x;castY=hero.y;qUntil=frame+6*SECOND;qReady=frame+18*SECOND;
     stats(units.JimRaynorMarine).armor=armorTier+2;
    } else if((keyPressed(P1,"W")||keyPressed(P1,"F8"))&&frame>=wReady){
     if(kits>0&&hero.hp<hero.maxHp){castX=hero.x;castY=hero.y;castHP=hero.hp;wUntil=frame+3*SECOND;}
     else print("지혈: 키트가 필요하거나 체력이 가득 찼다.");
    } else if(keyPressed(P1,"E")){
     if(eUnlocked&&frame>=eReady){
      castX=hero.x;castY=hero.y;eUntil=frame+4*SECOND;eReady=frame+30*SECOND;hero.stim=24;print("전술 연사. 이동 시 해제.");
     }else print("전술 연사 잠김 또는 재사용 대기.");
    }
   }
   if(keyPressed(P1,"R"))print("R은 M03에서 해금. 현재 폭약은 보관한다.");
  }
  await nextFrame();
 }
},{owner:P1,name:"m02"});
