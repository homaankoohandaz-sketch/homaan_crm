# BuildWise Authentication Architecture

## Canonical model

BuildWise separates **authentication** from **application authorization**.

```
Browser
  │
  │ email/password or phone OTP
  ▼
Supabase Auth
  │
  │ session + access token (JWT)
  ▼
BuildWise frontend
  │
  │ Authorization: Bearer <access token>
  ▼
Protected Edge Function
  │
  ├─ verify token with Supabase Auth
  ├─ resolve app_roles(user_id)
  ├─ require active=true
  └─ require explicit allowed role
       │
       ▼
Privileged database operation
       │
       └─ service-role client (server only)
```

## Credential classes

| Credential | Location | Purpose | Client-visible |
|---|---|---|---|
| Supabase publishable/anon key | Browser | Create Supabase client and establish Auth session | Yes |
| Supabase access token | Browser session / request header | Prove the signed-in user's identity | Sent only as Authorization header |
| SUPABASE_SERVICE_ROLE_KEY | Edge Function environment | Privileged server-side database operations | **No** |
| External integration secrets | Edge Function environment | Google/Telegram/AI/etc. integrations | **No** |

## Authorization source

`app_roles` is the BuildWise authorization layer. A valid Supabase user is not automatically a valid BuildWise operator.

Required checks:

1. Bearer token exists.
2. Supabase Auth accepts the token.
3. `app_roles.user_id` matches the authenticated user.
4. `app_roles.active = true`.
5. The role is explicitly allowed by the Edge Function.

Canonical server implementation:

`supabase/functions/_shared/auth.ts`

Use `requireRole(req, ['owner', 'staff'])` for protected functions instead of duplicating token/role checks.

## Security rules

- Never put the service-role key in frontend code.
- Never log access tokens, service-role keys, OTPs, passwords, or integration secrets.
- Frontend role checks are UX controls, not the final security boundary.
- Protected database access must be enforced by Supabase RLS and/or authenticated Edge Functions.
- Privileged service-role access must occur only after identity and role verification.
- New protected Edge Functions must use the shared auth module.

## Current migration

The shared authentication contract is implemented and `google-sheets-sync` is migrated to it. Remaining protected Edge Functions should be migrated incrementally, with tests and security review before release.
