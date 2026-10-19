import type { Metadata } from "next";
import { PageHeader } from "@/components/common/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FreeTuner } from "@/components/voice/free-tuner";
import { RangeFinder } from "@/components/voice/range-finder";
import { WarmupRoutine } from "@/components/voice/warmup-routine";
import { Metronome } from "@/components/voice/metronome";
import { Recorder } from "@/components/voice/recorder";
import { ExerciseRunner } from "@/components/exercises/exercise-runner";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getExerciseBySlug, getVoiceRange } from "@/lib/data/content";
import type { ExerciseType } from "@/lib/exercises/schemas";
import { formatRelative, pct } from "@/lib/format";
import { formatCents, noteName } from "@/lib/music/notes";

export const metadata: Metadata = { title: "Treinar minha voz" };

const TABS = ["afinador", "sustentar", "independencia", "extensao", "aquecimento", "metronomo", "gravador"] as const;

export default async function VozPage({ searchParams }: PageProps<"/voz">) {
  const sp = await searchParams;
  const tab = TABS.includes(sp.ferramenta as (typeof TABS)[number]) ? (sp.ferramenta as string) : "afinador";
  const user = await requireUser();
  const supabase = await createClient();
  const [voiceRange, sustain, independence, { data: recordings }, { data: ranges }] = await Promise.all([
    getVoiceRange(user.id),
    getExerciseBySlug("treino-afinacao-livre"),
    getExerciseBySlug("treino-independencia"),
    supabase.from("media_assets").select("id, title, created_at, size_bytes").eq("owner_id", user.id).eq("bucket", "recordings").order("created_at", { ascending: false }),
    supabase.from("vocal_ranges").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(5),
  ]);
  const ids = [sustain?.id, independence?.id].filter(Boolean) as string[];
  const { data: history } = ids.length
    ? await supabase.from("exercise_attempts").select("id, exercise_id, score, details, created_at").eq("user_id", user.id).in("exercise_id", ids).order("created_at", { ascending: false }).limit(20)
    : { data: [] };
  const toRunner = (e: NonNullable<typeof sustain>, rounds: number) => ({ id: e.id, slug: e.slug, title: e.title, instructions: e.instructions, type: e.type as ExerciseType, config: { ...(e.config as object), rounds }, purpose: e.purpose });

  return (
    <>
      <PageHeader
        eyebrow="Treino vocal"
        title="Treinar minha voz"
        description="Ferramentas com microfone (somente com sua autorização) para afinação, sustentação e região confortável, além de aquecimento guiado, metrônomo e gravador privado."
      />
      <Tabs defaultValue={tab} className="space-y-5">
        <TabsList className="flex h-auto flex-wrap justify-start">
          <TabsTrigger value="afinador">Afinador</TabsTrigger>
          <TabsTrigger value="sustentar">Nota sustentada</TabsTrigger>
          <TabsTrigger value="independencia">Manter minha nota</TabsTrigger>
          <TabsTrigger value="extensao">Região confortável</TabsTrigger>
          <TabsTrigger value="aquecimento">Aquecimento</TabsTrigger>
          <TabsTrigger value="metronomo">Metrônomo</TabsTrigger>
          <TabsTrigger value="gravador">Gravador</TabsTrigger>
        </TabsList>
        <TabsContent value="afinador">
          <FreeTuner voiceRange={voiceRange} />
        </TabsContent>
        <TabsContent value="sustentar" className="space-y-4">
          <p className="text-muted-foreground">Ouça a referência, cante e sustente. O resultado mostra a nota esperada, a detectada, a diferença em cents e a estabilidade. Uma tentativa isolada não define a sua afinação: observe a evolução.</p>
          {sustain && <ExerciseRunner exercise={toRunner(sustain, 3)} voiceRange={voiceRange} revalidate="/voz" />}
        </TabsContent>
        <TabsContent value="independencia" className="space-y-4">
          <p className="text-muted-foreground">Sustente a sua nota enquanto outra melodia toca — o primeiro passo para não ser “arrastado” pela melodia principal. Use fones de ouvido.</p>
          {independence && <ExerciseRunner exercise={toRunner(independence, 3)} voiceRange={voiceRange} revalidate="/voz" />}
        </TabsContent>
        <TabsContent value="extensao" className="space-y-4">
          <RangeFinder />
          {ranges && ranges.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-medium">Registros anteriores</h3>
              <ul className="space-y-1 text-sm">
                {ranges.map((r) => (
                  <li key={r.id} className="flex flex-wrap justify-between gap-2 rounded-lg border bg-card px-3 py-2">
                    <span>
                      Confortável: {r.comfortable_low_midi ? noteName(r.comfortable_low_midi) : "—"} a {r.comfortable_high_midi ? noteName(r.comfortable_high_midi) : "—"} · Observada: {noteName(r.low_midi)} a {noteName(r.high_midi)}
                    </span>
                    <span className="text-muted-foreground">
                      {r.source === "professor" ? "Professor" : r.confidence === "confiavel" ? "Microfone (confiável)" : "Estimativa incerta"} · {formatRelative(r.created_at)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </TabsContent>
        <TabsContent value="aquecimento">
          <WarmupRoutine low={(voiceRange?.[0] ?? 60) < 50} />
        </TabsContent>
        <TabsContent value="metronomo">
          <div className="max-w-md">
            <Metronome />
          </div>
        </TabsContent>
        <TabsContent value="gravador">
          <Recorder userId={user.id} saved={recordings ?? []} />
        </TabsContent>
      </Tabs>
      {history && history.length > 0 && (
        <section className="mt-10 space-y-3">
          <h2 className="text-xl font-semibold">Histórico de tentativas salvas</h2>
          <ul className="divide-y rounded-2xl border bg-card">
            {history.map((h) => {
              const rounds = ((h.details as { rounds?: { meanCents?: number; targetMidi?: number; stable?: boolean; selfReported?: boolean }[] })?.rounds ?? []).filter((r) => r.targetMidi);
              return (
                <li key={h.id} className="flex flex-wrap items-center justify-between gap-2 p-3 text-sm">
                  <span>
                    {h.exercise_id === independence?.id ? "Manter minha nota" : "Nota sustentada"} · {rounds.map((r) => `${noteName(r.targetMidi!)}${r.meanCents != null ? ` (${formatCents(r.meanCents)}¢${r.stable ? ", estável" : ""})` : r.selfReported ? " (autoavaliação)" : ""}`).join(", ")}
                  </span>
                  <span className="text-muted-foreground">
                    {pct(Number(h.score))} · {formatRelative(h.created_at)}
                  </span>
                </li>
              );
            })}
          </ul>
          <p className="text-xs text-muted-foreground">Para excluir registros, vá em “Meu progresso”.</p>
        </section>
      )}
    </>
  );
}
