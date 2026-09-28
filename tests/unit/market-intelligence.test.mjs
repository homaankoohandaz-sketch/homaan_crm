import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateLiquidity,
  buildMarketSnapshot,
  compareToBenchmark,
  historicalWindow,
  buildScenarioSeries,
  buildInvestmentProposal
} from '../src/domains/intelligence/market-intelligence.js';

test('liquidity analysis is deterministic and bounded', () => {
  const r = calculateLiquidity({ askingPrice: 10_000, monthlyDemand: 8, comparableSupply: 20, daysOnMarket: 30 });
  assert.equal(r.status, 'ready');
  assert.ok(r.score >= 0 && r.score <= 100);
  assert.ok(r.expectedDaysToSell > 0);
});

test('market snapshot requires dated observations and reports freshness', () => {
  const asOf = '2026-09-28T12:00:00Z';
  const rows = [
    { price_per_meter: 100, observed_at: '2026-09-28T10:00:00Z', region: 1 },
    { price_per_meter: 110, observed_at: '2026-09-20T10:00:00Z', region: 1 }
  ];
  const r = buildMarketSnapshot(rows, { asOf, maxAgeDays: 30 });
  assert.equal(r.status, 'ready');
  assert.equal(r.observationCount, 2);
  assert.equal(r.latestObservedAt, '2026-09-28T10:00:00Z');
});

test('benchmark comparison handles gold and dollar denominators', () => {
  assert.equal(compareToBenchmark({ propertyPrice: 180, benchmarkPrice: 18, unitsPerProperty: 1 }, 'gold').multiple, 10);
  assert.equal(compareToBenchmark({ propertyPrice: 180, benchmarkPrice: 45 }, 'usd').multiple, 4);
});

test('historical windows and scenario series preserve explicit periods', () => {
  const asOf = '2026-09-28T00:00:00Z';
  const rows = [
    { observed_at: '2026-03-28T00:00:00Z', price_per_meter: 100 },
    { observed_at: '2026-09-20T00:00:00Z', price_per_meter: 130 }
  ];
  assert.equal(historicalWindow(rows, 6, asOf).length, 2);
  const series = buildScenarioSeries(100, { monthlyGrowth: 0.02, months: 3 });
  assert.deepEqual(series.map(x => x.value), [100, 102, 104.04, 106.1208]);
});

test('investment proposal labels scenarios and never presents them as guarantees', () => {
  const r = buildInvestmentProposal({
    propertyValue: 100,
    investment: 70,
    exitValue: 120,
    months: 12,
    confidence: 80
  });
  assert.equal(r.status, 'ready');
  assert.equal(r.isGuarantee, false);
  assert.equal(r.label, 'scenario');
  assert.match(r.disclaimer, /تضمین/);
});
