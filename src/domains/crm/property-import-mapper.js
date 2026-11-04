import '../../core/data-normalization.js';

const BN = globalThis.BuildWiseNormalize;
const ALIASES = Object.freeze({
  property_code: ['property_code','code','کد','کد ملک','کد ملک'],
  property_name: ['property_name','name','title','عنوان','نام','اسم'],
  property_type: ['property_type','type','نوع ملک','نوع'],
  owner_name: ['owner_name','owner','مالک','نام مالک','نام و نام خانوادگی مالک'],
  mobile: ['mobile','phone','موبایل','موبايل','تلفن'],
  emergency_phone: ['emergency_phone','تلفن ضروری','تلفن ضروري'],
  region: ['region','zone','منطقه'],
  neighborhood: ['neighborhood','area_name','محله'],
  street: ['street','خیابان','خيابان','نام خیابان'],
  alley: ['alley','کوچه','نام کوچه'],
  side_street: ['side_street','فرعی','فرعي','نام فرعی'],
  floor: ['floor','طبقه'],
  total_floors: ['total_floors','کل طبقات','تعداد طبقات'],
  building_age: ['building_age','age','سن بنا'],
  year_registered: ['year_registered','سال','سال ثبت'],
  land_area: ['land_area','land','زمین','مساحت زمین'],
  built_area: ['built_area','area','metrage','متراژ','زیربنا'],
  bedrooms: ['bedrooms','rooms','خواب'],
  total_price: ['total_price','price','قیمت کل','قيمت کل','قیمت','قيمت'],
  price_per_meter: ['price_per_meter','ppm','قیمت متری','قيمت متري'],
  entry_price: ['entry_price','entry','ورودی'],
  full_deposit: ['full_deposit','رهن کامل'],
  deposit_amount: ['deposit_amount','deposit','رهن'],
  rent_amount: ['rent_amount','rent','اجاره'],
  status: ['status','وضعیت'],
  activity_status: ['activity_status','وضعیت فعالیت'],
  listing_type: ['listing_type','نوع ورودی'],
  request_type: ['request_type','نوع درخواست','درخواست'],
  ownership_type: ['ownership_type','مالکیت'],
  description: ['description','توضیحات']
});
const NUMBER_FIELDS = new Set(['region','floor','total_floors','building_age','land_area','built_area','bedrooms','total_price','price_per_meter','entry_price','full_deposit','deposit_amount','rent_amount']);

function stableGeneratedCode({ sourceFile, sheetName, sheetIndex, rowNumber } = {}) {
  const baseName = String(sourceFile || '').split(/[\\/]/).pop();
  const dot = baseName.lastIndexOf('.');
  const file = (dot > 0 ? baseName.slice(0, dot) : baseName).trim();
  const sequence = Math.max(1, Number(rowNumber) - 1 || 1);
  if (/^222$/i.test(file) && (sheetName === 'Sheet2' || sheetName == null || sheetName === '')) {
    return 'IMP-222-' + String(sequence).padStart(5, '0');
  }
  if (!file || !rowNumber) return 'IMP-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8);
  const slug = file.normalize('NFKD').replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').toLowerCase().slice(0, 24) || 'file';
  const sheet = String(sheetIndex == null ? 0 : Number(sheetIndex) + 1).padStart(2, '0');
  return 'IMP-' + slug + '-' + sheet + '-' + String(sequence).padStart(5, '0');
}

function readValue(row, aliases) {
  const wanted = new Set(aliases.map(BN.normalizeKey));
  for (const [key, value] of Object.entries(row || {})) {
    if (wanted.has(BN.normalizeKey(key)) && value != null && String(value).trim() !== '') return value;
  }
  return '';
}

/** Canonical mapper for the 222.xlsx/Sheet2 headers and common Persian variants. */
export function mapPropertyImportRow(row, {
  source = 'excel',
  normalizeNumber = BN.normalizeNumber,
  normalizePhone = BN.normalizePhone,
  generatedCode = null,
  sourceFile = null,
  sheetName = null,
  sheetIndex = null,
  rowNumber = null
} = {}) {
  const mapped = {};
  for (const [field, aliases] of Object.entries(ALIASES)) {
    const value = readValue(row, aliases);
    if (field === 'mobile' || field === 'emergency_phone') {
      mapped[field] = normalizePhone(value);
    } else if (NUMBER_FIELDS.has(field)) {
      mapped[field] = normalizeNumber(value);
    } else {
      mapped[field] = value;
    }
  }
  mapped.property_code = String(mapped.property_code || generatedCode || stableGeneratedCode({ sourceFile, sheetName, sheetIndex, rowNumber }));
  mapped.source = source;
  if (!mapped.status) mapped.status = 'active';
  return mapped;
}


export function summarizePropertyImportRows(rows = [], options = {}) {
  const sourceRows = (rows || []).filter(row => row && typeof row === 'object' && (row._target || 'properties') === 'properties');
  const mapped = sourceRows.map(row => mapPropertyImportRow(row, {
    ...options,
    sheetName: row._sheet_name ?? options.sheetName,
    sheetIndex: row._sheet_index ?? options.sheetIndex,
    rowNumber: row._row_number ?? options.rowNumber
  }));
  const fields = ['owner_name','street','alley','side_street','mobile','property_name'];
  const coverage = Object.fromEntries(fields.map(field => {
    const filled = mapped.filter(row => row[field] != null && String(row[field]).trim() !== '').length;
    return [field, { filled, missing: mapped.length - filled, percent: mapped.length ? filled / mapped.length : 0 }];
  }));
  return { totalRows: mapped.length, coverage, sample: mapped.slice(0, 10) };
}
