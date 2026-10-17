# Restore package (Grok 2026-10-10)

## Full app assembly
```bash
node .agent-control/restore/assemble-app.js
# writes buildwise-app.js at repo root from app.part1..8
```

## Engine
Copy `ai-project-control-engine.FULL.js` to `ai-project-control-engine.js` at repo root (if present in this folder).
Or use parts if split.

## Cleanup after restore
```bash
git rm -f ai-project-control-engine-a.js ai-project-control-engine-b.js 2>/dev/null || true
```

Branch: buildwise-implementation
