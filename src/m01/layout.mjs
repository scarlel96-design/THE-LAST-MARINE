// Author mission locations in tiles. Convert them to pixels at the build boundary.
export const width = 192;
export const height = 192;
export const zones = [
 ['Barracks',28,128,52,152], ['Armory',60,124,76,140],
 ['Outpost',32,84,48,100], ['Outer',48,78,72,94],
 ['Inner',66,94,86,110], ['MaraStart',76,88,84,96],
 ['Workshop',92,82,108,98], ['WrenStart',96,84,104,92],
 ['Soldiers',82,106,96,120], ['Civilians',94,118,106,130],
 ['EllaStart',98,124,104,130], ['Evac',110,110,126,126],
 ['Inbound',140,112,150,124], ['Crash',128,108,138,118],
 ['Ammo',112,82,124,92], ['Shelter',104,96,114,106],
 ['Medical',20,156,40,174], ['Settlement',56,152,76,170],
 ['Relay',90,152,110,174], ['Supply',146,142,166,162],
 ['Exit',160,124,174,138], ['Archive',84,132,96,144],
 ['Salvage',44,174,56,186], ['Restricted',128,164,144,180],
 ['NorthRoute',72,142,84,150], ['SouthRoute',76,174,88,182],
 ['OuterReserve',36,52,50,68], ['InnerReserve',78,62,90,76],
 ['DepotReserve',132,68,148,80], ['SettlementFight',60,148,78,168],
 ['RelayFight',94,148,112,170], ['SupplyFight',142,138,168,162],
 ['RestrictedFight',126,162,146,182], ['Focus',2,2,4,4],
];
export const locations = zones.map(([name,x1,y1,x2,y2],index)=>({name,index:index+1,left:x1*32,top:y1*32,right:x2*32,bottom:y2*32}));
export const centres = Object.fromEntries(locations.map(z=>[z.name,{x:(z.left+z.right)/2,y:(z.top+z.bottom)/2}]));
export const placements = [];
const put=(id,type,owner,at,dx=0,dy=0,extra={})=>placements.push({id,type,owner,x:centres[at].x+dx,y:centres[at].y+dy,...extra});
put('start',214,0,'Barracks'); put('hero',20,0,'Barracks');
put('mara',10,2,'MaraStart'); put('wren',7,2,'WrenStart');
put('ella',15,3,'EllaStart');
put('command',106,2,'Barracks',-160,-200,{footprint:[4,3]});
put('barracks',111,2,'Barracks',160,-160,{footprint:[4,3]});
put('armory',123,2,'Armory',160,0,{footprint:[3,2]});
put('sensor',124,2,'Outpost',-128,0,{footprint:[2,2]});
put('outer-bunker',125,2,'Outer',0,-96,{footprint:[3,2]});
put('inner-bunker',125,2,'Inner',0,-112,{footprint:[3,2]});
put('workshop',113,2,'Workshop',128,-112,{footprint:[4,3]});
put('ammo-depot',109,2,'Ammo',0,0,{footprint:[3,2]});
put('dropship',11,2,'Inbound',0,0,{air:true});
put('hospital',112,2,'Medical',-160,-96,{footprint:[3,2],hpPercent:45});
put('relay',122,2,'Relay',192,-80,{footprint:[4,3]});
put('supply',109,2,'Supply',192,96,{footprint:[3,2]});
put('supply-command',106,2,'Supply',224,-192,{footprint:[4,3]});
put('archive',107,2,'Archive',128,0,{footprint:[2,2]});
put('restricted',123,2,'Restricted',192,32,{footprint:[3,2]});
for(let i=0;i<4;i++)put('outer-guard-'+i,0,2,'Outer',-112+i*48,80);
for(let i=0;i<4;i++)put('inner-guard-'+i,0,2,'Inner',-112+i*48,64);
for(let i=0;i<3;i++)put('rescue-soldier-'+i,0,4,'Soldiers',-64+i*64,0);
for(let i=0;i<5;i++)put('civilian-'+i,15,3,'Civilians',-96+i*48,0);
for(let i=0;i<18;i++)put('outer-zerg-'+i,37,1,'OuterReserve',-128+(i%5)*56,-96+Math.floor(i/5)*56);
for(let i=0;i<20;i++)put('inner-zerg-'+i,38,5,'InnerReserve',-128+(i%5)*56,-96+Math.floor(i/5)*56);
for(let i=0;i<14;i++)put('depot-zerg-'+i,38,6,'DepotReserve',-112+(i%4)*56,-96+Math.floor(i/4)*56);
for(const [zone,n,owner,type] of [['SettlementFight',5,1,38],['RelayFight',5,5,37],['SupplyFight',6,6,37],['RestrictedFight',4,7,37]]) {
 for(let i=0;i<n;i++)put(zone+'-'+i,type,owner,zone,-96+(i%4)*64,-48+Math.floor(i/4)*64,{wounded:true});
}
// Keep road gaps wider than a building's placement box.
for(const [at,offsets] of [
 ['Barracks',[[-256,96],[-256,224],[256,224]]],
 ['Armory',[[-176,-160],[176,-160]]],
 ['Outer',[[-288,-128],[288,-128],[-288,128],[288,128]]],
 ['Inner',[[-320,-144],[320,-144]]],
 ['Workshop',[[-256,96],[256,128]]],
 ['Evac',[[-256,-160],[256,-160]]],
 ['Settlement',[[-256,-192],[256,192]]],
 ['Supply',[[-288,-128],[-288,128],[288,128]]]
])for(const [i,[x,y]] of offsets.entries())put(at+'-wall-'+i,109,2,at,x,y,{footprint:[3,2],prop:true});
put('quarters-academy',112,2,'Barracks',-320,-48,{footprint:[3,2]});
put('landing-control',124,2,'Evac',192,80,{footprint:[2,2]});
put('refuge-clinic',112,11,'Civilians',0,128,{footprint:[3,2]});
put('relay-backup',109,11,'Relay',-192,80,{footprint:[3,2],hpPercent:48});
for(const name of ['Armory','Outpost','MaraStart','WrenStart','Soldiers','Civilians','Workshop','Evac','Shelter','Medical','Settlement','Relay','Supply','Archive','Salvage','Restricted','NorthRoute','SouthRoute','Exit']) {
 put('beacon-'+name,'Terran Beacon',11,name);
}
export const encounterBudget={outer:18,inner:20,depot:14,survival:20,total:72};
export const routeChecks=[['Barracks','Armory'],['Armory','Outpost'],['Outpost','Outer'],['Outer','Inner'],['Inner','Soldiers'],['Soldiers','Evac'],['Workshop','Shelter'],['Shelter','Medical'],['Medical','Settlement'],['Settlement','Relay'],['Relay','Supply'],['Supply','Exit'],
 ['OuterReserve','Outpost'],['OuterReserve','Outer'],['InnerReserve','Inner'],['DepotReserve','Shelter'],
 ['MaraStart','Evac'],['WrenStart','Evac'],['Civilians','Evac'],['Evac','Shelter'],['Relay','Archive'],['Medical','Salvage'],['Relay','NorthRoute'],['Relay','SouthRoute'],['Supply','Restricted']];
