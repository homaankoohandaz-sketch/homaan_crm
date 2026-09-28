import { createRepository } from '../../core/data/repository.js';

const TABLE = 'construction_projects';

export function createProjectProgressRepository(client) {
  const repository = createRepository(client, TABLE);

  return Object.freeze({
    async save(projectId, snapshot) {
      if (projectId == null || projectId === '') throw new TypeError('projectId is required');
      if (!snapshot || typeof snapshot !== 'object' || Array.isArray(snapshot)) {
        throw new TypeError('snapshot is required');
      }
      const row = await repository.getById(projectId);
      if (!row) return null;
      const assumptions = {
        ...(row.assumptions && typeof row.assumptions === 'object' ? row.assumptions : {}),
        projectProgress: snapshot
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
    progress: row.assumptions?.projectProgress ?? null
  };
}
