import {
  createTask,
  respondToTask,
  completeTask,
  rejectTask,
  moveTaskToTomorrow,
  setTaskStarred,
  setTaskPriority,
  configureTaskNotification,
  listDueTodayTasks,
  listOverdueTasks,
  listStarredTasks,
} from '../core/task-engine.js';
import { createTaskRepository } from '../core/task-repository.js';

const esc = (x) => String(x ?? '').replace(/[&<>"']/g, (c) => ({
  '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
}[c]));
const today = () => new Date().toISOString().slice(0, 10);
const tomorrow = () => { const d = new Date(); d.setDate(d.getDate()+1); return d.toISOString().slice(0,10); };
const faDate = (x) => x ? new Date(x).toLocaleDateString('fa-IR') : '—';
const priorityLabel = { critical:'بحرانی', important:'مهم', normal:'عادی', low:'کم' };
const contextLabel = { crm:'CRM / مشتری', construction:'ساخت / کارگاه', procurement:'خرید / تأمین' };
const statusLabel = { open:'باز', in_progress:'در حال پیگیری', completed:'تکمیل', rejected:'رد شده', overdue:'معوق' };

let repo;
function repository(){ return repo ??= createTaskRepository(window.db); }
function actor(){ return window.me?.id || null; }
function canManage(){ return ['owner','manager','staff','builder'].includes(window.role); }
function modal(html){ window.modal?.(html); }
function close(){ window.closeModal?.(); }
function toast(message, type='info'){ window.toast?.(message, type); }
function field(id,label,value='',type='text'){ return '<label>'+esc(label)+'<input id="'+id+'" type="'+type+'" value="'+esc(value)+'"></label>'; }

function taskCard(t){
  const mine = String(t.assigned_to||'') === String(actor()||'');
  const terminal = ['completed','rejected'].includes(t.status);
  const overdue = !terminal && t.deadline && Date.parse(t.deadline) < Date.now();
  const badge = overdue ? 'معوق' : (statusLabel[t.status]||t.status||'باز');
  const actions = [];
  if (!terminal && mine) {
    actions.push('<button class="btn" onclick="window.taskRespond(\''+esc(t.id)+'\',\'yes\')">تأیید</button>');
    actions.push('<button class="btn" onclick="window.taskReject(\''+esc(t.id)+'\')">رد</button>');
    actions.push('<button class="btn" onclick="window.taskComplete(\''+esc(t.id)+'\')">تکمیل</button>');
    actions.push('<button class="btn" onclick="window.taskMoveTomorrow(\''+esc(t.id)+'\')">فردا</button>');
    actions.push('<button class="btn" onclick="window.taskReminderForm(\''+esc(t.id)+'\')">یادآوری</button>');
  }
  if (canManage() && !terminal) {
    actions.push('<button class="btn" onclick="window.taskToggleStar(\''+esc(t.id)+'\','+(!t.starred)+')">'+(t.starred?'حذف ستاره':'ستاره')+'</button>');
  }
  return '<article class="integration-card task-card">'
    +'<div class="row"><span class="badge">'+esc(badge)+'</span><span class="badge">'+esc(priorityLabel[t.priority]||t.priority||'عادی')+'</span><small>'+esc(contextLabel[t.context_type]||t.context_type||'—')+'</small></div>'
    +'<h3>'+esc(t.title||'بدون عنوان')+'</h3>'
    +'<p>'+esc(t.description||'')+'</p>'
    +'<div class="task-meta"><span>تاریخ: '+esc(faDate(t.scheduled_date))+'</span><span>ساعت: '+esc(t.scheduled_time||'—')+'</span><span>یادآوری: '+esc(t.reminder_at?faDate(t.reminder_at):'ندارد')+'</span></div>'
    +(t.starred?'<div class="badge">★ ویژه</div>':'')
    +(actions.length?'<div class="modal-actions">'+actions.join('')+'</div>':'')
    +'</article>';
}

async function loadTasks(){
  const rows = await repository().list({ orderBy:{column:'scheduled_date'}, ascending:true, limit:500 });
  return Array.isArray(rows) ? rows : [];
}

