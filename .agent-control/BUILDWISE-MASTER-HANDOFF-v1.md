# BUILDWISE MASTER HANDOFF v1
updated: 2026-09-24
purpose: canonical condensed context for ChatGPT, Claude, Grok and future workers

## 0. FIRST RULE — ALWAYS DO THIS BEFORE ANYTHING ELSE
1. Read this file.
2. Read `.agent-control/AGENT-GOVERNANCE-v1.md`.
3. Read `.agent-control/BRIEF.md`.
4. Read only the latest relevant entries of `.agent-control/memory/PERFORMANCE.md`.
5. Identify the active Task Contract and its TASK_ID, BASE_SHA, FILES_ALLOWED and acceptance criteria.
6. Inspect current GitHub branch/HEAD and detect newer overlapping changes.
7. If there is an overlap/conflict: STOP, report CONFLICT, do not overwrite.
8. Only then inspect/edit the minimum required code.
9. Never claim DONE without implementation + verification evidence.

Routine project state must NOT be manually relayed by Hooman. Agents must recover it from GitHub + .agent-control. Ask Hooman only for a genuinely human-gated decision, missing secret/credential, or consequential approval.

## 1. PRODUCT — THE CORE DECISION
BuildWise AI+H is NOT a simple CRM.
It is a Real Estate Operating System for the full real-estate lifecycle.

Core direction:
- turn real-estate opportunities into structured, searchable, analyzable and actionable assets;
- connect owner/land analysis, builder engineering, property inventory, matching/deal intelligence, construction control, customer interaction and AI assistance;
- AI assistants report upward to ChatGPT as professional advisor/coordinator;
- the system should progressively convert deals/opportunities into leads, actions and measurable outcomes.

Do not reduce the product back to a basic contact/property CRM.

## 2. PRODUCT MODULES ALREADY DECIDED
A) Owner / Land:
- land intake and normalization
- dimensions/frontage/streets/location
- zoning/municipal/regulatory constraints
- development feasibility
- buildable area / footprint / floors / use mix
- project economics and scenarios
- GIS/maps/CAD/municipal rules as future knowledge inputs

B) Builder / Sales Engineering:
- project definition
- unit/product engineering
- pricing and sales logic
- participation/development structures
- investor/owner matching
- technical + commercial presentation

C) Property Bank / CRM:
- mobile-first UI
- manual single entry and Excel import/export
- large/batched imports
- filters by region, area, regulation, price, bedrooms, land/apartment/office/commercial, klangi etc.
- AI-assisted search
- image/archive support
- duplicate handling must NOT merge different people merely because surnames match
- same-phone records are not automatically deleted

D) Matching / Deal Intelligence:
- match owners, land, builders, investors, properties and requirements
- surface deal opportunities
- turn matching into leads/tasks

E) Construction Control:
- WBS
- Gantt/schedule
- BOQ
- procurement
- RFI
- quality
- HSE
- risk
- progress
- project controls and reporting

F) AI:
- specialist assistants by module
- shared project context
- AI gateway/orchestrator
- ChatGPT remains master architecture/decision/synthesis layer
- workers execute bounded tasks
- prompts are not proof that a worker is actually live

G) Customer side:
- customer/request panel
- AI assistant
- request-to-consultant connection
- project/property presentation and sharing
- future promotion/lead flows

## 3. PRODUCT / BUSINESS ROADMAP
Direction discussed:
- free / pro / premium evolution
- Iran-compatible registration/security
- Shiraz-first practical deployment
- later ingestion of maps/CAD/GIS/municipal rules
- customer-facing experience similar in simplicity to property marketplaces, but with AI and professional workflow
- consultant connection from user requests
- promotion with user's business contact where appropriate

## 4. ENGINEERING / DATA PRINCIPLES
- Supabase is a core backend/data layer already used.
- GitHub is the code source of truth.
- `.agent-control/` is the coordination source of truth.
- Do not replace working architecture merely because a new tool exists.
- Prefer incremental, reversible changes.
- Preserve existing skeletons unless a change is explicitly justified.
- No destructive rewrite of the app.
- Large imports must be chunked/batched.
- Secrets never go into source, prompts, memory or logs.
- Runtime health must be tested independently from documentation/control-plane health.

