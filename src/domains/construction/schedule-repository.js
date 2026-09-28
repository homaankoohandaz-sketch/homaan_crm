import { createRepository } from '../../core/data/repository.js';

function req(v, name) {
  if (v == null || v === '') throw new TypeError(`${name} is required`);
}

export function createProjectScheduleRepository(client) {
  if (!client?.from) throw new TypeError('Supabase client is required');
  const tasks = createRepository(client, 'project_schedule_tasks');
  const milestones = createRepository(client, 'project_milestones');
  const wbs = createRepository(client, 'project_wbs');

  return Object.freeze({
    async createTask(input = {}) {
      req(input.project_id, 'project_id');
      req(String(input.title || '').trim(), 'title');
      const preds = Array.isArray(input.predecessor_ids) ? input.predecessor_ids : null;
      return tasks.create({
        project_id: input.project_id,
        title: String(input.title).trim(),
        planned_start: input.planned_start ?? null,
        planned_finish: input.planned_finish ?? null,
        duration_days: input.duration_days ?? null,
        progress: Number(input.progress) || 0,
        priority: input.priority ?? 'normal',
        parent_task_id: input.parent_task_id ?? null,
        predecessor_ids: preds,
        description: input.description ?? null,
        status: input.status ?? 'planned',
        is_critical: Boolean(input.is_critical)
      });
    },

    async listTasks(projectId) {
      req(projectId, 'project_id');
      return tasks.list({
        filters: [{ column: 'project_id', value: projectId }],
        orderBy: { column: 'planned_start' },
        limit: 200
      });
    },

    async createMilestone(input = {}) {
      req(input.project_id, 'project_id');
      req(String(input.title || '').trim(), 'title');
      return milestones.create({
        project_id: input.project_id,
        title: String(input.title).trim(),
        planned_date: input.planned_date ?? null,
        status: input.status ?? 'planned'
      });
    },

    async listMilestones(projectId) {
      req(projectId, 'project_id');
      return milestones.list({
        filters: [{ column: 'project_id', value: projectId }],
        orderBy: { column: 'planned_date' },
        limit: 100
      });
    },

    async createWbs(input = {}) {
      req(input.project_id, 'project_id');
      req(String(input.title || '').trim(), 'title');
      return wbs.create({
        project_id: input.project_id,
        code: input.code ?? null,
        title: String(input.title).trim(),
        parent_id: input.parent_id ?? null
      });
    },

    async listWbs(projectId) {
      req(projectId, 'project_id');
      return wbs.list({
        filters: [{ column: 'project_id', value: projectId }],
        orderBy: { column: 'id' },
        limit: 100
      });
    }
  });
}
