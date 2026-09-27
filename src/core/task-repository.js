import { createRepository } from './data/repository.js';

function persistencePayload(task) {
  const { id, ...rest } = task;
  return {
    ...(typeof id === 'number' || /^\\d+$/.test(String(id)) ? { id: Number(id) } : {}),
    ...rest,
  };
}
import {
  createTask,
  respondToTask,
  completeTask,
  moveTaskToTomorrow,
  setTaskStarred,
  setTaskPriority,
  configureTaskNotification,
} from './task-engine.js';

export function createTaskRepository(client, { table = 'tasks' } = {}) {
  const repository = createRepository(client, table);

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
  });
}
