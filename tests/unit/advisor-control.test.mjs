import test from 'node:test';
import assert from 'node:assert/strict';
import { createAdvisorControl } from '../../src/domains/crm/advisor-control.js';

test('advisor control routes requests without duplicating the public request entity', () => {
  const a = createAdvisorControl();
  const result = a.routeRequest({ requestId: 7, advisorId: 'u1', reason: 'region' });
  assert.deepEqual(result, { requestId: 7, advisorId: 'u1', reason: 'region', status: 'assigned' });
});

test('advisor workload counts open assigned work', () => {
  const a = createAdvisorControl();
  assert.deepEqual(a.workload('u1', [
    { assignedTo: 'u1', status: 'open' },
    { assignedTo: 'u1', status: 'completed' },
    { assignedTo: 'u2', status: 'open' }
  ]), { advisorId: 'u1', open: 1, completed: 1, total: 2 });
});

test('advisor KPI summarizes response, completion and workload', () => {
  const a = createAdvisorControl();
  const result = a.kpi('u1', {
    requests: [{ advisorId:'u1', status:'assigned' }, { advisorId:'u1', status:'accepted' }],
    followups: [{ assignedTo:'u1', status:'completed' }, { assignedTo:'u1', status:'open' }],
    responses: [{ advisorId:'u1', response:'accepted' }, { advisorId:'u1', response:'rejected' }]
  });
  assert.equal(result.requests, 2);
  assert.equal(result.followupsCompleted, 1);
  assert.equal(result.acceptanceRatePct, 50);
});

test('advisor scorecard preserves component metrics and weighted score', () => {
  const a = createAdvisorControl();
  const result = a.scorecard({ responseRatePct:80, completionRatePct:90, workloadHealthPct:70, customerOutcomePct:60 });
  assert.equal(result.score, 76);
  assert.deepEqual(result.weights, { response:0.25, completion:0.30, workload:0.20, outcome:0.25 });
});

test('promotion and hot-slot governance are explicit and auditable', () => {
  const a = createAdvisorControl();
  assert.equal(a.promotion({ advisorId:'u1', itemId:9, reason:'priority' }).status, 'proposed');
  assert.equal(a.hotSlot({ advisorId:'u1', slot:'2026-10-02T10:00:00Z', reason:'manager priority' }).status, 'proposed');
  assert.equal(a.transfer({ requestId:7, fromAdvisorId:'u1', toAdvisorId:'u2', actorId:'m1' }).status, 'transferred');
});
