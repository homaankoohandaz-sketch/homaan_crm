import assert from "node:assert/strict";
import test from "node:test";
import {
  DEFAULT_FLOOR_PRICING_POLICY, resolveFloorPricingPolicy, floorPremiumPct,
  buildUnitPriceMatrix, linkArchitectureToFinancialModel
} from "../../src/domains/sales/floor-pricing.js";

test("689-690: default 3–5% range is configurable, not hard-coded", () => {
  assert.equal(DEFAULT_FLOOR_PRICING_POLICY.minPct, 3);
  assert.equal(DEFAULT_FLOOR_PRICING_POLICY.maxPct, 5);
  assert.equal(resolveFloorPricingPolicy().selectedPct, 4);
  const p = resolveFloorPricingPolicy({ minPct: 2, maxPct: 8, selectedPct: 6 });
  assert.equal(p.selectedPct, 6);
  assert.throws(() => resolveFloorPricingPolicy({ selectedPct: 9 }), /outside the configured range/);
  assert.equal(resolveFloorPricingPolicy({ selectedPct: 9, allowOutOfRange: true }).selectedPct, 9);
  assert.throws(() => resolveFloorPricingPolicy({ minPct: 6, maxPct: 3 }), /range invalid/);
});

test("689: floor premium linear/compound; unknown floor is null not guessed", () => {
  assert.equal(floorPremiumPct(1), 0);
  assert.equal(floorPremiumPct(4), 12);                       // 3 steps × 4%
  assert.equal(floorPremiumPct(4, { mode: "compound", selectedPct: 5 }), 15.76);
  assert.equal(floorPremiumPct(0), 0);                        // below base clamps to 0
  assert.equal(floorPremiumPct(undefined), null);
});

test("691-692: plan → unit → price matrix and financial linkage", () => {
  const units = [
    { id: "A1", floor: 1, area: 100, cost: 5000 },
    { id: "A2", floor: 3, area: 100, cost: 5000 },
    { id: "X", floor: null, area: 80 },
    { id: "Y", floor: 2 }
  ];
  const m = buildUnitPriceMatrix({ units, basePricePerM2: 100, policy: {} });
  assert.equal(m.rows.length, 2);
  assert.equal(m.rows[0].total, 10000);
  assert.equal(m.rows[1].pricePerM2, 108);                    // 2 steps × 4% = 8%
  assert.equal(m.rows[1].margin, 5800);
  assert.deepEqual(m.missing.map(x => x.reason), ["floor_missing", "area_missing"]);
  assert.equal(m.assumptions.policyVersion, "floor-policy-1");
  assert.throws(() => buildUnitPriceMatrix({ units, basePricePerM2: 0 }), /basePricePerM2/);
  const f = linkArchitectureToFinancialModel(m, { totalProjectCost: 10000 });
  assert.equal(f.totalSale, 20800);
  assert.equal(f.profit, 10800);
  assert.equal(f.complete, false);                            // 2 units incomplete → flagged
  assert.throws(() => linkArchitectureToFinancialModel(m, {}), /totalProjectCost/);
});
