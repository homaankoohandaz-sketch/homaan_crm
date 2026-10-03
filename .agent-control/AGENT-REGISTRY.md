# BuildWise AI — Worker Registry

Updated: 2026-10-03

| Worker / Runtime | Runtime status | Role | Routing |
|---|---|---|---|
| ChatGPT | available | master/orchestrator/architecture | orchestration |
| BuildWise Worker Runtime | architecture-decided | provider-independent worker pool | canonical execution path |
| OpenCode | candidate | coding runtime/reference | coding adapter |
| smolagents | candidate | domain/tool agent runtime/reference | research/domain adapters |
| vLLM | candidate | self-hosted model serving | model adapter |
| Ollama | candidate | local/WSL model runtime | local development / low-volume |
| Grok | optional adapter | implementation + review + GitHub/control | provider fallback when available |
| Claude | optional adapter | review/QA | provider fallback when available |
| Codex | optional adapter | implementation/test | provider fallback when available |
| Gemini | optional adapter | research/multimodal | provider fallback when available |
| n8n | optional adapter | automation | not required |

## Canonical rule
445-449 are capability requirements, not mandatory vendor runtimes. The BuildWise Worker Runtime owns execution; provider runtimes are replaceable adapters.

## Routing
The router must select by task suitability, access, cost, reliability and policy/budget—not by vendor name alone.

## Budget
Every task may be bounded by token, time, cost, iteration, tool and data-scope limits.

## Independence
BuildWise must remain operational if any single AI provider or automation vendor becomes unavailable.

## Safety
No credentials are stored in the repository. Production/destructive/security-sensitive changes remain approval-gated.
