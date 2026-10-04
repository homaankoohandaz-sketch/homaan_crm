-- Unified Task Engine audit trail (PHASE: Completion → Audit).
-- Agent: Grok (xAI) — 2026-10-04
-- Additive only: existing public.tasks; no parallel audit/notification tables.

alter table public.tasks
  add column if not exists audit_log jsonb not null default '[]'::jsonb;

comment on column public.tasks.audit_log is
  'Append-only task lifecycle events from src/core/task-engine.js (created, responded, completed, rejected, moved, starred, priority_changed, notification_configured, etc.)';
