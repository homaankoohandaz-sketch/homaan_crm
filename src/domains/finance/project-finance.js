const n = (v, fallback = 0) => Number.isFinite(Number(v)) ? Number(v) : fallback;
const rows = (v) => Array.isArray(v) ? v : [];

function positive(v) {
  return Math.max(0, n(v));
}

function groupSum(entries, key) {
  const out = {};
  for (const entry of entries) {
    const id = entry?.[key] ?? 'unassigned';
    out[id] = (out[id] ?? 0) + positive(entry?.amountToman);
  }
  return out;
}

function byDate(entries) {
  const out = {};
  for (const entry of entries) {
    const date = entry?.date ?? 'undated';
    out[date] = (out[date] ?? 0) + positive(entry?.amountToman);
  }
  return out;
}

function normalizeRate(value) {
  return positive(value);
}

function equivalent(amountToman, rate) {
  const r = normalizeRate(rate);
  return r ? amountToman / r : null;
}

function inflate(amount, fromIndex, currentIndex) {
  const from = positive(fromIndex);
  const current = positive(currentIndex);
  if (!from || !current) return null;
  return amount * current / from;
}

export function createProjectFinanceModel() {
  return Object.freeze({
    summarize(input = {}) {
      const commitments = rows(input.commitments);
      const payments = rows(input.payments);
      const committed = commitments.reduce((s, x) => s + positive(x.amount), 0);
      const paidAgainstCommitments = commitments.reduce((s, x) => s + positive(x.paid), 0);
      const directPayments = payments.reduce((s, x) => s + positive(x.amount), 0);
      const paid = paidAgainstCommitments + directPayments;
      const plannedNetByMonth = {};
      for (const x of rows(input.plannedInflows)) plannedNetByMonth[x.month] = (plannedNetByMonth[x.month] ?? 0) + n(x.amount);
      for (const x of rows(input.plannedOutflows)) plannedNetByMonth[x.month] = (plannedNetByMonth[x.month] ?? 0) - n(x.amount);
      return {
        committed,
        committedOutstanding: Math.max(0, committed - paidAgainstCommitments),
        paid,
        plannedNetByMonth
      };
    },

    offer(input = {}) {
      const cost = positive(input.cost);
      const askingPrice = positive(input.askingPrice);
      const minimumPrice = cost * (1 + n(input.minimumMarginPct, 0) / 100);
      const grossMargin = askingPrice - cost;
      return {
        cost,
        askingPrice,
        minimumPrice,
        grossMargin,
        grossMarginPct: cost ? grossMargin / cost * 100 : 0
      };
    },

    costLedger(input = {}) {
      const entries = rows(input.entries).map((entry, index) => {
        const amountToman = positive(entry.amountToman ?? entry.amount);
        const transactionDollarRate = normalizeRate(entry.transactionDollarRate ?? entry.dollarRate);
        const transactionGoldRate = normalizeRate(entry.transactionGoldRate ?? entry.goldRate);
        const currentDollarRate = normalizeRate(input.currentDollarRate);
        const currentGoldRate = normalizeRate(input.currentGoldRate);
        const budget = positive(entry.budgetToman);
        const actual = positive(entry.actualToman ?? amountToman);
        const committed = positive(entry.committedToman);
        return {
          id: entry.id ?? index + 1,
          date: entry.date ?? null,
          amountToman,
          wbsId: entry.wbsId ?? null,
          phaseId: entry.phaseId ?? null,
          floorId: entry.floorId ?? null,
          unitId: entry.unitId ?? null,
          contractorId: entry.contractorId ?? null,
          supplierId: entry.supplierId ?? null,
          materialId: entry.materialId ?? null,
          purchaseId: entry.purchaseId ?? null,
          invoiceId: entry.invoiceId ?? null,
          paymentId: entry.paymentId ?? null,
          dollarEquivalentAtTransaction: equivalent(amountToman, transactionDollarRate),
          goldEquivalentAtTransaction: equivalent(amountToman, transactionGoldRate),
          currentDollarEquivalent: equivalent(amountToman, currentDollarRate),
          currentGoldEquivalent: equivalent(amountToman, currentGoldRate),
          budgetToman: budget,
          actualToman: actual,
          committedToman: committed,
          varianceToman: actual - budget,
          committedVsActualToman: committed - actual,
          inflationAdjustedToman: inflate(
            amountToman,
            entry.transactionCostIndex,
            input.currentCostIndex
          ),
          transactionDollarRate: transactionDollarRate || null,
          transactionGoldRate: transactionGoldRate || null
        };
      });

      const total = entries.reduce((s, x) => s + x.amountToman, 0);
      const actual = entries.reduce((s, x) => s + x.actualToman, 0);
      const committed = entries.reduce((s, x) => s + x.committedToman, 0);
      const budget = entries.reduce((s, x) => s + x.budgetToman, 0);

      return {
        entries,
        totalToman: total,
        budgetToman: budget,
        actualToman: actual,
        committedToman: committed,
        varianceToman: actual - budget,
        committedVsActualToman: committed - actual,
        byWbs: groupSum(entries, 'wbsId'),
        byPhase: groupSum(entries, 'phaseId'),
        byFloor: groupSum(entries, 'floorId'),
        byUnit: groupSum(entries, 'unitId'),
        byContractor: groupSum(entries, 'contractorId'),
        bySupplier: groupSum(entries, 'supplierId'),
        byMaterial: groupSum(entries, 'materialId'),
        byPurchase: groupSum(entries, 'purchaseId'),
        byInvoice: groupSum(entries, 'invoiceId'),
        byPayment: groupSum(entries, 'paymentId'),
        byDate: byDate(entries),
        dollarEquivalentAtTransaction: entries.reduce((s, x) => s + positive(x.dollarEquivalentAtTransaction), 0),
        goldEquivalentAtTransaction: entries.reduce((s, x) => s + positive(x.goldEquivalentAtTransaction), 0),
        currentDollarEquivalent: entries.reduce((s, x) => s + positive(x.currentDollarEquivalent), 0),
        currentGoldEquivalent: entries.reduce((s, x) => s + positive(x.currentGoldEquivalent), 0),
        inflationAdjustedToman: entries.reduce((s, x) => s + positive(x.inflationAdjustedToman), 0),
        costVariance: {
          budgetVsActualToman: actual - budget,
          committedVsActualToman: committed - actual,
          budgetUtilizationPct: budget ? actual / budget * 100 : 0
        }
      };
    }
  });
}
