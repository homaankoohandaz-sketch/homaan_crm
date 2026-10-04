# 2026-10-04 — Netlify 404 / limits (Grok)

**Agent: Grok (xAI)**

## Observed
- Human hit Netlify "page not found" (broken link / URL does not exist).
- Live checks:
  - `https://buildwise-ai-h.netlify.app/` → **200** (production = main)
  - `https://buildwise-implementation--buildwise-ai-h.netlify.app/` → **404**
  - `https://deploy-preview-12--buildwise-ai-h.netlify.app/` → **404**

## Why 404 (not a code bug)
1. **Branch deploys are not enabled** (or never successfully built) for `buildwise-implementation` on this Netlify site.
2. **Deploy Previews** for PR #12 were never published (or PR previews disabled).
3. Guessed URLs only work *after* Netlify has a successful deploy for that context.

## Limits checked (not the blocker here)
- DNS label max **63** chars for `branch--sitename`:
  - `buildwise-implementation` (24) + `--` (2) + `buildwise-ai-h` (15) = **41** → under limit. Length is OK.
- `netlify.toml` on impl already declares `[context.branch-deploy]` and `[context.deploy-preview]` env — **config alone does not turn branch deploys on**; Site settings must enable them.
- Publish dir is `.` with empty build command — fine for static site once a deploy runs.

## What human must do in Netlify UI
1. Site `buildwise-ai-h` → **Site configuration → Build & deploy → Continuous Deployment / Branches**
2. Enable **Branch deploys**: All branches OR only `buildwise-implementation`
3. Trigger deploy (push empty commit or "Trigger deploy" on that branch)
4. Open the **Deploy log** URL Netlify shows (do not invent the subdomain)
5. Optional: enable **Deploy Previews** for pull requests → then PR #12 gets `deploy-preview-12--…` only after a green build

## Alternative without branch deploy
- Resolve PR #12 conflicts → merge to `main` → production URL updates (human approval; no force-push).

## Grok cannot do from here
- No Netlify account token in this session → cannot enable branch deploys or trigger site publish.
