(function(){
  function add(){
    if(!document.body||document.getElementById('suite-links')) return;
    const wrap=document.createElement('div'); wrap.id='suite-links';
    wrap.style='position:fixed;left:12px;bottom:12px;z-index:9998;display:flex;gap:7px;flex-wrap:wrap;max-width:calc(100% - 24px)';
    const css='display:inline-block;text-decoration:none;padding:9px 12px;border-radius:10px;background:#17364a;color:#fff;font:600 13px Arial;box-shadow:0 3px 12px #0002';
    [['visual-project.html','شوروم پروژه'],['project-control.html','کنترل پروژه'],['index.html?open=import','ورود اکسل / Google Sheets']].forEach(function(x){const a=document.createElement('a');a.href=x[0];a.textContent=x[1];a.style=css;wrap.appendChild(a)});
    document.body.appendChild(wrap);
  }
  add();
  import('./src/ui/project-views-493-500.js').catch(function(){});
  new MutationObserver(add).observe(document.documentElement,{childList:true,subtree:true});
})();
