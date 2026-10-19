import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Lightbulb } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { HarmonyTrainer } from "@/components/harmony/harmony-trainer";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getArrangementBySlug } from "@/lib/data/harmony";

export async function generateMetadata({ params }: PageProps<"/harmonia/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const a = await getArrangementBySlug(slug);
  return { title: a ? `${a.repertoire?.title} — ${a.title}` : "Treinador de harmonia" };
}

export default async function HarmoniaTrainerPage({ params }: PageProps<"/harmonia/[slug]">) {
  const { slug } = await params;
  const user = await requireUser();
  const arrangement = await getArrangementBySlug(slug);
  if (!arrangement) notFound();
  const supabase = await createClient();
  const partIds = arrangement.vocal_parts.map((p) => p.id);
  const [{ data: bookmarks }, { data: assignment }, { data: cls }] = await Promise.all([
    supabase.from("practice_bookmarks").select("id, start_measure, end_measure, note").eq("user_id", user.id).eq("arrangement_id", arrangement.id).order("start_measure"),
    partIds.length
      ? supabase.from("arrangement_assignments").select("id, vocal_part_id, status").eq("user_id", user.id).in("vocal_part_id", partIds).maybeSingle()
      : Promise.resolve({ data: null }),
    supabase.from("vocal_classifications").select("classification").eq("user_id", user.id).eq("is_current", true).maybeSingle(),
  ]);
  const path = `/harmonia/${slug}`;
  return (
    <>
      <nav aria-label="Trilha de navegação" className="mb-3 text-sm text-muted-foreground">
        <Link href="/harmonia" className="hover:underline">
          Cantar em harmonia
        </Link>{" "}
        / {arrangement.repertoire?.title}
      </nav>
      <PageHeader
        eyebrow={arrangement.repertoire?.title ?? "Arranjo"}
        title={arrangement.title}
        description={arrangement.description}
      />
      {arrangement.study_tips && (
        <p className="mb-5 flex gap-3 rounded-xl bg-accent p-3 text-sm text-accent-foreground">
          <Lightbulb className="mt-0.5 size-4 shrink-0" /> {arrangement.study_tips}
        </p>
      )}
      <HarmonyTrainer
        arrangement={{
          id: arrangement.id,
          slug,
          title: arrangement.title,
          tempo: arrangement.tempo_bpm,
          beatsPerMeasure: arrangement.beats_per_measure,
          keyName: arrangement.key_name,
          voices: arrangement.vocal_parts.length,
        }}
        parts={arrangement.vocal_parts.map((p) => ({
          id: p.id,
          name: p.name,
          short: p.short_name,
          notes: p.notes,
          rangeLow: p.range_low_midi,
          rangeHigh: p.range_high_midi,
          suggested: !!cls?.classification && p.suggested_voices.includes(cls.classification),
        }))}
        bookmarks={bookmarks ?? []}
        assignment={assignment ? { id: assignment.id, partId: assignment.vocal_part_id, status: assignment.status } : null}
        path={path}
      />
      <p className="mt-8 text-xs text-muted-foreground">{arrangement.repertoire?.copyright_info}</p>
    </>
  );
}
