# BuildWise AI — Codebase Architecture Contract

## Objective
The repository must evolve from the current static multi-page CRM/prototype structure into a maintainable BuildWise Real Estate Operating System without losing working behavior.

## Non-negotiable architectural rule
Related code must live together by domain. Do not keep business logic scattered across unrelated HTML files, global scripts, inline JavaScript, or duplicate pages.

## Target structure

```
/
  app/
    shell/
    routes/
    state/
    permissions/
  src/
    core/
      config/
      db/
      auth/
      errors/
      audit/
      utils/
    domains/
      people/
      crm/
      leads/
      conversation/
      properties/
      market/
      valuation/
      owner-land/
      feasibility/
      sales/
      matching/
      barter/
      deals/
      negotiation/
      legal/
      projects/
      planning/
      boq/
      cost/
      procurement/
      materials/
      inventory/
      quality/
      rfi/
      change-orders/
      risk/
      hse/
      finance/
      documents/
      room/
      media/
      learning/
    ai/
      orchestrator/
      agents/
      tools/
      schemas/
      memory/
      routing/
    ui/
      components/
      pages/
      styles/
  supabase/
    functions/
      <one function per bounded responsibility>
    migrations/
  tests/
    unit/
    integration/
    e2e/
    fixtures/
  docs/
    architecture/
    decisions/
    handoffs/
```

## Current-to-target mapping

| Current artifact | Target responsibility |
|---|---|
| buildwise-app.js | app/shell + domains/crm + shared UI extraction |
| data-import.js / import.html | domains/crm/import |
| engines.js | domains/valuation + domains/cost + core/utils |
| construction-engine.js | domains/projects + domains/feasibility + domains/cost |
| project-control.html | domains/projects + domains/planning + domains/boq + procurement + quality + risk + documents |
| analysis-engine-ui.js | domains/valuation + domains/feasibility + ui |
| phase-app.js | app/routes + ai/orchestrator + integrations |
| visual-project.html | domains/room + domains/media |
| media-ai.js / media.html | domains/media |
| integrations/* | integrations |
| .agent-control/* | agent control plane; keep separate from product runtime |

## Rules for refactoring
1. Preserve existing routes and working database contracts until replacement code is tested.
2. Separate pure calculations from DOM/database/network code.
3. One business domain owns its schemas, calculations, services and UI adapters.
4. No business calculation should depend on a DOM element.
5. No HTML page should contain large business algorithms.
6. No duplicated calculation should exist in two files.
7. Supabase access must be centralized behind domain services where practical.
8. AI agents call typed domain tools; agents do not directly mutate arbitrary tables.
9. Every AI action that changes business state must be auditable.
10. Keep compatibility adapters during migration; remove them only after tests pass.
11. Never rename/delete a live route merely to make the tree look cleaner.
12. Avoid creating abstractions that have no current consumer.

## Definition of organized
A feature is considered organized only when its calculation/service/schema/UI/test code can be found from one domain directory, with explicit dependencies and no hidden global coupling.

## Definition of complete
A planned feature is complete only when:
DB/schema -> service/API -> UI -> AI/tool integration (when applicable) -> validation -> tests -> E2E path
all exist and pass. A registry entry, placeholder, UI card, or database table alone is not completion.
