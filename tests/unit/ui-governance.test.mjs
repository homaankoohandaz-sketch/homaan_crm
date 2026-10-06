import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const app = fs.readFileSync(new URL('../../buildwise-app.js', import.meta.url), 'utf8');
const index = fs.readFileSync(new URL('../../index.html', import.meta.url), 'utf8');
const importer = fs.readFileSync(new URL('../../src/domains/crm/data-import.js', import.meta.url), 'utf8');

test('navigation is not duplicated between the top mobile strip and bottom navigation', () => {
  assert.match(app, /mobileNav\.innerHTML=''/);
  assert.match(app, /\.mobile-nav\{display:none/);
});

test('production dashboard copy contains no internal instruction text', () => {
  assert.doesNotMatch(app, /شناسه واردات Excel، کد فایل/);
  assert.doesNotMatch(app, /برای استفاده عملیاتی مدیر/);
  assert.doesNotMatch(app, /گزارش ثبت کن/);
});

test('properties supports manager bulk selection and bulk deletion', () => {
  assert.match(app, /property-bulk-delete/);
  assert.match(app, /is_manager_user/);
  assert.match(app, /manager_bulk_delete_properties/);
});

test('manager has persistent UI module governance with hide, delete, edit and save', () => {
  assert.match(app, /ui_modules/);
  assert.match(app, /مدیریت اپ/);
  assert.match(app, /manager_edit_ui_module/);
  assert.match(app, /manager_delete_ui_module/);
});

test('Excel import filters completely empty rows before mapping or insertion', () => {
  assert.match(importer, /hasMeaningfulImportData/);
  assert.match(importer, /filter\(hasMeaningfulImportData\)/);
});

test('Excel import does not invent property records from empty rows', () => {
  assert.match(importer, /if\(!hasMeaningfulImportData\(raw\)\)return/);
});

test('production shell does not inject development suite shortcuts', () => {
  assert.doesNotMatch(index, /suite-links\.js/);
});
