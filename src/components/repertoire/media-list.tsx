"use client";

import { useEffect, useRef, useState } from "react";
import { ExternalLink, FileAudio, FileMusic, FileText, Image as ImageIcon, Pause, Play } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { mediaUrl } from "@/app/actions/repertoire";

export interface MediaItem {
  id: string;
  title: string;
  kind: string;
  partName: string | null;
  licenseNote: string | null;
}

const ICON = { audio: FileAudio, midi: FileMusic, musicxml: FileMusic, pdf: FileText, imagem: ImageIcon, outro: FileText } as Record<string, typeof FileText>;

export function OpenMediaButton({ id }: { id: string }) {
  return (
    <Button
      size="sm"
      variant="outline"
      onClick={async () => {
        const r = await mediaUrl(id);
        if (!r.ok || !r.data) return void toast.error(r.ok ? "Erro" : r.error);
        window.open(r.data.url, "_blank", "noopener");
      }}
    >
      <ExternalLink /> Abrir
    </Button>
  );
}

export function MediaRow({ item, actions }: { item: MediaItem; actions?: React.ReactNode }) {
  const Icon = ICON[item.kind] ?? FileText;
  return (
    <li className="flex flex-wrap items-center gap-3 p-3">
      <Icon className="size-5 text-primary" aria-hidden />
      <span className="min-w-40 flex-1 text-sm">
        <span className="font-medium">{item.title}</span>
        <span className="block text-xs text-muted-foreground">
          {item.kind.toUpperCase()}
          {item.partName ? ` · ${item.partName}` : " · todas as vozes"}
          {item.licenseNote ? ` · ${item.licenseNote}` : ""}
        </span>
      </span>
      <OpenMediaButton id={item.id} />
      {actions}
    </li>
  );
}

/** Reproduz áudios separados por naipe em sincronia, com volume por voz. */
export function StemsPlayer({ stems }: { stems: { id: string; title: string; partName: string }[] }) {
  const audios = useRef<Record<string, HTMLAudioElement>>({});
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [volumes, setVolumes] = useState<Record<string, number>>(() => Object.fromEntries(stems.map((s) => [s.id, 1])));

  useEffect(() => () => Object.values(audios.current).forEach((a) => a.pause()), []);

  async function load() {
    const entries = await Promise.all(stems.map(async (s) => [s.id, await mediaUrl(s.id)] as const));
    for (const [id, r] of entries) {
      if (!r.ok || !r.data) {
        toast.error("Não foi possível carregar um dos áudios.");
        return;
      }
      const a = new Audio(r.data.url);
      a.preload = "auto";
      a.crossOrigin = "anonymous";
      audios.current[id] = a;
    }
    setReady(true);
  }

  async function toggle() {
    if (!ready) await load();
    const list = Object.values(audios.current);
    if (playing) {
      list.forEach((a) => a.pause());
      setPlaying(false);
      return;
    }
    const t = list[0]?.currentTime ?? 0;
    list.forEach((a) => (a.currentTime = t));
    await Promise.all(list.map((a) => a.play().catch(() => undefined)));
    setPlaying(true);
    list[0]?.addEventListener("ended", () => setPlaying(false), { once: true });
  }

  return (
    <div className="space-y-3 rounded-2xl border bg-card p-4">
      <div className="flex items-center gap-2">
        <h3 className="flex-1 font-semibold">Áudios por naipe</h3>
        <Button size="sm" onClick={() => void toggle()}>
          {playing ? <Pause /> : <Play />} {playing ? "Pausar" : "Tocar juntos"}
        </Button>
      </div>
      <ul className="space-y-2">
        {stems.map((s) => (
          <li key={s.id} className="grid items-center gap-2 text-sm sm:grid-cols-[200px_1fr]">
            <span>
              {s.partName} <span className="text-xs text-muted-foreground">· {s.title}</span>
            </span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={volumes[s.id]}
              aria-label={`Volume de ${s.partName}`}
              className="accent-[var(--primary)]"
              onChange={(e) => {
                const v = Number(e.target.value);
                setVolumes((x) => ({ ...x, [s.id]: v }));
                if (audios.current[s.id]) audios.current[s.id].volume = v;
              }}
            />
          </li>
        ))}
      </ul>
      <p className="text-xs text-muted-foreground">A sincronia depende do navegador; para estudo preciso por voz, use também o treinador com MIDI.</p>
    </div>
  );
}
