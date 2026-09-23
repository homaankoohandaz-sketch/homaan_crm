/* BuildWise AI — Advisor workspace, follow-up deadlines and internal reporting */
(function(){
  const esc2=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const money2=x=>x==null||x===''||Number.isNaN(Number(x))?'—':Number(x).toLocaleString('fa-IR');
  const fmt2=x=>x?new Date(x).toLocaleString('fa-IR',{dateStyle:'short',timeStyle:'short'}):'—';
  const isManager=()=>['owner','manager'].includes(window.role);
  async function managerGate(){const r=await window.db.rpc('is_manager_user');return !r.error&&r.data===true}
  async function logAccess(event_type,target_type,target_id,metadata={}){
    try{await window.db.from('crm_access_events').insert({actor_id:window.me?.id||null,actor_name:window.me?.user_metadata?.full_name||window.role,event_type,target_type,target_id:target_id||null,metadata})}catch(e){}
  }
  function nav(){
    const items=[
      ['dashboard','داشبورد','⌂'],['my_panel','پنل شخصی مشاور','◎'],['requests','درخواست‌ها','◉'],['followups','پیگیری‌ها','⏰'],
      ['promotions','پروموشن','✦'],['properties','املاک','⌂'],['leads','خواهان‌ها','◉'],['deals','معاملات','◆'],
      ['search','جستجوی هوشمند','⌕'],['construction','ساخت و پروژه','▦'],['market','بازار و ارزش‌گذاری','◌'],['matching','تطبیق','⇄'],
      ['room','ROOM','◇'],['automation','اتوماسیون','⚙'],['ai','دستیار AI','✦']
    ];
    const h=items.map(([id,l,i])=>'<button class="nav-item" onclick="go(\''+id+'\')"><i>'+i+'</i><span>'+l+'</span></button>').join('');
    if(window.sideNav)sideNav.innerHTML=h;if(window.mobileNav)mobileNav.innerHTML=h;if(window.bottomNav)bottomNav.innerHTML=items.slice(0,5).map(([id,l,i])=>'<button class="nav-item" onclick="go(\''+id+'\')"><i>'+i+'</i><span>'+l+'</span></button>').join('');
  }
  const oldDraw=window.drawNav; window.drawNav=nav;
  window.go=async function(id){
    window.tab=id; if(window.main)main.innerHTML=window.busy?busy():''; nav();
    try{
      const f={my_panel:myPanel,followups:followups}[id]||window[id];
      if(typeof f!=='function')throw new Error('بخش مورد نظر پیدا نشد');
      await f();
    }catch(e){main.innerHTML=window.errbox?errbox(e):'<div class="errorbox">'+esc2(e.message)+'</div>'}
  };
  async function myPanel(){
    const uid=window.me?.id;
    const [f,t,a,r]=await Promise.all([
      window.db.from('crm_followups').select('*').eq('assigned_to',uid).in('status',['open','overdue']).order('due_at',{ascending:true}).limit(20),
      window.db.from('crm_followups').select('id',{count:'exact',head:true}).eq('assigned_to',uid).eq('status','open'),
      window.db.from('crm_access_events').select('*').eq('actor_id',uid).order('created_at',{ascending:false}).limit(15),
      window.db.from('crm_security_reports').select('id,status,category,severity,created_at').eq('reporter_id',uid).order('created_at',{ascending:false}).limit(10)
    ]);
    const fs=f.data||[], overdue=fs.filter(x=>new Date(x.due_at)<new Date()&&x.status==='open').length;
    const rows=fs.map(x=>'<div class="metric-line"><div class="row"><b>'+esc2(x.title)+'</b><span>'+fmt2(x.due_at)+'</span></div><div><span class="badge">'+esc2(x.followup_type)+'</span> <span class="badge">'+esc2(x.priority)+'</span></div></div>').join('');
    main.innerHTML=page('پنل شخصی مشاور','کارهای خودت، سررسید پیگیری‌ها و ثبت گزارش داخلی')+
      '<div class="stats">'+stat('پیگیری باز',t.count||0,'اختصاص‌یافته به من')+stat('سررسید گذشته',overdue,'نیازمند اقدام فوری')+stat('گزارش‌های من',(r.data||[]).length,'گزارش داخلی')+stat('رویدادهای ثبت‌شده',(a.data||[]).length,'دسترسی‌های اخیر')+'</div>'+
      card('پیگیری‌های نزدیک',rows||empty('پیگیری فعالی ندارید'))+
      card('ثبت گزارش درباره عملکرد مشاور','<p class="muted">برای عملکرد ضعیف، استفاده نادرست از فایل، احتمال سرقت فایل یا نقض محرمانگی گزارش ثبت کن. گزارش فقط برای مدیر قابل مشاهده و بررسی است.</p><button class="btn primary" onclick="securityReportForm()">ثبت گزارش</button>')+
      card('رویدادهای اخیر من',(a.data||[]).map(x=>'<div class="metric-line"><div class="row"><span>'+esc2(x.event_type)+'</span><span>'+fmt2(x.created_at)+'</span></div><small>'+esc2(x.target_type||'')+' #'+esc2(x.target_id||'')+'</small></div>').join('')||empty('رویدادی ثبت نشده است'));
  }
  function addDays(d,n){const x=new Date(d);x.setDate(x.getDate()+n);return x.toISOString().slice(0,16)}
  function scheduleDefaults(type){
    const map={presale:[1,3,7,14,30],rent:[1,3,7,14],mortgage:[1,3,7,14],rent_and_mortgage:[1,3,7,14],general:[3,7,14]};
    return map[type]||map.general;
  }
  async function followups(){
    const r=await window.db.from('crm_followups').select('*').order('due_at',{ascending:true}).limit(200);
    const rows=(r.data||[]).map(x=>'<article class="integration-card"><div class="row"><span class="badge">'+esc2(x.status)+'</span><small>'+fmt2(x.due_at)+'</small></div><h3>'+esc2(x.title)+'</h3><p>'+esc2(x.followup_type)+' · اولویت '+esc2(x.priority)+'</p><p>'+esc2(x.notes||'')+'</p><div class="modal-actions"><button class="btn" onclick="completeFollowup('+x.id+')">انجام شد</button></div></article>').join('');
    main.innerHTML=page('پیگیری‌ها','سررسید متمرکز برای پیش‌فروش، رهن، اجاره و سایر فرصت‌ها',window.canWrite?.()?btn('+ پیگیری جدید','followupForm()',true):'')+'<div class="data-grid">'+(r.error?errbox(r.error):rows||empty('پیگیری‌ای ثبت نشده است'))+'</div>';
  }
  window.followupForm=async function(){
    const today=addDays(new Date(),0);
    modal('<h2>ثبت برنامه پیگیری</h2><div class="form-grid"><label>نوع پیگیری<select id="fu_type" onchange="updateFollowupPreset()"><option value="presale">پیش‌فروش</option><option value="rent">اجاره</option><option value="mortgage">رهن</option><option value="rent_and_mortgage">رهن و اجاره</option><option value="general">عمومی</option></select></label><label>عنوان<input id="fu_title" placeholder="مثلاً پیگیری تصمیم مشتری"></label><label>تاریخ و ساعت سررسید<input id="fu_due" type="datetime-local" value="'+today+'"></label><label>اولویت<select id="fu_priority"><option value="normal">عادی</option><option value="high">مهم</option><option value="urgent">فوری</option></select></label></div><label>یادداشت<textarea id="fu_notes" rows="4"></textarea></label><div id="fu_preset" class="muted"></div><div class="modal-actions"><button class="btn" onclick="closeModal()">انصراف</button><button class="btn primary" onclick="saveFollowup()">ذخیره</button></div>');updateFollowupPreset();
  };
  window.updateFollowupPreset=function(){const t=document.getElementById('fu_type')?.value||'general';const ds=scheduleDefaults(t);const base=new Date();const txt=ds.map(d=>fmt2(new Date(Date.now()+d*86400000))).join(' ← ');if(document.getElementById('fu_preset'))document.getElementById('fu_preset').textContent='الگوی پیشنهادی: '+ds.join('، ')+' روز پس از ثبت/تماس | '+txt};
  window.saveFollowup=async function(){
    const uid=window.me?.id;if(!uid)return;
    const p={assigned_to:uid,created_by:uid,followup_type:fu_type.value,title:fu_title.value.trim()||'پیگیری مشتری',due_at:new Date(fu_due.value).toISOString(),priority:fu_priority.value,notes:fu_notes.value.trim(),status:'open'};
    if(!p.due_at)return toast('سررسید الزامی است','error');
    const r=await window.db.from('crm_followups').insert(p);if(r.error)return toast(r.error.message,'error');closeModal();await followups();toast('سررسید پیگیری ثبت شد','success');
  };
  window.completeFollowup=async function(id){const r=await window.db.from('crm_followups').update({status:'completed',completed_at:new Date().toISOString(),updated_at:new Date().toISOString()}).eq('id',id);if(r.error)return toast(r.error.message,'error');await followups();};
  window.securityReportForm=async function(){
    const r=await window.db.from('app_roles').select('user_id,full_name,role').eq('active',true).order('full_name');
    const opts=(r.data||[]).filter(x=>x.user_id!==window.me?.id).map(x=>'<option value="'+esc2(x.user_id)+'">'+esc2(x.full_name||'مشاور')+'</option>').join('');
    modal('<h2>گزارش داخلی مشاور</h2><div class="form-grid"><label>مشاور مورد گزارش<select id="sr_advisor">'+opts+'</select></label><label>نوع گزارش<select id="sr_category"><option value="poor_performance">عملکرد ضعیف</option><option value="file_theft">سرقت/انتقال غیرمجاز فایل</option><option value="privacy">نقض محرمانگی</option><option value="misconduct">رفتار/تخلف حرفه‌ای</option><option value="other">سایر</option></select></label><label>شدت<select id="sr_severity"><option value="low">کم</option><option value="medium">متوسط</option><option value="high">زیاد</option><option value="critical">بحرانی</option></select></label></div><label>شرح دقیق و قابل بررسی<textarea id="sr_desc" rows="7" placeholder="فقط واقعیت، زمان، فایل/مشتری مرتبط و شواهد را بنویسید."></textarea></label><div class="modal-actions"><button class="btn" onclick="closeModal()">انصراف</button><button class="btn primary" onclick="saveSecurityReport()">ثبت گزارش</button></div>');
  };
  window.saveSecurityReport=async function(){
    const d=sr_desc.value.trim();if(!d)return toast('شرح گزارش الزامی است','error');
    const r=await window.db.from('crm_security_reports').insert({reporter_id:window.me.id,subject_advisor_id:sr_advisor.value,category:sr_category.value,severity:sr_severity.value,description:d,status:'open'});
    if(r.error)return toast(r.error.message,'error');closeModal();toast('گزارش برای بررسی مدیر ثبت شد','success');
  };
  window.securityReports=async function(){
    if(!(await managerGate()))return toast('فقط مدیر می‌تواند گزارش‌ها را ببیند','error');
    const r=await window.db.from('crm_security_reports').select('*').order('created_at',{ascending:false}).limit(200);
    const rows=(r.data||[]).map(x=>'<article class="integration-card"><div class="row"><span class="badge">'+esc2(x.severity)+'</span><small>'+fmt2(x.created_at)+'</small></div><h3>'+esc2(x.category)+' · '+esc2(x.status)+'</h3><p>'+esc2(x.description)+'</p><div class="modal-actions"><button class="btn" onclick="reviewSecurityReport('+x.id+')">بررسی</button></div></article>').join('');
    main.innerHTML=page('گزارش‌های داخلی','گزارش‌های عملکرد، تخلف و سوءاستفاده از فایل فقط در اختیار مدیر',btn('← پنل شخصی','go(\'my_panel\')'))+'<div class="data-grid">'+(r.error?errbox(r.error):rows||empty('گزارشی وجود ندارد'))+'</div>';
  };
  window.reviewSecurityReport=async function(id){
    if(!(await managerGate()))return toast('دسترسی مدیر لازم است','error');
    const r=await window.db.from('crm_security_reports').select('*').eq('id',id).single();if(r.error)return toast(r.error.message,'error');const x=r.data;
    modal('<h2>بررسی گزارش</h2><p>'+esc2(x.description)+'</p><div class="form-grid"><label>وضعیت<select id="rr_status"><option>open</option><option>investigating</option><option>resolved</option><option>dismissed</option></select></label><label>یادداشت بررسی<textarea id="rr_notes" rows="4">'+esc2(x.resolution_notes||'')+'</textarea></label></div><div class="modal-actions"><button class="btn primary" onclick="saveReportReview('+id+')">ذخیره بررسی</button></div>');rr_status.value=x.status||'open';
  };
  window.saveReportReview=async function(id){const r=await window.db.from('crm_security_reports').update({status:rr_status.value,resolution_notes:rr_notes.value.trim(),reviewed_by:window.me.id,reviewed_at:new Date().toISOString(),updated_at:new Date().toISOString()}).eq('id',id);if(r.error)return toast(r.error.message,'error');closeModal();await securityReports();};
  window.requests=async function(){
    const r=await window.db.from('public_requests').select('id,full_name,phone,request_type,property_type,region,neighborhood,budget_min,budget_max,status,assigned_agent_id,created_at').order('created_at',{ascending:false}).limit(200);
    const cards=(r.data||[]).map(x=>'<article class="lead-card"><div class="row"><span class="badge">'+esc2(x.status||'ثبت‌شده')+'</span><small>'+fmt2(x.created_at)+'</small></div><h3>'+esc2(x.full_name||'درخواست‌دهنده')+'</h3><p>'+esc2(x.request_type||'—')+' · '+esc2(x.property_type||'—')+' · منطقه '+esc2(x.region||'—')+'</p><div class="lead-needs"><span>بودجه: '+money2(x.budget_max)+'</span><span>محله: '+esc2(x.neighborhood||'—')+'</span></div><div class="modal-actions"><button class="btn primary" onclick="quickFollowup('+x.id+',\''+esc2(x.request_type||'general')+'\')">ساخت سررسید پیگیری</button>'+(window.canWrite?.()?'<button class="btn" onclick="editPublicRequest('+x.id+')">ویرایش</button>':'')+'</div></article>').join('');
    main.innerHTML=page('درخواست‌ها','ورودی مشتری و مسیر پیگیری مشاور',window.canWrite?.()?btn('+ درخواست داخلی','leadForm()',true):'')+'<div class="data-grid">'+(r.error?errbox(r.error):cards||empty('درخواستی ثبت نشده است'))+'</div>';
  };
  window.quickFollowup=function(requestId,type){
    const t=String(type||'').toLowerCase();let normalized='general';if(t.includes('پیش'))normalized='presale';else if(t.includes('اجاره')&&t.includes('رهن'))normalized='rent_and_mortgage';else if(t.includes('رهن'))normalized='mortgage';else if(t.includes('اجاره'))normalized='rent';
    followupForm();setTimeout(()=>{if(window.fu_type){fu_type.value=normalized;updateFollowupPreset()}},50);
  };
  const oldView=window.viewProperty; if(oldView)window.viewProperty=async function(id){await logAccess('property_view','property',id);return oldView(id)};
  const oldEdit=window.editProperty; if(oldEdit)window.editProperty=async function(id){await logAccess('property_edit_open','property',id);return oldEdit(id)};
  const oldPromotion=window.promotions;
  window.promotions=async function(){if(window.canWrite?.()&&isManager()){}return oldPromotion?oldPromotion():null};
  window.__BUILDWISE_ADVISOR_MODULE__={version:'1.0.0',tables:['crm_followups','crm_security_reports','crm_access_events']};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(nav,50));else setTimeout(nav,50);
})();