import { calculateConstruction } from './calculations.js';

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
