const TZ = "America/Sao_Paulo";

export function formatDate(value: string | Date, opts: Intl.DateTimeFormatOptions = { day: "2-digit", month: "short", year: "numeric" }) {
  return new Intl.DateTimeFormat("pt-BR", { timeZone: TZ, ...opts }).format(typeof value === "string" ? new Date(value) : value);
}

export function formatDateTime(value: string | Date) {
  return formatDate(value, { weekday: "short", day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

export function formatRelative(value: string | Date) {
  const d = typeof value === "string" ? new Date(value) : value;
  const diff = (d.getTime() - Date.now()) / 1000;
  const rtf = new Intl.RelativeTimeFormat("pt-BR", { numeric: "auto" });
  const abs = Math.abs(diff);
  if (abs < 60) return rtf.format(Math.round(diff), "second");
  if (abs < 3600) return rtf.format(Math.round(diff / 60), "minute");
  if (abs < 86400) return rtf.format(Math.round(diff / 3600), "hour");
  if (abs < 86400 * 30) return rtf.format(Math.round(diff / 86400), "day");
  return formatDate(d);
}

export function pct(v: number | null | undefined) {
  return v == null ? "—" : `${Math.round(v * 100)}%`;
}

/** Data local (AAAA-MM-DD) no fuso do ministério. */
export function localDay(value: string | Date) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(typeof value === "string" ? new Date(value) : value);
}

export const LEVEL_LABEL: Record<number, string> = { 1: "Iniciante", 2: "Intermediário", 3: "Avançado" };
