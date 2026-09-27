# BuildWise AI — Structural Audit 2026-09-27

Branch: buildwise-implementation
Repository tree audited: 205 files / 42 directories.

## Findings
- Exact-content duplicate groups: 0.
- Confirmed duplicate implementation: construction calculation existed in both `construction-engine.js` and canonical `src/domains/construction/calculations.js`, with `src/domains/construction/browser-adapter.js` already providing the UI bridge.
- Import: v1/v2 were not exact duplicates. They have now been consolidated into canonical `data-import.js`, preserving Excel/CSV, Google Sheets, Google Drive Bridge, market import, resilient batching and raw-row archival. `data-import-v2.js` was deleted after reference and syntax verification.
- Root-level feature engines are active/transitional and must migrate into `src/`; do not create parallel replacements.
- Operational direct pages create multiple entry points: `feasibility.html`, `project-control.html`, `visual-project.html`, `import.html`, plus presentation/content pages.
- Architecture names canonical domains `src/domains/real-estate/`, `src/domains/procurement/`, and `src/domains/sales/`, but those folders are not yet present. Existing root implementations confirm these are migration targets, not unnecessary features.

## Actions completed
1. Construction calculation authority was consolidated into `src/domains/construction/calculations.js`.
2. `src/domains/construction/browser-adapter.js` is now loaded by `index.html`.
3. `construction-engine.js` is now a UI/persistence adapter and no longer contains the duplicate calculation implementation.
4. The import implementations were consolidated into `data-import.js`; `data-import-v2.js` was deleted after its capabilities were merged. `index.html` now has one import entry point.
5. `procurement-engine.js` was migrated to `src/domains/procurement/engine.js`; `index.html` points to the canonical engine; root duplicate deleted.
6. `builder-sales-engine.js` was migrated to `src/domains/sales/engine.js`; `index.html` points to the canonical engine; root duplicate deleted.

## Verification
- Transformed `construction-engine.js`: syntax check PASS.
- Canonical `data-import.js`: syntax check PASS.
- Canonical Procurement and Sales engines: syntax checks PASS.
- Root Procurement/Sales engine files: confirmed absent after migration.
- Repository re-audit: 0 exact duplicate-content groups.
- Repository search: no active code reference to `data-import-v2.js`; remaining textual reference is audit documentation only.
- `index.html`: duplicate import script removed.
- `index.html`: canonical construction adapter reference confirmed.
- Repository re-audit: 205 files, 0 exact duplicate-content groups.
- GitHub workflow lookup for the latest commit returned no workflow runs, so full CI runtime verification is not claimed.

## Disposition
- KEEP: architecture/control files, tests, Supabase runtime, canonical src modules.
- MIGRATE: root feature engines, operational pages, import v1/v2 consolidation.
- ARCHIVE/DELETE: only after replacement + reference migration + tests + runtime/UI verification + second audit.
- No destructive cleanup is performed merely from filename similarity.

## Next consolidation sequence
1. Migrate root engines by phase/domain.
2. Consolidate operational page entry points.
3. Add/complete canonical Real Estate, Procurement and Sales domain homes.
4. Run full reference/orphan/duplicate audit again.
5. Start Unified Task Engine only after the above gate passes.


- 2026-09-27: Final consolidation pass: merged shared accounting/KPI/contract/decision/workflow engines into `src/core/business-engines.js`; merged graph engine/store/sync into `src/domains/intelligence/graph.js`; merged advisor/deal/contextual AI UI into `src/ui/ai-workspace.js`; moved normalization, analysis UI and data import into canonical `src/` locations; absorbed compatibility CSS into `buildwise-app.js`; removed superseded root files and updated `index.html`. No archive/backup copies were created. Runtime workflow checks were not available for this commit.
