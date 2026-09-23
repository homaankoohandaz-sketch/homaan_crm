import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateScenario,
  calculateNpv,
  calculateMonthlyIrr,
  annualizeMonthlyRate
} from '../../src/domains/finance/scenario-engine.js';

test('scenario engine calculates profit and ROI', () => {
  const result = calculateScenario({
    months: 12,
    initialInvestment: 100,
    monthlyCashflows: Array(12).fill(0),
    exitValue: 150
  });

  assert.equal(result.netProfit, 50);
  assert.equal(result.roi, 50);
  assert.equal(result.cashflows.length, 13);
});

test('NPV and IRR are deterministic', () => {
  const cashflows = [-100, 0, 0, 121];
  const irr = calculateMonthlyIrr(cashflows);

  assert.ok(Math.abs(irr - 0.065) < 0.01);
  assert.equal(calculateNpv(cashflows, irr) < 0.0001, true);
  assert.equal(annualizeMonthlyRate(0), 0);
});
