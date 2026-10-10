import test from 'node:test';
import assert from 'node:assert/strict';
import { createProjectFinanceRepository } from '../../src/domains/finance/project-finance-repository.js';

function fakeClient() {
  const tables = {
    project_accounting_summary: [{ project_id: 42, budget: 1000, actual_cost: 300, committed_cost: 100, remaining_cost: 600 }],
    project_ledger: [{ id: 1, project_id: 42, debit: 300, credit: 0 }],
    project_budgets: [{ id: 2, project_id: 42, version_no: 1 }],
    project_budget_lines: [{ id: 3, budget_id: 2 }],
    project_cash_flow: [{ project_id: 42, flow_date: '2026-10-01', net_cash_flow: 300 }],
    project_payment_schedule: [{ id: 4, project_id: 42, due_date: '2026-10-20' }],
    project_financial_documents: [{ id: 5, project_id: 42, document_type: 'invoice' }],
    project_payment_approvals: [{ id: 6, project_id: 42, status: 'pending' }]
  };
  const client = {
    from(table) {
      const state = { filters: [] };
      return {
        select() { return this; },
        limit() { return this; },
        order() { return this; },
        eq(column, value) { state.filters.push({ column, value }); return this; },
        in(column, values) { state.filters.push({ column, values, op: 'in' }); return this; },
        then(resolve, reject) {
          try {
            let rows = tables[table] || [];
            for (const filter of state.filters) rows = rows.filter(row => filter.op === 'in' ? filter.values.includes(row[filter.column]) : row[filter.column] === filter.value);
            resolve({ data: rows, error: null });
          } catch (error) { reject(error); }
        }
      };
    }
  };
  return { client };
}

test('finance repository loads project-scoped accounting snapshot from canonical tables and views', async () => {
  const { client } = fakeClient();
  const finance = createProjectFinanceRepository(client);
  const snapshot = await finance.getVertical(42);
  assert.equal(snapshot.summary.actual_cost, 300);
  assert.equal(snapshot.ledger.length, 1);
  assert.equal(snapshot.budgets.length, 1);
  assert.equal(snapshot.budget_lines.length, 1);
  assert.equal(snapshot.cash_flow.length, 1);
  assert.equal(snapshot.payment_schedule.length, 1);
  assert.equal(snapshot.documents.length, 1);
  assert.equal(snapshot.payment_approvals.length, 1);
});

test('finance repository rejects a missing project id before querying', async () => {
  const { client } = fakeClient();
  const finance = createProjectFinanceRepository(client);
  await assert.rejects(() => finance.getVertical(null), /projectId is required/);
});
