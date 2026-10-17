-- Semantics-preserving RLS performance fix: evaluate stable auth functions once per statement.
-- Rebuild only policies whose expressions call auth.*() directly; policy predicates and roles remain unchanged.
DO $$
DECLARE
  p record;
  role_list text;
  using_clause text;
  check_clause text;
BEGIN
  FOR p IN
    SELECT *
    FROM pg_policies
    WHERE schemaname = 'public'
      AND (
        coalesce(qual, '') ~* 'auth\.[a-z_]+\s*\(\s*\)'
        OR coalesce(with_check, '') ~* 'auth\.[a-z_]+\s*\(\s*\)'
      )
  LOOP
    SELECT string_agg(
      CASE WHEN lower(r) = 'public' THEN 'PUBLIC' ELSE format('%I', r) END,
      ', '
    )
    INTO role_list
    FROM unnest(p.roles) AS roles(r);

    using_clause := CASE
      WHEN p.qual IS NULL THEN ''
      ELSE ' USING (' || regexp_replace(
        p.qual,
        '(auth\.[a-z_]+\s*\(\s*\))',
        '(select \1)',
        'gi'
      ) || ')'
    END;

    check_clause := CASE
      WHEN p.with_check IS NULL THEN ''
      ELSE ' WITH CHECK (' || regexp_replace(
        p.with_check,
        '(auth\.[a-z_]+\s*\(\s*\))',
        '(select \1)',
        'gi'
      ) || ')'
    END;

    EXECUTE format('DROP POLICY %I ON %I.%I', p.policyname, p.schemaname, p.tablename);
    EXECUTE format(
      'CREATE POLICY %I ON %I.%I AS %s FOR %s TO %s%s%s',
      p.policyname,
      p.schemaname,
      p.tablename,
      lower(p.permissive),
      p.cmd,
      role_list,
      using_clause,
      check_clause
    );
  END LOOP;
END
$$;