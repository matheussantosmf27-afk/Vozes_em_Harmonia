import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle, ArrowLeft, ArrowRight, CalendarCheck, CheckCircle2, ClipboardCheck, Clock, Dumbbell, Flag, HeartPulse, ListChecks, Repeat, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Blocks } from "@/components/lesson/blocks";
import { LessonStarter } from "@/components/lesson/lesson-starter";
import { LessonPlayer } from "@/components/lesson/lesson-player";
import { Checklist, FlipCards } from "@/components/lesson/interactive-blocks";
import { ExerciseRunner } from "@/components/exercises/exercise-runner";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getLessonsIndex, getVoiceRange } from "@/lib/data/content";
import type { LessonContent } from "@/content/types";
import type { ExerciseType } from "@/lib/exercises/schemas";
import { LEVEL_LABEL, pct } from "@/lib/format";
import { cn } from "@/lib/utils";

export async function generateMetadata({ params }: PageProps<"/aprender/[trilha]/[aula]">): Promise<Metadata> {
  const { aula } = await params;
  const lesson = (await getLessonsIndex()).find((l) => l.slug === aula);
  return { title: lesson?.title ?? "Aula" };
}

function Section({ icon: Icon, title, children, className }: { icon: React.ComponentType<{ className?: string }>; title: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("space-y-3", className)} aria-labelledby={title}>
      <h2 id={title} className="flex items-center gap-2 text-xl font-semibold">
        <Icon className="size-5 text-gold" aria-hidden /> {title}
      </h2>
      {children}
    </section>
  );
}

