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
  suggestParallelActivities
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
