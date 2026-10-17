# BuildWise Handoff — Grok → ChatGPT / Human
**Date:** 2026-10-10
**Branch only:** `buildwise-implementation`
**Repo only:** `homaankoohandaz-sketch/homaan_crm`

## Non-negotiable
- ONE repo, ONE branch `buildwise-implementation`, ONE checklist 850
- NO REBUILD / no second app / JS+Supabase only
- DONE = impl + tests + runtime evidence; 630 still BLOCKED without auth browser
- Read SUMMARY → STATE → PROTOCOL → task → reconcile before edit

## Already on GitHub (Grok this session)
- Task Engine tests aligned; local 9/9 PASS
- STATE updated
- `buildwise-app.js` = CDN loader from `9eac80bd` + inject `tasks` into ROLE_ACCESS
- Placeholders removed
- Vertical unit re-check PASS (progress, procurement, ai-control, construction, architecture, integrity)

## P0 for ChatGPT — restore full app
```bash
git checkout buildwise-implementation
git show 9eac80bd:buildwise-app.js > buildwise-app.js
# Patch ROLE_ACCESS: insert 'tasks' for owner,manager,advisor,agent,builder,staff
# (see full patch in artifacts handoff or prior STATE)
git add buildwise-app.js
git commit -m "[chatgpt] restore full buildwise-app.js + ROLE_ACCESS tasks"
git push origin buildwise-implementation
node --test tests/task-engine.test.js tests/task-repository.test.js tests/task-engine-ui.test.js
```

ROLE_ACCESS must include `'tasks'` for: owner, manager, advisor, agent, builder, staff.

Parent good commit: `9eac80bd807181c088166a5c7be0558258713002`

## Task Engine canonical files
- `src/core/task-engine.js`
- `src/core/task-repository.js`
- `src/ui/task-engine-ui.js`
Path: create → assign → notify → respond → complete/reject → move → star → reminder

## Frontend design source (user decision)
Share: https://grok.com/share/c2hhcmQtMw_2cc3d432-8b25-4986-b75f-afde31cca87d
Use design language (orbs, materials, reduced-motion) on existing shell only — no parallel SPA.

## Do not
- Mark 630 DONE without authenticated E2E
- Create second application or Python engine
- Force-push / merge main without human

Full detailed handoff also at local artifacts: BUILDWISE_HANDOFF_GROK_TO_CHATGPT.md
