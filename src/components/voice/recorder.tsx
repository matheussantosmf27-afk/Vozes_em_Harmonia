"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CloudUpload, Download, Mic, Play, Square, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getBrowserClient } from "@/lib/supabase/client";
import { deleteRecording, recordingUrl, registerRecording } from "@/app/actions/voice";
import { formatRelative } from "@/lib/format";

export interface SavedRecording {
  id: string;
  title: string;
  created_at: string;
  size_bytes: number | null;
}

function pickMime() {
  if (typeof MediaRecorder === "undefined") return null;
  for (const m of ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg"]) if (MediaRecorder.isTypeSupported(m)) return m;
  return "";
}

/** Gravador: nada é enviado sem a escolha explícita de salvar. */
export function Recorder({ userId, saved }: { userId: string; saved: SavedRecording[] }) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "recording" | "ready" | "unsupported" | "denied">(() => "idle");
  const [blob, setBlob] = useState<Blob | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [title, setTitle] = useState("");
  const [pending, startTransition] = useTransition();
  const rec = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const timer = useRef<number | null>(null);

  useEffect(() => () => {
    if (url) URL.revokeObjectURL(url);
    rec.current?.stream.getTracks().forEach((t) => t.stop());
  }, [url]);

  async function start() {
    const mime = pickMime();
    if (mime === null || !navigator.mediaDevices?.getUserMedia) {
      setStatus("unsupported");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const r = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
      chunks.current = [];
      r.ondataavailable = (e) => e.data.size && chunks.current.push(e.data);
      r.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const b = new Blob(chunks.current, { type: r.mimeType || "audio/webm" });
        setBlob(b);
        setUrl(URL.createObjectURL(b));
        setStatus("ready");
        if (timer.current) window.clearInterval(timer.current);
      };
      r.start();
      rec.current = r;
      setSeconds(0);
      setStatus("recording");
      timer.current = window.setInterval(() => setSeconds((s) => {
        if (s + 1 >= 180) rec.current?.stop();
        return s + 1;
      }), 1000);
    } catch {
      setStatus("denied");
    }
  }

  function discard() {
    if (url) URL.revokeObjectURL(url);
    setBlob(null);
    setUrl(null);
    setStatus("idle");
  }

  function save() {
    if (!blob) return;
    startTransition(async () => {
      const ext = blob.type.includes("mp4") ? "m4a" : blob.type.includes("ogg") ? "ogg" : "webm";
      const path = `${userId}/${Date.now()}.${ext}`;
      const supabase = getBrowserClient();
      const { error } = await supabase.storage.from("recordings").upload(path, blob, { contentType: blob.type.split(";")[0], upsert: false });
      if (error) {
        toast.error("Não foi possível enviar a gravação.");
        return;
      }
      const res = await registerRecording({ path, title: title.trim() || `Gravação de ${new Date().toLocaleDateString("pt-BR")}`, mimeType: blob.type.split(";")[0], sizeBytes: blob.size });
      if (!res.ok) {
        toast.error(res.error);
        return;
      }
      toast.success("Gravação salva na sua área privada.");
      discard();
      setTitle("");
      router.refresh();
    });
  }

  async function playSaved(id: string) {
    const res = await recordingUrl(id);
    if (!res.ok || !res.data) return toast.error(res.ok ? "Erro" : res.error);
    const audio = new Audio(res.data.url);
    void audio.play();
  }

  function remove(id: string) {
    startTransition(async () => {
      const res = await deleteRecording(id);
      if (res.ok) {
        toast.success("Gravação excluída.");
        router.refresh();
      } else toast.error(res.error);
    });
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground">
        Grave-se para ouvir a sua evolução. A gravação fica apenas no seu aparelho até você decidir salvá-la; gravações salvas ficam numa área privada que só você acessa (nem professores podem ouvir). Máximo de 3 minutos.
      </p>
      {status === "unsupported" && <p className="text-sm text-destructive">Este navegador não permite gravar áudio.</p>}
      {status === "denied" && <p className="text-sm text-destructive">Permissão do microfone negada.</p>}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border bg-card p-4">
        {status !== "recording" ? (
          <Button onClick={start} disabled={status === "ready"}>
            <Mic /> Gravar
          </Button>
        ) : (
          <Button variant="destructive" onClick={() => rec.current?.stop()}>
            <Square /> Parar ({seconds}s)
          </Button>
        )}
        {status === "ready" && url && (
          <>
            <audio src={url} controls className="h-10 max-w-full" />
            <a href={url} download={`gravacao.${blob?.type.includes("mp4") ? "m4a" : "webm"}`} className="inline-flex items-center gap-1 text-sm text-primary underline-offset-4 hover:underline">
              <Download className="size-4" /> Baixar
            </a>
          </>
        )}
      </div>
      {status === "ready" && (
        <div className="flex flex-wrap items-end gap-2">
          <div className="min-w-56 flex-1 space-y-1.5">
            <label htmlFor="rec-title" className="text-sm font-medium">
              Nome da gravação (opcional)
            </label>
            <Input id="rec-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex.: Segunda voz — compasso 5" maxLength={200} />
          </div>
          <Button onClick={save} disabled={pending}>
            <CloudUpload /> Salvar na minha conta
          </Button>
          <Button variant="ghost" onClick={discard}>
            <Trash2 /> Descartar
          </Button>
        </div>
      )}
      <div className="space-y-2">
        <h3 className="font-medium">Minhas gravações salvas</h3>
        {saved.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhuma gravação salva.</p>
        ) : (
          <ul className="divide-y rounded-2xl border bg-card">
            {saved.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center gap-2 p-3">
                <span className="flex-1 text-sm">
                  <span className="font-medium">{r.title}</span>
                  <span className="block text-xs text-muted-foreground">
                    {formatRelative(r.created_at)}
                    {r.size_bytes ? ` · ${Math.round(r.size_bytes / 1024)} KB` : ""}
                  </span>
                </span>
                <Button size="sm" variant="outline" onClick={() => void playSaved(r.id)}>
                  <Play /> Ouvir
                </Button>
                <Button size="sm" variant="ghost" onClick={() => remove(r.id)} disabled={pending} aria-label={`Excluir ${r.title}`}>
                  <Trash2 />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
