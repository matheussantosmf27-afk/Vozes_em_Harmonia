import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, Clock, MapPin, Pencil, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import type { AgendaItem } from "@/components/rehearsal/rehearsal-form";
import { AttendancePanel, DeleteNoteButton, DeleteTaskButton, NoteForm, SummaryForm, TaskForm } from "@/components/rehearsal/rehearsal-panels";
import { TaskCheckbox } from "@/components/rehearsal/task-checkbox";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getActiveMembers } from "@/lib/data/people";
import { deleteRehearsal } from "@/app/actions/rehearsals";
import { formatDate, formatDateTime } from "@/lib/format";
import { VOICE_LABELS } from "@/lib/pedagogy/classification";

export const metadata: Metadata = { title: "Ensaio" };

const NOTE_KIND = { dificuldade: "Dificuldade", aprendizado: "Aprendido", retomar: "Retomar", observacao: "Observação" } as const;
const STATUS = { planejado: "Planejado", realizado: "Realizado", cancelado: "Cancelado" } as const;

export default async function EnsaioPage({ params }: PageProps<"/ensaios/[id]">) {
  const { id } = await params;
  const user = await requireUser();
  const supabase = await createClient();
  const { data: s } = await supabase
    .from("rehearsal_sessions")
    .select("*, vocal_groups(id, name), rehearsal_repertoire(focus, sort, repertoire(id, title, group_key))")
    .eq("id", id)
    .maybeSingle();
  if (!s) notFound();
  const [{ data: attendance }, { data: notes }, { data: tasks }, members, { data: groupMembers }] = await Promise.all([
    supabase.from("rehearsal_attendance").select("user_id, status").eq("rehearsal_id", id),
    supabase.from("rehearsal_notes").select("id, kind, content, visible_to_members, created_at, author:profiles!rehearsal_notes_author_id_fkey(full_name)").eq("rehearsal_id", id).order("created_at"),
    supabase.from("rehearsal_tasks").select("id, title, due_on, done_at, assignee_id, assignee:profiles!rehearsal_tasks_assignee_id_fkey(full_name)").eq("rehearsal_id", id).order("created_at"),
    user.isStaff ? getActiveMembers() : Promise.resolve([]),
    s.group_id ? supabase.from("group_members").select("user_id, part_label").eq("group_id", s.group_id) : Promise.resolve({ data: null }),
  ]);
  const agenda = (s.agenda as unknown as AgendaItem[]) ?? [];
  const offsets = agenda.map((_, i) => agenda.slice(0, i).reduce((acc, a) => acc + a.minutes, 0));
  const att = new Map((attendance ?? []).map((a) => [a.user_id, a.status]));
  const groupSet = groupMembers ? new Map(groupMembers.map((g) => [g.user_id, g.part_label])) : null;
  const roster = members
    .filter((m) => !groupSet || groupSet.has(m.id))
    .map((m) => ({ id: m.id, name: m.full_name, part: groupSet?.get(m.id) ?? (m.classification ? VOICE_LABELS[m.classification.classification] : null), status: att.get(m.id) ?? null }));
  const myAttendance = att.get(user.id);
  const startTime = new Date(s.starts_at);

  return (
    <>
      <nav aria-label="Trilha de navegação" className="mb-3 text-sm text-muted-foreground">
        <Link href="/ensaios" className="hover:underline">
          Ensaios
        </Link>{" "}
        / {formatDate(s.starts_at)}
      </nav>
      <PageHeader
        title={s.title}
        description={
          <span className="flex flex-wrap gap-x-4 gap-y-1">
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="size-4" /> {formatDateTime(s.starts_at)}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="size-4" /> {s.duration_minutes} min
            </span>
            {s.location && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="size-4" /> {s.location}
              </span>
            )}
          </span>
        }
        actions={
          <>
            <Badge variant={s.status === "realizado" ? "default" : "secondary"}>{STATUS[s.status]}</Badge>
            {user.isStaff && (
              <Link href={`/ensaios/${id}/editar`} className={buttonVariants({ variant: "outline", size: "sm" })}>
                <Pencil /> Editar
              </Link>
            )}
            {user.isDirector && (
              <form action={deleteRehearsal.bind(null, id)}>
                <Button variant="ghost" size="sm" type="submit" aria-label="Excluir ensaio">
                  <Trash2 />
                </Button>
              </form>
            )}
          </>
        }
      />
      {!user.isStaff && myAttendance && <p className="mb-4 text-sm">Sua presença: <strong>{myAttendance}</strong></p>}
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          {s.objectives && (
            <section className="space-y-2 rounded-2xl border bg-card p-5">
              <h2 className="font-semibold">Objetivos técnicos</h2>
              <p className="whitespace-pre-line text-sm leading-relaxed">{s.objectives}</p>
            </section>
          )}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">Pauta</h2>
            <ol className="space-y-2">
              {agenda.map((a, i) => {
                const begin = new Date(startTime.getTime() + offsets[i] * 60000);
                return (
                  <li key={i} className="flex gap-4 rounded-xl border bg-card p-3">
                    <div className="w-16 shrink-0 text-center">
                      <p className="font-heading text-lg">{a.minutes}′</p>
                      <p className="text-xs text-muted-foreground">{formatDate(begin, { hour: "2-digit", minute: "2-digit" })}</p>
                    </div>
                    <div className="flex-1 text-sm">
                      <p className="font-medium">{a.title}</p>
                      {a.description && <p className="text-muted-foreground">{a.description}</p>}
                      {a.responsible && <p className="text-xs text-muted-foreground">Responsável: {a.responsible}</p>}
                    </div>
                  </li>
                );
              })}
              {agenda.length === 0 && <p className="text-sm text-muted-foreground">Pauta ainda não definida.</p>}
            </ol>
          </section>
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">Músicas</h2>
            <ul className="space-y-2">
              {[...s.rehearsal_repertoire].sort((a, b) => a.sort - b.sort).map((r) =>
                r.repertoire ? (
                  <li key={r.repertoire.id}>
                    <Link href={`/repertorio/${r.repertoire.id}`} className="block rounded-xl border bg-card p-3 text-sm hover:border-primary">
                      <span className="font-medium">{r.repertoire.title}</span>
                      {r.repertoire.group_key && <span className="text-muted-foreground"> · {r.repertoire.group_key}</span>}
                      {r.focus && <span className="block text-muted-foreground">Foco: {r.focus}</span>}
                    </Link>
                  </li>
                ) : null,
              )}
              {s.rehearsal_repertoire.length === 0 && <p className="text-sm text-muted-foreground">Nenhuma música selecionada.</p>}
            </ul>
          </section>
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">Tarefas para antes do próximo ensaio</h2>
            {user.isStaff && <TaskForm rehearsalId={id} members={roster.map((m) => ({ id: m.id, name: m.name }))} />}
            <ul className="space-y-2">
              {(tasks ?? []).map((t) => (
                <li key={t.id} className="flex items-start gap-3 rounded-xl border bg-card p-3 text-sm">
                  <TaskCheckbox id={t.id} done={!!t.done_at} canToggle={user.isStaff || t.assignee_id === user.id} />
                  <span className="flex-1">
                    <span className={t.done_at ? "line-through text-muted-foreground" : "font-medium"}>{t.title}</span>
                    <span className="block text-xs text-muted-foreground">
                      {t.assignee?.full_name ?? "Todo o grupo"}
                      {t.due_on ? ` · até ${formatDate(t.due_on)}` : ""}
                    </span>
                  </span>
                  {user.isStaff && <DeleteTaskButton id={t.id} rehearsalId={id} />}
                </li>
              ))}
              {(tasks ?? []).length === 0 && <p className="text-sm text-muted-foreground">Nenhuma tarefa.</p>}
            </ul>
          </section>
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">Anotações</h2>
            {user.isStaff && <NoteForm rehearsalId={id} />}
            <ul className="space-y-2">
              {(notes ?? []).map((n) => (
                <li key={n.id} className="flex items-start gap-3 rounded-xl border bg-card p-3 text-sm">
                  <Badge variant={n.kind === "dificuldade" || n.kind === "retomar" ? "secondary" : "outline"}>{NOTE_KIND[n.kind as keyof typeof NOTE_KIND]}</Badge>
                  <span className="flex-1">
                    {n.content}
                    <span className="block text-xs text-muted-foreground">
                      {n.author?.full_name}
                      {user.isStaff && !n.visible_to_members ? " · somente equipe" : ""}
                    </span>
                  </span>
                  {user.isStaff && <DeleteNoteButton id={n.id} rehearsalId={id} />}
                </li>
              ))}
              {(notes ?? []).length === 0 && <p className="text-sm text-muted-foreground">Nenhuma anotação.</p>}
            </ul>
          </section>
        </div>
        <aside className="space-y-6">
          {(s.summary_learned || s.summary_revisit || s.summary_next) && !user.isStaff && (
            <section className="space-y-2 rounded-2xl border bg-card p-5 text-sm">
              <h2 className="font-semibold">Resumo do ensaio</h2>
              {s.summary_learned && <p><strong>Aprendemos:</strong> {s.summary_learned}</p>}
              {s.summary_revisit && <p><strong>Retomar:</strong> {s.summary_revisit}</p>}
              {s.summary_next && <p><strong>Próximos passos:</strong> {s.summary_next}</p>}
            </section>
          )}
          {user.isStaff && (
            <>
              <section className="space-y-3 rounded-2xl border bg-card p-5">
                <h2 className="font-semibold">Presença{s.vocal_groups?.name ? ` · ${s.vocal_groups.name}` : ""}</h2>
                <AttendancePanel rehearsalId={id} members={roster} />
              </section>
              <section className="space-y-3 rounded-2xl border bg-card p-5">
                <h2 className="font-semibold">Depois do ensaio</h2>
                <SummaryForm id={id} status={s.status} learned={s.summary_learned} revisit={s.summary_revisit} next={s.summary_next} />
              </section>
            </>
          )}
        </aside>
      </div>
    </>
  );
}
