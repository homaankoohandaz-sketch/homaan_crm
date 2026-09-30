import { normalizePhone } from '../../core/data-normalization.js';

export function editImportedRecord(record, changes = {}) {
  if (!record || typeof record !== 'object') throw new TypeError('record is required');
  if (!changes || typeof changes !== 'object' || Array.isArray(changes)) throw new TypeError('changes is required');
  return { ...record, ...changes };
}

export function createRollbackPlan({ batchId, insertedIds = [] } = {}) {
  return { batchId: batchId || null, insertedIds: [...insertedIds], status: 'planned', destructive: false };
}

export function buildDataQualityDashboard(rows = []) {
  const list = Array.isArray(rows) ? rows : [];
  const missingPhone = list.filter((r) => !normalizePhone(r?.mobile ?? r?.phone ?? r?.موبایل ?? r?.تلفن ?? '')).length;
  const duplicatePhoneGroups = list.reduce((map, row) => {
    const phone = normalizePhone(row?.mobile ?? row?.phone ?? row?.موبایل ?? row?.تلفن ?? '');
    if (phone) map.set(phone, (map.get(phone) || 0) + 1);
    return map;
  }, new Map());
  const duplicates = [...duplicatePhoneGroups.values()].filter((n) => n > 1).length;
  const invalid = list.filter((r) => r?._error).length;
  return { rowCount: list.length, missingPhone, duplicatePhoneGroups: duplicates, invalidSourceRows: invalid, completeness: list.length ? 1 - missingPhone / list.length : 1 };
}
