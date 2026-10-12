CREATE OR REPLACE FUNCTION public.manager_edit_record(
  p_table text,
  p_id text,
  p_patch jsonb,
  p_reason text DEFAULT NULL::text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $function$
DECLARE
  before_row jsonb;
  after_row jsonb;
  k text;
  v jsonb;
  typ text;
  is_not_null boolean;
  has_updated_at boolean;
  allowed_tables text[] := ARRAY['public_requests'];
  allowed_columns text[] := ARRAY[
    'full_name','phone','request_type','property_type','region',
    'neighborhood','budget_min','budget_max','status','requirements'
  ];
BEGIN
  IF auth.uid() IS NULL OR NOT public.is_manager_user() THEN
    RAISE EXCEPTION 'manager_only';
  END IF;
  IF p_table IS NULL OR NOT (p_table = ANY(allowed_tables)) THEN
    RAISE EXCEPTION 'table_not_allowlisted';
  END IF;
  IF p_id IS NULL OR btrim(p_id) = '' THEN
    RAISE EXCEPTION 'record_id_required';
  END IF;
  IF p_patch IS NULL OR jsonb_typeof(p_patch) <> 'object' OR p_patch = '{}'::jsonb THEN
    RAISE EXCEPTION 'invalid_patch';
  END IF;
  IF (SELECT count(*) FROM jsonb_object_keys(p_patch)) > 30 THEN
    RAISE EXCEPTION 'patch_too_large';
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = p_table AND column_name = 'updated_at'
  ) INTO has_updated_at;

  EXECUTE format('SELECT to_jsonb(t) FROM public.%I t WHERE t.id::text = $1 FOR UPDATE', p_table)
    INTO before_row USING p_id;
  IF before_row IS NULL THEN RAISE EXCEPTION 'record_not_found'; END IF;

  FOR k, v IN SELECT key, value FROM jsonb_each(p_patch) LOOP
    IF NOT (k = ANY(allowed_columns)) THEN
      RAISE EXCEPTION 'column_not_allowlisted:%', k;
    END IF;

    SELECT format_type(a.atttypid, a.atttypmod), a.attnotnull
      INTO typ, is_not_null
    FROM pg_attribute a
    JOIN pg_class c ON c.oid = a.attrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
      AND c.relname = p_table
      AND a.attname = k
      AND a.attnum > 0
      AND NOT a.attisdropped;

    IF typ IS NULL THEN RAISE EXCEPTION 'column_not_found:%', k; END IF;
    IF v = 'null'::jsonb AND is_not_null THEN
      RAISE EXCEPTION 'column_not_nullable:%', k;
    END IF;

    IF v = 'null'::jsonb THEN
      IF has_updated_at THEN
        EXECUTE format('UPDATE public.%I SET %I = NULL, updated_at = now() WHERE id::text = $1', p_table, k) USING p_id;
      ELSE
        EXECUTE format('UPDATE public.%I SET %I = NULL WHERE id::text = $1', p_table, k) USING p_id;
      END IF;
    ELSE
      IF has_updated_at THEN
        EXECUTE format('UPDATE public.%I SET %I = $1::%s, updated_at = now() WHERE id::text = $2', p_table, k, typ)
          USING v #>> '{}', p_id;
      ELSE
        EXECUTE format('UPDATE public.%I SET %I = $1::%s WHERE id::text = $2', p_table, k, typ)
          USING v #>> '{}', p_id;
      END IF;
    END IF;
  END LOOP;

  EXECUTE format('SELECT to_jsonb(t) FROM public.%I t WHERE t.id::text = $1', p_table)
    INTO after_row USING p_id;

  INSERT INTO public.manager_edit_events(manager_id, entity_table, entity_id, before_data, patch, after_data, reason)
  VALUES (auth.uid(), p_table, p_id, before_row, p_patch, after_row, p_reason);

  RETURN after_row;
END
$function$;