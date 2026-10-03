# Agent Runtime Verification — 2026-10-03

## Scope
445-449: Codex, Claude, Gemini, n8n and Independent Agent Execution.

## Canonical implementation
- One provider-independent BuildWise Worker Runtime.
- Vendor runtimes are optional adapters.
- buildwise_local is the canonical independent fallback.
- Runtime uses execFile, not a shell.
- Credentials remain outside Git.
- Per-task token/time/cost/iteration budgets are enforced.
- Three per-user plans are implemented: FREE / PRO / PREMIUM.
- Quota exhaustion stops execution before dispatch and returns human_advisor escalation.
- Successful execution records measured input/output token estimates and runtime usage.

## Verification
- Real child-process worker execution: PASS
- Worker routing fallback for Codex/Claude/Gemini/n8n: PASS
- Token/time/cost/iteration budget tests: PASS
- Three-tier quota policy: PASS
- Per-user usage accounting: PASS
- Quota exhaustion -> human advisor escalation: PASS
- No credentials stored in repository: PASS by implementation inspection
- Runtime command execution uses execFile without shell interpolation: PASS

## External CI note
The repository's existing CI on commit cf08be52625b6a1b423094e112853d7a7900682d passed Agent Control Plane Validation but the repository-wide Unit Tests workflow still had unrelated failures in Plan Intelligence and Project Visualization. Those failures are not used as evidence against the worker-runtime tests.
The newly added worker-specific workflow did not receive an automatic run from the connected GitHub write path, so this record deliberately relies on direct runtime execution plus focused tests rather than claiming a GitHub CI PASS that did not occur.

## DONE rule
445-449 are DONE at the capability level because the independent runtime is implemented, focused-tested, real-runtime-tested, and vendor-specific dependencies are optional rather than required.
