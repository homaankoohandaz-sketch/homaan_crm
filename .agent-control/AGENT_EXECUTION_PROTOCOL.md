# BUILDWISE — AGENT EXECUTION PROTOCOL

## 1. MASTER EXECUTION FLOW

```text
MASTER ARCHITECTURE
        ↓
DECISION LEDGER
        ↓
TASK REGISTRY
        ↓
AGENT TASK CONTRACT
        ↓
RECONCILE EXISTING CODE
        ↓
IMPLEMENT
        ↓
TEST
        ↓
RUNTIME VERIFY
        ↓
EVIDENCE
        ↓
STATE UPDATE
        ↓
DONE
```

**Canonical rule:**

```text
Conversation
→ Decision
→ Repository Record
→ Task
→ Reconcile
→ Implementation
→ Test
→ Runtime Verification
→ Evidence
→ State Update
```

---

## 2. FIVE REQUIRED CONTROL LAYERS

### A. SOURCE OF TRUTH

```text
MASTER-ARCHITECTURE.md
DECISIONS.md
CURRENT PHASE
TASK REGISTRY
STATE.md
```

Rules:

```text
No source → STOP
No verified task → STOP
No guessing → STOP
No duplicate architecture → STOP
No rebuild when existing implementation can be reconciled → STOP
```

### B. DECISION CONTROL

```text
Every material decision = time
Every material decision must be recorded in the repository.
```

Material decisions include:

```text
Architecture
Database
Workflow
Agent behavior
Security
Deployment
Product behavior
Task planning
Technology selection
```

Rules:

```text
Decision in chat only = UNRECORDED
Decision not in repository = NOT AUTHORITATIVE
New decision supersedes old decision only when explicitly recorded.
History must be preserved.
```

### C. TASK CONTRACT

Every executable task must contain:

```text
TASK_ID
GOAL
SOURCE_OF_TRUTH
DEPENDENCIES
ALLOWED_FILES
FORBIDDEN_ACTIONS
ACCEPTANCE_CRITERIA
TEST_REQUIRED
RUNTIME_VERIFY_REQUIRED
EXPECTED_EVIDENCE
STOP_CONDITIONS
```

No agent may invent:

```text
Task numbers
Architecture
Requirements
Dependencies
Acceptance criteria
Missing specifications
```

### D. IMPLEMENTATION CONTROL

Before changing code:

```text
Read canonical architecture
→ Read exact task
→ Inspect existing implementation
→ Identify dependencies
→ Identify gaps
→ Preserve working behavior
→ Implement minimum required change
```

Rules:

```text
One task = one clear purpose
Allowed files = hard boundary
No unrelated refactor
No duplicate implementation
No destructive production action
No security/auth/billing change without required human gate
```

### E. VERIFICATION CONTROL

Every implementation follows:

```text
RED
↓
Failing test / reproduction
↓
GREEN
↓
Minimum implementation
↓
RETEST
↓
FULL TEST SUITE
↓
RUNTIME VERIFY
↓
EVIDENCE
```

Verification layers:

```text
Unit
→ Integration
→ E2E / Browser
→ Runtime
→ Persistence
```

**CI PASS alone ≠ DONE.**

---

## 3. AGENT STOP CONDITIONS

Agent MUST STOP instead of guessing when:

```text
Source of truth is missing
Task is ambiguous
Task registry is unverifiable
Required dependency is missing
Required file is outside allowed scope
Architecture conflicts
Security boundary is unclear
Production action requires human approval
Test cannot prove the acceptance criterion
Runtime verification is unavailable when required
Evidence cannot be produced
```

When stopped:

```text
REPORT:
1. Exact blocker
2. Evidence
3. Required decision/input
4. No speculative implementation
```

---

## 4. DONE DEFINITION

A task is **DONE** only when all are true:

```text
[✓] Correct task identified
[✓] Existing code reconciled
[✓] Implementation completed
[✓] Required tests written
[✓] Tests pass
[✓] Full relevant suite passes
[✓] Runtime verified when required
[✓] No regression detected
[✓] Evidence recorded
[✓] STATE updated
[✓] SUMMARY updated when architecture/status changed
```

Otherwise:

```text
NOT DONE
```

---

## 5. NON-NEGOTIABLE RULES

```text
NO GUESS
NO FAKE TASK
NO DUPLICATE SPEC
NO REBUILD WITHOUT JUSTIFICATION
NO CLAIM OF DONE WITHOUT EVIDENCE
NO CI-ONLY DONE
NO UNTESTED BEHAVIOR
NO UNVERIFIED RUNTIME
NO UNAUTHORIZED PRODUCTION CHANGE

DECISION = TIME
EVIDENCE = TRUTH
GITHUB = CODE TRUTH
.agent-control = ARCHITECTURE / COORDINATION TRUTH
SUPABASE = RUNTIME / DATA TRUTH
```

### FINAL ALGORITHM

```text
SOURCE
 ↓
DECISION
 ↓
TASK
 ↓
RECONCILE
 ↓
IMPLEMENT
 ↓
TEST
 ↓
RUNTIME VERIFY
 ↓
EVIDENCE
 ↓
STATE
 ↓
DONE
```

## 6. PROTOCOL CHANGE RULE

This document is the canonical behavioral reference for BuildWise agents.

Any new material decision that changes agent behavior, execution order, verification, evidence, authority, stop conditions, or DONE criteria must be added here and recorded in the appropriate canonical decision ledger.

No agent may silently override this protocol.

If a later decision conflicts with this protocol, the later decision is authoritative only after it is explicitly recorded in the repository and this protocol is updated accordingly.