## 5. AGENT RESPONSIBILITIES — FINAL WORKING MODEL
### ChatGPT
Master Operator + Software Architect.
Owns:
- system architecture
- module architecture
- data/API/security architecture
- decomposition into Task Contracts
- worker routing
- conflict resolution
- synthesis
- final architecture/integration/release decision
- small scoped implementation when useful or when other coding capacity is unavailable
ChatGPT is the architecture authority.

### Claude
Primary Coding + Review Partner.
Owns when assigned:
- implementation
- refactor
- debugging
- tests
- code review
- integration/QA
Claude does NOT redefine architecture independently.
Claude can work read-only if write access is unavailable. In that mode:
- inspect the exact task and files;
- produce patch/diff/code as deliverable;
- report tests/evidence;
- ChatGPT can review, apply and upload the code through GitHub.

### Grok
GitHub Bridge + Repository Operations.
Best uses:
- inspect repository/branches/commits/PRs
- maintain .agent-control documents
- perform approved GitHub operations
- prepare branches/commits/PRs
- verify repository state
- maintain compact performance/handoff records
- suitable current web/repository research
Grok is not the architecture owner.

## 6. CODING FLOW
Default:
Business requirement
→ ChatGPT architecture
→ Task Contract
→ Claude implementation
→ tests/evidence
→ ChatGPT review/integration
→ Grok repository operations when useful
→ verified commit/PR
→ release decision

Alternative when Claude is read-only/unavailable:
Business requirement
→ ChatGPT architecture + Task Contract
→ Claude read-only review/code patch
→ ChatGPT applies/tests/commits
→ Grok may handle repository housekeeping
→ release decision

For small scoped changes ChatGPT may implement directly.

Never allow ChatGPT and Claude to edit the same file concurrently.

## 7. TASK CONTRACT IS THE UNIT OF WORK
Every non-trivial task must define:
TASK_ID
OWNER
REVIEWER
BASE_SHA
GOAL
FILES_ALLOWED
ACCEPTANCE_CRITERIA
TESTS_REQUIRED
CURRENT_STATUS
NEXT_ACTION

Workers must not expand scope silently.

## 8. SAFE GIT MODEL
Before editing:
- establish BASE_SHA;
- inspect newer changes;
- check overlapping paths;
- if overlap with newer work exists, report CONFLICT and stop;
- work on a branch for non-trivial changes;
- keep commits small and reversible;
- main receives only verified changes;
- record commit SHA and tests.

DONE means:
implementation exists + acceptance criteria satisfied + tests/checks actually run + evidence recorded.

## 9. LOWEST-TOKEN AUTOMATION MODEL
Do NOT build an always-on LLM coordinator.

Preferred event-driven loop:
Human request
→ ChatGPT creates/updates Task Contract once
→ GitHub shared state
→ minimum capable worker wakes
→ worker executes
→ tests
→ compact handoff
→ Performance Memory event
→ reviewer only if needed
→ ChatGPT intervenes only for architecture/conflict/release decisions

Stable instructions are stored in .agent-control; workers receive only variable task context and minimum necessary code.

A lightweight GitHub Actions/dispatcher mechanism is preferred over adding another LLM just to coordinate agents.

## 10. SHARED MEMORY / CONTEXT
Canonical layers:
1. Git = code/deployable truth
2. .agent-control = coordination truth
3. BRIEF.md = current short status
4. PERFORMANCE.md = compact operational history
5. Task Contract = current executable scope

Startup context order:
this master handoff
→ governance
→ BRIEF
→ recent performance
→ active task
→ minimum relevant files/diff

Do not load the whole repository/history by default.

## 11. CURRENT CONTROL-PLANE WORK ALREADY DONE
Existing main control-plane files include:
- AGENTS.md
- CLAUDE.md
- .agent-control/AGENT-SKILL-LOW-TOKEN.md
- .agent-control/AGENT-SKILL-PERFORMANCE-MEMORY.md
- .agent-control/AGENT-TASK-CONTRACT-v1.md
- .agent-control/AGENT-RUNTIME-MATRIX.yaml
- .agent-control/AGENT-REGISTRY.yaml
- .agent-control/PROTOCOL.md
- .agent-control/BUILDWISE-AGENT-STACK.md
- .agent-control/PROMPT-CACHING.md
- .agent-control/TOKEN-OPTIMIZATION.md
- .agent-control/BRIEF.md
- .agent-control/STATE.md
- .agent-control/PERFORMANCE* files
- .agent-control/PROMPTS-FOR-OTHER-AGENTS.md
- .agent-control/PROMPTS-v2.md
- official v2 role prompts for ChatGPT, Claude and Grok

