# Homaan CRM — Agent Operating Contract

## Mission
Build and maintain Homaan CRM through coordinated AI agents. This repository is the source of truth for code; `.agent-control/` is the source of truth for coordination.

## Agent roles
- ARCHITECT: architecture, requirements, decisions; does not implement unless explicitly assigned.
- CODEX: implementation, debugging, tests.
- CLAUDE: review, refactoring, integration, QA.
- QA: verification, regression, acceptance criteria.
- ORCHESTRATOR: task routing, locks, handoffs, merge gates.
- HUMAN: final authority for destructive, security-sensitive, financial, production, or irreversible changes.

## Mandatory protocol
1. Read `.agent-control/STATE.md` before work.
2. Read the relevant task in `.agent-control/tasks/`.
3. Claim the task and affected files before editing.
4. Never edit a file claimed by another active agent.
5. Record important decisions in `.agent-control/memory/`.
6. Run the required verification before declaring done.
7. Write a handoff in `.agent-control/handoffs/` when another agent must continue.
8. Never expose secrets, tokens, private keys, or credentials in memory, commits, logs, or prompts.

## Git rules
- Prefer one branch/worktree per task.
- Small commits with one purpose.
- Never force-push.
- Production merges require explicit human approval.

## Current project
BuildWise is now organized around `.agent-control/SUMMARY.md` and `.agent-control/MASTER-ARCHITECTURE.md`.

### Mandatory orientation
1. Read `.agent-control/SUMMARY.md` first.
2. Read `.agent-control/MASTER-ARCHITECTURE.md` next.
3. Read only the relevant `docs/PHASES/*.md` file.
4. Then read the exact assigned task and minimum allowed files.
5. Do not scan the whole repository for routine work.
6. Do not implement new work in legacy duplicate index files (`index_FINAL.html`, `index_legacy.html`, `index3 2.html`).
7. Every structural/code change must add one short entry to `.agent-control/SUMMARY.md`.

## Authentication contract
- BuildWise application authentication is Supabase Auth; browser code may use only the publishable/anon key.
- Application authorization is separate from authentication and is resolved from `app_roles` with an active-account check.
- Server-side Edge Functions must use `supabase/functions/_shared/auth.ts` for Bearer-token verification and role authorization.
- `SUPABASE_SERVICE_ROLE_KEY` is server-only and must never be shipped to browser code, logs, prompts, or client-visible files.
- Privileged database operations may use the service-role client only after the caller's Supabase Auth identity and BuildWise role have been verified.
- New protected Edge Functions must define their allowed roles explicitly with `requireRole(req, [...])`.
