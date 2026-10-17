-- Restrict direct execution of the active-user predicate to authenticated sessions.
-- RLS policies in this repository call it for authenticated users; no direct frontend RPC
-- call was found during the repository search. This migration is intentionally NOT applied.
REVOKE EXECUTE ON FUNCTION public.is_active_user() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_active_user() TO authenticated;
