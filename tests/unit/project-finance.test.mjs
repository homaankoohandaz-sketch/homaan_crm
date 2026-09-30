import test from 'node:test';
import assert from 'node:assert/strict';
import { createProjectFinanceModel } from '../../src/domains/finance/project-finance.js';

test('project finance summarizes commitments, payments and cash flow', () => {
  const f = createProjectFinanceModel();
  const result = f.summarize({ commitments: [{ amount: 100, paid: 40 }, { amount: 50, paid: 0 }], payments: [{ amount: 25 }, { amount: 15 }], plannedInflows: [{ month: 1, amount: 200 }], plannedOutflows: [{ month: 1, amount: 80 }, { month: 2, amount: 30 }] });
  assert.equal(result.committed, 150);
  assert.equal(result.committedOutstanding, 110);
  assert.equal(result.paid, 80);
  assert.equal(result.plannedNetByMonth[1], 120);
  assert.equal(result.plannedNetByMonth[2], -30);
});

test('sales offer model computes floor price and gross margin', () => {
  const f = createProjectFinanceModel();
  assert.deepEqual(f.offer({ cost: 100, askingPrice: 140, minimumMarginPct: 20 }), { cost: 100, askingPrice: 140, minimumPrice: 120, grossMargin: 40, grossMarginPct: 40 });
});


test('project accounting cost ledger covers dimensions, equivalents and variance', () => {
  const f = createProjectFinanceModel();
  const result = f.costLedger({
    currentDollarRate: 500000,
    currentGoldRate: 60000000,
    currentCostIndex: 120,
    entries: [
      {
        id: 'c1',
        date: '2026-09-01',
        amountToman: 100000000,
        wbsId: 'W1',
        phaseId: 'P1',
        floorId: 'F1',
        unitId: 'U1',
        contractorId: 'C1',
        supplierId: 'S1',
        materialId: 'M1',
        purchaseId: 'PO1',
        invoiceId: 'INV1',
        paymentId: 'PAY1',
        transactionDollarRate: 400000,
        transactionGoldRate: 50000000,
        budgetToman: 90000000,
        actualToman: 100000000,
        committedToman: 110000000,
        transactionCostIndex: 100
      },
      {
        id: 'c2',
        date: '2026-09-02',
        amountToman: 50000000,
        wbsId: 'W1',
        phaseId: 'P2',
        floorId: 'F2',
        unitId: 'U2',
        contractorId: 'C2',
        supplierId: 'S1',
        materialId: 'M2',
        purchaseId: 'PO2',
        invoiceId: 'INV2',
        paymentId: 'PAY2',
        transactionDollarRate: 400000,
        transactionGoldRate: 50000000,
        budgetToman: 60000000,
        actualToman: 50000000,
        committedToman: 45000000,
        transactionCostIndex: 110
      }
    ]
  });

  assert.equal(result.totalToman, 150000000);
  assert.equal(result.byWbs.W1, 150000000);
  assert.equal(result.byPhase.P1, 100000000);
  assert.equal(result.byFloor.F2, 50000000);
  assert.equal(result.byUnit.U1, 100000000);
  assert.equal(result.byContractor.C1, 100000000);
  assert.equal(result.bySupplier.S1, 150000000);
  assert.equal(result.byMaterial.M2, 50000000);
  assert.equal(result.byPurchase.PO1, 100000000);
  assert.equal(result.byInvoice.INV2, 50000000);
  assert.equal(result.byPayment.PAY1, 100000000);
  assert.equal(result.byDate['2026-09-01'], 100000000);
  assert.equal(result.entries[0].dollarEquivalentAtTransaction, 250);
  assert.equal(result.entries[0].goldEquivalentAtTransaction, 2);
  assert.equal(result.entries[0].currentDollarEquivalent, 200);
  assert.equal(result.entries[0].currentGoldEquivalent, 100 / 60);
  assert.equal(result.entries[0].inflationAdjustedToman, 120000000);
  assert.equal(result.varianceToman, 0);
  assert.equal(result.committedVsActualToman, 5000000);
  assert.equal(result.costVariance.budgetVsActualToman, 0);
  assert.equal(result.costVariance.committedVsActualToman, 5000000);
});


test('project payment control covers forecast, cash flow, approvals and audit archives', () => {
  const f = createProjectFinanceModel();
  const result = f.paymentControl({
    actualCost: 100,
    committedCost: 50,
    remainingCost: 25,
    receivables: [{ amount: 200, outstanding: 80 }],
    payables: [{ amount: 120, outstanding: 40 }],
    payments: [
      { id: 'p1', amount: 60, partyType: 'contractor', approvalStatus: 'approved', dueDate: '2026-10-01' },
      { id: 'p2', amount: 30, partyType: 'supplier', approvalStatus: 'pending', dueDate: '2026-09-30' }
    ],
    advances: [{ amount: 20 }],
    retentions: [{ amount: 10 }],
    installments: [{ amount: 50, paid: 20, outstanding: 30 }],
    invoices: [{ invoiceNumber: 'INV-1', documentId: 'DOC-1', occurredAt: '2026-09-30', actorId: 'u1' }],
    receipts: [{ receiptNumber: 'REC-1', documentId: 'DOC-2', occurredAt: '2026-09-30', actorId: 'u1' }]
  });

  assert.equal(result.forecastAtCompletion, 175);
  assert.deepEqual(result.cashFlow, { inflows: 200, outflows: 120, net: 80 });
  assert.equal(result.receivables.outstanding, 80);
  assert.equal(result.payables.outstanding, 40);
  assert.equal(result.contractorPayments[0].id, 'p1');
  assert.equal(result.supplierPayments[0].id, 'p2');
  assert.equal(result.advancePayments, 20);
  assert.equal(result.retention, 10);
  assert.deepEqual(result.installments, { count: 1, total: 50, paid: 20, outstanding: 30 });
  assert.equal(result.paymentSchedule[0].id, 'p2');
  assert.deepEqual(result.paymentApproval, { approved: 1, pending: 1 });
  assert.equal(result.invoiceArchive[0].documentId, 'DOC-1');
  assert.equal(result.receiptArchive[0].documentId, 'DOC-2');
  assert.equal(result.accountingAuditTrail.length, 4);
});
