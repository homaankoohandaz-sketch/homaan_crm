/* Hooman AI — minimal field-level assistant */
(function(){
 const U='https://beuestoewletjsgmigmf.supabase.co';
 const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 async function token(){try{const s=(await window.db.auth.getSession()).data.session;return s?.access_token||null}catch{return null}}
 async function ask(payload){
   const t=await token(); if(!t) throw new Error('ابتدا وارد BuildWise شوید.');
   const r=await fetch(U+'/functions/v1/ai-orchestrator',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+t},body:JSON.stringify({action:'chat',...payload})});
   const j=await r.json().catch(()=>({})); if(!r.ok) throw new Error(j.error||j.message||'پاسخ AI دریافت نشد'); return j;
 }
 function fieldLabel(el){return el.closest('label')?.firstChild?.textContent?.trim()||el.name||el.id||'فیلد'}
 function addButtons(root=document){
   root.querySelectorAll('input:not([type=hidden]):not([data-hoomaan-ai]),select:not([data-hoomaan-ai]),textarea:not([data-hoomaan-ai])').forEach(el=>{
     el.dataset.hoomaanAi='1';
     const b=document.createElement('button');b.type='button';b.className='hoomaan-ai-field';b.textContent='Hooman AI';
     b.onclick=()=>fieldAI(el);el.parentNode.insertBefore(b,el);
   });
   root.querySelectorAll('form:not([data-hoomaan-ai-form])').forEach(form=>{
     form.dataset.hoomaanAiForm='1';
     const b=document.createElement('button');b.type='button';b.className='hoomaan-ai-all';b.textContent='Hooman AI · تکمیل هوشمند';
     b.onclick=()=>formAI(form);form.prepend(b);
   });
 }
 window.fieldAI=async function(el){
   const context=Array.from(el.form?.querySelectorAll('input,select,textarea')||[]).map(x=>({field:x.name||x.id,value:x.value})).filter(x=>x.field);
   const q=prompt('Hooman AI — برای این فیلد چه کاری انجام شود؟','این فیلد را بر اساس اطلاعات موجود تحلیل و مقدار مناسب پیشنهاد کن');
   if(!q)return;
   el.disabled=true;
   try{
     const j=await ask({message:q,context:{field:fieldLabel(el),current_value:el.value,form:context},mode:'field_fill'});
     const v=j.output??j.answer??j.message??j.result??'';
     el.value=typeof v==='string'?v:JSON.stringify(v);
     el.dispatchEvent(new Event('input',{bubbles:true}));
   }catch(e){alert(e.message)}finally{el.disabled=false}
 };
 window.formAI=async function(form){
   const fields=Array.from(form.querySelectorAll('input,select,textarea')).filter(x=>!x.disabled&&x.type!=='hidden').map(x=>({field:x.name||x.id,value:x.value}));
   const q=prompt('Hooman AI — فرم را چگونه تکمیل کنم؟','با توجه به اطلاعات واردشده، تمام فیلدهای لازم را تحلیل و تکمیل کن؛ چیزی را حدس نزن و موارد نامطمئن را خالی بگذار');
   if(!q)return;
   try{
     const j=await ask({message:q,context:{form:fields},mode:'form_fill'});
     const values=j.fields||j.output?.fields||j.result?.fields||{};
     fields.forEach(x=>{if(values[x.field]!==undefined){const el=form.querySelector('[name="'+CSS.escape(x.field)+'"],#'+CSS.escape(x.field));if(el){el.value=values[x.field]??'';el.dispatchEvent(new Event('input',{bubbles:true}))}}});
   }catch(e){alert(e.message)}
 };
 window.hoomanAI=async function(){const q=prompt('Hooman AI','چه کاری انجام شود؟');if(!q)return;try{const j=await ask({message:q,mode:'general'});alert(j.output??j.answer??j.message??JSON.stringify(j))}catch(e){alert(e.message)}};
 const css=document.createElement('style');css.textContent='.hoomaan-ai-field{display:inline-block!important;min-height:32px!important;padding:4px 8px!important;margin:3px 0!important;border:1px solid #222!important;border-radius:8px!important;background:#222!important;color:#fff!important;font-size:11px!important;cursor:pointer}.hoomaan-ai-all{min-height:36px!important;padding:7px 12px!important;margin:0 0 8px!important;border:1px solid #222!important;border-radius:10px!important;background:#222!important;color:#fff!important;cursor:pointer}.hoomaan-ai-float{position:fixed;left:16px;bottom:84px;z-index:9999;border:0;border-radius:999px;padding:12px 16px;background:#111;color:#fff;box-shadow:0 6px 24px #0003;font-weight:800}';document.head.appendChild(css);
 const b=document.createElement('button');b.className='hoomaan-ai-float';b.textContent='Hooman AI';b.onclick=()=>hoomanAI();document.body.appendChild(b);
 const obs=new MutationObserver(()=>addButtons(document));obs.observe(document.body,{childList:true,subtree:true});setTimeout(()=>addButtons(document),300);
})();