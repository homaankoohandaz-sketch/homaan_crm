# Claude Implementation Handoff

## Mission
Take the BuildWise AI repository from its current mixed CRM/prototype state to a coherent, testable Real Estate Operating System.

## Start here
1. Read AGENTS.md.
2. Read .agent-control/STATE.md.
3. Read BUILDWISE_CODEBASE_ARCHITECTURE.md.
4. Read BUILDWISE_COMPLETION_MATRIX.md.
5. Inspect the actual repository before editing.
6. Preserve working Supabase contracts unless a migration is part of the task.
7. Work on branch `buildwise-claude-ready` or a child branch.

## Required behavior
- Implement, do not merely propose.
- Refactor by bounded domain.
- Keep related code physically close.
- Extract pure business logic from DOM/network code.
- Remove duplicate calculations and duplicate page variants only after references are migrated and tests pass.
- Do not create a parallel fake application beside the existing application.
- Do not replace working functionality with placeholders.
- Use small commits grouped by domain.
- Run tests after every domain migration.
- Maintain a live progress ledger in BUILDWISE_COMPLETION_MATRIX.md.

## Priority implementation chain
`People/Property/Lead -> AI Analysis -> Matching -> Next Best Action -> Follow-up -> Deal -> Contract -> Project -> BOQ/Cost -> Progress -> Financial Result -> Learning`

The chain must work end-to-end before polishing secondary modules.

## Existing important constraints
- Human approval remains required for production deployment, destructive DB/schema changes, secrets/auth changes, irreversible Git operations, billing, and material legal/financial commitments.
- Never put credentials or secrets in source, prompts, logs or memory.
- Do not silently delete duplicate CRM records.
- Same surname is not a duplicate key.
- Same phone alone must not cause destructive merging without review.
- Keep phone visibility behind permissions/safe access paths.
- The current agent registry is specification/control-plane data; do not call an agent operational merely because it is registered.
- Verify actual runtime/tool/test behavior.

## Verification
For each completed domain:
DB/schema -> service/API -> UI -> AI/tool -> validation -> tests -> E2E.
If any layer is absent, keep the matrix below VERIFIED.
