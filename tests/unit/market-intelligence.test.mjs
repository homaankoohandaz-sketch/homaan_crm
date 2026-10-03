import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateLiquidity,
  buildMarketSnapshot,
  compareToBenchmark,
  historicalWindow,
  buildScenarioSeries,
  buildInvestmentProposal,
} from '../../src/domains/intelligence/market-intelligence.js';

test('calculateLiquidity returns insufficient_data without asking price', () => {
  const result = calculateLiquidity({ monthlyDemand: 10, comparableSupply: 5, daysOnMarket: 20 });
  assert.equal(result.status, 'insufficient_data');
  assert.equal(result.score, 0);
  assert.equal(result.expectedDaysToSell, null);
});

test('calculateLiquidity scores demand/supply pressure and expected days', () => {
  const result = calculateLiquidity({
    monthlyDemand: 8,
    comparableSupply: 4,
    daysOnMarket: 15,
    askingPrice: 50_000_000_000,
  });
  assert.equal(result.status, 'ready');
  assert.ok(result.score >= 0 && result.score <= 100);
  assert.ok(result.expectedDaysToSell >= 7);
  assert.equal(result.demandSupplyRatio, 2);
});

test('buildMarketSnapshot filters by age and averages price_per_meter', () => {
  const asOf = '2026-10-03T00:00:00.000Z';
  const rows = [
    { observed_at: '2026-09-20T00:00:00.000Z', price_per_meter: 100 },
    { observed_at: '2026-09-25T00:00:00.000Z', price_per_meter: 200 },
    { observed_at: '2025-01-01T00:00:00.000Z', price_per_meter: 999 },
    { observed_at: 'not-a-date', price_per_meter: 50 },
  ];
  const snap = buildMarketSnapshot(rows, { asOf, maxAgeDays: 30 });
  assert.equal(snap.status, 'ready');
  assert.equal(snap.observationCount, 2);
  assert.equal(snap.averagePricePerMeter, 150);
  assert.equal(snap.latestObservedAt, '2026-09-25T00:00:00.000Z');
});

test('buildMarketSnapshot returns insufficient_data when no valid rows', () => {
  const snap = buildMarketSnapshot([], { asOf: '2026-10-03T00:00:00.000Z' });
  assert.equal(snap.status, 'insufficient_data');
  assert.equal(snap.observationCount, 0);
});

test('compareToBenchmark computes multiple and delta', () => {
  const result = compareToBenchmark({ propertyPrice: 120, benchmarkPrice: 100, unitsPerProperty: 1 });
  assert.equal(result.propertyPrice, 120);
  assert.equal(result.benchmarkPrice, 100);
  assert.equal(result.multiple, 1.2);
  assert.equal(result.delta, 20);
});

test('historicalWindow keeps only rows inside month window', () => {
  const asOf = '2026-10-03T00:00:00.000Z';
  const rows = [
    { observed_at: '2026-09-01T00:00:00.000Z' },
    { observed_at: '2026-04-01T00:00:00.000Z' },
    { observed_at: '2025-01-01T00:00:00.000Z' },
  ];
  const windowed = historicalWindow(rows, 6, asOf);
  assert.equal(windowed.length, 2);
  assert.equal(windowed[0].observed_at, '2026-04-01T00:00:00.000Z');
});

test('buildScenarioSeries compounds monthly growth', () => {
  const series = buildScenarioSeries(100, { monthlyGrowth: 0.1, months: 2 });
  assert.equal(series.length, 3);
  assert.equal(series[0].value, 100);
  assert.equal(series[1].value, 110);
  assert.equal(series[2].value, 121);
});

test('buildInvestmentProposal marks scenario as non-guarantee', () => {
  const result = buildInvestmentProposal({ investment: 100, exitValue: 130, confidence: 70 });
  assert.equal(result.status, 'ready');
  assert.equal(result.isGuarantee, false);
  assert.equal(result.netProfit, 30);
  assert.equal(result.roi, 30);
  assert.ok(result.disclaimer.includes('تضمین'));
});

test('buildInvestmentProposal returns insufficient_data when incomplete', () => {
  const result = buildInvestmentProposal({ investment: 0, exitValue: 100 });
  assert.equal(result.status, 'insufficient_data');
  assert.equal(result.isGuarantee, false);
});
