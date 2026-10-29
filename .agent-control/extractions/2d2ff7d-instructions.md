# Commit instruction extraction — 2d2ff7d

- Target commit: [2d2ff7d20e383ecafd91be59423cf20d08f7077e](https://github.com/homaankoohandaz-sketch/homaan_crm/commit/2d2ff7d20e383ecafd91be59423cf20d08f7077e)
- Extraction date: 2026-10-29
- Current main head observed: 99495d293eb3b67c139dd9a43da3efb42c47f5e0
- Comparison: `main` is 4 commits ahead, 0 behind; merge base is the target commit.
- Target commit changes one file: `.agent-control/EXECUTION-PROMPTS-2026-10-29.md` (+62 lines), adding commit-audit, implementation, combined execution prompts and a default sequence. It does not change application runtime code.
- Follow-up comparison against current main shows these subsequent changed files: `.agent-control/STATE.md`, `.agent-control/SUMMARY.md`, `tests/phase-code-map.test.js`. The current test change accommodates cache-busted script URLs and either quote style for the construction adapter import.
- Evidence links: [target commit](https://github.com/homaankoohandaz-sketch/homaan_crm/commit/2d2ff7d20e383ecafd91be59423cf20d08f7077e), [current main](https://github.com/homaankoohandaz-sketch/homaan_crm/commits/main), [Actions](https://github.com/homaankoohandaz-sketch/homaan_crm/actions).

## Task ledger

| ID | Origin | Type | Priority | Instruction/task | Current-main status | Dependencies | Risk | Acceptance test / evidence | Recommended action |
|---|---|---|---|---|---|---|---|---|---|
| EX-2D2-01 | target commit, execution prompt | Explicit | P1 | Reconcile current main, branches, PRs, checklist, live Supabase schema/migration ledger, and deployed revision without assuming parity | Partially present in canonical docs; latest complete reconciliation not evidenced by this commit | Read-only GitHub/Supabase/deployment access | High for database/production; low for read-only audit | Branch/ref matrix; live migration versions matched to repository SQL; deployed SHA independently fetched | Run read-only audit first; do not apply migrations during audit |
| EX-2D2-02 | target commit, execution prompt | Explicit | P1 | Inventory PARTIAL/TODO/BLOCKED checklist items and deduplicate against existing implementation | Checklist exists; fresh full inventory not verified | Read checklist and canonical modules | Medium | Task IDs mapped to code, tests, dependencies, acceptance criteria and evidence | Create bounded batches; avoid duplicating checklist items |
| EX-2D2-03 | target commit, execution prompt | Explicit | P1 | Implement safe tasks tests-first, update checklist with evidence, and commit coherent batches | Current test fix is committed; full test run for latest head not evidenced | Test runner/CI | Medium | Exact test commands and green run tied to SHA | Run targeted and full CI; only claim results reported by CI |
| EX-2D2-04 | target commit, execution prompt | Explicit | P0 | Preserve user data, secrets, RLS/authentication and migration history; no speculative production migration changes | Safety rule present in docs; operational blockers remain historically open | Backup/restore evidence and migration provenance | High | Verified backup/restore, migration parity, scoped security review | Keep production schema writes blocked until evidence closes |
| EX-2D2-05 | target commit, execution prompt | Explicit | P1 | Verify browser-level authenticated CRUD and role isolation for checklist item 630 | Previously blocked; current successful evidence not found in this audit | Authenticated browser session | High | Browser evidence for CRUD, role isolation, console/network status | Requires authenticated runtime access; do not mark complete without it |
| EX-2D2-06 | target commit, execution prompt | Explicit | P1 | Verify actual deployed URL and deployed SHA independently of GitHub commit | Current deployment SHA not established in this audit | Deployment provider access/authentication | Medium | Provider deployment metadata matches main SHA and public URL serves it | Inspect provider; keep deployment unverified until confirmed |
| EX-2D2-07 | target commit, inferred from current-main comparison | Inferred | P1 | Confirm CI for current main head after the phase-code-map regression fix | Not verified: GitHub combined statuses and PR-filtered workflow runs returned empty arrays for 99495d293eb3b67c139dd9a43da3efb42c47f5e0 | GitHub Actions workflow event/run access | Medium | Workflow run on current SHA with test and release-smoke outcomes | Inspect Actions directly; do not infer pass/fail from empty status |
| EX-2D2-08 | target commit, execution prompt | Explicit | P2 | Save traceable extraction ledgers for audited commits and distinguish explicit/inferred tasks | This ledger created | GitHub write access | Low | File is present on main and references exact source SHA/evidence | Store at this path and link existing checklist IDs as mapped |

## Prioritized execution queue

1. Verify GitHub Actions for current main SHA `99495d293eb3b67c139dd9a43da3efb42c47f5e0`.
2. Continue read-only migration/schema and branch/deployment reconciliation; production writes remain prohibited until migration provenance and backup/restore are verified.
3. Obtain authenticated browser evidence for item 630 and verify deployment SHA.
4. Build a fresh checklist inventory and execute the next safe, testable batch.

## Unresolved external blockers

- Current main's CI result is not available through the commit-status and commit-workflow-run endpoints used in this audit.
- Authenticated production E2E requires a confirmed signed-in browser session.
- Netlify/Cloudflare deployment state must be fetched from the provider; a commit alone is not deployment evidence.
- Supabase migration provenance and verified backup/restore remain prerequisites for production schema changes.
