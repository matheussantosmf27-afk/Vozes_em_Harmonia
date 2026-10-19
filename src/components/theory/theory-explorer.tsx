"use client";

import { useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { PianoKeyboard, type KeyTone } from "@/components/music/piano-keyboard";
import { PlayButton } from "@/components/music/play-button";
import { Staff } from "@/components/music/staff";
import { chord, seq } from "@/lib/exercises/generators";
import { noteName, pitchClassName } from "@/lib/music/notes";
import {
  buildChord,
  buildScale,
  CHORD_QUALITIES,
  chordSymbol,
  harmonicField,
  INTERVALS,
  INVERSION_NAMES,
  prefersFlats,
  scaleFormula,
  SCALES,
  type ChordQuality,
  type ScaleKind,
} from "@/lib/music/theory";

const ROOTS = Array.from({ length: 12 }, (_, i) => 60 + i);

function rootOptions(flats = false) {
  return ROOTS.map((m) => ({ value: String(m), label: `${noteName(m, { withOctave: false, preferFlats: flats })} (${noteName(m, { style: "cifra", withOctave: false, preferFlats: flats })})` }));
}

export function TheoryExplorer() {
  const [labels, setLabels] = useState<"pt" | "cifra">("pt");
  return (
    <Tabs defaultValue="teclado" className="space-y-4">
      <TabsList className="flex h-auto flex-wrap justify-start">
        <TabsTrigger value="teclado">Teclado</TabsTrigger>
        <TabsTrigger value="intervalos">Intervalos</TabsTrigger>
        <TabsTrigger value="acordes">Acordes</TabsTrigger>
        <TabsTrigger value="escalas">Escalas</TabsTrigger>
        <TabsTrigger value="campo">Campo harmônico</TabsTrigger>
        <TabsTrigger value="transposicao">Transposição</TabsTrigger>
      </TabsList>
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">Nomes:</span>
        <Button size="sm" variant={labels === "pt" ? "default" : "outline"} onClick={() => setLabels("pt")}>
          Dó Ré Mi
        </Button>
        <Button size="sm" variant={labels === "cifra" ? "default" : "outline"} onClick={() => setLabels("cifra")}>
          C D E
        </Button>
      </div>
      <TabsContent value="teclado">
        <FreeKeyboard labels={labels} />
      </TabsContent>
      <TabsContent value="intervalos">
        <IntervalExplorer labels={labels} />
      </TabsContent>
      <TabsContent value="acordes">
        <ChordExplorer labels={labels} />
      </TabsContent>
      <TabsContent value="escalas">
        <ScaleExplorer labels={labels} />
      </TabsContent>
      <TabsContent value="campo">
        <FieldExplorer />
      </TabsContent>
      <TabsContent value="transposicao">
        <Transposer />
      </TabsContent>
    </Tabs>
  );
}

function FreeKeyboard({ labels }: { labels: "pt" | "cifra" }) {
  const [played, setPlayed] = useState<number[]>([]);
  return (
    <div className="space-y-3">
      <PianoKeyboard from={48} to={84} labels={labels} shortcuts onPress={(m) => setPlayed((p) => [...p.slice(-11), m])} highlight={played.length ? { [played[played.length - 1]]: "primary" } : {}} />
      <div className="flex flex-wrap items-center gap-2 text-sm" aria-live="polite">
        <span className="text-muted-foreground">Últimas notas:</span>
        {played.map((m, i) => (
          <span key={i} className="rounded-md bg-secondary px-2 py-1">
            {noteName(m, { style: labels })}
          </span>
        ))}
        {played.length > 0 && (
          <>
            <PlayButton events={seq(played, 0.5, 0.05)} label="Tocar sequência" size="sm" variant="outline" />
            <Button size="sm" variant="ghost" onClick={() => setPlayed([])}>
              Limpar
            </Button>
          </>
        )}
      </div>
      <p className="text-xs text-muted-foreground">Toque as teclas na tela ou use o teclado do computador (A W S E D F T G Y H U J K).</p>
    </div>
  );
}

function IntervalExplorer({ labels }: { labels: "pt" | "cifra" }) {
  const [root, setRoot] = useState(60);
  const [semis, setSemis] = useState(4);
  const [dir, setDir] = useState<1 | -1>(1);
  const other = root + semis * dir;
  const info = INTERVALS.find((i) => i.semitones === semis)!;
  const hl: Record<number, KeyTone> = { [root]: "gold", [other]: "primary" };
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="int-root">Nota de partida</Label>
          <NativeSelect id="int-root" value={String(root)} onChange={(e) => setRoot(Number(e.target.value))} options={rootOptions()} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="int-semis">Intervalo</Label>
          <NativeSelect
            id="int-semis"
            value={String(semis)}
            onChange={(e) => setSemis(Number(e.target.value))}
            options={INTERVALS.filter((i) => i.semitones > 0).map((i) => ({ value: String(i.semitones), label: `${i.name} (${i.semitones})` }))}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="int-dir">Direção</Label>
          <NativeSelect id="int-dir" value={String(dir)} onChange={(e) => setDir(Number(e.target.value) as 1 | -1)} options={[{ value: "1", label: "Ascendente" }, { value: "-1", label: "Descendente" }]} />
        </div>
      </div>
      <PianoKeyboard from={48} to={84} labels={labels} highlight={hl} />
      <div className="flex flex-wrap items-center gap-3">
        <PlayButton events={seq([root, other], 0.7, 0.1)} label="Melódico" />
        <PlayButton events={chord([root, other])} label="Harmônico" variant="outline" />
        <p className="text-sm">
          {noteName(root, { style: labels })} → {noteName(other, { style: labels })}: <strong>{info.name}</strong> · {info.consonance === "dissonante" ? "dissonância" : `consonância ${info.consonance}`}
        </p>
      </div>
      {info.memoryHint && <p className="text-sm text-muted-foreground">Para lembrar: {info.memoryHint}.</p>}
    </div>
  );
}

