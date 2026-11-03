/* BuildWise UI motion controller v20261029g — strengthened
   Progressive enhancement only; no auth/data mutation. */
(function () {
  'use strict';
  if (window.__bwMotionControllerLoaded) return;
  window.__bwMotionControllerLoaded = true;

  var reduce = function () {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  };
  var seen = new WeakSet();

  function placeLiquidIndicator() {
    var nav = document.getElementById('bottomNav') || document.querySelector('.bottom-nav');
    if (!nav) return;
    var active = nav.querySelector('.nav-item.active') || nav.querySelector('[aria-current="page"]');
    if (!active) {
      nav.style.setProperty('--bw-pill-width', '0px');
      return;
    }
    var nr = nav.getBoundingClientRect();
    var ar = active.getBoundingClientRect();
    var left = Math.max(0, ar.left - nr.left);
    var width = Math.max(0, ar.width);
    nav.style.setProperty('--bw-pill-left', left + 'px');
    nav.style.setProperty('--bw-pill-width', width + 'px');
  }

  var ENTER_SELECTORS = [
    '.stats > *',
    '.data-grid > *',
    '.two-col > *',
    '.auth-card',
    '.public-hero',
    '.public-grid > *',
    '.role-card',
    '.gateway-card',
    '.property-card',
    '.lead-card',
    '.deal-card',
    '.project-card',
    '.match-card',
    '.integration-card',
    '.stat',
    '.card'
  ].join(', ');

  function animateNewSurfaces(root) {
    if (reduce() || !root) return;
    var nodes = [];
    if (root.nodeType === 1 && root.matches && root.matches(ENTER_SELECTORS)) {
      nodes.push(root);
    }
    if (root.querySelectorAll) {
      try {
        nodes.push.apply(nodes, root.querySelectorAll(ENTER_SELECTORS));
      } catch (e) { /* ignore */ }
    }
    nodes.forEach(function (el) {
      if (seen.has(el)) return;
      seen.add(el);
      el.classList.add('bw-motion-enter');
    });
  }

  function sync() {
    animateNewSurfaces(document.body);
    placeLiquidIndicator();
    mountBackgroundStudio();
  }

  function onNavClick(e) {
    var item = e.target && e.target.closest && e.target.closest('#bottomNav .nav-item, .bottom-nav .nav-item');
    if (item) {
      requestAnimationFrame(function () {
        placeLiquidIndicator();
        setTimeout(placeLiquidIndicator, 60);
        setTimeout(placeLiquidIndicator, 320);
      });
    }
  }

  var BG_KEY='buildwise_halvo_background_v1';
  var BG_DEFAULTS={image:'',fit:'cover',position:'center center',opacity:.42,blur:0,motion:true};
  function bgSettings(){try{return Object.assign({},BG_DEFAULTS,JSON.parse(localStorage.getItem(BG_KEY)||'{}'))}catch(_){return Object.assign({},BG_DEFAULTS)}}
  function applyBgSettings(s){
    var root=document.documentElement,body=document.body;if(!body)return;
    if(s.image){body.classList.add('bw-custom-bg');root.style.setProperty('--bw-user-bg-image','url("'+s.image.replace(/"/g,'%22')+'")');root.style.setProperty('--bw-user-bg-fit',s.fit||'cover');root.style.setProperty('--bw-user-bg-position',s.position||'center center');root.style.setProperty('--bw-user-bg-opacity',String(Math.max(.12,Math.min(.85,Number(s.opacity)||.42))));root.style.setProperty('--bw-user-bg-blur',Math.max(0,Math.min(8,Number(s.blur)||0))+'px')}else{body.classList.remove('bw-custom-bg');root.style.removeProperty('--bw-user-bg-image')}
    body.classList.toggle('bw-bg-motion-on',!!s.motion);
  }
  function compressBackground(file,done){
    if(!file||!/^image\/(png|jpeg|webp)$/i.test(file.type))return toast('فقط تصویر PNG، JPG یا WebP مجاز است','error');
    if(file.size>12*1024*1024)return toast('حجم تصویر باید کمتر از ۱۲ مگابایت باشد','error');
    var reader=new FileReader();reader.onerror=function(){toast('خواندن تصویر انجام نشد','error')};
    reader.onload=function(){var img=new Image();img.onerror=function(){toast('تصویر معتبر نیست','error')};img.onload=function(){var scale=Math.min(1,1800/img.width,1200/img.height),canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(img.width*scale));canvas.height=Math.max(1,Math.round(img.height*scale));canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height);done(canvas.toDataURL('image/jpeg',.78))};img.src=String(reader.result||'')};
    reader.readAsDataURL(file);
  }
  async function loadSharedBackground(){
    var client=window.db;if(!client)return null;
    var r=await client.from('ui_modules').select('config').eq('id','app-settings').maybeSingle();
    if(r.error||!r.data||!r.data.config||!r.data.config.appearance)return null;
    var shared=Object.assign({},BG_DEFAULTS,r.data.config.appearance);
    try{localStorage.setItem(BG_KEY,JSON.stringify(shared))}catch(_){}
    applyBgSettings(shared);return shared;
  }
  window.__bwApplySharedBackground=loadSharedBackground;
  function mountBackgroundStudio(){
    var title=document.querySelector('#main .page-head h1');if(!title||title.textContent.trim()!=='مدیریت اپ'||document.getElementById('bw-bg-studio'))return;
    if(typeof window.isManager==='function'&&!window.isManager())return;
    var grid=document.querySelector('#main .data-grid');if(!grid)return;
    if(!window.__bwBgSharedReady){if(!window.__bwBgSharedLoading){window.__bwBgSharedLoading=true;loadSharedBackground().catch(function(){return null}).finally(function(){window.__bwBgSharedReady=true;window.__bwBgSharedLoading=false;mountBackgroundStudio()})}return;}
    var s=bgSettings(),card=document.createElement('section');card.id='bw-bg-studio';card.className='integration-card bw-bg-studio';
    card.innerHTML='<div class="bw-bg-title"><div><b>ظاهر شیشه‌ای Halvo</b><small>تصویر پس‌زمینه، شفافیت و حرکت سطوح را تنظیم کنید</small></div><span class="badge">Glass UI</span></div><div class="bw-bg-preview" id="bw-bg-preview"><span>پیش‌نمایش پس‌زمینه</span></div><div class="form-grid"><label>بارگذاری تصویر<input id="bw-bg-upload" type="file" accept="image/png,image/jpeg,image/webp"></label><label>نحوه نمایش<select id="bw-bg-fit"><option value="cover">پر کردن صفحه</option><option value="contain">نمایش کامل</option></select></label><label>جایگاه تصویر<select id="bw-bg-position"><option value="center center">مرکز</option><option value="center top">بالا</option><option value="center bottom">پایین</option><option value="left center">چپ</option><option value="right center">راست</option></select></label><label>شفافیت پس‌زمینه<input id="bw-bg-opacity" type="range" min="0.12" max="0.85" step="0.01"></label><label>میزان محوشدگی<input id="bw-bg-blur" type="range" min="0" max="8" step="1"></label><label class="bw-bg-check">موشن نرم و شناور<input id="bw-bg-motion" type="checkbox"></label></div><div class="modal-actions"><button class="btn primary" id="bw-bg-save">ذخیره ظاهر</button><button class="btn" id="bw-bg-reset">بازگشت به حالت پیش‌فرض</button></div><small class="muted">تصویر فشرده در تنظیمات مرکزی برنامه ذخیره و برای همه کاربران همگام می‌شود.</small>';
    grid.prepend(card);var get=id=>document.getElementById(id);
    get('bw-bg-fit').value=s.fit;get('bw-bg-position').value=s.position;get('bw-bg-opacity').value=s.opacity;get('bw-bg-blur').value=s.blur;get('bw-bg-motion').checked=!!s.motion;
    var preview=get('bw-bg-preview');function previewNow(){preview.style.backgroundImage=s.image?'url("'+s.image+'")':'';preview.style.backgroundSize=get('bw-bg-fit').value;preview.style.backgroundPosition=get('bw-bg-position').value;preview.style.opacity=String(Math.max(.35,Number(get('bw-bg-opacity').value)||.42))}if(s.image)previewNow();
    get('bw-bg-upload').onchange=function(){var file=this.files&&this.files[0];compressBackground(file,function(data){s.image=data;previewNow()})};
    ['bw-bg-fit','bw-bg-position','bw-bg-opacity','bw-bg-blur'].forEach(id=>get(id).oninput=previewNow);
    get('bw-bg-save').onclick=async function(){s.fit=get('bw-bg-fit').value;s.position=get('bw-bg-position').value;s.opacity=Number(get('bw-bg-opacity').value);s.blur=Number(get('bw-bg-blur').value);s.motion=get('bw-bg-motion').checked;var client=window.db;if(!client)return toast('اتصال پایگاه داده آماده نیست','error');var current=await client.from('ui_modules').select('config').eq('id','app-settings').maybeSingle();if(current.error||!current.data)return toast(current.error?.message||'تنظیمات مرکزی پیدا نشد','error');var config=Object.assign({},current.data.config||{});config.appearance=Object.assign({},s);var saved=await client.from('ui_modules').update({config:config,updated_at:new Date().toISOString()}).eq('id','app-settings').select('id').maybeSingle();if(saved.error||!saved.data)return toast(saved.error?.message||'ذخیره مرکزی انجام نشد؛ سطح دسترسی مدیر را بررسی کنید','error');try{localStorage.setItem(BG_KEY,JSON.stringify(s))}catch(_){}applyBgSettings(s);toast('پس‌زمینه مرکزی برای کاربران ذخیره شد','success')};
    get('bw-bg-reset').onclick=async function(){var client=window.db;if(!client)return toast('اتصال پایگاه داده آماده نیست','error');var current=await client.from('ui_modules').select('config').eq('id','app-settings').maybeSingle();if(current.error||!current.data)return toast(current.error?.message||'تنظیمات مرکزی پیدا نشد','error');var config=Object.assign({},current.data.config||{});delete config.appearance;var saved=await client.from('ui_modules').update({config:config,updated_at:new Date().toISOString()}).eq('id','app-settings').select('id').maybeSingle();if(saved.error||!saved.data)return toast(saved.error?.message||'بازنشانی مرکزی انجام نشد','error');localStorage.removeItem(BG_KEY);s=Object.assign({},BG_DEFAULTS);applyBgSettings(s);preview.style.backgroundImage='';get('bw-bg-upload').value='';get('bw-bg-opacity').value=s.opacity;get('bw-bg-blur').value=0;get('bw-bg-fit').value='cover';get('bw-bg-position').value='center center';get('bw-bg-motion').checked=true;toast('پس‌زمینه برای همه کاربران بازنشانی شد','success')};
  }
  try{applyBgSettings(bgSettings())}catch(_){}
  var start = function () {
    sync();
    var target = document.body;
    if (!target) return;

    var observer = new MutationObserver(function (records) {
      var navDirty = false;
      for (var i = 0; i < records.length; i++) {
        var record = records[i];
        if (record.type === 'childList' && record.addedNodes.length) {
          for (var j = 0; j < record.addedNodes.length; j++) {
            var n = record.addedNodes[j];
            if (n.nodeType === 1) animateNewSurfaces(n);
            mountBackgroundStudio();
          }
        }
        if (record.target && record.target.closest) {
          if (record.target.closest('#bottomNav') || record.target.closest('.bottom-nav')) {
            navDirty = true;
          }
        }
        if (record.type === 'attributes' && record.target && record.target.closest) {
          if (record.target.closest('#bottomNav') || record.target.closest('.bottom-nav')) {
            navDirty = true;
          }
        }
      }
      if (navDirty || document.getElementById('bottomNav') || document.querySelector('.bottom-nav')) {
        requestAnimationFrame(placeLiquidIndicator);
      }
    });

    observer.observe(target, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'hidden', 'aria-current']
    });

    document.addEventListener('click', onNavClick, true);
    window.addEventListener('resize', placeLiquidIndicator, { passive: true });
    window.addEventListener('orientationchange', function () {
      setTimeout(placeLiquidIndicator, 80);
    }, { passive: true });

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(placeLiquidIndicator).catch(function () {});
    }

    var mainEl = document.getElementById('main') || document.querySelector('main');
    if (mainEl) {
      var mainObs = new MutationObserver(function () {
        requestAnimationFrame(function () {
          animateNewSurfaces(mainEl);
          placeLiquidIndicator();
        });
      });
      mainObs.observe(mainEl, { childList: true, subtree: false });
    }

    window.__bwMotionSync = sync;
    window.__bwMotionEnter = animateNewSurfaces;
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
