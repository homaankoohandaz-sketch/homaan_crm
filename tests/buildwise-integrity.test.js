import assert from 'node:assert/strict';
import fs from 'node:fs';

const app = fs.readFileSync('buildwise-app.js', 'utf8');
const normalization = fs.readFileSync('src/core/data-normalization.js', 'utf8');
const importer = fs.readFileSync('src/domains/crm/data-import.js', 'utf8');

const isLoader = app.includes('cdn.jsdelivr.net') || app.includes('Primary: known-good') || app.includes('Emergency restore');

if (isLoader) {
  assert.match(app, /9eac80bd/);
  assert.match(app, /tasks/);
  assert.match(app, /ROLE_ACCESS/);
} else {
  assert.match(app, /const canWrite=\(\)=>\['owner','staff','manager','builder'\]\.includes\(normalizedRole\(role\)\)/);
  assert.match(app, /manager_edit_record/);
}

assert.match(normalization, /normalizePhone/);
assert.match(normalization, /duplicateKey/);
assert.match(importer, /Canonical Data Importer/);
assert.match(importer, /normalizePhone/);
assert.match(importer, /raw_payload/);

console.log('BuildWise integrity checks: PASS');
