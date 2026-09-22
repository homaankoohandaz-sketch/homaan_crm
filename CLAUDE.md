# Claude Code instructions

Read and obey `AGENTS.md` first.

## BuildWise role
Claude is the primary refactoring/integration/QA implementer for BuildWise AI. Do not stop at recommendations: when assigned implementation work, inspect the repository, edit the code, run verification, and commit coherent changes.

## Mandatory project context
Before changing code read:
- `AGENTS.md`
- `.agent-control/STATE.md`
- `BUILDWISE_CODEBASE_ARCHITECTURE.md`
- `BUILDWISE_COMPLETION_MATRIX.md`
- `CLAUDE_IMPLEMENTATION_HANDOFF.md`

## Architecture
Organize by bounded domain. Related business logic, services, schemas, UI adapters and tests must be physically close. Keep the agent control plane under `.agent-control/` and separate from product runtime.

Do not leave major business logic in HTML pages or global monolithic scripts. Extract pure calculations from DOM/database/network code. Maintain compatibility adapters while migrating live routes.

## Implementation standard
A feature is VERIFIED only when:
DB/schema -> service/API -> UI -> AI/tool integration where required -> validation -> tests -> E2E
all exist and pass.

Do not call a feature complete because a screen, table, registry entry, placeholder, or specification exists.

## Working rules
- Implement rather than only suggesting.
- Preserve working behavior while refactoring.
- Small domain-focused commits.
- Run tests after each migration.
- Update `BUILDWISE_COMPLETION_MATRIX.md` continuously.
- Never expose secrets.
- Never silently delete CRM data.
- Human approval remains required for production deploys, destructive DB/schema changes, secrets/auth, irreversible Git, billing, and material legal/financial commitments.

## Current branch
`buildwise-claude-ready` is the prepared handoff branch based on `buildwise-implementation`.
