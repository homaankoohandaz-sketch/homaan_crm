/* Phase04 hierarchy UI bridge — relational tables only (no assumptions JSON) */
(function () {
  function ensureTab() {
    const tabs = document.querySelector('nav.tabs');
    if (!tabs || tabs.querySelector('[data-t="hierarchy"]')) return;
    const btn = document.createElement('button');
    btn.className = 'tab';
    btn.dataset.t = 'hierarchy';
    btn.textContent = 'سلسله‌مراتب';
    const schedule = tabs.querySelector('[data-t="schedule"]');
    if (schedule) tabs.insertBefore(btn, schedule);
    else tabs.appendChild(btn);
    btn.onclick = function () {
      if (typeof show === 'function') show('hierarchy');
      else renderHierarchyTab();
    };
  }

  async function hierarchyTree() {
    if (typeof pid === 'undefined' || !pid) return '<span class="muted">پروژه انتخاب نشده</span>';
    const cx = await db.from('project_complexes').select('id,name,code,status').eq('project_id', pid).order('id');
    if (cx.error) return String(cx.error.message);
    if (!cx.data?.length) return '<span class="muted">مجتمعی نیست.</span>';
    let out = '';
    for (const c of cx.data) {
      out += '<div class="item"><b>مجتمع #' + c.id + '</b> ' + esc(c.name) + '</div>';
      const bd = await db.from('project_buildings').select('id,name').eq('complex_id', c.id).order('id');
      for (const b of bd.data || []) {
        out += '<div class="item" style="margin-right:12px"><b>ساختمان #' + b.id + '</b> ' + esc(b.name) + '</div>';
        const fl = await db.from('project_floors').select('id,floor_number,name').eq('building_id', b.id).order('floor_number');
        for (const f of fl.data || []) {
          out += '<div class="item" style="margin-right:24px"><b>طبقه #' + f.id + '</b> ' + f.floor_number + ' ' + esc(f.name || '') + '</div>';
          const un = await db.from('project_units').select('id,unit_code,unit_type').eq('floor_id', f.id).order('id');
          for (const u of un.data || []) {
            out += '<div class="item" style="margin-right:36px"><b>واحد #' + u.id + '</b> ' + esc(u.unit_code) + '</div>';
          }
        }
      }
    }
    return out;
  }

  async function renderHierarchyTab() {
    const c = document.getElementById('content');
    if (!c) return;
    document.querySelectorAll('.tab').forEach((b) => b.classList.toggle('active', b.dataset.t === 'hierarchy'));
    const tree = await hierarchyTree();
    c.innerHTML =
      '<section class="panel"><h3>سلسله‌مراتب (canonical relational)</h3>' +
      '<p class="muted">Project → Complex → Building → Floor → Unit — جداول live</p>' +
      '<form class="form" data-form="complex"><label>نام مجتمع<input name="name" required></label><label>کد<input name="code"></label><div class="full"><button class="primary">ثبت مجتمع</button></div></form>' +
      '<form class="form" data-form="building"><label>complex_id<input name="complex_id" type="number" required></label><label>نام ساختمان<input name="name" required></label><label>طبقات<input name="floors_planned" type="number"></label><div class="full"><button class="primary">ثبت ساختمان</button></div></form>' +
      '<form class="form" data-form="floor"><label>building_id<input name="building_id" type="number" required></label><label>شماره طبقه<input name="floor_number" type="number" required></label><label>نام<input name="name"></label><div class="full"><button class="primary">ثبت طبقه</button></div></form>' +
      '<form class="form" data-form="unit"><label>floor_id<input name="floor_id" type="number" required></label><label>کد واحد<input name="unit_code" required></label><label>نوع<input name="unit_type"></label><div class="full"><button class="primary">ثبت واحد</button></div></form>' +
      '</section><section class="panel"><h3>درخت</h3><div class="list">' +
      tree +
      '</div></section>';
  }

  document.addEventListener('submit', async function (e) {
    const f = e.target;
    if (!f || !f.dataset || !f.dataset.form) return;
    const o = Object.fromEntries(new FormData(f).entries());
    if (f.dataset.form === 'complex') {
      e.preventDefault();
      e.stopImmediatePropagation();
      return post('project_complexes', { project_id: pid, name: o.name, code: o.code || null, status: 'active' }, 'complex');
    }
    if (f.dataset.form === 'building') {
      e.preventDefault();
      e.stopImmediatePropagation();
      return post('project_buildings', { complex_id: Number(o.complex_id), name: o.name, floors_planned: o.floors_planned || 0, status: 'active' }, 'building');
    }
    if (f.dataset.form === 'floor') {
      e.preventDefault();
      e.stopImmediatePropagation();
      return post('project_floors', { building_id: Number(o.building_id), floor_number: Number(o.floor_number) || 0, name: o.name || null, status: 'active' }, 'floor');
    }
    if (f.dataset.form === 'unit') {
      e.preventDefault();
      e.stopImmediatePropagation();
      return post('project_units', { floor_id: Number(o.floor_id), unit_code: o.unit_code, unit_type: o.unit_type || null, status: 'available' }, 'unit');
    }
  }, true);

  const _show = window.show;
  if (typeof _show === 'function') {
    window.show = async function (t) {
      if (t === 'hierarchy') return renderHierarchyTab();
      return _show(t);
    };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ensureTab);
  else ensureTab();
  setTimeout(ensureTab, 500);
})();
