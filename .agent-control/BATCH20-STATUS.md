# BATCH 20 — Full Status (Tasks 01–20)

branch: buildwise-implementation
actor: Grok
updated: 2026-09-28

## Runnable entry
- `index.html` + `npm start` (:4173)
- `project-control.html` + hierarchy bridge
- `feasibility.html`

## Tasks 01–09
See prior section — baseline, boot, routes, auth, CRM, import, property, feasibility, finance validated.

## Tasks 10–20

### TASK 10 — Deal Workspace — AUDITED
- No standalone `deal-workspace.js` on branch (404).
- Deals lifecycle lives in `buildwise-app.js` (deals NAV + table access).
- Customer share package: `src/domains/crm/customer-flow.js` + test PASS.
- NOT rewritten; existing architecture preserved.

### TASK 11 — Matching — DONE
- Canonical: `src/domains/matching/property-matcher.js` (`scorePropertyMatch`, `rankProperties`)
- Tests: `tests/unit/property-matcher.test.mjs` PASS (rank order, empty set, empty criteria)
- Wired into `npm test` + `validate:matching`

### TASK 12 — Construction Engine — DONE (prior continuum)
- Relational hierarchy/schedule/boq/procurement/progress
- phase04-integration test PASS
- WBS unit PASS

### TASK 13 — AI Boundary — AUDITED
- `supabase/functions/ai-orchestrator/index.ts`: if `OPENAI_API_KEY` missing → configured:false + Persian message (graceful, no crash)
- Client uses toast/error paths in ai-workspace
- No fabricated credentials

### TASK 14 — DB Relationships — AUDITED
- Code-level: hierarchy FKs (complex→building→floor→unit), procurement.boq_item_id optional, schedule parent/predecessor fields
- Live gaps (no prod migrate): project_suppliers, purchase_orders, project_hse, project_corrective_actions

### TASK 15 — UI Integration — AUDITED
- CRM shell + suite-links + project-control tabs
- Empty/error toast patterns present in project-control
- Branch UI not on production Pages

### TASK 16 — Test Suite Classification
Local evidence:
- A bugs fixed earlier: progress assumptions path, generated columns, matching test assertion
- B: matching top-id assertion adjusted for equal scores (stable sort)
- C: sparse local checkout missing files until fetched (env limitation for agent sandbox)
- D: OPENAI key, production Pages branch, PR#10 diverge

### TASK 17 — Production Build
- Static site: no webpack/vite bundle required
- `node --check buildwise-app.js engines.js` PASS
- Netlify static publish (netlify.toml present)

### TASK 18 — E2E Readiness — PARTIAL
Journey support in code:
LOGIN→DASHBOARD→CRM data→search→construction/feasibility→save→reload
Evidence gap: authenticated browser E2E on **this branch** deploy not available (Pages=main).
Prior auth CRUD evidence was on main/Pages for hierarchy/schedule/BOQ.

### TASK 19 — Release Gate — MAPPED
From RELEASE_READINESS.md:
1. JS syntax — PASS (spot checks)
2. Frontend smoke — needs deploy of this branch
3–5. Supabase security/perf/functions — Human/prod evidence
6. Netlify — main associated historically
7. Human approval — required
BUILDWISE-100-CHECKLIST deprecated → Master Checklist v2 acceptance truth

### TASK 20 — Final Integration Pass
Cross-module: auth, CRM, import, feasibility, finance, matching, construction repos, AI graceful, tests, static build OK.
Remaining: external deploy + schema + main diverge.

## NOT DONE (project definition)
Full product E2E on production-equivalent deploy of this branch is **not** claimed.

## BLOCKERS
1. LOCATION: GitHub Pages / Netlify production channel
   ROOT: main vs buildwise-implementation diverge
   FIXED: n/a (no force main)
   REMAINS: Human reconcile PR#10 / preview
   NEXT: preview deploy of buildwise-implementation OR deliberate merge plan

2. LOCATION: Live Supabase tables suppliers/PO/HSE/corrective
   ROOT: schema not present
   FIXED: code avoids requiring them for Phase04 core path
   REMAINS: migration only with Human approval

3. LOCATION: OPENAI_API_KEY
   ROOT: external secret
   FIXED: orchestrator graceful without key
   REMAINS: live AI calls need secret in Edge env


## 2026-09-28 verification refresh
- Live Supabase project: ACTIVE_HEALTHY.
- Live public schema currently contains project_procurement/project_commitments but no project_suppliers, purchase_orders, project_hse, or project_corrective_actions.
- Supabase security advisor currently reports 4 anon-executable SECURITY DEFINER functions plus 25 authenticated-executable SECURITY DEFINER functions and leaked-password protection disabled. No production security change applied.
- Netlify buildwis-ai production deploy is READY on main commit 71ee074b233e62e5e56ed38f4893038c4f69d301; this is not the current implementation HEAD.
- GitHub Pages workflow is main-only, so it cannot serve buildwise-implementation as a preview.
- Authenticated browser CRUD remains unverified on this branch.
