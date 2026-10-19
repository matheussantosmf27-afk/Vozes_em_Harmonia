import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Circle, CircleDot, Clock } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { Badge } from "@/components/ui/badge";
import { requireUser } from "@/lib/auth";
import { getLessonsIndex, getMyProgress, getPaths } from "@/lib/data/content";
import { LEVEL_LABEL } from "@/lib/format";

export async function generateMetadata({ params }: PageProps<"/aprender/[trilha]">): Promise<Metadata> {
  const { trilha } = await params;
  const path = (await getPaths()).find((p) => p.slug === trilha);
  return { title: path?.title ?? "Trilha" };
}

export default async function TrilhaPage({ params }: PageProps<"/aprender/[trilha]">) {
  const { trilha } = await params;
  const user = await requireUser();
  const [paths, lessons, progress] = await Promise.all([getPaths(), getLessonsIndex(), getMyProgress(user.id)]);
  const path = paths.find((p) => p.slug === trilha);
  if (!path) notFound();
  const own = lessons.filter((l) => l.path_id === path.id);
  return (
    <>
      <nav aria-label="Trilha de navegação" className="mb-3 text-sm text-muted-foreground">
        <Link href="/aprender" className="hover:underline">
          Aprender
        </Link>{" "}
        / Trilha {path.code}
      </nav>
      <PageHeader eyebrow={`Trilha ${path.code}`} title={path.title} description={path.description} />
      <ol className="space-y-3">
        {own.map((l, i) => {
          const p = progress.get(l.id);
          const Icon = p?.status === "concluida" ? CheckCircle2 : p ? CircleDot : Circle;
          return (
            <li key={l.id}>
              <Link href={`/aprender/${path.slug}/${l.slug}`} className="group flex items-start gap-4 rounded-2xl border bg-card p-4 hover:border-primary">
                <Icon className={p?.status === "concluida" ? "mt-1 size-5 text-success" : p ? "mt-1 size-5 text-primary" : "mt-1 size-5 text-muted-foreground"} aria-hidden />
                <div className="flex-1 space-y-1">
                  <p className="text-xs text-muted-foreground">Aula {i + 1}</p>
                  <h2 className="font-semibold group-hover:text-primary">{l.title}</h2>
                  <p className="text-sm text-muted-foreground">{l.summary}</p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <Badge variant="outline">{LEVEL_LABEL[l.level]}</Badge>
                    <Badge variant="outline">
                      <Clock /> {l.estimated_minutes} min
                    </Badge>
                    {p?.status === "concluida" && <Badge className="bg-success text-success-foreground">Concluída</Badge>}
                    {p && p.status !== "concluida" && <Badge variant="secondary">Em andamento</Badge>}
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ol>
    </>
  );
}
