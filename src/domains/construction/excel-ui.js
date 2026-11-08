import { calculateExcelConstructionModel, CONSTRUCTION_EXCEL_ROWS } from './excel-model.js';

const DEFAULTS = Object.freeze({
  projectTitle:'پروژه M6 نمونه',
  projectConcept:'هومان کوه انداز',
  contactPhone:'09178030705',
  projectType:'M6 مسکونی تجاری',
  landArea:397, plotWidth:10, buildingRegulation:6, groundCoveragePercent:100,
  lowerBuildablePercent:0, lowerFloorsForFormula:0, displayedLowerFloors:2,
  balconyArea:60, rooftopArea:25, efficiencyPercent:80,
  additionalStoreyCount:1, managementPercent:0, builderPercent:75, ownerPercent:25,
  constructionCostPerM2:50000000, landPayment:'-', servicesCost:0,
  extraDensityBrokerCost:0, engineeringManagementCost:0, permitCost:7000000000,
  ownerPayment:0, landPricePerM2:100000000, urbanPlanningDifference:0,
  residentialSalePricePerM2:100000000, commercialSalePricePerM2:150000000,
  monthlyRentPerM2:1000000,
  rentNote:'به قرار هر متر 1 میلیون تومان', participationNote:''
});

const FIELDS = [
  ['projectTitle','عنوان پروژه','text'],['projectType','نوع پروژه','text'],['landArea','متراژ زمین (m²)','number'],
  ['plotWidth','عرض زمین (m)','number'],['buildingRegulation','ضابطه ساخت / طبقات بالا','number'],
  ['groundCoveragePercent','سطح اشغال (%)','number'],['lowerBuildablePercent','درصد ساخت منفی (%)','number'],
  ['lowerFloorsForFormula','طبقات پایین در فرمول','number'],['displayedLowerFloors','طبقات پایین (ردیف نمایشی اکسل)','number'],
  ['balconyArea','بالکن (m²)','number'],['rooftopArea','فضای مسقف بام (m²)','number'],
  ['efficiencyPercent','درصد مفید (%)','number'],['additionalStoreyCount','تعداد طبقه تراکم مازاد','number'],
  ['managementPercent','درصد مدیریت پیمان (%)','number'],['builderPercent','درصد سازنده (%)','number'],
  ['ownerPercent','درصد مالک (%)','number'],['constructionCostPerM2','هزینه ساخت هر متر','number'],
  ['landPayment','پرداختی از زمین','text'],['servicesCost','سهم خدمات','number'],
  ['extraDensityBrokerCost','کارگزار تراکم مازاد','number'],['engineeringManagementCost','خدمات مهندسی یا مدیریت','number'],
  ['permitCost','عوارض نوسازی یا پروانه','number'],['ownerPayment','پرداختی به مالک','number'],
  ['landPricePerM2','قیمت هر متر زمین','number'],['urbanPlanningDifference','مابه‌التفاوت شهرسازی زمین','number'],
  ['residentialSalePricePerM2','قیمت فروش هر متر مسکونی','number'],
  ['commercialSalePricePerM2','قیمت فروش هر متر تجاری','number'],
  ['monthlyRentPerM2','اجاره ماهانه هر متر','number'],
  ['rentNote','توضیح اجاره','text'],['participationNote','توضیح درصد مشارکت','text']
];

const SECTION_LABELS = {
  projectInfo:'Project Info / اطلاعات پروژه',
  additionalRatio:'Additional Floor Area Ratio / تراکم مازاد',
  participation:'سهم مالک و سازنده',
  constructionCost:'Cost of Construction / هزینه ساخت',
  landCost:'Cost of Land / هزینه زمین',
  benefit:'Benefit / سود و بازگشت سرمایه',
  additionalRatioBenefit:'درآمد تراکم مازاد',
  constructionNetIncome:'Net Income of Construction / درآمد خالص ساخت',
  landNetProfit:'Net Profit of Land / سود خالص زمین',
  commercial:'Commercial / تجاری',
  roiAnalysis:'ROI Analysis / تحلیل بازگشت سرمایه'
};
const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const fmt = value => Number(value).toLocaleString('fa-IR',{maximumFractionDigits:2});
const money = value => value === null || value === undefined || value === '' || !Number.isFinite(Number(value)) ? '—' : fmt(value);
const fmtValue = (value, format) => {
  if (value === null || value === undefined || value === '') return '—';
  if (format === 'percent') return fmt(Number(value)*100)+'%';
  if (format === 'currency') return money(value);
  if (typeof value === 'number') return fmt(value);
  return esc(value);
};
let activeProjectId = null;
let activeInputs = {...DEFAULTS};

