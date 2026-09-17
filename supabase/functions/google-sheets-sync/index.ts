import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SPREADSHEET_ID = '1A24ypEXoOT-10j1V83Qzpn-PcGTwNxmfMB2YkuijeMo';
const SHEET_GID = Deno.env.get('GOOGLE_SHEETS_GID') || '0';
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv&gid=${SHEET_GID}`;

function csvRows(csv: string) {
  const rows: string[][] = [];
  let row: string[] = [], cell = '', quoted = false;
  for (let i = 0; i < csv.length; i++) {
    const c = csv[i], n = csv[i + 1];
    if (c === '"' && quoted && n === '"') { cell += '"'; i++; continue; }
    if (c === '"') { quoted = !quoted; continue; }
    if (c === ',' && !quoted) { row.push(cell.trim()); cell = ''; continue; }
    if ((c === '\n' || c === '\r') && !quoted) { if (c === '\r' && n === '\n') i++; row.push(cell.trim()); if (row.some(Boolean)) rows.push(row); row = []; cell = ''; continue; }
    cell += c;
  }
  row.push(cell.trim()); if (row.some(Boolean)) rows.push(row);
  return rows;
}
function pick(row: Record<string,string>, names: string[]) { const key = Object.keys(row).find(k => names.includes(k.trim().toLowerCase())); return key ? row[key] : ''; }
function num(v: string) { const x = Number(String(v || '').replace(/[,_٬،\s]/g, '')); return Number.isFinite(x) ? x : null; }
function dateValue(v: string) { const d = new Date(v); return Number.isNaN(d.getTime()) ? null : d.toISOString(); }

Deno.serve(async (req) => {
  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
  const auth = req.headers.get('authorization');
  if (!auth) return new Response(JSON.stringify({ error: 'authorization required' }), { status: 401 });
  const { data: { user } } = await supabase.auth.getUser(auth.replace('Bearer ', ''));
  if (!user) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401 });
  const { data: role } = await supabase.from('app_roles').select('role,active').eq('user_id', user.id).eq('active', true).single();
  if (!role || !['owner','staff'].includes(role.role)) return new Response(JSON.stringify({ error: 'forbidden' }), { status: 403 });

  const importedAt = new Date().toISOString();
  const { data: run, error: runError } = await supabase.from('market_data_imports').insert({ source_type: 'api', source_name: `Google Sheets ${SPREADSHEET_ID}`, source_url: `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit`, imported_by: user.id, imported_at: importedAt, notes: `Google Sheets sync; gid=${SHEET_GID}` }).select('id').single();
  if (runError) return new Response(JSON.stringify({ error: runError.message }), { status: 500 });

  try {
    const response = await fetch(SHEET_URL, { redirect: 'follow' });
    if (!response.ok) throw new Error(`Google Sheets export returned ${response.status}`);
    const rows = csvRows(await response.text());
    if (rows.length < 2) throw new Error('Google Sheet has no data rows');
    const headers = rows[0].map(h => h.trim().toLowerCase());
    const records = rows.slice(1).map(values => Object.fromEntries(headers.map((h, i) => [h, values[i] || ''])));
    const observations = records.map((r) => {
      const area = num(pick(r, ['area','متراژ','مساحت']));
      const ppm = num(pick(r, ['price_per_meter','قیمت متری','قیمت هر متر','قیمت/متر']));
      if (!area || !ppm) return null;
      return { source_type: 'api', external_id: pick(r, ['external_id','id','شناسه','کد']) || null, observed_at: dateValue(pick(r, ['observed_at','date','تاریخ','تاریخ ثبت'])) || importedAt, region: pick(r, ['region','منطقه']), neighborhood: pick(r, ['neighborhood','محله','ناحیه']), property_type: pick(r, ['property_type','نوع ملک','نوع']), area, bedrooms: num(pick(r, ['bedrooms','خواب','تعداد خواب'])), age_years: num(pick(r, ['age_years','سن','سن بنا'])), floor_number: num(pick(r, ['floor_number','طبقه'])), parking: ['true','1','بله','دارد'].includes(pick(r, ['parking','پارکینگ']).toLowerCase()), elevator: ['true','1','بله','دارد'].includes(pick(r, ['elevator','آسانسور']).toLowerCase()), storage: ['true','1','بله','دارد'].includes(pick(r, ['storage','انباری']).toLowerCase()), total_price: num(pick(r, ['total_price','قیمت کل','قیمت'])), price_per_meter: ppm, raw_payload: r };
    }).filter(Boolean);
    if (!observations.length) throw new Error('No valid rows found. Required columns: area/متراژ and price_per_meter/قیمت متری.');
    const { error: insertError } = await supabase.from('market_price_observations').insert(observations);
    if (insertError) throw new Error(insertError.message);
    const { error: updateError } = await supabase.from('market_data_imports').update({ row_count: observations.length, period_start: observations.reduce((a,r) => a < r.observed_at ? a : r.observed_at, observations[0].observed_at).slice(0,10), period_end: observations.reduce((a,r) => a > r.observed_at ? a : r.observed_at, observations[0].observed_at).slice(0,10) }).eq('id', run.id);
    if (updateError) throw new Error(updateError.message);
    return new Response(JSON.stringify({ ok: true, import_id: run.id, rows: observations.length, spreadsheet_id: SPREADSHEET_ID }), { headers: { 'content-type': 'application/json' } });
  } catch (error) {
    await supabase.from('market_data_imports').update({ notes: `Google Sheets sync failed: ${error instanceof Error ? error.message : String(error)}` }).eq('id', run.id);
    return new Response(JSON.stringify({ ok: false, import_id: run.id, error: error instanceof Error ? error.message : String(error) }), { status: 500, headers: { 'content-type': 'application/json' } });
  }
});
