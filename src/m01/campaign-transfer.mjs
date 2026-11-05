// Detect typing errors. This checksum does not authenticate campaign records.
const personValues={unknown:0,survived:1,lost:2};
const personNames=['unknown','survived','lost'];
function integer(value,min,max,name) {
 if(!Number.isInteger(value)||value<min||value>max)throw new Error(`Invalid ${name}`);
 return value;
}
function person(value,name) {
 if(!Object.hasOwn(personValues,value))throw new Error(`Invalid ${name} status`);
 return personValues[value];
}
export function pack(state) {
 const mara=person(state.people.mara,'mara'),wren=person(state.people.wren,'wren'),ella=person(state.people.ella,'ella');
 const route=integer(state.choices.route,0,2,'route');
 const soldiers=integer(state.choices.soldiers,0,3,'soldiers');
 const civilians=integer(state.choices.civilians,0,5,'civilians');
 const equipment=integer(state.equipmentFlags,0,7,'equipment');
 const weapon=integer(state.hero.weaponTier,0,1,'weapon');
 const armor=integer(state.hero.armorTier,0,1,'armor');
 const experience=integer(state.hero.experienceTier,0,1,'experience');
 const intel=integer(state.intelFlags,0,7,'intel');
 const milestones=integer(state.milestoneFlags,0,7,'milestones');
 if(milestones!==7)throw new Error('M01 mandatory milestones are incomplete');
 if((equipment&3)!==3||(intel&2)===0||experience!==1)throw new Error('M01 completion state is inconsistent');
 const materials=integer(state.bonus.materials,0,99,'bonus materials');
 const parts=integer(state.bonus.parts,0,7,'bonus parts');
 const kits=integer(state.bonus.medicalKits,0,7,'bonus kits');
 const explosives=integer(state.bonus.explosives,0,3,'bonus explosives');
 const warning=integer(state.bonus.earlyWarning,0,1,'early warning');
 const a=mara+wren*4+ella*16+route*64+soldiers*256+civilians*4096;
 const b=equipment+weapon*8+armor*32+experience*128+intel*512+milestones*4096;
 const c=materials+parts*128+kits*1024+explosives*8192+warning*32768;
 return {a,b,c,check:(a*3+b*5+c*7+54)%9973};
}
export function encode(state) {
 const {a,b,c,check}=pack(state);
 return `TLM1-2:${a}:${b}:${c}:${check}`;
}
export function decode(code) {
 if(typeof code!=='string'||!/^TLM1-2:\d{1,5}:\d{1,5}:\d{1,5}:\d{1,4}$/.test(code.trim()))throw new Error('Unsupported code format, version, or target mission');
 const [,aa,bb,cc,dd]=code.trim().split(':');
 const a=integer(Number(aa),0,32767,'group A');
 const b=integer(Number(bb),0,65535,'group B');
 const c=integer(Number(cc),0,65535,'group C');
 const check=integer(Number(dd),0,9972,'checksum');
 if(check!==(a*3+b*5+c*7+54)%9973)throw new Error('Code checksum mismatch');
 const ps=[a&3,(a>>>2)&3,(a>>>4)&3];
 if(ps.some(v=>v>2))throw new Error('Reserved person status');
 const state={schemaVersion:1,sourceMission:1,targetMission:2,
  people:{mara:personNames[ps[0]],wren:personNames[ps[1]],ella:personNames[ps[2]]},
  choices:{route:(a>>>6)&3,soldiers:(a>>>8)&15,civilians:(a>>>12)&7},
  equipmentFlags:b&7,hero:{weaponTier:(b>>>3)&3,armorTier:(b>>>5)&3,experienceTier:(b>>>7)&3},
  intelFlags:(b>>>9)&7,milestoneFlags:(b>>>12)&15,
  bonus:{materials:c&127,parts:(c>>>7)&7,medicalKits:(c>>>10)&7,explosives:(c>>>13)&3,earlyWarning:(c>>>15)&1}};
 const canonical=pack(state);
 if(canonical.a!==a||canonical.b!==b||canonical.c!==c)throw new Error('Reserved bits or invalid fields');
 return state;
}
export function m02Start(state) {
 // This host-side adapter is not an SCX input UI or a live cross-map restoration.
 const restored=decode(encode(state));
 return {schemaVersion:1,missionId:2,hero:restored.hero,people:restored.people,
  inventory:{materials:20+restored.bonus.materials,specialParts:restored.bonus.parts,medicalKits:restored.bonus.medicalKits,explosives:restored.bonus.explosives},
  records:{milestoneFlags:restored.milestoneFlags,intelFlags:restored.intelFlags},
  support:{earlyWarning:restored.bonus.earlyWarning,civilianSupplyRoute:restored.people.ella==='survived'},
  liveValidation:'NOT RUN'};
}
