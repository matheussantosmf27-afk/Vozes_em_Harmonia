"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { NativeSelect } from "@/components/ui/native-select";
import { ExerciseRunner } from "@/components/exercises/exercise-runner";
import { createActivity, deleteActivity, toggleActivity } from "@/app/actions/teacher";
import { intervalBySemitones, CHORD_QUALITIES, SCALES } from "@/lib/music/theory";
import type { ExerciseType } from "@/lib/exercises/schemas";

type BuilderType = "quiz" | "interval_id" | "chord_quality" | "pitch_compare" | "melody_memory" | "rhythm_tap" | "tuning_check" | "scale_id" | "staff_read" | "sing_note";

const TYPE_LABELS: Record<BuilderType, string> = {
  quiz: "Questionário (com áudio opcional)",
  interval_id: "Identificar intervalos",
  chord_quality: "Identificar acordes",
  pitch_compare: "Grave ou agudo",
  melody_memory: "Memória melódica (teclado)",
  rhythm_tap: "Reproduzir ritmos",
  tuning_check: "Perceber desafinação",
  scale_id: "Identificar escalas",
  staff_read: "Leitura de notas na pauta",
  sing_note: "Cantar notas (microfone)",
};

interface Question {
  q: string;
  options: string[];
  answer: number;
  explanation: string;
  audio: string;
}