function readInputs() {
  const form = document.getElementById('bw-construction-editor');
  if (!form) return {...activeInputs};
  const result = {...activeInputs};
  for (const [key,,type] of FIELDS) {
    const element = form.elements.namedItem(key);
    if (!element) continue;
    result[key] = type === 'number' ? (element.value === '' ? 0 : Number(element.value)) : element.value;
  }
  return result;
}
function visibleRows(isManager) {
  if (isManager) return CONSTRUCTION_EXCEL_ROWS;
  return CONSTRUCTION_EXCEL_ROWS.filter(item => ['projectInfo','roiAnalysis'].includes(item.section));
}
function renderRows(result, isManager) {
  const rows = visibleRows(isManager);
  let previousSection = '';
  return rows.map(item => {
    const section = previousSection !== item.section
      ? '<tr class="bw-cx-section"><th colspan="3">'+esc(SECTION_LABELS[item.section] || item.section)+'</th></tr>'
      : '';
    previousSection = item.section;
    const value = item.cell === 'C1' ? result.inputs.projectConcept
      : item.cell === 'C2' ? result.inputs.contactPhone
      : item.cell === 'C4' ? result.inputs.projectType
      : result.cells[item.cell];
    return section+'<tr><td>'+item.number+'</td><td>'+esc(item.label)+'</td><td class="bw-cx-value">'+fmtValue(value,item.format)+'</td></tr>';
  }).join('');
}
function renderEditor(inputs) {
  return '<form id="bw-construction-editor" class="bw-cx-editor" onsubmit="return false"><div class="bw-cx-fields">'+FIELDS.map(([key,label,type]) =>
    '<label>'+esc(label)+'<input name="'+key+'" type="'+type+'" value="'+esc(inputs[key] ?? '')+'" '+(type==='number'?'step="any"':'')+'></label>'
  ).join('')+'</div></form>';
}
function renderHeader(inputs) {
  return '<header class="bw-cx-print-head"><div><strong>BuildWise AI</strong><div class="bw-cx-tagline">REAL ESTATE OPERATING SYSTEM</div></div><div class="bw-cx-contact"><strong>'+esc(inputs.projectConcept)+'</strong><span>مشاور مدیریت و ساخت</span><b>شماره تماس: '+esc(inputs.contactPhone)+'</b></div></header>';
}
function styleOnce() {
  if (document.getElementById('bw-cx-style')) return;
  const style=document.createElement('style'); style.id='bw-cx-style';
  style.textContent=`
    .bw-cx-wrap{max-width:1180px;margin:auto}.bw-cx-print-head{display:flex;justify-content:space-between;align-items:center;gap:16px;padding:18px 20px;border-bottom:2px solid #243746;margin-bottom:16px}.bw-cx-print-head strong{font-size:20px}.bw-cx-tagline{font-size:11px;letter-spacing:1px;opacity:.7;margin-top:4px}.bw-cx-contact{display:grid;text-align:left;gap:4px}.bw-cx-contact b{direction:ltr}.bw-cx-editor{margin:12px 0}.bw-cx-fields{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:10px}.bw-cx-fields label{display:grid;gap:5px;font-size:13px}.bw-cx-fields input{width:100%;min-width:0;padding:10px;border:1px solid var(--border,#ccd3d8);border-radius:9px;background:var(--surface,#fff);color:inherit}.bw-cx-actions{display:flex;gap:8px;flex-wrap:wrap;margin:12px 0}.bw-cx-table-wrap{overflow:auto}.bw-cx-table{width:100%;border-collapse:collapse;min-width:620px}.bw-cx-table td,.bw-cx-table th{padding:9px 10px;border-bottom:1px solid var(--border,#ddd);text-align:right}.bw-cx-table td:first-child{width:52px;color:var(--muted,#667)}.bw-cx-table td:last-child{font-variant-numeric:tabular-nums;font-weight:600}.bw-cx-section th{background:var(--surface-2,#eef2f4);padding-top:14px}.bw-cx-warnings{border-right:3px solid #b7791f;padding:8px 12px;margin:12px 0}.bw-cx-projects{display:flex;gap:8px;flex-wrap:wrap}.bw-cx-projects button{max-width:100%}@media print{body{background:#fff!important;color:#111!important}.sidebar,.topbar,.bw-cx-actions,.bw-cx-editor,.bw-cx-projects,.page-head{display:none!important}.bw-cx-wrap{max-width:none}.bw-cx-print-head{margin:0 0 10px;padding:8px 0}.bw-cx-table td,.bw-cx-table th{padding:5px 7px;font-size:10pt;break-inside:avoid}.bw-cx-section th{background:#eee!important;print-color-adjust:exact}}`;
  document.head.append(style);
}
function showToast(message,type='info') {
  if (typeof window.toast === 'function') window.toast(message,type);
  else { const el=document.createElement('div'); el.textContent=message; el.className='bw-toast '+type; document.body.append(el); setTimeout(()=>el.remove(),3000); }
}
function renderPage(inputs, projects=[]) {
  const main=document.getElementById('main');
  if (!main) throw new Error('صفحه اصلی اپ پیدا نشد.');
  const manager=typeof window.isManager==='function' && window.isManager();
  const role=String(window.role||'').toLowerCase();
  const canView=manager || ['advisor','agent','customer'].includes(role);
  if (!canView) { main.innerHTML='<div class="errorbox">دسترسی به محاسبه ساخت مجاز نیست.</div>'; return; }
  activeInputs={...inputs};
  const result=calculateExcelConstructionModel(inputs);
  window.__BUILDWISE_EXCEL_CONSTRUCTION_LAST=result;
  styleOnce();
  const editor=manager ? '<section class="card"><div class="card-title">ورودی‌ها و تنظیمات محاسبه (مدیر)</div>'+renderEditor(inputs)+'</section>' : '';
  const actions=manager ? '<button class="btn primary" onclick="window.saveExcelConstructionProject()">ذخیره پروژه</button><button class="btn" onclick="window.newExcelConstructionProject()">پروژه جدید</button>' : '';
  const print='<button class="btn" onclick="window.print()">چاپ / PDF</button>';
  const projectList=manager ? '<section class="card"><div class="card-title">پروژه‌های ذخیره‌شده</div><div class="bw-cx-projects">'+projects.map(p=>'<button class="btn" onclick="window.loadExcelConstructionProject(\''+esc(p.id)+'\')">'+esc(p.title||'پروژه بدون نام')+'</button>').join('')+'</div></section>' : '';
  main.innerHTML='<div class="bw-cx-wrap">'+renderHeader(inputs)+'<div class="bw-cx-actions">'+actions+print+'</div>'+editor
    +'<section class="card"><div class="card-title">گزارش محاسبه ساخت و منافع پروژه</div><div class="bw-cx-table-wrap"><table class="bw-cx-table"><thead><tr><th>ردیف</th><th>شرح</th><th>مقدار</th></tr></thead><tbody>'+renderRows(result,manager)+'</tbody></table></div></section>'
    +(manager && result.warnings.length?'<section class="card bw-cx-warnings"><strong>هشدارهای فرمول اکسل</strong>'+result.warnings.map(w=>'<p>'+esc(w.message)+'</p>').join('')+'</section>':'')
    +projectList+'</div>';
  if (manager) {
    const form=document.getElementById('bw-construction-editor');
    form.addEventListener('input',()=>{try{updatePreview(readInputs(),manager);}catch(error){showToast(error.message,'error');}});
  }
}
function updatePreview(inputs, manager) {
  const result=calculateExcelConstructionModel(inputs);
  window.__BUILDWISE_EXCEL_CONSTRUCTION_LAST=result;
  const tbody=document.querySelector('.bw-cx-table tbody');
  if(tbody) tbody.innerHTML=renderRows(result,manager);
  const warning=document.querySelector('.bw-cx-warnings');
  if(manager && result.warnings.length) {
    const html='<strong>هشدارهای فرمول اکسل</strong>'+result.warnings.map(w=>'<p>'+esc(w.message)+'</p>').join('');
    if(warning) warning.innerHTML=html;
    else {
      const section=document.createElement('section'); section.className='card bw-cx-warnings'; section.innerHTML=html;
      document.querySelector('.bw-cx-table')?.closest('.card')?.after(section);
    }
  } else if(warning) warning.remove();
  const concept=document.querySelector('.bw-cx-contact strong');
  if(concept) concept.textContent=inputs.projectConcept;
}
async function fetchProjects() {
  if (!window.db) return [];
  const {data,error}=await window.db.from('construction_projects').select('id,title,assumptions,created_at').order('created_at',{ascending:false}).limit(50);
  if (error) throw error;
  return data||[];
}
window.constructionExcelM6 = async function() {
  try {
    const manager=typeof window.isManager==='function' && window.isManager();
    const projects=manager?await fetchProjects():[];
    renderPage({...DEFAULTS},projects);
  } catch(error) { const main=document.getElementById('main'); if(main) main.innerHTML='<div class="errorbox">'+esc(error.message)+'</div>'; }
};
window.newExcelConstructionProject = function() {
  activeProjectId=null; activeInputs={...DEFAULTS};
  window.constructionExcelM6();
};
window.loadExcelConstructionProject = async function(id) {
  if (!(typeof window.isManager==='function' && window.isManager())) return;
  const {data,error}=await window.db.from('construction_projects').select('id,title,assumptions').eq('id',id).single();
  if(error) return showToast(error.message,'error');
  activeProjectId=data.id;
  const saved=data.assumptions?.excelM6?.inputs;
  if(!saved) return showToast('ورودی‌های نسخه M6 در این پروژه ذخیره نشده است.','error');
  const inputs={...DEFAULTS,...saved,projectTitle:data.title||'پروژه M6'};
  const projects=await fetchProjects();
  renderPage(inputs,projects);
  const title=document.getElementById('bw-cx-project-title');
  if(title) title.value=data.title||'';
};
window.saveExcelConstructionProject = async function() {
  if (!(typeof window.isManager==='function' && window.isManager())) return showToast('فقط مدیر مجاز به ذخیره محاسبه است.','error');
  try {
    const inputs=readInputs();
    const result=calculateExcelConstructionModel(inputs);
    const title=String(inputs.projectTitle||inputs.projectType||'پروژه M6').trim();
    const payload={
      title,land_area:inputs.landArea,footprint_percent:inputs.groundCoveragePercent,floors:inputs.buildingRegulation,
      gross_built_area:result.cells.C28,net_sellable_area:result.cells.C30,
      estimated_cost:result.cells.C51,expected_sale_price:result.cells.C59,status:'draft',
      created_by:window.me?.id||window.me?.user?.id||null,
      assumptions:{model:'construction-excel-m6-v2',excelM6:{inputs,outputs:result.cells,warnings:result.warnings,rows:CONSTRUCTION_EXCEL_ROWS}}
    };
    let response;
    if(activeProjectId) response=await window.db.from('construction_projects').update(payload).eq('id',activeProjectId).select('id').single();
    else response=await window.db.from('construction_projects').insert(payload).select('id').single();
    if(response.error) throw response.error;
    activeProjectId=response.data.id;
    showToast('پروژه و تمام ورودی‌ها و خروجی‌های اکسل ذخیره شد.','success');
    const projects=await fetchProjects(); renderPage(inputs,projects);
  } catch(error) { showToast(error.message||'ذخیره پروژه انجام نشد.','error'); }
};
