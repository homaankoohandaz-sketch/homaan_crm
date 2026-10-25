# CRM properties source — 222.xlsx

- Source: `222.xlsx` / Sheet2
- Rows: 5838
- Policy: **append only — no delete**
- Target table: `properties`
- Import path in app: ورود داده → Excel → املاک

## Columns (canonical CRM headers)

| Excel | CRM field |
|---|---|
| نوع ملک | property_type |
| مالک | owner_name |
| موبايل | mobile |
| خیابان | street |
| اسم | property_name |
| کوچه | alley |
| فرعی | side_street |
| زیربنا | built_area |
| زمین | land_area |
| طبقه | floor |
| خواب | bedrooms |
| توضیحات | description |
| قيمت کل | total_price |
| قيمت متري | price_per_meter |
| ورودی | entry_price |
| رهن کامل | full_deposit |
| رهن | deposit_amount |
| اجاره | rent_amount |
| کل طبقات | total_floors |
| سن بنا | building_age |

## Files

- `properties-source-222.csv` — full export (UTF-8 BOM)
- `parts/properties-part-01.csv` … `05` — same data in chunks
- `manifest.json` — metadata

Import through the logged-in BuildWise UI so RLS and batch audit apply. Do not bulk-delete existing properties.
