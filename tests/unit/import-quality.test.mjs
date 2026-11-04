import test from 'node:test';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { mapPropertyImportRow, summarizePropertyImportRows } from '../../src/domains/crm/property-import-mapper.js';
import { normalizeImportRows, validateImportRows, buildImportPreview, findDuplicateCandidates, rollbackPlan, editImportedRecord, isolateImportErrors, applyColumnEdits, buildDataQualityDashboard } from '../../src/domains/crm/import-quality.js';

test('import normalization preserves raw rows and normalizes numeric and phone fields', () => {
  const rows = normalizeImportRows([
    { 'نام': 'علی', 'موبایل': '0912-123-4567', 'کد': 'A-1', 'قیمت': '1,200' },
    { 'نام': 'علی', 'موبایل': '09121234567', 'کد': 'A-1', 'قیمت': '1300' }
  ]);
  assert.equal(rows[0].mobile, '09121234567');
  assert.equal(rows[0]._source_row, 1);
  assert.equal(rows[0]._source_raw['قیمت'], '1,200');
  assert.equal(rows[0].normalized_numbers.قیمت, 1200);
});

test('import validation isolates invalid phone rows without dropping valid rows', () => {
  const result = validateImportRows([
    { mobile: '09121234567' },
    { mobile: 'bad' }
  ]);
  assert.equal(result.valid.length, 1);
  assert.equal(result.invalid.length, 1);
  assert.equal(result.invalid[0]._error, 'invalid_phone');
});

test('import preview preserves every discovered column and samples at most twenty rows', () => {
  const rows = Array.from({ length: 25 }, (_, i) => ({ id: i + 1, extra: i }));
  const preview = buildImportPreview(rows);
  assert.equal(preview.rowCount, 25);
  assert.equal(preview.columnCount, 2);
  assert.deepEqual(preview.columns, ['id', 'extra']);
  assert.equal(preview.sample.length, 20);
});

test('duplicate detection is non-destructive and uses property code as the candidate key', () => {
  const candidates = findDuplicateCandidates([
    { property_code: 'A-1', full_name: 'Ali Ahmadi' },
    { property_code: 'A-1', full_name: 'Sara Ahmadi' }
  ]);
  assert.equal(candidates.length, 1);
  assert.equal(candidates[0].reason, 'same_property_code');
  assert.equal(candidates[0].candidates.length, 2);
});

test('rollback plan remains non-destructive until explicit execution', () => {
  const plan = rollbackPlan({ batchId: 'batch-1', insertedIds: [1, 2] });
  assert.equal(plan.status, 'planned');
  assert.deepEqual(plan.ids, [1, 2]);
  assert.equal(plan.destructive, true);
  assert.equal(plan.requiresExecution, true);
  assert.equal(plan.requiresManager, true);
});

test('2000+ row import normalization remains complete and deterministic', () => {
  const rows = normalizeImportRows(Array.from({ length: 2001 }, (_, i) => ({
    property_code: 'P-' + i,
    full_name: 'Owner ' + i,
    mobile: '09121234567',
    custom_column: 'value-' + i
  })));
  assert.equal(rows.length, 2001);
  assert.equal(rows[2000]._source_row, 2001);
  assert.equal(rows[2000].custom_column, 'value-2000');
});

test('multi-sheet Excel importer processes every sheet and preserves sheet provenance', () => {
  const source = fs.readFileSync(new URL('../../src/domains/crm/data-import.js', import.meta.url), 'utf8');
  assert.match(source, /wb\.SheetNames\.forEach/);
  assert.match(source, /XLSX\.utils\.sheet_to_json/);
  assert.match(source, /_sheet_name/);
  assert.match(source, /_sheet_index/);
  assert.match(source, /_row_number/);
  assert.match(source, /_raw_data/);
});

test('full column preservation survives normalization without dropping arbitrary fields', () => {
  const row = { property_code: 'P-1', 'ستون اختصاصی': 'keep-me', nested_flag: true, amount: '1,250' };
  const [normalized] = normalizeImportRows([row]);
  assert.equal(normalized['ستون_اختصاصی'], 'keep-me');
  assert.equal(normalized.nested_flag, true);
  assert.equal(normalized.normalized_numbers.amount, 1250);
  assert.deepEqual(normalized._source_raw, row);
});

test('duplicate detection does not merge records by surname or phone alone', () => {
  const candidates = findDuplicateCandidates([
    { property_code: 'P-1', full_name: 'Ahmadi', mobile: '09121234567' },
    { property_code: 'P-2', full_name: 'Ahmadi', mobile: '09121234567' }
  ]);
  assert.equal(candidates.length, 0);
});

test('manager edit changes only requested imported fields and preserves the original record', () => {
  const original = { id: 7, full_name: 'Ali', custom_field: 'keep' };
  const edited = editImportedRecord(original, { full_name: 'Reza' });
  assert.deepEqual(original, { id: 7, full_name: 'Ali', custom_field: 'keep' });
  assert.deepEqual(edited, { id: 7, full_name: 'Reza', custom_field: 'keep' });
});


