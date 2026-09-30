import assert from 'node:assert/strict';
import { buildSearchFilters, applyLocalSearch, applyLocalFilters } from '../src/domains/crm/query.js';
import { normalizeImportRows, validateImportRows, buildImportPreview, findDuplicateCandidates } from '../src/domains/crm/import-quality.js';

const rows = [
  { full_name: 'Ali Ahmadi', region: 1, budget: 100 },
  { full_name: 'Sara Karimi', region: 2, budget: 200 },
  { full_name: 'Ali Reza', region: 1, budget: 300 }
];

assert.deepEqual(buildSearchFilters({
  search: 'Ali',
  fields: ['full_name', 'full_name'],
  filters: [{ column: 'region', op: 'eq', value: 1 }]
}), {
  search: 'Ali',
  searchFields: ['full_name'],
  filters: [{ column: 'region', op: 'eq', value: 1 }]
});

assert.equal(applyLocalSearch(rows, { search: 'ali', fields: ['full_name'] }).length, 2);
assert.equal(applyLocalFilters(rows, [{ column: 'budget', op: 'gte', value: 200 }]).length, 2);
assert.equal(applyLocalFilters(rows, [{ column: 'full_name', op: 'contains', value: 'reza' }]).length, 1);

const imported = normalizeImportRows([
  { 'نام': 'علی', 'موبایل': '0912-123-4567', 'کد': 'A-1', 'قیمت': '1,200' },
  { 'نام': 'علی', 'موبایل': '09121234567', 'کد': 'A-1', 'قیمت': '1300' }
]);
assert.equal(imported[0].mobile, '09121234567');
assert.equal(imported[0]._source_row, 1);
assert.equal(imported[0]._source_raw['قیمت'], '1,200');
assert.equal(imported[0].normalized_numbers.قیمت, 1200);

const validation = validateImportRows(imported);
assert.equal(validation.invalid.length, 0);

const preview = buildImportPreview(imported);
assert.equal(preview.rowCount, 2);
assert.ok(preview.columns.includes('_source_raw'));

const candidates = findDuplicateCandidates(imported);
assert.equal(candidates.length, 1);
assert.equal(candidates[0].reason, 'same_property_code');
assert.equal(candidates[0].candidates.length, 2);

console.log('crm-import-query: passed');
