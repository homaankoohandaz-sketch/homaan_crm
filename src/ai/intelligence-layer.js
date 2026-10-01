import { validateAction } from './contracts/action-contract.js';

const n = v => Number.isFinite(Number(v)) ? Number(v) : 0;
const list = v => Array.isArray(v) ? v : [];

export function createAIIntelligence() {
  return Object.freeze({
    financial(input = {}) {
      const revenue = n(input.revenue);
      const cost = n(input.cost);
      const cash = n(input.cash);
      const receivable = n(input.receivable);
      const payable = n(input.payable);
      const profit = revenue - cost;
      return { revenue, cost, profit, marginPct: revenue ? profit / revenue * 100 : 0, cash, netWorkingPosition: cash + receivable - payable };
    },

    procurement(input = {}) {
      const items = list(input.items);
      const open = items.filter(x => !['received','closed','cancelled'].includes(x.status));
      const overdue = open.filter(x => x.dueAt && new Date(x.dueAt).getTime() < Date.now());
      return { total: items.length, open: open.length, overdue: overdue.length, exposure: open.reduce((s, x) => s + n(x.amount), 0) };
    },

    sales(input = {}) {
      const opportunities = list(input.opportunities);
      const won = opportunities.filter(x => ['won','closed'].includes(x.status));
      const value = won.reduce((s, x) => s + n(x.value), 0);
      return { total: opportunities.length, won: won.length, conversionPct: opportunities.length ? won.length / opportunities.length * 100 : 0, wonValue: value };
    },

    memory(input = {}) {
      const entries = list(input.entries);
      const query = String(input.query || '').trim().toLowerCase();
      return entries.filter(x => !query || [x.title, x.content, ...(x.tags || [])].join(' ').toLowerCase().includes(query))
        .slice(0, Math.max(1, n(input.limit) || 10));
    },

    action(action, { approved = false } = {}) {
      const validation = validateAction(action);
      if (!validation.valid) return { executable: false, status: 'invalid', errors: validation.errors };
      if (!approved) return { executable: false, status: 'approval_required', action };
      return { executable: true, status: 'approved', action };
    },

    async execute(action, { approved = false, executor } = {}) {
      const prepared = this.action(action, { approved });
      if (!prepared.executable) return prepared;
      if (typeof executor !== 'function') return { executable: false, status: 'executor_required', action };
      const result = await executor(action);
      return { executable: true, status: 'executed', action, result };
    },

    explain({ decision, evidence = [], assumptions = [], risks = [], alternatives = [] } = {}) {
      return {
        decision: decision ?? null,
        evidence: list(evidence),
        assumptions: list(assumptions),
        risks: list(risks),
        alternatives: list(alternatives),
        generatedAt: new Date().toISOString()
      };
    }
  });
}
