/* Assemble full buildwise-app from 6 local parts (tasks in ROLE_ACCESS). */
(async function () {
  const urls = [
    './buildwise-app.part1.js',
    './buildwise-app.part2.js',
    './buildwise-app.part3.js',
    './buildwise-app.part4.js',
    './buildwise-app.part5.js',
    './buildwise-app.part6.js'
  ];
  try {
    const texts = await Promise.all(
      urls.map((u) =>
        fetch(u).then((r) => {
          if (!r.ok) throw new Error(u + ' ' + r.status);
          return r.text();
        })
      )
    );
    let src = texts.join('');
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
    console.error(e);
    // Fallback: known-good CDN + inject tasks
    try {
      const url =
        'https://cdn.jsdelivr.net/gh/homaankoohandaz-sketch/homaan_crm@9eac80bd807181c088166a5c7be0558258713002/buildwise-app.js';
      let src = await (await fetch(url)).text();
      src = src
        .replace("const ROLE_ACCESS={owner:['requests','promotions'", "const ROLE_ACCESS={owner:['requests','tasks','promotions'")
        .replace("manager:['requests','promotions'", "manager:['requests','tasks','promotions'")
        .replace("advisor:['requests','dashboard'", "advisor:['requests','tasks','dashboard'")
        .replace("agent:['requests','dashboard'", "agent:['requests','tasks','dashboard'")
        .replace("builder:['dashboard','properties'", "builder:['tasks','dashboard','properties'")
        .replace("staff:['requests','dashboard'", "staff:['requests','tasks','dashboard'");
      if (document.readyState !== 'loading') {
        src = src.replace(
          "window.addEventListener('DOMContentLoaded',()=>boot());",
          'boot();'
        );
      }
      const s = document.createElement('script');
      s.textContent = src;
      document.head.appendChild(s);
    } catch (e2) {
      document.body.innerHTML =
        '<pre style="padding:24px;direction:rtl">خطا در بارگذاری app\n' +
        String(e) +
        '\n' +
        String(e2) +
        '</pre>';
    }
  }
})();
