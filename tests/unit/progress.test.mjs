import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateProgress, summarizeProgress } from '../../src/domains/construction/progress.js';

test('calculateProgress clamps completion and derives earned duration', () => {
  const result = calculateProgress({ planned: 10, actual: 6, weight: 2 });
  assert.equal(result.percent, 60);
  assert.equal(result.weight, 2);
  assert.equal(result.earned_weight, 1.2);
});

test('summarizeProgress calculates weighted project KPI', () => {
  const result = summarizeProgress([
    { id: 'a', planned: 10, actual: 10, weight: 1 },
    { id: 'b', planned: 20, actual: 10, weight: 3 }
  ]);
  assert.equal(result.percent, 62.5);
  assert.equal(result.completed_items, 1);
  assert.equal(result.total_items, 2);
  assert.equal(result.remaining_percent, 37.5);
});

test('summarizeProgress exposes schedule variance from baseline and forecast dates', () => {
  const result = summarizeProgress([
    { id: 'a', planned: 10, actual: 5, weight: 1, baseline_finish: '2026-10-10', forecast_finish: '2026-10-14' }
  ]);
  assert.equal(result.schedule_variance_days, 4);
});
