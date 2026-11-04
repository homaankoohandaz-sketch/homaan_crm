import { createRepository } from './data/repository.js';

const CRM_SUBJECTS = new Set(['property','lead','request','contact','customer_share']);
function persistencePayload(task) {
  const { id, ...rest } = task;
  const status = task.status === 'completed' || task.status === 'rejected' ? 'done' : 'pending';
  const response = task.status === 'rejected' ? 'no' : (task.status === 'completed' || task.status === 'in_progress') ? 'yes' : (task.response ?? null);
  const payload = { ...rest, status, response, ...(id != null ? { id } : {}) };
  if (task.context_type === 'crm' && CRM_SUBJECTS.has(task.subject_type)) {
    const entityId = String(task.related_entity_id || '').replace(new RegExp('^' + task.subject_type + ':'), '');
    payload.related_entity_id = task.subject_type + ':' + entityId;
    payload.subject_type = null;
    if (task.subject_type === 'property') payload.property_id = Number(entityId);
    if (task.subject_type === 'lead') payload.lead_id = Number(entityId);
  }
  return payload;
}
function fromPersistence(row) {
  if (!row) return null;
  const task = { ...row };
  task.status = row.status === 'done' ? (row.response === 'no' ? 'rejected' : 'completed') : (row.response === 'yes' ? 'in_progress' : 'open');
  const match = String(row.related_entity_id || '').match(/^(property|lead|request|contact|customer_share):(.*)$/);
  if (match) { task.subject_type = match[1]; task.related_entity_id = match[2]; }
  else if (!row.subject_type && row.property_id != null) { task.subject_type = 'property'; task.related_entity_id = String(row.property_id); }
  else if (!row.subject_type && row.lead_id != null) { task.subject_type = 'lead'; task.related_entity_id = String(row.lead_id); }
  return task;
}
import {
  createTask,
  respondToTask,
  completeTask,
  rejectTask,
  moveTaskToTomorrow,
  setTaskStarred,
  setTaskPriority,
  configureTaskNotification,
  listTasksForDay,
  listTeamTasksForDay,
  listOverdueTasks,
  listStarredTasks,
  listTasksByContext,
  listDueTodayTasks,
  listNotificationCandidates,
} from './task-engine.js';

export function createTaskRepository(client, { table = 'tasks' } = {}) {
  const repository = createRepository(client, table);

  async function allTasks(options) {
    const rows = await repository.list(options);
    return Array.isArray(rows) ? rows.map(fromPersistence) : [];
  }

  return Object.freeze({
    list(options) {
      return allTasks(options);
    },

    async getById(id, options) {
      return fromPersistence(await repository.getById(id, options));
    },

    async create(input, options) {
      return fromPersistence(await repository.create(persistencePayload(createTask(input, options))));
    },

    async respond(id, response, options) {
      const task = fromPersistence(await repository.getById(id));
      if (!task) return null;
      return fromPersistence(await repository.updateById(id, persistencePayload(respondToTask(task, response, options))));
    },

    async complete(id, options) {
      const task = await repository.getById(id);
      if (!task) return null;
      return fromPersistence(await repository.updateById(id, persistencePayload(completeTask(task, options))));
    },

    async reject(id, reason, options) {
      const task = await repository.getById(id);
      if (!task) return null;
      return fromPersistence(await repository.updateById(id, persistencePayload(rejectTask(task, reason, options))));
    },

    async moveToTomorrow(id, tomorrow, options) {
      const task = await repository.getById(id);
      if (!task) return null;
      return fromPersistence(await repository.updateById(id, persistencePayload(moveTaskToTomorrow(task, { ...options, tomorrow }))));
    },

    async setStarred(id, starred, options) {
      const task = await repository.getById(id);
      if (!task) return null;
      return fromPersistence(await repository.updateById(id, persistencePayload(setTaskStarred(task, starred, options))));
    },

    async setPriority(id, priority, options) {
      const task = await repository.getById(id);
      if (!task) return null;
      return fromPersistence(await repository.updateById(id, persistencePayload(setTaskPriority(task, priority, options))));
    },

    async configureNotification(id, input) {
      const task = await repository.getById(id);
      if (!task) return null;
      return fromPersistence(await repository.updateById(id, persistencePayload(configureTaskNotification(task, input))));
    },

    async listForDay(assigneeId, date, options) {
      return listTasksForDay(await allTasks(options), assigneeId, date);
    },

    async listTeamForDay(date, options) {
      return listTeamTasksForDay(await allTasks(options), date);
    },

    async listOverdue(now, options) {
      return listOverdueTasks(await allTasks(options), now);
    },

    async listStarred(options) {
      return listStarredTasks(await allTasks(options));
    },

    async listByContext(contextType, options) {
      return listTasksByContext(await allTasks(options), contextType);
    },

    async listDueToday(date, options) {
      return listDueTodayTasks(await allTasks(options), date);
    },

    async listNotificationCandidates(now, options) {
      return listNotificationCandidates(await allTasks(options), now);
    },
  });
}