test('import error isolation keeps raw rows and isolates row-level failures', () => {
  const result = isolateImportErrors([
    { property_code: 'P-1', mobile: '09121234567' },
    { property_code: 'P-2', mobile: 'bad' }
  ]);
  assert.equal(result.valid.length, 1);
  assert.equal(result.errors.length, 1);
  assert.equal(result.errors[0].rowIndex, 2);
  assert.equal(result.errors[0].code, 'invalid_phone');
  assert.deepEqual(result.errors[0].raw, { property_code: 'P-2', mobile: 'bad' });
});

test('import validation reports required columns and duplicate candidates without dropping rows', () => {
  const result = validateImportRows(
    [{ property_code: 'P-1', mobile: '09121234567' }, { mobile: 'bad' }],
    { requiredColumns: ['property_code', 'mobile'] }
  );
  assert.equal(result.valid.length, 1);
  assert.equal(result.invalid.length, 1);
  assert.equal(result.invalid[0].issues[0].code, 'invalid_phone');
  assert.equal(result.summary.total, 2);
  assert.equal(result.summary.invalid, 1);
});

test('column editor changes arbitrary imported fields without mutating the source row', () => {
  const rows = [{ property_code: 'P-1', 'ستون اختصاصی': 'A' }];
  const edited = applyColumnEdits(rows, [{ rowIndex: 0, column: 'ستون اختصاصی', value: 'B' }]);
  assert.equal(edited[0]['ستون اختصاصی'], 'B');
  assert.equal(rows[0]['ستون اختصاصی'], 'A');
});

test('preview includes validation summary, all columns and editable row references', () => {
  const preview = buildImportPreview(
    [{ property_code: 'P-1', mobile: '09121234567', custom: 'x' }],
    { requiredColumns: ['property_code', 'mobile'] }
  );
  assert.deepEqual(preview.columns, ['property_code', 'mobile', 'custom']);
  assert.equal(preview.sample[0]._preview_row, 1);
  assert.equal(preview.validation.invalid, 0);
});

test('rollback plan is explicit, bounded to a batch, and requires manager execution', () => {
  const plan = rollbackPlan({ batchId: 'batch-1', insertedIds: [1, 2] });
  assert.equal(plan.batchId, 'batch-1');
  assert.deepEqual(plan.ids, [1, 2]);
  assert.equal(plan.requiresManager, true);
  assert.equal(plan.destructive, true);
  assert.equal(plan.status, 'planned');
});

test('data quality dashboard reports completeness, errors, duplicates and field coverage', () => {
  const rows = [
    { property_code: 'P-1', mobile: '09121234567', region: 1 },
    { property_code: 'P-1', mobile: 'bad', region: null },
    { property_code: 'P-2', mobile: '09131234567', region: 6 }
  ];
  const dashboard = buildDataQualityDashboard(rows, {
    requiredColumns: ['property_code', 'mobile', 'region']
  });
  assert.equal(dashboard.totalRows, 3);
  assert.equal(dashboard.invalidRows, 1);
  assert.equal(dashboard.duplicateGroups, 1);
  assert.equal(dashboard.fieldCoverage.region, 2 / 3);
});


test('rollback migration is manager-only, exact-batch scoped and search-path pinned', () => {
  const sql = fs.readFileSync(new URL('../../supabase/migrations/20261002233000_crm_import_quality_060_065.sql', import.meta.url), 'utf8');
  assert.match(sql, /rollback_import_batch/);
  assert.match(sql, /public\.is_manager_user\(\)/);
  assert.match(sql, /set search_path = ''/);
  assert.match(sql, /where import_batch_id = p_batch_id/);
  assert.match(sql, /revoke all on function public\.rollback_import_batch\(text\) from public, anon/);
  assert.match(sql, /grant execute on function public\.rollback_import_batch\(text\) to authenticated/);
});

