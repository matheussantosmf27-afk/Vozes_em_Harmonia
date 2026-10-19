"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { NativeSelect } from "@/components/ui/native-select";
import { saveRehearsal } from "@/app/actions/rehearsals";

export interface AgendaItem {
  minutes: number;
  title: string;
  description: string;
  responsible: string;
}

export const DEFAULT_AGENDA: AgendaItem[] = [
  { minutes: 10, title: "Aquecimento e coordenação vocal", description: "Corpo, respiração, vibração de lábios e escalas em vogais.", responsible: "" },
  { minutes: 10, title: "Afinação e percepção auditiva", description: "Uníssono sustentado, acordes do repertório e entradas.", responsible: "" },
  { minutes: 15, title: "Estudo individual dos naipes", description: "Cada naipe revisa a própria parte nos trechos difíceis.", responsible: "" },
  { minutes: 20, title: "Ensaio conjunto", description: "Músicas do dia com todas as vozes.", responsible: "" },
  { minutes: 5, title: "Avaliação e definição das tarefas", description: "O que aprendemos, o que retomar e tarefas para o próximo ensaio.", responsible: "" },
];

export interface RehearsalFormValue {
  id?: string;
  title: string;
  startsAt: string;
  durationMinutes: number;
  location: string;
  groupId: string;
  objectives: string;
  agenda: AgendaItem[];
  repertoire: { id: string; focus: string }[];
}

