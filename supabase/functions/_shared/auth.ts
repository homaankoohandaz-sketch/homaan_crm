import { createClient, type SupabaseClient, type User } from 'https://esm.sh/@supabase/supabase-js@2';

export type BuildWiseRole = 'owner' | 'manager' | 'staff' | 'agent' | 'viewer';

export type AuthContext = {
  user: User;
  role: BuildWiseRole;
  active: true;
};

function jsonError(error: string, status: number) {
  return new Response(JSON.stringify({ error }), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

/**
 * BuildWise server-side auth contract:
 * 1. Read the Bearer access token from the request.
 * 2. Verify the token with Supabase Auth using the public anon key.
 * 3. Resolve the application role from app_roles using the service-role client.
 * 4. Require an active account.
 *
 * The service-role key is never returned to the caller and must remain server-side.
 */
export async function authenticateRequest(req: Request): Promise<AuthContext | Response> {
  const authorization = req.headers.get('authorization');
  if (!authorization?.toLowerCase().startsWith('bearer ')) {
    return jsonError('authorization required', 401);
  }

  const token = authorization.slice(7).trim();
  if (!token) return jsonError('authorization required', 401);

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!supabaseUrl || !anonKey || !serviceRoleKey) {
    console.error('BuildWise auth configuration is incomplete');
    return jsonError('server authentication is not configured', 500);
  }

  const authClient = createClient(supabaseUrl, anonKey);
  const adminClient = createClient(supabaseUrl, serviceRoleKey);

  const { data: { user }, error: userError } = await authClient.auth.getUser(token);
  if (userError || !user) return jsonError('unauthorized', 401);

  const { data: role, error: roleError } = await adminClient
    .from('app_roles')
    .select('role,active')
    .eq('user_id', user.id)
    .maybeSingle();

  if (roleError) {
    console.error('BuildWise role lookup failed', roleError);
    return jsonError('authorization lookup failed', 500);
  }

  if (!role?.active) return jsonError('account inactive', 403);

  return {
    user,
    role: role.role as BuildWiseRole,
    active: true,
  };
}

export async function requireRole(
  req: Request,
  allowedRoles: BuildWiseRole[],
): Promise<AuthContext | Response> {
  const auth = await authenticateRequest(req);
  if (auth instanceof Response) return auth;

  if (!allowedRoles.includes(auth.role)) {
    return jsonError('forbidden', 403);
  }

  return auth;
}

export function isAuthResponse(value: AuthContext | Response): value is Response {
  return value instanceof Response;
}

export type { SupabaseClient };
