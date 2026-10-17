import { createRepository } from '../../core/data/repository.js';

function req(v, name) {
  if (v == null || v === '') throw new TypeError(`${name} is required`);
}

function clampProgress(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.min(100, Math.max(0, n));
}

function normalizePredecessors(value) {
  if (value == null) return [];
  if (!Array.isArray(value)) throw new TypeError('predecessor_ids must be an array');
  return [...new Set(value.filter((id) => id != null && id !== ''))];
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
      const preds = normalizePredecessors(input.predecessor_ids);
      return tasks.create({
        project_id: input.project_id,
        title: String(input.title).trim(),
        planned_start: input.planned_start ?? null,
        planned_finish: input.planned_finish ?? null,
        duration_days: input.duration_days ?? null,
        progress: clampProgress(input.progress),
        priority: input.priority ?? 'normal',
        parent_task_id: input.parent_task_id ?? null,
        predecessor_ids: preds,
        description: input.description ?? null,
        status: input.status ?? 'planned',
        is_critical: Boolean(input.is_critical)
      });
    },

    async updateTask(taskId, input = {}) {
      req(taskId, 'taskId');
      const patch = {};
      if (input.title != null) patch.title = String(input.title).trim();
      if (input.progress != null) patch.progress = clampProgress(input.progress);
      if (input.planned_start !== undefined) patch.planned_start = input.planned_start;
      if (input.planned_finish !== undefined) patch.planned_finish = input.planned_finish;
      if (input.duration_days !== undefined) patch.duration_days = input.duration_days;
      if (input.status !== undefined) patch.status = input.status;
      if (input.parent_task_id !== undefined) patch.parent_task_id = input.parent_task_id;
      if (input.predecessor_ids !== undefined) patch.predecessor_ids = normalizePredecessors(input.predecessor_ids);
      if (input.is_critical !== undefined) patch.is_critical = Boolean(input.is_critical);
      return tasks.updateById(taskId, patch);
    },

    async listTasks(projectId) {
      req(projectId, 'project_id');
      return tasks.list({
        filters: [{ column: 'project_id', value: projectId }],
        orderBy: { column: 'planned_start' },
        limit: 200
      });
    },

    async updateMilestone(milestoneId, input = {}) {
      req(milestoneId, 'milestoneId');
      const patch = {};
      if (input.title != null) patch.title = String(input.title).trim();
      if (input.planned_date !== undefined) patch.planned_date = input.planned_date;
      if (input.status !== undefined) patch.status = input.status;
      return milestones.updateById(milestoneId, patch);
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
