import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

import { normalizeImportRows, buildImportPreview } from '../../src/domains/crm/import-quality.js';

test('blank spreadsheet rows are ignored instead of becoming property records', () => {
  const rows = [
    { property_code: 'P-1', property_name: 'A' },
    {},
    { property_code: '', property_name: '   ' },
    { property_code: 'P-2', property_name: 'B' }
  ];
  const normalized = normalizeImportRows(rows);
  assert.equal(normalized.length, 2);
  assert.deepEqual(normalized.map(x => x.property_code), ['P-1', 'P-2']);
  assert.deepEqual(normalized.map(x => x._source_row), [1, 4]);
  const preview = buildImportPreview(rows);
  assert.equal(preview.rowCount, 2);
});

test('manager module governance exposes edit/save/hide/delete controls', () => {
  const app = fs.readFileSync(new URL('../../buildwise-app.js', import.meta.url), 'utf8');
  assert.match(app, /appSettings/);
  assert.match(app, /saveUiModule/);
  assert.match(app, /deleteUiModule/);
  assert.match(app, /ui_visible_/);
  assert.match(app, /manager_edit_ui_module/);
  assert.match(app, /manager_delete_ui_module/);
});

test('production UI contains no internal instruction copy', () => {
  const app = fs.readFileSync(new URL('../../buildwise-app.js', import.meta.url), 'utf8');
  assert.doesNotMatch(app, /شناسه واردات Excel، کد فایل و جزئیات فنی/);
  assert.doesNotMatch(app, /تمرکز بر عملکرد تیم، درخواست‌های ورودی و فرصت‌های پیگیری/);
  assert.doesNotMatch(app, /برای عملکرد ضعیف، استفاده نادرست از فایل/);
});

test('property UI exposes manager-scoped bulk delete contract', () => {
  const app = fs.readFileSync(new URL('../../buildwise-app.js', import.meta.url), 'utf8');
  assert.match(app, /bulkDeleteProperties/);
  assert.match(app, /manager_bulk_delete_properties/);
});

test('navigation does not duplicate the same task section', () => {
  const app = fs.readFileSync(new URL('../../buildwise-app.js', import.meta.url), 'utf8');
  const matches = app.match(/\['tasks','پیگیری‌ها','✓'\]/g) || [];
  assert.equal(matches.length, 1);
});

test('property file triage is persisted, visible, and manager-editable', async () => {
  const app = fs.readFileSync(new URL('../../buildwise-app.js', import.meta.url), 'utf8');
  const migration = fs.readFileSync(new URL('../../supabase/migrations/20261017190000_property_file_triage.sql', import.meta.url), 'utf8');
  assert.match(migration, /add column if not exists is_starred boolean/i);
  assert.match(migration, /add column if not exists file_tags text\[\]/i);
  assert.match(migration, /is_starred, file_tags/i);
  assert.match(migration, /where public\.is_active_user\(\)/i);
  assert.doesNotMatch(migration, /owner_notes,\s*internal_notes/i);
  assert.match(app, /status,is_starred,file_tags,created_at/);
  assert.match(app, /function propertyCard\(x\)/);
  assert.match(app, /x\.is_starred\?'★ '/);
  for (const tag of ['خوش‌قیمت', 'خوش‌فروش', 'پول لازم', 'تهاتر']) assert.ok(app.includes(tag), 'missing property label: ' + tag);
  assert.match(app, /async function editProperty\(id\)\{if\(!isManager\(\)\)/);
  assert.match(app, /select\('id,property_name,property_type,region,neighborhood,built_area,bedrooms,total_price,price_per_meter,is_starred,file_tags'\)/);
  assert.match(app, /is_starred:!!ep_starred\.checked/);
  assert.match(app, /file_tags:\[\.\.\.\(ep_tag_good_price\.checked/);
});
