import { createRepository } from './data/repository.js';

function persistencePayload(task) {
  const { id, ...rest } = task;
  return {
    ...(id != null ? { id } : {}),
    ...rest,
  };
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
    return Array.isArray(rows) ? rows : [];
  }

  return Object.freeze({
    list(options) {
      return repository.list(options);
    },

    getById(id, options) {
      return repository.getById(id, options);
    },

    async create(input, options) {
      return repository.create(persistencePayload(createTask(input, options)));
    },

    async respond(id, response, options) {
      const task = await repository.getById(id);
      if (!task) return null;
      return repository.updateById(id, respondToTask(task, response, options));
    },

    async complete(id, options) {
      const task = await repository.getById(id);
      if (!task) return null;
      return repository.updateById(id, completeTask(task, options));
    },

    async reject(id, reason, options) {
      const task = await repository.getById(id);
      if (!task) return null;
      return repository.updateById(id, rejectTask(task, reason, options));
    },

    async moveToTomorrow(id, tomorrow, options) {
      const task = await repository.getById(id);
      if (!task) return null;
      return repository.updateById(id, moveTaskToTomorrow(task, { ...options, tomorrow }));
    },

    async setStarred(id, starred, options) {
      const task = await repository.getById(id);
      if (!task) return null;
      return repository.updateById(id, setTaskStarred(task, starred, options));
    },

    async setPriority(id, priority, options) {
      const task = await repository.getById(id);
      if (!task) return null;
      return repository.updateById(id, setTaskPriority(task, priority, options));
    },

    async configureNotification(id, input) {
      const task = await repository.getById(id);
      if (!task) return null;
      return repository.updateById(id, configureTaskNotification(task, input));
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
