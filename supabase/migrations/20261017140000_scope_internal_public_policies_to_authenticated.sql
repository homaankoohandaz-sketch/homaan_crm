-- Security hardening: internal policies must not target PUBLIC (which includes anon).
-- Scope is intentionally limited to the internal tables reviewed on 2026-10-17.
-- Existing USING/WITH CHECK expressions and PERMISSIVE/RESTRICTIVE mode are preserved.
begin;

do $migration$
declare
  r record;
  v_command text;
  v_using text;
  v_check text;
begin
  for r in
    select n.nspname as schema_name,
           c.relname as table_name,
           p.polname as policy_name,
           p.polcmd as policy_command,
           p.polpermissive as is_permissive,
           pg_get_expr(p.polqual, p.polrelid) as using_expr,
           pg_get_expr(p.polwithcheck, p.polrelid) as check_expr
      from pg_policy p
      join pg_class c on c.oid = p.polrelid
      join pg_namespace n on n.oid = c.relnamespace
     where n.nspname = 'public'
       and c.relname = any (array[
         'activity_logs', 'app_roles', 'appointments', 'deals',
         'followups', 'import_batches', 'invited_emails', 'leads',
         'owners', 'properties', 'property_documents',
         'property_images', 'property_photos', 'user_reports'
       ])
       and p.polroles = array[0::oid]
     order by c.relname, p.polname
  loop
    v_command := case r.policy_command
      when 'r' then 'SELECT'
      when 'a' then 'INSERT'
      when 'w' then 'UPDATE'
      when 'd' then 'DELETE'
      when '*' then 'ALL'
      else null
    end;

    if v_command is null then
      raise exception 'Unexpected policy command % for %.%', r.policy_command, r.table_name, r.policy_name;
    end if;

    v_using := case when r.using_expr is not null
      then ' USING (' || r.using_expr || ')' else '' end;
    v_check := case when r.check_expr is not null
      then ' WITH CHECK (' || r.check_expr || ')' else '' end;

    execute format('drop policy %I on %I.%I',
      r.policy_name, r.schema_name, r.table_name);

    execute format(
      'create policy %I on %I.%I as %s for %s to authenticated%s%s',
      r.policy_name,
      r.schema_name,
      r.table_name,
      case when r.is_permissive then 'PERMISSIVE' else 'RESTRICTIVE' end,
      v_command,
      v_using,
      v_check
    );
  end loop;
end
$migration$;

commit;
