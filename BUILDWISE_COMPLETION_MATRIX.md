# BuildWise AI — Completion Matrix

This file is the implementation ledger. Do not mark a row complete because a table, screen, agent description or stub exists.

| Domain | Required implementation | Current state | Completion gate |
|---|---|---|---|
| People/CRM | CRUD, dedup, permissions, import/export, search | partial | E2E |
| Leads | lifecycle, scoring, follow-up, source tracking | partial | E2E |
| Conversation | capture, extraction, next action | partial | E2E |
| Properties | asset model, freshness, documents, media | partial | E2E |
| Market/Valuation | comps, valuation, confidence, as-of | partial | unit + integration |
| Owner/Land | hold/build/sell/invest comparison | designed/partial | scenario E2E |
| Feasibility | development assumptions, sensitivity, risk | partial | scenario E2E |
| Financial | cashflow, IRR, NPV, ROI, waterfall | partial | unit + scenario |
| Architecture | constraints, options, area/facade outputs | designed | E2E |
| Sales Engineering | unit inventory, presale/ready/barter | partial | E2E |
| Matching | buyer↔asset, constraints, ranking evidence | partial | E2E |
| Barter | land/unit/material barter matching | designed/partial | E2E |
| Deal Intelligence | graph, opportunity detection, next action | designed | E2E |
| Negotiation | scenario, concessions, guardrails | designed | unit + E2E |
| Legal/Contract | document extraction, clauses, obligations, risk | designed | review + E2E |
| Project Control | project/WBS/milestones/schedule | partial | E2E |
| BIM/4D/5D | model linkage and progress/cost dimensions | designed | integration |
| BOQ/Estimation | quantity, rate, budget, variance | partial | unit + E2E |
| Cost Control | commitments, actuals, forecast, variance | partial | E2E |
| Price/Material | dated price book and replacement value | partial | integration |
| Procurement | RFQ/order/status/vendor linkage | partial | E2E |
| Material Passport | approved source/spec/revision/history | designed | E2E |
| Inventory | receipts/issues/stock | designed | E2E |
| Waste | planned vs actual waste and causes | designed | E2E |
| Workforce | labor plan/productivity | designed | E2E |
| Field/Daily | daily logs, blockers, evidence | partial | E2E |
| Photo Intelligence | site/photo evidence extraction | designed | integration |
| QA/QC | inspections, defects, closure | partial | E2E |
| RFI | issue/question/response/closure | partial | E2E |
| Change Orders | scope/cost/time impact and approval | partial | E2E |
| Risk | probability/impact/mitigation/monitoring | partial | E2E |
| HSE | incidents/inspections/actions | partial | E2E |
| Delay | schedule variance and prediction | designed | integration |
| Cash Flow | planned/actual/forecast | partial | E2E |
| Vendor Intelligence | performance/history/risk | designed | E2E |
| Workforce Intelligence | capacity/skills/productivity | designed | E2E |
| Document Intelligence | OCR/extraction/version/evidence | partial | E2E |
| Universal Search | cross-domain search with permissions | partial | E2E |
| Knowledge Base | governed source/evidence retrieval | designed | E2E |
| Benchmark | project/market benchmarks | designed | integration |
| Learning | outcome/reward/feedback loop | partial | E2E |
| Offline Field | field capture + sync/conflict handling | designed | device E2E |
| AI Orchestrator | routing, tools, specialist agents, audit | partial | multi-agent E2E |
| ChatGPT Advisory | evidence synthesis + challenge + decision support | partial | E2E |
| Next Best Action | ranked actionable recommendations with evidence | designed | E2E |
| Universal AI Memory | scoped memory + permissions + audit | designed | E2E |
| Security | RLS, safe views, secret hygiene, audit | partial | security gate |
| Room/Showroom | owner/customer/investor presentation | partial | E2E |

## Status vocabulary
- MISSING
- DESIGNED_ONLY
- PARTIAL
- IMPLEMENTED_NOT_VERIFIED
- VERIFIED
- BLOCKED

Only VERIFIED means complete.
