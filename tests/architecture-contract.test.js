import assert from 'node:assert/strict';
import fs from 'node:fs';

const requiredArtifacts = [
  'engines.js',
  'src/core/data-normalization.js',
  'src/ui/ai-workspace.js',
  'src/domains/crm/data-import.js',
  'src/ui/analysis-engine.js',
  '.agent-control/BUILDWISE-AGENT-SPECIFICATION-v1.md',
  'BUILDWISE-100-CHECKLIST.md'
];

for (const path of requiredArtifacts) {
  assert.ok(fs.existsSync(path), 'missing architecture artifact: ' + path);
}

const engines = fs.readFileSync('engines.js', 'utf8');
assert.match(engines, /valueProperty/);
assert.match(engines, /calculateConstruction/);

const checklist = fs.readFileSync('BUILDWISE-100-CHECKLIST.md', 'utf8');
assert.match(checklist, /# Deprecated/);
assert.match(checklist, /Canonical acceptance reference:/);
assert.match(checklist, /MASTER-CHECKLIST-v3-850\.md/);
assert.ok(fs.existsSync('BUILDWISE-MASTER-CHECKLIST.md'));

const normalization = fs.readFileSync('src/core/data-normalization.js', 'utf8');
globalThis.window = globalThis;
eval(normalization);
assert.equal(BuildWiseNormalize.normalizePhone('+98 912-123-4567'), '09121234567');
assert.equal(BuildWiseNormalize.normalizeKey(' قیمت متری '), 'قیمت_متری');
assert.equal(BuildWiseNormalize.duplicateKey({ mobile: '+989121234567' }), 'phone:09121234567');
assert.equal(BuildWiseNormalize.duplicateKey({ name: 'علی رضایی' }), 'name:علی رضایی');

console.log('architecture-contract.test.js: passed');
