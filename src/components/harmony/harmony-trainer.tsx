"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Bookmark, Mic, MicOff, Pause, Play, Repeat, Square, Trash2, Volume2, VolumeX } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { MicConsent } from "@/components/music/mic-consent";
import { MultiPartPlayer } from "@/lib/audio/multipart-player";
import { usePitchDetector } from "@/lib/audio/use-pitch-detector";
import type { PartNote } from "@/lib/music/notation";
import { formatCents, noteName } from "@/lib/music/notes";
import { recordAttempt } from "@/app/actions/practice";
import { addBookmark, deleteBookmark, updateMyAssignment } from "@/app/actions/harmony";
import { PianoRoll, VOICE_COLORS } from "./piano-roll";
import { cn } from "@/lib/utils";

export interface TrainerPart {
  id: string;
  name: string;
  short: string;
  notes: PartNote[];
  rangeLow: number | null;
  rangeHigh: number | null;
  suggested: boolean;
}

export interface TrainerProps {
  arrangement: { id: string; slug: string; title: string; tempo: number; beatsPerMeasure: number; keyName: string | null; voices: number };
  parts: TrainerPart[];
  bookmarks: { id: string; start_measure: number; end_measure: number; note: string | null }[];
  assignment: { id: string; partId: string; status: "designado" | "estudando" | "pronto" } | null;
  path: string;
}

type Mode = "solo" | "guiado" | "conjunto";

