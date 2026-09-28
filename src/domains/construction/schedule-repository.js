import { createRepository } from '../../core/data/repository.js';

const TABLE = 'construction_projects';

export function createProjectScheduleRepository(client) {
  const repository = createRepository(client, TABLE);
  return Object.freeze({
    async save(projectId, schedule) {
      if (projectId == null || projectId === '') throw new TypeError('projectId is required');
      if (!schedule || typeof schedule !== 'object' || Array.isArray(schedule)) {
        throw new TypeError('schedule is required');
      }
      const row = await repository.getById(projectId);
      if (!row) return null;
      const assumptions = {
        ...(row.assumptions && typeof row.assumptions === 'object' ? row.assumptions : {}),
        projectSchedule: schedule
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
    schedule: row.assumptions?.projectSchedule ?? null
  };
}
