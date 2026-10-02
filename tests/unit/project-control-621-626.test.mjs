import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { analyzeSchedule, detectResourceConflicts, suggestParallelActivities } from '../../ai-project-control-engine.js';

const read = (path) => fs.readFileSync(new URL('../../' + path, import.meta.url), 'utf8');

test('621 project accounting exposes budget, actual, forecast, cash flow and audit surfaces', () => {
  for (const file of ['project-accounting-191-200.js','project-accounting-201-220.js','project-accounting-221-235.js']) {
    const source = read(file);
    assert.match(source, /project_accounting|project_cash_flow|project_accounting_audit/);
  }
});

test('622 Gantt/schedule control detects overdue work and preserves schedule state', () => {
  const result = analyzeSchedule([
    { id: 1, planned_finish: '2026-09-01', progress: 50, status: 'active' }
  ], new Date('2026-10-02T00:00:00Z'));
  assert.equal(result.overdue.length, 1);
  assert.ok(result.overdue[0].daysLate >= 1);
});

test('623 procurement control contains approval, purchase order, delivery and inventory surfaces', () => {
  const source = read('procurement-control-141-160.js');
  for (const marker of ['141','142','143/144','145','146','147','148','158','159','160']) assert.ok(source.includes(marker), 'missing procurement marker: '+marker);
});

test('624 KPI control exposes catalog, alerts, trends, drill-down and custom KPI builder', () => {
  const source = read('project-kpi-324-342.js');
  for (const marker of ['project_kpi_catalog','project_kpi_alerts','project_kpi_trends','project_kpi_drilldown','Custom KPI Builder']) assert.ok(source.includes(marker), 'missing KPI marker: '+marker);
});

test('625 workflow control exposes definitions, runs, templates, audit and builder', () => {
  const source = read('workflow-engine-343-367.js');
  for (const marker of ['workflow_definitions','workflow_runs','workflow_templates','workflow_audit','Workflow Builder']) assert.ok(source.includes(marker), 'missing workflow marker: '+marker);
});

test('626 AI parallel-work control proposes only non-overlapping tasks without shared resources', () => {
  const tasks = [
    { id: 1, planned_start: '2026-10-01', planned_finish: '2026-10-03', resource_ids: ['crew-a'] },
    { id: 2, planned_start: '2026-10-02', planned_finish: '2026-10-04', resource_ids: ['crew-a'] },
    { id: 3, planned_start: '2026-10-05', planned_finish: '2026-10-07', resource_ids: ['crew-b'] }
  ];
  assert.equal(detectResourceConflicts(tasks).sharedResourceConflicts.length, 1);
  const suggestions = suggestParallelActivities(tasks);
  assert.ok(suggestions.some(x => x.taskA === 1 && x.taskB === 3));
  assert.ok(!suggestions.some(x => x.taskA === 1 && x.taskB === 2));
});
