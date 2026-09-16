/* BuildWise AI+H — product identity + plan/limit layer */
(function(){
  const BRAND='BuildWise AI+H';
  const FEATURES={property:'max_properties',lead:'max_leads',project:'max_projects',ai:'max_ai_requests',image:'max_image_generations',video:'max_video_generations'};
  let status=null;
  const money=n=>n===-1?'∞':Number(n||0).toLocaleString('fa-IR');
  async function load(){if(!window.db||!window.me)return null;const r=await window.db.rpc('buildwise_plan_status');if(!r.error)status=r.data;return status;}
  async function check(feature,amount=1){if(!window.db||!window.me)return {allowed:true};const r=await window.db.rpc('buildwise_check_limit',{p_feature_key:feature,p_amount:amount});if(r.error)return {allowed:false,reason:r.error.message};return r.data||{allowed:false,reason:'LIMIT_CHECK_FAILED'};}
  async function consume(feature,amount=1){if(!window.db||!window.me)return {allowed:true};const r=await window.db.rpc('buildwise_consume',{p_feature_key:feature,p_amount:amount});if(r.error)return {allowed:false,reason:r.error.message};return r.data||{allowed:false,reason:'LIMIT_CONSUME_FAILED'};}
  function toastLimit(){const msg='سقف استفاده این قابلیت در پلن شما تکمیل شده است';if(typeof window.toast==='function')window.toast(msg);else alert(msg);}
  function inject(){if(!document.getElementById('bw-brand')){const top=document.querySelector('.top');if(top){const b=document.createElement('div');b.id='bw-brand';b.style='position:absolute;right:50%;transform:translateX(50%);font-weight:800;letter-spacing:.2px';b.textContent=BRAND;top.style.position='relative';top.appendChild(b);}}if(!document.getElementById('bw-style')){const s=document.createElement('style');s.id='bw-style';s.textContent='#bw-plan{position:fixed;bottom:14px;right:14px;background:#fff;border:1px solid #dedbd3;border-radius:10px;padding:8px 11px;font-size:12px;z-index:7;box-shadow:0 3px 14px #0001}.bw-pro{font-weight:800}';document.head.appendChild(s);}}
  async function panel(){await load();const old=document.getElementById('bw-plan');if(old)old.remove();if(!status)return;const d=document.createElement('div');d.id='bw-plan';const plan=status.plan||'FREE',l=status.limits||{};d.innerHTML='<span class="bw-pro">BuildWise AI+H</span> · '+plan+' · ملک '+money(l.max_properties)+' · AI ماهانه '+money(l.max_ai_requests);document.body.appendChild(d);}
  const wrap=(name,feature)=>{if(typeof window[name]!=='function'||window[name].__bwWrapped)return;const original=window[name];const wrapped=async function(){const c=await check(feature,1);if(!c.allowed){toastLimit();return;}const u=await consume(feature,1);if(!u.allowed){toastLimit();return;}return original.apply(this,arguments);};wrapped.__bwWrapped=true;window[name]=wrapped;};
  function boot(){inject();panel();wrap('ps',FEATURES.property);wrap('ls',FEATURES.lead);wrap('saveB',FEATURES.project);}
  window.BuildWiseAI={BRAND,FEATURES,load,check,consume,panel};
  const observer=new MutationObserver(()=>{inject();if(window.me)panel();});observer.observe(document.documentElement,{childList:true,subtree:true});setTimeout(boot,700);
})();
