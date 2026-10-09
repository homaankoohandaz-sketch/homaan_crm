# BuildWise AI Data, Privacy, Import and Storage Security

## Data classification
Treat these as sensitive by default: CRM phone numbers and contact details; customer requests; owner/investor/builder relationships; private property documents and images; offers, deal terms and contracts; project costs, procurement and accounting; identity/session data; internal AI prompts, agent traces and audit metadata. Store and expose only what the current business purpose requires.

## Access and minimization
- Apply RLS and server-side object authorization to database rows and Storage objects.
- Customer, advisor, builder, owner and manager views must use role-specific field allowlists. Mask or omit phone numbers and internal notes when the role does not have permission.
- Do not expose internal audit logs, agent prompts, private deal terms or unrelated customer records through search, export, public links or AI summaries.
- Treat public/shared URLs as public unless access is demonstrably enforced by the storage/provider configuration.
- Use synthetic fixtures for tests and demos. Never copy production data into test logs, screenshots or fixtures.

## Excel/CSV and bulk data
- Validate extension and detected content type, file size, encoding, row count, columns and required fields at the trust boundary.
- Normalize values before matching or deduplicating. Do not merge people solely because surnames match.
- Ignore fully blank rows; never create empty property/person records. Report rejected rows with source row numbers but no unnecessary PII.
- Preview mappings and validation outcomes before large writes. Record an import-batch ID, source filename (sanitized), row counts and results.
- Scope rollback to records created/changed by that exact batch; never bulk-delete unrelated records as an import cleanup shortcut.
- Validate all database writes server-side. Do not trust browser validation alone.
- Guard against spreadsheet formula injection in exported CSV/XLSX by safely encoding values that could execute as formulas.

## Upload and document storage
- Allowlist file types and impose limits on size, row/page count and processing time.
- Treat MIME type and filename supplied by the client as untrusted; inspect content where supported and generate safe storage names.
- Keep private uploads private; check caller role and ownership on every upload/download/delete request.
- Do not expose internal filesystem paths, stack traces or storage credentials.
- Consider malware scanning or quarantine before downstream processing where the deployment supports it; do not claim this exists unless verified.

## Database, logs and retention
- Use parameterized database operations and allowlisted filter/sort columns. Validate business invariants at the domain/server boundary.
- Keep secrets, access tokens, passwords and full private records out of logs. Log actor, action, resource identifier, outcome and timestamp only as needed for audit.
- Set retention and deletion behavior according to the business/legal requirement; do not invent an automatic purge policy.
- Never store payment-card data or authentication secrets in BuildWise. Verify payment status server-side with the payment provider if such flows are added.
- Backups and restore procedures must be verified, not merely documented.

## Acceptance evidence
Test cross-role and cross-user reads/writes, private file access, export masking, blank-row handling, duplicate matching, malformed imports and batch-scoped rollback using synthetic records. Record any unverified live Storage/RLS behavior as open, not secure.