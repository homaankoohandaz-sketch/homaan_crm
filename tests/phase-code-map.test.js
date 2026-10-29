import assert from 'node:assert/strict';
import fs from 'node:fs';

const index = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');

const expectedRuntimeOrder = [
  './buildwise-app.js',
  './src/core/data-normalization.js',
  './src/domains/intelligence/graph.js',
  './src/core/business-engines.js',
  './src/domains/procurement/engine.js',
  './src/domains/sales/engine.js',
  './src/domains/crm/data-import.js',
  './src/ui/analysis-engine.js',
  './src/ui/ai-workspace.js',
];

let cursor = -1;
for (const src of expectedRuntimeOrder) {
  // Script tags may carry a cache-bust query (e.g. ?v=20261029g); order is still enforced.
  const match = new RegExp('src="' + src.replace(/[.*+?^${}()|[\]\\\/]/g, '\\$&') + '(?:\\?[^"]*)?"').exec(index);
  const next = match ? match.index : -1;
  assert.ok(next > cursor, 'runtime script order broken: ' + src);
  cursor = next;
}

assert.ok(
  /import\(["']\.\/src\/domains\/construction\/browser-adapter\.js["']\)/.test(index),
  'construction browser adapter must be loaded'
);
assert.ok(!index.includes('src="./phase-app.js"'), 'legacy phase-app.js must not be loaded');
assert.ok(fs.existsSync(new URL('../PHASE_CODE_MAP.md', import.meta.url)));

console.log('phase-code-map: PASS');