async function refreshTaskCenter(){
  const root=document.getElementById('task-center-root'); if(!root) return;
  root.innerHTML='<div class="loading">در حال بارگذاری پیگیری‌ها…</div>';
  try{
    const rows=await loadTasks();
    const now=new Date().toISOString();
    const due=listDueTodayTasks(rows, now);
    const overdue=listOverdueTasks(rows, now);
    const starred=listStarredTasks(rows);
    const visible=canManage()?rows:rows.filter(t=>String(t.assigned_to||'')===String(actor()||''));
    const body=visible.map(taskCard).join('');
    root.innerHTML='<div class="stats mini">'
      +'<div class="stat"><span>امروز</span><strong>'+due.length+'</strong><small>کارهای سررسید</small></div>'
      +'<div class="stat"><span>معوق</span><strong>'+overdue.length+'</strong><small>نیازمند اقدام</small></div>'
      +'<div class="stat"><span>ستاره‌دار</span><strong>'+starred.length+'</strong><small>پیگیری ویژه</small></div>'
      +'</div>'
      +'<div class="task-toolbar">'+(canManage()?'<button class="btn primary" onclick="window.taskCreateForm()">+ پیگیری جدید</button>':'')
      +'<button class="btn" onclick="window.refreshTaskCenter()">به‌روزرسانی</button></div>'
      +'<div class="data-grid">'+(body||'<div class="empty"><strong>پیگیری فعالی وجود ندارد</strong><span>Task Engine آماده ثبت اولین پیگیری است.</span></div>')+'</div>';
  }catch(e){ root.innerHTML='<div class="errorbox"><strong>بارگذاری پیگیری‌ها انجام نشد.</strong><span>'+esc(e.message||e)+'</span></div>'; }
}

async function taskCenter(){
  main.innerHTML = page('پیگیری‌ها','Task Engine واحد برای CRM، ساخت و خرید',canManage()?btn('+ پیگیری جدید','window.taskCreateForm()',true):'')
    +'<section class="panel" id="task-center-root"></section>';
  await refreshTaskCenter();
}

async function loadAssignees(){
  const r=await window.db.from('app_roles').select('user_id,full_name,role').eq('active',true).order('full_name');
  if(r.error) throw r.error;
  return r.data||[];
}

async function taskCreateForm(){
  if(!canManage()) return toast('دسترسی ایجاد پیگیری ندارید','error');
  const users=await loadAssignees();
  const options=users.map(u=>'<option value="'+esc(u.user_id)+'">'+esc(u.full_name||u.user_id)+' · '+esc(u.role||'')+'</option>').join('');
  modal('<h2>پیگیری جدید</h2><div class="form-grid">'
    +field('te_title','عنوان')+field('te_related','شناسه پرونده / موجودیت')
    +'<label>زمینه<select id="te_context"><option value="crm">CRM / مشتری</option><option value="construction">ساخت / کارگاه</option><option value="procurement">خرید / تأمین</option></select></label>'
    +'<label>نوع موجودیت<select id="te_subject"><option value="deal">معامله</option><option value="construction">ساخت</option><option value="purchase">خرید</option></select></label>'
    +'<label>مسئول<select id="te_assigned">'+options+'</select></label>'
    +field('te_date','تاریخ',''+today(),'date')+field('te_time','ساعت','','time')+field('te_deadline','مهلت','','datetime-local')
    +'<label>اولویت<select id="te_priority"><option value="normal">عادی</option><option value="important">مهم</option><option value="critical">بحرانی</option><option value="low">کم</option></select></label>'
    +'<label>یادآوری<input id="te_reminder" type="datetime-local"></label>'
    +'</div><label>شرح<textarea id="te_description" rows="4"></textarea></label>'
    +'<label class="check-row"><input id="te_notify" type="checkbox"> فعال‌سازی یادآوری</label>'
    +'<div class="modal-actions"><button class="btn" onclick="closeModal()">انصراف</button><button class="btn primary" onclick="window.taskCreate()">ثبت پیگیری</button></div>');
}

