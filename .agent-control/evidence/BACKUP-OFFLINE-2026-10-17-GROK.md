# Offline Database Backup Evidence — 2026-10-17 (Grok)

## Scope
Direct Postgres dump from live project `beuestoewletjsgmigmf` (Northeast Asia / Seoul pooler), encrypted with age, checksummed.

This does **not** close the GitHub Actions scheduled-backup gate until:
1. Repository secret `SUPABASE_DB_URL` is set
2. Repository variable `BACKUP_AGE_RECIPIENT` is set
3. Workflow run succeeds and produces downloadable artifact
4. Isolated restore drill is performed

## Artifacts produced (held outside public commit of private identity)
| File | Bytes | Notes |
|------|------:|-------|
| schema.sql | 676555 | Complete schema-only dump |
| schema.sql.age | 676915 | age-encrypted |
| data.sql | 6578176 | Data dump (INSERT format; may lack final complete marker if truncated mid-run) |
| data.sql.age | 6579976 | age-encrypted |
| manifest.txt | — | Metadata |
| SHA256SUMS | — | Checksums |

## Age public recipient (safe to set as GitHub variable BACKUP_AGE_RECIPIENT)
```
age1s8l9rcpque8q9pwwwarecwgy4jtjfwm8yepmczz6mlq4xmrp6s4qhgw6zw
```
Private identity was generated in the secure agent environment and must be stored offline by the owner — **never** commit the private key.

## Recommended SUPABASE_DB_URL (secret — do not commit password)
```
postgresql://postgres.beuestoewletjsgmigmf:<DB_PASSWORD>@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres
```

## SHA256 (from offline run)
```
3ebefbc1b1434e6d7d3f66f27f2fce40bc2ab59c185990d8758fc01330611853  schema.sql
36d416ad52239843a0a4c10eddf6c97b124f246c20afe509884d6f083561fb0b  schema.sql.age
c6367357ba34b2fe1066436dbfda30594ee9f81c6159e1f71509323f7ac9d3a8  data.sql
371b8d1388ac317ab25adafadeae048626d1e2db5dfce5853f5e7d05740c25f7  data.sql.age
```

## Status
- Offline dump: **PRODUCED**
- Encryption: **DONE**
- Checksums: **DONE**
- GitHub Actions scheduled path: **STILL OPEN** (needs secrets)
- Restore drill: **NOT PERFORMED**
