#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const dir = __dirname;
const parts = [];
for (let i = 1; i <= 12; i++) {
  const p = path.join(dir, 'app.part' + i + '.js');
  if (!fs.existsSync(p)) throw new Error('missing ' + p);
  parts.push(fs.readFileSync(p, 'utf8'));
}
const out = path.join(dir, '..', '..', 'buildwise-app.js');
fs.writeFileSync(out, parts.join(''));
console.log('wrote', out, fs.statSync(out).size, 'bytes');
