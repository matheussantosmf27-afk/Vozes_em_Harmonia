"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FileUp, Loader2, Plus, Trash2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { getBrowserClient } from "@/lib/supabase/client";
import { parseMidi, type ImportedMidi } from "@/lib/music/midi-import";
import { assignPart, createArrangement, deleteArrangement, deleteMedia, registerMedia, removeAssignment } from "@/app/actions/repertoire";
import { FORMATION_LABELS } from "@/lib/repertoire";
import { noteName } from "@/lib/music/notes";

/** Importação de MIDI: uma voz por trilha. */
export function MidiImport({ repertoireId, defaultFormation }: { repertoireId: string; defaultFormation: string }) {
  const router = useRouter();
  const [data, setData] = useState<ImportedMidi | null>(null);
  const [names, setNames] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [level, setLevel] = useState("4");
  const [pending, startTransition] = useTransition();

  async function onFile(file: File) {
    try {
      const parsed = parseMidi(await file.arrayBuffer());
      if (!parsed.parts.length) {
        toast.error("O arquivo não tem trilhas com notas.");
        return;
      }
      setData(parsed);
      setNames(parsed.parts.map((p) => p.name));
      setTitle(file.name.replace(/\.midi?$/i, ""));
    } catch {
      toast.error("Não foi possível ler este arquivo MIDI.");
    }
  }

  function save() {
    if (!data) return;
    startTransition(async () => {
      const res = await createArrangement({
        repertoireId,
        title: title || "Arranjo importado",
        formation: (defaultFormation in FORMATION_LABELS ? defaultFormation : "livre") as "livre",
        tempo: data.tempo,
        beatsPerMeasure: data.beatsPerMeasure,
        harmonyLevel: Number(level),
        description: "Importado de arquivo MIDI.",
        source: "midi",
        parts: data.parts.map((p, i) => ({ name: names[i] || p.name, notes: p.notes })),
      });
      if (!res.ok) return void toast.error(res.error);
      toast.success("Arranjo importado. Ele já está disponível no treinador de harmonia.");
      setData(null);
      router.refresh();
    });
  }

  return (
    <div className="space-y-3 rounded-2xl border bg-card p-4">
      <h3 className="font-semibold">Importar arranjo de arquivo MIDI</h3>
      <p className="text-sm text-muted-foreground">Ideal: uma trilha por naipe (soprano, contralto, tenor, baixo). Cada trilha vira uma voz no treinador. Gravações estéreo comuns não podem ser separadas por voz com precisão.</p>
      <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-dashed px-3 py-2 text-sm hover:bg-muted">
        <FileUp className="size-4" /> Escolher arquivo .mid
        <input type="file" accept=".mid,.midi,audio/midi" className="sr-only" onChange={(e) => e.target.files?.[0] && void onFile(e.target.files[0])} />
      </label>
      {data && (
        <div className="space-y-3">
          <p className="text-sm">
            {data.parts.length} trilha(s) · {data.tempo} bpm · {data.beatsPerMeasure} tempos por compasso
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="midi-title">Nome do arranjo</Label>
              <Input id="midi-title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="midi-level">Nível na escola de harmonia</Label>
              <NativeSelect id="midi-level" value={level} onChange={(e) => setLevel(e.target.value)} options={[1, 2, 3, 4, 5].map((n) => ({ value: String(n), label: `Nível ${n}` }))} />
            </div>
          </div>
          <ul className="space-y-2">
            {data.parts.map((p, i) => {
              const pitches = p.notes.map((n) => n.p!).filter(Boolean);
              return (
                <li key={i} className="grid items-center gap-2 sm:grid-cols-[1fr_auto]">
                  <Input aria-label={`Nome da voz ${i + 1}`} value={names[i]} onChange={(e) => setNames(names.map((n, k) => (k === i ? e.target.value : n)))} />
                  <span className="text-xs text-muted-foreground">
                    {p.notes.length} notas · {pitches.length ? `${noteName(Math.min(...pitches))}–${noteName(Math.max(...pitches))}` : ""}
                  </span>
                </li>
              );
            })}
          </ul>
          <div className="flex gap-2">
            <Button onClick={save} disabled={pending}>
              {pending && <Loader2 className="animate-spin" />} Salvar arranjo
            </Button>
            <Button variant="ghost" onClick={() => setData(null)}>
              Cancelar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

/** Distribuição de vozes sem notas (para arranjos que existem só no papel). */
export function ManualParts({ repertoireId, voices }: { repertoireId: string; voices: number }) {
  const router = useRouter();
  const [title, setTitle] = useState("Distribuição de vozes");
  const [names, setNames] = useState<string[]>(voices >= 4 ? ["Soprano", "Contralto", "Tenor", "Baixo"].slice(0, voices) : Array.from({ length: voices }, (_, i) => `Voz ${i + 1}`));
  const [pending, startTransition] = useTransition();
  return (
    <div className="space-y-3 rounded-2xl border bg-card p-4">
      <h3 className="font-semibold">Registrar distribuição de vozes</h3>
      <p className="text-sm text-muted-foreground">Quando não houver arranjo digital, registre as vozes para designar integrantes e anexar materiais autorizados.</p>
      <Input aria-label="Nome" value={title} onChange={(e) => setTitle(e.target.value)} />
      <div className="flex flex-wrap gap-2">
        {names.map((n, i) => (
          <div key={i} className="flex items-center gap-1">
            <Input aria-label={`Voz ${i + 1}`} className="w-36" value={n} onChange={(e) => setNames(names.map((x, k) => (k === i ? e.target.value : x)))} />
            <Button size="icon" variant="ghost" aria-label="Remover voz" onClick={() => setNames(names.filter((_, k) => k !== i))} disabled={names.length <= 1}>
              <X />
            </Button>
          </div>
        ))}
        <Button size="sm" variant="outline" onClick={() => setNames([...names, `Voz ${names.length + 1}`])} disabled={names.length >= 8}>
          <Plus /> Voz
        </Button>
      </div>
      <Button
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            const res = await createArrangement({ repertoireId, title, formation: "livre", tempo: 80, beatsPerMeasure: 4, harmonyLevel: null, description: "Distribuição de vozes (sem notas digitais).", source: "manual", parts: names.map((name) => ({ name, notes: [] })) });
            if (!res.ok) return void toast.error(res.error);
            toast.success("Distribuição registrada.");
            router.refresh();
          })
        }
      >
        Salvar distribuição
      </Button>
    </div>
  );
}

export function DeleteArrangementButton({ id, repertoireId }: { id: string; repertoireId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <Button
      size="sm"
      variant="ghost"
      disabled={pending}
      onClick={() => {
        if (!confirm("Excluir este arranjo e as designações dele?")) return;
        startTransition(async () => {
          const r = await deleteArrangement(id, repertoireId);
          if (!r.ok) toast.error(r.error);
          router.refresh();
        });
      }}
    >
      <Trash2 /> Excluir arranjo
    </Button>
  );
}

export function AssignPartControl({ partId, repertoireId, members }: { partId: string; repertoireId: string; members: { id: string; name: string; hint?: string }[] }) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [pending, startTransition] = useTransition();
  return (
    <div className="flex gap-2">
      <NativeSelect aria-label="Designar integrante" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Designar integrante…" options={members.map((m) => ({ value: m.id, label: m.hint ? `${m.name} (${m.hint})` : m.name }))} className="flex-1" />
      <Button
        size="sm"
        disabled={!value || pending}
        onClick={() =>
          startTransition(async () => {
            const r = await assignPart(partId, value, repertoireId);
            if (!r.ok) toast.error(r.error);
            setValue("");
            router.refresh();
          })
        }
      >
        Designar
      </Button>
    </div>
  );
}

