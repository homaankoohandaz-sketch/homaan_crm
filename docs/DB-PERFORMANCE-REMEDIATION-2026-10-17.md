# Database Performance Remediation — 2026-10-17

Scope: BuildWise AI / `homaankoohandaz-sketch/homaan_crm`, branch `buildwise-implementation`, live Supabase project `beuestoewletjsgmigmf`.

## Safety status

This is an evidence and execution plan, not authorization to change production schema. The live database was queried read-only. No indexes or policies were dropped, no migration was applied, and no production deployment was performed.

## Live findings (2026-10-17)

- Supabase Performance Advisor reports **124 unindexed foreign-key findings**, observed at 2026-10-17 10:56:29 UTC.
- A read-only catalog cross-check found 124 candidate FK constraints across **69 public tables** without an index whose leading key columns cover the FK columns in order.
- Of those 124 candidates, **43 tables are 16 KiB**, **79 are >16 KiB and <=1 MiB**, and **2 are >1 MiB**; the largest affected table is about **2.3 MiB**. The advisor count alone does not justify adding every index immediately.
- A sample of indexes with `idx_scan = 0` includes primary-key indexes, a UNIQUE constraint index (`properties_property_code_key`), and property search indexes (GIN/trigram). These must **not** be removed based on zero scans alone.
- The 34 multiple-permissive-policy and 89 unused-index figures in the 2026-10-12 report are historical; re-run current advisors and inspect the catalog before treating them as today's counts.
- Current security advisor output also includes 14 authenticated-callable SECURITY DEFINER functions. This is a separate security review item; do not modify their grants as part of index optimization.

Reference benchmark: `docs/BUILDWISE-PROFESSIONAL-BENCHMARK-AND-EXECUTION-2026-10-12.md`.

## Decision

**Do not generate or apply a blanket migration for all 124 findings.** Prioritize foreign keys on tables with meaningful row counts and demonstrated joins/deletes/updates in application traffic. Small/empty tables can remain documented candidates until query evidence or data growth justifies the write/storage cost. For each selected FK, check existing indexes by leading-column order (including composite indexes), constraints, table size, write volume, and actual query plan.

## Repeatable read-only inventory

Run in Supabase SQL Editor against the intended environment. These queries do not change data or schema.

### 1. Foreign keys lacking a leading index

```sql
WITH fk AS (
  SELECT c.oid AS constraint_oid,
         t.oid AS table_oid,
         n.nspname AS schema_name,
         t.relname AS table_name,
         c.conname AS constraint_name,
         array_agg(a.attname ORDER BY k.ord) AS fk_columns,
         array_agg(k.attnum ORDER BY k.ord) AS fk_attnums,
         pg_total_relation_size(t.oid) AS table_bytes
  FROM pg_constraint c
  JOIN pg_class t ON t.oid = c.conrelid
  JOIN pg_namespace n ON n.oid = t.relnamespace
  JOIN LATERAL unnest(c.conkey) WITH ORDINALITY k(attnum, ord) ON true
  JOIN pg_attribute a ON a.attrelid = t.oid AND a.attnum = k.attnum
  WHERE c.contype = 'f' AND n.nspname = 'public'
  GROUP BY c.oid, t.oid, n.nspname, t.relname, c.conname
)
SELECT schema_name, table_name, constraint_name, fk_columns,
       pg_size_pretty(table_bytes) AS table_size
FROM fk
WHERE NOT EXISTS (
  SELECT 1
  FROM pg_index i
  WHERE i.indrelid = fk.table_oid
    AND i.indisvalid
    AND i.indpred IS NULL
    AND i.indexprs IS NULL
    AND (
      SELECT array_agg(k.attnum ORDER BY k.ord)
      FROM unnest(i.indkey::smallint[]) WITH ORDINALITY k(attnum, ord)
      WHERE k.ord <= cardinality(fk.fk_attnums)
    ) = fk.fk_attnums
)
ORDER BY table_bytes DESC, table_name, constraint_name;
```

