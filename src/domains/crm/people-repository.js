import { createRepository } from '../../core/data/repository.js';

const TABLE = 'crm_people';
const PERSON_TYPES = new Set(['buyer', 'owner', 'builder', 'investor', 'agent', 'manager', 'unknown']);

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
    listByType(personType, limit = 100) {
      if (!PERSON_TYPES.has(personType)) throw new TypeError('Unsupported person type');
      return repo.list({
        filters: [{ column: 'person_type', value: personType }],
        orderBy: { column: 'updated_at' },
        ascending: false,
        limit
      });
    },
    search(search, limit = 100) {
      const q = String(search ?? '').trim();
      if (!q) return this.listActive(limit);
      return repo.list({
        filters: [{ column: 'full_name', op: 'ilike', value: '%' + q + '%' }],
        orderBy: { column: 'updated_at' },
        ascending: false,
        limit
      });
    },
    get(id) { return repo.getById(id); },
    create(person) { return repo.create(person); },
    update(id, person) { return repo.updateById(id, person); }
  });
}

export { PERSON_TYPES };
