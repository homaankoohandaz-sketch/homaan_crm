import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { validatePassword } from "./password-policy.mjs";

// Server-side advisor signup: enforces the password policy before Supabase Auth creates the account.
// Deploy with verify_jwt = false (caller is anonymous). Auth email confirmation flow is unchanged.
const CORS = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "content-type, apikey, authorization", "Access-Control-Allow-Methods": "POST,OPTIONS" };
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", ...CORS } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);
  let b: Record<string, unknown>;
  try { b = await req.json(); } catch { return json({ error: "invalid_json" }, 400); }
  const fullName = String(b.fullName ?? "").trim().slice(0, 120);
  const email = String(b.email ?? "").trim().toLowerCase().slice(0, 254);
  const password = String(b.password ?? "");
  const redirectTo = typeof b.redirectTo === "string" && /^https:\/\//.test(b.redirectTo) ? b.redirectTo : undefined;
  if (!fullName || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return json({ error: "invalid_input", message: "نام و ایمیل معتبر الزامی است." }, 400);
  const policyError = await validatePassword(password);
  if (policyError) return json({ error: "weak_password", message: policyError }, 422);
  const client = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, { auth: { persistSession: false } });
  const { error } = await client.auth.signUp({ email, password, options: { data: { full_name: fullName, requested_role: "advisor" }, emailRedirectTo: redirectTo } });
  if (error) return json({ error: "signup_failed", message: error.message }, 400);
  return json({ ok: true });
});
