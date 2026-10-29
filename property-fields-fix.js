/* BuildWise property fields 2026-10-29e
 * Excel-critical fields always on forms/cards even when empty:
 * مالک، موبایل، خیابان، اسم، کوچه، فرعی، توضیحات
 * List reads from properties (not properties_client) so mobile/street are visible.
 */
(function () {
  function whenReady(fn) {
    var n = 0;
    (function tick() {
      if (typeof propertyForm === 'function' && typeof propertyCard === 'function' && window.db) {
        fn();
        return;
      }
      if (++n < 200) setTimeout(tick, 50);
    })();
  }

  whenReady(function () {
    var _esc = typeof esc === 'function' ? esc : function (x) {
      return String(x == null ? '' : x).replace(/[&<>"']/g, function (c) {
        return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
      });
    };
    var _n = typeof n === 'function' ? n : function (x) {
      return x === '' || x == null ? null : Number(x);
    };
    var _money = typeof money === 'function' ? money : function (x) {
      return x == null || x === '' || Number.isNaN(Number(x)) ? '—' : Number(x).toLocaleString('fa-IR');
    };
    var _btn = typeof btn === 'function' ? btn : function (t, fn, p) {
      return '<button class="btn ' + (p ? 'primary' : '') + '" onclick="' + fn + '">' + _esc(t) + '</button>';
    };
    var _stateLabel = typeof stateLabel === 'function' ? stateLabel : function (x) { return x || '—'; };

    window.propertyForm = function () {
      if (typeof canWrite === 'function' && !canWrite()) return toast('دسترسی ثبت ندارید', 'error');
      modal(
        '<h2>افزودن ملک</h2>' +
          '<p class="muted">فیلدهای اصلی فایل — حتی اگر خالی بمانند در فرم هستند</p>' +
          '<div class="form-grid">' +
          '<label>اسم / عنوان<input id="f_name" placeholder="اسم فایل یا عنوان"></label>' +
          '<label>نوع ملک<input id="f_type" placeholder="آپارتمان، کلنگی، ..."></label>' +
          '<label>مالک<input id="f_owner" placeholder="نام مالک"></label>' +
          '<label>موبایل<input id="f_mobile" inputmode="tel" placeholder="09..."></label>' +
          '<label>خیابان<input id="f_street" placeholder="نام خیابان"></label>' +
          '<label>کوچه<input id="f_alley" placeholder="کوچه"></label>' +
          '<label>فرعی<input id="f_side" placeholder="فرعی"></label>' +
          '<label>محله<input id="f_neighborhood"></label>' +
          '<label>منطقه<input id="f_region" type="number"></label>' +
          '<label>زیربنا<input id="f_area" type="number"></label>' +
          '<label>زمین<input id="f_land" type="number"></label>' +
          '<label>خواب<input id="f_bed" type="number"></label>' +
          '<label>قیمت کل<input id="f_price" type="number"></label>' +
          '<label>قیمت متری<input id="f_ppm" type="number"></label>' +
          '</div>' +
          '<label>توضیحات<textarea id="f_desc" rows="4" placeholder="توضیحات فایل"></textarea></label>' +
          '<div class="modal-actions">' + _btn('انصراف', 'closeModal()') + _btn('ذخیره', 'saveProperty()', true) + '</div>'
      );
    };

    window.saveProperty = async function () {
      var g = function (id) { return document.getElementById(id); };
      var payload = {
        property_name: (g('f_name') && g('f_name').value.trim()) || '',
        property_type: (g('f_type') && g('f_type').value.trim()) || '',
        owner_name: (g('f_owner') && g('f_owner').value.trim()) || null,
        mobile: (g('f_mobile') && g('f_mobile').value.trim()) || null,
        street: (g('f_street') && g('f_street').value.trim()) || null,
        alley: (g('f_alley') && g('f_alley').value.trim()) || null,
        side_street: (g('f_side') && g('f_side').value.trim()) || null,
        neighborhood: (g('f_neighborhood') && g('f_neighborhood').value.trim()) || null,
        region: _n(g('f_region') && g('f_region').value),
        built_area: _n(g('f_area') && g('f_area').value),
        land_area: _n(g('f_land') && g('f_land').value),
        bedrooms: _n(g('f_bed') && g('f_bed').value),
        total_price: _n(g('f_price') && g('f_price').value),
        price_per_meter: _n(g('f_ppm') && g('f_ppm').value),
        description: (g('f_desc') && g('f_desc').value.trim()) || null,
        status: 'active',
        created_by: window.me && window.me.id
      };
      if (!payload.property_name) return toast('اسم / عنوان ملک الزامی است', 'error');
      if (!payload.property_type) return toast('نوع ملک الزامی است', 'error');
      var r = await db.from('properties').insert(payload);
      if (r.error) return toast(r.error.message, 'error');
      closeModal();
      if (typeof properties === 'function') await properties();
      toast('ملک ثبت شد', 'success');
    };

    window.propertyCard = function (x) {
      var tags = Array.isArray(x.file_tags) ? x.file_tags : [];
      var search = [x.property_name, x.property_code, x.neighborhood, x.street, x.alley, x.side_street, x.owner_name, x.mobile, x.property_type, x.description].concat(tags).join(' ');
      var loc = [x.street, x.alley, x.side_street, x.neighborhood].filter(Boolean).join(' · ') || '—';
      var ownerLine =
        '<p class="muted">مالک: ' +
        _esc(x.owner_name || '—') +
        ' · موبایل: ' +
        _esc(x.mobile || '—') +
        '</p>';
      var desc = x.description
        ? '<p class="muted" style="white-space:pre-wrap;max-height:4.5em;overflow:hidden">' + _esc(String(x.description).slice(0, 180)) + '</p>'
        : '<p class="muted">توضیحات: —</p>';
      return (
        '<article class="property-card" data-id="' + _esc(x.id) + '" data-search="' + _esc(search) + '" data-type="' + _esc(x.property_type || '') + '">' +
        '<div class="property-top"><span class="code">' + (x.is_starred ? '★ ' : '') + _esc(x.property_code || 'بدون کد') + '</span><span class="badge">' + _esc(_stateLabel(x.status)) + '</span></div>' +
        '<h3>' + _esc(x.property_name || 'ملک بدون عنوان') + '</h3>' +
        '<p>' + _esc(x.property_type || '—') + ' · ' + _esc(loc) + '</p>' +
        ownerLine + desc +
        '<div class="property-meta"><span>' + _money(x.built_area) + ' متر</span><span>' + (x.bedrooms != null ? x.bedrooms : '—') + ' خواب</span><span>' + _money(x.price_per_meter) + ' / متر</span></div>' +
        '<strong class="price">' + _money(x.total_price) + '</strong>' +
        (typeof isManager === 'function' && isManager()
          ? '<div class="modal-actions"><button class="btn" data-id="' + _esc(x.id) + '" onclick="editProperty(this.dataset.id)">ویرایش</button></div>'
          : '') +
        '</article>'
      );
    };

    window.editProperty = async function (id) {
      if (typeof isManager === 'function' && !isManager()) return toast('فقط مدیر مجاز است', 'error');
      var r = await db.from('properties').select('id,property_name,property_type,owner_name,mobile,street,alley,side_street,region,neighborhood,built_area,land_area,bedrooms,total_price,price_per_meter,description,is_starred,file_tags').eq('id', id).single();
      if (r.error) return toast(r.error.message, 'error');
      var x = r.data || {};
      modal(
        '<h2>ویرایش ملک</h2><div class="form-grid">' +
          '<label>اسم / عنوان<input id="ep_name" value="' + _esc(x.property_name || '') + '"></label>' +
          '<label>نوع<input id="ep_type" value="' + _esc(x.property_type || '') + '"></label>' +
          '<label>مالک<input id="ep_owner" value="' + _esc(x.owner_name || '') + '"></label>' +
          '<label>موبایل<input id="ep_mobile" value="' + _esc(x.mobile || '') + '" inputmode="tel"></label>' +
          '<label>خیابان<input id="ep_street" value="' + _esc(x.street || '') + '"></label>' +
          '<label>کوچه<input id="ep_alley" value="' + _esc(x.alley || '') + '"></label>' +
          '<label>فرعی<input id="ep_side" value="' + _esc(x.side_street || '') + '"></label>' +
          '<label>محله<input id="ep_neighborhood" value="' + _esc(x.neighborhood || '') + '"></label>' +
          '<label>منطقه<input id="ep_region" type="number" value="' + _esc(x.region ?? '') + '"></label>' +
          '<label>زیربنا<input id="ep_area" type="number" value="' + _esc(x.built_area ?? '') + '"></label>' +
          '<label>زمین<input id="ep_land" type="number" value="' + _esc(x.land_area ?? '') + '"></label>' +
          '<label>خواب<input id="ep_bed" type="number" value="' + _esc(x.bedrooms ?? '') + '"></label>' +
          '<label>قیمت کل<input id="ep_price" type="number" value="' + _esc(x.total_price ?? '') + '"></label>' +
          '<label>قیمت متری<input id="ep_ppm" type="number" value="' + _esc(x.price_per_meter ?? '') + '"></label>' +
          '</div><label>توضیحات<textarea id="ep_desc" rows="4">' + _esc(x.description || '') + '</textarea></label>' +
          '<div class="modal-actions"><button class="btn" onclick="closeModal()">انصراف</button><button class="btn primary" onclick="savePropertyEdit(' + id + ')">ذخیره</button></div>'
      );
    };

    window.savePropertyEdit = async function (id) {
      if (typeof isManager === 'function' && !isManager()) return toast('فقط مدیر مجاز است', 'error');
      var g = function (i) { return document.getElementById(i); };
      var patch = {
        property_name: (g('ep_name') && g('ep_name').value.trim()) || '',
        property_type: (g('ep_type') && g('ep_type').value.trim()) || '',
        owner_name: (g('ep_owner') && g('ep_owner').value.trim()) || null,
        mobile: (g('ep_mobile') && g('ep_mobile').value.trim()) || null,
        street: (g('ep_street') && g('ep_street').value.trim()) || null,
        alley: (g('ep_alley') && g('ep_alley').value.trim()) || null,
        side_street: (g('ep_side') && g('ep_side').value.trim()) || null,
        neighborhood: (g('ep_neighborhood') && g('ep_neighborhood').value.trim()) || null,
        region: _n(g('ep_region') && g('ep_region').value),
        built_area: _n(g('ep_area') && g('ep_area').value),
        land_area: _n(g('ep_land') && g('ep_land').value),
        bedrooms: _n(g('ep_bed') && g('ep_bed').value),
        total_price: _n(g('ep_price') && g('ep_price').value),
        price_per_meter: _n(g('ep_ppm') && g('ep_ppm').value),
        description: (g('ep_desc') && g('ep_desc').value.trim()) || null,
        updated_by: window.me && window.me.id
      };
      var r = await db.from('properties').update(patch).eq('id', id);
      if (r.error) return toast(r.error.message, 'error');
      closeModal();
      if (typeof properties === 'function') await properties();
      toast('ملک ذخیره شد', 'success');
    };

    window.properties = async function () {
      var r = await db
        .from('properties')
        .select('id,property_code,property_name,property_type,owner_name,mobile,street,alley,side_street,region,neighborhood,built_area,bedrooms,total_price,price_per_meter,description,status,is_starred,file_tags,created_at')
        .order('created_at', { ascending: false })
        .limit(300);
      var canW = typeof canWrite === 'function' && canWrite();
      var pageFn = typeof page === 'function' ? page : function (t, s, a) {
        return '<div class="page-head"><h1>' + t + '</h1><p>' + s + '</p>' + (a || '') + '</div>';
      };
      var emptyFn = typeof empty === 'function' ? empty : function (t) { return '<div class="empty">' + t + '</div>'; };
      var errFn = typeof errbox === 'function' ? errbox : function (e) { return '<div class="errorbox">' + ((e && e.message) || e) + '</div>'; };
      main.innerHTML =
        pageFn('املاک', 'فایل‌ها — مالک، موبایل، خیابان، فرعی، توضیحات', canW ? _btn('+ افزودن ملک', 'propertyForm()', true) : '') +
        '<div class="toolbar"><input id="propertyQ" placeholder="جستجوی اسم، مالک، خیابان، موبایل، کد" oninput="filterProperties()">' +
        '<select id="propertyTypeFilter" onchange="filterProperties()"><option value="">همه انواع</option><option>آپارتمان</option><option>کلنگی</option><option>ویلایی</option><option>تجاری</option><option>زمین</option></select>' +
        '<span class="muted">' + ((r.data || []).length) + ' مورد</span></div>' +
        '<div id="property-list" class="data-grid">' +
        (r.error ? errFn(r.error) : (r.data || []).map(propertyCard).join('') || emptyFn('ملکی ثبت نشده است')) +
        '</div>';
    };

    console.info('[BuildWise] property-fields-fix 20261029e active');
  });
})();
