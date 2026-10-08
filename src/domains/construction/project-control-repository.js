import { createProjectRepository } from './project-repository.js';
import { createProjectScheduleRepository } from './schedule-repository.js';
import { createProjectProgressRepository } from './progress-repository.js';

export function createProjectControlRepository(client) {
  if (!client?.from) throw new TypeError('Supabase client is required');

  const projects = createProjectRepository(client);
  const schedule = createProjectScheduleRepository(client);
  const progress = createProjectProgressRepository(client);

  return Object.freeze({
    async getVertical(projectId) {
      if (projectId == null || projectId === '') throw new TypeError('projectId is required');
      const [project, wbs, tasks, milestones, progressSnapshot, kpis] = await Promise.all([
        projects.getById(projectId),
        schedule.listWbs(projectId),
        schedule.listTasks(projectId),
        schedule.listMilestones(projectId),
        progress.get(projectId),
        progress.getKpis(projectId)
      ]);
      return Object.freeze({
        project,
        wbs,
        tasks,
        milestones,
        progress: progressSnapshot,
        kpis
      });
    },

    async updateProject(projectId, input = {}) {
      if (projectId == null || projectId === '') throw new TypeError('projectId is required');
      return projects.updateById(projectId, { ...input, id: projectId });
    },

    createTask(input) {
      return schedule.createTask(input);
    },

    createMilestone(input) {
      return schedule.createMilestone(input);
    },

    async saveProgress(projectId, payload) {
      return progress.save(projectId, payload);
    }
  });
}
