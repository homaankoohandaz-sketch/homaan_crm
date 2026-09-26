/* BuildWise Construction Engine — exact participation model */
(function(){
  function v(id){var e=document.getElementById(id);return e?Number(e.value)||0:0}
  function p(x){return x/100}
  function fmtPct(x){return new Intl.NumberFormat('fa-IR',{maximumFractionDigits:2}).format(x)+'%'}
  function statSafe(t,val,meta){return stat(t,val,meta||'')}

  // Canonical calculation lives in src/domains/construction/calculations.js.
  // This file is UI/persistence adapter only.


  window.construction=function(){
    Promise.resolve(window.__buildwiseConstructionReady).then(function(){
    db.from('construction_projects').select('*').order('created_at',{ascending:false}).limit(50).then(function(r){
      main.innerHTML=page('ساخت و پروژه','موتور محاسبه دقیق مشارکت، ساخت، زمین، فروش و سود',canWrite()?btn('+ ذخیره پروژه','saveConstructionProject()',true):'')
      +card('اطلاعات پروژه','<div class="form-grid construction-grid">'
      +'<label>نام پروژه<input id="cx_title" value="پروژه جدید"></label>'
      +'<label>متراژ زمین (m²)<input id="cx_land" type="number" value="210" oninput="calcConstruction()"></label>'
      +'<label>عرض زمین (m)<input id="cx_width" type="number" value="11" oninput="calcConstruction()"></label>'
      +'<label>ضابطه ساخت / طبقات بالا<input id="cx_reg" type="number" value="3" oninput="calcConstruction()"></label>'
      +'<label>سطح اشغال (%)<input id="cx_coverage" type="number" value="70" oninput="calcConstruction()"></label>'
      +'<label>ساخت منفی / FAR (%)<input id="cx_lowerRatio" type="number" value="75" oninput="calcConstruction()"></label>'
      +'<label>طبقات پایین<input id="cx_lowerFloors" type="number" value="1" oninput="calcConstruction()"></label>'
      +'<label>بالکن (m²)<input id="cx_balcony" type="number" value="33" oninput="calcConstruction()"></label>'
      +'<label>فضای مسقف بام (m²)<input id="cx_roof" type="number" value="20" oninput="calcConstruction()"></label>'
      +'<label>درصد مفید (%)<input id="cx_eff" type="number" value="85" oninput="calcConstruction()"></label></div>')
      +card('خروجی متراژ و ضابطه','<div id="cx_area_output"></div>')
      +card('تراکم مازاد / ساخت اضافه','<div class="form-grid construction-grid">'
      +'<label>تعداد طبقه مازاد<input id="cx_extraCount" type="number" value="0" oninput="calcConstruction()"></label>'
      +'<label>متراژ هر طبقه مازاد<input id="cx_extraArea" type="number" value="0" oninput="calcConstruction()"></label>'
      +'<label>کنسول<input id="cx_console" type="number" value="0" oninput="calcConstruction()"></label>'
      +'<label>پارکینگ اضافه<input id="cx_parking" type="number" value="0" oninput="calcConstruction()"></label>'
      +'<label>انباری اضافه<input id="cx_storage" type="number" value="0" oninput="calcConstruction()"></label>'
      +'<label>تجاری قابل فروش<input id="cx_commercial" type="number" value="110.25" oninput="calcConstruction()"></label></div>')
      +card('هزینه‌ها و قیمت‌ها','<div class="form-grid construction-grid">'
      +'<label>هزینه ساخت هر متر<input id="cx_buildCost" type="number" value="40000000" oninput="calcConstruction()"></label>'
      +'<label>عوارض نوسازی<input id="cx_renovation" type="number" value="3000000000" oninput="calcConstruction()"></label>'
      +'<label>سهم خدمات<input id="cx_services" type="number" value="0" oninput="calcConstruction()"></label>'
      +'<label>کارگزار تراکم مازاد<input id="cx_extraBroker" type="number" value="0" oninput="calcConstruction()"></label>'
      +'<label>خدمات مهندسی / پروانه<input id="cx_engineering" type="number" value="0" oninput="calcConstruction()"></label>'
      +'<label>پرداختی به مالک<input id="cx_ownerPayment" type="number" value="0" oninput="calcConstruction()"></label>'
      +'<label>قیمت هر متر زمین<input id="cx_landPrice" type="number" value="185000000" oninput="calcConstruction()"></label>'
      +'<label>قیمت فروش هر متر مسکونی<input id="cx_salePrice" type="number" value="180000000" oninput="calcConstruction()"></label>'
      +'<label>قیمت فروش هر متر تجاری<input id="cx_commercialPrice" type="number" value="400000000" oninput="calcConstruction()"></label></div>')
      +card('نتیجه نهایی','<div id="cx_result"></div>')
      +card('ریز سهم مالک و سازنده','<div id="cx_split"></div>')
      +card('کنترل فرمول','<div class="note">سهم سازنده و مالک از کل بازگشت سرمایه بر اساس نسبت آورده ساخت و زمین محاسبه می‌شود. تجاری از مسکونی جداست و ارزش آن با قیمت تجاری وارد بازگشت کل می‌شود.</div><div id="cx_formula" class="formula"></div>')
      +card('پروژه‌های ذخیره‌شده','<div class="data-grid">'+(r.error?errbox(r.error):(r.data||[]).map(function(x){return '<article class="project-card"><div class="row"><span class="badge">'+esc(stateLabel(x.status))+'</span><small>'+date(x.created_at)+'</small></div><h3>'+esc(x.title||'پروژه')+'</h3><p>زمین '+money(x.land_area)+' متر · زیربنا '+money(x.gross_built_area)+' متر · قابل فروش '+money(x.net_sellable_area)+' متر</p><div class="project-values"><span>هزینه <b>'+money(x.estimated_cost)+'</b></span><span>بازگشت <b>'+money(x.expected_sale_price)+'</b></span></div></article>'}).join('')||empty('پروژه ذخیره‌شده‌ای وجود ندارد'))+'</div>');
      calcConstruction();
    });
    });
  };

  window.saveConstructionProject=function(){
    if(!canWrite())return toast('دسترسی ثبت ندارید','error');
    var x=window.__BUILDWISE_CONSTRUCTION_LAST;
    if(!x)return toast('ابتدا محاسبه را انجام دهید','error');
    var title=(document.getElementById('cx_title').value||'پروژه جدید').trim();
    if(!title)return toast('نام پروژه الزامی است','error');
    var payload={title:title,land_area:x.land,footprint_percent:x.coverage*100,floors:x.reg,gross_built_area:x.totalGross,net_sellable_area:x.residentialSellable,estimated_cost:x.totalCapital,expected_sale_price:x.totalReturn,expected_duration_months:null,status:'draft',assumptions:{model:'construction-v1-exact',inputs:x,outputs:x},created_by:me.id};
    db.from('construction_projects').insert(payload).then(function(r){
      if(r.error)return toast(r.error.message,'error');
      toast('پروژه و محاسبات ذخیره شد','success');
      construction();
    });
  };
})();