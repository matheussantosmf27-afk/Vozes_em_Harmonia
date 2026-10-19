"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { NativeSelect } from "@/components/ui/native-select";
import { addObservation, addTeacherAssessment, deleteObservation, savePlan, setClassification, setSkillOverride } from "@/app/actions/teacher";
import { createGoal } from "@/app/actions/goals";
import { initialActionState, type ActionResult } from "@/lib/action-result";
import { noteName } from "@/lib/music/notes";
import { CLASSIFICATION_STATUS_LABELS, VOICE_LABELS } from "@/lib/pedagogy/classification";
import { MASTERY_LEVELS } from "@/lib/pedagogy/mastery";

const NOTE_OPTIONS = Array.from({ length: 49 }, (_, i) => 36 + i).map((m) => ({ value: String(m), label: noteName(m) }));

function useFeedback(state: ActionResult, formRef?: React.RefObject<HTMLFormElement | null>) {
  const router = useRouter();
  useEffect(() => {
    if (state.ok && state.message) {
      toast.success(state.message);
      formRef?.current?.reset();
      router.refresh();
    } else if (!state.ok && state.error) toast.error(state.error);
  }, [state, formRef, router]);
}

function NoteRange({ name, label, low, high }: { name: string; label: string; low?: number | null; high?: number | null }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <div className="flex items-center gap-2">
        <NativeSelect name={`${name}Low`} aria-label={`${label} — nota grave`} defaultValue={low ? String(low) : ""} placeholder="—" options={NOTE_OPTIONS} className="flex-1" />
        <span className="text-muted-foreground">a</span>
        <NativeSelect name={`${name}High`} aria-label={`${label} — nota aguda`} defaultValue={high ? String(high) : ""} placeholder="—" options={NOTE_OPTIONS} className="flex-1" />
      </div>
    </div>
  );
}

export function ClassificationForm({ userId, current }: { userId: string; current: { classification: string; status: string; comfortable_low_midi: number | null; comfortable_high_midi: number | null; range_low_midi: number | null; range_high_midi: number | null; tessitura_low_midi: number | null; tessitura_high_midi: number | null; passaggio: string | null } | null }) {
  const [state, action, pending] = useActionState(setClassification, initialActionState);
  useFeedback(state);
  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="userId" value={userId} />
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="classification">Classificação</Label>
          <NativeSelect id="classification" name="classification" defaultValue={current?.classification ?? "nao_classificada"} options={Object.entries(VOICE_LABELS).map(([value, label]) => ({ value, label }))} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="status">Situação</Label>
          <NativeSelect id="status" name="status" defaultValue={current?.status === "provisoria" ? "em_desenvolvimento" : current?.status ?? "provisoria"} options={Object.entries(CLASSIFICATION_STATUS_LABELS).map(([value, label]) => ({ value, label }))} />
        </div>
        <NoteRange name="comfortable" label="Região confortável" low={current?.comfortable_low_midi} high={current?.comfortable_high_midi} />
        <NoteRange name="range" label="Extensão observada" low={current?.range_low_midi} high={current?.range_high_midi} />
        <NoteRange name="tessitura" label="Tessitura estimada" low={current?.tessitura_low_midi} high={current?.tessitura_high_midi} />
        <div className="space-y-1.5">
          <Label htmlFor="passaggio">Região de passagem</Label>
          <Input id="passaggio" name="passaggio" maxLength={300} defaultValue={current?.passaggio ?? ""} placeholder="Ex.: Mi4–Fá♯4" />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="cls-notes">Observações (visíveis ao integrante)</Label>
        <Textarea id="cls-notes" name="notes" maxLength={4000} placeholder="Timbre, registração, recomendações…" />
      </div>
      <Button type="submit" disabled={pending}>
        Registrar classificação
      </Button>
    </form>
  );
}

