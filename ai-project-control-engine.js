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
      if(available<0) conflicts.push({material_key:key,taskId:d.id,shortage:Math.abs(available),required_date:d.required_date});
    }
  }
  return {conflicts};
}


export function detectPhysicalInterference(tasks){
  const conflicts=[];
  for(let i=0;i<tasks.length;i++) for(let j=i+1;j<tasks.length;j++){
    const a=tasks[i],b=tasks[j];
    if(!overlap(asDate(a.planned_start),asDate(a.planned_finish),asDate(b.planned_start),asDate(b.planned_finish))) continue;
    const az=String(a.constraints?.zone_id||a.constraints?.workfront||'');
    const bz=String(b.constraints?.zone_id||b.constraints?.workfront||'');
    if(az && bz && az===bz) conflicts.push({taskA:a.id,taskB:b.id,zone:az});
  }
  return {conflicts};
}

export function detectSharedEquipmentConflicts(tasks){
  const equipment=[];
  for(let i=0;i<tasks.length;i++) for(let j=i+1;j<tasks.length;j++){
    const a=tasks[i],b=tasks[j];
    if(!overlap(asDate(a.planned_start),asDate(a.planned_finish),asDate(b.planned_start),asDate(b.planned_finish))) continue;
    const ae=new Set((a.constraints?.equipment_ids||[]).map(String));
    for(const e of (b.constraints?.equipment_ids||[]).map(String)) if(ae.has(e)) equipment.push({taskA:a.id,taskB:b.id,equipmentId:e});
  }
  return {equipment};
}

export function suggestParallelActivities(tasks){
  const suggestions=[];
  for(let i=0;i<tasks.length;i++) for(let j=i+1;j<tasks.length;j++){
    const a=tasks[i],b=tasks[j];
    if(!a.planned_start||!a.planned_finish||!b.planned_start||!b.planned_finish) continue;
    if(overlap(asDate(a.planned_start),asDate(a.planned_finish),asDate(b.planned_start),asDate(b.planned_finish))) continue;
    const ar=new Set((a.resource_ids||[]).map(String));
    const br=new Set((b.resource_ids||[]).map(String));
    const shared=[...ar].filter(x=>br.has(x));
    if(shared.length) continue;
    suggestions.push({taskA:a.id,taskB:b.id,reason:'No date overlap and no shared declared resource'});
  }
  return suggestions.slice(0,20);
}


export function analyzeCriticalPath(tasks){
  const byId=new Map(tasks.map(t=>[Number(t.id),t]));
  const memo=new Map(), visiting=new Set();
  const walk=id=>{
    if(memo.has(id)) return memo.get(id);
    if(visiting.has(id)) return {duration:0,path:[],cycle:true};
    visiting.add(id);
    const t=byId.get(id), dur=Math.max(0,Number(t?.duration_days||0));
    let best={duration:dur,path:[id],cycle:false};
    for(const p of normalizeIds(t?.predecessor_ids).filter(x=>byId.has(x))){
      const prev=walk(p);
      if(prev.cycle) best.cycle=true;
      if(prev.duration+dur>best.duration) best={duration:prev.duration+dur,path:[...prev.path,id],cycle:best.cycle||prev.cycle};
    }
    visiting.delete(id); memo.set(id,best); return best;
  };
  let best={duration:0,path:[],cycle:false};
  for(const t of tasks){const r=walk(Number(t.id));if(r.duration>best.duration)best=r;}
  return {durationDays:best.duration,taskIds:best.path,cycleDetected:best.cycle};
}

export function analyzeCostOverrun(tasks, project={}){
  const plannedTasks=tasks.reduce((s,t)=>s+Number(t.planned_cost||0),0);
  const actualTasks=tasks.reduce((s,t)=>s+Number(t.actual_cost||0),0);
  const planned=Number(project.current_budget||project.baseline_budget||plannedTasks);
  const actual=Number(project.actual_cost||actualTasks);
  const variance=actual-planned;
  return {planned,actual,variance,variancePercent:planned>0?(variance/planned)*100:0,overrun:variance>0};
}

export function analyzeCrewAvailability(tasks, resources){
  const crews=resources.filter(r=>String(r.resource_type||'').toLowerCase().includes('crew')&&r.active!==false);
  const assigned=new Set(tasks.map(t=>String(t.responsible_user||'')).filter(Boolean));
  return {activeCrewCount:crews.length,assignedUserCount:assigned.size,unassignedTaskCount:tasks.filter(t=>!t.responsible_user&&Number(t.progress||0)<100).length};
}

export function analyzeProcurementPrediction(procurement, now=new Date()){
  const today=new Date(now); today.setUTCHours(0,0,0,0);
  return procurement.map(p=>{
    const required=asDate(p.forecast_required_date||p.required_date);
    const ordered=String(p.status||'').toLowerCase();
    const open=!['delivered','received','cancelled','closed'].includes(ordered);
    const days=required?Math.ceil((required-today)/DAY):null;
    return {...p,daysToRequired:days,predictedRisk:open&&days!==null&&days<=7?'high':open&&days!==null&&days<=21?'medium':'low'};
  });
}


