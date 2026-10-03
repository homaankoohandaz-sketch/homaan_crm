import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createProjectManagementModel,
  buildGanttRows,
  createBaseline,
  compareToBaseline,
  calculateFloat,
  getProjectStatus
} from '../../src/domains/construction/project-management-core.js';

const wbs = [
  { id:'a', type:'task', name:'Excavate', duration_days:2, depends_on:[], progress:100 },
  { id:'b', type:'task', name:'Foundation', duration_days:3, depends_on:['a'], progress:50 },
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
  assert.equal(model.status.progress_percent, 50);
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

test('project status distinguishes planned, active and completed', () => {
  assert.equal(getProjectStatus({progress_percent:0}), 'planned');
  assert.equal(getProjectStatus({progress_percent:20}), 'active');
  assert.equal(getProjectStatus({progress_percent:100}), 'completed');
});
