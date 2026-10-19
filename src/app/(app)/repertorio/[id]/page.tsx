import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GitMerge, Pencil, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { AssignPartControl, DeleteArrangementButton, DeleteMediaButton, ManualParts, MediaUpload, MidiImport, RemoveAssignmentButton } from "@/components/repertoire/director-tools";
import { MediaRow, StemsPlayer } from "@/components/repertoire/media-list";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getActiveMembers } from "@/lib/data/people";
import { deleteRepertoire } from "@/app/actions/repertoire";
import { CATEGORY_LABELS, FORMATION_LABELS, LICENSE_LABELS, REPERTOIRE_STATUS_LABELS } from "@/lib/repertoire";
import { VOICE_LABELS } from "@/lib/pedagogy/classification";
import { noteName } from "@/lib/music/notes";

export const metadata: Metadata = { title: "Música" };

const ASSIGN = { designado: "designado", estudando: "estudando", pronto: "pronto" } as const;

export default async function MusicaPage({ params }: PageProps<"/repertorio/[id]">) {
  const { id } = await params;
  const user = await requireUser();
  const supabase = await createClient();
  const { data: r } = await supabase.from("repertoire").select("*").eq("id", id).maybeSingle();
  if (!r) notFound();
  const [{ data: arrangements }, { data: media }, members] = await Promise.all([
    supabase
      .from("arrangements")
      .select("id, slug, title, harmony_level, key_name, source, vocal_parts(id, name, sort, range_low_midi, range_high_midi, notes, arrangement_assignments(id, status, user_id, profiles!arrangement_assignments_user_id_fkey(full_name)))")
      .eq("repertoire_id", id)
      .order("created_at"),
    supabase.from("media_assets").select("id, title, kind, vocal_part_id, license_note").eq("repertoire_id", id).eq("bucket", "media").order("created_at"),
    user.isDirector ? getActiveMembers() : Promise.resolve([]),
  ]);
  const partName = new Map((arrangements ?? []).flatMap((a) => a.vocal_parts.map((p) => [p.id, `${p.name} (${a.title})`] as const)));
  const authorized = r.license_status !== "autorizacao_pendente";
  const stems = (media ?? []).filter((m) => m.kind === "audio" && m.vocal_part_id).map((m) => ({ id: m.id, title: m.title, partName: partName.get(m.vocal_part_id!) ?? "Voz" }));

  return (
    <>
      <nav aria-label="Trilha de navegação" className="mb-3 text-sm text-muted-foreground">
        <Link href="/repertorio" className="hover:underline">
          Repertório
        </Link>{" "}
        / {r.title}
      </nav>
      <PageHeader
        title={r.title}
        description={[r.composer, r.lyricist && r.lyricist !== r.composer ? `Letra: ${r.lyricist}` : null].filter(Boolean).join(" · ") || undefined}
        actions={
          user.isDirector ? (
            <>
              <Link href={`/repertorio/${id}/editar`} className={buttonVariants({ variant: "outline", size: "sm" })}>
                <Pencil /> Editar
              </Link>
              <form action={deleteRepertoire.bind(null, id)}>
                <Button type="submit" variant="ghost" size="sm" aria-label="Excluir música">
                  <Trash2 />
                </Button>
              </form>
            </>
          ) : undefined
        }
      />
      <div className="mb-6 flex flex-wrap gap-2">
        <Badge>{REPERTOIRE_STATUS_LABELS[r.status]}</Badge>
        <Badge variant="outline">{FORMATION_LABELS[r.formation]}</Badge>
        <Badge variant="outline">{r.voices_required} vozes</Badge>
        <Badge variant="outline">Dificuldade {r.difficulty}</Badge>
        {r.original_key && <Badge variant="outline">Tom original: {r.original_key}</Badge>}
        {r.group_key && <Badge variant="outline">Tom do grupo: {r.group_key}</Badge>}
        {r.tempo_bpm && <Badge variant="outline">{r.tempo_bpm} bpm</Badge>}
        {r.time_signature && <Badge variant="outline">{r.time_signature}</Badge>}
        {r.categories.map((c) => (
          <Badge key={c} variant="secondary">
            {CATEGORY_LABELS[c]}
          </Badge>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">Arranjos e distribuição de vozes</h2>
            {(arrangements ?? []).length === 0 && <p className="text-sm text-muted-foreground">Nenhum arranjo cadastrado.</p>}
            {(arrangements ?? []).map((a) => {
              const hasNotes = a.vocal_parts.some((p) => Array.isArray(p.notes) && (p.notes as unknown[]).length > 0);
              return (
                <div key={a.id} className="space-y-3 rounded-2xl border bg-card p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="flex-1 font-semibold">{a.title}</h3>
                    {a.key_name && <Badge variant="outline">{a.key_name}</Badge>}
                    {hasNotes && a.slug && (
                      <Link href={`/harmonia/${a.slug}`} className={buttonVariants({ size: "sm" })}>
                        <GitMerge /> Treinar por voz
                      </Link>
                    )}
                    {user.isDirector && a.source !== "plataforma" && <DeleteArrangementButton id={a.id} repertoireId={id} />}
                  </div>
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {[...a.vocal_parts].sort((x, y) => x.sort - y.sort).map((p) => (
                      <li key={p.id} className="space-y-2 rounded-xl bg-muted/40 p-3 text-sm">
                        <p className="font-medium">
                          {p.name}
                          {p.range_low_midi && p.range_high_midi && <span className="font-normal text-muted-foreground"> · {noteName(p.range_low_midi)}–{noteName(p.range_high_midi)}</span>}
                        </p>
                        <ul className="flex flex-wrap gap-1.5">
                          {p.arrangement_assignments.map((as) => (
                            <li key={as.id} className="flex items-center gap-1 rounded-full border bg-card px-2 py-0.5 text-xs">
                              {as.profiles?.full_name ?? "Integrante"} · {ASSIGN[as.status]}
                              {user.isDirector && <RemoveAssignmentButton id={as.id} repertoireId={id} />}
                            </li>
                          ))}
                          {p.arrangement_assignments.length === 0 && <li className="text-xs text-muted-foreground">Ninguém designado</li>}
                        </ul>
                        {user.isDirector && (
                          <AssignPartControl
                            partId={p.id}
                            repertoireId={id}
                            members={members
                              .filter((m) => !p.arrangement_assignments.some((x) => x.user_id === m.id))
                              .map((m) => ({ id: m.id, name: m.full_name, hint: m.classification ? VOICE_LABELS[m.classification.classification] : undefined }))}
                          />
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
            {user.isDirector && (
              <div className="grid gap-3 md:grid-cols-2">
                <MidiImport repertoireId={id} defaultFormation={r.formation} />
                <ManualParts repertoireId={id} voices={r.voices_required} />
              </div>
            )}
          </section>

          {stems.length > 0 && <StemsPlayer stems={stems} />}

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">Partituras e materiais</h2>
            {(media ?? []).length > 0 ? (
              <ul className="divide-y rounded-2xl border bg-card">
                {media!.map((m) => (
                  <MediaRow
                    key={m.id}
                    item={{ id: m.id, title: m.title, kind: m.kind, partName: m.vocal_part_id ? partName.get(m.vocal_part_id) ?? null : null, licenseNote: m.license_note }}
                    actions={user.isDirector ? <DeleteMediaButton id={m.id} repertoireId={id} /> : undefined}
                  />
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">Nenhum material anexado.</p>
            )}
            <p className="text-xs text-muted-foreground">Arquivos MusicXML ficam disponíveis para download; a renderização da partitura dentro da plataforma está prevista para uma próxima fase.</p>
            {user.isDirector && <MediaUpload repertoireId={id} authorized={authorized} parts={[...partName.entries()].map(([value, label]) => ({ id: value, label }))} />}
          </section>

          {(r.lyrics || r.chords) && (
            <section className="grid gap-4 md:grid-cols-2">
              {r.lyrics && (
                <div className="space-y-2 rounded-2xl border bg-card p-4">
                  <h2 className="font-semibold">Letra</h2>
                  <p className="whitespace-pre-line text-sm leading-relaxed">{r.lyrics}</p>
                </div>
              )}
              {r.chords && (
                <div className="space-y-2 rounded-2xl border bg-card p-4">
                  <h2 className="font-semibold">Cifras</h2>
                  <pre className="whitespace-pre-wrap font-mono text-sm">{r.chords}</pre>
                </div>
              )}
            </section>
          )}
        </div>
        <aside className="space-y-4">
          <section className="space-y-2 rounded-2xl border bg-card p-4 text-sm">
            <h2 className="font-semibold">Direitos autorais</h2>
            <Badge variant={authorized ? "secondary" : "destructive"}>{LICENSE_LABELS[r.license_status]}</Badge>
            {r.source && <p><span className="text-muted-foreground">Fonte:</span> {r.source}</p>}
            {r.copyright_info && <p className="text-muted-foreground">{r.copyright_info}</p>}
          </section>
          {r.director_notes && (
            <section className="space-y-2 rounded-2xl border bg-card p-4 text-sm">
              <h2 className="font-semibold">Observações do diretor</h2>
              <p className="whitespace-pre-line leading-relaxed">{r.director_notes}</p>
            </section>
          )}
        </aside>
      </div>
    </>
  );
}
