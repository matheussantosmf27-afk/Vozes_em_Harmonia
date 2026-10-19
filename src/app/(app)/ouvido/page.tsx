import type { Metadata } from "next";
import Link from "next/link";
import * as Icons from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { Badge } from "@/components/ui/badge";
import { requireUser } from "@/lib/auth";
import { getLabExercises } from "@/lib/data/content";
import { decide, getLabHistory } from "@/lib/data/lab";
import { LAB } from "@/content/lab";
import { pct } from "@/lib/format";

export const metadata: Metadata = { title: "Treinar ouvido" };

const REASON: Record<string, string> = { inicio: "Comece pelo nível 1", avancar: "Pronto(a) para avançar", manter: "Continue neste nível", retomar: "Vamos retomar o conceito" };

export default async function OuvidoPage() {
  const user = await requireUser();
  const [exercises, history] = await Promise.all([getLabExercises(), getLabHistory(user.id)]);
  const routeBySlug = new Map(LAB.map((l) => [l.slug, l]));
  return (
    <>
      <PageHeader
        eyebrow="Laboratório de percepção auditiva"
        title="Treinar ouvido"
        description="Aprenda a reconhecer os sons antes de reproduzi-los. A dificuldade se adapta ao seu histórico: avança quando você acerta com consistência e retoma o conceito quando os erros se repetem."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {exercises.map((e) => {
          const meta = routeBySlug.get(e.slug);
          if (!meta) return null;
          const levels = (e.config as { levels?: unknown[] }).levels?.length ?? 1;
          const h = history.get(e.id);
          const d = decide(h, levels);
          const Icon = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[toPascal(meta.icon)] ?? Icons.Ear;
          return (
            <Link key={e.id} href={`/ouvido/${meta.route}`} className="group flex flex-col gap-3 rounded-2xl border bg-card p-5 hover:border-primary">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-secondary text-primary">
                  <Icon className="size-5" />
                </span>
                <h2 className="font-semibold group-hover:text-primary">{e.title}</h2>
              </div>
              <p className="text-sm text-muted-foreground">{meta.description}</p>
              <div className="mt-auto flex flex-wrap items-center gap-2 text-xs">
                <Badge variant="outline">Nível {d.level}/{levels}</Badge>
                <Badge variant={d.reason === "retomar" ? "destructive" : d.reason === "avancar" ? "default" : "secondary"}>{REASON[d.reason]}</Badge>
                {h?.length ? <span className="text-muted-foreground">Último: {pct(h[0].score)} · {h.length} sessões</span> : null}
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}

function toPascal(s: string) {
  return s
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join("");
}
