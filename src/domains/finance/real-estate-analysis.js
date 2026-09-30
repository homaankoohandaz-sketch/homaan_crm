export function analyzeLand(input = {}) {
  const landArea = positive(input.landArea);
  const landPrice = positive(input.landPrice);
  const buildableRatio = positive(input.buildableRatio ?? 1);
  const constructionCostPerGrossM2 = positive(input.constructionCostPerGrossM2);
  const salePricePerSaleableM2 = positive(input.salePricePerSaleableM2);
  const usefulRatio = positive(input.usefulRatio ?? 0.8);
  const grossBuildArea = landArea * buildableRatio;
  const usefulArea = grossBuildArea * usefulRatio;
  const constructionCost = grossBuildArea * constructionCostPerGrossM2;
  const expectedRevenue = usefulArea * salePricePerSaleableM2;
  const totalCost = landPrice + constructionCost;
  const profit = expectedRevenue - totalCost;
  return {
    landArea, landPrice, grossBuildArea, usefulArea, constructionCost,
    expectedRevenue, totalCost, profit,
    margin: expectedRevenue ? profit / expectedRevenue : null
  };
}

export function analyzeParticipation({ landValue = 0, constructionCost = 0, expectedRevenue = 0, ownerShare = null } = {}) {
  const total = positive(landValue) + positive(constructionCost);
  const impliedOwnerShare = total ? positive(landValue) / total : 0;
  const developerShare = Math.max(0, 1 - impliedOwnerShare);
  return {
    landValue: positive(landValue),
    constructionCost: positive(constructionCost),
    expectedRevenue: positive(expectedRevenue),
    impliedOwnerShare,
    developerShare,
    proposedOwnerShare: ownerShare == null ? impliedOwnerShare : clamp01(ownerShare),
    estimatedProfit: positive(expectedRevenue) - total
  };
}

export function analyzeBarter({ offeredValue = 0, receivedValue = 0, cashAdjustment = 0, transactionCosts = 0 } = {}) {
  const netReceived = positive(receivedValue) + positive(cashAdjustment) - positive(transactionCosts);
  const difference = netReceived - positive(offeredValue);
  return {
    offeredValue: positive(offeredValue),
    receivedValue: positive(receivedValue),
    cashAdjustment: positive(cashAdjustment),
    transactionCosts: positive(transactionCosts),
    netReceived,
    valueDifference: difference,
    balanced: Math.abs(difference) < 0.000001
  };
}

export function compareScenarios(scenarios = []) {
  return (scenarios || []).map((scenario, index) => {
    const result = analyzeLand(scenario);
    return { id: scenario.id ?? index + 1, ...result };
  });
}

function positive(value) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : 0;
}
function clamp01(value) { return Math.min(1, Math.max(0, Number(value) || 0)); }
