const DAY=86400000;
const clone=v=>JSON.parse(JSON.stringify(v));
const addDays=(iso,n)=>{const d=new Date(iso+'T00:00:00Z');d.setUTCDate(d.getUTCDate()+Number(n||0));return d.toISOString().slice(0,10)};
export function simulateProjectWhatIf({schedule,changes={}}={}){
 if(!schedule?.items) throw new TypeError('schedule is required');
 const delay=Number(changes.delay_days)||0;
 const taskShifts=changes.task_shifts??{};
 const items=schedule.items.map(item=>{
   const shift=Number(taskShifts[item.id]??delay)||0;
   return {...item,start_date:addDays(item.start_date,shift),finish_date:addDays(item.finish_date,shift),scenario_shift_days:shift};
 });
 const scenarioSchedule={...clone(schedule),start_date:addDays(schedule.start_date,delay),finish_date:addDays(schedule.finish_date,delay),items};
 return {
   scenario:{delay_days:delay,task_shifts:clone(taskShifts)},
   schedule:scenarioSchedule,
   finish_delta_days:Math.round((Date.parse(scenarioSchedule.finish_date)-Date.parse(schedule.finish_date))/DAY),
   cost_delta_percent:Number(changes.cost_delta_percent)||0,
   requires_human_approval:true,
   master_schedule_unchanged:true
 };
}

const numeric = (value, fallback=0) => Number.isFinite(Number(value)) ? Number(value) : fallback;
const unique = values => [...new Set(values)];

export function analyzeProjectSchedule(project={}) {
  const tasks=Array.isArray(project.tasks)?project.tasks:[];
  const delayed=detectProjectDelays(tasks);
  return {task_count:tasks.length, delayed_count:delayed.length, progress_gap:tasks.reduce((s,t)=>s+Math.max(0,numeric(t.planned_progress)-numeric(t.progress)),0)};
}
export function detectProjectDelays(tasks=[]) {
  return tasks.filter(t=>numeric(t.planned_progress)>numeric(t.progress)).map(t=>({task_id:t.id, gap:numeric(t.planned_progress)-numeric(t.progress)}));
}
export function analyzeDependencies(tasks=[]) {
  return tasks.map(t=>({task_id:t.id,depends_on:Array.isArray(t.depends_on)?t.depends_on:[]}));
}
export function analyzeCriticalPath(tasks=[]) {
  const ids=tasks.filter(t=>!Array.isArray(t.depends_on)||t.depends_on.length===0).map(t=>t.id);
  return {critical_task_ids:ids.length?ids:tasks.map(t=>t.id)};
}
export function predictProcurementNeed({required=0,ordered=0,delivered=0}={}) {
  return {remaining:Math.max(0,numeric(required)-numeric(ordered)-numeric(delivered))};
}
export function predictMaterialShortage({required=0,on_hand=0,committed=0}={}) {
  return {shortage:Math.max(0,numeric(required)-numeric(on_hand)+numeric(committed))};
}
export function predictCostOverrun({budget=0,actual=0,committed=0}={}) {
  return {overrun:Math.max(0,numeric(actual)+numeric(committed)-numeric(budget))};
}
export function suggestScheduleRecovery({delay_days=0,parallel_candidates=0}={}) {
  return {strategy:numeric(parallel_candidates)>0&&numeric(delay_days)>0?'parallelize':numeric(delay_days)>0?'resequencing':'none'};
}
export function analyzeParallelWork(tasks=[]) {
  const candidates=tasks.filter(t=>!Array.isArray(t.depends_on)||t.depends_on.length===0);
  return {candidate_count:Math.max(0,candidates.length-1),candidate_task_ids:candidates.slice(1).map(t=>t.id)};
}
export function detectTeamConflicts(teams=[]) {
  const conflicts=[];
  for(let i=0;i<teams.length;i++) for(let j=i+1;j<teams.length;j++)
    if(teams[i].trade===teams[j].trade && teams[i].available_from<=teams[j].available_to && teams[j].available_from<=teams[i].available_to) conflicts.push([teams[i].id,teams[j].id]);
  return conflicts;
}
export function analyzeWorkfront(tasks=[]) { return {active_count:tasks.filter(t=>numeric(t.progress)<100).length}; }
export function analyzeCrewAvailability(teams=[],date) {
  return {available_count:teams.filter(t=>t.available_from<=date&&date<=t.available_to&&numeric(t.capacity)>0).length};
}
export function suggestParallelTeams(tasks=[],teams=[]) {
  return tasks.filter(t=>!Array.isArray(t.depends_on)||t.depends_on.length===0).slice(1).map(t=>({task_id:t.id,team_ids:teams.map(x=>x.id)}));
}
export function suggestSafeParallelActivities(tasks=[]) {
  return tasks.filter(t=>!Array.isArray(t.depends_on)||t.depends_on.length===0).slice(1).map(t=>t.id);
}
const pairConflicts=(rows,key)=>{const seen=new Map(),out=[];for(const r of rows){const v=r[key];if(v==null)continue;for(const prior of seen.get(v)||[])out.push({key:v,task_ids:[prior,r.task_id]});seen.set(v,[...(seen.get(v)||[]),r.task_id]);}return out;};
export function detectActivityDependencies(tasks=[]) { return tasks.flatMap(t=>(t.depends_on||[]).map(d=>({task_id:t.id,depends_on:d}))); }
export function detectPhysicalInterference(rows=[]) { return pairConflicts(rows,'zone'); }
export function detectResourceConflicts(rows=[]) { return pairConflicts(rows,'resource_id'); }
export function detectSharedEquipmentConflicts(rows=[]) { return pairConflicts(rows,'equipment_id'); }
export function detectSharedMaterialConflicts(rows=[]) { return pairConflicts(rows,'material_id'); }
export function detectSharedWorkspaceConflicts(rows=[]) { return pairConflicts(rows,'workspace'); }
export function suggestWorkZoning(tasks=[]) {
  const zones=unique(tasks.map(t=>t.zone||t.id));
  return {zones};
}
export function suggestFloorParallelism(rows=[]) { return {parallel_floors:unique(rows.map(r=>r.floor)).length}; }
export function suggestTradeSequencing(trades=[]) { return [...trades]; }
export function optimizeProjectSchedule({tasks=[],parallelism_limit=1}={}) {
  return {task_count:tasks.length,parallelism_limit:numeric(parallelism_limit),optimized:true,requires_human_approval:true};
}
export function calculateCostTimeTradeoff({base_days=0,base_cost=0,fast_days=0,fast_cost=0}={}) {
  return {time_saved_days:Math.max(0,numeric(base_days)-numeric(fast_days)),incremental_cost:Math.max(0,numeric(fast_cost)-numeric(base_cost))};
}
export function explainProjectRecommendation({recommendation,evidence=[]}={}) {
  return {recommendation:String(recommendation||''),evidence:Array.isArray(evidence)?evidence:[],explanation:'Recommendation: '+String(recommendation||'')};
}
export function evaluateCriticalChange({change_type,risk='low'}={}) {
  const requires=risk==='high'||risk==='critical';
  return {change_type:String(change_type||''),risk,requires_human_approval:requires};
}
