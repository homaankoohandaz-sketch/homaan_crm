(function(){
const fmt=x=>Number(x||0).toLocaleString('fa-IR');
const esc=x=>String(x??'').replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
async function renderCost236264(){
 if(!window.db||!window.pid)return;
 const root=document.querySelector('#content');if(!root)return;
 const [ci,mat,comp,units,sens,ret]=await Promise.all([
  db.from('project_cost_intelligence').select('*').eq('project_id',window.pid).single(),
  db.from('project_material_current_value').select('*').order('material_name').limit(40),
  db.from('project_land_comparables').select('*').order('updated_at',{ascending:false}).limit(20),
  db.from('project_unit_cost_allocation').select('*').eq('project_id',window.pid).order('unit_code'),
  db.from('project_profitability_sensitivity').select('*').eq('project_id',window.pid).order('sale_price_factor'),
  db.from('project_return_allocation').select('*').eq('project_id',window.pid).single()
 ]);
 if(ci.error){console.warn('Cost 236-264',ci.error.message);return}
 const x=ci.data||{}, r=ret.data||{};
 const card=(t,v,s='')=>'<div class="card"><div class="muted">'+t+'</div><div class="metric">'+fmt(v)+'</div><small>'+s+'</small></div>';
 const rows=(arr,html)=>'<div class="list">'+(arr||[]).map(html).join('')+'</div>';
 const el=document.createElement('section');el.id='cost-intelligence-236-264';el.className='panel';
 el.innerHTML='<h3>موتور هزینه و قیمت · ۲۳۶–۲۶۴</h3>'+
 '<div class="grid">'+
 card('هزینه ساخت جاری',x.construction_cost_current)+
 card('ارزش زمین ترکیبی',x.combined_land_price)+
 card('کل هزینه پروژه',x.total_project_cost)+
 card('هزینه هر m² مفید',x.total_cost_per_useful_m2)+
 card('هزینه ساخت هر m² مفید',x.construction_cost_per_useful_m2)+
 card('هزینه زمین هر m² مفید',x.land_cost_per_useful_m2)+
 card('درآمد سناریوی پایه',x.expected_revenue)+
 card('حاشیه توسعه‌دهنده',x.expected_revenue>0?(x.expected_revenue-x.total_project_cost)/x.expected_revenue*100:0,'%')+
 '</div>'+
 '<details open><summary><b>مواد و قیمت جاری</b></summary>'+
 rows(mat.data||[],m=>'<div class="item"><span>'+esc(m.material_name||m.material_key)+' <small>'+esc(m.unit||'')+'</small></span><b>'+fmt(m.price_toman)+' تومان</b></div>')+
 '</details>'+
 '<details><summary><b>زمین و مقایسه بازار</b> · '+fmt(x.comparable_count)+' comparable</summary>'+
 '<div class="grid">'+card('قیمت بازار پایین',x.comparable_low_price_m2)+card('میانگین بازار',x.comparable_avg_price_m2)+card('قیمت بازار بالا',x.comparable_high_price_m2)+card('ضریب تورم ساخت',x.construction_inflation_factor,'x')+'</div>'+
 rows(comp.data||[],m=>'<div class="item"><span>'+esc(m.neighborhood||m.street||'ملک')+' · '+fmt(m.land_area)+' m²</span><b>'+fmt(m.price_per_land_m2)+'</b></div>')+
 '</details>'+
 '<details><summary><b>هزینه واحدها</b></summary>'+
 rows(units.data||[],u=>'<div class="item"><span>'+esc(u.unit_code||u.unit_id)+' · '+fmt(u.area_m2)+' m²</span><b>'+fmt(u.allocated_total_cost)+' · سود '+fmt(u.indicative_profit)+'</b></div>')+
 '</details>'+
 '<details><summary><b>حساسیت سود</b> · سناریو، نه تضمین</summary>'+
 rows(sens.data||[],s=>'<div class="item"><span>'+fmt(Number(s.sale_price_factor)*100)+'% قیمت فروش</span><b>'+fmt(s.scenario_profit)+' · '+fmt(s.scenario_margin_percent)+'%</b></div>')+
 '</details>'+
 '<details><summary><b>بازده سرمایه/مالک</b></summary>'+
 '<div class="grid">'+card('سود توسعه‌دهنده',r.developer_profit)+card('سهم سرمایه‌گذار',r.investor_share_percent,'%')+card('بازده سرمایه‌گذار',r.investor_return)+card('بازده مالک',r.owner_return)+'</div>'+
 '</details>';
 root.prepend(el);
}
window.renderCost236264=renderCost236264;
const hook=()=>setTimeout(renderCost236264,450);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',hook);else hook();
})();