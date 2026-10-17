import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const s = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
  "Vary": "Origin",
};
const j = (x: unknown, n = 200) => new Response(JSON.stringify(x), {
  status: n,
  headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...CORS },
});
const h = async (v: string) => {
  const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(v));
  return [...new Uint8Array(d)].map(x => x.toString(16).padStart(2, "0")).join("");
};

Deno.serve(async r => {
  if (r.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
  if (r.method !== "POST") return j({ error: "method_not_allowed" }, 405);
  try {
    const b = await r.json();
    const phone = String(b.phone ?? "").trim().replace(/\\s+/g, "");
    const type = String(b.request_type ?? "").trim();
    if (phone.length < 8 || !type) return j({ error: "phone_and_request_type_required" }, 400);

    const ph = await h(phone);
    const recent = await s.from("public_requests").select("id", { count: "exact", head: true })
      .eq("phone_hash", ph).gte("created_at", new Date(Date.now() - 3600000).toISOString());
    if (recent.error) return j({ error: "request_temporarily_unavailable" }, 503);
    if ((recent.count ?? 0) >= 5) return j({ error: "rate_limited" }, 429);

    const ip = String(r.headers.get("x-forwarded-for") || r.headers.get("cf-connecting-ip") || "unknown")
      .split(",")[0].trim();
    const ins = await s.from("public_requests").insert({
      full_name: String(b.full_name ?? "").trim().slice(0, 120) || null,
      phone,
      phone_hash: ph,
      request_type: type.slice(0, 40),
      property_type: String(b.property_type ?? "").trim().slice(0, 60) || null,
      region: Number.isFinite(Number(b.region)) ? Number(b.region) : null,
      neighborhood: String(b.neighborhood ?? "").trim().slice(0, 120) || null,
      budget_min: Number.isFinite(Number(b.budget_min)) ? Number(b.budget_min) : null,
      budget_max: Number.isFinite(Number(b.budget_max)) ? Number(b.budget_max) : null,
      requirements: typeof b.requirements === "object" && b.requirements ? b.requirements : {},
      source: String(b.source ?? "public_web").slice(0, 40),
      ip_hash: await h(ip),
      user_agent_hash: await h(r.headers.get("user-agent") || "unknown"),
    }).select("id").single();
    if (ins.error) return j({ error: "request_not_saved" }, 500);

    await s.from("security_events").insert({
      event_type: "public_request_created",
      resource_type: "public_request",
      resource_id: String(ins.data.id),
      metadata: { request_type: type },
    });
    const a = await s.from("app_roles").select("user_id").eq("active", true)
      .in("role", ["owner", "staff"]).limit(5);
    if (a.data?.length) {
      await s.from("request_agent_routes").insert(
        a.data.map((x, i) => ({ request_id: ins.data.id, agent_user_id: x.user_id, score: 100 - i * 5, status: "offered" })),
      );
    }
    return j({ ok: true, request_id: ins.data.id, status: "received" });
  } catch {
    return j({ error: "invalid_request" }, 400);
  }
});
