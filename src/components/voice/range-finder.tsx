"use client";

import { useMemo, useState, useTransition } from "react";
import { ArrowDown, ArrowUp, Check, RotateCcw, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PitchMeter } from "@/components/music/pitch-meter";
import { MicConsent } from "@/components/music/mic-consent";
import { usePitchDetector } from "@/lib/audio/use-pitch-detector";
import { playMidi } from "@/lib/audio/engine";
import { noteName } from "@/lib/music/notes";
import { saveVocalRange } from "@/app/actions/voice";
import { cn } from "@/lib/utils";

export interface RangeResult {
  low: number;
  high: number;
  comfortableLow: number;
  comfortableHigh: number;
  confidence: "confiavel" | "incerta";
  usedMic: boolean;
}

type Mark = "conforto" | "esforco" | "nao";

/**
 * Mapeamento guiado: desce e sobe de tom em tom a partir de uma nota média,
 * e a pessoa marca cada nota como confortável, com esforço ou não alcançada.
 * Para no primeiro “não alcanço” — sem competição por extensão.
 */
export function RangeFinder({ onResult, persist = true }: { onResult?: (r: RangeResult) => void; persist?: boolean }) {
  const mic = usePitchDetector();
  const [group, setGroup] = useState<"agudas" | "graves" | null>(null);
  const [direction, setDirection] = useState<"down" | "up">("down");
  const [current, setCurrent] = useState<number | null>(null);
  const [marks, setMarks] = useState<Record<number, { mark: Mark; matched: boolean | null }>>({});
  const [finished, setFinished] = useState(false);
  const [pending, startTransition] = useTransition();

  const start = group === "agudas" ? 60 : 48;

  function begin(g: "agudas" | "graves") {
    setGroup(g);
    setDirection("down");
    setMarks({});
    setFinished(false);
    const s = g === "agudas" ? 60 : 48;
    setCurrent(s);
    void playMidi(s, { duration: 1.4, instrument: "piano" });
  }

  function micMatched(target: number): boolean | null {
    if (mic.status !== "listening" || !mic.pitch?.midi || mic.pitch.confidence === "sem_sinal") return null;
    return Math.abs(mic.pitch.midi - target) <= 0.6;
  }

  function mark(m: Mark) {
    if (current === null) return;
    const next = { ...marks, [current]: { mark: m, matched: micMatched(current) } };
    setMarks(next);
    if (direction === "down") {
      const n = current - 2;
      if (m === "nao" || n < 36) {
        setDirection("up");
        const up = start + 2;
        setCurrent(up);
        void playMidi(up, { duration: 1.4 });
      } else {
        setCurrent(n);
        void playMidi(n, { duration: 1.4 });
      }
    } else {
      const n = current + 2;
      if (m === "nao" || n > 86) {
        setCurrent(null);
        setFinished(true);
      } else {
        setCurrent(n);
        void playMidi(n, { duration: 1.4 });
      }
    }
  }

  const result: RangeResult | null = useMemo(() => {
    const entries = Object.entries(marks).map(([k, v]) => ({ midi: Number(k), ...v }));
    const reached = entries.filter((e) => e.mark !== "nao");
    const comfy = entries.filter((e) => e.mark === "conforto");
    if (!reached.length || !comfy.length) return null;
    const checked = reached.filter((e) => e.matched !== null);
    const usedMic = checked.length > 0;
    const confidence = usedMic && checked.length >= reached.length * 0.7 && checked.every((e) => e.matched) ? "confiavel" : "incerta";
    return {
      low: Math.min(...reached.map((e) => e.midi)),
      high: Math.max(...reached.map((e) => e.midi)),
      comfortableLow: Math.min(...comfy.map((e) => e.midi)),
      comfortableHigh: Math.max(...comfy.map((e) => e.midi)),
      confidence,
      usedMic,
    };
  }, [marks]);

  function save() {
    if (!result) return;
    onResult?.(result);
    if (!persist) return;
    startTransition(async () => {
      const res = await saveVocalRange(result);
      if (res.ok) toast.success("Região confortável registrada.");
      else toast.error(res.error);
    });
  }

  if (!group) {
    return (
      <div className="space-y-4">
        <p className="text-muted-foreground">
          Vamos tocar notas de tom em tom. Cante cada uma em “lá” suave e marque como foi. Pare no primeiro sinal de esforço excessivo: o objetivo é conhecer a sua região confortável, não alcançar extremos.
        </p>
        <MicConsent status={mic.status} onStart={() => void mic.start()} compact />
        <p className="text-sm font-medium">Em que região você costuma cantar?</p>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => begin("agudas")}>Vozes mais agudas (geralmente femininas)</Button>
          <Button variant="outline" onClick={() => begin("graves")}>
            Vozes mais graves (geralmente masculinas)
          </Button>
        </div>
      </div>
    );
  }

  const timeline = Object.keys(marks)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className="space-y-4">
      {!finished && current !== null && (
        <div className="space-y-3 rounded-2xl border bg-card p-4">
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            {direction === "down" ? <ArrowDown className="size-4" /> : <ArrowUp className="size-4" />}
            {direction === "down" ? "Descendo a partir da região média" : "Agora subindo"}
          </p>
          <p className="font-heading text-3xl">{noteName(current)}</p>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => void playMidi(current, { duration: 1.4 })}>
              Ouvir de novo
            </Button>
          </div>
          {mic.status === "listening" && <PitchMeter pitch={mic.pitch} target={current} level={mic.level} />}
          <p className="text-sm font-medium">Como foi cantar esta nota?</p>
          <div className="grid gap-2 sm:grid-cols-3">
            <Button onClick={() => mark("conforto")}>Confortável</Button>
            <Button variant="outline" onClick={() => mark("esforco")}>
              Com esforço
            </Button>
            <Button variant="outline" onClick={() => mark("nao")}>
              Não alcanço / dói
            </Button>
          </div>
        </div>
      )}
      {timeline.length > 0 && (
        <div className="flex flex-wrap gap-1.5" aria-label="Notas marcadas">
          {timeline.map((m) => (
            <span
              key={m}
              className={cn(
                "rounded-md px-2 py-1 text-xs font-medium",
                marks[m].mark === "conforto" ? "bg-success/15 text-success" : marks[m].mark === "esforco" ? "bg-warning/20 text-warning-foreground" : "bg-muted text-muted-foreground line-through",
              )}
            >
              {noteName(m)}
              {marks[m].matched === true && " ✓"}
            </span>
          ))}
        </div>
      )}
      {finished && (
        <div className="space-y-3 rounded-2xl border bg-card p-4" aria-live="polite">
          {result ? (
            <>
              <p className="font-medium">
                Região confortável: {noteName(result.comfortableLow)} a {noteName(result.comfortableHigh)}
              </p>
              <p className="text-sm text-muted-foreground">
                Extensão observada hoje (incluindo notas com esforço): {noteName(result.low)} a {noteName(result.high)}.{" "}
                {result.confidence === "confiavel" ? "As notas foram confirmadas pelo microfone." : result.usedMic ? "Algumas notas não foram confirmadas pelo microfone (detecção incerta)." : "Resultado por autoavaliação (sem microfone)."}
              </p>
              <p className="text-xs text-muted-foreground">A região muda com aquecimento, cansaço e estudo. Isto não é um diagnóstico; o professor pode refinar a avaliação.</p>
              <div className="flex flex-wrap gap-2">
                <Button onClick={save} disabled={pending}>
                  {persist ? <Save /> : <Check />} {persist ? "Salvar no meu perfil" : "Usar este resultado"}
                </Button>
                <Button variant="ghost" onClick={() => setGroup(null)}>
                  <RotateCcw /> Refazer
                </Button>
              </div>
            </>
          ) : (
            <>
              <p>Nenhuma nota foi marcada como confortável. Tudo bem — refaça mais tarde, com a voz aquecida, ou peça ajuda ao professor.</p>
              <Button variant="outline" onClick={() => setGroup(null)}>
                <RotateCcw /> Refazer
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
