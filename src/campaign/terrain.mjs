import assert from 'node:assert/strict';

function road(name,points,extent=2) {
 const stamps=[];
 for(let segment=1;segment<points.length;segment++){
  const [a,b]=points.slice(segment-1,segment+1);
  const count=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/3);
  for(let i=segment===1?0:1;i<=count;i++){
   const x=Math.round(a[0]+(b[0]-a[0])*i/count);
   const y=Math.round(a[1]+(b[1]-a[1])*i/count);
   stamps.push([name,x,y,14,extent]);
  }
 }
 return stamps;
}

// Use real terrain types and the editor's transition brush.
export const M01_BRUSHES = [
 ['northern rock ridge',18,69,3,10], ['north surveillance apron',40,92,14,5],
 ['outer trench banks',59,68,3,4], ['outer firing lane',60,86,15,4],
 ['inner bunker apron',76,103,14,6], ['mara ridge',102,65,3,6],
 ['industrial yard',101,90,14,6], ['ammo pad',118,87,14,4],
 ['eastern ravine',156,86,5,9], ['hangar approach',134,108,14,4],
 ['evacuation hardstand',118,118,14,5], ['civilian grove',99,125,6,4],
 ['barracks hardstand',40,140,14,7], ['barracks living area',27,130,6,4],
 ['armory apron',68,132,14,5], ['relay and archive apron',99,158,14,6],
 ['hospital rubble',31,164,15,5], ['abandoned settlement',64,161,4,5],
 ['quartermaster yard',156,152,14,7], ['restricted ravine',136,180,3,4],
 ['west basin',14,113,5,6], ['eastern road',166,133,14,5],
 ...road('barracks supply road',[[40,140],[52,140],[60,132],[68,132]],3),
 ...road('north patrol road',[[52,140],[49,124],[44,105],[40,92]]),
 ...road('internal ammunition road',[[76,103],[85,103],[96,94],[101,90],[118,87]],3),
 ...road('evacuation service road',[[101,90],[105,102],[110,112],[118,118],[134,108]]),
 ...road('surviving relay spur',[[91,157],[99,158],[110,160]])
];
export const M02_BRUSHES = [
 ['entry convoy track',34,185,14,6], ['southern wreck field',60,170,15,7],
 ['reactor apron',100,157,14,8], ['depot loading yard',75,151,14,6],
 ['motor pool hardstand',131,159,14,7], ['west mineral yard',49,128,15,6],
 ['west high ground',29,113,3,9], ['east escarpment',193,111,3,12],
 ['drain basin',147,129,4,7], ['west bank',67,96,5,6],
 ['north observation apron',94,108,14,5], ['north high ground',122,99,3,5],
 ['east choke',132,128,15,4], ['garrison bunker apron',105,129,14,6],
 ['relay hardstand',147,93,14,6], ['north ridge',172,67,3,9],
 ['zerg approach rock',119,71,15,7], ['nest basin',129,55,4,8],
 ['exit ridge road',149,35,14,7], ['northwest wash',77,64,5,9],
 ['south floodplain',175,188,5,12], ['eastern shelter grove',157,156,6,5],
 ['west gate apron',79,128,14,5],
 ...road('broken convoy road',[[34,185],[47,182],[54,177]]),
 ...road('cargo road',[[75,151],[89,157],[100,157],[116,160],[131,159]],3),
 ...road('west defence road',[[79,128],[90,131],[105,129],[112,140],[100,157]]),
 ...road('east defence road',[[131,159],[130,145],[132,128]]),
 ...road('watch access spur',[[105,129],[94,121],[94,108]]),
 ...road('broken north relay road',[[147,93],[150,81],[148,75]])
];

