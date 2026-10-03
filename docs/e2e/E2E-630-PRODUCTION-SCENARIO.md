# E2E-630 — Production E2E Test Scenario (authenticated browser)

Status: SCENARIO ONLY — not executed. Checklist item 630 stays BLOCKED until this is run
in a real browser with an approved test account and evidence is attached below.
Rule source: MASTER-CHECKLIST-v3-850.md items 675, 737-742, 837-839 (no DONE without runtime + UI + security evidence).

## Preconditions
- Target: https://buildwise-ai-h.netlify.app (production, main) and the buildwise-implementation deploy preview.
- Three approved test accounts (never real customer data): owner, staff (full access except delete/user-admin), viewer (read-only).
- Test data prefix: `E2E-<date>-` on every record so cleanup is exact. No production migrations, no force-push to main.
- Live AI paths require OPENAI_API_KEY; if absent the AI step must FAIL CLOSED (expected, record as PASS for fail-closed).

## Scenarios (record PASS / FAIL / BLOCKED + screenshot + console errors for each)
1. Auth: sign-in per role; wrong password rejected; sign-out clears session.
2. Role boundary: viewer cannot create/edit/delete; staff cannot delete or manage users; owner can.
3. Phone masking (599-600): non-manager never sees raw mobile/emergency_phone/owner_notes/internal_notes in UI, network responses, or export.
4. CRM CRUD (properties, buyers, owners, deals): create → edit → search/filter → duplicate-phone warning → archive; audit trail entry exists.
5. Import (046-065): upload 2,000+ row multi-sheet Excel; preview, edit arbitrary column, error isolation, rollback of one batch restores exact prior state.
6. Project Control (101-130): create project → hierarchy → WBS/schedule → Gantt renders → CPM/critical path flags → baseline vs actual → progress %.
7. Procurement + accounting (131-235): PO with partial delivery, price variance, ledger/budget vs actual views load with data.
8. AI project control (161-190): what-if simulation does NOT mutate master schedule; critical change requires human approval.
9. Customer portal / Room (401-415): customer sees only own proposal; price shown as ±5% range; max 4 location recommendations.
10. Mobile + PWA (627-628): 390px viewport layout; Add to Home Screen/manifest valid; offline shell loads.
11. Security regression (632): direct Supabase REST calls with anon and viewer tokens cannot read protected columns or write.

## Evidence log (fill in when executed)
| # | Result | Date | Tester | Evidence link |
|---|--------|------|--------|---------------|

## Exit rule
630 may move to [✓] only when every scenario above is PASS with evidence. Any FAIL: record cause, attempted fix, result, next action (item 743). Any scenario not executable: record BLOCKED, do not mark DONE.
