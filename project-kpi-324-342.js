(function(){
const n=x=>Number(x||0).toLocaleString('fa-IR');
const safe=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
async function renderKpi324342(){
 if(!window.db||!window.pid)return;
 const root=document.querySelector('#content'); if(!root)return;
 const [catalog,alerts,trends,drill]=await Promise.all([
  db.from('project_kpi_catalog').select('*').eq('project_id',window.pid).order('kpi_code'),
  db.from('project_kpi_alerts').select('*').eq('project_id',window.pid).neq('alert_level','normal').order('alert_level'),
  db.from('project_kpi_trends').select('*').eq('project_id',window.pid).order('snapshot_date',{ascending:false}).limit(14),
  db.from('project_kpi_drilldown').select('*').eq('project_id',window.pid).order('domain,metric')
 ]);
 if(catalog.error)return;
 const byCode=Object.fromEntries((catalog.data||[]).map(x=>[x.kpi_code,x]));
 const groups=[
  ['quality_hse','کیفیت و HSE',['quality','hse']],
  ['sales','فروش و سرمایه‌گذاری',['sales','unit_sales','roi','profit_margin']],
  ['finance','مالی',['cash_flow','cost_overrun']],
  ['operations','عملیات',['contractor','supplier','productivity','progress','delay','procurement_delay']]
 ];
 const card=(x)=>'<div class="card"><div class="muted">'+safe(x.kpi_name)+'</div><div class="metric">'+n(x.value)+' '+safe(x.unit)+'</div></div>';
 const s=document.createElement('section');s.id='kpi-324-342';s.className='panel';
 s.innerHTML='<h3>KPI Engine · ۳۲۴–۳۴۲</h3>'+
 '<div class="grid">'+(catalog.data||[]).map(card).join('')+'</div>'+
 groups.map(g=>'<details><summary><b>'+g[1]+'</b></summary><div class="grid">'+g[2].map(c=>byCode[c]?card(byCode[c]):'').join('')+'</div></details>').join('')+
 '<details><summary><b>هشدارهای KPI</b></summary><div class="list">'+((alerts.data||[]).length?(alerts.data||[]).map(a=>'<div class="item '+(a.alert_level==='critical'?'alert':'warn')+'"><span><b>'+safe(a.kpi_name)+'</b><div class="muted">'+n(a.value)+' / هشدار '+n(a.warning_value)+' / بحرانی '+n(a.critical_value)+'</div></span><span class="pill">'+safe(a.alert_level)+'</span></div>').join(''):'<span class="muted">هشدار فعال وجود ندارد.</span>')+'</div></details>'+
 '<details><summary><b>Trend / Drill-down</b></summary><div class="list">'+(trends.data||[]).map(t=>'<div class="item"><span>'+safe(t.snapshot_date)+'</span><span>Progress '+n(t.progress)+'% · Delay '+n(t.delay_count)+' · Cost '+n(t.cost_consumption_percent)+'%</span></div>').join('')+'</div><hr><div class="list">'+(drill.data||[]).map(d=>'<div class="item"><span>'+safe(d.domain)+' / '+safe(d.metric)+'</span><b>'+n(d.value)+'</b></div>').join('')+'</div></details>'+
 '<details><summary><b>Custom KPI Builder</b></summary><form id="custom-kpi-form" class="form"><label>Code<input name="code" required></label><label>Name<input name="name" required></label><label>Category<input name="category" value="custom"></label><label>Source metric<input name="source_metric" required placeholder="progress / delay / ..."></label><label>Target<input name="target" type="number"></label><label>Weight<input name="weight" type="number" value="1"></label><div class="full"><button class="primary">ثبت KPI سفارشی</button></div></form></details>';
 root.prepend(s);
 const f=s.querySelector('#custom-kpi-form');
 f?.addEventListener('submit',async e=>{
  e.preventDefault(); const o=Object.fromEntries(new FormData(f).entries());
  const r=await db.from('project_kpi_definitions').insert({project_id:window.pid,code:o.code,name:o.name,category:o.category,source_metric:o.source_metric,target:o.target||null,weight:o.weight||1,unit:'%',active:true});
  if(r.error){alert(r.error.message);return} renderKpi324342();
 });
}
window.renderKpi324342=renderKpi324342;
const h=()=>setTimeout(renderKpi324342,1000);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',h);else h();
})();