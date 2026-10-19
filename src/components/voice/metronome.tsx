"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { getAudioContext, scheduleNote, unlockAudio } from "@/lib/audio/engine";
import { cn } from "@/lib/utils";

export function Metronome() {
  const [bpm, setBpm] = useState(80);
  const [beats, setBeats] = useState(4);
  const [running, setRunning] = useState(false);
  const [current, setCurrent] = useState(-1);
  const taps = useRef<number[]>([]);
  const state = useRef({ next: 0, beat: 0 });

  useEffect(() => {
    if (!running) return;
    const c = getAudioContext();
    state.current = { next: c.currentTime + 0.1, beat: 0 };
    const timer = window.setInterval(() => {
      while (state.current.next < c.currentTime + 0.12) {
        const b = state.current.beat % beats;
        scheduleNote(b === 0 ? 96 : 89, state.current.next, 0.05, { instrument: "clique", gain: b === 0 ? 0.55 : 0.35 });
        const delay = (state.current.next - c.currentTime) * 1000;
        window.setTimeout(() => setCurrent(b), Math.max(0, delay));
        state.current.next += 60 / bpm;
        state.current.beat++;
      }
    }, 25);
    return () => {
      window.clearInterval(timer);
      setCurrent(-1);
    };
  }, [running, bpm, beats]);

  function tapTempo() {
    const now = performance.now();
    taps.current = [...taps.current.filter((t) => now - t < 3000), now];
    if (taps.current.length >= 2) {
      const gaps = taps.current.slice(1).map((t, i) => t - taps.current[i]);
      setBpm(Math.round(60000 / (gaps.reduce((a, b) => a + b, 0) / gaps.length)));
    }
  }

  return (
    <div className="space-y-4 rounded-2xl border bg-card p-5">
      <div className="flex items-center justify-center gap-3" aria-hidden>
        {Array.from({ length: beats }, (_, i) => (
          <span key={i} className={cn("size-5 rounded-full border-2 transition-colors", current === i ? (i === 0 ? "border-gold bg-gold" : "border-primary bg-primary") : "border-border")} />
        ))}
      </div>
      <p className="text-center font-heading text-5xl tabular-nums">{bpm}</p>
      <p className="text-center text-sm text-muted-foreground">batidas por minuto</p>
      <div className="space-y-1.5">
        <Label htmlFor="bpm">Andamento</Label>
        <input id="bpm" type="range" min={40} max={200} value={bpm} onChange={(e) => setBpm(Number(e.target.value))} className="w-full accent-[var(--primary)]" />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={async () => { await unlockAudio(); setRunning(!running); }}>
          {running ? <Pause /> : <Play />} {running ? "Parar" : "Iniciar"}
        </Button>
        <Button variant="outline" onClick={tapTempo}>
          Toque o andamento
        </Button>
        <Label htmlFor="beats" className="ml-auto">
          Compasso
        </Label>
        <select id="beats" value={beats} onChange={(e) => setBeats(Number(e.target.value))} className="h-10 rounded-lg border bg-card px-2">
          {[2, 3, 4, 6].map((b) => (
            <option key={b} value={b}>
              {b}/4
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
