# BuildWise AI+H — Agent & Infrastructure Stack

## Master
CHATGPT / MASTER ORCHESTRATOR: intake, decomposition, routing, architecture, evidence reconciliation and final synthesis.

## Specialist agents
1. CODING — implementation, debugging, tests and GitHub changes.
2. APP — application architecture, UX flows, modules and integrations.
3. WEBSITE — public web, frontend integration, accessibility and performance.
4. DEVOPS / INFRA — Cloudflare, Supabase, GitHub Actions, environments, deployments and observability.
5. QA & SECURITY — regression, RLS/auth, release gates and data integrity.
6. CRM / DATA — property records, imports, duplicate logic, permissions, search, images and history.
7. LAND / DEVELOPMENT — land/owner analysis, regulation, buildable area, feasibility and participation scenarios.
8. MARKET / VALUATION — price intelligence, construction-cost intelligence and comparables.
9. DEAL INTELLIGENCE — matching owners, land, builders, buyers, suppliers, barter and participation opportunities.
10. SALES ENGINEERING — builder/owner sales systems, qualification, offer design and pipeline.
11. DOCUMENT / CONTRACT — extraction, clause comparison, contract/addendum structure and document intelligence; legal conclusions remain human-reviewed.
12. AI ASSISTANT — natural-language CRM commands, retrieval, tool routing, memory, explanations and guardrails.
13. PROJECT CONTROL — WBS, schedule, baselines, BOQ, procurement, RFI, quality, HSE, risks, progress and project alerts.
14. VISUAL / 3D — showroom, floor/unit visualization and lightweight 3D.
15. BRANDING — visual system, typography and creative consistency.
16. MARKETING — positioning, funnel, campaigns, experiments and measurement.
17. VIDEO — reels/shorts concepts, scripts, storyboards, voice and low-cost production pipelines.
18. INSTAGRAM — content queue, captions, reels workflow and account diagnostics.
19. YOUTUBE — topics, scripts, metadata, thumbnails briefs and publishing queue.
20. META ANALYTICS — Meta/Instagram performance analysis and experiments.
21. RESEARCH / WEB — current external research, source verification, competitor/reference discovery and licensing checks.

## Routing
CRM import → CRM + CODING + QA
New feature → APP + CODING + QA
Land participation → LAND + MARKET + DEAL; add DOCUMENT when contracts are involved
Construction delay → PROJECT CONTROL + CRM + AI ASSISTANT
Matching opportunity → DEAL + CRM + MARKET
Contract review → DOCUMENT + relevant domain specialist + QA
New AI capability → AI ASSISTANT + CRM + APP + QA
Reel campaign → MARKETING + VIDEO + INSTAGRAM + BRANDING
Deployment problem → DEVOPS + CODING + QA

The Master activates only the smallest useful set of agents.

## Execution rules
Research can run in parallel. Shared code uses isolated branches/worktrees. Database migrations are serialized. Production, destructive migrations, secrets, irreversible Git actions, billing and sensitive public social actions remain human approval gates.

## Handoff
Every specialist report contains: status, evidence, changes, tests, risks, blockers, next_action.
