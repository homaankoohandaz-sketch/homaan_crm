# Properties source archive

Full dataset: 5838 rows from `222.xlsx` / Sheet2.

Canonical headers match CRM `mapProperty` in `src/domains/crm/data-import.js`.

**Policy: append only. No deletes.**

## How to load into CRM
1. Log in to BuildWise on phone or desktop.
2. Open **ورود داده**.
3. Source: Excel, Target: املاک.
4. Select `222.xlsx` (or the CSV export).
5. Start import — batches of 250, no automatic delete of existing rows.

## Git files
- `manifest.json` — column map
- `README.md` — field map
- Original Excel stays with the owner; CSV/parts may be added in follow-up commits.
