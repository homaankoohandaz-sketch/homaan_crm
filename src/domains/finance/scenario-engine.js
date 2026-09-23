/**
 * BuildWise Finance Domain
 * Deterministic scenario calculations. No UI or persistence dependencies.
 */
export function calculateScenario(input = {}) {
  const n = (v) => Number.isFinite(Number(v)) ? Number(v) : 0;
  const months = Math.max(1, Math.floor(n(input.months) || 1));
  const initialInvestment = n(input.initialInvestment);
  const exitValue = n(input.exitValue);
  const operatingCashflows = Array.isArray(input.monthlyCashflows)
    ? input.monthlyCashflows.map(n).slice(0, months)
    : Array(months).fill(0);

  while (operatingCashflows.length < months) operatingCashflows.push(0);

  const cashflows = [-initialInvestment, ...operatingCashflows];
  cashflows[cashflows.length - 1] += exitValue;

  const totalCashIn = operatingCashflows.reduce((s, x) => s + Math.max(0, x), 0) + exitValue;
  const totalCashOut = initialInvestment + operatingCashflows.reduce((s, x) => s + Math.max(0, -x), 0);
  const netProfit = totalCashIn - totalCashOut;
  const roi = initialInvestment ? netProfit / initialInvestment * 100 : 0;

  return {
    months,
    cashflows,
    initialInvestment,
    exitValue,
    totalCashIn,
    totalCashOut,
    netProfit,
    roi
  };
}

export function compareScenarios(scenarios = []) {
  return scenarios.map((scenario) => ({
    id: scenario.id ?? null,
    name: scenario.name ?? 'Scenario',
    ...calculateScenario(scenario)
  }));
}
