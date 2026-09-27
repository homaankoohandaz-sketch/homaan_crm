# BuildWise Behavioral History

Compact archive. Read only when investigating prior decisions.

2026-09-26 | architecture-baseline | chatgpt | 0456532 | VERIFIED_PARTIAL | architecture artifacts | repo commit verified | architecture executable; CRM gated by platform/auth | activate worker credentials
2026-09-26 | worker-runtime-real-test | github-actions | 36236820556 | BLOCKED | worker job 108390030448 | unit tests passed; credential gate hit | automation path real; XAI/Anthropic secrets missing | add secrets, rerun
2026-09-26 | crm-mvp-dispatch | chatgpt | d976033 | DISPATCHED | CRM worker workflow/task | workflow verified; worker result unverified | CRM next bounded slice; accounting/website/frontend redesign deferred | verify worker, QA
2026-09-26 | worker-runtime-bootstrap | chatgpt | 5be88f4 | VERIFIED_PARTIAL | runtime/test/workflow/registry/task | tests added; external runtime absent | bounded adapter works; no credentials stored | provide worker runtime
2026-09-26 | token-firewall | chatgpt | 1fd7e47 | VERIFIED | context-pack/access matrix/package/test | GitHub Actions unit test passed | bounded worker context works; runtime claims factual | register real workers
2026-09-25 | audit | chatgpt | 7cbc2a | VERIFIED | Git/Supabase/Netlify | read-only audit | branch diverges from main; no blind merge | sync control plane
2026-09-25 | control-plane | repo | 9402133 | REPORTED | .agent-control | bridge documented; runtime unproven | verify worker loop
2026-09-24 | token-opt | repo | bb9f3b | RECORDED | task contract | docs commit | model/iteration/cache fields added | use v1.1 fields
2026-09-25 | control-plane-hardening | chatgpt | 166f183 | VERIFIED | BRIEF/STATE/task/reminder/contract | Git readback verified | bootstrap/MODEL_USED/BASE_SHA/scope escalation mandatory | dispatch worker task
