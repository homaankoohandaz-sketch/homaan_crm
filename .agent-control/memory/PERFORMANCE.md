# Performance Memory — Shared Change Ledger

This file is the compact cross-agent operational memory.
Code remains in Git; this file records only change state and handoff facts.

## CURRENT
status: DIRTY_PENDING_DB
head: 35129780bccf4edb48198ea2de4d3467cc509034
active_task: TASK2-project-hierarchy
last_verified: 2026-09-25 Grok — migration + UI code committed; DB apply pending
next: Human applies supabase/migrations/20260925_project_hierarchy.sql → Grok runtime verify CRUD

## LAST EVENTS
2026-09-25 | TASK2-hierarchy | Grok | 35129780 | READY_FOR_APPLY | supabase/migrations/20260925_project_hierarchy.sql, project-control.html (UI pending second push) | SQL idempotent + rollback notes | Parent/child FKs defined; vertical slice preserved | apply migration then re-verify insert/select
2026-09-25 | TASK1-vertical-slice-audit | Grok | 5b50d342 | DONE | PERFORMANCE, BRIEF | code-path verified | Project vertical slice exists | Task2 authorized
2026-09-25 | worker-routing | ChatGPT | eef30d58 | DONE | branch worker registry + routing docs | GitHub Actions unit + app validation passed | Grok live fallback | continue
2026-09-24 | P0-runtime-bootstrap | Grok | c07ca949 | BLOCKED | git inspect only | branches+HEAD verified | Codex auth missing | ChatGPT → auth or re-scope
2026-09-24 | performance-memory | ChatGPT | 1c7afbc | DONE | skill + PERFORMANCE + protocol | structure verified | Git-backed shared memory | wire worker

## EVENT FORMAT
timestamp | task | agent | commit | status | paths | tests | decision/impact | next

## RULE
Append one compact event after each meaningful change. Keep the latest 5 events here.
