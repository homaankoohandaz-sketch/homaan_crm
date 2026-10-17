-- Least privilege: these SECURITY DEFINER RPCs have no caller in the currently loaded
-- application bundle or deployed ai-orchestrator. Keep them callable by database owners
-- and service-role jobs, but remove direct PostgREST execution by authenticated users.
revoke all on function public.buildwise_ai_control_scan(bigint) from public, anon, authenticated;
grant execute on function public.buildwise_ai_control_scan(bigint) to postgres, service_role;
revoke all on function public.buildwise_check_limit(text,bigint) from public, anon, authenticated;
grant execute on function public.buildwise_check_limit(text,bigint) to postgres, service_role;
revoke all on function public.buildwise_plan_status() from public, anon, authenticated;
grant execute on function public.buildwise_plan_status() to postgres, service_role;
revoke all on function public.buildwise_project_dashboard(bigint) from public, anon, authenticated;
grant execute on function public.buildwise_project_dashboard(bigint) to postgres, service_role;
revoke all on function public.crm_deal_radar() from public, anon, authenticated;
grant execute on function public.crm_deal_radar() to postgres, service_role;
revoke all on function public.crm_market_value(bigint) from public, anon, authenticated;
grant execute on function public.crm_market_value(bigint) to postgres, service_role;
revoke all on function public.crm_match_score(bigint,bigint) from public, anon, authenticated;
grant execute on function public.crm_match_score(bigint,bigint) to postgres, service_role;
revoke all on function public.crm_record_learning(text,text,bigint,jsonb,jsonb,numeric) from public, anon, authenticated;
grant execute on function public.crm_record_learning(text,text,bigint,jsonb,jsonb,numeric) to postgres, service_role;
revoke all on function public.crm_run_matching(bigint,integer) from public, anon, authenticated;
grant execute on function public.crm_run_matching(bigint,integer) to postgres, service_role;
revoke all on function public.crm_schedule_conflict(timestamptz,timestamptz,uuid,bigint) from public, anon, authenticated;
grant execute on function public.crm_schedule_conflict(timestamptz,timestamptz,uuid,bigint) to postgres, service_role;
revoke all on function public.my_role() from public, anon, authenticated;
grant execute on function public.my_role() to postgres, service_role;
