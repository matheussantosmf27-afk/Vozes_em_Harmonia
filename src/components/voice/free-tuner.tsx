"use client";

import { useState } from "react";
import { Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PitchMeter } from "@/components/music/pitch-meter";
import { MicConsent } from "@/components/music/mic-consent";
import { PianoKeyboard } from "@/components/music/piano-keyboard";
import { usePitchDetector } from "@/lib/audio/use-pitch-detector";
import { playMidi } from "@/lib/audio/engine";
import { noteName } from "@/lib/music/notes";

/** Afinador livre: mostra a nota cantada e o desvio. Opcionalmente, compara com uma nota escolhida. */
export function FreeTuner({ voiceRange }: { voiceRange: [number, number] | null }) {
  const mic = usePitchDetector();
  const [target, setTarget] = useState<number | undefined>(undefined);
  const [low, high] = voiceRange ?? [48, 72];
  const from = Math.max(36, low - 2);
  const to = Math.min(84, Math.max(high + 2, from + 14));
  return (
    <div className="space-y-4">
      <MicConsent status={mic.status} onStart={() => void mic.start()} />
      {mic.status === "listening" && (
        <>
          <PitchMeter pitch={mic.pitch} target={target} level={mic.level} />
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" onClick={mic.stop}>
              <Square /> Desligar microfone
            </Button>
            {target !== undefined && (
              <>
                <Button variant="secondary" onClick={() => void playMidi(target, { duration: 1.5 })}>
                  Ouvir {noteName(target)}
                </Button>
                <Button variant="ghost" onClick={() => setTarget(undefined)}>
                  Sem nota-alvo
                </Button>
              </>
            )}
          </div>
        </>
      )}
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Escolha uma nota-alvo no teclado (ela também toca como referência):</p>
        <PianoKeyboard from={from} to={to} labels="c-only" highlight={target !== undefined ? { [target]: "gold" } : {}} onPress={(m) => setTarget(m)} />
      </div>
    </div>
  );
}
