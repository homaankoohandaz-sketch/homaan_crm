// Password policy: length/complexity + leaked-password check via HIBP k-anonymity
// (only the first 5 chars of the SHA-1 hash leave the browser). Free alternative
// to Supabase "Leaked Password Protection" (Pro only). Fails open (3s timeout) if the API is unreachable. Server-side copy: supabase/functions/advisor-signup/password-policy.mjs.
export function checkPasswordBasics(password) {
  const p = String(password ?? '');
  if (p.length < 10) return 'رمز عبور باید حداقل ۱۰ کاراکتر باشد.';
  if (!/[A-Za-z]/.test(p) || !/\d/.test(p)) return 'رمز عبور باید شامل حرف و عدد باشد.';
  return null;
}

async function sha1Hex(text) {
  const buf = await globalThis.crypto.subtle.digest('SHA-1', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('').toUpperCase();
}

export async function isPasswordLeaked(password, fetchImpl = globalThis.fetch, timeoutMs = 3000) {
  try {
    const hash = await sha1Hex(String(password ?? ''));
    const ctrl = typeof AbortController === 'function' ? new AbortController() : null;
    const timer = ctrl ? setTimeout(() => ctrl.abort(), timeoutMs) : null;
    let res;
    try {
      res = await fetchImpl('https://api.pwnedpasswords.com/range/' + hash.slice(0, 5), { headers: { 'Add-Padding': 'true' }, signal: ctrl?.signal });
    } finally { if (timer) clearTimeout(timer); }
    if (!res.ok) return false;
    const suffix = hash.slice(5);
    return (await res.text()).split('\n').some((line) => {
      const [s, count] = line.trim().split(':');
      return s === suffix && Number(count) > 0;
    });
  } catch { return false; }
}

export async function validatePassword(password, fetchImpl) {
  const basic = checkPasswordBasics(password);
  if (basic) return basic;
  if (await isPasswordLeaked(password, fetchImpl)) return 'این رمز عبور در نشت‌های اطلاعاتی دیده شده است؛ رمز دیگری انتخاب کنید.';
  return null;
}

if (typeof window !== 'undefined') window.BuildWisePasswordPolicy = { checkPasswordBasics, isPasswordLeaked, validatePassword };
