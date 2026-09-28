import test from 'node:test';
import assert from 'node:assert/strict';
import { createProjectFinanceModel } from '../../src/domains/finance/project-finance.js';

test('project finance summarizes commitments, payments and cash flow', () => {
  const f = createProjectFinanceModel();
  const result = f.summarize({ commitments: [{ amount: 100, paid: 40 }, { amount: 50, paid: 0 }], payments: [{ amount: 25 }, { amount: 15 }], plannedInflows: [{ month: 1, amount: 200 }], plannedOutflows: [{ month: 1, amount: 80 }, { month: 2, amount: 30 }] });
  assert.equal(result.committed, 150);
  assert.equal(result.committedOutstanding, 110);
  assert.equal(result.paid, 80);
  assert.equal(result.plannedNetByMonth[1], 120);
  assert.equal(result.plannedNetByMonth[2], -30);
});

test('sales offer model computes floor price and gross margin', () => {
  const f = createProjectFinanceModel();
  assert.deepEqual(f.offer({ cost: 100, askingPrice: 140, minimumMarginPct: 20 }), { cost: 100, askingPrice: 140, minimumPrice: 120, grossMargin: 40, grossMarginPct: 40 });
});