export function RehearsalForm({
  initial,
  groups,
  repertoire,
  canEditRepertoire,
}: {
  initial: RehearsalFormValue;
  groups: { id: string; name: string }[];
  repertoire: { id: string; title: string }[];
  canEditRepertoire: boolean;
}) {
  const router = useRouter();
  const [v, setV] = useState(initial);
  const [pending, startTransition] = useTransition();
  const total = v.agenda.reduce((a, b) => a + (Number(b.minutes) || 0), 0);
  const setAgenda = (agenda: AgendaItem[]) => setV({ ...v, agenda });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const res = await saveRehearsal({
        id: v.id,
        title: v.title,
        startsAt: v.startsAt,
        durationMinutes: Number(v.durationMinutes),
        location: v.location,
        groupId: v.groupId || null,
        objectives: v.objectives,
        agenda: v.agenda.map((a) => ({ ...a, minutes: Number(a.minutes) })),
        repertoire: v.repertoire,
      });
      if (!res.ok || !res.data) {
        toast.error(res.ok ? "Erro ao salvar." : res.error);
        return;
      }
      toast.success("Ensaio salvo.");
      router.push(`/ensaios/${res.data.id}`);
      router.refresh();
    });
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="title">Título</Label>
          <Input id="title" required value={v.title} onChange={(e) => setV({ ...v, title: e.target.value })} placeholder="Ex.: Ensaio do coral — preparação para a Santa Ceia" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="startsAt">Data e horário (Brasília)</Label>
          <Input id="startsAt" type="datetime-local" required value={v.startsAt} onChange={(e) => setV({ ...v, startsAt: e.target.value })} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="duration">Duração (minutos)</Label>
          <Input id="duration" type="number" min={5} max={600} required value={v.durationMinutes} onChange={(e) => setV({ ...v, durationMinutes: Number(e.target.value) })} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="location">Local</Label>
          <Input id="location" value={v.location} onChange={(e) => setV({ ...v, location: e.target.value })} placeholder="Ex.: Sala de música" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="group">Grupo</Label>
          <NativeSelect id="group" value={v.groupId} onChange={(e) => setV({ ...v, groupId: e.target.value })} placeholder="Todo o ministério" options={groups.map((g) => ({ value: g.id, label: g.name }))} />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="objectives">Objetivos técnicos</Label>
          <Textarea id="objectives" value={v.objectives} onChange={(e) => setV({ ...v, objectives: e.target.value })} placeholder="Ex.: firmar a entrada dos tenores no compasso 9; afinar o acorde final." />
        </div>
      </div>

      <fieldset className="space-y-3" disabled={!canEditRepertoire}>
        <legend className="font-semibold">Músicas do ensaio</legend>
        {!canEditRepertoire && <p className="text-sm text-muted-foreground">Somente o diretor altera as músicas.</p>}
        <div className="grid gap-2 sm:grid-cols-2">
          {repertoire.map((r) => {
            const sel = v.repertoire.find((x) => x.id === r.id);
            return (
              <div key={r.id} className="space-y-2 rounded-xl border bg-card p-3">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <input
                    type="checkbox"
                    className="size-4"
                    checked={!!sel}
                    onChange={(e) => setV({ ...v, repertoire: e.target.checked ? [...v.repertoire, { id: r.id, focus: "" }] : v.repertoire.filter((x) => x.id !== r.id) })}
                  />
                  {r.title}
                </label>
                {sel && (
                  <Input
                    aria-label={`Foco em ${r.title}`}
                    placeholder="Foco (ex.: compassos 5–8, tenores)"
                    value={sel.focus}
                    onChange={(e) => setV({ ...v, repertoire: v.repertoire.map((x) => (x.id === r.id ? { ...x, focus: e.target.value } : x)) })}
                  />
                )}
              </div>
            );
          })}
          {repertoire.length === 0 && <p className="text-sm text-muted-foreground">Cadastre músicas no repertório para incluí-las.</p>}
        </div>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="flex w-full flex-wrap items-center justify-between gap-2 font-semibold">
          Pauta por blocos de tempo
          <span className={total === Number(v.durationMinutes) ? "text-sm font-normal text-success" : "text-sm font-normal text-warning-foreground"}>
            {total} de {v.durationMinutes} minutos planejados
          </span>
        </legend>
        <ol className="space-y-2">
          {v.agenda.map((a, i) => (
            <li key={i} className="grid gap-2 rounded-xl border bg-card p-3 sm:grid-cols-[80px_1fr_1fr_auto]">
              <Input type="number" min={1} max={300} aria-label="Minutos" value={a.minutes} onChange={(e) => setAgenda(v.agenda.map((x, k) => (k === i ? { ...x, minutes: Number(e.target.value) } : x)))} />
              <Input aria-label="Atividade" required value={a.title} onChange={(e) => setAgenda(v.agenda.map((x, k) => (k === i ? { ...x, title: e.target.value } : x)))} />
              <Input aria-label="Responsável" placeholder="Responsável" value={a.responsible} onChange={(e) => setAgenda(v.agenda.map((x, k) => (k === i ? { ...x, responsible: e.target.value } : x)))} />
              <div className="flex gap-1">
                <Button type="button" size="icon" variant="ghost" aria-label="Subir" disabled={i === 0} onClick={() => { const n = [...v.agenda]; [n[i - 1], n[i]] = [n[i], n[i - 1]]; setAgenda(n); }}>
                  <ArrowUp />
                </Button>
                <Button type="button" size="icon" variant="ghost" aria-label="Descer" disabled={i === v.agenda.length - 1} onClick={() => { const n = [...v.agenda]; [n[i + 1], n[i]] = [n[i], n[i + 1]]; setAgenda(n); }}>
                  <ArrowDown />
                </Button>
                <Button type="button" size="icon" variant="ghost" aria-label="Remover bloco" onClick={() => setAgenda(v.agenda.filter((_, k) => k !== i))}>
                  <Trash2 />
                </Button>
              </div>
              <Textarea aria-label="Descrição" className="sm:col-span-4" rows={2} value={a.description} onChange={(e) => setAgenda(v.agenda.map((x, k) => (k === i ? { ...x, description: e.target.value } : x)))} />
            </li>
          ))}
        </ol>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={() => setAgenda([...v.agenda, { minutes: 10, title: "Nova atividade", description: "", responsible: "" }])}>
            <Plus /> Adicionar bloco
          </Button>
          <Button type="button" variant="ghost" onClick={() => setAgenda(DEFAULT_AGENDA)}>
            Usar modelo de 60 minutos
          </Button>
        </div>
      </fieldset>

      <Button type="submit" size="lg" disabled={pending}>
        {pending && <Loader2 className="animate-spin" />} Salvar ensaio
      </Button>
    </form>
  );
}
