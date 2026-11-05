// Use the editor transition brush. Never replace height transitions with raw tiles.
const road=(name,points,extent=2)=>points.slice(1).flatMap((b,k)=>{
 const a=points[k],n=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/3);
 return Array.from({length:n+1},(_,i)=>[name,Math.round(a[0]+(b[0]-a[0])*i/n),Math.round(a[1]+(b[1]-a[1])*i/n),14,extent]);
});
export const roads=[
 ['Main logistics',[[40,132],[62,123],[84,116],[98,117],[114,104],[144,112]],3],
 ['Northern duty',[[40,132],[38,111],[38,78],[40,50]],2],
 ['Perimeter withdrawal',[[40,50],[48,60],[60,68],[69,78],[80,90],[96,107],[116,126],[144,112]],3],
 ['Industrial service',[[80,90],[94,89],[114,104],[134,95]],3],
 ['Ammunition supply',[[114,104],[120,92],[120,78]],2],
 ['Civilian evacuation',[[134,136],[146,134],[150,126],[144,112]],3],
 ['Cargo circuit',[[56,106],[68,112],[84,116],[108,118],[130,120]],2],
 ['Medical evacuation',[[116,126],[109,139],[90,145],[66,151],[44,153],[30,165]],2],
 ['Survival supply',[[30,165],[66,161],[100,163],[125,153],[156,152],[167,131]],2],
 ['Archive spur',[[90,138],[100,150],[100,163]],2],
 ['Southern salvage',[[30,165],[40,177],[50,180],[82,178],[100,163]],2],
 ['Heat shield cache',[[156,152],[151,164],[136,172]],2]
];
export const ASTRA_BRUSHES=[
 ['West observation ridge',15,50,3,12],['North ravine lip',66,24,3,14],
 ['Northeast ridge',121,30,3,14],['Eastern escarpment',177,67,3,13],
 ['Northern attack divider',79,55,3,6],['Eastern approach divider',104,65,3,6],
 ['Western basin',14,111,5,10],['Eastern drainage',172,88,5,7],
 ['Southern floodplain',103,185,5,4],['Southern rock',18,185,3,5],
 ['Quarters grove',27,133,6,5],['Civilian green',151,138,6,3],
 ['Western scrub',23,72,6,4],['Northern worn ground',42,34,15,4],
 ['Outer gun apron',60,68,14,9],['Inner gun apron',80,90,14,8],
 ['Command yard',84,116,14,8],['Barracks yard',40,132,14,10],
 ['Armory apron',62,123,14,6],['Industry apron',114,104,14,10],
 ['Motor pool',134,95,14,7],['Ammunition court',120,78,14,7],
 ['Landing hardstand',144,112,14,9],['Civil settlement',134,136,14,9],
 ['Medical court',30,165,14,7],['Relay court',100,163,14,9],
 ['Reserve supply',156,152,14,10],['Shelter court',116,126,14,7],
 ['Restricted platform',136,172,14,7],['Archive platform',90,138,14,6],
 ['Abandoned residential',66,161,4,7],['Salvage rubble',50,180,15,6],
 ['North route dirt',78,146,15,4],
 ...roads.flatMap(([name,p,e])=>road(name,p,e))
];
