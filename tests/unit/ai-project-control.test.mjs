import test from 'node:test';
import assert from 'node:assert/strict';
import {
  analyzeSchedule,
  detectDependencyConflicts,
  detectResourceConflicts,
  detectMaterialConflicts,
  buildAiProjectControlReport,
  detectPhysicalInterference,
  detectSharedEquipmentConflicts,
  suggestParallelActivities,
  analyzeCriticalPath,
  analyzeCostOverrun,
  analyzeCrewAvailability,
  analyzeProcurementPrediction,
  detectWorkspaceConflicts,
  suggestWorkZoning,
  suggestFloorParallelism,
  suggestTradeSequencing,
  simulateWhatIf,
  optimizeSchedule,
  costTimeTradeoff
} from '../../ai-project-control-engine.js';

test('detects overdue schedule tasks and schedule slippage', () => {
  const report = analyzeSchedule([
    {id:1,title:'Structure',planned_finish:'2026-09-20',actual_finish:null,progress:60,status:'in_progress',is_critical:true},
    {id:2,title:'Walls',planned_finish:'2026-10-10',actual_finish:null,progress:20,status:'in_progress',is_critical:false}
  ], new Date('2026-09-30'));
  assert.equal(report.overdue.length,1);
  assert.equal(report.overdue[0].id,1);
  assert.equal(report.criticalOverdue,1);
});

test('detects invalid or cyclic predecessor references', () => {
  const result = detectDependencyConflicts([
    {id:1,title:'A',predecessor_ids:[2]},
    {id:2,title:'B',predecessor_ids:[1]},
    {id:3,title:'C',predecessor_ids:[99]}
  ]);
  assert.equal(result.missing.length,1);
  assert.equal(result.cycles.length,1);
});

test('detects shared resource conflicts', () => {
  const result = detectResourceConflicts([
    {id:1,title:'Concrete',responsible_user:'u1',planned_start:'2026-10-01',planned_finish:'2026-10-05',resource_ids:['crane-1']},
    {id:2,title:'Facade',responsible_user:'u2',planned_start:'2026-10-03',planned_finish:'2026-10-07',resource_ids:['crane-1']}
  ]);
  assert.equal(result.sharedResourceConflicts.length,1);
  assert.equal(result.teamConflicts.length,0);
});

test('detects shared material conflict from procurement demand', () => {
  const result = detectMaterialConflicts([
    {id:1,item_name:'Cement',material_key:'cement',quantity:80,required_date:'2026-10-03'},
    {id:2,item_name:'Cement',material_key:'cement',quantity:40,required_date:'2026-10-04'}
  ], [{material_key:'cement',on_hand_quantity:50,reserved_quantity:0}]);
  assert.equal(result.conflicts.length,1);
  assert.equal(result.conflicts[0].shortage,30);
});

test('builds a read-only AI project-control report', () => {
  const report = buildAiProjectControlReport({
    tasks:[{id:1,title:'Structure',planned_finish:'2026-09-20',progress:60,status:'in_progress',is_critical:true}],
    procurement:[],
    resources:[],
    now:new Date('2026-09-30')
  });
  assert.equal(report.readOnly,true);
  assert.ok(report.alerts.some(x=>x.type==='delay'));
});


test('detects physical workfront and equipment conflicts and proposes safe parallel work', () => {
  const tasks=[
    {id:1,planned_start:'2026-10-01',planned_finish:'2026-10-05',constraints:{zone_id:'Z1',equipment_ids:['lift-1']},resource_ids:[]},
    {id:2,planned_start:'2026-10-03',planned_finish:'2026-10-06',constraints:{zone_id:'Z1',equipment_ids:['lift-1']},resource_ids:[]},
    {id:3,planned_start:'2026-10-07',planned_finish:'2026-10-10',constraints:{zone_id:'Z2',equipment_ids:['lift-2']},resource_ids:[]}
  ];
  assert.equal(detectPhysicalInterference(tasks).conflicts.length,1);
  assert.equal(detectSharedEquipmentConflicts(tasks).equipment.length,1);
  assert.ok(suggestParallelActivities(tasks).some(x=>x.taskA===1&&x.taskB===3));
});


test('calculates critical path, cost overrun, crew availability and procurement risk', () => {
  const cp=analyzeCriticalPath([
    {id:1,duration_days:5,predecessor_ids:[]},
    {id:2,duration_days:7,predecessor_ids:[1]},
    {id:3,duration_days:2,predecessor_ids:[1]}
  ]);
  assert.deepEqual(cp.taskIds,[1,2]);
  assert.equal(cp.durationDays,12);
  const cost=analyzeCostOverrun([{planned_cost:100,actual_cost:130}],{current_budget:100,actual_cost:130});
  assert.equal(cost.overrun,true);
  assert.equal(Math.round(cost.variancePercent),30);
  const crew=analyzeCrewAvailability([{id:1,responsible_user:null,progress:0}],[{resource_type:'crew',active:true}]);
  assert.equal(crew.unassignedTaskCount,1);
  const prediction=analyzeProcurementPrediction([{id:1,forecast_required_date:'2026-10-05',status:'ordered'}],new Date('2026-09-30'));
  assert.equal(prediction[0].predictedRisk,'high');
});


test('supports workspace zoning, floor parallelism, trade sequencing and what-if simulation', () => {
  const tasks=[
    {id:1,title:'Structure',planned_start:'2026-10-01',planned_finish:'2026-10-05',duration_days:5,planned_cost:100,actual_cost:100,constraints:{workspace_id:'W1',zone_id:'Z1',floor_id:1,trade:'structure'}},
    {id:2,title:'MEP',planned_start:'2026-10-03',planned_finish:'2026-10-06',duration_days:4,planned_cost:50,actual_cost:50,constraints:{workspace_id:'W1',zone_id:'Z1',floor_id:1,trade:'mep'}}
  ];
  assert.equal(detectWorkspaceConflicts(tasks).conflicts.length,1);
  assert.equal(suggestWorkZoning(tasks)[0].taskIds.length,2);
  assert.equal(suggestFloorParallelism(tasks)[0].parallelCandidates.length,2);
  assert.equal(suggestTradeSequencing(tasks)[0].trade,'structure');
  const sim=simulateWhatIf({tasks,changes:[{task_id:1,days_delta:2,cost_delta:10}],project:{current_budget:200}});
  assert.equal(sim.readOnly,true);
  assert.equal(sim.costVariance,10);
  assert.equal(optimizeSchedule(tasks).readOnly,true);
  assert.equal(costTimeTradeoff({options:[{cost_delta:100,days_delta:-5}]})[0].costPerDaySaved,20);
});