Governance branch / PR currently created:
branch: governance-agent-architecture-v1
PR: #5
PR title: docs(control-plane): establish canonical agent governance and task dispatch
head: b84b3f495cfea0686b73471c33b7a46f3f8f6038
base: c07ca94935c9a2846704c713e1b9f9681d57f621
status: OPEN / not yet merged

Files added in PR #5:
- .agent-control/AGENT-GOVERNANCE-v1.md
- .agent-control/TASK-DISPATCH-v1.md
- .agent-control/prompts/AGENT-BOOTSTRAP-v1.md

Important: PR creation does NOT mean the changes are merged or runtime is operational.

## 12. CURRENT RUNTIME STATUS / BLOCKERS
Known status from current project state:
- token optimization + performance memory are prepared;
- runtime is still blocked on Codex Tasks authentication;
- Telegram webhook secret needs human-gated handling;
- a live AI gateway does not yet prove the full specialist layer is live;
- previous audits did not prove all worker runtimes are authenticated/live;
- do not mark Codex/Claude/Gemini/n8n as live without direct evidence.

## 13. HOSTING / DEPLOYMENT DECISION
Netlify is NOT rejected.
It remains a valid environment for:
- bringing up the HTML/front-end;
- checking UI/JS;
- checking Supabase connection;
- preview/testing;
- GitHub-connected deployment.

A previous Netlify problem is not proof that Netlify is unsuitable.
Cloudflare may be tested as a second environment, not as a forced replacement.
Do not change hosting merely to avoid debugging the application.

## 14. EXISTING IMPORTANT APP / INFRA CONTEXT
Known project assets/areas include:
- index.html
- import.html
- feasibility.html
- buildwise-app.js
- project-control.html
- visual-project.html
- property-bank/app/buildwise-app
- telegram-bot.ts
- DATABASE_SCHEMA.sql
- README.md
- STEPS_REPORT.md
- engines.js
- n8n_blueprint_v4.json
- Supabase Edge Functions including ai-orchestrator, crm-data-agent, storage-setup
These names are context only; workers must inspect actual current files before changing them.

## 15. HISTORICAL DECISION THEMES THAT MUST NOT BE LOST
The project has accumulated hundreds of decisions across prior conversations. This file is a condensed canonical map, not a literal transcript of every historical decision.
Repeated principles:
- preserve the project skeleton; add rather than delete unless explicitly decided;
- no uncontrolled rewrite;
- architecture first;
- minimum capable worker;
- evidence before DONE;
- shared state in GitHub;
- no routine manual relaying by Hooman;
- avoid token-heavy whole-repo prompts;
- event-driven automation;
- human approval for destructive/production/secrets/consequential operations;
- keep rollback possible;
- separate documentation readiness from runtime readiness;
- BuildWise is an operating system, not a simple CRM.

If a historical decision appears to conflict with this document, resolve by:
explicit current human decision > this canonical governance > active Task Contract > PROTOCOL > role prompt > older memory.

## 16. IMMEDIATE NEXT ACTIONS
1. Do NOT start broad coding yet.
2. First verify/merge governance PR #5 only with the appropriate human approval.
3. Then perform P0 runtime bootstrap/read-only audit.
4. Authenticate/verify one real worker before claiming agent automation.
5. Establish the first small implementation Task Contract.
6. Use Claude for bounded coding if write access is available; otherwise read-only patch delivery to ChatGPT.
7. Use Grok for repository/branch/commit/PR/control-plane operations.
8. ChatGPT remains architecture owner and final integration/release authority.
9. After each meaningful task, append one compact Performance event.
10. Only after runtime safety is established, expand automation.

## 17. REQUIRED WORKER HANDOFF
HEAD: <sha>
TASK: <id>
CHANGED: <paths>
RESULT: <DONE|BLOCKED|CONFLICT|READY>
TESTS: <actual evidence>
DECISION: <one line>
NEXT: <agent> -> <action>
