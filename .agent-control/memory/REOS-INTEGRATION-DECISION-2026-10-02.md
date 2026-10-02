# REOS Integration Decision — 2026-10-02

## Decision
BuildWise must progress as one Real Estate Operating System by extending canonical domain modules and shared control-plane contracts. Do not create parallel engines for graph, project control, AI approval, accounting, procurement, sales, customer output or agent governance.

## Canonical integration contract
- Intelligence graph: property/person/owner/land/builder/investor/supplier/contractor/project/unit/deal/contract/money/task/document/schedule/procurement/sale.
- Project control: WBS, schedule, Gantt, critical path, KPI, workflow, procurement, accounting, cash flow, quality, HSE, risk, progress.
- Project configuration: workflow, KPI, accounting, procurement, schedule and sales strategy.
- AI: manager remains final authority; material actions require approval; important actions require evidence and audit.
- Customer output: title, summary, source context and next action are minimum proposal-ready output fields.

## Why
The repository already contains canonical implementations/tables for most of these responsibilities. A new parallel engine would violate MASTER-ARCHITECTURE consolidation rules.

## Verification
Focused contract tests are required before this decision can be used as implementation evidence. Runtime/browser verification remains required for checklist closure.

## Supersession
This decision supersedes any proposal to create a second, standalone REOS engine alongside the existing domain engines.
