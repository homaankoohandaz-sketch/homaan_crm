# BuildWise AI — Structural Audit 2026-09-27

Branch: buildwise-implementation
Repository tree audited: 205 files / 42 directories.

## Findings
- Exact-content duplicate groups: 0.
- Confirmed duplicate implementation: construction calculation existed in both `construction-engine.js` and canonical `src/domains/construction/calculations.js`, with `src/domains/construction/browser-adapter.js` already providing the UI bridge.
- Import: `data-import.js` and `data-import-v2.js` are not exact duplicates. v1 has Google Sheets/Drive/market capabilities; v2 has stronger batch isolation/raw preservation/resilient import. They must be merged before either is deleted.
- Root-level feature engines are active/transitional and must migrate into `src/`; do not create parallel replacements.
- Operational direct pages create multiple entry points: `feasibility.html`, `project-control.html`, `visual-project.html`, `import.html`, plus presentation/content pages.
- Architecture names canonical domains `src/domains/real-estate/`, `src/domains/procurement/`, and `src/domains/sales/`, but those folders are not yet present. Existing root implementations confirm these are migration targets, not unnecessary features.

## Actions completed
1. Construction calculation authority was consolidated into `src/domains/construction/calculations.js`.
2. `src/domains/construction/browser-adapter.js` is now loaded by `index.html`.
3. `construction-engine.js` is now a UI/persistence adapter and no longer contains the duplicate calculation implementation.
4. No unrelated files were deleted.

## Verification
- Transformed `construction-engine.js`: syntax check PASS.
- `index.html`: canonical construction adapter reference confirmed.
- Repository re-audit: 205 files, 0 exact duplicate-content groups.
- GitHub workflow lookup for the latest commit returned no workflow runs, so full CI runtime verification is not claimed.

## Disposition
- KEEP: architecture/control files, tests, Supabase runtime, canonical src modules.
- MIGRATE: root feature engines, operational pages, import v1/v2 consolidation.
- ARCHIVE/DELETE: only after replacement + reference migration + tests + runtime/UI verification + second audit.
- No destructive cleanup is performed merely from filename similarity.

## Next consolidation sequence
1. Merge import v1/v2 into one canonical importer.
2. Migrate root engines by phase/domain.
3. Consolidate operational page entry points.
4. Add/complete canonical Real Estate, Procurement and Sales domain homes.
5. Run full reference/orphan/duplicate audit again.
6. Start Unified Task Engine only after the above gate passes.
