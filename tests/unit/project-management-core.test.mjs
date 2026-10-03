import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createProjectManagementModel,
  buildGanttRows,
  createBaseline,
  compareToBaseline,
  calculateFloat,
  calculateTimeVariancePercent,
  buildProjectDashboard,
  buildMasterPlan,
  buildProjectCalendar,
  detectDelays,
  buildRecoveryPlan,
  reviseSchedule,
  createProjectVersion,
  createProjectSnapshot,
  getProjectStatus
} from '../../src/domains/construction/project-management-core.js';

const wbs = [
  { id:'a', type:'task', name:'Excavate', duration_days:2, depends_on:[], progress:100, metadata:{planned_progress:100} },
  { id:'b', type:'task', name:'Foundation', duration_days:3, depends_on:['a'], progress:50, metadata:{planned_progress:80, delay_reason:'supplier', delay_responsibility:'supplier'} },
  { id:'m1', type:'milestone', name:'Structure start', duration_days:0, depends_on:['b'], progress:0 }
];

test('project management core composes hierarchy, schedule, gantt and status', () => {
  const model = createProjectManagementModel({
    project: { id:'p1', name:'Project A', type:'project' },
    hierarchy: [
      { id:'p1', name:'Project A', type:'project' },
      { id:'c1', name:'Complex A', type:'complex', parent_id:'p1' },
      { id:'b1', name:'Building A', type:'building', parent_id:'c1' },
      { id:'ph1', name:'Phase A', type:'phase', parent_id:'b1' },
      { id:'f1', name:'Floor 1', type:'floor', parent_id:'ph1' },
      { id:'u1', name:'Unit 1', type:'unit', parent_id:'f1' }
    ],
    wbs,
    start_date:'2026-10-01'
  });
  assert.equal(model.project.id, 'p1');
  assert.equal(model.schedule.finish_date, '2026-10-06');
  assert.equal(model.gantt.length, 3);
  assert.equal(model.status.progress_percent, 58.333333333333336);
});

test('baseline comparison reports schedule variance without mutating baseline', () => {
  const baseline = createBaseline({ schedule: { start_date:'2026-10-01', finish_date:'2026-10-06', items:wbs }});
  const actual = { start_date:'2026-10-01', finish_date:'2026-10-08', items:wbs };
  const variance = compareToBaseline(actual, baseline);
  assert.equal(variance.finish_variance_days, 2);
  assert.equal(baseline.schedule.finish_date, '2026-10-06');
});

test('float calculation identifies critical dependency chain', () => {
  const schedule = {
    start_date:'2026-10-01',
    finish_date:'2026-10-06',
    items:[
      {id:'a', start_date:'2026-10-01', finish_date:'2026-10-03', depends_on:[]},
      {id:'b', start_date:'2026-10-03', finish_date:'2026-10-06', depends_on:['a']},
      {id:'c', start_date:'2026-10-01', finish_date:'2026-10-02', depends_on:[]}
    ]
  };
  const floats = calculateFloat(schedule);
  assert.equal(floats.find(x=>x.id==='a').slack_days, 0);
  assert.equal(floats.find(x=>x.id==='b').slack_days, 0);
  assert.equal(floats.find(x=>x.id==='c').slack_days, 4);
});

test('time variance, delay detection and recovery plan are deterministic', () => {
  assert.equal(calculateTimeVariancePercent({baseline_duration_days:20, variance_days:5}), 25);
  const delays = detectDelays([
    {id:'a', baseline_finish:'2026-10-05', forecast_finish:'2026-10-08', metadata:{delay_reason:'supplier',delay_responsibility:'supplier'}},
    {id:'b', baseline_finish:'2026-10-05', forecast_finish:'2026-10-05'}
  ]);
  assert.equal(delays.length, 1);
  assert.equal(delays[0].reason, 'supplier');
  assert.equal(delays[0].responsibility, 'supplier');
  const recovery = buildRecoveryPlan(delays, [{id:'a', duration_days:10}]);
  assert.equal(recovery[0].task_id, 'a');
  assert.equal(recovery[0].target_reduction_days, 3);
});

test('master plan, dashboard and calendar expose one canonical project view model', () => {
  const schedule = {
    start_date:'2026-10-01',
    finish_date:'2026-10-06',
    items:[
      {id:'a', name:'Excavate', type:'task', start_date:'2026-10-01', finish_date:'2026-10-03', progress:100, depends_on:[]},
      {id:'m1', name:'Structure start', type:'milestone', start_date:'2026-10-06', finish_date:'2026-10-06', progress:0, depends_on:['a']}
    ]
  };
  const dashboard = buildProjectDashboard({project:{id:'p1',name:'A'},schedule,progress:{percent:50},status:{status:'active'}});
  assert.equal(dashboard.project.id,'p1');
  assert.equal(dashboard.kpis.progress_percent,50);
  assert.equal(buildMasterPlan(schedule).milestones[0].id,'m1');
  assert.equal(buildProjectCalendar(schedule).events.length,2);
});

test('revised schedule and project versions preserve lineage', () => {
  const schedule = {start_date:'2026-10-01',finish_date:'2026-10-06',items:[
    {id:'a',start_date:'2026-10-01',finish_date:'2026-10-03',duration_days:2,depends_on:[]},
    {id:'b',start_date:'2026-10-03',finish_date:'2026-10-06',duration_days:3,depends_on:['a']}
  ]};
  const revised = reviseSchedule(schedule,{delay_days:2});
  assert.equal(revised.finish_date,'2026-10-08');
  const version=createProjectVersion({version:1,label:'baseline',schedule});
  const next=createProjectVersion({version:2,label:'revised',schedule:revised,parent_version:version.version});
  assert.equal(next.parent_version,1);
  assert.equal(next.version,2);
  const snap=createProjectSnapshot({project:{id:'p1'},schedule:revised,version:next});
  assert.equal(snap.version.version,2);
  assert.equal(snap.schedule.finish_date,'2026-10-08');
});

test('project status distinguishes planned, active and completed', () => {
  assert.equal(getProjectStatus({progress_percent:0}), 'planned');
  assert.equal(getProjectStatus({progress_percent:20}), 'active');
  assert.equal(getProjectStatus({progress_percent:100}), 'completed');
});
