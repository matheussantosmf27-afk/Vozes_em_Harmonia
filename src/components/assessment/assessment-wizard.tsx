"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Loader2, SkipForward } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ExerciseRunner, type RunnerExercise } from "@/components/exercises/exercise-runner";
import { RangeFinder, type RangeResult } from "@/components/voice/range-finder";
import { submitAssessment } from "@/app/actions/assessment";
import { TEST_LABELS, type Questionnaire, type TestKey } from "@/lib/pedagogy/plan";
import { noteName } from "@/lib/music/notes";
import { cn } from "@/lib/utils";

const TESTS: { key: TestKey; slug: string; intro: string }[] = [
  { key: "altura", slug: "diag-altura", intro: "Ouça duas notas e diga se a segunda é mais aguda ou mais grave." },
  { key: "reproducao", slug: "diag-reproducao", intro: "Ouça uma nota e cante-a. Com microfone, estimamos a altura; sem microfone, você se autoavalia." },
  { key: "memoria", slug: "diag-sequencia", intro: "Ouça pequenas sequências e reproduza-as no teclado." },
  { key: "intervalos", slug: "diag-intervalos", intro: "Identifique terça maior, quinta e oitava." },
  { key: "ritmo", slug: "diag-ritmo", intro: "Ouça um padrão rítmico e toque-o no botão." },
  { key: "sustentacao", slug: "diag-sustentacao", intro: "Sustente uma nota por 4 segundos, o mais estável possível." },
  { key: "entrada", slug: "diag-entrada", intro: "Depois da contagem, toque exatamente onde as notas começam — entradas após pausas e finalizações." },
  { key: "consonancia", slug: "diag-consonancia", intro: "Duas notas soam juntas: estável (consonante) ou tenso (dissonante)?" },
  { key: "independencia", slug: "diag-independencia", intro: "Sustente a sua nota enquanto outra melodia toca. Use fones de ouvido se for usar o microfone." },
];

const DEFAULT_Q: Questionnaire = {
  experiencia: "pouca",
  cantaEmGrupo: "as_vezes",
  formacoes: [],
  lePartitura: "nao",
  conheceCifras: "nao",
  tocaInstrumento: false,
  instrumento: "",
  aulasDeCanto: "nunca",
  dificuldades: [],
  facilidadeRegiao: "nao_sei",
  manterVozDiferente: "com_dificuldade",
  grupoVocal: "nao_informado",
  diasPorSemana: 3,
  minutosPorDia: 15,
};

type DiagResult = { score: number; correct: number; total: number; selfReported: boolean } | null;
const STORAGE = "vh-avaliacao-v1";

