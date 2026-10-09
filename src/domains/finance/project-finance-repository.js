import { createRepository } from '../../core/data/repository.js';

function requireProjectId(projectId) {
  if (projectId == null || projectId === '') throw new TypeError('projectId is required');
}

export function createProjectFinanceRepository(client) {
  if (!client?.from) throw new TypeError('Supabase client is required');

  const summary = createRepository(client, 'project_accounting_summary');
  const ledger = createRepository(client, 'project_ledger');
  const budgets = createRepository(client, 'project_budgets');
  const budgetLines = createRepository(client, 'project_budget_lines');
  const cashFlow = createRepository(client, 'project_cash_flow');
  const paymentSchedule = createRepository(client, 'project_payment_schedule');
  const documents = createRepository(client, 'project_financial_documents');
  const paymentApprovals = createRepository(client, 'project_payment_approvals');

  const byProject = (projectId, orderBy, limit = 500) => ({
    filters: [{ column: 'project_id', value: projectId }],
    ...(orderBy ? { orderBy } : {}),
    limit
  });

  return Object.freeze({
    async getVertical(projectId) {
      requireProjectId(projectId);
      const [summaries, ledgerRows, budgetRows, cashFlowRows, scheduleRows, documentRows, approvalRows] = await Promise.all([
        summary.list(byProject(projectId, { column: 'project_id' }, 1)),
        ledger.list(byProject(projectId, { column: 'entry_date' })),
        budgets.list(byProject(projectId, { column: 'version_no' })),
        cashFlow.list(byProject(projectId, { column: 'flow_date' })),
        paymentSchedule.list(byProject(projectId, { column: 'due_date' })),
        documents.list(byProject(projectId, { column: 'document_date' })),
        paymentApprovals.list(byProject(projectId, { column: 'created_at' }))
      ]);
      const budgetIds = budgetRows.map((row) => row.id).filter((id) => id != null);
      const lines = budgetIds.length
        ? await budgetLines.list({
            filters: [{ column: 'budget_id', op: 'in', value: budgetIds }],
            limit: 1000
          })
        : [];
      return Object.freeze({
        project_id: projectId,
        summary: summaries[0] ?? null,
        ledger: ledgerRows,
        budgets: budgetRows,
        budget_lines: lines,
        cash_flow: cashFlowRows,
        payment_schedule: scheduleRows,
        documents: documentRows,
        payment_approvals: approvalRows
      });
    }
  });
}
