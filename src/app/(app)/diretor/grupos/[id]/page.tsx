import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle, CheckCircle2, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NativeSelect } from "@/components/ui/native-select";
import { AddMemberForm, MemberPartSelect } from "@/components/director/director-controls";
import { requireDirector } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getActiveMembers } from "@/lib/data/people";
import { deleteGroup } from "@/app/actions/director";
import { VOICE_LABELS } from "@/lib/pedagogy/classification";
import { noteName } from "@/lib/music/notes";

export const metadata: Metadata = { title: "Formação vocal" };

const DEFAULT_PARTS: Record<string, string[]> = {
  coral: ["Soprano", "Contralto", "Tenor", "Baixo"],
  quarteto: ["1º tenor", "2º tenor", "Barítono", "Baixo"],
  pequeno_grupo: ["Voz 1", "Voz 2", "Voz 3"],
  equipe_louvor: ["Melodia", "2ª voz", "3ª voz"],
  turma: ["Vozes agudas", "Vozes médias", "Vozes graves"],
};

const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/\s*\(.*\)\s*/g, "").trim();

export default async function GrupoPage({ params, searchParams }: PageProps<"/diretor/grupos/[id]">) {
  const { id } = await params;
  const sp = await searchParams;
  await requireDirector();
  const supabase = await createClient();
  const { data: group } = await supabase.from("vocal_groups").select("*, group_members(user_id, part_label)").eq("id", id).maybeSingle();
  if (!group) notFound();
  const [members, { data: arrangements }, { data: mastery }] = await Promise.all([
    getActiveMembers(),
    supabase.from("arrangements").select("id, title, repertoire(title), vocal_parts(id, name, sort, range_low_midi, range_high_midi)").order("title"),
    supabase.from("skill_mastery").select("user_id, skill_slug, level").in("skill_slug", ["harmonia-duas-vozes", "harmonia-tres-quatro-vozes", "independencia-vocal"]),
  ]);
  const byId = new Map(members.map((m) => [m.id, m]));
  const current = group.group_members.map((gm) => ({ ...gm, member: byId.get(gm.user_id) })).filter((x) => x.member);
  const usedParts = [...new Set(group.group_members.map((g) => g.part_label).filter(Boolean) as string[])];
  const arrangementId = typeof sp.arranjo === "string" ? sp.arranjo : "";
  const arrangement = arrangements?.find((a) => a.id === arrangementId);
  const parts = arrangement ? [...arrangement.vocal_parts].sort((a, b) => a.sort - b.sort) : [];
  const partOptions = [...new Set([...(arrangement ? parts.map((p) => p.name) : DEFAULT_PARTS[group.kind] ?? []), ...usedParts])];
  const level = (userId: string, skill: string) => mastery?.find((m) => m.user_id === userId && m.skill_slug === skill)?.level ?? 1;

  // Alertas da formação para o arranjo selecionado
  const alerts: { kind: "erro" | "aviso"; text: string }[] = [];
  if (arrangement) {
    const harmonySkill = parts.length >= 3 ? "harmonia-tres-quatro-vozes" : "harmonia-duas-vozes";
    for (const p of parts) {
      const singers = current.filter((c) => c.part_label && norm(c.part_label) === norm(p.name));
      if (singers.length === 0) alerts.push({ kind: "erro", text: `Ninguém do grupo está na voz “${p.name}”.` });
      for (const s of singers) {
        const m = s.member!;
        const comfy = m.classification?.comfortable_low_midi && m.classification.comfortable_high_midi ? [m.classification.comfortable_low_midi, m.classification.comfortable_high_midi] : null;
        if (comfy && p.range_low_midi && p.range_high_midi) {
          const shift = Math.round(((comfy[0] + comfy[1]) / 2 - (p.range_low_midi + p.range_high_midi) / 2) / 12) * 12;
          if (p.range_low_midi + shift < comfy[0] - 2 || p.range_high_midi + shift > comfy[1] + 2) {
            alerts.push({ kind: "aviso", text: `${m.full_name}: a voz “${p.name}” (${noteName(p.range_low_midi)}–${noteName(p.range_high_midi)}) sai da região confortável registrada (${noteName(comfy[0])}–${noteName(comfy[1])}).` });
          }
        } else if (!comfy) {
          alerts.push({ kind: "aviso", text: `${m.full_name}: região confortável ainda não registrada.` });
        }
        if (parts.length > 1 && level(m.id, harmonySkill) < 3) alerts.push({ kind: "aviso", text: `${m.full_name}: ainda desenvolvendo “${parts.length >= 3 ? "três e quatro vozes" : "duas vozes"}” (habilidade exigida pelo arranjo).` });
        if (parts.length > 1 && level(m.id, "independencia-vocal") < 3) alerts.push({ kind: "aviso", text: `${m.full_name}: independência vocal ainda em familiarização.` });
      }
    }
  }

  return (
    <>
      <nav aria-label="Trilha de navegação" className="mb-3 text-sm text-muted-foreground">
        <Link href="/diretor/grupos" className="hover:underline">
          Grupos
        </Link>{" "}
        / {group.name}
      </nav>
      <PageHeader
        title={group.name}
        description="Defina a voz de cada integrante no grupo e confira a formação para um arranjo do repertório."
        actions={
          <form action={deleteGroup.bind(null, id)}>
            <Button type="submit" variant="ghost" size="sm">
              <Trash2 /> Excluir grupo
            </Button>
          </form>
        }
      />
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <section className="space-y-4 rounded-2xl border bg-card p-5">
          <h2 className="font-semibold">Integrantes ({current.length})</h2>
          <AddMemberForm
            groupId={id}
            parts={partOptions}
            candidates={members.filter((m) => !group.group_members.some((g) => g.user_id === m.id)).map((m) => ({ id: m.id, label: `${m.full_name}${m.classification ? ` · ${VOICE_LABELS[m.classification.classification]}` : ""}` }))}
          />
          <ul className="divide-y">
            {current.map((c) => {
              const m = c.member!;
              return (
                <li key={c.user_id} className="flex flex-wrap items-center gap-3 py-2 text-sm">
                  <span className="min-w-48 flex-1">
                    <Link href={`/professor/integrantes/${m.id}`} className="font-medium hover:underline">
                      {m.full_name}
                    </Link>
                    <span className="block text-xs text-muted-foreground">
                      {m.classification ? VOICE_LABELS[m.classification.classification] : "Sem classificação"}
                      {m.classification?.comfortable_low_midi && m.classification.comfortable_high_midi ? ` · ${noteName(m.classification.comfortable_low_midi)}–${noteName(m.classification.comfortable_high_midi)}` : ""}
                    </span>
                  </span>
                  <MemberPartSelect groupId={id} userId={m.id} value={c.part_label ?? ""} parts={partOptions} />
                </li>
              );
            })}
          </ul>
          <div className="flex flex-wrap gap-2 border-t pt-3 text-sm">
            {partOptions.map((p) => (
              <Badge key={p} variant="outline">
                {p}: {current.filter((c) => c.part_label && norm(c.part_label) === norm(p)).length}
              </Badge>
            ))}
          </div>
        </section>
        <aside className="space-y-4">
          <section className="space-y-3 rounded-2xl border bg-card p-5">
            <h2 className="font-semibold">Conferir formação para um arranjo</h2>
            <form className="flex gap-2">
              <NativeSelect name="arranjo" aria-label="Arranjo" defaultValue={arrangementId} placeholder="Escolha um arranjo…" options={(arrangements ?? []).map((a) => ({ value: a.id, label: `${a.repertoire?.title} — ${a.title}` }))} className="flex-1" />
              <Button type="submit" variant="secondary">
                Conferir
              </Button>
            </form>
            {arrangement && (
              <>
                <p className="text-xs text-muted-foreground">As vozes do grupo são comparadas pelo nome com as vozes do arranjo ({parts.map((p) => p.name).join(", ")}).</p>
                {alerts.length === 0 ? (
                  <p className="flex items-center gap-2 text-sm text-success">
                    <CheckCircle2 className="size-4" /> Formação completa e dentro das regiões registradas.
                  </p>
                ) : (
                  <ul className="space-y-2 text-sm">
                    {alerts.map((a, i) => (
                      <li key={i} className="flex gap-2">
                        <AlertTriangle className={a.kind === "erro" ? "mt-0.5 size-4 shrink-0 text-destructive" : "mt-0.5 size-4 shrink-0 text-warning"} />
                        {a.text}
                      </li>
                    ))}
                  </ul>
                )}
                <p className="text-xs text-muted-foreground">Alertas são indicativos: a decisão final é do diretor e dos professores.</p>
              </>
            )}
          </section>
        </aside>
      </div>
    </>
  );
}
