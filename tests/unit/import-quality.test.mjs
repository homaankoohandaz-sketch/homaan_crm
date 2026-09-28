import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeImportRows, validateImportRows, buildImportPreview, rollbackPlan } from '../src/domains/crm/import-quality.js';

test('preview preserves every source column and row', () => {
  const rows=[{نام:'علی',موبایل:'۰۹۱۲۱۲۳۴۵۶۷',X:1},{نام:'رضا',موبایل:'۰۹۱۲۲۲۲۲۲۲۲',X:2}];
  const p=buildImportPreview(rows);
  assert.equal(p.rowCount,2);
  assert.deepEqual(p.columns,['نام','موبایل','X']);
  assert.equal(p.sample.length,2);
});

test('validation isolates bad rows without dropping good raw data', () => {
  const rows=[{name:'A',mobile:'09121234567'},{name:'B',mobile:'bad'}];
  const r=validateImportRows(normalizeImportRows(rows));
  assert.equal(r.valid.length,1);
  assert.equal(r.invalid.length,1);
});

test('rollback plan is explicit and non-destructive until executed', () => {
  const p=rollbackPlan({batchId:'b1',insertedIds:['1','2']});
  assert.equal(p.status,'planned');
  assert.deepEqual(p.ids,['1','2']);
});
