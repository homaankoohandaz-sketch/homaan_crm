import test from 'node:test';
import assert from 'node:assert/strict';
import { checkPasswordBasics, validatePassword } from '../../src/core/password-policy.js';

test('basic rules', () => {
  assert.ok(checkPasswordBasics('short1'));
  assert.ok(checkPasswordBasics('onlyletterslong'));
  assert.equal(checkPasswordBasics('goodpass12345'), null);
});
test('leaked password is rejected, fail-open on error', async () => {
  const pw = 'goodpass12345';
  const hash = (await import('node:crypto')).createHash('sha1').update(pw).digest('hex').toUpperCase();
  const leaked = async () => ({ ok: true, text: async () => `${hash.slice(5)}:42\nAAAA:1` });
  const clean = async () => ({ ok: true, text: async () => 'AAAA:1' });
  const down = async () => { throw new Error('offline'); };
  assert.ok(await validatePassword(pw, leaked));
  assert.equal(await validatePassword(pw, clean), null);
  assert.equal(await validatePassword(pw, down), null);
});

test('leak check times out instead of hanging signup', async () => {
  const { isPasswordLeaked } = await import('../../src/core/password-policy.js');
  const hang = (_u, { signal }) => new Promise((_, rej) => signal.addEventListener('abort', () => rej(new Error('aborted'))));
  const t0 = Date.now();
  assert.equal(await isPasswordLeaked('goodpass12345', hang, 50), false);
  assert.ok(Date.now() - t0 < 1000);
});