test('canonical Excel importer delegates to the tested Persian header mapper', () => {
  const importer = fs.readFileSync(new URL('../../src/domains/crm/data-import.js', import.meta.url), 'utf8');
  const mapper = fs.readFileSync(new URL('../../src/domains/crm/property-import-mapper.js', import.meta.url), 'utf8');
  assert.match(importer, /import \{ mapPropertyImportRow \} from '\.\/property-import-mapper\.js'/);
  assert.match(importer, /function mapProperty\(o\)\{return mapPropertyImportRow\(/);
  for (const field of ['owner_name','street','alley','side_street','mobile','property_name']) {
    assert.match(mapper, new RegExp(field + ':'));
  }
  assert.match(mapper, /مالک/);
  assert.match(mapper, /خیابان/);
  assert.match(mapper, /کوچه/);
  assert.match(mapper, /فرعی/);
});


test('222.xlsx canonical Persian headers map owner and all address fields without loss', () => {
  const mapped = mapPropertyImportRow({
    'نوع ملک': 'آپارتمان',
    'مالک': 'هومان آزمایشی',
    'موبايل': '۰۹۱۲۱۲۳۴۵۶۷',
    'خیابان': 'قصرالدشت',
    'اسم': 'واحد ۱۲',
    'کوچه': '۱۲۵',
    'فرعی': 'شمالی',
    'زیربنا': '۱۴۵',
    'زمین': '۲۴۰',
    'طبقه': '۳',
    'خواب': '۲',
    'توضیحات': 'نمونه',
    'قيمت کل': '۱۲,۵۰۰,۰۰۰,۰۰۰',
    'قيمت متري': '۸۶,۲۰۰,۰۰۰',
    'ورودی': '۱۰۰',
    'رهن کامل': '۰',
    'رهن': '۵۰۰,۰۰۰,۰۰۰',
    'اجاره': '۲۰,۰۰۰,۰۰۰',
    'کل طبقات': '۵',
    'سن بنا': '۲'
  }, { generatedCode: 'TEST-222-1' });
  assert.equal(mapped.property_code, 'TEST-222-1');
  assert.equal(mapped.owner_name, 'هومان آزمایشی');
  assert.equal(mapped.street, 'قصرالدشت');
  assert.equal(mapped.property_name, 'واحد ۱۲');
  assert.equal(mapped.alley, '۱۲۵');
  assert.equal(mapped.side_street, 'شمالی');
  assert.equal(mapped.mobile, '09121234567');
  assert.equal(mapped.built_area, 145);
  assert.equal(mapped.land_area, 240);
  assert.equal(mapped.total_floors, 5);
  assert.equal(mapped.building_age, 2);
  assert.equal(mapped.total_price, 12500000000);
});

test('property mapper accepts alternate Persian owner and address header spellings', () => {
  const mapped = mapPropertyImportRow({
    'نام مالک': 'مالک دوم',
    'خيابان': 'معالی آباد',
    'نام کوچه': 'کوچه ۴',
    'فرعي': 'غربی'
  }, { generatedCode: 'TEST-222-2' });
  assert.equal(mapped.owner_name, 'مالک دوم');
  assert.equal(mapped.street, 'معالی آباد');
  assert.equal(mapped.alley, 'کوچه ۴');
  assert.equal(mapped.side_street, 'غربی');
});


test('222.xlsx Sheet2 row provenance recreates the original stable property code', () => {
  const first = mapPropertyImportRow({ 'مالک': 'مالک اول', 'خیابان': 'قصرالدشت' }, {
    sourceFile: '222.xlsx', sheetName: 'Sheet2', sheetIndex: 1, rowNumber: 2
  });
  const last = mapPropertyImportRow({ 'مالک': 'مالک آخر', 'خیابان': 'معالی آباد' }, {
    sourceFile: '222.xlsx', sheetName: 'Sheet2', sheetIndex: 1, rowNumber: 5839
  });
  assert.equal(first.property_code, 'IMP-222-00001');
  assert.equal(last.property_code, 'IMP-222-05838');
});

test('non-canonical import files receive deterministic codes from source and row provenance', () => {
  const a = mapPropertyImportRow({ 'اسم': 'A' }, {
    sourceFile: 'new-properties.xlsx', sheetName: 'Sheet1', sheetIndex: 0, rowNumber: 2
  });
  const b = mapPropertyImportRow({ 'اسم': 'A' }, {
    sourceFile: 'new-properties.xlsx', sheetName: 'Sheet1', sheetIndex: 0, rowNumber: 2
  });
  assert.equal(a.property_code, 'IMP-new-properties-01-00001');
  assert.equal(a.property_code, b.property_code);
});


test('import preview reports field coverage for owner and complete property address', () => {
  const summary = summarizePropertyImportRows([
    { 'مالک': 'مالک ۱', 'خیابان': 'قصرالدشت', 'کوچه': '۱۲۵', 'فرعی': 'شمالی', 'موبايل': '۰۹۱۲۱۲۳۴۵۶۷', 'اسم': 'واحد ۱', _target: 'properties' },
    { 'مالک': '', 'خیابان': 'معالی آباد', 'کوچه': '', 'فرعی': '', 'موبايل': '۰۹۱۳۱۲۳۴۵۶۷', 'اسم': 'واحد ۲', _target: 'properties' }
  ]);
  assert.equal(summary.totalRows, 2);
  assert.equal(summary.coverage.owner_name.filled, 1);
  assert.equal(summary.coverage.street.filled, 2);
  assert.equal(summary.coverage.alley.filled, 1);
  assert.equal(summary.coverage.side_street.filled, 1);
  assert.equal(summary.coverage.mobile.filled, 2);
});
