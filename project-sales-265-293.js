(function(){
const fmt=x=>Number(x||0).toLocaleString('fa-IR');
const esc=x=>String(x??'').replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
async function renderSales265293(){
 if(!window.db||!window.pid)return;
 const root=document.querySelector('#content');if(!root)return;
 const [inv,mat,offers]=await Promise.all([
  db.from('project_sales_inventory').select('*').eq('project_id',window.pid),
  db.from('project_unit_sales_matrix').select('*').eq('project_id',window.pid).order('unit_code'),
  db.from('project_offer_current_versions').select('*').eq('project_id',window.pid).order('created_at',{ascending:false}).limit(30)
 ]);
 if(inv.error||mat.error){console.warn('Sales 265-293',inv.error||mat.error);return}
 const card=(t,v,s='')=>'<div class="card"><div class="muted">'+t+'</div><div class="metric">'+fmt(v)+'</div><small>'+s+'</small></div>';
 const sec=document.createElement('section');sec.id='sales-engine-265-293';sec.className='panel';
 sec.innerHTML='<h3>موتور فروش و پیشنهاد · ۲۶۵–۲۹۳</h3>'+
 '<div class="grid">'+
 card('واحدهای آماده', (inv.data||[]).find(x=>x.status==='available')?.unit_count||0)+
 card('رزرو شده', (inv.data||[]).find(x=>x.status==='reserved')?.unit_count||0)+
 card('فروخته شده', (inv.data||[]).find(x=>x.status==='sold')?.unit_count||0)+
 card('تعداد پیشنهادها',(offers.data||[]).length)+'</div>'+
 '<details open><summary><b>ماتریس قیمت واحدها</b></summary>'+
 '<div class="list">'+(mat.data||[]).map(u=>'<div class="item"><span><b>'+esc(u.unit_code)+'</b> · '+fmt(u.area_m2)+' m² · '+esc(u.status)+'</span><b>'+fmt(u.total_unit_price)+' تومان</b></div>').join('')+'</div></details>'+
 '<details><summary><b>موجودی فروش</b></summary><div class="list">'+(inv.data||[]).map(x=>'<div class="item"><span>'+esc(x.status)+'</span><b>'+fmt(x.unit_count)+' واحد · '+fmt(x.inventory_value)+'</b></div>').join('')+'</div></details>'+
 '<details><summary><b>پیشنهادها و مذاکره</b></summary><div class="list">'+(offers.data||[]).map(o=>'<div class="item"><span>'+esc(o.offer_no)+' · v'+o.version_no+' · '+esc(o.offer_type)+'</span><b>'+fmt(o.final_price)+' · '+esc(o.status)+'</b></div>').join('')+'</div></details>'+
 '<button type="button" onclick="window.print()">پیش‌نمایش / چاپ پیشنهاد فروش</button>';
 root.prepend(sec);
}
window.renderSales265293=renderSales265293;
const hook=()=>setTimeout(renderSales265293,650);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',hook);else hook();
})();