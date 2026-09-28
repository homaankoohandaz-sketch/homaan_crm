import test from 'node:test';
import assert from 'node:assert/strict';
import { createConstructionControlModel } from '../../src/domains/construction/control.js';

test('construction control normalizes RFI, quality, HSE, risk and corrective action records', () => {
  const control = createConstructionControlModel();
  assert.deepEqual(control.normalizeRfi({ id:'r1', title:'Clarify beam detail', priority:'high' }), {
    id:'r1', title:'Clarify beam detail', priority:'high', status:'open'
  });
  assert.equal(control.normalizeQuality({ id:'q1', title:'Concrete test', status:'passed' }).status, 'passed');
  assert.equal(control.normalizeHse({ id:'h1', title:'PPE inspection', severity:'medium' }).severity, 'medium');
  assert.equal(control.normalizeRisk({ id:'k1', title:'Price increase', probability:80, impact:60 }).score, 48);
  assert.equal(control.normalizeCorrectiveAction({ id:'c1', title:'Replace failed sample', status:'done' }).status, 'done');
});

test('construction control rejects invalid status and clamps risk inputs', () => {
  const control = createConstructionControlModel();
  assert.throws(() => control.normalizeRfi({ title:'x', status:'bad' }), /invalid RFI status/);
  assert.equal(control.normalizeRisk({ title:'x', probability:200, impact:-5 }).score, 0);
});
