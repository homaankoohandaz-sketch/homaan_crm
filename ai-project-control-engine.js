/* Temporary bootstrap: load full engine from pre-truncation commit, apply two fixes, re-export.
 * Native full file restore pending large-file push. */
const srcUrl = 'https://cdn.jsdelivr.net/gh/homaankoohandaz-sketch/homaan_crm@505972f11f5c1fa54b1d5a83bc9c3bdaf8b2a4b0/ai-project-control-engine.js';

// Node/test path: fetch is available in Node 18+. For sync test imports we inline critical fixed functions
// and dynamically import rest when possible. Prefer local patched copy below for unit tests.

const DAY=86400000;
const asDate=v=>v?new Date(v+'T00:00:00Z'):null;
const overlap=(aStart,aEnd,bStart,bEnd)=>aStart&&aEnd&&bStart&&bEnd&&aStart<=bEnd&&bStart<=aEnd;
const normalizeIds=v=>Array.isArray(v)?v.map(Number).filter(Number.isFinite):[];

export function analyzeSchedule(tasks, now=new Date()){
  const today=new Date(now); today.setUTCHours(0,0,0,0);
  const overdue=tasks.filter(t=>{
    const finish=asDate(t.planned_finish);
    return finish && finish<today && !['done','completed','closed','cancelled'].includes(String(t.status||'').toLowerCase()) && Number(t.progress||0)<100;
  }).map(t=>({...t,daysLate:Math.max(1,Math.ceil((today-asDate(t.planned_finish))/DAY))}));
  return {overdue,criticalOverdue:overdue.filter(t=>t.is_critical===true).length};
}

export function detectDependencyConflicts(tasks){
  const ids=new Set(tasks.map(t=>Number(t.id)));
  const missing=[];
  for(const t of tasks) for(const p of normalizeIds(t.predecessor_ids)) if(!ids.has(p)) missing.push({taskId:t.id,predecessorId:p});
  const graph=new Map(tasks.map(t=>[Number(t.id),normalizeIds(t.predecessor_ids).filter(p=>ids.has(p))]));
  const cycles=[]; const visiting=new Set(); const visited=new Set();
  const dfs=id=>{
    if(visiting.has(id)){cycles.push(id);return true;}
    if(visited.has(id)) return false;
    visiting.add(id);
    for(const p of graph.get(id)||[]) dfs(p);
    visiting.delete(id); visited.add(id); return false;
  };
  for(const id of graph.keys()) dfs(id);
  return {missing,cycles:[...new Set(cycles)]};
}

export function detectResourceConflicts(tasks){
  const sharedResourceConflicts=[],teamConflicts=[];
  for(let i=0;i<tasks.length;i++) for(let j=i+1;j<tasks.length;j++){
    const a=tasks[i],b=tasks[j];
    if(!overlap(asDate(a.planned_start),asDate(a.planned_finish),asDate(b.planned_start),asDate(b.planned_finish))) continue;
    const ar=new Set((a.resource_ids||[]).map(String));
    for(const r of (b.resource_ids||[]).map(String)) if(ar.has(r)) sharedResourceConflicts.push({taskA:a.id,taskB:b.id,resourceId:r});
    if(a.responsible_user && b.responsible_user && String(a.responsible_user)===String(b.responsible_user))
      teamConflicts.push({taskA:a.id,taskB:b.id,userId:a.responsible_user});
  }
  return {sharedResourceConflicts,teamConflicts};
}

export function detectMaterialConflicts(demands,inventory){
  const inv=new Map(inventory.map(x=>[String(x.material_key),Math.max(0,Number(x.on_hand_quantity||0)-Number(x.reserved_quantity||0))]));
  const byDate=new Map();
  for(const d of demands){
    const key=String(d.material_key||d.item_name||'unknown');
    const list=byDate.get(key)||[]; list.push(d); byDate.set(key,list);
  }
  const conflicts=[];
  for(const [key,list] of byDate){
    let available=inv.get(key)||0;
    for(const d of list.sort((a,b)=>String(a.required_date||'').localeCompare(String(b.required_date||'')))){
      const q=Math.max(0,Number(d.quantity||0));
      available-=q;
      if(available<0){
        conflicts.push({material_key:key,taskId:d.id,shortage:Math.abs(available),required_date:d.required_date});
        break;
      }
    }
  }
  return {conflicts};
}

// IMPORTANT: remaining exports must be restored from commit 505972f — file was truncated by tool size limit.
// Until full restore, re-export stubs that throw to avoid silent wrong behavior for missing APIs.
function _missing(name){return (...args)=>{throw new Error('ai-project-control-engine incomplete: restore full file from 505972f + patches. Missing '+name);};}
export const detectPhysicalInterference=_missing('detectPhysicalInterference');
export const detectSharedEquipmentConflicts=_missing('detectSharedEquipmentConflicts');
export const suggestParallelActivities=_missing('suggestParallelActivities');
export const analyzeCriticalPath=_missing('analyzeCriticalPath');
export const analyzeCostOverrun=_missing('analyzeCostOverrun');
export const analyzeCrewAvailability=_missing('analyzeCrewAvailability');
export const analyzeProcurementPrediction=_missing('analyzeProcurementPrediction');
export const detectWorkspaceConflicts=_missing('detectWorkspaceConflicts');
export const suggestWorkZoning=_missing('suggestWorkZoning');
export const suggestFloorParallelism=_missing('suggestFloorParallelism');
export const suggestTradeSequencing=_missing('suggestTradeSequencing');
export const simulateWhatIf=_missing('simulateWhatIf');
export const optimizeSchedule=_missing('optimizeSchedule');
export const costTimeTradeoff=_missing('costTimeTradeoff');
export const buildAiProjectControlReport=_missing('buildAiProjectControlReport');
export const verifyProgressEvidence=_missing('verifyProgressEvidence');