function Choice<T extends string>({ name, value, onChange, options }: { name: string; value: T; onChange: (v: T) => void; options: [T, string][] }) {
  return (
    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={name}>
      {options.map(([v, label]) => (
        <button
          key={v}
          type="button"
          role="radio"
          aria-checked={value === v}
          onClick={() => onChange(v)}
          className={cn("rounded-full border px-3 py-1.5 text-sm transition-colors", value === v ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:bg-muted")}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function Multi<T extends string>({ name, values, onChange, options }: { name: string; values: T[]; onChange: (v: T[]) => void; options: [T, string][] }) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label={name}>
      {options.map(([v, label]) => {
        const on = values.includes(v);
        return (
          <button
            key={v}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(on ? values.filter((x) => x !== v) : [...values, v])}
            className={cn("rounded-full border px-3 py-1.5 text-sm transition-colors", on ? "border-primary bg-primary/15 text-foreground" : "bg-card hover:bg-muted")}
          >
            {on && <Check className="-ml-1 mr-1 inline size-3.5" />}
            {label}
          </button>
        );
      })}
    </div>
  );
}

function Question({ label, help, children }: { label: string; help?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2 rounded-xl border bg-card p-4">
      <p className="font-medium">{label}</p>
      {help && <p className="text-sm text-muted-foreground">{help}</p>}
      {children}
    </div>
  );
}

export function AssessmentWizard({ kind, exercises }: { kind: "inicial" | "periodica"; exercises: RunnerExercise[] }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [q, setQ] = useState<Questionnaire>(DEFAULT_Q);
  const [results, setResults] = useState<Partial<Record<TestKey, DiagResult>>>({});
  const [range, setRange] = useState<RangeResult | null>(null);
  const [notes, setNotes] = useState("");
  const [pending, startTransition] = useTransition();
  const bySlug = useMemo(() => new Map(exercises.map((e) => [e.slug, e])), [exercises]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE) ?? "null");
      if (saved?.q) setQ({ ...DEFAULT_Q, ...saved.q });
      if (saved?.results) setResults(saved.results);
      if (saved?.range) setRange(saved.range);
    } catch {
      /* armazenamento indisponível: segue sem restaurar */
    }
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE, JSON.stringify({ q, results, range }));
    } catch {
      /* ignora */
    }
  }, [q, results, range]);

  const voiceRange: [number, number] =
    range ? [range.comfortableLow, range.comfortableHigh]
    : q.grupoVocal === "feminina" || q.facilidadeRegiao === "agudas" ? [57, 69]
    : q.grupoVocal === "masculina" || q.facilidadeRegiao === "graves" ? [45, 57]
    : [52, 64];

  const totalSteps = 1 + 1 + TESTS.length + 1 + 1; // intro, questionário, testes, região, revisão
  const set = <K extends keyof Questionnaire>(k: K, v: Questionnaire[K]) => setQ((prev) => ({ ...prev, [k]: v }));
  const next = () => setStep((s) => Math.min(totalSteps - 1, s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));

  function submit() {
    startTransition(async () => {
      const tests = Object.fromEntries(TESTS.map((t) => [t.key, results[t.key]?.score ?? null]));
      const res = await submitAssessment({
        kind,
        questionnaire: q,
        tests,
        range,
        diagnostics: TESTS.filter((t) => results[t.key]).map((t) => ({ slug: t.slug, ...results[t.key]! })),
        notes: notes || undefined,
      });
      if (!res.ok || !res.data) {
        toast.error(res.ok ? "Erro ao salvar." : res.error);
        return;
      }
      try {
        localStorage.removeItem(STORAGE);
      } catch {
        /* ignora */
      }
      toast.success("Avaliação concluída! Seu plano individual foi criado.");
      router.push(`/jornada/relatorio/${res.data.id}`);
    });
  }

  const testIndex = step - 2;
  const currentTest = testIndex >= 0 && testIndex < TESTS.length ? TESTS[testIndex] : null;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>
            Etapa {step + 1} de {totalSteps}
          </span>
          <span>{Math.round((step / (totalSteps - 1)) * 100)}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div className="h-full bg-primary transition-[width]" style={{ width: `${(step / (totalSteps - 1)) * 100}%` }} />
        </div>
      </div>

      {step === 0 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">{kind === "inicial" ? "Vamos conhecer a sua voz" : "Avaliação de evolução"}</h2>
          <p className="leading-relaxed">
            São um questionário rápido, nove testes curtos de percepção e voz e um mapeamento da sua região confortável. Leva de 20 a 30 minutos e você pode pular qualquer teste. Seu progresso fica salvo neste aparelho se precisar parar.
          </p>
          <ul className="list-disc space-y-1.5 pl-6 text-sm text-muted-foreground">
            <li>Não existe resposta “certa” no questionário: responda com sinceridade.</li>
            <li>O microfone é opcional. Quando usado, o áudio é analisado no seu aparelho e não é gravado.</li>
            <li>A classificação vocal gerada é provisória. Timbre, passagens de registro e a escuta do professor podem mudá-la.</li>
            <li>Esta avaliação não é um diagnóstico médico. Pare se sentir dor ou desconforto.</li>
          </ul>
          <Button size="lg" onClick={next}>
            Começar <ArrowRight />
          </Button>
        </section>
      )}

      {step === 1 && (
        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">Questionário</h2>
          <Question label="Qual é a sua experiência musical?">
            <Choice name="experiencia" value={q.experiencia} onChange={(v) => set("experiencia", v)} options={[["nenhuma", "Nenhuma"], ["pouca", "Pouca"], ["moderada", "Moderada"], ["muita", "Muita"]]} />
          </Question>
          <Question label="Você já canta em coral, quarteto ou grupo de louvor?">
            <Choice name="grupo" value={q.cantaEmGrupo} onChange={(v) => set("cantaEmGrupo", v)} options={[["nunca", "Nunca cantei em grupo"], ["as_vezes", "Às vezes"], ["regularmente", "Regularmente"]]} />
            <Multi name="formações" values={q.formacoes} onChange={(v) => set("formacoes", v)} options={[["coral", "Coral"], ["quarteto", "Quarteto"], ["louvor", "Equipe de louvor"], ["solo", "Solo"]]} />
          </Question>
          <Question label="Você sabe ler partituras?">
            <Choice name="partitura" value={q.lePartitura} onChange={(v) => set("lePartitura", v)} options={[["nao", "Não"], ["um_pouco", "Um pouco"], ["sim", "Sim"]]} />
          </Question>
          <Question label="Você conhece cifras?">
            <Choice name="cifras" value={q.conheceCifras} onChange={(v) => set("conheceCifras", v)} options={[["nao", "Não"], ["um_pouco", "Um pouco"], ["sim", "Sim"]]} />
          </Question>
          <Question label="Toca algum instrumento?">
            <Choice name="instrumento" value={q.tocaInstrumento ? "sim" : "nao"} onChange={(v) => set("tocaInstrumento", v === "sim")} options={[["nao", "Não"], ["sim", "Sim"]]} />
            {q.tocaInstrumento && <Input aria-label="Qual instrumento?" placeholder="Qual? (ex.: violão, teclado)" value={q.instrumento ?? ""} onChange={(e) => set("instrumento", e.target.value)} maxLength={80} />}
          </Question>
          <Question label="Já fez aulas de canto?">
            <Choice name="aulas" value={q.aulasDeCanto} onChange={(v) => set("aulasDeCanto", v)} options={[["nunca", "Nunca"], ["menos_1_ano", "Menos de 1 ano"], ["mais_1_ano", "Mais de 1 ano"]]} />
          </Question>
          <Question label="Quais dificuldades você percebe ao cantar?" help="Marque quantas quiser.">
            <Multi
              name="dificuldades"
              values={q.dificuldades}
              onChange={(v) => set("dificuldades", v)}
              options={[["afinacao", "Afinação"], ["respiracao", "Fôlego/respiração"], ["ritmo", "Ritmo"], ["agudos", "Notas agudas"], ["graves", "Notas graves"], ["manter_voz", "Manter minha voz no grupo"], ["leitura", "Leitura"], ["timidez", "Timidez/insegurança"], ["cansaco", "Cansaço vocal"]]}
            />
          </Question>
          <Question label="Você tem mais facilidade para cantar notas…">
            <Choice name="regiao" value={q.facilidadeRegiao} onChange={(v) => set("facilidadeRegiao", v)} options={[["graves", "Graves"], ["medias", "Médias"], ["agudas", "Agudas"], ["nao_sei", "Não sei"]]} />
          </Question>
          <Question label="Consegue manter uma voz diferente da melodia principal?">
            <Choice name="manter" value={q.manterVozDiferente} onChange={(v) => set("manterVozDiferente", v)} options={[["nao", "Ainda não"], ["com_dificuldade", "Com dificuldade"], ["sim", "Sim"]]} />
          </Question>
          <Question label="Em qual grupo de vozes você costuma cantar?" help="Usado apenas para sugerir uma categoria tradicional provisória. Você pode não informar.">
            <Choice name="grupoVocal" value={q.grupoVocal} onChange={(v) => set("grupoVocal", v)} options={[["feminina", "Vozes femininas"], ["masculina", "Vozes masculinas"], ["nao_informado", "Prefiro não informar"]]} />
          </Question>
          <Question label="Quanto tempo você pode estudar?">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="dias">Dias por semana: {q.diasPorSemana}</Label>
                <input id="dias" type="range" min={1} max={7} value={q.diasPorSemana} onChange={(e) => set("diasPorSemana", Number(e.target.value))} className="w-full accent-[var(--primary)]" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="min">Minutos por dia: {q.minutosPorDia}</Label>
                <input id="min" type="range" min={5} max={60} step={5} value={q.minutosPorDia} onChange={(e) => set("minutosPorDia", Number(e.target.value))} className="w-full accent-[var(--primary)]" />
              </div>
            </div>
          </Question>
        </section>
      )}

      {currentTest && (
        <section className="space-y-4">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gold">
              Teste {testIndex + 1} de {TESTS.length}
            </p>
            <h2 className="text-2xl font-semibold">{TEST_LABELS[currentTest.key]}</h2>
            <p className="text-muted-foreground">{currentTest.intro}</p>
          </div>
          {results[currentTest.key] ? (
            <div className="flex flex-wrap items-center gap-3 rounded-xl border bg-card p-4">
              <Check className="text-success" />
              <span>
                Teste concluído: {Math.round(results[currentTest.key]!.score * 100)}%{results[currentTest.key]!.selfReported ? " (autoavaliação)" : ""}
              </span>
              <Button variant="ghost" size="sm" onClick={() => setResults((r) => ({ ...r, [currentTest.key]: undefined }))}>
                Refazer
              </Button>
            </div>
          ) : bySlug.get(currentTest.slug) ? (
            <ExerciseRunner
              key={currentTest.slug}
              exercise={bySlug.get(currentTest.slug)!}
              voiceRange={voiceRange}
              persist={false}
              compact
              onComplete={(s) =>
                setResults((r) => ({
                  ...r,
                  [currentTest.key]: { score: s.score, correct: s.correct, total: s.total, selfReported: s.results.length > 0 && s.results.every((x) => x.detail?.selfReported) },
                }))
              }
            />
          ) : (
            <p className="text-sm text-destructive">Atividade de diagnóstico não encontrada. Verifique se o conteúdo inicial foi aplicado.</p>
          )}
          {results[currentTest.key] === null && <p className="text-sm text-muted-foreground">Teste pulado.</p>}
        </section>
      )}

      {step === 2 + TESTS.length && (
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Região confortável</h2>
          {range ? (
            <div className="flex flex-wrap items-center gap-3 rounded-xl border bg-card p-4">
              <Check className="text-success" />
              <span>
                Confortável: {noteName(range.comfortableLow)} a {noteName(range.comfortableHigh)} · observada: {noteName(range.low)} a {noteName(range.high)}
              </span>
              <Button variant="ghost" size="sm" onClick={() => setRange(null)}>
                Refazer
              </Button>
            </div>
          ) : (
            <RangeFinder persist={false} onResult={setRange} />
          )}
        </section>
      )}

      {step === totalSteps - 1 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Revisão</h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {TESTS.map((t) => (
              <li key={t.key} className="flex justify-between rounded-lg border bg-card px-3 py-2 text-sm">
                <span>{TEST_LABELS[t.key]}</span>
                <span className="font-medium">{results[t.key] ? `${Math.round(results[t.key]!.score * 100)}%` : "pulado"}</span>
              </li>
            ))}
            <li className="flex justify-between rounded-lg border bg-card px-3 py-2 text-sm sm:col-span-2">
              <span>Região confortável</span>
              <span className="font-medium">{range ? `${noteName(range.comfortableLow)} – ${noteName(range.comfortableHigh)}` : "não medida"}</span>
            </li>
          </ul>
          <div className="space-y-1.5">
            <Label htmlFor="obs">Algo mais que o professor deve saber? (opcional)</Label>
            <Textarea id="obs" value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={2000} placeholder="Ex.: fico rouco depois de cultos longos; canto na equipe de louvor há 2 anos." />
          </div>
          <Button size="lg" onClick={submit} disabled={pending}>
            {pending ? <Loader2 className="animate-spin" /> : <Check />} Concluir e gerar meu plano
          </Button>
        </section>
      )}

      {step > 0 && (
        <div className="flex flex-wrap justify-between gap-2 border-t pt-4">
          <Button variant="ghost" onClick={back}>
            <ArrowLeft /> Voltar
          </Button>
          {step < totalSteps - 1 && (
            <div className="flex gap-2">
              {currentTest && !results[currentTest.key] && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setResults((r) => ({ ...r, [currentTest.key]: null }));
                    next();
                  }}
                >
                  <SkipForward /> Pular teste
                </Button>
              )}
              {step === 2 + TESTS.length && !range && (
                <Button variant="outline" onClick={next}>
                  <SkipForward /> Pular
                </Button>
              )}
              <Button onClick={next} disabled={(!!currentTest && results[currentTest.key] === undefined) || (step === 2 + TESTS.length && !range)}>
                Continuar <ArrowRight />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
