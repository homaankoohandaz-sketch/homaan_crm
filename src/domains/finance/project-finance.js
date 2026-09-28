const n = (v) => Number.isFinite(Number(v)) ? Number(v) : 0;
const rows = (v) => Array.isArray(v) ? v : [];

export function createProjectFinanceModel() {
  return Object.freeze({
    summarize(input = {}) {
      const commitments = rows(input.commitments);
      const payments = rows(input.payments);
      const committed = commitments.reduce((s, x) => s + Math.max(0, n(x.amount)), 0);
      const paidAgainstCommitments = commitments.reduce((s, x) => s + Math.max(0, n(x.paid)), 0);
      const directPayments = payments.reduce((s, x) => s + Math.max(0, n(x.amount)), 0);
      const paid = paidAgainstCommitments + directPayments;
      const plannedNetByMonth = {};
      for (const x of rows(input.plannedInflows)) plannedNetByMonth[x.month] = (plannedNetByMonth[x.month] ?? 0) + n(x.amount);
      for (const x of rows(input.plannedOutflows)) plannedNetByMonth[x.month] = (plannedNetByMonth[x.month] ?? 0) - n(x.amount);
      return { committed, committedOutstanding: Math.max(0, committed - paidAgainstCommitments), paid, plannedNetByMonth };
    },
    offer(input = {}) {
      const cost = Math.max(0, n(input.cost));
      const askingPrice = Math.max(0, n(input.askingPrice));
      const minimumPrice = cost * (1 + n(input.minimumMarginPct, 0) / 100);
      const grossMargin = askingPrice - cost;
      return { cost, askingPrice, minimumPrice, grossMargin, grossMarginPct: cost ? grossMargin / cost * 100 : 0 };
    }
  });
}
