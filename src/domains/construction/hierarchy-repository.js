import { createRepository } from '../../core/data/repository.js';

function req(v, name) {
  if (v == null || v === '') throw new TypeError(`${name} is required`);
}

export function createHierarchyRepository(client) {
  if (!client?.from) throw new TypeError('Supabase client is required');
  const complexes = createRepository(client, 'project_complexes');
  const buildings = createRepository(client, 'project_buildings');
  const floors = createRepository(client, 'project_floors');
  const units = createRepository(client, 'project_units');

  return Object.freeze({
    async createComplex(input = {}) {
      req(input.project_id, 'project_id');
      req(String(input.name || '').trim(), 'name');
      return complexes.create({
        project_id: input.project_id,
        name: String(input.name).trim(),
        code: input.code ?? null,
        status: input.status ?? 'active'
      });
    },

    async createBuilding(input = {}) {
      req(input.complex_id, 'complex_id');
      req(String(input.name || '').trim(), 'name');
      return buildings.create({
        complex_id: input.complex_id,
        name: String(input.name).trim(),
        floors_planned: Number(input.floors_planned) || 0,
        status: input.status ?? 'active'
      });
    },

    async createFloor(input = {}) {
      req(input.building_id, 'building_id');
      return floors.create({
        building_id: input.building_id,
        floor_number: Number(input.floor_number) || 0,
        name: input.name ?? null,
        area_m2: input.area_m2 != null ? Number(input.area_m2) : null,
        status: input.status ?? 'active'
      });
    },

    async createUnit(input = {}) {
      req(input.floor_id, 'floor_id');
      req(String(input.unit_code || '').trim(), 'unit_code');
      return units.create({
        floor_id: input.floor_id,
        unit_code: String(input.unit_code).trim(),
        unit_type: input.unit_type ?? null,
        area_m2: input.area_m2 != null ? Number(input.area_m2) : null,
        bedrooms: input.bedrooms != null ? Number(input.bedrooms) : null,
        status: input.status ?? 'available'
      });
    },

    async listTree(projectId) {
      req(projectId, 'project_id');
      const cx = await complexes.list({
        filters: [{ column: 'project_id', value: projectId }],
        orderBy: { column: 'id' },
        limit: 100
      });
      const tree = [];
      for (const c of cx) {
        const bld = await buildings.list({
          filters: [{ column: 'complex_id', value: c.id }],
          orderBy: { column: 'id' },
          limit: 100
        });
        const buildingsOut = [];
        for (const b of bld) {
          const fl = await floors.list({
            filters: [{ column: 'building_id', value: b.id }],
            orderBy: { column: 'floor_number' },
            limit: 100
          });
          const floorsOut = [];
          for (const f of fl) {
            const un = await units.list({
              filters: [{ column: 'floor_id', value: f.id }],
              orderBy: { column: 'id' },
              limit: 200
            });
            floorsOut.push({ ...f, units: un });
          }
          buildingsOut.push({ ...b, floors: floorsOut });
        }
        tree.push({ ...c, buildings: buildingsOut });
      }
      return tree;
    }
  });
}
