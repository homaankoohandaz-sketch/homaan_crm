/* Primary: known-good app from commit 9eac80bd + inject tasks into ROLE_ACCESS.
   Full local 69KB source restore still pending (tool size limit). */
(async function () {
  const url =
    'https://cdn.jsdelivr.net/gh/homaankoohandaz-sketch/homaan_crm@9eac80bd807181c088166a5c7be0558258713002/buildwise-app.js';
  try {
    let src = await (await fetch(url)).text();
    if (!src || src.length < 1000) throw new Error('empty or short source');
    src = src
      .replace(
        "const ROLE_ACCESS={owner:['requests','promotions'",
        "const ROLE_ACCESS={owner:['requests','tasks','promotions'"
      )
      .replace(
        "manager:['requests','promotions'",
        "manager:['requests','tasks','promotions'"
      )
      .replace(
        "advisor:['requests','dashboard'",
        "advisor:['requests','tasks','dashboard'"
      )
      .replace(
        "agent:['requests','dashboard'",
        "agent:['requests','tasks','dashboard'"
      )
      .replace(
        "builder:['dashboard','properties'",
        "builder:['tasks','dashboard','properties'"
      )
      .replace(
        "staff:['requests','dashboard'",
        "staff:['requests','tasks','dashboard'"
      );
    if (document.readyState !== 'loading') {
      src = src.replace(
        "window.addEventListener('DOMContentLoaded',()=>boot());",
        'boot();'
      );
    }
    const s = document.createElement('script');
    s.textContent = src;
    document.head.appendChild(s);
  } catch (e) {
    console.error('BuildWise app load failed', e);
    document.body.innerHTML =
      '<pre style="padding:24px;font-family:sans-serif;direction:rtl">بارگذاری buildwise-app ناموفق.\n' +
      String(e) +
      '\nفایل کامل را از commit 9eac80bd بازیابی کنید و tasks را به ROLE_ACCESS اضافه کنید.</pre>';
  }
})();
