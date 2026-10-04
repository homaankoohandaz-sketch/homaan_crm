# 2026-10-04 — Production vs implementation branch (Grok)

**Agent: Grok (xAI)**

## Confirmed by human
- Login works on production URL.
- Site content is the **old main** tree.
- New coding (Task Engine audit, etc.) is **not** visible on that URL.

## Facts (GitHub compare)
- `buildwise-implementation` vs `main`: **193 commits ahead, 10 behind**, status **diverged**.
- Open PR #12 (`buildwise-implementation` → `main`): **mergeable=false**, **mergeable_state=dirty** (conflicts).
- Production Netlify hostname: `https://buildwise-ai-h.netlify.app` deploys from **main** (per prior STATE).
- Example: `src/core/task-engine.js` differs (impl has Grok audit/reject/notification layer; main does not).

## Law
- Never force-update main.
- Merge only via reviewed PR after conflicts resolved + CI green + smoke.

## Paths to see new code (ordered)
1. **Netlify Branch Deploy** for `buildwise-implementation` (staging URL) — fastest, no main merge.
2. **Netlify Deploy Preview** from PR #12 after Netlify is linked to PRs.
3. **Resolve PR #12 conflicts** → CI → merge to main → production publish (human approval).

## Not done by Grok this turn
- No force-push to main.
- No production Netlify publish (requires human Netlify access).
- No silent conflict resolution of 86 files without human review.
