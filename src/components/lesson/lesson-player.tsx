"use client";

import { createContext, useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, CheckCircle2, Ear, Eye, Hand, Lightbulb, ListOrdered, PartyPopper, Puzzle, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { EtapaTipo } from "@/content/types";
import { cn } from "@/lib/utils";

/** Diz aos blocos se a etapa deles está visível (ex.: desligar o microfone ao sair dela). */
export const StepActiveContext = createContext(true);

const TIPO: Record<EtapaTipo, { label: string; icon: React.ComponentType<{ className?: string }>; cls: string }> = {
  descobrir: { label: "Descobrir", icon: Lightbulb, cls: "bg-primary/10 text-primary" },
  ouvir: { label: "Ouvir", icon: Ear, cls: "bg-gold/20 text-gold" },
  experimentar: { label: "Experimentar", icon: Hand, cls: "bg-success/15 text-success" },
  checar: { label: "Checar", icon: Puzzle, cls: "bg-primary/10 text-primary" },
  aplicar: { label: "Aplicar", icon: Rocket, cls: "bg-gold/20 text-gold" },
};

/**
 * Aula interativa em etapas: uma ideia por tela, com barra de progresso.
 * As etapas já vêm renderizadas pelo servidor; aqui só controlamos qual
 * aparece (as outras ficam ocultas e mantêm o estado dos exercícios).
 */
export function LessonPlayer({ lessonKey, steps, panels }: { lessonKey: string; steps: { titulo: string; tipo: EtapaTipo }[]; panels: React.ReactNode[] }) {
  const total = steps.length;
  const [i, setI] = useState(0);
  const [all, setAll] = useState(false);
  const [finished, setFinished] = useState(false);
  const top = useRef<HTMLDivElement>(null);
  const storeKey = `vh:aula:${lessonKey}`;

  useEffect(() => {
    try {
      const saved = Number(localStorage.getItem(storeKey));
      // eslint-disable-next-line react-hooks/set-state-in-effect -- retoma a etapa salva no aparelho após a hidratação
      if (saved > 0 && saved < total) setI(saved);
    } catch {
      /* armazenamento indisponível */
    }
  }, [storeKey, total]);

  function go(n: number) {
    const next = Math.max(0, Math.min(total - 1, n));
    setI(next);
    try {
      localStorage.setItem(storeKey, String(next));
    } catch {
      /* armazenamento indisponível */
    }
    top.current?.scrollIntoView?.({ behavior: "smooth", block: "start" });
  }

  function finish() {
    setFinished(true);
    try {
      localStorage.setItem(storeKey, "0");
    } catch {
      /* armazenamento indisponível */
    }
    top.current?.scrollIntoView?.({ behavior: "smooth", block: "start" });
  }

  const step = steps[i];
  const T = TIPO[step.tipo] ?? TIPO.descobrir;

  return (
    <section ref={top} aria-label="Aula interativa" className="scroll-mt-24 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <ListOrdered className="size-4" aria-hidden /> {all ? `${total} etapas` : finished ? "Aula concluída" : `Etapa ${i + 1} de ${total}`}
        </p>
        <Button variant="ghost" size="sm" onClick={() => setAll(!all)}>
          <Eye /> {all ? "Ver uma etapa por vez" : "Ver a aula inteira"}
        </Button>
      </div>

      {!all && (
        <div className="flex gap-1.5" aria-hidden>
          {steps.map((s, k) => (
            <button
              key={k}
              type="button"
              tabIndex={-1}
              onClick={() => {
                setFinished(false);
                go(k);
              }}
              title={s.titulo}
              className={cn("h-2 flex-1 rounded-full transition-colors", finished || k < i ? "bg-success" : k === i ? "bg-primary" : "bg-muted")}
            />
          ))}
        </div>
      )}

      {finished && !all ? (
        <div className="space-y-4 rounded-3xl border bg-gradient-to-br from-success/10 via-card to-gold/10 p-6 text-center sm:p-8">
          <PartyPopper className="mx-auto size-10 text-gold" aria-hidden />
          <h2 className="text-2xl font-semibold">Você percorreu a aula!</h2>
          <p className="mx-auto max-w-md text-muted-foreground">Agora é hora de colocar a voz para trabalhar: faça a prática logo abaixo e, quando se sentir pronto(a), a avaliação.</p>
          <div className="flex flex-wrap justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setFinished(false);
                go(0);
              }}
            >
              <ArrowLeft /> Rever desde o início
            </Button>
            <Button onClick={() => document.getElementById("praticar")?.scrollIntoView?.({ behavior: "smooth" })}>
              Ir para a prática <ArrowDown />
            </Button>
          </div>
        </div>
      ) : (
        steps.map((s, k) => {
          const Tk = TIPO[s.tipo] ?? TIPO.descobrir;
          const visible = all || k === i;
          return (
            <div key={k} hidden={!visible} className={cn("space-y-4", all && "border-b pb-8 last:border-0")}>
              <div className="space-y-2">
                <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold", Tk.cls)}>
                  <Tk.icon className="size-3.5" aria-hidden /> {Tk.label}
                </span>
                <h2 className="text-2xl font-semibold leading-tight">{s.titulo}</h2>
              </div>
              <StepActiveContext.Provider value={visible && !finished}>{panels[k]}</StepActiveContext.Provider>
            </div>
          );
        })
      )}

      {!all && !finished && (
        <nav className="sticky bottom-[calc(5rem+env(safe-area-inset-bottom))] z-10 lg:bottom-3 flex items-center justify-between gap-2 rounded-2xl border bg-background/95 p-2 shadow-lg backdrop-blur" aria-label="Navegar pelas etapas">
          <Button variant="ghost" onClick={() => go(i - 1)} disabled={i === 0}>
            <ArrowLeft /> Voltar
          </Button>
          <span className={cn("hidden items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold sm:inline-flex", T.cls)}>
            <T.icon className="size-3.5" aria-hidden /> {i + 1}/{total}
          </span>
          {i < total - 1 ? (
            <Button onClick={() => go(i + 1)}>
              Continuar <ArrowRight />
            </Button>
          ) : (
            <Button onClick={finish} className="bg-success text-success-foreground hover:bg-success/90">
              <CheckCircle2 /> Concluir etapas
            </Button>
          )}
        </nav>
      )}
    </section>
  );
}
