import { createRepository } from '../../core/data/repository.js';

const TABLE = 'crm_people';

export function createPeopleRepository(client) {
  const repo = createRepository(client, TABLE);

  return Object.freeze({
    listActive(limit = 100) {
      return repo.list({
        filters: [{ column: 'active', value: true }],
        orderBy: { column: 'updated_at' },
        ascending: false,
        limit
      });
    },
    get(id) {
      return repo.getById(id);
    },
    create(person) {
      return repo.create(person);
    },
    update(id, person) {
      return repo.updateById(id, person);
    }
  });
}
