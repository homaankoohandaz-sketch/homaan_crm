import assert from "node:assert/strict";
import test from "node:test";
import {
  normalizeObservation,
  comparePeriods,
  propertyValueInGoldGrams,
  buildHistoricalSeries,
  buildScenarioSeries,
  assertScenarioNotGuarantee
} from "../../src/domains/market-intelligence/market-history.js";

const history = [
  {date:"2025-10-01",propertyPrice:100,goldPrice18k:10,dollarPrice:10},
  {date:"2026-04-01",propertyPrice:120,goldPrice18k:12,dollarPrice:11},
  {date:"2026-10-01",propertyPrice:150,goldPrice18k:15,dollarPrice:13}
];

test("082-100: historical and comparison contracts", () => {
  assert.equal(normalizeObservation(history[0]).propertyPrice, 100);
  const c = comparePeriods(history, 12);
  assert.equal(c.propertyChangePct, 50);
  assert.equal(c.goldChangePct, 50);
  assert.equal(c.dollarChangePct, 30);
  assert.equal(propertyValueInGoldGrams(150000, 1500), 100);
  assert.equal(buildHistoricalSeries(history, "propertyPrice").length, 3);
  const scenarios = buildScenarioSeries(history.at(-1), [{name:"base",value:180}]);
  assert.equal(scenarios[0].isForecast, true);
  assert.equal(scenarios[0].isGuarantee, false);
  assert.equal(assertScenarioNotGuarantee(scenarios), true);
});
