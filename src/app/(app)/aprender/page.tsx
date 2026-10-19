import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Ear, GitMerge, Library, MicVocal, Piano, Users } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { Meter } from "@/components/common/page-header";
import { buttonVariants } from "@/components/ui/button";
import { requireUser } from "@/lib/auth";
import { getLessonsIndex, getMyProgress, getPaths } from "@/lib/data/content";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Aprender" };

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "mic-vocal": MicVocal,
  ear: Ear,
  users: Users,
  "git-merge": GitMerge,
  "book-open": BookOpen,
  library: Library,
};

export default async function AprenderPage() {
  const user = await requireUser();
  const supabase = await createClient();
  const [paths, lessons, progress, { data: extras }] = await Promise.all([
    getPaths(),
    getLessonsIndex(),
    getMyProgress(user.id),
    supabase.from("exercises").select("slug, title, instructions").not("created_by", "is", null).is("lesson_id", null).eq("is_published", true).order("created_at", { ascending: false }),
  ]);
  return (
    <>
      <PageHeader
        eyebrow="Escola de música"
        title="Aprender"
        description="Trilhas progressivas: cada aula tem explicação, demonstração, prática guiada, erros comuns, cuidados com a voz e uma avaliação com critério para avançar."
        actions={
          <Link href="/aprender/teclado" className={buttonVariants({ variant: "outline" })}>
            <Piano /> Teclado e teoria interativa
          </Link>
        }
      />
      <div className="grid gap-4 md:grid-cols-2">
        {paths.map((p) => {
          const own = lessons.filter((l) => l.path_id === p.id);
          const done = own.filter((l) => progress.get(l.id)?.status === "concluida").length;
          const Icon = ICONS[p.icon] ?? BookOpen;
          return (
            <Link key={p.id} href={`/aprender/${p.slug}`} className="group flex flex-col gap-4 rounded-2xl border bg-card p-5 transition-shadow hover:shadow-md focus-visible:shadow-md">
              <div className="flex items-start gap-4">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                  <Icon className="size-6" />
                </span>
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gold">Trilha {p.code}</p>
                  <h2 className="text-xl font-semibold group-hover:text-primary">{p.title}</h2>
                  <p className="text-sm text-muted-foreground">{p.subtitle}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{p.description}</p>
              <Meter value={own.length ? done / own.length : 0} label={`${done} de ${own.length} aulas concluídas`} className="mt-auto" />
            </Link>
          );
        })}
      </div>
      {extras && extras.length > 0 && (
        <section className="mt-10 space-y-3">
          <h2 className="text-xl font-semibold">Atividades extras dos professores</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {extras.map((e) => (
              <Link key={e.slug} href={`/aprender/atividade/${e.slug}`} className="rounded-2xl border bg-card p-4 hover:border-primary">
                <p className="font-medium">{e.title}</p>
                {e.instructions && <p className="text-sm text-muted-foreground">{e.instructions}</p>}
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
