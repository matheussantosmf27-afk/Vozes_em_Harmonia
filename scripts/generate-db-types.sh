#!/usr/bin/env bash
# Gera src/lib/supabase/database.types.ts a partir das migrations.
# (Alternativa oficial com um projeto Supabase: `supabase gen types typescript`.)
set -euo pipefail
source "$(dirname "$0")/pg-temp.sh"
pg_temp_start
"${PSQL[@]}" -At -f "$ROOT/scripts/db-introspect.sql" > "$PG_WORK/schema.json"
npx tsx "$ROOT/scripts/db-types.ts" "$PG_WORK/schema.json" > "$ROOT/src/lib/supabase/database.types.ts"
echo "✓ src/lib/supabase/database.types.ts"
