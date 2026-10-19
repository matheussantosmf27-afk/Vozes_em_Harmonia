import { isBlackKey, noteName, pitchClass } from "@/lib/music/notes";
import { cn } from "@/lib/utils";

const LETTER_INDEX = [0, 0, 1, 1, 2, 3, 3, 4, 4, 5, 5, 6]; // C C# D D# E F F# G G# A A# B

function diatonicIndex(midi: number) {
  const octave = Math.floor(midi / 12) - 1;
  return octave * 7 + LETTER_INDEX[pitchClass(midi)];
}

const BOTTOM_LINE = { sol: 4 * 7 + 2, fa: 2 * 7 + 4 }; // Mi4 / Sol2

export function Staff({
  clef,
  notes,
  label,
  className,
  highlightIndex,
}: {
  clef: "sol" | "fa";
  notes: number[];
  label?: string;
  className?: string;
  highlightIndex?: number;
}) {
  const gap = 12;
  const top = 40;
  const bottomLineY = top + gap * 4;
  const leftPad = 62;
  const step = 46;
  const width = leftPad + Math.max(1, notes.length) * step + 20;
  const height = 150;
  const ref = BOTTOM_LINE[clef];
  const yFor = (m: number) => bottomLineY - (diatonicIndex(m) - ref) * (gap / 2);
  const description = label ?? `Pauta em clave de ${clef === "sol" ? "Sol" : "Fá"}: ${notes.map((n) => noteName(n)).join(", ")}`;

  return (
    <figure className={cn("w-full overflow-x-auto", className)}>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-36 min-w-full max-w-full" role="img" aria-label={description}>
        {[0, 1, 2, 3, 4].map((i) => (
          <line key={i} x1={8} x2={width - 8} y1={top + i * gap} y2={top + i * gap} className="stroke-foreground/70" strokeWidth={1.1} />
        ))}
        <text
          x={14}
          y={clef === "sol" ? top + gap * 3 + 15 : top + gap * 1 + 14}
          className="fill-foreground font-music"
          fontSize={clef === "sol" ? 58 : 40}
        >
          {clef === "sol" ? "𝄞" : "𝄢"}
        </text>
        {notes.map((m, i) => {
          const x = leftPad + i * step + step / 2;
          const y = yFor(m);
          const idx = diatonicIndex(m);
          const ledgers: number[] = [];
          for (let k = ref - 2; k >= idx; k -= 2) ledgers.push(bottomLineY - (k - ref) * (gap / 2));
          for (let k = ref + 10; k <= idx; k += 2) ledgers.push(bottomLineY - (k - ref) * (gap / 2));
          const stemUp = idx < ref + 4;
          const active = highlightIndex === i;
          return (
            <g key={i} className={active ? "fill-primary stroke-primary" : "fill-foreground stroke-foreground"}>
              {ledgers.map((ly) => (
                <line key={ly} x1={x - 13} x2={x + 13} y1={ly} y2={ly} strokeWidth={1.1} />
              ))}
              {isBlackKey(m) && (
                <text x={x - 24} y={y + 6} fontSize={18} className="font-music" stroke="none">
                  ♯
                </text>
              )}
              <ellipse cx={x} cy={y} rx={7.2} ry={5.2} transform={`rotate(-20 ${x} ${y})`} stroke="none" />
              <line x1={stemUp ? x + 6.6 : x - 6.6} x2={stemUp ? x + 6.6 : x - 6.6} y1={y} y2={stemUp ? y - 34 : y + 34} strokeWidth={1.4} />
            </g>
          );
        })}
      </svg>
      {label && <figcaption className="mt-1 text-sm text-muted-foreground">{label}</figcaption>}
    </figure>
  );
}
