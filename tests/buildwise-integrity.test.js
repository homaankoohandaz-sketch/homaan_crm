import assert from 'node:assert/strict';
import fs from 'node:fs';

const app=fs.readFileSync('buildwise-app.js','utf8');
const fixes=fs.readFileSync('buildwise-fixes.js','utf8');
const importer=fs.readFileSync('data-import-v2.js','utf8');

assert.match(app,/const canWrite=\(\)=>\['owner','staff','manager'\]\.includes\(role\)/);
assert.match(app,/manager_edit_record/);
assert.doesNotMatch(fixes,/window\.propertyCard\s*=|window\.properties\s*=|window\.editProperty\s*=/);
assert.match(importer,/function resilientRaw/);
assert.match(importer,/rawFailed=rawFailed\.concat\(rawResult\.fail\)/);
assert.match(importer,/normalizePhone\(pick\(o,/);

console.log('BuildWise integrity checks: PASS');
