"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, CheckCircle2, Eye, Mic, Pause, Play, RotateCcw, Sparkles, Timer as TimerIcon, Volume2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlayButton } from "@/components/music/play-button";
import { PitchMeter } from "@/components/music/pitch-meter";
import { MicConsent } from "@/components/music/mic-consent";
import { Staff } from "@/components/music/staff";
import { SingResult } from "@/components/exercises/answer-sing";
import { Illustration } from "@/components/lesson/illustrations";
import { playMidi } from "@/lib/audio/engine";
import { usePitchDetector } from "@/lib/audio/use-pitch-detector";
import { audioSpecToEvents, type NoteEvent } from "@/lib/exercises/generators";
import { analyzeSustain, type SustainAnalysis } from "@/lib/music/pitch-detection";
import { noteName, parseNote } from "@/lib/music/notes";
import { createRng, shuffle } from "@/lib/music/random";
import type { IllustrationName, NoteSpec } from "@/content/types";
import { cn } from "@/lib/utils";

/** Semente estável a partir de um texto (mesma ordem no servidor e no navegador). */
function seedOf(text: string) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return h >>> 0;
}

function Card({ children, className, label }: { children: React.ReactNode; className?: string; label: string }) {
  return (
    <div className={cn("space-y-3 rounded-2xl border bg-card p-4 sm:p-5", className)} role="group" aria-label={label}>
      {children}
    </div>
  );
}