export function TeacherAssessmentForm({ userId }: { userId: string }) {
  const [state, action, pending] = useActionState(addTeacherAssessment, initialActionState);
  const ref = useRef<HTMLFormElement>(null);
  useFeedback(state, ref);
  return (
    <form ref={ref} action={action} className="space-y-3">
      <input type="hidden" name="userId" value={userId} />
      <Textarea name="notes" required maxLength={4000} aria-label="Avaliação" placeholder="Afinação, respiração, projeção, ritmo, percepção, independência vocal…" />
      <div className="grid gap-3 sm:grid-cols-2">
        <NoteRange name="comfortable" label="Região confortável ouvida" />
        <NoteRange name="range" label="Extensão observada" />
      </div>
      <Button type="submit" disabled={pending}>
        Registrar avaliação
      </Button>
    </form>
  );
}

export function SkillOverrideRow({ userId, skill, name, autoLevel, teacherLevel, evidence }: { userId: string; skill: string; name: string; autoLevel: number; teacherLevel: number | null; evidence: string | null }) {
  const router = useRouter();
  const [level, setLevel] = useState(teacherLevel ? String(teacherLevel) : "");
  const [ev, setEv] = useState(evidence ?? "");
  const [pending, startTransition] = useTransition();
  return (
    <tr>
      <td className="p-2 font-medium">{name}</td>
      <td className="p-2 text-muted-foreground">{MASTERY_LEVELS[autoLevel - 1]?.short}</td>
      <td className="p-2">
        <NativeSelect aria-label={`Nível de ${name} pelo professor`} value={level} onChange={(e) => setLevel(e.target.value)} options={[{ value: "", label: "Usar o automático" }, ...MASTERY_LEVELS.map((l) => ({ value: String(l.level), label: `${l.level}. ${l.short}` }))]} />
      </td>
      <td className="p-2">
        <Input aria-label={`Evidência de ${name}`} value={ev} onChange={(e) => setEv(e.target.value)} placeholder="Evidência ou exceção" />
      </td>
      <td className="p-2">
        <Button
          size="sm"
          variant="outline"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              const r = await setSkillOverride(userId, skill, level ? Number(level) : null, ev);
              if (r.ok) {
                toast.success("Domínio atualizado.");
                router.refresh();
              } else toast.error(r.error);
            })
          }
        >
          Salvar
        </Button>
      </td>
    </tr>
  );
}

export function ObservationForm({ userId }: { userId: string }) {
  const [state, action, pending] = useActionState(addObservation, initialActionState);
  const ref = useRef<HTMLFormElement>(null);
  useFeedback(state, ref);
  return (
    <form ref={ref} action={action} className="space-y-2">
      <input type="hidden" name="userId" value={userId} />
      <div className="grid gap-2 sm:grid-cols-[200px_1fr]">
        <NativeSelect
          name="category"
          aria-label="Categoria"
          defaultValue="geral"
          options={[
            ["geral", "Geral"],
            ["afinacao", "Afinação"],
            ["respiracao", "Respiração"],
            ["ritmo", "Ritmo"],
            ["projecao", "Projeção"],
            ["percepcao", "Percepção"],
            ["independencia_vocal", "Independência vocal"],
            ["interpretacao", "Interpretação"],
            ["saude_vocal", "Saúde vocal"],
            ["distribuicao_vocal", "Distribuição vocal"],
          ].map(([value, label]) => ({ value, label }))}
        />
        <Textarea name="content" required maxLength={4000} rows={2} aria-label="Observação" placeholder="Observação técnica, recomendação de exercício ou sugestão de mudança de voz." />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="visible" defaultChecked className="size-4" /> Visível para o integrante
        </label>
        <Button type="submit" size="sm" disabled={pending}>
          Registrar observação
        </Button>
      </div>
    </form>
  );
}

export function DeleteObservationButton({ id, userId }: { id: string; userId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <Button size="icon" variant="ghost" aria-label="Excluir observação" disabled={pending} onClick={() => startTransition(async () => { await deleteObservation(id, userId); router.refresh(); })}>
      <Trash2 />
    </Button>
  );
}

