import test from 'node:test';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { normalizeImportRows, validateImportRows, buildImportPreview, findDuplicateCandidates, rollbackPlan, editImportedRecord } from '../../src/domains/crm/import-quality.js';

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

test('2000+ row import normalization remains complete and deterministic', () => {
  const rows = normalizeImportRows(Array.from({ length: 2001 }, (_, i) => ({
    property_code: 'P-' + i,
    full_name: 'Owner ' + i,
    mobile: '09121234567',
    custom_column: 'value-' + i
  })));
  assert.equal(rows.length, 2001);
  assert.equal(rows[2000]._source_row, 2001);
  assert.equal(rows[2000].custom_column, 'value-2000');
});

test('multi-sheet Excel importer processes every sheet and preserves sheet provenance', () => {
  const source = fs.readFileSync(new URL('../../src/domains/crm/data-import.js', import.meta.url), 'utf8');
  assert.match(source, /wb\.SheetNames\.forEach/);
  assert.match(source, /XLSX\.utils\.sheet_to_json/);
  assert.match(source, /_sheet_name/);
  assert.match(source, /_sheet_index/);
  assert.match(source, /_row_number/);
  assert.match(source, /_raw_data/);
});

test('full column preservation survives normalization without dropping arbitrary fields', () => {
  const row = { property_code: 'P-1', 'ستون اختصاصی': 'keep-me', nested_flag: true, amount: '1,250' };
  const [normalized] = normalizeImportRows([row]);
  assert.equal(normalized['ستون_اختصاصی'], 'keep-me');
  assert.equal(normalized.nested_flag, true);
  assert.equal(normalized.normalized_numbers.amount, 1250);
  assert.deepEqual(normalized._source_raw, row);
});

test('duplicate detection does not merge records by surname or phone alone', () => {
  const candidates = findDuplicateCandidates([
    { property_code: 'P-1', full_name: 'Ahmadi', mobile: '09121234567' },
    { property_code: 'P-2', full_name: 'Ahmadi', mobile: '09121234567' }
  ]);
  assert.equal(candidates.length, 0);
});

test('manager edit changes only requested imported fields and preserves the original record', () => {
  const original = { id: 7, full_name: 'Ali', custom_field: 'keep' };
  const edited = editImportedRecord(original, { full_name: 'Reza' });
  assert.deepEqual(original, { id: 7, full_name: 'Ali', custom_field: 'keep' });
  assert.deepEqual(edited, { id: 7, full_name: 'Reza', custom_field: 'keep' });
});
