# BuildWise AI — Agent Runtime Independence Decision
Date: 2026-10-03
Branch: buildwise-implementation
Status: DECIDED

## Decision
Checklist items 445-449 are not five vendor runtimes to be implemented independently.

They are capability requirements that must be fulfilled by one provider-agnostic BuildWise Agent Runtime with replaceable adapters.

### Capability mapping
| Legacy item | New canonical capability |
|---|---|
| 445 Codex Worker | Coding/implementation worker adapter |
| 446 Claude Worker | Review/QA/reasoning worker adapter |
| 447 Gemini Worker | Research/multimodal worker adapter |
| 448 n8n | Workflow/automation adapter |
| 449 Independent Agent Execution | Canonical independent worker pool |

No feature is blocked merely because a specific vendor runtime is unavailable.

## Reuse-first implementation sources
- OpenCode: open-source, provider-agnostic coding-agent runtime; supports local models and multiple providers. Use as a reference/runtime candidate for coding workers.
- smolagents: lightweight open-source, model-agnostic agent framework with CodeAgent and ToolCallingAgent; supports local Transformers/Ollama and other providers. Use as a reference/runtime candidate for domain workers.
- vLLM: self-hostable inference server with OpenAI-compatible APIs. Use as a scalable model-serving layer when GPU infrastructure is available.
- Ollama: local model runtime option for development/desktop/WSL and low-volume private inference.

These projects are dependencies/candidates, not architectural authorities. BuildWise control-plane contracts remain the source of truth.

## Canonical architecture
ChatGPT/Master
→ BuildWise Control Plane
→ Task Contract
→ Budget/Quota Gate
→ Worker Scheduler
→ Worker Runtime
→ Model Adapter
→ Tool Adapter
→ Sandbox
→ Evidence/Verification
→ Learning/Performance Memory

The model provider is an interchangeable implementation detail.

## Three access lanes
1. FREE — bounded local/low-cost execution; strict task/token/time limits.
2. PRO — larger execution budget and broader tool/model access.
3. PREMIUM — highest bounded budget, stronger models/tools and priority execution.

The exact numeric quotas are configuration, not architecture. Every request receives:
- token budget
- time budget
- cost budget
- max iterations
- allowed tools
- allowed data scope
- escalation policy

## Exhaustion behavior
When a user's AI budget is exhausted:
1. Do not silently incur provider cost.
2. Stop the AI task at the safe boundary.
3. Preserve the partial/evidence state.
4. Offer human-advisor escalation.
5. Route the case to an advisor queue with the minimum required context.

Human escalation is a product feature, not an error path.

## Independence principle
BuildWise must remain operational if any one of Codex, Claude, Gemini, n8n, OpenAI, Anthropic, Google or another provider changes pricing, access, API, rate limits or availability.

Provider-specific adapters may be added or removed without changing the business/domain layer.

## Learning principle
Learning is based on task outcomes, not provider identity.

Persist:
- task type
- input class
- selected runtime/model
- budget
- execution result
- verification result
- latency
- failure class
- human correction
- downstream business outcome where measurable

Do not train or mutate a model automatically from unverified user data. Learning first improves routing, prompts, tool choice, retrieval and workflow policy; model fine-tuning is a later controlled stage.

## 10,000-user scaling principle
Do not create one permanent AI process per user.

Use stateless task workers plus a queue/scheduler and shared cached context. User state remains in BuildWise data stores; workers are disposable.

The system must enforce per-user and global concurrency/budget limits and record actual consumption.

## n8n decision
n8n is optional, not required. Existing BuildWise Edge Functions, scheduled jobs and a future queue/worker layer are the canonical path. A self-hosted automation engine can be plugged in later only when it materially reduces implementation or operating cost.

## Acceptance
445-449 are considered architecturally superseded by this capability model. They must not be marked DONE merely because an external runtime is connected.

Runtime implementation remains subject to:
IMPLEMENTED + TESTED + RUNTIME VERIFIED + UI VERIFIED where applicable + SECURITY VERIFIED where applicable.