export function PlanForm({
  userId,
  plan,
  skills,
  lessons,
}: {
  userId: string;
  plan: { id: string; objective: string; weekly_frequency: number; minutes_per_session: number; review_every_weeks: number; priority_skills: string[]; recommended_lessons: string[]; completion_criteria: string; next_level: string } | null;
  skills: { slug: string; name: string }[];
  lessons: { slug: string; label: string }[];
}) {
  const [state, action, pending] = useActionState(savePlan, initialActionState);
  useFeedback(state);
  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="userId" value={userId} />
      <input type="hidden" name="planId" value={plan?.id ?? ""} />
      <div className="space-y-1.5">
        <Label htmlFor="objective">Objetivo principal</Label>
        <Textarea id="objective" name="objective" required maxLength={600} defaultValue={plan?.objective ?? ""} />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="weeklyFrequency">Vezes por semana</Label>
          <Input id="weeklyFrequency" name="weeklyFrequency" type="number" min={1} max={7} defaultValue={plan?.weekly_frequency ?? 3} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="minutesPerSession">Minutos por sessão</Label>
          <Input id="minutesPerSession" name="minutesPerSession" type="number" min={5} max={120} defaultValue={plan?.minutes_per_session ?? 15} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="reviewEveryWeeks">Reavaliar a cada (semanas)</Label>
          <Input id="reviewEveryWeeks" name="reviewEveryWeeks" type="number" min={1} max={12} defaultValue={plan?.review_every_weeks ?? 4} />
        </div>
      </div>
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">Habilidades prioritárias</legend>
        <div className="flex flex-wrap gap-2">
          {skills.map((s) => (
            <label key={s.slug} className="flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs">
              <input type="checkbox" name="prioritySkills" value={s.slug} defaultChecked={plan?.priority_skills.includes(s.slug)} className="size-3.5" /> {s.name}
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">Aulas recomendadas</legend>
        <div className="grid max-h-56 gap-1 overflow-y-auto rounded-xl border p-2 sm:grid-cols-2">
          {lessons.map((l) => (
            <label key={l.slug} className="flex items-center gap-2 text-xs">
              <input type="checkbox" name="recommendedLessons" value={l.slug} defaultChecked={plan?.recommended_lessons.includes(l.slug)} className="size-3.5" /> {l.label}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="completionCriteria">Critério de conclusão</Label>
          <Textarea id="completionCriteria" name="completionCriteria" maxLength={1000} defaultValue={plan?.completion_criteria ?? ""} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="nextLevel">Recomendação para o próximo nível</Label>
          <Textarea id="nextLevel" name="nextLevel" maxLength={1000} defaultValue={plan?.next_level ?? ""} />
        </div>
      </div>
      <Button type="submit" disabled={pending}>
        {plan ? "Salvar ajustes do plano" : "Criar plano"}
      </Button>
    </form>
  );
}

export function GoalForm({ userId, skills }: { userId: string; skills: { slug: string; name: string }[] }) {
  const [state, action, pending] = useActionState(createGoal, initialActionState);
  const ref = useRef<HTMLFormElement>(null);
  useFeedback(state, ref);
  return (
    <form ref={ref} action={action} className="grid gap-2 sm:grid-cols-2">
      <input type="hidden" name="userId" value={userId} />
      <Input name="title" required maxLength={160} aria-label="Meta" placeholder="Meta (ex.: sustentar a 2ª voz do Hino da Alegria)" className="sm:col-span-2" />
      <NativeSelect name="horizon" aria-label="Prazo" defaultValue="4" options={[{ value: "1", label: "1 semana" }, { value: "4", label: "4 semanas" }, { value: "8", label: "8 semanas" }, { value: "12", label: "12 semanas" }]} />
      <NativeSelect name="skill" aria-label="Habilidade" defaultValue="" placeholder="Sem habilidade específica" options={skills.map((s) => ({ value: s.slug, label: s.name }))} />
      <NativeSelect name="targetLevel" aria-label="Nível-alvo" defaultValue="" placeholder="Nível-alvo (opcional)" options={MASTERY_LEVELS.map((l) => ({ value: String(l.level), label: `${l.level}. ${l.label}` }))} />
      <Input name="description" maxLength={2000} aria-label="Descrição" placeholder="Como será verificado" />
      <Button type="submit" disabled={pending} className="sm:col-span-2 sm:w-fit">
        Adicionar meta
      </Button>
    </form>
  );
}
