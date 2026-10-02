import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const pkg = JSON.parse(fs.readFileSync('package.json','utf8'));

test('631 regression suite wires all current release-critical test gates', () => {
  const script = pkg.scripts.test;
  for (const marker of [
    'security-governance-591-608.test.mjs',
    'import-quality.test.mjs',
    'project-control-621-626.test.mjs',
    'mobile-pwa-portal-627-630.test.mjs'
  ]) assert.ok(script.includes(marker), 'missing regression gate: ' + marker);
});

test('632 security regression gates remain present and are not silently disabled', () => {
  const files = [
    'tests/unit/security-hardening-599-600.test.mjs',
    'tests/unit/security-governance-591-608.test.mjs',
    'tests/unit/security-governance-601-608.test.mjs'
  ];
  for (const file of files) {
    const source = fs.readFileSync(file,'utf8');
    assert.ok(source.length > 100, 'security test is unexpectedly empty: ' + file);
    assert.doesNotMatch(source, /test\.skip|describe\.skip|it\.skip/);
  }
});
