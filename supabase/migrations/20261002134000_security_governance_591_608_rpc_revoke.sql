-- Route trigger helper is never a direct client RPC.
revoke execute on function public.route_new_public_request() from public, anon, authenticated;
