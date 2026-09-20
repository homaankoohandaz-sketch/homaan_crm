# P0 — Runtime Bootstrap + Read-Only BuildWise Audit
Status: BLOCKED_ON_CODEX_AUTH
Owner: ORCHESTRATOR
Branch: buildwise-implementation

## Objective
Establish one real implementation worker and use it to verify the current BuildWise repository before changing application behavior.

## Required sequence
1. Authenticate a Codex execution environment.
2. Read AGENTS.md, .agent-control/STATE.md and BUILDWISE-AGENT-SPECIFICATION-v1.md.
3. Perform a read-only inventory of frontend, Supabase migrations/functions, tests, CI and deployment configuration.
4. Produce a requirement-to-code matrix for the V1 path:
   People -> Property -> Lead -> Search -> Matching -> Next Action -> Deal -> Contract -> Project -> Cost/Progress -> AI.
5. Identify missing/partial/broken paths with file-level evidence.
6. Run available tests without changing application code.
7. Hand off findings to QA.
8. Do not deploy, rotate secrets, modify auth/RLS, or perform destructive migrations.

## Acceptance criteria
- Real worker runtime is authenticated and visible.
- Read-only audit artifact exists.
- Test evidence is recorded.
- No application code changed.
- Any security/auth finding is explicitly gated for human approval.
