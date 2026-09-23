/**
 * BuildWise Development Feasibility Domain
 * Pure deterministic land-development model.
 */
const finite = (value, fallback = 0) => Number.isFinite(Number(value)) ? Number(value) : fallback;

export function calculateDevelopmentFeasibility(input = {}) {
  const area = Math.max(0, finite(input.area));
  const footprintPercent = Math.max(0, finite(input.footprintPercent, 60));
  const floors = Math.max(0, finite(input.floors, 4));
  const efficiency = Math.min(1, Math.max(0, finite(input.efficiency, 0.82)));
  const buildCostPerMeter = Math.max(0, finite(input.buildCostPerMeter));
  const landCost = Math.max(0, finite(input.landCost));
  const salePricePerMeter = Math.max(0, finite(input.salePricePerMeter));
  const months = Math.max(1, Math.floor(finite(input.months, 24)));

  const grossBuilt = area * (footprintPercent / 100) * floors;
  const sellable = grossBuilt * efficiency;
  const totalCost = grossBuilt * buildCostPerMeter;
  const totalSale = sellable * salePricePerMeter;
  const netProfit = totalSale - totalCost - landCost;

  const cashflows = new Array(months + 1).fill(0);
  cashflows[0] -= landCost;
  const monthlyCost = totalCost / months;
  for (let month = 1; month <= months; month += 1) cashflows[month] -= monthlyCost;
  cashflows[months - 1] += totalSale * 0.5;
  cashflows[months] += totalSale * 0.5;

  return {
    area,
    footprintPercent,
    floors,
    efficiency,
    buildCostPerMeter,
    landCost,
    salePricePerMeter,
    months,
    grossBuilt,
    sellable,
    totalCost,
    totalSale,
    netProfit,
    roi: totalCost + landCost ? (netProfit / (totalCost + landCost)) * 100 : 0,
    cashflows,
    irr: annualizedIrr(cashflows)
  };
}

export function annualizedIrr(cashflows = []) {
  if (!Array.isArray(cashflows) || cashflows.length < 2) return 0;
  let rate = 0.02;
  for (let iteration = 0; iteration < 200; iteration += 1) {
    let npv = 0;
    let derivative = 0;
    for (let t = 0; t < cashflows.length; t += 1) {
      const denominator = Math.pow(1 + rate, t);
      if (!Number.isFinite(denominator) || denominator === 0) return 0;
      npv += cashflows[t] / denominator;
      if (t > 0) derivative -= (t * cashflows[t]) / (denominator * (1 + rate));
    }
    if (Math.abs(derivative) < 1e-12) break;
    const next = rate - npv / derivative;
    if (!Number.isFinite(next) || next <= -0.999999) break;
    if (Math.abs(next - rate) < 1e-8) {
      rate = next;
      break;
    }
    rate = next;
  }
  return (Math.pow(1 + rate, 12) - 1) * 100;
}

export function compareDevelopmentScenarios(input = {}, multipliers = [0.85, 1, 1.15]) {
  return multipliers.map((saleMultiplier) => ({
    saleMultiplier,
    ...calculateDevelopmentFeasibility({
      ...input,
      salePricePerMeter: finite(input.salePricePerMeter) * saleMultiplier
    })
  }));
}
