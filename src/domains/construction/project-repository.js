import { createRepository } from '../../core/data/repository.js';

const TABLE = 'construction_projects';

function serialize(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new TypeError('project is required');
  }
  // Canonical project row only. Hierarchy is NOT stored in assumptions (relational hierarchy-repository).
  const assumptions =
    input.assumptions && typeof input.assumptions === 'object' && !Array.isArray(input.assumptions)
      ? { ...input.assumptions }
      : {};
  delete assumptions.projectHierarchy;

  return {
    ...(input.id ? { id: input.id } : {}),
    title: input.title,
    land_area: Number(input.landArea) || 0,
    footprint_percent: Number(input.coverage) || 0,
    floors: Number(input.floors ?? input.reg) || 0,
    gross_built_area: Number(input.totalGross) || 0,
    net_sellable_area: Number(input.totalSellable) || 0,
    estimated_cost: Number(input.totalCapital) || 0,
    expected_sale_price: Number(input.totalReturn) || 0,
    expected_duration_months: input.expectedDurationMonths ?? null,
    status: input.status || 'draft',
    created_by: input.createdBy ?? input.created_by ?? null,
    assumptions
  };
}

function hydrate(row) {
  if (!row) return null;
  return { ...row };
}

export function createProjectRepository(client) {
  const repository = createRepository(client, TABLE);
  return Object.freeze({
    async create(project) {
      return hydrate(await repository.create(serialize(project)));
    },
    async getById(id) {
      return hydrate(await repository.getById(id));
    },
    async updateById(id, project) {
      return hydrate(await repository.updateById(id, serialize(project)));
    },
    async list(options = {}) {
      const rows = await repository.list(options);
      return rows.map(hydrate);
    }
  });
}
