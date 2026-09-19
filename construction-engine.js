/* BuildWise Construction Engine — exact participation model */
(function(){
  function v(id){var e=document.getElementById(id);return e?Number(e.value)||0:0}
  function p(x){return x/100}
  function fmtPct(x){return new Intl.NumberFormat('fa-IR',{maximumFractionDigits:2}).format(x)+'%'}
  function statSafe(t,val,meta){return stat(t,val,meta||'')}

  window.calcConstruction=function(){
    var land=v('cx_land'), coverage=p(v('cx_coverage')), reg=v('cx_reg');
    var lowerRatio=p(v('cx_lowerRatio')), lowerFloors=Math.max(0,v('cx_lowerFloors'));
    var balcony=v('cx_balcony'), roof=v('cx_roof'), eff=p(v('cx_eff'));
    var ground=land*coverage;
    var upper=ground*reg;
    var lower=land*lowerRatio*lowerFloors;
    var baseGross=ground+upper+lower+balcony+roof;
    var extraGross=v('cx_extraCount')*v('cx_extraArea')+v('cx_console')+v('cx_parking')+v('cx_storage');
    var totalGross=baseGross+extraGross;
    var totalSellable=totalGross*eff;
    var commercial=Math.min(v('cx_commercial'),totalSellable);
    var residential=Math.max(0,totalSellable-commercial);

    var buildBase=totalGross*v('cx_buildCost');
    var construction=buildBase+v('cx_services')+v('cx_extraBroker')+v('cx_engineering')+v('cx_renovation')+v('cx_ownerPayment');
    var landCapital=land*v('cx_landPrice');
    var totalCapital=construction+landCapital;

    var residentialReturn=residential*v('cx_salePrice');
    var commercialReturn=commercial*v('cx_commercialPrice');
    var totalReturn=residentialReturn+commercialReturn;
    var constructionShare=totalCapital?construction/totalCapital:0;
    var landShare=totalCapital?landCapital/totalCapital:0;
    var builderReturn=totalReturn*constructionShare;
    var ownerReturn=totalReturn*landShare;
    var builderProfit=builderReturn-construction;
    var ownerProfit=ownerReturn-landCapital;
    var projectProfit=totalReturn-totalCapital;

    var out={
      land:land,width:v('cx_width'),reg:reg,coverage:coverage,lowerRatio:lowerRatio,lowerFloors:lowerFloors,
      ground:ground,upper:upper,lower:lower,balcony:balcony,roof:roof,eff:eff,
      baseGross:baseGross,extraGross:extraGross,totalGross:totalGross,totalSellable:totalSellable,
      commercial:commercial,residentialSellable:residential,buildBase:buildBase,constructionCapital:construction,
      landCapital:landCapital,totalCapital:totalCapital,residentialReturn:residentialReturn,commercialReturn:commercialReturn,
      totalReturn:totalReturn,constructionShare:constructionShare,landShare:landShare,builderReturn:builderReturn,
      ownerReturn:ownerReturn,builderProfit:builderProfit,ownerProfit:ownerProfit,projectProfit:projectProfit,
      projectROI:totalCapital?projectProfit/totalCapital*100:0,builderROI:construction?builderProfit/construction*100:0,
      ownerROI:landCapital?ownerProfit/landCapital*100:0,builderArea:residential*constructionShare,ownerArea:residential*landShare
    };
    window.__BUILDWISE_CONSTRUCTION_LAST=out;

    document.getElementById('cx_area_output').innerHTML='<div class="stats">'
      +statSafe('سطح اشغال',money(ground)+' m²',land+' × '+v('cx_coverage')+'%')
      +statSafe('طبقات بالا',money(upper)+' m²',money(ground)+' × '+reg)
      +statSafe('طبقات پایین',money(lower)+' m²',land+' × '+v('cx_lowerRatio')+'% × '+lowerFloors)
      +statSafe('کل زیربنا',money(totalGross)+' m²','پایه '+money(baseGross)+' + مازاد '+money(extraGross))
      +statSafe('قابل فروش کل',money(totalSellable)+' m²',money(totalGross)+' × '+v('cx_eff')+'%')
      +statSafe('قابل فروش مسکونی',money(residential)+' m²','قابل فروش کل − تجاری')+'</div>';

    document.getElementById('cx_result').innerHTML='<div class="stats">'
      +statSafe('آورده ساخت',money(construction),'ساخت + هزینه‌های ساخت')
      +statSafe('آورده زمین',money(landCapital),'زمین × قیمت زمین')
      +statSafe('کل سرمایه پروژه',money(totalCapital),'ساخت + زمین')
      +statSafe('بازگشت مسکونی',money(residentialReturn),money(residential)+' × '+money(v('cx_salePrice')))
      +statSafe('بازگشت تجاری',money(commercialReturn),money(commercial)+' × '+money(v('cx_commercialPrice')))
      +statSafe('کل بازگشت سرمایه',money(totalReturn),'مسکونی + تجاری')
      +statSafe('سود پروژه',money(projectProfit),'بازگشت − کل سرمایه')
      +statSafe('ROI پروژه',fmtPct(out.projectROI),'سود ÷ کل سرمایه')+'</div>';

    document.getElementById('cx_split').innerHTML='<div class="data-grid">'
      +'<article class="project-card"><h3>سازنده</h3><div class="project-values"><span>سهم سرمایه <b>'+fmtPct(constructionShare*100)+'</b></span><span>متراژ قابل فروش <b>'+money(out.builderArea)+' m²</b></span></div><p>بازگشت: '+money(builderReturn)+'<br>سود خالص: <b>'+money(builderProfit)+'</b><br>ROI: <b>'+fmtPct(out.builderROI)+'</b></p></article>'
      +'<article class="project-card"><h3>مالک</h3><div class="project-values"><span>سهم سرمایه <b>'+fmtPct(landShare*100)+'</b></span><span>متراژ قابل فروش <b>'+money(out.ownerArea)+' m²</b></span></div><p>بازگشت: '+money(ownerReturn)+'<br>سود خالص: <b>'+money(ownerProfit)+'</b><br>ROI: <b>'+fmtPct(out.ownerROI)+'</b></p></article>'
      +'</div>';

    document.getElementById('cx_formula').textContent=
      'Gross = '+land+'×'+v('cx_coverage')+'% + ('+land+'×'+v('cx_coverage')+'%×'+reg+') + ('+land+'×'+v('cx_lowerRatio')+'%×'+lowerFloors+') + '+balcony+' + '+roof+' + '+extraGross+' = '+totalGross+
      '\\nSellable = '+totalGross+'×'+v('cx_eff')+'% = '+totalSellable+'; Residential = '+totalSellable+'−'+commercial+' = '+residential+
      '\\nConstruction Capital = '+totalGross+'×'+v('cx_buildCost')+' + extras = '+construction+
      '\\nLand Capital = '+land+'×'+v('cx_landPrice')+' = '+landCapital+
      '\\nTotal Return = ('+residential+'×'+v('cx_salePrice')+') + ('+commercial+'×'+v('cx_commercialPrice')+') = '+totalReturn+
      '\\nConstruction Share = '+fmtPct(constructionShare*100)+'; Land Share = '+fmtPct(landShare*100);

    return out;
  };

  window.construction=function(){
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