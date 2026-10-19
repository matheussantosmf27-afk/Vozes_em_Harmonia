#!/usr/bin/env bash
# Funções para subir um PostgreSQL temporário com as migrations aplicadas.
# Uso: source scripts/pg-temp.sh; pg_temp_start; ...; (limpeza automática)
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PGBIN="${PGBIN:-$(ls -d /usr/lib/postgresql/*/bin 2>/dev/null | sort -V | tail -1)}"
PG_WORK="$(mktemp -d)"
PG_PORT="${PGPORT_TEST:-55432}"
pg_temp_cleanup() { "$PGBIN/pg_ctl" -D "$PG_WORK/data" -m immediate stop >/dev/null 2>&1 || true; rm -rf "$PG_WORK"; }
trap pg_temp_cleanup EXIT

pg_run() {
  if [ "$(id -u)" = "0" ]; then su postgres -s /bin/bash -c "$*"; else bash -c "$*"; fi
}

pg_temp_start() {
  [ "$(id -u)" = "0" ] && chown -R postgres "$PG_WORK"
  pg_run "$PGBIN/initdb -D $PG_WORK/data -U postgres -A trust >/dev/null"
  pg_run "$PGBIN/pg_ctl -D $PG_WORK/data -o '-p $PG_PORT -k $PG_WORK -c listen_addresses=' -l $PG_WORK/log -w start >/dev/null"
  PSQL=(psql -h "$PG_WORK" -p "$PG_PORT" -U postgres -d postgres -v ON_ERROR_STOP=1 -q -X)
  "${PSQL[@]}" -f "$ROOT/supabase/tests/00_supabase_stub.sql"
  for f in "$ROOT"/supabase/migrations/*.sql; do
    echo "→ migration $(basename "$f")" >&2
    "${PSQL[@]}" -f "$f"
  done
}
