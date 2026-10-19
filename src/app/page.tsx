import Link from "next/link";
import { redirect } from "next/navigation";
import { Ear, GitMerge, GraduationCap, Mic, ShieldCheck, Users } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { buttonVariants } from "@/components/ui/button";
import { isSupabaseConfigured } from "@/lib/env";
import { getSessionUser } from "@/lib/auth";
import { cn } from "@/lib/utils";

const FEATURES = [
  { icon: Mic, title: "Avaliação vocal", text: "Questionário, testes de percepção e, com o seu microfone, estimativa da região confortável. Classificação sempre provisória." },
  { icon: GraduationCap, title: "Trilhas de estudo", text: "38 aulas de técnica vocal, percepção, canto em conjunto, harmonia, leitura e teoria — com prática guiada e critérios de avanço." },
  { icon: Ear, title: "Laboratório de percepção", text: "Intervalos, acordes, progressões, ritmo e afinação, com dificuldade adaptativa e feedback imediato." },
  { icon: GitMerge, title: "Cantar em harmonia", text: "Treinador por voz: ouça só a sua parte, a sua destacada ou todas juntas, com andamento, tom e trechos." },
  { icon: Users, title: "Ensaios e repertório", text: "Planejamento de ensaios, presença, tarefas, repertório com direitos registrados e distribuição de vozes." },
  { icon: ShieldCheck, title: "Cuidado e privacidade", text: "Sem ranking de vozes. Gravações só quando você quiser, visíveis apenas para você. Em conformidade com a LGPD." },
];

export default async function Home() {
  if (isSupabaseConfigured() && (await getSessionUser())) redirect("/inicio");
  return (
    <div className="min-h-dvh">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <Logo />
        <nav className="flex items-center gap-2">
          <Link href="/entrar" className={buttonVariants({ variant: "ghost" })}>
            Entrar
          </Link>
          <Link href="/cadastro" className={cn(buttonVariants(), "hidden sm:inline-flex")}>
            Criar conta
          </Link>
        </nav>
      </header>
      <main id="conteudo">
        <section className="relative overflow-hidden">
          <div className="staff-lines absolute inset-x-0 top-24 h-[50px] opacity-70" aria-hidden />
          <div className="mx-auto grid max-w-6xl gap-10 px-4 pb-16 pt-10 sm:px-6 lg:grid-cols-[1.2fr_1fr] lg:pt-20">
            <div className="relative space-y-6">
              <p className="inline-flex rounded-full bg-accent px-3 py-1 text-sm font-medium text-accent-foreground">
                Escola de música digital do ministério
              </p>
              <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
                Cada voz se desenvolve para servir melhor na harmonia do conjunto.
              </h1>
              <p className="max-w-xl text-lg text-muted-foreground">
                Formação vocal, percepção musical e canto em vozes para integrantes de corais, quartetos e equipes de louvor —
                do primeiro contato com a música até arranjos a quatro vozes.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/cadastro" className={buttonVariants({ size: "lg" })}>
                  Começar minha jornada
                </Link>
                <Link href="/entrar" className={buttonVariants({ size: "lg", variant: "outline" })}>
                  Já tenho conta
                </Link>
              </div>
            </div>
            <div className="relative rounded-3xl border bg-card p-6 shadow-sm">
              <p className="text-sm font-medium text-muted-foreground">Como funciona</p>
              <ol className="mt-4 space-y-4">
                {[
                  ["Avaliação inicial", "Conhecemos sua experiência, sua escuta e sua região vocal confortável."],
                  ["Plano individual", "Metas de 4, 8 e 12 semanas e exercícios diários sob medida."],
                  ["Prática com feedback", "Aulas, laboratório auditivo, treinador de afinação e de harmonia."],
                  ["Acompanhamento", "Professores e diretor orientam, ajustam o plano e preparam os ensaios."],
                ].map(([title, text], i) => (
                  <li key={title} className="flex gap-4">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary font-heading text-primary-foreground">
                      {i + 1}
                    </span>
                    <span>
                      <span className="block font-medium">{title}</span>
                      <span className="text-sm text-muted-foreground">{text}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>
        <section className="border-t bg-card/60">
          <div className="mx-auto grid max-w-6xl gap-6 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <div key={title} className="space-y-2">
                <Icon className="size-6 text-primary" aria-hidden />
                <h2 className="text-lg font-semibold">{title}</h2>
                <p className="text-sm text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <footer className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-8 text-sm text-muted-foreground sm:px-6">
        <span>Vozes em Harmonia — não é uma ferramenta médica e não faz diagnósticos vocais.</span>
        <Link href="/privacidade" className="underline-offset-4 hover:underline">
          Privacidade e LGPD
        </Link>
      </footer>
    </div>
  );
}