async function taskCreate(){
  try{
    const id=String(Date.now());
    const input={id,title:te_title.value.trim(),description:te_description.value.trim(),context_type:te_context.value,subject_type:te_subject.value,related_entity_id:te_related.value.trim(),created_by:actor(),assigned_to:te_assigned.value,scheduled_date:te_date.value,scheduled_time:te_time.value||null,deadline:te_deadline.value?new Date(te_deadline.value).toISOString():null,priority:te_priority.value,notification_enabled:te_notify.checked,reminder_at:te_reminder.value?new Date(te_reminder.value).toISOString():null};
    if(!input.title||!input.related_entity_id||!input.created_by||!input.assigned_to)return toast('عنوان، موجودیت و مسئول الزامی است','error');
    const built=createTask(input,{actor:actor()});
    const saved=await repository().create(built);
    if (built.assigned_to) {
      await window.db.from('workflow_notifications').insert({
        recipient_id: built.assigned_to,
        channel: 'in_app',
        subject: 'BuildWise · پیگیری جدید',
        body: '[task:' + built.id + ':assigned] پیگیری جدید «' + built.title + '» به شما اختصاص یافت.',
        status: 'queued'
      });
    }
    close(); await refreshTaskCenter(); toast('پیگیری ثبت شد','success'); return saved;
  }catch(e){toast(e.message||'ثبت پیگیری انجام نشد','error');}
}

async function mutate(id, operation, success){
  try{
    const saved=await operation(id);
    if(!saved)return toast('پیگیری پیدا نشد','error');
    await refreshTaskCenter(); toast(success,'success');
  }catch(e){toast(e.message||'عملیات انجام نشد','error');}
}
window.taskRespond=(id,response)=>mutate(id,(taskId)=>repository().respond(taskId,response,{actor:actor()}),response==='yes'?'پیگیری تأیید شد':'پیگیری ثبت شد');
window.taskComplete=(id)=>mutate(id,(taskId)=>repository().complete(taskId,{actor:actor()}),'پیگیری تکمیل شد');
window.taskReject=(id)=>mutate(id,(taskId)=>repository().reject(taskId,'رد توسط مسئول',{actor:actor()}),'پیگیری رد شد');
window.taskMoveTomorrow=(id)=>mutate(id,(taskId)=>repository().moveToTomorrow(taskId,tomorrow(),{actor:actor()}),'پیگیری به فردا منتقل شد');
window.taskToggleStar=(id,value)=>mutate(id,(taskId)=>repository().setStarred(taskId,value,{actor:actor()}),value?'پیگیری ستاره‌دار شد':'ستاره حذف شد');
window.taskSetPriority=(id,value)=>mutate(id,(taskId)=>repository().setPriority(taskId,value,{actor:actor()}),'اولویت تغییر کرد');
window.taskNotify=(id,enabled,reminder_at)=>mutate(id,(taskId)=>repository().configureNotification(taskId,{enabled,reminder_at,actor:actor()}),'یادآوری تنظیم شد');
window.taskReminderForm=async function(id){
  const current=await repository().getById(id);
  if(!current)return toast('پیگیری پیدا نشد','error');
  const value=current.reminder_at?new Date(current.reminder_at).toISOString().slice(0,16):'';
  modal(`<h2>تنظیم یادآوری</h2><label>زمان یادآوری<input id="te_reminder_edit" type="datetime-local" value="${esc(value)}"></label><div class="modal-actions"><button class="btn" onclick="closeModal()">انصراف</button><button class="btn primary" onclick="window.taskSaveReminder('${esc(id)}')">ذخیره</button></div>`);
};
window.taskSaveReminder=async function(id){
  const value=document.getElementById('te_reminder_edit')?.value;
  if(!value)return toast('زمان یادآوری الزامی است','error');
  close();
  await window.taskNotify(id,true,new Date(value).toISOString());
};
window.taskCreateForm=taskCreateForm;
window.taskCreate=taskCreate;
window.refreshTaskCenter=refreshTaskCenter;
window.taskCenter=taskCenter;

const css=document.createElement('style');
css.textContent='.task-toolbar{display:flex;gap:8px;justify-content:flex-start;margin:14px 0}.task-card .task-meta{display:flex;gap:12px;flex-wrap:wrap;color:#69737d;font-size:12px;margin:10px 0}.task-card .modal-actions{display:flex;gap:7px;flex-wrap:wrap}.check-row{display:flex;align-items:center;gap:8px}.check-row input{width:auto}.task-center-root{}';
document.head.appendChild(css);
