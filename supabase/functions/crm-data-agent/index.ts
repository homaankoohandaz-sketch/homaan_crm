import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

// crm-data-agent v5 — source synchronized from the deployed function on 2026-10-17.
// Hardening: role gate (app_roles), column allow-list, actor stamping, audit log, CORS/OPTIONS.
// Batch rollback fix: preserve import_batch_id for every supported target.

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") || SERVICE_KEY;
const db = createClient(SUPABASE_URL, SERVICE_KEY);

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type, apikey",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (x: unknown, s = 200) =>
  new Response(JSON.stringify(x), { status: s, headers: { ...CORS, "content-type": "application/json" } });

const MAX_ROWS = 1000;
const WRITE_ROLES = ["owner", "staff"];
const MARKET_ROLES = ["owner"];

const ALLOWED: Record<string, string[]> = {
  properties: [
    "property_code", "property_name", "request_type", "property_type", "region", "neighborhood", "street",
    "land_area", "built_area", "bedrooms", "total_price", "price_per_meter", "mobile", "status", "description", "import_batch_id",
  ],
  leads: [
    "full_name", "mobile", "desired_property_type", "desired_region", "budget_min", "budget_max", "status", "notes", "source", "import_batch_id",
  ],
  market: [
    "observed_at", "region", "neighborhood", "property_type", "area", "total_price", "price_per_meter", "source_type", "external_id", "import_batch_id", "raw_payload",
  ],
};

async function actor(req: Request) {
  const auth = req.headers.get("authorization") || "";
  if (!auth.startsWith("Bearer ")) return null;
  const r = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { apikey: ANON_KEY, Authorization: auth },
  });
  if (!r.ok) return null;
  const user = await r.json();
  if (!user?.id) return null;
  const { data: profile } = await db.from("app_roles").select("user_id,role,active").eq("user_id", user.id).maybeSingle();
  if (!profile?.active) return null;
  return { user, profile };
}

async function audit(userId: string, target: string, input: unknown, result: unknown, success: boolean) {
  try {
    await db.from("ai_actions").insert({
      actor_user_id: userId, channel: "crm", action_type: "data_import", entity_type: target,
      entity_id: null, input_summary: input, result_summary: result, success,
    });
  } catch (_) { /* audit failure must not leak details */ }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ error: "POST required" }, 405);
  try {
    const a = await actor(req);
    if (!a) return json({ error: "Unauthorized" }, 401);

    let p: any;
    try { p = await req.json(); } catch { return json({ error: "Invalid JSON" }, 400); }
    const action = p?.action || "plan";

    if (!WRITE_ROLES.includes(a.profile.role)) return json({ error: "forbidden" }, 403);

    if (action === "plan") {
      return json({ ok: true, agent: "BuildWise Data Agent", steps: ["validate role", "allow-list columns", "stamp actor", "process in batches", "audit log"] });
    }

    const target = String(p.target || "properties");
    if (!(target in ALLOWED)) return json({ error: "Unknown target" }, 400);
    if (target === "market" && !MARKET_ROLES.includes(a.profile.role)) return json({ error: "forbidden" }, 403);

    if (!Array.isArray(p.rows) || p.rows.length < 1 || p.rows.length > MAX_ROWS) {
      return json({ error: `rows must contain 1..${MAX_ROWS} records` }, 400);
    }

    const allowed = new Set(ALLOWED[target]);
    let dropped = 0;
    const rows = p.rows.map((r: any) => {
      const o: Record<string, unknown> = {};
      if (r && typeof r === "object") {
        for (const [k, v] of Object.entries(r)) { if (allowed.has(k)) o[k] = v; else dropped++; }
      }
      if (target !== "market") o.created_by = a.user.id;
      return o;
    });

    let result: any;
    if (target === "properties") result = await db.from("properties").insert(rows);
    else if (target === "leads") result = await db.from("leads").insert(rows);
    else result = await db.from("market_price_observations").upsert(rows, { onConflict: "source_type,external_id,observed_at", ignoreDuplicates: false });

    if (result.error) {
      await audit(a.user.id, target, { rows: rows.length, dropped_fields: dropped }, { error: result.error.message }, false);
      return json({ ok: false, target, error: result.error.message }, 400);
    }
    await audit(a.user.id, target, { rows: rows.length, dropped_fields: dropped }, { processed: rows.length }, true);
    return json({ ok: true, agent: "BuildWise Data Agent", target, processed: rows.length, dropped_fields: dropped });
  } catch (e) {
    console.error(e);
    return json({ error: "internal_error" }, 500);
  }
});
