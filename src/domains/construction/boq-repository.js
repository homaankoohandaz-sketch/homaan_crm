import { createRepository } from '../../core/data/repository.js';

function req(v, name) {
  if (v == null || v === '') throw new TypeError(`${name} is required`);
}

export function createProjectBoqRepository(client) {
  if (!client?.from) throw new TypeError('Supabase client is required');
  const items = createRepository(client, 'project_boq_items');

  return Object.freeze({
    async createItem(input = {}) {
      req(input.project_id, 'project_id');
      req(String(input.item_name || '').trim(), 'item_name');
      // Do not insert generated budget_amount
      return items.create({
        project_id: input.project_id,
        code: input.code ?? null,
        item_name: String(input.item_name).trim(),
        category: input.category ?? null,
        specification: input.specification ?? null,
        unit: input.unit ?? null,
        planned_qty: Number(input.planned_qty) || 0,
        unit_budget: Number(input.unit_budget) || 0,
        wbs_id: input.wbs_id ?? null
      });
    },

    async listItems(projectId) {
      req(projectId, 'project_id');
      return items.list({
        filters: [{ column: 'project_id', value: projectId }],
        orderBy: { column: 'id' },
        limit: 200
      });
    }
  });
}
