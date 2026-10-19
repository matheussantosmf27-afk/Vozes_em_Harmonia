/** Barras de atividade diária (dados reais; dias sem estudo aparecem vazios). */
export function ActivityChart({ days }: { days: { day: string; label: string; count: number }[] }) {
  const max = Math.max(1, ...days.map((d) => d.count));
  return (
    <figure className="space-y-2">
      <div className="flex h-32 items-end gap-1" role="img" aria-label={`Atividade nos últimos ${days.length} dias: ${days.filter((d) => d.count > 0).length} dias com estudo`}>
        {days.map((d) => (
          <div key={d.day} className="group relative flex h-full flex-1 flex-col justify-end">
            <div className={d.count ? "rounded-t bg-primary/80" : "h-0.5 rounded bg-muted"} style={d.count ? { height: `${Math.max(6, (d.count / max) * 100)}%` } : undefined} />
            <span className="pointer-events-none absolute -top-6 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-foreground px-1.5 py-0.5 text-[10px] text-background group-hover:block">
              {d.label}: {d.count}
            </span>
          </div>
        ))}
      </div>
      <figcaption className="flex justify-between text-xs text-muted-foreground">
        <span>{days[0]?.label}</span>
        <span>hoje</span>
      </figcaption>
    </figure>
  );
}
