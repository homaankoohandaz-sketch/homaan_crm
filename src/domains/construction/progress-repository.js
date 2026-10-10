import { createRepository } from '../../core/data/repository.js';
import { summarizeProgress } from './progress.js';

function req(v, name) {
  if (v == null || v === '') throw new TypeError(`${name} is required`);
}

/**
 * Canonical progress = derived from project_schedule_tasks.progress (relational).
 * Does NOT store KPI blobs in construction_projects.assumptions.
 */
export function createProjectProgressRepository(client) {
  if (!client?.from) throw new TypeError('Supabase client is required');
  const tasks = createRepository(client, 'project_schedule_tasks');

  async function listTaskRows(projectId) {
    return tasks.list({
      filters: [{ column: 'project_id', value: projectId }],
      orderBy: { column: 'planned_start' },
      limit: 500
    });
  }

  function toItems(rows) {
    return (rows || []).map((t) => ({
      id: t.id,
      title: t.title,
      planned: 100,
      actual: Number(t.progress) || 0,
      weight: 1,
      baseline_finish: t.planned_finish ?? null,
      forecast_finish: t.forecast_finish ?? t.actual_finish ?? t.planned_finish ?? null
    }));
  }

  return Object.freeze({
    async getKpis(projectId) {
      req(projectId, 'projectId');
      const rows = await listTaskRows(projectId);
      const snap = summarizeProgress(toItems(rows));
      const delayedItems = snap.items.filter((item) => item.baseline_finish && item.forecast_finish && Date.parse(item.forecast_finish) > Date.parse(item.baseline_finish));
      return Object.freeze({
        progress_percent: snap.percent,
        remaining_percent: snap.remaining_percent,
        completed_items: snap.completed_items,
        total_items: snap.total_items,
        schedule_variance_days: snap.schedule_variance_days,
        delayed_items: delayedItems.length,
        delayed_item_ids: delayedItems.map((item) => item.id)
      });
    },

    async get(projectId) {
      req(projectId, 'projectId');
      const rows = await listTaskRows(projectId);
      return summarizeProgress(toItems(rows));
    },

    /**
     * Apply per-task progress updates, then return derived snapshot.
     * Accepts { items: [{ id, progress }] } or recompute-only payload.
     */
    async save(projectId, payload = {}) {
      req(projectId, 'projectId');
      if (Array.isArray(payload.items)) {
        for (const item of payload.items) {
          if (item?.id == null) continue;
          const progress = Math.min(100, Math.max(0, Number(item.progress ?? item.actual) || 0));
          await tasks.updateById(item.id, { progress });
        }
      }
      return this.get(projectId);
    }
  });
}
