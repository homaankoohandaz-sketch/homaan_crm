import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildGanttRows,
  buildKpiGroups,
  buildProcurementCalendar,
  buildFinancialSummary,
  buildUnitSalesMatrix,
  reorderWorkflowSteps,
  buildTimeline,
  professionalAnimationTokens
} from '../src/ui/project-views-493-500.js';

test('493 Gantt rows normalize schedule dates and progress', () => {
  const rows = buildGanttRows([{ id: 1, title: 'Foundation', planned_start: '2026-01-01', planned_end: '2026-01-10', progress: 40 }]);
  assert.deepEqual(rows[0], { id: 1, title: 'Foundation', start: '2026-01-01', end: '2026-01-10', progress: 40 });
});

test('494 KPI groups preserve canonical catalog metrics', () => {
  const groups = buildKpiGroups([{ kpi_code: 'progress', category: 'operations', value: 55 }, { kpi_code: 'roi', category: 'sales', value: 12 }]);
  assert.equal(groups.operations[0].kpi_code, 'progress');
  assert.equal(groups.sales[0].kpi_code, 'roi');
});

test('495 procurement calendar sorts required dates', () => {
  const rows = buildProcurementCalendar([{ id: 2, required_date: '2026-02-10' }, { id: 1, required_date: '2026-02-01' }]);
  assert.deepEqual(rows.map(x => x.id), [1, 2]);
});

test('496 financial summary aggregates budget, actual and committed', () => {
  assert.deepEqual(buildFinancialSummary([{ budget: 100, actual: 40, committed: 20 }, { budget: 50, actual: 10, committed: 30 }]), { budget: 150, actual: 50, committed: 50, variance: 100 });
});

test('497 unit sales matrix keeps units addressable by unit id', () => {
  const matrix = buildUnitSalesMatrix([{ unit_id: 'u1', floor: 2, status: 'available', area: 120 }, { unit_id: 'u2', floor: 2, status: 'sold', area: 130 }]);
  assert.deepEqual(matrix['2'].map(x => x.unit_id), ['u1', 'u2']);
});

test('498 workflow reorder moves a step without mutating input', () => {
  const input = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
  const output = reorderWorkflowSteps(input, 0, 2);
  assert.deepEqual(output.map(x => x.id), ['b', 'c', 'a']);
  assert.deepEqual(input.map(x => x.id), ['a', 'b', 'c']);
});

test('499 timeline sorts events chronologically', () => {
  const rows = buildTimeline([{ id: 2, occurred_at: '2026-03-02' }, { id: 1, occurred_at: '2026-03-01' }]);
  assert.deepEqual(rows.map(x => x.id), [1, 2]);
});

test('500 animation system exposes reusable timing tokens', () => {
  const tokens = professionalAnimationTokens();
  assert.equal(tokens.duration.fast, 120);
  assert.equal(tokens.duration.normal, 220);
  assert.equal(tokens.easing.standard, 'cubic-bezier(0.2, 0.8, 0.2, 1)');
});
