import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateDevelopmentFeasibility, compareDevelopmentScenarios } from '../../src/domains/finance/feasibility-engine.js';

test('development feasibility calculates built area, saleable area and profit', () => {
  const result = calculateDevelopmentFeasibility({
    area: 300,
    footprintPercent: 60,
    floors: 4,
    efficiency: 0.82,
    buildCostPerMeter: 25_000_000,
    salePricePerMeter: 60_000_000,
    landCost: 0,
    months: 24
  });

  assert.equal(result.grossBuilt, 720);
  assert.equal(result.sellable, 590.4);
  assert.equal(result.totalCost, 18_000_000_000);
  assert.equal(result.totalSale, 35_424_000_000);
  assert.equal(result.netProfit, 17_424_000_000);
  assert.equal(result.cashflows.length, 25);
});

test('scenario comparison changes only sale price multiplier', () => {
  const scenarios = compareDevelopmentScenarios({
    area: 300,
    footprintPercent: 60,
    floors: 4,
    efficiency: 0.82,
    buildCostPerMeter: 25_000_000,
    salePricePerMeter: 60_000_000,
    months: 24
  });

  assert.equal(scenarios.length, 3);
  assert.ok(scenarios[0].totalSale < scenarios[1].totalSale);
  assert.ok(scenarios[1].totalSale < scenarios[2].totalSale);
});
