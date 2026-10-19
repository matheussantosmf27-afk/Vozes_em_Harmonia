"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Circle, PauseCircle } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { updateGoalStatus } from "@/app/actions/goals";
import { formatDate } from "@/lib/format";
import { masteryLabel } from "@/lib/pedagogy/mastery";

export interface GoalItem {
  id: string;
  title: string;
  description: string;
  horizon_weeks: number;
  status: "ativa" | "concluida" | "pausada" | "cancelada";
  due_on: string | null;
  target_level: number | null;
  skill_slug: string | null;
  skillName?: string;
  currentLevel?: number;
  byTeacher?: boolean;
}

export function GoalList({ goals, editable = true }: { goals: GoalItem[]; editable?: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const groups = [4, 8, 12, 1].map((h) => ({ h, items: goals.filter((g) => g.horizon_weeks === h && g.status !== "cancelada") })).filter((g) => g.items.length);
  if (!groups.length) return <p className="text-sm text-muted-foreground">Nenhuma meta ativa.</p>;
  return (
    <div className="space-y-4">
      {groups.map(({ h, items }) => (
        <div key={h} className="space-y-2">
          <p className="text-sm font-semibold text-muted-foreground">{h === 1 ? "Esta semana" : `${h} semanas`}</p>
          <ul className="space-y-2">
            {items.map((g) => {
              const reached = g.target_level && g.currentLevel ? g.currentLevel >= g.target_level : false;
              return (
                <li key={g.id} className="flex flex-wrap items-start gap-3 rounded-xl border bg-card p-3">
                  {g.status === "concluida" || reached ? <CheckCircle2 className="mt-0.5 size-5 text-success" /> : g.status === "pausada" ? <PauseCircle className="mt-0.5 size-5 text-muted-foreground" /> : <Circle className="mt-0.5 size-5 text-muted-foreground" />}
                  <div className="min-w-0 flex-1 space-y-1">
                    <p className="font-medium">{g.title}</p>
                    {g.description && <p className="text-sm text-muted-foreground">{g.description}</p>}
                    <div className="flex flex-wrap gap-2 text-xs">
                      {g.due_on && <Badge variant="outline">até {formatDate(g.due_on)}</Badge>}
                      {g.skillName && g.target_level && (
                        <Badge variant="secondary">
                          {g.skillName}: {masteryLabel(g.currentLevel ?? 1)} → {masteryLabel(g.target_level)}
                        </Badge>
                      )}
                      {g.byTeacher && <Badge variant="outline">definida pelo professor</Badge>}
                    </div>
                  </div>
                  {editable && g.status !== "concluida" && (
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={pending}
                        onClick={() =>
                          startTransition(async () => {
                            const r = await updateGoalStatus(g.id, "concluida");
                            if (r.ok) {
                              toast.success("Meta concluída!");
                              router.refresh();
                            } else toast.error(r.error);
                          })
                        }
                      >
                        Concluir
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={pending}
                        onClick={() =>
                          startTransition(async () => {
                            await updateGoalStatus(g.id, g.status === "pausada" ? "ativa" : "pausada");
                            router.refresh();
                          })
                        }
                      >
                        {g.status === "pausada" ? "Retomar" : "Pausar"}
                      </Button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
      <p className="text-xs text-muted-foreground">Prazos são referências de planejamento, não promessas de resultado. Ajuste com o professor quando precisar.</p>
    </div>
  );
}
