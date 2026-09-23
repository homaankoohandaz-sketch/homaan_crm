import assert from 'node:assert/strict';
import fs from 'node:fs';

globalThis.window = globalThis;
eval(fs.readFileSync('engines.js', 'utf8'));

const today = new Date().toISOString();
const observations = [100, 102, 98, 101].map((price_per_meter, index) => ({
  price_per_meter,
  area: 100 + index,
  region: 1,
  neighborhood: 'A',
  property_type: 'apartment',
  observed_at: today
}));

const valuation = BuildWiseEngines.valueProperty(
  { area: 100, region: 1, neighborhood: 'A', property_type: 'apartment' },
  observations,
  { asOf: today }
);

assert.equal(valuation.status, 'ready');
assert.equal(valuation.comparable_count, 4);
assert.ok(valuation.low_value < valuation.estimated_value && valuation.estimated_value < valuation.high_value);
assert.equal(
  BuildWiseEngines.valueProperty({ area: 100 }, observations.slice(0, 2), { asOf: today }).status,
  'insufficient_data'
);

const estimate = BuildWiseEngines.calculateConstruction(
  { indirect_percent: 10, contingency_percent: 5, project_multiplier: 1.2 },
  [
    { item_code: 'RC', quantity: 10, unit_rate: 100 },
    { item_code: 'FOAM', quantity: 4 }
  ],
  [{ item_code: 'FOAM', unit_price: 50 }]
);

assert.equal(estimate.direct_cost, 1200);
assert.equal(estimate.total_cost, 1663);
console.log('engines.test.js: passed');
