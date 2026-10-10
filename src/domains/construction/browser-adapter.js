import { calculateConstruction } from './calculations.js';
import { createProjectRepository } from './project-repository.js';
import { createProjectControlRepository } from './project-control-repository.js';

const money = (value) => typeof window.money === 'function'
  ? window.money(value)
  : new Intl.NumberFormat('fa-IR', { maximumFractionDigits: 2 }).format(value);

const pct = (value) => new Intl.NumberFormat('fa-IR', { maximumFractionDigits: 2 }).format(value) + '%';

const valueOf = (id) => Number(document.getElementById(id)?.value) || 0;
const input = () => ({
  land: valueOf('cx_land'),
  width: valueOf('cx_width'),
  reg: valueOf('cx_reg'),
  coverage: valueOf('cx_coverage'),
  lowerRatio: valueOf('cx_lowerRatio'),
  lowerFloors: valueOf('cx_lowerFloors'),
  balcony: valueOf('cx_balcony'),
  roof: valueOf('cx_roof'),
  efficiency: valueOf('cx_eff'),
  extraCount: valueOf('cx_extraCount'),
  extraArea: valueOf('cx_extraArea'),
  console: valueOf('cx_console'),
  parking: valueOf('cx_parking'),
  storage: valueOf('cx_storage'),
  commercial: valueOf('cx_commercial'),
  buildCost: valueOf('cx_buildCost'),
  services: valueOf('cx_services'),
  extraBroker: valueOf('cx_extraBroker'),
  engineering: valueOf('cx_engineering'),
  renovation: valueOf('cx_renovation'),
  ownerPayment: valueOf('cx_ownerPayment'),
  landPrice: valueOf('cx_landPrice'),
  salePrice: valueOf('cx_salePrice'),
  commercialPrice: valueOf('cx_commercialPrice')
});

export function renderConstruction(result) {
  const stat = window.stat;
  const stats = document.getElementById('cx_area_output');
  const resultBox = document.getElementById('cx_result');
  const split = document.getElementById('cx_split');
  const formula = document.getElementById('cx_formula');
  if (!stats || !resultBox || !split || !formula || typeof stat !== 'function') return;

  stats.innerHTML = '<div class="stats">'
    + stat('سطح اشغال', money(result.ground) + ' m²', result.land + ' × ' + pct(result.coverage * 100))
    + stat('طبقات بالا', money(result.upper) + ' m²', money(result.ground) + ' × ' + result.reg)
    + stat('طبقات پایین', money(result.lower) + ' m²', result.land + ' × ' + pct(result.lowerRatio * 100) + ' × ' + result.lowerFloors)
    + stat('کل زیربنا', money(result.totalGross) + ' m²', 'پایه ' + money(result.baseGross) + ' + مازاد ' + money(result.extraGross))
    + stat('قابل فروش کل', money(result.totalSellable) + ' m²', money(result.totalGross) + ' × ' + pct(result.efficiency * 100))
    + stat('قابل فروش مسکونی', money(result.residentialSellable) + ' m²', 'قابل فروش کل − تجاری')
    + '</div>';

  resultBox.innerHTML = '<div class="stats">'
    + stat('آورده ساخت', money(result.constructionCapital), 'ساخت + هزینه‌های ساخت')
    + stat('آورده زمین', money(result.landCapital), 'زمین × قیمت زمین')
    + stat('کل سرمایه پروژه', money(result.totalCapital), 'ساخت + زمین')
    + stat('بازگشت مسکونی', money(result.residentialReturn), money(result.residentialSellable) + ' × قیمت فروش')
    + stat('بازگشت تجاری', money(result.commercialReturn), money(result.commercial) + ' × قیمت تجاری')
    + stat('کل بازگشت سرمایه', money(result.totalReturn), 'مسکونی + تجاری')
    + stat('سود پروژه', money(result.projectProfit), 'بازگشت − کل سرمایه')
    + stat('ROI پروژه', pct(result.projectROI), 'سود ÷ کل سرمایه')
    + '</div>';

  split.innerHTML = '<div class="data-grid">'
    + '<article class="project-card"><h3>سازنده</h3><div class="project-values"><span>سهم سرمایه <b>' + pct(result.constructionShare * 100) + '</b></span><span>متراژ قابل فروش <b>' + money(result.builderArea) + ' m²</b></span></div><p>بازگشت: ' + money(result.builderReturn) + '<br>سود خالص: <b>' + money(result.builderProfit) + '</b><br>ROI: <b>' + pct(result.builderROI) + '</b></p></article>'
    + '<article class="project-card"><h3>مالک</h3><div class="project-values"><span>سهم سرمایه <b>' + pct(result.landShare * 100) + '</b></span><span>متراژ قابل فروش <b>' + money(result.ownerArea) + ' m²</b></span></div><p>بازگشت: ' + money(result.ownerReturn) + '<br>سود خالص: <b>' + money(result.ownerProfit) + '</b><br>ROI: <b>' + pct(result.ownerROI) + '</b></p></article>'
    + '</div>';

  formula.textContent =
    'Gross = ' + result.totalGross
    + '\nSellable = ' + result.totalSellable
    + '\nConstruction Capital = ' + result.constructionCapital
    + '\nLand Capital = ' + result.landCapital
    + '\nTotal Return = ' + result.totalReturn
    + '\nConstruction Share = ' + pct(result.constructionShare * 100)
    + '; Land Share = ' + pct(result.landShare * 100);
}

window.calcConstruction = function () {
  const result = calculateConstruction(input());
  window.__BUILDWISE_CONSTRUCTION_LAST = result;
  renderConstruction(result);
  return result;
};


/* Construction UI + persistence adapter consolidated here. */
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
    var projects=createProjectRepository(db);
    projects.list({orderBy:{column:'created_at'},ascending:false,limit:50}).then(function(rows){
      var r={error:null,data:rows};
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
    var projects=createProjectRepository(db);
    projects.create({title:title,landArea:x.land,coverage:x.coverage*100,floors:x.reg,totalGross:x.totalGross,totalSellable:x.residentialSellable,totalCapital:x.totalCapital,totalReturn:x.totalReturn,expectedDurationMonths:null,status:'draft',assumptions:{model:'construction-v1-exact',inputs:x,outputs:x},createdBy:me.id}).then(function(){
      toast('پروژه و محاسبات ذخیره شد','success');
      construction();
    });
  };
})();

window.BuildWiseProjectControlRepository = function(client){ return createProjectControlRepository(client || window.db); };
