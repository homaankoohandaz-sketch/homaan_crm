import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const business = fs.readFileSync('src/core/business-engines.js', 'utf8');
const ctx = { console, Date, crypto: { randomUUID: () => 'test-id' } };
ctx.globalThis = ctx;
ctx.window = ctx;
vm.runInNewContext(business, ctx);

const w = ctx.BuildWiseWorkflow.create({
  steps: [
    { id: 'a', parallel_group: 'site' },
    { id: 'b', parallel_group: 'site' },
    { id: 'c', depends_on: ['a'] }
  ]
});
assert.equal(ctx.BuildWiseWorkflow.parallelCandidates(w).length, 2);
assert.equal(ctx.BuildWiseWorkflow.validate(w).valid, true);

const kpi = ctx.BuildWiseKPI.project({
  planned_value: 100,
  earned_value: 80,
  actual_cost: 100
});
assert.equal(kpi.CPI, 0.8);

const accounting = ctx.BuildWiseProjectAccounting.costPerSellableM2({
  land_current_value: 100,
  construction_current_cost: 200,
  total_built_area: 100,
  effective_ratio: 0.8
});
assert.equal(accounting.cost_per_sellable_m2, 3.75);

const procurement = fs.readFileSync('src/domains/procurement/engine.js', 'utf8');
vm.runInNewContext(procurement, ctx);
assert.equal(ctx.BuildWiseProcurement.need({ quantity: 10, received_quantity: 4 }).remaining_quantity, 6);

const sales = fs.readFileSync('src/domains/sales/engine.js', 'utf8');
vm.runInNewContext(sales, ctx);
assert.equal(ctx.BuildWiseBuilderSales.salesPrice({ cost: 100, target_margin_pct: 20 }).target_price, 120);

console.log('construction control engine tests: PASS');
