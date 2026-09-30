import { normalizeRecord, normalizePhone } from '../../core/data-normalization.js';

export function createImportBatch({ source = 'unknown', fileName = null, rowCount = 0, actorId = null, startedAt = new Date().toISOString() } = {}) {
  return {
    id: cryptoRandomId(),
    source,
    fileName,
    rowCount: Number(rowCount) || 0,
    actorId,
    status: 'started',
    startedAt,
    completedAt: null,
    errorCount: 0
  };
}

export function finalizeImportBatch(batch, { status = 'completed', errorCount = 0, completedAt = new Date().toISOString() } = {}) {
  if (!batch?.id) throw new TypeError('batch.id is required');
  return { ...batch, status, errorCount: Number(errorCount) || 0, completedAt };
}

export function buildImportErrorIsolation(rows = [], normalizer = normalizeRecord) {
  const raw = [];
  const normalized = [];
  const errors = [];
  for (const row of rows || []) {
    raw.push({ ...row });
    try { normalized.push(normalizer(row)); }
    catch (error) { errors.push({ row: { ...row }, error: String(error?.message || error) }); }
  }
  return { raw, normalized, errors };
}

export function exportRecords(rows = [], { columns = null } = {}) {
  const list = Array.isArray(rows) ? rows : [];
  if (!columns) return list.map((row) => ({ ...row }));
  return list.map((row) => Object.fromEntries(columns.map((key) => [key, row?.[key] ?? null])));
}

export function exportAsJson(rows = [], options = {}) {
  return JSON.stringify(exportRecords(rows, options), null, 2);
}

export function createAuditEntry({ actorId = null, action, entityType, entityId = null, before = null, after = null, at = new Date().toISOString() } = {}) {
  if (!action || !entityType) throw new TypeError('action and entityType are required');
  return Object.freeze({ actorId, action, entityType, entityId, before, after, at });
}

export function appendAudit(entries = [], entry) {
  return [...entries, createAuditEntry(entry)];
}

export function buildActivityEvent({ actorId = null, entityType, entityId, action, metadata = {}, at = new Date().toISOString() } = {}) {
  if (!entityType || entityId == null || !action) throw new TypeError('entityType, entityId and action are required');
  return { actorId, entityType, entityId, action, metadata: { ...metadata }, at };
}

export function buildActivityTimeline(events = [], { entityType = null, entityId = null, limit = 100 } = {}) {
  return [...(events || [])]
    .filter((event) => !entityType || event.entityType === entityType)
    .filter((event) => entityId == null || String(event.entityId) === String(entityId))
    .sort((a, b) => String(b.at || '').localeCompare(String(a.at || '')))
    .slice(0, Math.max(1, Number(limit) || 100));
}

export function findSamePhoneCandidates(rows = []) {
  const buckets = new Map();
  for (const row of rows || []) {
    const normalized = normalizePhone(row?.mobile ?? row?.phone ?? row?.موبایل ?? row?.تلفن ?? '');
    if (!normalized) continue;
    if (!buckets.has(normalized)) buckets.set(normalized, []);
    buckets.get(normalized).push(row);
  }
  return [...buckets.entries()]
    .filter(([, candidates]) => candidates.length > 1)
    .map(([phone, candidates]) => ({ phone, candidates, mergeAllowed: false }));
}

function cryptoRandomId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return 'batch-' + Math.random().toString(36).slice(2, 12);
}