export function RemoveAssignmentButton({ id, repertoireId }: { id: string; repertoireId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <button type="button" aria-label="Remover designação" disabled={pending} className="rounded-full p-0.5 hover:bg-muted" onClick={() => startTransition(async () => { await removeAssignment(id, repertoireId); router.refresh(); })}>
      <X className="size-3.5" />
    </button>
  );
}

const KIND_BY_EXT: Record<string, "audio" | "midi" | "musicxml" | "pdf" | "imagem"> = {
  mp3: "audio", m4a: "audio", wav: "audio", ogg: "audio", webm: "audio", aac: "audio",
  mid: "midi", midi: "midi", musicxml: "musicxml", xml: "musicxml", mxl: "musicxml", pdf: "pdf", png: "imagem", jpg: "imagem", jpeg: "imagem",
};

export function MediaUpload({ repertoireId, parts, authorized }: { repertoireId: string; parts: { id: string; label: string }[]; authorized: boolean }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [partId, setPartId] = useState("");
  const [license, setLicense] = useState("");
  const [pending, startTransition] = useTransition();

  if (!authorized) {
    return <p className="rounded-lg bg-warning/10 p-3 text-sm">Registre a autorização de uso da música antes de anexar partituras, áudios ou MIDI.</p>;
  }

  function upload() {
    if (!file) return;
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    const kind = KIND_BY_EXT[ext] ?? "outro";
    if (file.size > 50 * 1024 * 1024) return void toast.error("Arquivo maior que 50 MB.");
    startTransition(async () => {
      const safe = file.name.normalize("NFD").replace(/[^\w.-]+/g, "_").slice(-80);
      const path = `repertorio/${repertoireId}/${Date.now()}-${safe}`;
      const contentType = file.type || (kind === "midi" ? "audio/midi" : kind === "musicxml" ? "application/vnd.recordare.musicxml+xml" : "application/octet-stream");
      const { error } = await getBrowserClient().storage.from("media").upload(path, file, { contentType });
      if (error) return void toast.error(`Envio recusado: ${error.message}`);
      const r = await registerMedia({ repertoireId, path, title: title.trim() || file.name, kind, mimeType: contentType, sizeBytes: file.size, vocalPartId: partId || null, licenseNote: license });
      if (!r.ok) return void toast.error(r.error);
      toast.success("Material anexado.");
      setFile(null);
      setTitle("");
      setPartId("");
      if (fileRef.current) fileRef.current.value = "";
      router.refresh();
    });
  }

  return (
    <div className="space-y-3 rounded-2xl border bg-card p-4">
      <h3 className="font-semibold">Anexar material autorizado</h3>
      <p className="text-sm text-muted-foreground">Áudios por naipe, MIDI, MusicXML, PDF ou imagem (até 50 MB). Os arquivos ficam privados: somente integrantes aprovados acessam, por link temporário.</p>
      <div className="grid gap-2 sm:grid-cols-2">
        <input ref={fileRef} type="file" aria-label="Arquivo" className="text-sm file:mr-3 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-2" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        <Input aria-label="Título" placeholder="Título (ex.: Tenor — guia)" value={title} onChange={(e) => setTitle(e.target.value)} />
        <NativeSelect aria-label="Voz relacionada" value={partId} onChange={(e) => setPartId(e.target.value)} placeholder="Material geral (todas as vozes)" options={parts.map((p) => ({ value: p.id, label: p.label }))} />
        <Input aria-label="Nota de licença" placeholder="Licença/autorização deste arquivo" value={license} onChange={(e) => setLicense(e.target.value)} />
      </div>
      <Button onClick={upload} disabled={!file || pending}>
        {pending ? <Loader2 className="animate-spin" /> : <Upload />} Enviar
      </Button>
    </div>
  );
}

export function DeleteMediaButton({ id, repertoireId }: { id: string; repertoireId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <Button size="icon" variant="ghost" aria-label="Excluir arquivo" disabled={pending} onClick={() => startTransition(async () => { await deleteMedia(id, repertoireId); router.refresh(); })}>
      <Trash2 />
    </Button>
  );
}
