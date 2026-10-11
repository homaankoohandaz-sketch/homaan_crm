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
