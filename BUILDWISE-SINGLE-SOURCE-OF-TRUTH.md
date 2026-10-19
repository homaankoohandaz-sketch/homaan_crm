# BuildWise AI — SINGLE SOURCE OF TRUTH

Status: CANONICAL
Effective: 2026-10-07

## One repository
GitHub repository: `homaankoohandaz-sketch/homaan_crm`

## One coding branch
`buildwise-implementation` is the ONLY active implementation branch.

Workers (Grok / Claude / Codex / others) must modify this repository and this branch unless a task explicitly creates a temporary review branch. Temporary branches are disposable and are not sources of truth.

## Shared workspace and file ownership (mandatory)

- Grok, Claude, Codex, ChatGPT, and every connected account/email work in this same repository: `homaankoohandaz-sketch/homaan_crm`.
- The only active coding branch is `buildwise-implementation`. Do not create per-agent or per-email implementation branches. Temporary review branches are allowed only when explicitly requested and must not become a second source of truth.
- `main` is release-only. Never push implementation work directly to `main`.
- Before editing, inspect the canonical file and current task queue. Reuse and modify the existing implementation; do not create a parallel file/module/test/engine when one already exists.
- One writer per file at a time. Parallel agents may work only on disjoint files declared in the task contract's `ALLOWED_FILES`; if files overlap, serialize the work and hand off the same file rather than forking it.
- Each task must name its owner, exact allowed files, acceptance test, and evidence location in the existing task registry. The worker must commit back to `buildwise-implementation` and update the existing `.agent-control/STATE.md` / `.agent-control/SUMMARY.md` only when relevant; never create alternate state or summary files.
- Do not add `final`, `v2`, `new`, `copy`, or dated duplicate implementations. Historical evidence may be dated, but it is not a competing source of current state.
- Before merge: inspect diff, run focused test, run full required suite/CI, reconcile migrations and backup safety, and record runtime blockers honestly. CI alone does not prove authenticated E2E.

## One release branch
`main` is the ONLY release/production branch. It receives reviewed, tested implementation from `buildwise-implementation`.

## One canonical reference for each responsibility
- Project summary / orientation: `.agent-control/SUMMARY.md`
- Current execution/runtime state: `.agent-control/STATE.md`
- Architecture: `.agent-control/MASTER-ARCHITECTURE.md`
- Acceptance checklist: `.agent-control/MASTER-CHECKLIST-v3-850.md`
- Decisions: `.agent-control/DECISIONS.md`
- Agent execution protocol: `.agent-control/AGENT_EXECUTION_PROTOCOL.md`
- Task queue: `.agent-control/TASK-QUEUE.yaml`
- Phase scope: `docs/PHASES/`
- Application code: canonical `index.html`, `buildwise-app.js`, `src/`, `supabase/`
- Tests: `tests/`

## Non-canonical files
BRIEF.md, NOW.md, phase/memory notes, handoffs, evidence and dated audit files are supporting records only. They must never become competing current-state, architecture, checklist, or summary sources.

Legacy checklists, old architecture files and old branch documentation are historical/supporting records. They must point to the canonical references and must not be used to plan new work.

## Absolute rule
Before creating any new file, checklist, summary, architecture document, task registry, or parallel implementation, search this map and the canonical reference first. If the responsibility already exists, update the existing canonical file.

## Worker rule
A worker must not:
- create a second app,
- create a second repository,
- create a second checklist,
- create a second summary/state,
- create a second task engine,
- create a new "final/v2/v3/new" copy of an existing canonical file,
- work from an uncited chat-only decision.

## Handoff
Every completed task returns its evidence to the canonical repository. Chat is not the source of truth.
