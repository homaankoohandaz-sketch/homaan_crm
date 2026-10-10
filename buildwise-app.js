/* BuildWise app loader: assemble split sources (full app with tasks in ROLE_ACCESS) then eval */
(async function(){
  try{
    const [a,b] = await Promise.all([
      fetch('./buildwise-app.part1.js').then(r=>{if(!r.ok)throw new Error('part1 '+r.status);return r.text()}),
      fetch('./buildwise-app.part2.js').then(r=>{if(!r.ok)throw new Error('part2 '+r.status);return r.text()})
    ]);
    let src=a+b;
    if(document.readyState==='loading'){
      /* parent source registers DOMContentLoaded boot */
    } else {
      src=src.replace("window.addEventListener('DOMContentLoaded',()=>boot());","boot();");
    }
    const s=document.createElement('script');
    s.textContent=src;
    document.head.appendChild(s);
  }catch(e){
    console.error(e);
    document.body.innerHTML='<pre style="padding:24px;direction:rtl">خطا در بارگذاری buildwise-app: '+String(e)+'</pre>';
  }
})();
