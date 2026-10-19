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
import { addRehearsalNote, addTask, deleteRehearsalNote, deleteTask, saveRehearsalSummary, setAttendance } from "@/app/actions/rehearsals";
import { initialActionState, type ActionResult } from "@/lib/action-result";
import { cn } from "@/lib/utils";

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

type Status = "presente" | "ausente" | "justificado";

export function AttendancePanel({ rehearsalId, members }: { rehearsalId: string; members: { id: string; name: string; part?: string | null; status: Status | null }[] }) {
  const [local, setLocal] = useState(() => Object.fromEntries(members.map((m) => [m.id, m.status])));
  const [, startTransition] = useTransition();
  const set = (userId: string, status: Status) => {
    const next = local[userId] === status ? null : status;
    setLocal((l) => ({ ...l, [userId]: next }));
    startTransition(async () => {
      const r = await setAttendance(rehearsalId, userId, next);
      if (!r.ok) toast.error(r.error);
    });
  };
  const count = (s: Status) => Object.values(local).filter((x) => x === s).length;
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        {count("presente")} presentes · {count("ausente")} ausentes · {count("justificado")} justificados
      </p>
      <ul className="divide-y rounded-xl border bg-card">
        {members.map((m) => (
          <li key={m.id} className="flex flex-wrap items-center gap-2 p-2.5">
            <span className="min-w-40 flex-1 text-sm">
              {m.name}
              {m.part && <span className="text-xs text-muted-foreground"> · {m.part}</span>}
            </span>
            {(["presente", "ausente", "justificado"] as const).map((s) => (
              <button
                key={s}
                type="button"
                aria-pressed={local[m.id] === s}
                onClick={() => set(m.id, s)}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-xs",
                  local[m.id] === s ? (s === "presente" ? "border-success bg-success text-success-foreground" : s === "ausente" ? "border-destructive bg-destructive text-white" : "border-warning bg-warning text-warning-foreground") : "hover:bg-muted",
                )}
              >
                {s === "presente" ? "Presente" : s === "ausente" ? "Ausente" : "Justificado"}
              </button>
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function NoteForm({ rehearsalId }: { rehearsalId: string }) {
  const [state, action, pending] = useActionState(addRehearsalNote, initialActionState);
  const ref = useRef<HTMLFormElement>(null);
  useFeedback(state, ref);
  return (
    <form ref={ref} action={action} className="space-y-2">
      <input type="hidden" name="rehearsalId" value={rehearsalId} />
      <div className="grid gap-2 sm:grid-cols-[200px_1fr]">
        <NativeSelect name="kind" aria-label="Tipo de anotação" defaultValue="dificuldade" options={[{ value: "dificuldade", label: "Dificuldade encontrada" }, { value: "aprendizado", label: "O que foi aprendido" }, { value: "retomar", label: "Precisa ser retomado" }, { value: "observacao", label: "Observação" }]} />
        <Textarea name="content" required maxLength={4000} rows={2} aria-label="Anotação" placeholder="Ex.: contraltos atrasaram a entrada do compasso 9." />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="visible" className="size-4" /> Visível para os integrantes
        </label>
        <Button type="submit" size="sm" disabled={pending}>
          Adicionar anotação
        </Button>
      </div>
    </form>
  );
}

export function DeleteNoteButton({ id, rehearsalId }: { id: string; rehearsalId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <Button size="icon" variant="ghost" aria-label="Excluir anotação" disabled={pending} onClick={() => startTransition(async () => { await deleteRehearsalNote(id, rehearsalId); router.refresh(); })}>
      <Trash2 />
    </Button>
  );
}

export function TaskForm({ rehearsalId, members }: { rehearsalId: string; members: { id: string; name: string }[] }) {
  const [state, action, pending] = useActionState(addTask, initialActionState);
  const ref = useRef<HTMLFormElement>(null);
  useFeedback(state, ref);
  return (
    <form ref={ref} action={action} className="grid gap-2 sm:grid-cols-[1fr_200px_150px_auto]">
      <input type="hidden" name="rehearsalId" value={rehearsalId} />
      <Input name="title" required maxLength={200} aria-label="Tarefa" placeholder="Ex.: estudar a 2ª voz, compassos 5–12, no treinador" />
      <NativeSelect name="assigneeId" aria-label="Responsável" defaultValue="" options={[{ value: "", label: "Todo o grupo" }, ...members.map((m) => ({ value: m.id, label: m.name }))]} />
      <Input name="dueOn" type="date" aria-label="Prazo" />
      <Button type="submit" disabled={pending}>
        Criar
      </Button>
    </form>
  );
}

export function DeleteTaskButton({ id, rehearsalId }: { id: string; rehearsalId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <Button size="icon" variant="ghost" aria-label="Excluir tarefa" disabled={pending} onClick={() => startTransition(async () => { await deleteTask(id, rehearsalId); router.refresh(); })}>
      <Trash2 />
    </Button>
  );
}

export function SummaryForm({ id, status, learned, revisit, next }: { id: string; status: string; learned: string | null; revisit: string | null; next: string | null }) {
  const [state, action, pending] = useActionState(saveRehearsalSummary, initialActionState);
  useFeedback(state);
  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="id" value={id} />
      <div className="space-y-1.5">
        <Label htmlFor="status">Situação</Label>
        <NativeSelect id="status" name="status" defaultValue={status} options={[{ value: "planejado", label: "Planejado" }, { value: "realizado", label: "Realizado" }, { value: "cancelado", label: "Cancelado" }]} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="learned">O que foi aprendido</Label>
        <Textarea id="learned" name="learned" defaultValue={learned ?? ""} maxLength={4000} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="revisit">O que precisa ser retomado</Label>
        <Textarea id="revisit" name="revisit" defaultValue={revisit ?? ""} maxLength={4000} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="next">Próximas atividades</Label>
        <Textarea id="next" name="next" defaultValue={next ?? ""} maxLength={4000} />
      </div>
      <Button type="submit" disabled={pending}>
        Salvar registro do ensaio
      </Button>
    </form>
  );
}
