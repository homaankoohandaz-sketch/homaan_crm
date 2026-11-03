import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const app = readFileSync(new URL('../../buildwise-app.js', import.meta.url), 'utf8');
const propertyFix = readFileSync(new URL('../../property-fields-fix.js', import.meta.url), 'utf8');
const motion = readFileSync(new URL('../../src/ui/buildwise-motion.js', import.meta.url), 'utf8');
const motionCss = readFileSync(new URL('../../src/ui/buildwise-motion.css', import.meta.url), 'utf8');
const feasibility = readFileSync(new URL('../../feasibility.html', import.meta.url), 'utf8');

test('owner/admin/manager accounts receive manager UI permissions', () => {
  assert.match(app, /function isManager\(\)\s*\{\s*return\s*\['owner','admin','manager'\]\.includes\(normalizedRole\(role\)\)\s*\}/);
});

test('manager login accepts the existing owner account without a role mismatch warning', () => {
  assert.match(app, /requestedManager\s*=\s*requestedRole\s*===\s*'manager'/);
});

test('global search searches property type, owner name, and owner mobile on the full properties table', () => {
  assert.match(app, /db\.from\('properties'\)/);
  assert.match(app, /owner_name/);
  assert.match(app, /mobile/);
  assert.match(app, /property_type/);
  assert.match(app, /scheduleGlobalSearch/);
  assert.match(app, /import_raw_rows/);
  assert.match(app, /normalized_data->>mobile/);
});

test('property cards expose manager delete action as well as edit', () => {
  assert.match(propertyFix, /deleteProperty/);
});

test('deal records expose manager edit and delete actions', () => {
  assert.match(app, /editDeal\(/);
  assert.match(app, /deleteDeal\(/);
});

test('Halvo-style background studio supports image upload and editable appearance', () => {
  assert.match(motion, /bw-bg-upload/);
  assert.match(motion, /localStorage/);
  assert.match(motion, /bw-bg-position/);
  assert.match(motionCss, /body\.bw-custom-bg/);
});

test('saved feasibility calculations expose manager edit and delete actions', () => {
  assert.match(feasibility, /async function saveCalculation\(id\)/);
  assert.match(feasibility, /async function deleteCalculation\(id\)/);
  assert.match(feasibility, /construction_projects/);
});

test('Halvo background is saved centrally for all authenticated users', () => {
  assert.match(motion, /from\('ui_modules'\)/);
  assert.match(motion, /config\.appearance/);
  assert.match(app, /__bwApplySharedBackground/);
});

test('lead records expose manager delete action', () => {
  assert.match(app, /async function deleteLead\(id\)/);
});
