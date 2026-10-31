# BuildWise — TODO Execution Prompts

**Canonical source:** `.agent-control/MASTER-CHECKLIST-v3-850.md` (v3, 001–850)
**Extracted:** 2026-10-31
**Rules:** Only `[ ]` TODO items. PARTIAL and BLOCKED reported only. Do not edit the master checklist. Do not mark any item DONE from this file.

## Inventory (matches checklist)

| Status | Count |
|--------|------:|
| DONE `[✓]` | 35 |
| PARTIAL `[~]` | 613 |
| TODO `[ ]` | 201 |
| BLOCKED `[⛔]` | 1 |
| **Total** | **850** |

## BLOCKED (stop; do not implement as ordinary TODO)

- **630** — Production E2E Test
  - Requires authenticated production E2E access; complete safe local work and record the exact external blocker.

## PARTIAL (reported only; not converted to prompts)

613 items. First/last IDs for verification: 003 … 850 range items marked [~]. Full list is in the master checklist; do not invent IDs.

## Shared prompt template (apply to every TODO below)

```
SOURCE_OF_TRUTH:
- .agent-control/MASTER-CHECKLIST-v3-850.md (this TASK_ID)
- BUILDWISE-SINGLE-SOURCE-OF-TRUTH.md
- .agent-control/STATE.md / DECISIONS.md
- Existing domain code under src/, supabase/, tests/, UI entrypoints

RECONCILE: Search for existing implementation before coding; extend canonical path; no parallel engines/tables/routes.

ALLOWED_FILES: Only files required for this item under src/, supabase/, tests/, docs/, and existing UI/JS entrypoints. One writer per file.

FORBIDDEN_ACTIONS: Do not mark checklist DONE; do not rewrite migrations; do not weaken RLS/auth; do not invent credentials; do not create competing SoT files.

ACCEPTANCE_CRITERIA: Literal checklist text satisfied; focused tests pass; evidence (SHA, files, test result, runtime if UI/API) recorded.

TEST_REQUIRED: Yes — regression/acceptance under tests/.

RUNTIME_VERIFY_REQUIRED: Yes if UI/API/data/security affected; otherwise document N/A.

EXPECTED_EVIDENCE: commit SHA, changed files, test command/result, runtime evidence when applicable.

STOP_CONDITIONS: Missing external credential; destructive change without backup/auth; pure process principle with no implementable surface yet; owner-only decision required.
```

## Suggested execution order

1. Sandbox / approval: **450, 451, 452**
2. Infra: **644, 647, 649**
3. Feature surfaces: **479, 554, 689–692**
4. Project Result / Room: **676–681**
5. SoT register discipline: **693–699** (and related later items as hooks)
6. High-level REOS principles **651+**: documentation + enforcement only after concrete modules
7. Meta/process **833–850**: continuous discipline, not feature tickets

---

## Per-TODO prompts (sorted by TASK_ID)

SEE FULL FILE IN REPO — content continued in next push if truncated.
