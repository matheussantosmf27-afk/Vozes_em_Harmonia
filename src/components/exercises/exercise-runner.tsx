"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { ArrowRight, Check, Lightbulb, RotateCcw, Save, Sparkles, Trash2, Turtle, X } from "lucide-react";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlayButton } from "@/components/music/play-button";
import { Staff } from "@/components/music/staff";
import { generateRound, roundCount, type Round } from "@/lib/exercises/generators";
import { gradeChoice, gradeSelf, gradeSequence, gradeSing, gradeTapRound, summarize, type RoundResult } from "@/lib/exercises/grading";
import { resolveLevelConfig, type ExerciseType } from "@/lib/exercises/schemas";
import { shouldSimplify } from "@/lib/pedagogy/adaptive";
import { createRng } from "@/lib/music/random";
import { usePitchDetector } from "@/lib/audio/use-pitch-detector";
import { recordAttempt } from "@/app/actions/practice";
import { AnswerChoice } from "./answer-choice";
import { AnswerKeyboard } from "./answer-keyboard";
import { AnswerTap } from "./answer-tap";
import { AnswerSelf } from "./answer-self";
import { AnswerSing, SingResult, type SingOutcome } from "./answer-sing";
import { cn } from "@/lib/utils";

export interface RunnerExercise {
  id: string;
  slug: string;
  title: string;
  instructions: string;
  type: ExerciseType;
  config: unknown;
  purpose: string;
}

export interface RunnerProps {
  exercise: RunnerExercise;
  level?: number;
  voiceRange?: [number, number] | null;
  concept?: { summary?: string; href?: string };
  revalidate?: string;
  /** Chamado ao terminar (antes de salvar) — usado pela avaliação inicial. */
  onComplete?: (summary: { score: number; correct: number; total: number; results: RoundResult[] }) => void;
  /** Quando falso, não salva automaticamente (a avaliação inicial salva tudo junto). */
  persist?: boolean;
  compact?: boolean;
}

const SLOW_TYPES = new Set<ExerciseType>(["interval_id", "melody_memory", "chord_quality", "phrase_compare", "scale_id", "progression_id", "note_match", "pitch_compare"]);

