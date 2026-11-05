export const width=224,height=224;
export const zones=[
 ['Entry',26,179,42,191], ['Wreck',54,164,66,176],
 ['Reactor',92,149,108,165], ['Depot',69,144,81,158],
 ['Motor',124,152,138,166], ['Mineral',42,121,56,135],
 ['WestGate',72,121,86,135], ['EastGate',125,122,139,134],
 ['Drain',141,123,153,135], ['Shelter',151,150,163,162],
 ['Garrison',98,122,112,136], ['Watch',87,101,101,115],
 ['Relay',139,85,155,101], ['NorthLane',102,85,114,97],
 ['WestLane',47,105,61,117], ['DrainLane',150,108,164,120],
 ['Nest',121,49,137,61], ['NestLane',109,64,123,76],
 ['Extraction',142,28,156,42], ['Focus',2,2,4,4]
];
export const locations=zones.map(([name,l,t,r,b],i)=>({name,index:i+1,left:l*32,top:t*32,right:r*32,bottom:b*32}));
export const centres=Object.fromEntries(locations.map(z=>[z.name,{x:(z.left+z.right)/2,y:(z.top+z.bottom)/2}]));
export const placements=[];
const put=(id,type,owner,at,dx=0,dy=0,extra={})=>placements.push({id,type,owner,x:centres[at].x+dx,y:centres[at].y+dy,...extra});
put('p1-start',214,0,'Entry');put('hero',20,0,'Entry');
put('broken-convoy',109,11,'Wreck',-112,-64,{footprint:[3,2],hpPercent:48});
put('convoy-escort-wreck',109,11,'Wreck',144,80,{footprint:[3,2],hpPercent:50});
put('reactor',106,2,'Reactor',0,-160,{footprint:[4,3],hpPercent:48});
put('capacitor-a',109,11,'Reactor',-224,0,{footprint:[3,2],hpPercent:50});
put('capacitor-b',109,11,'Reactor',224,0,{footprint:[3,2],hpPercent:50});
put('munitions',109,11,'Depot',0,-128,{footprint:[3,2],hpPercent:45});
put('depot-wall',109,11,'Depot',-128,0,{footprint:[3,2]});
put('motor-factory',113,11,'Motor',0,-160,{footprint:[4,3],hpPercent:45});
put('motor-store',109,11,'Motor',176,64,{footprint:[3,2],hpPercent:50});
put('pump',110,11,'Drain',160,0,{footprint:[4,2],hpPercent:48});
put('civilian-refuge',112,11,'Shelter',0,-128,{footprint:[3,2],hpPercent:60});
put('watch-station',124,11,'Watch',0,-128,{footprint:[2,2],hpPercent:48});
put('broken-comms','Terran Science Facility',11,'Relay',0,-160,{footprint:[4,3],hpPercent:45});
put('west-bunker',125,2,'WestGate',0,-128,{footprint:[3,2],hpPercent:55});
put('east-bunker',125,2,'EastGate',0,-128,{footprint:[3,2],hpPercent:60});
put('garrison-barracks',111,11,'Garrison',176,-80,{footprint:[4,3],hpPercent:48});
put('mineral-shed',109,11,'Mineral',-128,-80,{footprint:[3,2],hpPercent:45});
put('zerg-burrow-node',131,1,'Nest',0,-128,{footprint:[4,3],hpPercent:50});
for(const at of ['Wreck','Reactor','Depot','Motor','Mineral','WestGate','EastGate','Drain','Shelter','Garrison','Watch','Relay','Nest','Extraction'])put('marker-'+at,'Terran Beacon',11,at);
export const routeChecks=[
 ['Entry','Wreck'],['Wreck','Reactor'],['Reactor','Depot'],['Depot','Motor'],
 ['Depot','Mineral'],['Mineral','WestGate'],['WestGate','Garrison'],['Motor','EastGate'],
 ['EastGate','Drain'],['Drain','Shelter'],['Garrison','Watch'],['Garrison','Reactor'],
 ['WestLane','WestGate'],['DrainLane','EastGate'],['NorthLane','Garrison'],
 ['Garrison','Relay'],['Relay','Nest'],['NestLane','Nest'],['Nest','Extraction'],
 ['WestLane','Depot'],['NorthLane','EastGate'],['WestLane','Reactor'],['DrainLane','Reactor'],['Watch','NestLane']
];
export const spawnZones=['Entry','WestLane','NorthLane','DrainLane','NestLane','Nest','Garrison','Motor'];
export const encounterBudget={scout:4,west:8,drain:7,thirdNorth:9,thirdFlank:5,counter:10,total:43};