export default async function AulaPage({ params }: PageProps<"/aprender/[trilha]/[aula]">) {
  const { trilha, aula } = await params;
  const user = await requireUser();
  const supabase = await createClient();
  const { data: lesson } = await supabase.from("lessons").select("*, learning_paths(slug, code, title)").eq("slug", aula).maybeSingle();
  if (!lesson || lesson.learning_paths?.slug !== trilha) notFound();
  const content = lesson.content as unknown as LessonContent;

  const [{ data: exercises }, { data: progress }, { data: attempts }, voiceRange, index, { data: skillRows }] = await Promise.all([
    supabase.from("exercises").select("*").eq("lesson_id", lesson.id).eq("is_published", true).order("sort"),
    supabase.from("user_progress").select("*").eq("user_id", user.id).eq("lesson_id", lesson.id).maybeSingle(),
    supabase.from("exercise_attempts").select("exercise_id, score").eq("user_id", user.id),
    getVoiceRange(user.id),
    getLessonsIndex(),
    supabase.from("lesson_skills").select("skills(slug, name)").eq("lesson_id", lesson.id),
  ]);

  const best = new Map<string, number>();
  for (const a of attempts ?? []) best.set(a.exercise_id, Math.max(best.get(a.exercise_id) ?? 0, Number(a.score)));
  const own = index.filter((l) => l.path_id === lesson.path_id);
  const pos = own.findIndex((l) => l.id === lesson.id);
  const prev = own[pos - 1];
  const next = own[pos + 1];
  const assessments = (exercises ?? []).filter((e) => e.purpose === "avaliacao");
  const practices = (exercises ?? []).filter((e) => e.purpose !== "avaliacao");
  const pathHref = `/aprender/${trilha}`;
  const here = `${pathHref}/${aula}`;
  const threshold = Number(lesson.pass_threshold);

  return (
    <article className="space-y-10">
      <LessonStarter lessonId={lesson.id} path={here} started={!!progress} />
      <header className="space-y-4">
        <nav aria-label="Trilha de navegação" className="text-sm text-muted-foreground">
          <Link href="/aprender" className="hover:underline">
            Aprender
          </Link>{" "}
          /{" "}
          <Link href={pathHref} className="hover:underline">
            Trilha {lesson.learning_paths?.code}
          </Link>{" "}
          / Aula {pos + 1}
        </nav>
        <h1 className="text-3xl font-semibold sm:text-4xl">{lesson.title}</h1>
        <p className="max-w-3xl text-lg text-muted-foreground">{lesson.summary}</p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{LEVEL_LABEL[lesson.level]}</Badge>
          <Badge variant="outline">
            <Clock /> {lesson.estimated_minutes} min
          </Badge>
          {(skillRows ?? []).map((s) => s.skills && <Badge key={s.skills.slug} variant="secondary">{s.skills.name}</Badge>)}
          {progress?.status === "concluida" ? (
            <Badge className="bg-success text-success-foreground">
              <CheckCircle2 /> Aula concluída
            </Badge>
          ) : (
            <Badge variant="outline">Em andamento</Badge>
          )}
        </div>
      </header>

      {content.etapas?.length ? (
        <>
          <div className="space-y-3 rounded-2xl border-l-4 border-gold bg-card p-4 sm:p-5">
            {content.gancho && <p className="text-lg font-medium leading-relaxed">{content.gancho}</p>}
            <p className="flex gap-2 text-sm leading-relaxed text-muted-foreground">
              <Target className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden />
              <span>
                <strong className="text-foreground">Ao final desta aula:</strong> {content.objetivo}
              </span>
            </p>
          </div>
          <LessonPlayer
            lessonKey={lesson.slug}
            steps={content.etapas.map((e) => ({ titulo: e.titulo, tipo: e.tipo }))}
            panels={content.etapas.map((e, k) => (
              <Blocks key={k} blocks={e.blocos} />
            ))}
          />
        </>
      ) : (
        <>
      <Section icon={Target} title="Objetivo">
        <p className="rounded-xl border-l-4 border-gold bg-card p-4 leading-relaxed">{content.objetivo}</p>
      </Section>

      <Section icon={ListChecks} title="Explicação">
        <Blocks blocks={content.explicacao ?? []} />
      </Section>

      <Section icon={Repeat} title="Demonstração">
        <Blocks blocks={content.demonstracao ?? []} />
      </Section>

      <Section icon={ClipboardCheck} title="Exercício guiado">
        {content.exercicioGuiado?.intro && <p className="text-muted-foreground">{content.exercicioGuiado.intro}</p>}
        <ol className="space-y-2">
          {(content.exercicioGuiado?.passos ?? []).map((p, i) => (
            <li key={p} className="flex gap-3 rounded-xl border bg-card p-3">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">{i + 1}</span>
              <span className="leading-relaxed">{p}</span>
            </li>
          ))}
        </ol>
        {practices.length > 0 && (
          <div className="space-y-4 pt-2">
            {practices.map((e) => (
              <ExerciseRunner
                key={e.id}
                exercise={{ id: e.id, slug: e.slug, title: e.title, instructions: e.instructions, type: e.type as ExerciseType, config: e.config, purpose: e.purpose }}
                voiceRange={voiceRange}
                revalidate={here}
              />
            ))}
          </div>
        )}
      </Section>

        </>
      )}

      {content.etapas?.length && practices.length > 0 ? (
        <Section icon={Dumbbell} title="Hora de praticar" className="scroll-mt-24">
          <div id="praticar" className="scroll-mt-24 space-y-4">
            {practices.map((e) => (
              <ExerciseRunner
                key={e.id}
                exercise={{ id: e.id, slug: e.slug, title: e.title, instructions: e.instructions, type: e.type as ExerciseType, config: e.config, purpose: e.purpose }}
                voiceRange={voiceRange}
                revalidate={here}
              />
            ))}
          </div>
        </Section>
      ) : (
        content.etapas?.length ? <span id="praticar" /> : null
      )}

      <Section icon={AlertTriangle} title="Erros comuns">
        {content.etapas?.length ? (
          <FlipCards items={content.errosComuns} />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {content.errosComuns.map((e) => (
              <div key={e.erro} className="space-y-1 rounded-xl border bg-card p-4">
                <p className="font-medium">{e.erro}</p>
                <p className="text-sm text-muted-foreground">{e.correcao}</p>
              </div>
            ))}
          </div>
        )}
      </Section>

      <Section icon={content.etapas?.length ? CalendarCheck : Repeat} title={content.etapas?.length ? "Sua prática da semana" : "Para praticar sozinho(a)"}>
        {content.etapas?.length ? (
          <Checklist title={`${content.pratiqueSozinho.minutos} minutos · ${content.pratiqueSozinho.frequencia}`} items={content.pratiqueSozinho.passos} />
        ) : (
          <div className="rounded-xl border bg-card p-4">
            <p className="mb-2 text-sm text-muted-foreground">
              {content.pratiqueSozinho.minutos} minutos · {content.pratiqueSozinho.frequencia}
            </p>
            <ul className="list-disc space-y-1.5 pl-6">
              {content.pratiqueSozinho.passos.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
        )}
      </Section>

      <Section icon={HeartPulse} title="Segurança vocal">
        <ul className="space-y-2 rounded-xl border border-warning/40 bg-warning/5 p-4">
          {content.seguranca.map((s) => (
            <li key={s} className="flex gap-2 text-sm leading-relaxed">
              <HeartPulse className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden /> {s}
            </li>
          ))}
        </ul>
      </Section>

      <Section icon={Flag} title="Avaliação de aprendizagem">
        <p className="text-muted-foreground">
          Para concluir a aula, atinja pelo menos {Math.round(threshold * 100)}% em {assessments.length > 1 ? "cada uma das avaliações" : "a avaliação"}. Abrir a aula não a conclui.
        </p>
        <div className="space-y-4">
          {assessments.map((e) => (
            <div key={e.id} className="space-y-2">
              {best.has(e.id) && (
                <p className="text-sm text-muted-foreground">
                  Sua melhor nota: <strong className={best.get(e.id)! >= threshold ? "text-success" : ""}>{pct(best.get(e.id))}</strong>
                </p>
              )}
              <ExerciseRunner
                exercise={{ id: e.id, slug: e.slug, title: e.title, instructions: e.instructions, type: e.type as ExerciseType, config: e.config, purpose: e.purpose }}
                voiceRange={voiceRange}
                revalidate={here}
              />
            </div>
          ))}
        </div>
      </Section>

      <Section icon={CheckCircle2} title="Critério para avançar">
        <p className="rounded-xl bg-secondary/60 p-4 leading-relaxed">{content.criterioAvanco}</p>
      </Section>

      <nav className="flex flex-wrap justify-between gap-3 border-t pt-6" aria-label="Aulas vizinhas">
        {prev ? (
          <Link href={`${pathHref}/${prev.slug}`} className={buttonVariants({ variant: "outline" })}>
            <ArrowLeft /> {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`${pathHref}/${next.slug}`} className={buttonVariants()}>
            {next.title} <ArrowRight />
          </Link>
        ) : (
          <Link href="/aprender" className={buttonVariants()}>
            Voltar às trilhas
          </Link>
        )}
      </nav>
    </article>
  );
}
