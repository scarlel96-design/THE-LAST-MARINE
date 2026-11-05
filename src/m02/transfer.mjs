import {decode,pack,m02Start} from '../m01/campaign-transfer.mjs';

export function resolveM02(code) {
 if(code===undefined)return {
  carried:false,legacyA:0,legacyB:0,route:0,soldiers:0,civilians:0,
  mara:0,wren:0,ella:0,weapon:0,armor:0,experience:1,equipment:3,intel:2,
  materials:20,parts:0,kits:2,explosives:0,warning:0
 };
 const state=decode(code), base=m02Start(state), packed=pack(state);
 const person={unknown:0,survived:1,lost:2};
 return {
  carried:true,legacyA:packed.a,legacyB:packed.b,route:state.choices.route,
  soldiers:state.choices.soldiers,civilians:state.choices.civilians,
  mara:person[state.people.mara],wren:person[state.people.wren],ella:person[state.people.ella],
  weapon:base.hero.weaponTier,armor:base.hero.armorTier,experience:base.hero.experienceTier,
  equipment:state.equipmentFlags,intel:state.intelFlags,materials:base.inventory.materials,
  parts:base.inventory.specialParts,kits:base.inventory.medicalKits,explosives:base.inventory.explosives,
  warning:base.support.earlyWarning
 };
}

const checksum=({a,b,c,d,e})=>(a*3+b*5+c*7+d*11+e*13+71)%9973;
function legacy(a,d){
 if(d===0)return null;
 const {bonus,...record}=decode('TLM1-2:'+a+':'+d+':0:'+((a*3+d*5+54)%9973));
 return record;
}
function validate({a,b,c,d,e}) {
 for(const [label,val,max] of [['A',a,32767],['B',b,1023],['C',c,524287],['D',d,32767],['E',e,255]]) {
  if(!Number.isInteger(val)||val<0||val>max)throw Error('Invalid M03 group '+label);
 }
 if(d!==0)legacy(a,d);
 else if(a!==0)throw Error('M01 choice data requires a valid legacy record');
 if(((b>>>2)&3)>2||((b>>>4)&3)!==2||(b>>>6)!==7||(e&7)!==7)throw Error('M02 mandatory records are incomplete');
}
export function encodeM03(groups) {
 validate(groups);
 const {a,b,c,d,e}=groups;
 return 'TLM1-3:'+a+':'+b+':'+c+':'+d+':'+e+':'+checksum(groups);
}
export function decodeM03(code) {
 if(typeof code!=='string'||!/^TLM1-3:\d{1,5}:\d{1,4}:\d{1,6}:\d{1,5}:\d{1,3}:\d{1,4}$/.test(code.trim()))throw Error('Invalid M03 code format');
 const [a,b,c,d,e,check]=code.trim().split(':').slice(1).map(Number);
 const groups={a,b,c,d,e};validate(groups);
 if(check!==checksum(groups))throw Error('M03 checksum mismatch');
 const prior=legacy(a,d);
 return {
  schemaVersion:1,missionId:3,groups,
  inheritedM01:prior,
  hero:{weaponTier:b&3,armorTier:(b>>>2)&3,experienceTier:(b>>>4)&3,skills:b>>>6},
  equipmentFlags:(prior?.equipmentFlags??3)|8,
  intelFlags:(prior?.intelFlags??2)|8|16,
  inventory:{materials:c&255,parts:(c>>>8)&15,kits:(c>>>12)&15,explosives:(c>>>16)&7},
  records:{defended:!!(e&1),relayRecovered:!!(e&2),nestDestroyed:!!(e&4),drainSealed:!!(e&8),
   watchRestored:!!(e&16),motorRestored:!!(e&32),civilianCache:!!(e&64),mineralCache:!!(e&128)}
 };
}
