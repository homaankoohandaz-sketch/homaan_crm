# Architecture Memory

## Decision A-001 — Vendor-neutral control plane
The project will not make the CRM itself dependent on Claude, Codex, Gemini, n8n, or a single orchestration product.

## Decision A-002 — Files are durable project truth
Important decisions, task contracts, acceptance criteria, and handoffs must be representable in Git.

## Decision A-003 — Runtime state is separate
Presence, locks, live messages, process IDs, and ephemeral sessions belong in the runtime layer, not in committed project memory.

## Decision A-004 — Human approval gates
Production deployment, destructive migrations, secrets/authentication changes, and irreversible operations require human approval.

## Decision A-005 — Shared memory + coordination
A shared memory mechanism alone is insufficient. The system also needs task ownership and file/resource locking.
