# BuildWise AI — NEXT PHASE START / 2026-10-07

## Canonical truth
- Master acceptance register: `.agent-control/MASTER-CHECKLIST-v3-850.md`
- Architecture: `.agent-control/MASTER-ARCHITECTURE.md`
- Runtime state: `.agent-control/STATE.md`
- Current branch: `buildwise-implementation`
- No DONE without implementation + test + runtime verification; UI/security verification when applicable.

## Verified checklist state
- 850 canonical items.
- DONE: 35
- PARTIAL: 613
- TODO: 201
- BLOCKED: 1
- Current canonical checklist blob on implementation branch: `f0329d93f1a378896494cda3c34e4ae31c7f116c`

## Immediate release gate — before expanding product scope
1. Verify the exact implementation HEAD is deployed to an independently identifiable runtime URL.
2. Run authenticated browser E2E on that exact deployment.
3. Verify Task Center: create → assign → notification → Yes/No → complete/reject → move tomorrow → permission isolation.
4. Verify production data cleanup post-condition.
5. Verify the latest Supabase migration/runtime state.
6. Only after the above, promote accepted items to DONE.

## Product phase sequence after the release gate

### Phase 01 — CRM Core & Identity
Acceptance focus:
- People / Owners / Buyers / Investors / Builders / Suppliers
- Properties / Lands / Leads / Requests / Phones
- Excel / Sheets / multi-sheet import
- normalization / duplicate handling / rollback
- permissions / audit / manager governance

### Phase 02 — Land / Feasibility / Valuation
Acceptance focus:
- land analysis
- municipal evidence
- development feasibility
- construction cost
- valuation / comparable evidence
- ROI / scenario analysis
- gold / dollar / inflation comparisons

### Phase 03 — Matching / Deal Intelligence
Acceptance focus:
- opportunity detection
- property/person/builder/investor/supplier matching
- participation / barter
- deal workspace
- risk and decision evidence

### Phase 04 — Project & Construction Control
Acceptance focus:
- Project → Complex → Building → Phase → Floor → Unit
- WBS / schedule / Gantt / dependencies / critical path
- BOQ / procurement
- progress / quality / HSE / RFI / risk / corrective action

### Phase 05 — Finance / Procurement / Sales
Acceptance focus:
- project ledger / budget / actual / committed / forecast
- cash flow / receivables / payables
- procurement / approvals / orders / delivery / inventory
- sales inventory / pricing / offers / proposals

### Phase 06 — Customer / Builder Portals & Showroom
Acceptance focus:
- customer room
- builder workspace
- project presentation
- media / plans / units
- request journey
- customer notifications
- shareable proposal outputs

### Phase 07 — AI / Agents / Automation
Acceptance focus:
- section AI
- orchestrator / model router
- agent registry / task contract / tools
- permissions / audit / memory
- handoff / validation / recovery
- human approval

### Phase 08 — Website / Marketing / Content
Acceptance focus:
- interactive product demonstration
- PWA
- marketing content system
- real-estate content generation

### Phase 09 — Release / Security / Operations
Acceptance focus:
- CI/CD
- RLS / security review
- secret management
- observability
- backup / rollback
- environment separation
- production release

## Execution rule
Do not start Phase 02 merely because Phase 01 exists. Execute the smallest acceptance-gated slice that creates real user value, while the release gate remains explicit.

## First execution slice
**Runtime acceptance of the current implementation branch**, then resume the next canonical checklist items without creating a competing checklist.
