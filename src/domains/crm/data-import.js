import { validateImportRows, buildImportPreview, applyColumnEdits, buildDataQualityDashboard, expandContactPairRows } from './import-quality.js';
/* BuildWise AI — Canonical Data Importer (merged v1 + v2) */
(function(){
  const BN=window.BuildWiseNormalize||{};
  const U='https://beuestoewletjsgmigmf.supabase.co';
  const K='sb_publishable_dE92Qm9EtMv4sdNRXF7SRg_7ox1xYax';
  const dbi=supabase.createClient(U,K);
  const CHUNK=250; let rows=[],source='excel',target='properties',sourceFile='',importBatchId=null;
  const normalizePhone=BN.normalizePhone||((x)=>String(x??''));
  const E=x=>String(x==null?'':x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const N=x=>BN.normalizeKey?BN.normalizeKey(x):String(x==null?'':x).trim().toLowerCase().replace(/[يى]/g,'ی').replace(/ك/g,'ک').replace(/[\s\-\/]+/g,'_').replace(/[()]/g,'');
  const num=x=>BN.normalizeNumber?BN.normalizeNumber(x):(()=>{if(x===''||x==null)return null;const n=Number(String(x).replace(/[,٬]/g,''));return Number.isFinite(n)?n:null})();
  const pick=(o,a)=>{for(const k of a){const v=o[N(k)];if(v!==undefined&&v!==null&&String(v).trim()!=='')return v}return ''};
  let xp;
  async function loadX(){if(window.XLSX)return; if(xp)return xp; xp=new Promise((ok,no)=>{const urls=['https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js','https://unpkg.com/xlsx@0.18.5/dist/xlsx.full.min.js'];let i=0;const next=()=>{if(window.XLSX)return ok();if(i>=urls.length){xp=null;return no(Error('کتابخانه Excel بارگذاری نشد.'))}const s=document.createElement('script');s.src=urls[i++];s.onload=()=>window.XLSX?ok():next();s.onerror=next;document.head.appendChild(s)};next()});return xp}
  function mapProperty(o){return {
    property_code:String(pick(o,['property_code','code','کد','کد_ملک'])||('IMP-'+Date.now()+'-'+Math.random().toString(36).slice(2,8))),
    source:source,
    rate:String(pick(o,['rate','نرخ','رتبه'])||'')||null,
    property_name:pick(o,['property_name','name','title','عنوان','نام','اسم'])||pick(o,['street','خیابان']),
    property_type:pick(o,['property_type','type','نوع_ملک','نوع']),
    request_type:pick(o,['request_type','نوع_درخواست','درخواست']),
    ownership_type:pick(o,['ownership_type','مالکیت']),
    owner_name:pick(o,['owner_name','owner','مالک']),
    region:num(pick(o,['region','zone','منطقه'])),
    neighborhood:pick(o,['neighborhood','area_name','محله']),
    street:pick(o,['street','خیابان']),
    alley:pick(o,['alley','کوچه']),
    side_street:pick(o,['side_street','فرعی']),
    floor:num(pick(o,['floor','طبقه'])),
    total_floors:num(pick(o,['total_floors','total_floors','کل_طبقات'])),
    building_age:num(pick(o,['building_age','age','سن_بنا'])),
    land_area:num(pick(o,['land_area','land','زمین','مساحت_زمین'])),
    built_area:num(pick(o,['built_area','area','metrage','متراژ','زیربنا'])),
    bedrooms:num(pick(o,['bedrooms','rooms','خواب'])),
    total_price:num(pick(o,['total_price','price','قیمت','قیمت_کل'])),
    price_per_meter:num(pick(o,['price_per_meter','ppm','قیمت_متری','قيمت_متري'])),
    entry_price:num(pick(o,['entry_price','entry','ورودی'])),
    full_deposit:num(pick(o,['full_deposit','رهن_کامل'])),
    deposit_amount:num(pick(o,['deposit_amount','deposit','رهن'])),
    rent_amount:num(pick(o,['rent_amount','rent','اجاره'])),
    emergency_phone:normalizePhone(pick(o,['emergency_phone','تلفن_ضروري','تلفن ضروری'])),
    mobile:normalizePhone(pick(o,['mobile','phone','موبایل','موبايل','تلفن'])),
    status:pick(o,['status','وضعیت'])||'active',
    activity_status:pick(o,['activity_status','وضعیت']),
    listing_type:pick(o,['listing_type','نوع_ورودی','نوع ورودی']),
    year_registered:String(pick(o,['year_registered','سال','سال_ثبت'])||'')||null,
    description:pick(o,['description','توضیحات'])
  }};
  function mapLead(o){return {full_name:pick(o,['full_name','name','نام','نام_خانوادگی']),mobile:pick(o,['mobile','phone','موبایل','تلفن']),desired_property_type:pick(o,['desired_property_type','property_type','نوع_ملک']),desired_region:num(pick(o,['desired_region','region','منطقه'])),budget_min:num(pick(o,['budget_min','حداقل_بودجه'])),budget_max:num(pick(o,['budget_max','budget','حداکثر_بودجه','بودجه'])),status:pick(o,['status','وضعیت'])||'active',source:source,notes:pick(o,['notes','یادداشت','توضیحات'])}};
  function mapMarket(o){var area=num(pick(o,['area','metrage','متراژ'])),total=num(pick(o,['total_price','price','قیمت'])),ppm=num(pick(o,['price_per_meter','ppm','قیمت_متری']));if(ppm==null&&area>0&&total!=null)ppm=total/area;return {source_type:source==='excel'?'excel':'google_sheets',external_id:String(pick(o,['external_id','record_id','id','شناسه','کد'])||''),observed_at:pick(o,['observed_at','date','تاریخ'])||new Date().toISOString(),region:num(pick(o,['region','منطقه'])),neighborhood:pick(o,['neighborhood','محله']),property_type:pick(o,['property_type','نوع_ملک','نوع']),area:area,bedrooms:num(pick(o,['bedrooms','خواب'])),age_years:num(pick(o,['age_years','age','سن_بنا'])),floor_number:num(pick(o,['floor_number','floor','طبقه'])),total_price:total,price_per_meter:ppm,listing_status:pick(o,['listing_status','status','وضعیت'])||'active',raw_payload:o}};
function hasMeaningfulImportData(o){return Object.entries(o||{}).some(([k,v])=>!String(k).startsWith('_')&&v!==null&&v!==undefined&&String(v).trim()!=='')}
function mapAny(o,targetOverride){if(!hasMeaningfulImportData(o))return null;const effectiveTarget=targetOverride||o._target||target;const mapped=effectiveTarget==='properties'?mapProperty(o):effectiveTarget==='leads'?mapLead(o):mapMarket(o);if(importBatchId)mapped.import_batch_id=String(importBatchId);return mapped}
function mapRows(){return rows.filter(hasMeaningfulImportData).map(mapAny).filter(Boolean)}
  function quality(){return validateImportRows(rows)}
  function renderQuality(){const p=document.getElementById('bw-di-preview');if(!p)return;const q=quality();const d=buildDataQualityDashboard(rows);const preview=buildImportPreview(rows);p.innerHTML='<div class="card"><b>پیش‌نمایش و کنترل کیفیت</b><div>ردیف: '+preview.rowCount+' · ستون: '+preview.columnCount+' · معتبر: '+q.valid.length+' · خطادار: '+q.invalid.length+' · گروه تکراری: '+d.duplicateGroups+'</div><small>درصد خطا: '+(d.errorRate*100).toFixed(1)+'٪</small></div><div class="modal-actions"><button class="btn" onclick="window.__bwImportEdit()">ویرایش همه ستون‌ها</button></div><div style="overflow:auto"><table><thead><tr>'+preview.columns.map(E).map(h=>'<th>'+h+'</th>').join('')+'</tr></thead><tbody>'+preview.sample.slice(0,20).map(r=>'<tr>'+preview.columns.map(k=>'<td>'+E(r[k])+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>'} 
  window.__bwImportEdit=function(){const p=document.getElementById('bw-di-preview');const cols=buildImportPreview(rows).columns;const sample=rows.slice(0,20);p.innerHTML='<div class="card"><b>ویرایش ستون‌ها</b><p>هر سلول واردشده قابل ویرایش است. تغییرات فقط روی داده فعلی اعمال می‌شود و نسخه خام حفظ می‌شود.</p><div style="overflow:auto"><table><thead><tr>'+cols.map(E).map(h=>'<th>'+h+'</th>').join('')+'</tr></thead><tbody>'+sample.map((r,i)=>'<tr>'+cols.map(k=>'<td><input data-i="'+i+'" data-k="'+E(k)+'" value="'+E(r[k])+'"></td>').join('')+'</tr>').join('')+'</tbody></table></div><div class="modal-actions"><button class="btn" onclick="window.__bwImportQuality()">انصراف</button><button class="btn primary" onclick="window.__bwImportSaveEdits()">اعمال تغییرات</button></div></div>'};
  window.__bwImportSaveEdits=function(){const edits=[...document.querySelectorAll('#bw-di-preview input[data-i][data-k]')].map(x=>({rowIndex:Number(x.dataset.i),column:x.dataset.k,value:x.value}));rows=applyColumnEdits(rows,edits);window.__bwImportQuality()};
  window.__bwImportQuality=renderQuality;
  function sid(u){var m=String(u).match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);return m?m[1]:''}
function gid(u){var m=String(u).match(/[?&#]gid=(\d+)/);return m?m[1]:'0'}
function csv(t){var ls=t.split(/\r?\n/).filter(Boolean);if(!ls.length)return[];function p(s){var a=[],c='',q=false;for(var i=0;i<s.length;i++){var ch=s[i];if(ch==='"'){q=!q;continue}if(ch===','&&!q){a.push(c);c=''}else c+=ch}a.push(c);return a}var h=p(ls[0]),out=[];for(var j=1;j<ls.length;j++){var a=p(ls[j]),o={};h.forEach(function(k,i){o[k]=a[i]||''});out.push(o)}return out}
async function readRemote(){const p=document.getElementById('bw-di-preview');try{let u;if(source==='sheet'){var id=sid(document.getElementById('bw-di-url').value);if(!id)throw Error('لینک Google Sheet معتبر نیست');u='https://docs.google.com/spreadsheets/d/'+id+'/export?format=csv&gid='+gid(document.getElementById('bw-di-url').value)}else{u=document.getElementById('bw-di-bridge').value.replace(/\/$/,'')+'?action=sheet&sheet_id='+encodeURIComponent(document.getElementById('bw-di-id').value)+(document.getElementById('bw-di-gid').value?'&gid='+encodeURIComponent(document.getElementById('bw-di-gid').value):'')+'&token='+encodeURIComponent(document.getElementById('bw-di-token').value)}var r=await fetch(u);if(!r.ok)throw Error('Google پاسخ نداد');var t=await r.text();try{var j=JSON.parse(t);if(j.error)throw Error(j.error);rows=j.rows||[]}catch(_){rows=csv(t)}sourceFile=source==='sheet'?'google-sheet':'google-drive-bridge';rows=rows.map(function(x,i){return Object.assign({},x,{_sheet_name:'remote',_sheet_index:0,_row_number:i+2,_raw_data:x})}).filter(hasMeaningfulImportData);if(!rows.length)throw Error('داده‌ای پیدا نشد');p.innerHTML='<b>'+rows.length.toLocaleString('fa-IR')+' ردیف آماده است.</b><br>آرشیو خام رکوردها نیز ذخیره خواهد شد.';renderQuality();document.getElementById('bw-di-run').disabled=false}catch(e){p.innerHTML='<div class="errorbox">'+E(e.message||e)+'</div>'}}
  async function readFile(){
    const f=document.getElementById('bw-di-file')?.files?.[0];if(!f)return;
    sourceFile=f.name;const p=document.getElementById('bw-di-preview');p.innerHTML='در حال خواندن تمام شیت‌ها و ستون‌ها…';
    try{
      await loadX();const wb=XLSX.read(await f.arrayBuffer(),{type:'array',cellDates:true});rows=[];
      wb.SheetNames.forEach((sheetName,sheetIndex)=>{
        const ws=wb.Sheets[sheetName];
        if(sheetName==='Sheet3'){
          const matrix=XLSX.utils.sheet_to_json(ws,{header:1,defval:'',raw:false});
          rows.push(...expandContactPairRows(matrix,sheetName,sheetIndex));
          return;
        }
        const data=XLSX.utils.sheet_to_json(ws,{defval:'',raw:false});
        data.forEach((raw,rowIndex)=>{
          if(!hasMeaningfulImportData(raw))return;
          rows.push(Object.assign({},raw,{_target:'properties',_sheet_name:sheetName,_sheet_index:sheetIndex,_row_number:rowIndex+2,_raw_data:raw}));
        });
      });
      if(!rows.length)throw Error('هیچ ردیفی در هیچ شیتی پیدا نشد');
      const sheets=[...new Set(rows.map(x=>x._sheet_name))],leadCount=rows.filter(x=>x._target==='leads').length,propertyCount=rows.length-leadCount;
      p.innerHTML='<b>'+rows.length.toLocaleString('fa-IR')+' رکورد قابل ورود از '+sheets.length+' شیت آماده است.</b><br>املاک/درخواست‌ها: '+propertyCount.toLocaleString('fa-IR')+' · مخاطبان: '+leadCount.toLocaleString('fa-IR')+'<br>شیت مخاطبان بدون عنوان ستون هم خوانده می‌شود؛ هر دو ستون مخاطب حفظ می‌شوند. داده خام و شماره ردیف منبع نیز آرشیو می‌شود.';
      renderQuality();document.getElementById('bw-di-run').disabled=false;
    }catch(e){p.innerHTML='<div class="errorbox">'+E(e.message||e)+'</div>'}
  }
  function sourceBox(){source=document.getElementById('bw-di-source').value;var b=document.getElementById('bw-di-sourcebox');if(source==='excel'){b.innerHTML='<label>فایل Excel / CSV<input id="bw-di-file" type="file" accept=".xlsx,.xls,.csv"></label>';document.getElementById('bw-di-file').onchange=readFile}else if(source==='sheet'){b.innerHTML='<label>لینک Google Sheet<input id="bw-di-url" placeholder="https://docs.google.com/spreadsheets/d/..."></label><button id="bw-di-read" class="btn">خواندن</button>';document.getElementById('bw-di-read').onclick=readRemote}else{b.innerHTML='<label>Web App URL پل Google Drive<input id="bw-di-bridge" placeholder="https://script.google.com/macros/s/.../exec"></label><label>Bridge Token<input id="bw-di-token" type="password"></label><label>Spreadsheet ID<input id="bw-di-id"></label><label>GID اختیاری<input id="bw-di-gid" placeholder="0"></label><button id="bw-di-read" class="btn">خواندن Drive</button>';document.getElementById('bw-di-read').onclick=readRemote}}
  function open(){window.modal('<h2>ورود داده BuildWise AI</h2><p>Excel/CSV، Google Sheets و Google Drive Bridge. داده‌ها در بسته‌های ۲۵۰تایی وارد می‌شوند و بسته خراب به رکوردهای کوچک‌تر تقسیم می‌شود.</p><label>مقصد<select id="bw-di-target"><option value="properties">املاک</option><option value="leads">خواهان‌ها</option><option value="market">داده بازار</option></select></label><label>منبع<select id="bw-di-source"><option value="excel">Excel / CSV</option><option value="sheet">Google Sheets عمومی</option><option value="bridge">Google Drive Bridge</option></select></label><div id="bw-di-sourcebox"></div><div id="bw-di-preview"></div><div id="bw-di-result"></div><div class="modal-actions"><button class="btn" onclick="closeModal()">انصراف</button><button id="bw-di-run" class="btn primary" disabled>شروع ورود</button></div>');document.getElementById('bw-di-target').onchange=e=>target=e.target.value;document.getElementById('bw-di-source').onchange=sourceBox;sourceBox();document.getElementById('bw-di-run').onclick=run}

  async function sendBatch(batch,batchTarget){const s=(await dbi.auth.getSession()).data.session;if(!s)throw Error('ابتدا وارد BuildWise AI شوید');const effectiveTarget=batchTarget||batch[0]?._target||target;const payload=batch.map(x=>mapAny(x,effectiveTarget));const r=await fetch(U+'/functions/v1/crm-data-agent',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+s.access_token},body:JSON.stringify({action:'import',target:effectiveTarget,rows:payload})});const j=await r.json().catch(()=>({}));if(!r.ok||!j.ok)throw Error(j.error||('HTTP '+r.status));return Number(j.processed??payload.length)}
  async function resilient(batch,batchTarget){try{return {ok:await sendBatch(batch,batchTarget),fail:[]}}catch(e){if(batch.length===1)return {ok:0,fail:[{row:batch[0],error:e.message}]};const m=Math.ceil(batch.length/2),a=await resilient(batch.slice(0,m),batchTarget),b=await resilient(batch.slice(m),batchTarget);return {ok:a.ok+b.ok,fail:a.fail.concat(b.fail)}}

  async function sendRaw(batch){const r=await dbi.from('import_raw_rows').insert(batch);if(r.error)throw r.error;return batch.length}
  async function resilientRaw(batch){try{return {ok:await sendRaw(batch),fail:[]}}catch(e){if(batch.length===1)return {ok:0,fail:[{row:batch[0],error:e.message}]};const m=Math.ceil(batch.length/2),a=await resilientRaw(batch.slice(0,m)),b=await resilientRaw(batch.slice(m));return {ok:a.ok+b.ok,fail:a.fail.concat(b.fail)}}}
  async function run(){
    const b=document.getElementById('bw-di-run'),res=document.getElementById('bw-di-result');const q=quality();
    b.disabled=true;let ok=0,failed=[],rawFailed=[];
    const session=(await dbi.auth.getSession()).data.session;if(!session){b.disabled=false;return toast('ابتدا وارد BuildWise AI شوید','error')}
    const created=await dbi.from('import_batches').insert({file_name:sourceFile||'Excel import',total_rows:rows.length,successful_rows:0,failed_rows:0,status:'processing'}).select('id').single();
    if(created.error){b.disabled=false;return toast(created.error.message,'error')}importBatchId=created.data.id;
    const groups=new Map();rows.forEach(row=>{const t=row._target||target;if(!groups.has(t))groups.set(t,[]);groups.get(t).push(row)});
    let processed=0;
    for(const [batchTarget,targetRows] of groups.entries()){
      for(let i=0;i<targetRows.length;i+=CHUNK){
        const batch=targetRows.slice(i,i+CHUNK),r=await resilient(batch,batchTarget);ok+=r.ok;failed=failed.concat(r.fail);
        const raw=batch.map(x=>({import_batch_id:importBatchId,entity_type:batchTarget,source_file:sourceFile,sheet_name:x._sheet_name,sheet_index:x._sheet_index,row_number:x._row_number,imported_by:session.user.id,raw_data:x._raw_data||x,normalized_data:mapAny(x,batchTarget)}));
        const rawResult=await resilientRaw(raw);rawFailed=rawFailed.concat(rawResult.fail);processed+=batch.length;
        res.innerHTML='<div>پیشرفت: '+processed.toLocaleString('fa-IR')+' / '+rows.length.toLocaleString('fa-IR')+'</div><div>رکوردهای استاندارد موفق: '+ok.toLocaleString('fa-IR')+' · ناموفق: '+failed.length.toLocaleString('fa-IR')+' · آرشیو خام ناموفق: '+rawFailed.length.toLocaleString('fa-IR')+'</div><div>ردیف دارای هشدار اعتبارسنجی حذف نمی‌شود؛ همه رکوردها برای ورود تلاش می‌شوند و نسخه خام نگهداری می‌شود.</div>';
      }
    }
    const allErrors=failed.concat(rawFailed);
    await dbi.from('import_batches').update({successful_rows:ok,failed_rows:allErrors.length,status:allErrors.length?'completed_with_errors':'completed',error_log:allErrors.slice(0,50).map(x=>x.error).join('\\n')||null}).eq('id',importBatchId);
    res.innerHTML='<div class="card"><b>نتیجه نهایی</b><p>کل رکوردها: '+rows.length.toLocaleString('fa-IR')+' · استاندارد موفق: '+ok.toLocaleString('fa-IR')+' · ناموفق: '+failed.length.toLocaleString('fa-IR')+' · آرشیو خام ناموفق: '+rawFailed.length.toLocaleString('fa-IR')+'</p><p>ردیف‌های دارای خطای اعتبارسنجی نیز از ورود حذف نشدند؛ آرشیو خام برای اصلاح باقی می‌ماند.</p>'+(allErrors.length?'<small>برای ردیف‌های ناموفق، گزارش Batch را بررسی کنید؛ هیچ رکوردی به‌صورت خودکار حذف یا ادغام نشده است.</small>':'<strong>همه رکوردهای استاندارد و آرشیو خام ثبت شدند.</strong>')+'<div class="modal-actions"><button class="btn" onclick="window.__bwRollbackImport()">Rollback این Batch</button></div></div>';
    window.__bwRollbackImport=async function(){if(!importBatchId)return;const check=await dbi.rpc('is_manager_user');if(check.error||check.data!==true)return toast('Rollback فقط برای مدیر مجاز است','error');if(!confirm('این Batch به‌صورت کامل از داده‌های واردشده حذف می‌شود. ادامه؟'))return;const r=await dbi.rpc('rollback_import_batch',{p_batch_id:String(importBatchId)});if(r.error)return toast(r.error.message,'error');res.innerHTML='<div class="card"><b>Rollback انجام شد.</b><p>Batch '+E(importBatchId)+' به‌صورت دقیق و محدود حذف شد.</p><pre>'+E(JSON.stringify(r.data||{}))+'</pre></div>';};
    if(window.go)await go('properties');b.disabled=false;
  }
  let archiveOffset=0;
  async function openArchive(){
    const gate=await dbi.rpc('is_manager_user');
    if(gate.error||gate.data!==true)return toast('مدیریت آرشیو خام فقط برای مدیر مجاز است','error');
    archiveOffset=0;
    window.modal('<h2>آرشیو و مدیریت داده‌های واردشده</h2><p>نسخه خام هر ردیف Excel با شیت و شماره ردیف نگهداری می‌شود. ویرایش و حذف فقط برای مدیر فعال است.</p><div id="bw-di-archive-list">در حال دریافت داده‌ها…</div><div class="modal-actions"><button class="btn" onclick="closeModal()">بستن</button></div>');
    await loadArchive();
  }
  async function loadArchive(){
    const p=document.getElementById('bw-di-archive-list');if(!p)return;
    p.innerHTML='در حال دریافت داده‌ها…';
    const r=await dbi.from('import_raw_rows').select('id,import_batch_id,entity_type,source_file,sheet_name,sheet_index,row_number,raw_data,normalized_data,created_at').order('id',{ascending:false}).range(archiveOffset,archiveOffset+49);
    if(r.error){p.innerHTML='<div class="errorbox">'+E(r.error.message)+'</div>';return}
    const items=r.data||[];
    if(!items.length){p.innerHTML='<div class="card">در این صفحه رکوردی نیست.</div>';return}
    p.innerHTML='<div class="card"><b>نمایش '+(archiveOffset+1)+' تا '+(archiveOffset+items.length)+' </b><input id="bw-di-archive-search" placeholder="جستجو در همین صفحه"></div><div id="bw-di-archive-items">'+items.map(x=>'<div class="card" data-archive-card="'+x.id+'"><b>#'+x.id+' · '+E(x.entity_type||'')+'</b><p>'+E(x.source_file||'')+' · '+E(x.sheet_name||'')+' · ردیف '+E(x.row_number||'')+' · Batch '+E(x.import_batch_id||'')+'</p><textarea data-archive-json="'+x.id+'" rows="7" style="width:100%;font-family:monospace">'+E(JSON.stringify(x.raw_data||{},null,2))+'</textarea><div class="modal-actions"><button class="btn primary" data-archive-save="'+x.id+'">ذخیره ویرایش</button><button class="btn" data-archive-delete="'+x.id+'">حذف رکورد</button></div></div>').join('')}</div><div class="modal-actions"><button class="btn" id="bw-di-archive-prev" '+(archiveOffset===0?'disabled':'')+'>قبلی</button><button class="btn" id="bw-di-archive-next" '+(items.length<50?'disabled':'')+'>بعدی</button></div>';
    const search=document.getElementById('bw-di-archive-search');
    search.oninput=()=>{const term=search.value.toLowerCase();document.querySelectorAll('#bw-di-archive-items [data-archive-card]').forEach(card=>{card.style.display=card.textContent.toLowerCase().includes(term)||card.querySelector('textarea')?.value.toLowerCase().includes(term)?'':'none'})};
    p.querySelectorAll('[data-archive-save]').forEach(btn=>btn.onclick=async()=>{
      const id=Number(btn.dataset.archiveSave),area=p.querySelector('[data-archive-json="'+id+'"]');let raw;
      try{raw=JSON.parse(area.value)}catch(_){return toast('JSON معتبر نیست؛ تغییرات ذخیره نشد','error')}
      const saved=await dbi.from('import_raw_rows').update({raw_data:raw,updated_at:new Date().toISOString()}).eq('id',id).select('id').maybeSingle();
      if(saved.error||!saved.data)return toast(saved.error?.message||'ذخیره انجام نشد؛ سطح دسترسی را بررسی کنید','error');
      toast('رکورد آرشیو ذخیره شد','success');
    });
    p.querySelectorAll('[data-archive-delete]').forEach(btn=>btn.onclick=async()=>{
      const id=Number(btn.dataset.archiveDelete);if(!confirm('رکورد خام #'+id+' از آرشیو حذف شود؟ رکورد استاندارد ملک/خواهان جداگانه حذف نمی‌شود.'))return;
      const deleted=await dbi.from('import_raw_rows').delete().eq('id',id).select('id').maybeSingle();
      if(deleted.error||!deleted.data)return toast(deleted.error?.message||'حذف انجام نشد؛ سیاست حذف مدیر باید روی دیتابیس فعال باشد','error');
      await loadArchive();toast('رکورد آرشیو حذف شد','success');
    });
    document.getElementById('bw-di-archive-prev').onclick=async()=>{archiveOffset=Math.max(0,archiveOffset-50);await loadArchive()};
    document.getElementById('bw-di-archive-next').onclick=async()=>{archiveOffset+=50;await loadArchive()};
  }
  function addNav(){for(const id of ['sideNav','mobileNav','bottomNav']){const n=document.getElementById(id);if(!n)continue;if(!n.querySelector('#bw-di-nav')){const b=document.createElement('button');b.id='bw-di-nav';b.className='nav-item';b.innerHTML='<i>⇧</i><span>ورود Excel</span>';b.onclick=open;n.appendChild(b)}if(!n.querySelector('#bw-di-archive-nav')){const a=document.createElement('button');a.id='bw-di-archive-nav';a.className='nav-item';a.innerHTML='<i>▤</i><span>آرشیو Excel</span>';a.onclick=openArchive;n.appendChild(a)}}}
  function start(){addNav();new MutationObserver(addNav).observe(document.body,{childList:true,subtree:true});if(new URLSearchParams(location.search).get('open')==='import')setTimeout(open,0)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();