export function ExerciseRunner({ exercise, level = 1, voiceRange, concept, revalidate, onComplete, persist = true, compact = false }: RunnerProps) {
  const [runId, setRunId] = useState(0);
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<RoundResult[]>([]);
  const [answer, setAnswer] = useState<{ result: RoundResult; choice?: string; sing?: SingOutcome } | null>(null);
  const [simplified, setSimplified] = useState(false);
  const [saved, setSaved] = useState<"no" | "saving" | "yes" | "discarded">("no");
  const [pending, startTransition] = useTransition();
  const startedAt = useRef(0);
  const mic = usePitchDetector();

  const effectiveLevel = simplified ? Math.max(1, level - 1) : level;
  const { config, levels } = useMemo(() => resolveLevelConfig(exercise.config, effectiveLevel), [exercise.config, effectiveLevel]);
  const total = useMemo(() => roundCount(exercise.type, resolveLevelConfig(exercise.config, level).config), [exercise.config, exercise.type, level]);
  const rng = useMemo(() => createRng(Date.now() + runId), [runId]);
  const round: Round | null = useMemo(
    () => (started && index < total ? generateRound(exercise.type, config, { rng, index, voiceRange: voiceRange ?? undefined }) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [started, index, total, runId, simplified],
  );
  const finished = started && index >= total;
  const summary = summarize(results);
  const isSingType = exercise.type === "sing_note";
  const ask = isSingType && persist;

  function begin() {
    setStarted(true);
    startedAt.current = performance.now();
  }

  function restart() {
    setRunId((r) => r + 1);
    setIndex(0);
    setResults([]);
    setAnswer(null);
    setSimplified(false);
    setSaved("no");
    setStarted(true);
    startedAt.current = performance.now();
  }

  function registerResult(result: RoundResult, extra?: { choice?: string; sing?: SingOutcome }) {
    setAnswer({ result, ...extra });
    const next = [...results, result];
    setResults(next);
    if (!simplified && levels > 1 && level > 1 && shouldSimplify(next.map((r) => r.score))) {
      setSimplified(true);
      toast.info("Vamos simplificar um pouco", { description: "Dois erros seguidos: as próximas rodadas ficam mais fáceis para você retomar o conceito." });
    }
  }

  function nextRound() {
    setAnswer(null);
    const nextIndex = index + 1;
    setIndex(nextIndex);
    if (nextIndex >= total) {
      const final = summarize(results);
      onComplete?.({ ...final, results });
      if (persist && !ask) save(final);
    }
  }

  function save(final = summary) {
    setSaved("saving");
    const selfReported = results.length > 0 && results.every((r) => r.detail?.selfReported);
    startTransition(async () => {
      const res = await recordAttempt({
        exerciseId: exercise.id,
        score: final.score,
        correct: final.correct,
        total: final.total,
        durationMs: Math.round(performance.now() - startedAt.current),
        level: levels > 1 ? level : undefined,
        revalidate,
        details: {
          selfReported,
          simplified,
          rounds: results.map((r) => ({ s: Math.round(r.score * 100) / 100, c: r.correct, ...(r.detail && !Array.isArray(r.detail) ? pickDetail(r.detail) : {}) })),
          ...(isSingType ? singSummary(results) : {}),
        },
      });
      if (!res.ok) {
        setSaved("no");
        toast.error(res.error);
        return;
      }
      setSaved("yes");
      if (res.data?.lessonCompleted) toast.success("Aula concluída!", { description: "Você atingiu o critério de avanço." });
      for (const a of res.data?.achievements ?? []) toast.success(`Conquista: ${a}`, { icon: <Sparkles className="size-4" /> });
    });
  }

  // ---------------------------------------------------------------------
  if (!started) {
    return (
      <div className={cn("space-y-4 rounded-2xl border bg-card p-5", compact && "p-4")}>
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-lg font-semibold">{exercise.title}</h3>
          {exercise.purpose === "avaliacao" && <Badge variant="secondary">Avaliação da aula</Badge>}
          {levels > 1 && <Badge variant="outline">Nível {level} de {levels}</Badge>}
        </div>
        {exercise.instructions && <p className="text-muted-foreground">{exercise.instructions}</p>}
        <p className="text-sm text-muted-foreground">
          {total} {total === 1 ? "etapa" : "rodadas"} · você pode repetir o áudio quantas vezes quiser.
        </p>
        <Button onClick={begin} size="lg">
          Começar <ArrowRight />
        </Button>
      </div>
    );
  }

  if (finished) {
    const pct = Math.round(summary.score * 100);
    return (
      <div className="space-y-4 rounded-2xl border bg-card p-5" aria-live="polite">
        <div className="flex items-center gap-4">
          <div className={cn("flex size-16 items-center justify-center rounded-full font-heading text-xl", pct >= 70 ? "bg-success/15 text-success" : "bg-warning/20 text-warning-foreground")}>{pct}%</div>
          <div>
            <h3 className="text-lg font-semibold">{pct >= 85 ? "Excelente!" : pct >= 70 ? "Muito bom!" : pct >= 50 ? "Bom caminho" : "Continue praticando"}</h3>
            <p className="text-sm text-muted-foreground">
              {summary.correct} de {summary.total} {summary.total === 1 ? "acerto" : "acertos completos"}
              {simplified ? " · rodadas simplificadas após dois erros" : ""}
            </p>
          </div>
        </div>
        {pct < 60 && concept?.summary && (
          <div className="flex gap-3 rounded-xl bg-accent p-3 text-sm text-accent-foreground">
            <Lightbulb className="mt-0.5 size-4 shrink-0" />
            <div className="space-y-1">
              <p className="font-medium">Retome o conceito antes de aumentar a dificuldade</p>
              <p>{concept.summary}</p>
              {concept.href && (
                <Link href={concept.href} className="font-medium underline underline-offset-4">
                  Rever a aula
                </Link>
              )}
            </div>
          </div>
        )}
        {persist && ask && saved === "no" && (
          <div className="space-y-2 rounded-xl border bg-muted/40 p-3 text-sm">
            <p>Deseja salvar este resultado no seu histórico? Salvamos apenas os números (nota, desvio e estabilidade) — nenhuma gravação.</p>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" onClick={() => save()} disabled={pending}>
                <Save /> Salvar resultado
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setSaved("discarded")}>
                <Trash2 /> Descartar
              </Button>
            </div>
          </div>
        )}
        {persist && (
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {saved === "saving" ? "Salvando…" : saved === "yes" ? "Resultado salvo no seu progresso." : saved === "discarded" ? "Resultado descartado." : !ask ? "Salvando…" : ""}
          </p>
        )}
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={restart}>
            <RotateCcw /> Repetir
          </Button>
          {concept?.href && pct >= 60 && (
            <Link href={concept.href} className={buttonVariants({ variant: "ghost" })}>
              Rever o conceito
            </Link>
          )}
        </div>
      </div>
    );
  }

  if (!round) return null;
  const done = answer !== null;
  return (
    <div className="space-y-4 rounded-2xl border bg-card p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
        <span className="font-medium text-foreground">{exercise.title}</span>
        <span>
          {index + 1} / {total}
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-muted" aria-hidden>
        <div className="h-full bg-primary transition-[width]" style={{ width: `${(index / total) * 100}%` }} />
      </div>
      {simplified && (
        <p className="rounded-lg bg-accent px-3 py-2 text-sm text-accent-foreground">
          Modo simplificado: rodadas mais fáceis para retomar a confiança.{concept?.summary ? ` ${concept.summary}` : ""}
        </p>
      )}
      <p className="text-base font-medium sm:text-lg">{round.prompt}</p>

      {round.staff && <Staff clef={round.staff.clef} notes={round.staff.notes} />}

      {round.cue.length > 0 && round.answerMode !== "sing" && (
        <div className="flex flex-wrap gap-2">
          <PlayButton events={round.cue} label="Ouvir" variant="default" />
          {SLOW_TYPES.has(exercise.type) && <PlayButton events={round.cue} label="Mais devagar" speed={0.6} variant="outline" />}
          {exercise.type === "quiz" && <span className="sr-only">Esta pergunta tem um exemplo sonoro.</span>}
        </div>
      )}
      {round.cue.length > 0 && round.answerMode === "self" && <span className="sr-only">Use o áudio como referência.</span>}

      {round.answerMode === "choice" && (
        <AnswerChoice round={round} answered={answer?.choice ?? null} onAnswer={(id) => registerResult(gradeChoice(round, id), { choice: id })} />
      )}
      {(round.answerMode === "keyboard-note" || round.answerMode === "keyboard-sequence") && (
        <AnswerKeyboard key={`${runId}-${index}`} round={round} done={done} onSubmit={(played) => registerResult(gradeSequence(round, played))} />
      )}
      {round.answerMode === "tap" && <AnswerTap key={`${runId}-${index}`} round={round} done={done} onSubmit={(taps) => registerResult(gradeTapRound(round, taps))} />}
      {round.answerMode === "self" && round.selfItems && (
        <AnswerSelf key={`${runId}-${index}`} items={round.selfItems} done={done} onSubmit={(ratings) => registerResult(gradeSelf(round, ratings))} />
      )}
      {round.answerMode === "sing" && (
        <AnswerSing
          key={`${runId}-${index}`}
          round={round}
          mic={mic}
          done={done}
          onSubmit={(o) =>
            registerResult(
              o.mode === "mic"
                ? gradeSing(round, o.analysis)
                : { index: round.index, score: o.rating, correct: o.rating === 1, detail: { selfReported: true, targetMidi: round.targetMidi } },
              { sing: o },
            )
          }
        />
      )}

      {done && (
        <div className="space-y-3" aria-live="polite">
          {answer.sing?.mode === "mic" && <SingResult analysis={answer.sing.analysis} />}
          <div className={cn("flex gap-3 rounded-xl p-3", answer.result.score >= 0.99 ? "bg-success/10" : answer.result.score >= 0.5 ? "bg-warning/15" : "bg-destructive/10")}>
            {answer.result.score >= 0.99 ? <Check className="mt-0.5 size-5 shrink-0 text-success" /> : <X className="mt-0.5 size-5 shrink-0 text-destructive" />}
            <div className="space-y-1 text-sm">
              <p className="font-medium">
                {round.answerMode === "self"
                  ? "Autoavaliação registrada."
                  : answer.result.score >= 0.99
                    ? "Correto!"
                    : answer.result.score > 0
                      ? `Parcialmente correto (${Math.round(answer.result.score * 100)}%).`
                      : "Não foi desta vez."}
              </p>
              {round.explanation && <p className="text-muted-foreground">{round.explanation}</p>}
              {round.answerMode === "tap" && answer.result.detail && (
                <p className="text-muted-foreground">
                  {String(answer.result.detail.matched)} de {String(answer.result.detail.expected)} ataques no tempo
                  {Number(answer.result.detail.extraTaps) > 0 ? `, ${String(answer.result.detail.extraTaps)} toque(s) a mais` : ""}.
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={nextRound}>
              {index + 1 >= total ? "Ver resultado" : "Próxima"} <ArrowRight />
            </Button>
            {round.cue.length > 0 && round.answerMode !== "sing" && (
              <PlayButton events={round.cue} label="Ouvir de novo" variant="ghost" />
            )}
            {SLOW_TYPES.has(exercise.type) && round.cue.length > 0 && (
              <PlayButton events={round.cue} label="Ouvir devagar" speed={0.6} variant="ghost" />
            )}
          </div>
        </div>
      )}
      {!done && round.answerMode === "choice" && exercise.type !== "quiz" && SLOW_TYPES.has(exercise.type) && (
        <p className="flex items-center gap-1 text-xs text-muted-foreground">
          <Turtle className="size-3.5" /> Dica: ouça mais devagar quantas vezes precisar antes de responder.
        </p>
      )}
    </div>
  );
}

function pickDetail(d: Record<string, unknown>) {
  const keep = ["meanCents", "stdCents", "inTuneRatio", "stable", "status", "verdict", "targetMidi", "matched", "expected", "extraTaps", "meanAbsErrorMs", "selfReported"];
  return Object.fromEntries(Object.entries(d).filter(([k]) => keep.includes(k)).map(([k, v]) => [k, typeof v === "number" ? Math.round(v * 100) / 100 : v]));
}

function singSummary(results: RoundResult[]) {
  const mic = results.filter((r) => r.detail && !r.detail.selfReported);
  return {
    stable: mic.some((r) => r.detail?.stable === true && r.score >= 0.7),
    micRounds: mic.length,
  };
}