The predicate intentionally excludes partial and expression indexes because they do not generally cover every FK row. Compare the output with the Performance Advisor before selecting candidates.

### 2. Index usage and constraint protection

```sql
SELECT s.schemaname, s.relname AS table_name,
       s.indexrelname AS index_name, s.idx_scan,
       pg_size_pretty(pg_relation_size(s.indexrelid)) AS index_size,
       i.indisprimary AS is_primary, i.indisunique AS is_unique,
       i.indisvalid AS is_valid,
       pg_get_indexdef(s.indexrelid) AS index_definition
FROM pg_stat_user_indexes s
JOIN pg_index i ON i.indexrelid = s.indexrelid
WHERE s.schemaname = 'public'
ORDER BY s.idx_scan ASC, pg_relation_size(s.indexrelid) DESC;
```

Before considering any index removal, establish statistics reset time and workload coverage, check whether the index enforces PRIMARY KEY/UNIQUE, inspect dependencies and overlapping leading columns, and capture representative query plans. An `idx_scan = 0` observation is not sufficient evidence for deletion.

### 3. Table size and activity

```sql
SELECT schemaname, relname AS table_name, n_live_tup, n_dead_tup,
       seq_scan, idx_scan, last_analyze, last_autoanalyze,
       pg_size_pretty(pg_total_relation_size(relid)) AS total_size
FROM pg_stat_user_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(relid) DESC;
```

### 4. Current advisor evidence

Use Supabase Dashboard → **Advisors → Performance** and **Advisors → Security**, or rerun the connected Supabase advisor tool after each approved change. Save findings with an observation timestamp. Advisor findings are prompts for investigation, not automatic instructions to modify the database.

## Remediation sequence

1. Capture a baseline: advisor findings, table sizes, statistics reset time, top slow queries from Query Performance/logs, and representative `EXPLAIN (ANALYZE, BUFFERS)` results in a safe environment.
2. Rank FK candidates by measured workload and table size. Verify the FK columns are not already covered by the leading columns of a valid non-partial index.
3. Draft a small, separately reviewable migration for only the selected indexes. Use deterministic names and avoid duplicates. For production-sized tables, plan an out-of-transaction `CREATE INDEX CONCURRENTLY` rollout; it cannot run inside a transaction-wrapped migration. Test the deployment mechanism first.
4. In staging, apply the migration and verify catalog state, advisor count, query plans, latency, write overhead, and application workflows. Recheck owner/manager/staff/customer access for any table whose RLS or query behavior is touched.
5. Handle multiple-permissive-policy findings in a separate security change. Since permissive policies are combined with OR, consolidation is allowed only after proving equivalent roles, commands, `USING`, and `WITH CHECK` behavior with positive and negative role tests.
6. Review unused-index candidates in a separate change. Do not drop primary-key/unique constraint indexes or search indexes solely because current counters are zero.
7. Roll forward to production only after review, backup/restore readiness, and an agreed low-traffic window. Rerun advisors and compare the same queries against the baseline.

## Acceptance criteria

- Every current unindexed-FK finding has a disposition: add index with evidence, already covered after catalog review, or defer with a written reason.
- Every current multiple-permissive-policy finding has a per-policy semantic review; no broad policy replacement.
- Every unused-index candidate has constraint/dependency/usage-window review; no deletion based solely on `idx_scan = 0`.
- Before/after measurements use the same representative queries and include actual plans/latency; no claim of improvement based on advisor counts alone.
- Migration history and repository files are reconciled; CI and role-based access tests pass.
- No production schema change or merge occurs from this audit branch without explicit review.

## Human action, if required

The current connected Supabase and GitHub tools are sufficient for read-only audit and drafting; no additional plugin is required. For performance evidence unavailable to the integration, open Supabase Dashboard → **Database → Query Performance** (or **Logs → Postgres**) and capture the slowest representative queries with their SQL/plan and measurement window. Do not paste API keys, service-role keys, or database passwords into chat.
