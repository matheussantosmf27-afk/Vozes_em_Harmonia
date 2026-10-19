import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden className={cn("size-9 shrink-0", className)}>
      <rect width="64" height="64" rx="14" className="fill-primary" />
      <g strokeWidth="2.4" strokeLinecap="round" fill="none" className="stroke-primary-foreground" opacity=".85">
        <path d="M10 22c8-6 14 6 22 0s14 6 22 0" />
        <path d="M10 32c8-6 14 6 22 0s14 6 22 0" />
        <path d="M10 42c8-6 14 6 22 0s14 6 22 0" />
      </g>
      <circle cx="22" cy="40" r="5" className="fill-gold" />
      <path d="M26.5 40V18M44.5 34V14M26.5 18 44.5 14" strokeWidth="2.6" strokeLinecap="round" className="stroke-gold" />
      <circle cx="40" cy="34" r="5" className="fill-gold" />
    </svg>
  );
}

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      {!compact && (
        <span className="leading-tight">
          <span className="block font-heading text-lg font-semibold tracking-tight">Vozes em Harmonia</span>
          <span className="block text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Escola do ministério</span>
        </span>
      )}
    </span>
  );
}
