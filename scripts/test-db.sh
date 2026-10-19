#!/usr/bin/env bash
# Aplica as migrations em um PostgreSQL temporário (com simulação do
# Supabase) e executa os testes de RLS/regras em supabase/tests.
set -euo pipefail
source "$(dirname "$0")/pg-temp.sh"
pg_temp_start
for f in "$ROOT"/supabase/tests/[1-9]*.sql; do
  [ -e "$f" ] || continue
  echo "→ teste $(basename "$f")"
  "${PSQL[@]}" -f "$f"
done
echo "✓ banco de dados: migrations e testes OK"
