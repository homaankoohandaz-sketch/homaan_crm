export function createRepository(client, table) {
  if (!client?.from) throw new TypeError('Supabase client is required');
  if (!table || !/^[a-z_][a-z0-9_]*$/i.test(table)) throw new TypeError('Invalid table name');

  return Object.freeze({
    async list({ select = '*', filters = [], orderBy = null, ascending = true, limit = 100 } = {}) {
      let query = client.from(table).select(select).limit(Math.max(1, Math.min(1000, Number(limit) || 100)));
      for (const filter of filters) {
        if (!filter?.column || filter.value === undefined) continue;
        if (filter.op === 'in') query = query.in(filter.column, filter.value);
        else if (filter.op === 'gte') query = query.gte(filter.column, filter.value);
        else if (filter.op === 'lte') query = query.lte(filter.column, filter.value);
        else query = query.eq(filter.column, filter.value);
      }
      if (orderBy?.column) query = query.order(orderBy.column, { ascending });
      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    },

    async getById(id, { select = '*' } = {}) {
      if (id == null || id === '') throw new TypeError('id is required');
      const { data, error } = await client.from(table).select(select).eq('id', id).maybeSingle();
      if (error) throw error;
      return data ?? null;
    },

    async create(payload) {
      if (!payload || typeof payload !== 'object' || Array.isArray(payload)) throw new TypeError('payload is required');
      const { data, error } = await client.from(table).insert(payload).select().single();
      if (error) throw error;
      return data;
    },

    async updateById(id, payload) {
      if (id == null || id === '') throw new TypeError('id is required');
      if (!payload || typeof payload !== 'object' || Array.isArray(payload)) throw new TypeError('payload is required');
      const { data, error } = await client.from(table).update(payload).eq('id', id).select().single();
      if (error) throw error;
      return data;
    }
  });
}
