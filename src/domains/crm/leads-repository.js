import { createRepository } from '../../core/data/repository.js';

const TABLE = 'leads';

export function createLeadsRepository(client) {
  const repo = createRepository(client, TABLE);

  return Object.freeze({
    listOpen(limit = 100) {
      return repo.list({
        filters: [{ column: 'status', value: 'open' }],
        orderBy: { column: 'updated_at' },
        ascending: false,
        limit
      });
    },
    get(id) {
      return repo.getById(id);
    },
    create(lead) {
      return repo.create(lead);
    },
    update(id, lead) {
      return repo.updateById(id, lead);
    }
  });
}
