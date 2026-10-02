import '../../core/data-normalization.js';

const { normalizeRecord, normalizePhone, normalizeNumber } = globalThis.BuildWiseNormalize;

function asRaw(row) {
  return row && typeof row === 'object' && !Array.isArray(row) ? { ...row } : {};
}

function normalizeOne(row, index) {
  const raw = asRaw(row);
  const r = normalizeRecord(raw);
  const rawPhone = r.mobile || r.phone || r.telephone || r.موبایل || r.تلفن || null;
  const mobile = normalizePhone(rawPhone);
  return {
    ...r,
    _source_row: index + 1,
    _source_raw: raw,
    mobile,
    _phone_input: rawPhone,
    normalized_numbers: Object.fromEntries(
      Object.entries(r)
        .map(([k, v]) => [k, normalizeNumber(v)])
        .filter(([, v]) => v !== null)
    )
  };
}

export function normalizeImportRows(rows = []) {
  return (rows || []).map((row, index) => normalizeOne(row, index));
}

function phoneIssue(row) {
  const phoneInput = row?._phone_input;
  const phone = row?.mobile || row?.phone;
  if (
    (phoneInput != null && String(phoneInput).trim() !== '' && !phone) ||
    (phone && !/^09\d{9}$/.test(phone))
  ) return { code: 'invalid_phone', field: 'mobile', message: 'شماره موبایل معتبر نیست' };
  return null;
}

export function validateImportRows(rows = [], options = {}) {
  const requiredColumns = options.requiredColumns || [];
  const normalized = (rows || []).map((row, index) => {
    try {
      return { row, normalized: normalizeOne(row, index), error: null };
    } catch (error) {
      return {
        row,
        normalized: null,
        error: { code: 'normalization_error', message: error?.message || String(error) }
      };
    }
  });

  const valid = [];
  const invalid = [];
  for (const item of normalized) {
    const issues = [];
    if (item.error) issues.push(item.error);
    if (item.normalized) {
      const phoneError = phoneIssue(item.normalized);
      if (phoneError) issues.push(phoneError);
      for (const column of requiredColumns) {
        const value = item.row?.[column] ?? item.normalized?.[column];
        if (value == null || String(value).trim() === '') {
          issues.push({ code: 'required_field_missing', field: column, message: 'فیلد الزامی خالی است' });
        }
      }
    }
    if (issues.length) {
      invalid.push({
        ...item.row,
        _source_row: item.normalized?._source_row,
        _source_raw: asRaw(item.row),
        issues,
        _error: issues[0].code
      });
    } else {
      valid.push(item.normalized);
    }
  }

  return {
    valid,
    invalid,
    summary: {
      total: normalized.length,
      valid: valid.length,
      invalid: invalid.length,
      errorRate: normalized.length ? invalid.length / normalized.length : 0
    }
  };
}

export function isolateImportErrors(rows = [], options = {}) {
  const result = validateImportRows(rows, options);
  return {
    valid: result.valid,
    errors: result.invalid.map((row) => ({
      rowIndex: row._source_row,
      code: row.issues?.[0]?.code || 'import_error',
      message: row.issues?.[0]?.message || 'خطای ورود داده',
      issues: row.issues || [],
      raw: row._source_raw || {}
    })),
    summary: result.summary
  };
}

export function buildImportPreview(rows = [], options = {}) {
  const sourceRows = (rows || []).map(asRaw);
  const columns = [...new Set(sourceRows.flatMap((r) => Object.keys(r || {})))];
  const validation = validateImportRows(sourceRows, options);
  const duplicateCandidates = findDuplicateCandidates(sourceRows);
  return {
    rowCount: sourceRows.length,
    columnCount: columns.length,
    columns,
    sample: sourceRows.slice(0, 20).map((row, index) => ({ ...row, _preview_row: index + 1 })),
    validation: validation.summary,
    invalidRows: validation.invalid,
    duplicateCandidates
  };
}

export function applyColumnEdits(rows = [], edits = []) {
  const next = (rows || []).map(asRaw);
  for (const edit of edits || []) {
    const rowIndex = Number(edit?.rowIndex);
    const column = String(edit?.column ?? '');
    if (!Number.isInteger(rowIndex) || rowIndex < 0 || rowIndex >= next.length || !column) continue;
    next[rowIndex] = { ...next[rowIndex], [column]: edit?.value ?? '' };
  }
  return next;
}

/**
 * Detection is non-destructive: it returns possible duplicate candidates.
 * It never authorizes merge/delete and never treats surname/phone alone as proof.
 */
export function findDuplicateCandidates(rows = []) {
  const buckets = new Map();
  for (const row of rows || []) {
    const r = normalizeRecord(row);
    const code = r.property_code || r.code || r.کد || r.کد_ملک;
    if (code) {
      const key = 'code:' + String(code).trim().toLowerCase();
      if (!buckets.has(key)) buckets.set(key, []);
      buckets.get(key).push(row);
    }
  }
  return [...buckets.entries()]
    .filter(([, candidates]) => candidates.length > 1)
    .map(([key, candidates]) => ({ key, candidates, reason: 'same_property_code' }));
}

export function editImportedRecord(record, changes = {}) {
  if (!record || typeof record !== 'object' || Array.isArray(record)) throw new TypeError('record is required');
  if (!changes || typeof changes !== 'object' || Array.isArray(changes)) throw new TypeError('changes is required');
  return { ...record, ...changes };
}

export function rollbackPlan({ batchId, insertedIds = [] } = {}) {
  if (!batchId) throw new TypeError('batchId is required');
  return {
    status: 'planned',
    batchId,
    ids: [...new Set(insertedIds)],
    destructive: true,
    requiresExecution: true,
    requiresManager: true,
    scope: 'import_batch_only'
  };
}

export function buildDataQualityDashboard(rows = [], options = {}) {
  const sourceRows = (rows || []).map(asRaw);
  const validation = validateImportRows(sourceRows, options);
  const duplicateCandidates = findDuplicateCandidates(sourceRows);
  const columns = [...new Set(sourceRows.flatMap((r) => Object.keys(r)))];
  const fieldCoverage = Object.fromEntries(
    columns.map((column) => [
      column,
      sourceRows.length
        ? sourceRows.filter((row) => row[column] != null && String(row[column]).trim() !== '').length / sourceRows.length
        : 0
    ])
  );
  return {
    totalRows: sourceRows.length,
    validRows: validation.valid.length,
    invalidRows: validation.invalid.length,
    errorRate: validation.summary.errorRate,
    duplicateGroups: duplicateCandidates.length,
    duplicateRows: duplicateCandidates.reduce((sum, group) => sum + group.candidates.length, 0),
    columnCount: columns.length,
    fieldCoverage,
    requiredColumns: options.requiredColumns || [],
    validationErrors: validation.invalid.map((row) => ({
      row: row._source_row,
      issues: row.issues
    }))
  };
}

export const importQuality = {
  normalizeImportRows,
  validateImportRows,
  isolateImportErrors,
  buildImportPreview,
  applyColumnEdits,
  findDuplicateCandidates,
  editImportedRecord,
  rollbackPlan,
  buildDataQualityDashboard
};

if (typeof globalThis !== 'undefined') globalThis.BuildWiseImportQuality = importQuality;
