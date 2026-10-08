import { createProjectProcurementRepository } from './procurement-repository.js';

function kpis(items) {
  const total = items.length;
  const delivered = items.filter((item) => ['delivered', 'completed', 'closed'].includes(item.status)).length;
  const open = items.filter((item) => !['delivered', 'completed', 'closed', 'cancelled'].includes(item.status)).length;
  const outstanding = items.reduce(
    (sum, item) => sum + Math.max(0, Number(item.quantity || 0) - Number(item.received_quantity || 0) - Number(item.rejected_quantity || 0)),
    0
  );
  const ordered = items.filter((item) => ['ordered', 'partial', 'partially_delivered', 'delivered'].includes(item.status)).length;
  return Object.freeze({
    total_items: total,
    delivered_items: delivered,
    open_items: open,
    ordered_items: ordered,
    outstanding_quantity: outstanding
  });
}

export function createProjectProcurementControlRepository(client) {
  const procurement = createProjectProcurementRepository(client);

  return Object.freeze({
    async getVertical(projectId, options = {}) {
      const items = await procurement.listByProject(projectId, options);
      return Object.freeze({
        project_id: projectId,
        items,
        kpis: kpis(items)
      });
    },

    async list(projectId, options = {}) {
      return procurement.listByProject(projectId, options);
    },

    async create(input) {
      return procurement.create(input);
    },

    async updateById(id, input) {
      return procurement.updateById(id, input);
    },

    async getById(id) {
      return procurement.getById(id);
    }
  });
}
