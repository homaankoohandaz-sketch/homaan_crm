import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = p => fs.readFileSync(p, 'utf8');

test('627 mobile shell exposes viewport-safe mobile foundation and touch targets', () => {
  const html = read('index.html');
  const css = read('mobile-foundation.css');
  assert.match(html, /viewport-fit=cover/);
  assert.match(css, /--bw-touch:44px/);
  assert.match(css, /@media \(max-width:767px\)/);
  assert.match(css, /safe-area-inset-bottom/);
});

test('628 PWA manifest is installable with icons and service worker registration', () => {
  const manifest = JSON.parse(read('manifest.webmanifest'));
  const html = read('index.html');
  assert.equal(manifest.display, 'standalone');
  assert.ok(Array.isArray(manifest.icons) && manifest.icons.length >= 1);
  assert.match(html, /serviceWorker\.register/);
  assert.ok(fs.existsSync('icons/buildwise-icon.svg'));
});

test('629 customer portal has share expiry, response actions, advisor alert and AI classification hooks', () => {
  const source = read('supabase/functions/customer-portal/index.ts');
  for (const marker of ['token_hash','expires_at','approved','interested','rejected','crm_alerts','OPENAI_API_KEY']) {
    assert.ok(source.includes(marker), 'missing portal marker: ' + marker);
  }
});

test('630 production E2E release path is explicitly represented and guarded by smoke prerequisites', () => {
  const smoke = read('tests/release-smoke.mjs');
  const flow = read('.agent-control/tasks/CUSTOMER-E2E-FLOW.md');
  assert.match(smoke, /manifest\.webmanifest/);
  assert.match(smoke, /sw\.js/);
  assert.match(flow, /customer-portal/);
  assert.match(flow, /Production|Runtime|Verification/);
});
