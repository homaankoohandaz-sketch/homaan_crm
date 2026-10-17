import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const migration = fs.readFileSync(
  new URL("../../supabase/migrations/20261017122000_properties_owner_id_index.sql", import.meta.url),
  "utf8"
);

test("properties owner foreign key gets a narrow idempotent btree index", () => {
  assert.match(migration, /create index if not exists properties_owner_id_idx/i);
  assert.match(migration, /on public\.properties using btree \(owner_id\)/i);
  assert.doesNotMatch(migration, /drop index|drop table|delete from/i);
});
