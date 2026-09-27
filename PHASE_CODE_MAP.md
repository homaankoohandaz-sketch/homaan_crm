# BuildWise AI — Phase / Code Ownership Map

Branch: `buildwise-implementation`

This map is the canonical bridge between the frozen Phase 04–11 plan and the current runtime files.
It intentionally does **not** move files yet: the current app is a browser-global script stack, and blind file moves would break relative script loading and duplicate the newer `src/` architecture.

## Phase 01 — Foundation / Runtime
- `buildwise-app.js` — application shell, auth session, navigation, shared UI/runtime helpers.
- `data-normalization.js` — normalization primitives.
- `graph-store.js` — graph persistence.
- `graph-engine.js` — graph/entity behavior.
- `graph-sync.js` — graph synchronization.

## Phase 02 — CRM / Data
- `data-import.js` — original Excel/CSV/Sheets import path; retained for compatibility.
- `data-import-v2.js` — current reliable import path.
- `advisor-module.js` — advisor workspace, routing, follow-ups, access reporting.
- `deal-workspace.js` — persistent deal workspace and AI actions.

## Phase 04 — Land / Construction / ROI / Scenario
- `construction-engine.js` — construction/participation calculation engine.
- `contract-engine.js` — contract validation layer.
- `decision-engines.js` — decision/scenario/risk/ROI support.
- `feasibility.html` — standalone feasibility UI.
- `src/domains/construction/*` — newer domain implementation.
- `src/domains/finance/*` — feasibility/scenario implementation.

## Phase 05 — Market / Valuation
- `analysis-engine-ui.js` — market/price/cost engine UI.
- `decision-engines.js` — valuation/scenario decision support.
- `src/domains/finance/*` — finance-side calculation layer.

## Phase 06 — Matching / Deal Radar
- `graph-engine.js`
- `graph-store.js`
- `graph-sync.js`
- `decision-engines.js`
- `deal-workspace.js`
- `src/domains/matching/property-matcher.js`

## Phase 07 — Dashboard
- `buildwise-app.js` — dashboard shell and CRM views.
- `kpi-engine.js` — KPI calculations.
- `analysis-engine-ui.js` — price/cost views.

## Phase 08 — ROOM / Media / Plan / 3D
- `buildwise-app.js` — ROOM workspace entry.
- `media-ai.js` — media/AI integration.
- `media.html` — media UI.
- `visual-project.html` — visual project UI.
- `media_assets` backend layer — asset registry.

## Phase 09 — Automation / Telegram
- `workflow-engine.js` — workflow primitives.
- `suite-links.js` — integration links.
- `supabase/functions/telegram-bot/*` — Telegram runtime.
- `supabase/functions/google-sheets-sync/*` — Sheets sync runtime.

## Phase 10 — AI / Voice
- `hoomaan-ai-ui.js` — AI UI.
- `advisor-module.js` — advisor AI/workspace integration.
- `deal-workspace.js` — AI deal actions.
- `supabase/functions/ai-orchestrator/*` — server-side AI gateway.
- `supabase/functions/media-ai/*` — media AI runtime.
- `src/ai/*` — newer AI gateway/contracts.

## Phase 11 — Learning
- `decision-engines.js` — current decision layer.
- `supabase/migrations/*learning*` / `learning_events` — persistence layer.
- Learning remains a backend capability; no separate browser loader is required yet.

## Cross-cutting
- Security/Auth: `AUTH_ARCHITECTURE.md`, `supabase/functions/_shared/auth.ts`, RLS migrations.
- Testing: `tests/*`.
- Deployment: `netlify.toml`, `.github/workflows/*`, `pages.yml`.
- Agent control plane: `.agent-control/*`.

## Legacy / Do not load into the main app
- `phase-app.js` is a previous bundled implementation of Phases 04–11. It duplicates the current shell and must remain reference/legacy code, not a second runtime.
- `data-import.js` is compatibility code; `data-import-v2.js` is the preferred import path.

## Runtime load order
1. Shell + foundation
2. Graph + contract/decision engines
3. Project/construction/workflow/KPI/procurement/accounting/sales engines
4. Data normalization/import
5. Market/analysis UI
6. Advisor/deal/AI UI
7. Compatibility/fix layers

The phase map is logical ownership. A file may support more than one phase; ownership is assigned to its primary responsibility while dependencies are kept explicit.
