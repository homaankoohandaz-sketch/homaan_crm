(function(){
const f=x=>Number(x||0).toLocaleString('fa-IR');
async function renderAccounting221235(){
 if(!window.db||!window.pid)return;
 const root=document.querySelector('#content');if(!root)return;
 const [fac,cf,ar,ap,cp,sp,adv,ret,ins,cal,docs,audit]=await Promise.all([
  db.from('project_forecast_at_completion').select('*').eq('project_id',window.pid).single(),
  db.from('project_cash_flow').select('*').eq('project_id',window.pid).order('flow_date',{ascending:false}).limit(12),
  db.from('project_receivables').select('*').eq('project_id',window.pid),
  db.from('project_payables').select('*').eq('project_id',window.pid),
  db.from('project_contractor_payments').select('*').eq('project_id',window.pid),
  db.from('project_supplier_payments').select('*').eq('project_id',window.pid),
  db.from('project_advance_payments').select('*').eq('project_id',window.pid),
  db.from('project_retention').select('*').eq('project_id',window.pid).single(),
  db.from('project_installments').select('*').eq('project_id',window.pid),
  db.from('project_payment_calendar').select('*').eq('project_id',window.pid).order('due_date',{ascending:true}).limit(20),
  db.from('project_financial_documents').select('id,document_type,document_ref,document_date,amount,currency').eq('project_id',window.pid).order('created_at',{ascending:false}).limit(20),
  db.from('project_accounting_audit').select('id,entry_date,entry_type,description,debit,credit,currency').eq('project_id',window.pid).order('id',{ascending:false}).limit(20)
 ]);
 if(fac.error){console.warn('Accounting 221-235',fac.error.message);return}
 const x=fac.data||{}, r=ret.data||{};
 const block=(title,rows,key='amount')=>'<details class="item"><summary><b>'+title+'</b> ('+rows.length+')</summary><div class="list">'+rows.map(a=>'<div class="item"><span>'+String(a.payee||a.due_date||a.flow_date||a.description||a.document_ref||'—')+'</span><b>'+f(a[key]??a.outstanding_amount??a.scheduled_amount??a.net_cash_flow)+'</b></div>').join('')+'</div></details>';
 const el=document.createElement('section');el.id='accounting-221-235';el.className='panel';
 el.innerHTML='<h3>حسابداری پروژه · ۲۲۱–۲۳۵</h3><div class="grid">'+
 '<div class="card"><div class="muted">Forecast at Completion</div><div class="metric">'+f(x.forecast_at_completion)+'</div><small>'+f(x.forecast_variance_percent)+'%</small></div>'+
 '<div class="card"><div class="muted">دریافتنی</div><div class="metric">'+f(ar.data?.reduce((n,a)=>n+Number(a.amount||0),0))+'</div></div>'+
 '<div class="card"><div class="muted">پرداختنی</div><div class="metric">'+f(ap.data?.reduce((n,a)=>n+Number(a.outstanding_amount||0),0))+'</div></div>'+
 '<div class="card"><div class="muted">Retention</div><div class="metric">'+f(r.retention_total)+'</div></div></div>'+
 block('Cash Flow',cf.data||[],'net_cash_flow')+block('Contractor Payments',cp.data||[])+block('Supplier Payments',sp.data||[])+block('Advances',adv.data||[],'total_advance')+
 block('Installments',ins.data||[],'outstanding_amount')+block('Payment Calendar',cal.data||[],'scheduled_amount')+
 block('Financial Documents',docs.data||[],'amount')+block('Audit Trail',audit.data||[],'debit');
 root.prepend(el);
}
window.renderAccounting221235=renderAccounting221235;
const hook=()=>setTimeout(renderAccounting221235,350);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',hook);else hook();
})();