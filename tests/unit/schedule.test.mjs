import test from 'node:test';
import assert from 'node:assert/strict';
import { buildSchedule, getCriticalItems } from '../../src/domains/construction/schedule.js';

test('buildSchedule derives deterministic start and finish dates from WBS dependencies', () => {
  const schedule = buildSchedule([
    { id: 'a', type: 'task', name: 'Excavate', duration_days: 2, depends_on: [] },
    { id: 'b', type: 'task', name: 'Foundation', duration_days: 3, depends_on: ['a'] },
    { id: 'm1', type: 'milestone', name: 'Structure start', duration_days: 0, depends_on: ['b'] }
  ], { start_date: '2026-10-01' });

  assert.equal(schedule.items[0].start_date, '2026-10-01');
  assert.equal(schedule.items[0].finish_date, '2026-10-03');
  assert.equal(schedule.items[1].start_date, '2026-10-03');
  assert.equal(schedule.items[1].finish_date, '2026-10-06');
  assert.equal(schedule.items[2].start_date, '2026-10-06');
  assert.equal(schedule.items[2].finish_date, '2026-10-06');
});

test('getCriticalItems returns dependency-chain items ending at the latest finish', () => {
  const schedule = buildSchedule([
    { id: 'a', type: 'task', name: 'A', duration_days: 2, depends_on: [] },
    { id: 'b', type: 'task', name: 'B', duration_days: 5, depends_on: ['a'] },
    { id: 'c', type: 'task', name: 'C', duration_days: 1, depends_on: [] }
  ], { start_date: '2026-10-01' });

  assert.deepEqual(getCriticalItems(schedule).map((x) => x.id), ['a', 'b']);
});
