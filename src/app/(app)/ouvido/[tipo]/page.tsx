import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Lightbulb } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { LabSession } from "@/components/exercises/lab-session";
import { requireUser } from "@/lib/auth";
import { getExerciseBySlug, getLessonsIndex, getVoiceRange } from "@/lib/data/content";
import { decide, getLabHistory } from "@/lib/data/lab";
import { LAB } from "@/content/lab";
import type { ExerciseType } from "@/lib/exercises/schemas";
import { formatRelative, pct } from "@/lib/format";

export async function generateMetadata({ params }: PageProps<"/ouvido/[tipo]">): Promise<Metadata> {
  const { tipo } = await params;
  return { title: LAB.find((l) => l.route === tipo)?.title ?? "Laboratório" };
}

const REASON_TEXT = {
  inicio: "Primeira vez nesta atividade: começamos pelo nível 1.",
  avancar: "Você acertou 85% ou mais nas duas últimas sessões deste nível. Hora de avançar!",
  manter: "Continue neste nível até acertar com consistência.",
  retomar: "As duas últimas sessões ficaram abaixo de 50%. Voltamos um nível e vale rever o conceito.",
};

export default async function LabPage({ params }: PageProps<"/ouvido/[tipo]">) {
  const { tipo } = await params;
  const meta = LAB.find((l) => l.route === tipo);
  if (!meta) notFound();
  const user = await requireUser();
  const [exercise, history, voiceRange, lessons] = await Promise.all([getExerciseBySlug(meta.slug), getLabHistory(user.id), getVoiceRange(user.id), getLessonsIndex()]);
  if (!exercise) notFound();
  const cfg = exercise.config as { levels?: unknown[]; conceptLesson?: string; conceptSummary?: string };
  const levels = cfg.levels?.length ?? 1;
  const h = history.get(exercise.id) ?? [];
  const d = decide(h, levels);
  const lesson = lessons.find((l) => l.slug === cfg.conceptLesson);
  const conceptHref = lesson ? `/aprender/${lesson.learning_paths?.slug}/${lesson.slug}` : undefined;
  return (
    <>
      <nav aria-label="Trilha de navegação" className="mb-3 text-sm text-muted-foreground">
        <Link href="/ouvido" className="hover:underline">
          Treinar ouvido
        </Link>{" "}
        / {meta.title}
      </nav>
      <PageHeader title={meta.title} description={meta.description} />
      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="space-y-4">
          <p className="rounded-xl bg-secondary/60 px-4 py-3 text-sm">{REASON_TEXT[d.reason]}</p>
          <LabSession
            exercise={{ id: exercise.id, slug: exercise.slug, title: exercise.title, instructions: exercise.instructions, type: exercise.type as ExerciseType, config: exercise.config, purpose: exercise.purpose }}
            recommended={d.level}
            levels={levels}
            concept={{ summary: cfg.conceptSummary, href: conceptHref }}
            voiceRange={voiceRange}
            revalidate={`/ouvido/${tipo}`}
          />
        </div>
        <aside className="space-y-4">
          {cfg.conceptSummary && (
            <div className="space-y-2 rounded-2xl border bg-card p-4">
              <p className="flex items-center gap-2 font-medium">
                <Lightbulb className="size-4 text-gold" /> Conceito
              </p>
              <p className="text-sm text-muted-foreground">{cfg.conceptSummary}</p>
              {conceptHref && (
                <Link href={conceptHref} className="text-sm font-medium text-primary underline-offset-4 hover:underline">
                  Abrir a aula: {lesson?.title}
                </Link>
              )}
            </div>
          )}
          <div className="space-y-2 rounded-2xl border bg-card p-4">
            <p className="font-medium">Histórico de acertos</p>
            {h.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhuma sessão ainda.</p>
            ) : (
              <ul className="space-y-1.5 text-sm">
                {h.slice(0, 10).map((s, i) => (
                  <li key={i} className="flex items-center justify-between gap-2">
                    <span className="text-muted-foreground">
                      Nível {s.level} · {formatRelative(s.createdAt)}
                    </span>
                    <span className="font-medium">{pct(s.score)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </div>
    </>
  );
}