export function detectWorkspaceConflicts(tasks){
  const conflicts=[];
  for(let i=0;i<tasks.length;i++) for(let j=i+1;j<tasks.length;j++){
    const a=tasks[i],b=tasks[j];
    if(!overlap(asDate(a.planned_start),asDate(a.planned_finish),asDate(b.planned_start),asDate(b.planned_finish))) continue;
    const az=String(a.constraints?.workspace_id||a.constraints?.workspace||'');
    const bz=String(b.constraints?.workspace_id||b.constraints?.workspace||'');
    if(az && bz && az===bz) conflicts.push({taskA:a.id,taskB:b.id,workspace:az});
  }
  return {conflicts};
}
export function suggestWorkZoning(tasks){
  const byZone=new Map();
  for(const t of tasks){const zone=String(t.constraints?.zone_id||t.constraints?.workfront||'unassigned'); if(!byZone.has(zone))byZone.set(zone,[]);byZone.get(zone).push(t.id);}
  return [...byZone].map(([zone,taskIds])=>({zone,taskIds}));
}
export function suggestFloorParallelism(tasks){
  const groups=new Map();
  for(const t of tasks){const floor=t.constraints?.floor_id??t.floor_id??'unassigned';if(!groups.has(String(floor)))groups.set(String(floor),[]);groups.get(String(floor)).push(t);}
  return [...groups].map(([floor,items])=>({floor,taskIds:items.map(x=>x.id),parallelCandidates:items.filter(x=>Number(x.progress||0)<100).map(x=>x.id)}));
}
export function suggestTradeSequencing(tasks){
  const order=['structure','mep','mechanical','electrical','plumbing','walls','facade','finishing','painting'];
  return tasks.map(t=>({id:t.id,title:t.title,trade:String(t.constraints?.trade||t.trade||'').toLowerCase(),sequence:Math.max(0,order.indexOf(String(t.constraints?.trade||t.trade||'').toLowerCase()))})).sort((a,b)=>a.sequence-b.sequence);
}
export function simulateWhatIf({tasks=[],changes=[],project={}}){
  const clone=tasks.map(t=>({...t}));
  for(const ch of changes){const t=clone.find(x=>Number(x.id)===Number(ch.task_id));if(!t)continue;if(ch.days_delta){const d=new Date(t.planned_finish+'T00:00:00Z');d.setUTCDate(d.getUTCDate()+Number(ch.days_delta));t.planned_finish=d.toISOString().slice(0,10);}if(ch.cost_delta)t.actual_cost=Number(t.actual_cost||0)+Number(ch.cost_delta);}
  const schedule=analyzeSchedule(clone,new Date());
  const cost=analyzeCostOverrun(clone,project);
  return {readOnly:true,scenario:'what-if',changes,delayCount:schedule.overdue.length,costVariance:cost.variance,costVariancePercent:cost.variancePercent,tasks:clone};
}
export function optimizeSchedule(tasks){
  const dependencies=detectDependencyConflicts(tasks);
  const conflicts=detectResourceConflicts(tasks);
  return {readOnly:true,blockedByDependencies:dependencies.missing.length+dependencies.cycles.length,conflicts:conflicts.sharedResourceConflicts.length+conflicts.teamConflicts.length,candidateCount:suggestParallelActivities(tasks).length};
}
export function costTimeTradeoff({baseCost=0,baseDays=0,options=[]}){
  return options.map(o=>({...o,costDelta:Number(o.cost_delta||0),daysDelta:Number(o.days_delta||0),costPerDaySaved:Number(o.days_delta<0&&o.cost_delta>0?o.cost_delta/Math.abs(o.days_delta):0)}));
}

