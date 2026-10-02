import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('501-524 landing surface contains required presentation and PWA metadata', () => {
  const html = fs.readFileSync(new URL('../../landing.html', import.meta.url), 'utf8');
  const markers = ['BuildWise AI','dashboard-preview','project-preview','gantt-preview','kpi-preview','ai-preview','sales-preview','customer-preview','application/manifest+json','og:title','theme-color','analytics','conversion','scroll-behavior'];
  for (const marker of markers) assert.ok(html.includes(marker), 'missing marker: '+marker);
});