function ChordExplorer({ labels }: { labels: "pt" | "cifra" }) {
  const [root, setRoot] = useState(60);
  const [quality, setQuality] = useState<ChordQuality>("maior");
  const [inv, setInv] = useState(0);
  const notes = buildChord(root, quality, inv);
  const flats = quality !== "maior" && quality !== "aumentado" ? true : prefersFlats(root % 12);
  const hl = Object.fromEntries(notes.map((n, i) => [n, i === 0 ? "gold" : "primary"])) as Record<number, KeyTone>;
  const size = CHORD_QUALITIES[quality].intervals.length;
  const bass = notes[0];
  const symbol = chordSymbol(root % 12, quality, "cifra", flats) + (inv ? `/${pitchClassName(bass % 12, "cifra", flats)}` : "");
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="ch-root">Fundamental</Label>
          <NativeSelect id="ch-root" value={String(root)} onChange={(e) => setRoot(Number(e.target.value))} options={rootOptions()} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="ch-q">Tipo</Label>
          <NativeSelect
            id="ch-q"
            value={quality}
            onChange={(e) => {
              setQuality(e.target.value as ChordQuality);
              setInv(0);
            }}
            options={(Object.keys(CHORD_QUALITIES) as ChordQuality[]).map((q) => ({ value: q, label: CHORD_QUALITIES[q].label }))}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="ch-inv">Posição</Label>
          <NativeSelect id="ch-inv" value={String(inv)} onChange={(e) => setInv(Number(e.target.value))} options={INVERSION_NAMES.slice(0, size).map((n, i) => ({ value: String(i), label: n }))} />
        </div>
      </div>
      <PianoKeyboard from={48} to={84} labels={labels} highlight={hl} />
      <div className="flex flex-wrap items-center gap-3">
        <PlayButton events={chord(notes)} label="Bloco" />
        <PlayButton events={seq(notes, 0.5, 0.05)} label="Arpejo" variant="outline" />
        <p className="text-sm">
          Cifra <strong>{symbol}</strong>: {notes.map((n) => noteName(n, { style: labels, preferFlats: flats })).join(" – ")}
        </p>
      </div>
      <p className="text-sm text-muted-foreground">{CHORD_QUALITIES[quality].description}</p>
      <Staff clef="sol" notes={notes} label="O acorde escrito na pauta (notas sucessivas)" />
    </div>
  );
}

