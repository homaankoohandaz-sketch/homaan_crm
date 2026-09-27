/**
 * BuildWise Finance Domain
 * Deterministic finance calculations. No UI or persistence dependencies.
 */

const number = (value, fallback = 0) => Number.isFinite(Number(value)) ? Number(value) : fallback;

export function calculateScenario(input = {}) {
  const months = Math.max(1, Math.floor(number(input.months, 1)));
  const initialInvestment = number(input.initialInvestment);
  const exitValue = number(input.exitValue);
  const operatingCashflows = Array.isArray(input.monthlyCashflows)
    ? input.monthlyCashflows.map((value) => number(value)).slice(0, months)
    : Array(months).fill(0);

  while (operatingCashflows.length < months) operatingCashflows.push(0);

  const cashflows = [-initialInvestment, ...operatingCashflows];
  cashflows[cashflows.length - 1] += exitValue;

  const totalCashIn = operatingCashflows.reduce((sum, value) => sum + Math.max(0, value), 0) + exitValue;
  const totalCashOut = initialInvestment + operatingCashflows.reduce((sum, value) => sum + Math.max(0, -value), 0);
  const netProfit = totalCashIn - totalCashOut;
  const roi = initialInvestment ? (netProfit / initialInvestment) * 100 : 0;

  return {
    months,
    cashflows,
    initialInvestment,
    exitValue,
    totalCashIn,
    totalCashOut,
    netProfit,
    roi,
    monthlyIrr: calculateMonthlyIrr(cashflows),
    annualIrr: annualizeMonthlyRate(calculateMonthlyIrr(cashflows))
  };
}

export function calculateNpv(cashflows = [], monthlyRate = 0) {
  return cashflows.reduce((sum, cashflow, month) => {
    return sum + number(cashflow) / Math.pow(1 + monthlyRate, month);
  }, 0);
}

export function calculateMonthlyIrr(cashflows = []) {
  if (!Array.isArray(cashflows) || cashflows.length < 2) return 0;

  let rate = 0.02;
  for (let iteration = 0; iteration < 200; iteration += 1) {
    let npv = 0;
    let derivative = 0;

    for (let month = 0; month < cashflows.length; month += 1) {
      const denominator = Math.pow(1 + rate, month);
      if (!Number.isFinite(denominator) || denominator === 0) return 0;
      npv += number(cashflows[month]) / denominator;
      if (month > 0) {
        derivative -= month * number(cashflows[month]) / Math.pow(1 + rate, month + 1);
      }
    }

    if (Math.abs(derivative) < 1e-12) break;
    const next = rate - npv / derivative;
    if (!Number.isFinite(next) || next <= -0.999999) break;
    if (Math.abs(next - rate) < 1e-8) return next;
    rate = next;
  }

  return rate;
}

export function annualizeMonthlyRate(monthlyRate = 0) {
  const rate = number(monthlyRate);
  return (Math.pow(1 + rate, 12) - 1);
}

export function compareScenarios(scenarios = []) {
  return scenarios.map((scenario) => ({
    id: scenario.id ?? null,
    name: scenario.name ?? 'Scenario',
    ...calculateScenario(scenario)
  }));
}
