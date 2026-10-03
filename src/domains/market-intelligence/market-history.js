/**
 * BuildWise AI — Market history / comparison contracts
 * Checklist: 082–100
 *
 * Calculation layer only. It never fabricates market observations or forecasts.
 */

export function normalizeObservation(input = {}) {
  const date = String(input.date || "").trim();
  const price = Number(input.propertyPrice);
  if (!date || !Number.isFinite(price)) throw new Error("date and propertyPrice are required");
  return Object.freeze({
    date,
    propertyPrice: price,
    goldPrice18k: finiteOrNull(input.goldPrice18k),
    dollarPrice: finiteOrNull(input.dollarPrice),
    source: input.source || null,
    retrievedAt: input.retrievedAt || null
  });
}

export function sortHistory(items = []) {
  return items.map(normalizeObservation).sort((a,b) => a.date.localeCompare(b.date));
}

export function comparePeriods(history = [], months = 12) {
  const sorted = sortHistory(history);
  if (sorted.length < 2) return null;
  const latest = sorted.at(-1);
  const target = new Date(latest.date);
  target.setMonth(target.getMonth() - months);
  let baseline = sorted[0];
  for (const item of sorted) {
    if (new Date(item.date) <= target) baseline = item;
  }
  return {
    months,
    from: baseline.date,
    to: latest.date,
    propertyChangePct: pct(latest.propertyPrice, baseline.propertyPrice),
    goldChangePct: ratioChange(latest.goldPrice18k, baseline.goldPrice18k),
    dollarChangePct: ratioChange(latest.dollarPrice, baseline.dollarPrice)
  };
}

export function propertyValueInGoldGrams(propertyPrice, goldPricePerGram) {
  const p = Number(propertyPrice), g = Number(goldPricePerGram);
  if (!(p >= 0) || !(g > 0)) return null;
  return p / g;
}

export function buildHistoricalSeries(history = [], metric = "propertyPrice") {
  return sortHistory(history)
    .filter(x => Number.isFinite(x[metric]))
    .map(x => ({ date: x.date, value: x[metric] }));
}

export function buildScenarioSeries(observation, scenarios = []) {
  return scenarios.map(s => ({
    name: String(s.name || "Scenario"),
    date: observation?.date || null,
    value: Number(s.value),
    isForecast: true,
    isGuarantee: false,
    source: s.source || null
  }));
}

export function assertScenarioNotGuarantee(series = []) {
  return series.every(x => x.isForecast === true && x.isGuarantee === false);
}

function finiteOrNull(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}
function pct(current, baseline) {
  if (!Number.isFinite(current) || !Number.isFinite(baseline) || baseline === 0) return null;
  return ((current - baseline) / baseline) * 100;
}
function ratioChange(current, baseline) {
  return pct(current, baseline);
}
