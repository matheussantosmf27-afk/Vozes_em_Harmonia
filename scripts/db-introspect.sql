select json_build_object(
  'columns', (
    select json_agg(json_build_object(
      'table', c.table_name, 'name', c.column_name, 'udt', c.udt_name, 'type', c.data_type,
      'nullable', c.is_nullable = 'YES', 'hasDefault', c.column_default is not null,
      'generated', c.is_generated = 'ALWAYS', 'pos', c.ordinal_position
    ) order by c.table_name, c.ordinal_position)
    from information_schema.columns c
    join information_schema.tables t on t.table_schema = c.table_schema and t.table_name = c.table_name
    where c.table_schema = 'public' and t.table_type = 'BASE TABLE'
  ),
  'enums', (
    select json_object_agg(t.typname, (select json_agg(e.enumlabel order by e.enumsortorder) from pg_enum e where e.enumtypid = t.oid))
    from pg_type t join pg_namespace n on n.oid = t.typnamespace
    where n.nspname = 'public' and t.typtype = 'e'
  ),
  'fks', (
    select json_agg(json_build_object(
      'name', con.conname, 'table', cl.relname, 'columns', (select json_agg(a.attname order by k.ord) from unnest(con.conkey) with ordinality k(attnum, ord) join pg_attribute a on a.attrelid = con.conrelid and a.attnum = k.attnum),
      'refTable', rcl.relname, 'refSchema', rn.nspname,
      'refColumns', (select json_agg(a.attname order by k.ord) from unnest(con.confkey) with ordinality k(attnum, ord) join pg_attribute a on a.attrelid = con.confrelid and a.attnum = k.attnum),
      'oneToOne', exists (
        select 1 from pg_index i where i.indrelid = con.conrelid and (i.indisunique or i.indisprimary)
          and i.indpred is null and (select array_agg(x order by x) from unnest(i.indkey::int2[]) x) = (select array_agg(x order by x) from unnest(con.conkey) x)
      )
    ))
    from pg_constraint con
    join pg_class cl on cl.oid = con.conrelid join pg_namespace n on n.oid = cl.relnamespace
    join pg_class rcl on rcl.oid = con.confrelid join pg_namespace rn on rn.oid = rcl.relnamespace
    where con.contype = 'f' and n.nspname = 'public' and rn.nspname = 'public'
  ),
  'functions', (
    select json_agg(json_build_object(
      'name', p.proname,
      'args', coalesce((select json_agg(json_build_object('name', p.proargnames[i], 'type', format_type(p.proargtypes[i - 1], null)) order by i)
                        from generate_series(1, p.pronargs) i), '[]'::json),
      'returns', format_type(p.prorettype, null),
      'retset', p.proretset,
      'outCols', (select json_agg(json_build_object('name', p.proargnames[i], 'type', format_type(p.proallargtypes[i], null)) order by i)
                  from generate_series(1, coalesce(array_length(p.proallargtypes, 1), 0)) i where p.proargmodes[i] = 't')
    ))
    from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.prokind = 'f' and format_type(p.prorettype, null) <> 'trigger'
  )
);