export function HarmonyTrainer({ arrangement, parts, bookmarks, assignment, path }: TrainerProps) {
  const router = useRouter();
  const initialPart = assignment?.partId ?? parts.find((p) => p.suggested)?.id ?? parts[0]?.id ?? null;
  const [mine, setMine] = useState<string | null>(initialPart);
  const [mode, setMode] = useState<Mode>(parts.length === 1 ? "solo" : "guiado");
  const [harmonicRef, setHarmonicRef] = useState(true);
  const [volumes, setVolumes] = useState<Record<string, number>>(() => Object.fromEntries(parts.map((p) => [p.id, 1])));
  const [muted, setMuted] = useState<Record<string, boolean>>({});
  const [speed, setSpeed] = useState(1);
  const [transpose, setTranspose] = useState(0);
  const [octave, setOctave] = useState(0);
  const [metronome, setMetronome] = useState(false);
  const [loopOn, setLoopOn] = useState(false);
  const [loopStart, setLoopStart] = useState(1);
  const [loopEnd, setLoopEnd] = useState(2);
  const [playing, setPlaying] = useState(false);
  const [beat, setBeat] = useState(0);
  const [singAlong, setSingAlong] = useState(false);
  const [stats, setStats] = useState({ voiced: 0, inTune: 0 });
  const [pending, startTransition] = useTransition();
  const player = useRef<MultiPartPlayer | null>(null);
  const mic = usePitchDetector();
  const statsRef = useRef({ voiced: 0, inTune: 0, lastBeat: -1 });

  const totalBeats = useMemo(() => Math.max(...parts.map((p) => p.notes.reduce((a, n) => Math.max(a, n.s + n.d), 0))), [parts]);
  const measures = Math.ceil(totalBeats / arrangement.beatsPerMeasure);
  const colors = useMemo(() => Object.fromEntries(parts.map((p, i) => [p.id, VOICE_COLORS[i % VOICE_COLORS.length]])), [parts]);
  const minePart = parts.find((p) => p.id === mine) ?? null;

  useEffect(() => {
    const p = new MultiPartPlayer(parts.map((x) => ({ id: x.id, notes: x.notes })), arrangement.tempo, arrangement.beatsPerMeasure);
    p.onPosition = (b) => setBeat(b);
    p.onEnd = () => setPlaying(false);
    player.current = p;
    return () => p.dispose();
  }, [parts, arrangement.tempo, arrangement.beatsPerMeasure]);

  // Volumes efetivos conforme o modo de estudo.
  useEffect(() => {
    const p = player.current;
    if (!p) return;
    for (const part of parts) {
      const isMine = part.id === mine;
      let v = volumes[part.id] ?? 1;
      if (mode === "solo" && !isMine) v = harmonicRef ? 0.12 : 0;
      if (mode === "guiado" && !isMine) v = Math.min(v, 0.3);
      p.setVolume(part.id, v);
      p.setMuted(part.id, !!muted[part.id]);
      p.setOctave(part.id, isMine ? octave : 0);
    }
  }, [mode, mine, volumes, muted, harmonicRef, octave, parts]);

  useEffect(() => player.current?.setTempo(arrangement.tempo * speed), [speed, arrangement.tempo]);
  useEffect(() => player.current?.setTranspose(transpose), [transpose]);
  useEffect(() => player.current?.setMetronome(metronome), [metronome]);
  useEffect(() => player.current?.setLoop(loopOn ? loopStart : null, loopEnd), [loopOn, loopStart, loopEnd]);

  // Cantar junto: compara a altura detectada com a nota esperada da sua voz.
  const expected = useMemo(() => {
    if (!minePart) return null;
    const n = minePart.notes.find((x) => x.p !== null && x.s <= beat && beat < x.s + x.d);
    return n ? n.p! + transpose + octave * 12 : null;
  }, [minePart, beat, transpose, octave]);

  const liveCents = useMemo(() => {
    if (!singAlong || expected === null || !mic.pitch?.midi || mic.pitch.confidence === "sem_sinal") return null;
    const diff = (mic.pitch.midi - expected) * 100;
    return diff - Math.round(diff / 1200) * 1200;
  }, [singAlong, expected, mic.pitch]);

  useEffect(() => {
    if (!playing || !singAlong || expected === null || liveCents === null) return;
    const s = statsRef.current;
    s.voiced += 1;
    if (Math.abs(liveCents) <= 35) s.inTune += 1;
    setStats({ voiced: s.voiced, inTune: s.inTune });
  }, [liveCents, playing, singAlong, expected]);

  async function togglePlay() {
    const p = player.current;
    if (!p) return;
    if (playing) {
      p.pause();
      setPlaying(false);
    } else {
      if (beat >= totalBeats - 0.01) statsRef.current = { voiced: 0, inTune: 0, lastBeat: -1 };
      const loopStartBeat = (loopStart - 1) * arrangement.beatsPerMeasure;
      const loopEndBeat = loopEnd * arrangement.beatsPerMeasure;
      await p.play(loopOn && (beat < loopStartBeat || beat >= loopEndBeat) ? loopStartBeat : undefined);
      setPlaying(true);
    }
  }

  function stop() {
    player.current?.stop();
    setPlaying(false);
  }

  function seekMeasure(m: number) {
    player.current?.seek((m - 1) * arrangement.beatsPerMeasure);
  }

  function resetStats() {
    statsRef.current = { voiced: 0, inTune: 0, lastBeat: -1 };
    setStats({ voiced: 0, inTune: 0 });
  }

  function registerPractice(selfScore?: number) {
    const micScore = stats.voiced >= 20 ? stats.inTune / stats.voiced : null;
    const score = selfScore ?? micScore;
    if (score === null || score === undefined) return;
    startTransition(async () => {
      const slug = `harmonia-pratica-${Math.min(4, arrangement.voices)}-${arrangement.voices === 1 ? "voz" : "vozes"}`;
      const res = await recordAttempt({
        exerciseSlug: slug,
        score,
        correct: score >= 0.7 ? 1 : 0,
        total: 1,
        details: {
          voices: arrangement.voices,
          arrangement: arrangement.slug,
          part: minePart?.name,
          mode,
          speed,
          selfReported: selfScore !== undefined,
          inTuneRatio: micScore,
        },
        revalidate: path,
      });
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success("Prática registrada!");
      for (const a of res.data?.achievements ?? []) toast.success(`Conquista: ${a}`);
      resetStats();
    });
  }

  function saveBookmark() {
    const current = Math.min(measures, Math.floor(beat / arrangement.beatsPerMeasure) + 1);
    const start = loopOn ? loopStart : current;
    const end = loopOn ? loopEnd : current;
    startTransition(async () => {
      const res = await addBookmark({ arrangementId: arrangement.id, start, end, path });
      if (res.ok) {
        toast.success(`Trecho ${start === end ? `do compasso ${start}` : `dos compassos ${start}–${end}`} marcado para revisar.`);
        router.refresh();
      } else toast.error(res.error);
    });
  }

  const measureOptions = Array.from({ length: measures }, (_, i) => i + 1);
  const currentMeasure = Math.max(1, Math.min(measures, Math.floor(beat / arrangement.beatsPerMeasure) + 1));
  const ratio = stats.voiced ? stats.inTune / stats.voiced : 0;

  return (
    <div className="space-y-5">
      {/* Escolha da voz */}
      <section className="space-y-2" aria-labelledby="vozes-titulo">
        <h2 id="vozes-titulo" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Vozes
        </h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {parts.map((p) => (
            <li key={p.id} className={cn("flex flex-wrap items-center gap-3 rounded-xl border bg-card p-3", p.id === mine && "border-primary ring-1 ring-primary")}>
              <span className="size-3 rounded-full" style={{ background: colors[p.id] }} aria-hidden />
              <label className="flex flex-1 cursor-pointer items-center gap-2 text-sm font-medium">
                <input type="radio" name="minha-voz" checked={p.id === mine} onChange={() => setMine(p.id)} className="size-4 accent-[var(--primary)]" />
                {p.name}
                {p.suggested && <Badge variant="secondary">sugerida para você</Badge>}
                {assignment?.partId === p.id && <Badge>designada</Badge>}
              </label>
              {p.rangeLow !== null && p.rangeHigh !== null && (
                <span className="text-xs text-muted-foreground">
                  {noteName(p.rangeLow + transpose)}–{noteName(p.rangeHigh + transpose)}
                </span>
              )}
              <div className="flex w-full items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMuted((m) => ({ ...m, [p.id]: !m[p.id] }))}
                  aria-label={muted[p.id] ? `Ativar ${p.name}` : `Silenciar ${p.name}`}
                  className="rounded-md p-1 hover:bg-muted"
                >
                  {muted[p.id] ? <VolumeX className="size-4 text-muted-foreground" /> : <Volume2 className="size-4" />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={volumes[p.id]}
                  onChange={(e) => setVolumes((v) => ({ ...v, [p.id]: Number(e.target.value) }))}
                  aria-label={`Volume de ${p.name}`}
                  className="flex-1 accent-[var(--primary)]"
                  disabled={mode !== "conjunto" && p.id !== mine}
                />
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Modo de estudo */}
      <section className="space-y-2">
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Modo de estudo">
          {(
            [
              ["solo", "Modo solo", "Só a sua voz (com referência harmônica opcional)"],
              ["guiado", "Modo guiado", "Sua voz destacada, outras baixinho"],
              ["conjunto", "Modo conjunto", "Todas as vozes, volumes ajustáveis"],
            ] as const
          ).map(([value, label, help]) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={mode === value}
              onClick={() => setMode(value)}
              className={cn("flex-1 rounded-xl border p-3 text-left text-sm transition-colors", mode === value ? "border-primary bg-primary/10" : "hover:bg-muted")}
            >
              <span className="block font-medium">{label}</span>
              <span className="text-xs text-muted-foreground">{help}</span>
            </button>
          ))}
        </div>
        {mode === "solo" && parts.length > 1 && (
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={harmonicRef} onChange={(e) => setHarmonicRef(e.target.checked)} className="size-4" />
            Referência harmônica (outras vozes bem baixinho)
          </label>
        )}
      </section>

      {/* Transporte */}
      <section className="space-y-4 rounded-2xl border bg-card p-4">
        <div className="flex flex-wrap items-center gap-2">
          <Button size="lg" onClick={() => void togglePlay()}>
            {playing ? <Pause /> : <Play />} {playing ? "Pausar" : "Tocar"}
          </Button>
          <Button variant="outline" size="lg" onClick={stop} aria-label="Parar">
            <Square />
          </Button>
          <span className="ml-2 text-sm text-muted-foreground" aria-live="off">
            Compasso {currentMeasure} de {measures}
          </span>
          <div className="ml-auto flex flex-wrap gap-2">
            <Button variant={metronome ? "default" : "outline"} size="sm" onClick={() => setMetronome(!metronome)}>
              Metrônomo
            </Button>
            <Button variant="outline" size="sm" onClick={saveBookmark} disabled={pending}>
              <Bookmark /> Marcar trecho difícil
            </Button>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label htmlFor="speed">
              Andamento: {Math.round(arrangement.tempo * speed)} bpm ({Math.round(speed * 100)}%)
            </Label>
            <input id="speed" type="range" min={0.5} max={1.25} step={0.05} value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="w-full accent-[var(--primary)]" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="transpose">
              Tonalidade: {transpose > 0 ? `+${transpose}` : transpose} semitons
            </Label>
            <input id="transpose" type="range" min={-5} max={5} step={1} value={transpose} onChange={(e) => setTranspose(Number(e.target.value))} className="w-full accent-[var(--primary)]" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="octave">Minha voz (playback)</Label>
            <select id="octave" value={octave} onChange={(e) => setOctave(Number(e.target.value))} className="h-10 w-full rounded-lg border bg-card px-2 text-sm">
              <option value={0}>Na altura escrita</option>
              <option value={-1}>Uma oitava abaixo</option>
              <option value={1}>Uma oitava acima</option>
            </select>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <Button variant={loopOn ? "default" : "outline"} size="sm" onClick={() => setLoopOn(!loopOn)}>
            <Repeat /> Repetir trecho
          </Button>
          <label className="flex items-center gap-1">
            do compasso
            <select value={loopStart} onChange={(e) => { const v = Number(e.target.value); setLoopStart(v); if (loopEnd < v) setLoopEnd(v); }} className="h-8 rounded-md border bg-card px-1">
              {measureOptions.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </label>
          <label className="flex items-center gap-1">
            ao
            <select value={loopEnd} onChange={(e) => setLoopEnd(Number(e.target.value))} className="h-8 rounded-md border bg-card px-1">
              {measureOptions.filter((m) => m >= loopStart).map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </label>
        </div>
      </section>

      <PianoRoll
        parts={parts.map((p) => ({ id: p.id, name: p.name, notes: p.notes, color: colors[p.id] }))}
        selectedId={mine}
        beat={beat}
        beatsPerMeasure={arrangement.beatsPerMeasure}
        totalBeats={totalBeats}
        transpose={transpose}
        loop={loopOn ? { start: (loopStart - 1) * arrangement.beatsPerMeasure, end: loopEnd * arrangement.beatsPerMeasure } : null}
        onSeekMeasure={seekMeasure}
      />

      {/* Cantar junto */}
      <section className="space-y-3 rounded-2xl border bg-card p-4" aria-labelledby="cantar-junto">
        <div className="flex flex-wrap items-center gap-2">
          <h2 id="cantar-junto" className="font-semibold">
            Cantar junto e registrar a prática
          </h2>
          <Button size="sm" variant={singAlong ? "default" : "outline"} className="ml-auto" onClick={() => setSingAlong(!singAlong)}>
            {singAlong ? <MicOff /> : <Mic />} {singAlong ? "Desligar acompanhamento" : "Acompanhar minha afinação"}
          </Button>
        </div>
        {singAlong && (
          <>
            <MicConsent status={mic.status} onStart={() => void mic.start()} />
            {mic.status === "listening" && (
              <div className="grid gap-3 sm:grid-cols-3" aria-live="polite">
                <div className="rounded-xl bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground">Nota esperada agora</p>
                  <p className="font-heading text-xl">{expected !== null ? noteName(expected) : "pausa"}</p>
                </div>
                <div className={cn("rounded-xl p-3", liveCents === null ? "bg-muted/50" : Math.abs(liveCents) <= 35 ? "bg-success/15" : "bg-destructive/10")}>
                  <p className="text-xs text-muted-foreground">Você</p>
                  <p className="font-heading text-xl">{liveCents === null ? "—" : `${formatCents(liveCents)}¢`}</p>
                </div>
                <div className="rounded-xl bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground">Tempo dentro da nota</p>
                  <p className="font-heading text-xl">{stats.voiced ? `${Math.round(ratio * 100)}%` : "—"}</p>
                </div>
              </div>
            )}
            <p className="text-xs text-muted-foreground">Use fones de ouvido para o microfone captar só a sua voz. A comparação aceita a mesma nota em outra oitava. É uma estimativa, não um diagnóstico.</p>
          </>
        )}
        <div className="flex flex-wrap items-center gap-2">
          {stats.voiced >= 20 && (
            <Button onClick={() => registerPractice()} disabled={pending}>
              Registrar prática ({Math.round(ratio * 100)}% dentro da nota)
            </Button>
          )}
          <span className="text-sm text-muted-foreground">Sem microfone? Registre como foi:</span>
          <Button size="sm" variant="outline" onClick={() => registerPractice(1)} disabled={pending}>
            Mantive minha voz
          </Button>
          <Button size="sm" variant="outline" onClick={() => registerPractice(0.6)} disabled={pending}>
            Com algumas falhas
          </Button>
          <Button size="sm" variant="outline" onClick={() => registerPractice(0.3)} disabled={pending}>
            Ainda me perco
          </Button>
        </div>
      </section>

      {assignment && (
        <section className="flex flex-wrap items-center gap-2 rounded-2xl border bg-card p-4 text-sm">
          <span className="font-medium">Sua designação nesta música:</span>
          {(["designado", "estudando", "pronto"] as const).map((s) => (
            <Button
              key={s}
              size="sm"
              variant={assignment.status === s ? "default" : "outline"}
              disabled={pending}
              onClick={() =>
                startTransition(async () => {
                  const r = await updateMyAssignment(assignment.id, s, path);
                  if (r.ok) {
                    toast.success(r.message ?? "Atualizado");
                    router.refresh();
                  } else toast.error(r.error);
                })
              }
            >
              {s === "designado" ? "Ainda não comecei" : s === "estudando" ? "Estudando" : "Pronto(a)"}
            </Button>
          ))}
        </section>
      )}

      {bookmarks.length > 0 && (
        <section className="space-y-2">
          <h2 className="font-semibold">Trechos para revisar</h2>
          <ul className="flex flex-wrap gap-2">
            {bookmarks.map((b) => (
              <li key={b.id} className="flex items-center gap-1 rounded-full border bg-card py-1 pl-3 pr-1 text-sm">
                <button
                  type="button"
                  onClick={() => {
                    setLoopStart(b.start_measure);
                    setLoopEnd(b.end_measure);
                    setLoopOn(true);
                    seekMeasure(b.start_measure);
                  }}
                  className="hover:underline"
                >
                  Compassos {b.start_measure}
                  {b.end_measure !== b.start_measure ? `–${b.end_measure}` : ""}
                </button>
                <button
                  type="button"
                  aria-label="Remover trecho"
                  className="rounded-full p-1 hover:bg-muted"
                  onClick={() =>
                    startTransition(async () => {
                      await deleteBookmark(b.id, path);
                      router.refresh();
                    })
                  }
                >
                  <Trash2 className="size-3.5" />
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
