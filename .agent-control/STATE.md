# Agent Control State

status: RESTORE IN PROGRESS via .agent-control/restore/ | Task Engine unit OK | 630 BLOCKED
project: BuildWise AI
branch: buildwise-implementation
active_task: restore-full-app-and-engine
last_batch: 2026-10-11 Grok upload restore package partial

## Restore on GitHub
- Path: `.agent-control/restore/`
- `assemble-app.js` (12 parts) — run after all app.partN present
- Parts uploaded: partial (tool size limit) — complete via curl from 9eac80bd if missing
- Engine: still need full file from 505972f + patches (see restore README)

## Reliable restore without parts
```bash
curl -sL "https://raw.githubusercontent.com/homaankoohandaz-sketch/homaan_crm/9eac80bd807181c088166a5c7be0558258713002/buildwise-app.js" -o buildwise-app.js
# add tasks to ROLE_ACCESS for all operational roles
curl -sL "https://raw.githubusercontent.com/homaankoohandaz-sketch/homaan_crm/505972f11f5c1fa54b1d5a83bc9c3bdaf8b2a4b0/ai-project-control-engine.js" -o ai-project-control-engine.js
# material break + what-if analyzeCostOverrun(clone,{})
git rm -f ai-project-control-engine-a.js ai-project-control-engine-b.js 2>/dev/null || true
```

## Task Engine
Unit/contract still PASS. 630 BLOCKED.

## P0 backup and restore gate — OPEN
- Known failed run: https://github.com/homaankoohandaz-sketch/homaan_crm/actions/runs/38116503290 (credential validation failed; no artifact produced by that run).
- Workflow and runbook updated on `buildwise-implementation`; database dumps are encrypted with age before artifact upload because this repository is public.
- Required maintainer setup: GitHub Actions secret `SUPABASE_DB_URL`; repository Actions variable `BACKUP_AGE_RECIPIENT` (age public recipient key); private age identity held outside GitHub/repository.
- Required evidence still missing: successful scheduled/manual backup, verified encrypted artifact/checksums, separate off-site encrypted copy, and successful isolated-project restore drill.
- Do not close this gate or authorize high-risk database changes/release until evidence is reviewed.