export function seeded(seed) {
 let state=seed>>>0;
 return ()=>((state=(Math.imul(state,1664525)+1013904223)>>>0)/4294967296);
}
export function auditTerrain(parsed,tileset,api,layout,units) {
 const {width:w,height:h,tiles}=parsed;
 const block=new Uint8Array(w*h), types={}, heights={};
 let cliffs=0, viewBlocks=0;
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){
  const i=y*w+x,tile=tiles[i],group=tileset.groups[(tile>>4)&0x7ff];
  const mega=api.megatileForTile(tileset,tile);
  assert(group&&mega>0&&mega*16+15<tileset.megatileFlags.length,'Invalid MTXM tile at '+x+','+y);
  types[group.index]=(types[group.index]??0)+1;
  const f=tileset.megatileFlags.subarray(mega*16,mega*16+16);
  const height=api.megatileHeight(tileset,mega);
  heights[height]=(heights[height]??0)+1;
  if(f.some(v=>(v&api.TileFlag.BlocksView)!==0))viewBlocks++;
  if(group.flags&api.GroupFlag.CliffEdge)cliffs++;
  block[i]=f.every(v=>(v&api.TileFlag.Walkable)!==0)?0:1;
 }
 const terrainBlock=block.slice();
 const problems=[];
 for(const unit of units){
  const tx=Math.floor(unit.x/32),ty=Math.floor(unit.y/32);
  assert(tx>=0&&tx<w&&ty>=0&&ty<h,'Out-of-bounds placement: '+unit.id);
  if(unit.air)continue;
  if(terrainBlock[ty*w+tx])problems.push('Ground unit on impassable terrain: '+unit.id+' at '+tx+','+ty);
  if(!unit.footprint)continue;
  const [fw,fh]=unit.footprint,x=Math.floor(unit.x/32-fw/2),y=Math.floor(unit.y/32-fh/2);
  for(let j=y;j<y+fh;j++)for(let i=x;i<x+fw;i++){
   if(i<0||j<0||i>=w||j>=h||terrainBlock[j*w+i])problems.push('Facility footprint crosses terrain: '+unit.id+' at '+i+','+j);
  }
  for(let j=y-1;j<=y+fh;j++)for(let i=x-1;i<=x+fw;i++)if(i>=0&&j>=0&&i<w&&j<h)block[j*w+i]=1;
 }
 const routes=[];
 for(const name of layout.spawnZones??[]){
  const {x,y}=layout.centres[name],tx=Math.floor(x/32),ty=Math.floor(y/32);
  for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)
   if(block[(ty+dy)*w+tx+dx])problems.push('Spawn apron lacks 3x3 clearance: '+name);
 }
 for(const [from,to] of layout.routeChecks){
  const a=layout.centres[from],b=layout.centres[to];
  const start=Math.floor(a.y/32)*w+Math.floor(a.x/32),end=Math.floor(b.y/32)*w+Math.floor(b.x/32);
  if(block[start]||block[end]){problems.push('Blocked route endpoint: '+from+' -> '+to);continue;}
  const q=[start],dist=new Int32Array(w*h).fill(-1);dist[start]=0;
  for(let head=0;head<q.length&&dist[end]<0;head++){
   const at=q[head],x=at%w,y=Math.floor(at/w);
   for(const [xx,yy] of [[x-1,y],[x+1,y],[x,y-1],[x,y+1]]){
    if(xx<1||yy<1||xx>=w-1||yy>=h-1)continue;
    const next=yy*w+xx;
    if(block[next]||dist[next]>=0)continue;
    dist[next]=dist[at]+1;q.push(next);
   }
  }
  if(dist[end]<0)problems.push('Disconnected VF4 route: '+from+' -> '+to);
  routes.push({from,to,steps:dist[end]});
 }
 assert(problems.length===0,problems.join('\n'));
 const blockedTiles=terrainBlock.reduce((a,b)=>a+b,0);
 assert(Object.keys(heights).length>=2&&blockedTiles>0,'Expected elevation and terrain obstacles');
 return {types,heights,cliffFlagTiles:cliffs,viewFlagTiles:viewBlocks,blockedTiles,routes,method:'All 16 VF4 minitiles walkable; one-tile structure clearance; four-neighbor reachability. Engine pathfinding NOT RUN.'};
}
