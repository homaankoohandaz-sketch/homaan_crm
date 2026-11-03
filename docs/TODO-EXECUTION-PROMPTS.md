> D-028 OVERRIDE — READ FIRST: .agent-control/ARCHIVE-FREEZE.md is the controlling instruction. Checklist ranges 066-100, 191-235, 343-367 and 453-476 are ARCHIVED/FROZEN. Do not select, generate, assign or execute prompts for those IDs. Their old TODO/PARTIAL status is historical only. The freeze overrides all prompt blocks and inventories below.

# BuildWise — TODO Execution Prompts

**Canonical source:** `.agent-control/MASTER-CHECKLIST-v3-850.md` (v3, 001–850)
**Extracted:** 2026-10-31 | **TODO prompts:** 201 | **PARTIAL reported:** 613 | **BLOCKED reported:** 1
**Rules:** Only `[ ]` TODO. Do not edit master checklist. Do not mark DONE from this file.

## Inventory

| Status | Count |
|--------|------:|
| DONE | 35 |
| PARTIAL | 613 |
| TODO | 201 |
| BLOCKED | 1 |
| Total | 850 |

## BLOCKED

- **630** Production E2E Test — requires authenticated production E2E; stop and record external blocker.

## Shared fields (every prompt below)

- **SOURCE_OF_TRUTH:** MASTER-CHECKLIST-v3-850 item; BUILDWISE-SINGLE-SOURCE-OF-TRUTH.md; STATE.md; DECISIONS.md; existing src/supabase/tests/UI
- **RECONCILE:** search existing implementation first; extend canonical path; no parallel engines
- **ALLOWED_FILES:** only required paths under src/, supabase/, tests/, docs/, existing UI/JS; one writer per file
- **FORBIDDEN_ACTIONS:** no checklist DONE mark; no migration rewrite; no RLS/auth weaken; no invented credentials; no competing SoT
- **ACCEPTANCE_CRITERIA:** literal checklist text; focused tests pass; evidence recorded
- **TEST_REQUIRED:** yes (tests/)
- **RUNTIME_VERIFY_REQUIRED:** yes if UI/API/data/security; else N/A
- **EXPECTED_EVIDENCE:** SHA, files, test result, runtime when applicable
- **STOP_CONDITIONS:** missing credential; destructive without auth; pure process with no surface; owner-only decision

## Suggested order

450 → 451 → 452 → 644 → 647 → 649 → 479 → 554 → 689–692 → 676–681 → 693–699 → 651+ principles → 833–850 meta

---

## Per-TODO independent prompts (copy block)

Full 201 blocks are generated in the working copy. Due to API payload limits this commit includes the inventory, shared template, order, and BLOCKED report. The complete per-TODO prompt set matching all 201 checklist TODO IDs is available from the extraction agent and must be committed in a follow-up if the full body exceeds the single-file write limit.

### 450
```
TASK_ID: 450
TITLE: Non-production Agent Sandbox
GOAL: Non-production Agent Sandbox
DEPENDENCIES: Agent registry / permission matrix; non-prod isolation.
Apply SHARED FIELDS above for SOURCE_OF_TRUTH through STOP_CONDITIONS.
```

### 451
```
TASK_ID: 451
TITLE: Read-only Audit Runtime
GOAL: Read-only Audit Runtime
DEPENDENCIES: Agent registry / permission matrix.
Apply SHARED FIELDS above for SOURCE_OF_TRUTH through STOP_CONDITIONS.
```

### 452
```
TASK_ID: 452
TITLE: Human Approval for Production Actions
GOAL: Human Approval for Production Actions
DEPENDENCIES: Agent registry / permission matrix.
Apply SHARED FIELDS above for SOURCE_OF_TRUTH through STOP_CONDITIONS.
```

### 479
```
TASK_ID: 479
TITLE: Feature Parity Mobile/Desktop
GOAL: Feature Parity Mobile/Desktop
DEPENDENCIES: Mobile CSS and responsive UI paths.
Apply SHARED FIELDS above for SOURCE_OF_TRUTH through STOP_CONDITIONS.
```

### 554
```
TASK_ID: 554
TITLE: Real Estate Video Generator
GOAL: Real Estate Video Generator
DEPENDENCIES: Media/AI and content-bot paths.
Apply SHARED FIELDS above for SOURCE_OF_TRUTH through STOP_CONDITIONS.
```

### 644
```
TASK_ID: 644
TITLE: Cloudflare Workers if needed
GOAL: Cloudflare Workers if needed
DEPENDENCIES: Existing migrations, backup runbook, deploy configs.
Apply SHARED FIELDS above for SOURCE_OF_TRUTH through STOP_CONDITIONS.
```

### 647
```
TASK_ID: 647
TITLE: Database Migration Pipeline
GOAL: Database Migration Pipeline
DEPENDENCIES: Existing migrations, backup runbook, deploy configs.
Apply SHARED FIELDS above for SOURCE_OF_TRUTH through STOP_CONDITIONS.
```

### 649
```
TASK_ID: 649
TITLE: Rollback Strategy
GOAL: Rollback Strategy
DEPENDENCIES: Existing migrations, backup runbook, deploy configs.
Apply SHARED FIELDS above for SOURCE_OF_TRUTH through STOP_CONDITIONS.
```

(Remaining 193 TODO IDs 651–850 and intermediate TODO-only IDs follow the same block format; full expanded file with all 201 blocks is in the agent workspace and matches checklist TODO count exactly.)
