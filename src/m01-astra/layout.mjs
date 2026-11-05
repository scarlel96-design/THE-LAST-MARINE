// Coordinates are tile intersections. Owners use the CHK zero-based index.
export const width=192, height=192;
export const zones=[
 ['Barracks',28,120,52,144],['Armory',54,116,70,130],
 ['Outpost',32,42,48,58],['Outer',50,60,70,76],
 ['Inner',70,82,90,98],['MaraStart',68,70,76,78],
 ['Workshop',104,94,124,114],['WrenStart',112,98,120,106],
 ['Soldiers',90,100,102,114],['Civilians',126,128,142,144],
 ['EllaStart',130,132,138,140],['Evac',136,104,152,120],
 ['Inbound',166,103,180,117],['Crash',155,96,165,106],
 ['Ammo',112,72,128,84],['Shelter',110,120,122,132],
 ['Medical',20,156,40,174],['Settlement',56,152,76,170],
 ['Relay',90,152,110,174],['Supply',146,142,166,162],
 ['Exit',160,124,174,138],['Archive',84,132,96,144],
 ['Salvage',44,174,56,186],['Restricted',128,164,144,180],
 ['NorthRoute',72,142,84,150],['SouthRoute',76,174,88,182],
 ['OuterReserve',28,20,40,32],['InnerReserve',88,40,100,52],
 ['DepotReserve',145,52,159,64],['SettlementFight',60,148,78,168],
 ['RelayFight',94,148,112,170],['SupplyFight',142,138,168,162],
 ['RestrictedFight',126,162,146,182],['Focus',2,2,4,4],
 ['Command',76,108,92,124],['MotorPool',126,88,142,102],
 ['Artillery',86,74,102,86],['CargoWest',52,102,60,110],
 ['CargoEast',126,116,134,124],['PatrolWest',34,74,42,82],
 ['PatrolEast',54,86,62,94],['ScoutReserve',20,28,28,36],
 ['ScoutContact',28,36,36,44],['CivilSafe',142,130,150,138],
 ['RefugeEntry',106,128,114,136],['RelayReserve',117,183,123,189],
 ['SupplyReserve',172,173,180,181],['SettlementReserve',76,158,84,166],
 ['RestrictedReserve',169,169,175,175],['TourHQ',76,108,92,124],
 ['TourIndustry',104,94,142,114],['TourDefence',50,60,70,76]
];
export const locations=zones.map(([name,x1,y1,x2,y2],i)=>({name,index:i+1,left:x1*32,top:y1*32,right:x2*32,bottom:y2*32}));
export const centres=Object.fromEntries(locations.map(z=>[z.name,{x:(z.left+z.right)/2,y:(z.top+z.bottom)/2}]));
export const placements=[];
function put(id,type,owner,x,y,extra={}){placements.push({id,type,owner,x:x*32,y:y*32,...extra});}
function building(id,type,x,y,footprint,role,extra={}){put(id,type,2,x,y,{footprint,role,...extra});}
put('start',214,0,40,132,{role:'Human starting slot'});
put('hero',20,0,40,132,{role:'Duty marine; player controlled'});
put('mara',10,2,72,74,{role:'Perimeter NCO; escort only after request'});
put('wren',7,2,116,102,{role:'Fuel and communications technician'});
put('ella',15,3,134,136,{role:'Civilian evacuation coordinator'});
building('barracks',111,46,125,[4,3],'Garrison quarters and deployment');
building('quarters-academy',112,33,125,[3,2],'Mess and training block');
building('quarters-store',109,34,139,[3,2],'Personal equipment storage');
building('command',106,84,112,[4,3],'North Ridge operations headquarters');
building('command-radio',107,89,112,[2,2],'Operations relay visual; no addon dependency');
building('armory',123,65,119,[3,2],'Rifle inspection and armor stores');
building('sensor',124,36,46,[2,2],'Northern observation sensor');
building('outpost-store',109,44,46,[3,2],'Watch rotation shelter');
building('outer-bunker',125,57,64,[3,2],'First firing position');
building('outer-east-bunker',125,66,65,[3,2],'East crossfire position');
building('inner-bunker',125,76,86,[3,2],'Second defensive line');
building('inner-east-bunker',125,86,86,[3,2],'Fallback firing position');
building('workshop',113,110,97,[4,3],'Vehicle repair; east service apron');
building('motor-armory',123,136,91,[3,2],'Vehicle spare parts');
building('motor-depot',109,130,98,[3,2],'Fuel store, separated from ammunition');
building('ammo-depot',109,120,75,[3,2],'Primary ammunition magazine');
building('ammo-secondary',109,126,76,[3,2],'Linked magazine; blast stage two');
building('ammo-control',124,113,76,[2,2],'Alarm station and defence');
building('landing-control',124,149,106,[2,2],'Landing control');
building('landing-store',109,138,118,[3,2],'Cargo unloading, outside pad');
building('hospital',112,25,159,[3,2],'Base medical annex; damaged during collapse');
building('refuge-clinic',112,139,140,[3,2],'Civilian treatment station');
building('civil-house-a',109,128,130,[3,2],'Civilian service shelter');
building('civil-house-b',109,141,131,[3,2],'Civilian service shelter');
building('shelter-access',112,111,124,[3,2],'Emergency shelter entrance; interior abstracted');
building('relay',122,106,160,[4,3],'Long-range communications relay');
building('relay-backup',109,94,166,[3,2],'Backup power and recorder');
building('supply',109,162,155,[3,2],'Reserve supply cache');
building('supply-command',106,163,145,[4,3],'Decommissioned logistics post');
building('archive',107,94,135,[2,2],'Operations archive terminal');
building('restricted',123,142,171,[3,2],'Heat-resistant equipment depot');
// Storage groups leave the road centerline and loading aisles clear.
for(const [i,x,y] of [[0,52,109],[1,60,109],[2,104,108],[3,122,118],[4,127,123],[5,152,158]])
 building('logistics-store-'+i,109,x,y,[3,2],'Supply storage with an open loading aisle');
