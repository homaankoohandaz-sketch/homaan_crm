# 2026-10-04 — Branch discipline (Grok correction)

## Fact
- Canonical active branch: `buildwise-implementation` (STATE.md, SUMMARY.md, PR #12).
- Production smoke URL in human+ChatGPT ledger: `https://buildwise-ai-h.netlify.app`.
- Grok incorrectly targeted `main` for integrity/task-engine commits; compacted main SUMMARY (harmful).

## Rules reinforced
1. All implementation continues on `buildwise-implementation` only.
2. One canonical file per responsibility — never spawn parallel SUMMARY, STATE, or task-engine copies.
3. Merge to main only via existing PR process (never force-update main).
4. market-intelligence test added on implementation branch against existing `src/domains/intelligence/market-intelligence.js` only.

## Commits on implementation branch
- `347f7e3` — tests/unit/market-intelligence.test.mjs
- `a4f56cb` — package.json wire
