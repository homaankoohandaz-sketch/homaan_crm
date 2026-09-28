import { createRepository } from '../../core/data/repository.js';
import { calculateBoq } from './boq.js';

const TABLE = 'construction_projects';

export function createProjectBoqRepository(client) {
  const repository = createRepository(client, TABLE);

  return Object.freeze({
    async save(projectId, items) {
      if (projectId == null || projectId === '') throw new TypeError('projectId is required');
      const calculation = calculateBoq(items);
      const row = await repository.getById(projectId);
      if (!row) return null;

      const assumptions = {
        ...(row.assumptions && typeof row.assumptions === 'object' ? row.assumptions : {}),
        projectBoq: calculation
      };
      return hydrate(await repository.updateById(projectId, { assumptions }));
    },

    async get(projectId) {
      return hydrate(await repository.getById(projectId));
    }
  });
}

function hydrate(row) {
  if (!row) return null;
  return {
    ...row,
    boq: row.assumptions?.projectBoq ?? null
  };
}
