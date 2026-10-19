# BuildWise AI — SUMMARY

Updated: 2026-10-19 (CRM integration + shared-workspace enforcement)
Branch: buildwise-implementation

## Single source of truth
- Workspace: `homaankoohandaz-sketch/homaan_crm`
- Code: `buildwise-implementation`
- Release: `main`
- Summary: this file | State: `.agent-control/STATE.md` | Checklist: MASTER-CHECKLIST-v3-850 (850)
- NO second app. DONE requires runtime evidence. Agent commits: `[grok]`.

## 2026-10-17 — Grok session
- GitHub + Supabase REST + direct Postgres (Seoul pooler) access verified.
- Rules list 450–850 received; largely already in MASTER-CHECKLIST-v3-850. No false DONE.
- NOW.md / STATE.md updated with current state, objective, blocker, next action.
- P0 backup still OPEN: human must set `SUPABASE_DB_URL` + `BACKUP_AGE_RECIPIENT` and produce verified artifact + restore drill.
- Operational DB data sparse; schema large. Release remains BLOCKED per STATE.md gates.

## EMERGENCY 2026-10-10 — ai-project-control-engine.js
- Push tool size limit truncated `ai-project-control-engine.js`.
- **Human/ChatGPT restore:**
  ```bash
  git show 505972f11f5c1fa54b1d5a83bc9c3bdaf8b2a4b0:ai-project-control-engine.js > ai-project-control-engine.js
  # Patch detectMaterialConflicts: break after first shortage per material_key
  # Patch simulateWhatIf: analyzeCostOverrun(clone,{}) instead of (clone,project)
  git add ai-project-control-engine.js && git commit -m "[chatgpt] restore full ai-project-control-engine + material/what-if fixes" && git push
  ```
- Delete incomplete split files (`ai-project-control-engine-a.js` etc.) after full restore.
- Local verification before incident: unit ai-project-control 8/8 PASS with patches.

## 2026-10-10 — Task Engine (still valid)
- Focused suite Task Engine 9/9 PASS; integrity loader-aware PASS.
- `buildwise-app.js` = CDN pin `9eac80bd` + ROLE_ACCESS `tasks` inject.
- Full native app restore still open (same size limit).
- **630 BLOCKED** — no false DONE.

## Prior verticals (unchanged claim)
- Project control / procurement / finance adapters: PARTIAL until authenticated runtime.
- Security docs registered 2026-10-09 — not implementation DONE.

## Blocked without human
1. 630 authenticated E2E
2. Backup secrets + verified restore drill
3. Full file restores (`buildwise-app.js`, `ai-project-control-engine.js`) via git show
4. Migration ledger reconciliation (live 106 vs tree ~40)

## 2026-10-12 — Professional benchmark + performance/security execution
- Supabase RLS: removed unrestricted project_kpi_snapshots_auth policy; active-user reads and can_write()-gated writes now apply.
- Removed duplicate KPI snapshot index; added 18 targeted FK indexes.
- Rewrote 55 direct stable auth.*() policy calls as scalar SELECT expressions without changing policy predicates/roles/commands.
- Advisor after changes: unindexed FKs 142 → 124; auth_rls_initplan and duplicate-index categories no longer reported. 34 multiple-permissive-policy findings remain.
- Security advisor remains: 14 authenticated-callable SECURITY DEFINER functions + leaked-password protection disabled.
- Targeted tests: 3/3 pass locally. Full GitHub CI and authenticated cross-account browser E2E are not yet confirmed; do not mark release-ready.
- Benchmark/report: docs/BUILDWISE-PROFESSIONAL-BENCHMARK-AND-EXECUTION-2026-10-12.md.
- Production main remains untouched by this branch work; no merge/deploy claimed.

- Additional hardening: manager_edit_record now fails closed outside the active public_requests editor and allows only an explicit field list; non-null columns cannot be set to JSON null.
- Fixed public-request editor payload to write the description into requirements.text (the actual JSONB column), and fixed UUID-based edit/save buttons to pass IDs through data attributes rather than unquoted JavaScript expressions.
- Targeted local regression tests now pass **4/4**. Full CI and authenticated browser E2E still unconfirmed.


## 2026-10-19 — CRM integration status
- CRM normalization import fixed; data-quality facade reuses the canonical `import-quality.js`; CRM regression test added to `npm test`.
- Added a full-suite GitHub Actions workflow for the canonical branch. CI results have not yet been retrieved; no test-pass claim.
- Single workspace enforced in `BUILDWISE-SINGLE-SOURCE-OF-TRUTH.md`: one repository, one coding branch (`buildwise-implementation`), one writer per file, no per-agent branches or duplicate implementations.
- Backup alternatives documented in the existing runbook. Backup execution and isolated restore remain unverified.
- Production landing URL verified as `https://buildwis-ai.netlify.app`; authenticated E2E item 630 remains BLOCKED.
- PR #40 remains open and unmergeable; `main` must not receive the accumulated diverged branch until migration, backup/restore, CI, and authenticated E2E gates are reconciled.
