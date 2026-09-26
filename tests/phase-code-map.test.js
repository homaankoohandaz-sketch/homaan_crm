import assert from 'node:assert/strict';
import fs from 'node:fs';

const index = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');

const expectedOrder = [
  './buildwise-app.js',
  './data-normalization.js',
  './graph-store.js',
  './graph-engine.js',
  './graph-sync.js',
  './contract-engine.js',
  './decision-engines.js',
  './construction-engine.js',
  './workflow-engine.js',
  './kpi-engine.js',
  './procurement-engine.js',
  './project-accounting-engine.js',
  './builder-sales-engine.js',
  './data-import.js',
  './data-import-v2.js',
  './analysis-engine-ui.js',
  './advisor-module.js',
  './deal-workspace.js',
  './hoomaan-ai-ui.js',
];

let cursor = -1;
for (const src of expectedOrder) {
  const next = index.indexOf('src="' + src + '"');
  assert.ok(next > cursor, 'runtime script order broken: ' + src);
  cursor = next;
}

assert.ok(!index.includes('src="./phase-app.js"'), 'legacy phase-app.js must not be loaded');
assert.ok(fs.existsSync(new URL('../PHASE_CODE_MAP.md', import.meta.url)));

console.log('phase-code-map: PASS');
