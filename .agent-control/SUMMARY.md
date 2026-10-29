# BuildWise AI — SUMMARY

Updated: 2026-10-20 (experimental shared-workspace mode)
Branch: main — experimental/internal review

## Single source of truth
- Workspace: `homaankoohandaz-sketch/homaan_crm`
- Active implementation branch: `main` — all nine phases, experimental/internal review
- This is not a release candidate. Release hardening, backup rollout, final security audit, and release approval are deferred to Phase 09 / final stage.
- Summary: this file | State: `.agent-control/STATE.md` | Architecture: `.agent-control/MASTER-ARCHITECTURE.md` | Checklist: `.agent-control/MASTER-CHECKLIST-v3-850.md`
- Coordination: ChatGPT = architecture/task orchestration/review; Claude = coding; Grok = assigned implementation/review/runtime work; user = product decisions and shared review.
- All workers target `main`; one writer per file, concurrent work only on disjoint declared files. Every handoff reports commit, tests, runtime evidence, blockers, and next task.
- CI/test success is not equivalent to runtime/UI completion. Do not mark DONE without the checklist evidence criteria.

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
- Added a full-suite GitHub Actions workflow for the canonical branch. GitHub Actions run `39290618908` passed `npm test` and `tests/release-smoke.mjs` on code commit `3e272704`; the CRM regression test was included. Later commits are documentation/state-only, with the newest workflow run still queued/running at last check.
- Single workspace enforced in `BUILDWISE-SINGLE-SOURCE-OF-TRUTH.md`: one repository, one coding branch (`buildwise-implementation`), one writer per file, no per-agent branches or duplicate implementations.
- Backup alternatives documented in the existing runbook. Backup execution and isolated restore remain unverified.
- Production landing URL verified as `https://buildwis-ai.netlify.app`; authenticated E2E item 630 remains BLOCKED.
- PR #40 remains open and unmergeable; `main` must not receive the accumulated diverged branch until migration, backup/restore, CI, and authenticated E2E gates are reconciled.


## 2026-10-19 — Canonical main + Excel import
- Canonical branch is `main`; main and the former implementation branch currently point to the same code head. No per-agent/email branches; one writer per file.
- The implementation merge commit is `2e7a7e98`; latest verified test code commit `d51443c1` passed the full `npm test` suite and release smoke in GitHub Actions run `39292216698`.
- Excel importer now routes Sheet1/Sheet4 to properties and headerless Sheet3 contact pairs to leads; it preserves contact pairs, allows rows with validation warnings to be attempted, stores raw values, and provides manager-only raw archive edit/delete. The required RLS delete policy was applied live.
- Workbook audit expectation: 5,838 property/request rows + 130 property rows + 66 contacts = 6,034 normalized CRM attempts. Workbook data is **not yet loaded** into live Supabase; requires an authenticated CRM session and upload through the app.
- Netlify production deploy is stale at commit `a4d8f074`; no authenticated Netlify session is configured, so current main has not yet been published. Authenticated E2E item 630 and backup/restore verification remain open.- 2026-10-20 [claude] Added free-plan password policy (src/core/password-policy.js: length/complexity + HIBP k-anonymity leaked check, wired into advisor signup; server-side enforcement via Edge Function still OPEN) and .github/workflows/supabase-keepalive.yml (3-day ping to avoid free-plan pause; needs secret SUPABASE_PUBLISHABLE_KEY). Backup encryption already exists on main (uses repo variable BACKUP_AGE_RECIPIENT).
- 2026-10-20 [claude] Fixed pre-existing SyntaxError in src/domains/crm/data-import.js (missing closing brace in resilient(); stray brace in loadArchive() string concat) that made CI 'syntax' and 'validate' jobs fail on main.
- 2026-10-20 [claude] Live read-only re-verification of is_active_user RLS/ACL and security advisors recorded in STATE.md; no live DB writes made.
- 2026-10-20 [claude] Live read-only Supabase re-verification recorded in STATE.md (is_active_user RLS/ACL resolved; advisor status); no live DB writes.
- 2026-10-20 [claude] Addressed review findings: server-side password enforcement (Edge Function advisor-signup, deployed; advisor signup now goes through it), 3s timeout on leak check, keepalive fails on HTTP errors (curl --fail + retries) and re-enables scheduled workflows (60-day rule). Remaining gap: direct Auth signUp API is still open until anonymous/public signups are restricted in dashboard; live smoke test pending.


## 2026-10-27 — Canonical branch and deployment correction
- Canonical code/review branch: `main` only. README and existing CI workflows now agree with `BUILDWISE-SINGLE-SOURCE-OF-TRUTH.md`.
- The retired `buildwise-implementation` ref was fast-forwarded to the exact `main` SHA `0fabd68e5885e66cb154e77dc78a3b07c1171f76`; branch comparison is now identical (0 ahead / 0 behind). No open PR should target the retired branch.
- Superseded PRs #43, #45, and preview-only #47 are closed. PR #48 was merged as `a307a12a` after focused regression coverage, full `npm test`, QA, phase-map, and application validation passed.
- Canonical review URL: https://homaankoohandaz-sketch.github.io/homaan_crm/ . GitHub Pages deployment of `main` succeeded; browser smoke verified the BuildWise role-entry view and observed no JavaScript console errors.
- Netlify primary deployment is stale: last inspected deploy SHA `4c3432e3c4cda3ba03ed6527f91d806b4b718983`, while current main is `0fabd68e`. Do not use Netlify as the latest-code review link until redeployed and SHA-matched. Cloudflare Pages deploy is blocked by missing `CLOUDFLARE_API_TOKEN`.
- Remaining PRs formerly targeting `buildwise-implementation` have been retargeted to `main`; GitHub currently reports conflicts/not-mergeable for them. Do not merge blindly; resolve and test each change against main.
- Checklist source: `.agent-control/MASTER-CHECKLIST-v3-850.md` is the only canonical acceptance checklist. Item 670 remains unchecked (content-bot professional marketing assets lack runtime/UI acceptance evidence); item 630 remains blocked pending authenticated end-to-end evidence. Do not infer completion from unit tests alone.


## 2026-10-27 — Publication safety workaround
- GitHub Pages workflow now runs full tests and release/architecture/infrastructure checks before publishing; deployment depends on successful validation. Workflow commit: `06e8a9befc0d3596cc4a45558f48d84924592dab`.
- Branch-protection settings remain inaccessible to the current GitHub integration (API 403); repository rulesets returned empty. This workaround prevents an untested/broken main commit from replacing the live Pages site, but does not block direct pushes or manual merges to main.
- The new workflow result was pending at the time this note was written; verify CI before claiming it passed.

## 2026-10-29 — phase-code-map test tolerates cache-bust query
- `tests/phase-code-map.test.js` now enforces runtime script order while accepting `?v=` cache-bust suffixes, and accepts either quote style for the construction-adapter dynamic import. `index.html` is unchanged. Root cause: cache-bust query strings broke the previous exact-string assertion. Fix committed to `main` in `594cef3408ae8f21f0bd0bb099c586fb0d880fe3`. Verify CI on the updated main SHA before claiming the suite passes.
