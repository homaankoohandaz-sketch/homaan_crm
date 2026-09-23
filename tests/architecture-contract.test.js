import assert from 'node:assert/strict';
import fs from 'node:fs';

const requiredArtifacts = [
  'engines.js',
  'data-normalization.js',
  'hoomaan-ai-ui.js',
  'deal-workspace.js',
  'advisor-module.js',
  'data-import-v2.js',
  '.agent-control/BUILDWISE-AGENT-SPECIFICATION-v1.md',
  'BUILDWISE-100-CHECKLIST.md'
];

for (const path of requiredArtifacts) {
  assert.ok(fs.existsSync(path), `missing architecture artifact: ${path}`);
}

const engines = fs.readFileSync('engines.js', 'utf8');
assert.match(engines, /valueProperty/);
assert.match(engines, /calculateConstruction/);

const checklist = fs.readFileSync('BUILDWISE-100-CHECKLIST.md', 'utf8');
assert.match(checklist, /1\. Data Foundation/);
assert.match(checklist, /100\. n8n Runtime/);

console.log('architecture-contract.test.js: passed');

const normalization = fs.readFileSync('data-normalization.js','utf8');
eval(normalization);
assert.equal(BuildWiseNormalize.normalizePhone('+98 912-123-4567'),'09121234567');
assert.equal(BuildWiseNormalize.normalizeKey(' قیمت متری '),'قیمت_متری');
assert.equal(BuildWiseNormalize.duplicateKey({mobile:'+989121234567'}),'phone:09121234567');
assert.equal(BuildWiseNormalize.duplicateKey({name:'علی رضایی'}),'name:علی رضایی');
