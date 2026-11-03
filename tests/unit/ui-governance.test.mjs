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


test('BuildWise authenticated shell uses the unified dark workspace layout', () => {
  assert.match(app, /class="app bw-shell"/);
  assert.match(app, /class="bw-global-search"/);
  assert.match(app, /class="bw-assistant"/);
  assert.match(app, /class="bw-user-card"/);
  assert.match(app, /function globalSearch\(/);
});

test('dashboard presents real module KPIs and same-page operational shortcuts', () => {
  assert.match(app, /پروژه‌های ثبت‌شده/);
  assert.match(app, /عملیات سریع/);
  assert.match(app, /ثبت \/ جستجوی ملک/);
  assert.match(app, /ثبت مخاطب/);
  assert.match(app, /مدیریت پروژه/);
  assert.match(app, /پروژه‌های اخیر/);
});

test('unified visual system is dark, responsive, and RTL-aware', () => {
  assert.match(index, /buildwise-ui\.css/);
  const css = fs.readFileSync(new URL('../../buildwise-ui.css', import.meta.url), 'utf8');
  assert.match(css, /\.bw-shell/);
  assert.match(css, /\.bw-assistant/);
  assert.match(css, /@media\s*\(max-width:\s*1050px\)/);
  assert.match(css, /--bw-bg:\s*#0b1020/i);
});


test('all role-authorized core modules remain in navigation; database display settings cannot hide the property bank', () => {
  assert.match(app, /const NAV=ALL_NAV;/);
  assert.match(app, /const allowedNav=\(\)=>ROLE_ACCESS\[normalizedRole\(role\)\]\|\|\['dashboard'\]/);
  assert.match(app, /function effectiveNav\(\)\{return NAV\.filter\(\(\[id\]\)=>canAccess\(id\)\)\}/);
  assert.match(app, /\['properties','املاک','⌂'\]/);
  assert.match(app, /\['market','بازار و ارزش‌گذاری','◌'\]/);
});


test('every standard navigation route has a dispatcher target', () => {
  assert.match(app, /const f=\{requests,tasks:window\.taskCenter,promotions,dashboard,properties,leads,deals,search,construction,market,data:dataHub,matching,room,automation,customerflow,ai,'app-settings':appSettings\}\[id\]/);
});


test('data hub exposes real Excel import and raw archive actions', () => {
  assert.match(app, /async function dataHub\(\)/);
  assert.match(app, /window\.__bwOpenImport\?\.\(\)/);
  assert.match(app, /window\.__bwOpenArchive\?\.\(\)/);
  assert.match(app, /\['data','داده‌ها و ورود اطلاعات','▤'\]/);
  assert.match(importer, /window\.__bwOpenImport=open;window\.__bwOpenArchive=openArchive/);
});


test('archived project-control, market intelligence and workflow modules are absent from active navigation', () => {
  assert.doesNotMatch(app, /\['construction','ساخت و پروژه'/);
  assert.doesNotMatch(app, /\['market','بازار و ارزش‌گذاری'/);
  assert.doesNotMatch(app, /\['automation','اتوماسیون'/);
  assert.doesNotMatch(app, /construction:\['tasks'/);
  assert.doesNotMatch(app, /go\('construction'\)/);
  assert.doesNotMatch(app, /go\('market'\)/);
});

test('BuildWise assistant shortcuts do not route users into archived product areas', () => {
  assert.doesNotMatch(app, /تحلیل بازار و ارزش‌گذاری/);
  assert.doesNotMatch(app, /وضعیت پروژه‌های ساخت/);
});

test('all agent and human instructions carry an explicit archive freeze gate', () => {
  const files = ['../.agent-control/ARCHIVE-FREEZE.md', '../../AGENTS.md', '../../CLAUDE.md'];
  for (const file of files) assert.ok(fs.existsSync(new URL(file, import.meta.url)));
});