function ScaleExplorer({ labels }: { labels: "pt" | "cifra" }) {
  const [tonic, setTonic] = useState(60);
  const [kind, setKind] = useState<ScaleKind>("maior");
  const notes = buildScale(tonic, kind);
  const hl = Object.fromEntries(notes.map((n, i) => [n, i === 0 || i === notes.length - 1 ? "gold" : "primary"])) as Record<number, KeyTone>;
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="sc-t">Tônica</Label>
          <NativeSelect id="sc-t" value={String(tonic)} onChange={(e) => setTonic(Number(e.target.value))} options={rootOptions()} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="sc-k">Escala</Label>
          <NativeSelect id="sc-k" value={kind} onChange={(e) => setKind(e.target.value as ScaleKind)} options={(Object.keys(SCALES) as ScaleKind[]).map((k) => ({ value: k, label: SCALES[k].label }))} />
        </div>
      </div>
      <PianoKeyboard from={48} to={84} labels={labels} highlight={hl} />
      <div className="flex flex-wrap items-center gap-3">
        <PlayButton events={seq(notes, 0.4, 0.04)} label="Subir" />
        <PlayButton events={seq([...notes].reverse(), 0.4, 0.04)} label="Descer" variant="outline" />
        <p className="text-sm">
          Fórmula: <span className="font-mono">{scaleFormula(kind)}</span> · {notes.map((n) => noteName(n, { style: labels, withOctave: false, preferFlats: prefersFlats(tonic % 12) || kind !== "maior" })).join(" ")}
        </p>
      </div>
    </div>
  );
}

function FieldExplorer() {
  const [tonic, setTonic] = useState(60);
  const [mode, setMode] = useState<"maior" | "menor">("maior");
  const field = harmonicField(tonic % 12, mode);
  const flats = prefersFlats(tonic % 12) || mode === "menor";
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="cf-t">Tonalidade</Label>
          <NativeSelect id="cf-t" value={String(tonic)} onChange={(e) => setTonic(Number(e.target.value))} options={rootOptions()} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="cf-m">Modo</Label>
          <NativeSelect id="cf-m" value={mode} onChange={(e) => setMode(e.target.value as "maior" | "menor")} options={[{ value: "maior", label: "Maior" }, { value: "menor", label: "Menor (com dominante maior)" }]} />
        </div>
      </div>
      <div className="grid gap-2 sm:grid-cols-4 lg:grid-cols-7">
        {field.map((d) => {
          let root = 48 + d.rootPc;
          if (root < 52) root += 12;
          const notes = buildChord(root, d.quality);
          return (
            <div key={d.degree} className="space-y-2 rounded-xl border bg-card p-3 text-center">
              <p className="font-heading text-lg">{d.roman}</p>
              <p className="font-medium">{chordSymbol(d.rootPc, d.quality, "cifra", flats)}</p>
              <p className="text-xs capitalize text-muted-foreground">{d.fn}</p>
              <PlayButton events={chord(notes)} label="Ouvir" size="sm" variant="outline" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

const LETTERS = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const FLAT_LETTERS = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];

export function transposeChordSymbol(symbol: string, semitones: number, flats: boolean): string {
  return symbol.replace(/([A-G])([#b♯♭]?)/g, (_, l: string, acc: string) => {
    const base = LETTERS.indexOf(l);
    const shift = acc === "#" || acc === "♯" ? 1 : acc === "b" || acc === "♭" ? -1 : 0;
    const pc = (((base + shift + semitones) % 12) + 12) % 12;
    return (flats ? FLAT_LETTERS : LETTERS)[pc];
  });
}

function Transposer() {
  const [text, setText] = useState("C F G C | Am Dm G7 C");
  const [semis, setSemis] = useState(2);
  const [flats, setFlats] = useState(false);
  const out = useMemo(() => text.split(/(\s+)/).map((t) => (/^[A-G]/.test(t) ? transposeChordSymbol(t, semis, flats) : t)).join(""), [text, semis, flats]);
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="tr-in">Cifras (separe por espaços)</Label>
        <Input id="tr-in" value={text} onChange={(e) => setText(e.target.value)} />
      </div>
      <div className="flex flex-wrap items-end gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="tr-s">Semitons</Label>
          <Input id="tr-s" type="number" min={-11} max={11} value={semis} onChange={(e) => setSemis(Number(e.target.value))} className="w-28" />
        </div>
        <label className="flex items-center gap-2 pb-2 text-sm">
          <input type="checkbox" checked={flats} onChange={(e) => setFlats(e.target.checked)} className="size-4" /> Escrever com bemóis
        </label>
      </div>
      <div className="rounded-xl border bg-card p-4">
        <p className="text-xs text-muted-foreground">Resultado</p>
        <p className="font-mono text-lg" aria-live="polite">
          {out}
        </p>
      </div>
      <p className="text-sm text-muted-foreground">Dica: +2 semitons leva de Dó para Ré; −1 leva de Ré para Ré♭. O tipo dos acordes (m, 7, °) não muda.</p>
    </div>
  );
}
