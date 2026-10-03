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
    },

    paymentControl(input = {}) {
      const receivables = rows(input.receivables);
      const payables = rows(input.payables);
      const payments = rows(input.payments);
      const advances = rows(input.advances);
      const retentions = rows(input.retentions);
      const installments = rows(input.installments);
      const receipts = rows(input.receipts);
      const invoices = rows(input.invoices);

      const sum = (items, field = 'amount') =>
        items.reduce((total, row) => total + positive(row?.[field]), 0);

      const totalReceivables = sum(receivables);
      const totalPayables = sum(payables);
      const totalPaid = sum(payments);
      const totalAdvances = sum(advances);
      const totalRetention = sum(retentions);
      const totalInstallments = sum(installments);
      const approvedPayments = payments.filter(x => x?.approvalStatus === 'approved');
      const pendingPayments = payments.filter(x => x?.approvalStatus === 'pending');

      const forecastAtCompletion =
        positive(input.actualCost) +
        positive(input.committedCost) +
        Math.max(0, positive(input.remainingCost));

      return {
        forecastAtCompletion,
        cashFlow: {
          inflows: totalReceivables,
          outflows: totalPayables,
          net: totalReceivables - totalPayables
        },
        receivables: {
          count: receivables.length,
          total: totalReceivables,
          outstanding: sum(receivables, 'outstanding')
        },
        payables: {
          count: payables.length,
          total: totalPayables,
          outstanding: sum(payables, 'outstanding')
        },
        contractorPayments: payments.filter(x => x?.partyType === 'contractor'),
        supplierPayments: payments.filter(x => x?.partyType === 'supplier'),
        advancePayments: totalAdvances,
        retention: totalRetention,
        installments: {
          count: installments.length,
          total: totalInstallments,
          paid: sum(installments, 'paid'),
          outstanding: sum(installments, 'outstanding')
        },
        paymentSchedule: payments
          .map((x, index) => ({
            id: x?.id ?? index + 1,
            dueDate: x?.dueDate ?? null,
            amount: positive(x?.amount),
            approvalStatus: x?.approvalStatus ?? 'pending',
            status: x?.status ?? 'scheduled'
          }))
          .sort((a, b) => String(a.dueDate ?? '').localeCompare(String(b.dueDate ?? ''))),
        paymentApproval: {
          approved: approvedPayments.length,
          pending: pendingPayments.length
        },
        invoiceArchive: invoices.map((x, index) => ({
          id: x?.id ?? index + 1,
          invoiceNumber: x?.invoiceNumber ?? null,
          documentId: x?.documentId ?? null,
          status: x?.status ?? 'archived'
        })),
        receiptArchive: receipts.map((x, index) => ({
          id: x?.id ?? index + 1,
          receiptNumber: x?.receiptNumber ?? null,
          documentId: x?.documentId ?? null,
          status: x?.status ?? 'archived'
        })),
        accountingAuditTrail: [...invoices, ...receipts, ...payments].map((x, index) => ({
          eventId: x?.eventId ?? index + 1,
          type: x?.type ?? (x?.receiptNumber ? 'receipt' : x?.invoiceNumber ? 'invoice' : 'payment'),
          documentId: x?.documentId ?? null,
          occurredAt: x?.occurredAt ?? null,
          actorId: x?.actorId ?? null
        }))
      };
    }

    ledger(input = {}) {
      const entries = rows(input.entries).map((entry, index) => ({
        id: entry?.id ?? index + 1,
        projectId: input.projectId ?? entry?.projectId ?? null,
        accountId: entry?.accountId ?? 'unassigned',
        amount: n(entry?.amount),
        date: entry?.date ?? null,
        reference: entry?.reference ?? null
      }));
      const balanceByAccount = {};
      for (const entry of entries) balanceByAccount[entry.accountId] = (balanceByAccount[entry.accountId] ?? 0) + entry.amount;
      return { projectId: input.projectId ?? null, entries, balanceByAccount, totalBalance: entries.reduce((s, x) => s + x.amount, 0) };
    },

    budgetControl(input = {}) {
      const budget = positive(input.budget);
      const revisedBudget = positive(input.revisedBudget || budget);
      const actual = positive(input.actual);
      const committed = positive(input.committed);
      const remaining = positive(input.remaining);
      return {
        budget,
        revisedBudget,
        actual,
        committed,
        remaining,
        totalProjectCost: actual + committed + remaining
      };
    },

    costControl(input = {}) {
      const entries = rows(input.entries);
      const baseIndex = positive(input.baseCostIndex) || 100;
      const currentIndex = positive(input.currentCostIndex) || baseIndex;
      const result = {
        byWbs: groupSum(entries.map(x => ({...x, amountToman: x.amount})), 'wbsId'),
        byPhase: groupSum(entries.map(x => ({...x, amountToman: x.amount})), 'phaseId'),
        byFloor: groupSum(entries.map(x => ({...x, amountToman: x.amount})), 'floorId'),
        byUnit: groupSum(entries.map(x => ({...x, amountToman: x.amount})), 'unitId'),
        byContractor: groupSum(entries.map(x => ({...x, amountToman: x.amount})), 'contractorId'),
        bySupplier: groupSum(entries.map(x => ({...x, amountToman: x.amount})), 'supplierId'),
        byMaterial: groupSum(entries.map(x => ({...x, amountToman: x.amount})), 'materialId'),
        byPurchase: groupSum(entries.map(x => ({...x, amountToman: x.amount})), 'purchaseId'),
        byInvoice: groupSum(entries.map(x => ({...x, amountToman: x.amount})), 'invoiceId'),
        byPayment: groupSum(entries.map(x => ({...x, amountToman: x.amount})), 'paymentId'),
        byDate: byDate(entries.map(x => ({...x, amountToman: x.amount})))
      };
      const total = entries.reduce((s, x) => s + positive(x.amount), 0);
      result.totalBaseValue = total;
      result.totalCurrentValue = total * currentIndex / baseIndex;
      result.varianceVsBudget = result.totalCurrentValue - total;
      result.inflationPct = baseIndex ? (currentIndex / baseIndex - 1) * 100 : 0;
      return result;
    },
  });
}