function Checks<T extends string | number>({ items, value, onChange, label }: { items: [T, string][]; value: T[]; onChange: (v: T[]) => void; label: string }) {
  return (
    <fieldset className="space-y-1.5">
      <legend className="text-sm font-medium">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {items.map(([v, l]) => (
          <label key={String(v)} className="flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs">
            <input type="checkbox" className="size-3.5" checked={value.includes(v)} onChange={(e) => onChange(e.target.checked ? [...value, v] : value.filter((x) => x !== v))} /> {l}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function ActivityBuilder({ skills, lessons }: { skills: { slug: string; name: string }[]; lessons: { id: string; label: string }[] }) {
  const router = useRouter();
  const [type, setType] = useState<BuilderType>("quiz");
  const [title, setTitle] = useState("");
  const [instructions, setInstructions] = useState("");
  const [skill, setSkill] = useState(skills[0]?.slug ?? "");
  const [lessonId, setLessonId] = useState("");
  const [purpose, setPurpose] = useState<"pratica" | "avaliacao">("pratica");
  const [difficulty, setDifficulty] = useState(2);
  const [rounds, setRounds] = useState(8);
  const [questions, setQuestions] = useState<Question[]>([{ q: "", options: ["", ""], answer: 0, explanation: "", audio: "" }]);
  const [intervals, setIntervals] = useState<number[]>([3, 4, 7, 12]);
  const [direction, setDirection] = useState("asc");
  const [qualities, setQualities] = useState<string[]>(["maior", "menor"]);
  const [minS, setMinS] = useState(2);
  const [maxS, setMaxS] = useState(7);
  const [minLen, setMinLen] = useState(3);
  const [maxLen, setMaxLen] = useState(4);
  const [patterns, setPatterns] = useState("q q h\nq e e q q");
  const [bpm, setBpm] = useState(80);
  const [cents, setCents] = useState(30);
  const [scales, setScales] = useState<string[]>(["maior", "menor_natural"]);
  const [clef, setClef] = useState("sol");
  const [notes, setNotes] = useState("C4 E4 G4");
  const [preview, setPreview] = useState(false);
  const [pending, startTransition] = useTransition();

  function config(): Record<string, unknown> {
    switch (type) {
      case "quiz":
        return {
          questions: questions.map((q) => ({
            q: q.q,
            options: q.options.filter(Boolean),
            answer: q.answer,
            explanation: q.explanation || undefined,
            audio: q.audio.trim() ? { notes: q.audio.trim().split(/\s+/), mode: "seq", tempo: 80 } : undefined,
          })),
        };
      case "interval_id":
        return { rounds, intervals, direction };
      case "chord_quality":
        return { rounds, qualities };
      case "pitch_compare":
        return { rounds, minSemitones: minS, maxSemitones: maxS };
      case "melody_memory":
        return { rounds, minLength: minLen, maxLength: maxLen };
      case "rhythm_tap":
        return { rounds, patterns: patterns.split("\n").map((p) => p.trim()).filter(Boolean), bpm };
      case "tuning_check":
        return { rounds, cents };
      case "scale_id":
        return { rounds, scales };
      case "staff_read":
        return { rounds, clef };
      case "sing_note":
        return { rounds: notes.split(/\s+/).filter(Boolean).length || 3, notes: notes.split(/\s+/).filter(Boolean) };
    }
  }

  function save() {
    startTransition(async () => {
      const r = await createActivity({ title, instructions, type, skill, lessonId: lessonId || null, purpose, difficulty, config: config() });
      if (!r.ok) return void toast.error(r.error);
      toast.success(r.message ?? "Criada");
      setTitle("");
      setPreview(false);
      router.refresh();
    });
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="act-type">Tipo de atividade</Label>
          <NativeSelect id="act-type" value={type} onChange={(e) => { setType(e.target.value as BuilderType); setPreview(false); }} options={Object.entries(TYPE_LABELS).map(([value, label]) => ({ value, label }))} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="act-title">Título</Label>
          <Input id="act-title" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={160} placeholder="Ex.: Terças do hino de domingo" />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="act-inst">Instruções</Label>
          <Input id="act-inst" value={instructions} onChange={(e) => setInstructions(e.target.value)} maxLength={1000} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="act-skill">Habilidade</Label>
          <NativeSelect id="act-skill" value={skill} onChange={(e) => setSkill(e.target.value)} options={skills.map((s) => ({ value: s.slug, label: s.name }))} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="act-lesson">Vincular a uma aula (opcional)</Label>
          <NativeSelect id="act-lesson" value={lessonId} onChange={(e) => setLessonId(e.target.value)} placeholder="Atividade avulsa (Aprender › Atividades extras)" options={lessons.map((l) => ({ value: l.id, label: l.label }))} />
        </div>
        {lessonId && (
          <div className="space-y-1.5">
            <Label htmlFor="act-purpose">Uso na aula</Label>
            <NativeSelect id="act-purpose" value={purpose} onChange={(e) => setPurpose(e.target.value as "pratica")} options={[{ value: "pratica", label: "Prática" }, { value: "avaliacao", label: "Avaliação (conta para concluir a aula)" }]} />
          </div>
        )}
        <div className="space-y-1.5">
          <Label htmlFor="act-diff">Dificuldade (1–5)</Label>
          <Input id="act-diff" type="number" min={1} max={5} value={difficulty} onChange={(e) => setDifficulty(Number(e.target.value))} />
        </div>
        {type !== "quiz" && type !== "sing_note" && (
          <div className="space-y-1.5">
            <Label htmlFor="act-rounds">Rodadas</Label>
            <Input id="act-rounds" type="number" min={1} max={30} value={rounds} onChange={(e) => setRounds(Number(e.target.value))} />
          </div>
        )}
      </div>

      <div className="space-y-3 rounded-2xl border bg-muted/30 p-4">
        {type === "quiz" && (
          <div className="space-y-4">
            {questions.map((q, i) => (
              <div key={i} className="space-y-2 rounded-xl border bg-card p-3">
                <div className="flex items-center gap-2">
                  <Input aria-label={`Pergunta ${i + 1}`} placeholder={`Pergunta ${i + 1}`} value={q.q} onChange={(e) => setQuestions(questions.map((x, k) => (k === i ? { ...x, q: e.target.value } : x)))} />
                  <Button size="icon" variant="ghost" aria-label="Remover pergunta" disabled={questions.length === 1} onClick={() => setQuestions(questions.filter((_, k) => k !== i))}>
                    <Trash2 />
                  </Button>
                </div>
                {q.options.map((o, j) => (
                  <label key={j} className="flex items-center gap-2 text-sm">
                    <input type="radio" name={`ans-${i}`} checked={q.answer === j} onChange={() => setQuestions(questions.map((x, k) => (k === i ? { ...x, answer: j } : x)))} aria-label="Resposta correta" />
                    <Input aria-label={`Opção ${j + 1}`} placeholder={`Opção ${j + 1}${q.answer === j ? " (correta)" : ""}`} value={o} onChange={(e) => setQuestions(questions.map((x, k) => (k === i ? { ...x, options: x.options.map((y, m) => (m === j ? e.target.value : y)) } : x)))} />
                  </label>
                ))}
                {q.options.length < 6 && (
                  <Button size="sm" variant="ghost" onClick={() => setQuestions(questions.map((x, k) => (k === i ? { ...x, options: [...x.options, ""] } : x)))}>
                    <Plus /> Opção
                  </Button>
                )}
                <Input aria-label="Explicação" placeholder="Explicação mostrada após responder (opcional)" value={q.explanation} onChange={(e) => setQuestions(questions.map((x, k) => (k === i ? { ...x, explanation: e.target.value } : x)))} />
                <Input aria-label="Áudio" placeholder="Áudio opcional: notas separadas por espaço (ex.: C4 E4 G4)" value={q.audio} onChange={(e) => setQuestions(questions.map((x, k) => (k === i ? { ...x, audio: e.target.value } : x)))} />
              </div>
            ))}
            <Button variant="outline" onClick={() => setQuestions([...questions, { q: "", options: ["", ""], answer: 0, explanation: "", audio: "" }])}>
              <Plus /> Pergunta
            </Button>
          </div>
        )}
        {type === "interval_id" && (
          <>
            <Checks label="Intervalos" items={Array.from({ length: 12 }, (_, i) => [i + 1, intervalBySemitones(i + 1).name] as [number, string])} value={intervals} onChange={setIntervals} />
            <NativeSelect aria-label="Direção" value={direction} onChange={(e) => setDirection(e.target.value)} options={[{ value: "asc", label: "Ascendente" }, { value: "desc", label: "Descendente" }, { value: "harmonic", label: "Harmônico" }, { value: "mixed", label: "Misto" }]} className="w-56" />
          </>
        )}
        {type === "chord_quality" && <Checks label="Tipos de acorde" items={(["maior", "menor", "diminuto", "aumentado", "dominante7"] as const).map((q) => [q, CHORD_QUALITIES[q].label] as [string, string])} value={qualities} onChange={setQualities} />}
        {type === "pitch_compare" && (
          <div className="flex gap-3">
            <Label className="flex items-center gap-2">Menor distância <Input type="number" min={1} max={12} value={minS} onChange={(e) => setMinS(Number(e.target.value))} className="w-20" /></Label>
            <Label className="flex items-center gap-2">Maior distância <Input type="number" min={1} max={24} value={maxS} onChange={(e) => setMaxS(Number(e.target.value))} className="w-20" /></Label>
          </div>
        )}
        {type === "melody_memory" && (
          <div className="flex gap-3">
            <Label className="flex items-center gap-2">Notas (mín.) <Input type="number" min={2} max={10} value={minLen} onChange={(e) => setMinLen(Number(e.target.value))} className="w-20" /></Label>
            <Label className="flex items-center gap-2">Notas (máx.) <Input type="number" min={2} max={12} value={maxLen} onChange={(e) => setMaxLen(Number(e.target.value))} className="w-20" /></Label>
          </div>
        )}
        {type === "rhythm_tap" && (
          <div className="grid gap-2 sm:grid-cols-[1fr_120px]">
            <div className="space-y-1.5">
              <Label htmlFor="patterns">Padrões (um por linha): w, h, h., q, q., e, s; pausas com “r” (rq)</Label>
              <Textarea id="patterns" value={patterns} onChange={(e) => setPatterns(e.target.value)} className="font-mono" />
            </div>
            <Label className="flex flex-col gap-1.5">bpm <Input type="number" min={40} max={160} value={bpm} onChange={(e) => setBpm(Number(e.target.value))} /></Label>
          </div>
        )}
        {type === "tuning_check" && <Label className="flex items-center gap-2">Diferença em cents <Input type="number" min={5} max={100} value={cents} onChange={(e) => setCents(Number(e.target.value))} className="w-24" /></Label>}
        {type === "scale_id" && <Checks label="Escalas" items={Object.entries(SCALES).map(([k, v]) => [k, v.label] as [string, string])} value={scales} onChange={setScales} />}
        {type === "staff_read" && <NativeSelect aria-label="Clave" value={clef} onChange={(e) => setClef(e.target.value)} options={[{ value: "sol", label: "Clave de Sol" }, { value: "fa", label: "Clave de Fá" }, { value: "ambas", label: "As duas" }]} className="w-56" />}
        {type === "sing_note" && (
          <div className="space-y-1.5">
            <Label htmlFor="sing-notes">Notas a cantar (ex.: C4 E4 G4 — homens cantam uma oitava abaixo)</Label>
            <Input id="sing-notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={() => setPreview(!preview)}>
          {preview ? "Fechar pré-visualização" : "Pré-visualizar"}
        </Button>
        <Button onClick={save} disabled={pending || title.trim().length < 3}>
          Criar atividade
        </Button>
      </div>
      {preview && (
        <ExerciseRunner persist={false} exercise={{ id: "00000000-0000-0000-0000-000000000000", slug: "preview", title: title || "Pré-visualização", instructions, type: type as ExerciseType, config: config(), purpose }} />
      )}
    </div>
  );
}

export function ActivityRowActions({ id, published }: { id: string; published: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <div className="flex gap-1">
      <Button size="sm" variant="outline" disabled={pending} onClick={() => startTransition(async () => { await toggleActivity(id, !published); router.refresh(); })}>
        {published ? "Ocultar" : "Publicar"}
      </Button>
      <Button size="icon" variant="ghost" aria-label="Excluir atividade" disabled={pending} onClick={() => { if (confirm("Excluir a atividade e as tentativas registradas?")) startTransition(async () => { await deleteActivity(id); router.refresh(); }); }}>
        <Trash2 />
      </Button>
    </div>
  );
}
