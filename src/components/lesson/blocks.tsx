import Link from "next/link";
import { AlertTriangle, ArrowRight, Ear, Eye, GitMerge, Hand, HeartPulse, HelpCircle, Lightbulb, Music, Star, Wrench } from "lucide-react";
import type { Block, CalloutIcon } from "@/content/types";
import { Staff } from "@/components/music/staff";
import { parseNote } from "@/lib/music/notes";
import { AudioDemo, ChordsDemo, IntervalsDemo, KeyboardDemo, RhythmDemo, ScalesDemo } from "./demo-widgets";
import { Illustration } from "./illustrations";
import { Breathing, CheckQuestion, Checklist, Compare, Match, Order, Reveal, SingAlong, TimerBlock, TrueFalse } from "./interactive-blocks";

const CALLOUT_ICON: Record<CalloutIcon, React.ComponentType<{ className?: string }>> = {
  ideia: Lightbulb,
  ouvido: Ear,
  coracao: HeartPulse,
  musica: Music,
  olho: Eye,
  maos: Hand,
  estrela: Star,
  pergunta: HelpCircle,
};

const TOOL_HREF = {
  afinador: "/voz?ferramenta=afinador",
  extensao: "/voz?ferramenta=extensao",
  aquecimento: "/voz?ferramenta=aquecimento",
  teclado: "/aprender/teclado",
  metronomo: "/voz?ferramenta=metronomo",
  gravador: "/voz?ferramenta=gravador",
} as const;

export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-4">
      {blocks.map((b, i) => (
        <BlockView key={i} block={b} />
      ))}
    </div>
  );
}

function BlockView({ block: b }: { block: Block }) {
  switch (b.type) {
    case "p":
      return <p className="text-[1.05rem] leading-relaxed">{b.text}</p>;
    case "list": {
      const Tag = b.ordered ? "ol" : "ul";
      return (
        <Tag className={b.ordered ? "list-decimal space-y-1.5 pl-6" : "list-disc space-y-1.5 pl-6"}>
          {b.items.map((it) => (
            <li key={it} className="leading-relaxed">
              {it}
            </li>
          ))}
        </Tag>
      );
    }
    case "tip":
      return (
        <div className="flex gap-3 rounded-xl bg-accent p-4 text-accent-foreground">
          <Lightbulb className="mt-0.5 size-5 shrink-0" aria-hidden />
          <div>
            {b.title && <p className="font-semibold">{b.title}</p>}
            <p className="leading-relaxed">{b.text}</p>
          </div>
        </div>
      );
    case "warning":
      return (
        <div className="flex gap-3 rounded-xl border border-warning/50 bg-warning/10 p-4">
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-warning" aria-hidden />
          <p className="leading-relaxed">{b.text}</p>
        </div>
      );
    case "audio":
      return <AudioDemo label={b.label} notes={b.notes} mode={b.mode} tempo={b.tempo} />;
    case "keyboard":
      return <KeyboardDemo from={b.from} to={b.to} highlight={b.highlight} label={b.label} />;
    case "staff":
      return <Staff clef={b.clef} notes={b.notes.map((n) => parseNote(n) ?? 60)} label={b.label} />;
    case "intervals":
      return <IntervalsDemo root={b.root} semitones={b.semitones} />;
    case "chords":
      return <ChordsDemo root={b.root} qualities={b.qualities} />;
    case "scales":
      return <ScalesDemo tonic={b.tonic} kinds={b.kinds} />;
    case "rhythm":
      return <RhythmDemo pattern={b.pattern} bpm={b.bpm} label={b.label} />;
    case "harmonyLink":
      return (
        <Link href={`/harmonia/${b.arrangement}`} className="group flex items-center gap-3 rounded-xl border bg-card p-3 hover:border-primary">
          <GitMerge className="size-5 text-primary" aria-hidden />
          <span className="flex-1 text-sm font-medium">{b.label}</span>
          <ArrowRight className="size-4 text-muted-foreground group-hover:text-primary" aria-hidden />
        </Link>
      );
    case "toolLink":
      return (
        <Link href={TOOL_HREF[b.tool]} className="group flex items-center gap-3 rounded-xl border bg-card p-3 hover:border-primary">
          <Wrench className="size-5 text-primary" aria-hidden />
          <span className="flex-1 text-sm font-medium">{b.label}</span>
          <ArrowRight className="size-4 text-muted-foreground group-hover:text-primary" aria-hidden />
        </Link>
      );
    case "illustration":
      return <Illustration name={b.name} caption={b.caption} />;
    case "callout": {
      const Icon = CALLOUT_ICON[b.icon] ?? Lightbulb;
      return (
        <div className="flex gap-4 rounded-2xl bg-gradient-to-br from-gold/15 to-primary/5 p-4 sm:p-5">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-card shadow-sm">
            <Icon className="size-5 text-gold" aria-hidden />
          </span>
          <div className="space-y-1">
            <p className="font-semibold">{b.title}</p>
            <p className="leading-relaxed">{b.text}</p>
          </div>
        </div>
      );
    }
    case "check":
      return <CheckQuestion question={b.question} options={b.options} answer={b.answer} explain={b.explain} audio={b.audio} staff={b.staff} illustration={b.illustration} />;
    case "trueFalse":
      return <TrueFalse items={b.items} />;
    case "compare":
      return <Compare prompt={b.prompt} options={b.options} answer={b.answer} explain={b.explain} />;
    case "breathing":
      return <Breathing inhale={b.inhale} hold={b.hold} exhale={b.exhale} rounds={b.rounds} exhaleOn={b.exhaleOn} />;
    case "timer":
      return <TimerBlock instruction={b.instruction} seconds={b.seconds} reps={b.reps} />;
    case "singAlong":
      return <SingAlong instruction={b.instruction} note={b.note} seconds={b.seconds} />;
    case "match":
      return <Match prompt={b.prompt} pairs={b.pairs} />;
    case "order":
      return <Order prompt={b.prompt} items={b.items} />;
    case "checklist":
      return <Checklist title={b.title} items={b.items} />;
    case "reveal":
      return <Reveal prompt={b.prompt} answer={b.answer} />;
    default:
      return null;
  }
}
