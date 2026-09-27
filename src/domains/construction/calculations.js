/**
 * BuildWise Construction Domain
 * Pure calculations only. No DOM, Supabase or UI dependencies.
 */
export function calculateConstruction(input = {}) {
  const n = (v) => Number.isFinite(Number(v)) ? Number(v) : 0;
  const pct = (v) => n(v) / 100;

  const land = n(input.land);
  const coverage = pct(input.coverage);
  const reg = n(input.reg);
  const lowerRatio = pct(input.lowerRatio);
  const lowerFloors = Math.max(0, n(input.lowerFloors));
  const balcony = n(input.balcony);
  const roof = n(input.roof);
  const efficiency = pct(input.efficiency);

  const ground = land * coverage;
  const upper = ground * reg;
  const lower = land * lowerRatio * lowerFloors;
  const baseGross = ground + upper + lower + balcony + roof;

  const extraGross =
    n(input.extraCount) * n(input.extraArea) +
    n(input.console) +
    n(input.parking) +
    n(input.storage);

  const totalGross = baseGross + extraGross;
  const totalSellable = totalGross * efficiency;
  const commercial = Math.min(Math.max(0, n(input.commercial)), totalSellable);
  const residential = Math.max(0, totalSellable - commercial);

  const buildBase = totalGross * n(input.buildCost);
  const construction =
    buildBase +
    n(input.services) +
    n(input.extraBroker) +
    n(input.engineering) +
    n(input.renovation) +
    n(input.ownerPayment);

  const landCapital = land * n(input.landPrice);
  const totalCapital = construction + landCapital;

  const residentialReturn = residential * n(input.salePrice);
  const commercialReturn = commercial * n(input.commercialPrice);
  const totalReturn = residentialReturn + commercialReturn;
  const constructionShare = totalCapital ? construction / totalCapital : 0;
  const landShare = totalCapital ? landCapital / totalCapital : 0;

  const builderReturn = totalReturn * constructionShare;
  const ownerReturn = totalReturn * landShare;
  const builderProfit = builderReturn - construction;
  const ownerProfit = ownerReturn - landCapital;
  const projectProfit = totalReturn - totalCapital;

  return {
    land,
    width: n(input.width),
    reg,
    coverage,
    lowerRatio,
    lowerFloors,
    ground,
    upper,
    lower,
    balcony,
    roof,
    efficiency,
    baseGross,
    extraGross,
    totalGross,
    totalSellable,
    commercial,
    residentialSellable: residential,
    buildBase,
    constructionCapital: construction,
    landCapital,
    totalCapital,
    residentialReturn,
    commercialReturn,
    totalReturn,
    constructionShare,
    landShare,
    builderReturn,
    ownerReturn,
    builderProfit,
    ownerProfit,
    projectProfit,
    projectROI: totalCapital ? projectProfit / totalCapital * 100 : 0,
    builderROI: construction ? builderProfit / construction * 100 : 0,
    ownerROI: landCapital ? ownerProfit / landCapital * 100 : 0,
    builderArea: residential * constructionShare,
    ownerArea: residential * landShare
  };
}
