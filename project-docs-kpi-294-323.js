(function(){
const f=x=>Number(x||0).toLocaleString('fa-IR');
async function renderDocsKpi294323(){
 if(!window.db||!window.pid)return; const root=document.querySelector('#content');if(!root)return;
 const [docs,plan,kpi]=await Promise.all([
  db.from('project_document_register').select('*').eq('project_id',window.pid).order('created_at',{ascending:false}).limit(40),
  db.from('project_document_plan_data').select('*').eq('project_id',window.pid).single(),
  db.from('project_kpi_dashboard').select('*').eq('project_id',window.pid).single()
 ]);
 if(docs.error||kpi.error)return;
 const d=docs.data||[],p=plan.data||{},k=kpi.data||{};
 const card=(t,v)=>'<div class="card"><div class="muted">'+t+'</div><div class="metric">'+f(v)+'</div></div>';
 const s=document.createElement('section');s.id='docs-kpi-294-323';s.className='panel';
 s.innerHTML='<h3>اسناد، نقشه و KPI · ۲۹۴–۳۲۳</h3><div class="grid">'+card('اسناد',d.length)+card('OCR تکمیل',d.filter(x=>x.ocr_status==='complete').length)+card('پیشرفت برنامه',k.planned_progress)+card('پیشرفت واقعی',k.physical_progress)+card('مصرف بودجه %',k.cost_consumption_percent)+card('کار باز',k.open_tasks)+card('بحرانی باز',k.critical_open_tasks)+card('فروش قطعی',k.sold_units)+'</div>'+
 '<details open><summary><b>اطلاعات استخراج‌شده نقشه</b></summary><div class="grid">'+card('Gross Area',p.gross_area)+card('Useful Area',p.useful_area)+card('Units',p.unit_count)+card('Parking',p.parking_count)+card('Storage',p.storage_count)+card('Floors',p.floor_count)+card('Land Area',p.land_area)+'</div></details>'+
 '<details><summary><b>ثبت اسناد</b></summary><div class="list">'+d.map(x=>'<div class="item"><span>'+String(x.title||'').replace(/[<>]/g,'')+' · '+x.document_type+'</span><b>'+x.ocr_status+'</b></div>').join('')+'</div></details>';
 root.prepend(s);
}
window.renderDocsKpi294323=renderDocsKpi294323; const h=()=>setTimeout(renderDocsKpi294323,800);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',h);else h();
})();