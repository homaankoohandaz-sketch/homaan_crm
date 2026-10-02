import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeImportRows, validateImportRows, buildImportPreview, findDuplicateCandidates, rollbackPlan } from '../../src/domains/crm/import-quality.js';

test('import normalization preserves raw rows and normalizes numeric and phone fields', () => {
  const rows = normalizeImportRows([
    { 'نام': 'علی', 'موبایل': '0912-123-4567', 'کد': 'A-1', 'قیمت': '1,200' },
    { 'نام': 'علی', 'موبایل': '09121234567', 'کد': 'A-1', 'قیمت': '1300' }
  ]);
  assert.equal(rows[0].mobile, '09121234567');
  assert.equal(rows[0]._source_row, 1);
  assert.equal(rows[0]._source_raw['قیمت'], '1,200');
  assert.equal(rows[0].normalized_numbers.قیمت, 1200);
});

test('import validation isolates invalid phone rows without dropping valid rows', () => {
  const result = validateImportRows([
    { mobile: '09121234567' },
    { mobile: 'bad' }
  ]);
  assert.equal(result.valid.length, 1);
  assert.equal(result.invalid.length, 1);
  assert.equal(result.invalid[0]._error, 'invalid_phone');
});

test('import preview preserves every discovered column and samples at most twenty rows', () => {
  const rows = Array.from({ length: 25 }, (_, i) => ({ id: i + 1, extra: i }));
  const preview = buildImportPreview(rows);
  assert.equal(preview.rowCount, 25);
  assert.equal(preview.columnCount, 2);
  assert.deepEqual(preview.columns, ['id', 'extra']);
  assert.equal(preview.sample.length, 20);
});

test('duplicate detection is non-destructive and uses property code as the candidate key', () => {
  const candidates = findDuplicateCandidates([
    { property_code: 'A-1', full_name: 'Ali Ahmadi' },
    { property_code: 'A-1', full_name: 'Sara Ahmadi' }
  ]);
  assert.equal(candidates.length, 1);
  assert.equal(candidates[0].reason, 'same_property_code');
  assert.equal(candidates[0].candidates.length, 2);
});

test('rollback plan remains non-destructive until explicit execution', () => {
  const plan = rollbackPlan({ batchId: 'batch-1', insertedIds: [1, 2] });
  assert.equal(plan.status, 'planned');
  assert.deepEqual(plan.ids, [1, 2]);
  assert.equal(plan.destructive, false);
  assert.equal(plan.requiresExecution, true);
});
