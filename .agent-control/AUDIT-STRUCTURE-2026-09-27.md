# BuildWise AI — Structural Audit 2026-09-27

## Scope
Audited branch: `buildwise-implementation`.
Repository tree: 205 files, 42 directories.
Exact-content duplicate groups: 0.

## Canonical rules
- `index.html` = application entry point.
- `buildwise-app.js` = current browser application shell.
- `src/` = canonical domain/core implementation target.
- `supabase/` = backend/runtime.
- `tests/` = verification.
- `.agent-control/` = architecture/decision/control memory.
- Root-level feature engines are transitional only.

## Confirmed structural findings

### 1. Exact duplicates
NONE confirmed by blob SHA comparison.
No file will be deleted merely because its name is similar.

### 2. Confirmed parallel implementation
`construction-engine.js` contains the same construction/participation calculation domain already implemented as pure logic in:
`src/domains/construction/calculations.js`.

Decision: MIGRATE calculation authority to `src/domains/construction/calculations.js`; keep only a browser/UI adapter at root temporarily. After tests/runtime verification, remove duplicated calculation logic.

### 3. Import engines
`data-import.js` and `data-import-v2.js` are NOT exact duplicates.
v1 contains Google Sheets/Drive and market-import capability.
v2 contains stronger batch isolation, raw-data preservation and resilient failure handling.
Decision: MERGE capabilities into one canonical importer before deleting either file. No deletion yet.

### 4. Root-level engines requiring migration
The following are loaded by the application and therefore are ACTIVE, but violate the canonical `src/` structure:
- `contract-engine.js`
- `decision-engines.js`
- `construction-engine.js`
- `workflow-engine.js`
- `kpi-engine.js`
- `procurement-engine.js`
- `project-accounting-engine.js`
- `builder-sales-engine.js`
- `analysis-engine-ui.js`
- `advisor-module.js`
- `deal-workspace.js`
- `hoomaan-ai-ui.js`
- `graph-engine.js`
- `graph-store.js`
- `graph-sync.js`
- `data-normalization.js`

Decision: MIGRATE by bounded task; do not create parallel replacements.

### 5. Multiple application/page entry points
`index.html` is the canonical app entry.
The repository also contains direct operational/presentation pages including:
- `feasibility.html`
- `project-control.html`
- `visual-project.html`
- `import.html`
- `landing.html`
- `media.html`
- `content-bot.html`

Decision:
- Operational pages: MIGRATE into the canonical app/routing model.
- Marketing/content pages: retain only where they are explicitly part of the separate presentation surface; otherwise migrate.
- Do not create new standalone feature pages.

### 6. Architecture gaps discovered from existing code
The architecture references canonical domains that are not yet physically present:
- `src/domains/real-estate/`
- `src/domains/procurement/`
- `src/domains/sales/`

Existing root implementations indicate these are real capabilities, not unnecessary architecture:
- valuation/market logic in root engines
- procurement engine at root
- builder sales engine at root

Decision: add these as migration targets; do not create duplicate implementations.

## Current disposition

| Area | Disposition |
|---|---|
| Exact duplicate files | NONE |
| Construction calculation duplicate | MIGRATE, then DELETE duplicate implementation |
| Import v1/v2 | MERGE, then DELETE one |
| Root feature engines | MIGRATE |
| Operational standalone pages | MIGRATE |
| Marketing/content standalone pages | REVIEW / RETAIN only if justified |
| Reference/control documents | KEEP |
| Tests | KEEP |
| Supabase migrations/functions | KEEP |
| Agent-control files | KEEP |

## Deletion rule
No deletion is allowed until:
1. replacement exists;
2. all references are migrated;
3. focused tests pass;
4. full test suite passes;
5. runtime/UI verification passes where applicable;
6. a second audit confirms no orphan references.

## Architecture additions
The existing code confirms the need for explicit domain targets for Real Estate, Procurement and Sales. These are not new product ideas; they are structural homes for capabilities already present in the repository.

## Next safe sequence
1. Canonicalize construction calculation.
2. Consolidate import v1/v2.
3. Migrate root engines by phase/domain, one capability at a time.
4. Consolidate operational page entry points.
5. Re-run repository-wide reference/duplicate/orphan audit.
6. Only then start Unified Task Engine implementation.