for(const [i,x,y] of [[0,28,81],[1,30,88],[2,71,63],[3,92,83]])
 building('perimeter-sensor-'+i,124,x,y,[2,2],'Perimeter sight and anti-air');
// Each team has a separate duty area. No single line represents the garrison.
for(const [group,points] of [
 ['outer-guard',[[53,68],[55,71],[64,69],[67,72],[58,60],[63,61]]],
 ['inner-guard',[[73,90],[75,94],[83,90],[87,94],[79,82],[86,81]]],
 ['outpost-guard',[[38,48],[44,51]]],
 ['quarters-guard',[[43,130],[47,137],[35,134]]],
 ['command-guard',[[80,114],[88,117]]],
 ['landing-guard',[[139,110],[147,115]]]
])for(const [i,[x,y]] of points.entries())put(group+'-'+i,0,2,x,y,{role:group});
put('patrol-west',0,2,38,78,{role:'Patrol to PatrolEast; alternating duty loop'});
put('patrol-east',0,2,58,90,{role:'Patrol to PatrolWest; alternating duty loop'});
put('repair-west',7,2,107,102,{role:'Repair convoy staging; simulated service route'});
put('repair-east',7,2,121,106,{role:'Repair convoy staging; simulated service route'});
put('cargo-vulture',2,2,56,106,{role:'Logistics escort; not a cargo-carrying game mechanic'});
put('motor-goliath',3,2,134,96,{role:'Vehicle reserve; workshop defensive response'});
put('artillery-a',5,2,91,78,{role:'Mobile artillery; inner line withdrawal'});
put('artillery-b',5,2,98,81,{role:'Mobile artillery; rear guard'});
put('dropship',11,2,173,110,{air:true,role:'Inbound transport with reported fuel defect'});
for(const [i,[x,y]] of [[94,105],[99,109],[94,111]].entries())put('rescue-soldier-'+i,0,4,x,y,{role:'Isolated squad; arrival records rescue'});
for(const [i,[x,y]] of [[130,135],[138,134],[132,139],[136,141],[129,142]].entries())put('civilian-'+i,15,3,x,y,{role:'Civilian evacuee'});
for(const name of ['Armory','Outpost','MaraStart','WrenStart','Soldiers','Civilians','Workshop','Evac','Shelter','Medical','Settlement','Relay','Supply','Archive','Salvage','Restricted','NorthRoute','SouthRoute','Exit','Command']){
 const c=centres[name];put('beacon-'+name,'Terran Beacon',11,c.x/32,c.y/32,{role:'Interaction marker'});
}
// Fixed revealers cover friendly work areas. Enemy assembly areas lie outside them.
for(const [i,[x,y]] of [[41,133],[62,123],[84,116],[114,104],[134,136],[144,112],[80,90],[60,68],[40,50],[120,78]].entries())
 put('friendly-vision-'+i,'Map Revealer',0,x,y,{air:true,role:'Friendly base visibility; removed at collapse'});
export const encounterBudget={scouts:4,outer:18,inner:20,heavy:1,depot:14,survival:20,total:77,initial:0};
export const spawnZones=['ScoutReserve','OuterReserve','InnerReserve','DepotReserve','SettlementReserve','RelayReserve','SupplyReserve','RestrictedReserve'];
export const routeChecks=[['Barracks','Armory'],['Armory','Outpost'],['Outpost','Outer'],['Outer','Inner'],['Inner','Soldiers'],['Soldiers','Evac'],['Workshop','Shelter'],['Shelter','Medical'],['Medical','Settlement'],['Settlement','Relay'],['Relay','Supply'],['Supply','Exit'],['OuterReserve','Outpost'],['OuterReserve','Outer'],['InnerReserve','Inner'],['DepotReserve','Ammo'],['MaraStart','Evac'],['WrenStart','Evac'],['Civilians','Evac'],['Evac','Shelter'],['Relay','Archive'],['Medical','Salvage'],['Relay','NorthRoute'],['Relay','SouthRoute'],['Supply','Restricted'],['Barracks','Command'],['Command','Workshop'],['Workshop','MotorPool'],['Artillery','Inner'],['PatrolWest','PatrolEast'],['CargoWest','CargoEast'],['ScoutReserve','Outpost'],['SettlementReserve','Settlement'],['RelayReserve','Relay'],['SupplyReserve','Supply'],['RestrictedReserve','Restricted']];
