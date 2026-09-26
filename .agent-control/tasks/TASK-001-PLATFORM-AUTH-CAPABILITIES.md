# TASK-001-PLATFORM-AUTH-CAPABILITIES
status: QUEUED
depends_on: TASK-000-ARCHITECTURE-BASELINE
Goal: implement the capability-based role layer, centralized quota service, and server-side authorization boundary without breaking existing users.
Allowed: auth/role/capability files, tests, migrations only as NOT_APPLIED proposal when required.
Acceptance: manager/consultant/builder/owner capabilities resolve deterministically; unauthorized UI routes are blocked; quota helper is centralized; focused tests pass; no production auth/RLS mutation.
