"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Check, Pause, Play, SkipForward } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { playEvents, type PlaybackHandle } from "@/lib/audio/engine";
import { seq, type NoteEvent } from "@/lib/exercises/generators";
import { recordAttempt, logPracticeDirect } from "@/app/actions/practice";
import { cn } from "@/lib/utils";

interface Step {
  title: string;
  text: string;
  seconds: number;
  pattern?: number[];
}

const STEPS: Step[] = [
  { title: "Corpo", text: "Alongue o pescoço para os lados, role os ombros para trás e solte a mandíbula com uma leve massagem.", seconds: 60 },
  { title: "Respiração", text: "Inspire em 4 tempos expandindo as costelas; solte o ar em “sss” constante por 8 a 12 tempos.", seconds: 60 },
  { title: "Vibração de lábios", text: "Faça “brrr” acompanhando a escala de cinco notas. Bochechas soltas, som contínuo.", seconds: 120, pattern: [0, 2, 4, 5, 7, 5, 4, 2, 0] },
  { title: "Sirene em “u”", text: "Deslize suavemente do grave ao agudo confortável e volte, como um elevador. Sem empurrar o topo.", seconds: 90, pattern: [0, 4, 7, 12, 7, 4, 0] },
  { title: "Escala em vogais", text: "Cante “mi-mê-má-mô-mu” na escala de cinco notas. A cada repetição a escala sobe meio-tom; pare quando sentir esforço.", seconds: 120, pattern: [0, 2, 4, 5, 7, 5, 4, 2, 0] },
  { title: "Articulação", text: "Fale e cante sem pressa: “O rato roeu a roupa do rei de Roma”. Lábios e língua ágeis, mandíbula solta.", seconds: 60 },
];

export function WarmupRoutine({ low = false }: { low?: boolean }) {
  const [region, setRegion] = useState<"agudas" | "graves">(low ? "graves" : "agudas");
  const [stepIdx, setStepIdx] = useState(0);
  const [remaining, setRemaining] = useState(STEPS[0].seconds);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [pending, startTransition] = useTransition();
  const playback = useRef<PlaybackHandle | null>(null);
  const transposeRef = useRef(0);
  const step = STEPS[stepIdx];

  const stepRef = useRef(stepIdx);
  useEffect(() => {
    stepRef.current = stepIdx;
  }, [stepIdx]);

  function goTo(next: number) {
    playback.current?.stop();
    if (next < STEPS.length) {
      setStepIdx(next);
      setRemaining(STEPS[next].seconds);
    } else {
      setRunning(false);
      setDone(true);
    }
  }

  useEffect(() => {
    if (!running) return;
    const t = window.setInterval(() => {
      setRemaining((r) => {
        if (r > 1) return r - 1;
        // fim da etapa: avança fora do cálculo do estado
        window.setTimeout(() => goTo(stepRef.current + 1), 0);
        return 0;
      });
    }, 1000);
    return () => window.clearInterval(t);
  }, [running]);

  // Repete o padrão de notas subindo meio-tom a cada vez.
  useEffect(() => {
    if (!running || !step.pattern) return;
    let cancelled = false;
    transposeRef.current = 0;
    const base = region === "agudas" ? 57 : 45;
    const loop = async () => {
      while (!cancelled) {
        const events: NoteEvent[] = seq(step.pattern!.map((s) => base + transposeRef.current + s), 0.45, 0.05, 0, "piano");
        const h = await playEvents(events);
        playback.current = h;
        await h.done;
        await new Promise((r) => setTimeout(r, 900));
        transposeRef.current = transposeRef.current >= 7 ? 0 : transposeRef.current + 1;
      }
    };
    void loop();
    return () => {
      cancelled = true;
      playback.current?.stop();
    };
  }, [running, stepIdx, region, step.pattern]);

  function finish() {
    startTransition(async () => {
      const minutes = Math.max(1, Math.round(STEPS.slice(0, stepIdx + 1).reduce((a, s) => a + s.seconds, 0) / 60));
      const r = await logPracticeDirect({ minutes, activity: "Aquecimento vocal guiado" });
      await recordAttempt({ exerciseSlug: "aquecimento-guiado", score: 1, correct: 1, total: 1, details: { selfReported: true, minutes } });
      if (r.ok) toast.success("Aquecimento registrado!");
      else toast.error(r.error);
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="text-muted-foreground">Notas de referência para:</span>
        <Button size="sm" variant={region === "agudas" ? "default" : "outline"} onClick={() => setRegion("agudas")}>
          vozes agudas
        </Button>
        <Button size="sm" variant={region === "graves" ? "default" : "outline"} onClick={() => setRegion("graves")}>
          vozes graves
        </Button>
      </div>
      <ol className="grid gap-2 sm:grid-cols-6" aria-label="Etapas">
        {STEPS.map((s, i) => (
          <li key={s.title} className={cn("rounded-lg border px-2 py-1.5 text-xs", i === stepIdx && !done ? "border-primary bg-primary/10 font-medium" : i < stepIdx || done ? "bg-success/10 text-success" : "text-muted-foreground")}>
            {i + 1}. {s.title}
          </li>
        ))}
      </ol>
      {!done ? (
        <div className="space-y-3 rounded-2xl border bg-card p-5">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="text-xl font-semibold">{step.title}</h3>
            <span className="font-mono text-2xl tabular-nums" aria-live="off">
              {Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, "0")}
            </span>
          </div>
          <p className="leading-relaxed">{step.text}</p>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setRunning(!running)}>
              {running ? <Pause /> : <Play />} {running ? "Pausar" : stepIdx === 0 && remaining === STEPS[0].seconds ? "Iniciar rotina" : "Continuar"}
            </Button>
            <Button
              variant="outline"
              onClick={() => goTo(stepIdx + 1)}
            >
              <SkipForward /> Próxima etapa
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">Interrompa em caso de dor, ardência ou rouquidão.</p>
        </div>
      ) : (
        <div className="space-y-3 rounded-2xl border bg-card p-5">
          <p className="flex items-center gap-2 font-medium">
            <Check className="text-success" /> Rotina concluída. Depois de cantar, lembre-se do desaquecimento: 1 minuto de vibração descendente.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button onClick={finish} disabled={pending}>
              Registrar no meu progresso
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setDone(false);
                setStepIdx(0);
                setRemaining(STEPS[0].seconds);
              }}
            >
              Recomeçar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
