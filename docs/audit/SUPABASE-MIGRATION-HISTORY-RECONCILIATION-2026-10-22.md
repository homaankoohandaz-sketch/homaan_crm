# Supabase migration-history reconciliation — 2026-10-22

## Verified inventory

Read-only comparison of GitHub `main` (commit `a4656c5903d0132635e70d22c1fe22cb2f7f7188`) against live Supabase project `beuestoewletjsgmigmf`.

- Live remote migration ledger: **107** versions.
- SQL migration files in `main/supabase/migrations/`: **47** files.
- Files with a 14-digit timestamp prefix: **45**.
- Timestamp versions present in both lists: **7**.
- Local timestamp versions absent from the remote ledger: **38**.
- Remote ledger versions with no matching local timestamp file: **100**.
- Two local SQL filenames do not use the standard 14-digit timestamp prefix: `20260919_release_hardening.sql`, `20260927_provision_advisor_role_on_signup.sql`.

This is a severe history divergence, not a simple off-by-one count. A matching timestamp alone does not prove the SQL bodies are equivalent.

## Local-only timestamps (38)

```text
20260917150000
20260926160000
20260927210000
20260930170000
20260930171000
20260930182000
20260930190000
20260930193000
20260930195000
20261001130000
20261001140000
20261001150000
20261001160000
20261002133000
20261002134000
20261002134500
20261002141000
20261002143000
20261002163000
20261002230000
20261002233000
20261004120000
20261006170000
20261006170001
20261006170002
20261006170003
20261006231500
20261012190000
20261012193000
20261012200000
20261012201500
20261012203000
20261017120000
20261017121000
20261017122000
20261017190000
20261017200000
20261019180000
```

## Remote-only timestamps (100)

```text
20260830154536
20260830154605
20260830154725
20260830154749
20260830161534
20260830175304
20260830175316
20260830175709
20260830204819
20260830204903
20260830204920
20260830204934
20260830205557
20260831080950
20260831100313
20260831152838
20260831220916
20260908091411
20260908091557
20260908091749
20260908091847
20260908092533
20260910042546
20260910042617
20260910042706
20260910042725
20260910042840
20260913155033
20260913155127
20260915102925
20260915103018
20260915103125
20260915103144
20260915103159
20260916033841
20260916033909
20260916152330
20260916170321
20260916170504
20260916170534
20260916171153
20260916183422
20260917125828
20260917184049
20260918035814
20260918035834
20260918055158
20260918055311
20260918055344
20260918145707
20260919105432
20260919105456
20260920074239
20260923155757
20260923161959
20260923162915
20260923163118
20260923230203
20260923230304
20260924153221
20260924153250
20260925203123
20260926124851
20260927175630
20260930151704
20260930152158
20260930152721
20260930153041
20260930153524
20260930154050
20260930154353
20261002100633
20261002100659
20261002100924
20261002101037
20261002101844
20261006165739
20261006165952
20261006170045
20261006170213
20261006170337
20261006170424
20261006202958
20261006203132
20261012151436
20261012152511
20261012152840
20261012153023
20261012153059
20261012153157
20261012153658
20261012153714
20261012154516
20261012154538
20261012154757
20261012155026
20261012155239
20261012155442
20261017044414
20261019171404
```

## Matching timestamps (7; content still unverified)

| Timestamp | Local filename |
|---|---|
| 20260923160714 | `20260923160714_20260923_advisor_followups_security_reports.sql` |
| 20260930145935 | `20260930145935_project_control_procurement_141_160.sql` |
| 20260930151310 | `20260930151310_project_accounting_201_220.sql` |
| 20261006170004 | `20261006170004_task_engine_permissions.sql` |
| 20261012161148 | `20261012161148_performance_security_baseline_20261012220000.sql` |
| 20261012161339 | `20261012161339_optimize_rls_auth_function_initplans.sql` |
| 20261012161544 | `20261012161544_manager_edit_record_column_allowlist.sql` |

## Safe recovery decision

**No migration repair or bulk push is justified from this inventory alone.** In particular, do not mark the 100 remote-only versions as reverted, and do not mark the 38 local-only versions as applied. Either action could cause SQL to be skipped or re-run incorrectly.

Next safe sequence:

1. Securely export a production backup and verify it can be restored; capture the current remote schema and migration ledger.
2. Retrieve the SQL bodies associated with remote history where available and compare each against repository SQL and the live catalog (tables, columns, constraints, indexes, functions, triggers, grants, and RLS policies).
3. Classify every migration as exact match, equivalent change under another timestamp (with evidence), not applied, or unresolved.
4. Test a reconstructed baseline and the proposed security migration in a disposable database. A preview deployment alone is not a database migration test.
5. Run `supabase migration list` and `supabase db push --dry-run` from a trusted linked CLI environment; inspect every proposed change.
6. Repair only individually proven ledger errors, then deploy only the explicitly reviewed pending migration(s).

Official Supabase guidance: https://supabase.com/docs/guides/deployment/database-migrations and https://supabase.com/docs/reference/cli/supabase-migration-list

`supabase migration repair` changes the migration ledger only; it does not execute SQL or restore missing schema. No production database changes were made by this audit.
