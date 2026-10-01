import assert from 'node:assert/strict';
import { createBaseline, calculateVariance } from '../ai-project-control-engine.js';

const tasks = [
  { id: 1, planned_start: '2026-10-01', planned_finish: '2026-10-10', duration_days: 10, planned_cost: 1000, progress: 0 },
  { id: 2, planned_start: '2026-10-11', planned_finish: '2026-10-20', duration_days: 10, planned_cost: 2000, progress: 0 }
];

const baseline = createBaseline(tasks, { id: 'p1', current_budget: 5000 });
assert.equal(baseline.tasks.length, 2);
assert.equal(baseline.project.budget, 5000);
assert.equal(baseline.tasks[0].planned_finish, '2026-10-10');

const variance = calculateVariance(
  [
    { id: 1, planned_start: '2026-10-01', planned_finish: '2026-10-12', duration_days: 12, planned_cost: 1000, actual_cost: 1200, progress: 80 },
    { id: 2, planned_start: '2026-10-11', planned_finish: '2026-10-22', duration_days: 12, planned_cost: 2000, actual_cost: 2100, progress: 40 }
  ],
  baseline
);
assert.equal(variance.taskCount, 2);
assert.equal(variance.costVariance, 300);
assert.equal(variance.scheduleVarianceDays, 2);
assert.equal(variance.tasks[0].finishVarianceDays, 2);
assert.equal(variance.tasks[1].finishVarianceDays, 2);
console.log('ai-project-control baseline/variance tests passed');