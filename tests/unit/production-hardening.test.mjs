import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

import { normalizeImportRows, buildImportPreview } from '../../src/domains/crm/import-quality.js';
import { MODULE_REGISTRY, canManageModule, applyModulePatch } from '../../src/core/module-registry.js';

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
  const preview = buildImportPreview(rows);
  assert.equal(preview.rowCount, 2);
});

test('module registry gives manager hide/edit/delete/save controls for every registered feature', () => {
  assert.ok(MODULE_REGISTRY.length >= 10);
  assert.equal(canManageModule('manager'), true);
  assert.equal(canManageModule('advisor'), false);
  const updated = applyModulePatch(MODULE_REGISTRY[0], { title: 'عنوان جدید', visible: false, enabled: true });
  assert.equal(updated.title, 'عنوان جدید');
  assert.equal(updated.visible, false);
  assert.equal(updated.enabled, true);
});

test('production UI contains no internal instruction copy', () => {
  const app = fs.readFileSync(new URL('../../buildwise-app.js', import.meta.url), 'utf8');
  assert.doesNotMatch(app, /شناسه واردات Excel، کد فایل و جزئیات فنی/);
  assert.doesNotMatch(app, /تمرکز بر عملکرد تیم، درخواست‌های ورودی و فرصت‌های پیگیری/);
  assert.doesNotMatch(app, /برای عملکرد ضعیف، استفاده نادرست از فایل/);
});

test('property UI exposes manager-scoped bulk delete contract', () => {
  const app = fs.readFileSync(new URL('../../buildwise-app.js', import.meta.url), 'utf8');
  assert.match(app, /propertyBulkDelete/);
  assert.match(app, /manager_delete_properties/);
});

test('navigation does not duplicate the same task section', () => {
  const app = fs.readFileSync(new URL('../../buildwise-app.js', import.meta.url), 'utf8');
  const matches = app.match(/\['tasks','پیگیری‌ها','✓'\]/g) || [];
  assert.equal(matches.length, 1);
});
