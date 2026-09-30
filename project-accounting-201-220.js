(function(){
const fmt=x=>Number(x||0).toLocaleString('fa-IR');
async function renderAccounting201220(){
 if(!window.db||!window.pid)return;
 const root=document.querySelector('#content'); if(!root)return;
 const [v,w,p,f,u,c,s,m,dt,cur]=await Promise.all([
  db.from('project_accounting_variance').select('*').eq('project_id',window.pid).single(),
  db.from('project_cost_by_wbs').select('*').eq('project_id',window.pid),
  db.from('project_cost_by_phase').select('*').eq('project_id',window.pid),
  db.from('project_cost_by_floor').select('*').eq('project_id',window.pid),
  db.from('project_cost_by_unit').select('*').eq('project_id',window.pid),
  db.from('project_cost_by_contractor').select('*').eq('project_id',window.pid),
  db.from('project_cost_by_supplier').select('*').eq('project_id',window.pid),
  db.from('project_cost_by_material').select('*').eq('project_id',window.pid),
  db.from('project_cost_by_date').select('*').eq('project_id',window.pid).order('entry_date',{ascending:false}).limit(12),
  db.from('project_accounting_current_equivalent').select('*').eq('project_id',window.pid).limit(1)
 ]);
 if(v.error){console.warn('Accounting 201-220',v.error.message);return}
 const x=v.data||{}, cc=cur.data?.[0]||{};
 const groups=[['WBS',w.data||[],'wbs_id'],['Phase',p.data||[],'phase_id'],['Floor',f.data||[],'floor_id'],['Unit',u.data||[],'unit_id'],['Contractor',c.data||[],'contractor_name'],['Supplier',s.data||[],'supplier_name'],['Material',m.data||[],'material_key']];
 const el=document.createElement('section');el.id='accounting-201-220';el.className='panel';
 el.innerHTML='<h3>حسابداری پروژه · ۲۰۱–۲۲۰</h3>'+
 '<div class="grid">'+
 '<div class="card"><div class="muted">بودجه/واقعی</div><div class="metric">'+fmt(x.actual_cost)+' / '+fmt(x.revised_budget)+'</div></div>'+
 '<div class="card"><div class="muted">انحراف بودجه</div><div class="metric">'+fmt(x.budget_vs_actual_amount)+'</div><small>'+fmt(x.budget_vs_actual_percent)+'%</small></div>'+
 '<div class="card"><div class="muted">تعهد/واقعی</div><div class="metric">'+fmt(x.committed_vs_actual_amount)+'</div><small>'+fmt(x.committed_vs_actual_percent)+'%</small></div>'+
 '<div class="card"><div class="muted">پیش‌بینی/بودجه</div><div class="metric">'+fmt(x.forecast_vs_budget_amount)+'</div><small>'+fmt(x.forecast_vs_budget_percent)+'%</small></div>'+
 '</div>'+
 '<div class="list"><div class="item"><b>معادل جاری USD</b><span>'+fmt(cc.current_value_usd)+'</span></div><div class="item"><b>معادل جاری طلای ۱۸ عیار (گرم)</b><span>'+fmt(cc.current_value_gold18k_grams)+'</span></div></div>'+
 groups.map(g=>'<details class="item"><summary><b>هزینه بر اساس '+g[0]+'</b> ('+g[1].length+')</summary><div class="list">'+g[1].slice(0,20).map(r=>'<div class="item"><span>'+String(r[g[2]]??'—')+'</span><b>'+fmt(r.net_cost)+'</b></div>').join('')+'</div></details>').join('')+
 '<details class="item"><summary><b>روند هزینه روزانه</b></summary><div class="list">'+(dt.data||[]).map(r=>'<div class="item"><span>'+r.entry_date+'</span><b>'+fmt(r.net_cost)+'</b></div>').join('')+'</div></details>';
 root.prepend(el);
}
window.renderAccounting201220=renderAccounting201220;
const hook=()=>setTimeout(renderAccounting201220,250);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',hook);else hook();
})();
