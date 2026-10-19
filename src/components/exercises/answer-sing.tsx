"use client";

import { useEffect, useRef, useState } from "react";
import { MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlayButton } from "@/components/music/play-button";
import { PitchMeter } from "@/components/music/pitch-meter";
import { MicConsent } from "@/components/music/mic-consent";
import { playEvents, type PlaybackHandle } from "@/lib/audio/engine";
import type { usePitchDetector } from "@/lib/audio/use-pitch-detector";
import { analyzeSustain, type SustainAnalysis } from "@/lib/music/pitch-detection";
import type { Round } from "@/lib/exercises/generators";
import { formatCents, noteName } from "@/lib/music/notes";

export type SingOutcome = { mode: "mic"; analysis: SustainAnalysis } | { mode: "self"; rating: number };

const VERDICT_TEXT: Record<SustainAnalysis["verdict"], string> = {
  afinado: "Afinado!",
  levemente_acima: "Um pouco acima da nota",
  levemente_abaixo: "Um pouco abaixo da nota",
  acima: "Acima da nota",
  abaixo: "Abaixo da nota",
  indefinido: "Não foi possível avaliar",
};

export function SingResult({ analysis }: { analysis: SustainAnalysis }) {
  return (
    <div className="grid gap-2 rounded-xl border bg-card p-3 text-sm sm:grid-cols-4">
      <div>
        <p className="text-xs text-muted-foreground">Resultado</p>
        <p className="font-medium">{VERDICT_TEXT[analysis.verdict]}</p>
      </div>
      <div>
        <p className="text-xs text-muted-foreground">Diferença média</p>
        <p className="font-medium">{analysis.meanCents === null ? "—" : `${formatCents(analysis.meanCents)} cents`}</p>
      </div>
      <div>
        <p className="text-xs text-muted-foreground">Estabilidade</p>
        <p className="font-medium">{analysis.stdCents === null ? "—" : analysis.stable ? "Estável" : `Oscilou (±${Math.round(analysis.stdCents)} cents)`}</p>
      </div>
      <div>
        <p className="text-xs text-muted-foreground">Tempo dentro da nota</p>
        <p className="font-medium">{Math.round(analysis.inTuneRatio * 100)}%</p>
      </div>
      {analysis.status === "incerta" && (
        <p className="text-xs text-warning-foreground sm:col-span-4">Detecção incerta: ruído ou som fraco. Considere este resultado apenas como indicação.</p>
      )}
    </div>
  );
}

export function AnswerSing({
  round,
  mic,
  onSubmit,
  done,
}: {
  round: Round;
  mic: ReturnType<typeof usePitchDetector>;
  onSubmit: (o: SingOutcome) => void;
  done: boolean;
}) {
  const [phase, setPhase] = useState<"ready" | "singing" | "nosignal">("ready");
  const [progress, setProgress] = useState(0);
  const [selfMode, setSelfMode] = useState(false);
  const distractorRef = useRef<PlaybackHandle | null>(null);
  const timerRef = useRef<number | null>(null);
  const target = round.targetMidi ?? 60;
  const hold = round.holdSeconds ?? 3;

  useEffect(
    () => () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      distractorRef.current?.stop();
    },
    [],
  );

  async function sing() {
    setPhase("singing");
    setProgress(0);
    mic.beginCapture();
    if (round.distractor) distractorRef.current = await playEvents(round.distractor, { instrument: "piano" });
    const startedAt = performance.now();
    const totalMs = hold * 1000 + 500;
    timerRef.current = window.setInterval(() => {
      const elapsed = performance.now() - startedAt;
      setProgress(Math.min(1, elapsed / totalMs));
      if (elapsed >= totalMs) {
        window.clearInterval(timerRef.current!);
        distractorRef.current?.stop();
        const frames = mic.endCapture();
        const analysis = analyzeSustain(frames, target, { ignoreFirstMs: 450, toleranceCents: round.toleranceCents ?? 25 });
        if (analysis.status === "sem_sinal") {
          setPhase("nosignal");
          return;
        }
        setPhase("ready");
        onSubmit({ mode: "mic", analysis });
      }
    }, 50);
  }

  if (done) return null;

  const micReady = mic.status === "listening";
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <PlayButton events={round.cue} label={`Ouvir ${noteName(target)}`} />
        {round.distractor && <PlayButton events={round.distractor} label="Ouvir a outra melodia" variant="outline" />}
      </div>

      {!selfMode && !micReady && (
        <>
          <MicConsent status={mic.status} onStart={() => void mic.start()} />
          <Button type="button" variant="link" className="px-0" onClick={() => setSelfMode(true)}>
            <MicOff /> Prefiro fazer sem microfone (autoavaliação)
          </Button>
        </>
      )}

      {!selfMode && micReady && (
        <>
          <PitchMeter pitch={mic.pitch} target={target} level={mic.level} />
          {phase === "singing" ? (
            <div className="space-y-2" aria-live="polite">
              <p className="font-medium">Sustente a nota… {round.distractor ? "mantenha a sua nota enquanto a melodia toca!" : ""}</p>
              <div className="h-3 overflow-hidden rounded-full bg-muted">
                <div className="h-full bg-primary transition-[width]" style={{ width: `${progress * 100}%` }} />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {phase === "nosignal" && (
                <p className="text-sm text-warning-foreground">
                  Não detectamos uma nota clara. Cante mais perto do microfone, numa vogal aberta (“lá” ou “ú”), em ambiente silencioso. Esta tentativa não foi contada.
                </p>
              )}
              <Button type="button" size="lg" onClick={sing}>
                Cantar agora ({hold} s)
              </Button>
            </div>
          )}
        </>
      )}

      {selfMode && (
        <div className="space-y-3 rounded-xl border bg-card p-4">
          <p className="text-sm">Ouça a nota, cante sustentando por {hold} segundos e ouça a nota de novo para comparar. Como foi?</p>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={() => onSubmit({ mode: "self", rating: 1 })}>
              Cantei a mesma nota com segurança
            </Button>
            <Button type="button" variant="outline" onClick={() => onSubmit({ mode: "self", rating: 0.5 })}>
              Fiquei em dúvida
            </Button>
            <Button type="button" variant="outline" onClick={() => onSubmit({ mode: "self", rating: 0 })}>
              Não consegui
            </Button>
          </div>
          {mic.status !== "unsupported" && (
            <Button type="button" variant="link" className="px-0" onClick={() => setSelfMode(false)}>
              Usar o microfone
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
