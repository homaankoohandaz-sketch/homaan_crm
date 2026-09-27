# BuildWise Phase Execution Rule

## Status
MANDATORY — applies to all BuildWise implementation, architecture, agent, testing, and release work.

## Core Rule
BuildWise must be implemented phase-by-phase, and every phase must end as a usable, testable increment of the system.

### 1. New decisions and ideas belong to their phase
- Every new decision, requirement, idea, behavior change, correction, removal, or addition must be mapped to the phase that owns it.
- The owning phase must be updated directly.
- If a decision affects multiple phases, update each affected phase explicitly and record the dependency.

### 2. Phase-local behavior
- Each phase has a clear scope, behavior contract, acceptance criteria, tests, and runtime verification.
- Behavior changes must be easy to locate and modify by looking at the owning phase.
- Avoid hidden cross-phase behavior and undocumented global side effects.

### 3. Every completed phase must be usable
A phase is DONE only when its current scope is:
1. implemented,
2. tested,
3. runtime verified,
4. usable independently within the current product,
5. UI verified where applicable,
6. security/permission verified where applicable,
7. deployed/available through the current stable runtime where applicable.

The system must not wait for all phases to finish before becoming runnable or useful.

### 4. Incremental runtime rule
After each phase:
- preserve the previously working system,
- integrate the new phase,
- verify the complete current runtime,
- keep the product usable,
- then proceed to the next phase.

Target: Phase N complete → usable BuildWise increment → Phase N+1.

### 5. Change-control rule
For every new decision:
1. identify the owning phase(s),
2. update that phase's specification and implementation,
3. update tests and acceptance criteria,
4. update dependencies if affected,
5. run phase tests,
6. run the current full-runtime regression check,
7. record the decision/change in .agent-control/,
8. only then continue.

### 6. No silent architecture drift
Workers and agents must not move a requirement between phases, create a new cross-phase dependency, remove existing behavior, or change an agreed architectural rule without recording the change.

### 7. Phase completion gate
A phase may be marked COMPLETE only with evidence for its acceptance criteria. Implemented alone is insufficient.

## Default execution pattern
DECISION → PHASE MAPPING → PHASE UPDATE → IMPLEMENT → TEST → RUNTIME VERIFY → UI VERIFY → SECURITY VERIFY → RECORD → RELEASE USABLE INCREMENT → NEXT PHASE

This rule is permanent unless explicitly replaced by a later architecture decision.
