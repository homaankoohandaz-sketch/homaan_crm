/* Emergency restore buildwise-app.js — fetch known-good commit, inject tasks into ROLE_ACCESS, then eval */
(async function(){
  const url='https://cdn.jsdelivr.net/gh/homaankoohandaz-sketch/homaan_crm@9eac80bd807181c088166a5c7be0558258713002/buildwise-app.js';
  try{
    let src=await (await fetch(url)).text();
    src=src.replace(
      "const ROLE_ACCESS={owner:['requests','promotions'",
      "const ROLE_ACCESS={owner:['requests','tasks','promotions'"
    );
    src=src.replace(
      "manager:['requests','promotions'",
      "manager:['requests','tasks','promotions'"
    );
    src=src.replace(
      "advisor:['requests','dashboard'",
      "advisor:['requests','tasks','dashboard'"
    );
    src=src.replace(
      "agent:['requests','dashboard'",
      "agent:['requests','tasks','dashboard'"
    );
    src=src.replace(
      "builder:['dashboard','properties'",
      "builder:['tasks','dashboard','properties'"
    );
    src=src.replace(
      "staff:['requests','dashboard'",
      "staff:['requests','tasks','dashboard'"
    );
    const s=document.createElement('script');
    s.textContent=src;
    document.head.appendChild(s);
  }catch(e){
    console.error('BuildWise emergency restore failed',e);
    document.body.innerHTML='<pre style="padding:24px;font-family:sans-serif">بازیابی اضطراری buildwise-app ناموفق بود. لطفاً فایل را از commit 9eac80bd بازیابی کنید.\n'+e+'</pre>';
  }
})();
