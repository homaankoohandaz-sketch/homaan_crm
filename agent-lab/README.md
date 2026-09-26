# BuildWise Agent Lab

Isolated laboratory for the BuildWise multi-agent control plane.

## Boundary

This branch is intentionally isolated from the production BuildWise code path.

- No production files are modified.
- The lab owns its own task contract and worker abstraction.
- Promotion to the main BuildWise architecture happens only after verification.

## First workflow

User task -> Control Plane -> Task Contract -> Worker -> Result -> Verify -> Log

## Contract

Required fields:

- preferred_model
- max_iterations
- allowed_files
- cache_keys
- summarize_after_tools

Default iteration limit: 3.

## Status

Bootstrap implementation. The next stage is to connect a real Worker adapter without granting it unrestricted repository access.