export function buildAiProjectControlReport({tasks=[],procurement=[],resources=[],project={},now=new Date()}){
  const schedule=analyzeSchedule(tasks,now); const criticalPath=analyzeCriticalPath(tasks); const cost=analyzeCostOverrun(tasks,project); const crew=analyzeCrewAvailability(tasks,resources); const procurementPrediction=analyzeProcurementPrediction(procurement,now);
  const dependency=detectDependencyConflicts(tasks);
  const resource=detectResourceConflicts(tasks); const workspace=detectWorkspaceConflicts(tasks); const zoning=suggestWorkZoning(tasks); const floorParallelism=suggestFloorParallelism(tasks); const tradeSequencing=suggestTradeSequencing(tasks); const physical=detectPhysicalInterference(tasks); const equipment=detectSharedEquipmentConflicts(tasks); const parallelSuggestions=suggestParallelActivities(tasks);
  const material=detectMaterialConflicts(
    procurement.map(p=>({id:p.id,material_key:p.material_key||p.item_name,item_name:p.item_name,quantity:Number(p.quantity||p.forecast_quantity||0),required_date:p.forecast_required_date||p.required_date})),
    resources.filter(r=>String(r.resource_type||'').toLowerCase().includes('material')).map(r=>({material_key:r.material_key||r.name,on_hand_quantity:r.on_hand_quantity||r.actual_qty,reserved_quantity:r.reserved_quantity}))
  );
  const alerts=[];
  if(schedule.overdue.length) alerts.push({type:'delay',severity:schedule.criticalOverdue?'critical':'high',title:'Schedule delay detected',count:schedule.overdue.length});
  if(dependency.missing.length||dependency.cycles.length) alerts.push({type:'dependency',severity:'high',title:'Dependency conflict detected',missing:dependency.missing.length,cycles:dependency.cycles.length});
  if(workspace.conflicts.length) alerts.push({type:'workspace_conflict',severity:'high',title:'Shared workspace conflict detected',count:workspace.conflicts.length}); if(physical.conflicts.length) alerts.push({type:'physical_interference',severity:'high',title:'Physical workfront interference detected',count:physical.conflicts.length}); if(equipment.equipment.length) alerts.push({type:'equipment_conflict',severity:'high',title:'Shared equipment conflict detected',count:equipment.equipment.length}); if(resource.sharedResourceConflicts.length||resource.teamConflicts.length) alerts.push({type:'resource_conflict',severity:'high',title:'Parallel work resource conflict',count:resource.sharedResourceConflicts.length+resource.teamConflicts.length});
  if(material.conflicts.length) alerts.push({type:'material_conflict',severity:'high',title:'Shared material shortage detected',count:material.conflicts.length});
  return {
    readOnly:true,
    generated_at:new Date().toISOString(),
    alerts,
    schedule,dependency,resource,material,
    recommendations:[
      ...(schedule.overdue.length?['Review delayed activities and recovery options.']:[]),
      ...(dependency.missing.length||dependency.cycles.length?['Repair dependency graph before relying on critical-path analysis.']:[]),
      ...(physical.conflicts.length?['Separate conflicting activities by workfront or zone.']:[]), ...(equipment.equipment.length?['Re-sequence activities sharing the same equipment.']:[]), ...(resource.sharedResourceConflicts.length||resource.teamConflicts.length?['Re-sequence or reassign conflicting parallel activities.']:[]),
      ...(material.conflicts.length?['Advance procurement or rebalance material allocation.']:[])
    ]
  };
}


export function createBaseline(tasks = [], project = {}, capturedAt = new Date().toISOString()) {
  return {
    version: 1,
    captured_at: capturedAt,
    project: {
      id: project.id ?? null,
      budget: Number(project.current_budget ?? project.baseline_budget ?? 0),
    },
    tasks: tasks.map(t => ({
      id: Number(t.id),
      planned_start: t.planned_start ?? null,
      planned_finish: t.planned_finish ?? null,
      duration_days: Number(t.duration_days ?? 0),
      planned_cost: Number(t.planned_cost ?? 0),
      progress: Number(t.progress ?? 0),
    })),
  };
}

export function calculateVariance(tasks = [], baseline = {}) {
  const baselineById = new Map((baseline.tasks || []).map(t => [Number(t.id), t]));
  const dayDiff = (a, b) => {
    if (!a || !b) return null;
    const diff = (new Date(a + 'T00:00:00Z') - new Date(b + 'T00:00:00Z')) / DAY;
    return Number.isFinite(diff) ? diff : null;
  };
  const rows = tasks.map(t => {
    const b = baselineById.get(Number(t.id));
    const costVariance = b ? Number(t.actual_cost ?? 0) - Number(b.planned_cost ?? 0) : null;
    return {
      id: Number(t.id),
      finishVarianceDays: b ? dayDiff(t.planned_finish, b.planned_finish) : null,
      startVarianceDays: b ? dayDiff(t.planned_start, b.planned_start) : null,
      durationVarianceDays: b ? Number(t.duration_days ?? 0) - Number(b.duration_days ?? 0) : null,
      costVariance,
      progressVariance: b ? Number(t.progress ?? 0) - Number(b.progress ?? 0) : null,
      baselineFound: Boolean(b),
    };
  });
  const costVariance = rows.reduce((s, r) => s + Number(r.costVariance || 0), 0);
  const scheduleVarianceDays = rows.reduce((max, r) => Math.max(max, Number(r.finishVarianceDays || 0)), 0);
  return {
    baselineVersion: baseline.version ?? null,
    taskCount: rows.length,
    baselineTaskCount: (baseline.tasks || []).length,
    costVariance,
    scheduleVarianceDays,
    tasks: rows,
  };
}


export function verifyProgressEvidence(tasks = [], evidence = []) {
  const byTask = new Map(evidence.map(e => [Number(e.task_id), Number(e.progress)]));
  const mismatches = [];
  let verifiedTaskCount = 0;
  for (const task of tasks) {
    const id = Number(task.id);
    if (!byTask.has(id)) continue;
    const declared = Number(task.progress || 0);
    const evidenced = Number(byTask.get(id) || 0);
    if (declared === evidenced) verifiedTaskCount += 1;
    else mismatches.push({ taskId: id, declared, evidenced });
  }
  return {
    taskCount: tasks.length,
    evidenceCount: evidence.length,
    verifiedTaskCount,
    mismatchCount: mismatches.length,
    mismatches,
    verified: mismatches.length === 0
  };
}
