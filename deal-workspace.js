/* BuildWise — persistent deal workspace + Hooman AI */
(function(){
  const U='https://beuestoewletjsgmigmf.supabase.co';
  const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  async function tok(){const s=(await window.db.auth.getSession()).data.session;return s?.access_token||null}
  async function api(payload){const t=await tok();if(!t)throw new Error('ابتدا وارد BuildWise شوید.');const r=await fetch(U+'/functions/v1/ai-orchestrator',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+t},body:JSON.stringify(payload)});const j=await r.json().catch(()=>({}));if(!r.ok)throw new Error(j.error||'خطا در Hooman AI');return j}
  window.openDealWorkspace=async function(entityType,entityId,title){
    let w=await window.db.from('deal_workspaces').select('*').eq('entity_type',entityType).eq('entity_id',String(entityId)).maybeSingle();
    if(!w.data){w=await window.db.from('deal_workspaces').insert({entity_type:entityType,entity_id:String(entityId),title:title||'پرونده معامله'}).select('*').single();}
    if(w.error)return toast(w.error.message,'error');const ws=w.data;
    const m=await window.db.from('deal_workspace_messages').select('*').eq('workspace_id',ws.id).order('created_at',{ascending:true}).limit(100);
    const msgs=(m.data||[]).map(x=>'<div class="hw-msg '+(x.sender_role==='hoomaan_ai'?'ai':'')+'"><small>'+esc(x.sender_role==='hoomaan_ai'?'Hooman AI':'عضو پرونده')+' · '+new Date(x.created_at).toLocaleString('fa-IR')+'</small><div>'+esc(x.message).replace(/\n/g,'<br>')+'</div></div>').join('');
    modal('<div class="hw-head"><div><h2>'+esc(ws.title)+'</h2><small>فضای ماندگار پرونده · '+esc(entityType)+' #'+esc(entityId)+'</small></div></div><div id="hw-board" class="hw-board"><aside><b>وضعیت پرونده</b><div class="badge">'+esc(ws.status)+'</div><p class="muted">همه پیام‌ها و تصمیم‌ها در همین پرونده ذخیره می‌شوند.</p></aside><section><div id="hw-messages">'+(msgs||'<div class="muted">اولین پیام را ثبت کنید.</div>')+'</div><div class="hw-compose"><textarea id="hw_input" rows="3" placeholder="در مورد این معامله چه می‌خواهید؟"></textarea><button class="btn primary" onclick="sendWorkspaceMessage('+ws.id+')">ارسال به Hooman AI</button></div></section></div>');
  };
  window.sendWorkspaceMessage=async function(id){
    const el=document.getElementById('hw_input');const message=el?.value.trim();if(!message)return;
    el.disabled=true;
    try{const j=await api({action:'workspace_chat',workspace_id:id,message});el.value='';const box=document.getElementById('hw-messages');if(box){box.insertAdjacentHTML('beforeend','<div class="hw-msg"><small>شما</small><div>'+esc(message)+'</div></div>');box.insertAdjacentHTML('beforeend','<div class="hw-msg ai"><small>Hooman AI</small><div>'+esc(j.text||'پیام ثبت شد.')+'</div></div>');box.scrollTop=box.scrollHeight}}catch(e){toast(e.message,'error')}finally{el.disabled=false}
  };
  const css=document.createElement('style');css.textContent='.hw-board{display:grid;grid-template-columns:180px 1fr;gap:12px;min-height:420px}.hw-board aside{border:1px solid #ddd;border-radius:12px;padding:12px}.hw-board section{display:flex;flex-direction:column;min-width:0}.hw-head{margin-bottom:10px}.hw-msg{padding:10px 12px;border:1px solid #ddd;border-radius:12px;margin:8px 0;background:#fff}.hw-msg.ai{background:#f3f6f8}.hw-msg small{display:block;opacity:.65;margin-bottom:5px}.hw-compose{display:flex;gap:8px;align-items:end;margin-top:auto}.hw-compose textarea{flex:1}.hw-compose .btn{white-space:nowrap}@media(max-width:700px){.hw-board{grid-template-columns:1fr}.hw-board aside{display:none}.hw-compose{flex-direction:column}.hw-compose .btn{width:100%}}';document.head.appendChild(css);
})();