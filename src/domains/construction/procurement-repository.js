import { createRepository } from '../../core/data/repository.js';

const TABLE = 'project_procurement';
const STATUSES = new Set(['requested', 'ordered', 'partial', 'delivered', 'cancelled']);

function normalize(input = {}) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new TypeError('procurement item is required');
  }
  if (input.project_id == null || input.project_id === '') {
    throw new TypeError('project_id is required');
  }
  if (!String(input.item_name ?? '').trim()) {
    throw new TypeError('item_name is required');
  }
  if (input.status != null && !STATUSES.has(input.status)) {
    throw new TypeError('invalid procurement status');
  }

  return {
    ...(input.id != null ? { id: input.id } : {}),
    project_id: input.project_id,
    boq_item_id: input.boq_item_id ?? null,
    item_name: String(input.item_name).trim(),
    specification: input.specification ?? null,
    quantity: Math.max(0, Number(input.quantity) || 0),
    unit: input.unit ?? null,
    unit_price: Math.max(0, Number(input.unit_price) || 0),
    supplier_name: input.supplier_name ?? null,
    status: input.status ?? 'requested',
    required_at: input.required_at ?? null,
    requested_at: input.requested_at ?? null,
    ordered_at: input.ordered_at ?? null,
    delivered_at: input.delivered_at ?? null,
    notes: input.notes ?? null
  };
}

export function createProjectProcurementRepository(client) {
  const repository = createRepository(client, TABLE);

  return Object.freeze({
    async create(item) {
      return repository.create(normalize(item));
    },

    async getById(id) {
      return repository.getById(id);
    },

    async updateById(id, item) {
      return repository.updateById(id, normalize({ ...item, id }));
    },

    async listByProject(projectId, options = {}) {
      if (projectId == null || projectId === '') throw new TypeError('project_id is required');
      return repository.list({
        ...options,
        filters: [...(options.filters ?? []), { column: 'project_id', value: projectId }],
        orderBy: options.orderBy ?? { column: 'required_at' }
      });
    }
  });
}
