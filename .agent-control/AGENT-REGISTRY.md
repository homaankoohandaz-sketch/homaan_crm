# BuildWise AI — Worker Registry

Updated: 2026-09-25

| Worker | Runtime status | Role | Routing |
|---|---|---|---|
| ChatGPT | available | master/orchestrator/architecture | orchestration |
| Grok | available | implementation + review + GitHub/control | primary live worker |
| Claude | handoff | review/QA | used when an external Claude handoff is available; never assumed live |
| Codex | blocked | implementation/test | fallback to Grok |
| Gemini | configured | research | fallback to Grok for implementation |
| n8n | blocked | automation | GitHub-native/runtime-independent fallback required |

## Rule
The router selects the preferred worker only when its runtime is actually usable and its capability matches the task. Otherwise it falls back to the minimum live worker.

## Current live path
ChatGPT → task contract → Grok → GitHub branch → GitHub Actions → verification → compact performance memory.

## Non-live paths
Claude/Gemini/n8n are configuration targets, not autonomous runtimes. Codex has no registered environment.

## Safety
No credentials are stored in the repository. Production/destructive/security-sensitive changes remain approval-gated.
