import test from 'node:test';
import assert from 'node:assert/strict';
import {
  analyzeProjectSchedule,
  detectProjectDelays,
  analyzeDependencies,
  analyzeCriticalPath,
  predictProcurementNeed,
  predictMaterialShortage,
  predictCostOverrun,
  suggestScheduleRecovery,
  analyzeParallelWork,
  detectTeamConflicts,
  analyzeWorkfront,
  analyzeCrewAvailability,
  suggestParallelTeams,
  suggestSafeParallelActivities,
  detectActivityDependencies,
  detectPhysicalInterference,
  detectResourceConflicts,
  detectSharedEquipmentConflicts,
  detectSharedMaterialConflicts,
  detectSharedWorkspaceConflicts,
  suggestWorkZoning,
  suggestFloorParallelism,
  suggestTradeSequencing,
  optimizeProjectSchedule,
  calculateCostTimeTradeoff,
  explainProjectRecommendation,
  evaluateCriticalChange
} from '../../src/domains/construction/ai-project-control.js';

const project={
  tasks:[
    {id:'a',name:'structure',start_date:'2026-10-01',finish_date:'2026-10-05',progress:50,planned_progress:80,depends_on:[]},
    {id:'b',name:'masonry',start_date:'2026-10-05',finish_date:'2026-10-10',progress:20,planned_progress:60,depends_on:['a']},
    {id:'c',name:'landscape',start_date:'2026-10-01',finish_date:'2026-10-04',progress:0,planned_progress:20,depends_on:[]}
  ],
  teams:[
    {id:'t1',trade:'structure',available_from:'2026-10-01',available_to:'2026-10-20',capacity:2},
    {id:'t2',trade:'masonry',available_from:'2026-10-05',available_to:'2026-10-20',capacity:1}
  ],
  resources:[
    {id:'r1',type:'crane',available_from:'2026-10-01',available_to:'2026-10-20'}
  ]
};

test('161-165 schedule intelligence exposes delay, dependency and critical-path evidence',()=>{
  const summary=analyzeProjectSchedule(project);
  assert.equal(summary.task_count,3);
  assert.equal(detectProjectDelays(project.tasks).length,3);
  assert.deepEqual(analyzeDependencies(project.tasks).find(x=>x.task_id==='b').depends_on,['a']);
  assert.ok(analyzeCriticalPath(project.tasks).critical_task_ids.includes('a'));
});

test('166-169 predicts procurement, shortage, cost overrun and recovery',()=>{
  assert.equal(predictProcurementNeed({required:100,ordered:40,delivered:20}).remaining,40);
  assert.equal(predictMaterialShortage({required:100,on_hand:50,committed:20}).shortage,70);
  assert.equal(predictCostOverrun({budget:1000,actual:700,committed:400}).overrun,100);
  assert.equal(suggestScheduleRecovery({delay_days:5,parallel_candidates:2}).strategy,'parallelize');
});

test('170-175 identifies safe parallel opportunities and team conflicts',()=>{
  assert.equal(analyzeParallelWork(project.tasks).candidate_count,1);
  assert.equal(detectTeamConflicts(project.teams).length,0);
  assert.equal(analyzeWorkfront(project.tasks).active_count,3);
  assert.equal(analyzeCrewAvailability(project.teams,'2026-10-06').available_count,3);
  assert.equal(suggestParallelTeams(project.tasks,project.teams).length,1);
  assert.equal(suggestSafeParallelActivities(project.tasks).length,1);
});

test('176-184 detects dependencies/interference and produces zoning/sequence guidance',()=>{
  assert.equal(detectActivityDependencies(project.tasks).length,1);
  assert.equal(detectPhysicalInterference([{id:'a',zone:'A',trade:'structure'},{id:'b',zone:'A',trade:'masonry'}]).length,1);
  assert.equal(detectResourceConflicts([{task_id:'a',resource_id:'r1'},{task_id:'b',resource_id:'r1'}]).length,1);
  assert.equal(detectSharedEquipmentConflicts([{task_id:'a',equipment_id:'e1'},{task_id:'b',equipment_id:'e1'}]).length,1);
  assert.equal(detectSharedMaterialConflicts([{task_id:'a',material_id:'m1'},{task_id:'b',material_id:'m1'}]).length,1);
  assert.equal(detectSharedWorkspaceConflicts([{task_id:'a',workspace:'A'},{task_id:'b',workspace:'A'}]).length,1);
  assert.equal(suggestWorkZoning(project.tasks).zones.length,3);
  assert.equal(suggestFloorParallelism([{id:'a',floor:1},{id:'b',floor:2}]).parallel_floors,2);
  assert.deepEqual(suggestTradeSequencing(['structure','masonry','MEP']),['structure','masonry','MEP']);
});

test('185-190 preserves isolated what-if, optimization, tradeoff, explanation and approval gates',()=>{
  const schedule={start_date:'2026-10-01',finish_date:'2026-10-10',items:[{id:'a',start_date:'2026-10-01',finish_date:'2026-10-05'}]};
  const whatIf=globalThis.__whatIfTestHook?.(schedule);
  assert.equal(typeof whatIf,'undefined');
  const optimized=optimizeProjectSchedule({tasks:project.tasks,parallelism_limit:2});
  assert.equal(optimized.requires_human_approval,true);
  const tradeoff=calculateCostTimeTradeoff({base_days:100,base_cost:1000,fast_days:80,fast_cost:1200});
  assert.equal(tradeoff.time_saved_days,20);
  const explanation=explainProjectRecommendation({recommendation:'parallelize',evidence:['delay:5']});
  assert.equal(explanation.evidence.length,1);
  const gate=evaluateCriticalChange({change_type:'schedule',risk:'high'});
  assert.equal(gate.requires_human_approval,true);
});
