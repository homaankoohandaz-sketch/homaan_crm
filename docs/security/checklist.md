# BuildWise AI Security Acceptance Checklist

Use this checklist as a verification aid under the canonical 850-item Master Checklist. It is not a replacement acceptance registry and does not change task counts.

## Repository and release integrity
- [ ] Work targets the canonical repository and buildwise-implementation; production release remains a separately reviewed action.
- [ ] Current branch head and target deploy commit are recorded; no claim relies on an unrelated/old Netlify deploy.
- [ ] No duplicate auth, permission, data or security engine has been introduced.
- [ ] Tracked diff and repository history are checked for accidental secrets; findings are redacted.

## Authentication and authorization
- [ ] Every protected endpoint verifies identity server-side.
- [ ] Role and active-account status come from trusted data, not client payloads.
- [ ] Anonymous, wrong-role and unrelated-user requests are denied.
- [ ] Authorized role can perform the intended operation.
- [ ] Record ID/path substitution cannot access another user's task, property, customer, project or document.
- [ ] UI masking is backed by API/RLS enforcement.
- [ ] Login/recovery/public endpoints have appropriate abuse controls without attacker-triggered account lockout.

## Supabase and storage
- [ ] RLS is reviewed and tested on all exposed tables.
- [ ] Storage buckets and object policies are reviewed for private files.
- [ ] SECURITY DEFINER functions, search_path and EXECUTE grants are reviewed.
- [ ] Service-role use is server-only and caller authorization is checked before privileged operations.
- [ ] Schema/policy changes are versioned and the deployed migration state is known.

## Data, import and AI
- [ ] CRM phone numbers, customer details, deal data and internal notes are minimized/masked by role.
- [ ] CSV/XLSX imports validate schema, limits, malformed rows and blank-row behavior.
- [ ] Duplicate matching does not merge records based only on surname.
- [ ] Import batch results and scoped rollback are verified using synthetic records.
- [ ] Uploads are type/size limited and private file access is authorized.
- [ ] Exports prevent spreadsheet formula injection and omit unauthorized fields.
- [ ] AI/agent inputs are treated as untrusted; tools re-check authorization and approval gates.
- [ ] Logs and reports contain no credentials, tokens or unnecessary personal data.

## Verification and release
- [ ] Each confirmed finding has a regression test or documented reason a test is not feasible.
- [ ] Focused tests and relevant full validation suite pass.
- [ ] Allowed and denied behavior is verified for the affected boundary.
- [ ] Runtime verification is complete where required; CI/page load alone is not sufficient.
- [ ] Backup/restore and rollback are verified for changes that require them.
- [ ] Critical/high confirmed findings are fixed or release is blocked.
- [ ] Remaining risks, severity, evidence and limitations are recorded in canonical .agent-control/STATE.md and .agent-control/SUMMARY.md.
- [ ] The relevant canonical Master Checklist item is updated only with the evidence required by the repository DONE rule.

## Evidence record template
- Commit/environment:
- Component/table/function/policy:
- Roles and synthetic test records:
- Expected allow/deny behavior:
- Actual result:
- Test command / CI run:
- Runtime evidence:
- Finding severity and residual risk:
- Rollback path:
- Final status: TODO / PARTIAL / BLOCKED / DONE (use the repository's exact status vocabulary where it differs).