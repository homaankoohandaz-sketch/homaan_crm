/**
 * BuildWise AI — Configurable floor pricing + plan → unit → price matrix
 * Checklist: 689–692
 *
 * Calculation layer only. It never invents a base price, floor number or cost:
 * missing critical inputs are reported as missing, not guessed (rules 772-773).
 * The 3–5% premium range is a DEFAULT POLICY, not a hard-coded constant (690).
 */

export const DEFAULT_FLOOR_PRICING_POLICY = Object.freeze({
  version: "floor-policy-1",
  minPct: 3,
  maxPct: 5,
  selectedPct: null,        // null → midpoint of [minPct, maxPct]
  mode: "linear",           // "linear" | "compound"
  baseFloor: 1,             // floors at/below this get no premium
  allowOutOfRange: false    // selectedPct outside [minPct,maxPct] needs explicit opt-in
});

const num = (v) => (v === null || v === undefined || v === "" ? NaN : Number(v));

export function resolveFloorPricingPolicy(overrides = {}) {
  const p = { ...DEFAULT_FLOOR_PRICING_POLICY, ...overrides };
  for (const k of ["minPct", "maxPct", "baseFloor"]) {
    if (!Number.isFinite(Number(p[k]))) throw new Error(`policy.${k} must be a finite number`);
    p[k] = Number(p[k]);
  }
  if (p.minPct < 0 || p.maxPct < p.minPct) throw new Error("policy range invalid: need 0 <= minPct <= maxPct");
  if (!["linear", "compound"].includes(p.mode)) throw new Error("policy.mode must be linear or compound");
  const selected = p.selectedPct === null || p.selectedPct === undefined
    ? (p.minPct + p.maxPct) / 2
    : Number(p.selectedPct);
  if (!Number.isFinite(selected) || selected < 0) throw new Error("policy.selectedPct must be a non-negative number");
  if (!p.allowOutOfRange && (selected < p.minPct || selected > p.maxPct)) {
    throw new Error("policy.selectedPct is outside the configured range; set allowOutOfRange to override explicitly");
  }
  return Object.freeze({ ...p, selectedPct: selected, allowOutOfRange: Boolean(p.allowOutOfRange) });
}

/** Cumulative premium (percent of base) for a floor. Returns null when floor is unknown. */
export function floorPremiumPct(floor, policyInput = {}) {
  const policy = policyInput.selectedPct !== undefined && policyInput.version
    ? policyInput : resolveFloorPricingPolicy(policyInput);
  const f = num(floor);
  if (!Number.isFinite(f)) return null;
  const steps = Math.max(0, f - policy.baseFloor);
  if (policy.mode === "compound") return round2((Math.pow(1 + policy.selectedPct / 100, steps) - 1) * 100);
  return round2(steps * policy.selectedPct);
}

/**
 * Plan → unit → price matrix (692). `units` come from the architectural result
 * (floor, area, optional cost). `basePricePerM2` is REQUIRED input.
 */
export function buildUnitPriceMatrix({ units = [], basePricePerM2, policy: policyInput = {} } = {}) {
  const base = num(basePricePerM2);
  if (!Number.isFinite(base) || base <= 0) throw new Error("basePricePerM2 is required and must be > 0");
  const policy = resolveFloorPricingPolicy(policyInput);
  const rows = [];
  const missing = [];
  units.forEach((u, i) => {
    const id = u.id ?? String(i + 1);
    const area = num(u.area ?? u.sellable_area);
    const premiumPct = floorPremiumPct(u.floor, policy);
    if (!Number.isFinite(area) || area <= 0 || premiumPct === null) {
      missing.push({ id, reason: !Number.isFinite(area) || area <= 0 ? "area_missing" : "floor_missing" });
      return;
    }
    const pricePerM2 = round2(base * (1 + premiumPct / 100));
    const total = round2(pricePerM2 * area);
    const cost = num(u.cost);
    rows.push(Object.freeze({
      id, floor: Number(u.floor), area, premiumPct, pricePerM2, total,
      cost: Number.isFinite(cost) ? cost : null,
      margin: Number.isFinite(cost) ? round2(total - cost) : null
    }));
  });
  const totalSale = round2(rows.reduce((s, r) => s + r.total, 0));
  return Object.freeze({
    policy, basePricePerM2: base, rows: Object.freeze(rows), missing: Object.freeze(missing),
    totals: Object.freeze({ units: rows.length, area: round2(rows.reduce((s, r) => s + r.area, 0)), sale: totalSale }),
    assumptions: Object.freeze({ policyVersion: policy.version, basePricePerM2: base, premiumRange: [policy.minPct, policy.maxPct] }),
    isForecast: false
  });
}

/** Architecture → financial model linkage (691). Cost is required input, never guessed. */
export function linkArchitectureToFinancialModel(matrix, { totalProjectCost } = {}) {
  const cost = num(totalProjectCost);
  if (!matrix || !Array.isArray(matrix.rows)) throw new Error("matrix is required");
  if (!Number.isFinite(cost) || cost <= 0) throw new Error("totalProjectCost is required and must be > 0");
  const sale = matrix.totals.sale;
  const profit = round2(sale - cost);
  return Object.freeze({
    totalProjectCost: cost, totalSale: sale, profit,
    marginPct: sale > 0 ? round2((profit / sale) * 100) : null,
    costPerM2: matrix.totals.area > 0 ? round2(cost / matrix.totals.area) : null,
    incompleteUnits: matrix.missing.length,
    complete: matrix.missing.length === 0
  });
}

function round2(v) { return Math.round(v * 100) / 100; }
