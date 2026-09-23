/**
 * BuildWise Development Feasibility Domain
 * Pure deterministic land-development model.
 */
import { calculateMonthlyIrr, annualizeMonthlyRate } from './scenario-engine.js';

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
    irr: annualizeMonthlyRate(calculateMonthlyIrr(cashflows))
  };
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