function Feedback({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <div aria-live="polite" className={cn("flex gap-2 rounded-xl p-3 text-sm leading-relaxed", ok ? "bg-success/10" : "bg-warning/15")}>
      {ok ? <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" aria-hidden /> : <Sparkles className="mt-0.5 size-4 shrink-0 text-warning-foreground" aria-hidden />}
      <div>{children}</div>
    </div>
  );
}

function events(notes: NoteSpec, mode: "seq" | "chord" = "seq", tempo = 80, cents = 0): NoteEvent[] {
  return audioSpecToEvents({ notes, mode, tempo }).map((e) => ({ ...e, cents: (e.cents ?? 0) + cents }));
}

// ---------------------------------------------------------------------------
// Pergunta rápida
// ---------------------------------------------------------------------------
export function CheckQuestion({
  question,
  options,
  answer,
  explain,
  audio,
  staff,
  illustration,
}: {
  question: string;
  options: string[];
  answer: number;
  explain: string;
  audio?: { notes: NoteSpec; mode?: "seq" | "chord"; tempo?: number };
  staff?: { clef: "sol" | "fa"; notes: string[] };
  illustration?: IllustrationName;
}) {
  const order = useMemo(() => shuffle(createRng(seedOf(question)), options.map((_, i) => i)), [question, options]);
  const [picked, setPicked] = useState<number | null>(null);
  const correct = picked === answer;
  return (
    <Card label="Pergunta rápida" className="border-primary/30">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
        <Sparkles className="size-3.5" aria-hidden /> Pergunta rápida
      </p>
      <p className="text-lg font-medium leading-snug">{question}</p>
      {illustration && <Illustration name={illustration} />}
      {staff && <Staff clef={staff.clef} notes={staff.notes.map((n) => parseNote(n) ?? 60)} />}
      {audio && <PlayButton events={events(audio.notes, audio.mode, audio.tempo)} label="Ouvir" />}
      <div className="grid gap-2 sm:grid-cols-2">
        {order.map((i) => {
          const isPicked = picked === i;
          const show = picked !== null && (i === answer || isPicked);
          return (
            <button
              key={i}
              type="button"
              disabled={picked !== null && correct}
              onClick={() => setPicked(i)}
              aria-pressed={isPicked}
              className={cn(
                "flex min-h-12 items-center gap-2 rounded-xl border px-3 py-2 text-left text-sm transition-colors",
                "hover:border-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                show && i === answer && picked !== null && correct && "border-success bg-success/10",
                isPicked && !correct && "border-destructive bg-destructive/10",
              )}
            >
              {show && i === answer && correct ? <Check className="size-4 shrink-0 text-success" aria-hidden /> : isPicked && !correct ? <X className="size-4 shrink-0 text-destructive" aria-hidden /> : null}
              <span>{options[i]}</span>
            </button>
          );
        })}
      </div>
      {picked !== null &&
        (correct ? (
          <Feedback ok>
            <strong>Isso mesmo!</strong> {explain}
          </Feedback>
        ) : (
          <Feedback ok={false}>
            <strong>Quase.</strong> Pense de novo e tente outra opção.
          </Feedback>
        ))}
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Verdadeiro ou falso
// ---------------------------------------------------------------------------
export function TrueFalse({ items }: { items: { statement: string; answer: boolean; explain: string }[] }) {
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<(boolean | null)[]>(() => items.map(() => null));
  const current = items[i];
  const given = answers[i];
  const done = i >= items.length;
  const hits = answers.filter((a, k) => a === items[k]?.answer).length;
  if (done) {
    return (
      <Card label="Verdadeiro ou falso">
        <p className="text-lg font-medium">
          Você acertou {hits} de {items.length}.
        </p>
        <Button
          variant="outline"
          onClick={() => {
            setAnswers(items.map(() => null));
            setI(0);
          }}
        >
          <RotateCcw /> Fazer de novo
        </Button>
      </Card>
    );
  }
  return (
    <Card label="Verdadeiro ou falso">
      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-primary">
        <span>Verdadeiro ou falso?</span>
        <span className="text-muted-foreground">
          {i + 1} de {items.length}
        </span>
      </div>
      <p className="text-lg font-medium leading-snug">“{current.statement}”</p>
      <div className="flex gap-2">
        {[true, false].map((v) => (
          <Button
            key={String(v)}
            variant={given === v ? (v === current.answer ? "default" : "destructive") : "outline"}
            disabled={given !== null}
            onClick={() => setAnswers(answers.map((a, k) => (k === i ? v : a)))}
            className="flex-1"
          >
            {v ? "Verdadeiro" : "Falso"}
          </Button>
        ))}
      </div>
      {given !== null && (
        <>
          <Feedback ok={given === current.answer}>
            <strong>{given === current.answer ? "Certo!" : `É ${current.answer ? "verdadeiro" : "falso"}.`}</strong> {current.explain}
          </Feedback>
          <Button onClick={() => setI(i + 1)}>{i + 1 < items.length ? "Próxima" : "Ver resultado"}</Button>
        </>
      )}
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Ouça e compare
// ---------------------------------------------------------------------------
export function Compare({
  prompt,
  options,
  answer,
  explain,
}: {
  prompt: string;
  options: { label: string; notes: NoteSpec; cents?: number; tempo?: number; mode?: "seq" | "chord" }[];
  answer?: number;
  explain: string;
}) {
  const challenge = answer !== undefined;
  const [picked, setPicked] = useState<number | null>(null);
  const revealed = !challenge || picked === answer;
  const letters = "ABCD";
  return (
    <Card label="Ouça e compare" className="border-gold/50">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold">
        <Volume2 className="size-3.5" aria-hidden /> Ouça e compare
      </p>
      <p className="text-lg font-medium leading-snug">{prompt}</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((o, i) => (
          <div key={i} className={cn("space-y-2 rounded-xl border p-3", picked === i && (i === answer ? "border-success bg-success/10" : "border-destructive bg-destructive/10"))}>
            <p className="text-sm font-semibold">{revealed ? `${letters[i]} · ${o.label}` : `Opção ${letters[i]}`}</p>
            <div className="flex flex-wrap gap-2">
              <PlayButton events={events(o.notes, o.mode, o.tempo, o.cents ?? 0)} label="Ouvir" size="sm" />
              {challenge && (
                <Button size="sm" variant="outline" disabled={revealed} onClick={() => setPicked(i)}>
                  É esta
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
      {challenge && picked !== null && picked !== answer && (
        <Feedback ok={false}>Ouça as duas de novo, com calma, e tente outra vez.</Feedback>
      )}
      {revealed && challenge && picked !== null && (
        <Feedback ok>
          <strong>Isso!</strong> {explain}
        </Feedback>
      )}
      {!challenge && <p className="text-sm leading-relaxed text-muted-foreground">{explain}</p>}
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Treinador de respiração
// ---------------------------------------------------------------------------
type Phase = "inspire" | "segure" | "solte";

export function Breathing({ inhale, hold = 0, exhale, rounds, exhaleOn }: { inhale: number; hold?: number; exhale: number; rounds: number; exhaleOn?: string }) {
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<Phase>("inspire");
  const [left, setLeft] = useState(inhale);
  const [round, setRound] = useState(1);
  const [finished, setFinished] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const state = useRef({ phase: "inspire" as Phase, left: inhale, round: 1 });

  useEffect(() => () => {
    if (timer.current) clearInterval(timer.current);
  }, []);

  const seq: { p: Phase; s: number }[] = [
    { p: "inspire", s: inhale },
    ...(hold > 0 ? [{ p: "segure" as Phase, s: hold }] : []),
    { p: "solte", s: exhale },
  ];

  function tick() {
    const st = state.current;
    st.left -= 1;
    if (st.left <= 0) {
      const idx = seq.findIndex((x) => x.p === st.phase);
      if (idx === seq.length - 1) {
        if (st.round >= rounds) {
          stop();
          setFinished(true);
          return;
        }
        st.round += 1;
        st.phase = seq[0].p;
        st.left = seq[0].s;
      } else {
        st.phase = seq[idx + 1].p;
        st.left = seq[idx + 1].s;
      }
    }
    setPhase(st.phase);
    setLeft(st.left);
    setRound(st.round);
  }

  function start() {
    state.current = { phase: "inspire", left: inhale, round: 1 };
    setPhase("inspire");
    setLeft(inhale);
    setRound(1);
    setFinished(false);
    setRunning(true);
    timer.current = setInterval(tick, 1000);
  }

  function stop() {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
    setRunning(false);
  }

  const scale = !running ? 0.55 : phase === "inspire" ? 1 : phase === "segure" ? 1 : 0.55;
  const duration = phase === "inspire" ? inhale : phase === "solte" ? exhale : 0.2;
  const label = phase === "inspire" ? "Inspire pelo nariz" : phase === "segure" ? "Segure, sem travar" : exhaleOn ? `Solte em “${exhaleOn}”` : "Solte o ar devagar";

  return (
    <Card label="Treinador de respiração" className="border-primary/30">
      <p className="text-xs font-semibold uppercase tracking-wider text-primary">Respire comigo</p>
      <div className="flex flex-col items-center gap-4 py-2 sm:flex-row sm:justify-center sm:gap-8">
        <div className="relative flex size-40 items-center justify-center">
          <div
            className="absolute inset-0 rounded-full bg-primary/15 ring-2 ring-primary/40"
            style={{ transform: `scale(${scale})`, transition: `transform ${duration}s ease-in-out` }}
            aria-hidden
          />
          <div className="relative text-center">
            <p className="font-heading text-4xl">{running ? left : "—"}</p>
            <p className="text-xs text-muted-foreground">{running ? `rodada ${round} de ${rounds}` : `${rounds} rodadas`}</p>
          </div>
        </div>
        <div className="space-y-2 text-center sm:text-left">
          <p className="text-lg font-medium" aria-live="polite">
            {finished ? "Muito bem! Perceba como o corpo ficou." : running ? label : `Inspire ${inhale}s${hold ? ` · segure ${hold}s` : ""} · solte ${exhale}s`}
          </p>
          <p className="text-sm text-muted-foreground">Ombros parados; a barriga e as costelas é que se movem.</p>
          {running ? (
            <Button variant="outline" onClick={stop}>
              <Pause /> Parar
            </Button>
          ) : (
            <Button onClick={start}>
              <Play /> {finished ? "Fazer de novo" : "Começar"}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Faça agora (cronômetro)
// ---------------------------------------------------------------------------
export function TimerBlock({ instruction, seconds, reps = 1 }: { instruction: string; seconds: number; reps?: number }) {
  const [left, setLeft] = useState(seconds);
  const [rep, setRep] = useState(0);
  const [running, setRunning] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => () => {
    if (timer.current) clearInterval(timer.current);
  }, []);

  function start() {
    setLeft(seconds);
    setRunning(true);
    let remaining = seconds;
    timer.current = setInterval(() => {
      remaining -= 1;
      setLeft(remaining);
      if (remaining <= 0) {
        if (timer.current) clearInterval(timer.current);
        setRunning(false);
        setRep((r) => r + 1);
      }
    }, 1000);
  }

  const pct = ((seconds - left) / seconds) * 100;
  const done = rep >= reps;
  return (
    <Card label="Faça agora" className="border-success/40">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-success">
        <TimerIcon className="size-3.5" aria-hidden /> Faça agora
      </p>
      <p className="text-lg font-medium leading-snug">{instruction}</p>
      <div className="h-3 overflow-hidden rounded-full bg-muted" aria-hidden>
        <div className="h-full rounded-full bg-success transition-[width] duration-1000 ease-linear" style={{ width: `${running ? pct : done ? 100 : 0}%` }} />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={start} disabled={running} variant={done ? "outline" : "default"}>
          <Play /> {running ? `${left}s` : rep === 0 ? `Começar (${seconds}s)` : done ? "De novo" : `Próxima vez (${rep + 1} de ${reps})`}
        </Button>
        {reps > 1 && (
          <span className="text-sm text-muted-foreground">
            {Math.min(rep, reps)} de {reps} feitas
          </span>
        )}
        {done && !running && <span className="text-sm font-medium text-success">Feito! Como foi?</span>}
      </div>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Cante e veja (microfone)
// ---------------------------------------------------------------------------
export function SingAlong({ instruction, note, seconds = 3 }: { instruction: string; note: string; seconds?: number }) {
  const base = parseNote(note) ?? 57;
  const [low, setLow] = useState(false);
  const target = low ? base - 12 : base;
  const mic = usePitchDetector();
  const [capturing, setCapturing] = useState(false);
  const [result, setResult] = useState<SustainAnalysis | null>(null);

  function challenge() {
    setResult(null);
    setCapturing(true);
    mic.beginCapture();
    setTimeout(() => {
      const frames = mic.endCapture();
      setCapturing(false);
      setResult(analyzeSustain(frames, target, { ignoreFirstMs: 400, toleranceCents: 30 }));
    }, seconds * 1000 + 400);
  }

  return (
    <Card label="Cante e veja" className="border-primary/30">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
        <Mic className="size-3.5" aria-hidden /> Cante e veja
      </p>
      <p className="text-lg font-medium leading-snug">{instruction}</p>
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex rounded-lg border p-0.5 text-sm" role="radiogroup" aria-label="Região da sua voz">
          {[
            { v: false, l: "Voz aguda" },
            { v: true, l: "Voz grave" },
          ].map((o) => (
            <button
              key={o.l}
              type="button"
              role="radio"
              aria-checked={low === o.v}
              onClick={() => setLow(o.v)}
              className={cn("rounded-md px-3 py-1.5", low === o.v ? "bg-primary text-primary-foreground" : "hover:bg-muted")}
            >
              {o.l}
            </button>
          ))}
        </div>
        <Button variant="secondary" onClick={() => void playMidi(target, { duration: 1.6 })}>
          <Volume2 /> Ouvir {noteName(target)}
        </Button>
      </div>
      <MicConsent status={mic.status} onStart={() => void mic.start()} compact />
      {mic.status === "listening" && (
        <div className="space-y-3">
          <PitchMeter pitch={mic.pitch} target={target} level={mic.level} />
          <Button onClick={challenge} disabled={capturing}>
            {capturing ? `Cantando… (${seconds}s)` : `Desafio: sustentar ${seconds} segundos`}
          </Button>
          {result && <SingResult analysis={result} />}
        </div>
      )}
      <p className="text-xs text-muted-foreground">Nada é gravado: o som é analisado no seu aparelho e descartado.</p>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Ligue os pares
// ---------------------------------------------------------------------------
export function Match({ prompt, pairs }: { prompt: string; pairs: { left: string; right: string }[] }) {
  const rightOrder = useMemo(() => shuffle(createRng(seedOf(prompt)), pairs.map((_, i) => i)), [prompt, pairs]);
  const [sel, setSel] = useState<number | null>(null);
  const [matched, setMatched] = useState<Set<number>>(() => new Set());
  const [wrong, setWrong] = useState<number | null>(null);
  const done = matched.size === pairs.length;

  function pickRight(i: number) {
    if (sel === null) return;
    if (i === sel) {
      setMatched(new Set([...matched, i]));
      setSel(null);
      setWrong(null);
    } else setWrong(i);
  }

  return (
    <Card label="Ligue os pares">
      <p className="text-xs font-semibold uppercase tracking-wider text-primary">Ligue os pares</p>
      <p className="font-medium">{prompt}</p>
      <p className="text-xs text-muted-foreground">Toque num item da esquerda e depois no par dele à direita.</p>
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-2">
          {pairs.map((p, i) => (
            <button
              key={i}
              type="button"
              disabled={matched.has(i)}
              aria-pressed={sel === i}
              onClick={() => {
                setSel(i);
                setWrong(null);
              }}
              className={cn(
                "w-full rounded-xl border px-3 py-2 text-left text-sm",
                matched.has(i) ? "border-success bg-success/10 text-success" : sel === i ? "border-primary bg-primary/10" : "hover:border-primary",
              )}
            >
              {p.left}
            </button>
          ))}
        </div>
        <div className="space-y-2">
          {rightOrder.map((i) => (
            <button
              key={i}
              type="button"
              disabled={matched.has(i) || sel === null}
              onClick={() => pickRight(i)}
              className={cn(
                "w-full rounded-xl border px-3 py-2 text-left text-sm transition-colors",
                matched.has(i) ? "border-success bg-success/10 text-success" : wrong === i ? "border-destructive bg-destructive/10" : sel !== null ? "hover:border-primary" : "opacity-80",
              )}
            >
              {pairs[i].right}
            </button>
          ))}
        </div>
      </div>
      {done && <Feedback ok>Tudo certo! Você ligou todos os pares.</Feedback>}
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Coloque em ordem
// ---------------------------------------------------------------------------
export function Order({ prompt, items }: { prompt: string; items: string[] }) {
  const shuffled = useMemo(() => {
    const s = shuffle(createRng(seedOf(prompt)), items.map((_, i) => i));
    return s.every((v, k) => v === k) ? [...s].reverse() : s;
  }, [prompt, items]);
  const [placed, setPlaced] = useState<number[]>([]);
  const [wrong, setWrong] = useState<number | null>(null);
  const done = placed.length === items.length;
  return (
    <Card label="Coloque em ordem">
      <p className="text-xs font-semibold uppercase tracking-wider text-primary">Coloque em ordem</p>
      <p className="font-medium">{prompt}</p>
      <ol className="space-y-1.5">
        {placed.map((i, k) => (
          <li key={i} className="flex items-center gap-2 rounded-xl border border-success bg-success/10 px-3 py-2 text-sm">
            <span className="flex size-6 items-center justify-center rounded-full bg-success text-xs font-semibold text-white">{k + 1}</span>
            {items[i]}
          </li>
        ))}
      </ol>
      {!done && (
        <>
          <p className="text-xs text-muted-foreground">Toque no item que vem {placed.length === 0 ? "primeiro" : "a seguir"}.</p>
          <div className="flex flex-wrap gap-2">
            {shuffled
              .filter((i) => !placed.includes(i))
              .map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    if (i === placed.length) {
                      setPlaced([...placed, i]);
                      setWrong(null);
                    } else setWrong(i);
                  }}
                  className={cn("rounded-xl border px-3 py-2 text-left text-sm", wrong === i ? "border-destructive bg-destructive/10" : "hover:border-primary")}
                >
                  {items[i]}
                </button>
              ))}
          </div>
          {wrong !== null && <Feedback ok={false}>Ainda não é esse. O que precisa acontecer antes?</Feedback>}
        </>
      )}
      {done && (
        <div className="flex flex-wrap items-center gap-3">
          <Feedback ok>Sequência completa!</Feedback>
          <Button variant="ghost" size="sm" onClick={() => setPlaced([])}>
            <RotateCcw /> Recomeçar
          </Button>
        </div>
      )}
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Checklist
// ---------------------------------------------------------------------------
export function Checklist({ title, items }: { title: string; items: string[] }) {
  const key = `vh:checklist:${seedOf(title + items.join("|"))}`;
  const [done, setDone] = useState<boolean[]>(() => items.map(() => false));
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- restaura marcações salvas no aparelho após a hidratação
      if (raw) setDone(items.map((_, i) => (JSON.parse(raw) as boolean[])[i] ?? false));
    } catch {
      /* armazenamento indisponível */
    }
  }, [key, items]);

  function toggle(i: number) {
    const next = done.map((d, k) => (k === i ? !d : d));
    setDone(next);
    try {
      localStorage.setItem(key, JSON.stringify(next));
    } catch {
      /* armazenamento indisponível */
    }
  }

  const count = done.filter(Boolean).length;
  return (
    <Card label={title}>
      <div className="flex items-center justify-between gap-2">
        <p className="font-medium">{title}</p>
        <span className="text-sm text-muted-foreground">
          {count}/{items.length}
        </span>
      </div>
      <ul className="space-y-1.5">
        {items.map((it, i) => (
          <li key={it}>
            <label className={cn("flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-2 text-sm", done[i] && "border-success/50 bg-success/5")}>
              <input type="checkbox" checked={done[i]} onChange={() => toggle(i)} className="mt-0.5 size-4 accent-[var(--success)]" />
              <span className={cn(done[i] && "text-muted-foreground line-through")}>{it}</span>
            </label>
          </li>
        ))}
      </ul>
      {count === items.length && <Feedback ok>Checklist completo. Ótimo trabalho!</Feedback>}
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Pense e revele
// ---------------------------------------------------------------------------
export function Reveal({ prompt, answer }: { prompt: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <Card label="Pense e revele" className="border-dashed">
      <p className="text-xs font-semibold uppercase tracking-wider text-primary">Pense um pouco</p>
      <p className="font-medium leading-snug">{prompt}</p>
      {open ? (
        <p className="rounded-xl bg-secondary/60 p-3 leading-relaxed" aria-live="polite">
          {answer}
        </p>
      ) : (
        <Button variant="outline" onClick={() => setOpen(true)}>
          <Eye /> Ver resposta
        </Button>
      )}
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Erros comuns: cartões que viram
// ---------------------------------------------------------------------------
export function FlipCards({ items }: { items: { erro: string; correcao: string }[] }) {
  const [open, setOpen] = useState<Set<number>>(() => new Set());
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((e, i) => {
        const isOpen = open.has(i);
        return (
          <button
            key={e.erro}
            type="button"
            aria-expanded={isOpen}
            onClick={() => setOpen(new Set(isOpen ? [...open].filter((k) => k !== i) : [...open, i]))}
            className={cn("space-y-2 rounded-2xl border p-4 text-left transition-colors", isOpen ? "border-success/50 bg-success/5" : "bg-card hover:border-primary")}
          >
            <p className="flex items-start gap-2 font-medium">
              <X className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden /> {e.erro}
            </p>
            {isOpen ? (
              <p className="flex items-start gap-2 text-sm leading-relaxed">
                <Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden /> {e.correcao}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">Toque para ver como corrigir</p>
            )}
          </button>
        );
      })}
    </div>
  );
}
