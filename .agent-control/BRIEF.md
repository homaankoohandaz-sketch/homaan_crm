# BRIEF (read this first — max ~25 lines)

updated: 2026-09-26
project: BuildWise AI+H | repo: homaankoohandaz-sketch/homaan_crm

## Now
status: TASK2 PARTIAL — DB+UI shell verified; authenticated Browser CRUD blocked
active: Master must supply test login (email/password or approved session path)
next: after auth CRUD verify → close TASK2 → Task3 WBS/Gantt

## Who does what
- Grok: live GitHub bridge, implementation
- ChatGPT: Master / architecture
- Claude: review / QA via handoff

## Shared memory
- code: Git HEAD
- coord: .agent-control/
- PERFORMANCE.md

## Blockers
- No CRM login credentials available to Grok runtime
- Auth bypass forbidden; session forge forbidden
- Anon cannot list construction_projects (RLS)

## Handoff
HEAD | TASK | RESULT | RUNTIME | NEXT
