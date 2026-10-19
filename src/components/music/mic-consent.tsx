"use client";

import { Headphones, Mic, ShieldCheck } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import type { MicStatus } from "@/lib/audio/use-pitch-detector";

/** Explica o uso do microfone antes de pedir a permissão do navegador. */
export function MicConsent({ status, onStart, compact = false }: { status: MicStatus; onStart: () => void; compact?: boolean }) {
  if (status === "listening") return null;
  if (status === "unsupported") {
    return (
      <Alert>
        <Mic />
        <AlertTitle>Microfone indisponível neste navegador</AlertTitle>
        <AlertDescription>Você pode fazer a atividade com autoavaliação. Para usar a detecção, abra em um navegador atualizado (Chrome, Edge, Safari ou Firefox) via HTTPS.</AlertDescription>
      </Alert>
    );
  }
  if (status === "denied") {
    return (
      <Alert variant="destructive">
        <Mic />
        <AlertTitle>Permissão do microfone negada</AlertTitle>
        <AlertDescription>Libere o microfone nas configurações do navegador para este site, ou continue com a autoavaliação.</AlertDescription>
      </Alert>
    );
  }
  return (
    <div className="space-y-3 rounded-2xl border bg-secondary/40 p-4">
      {!compact && (
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex gap-2">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-success" />O áudio é analisado no seu aparelho para estimar a nota cantada. Nada é gravado ou enviado.
          </li>
          <li className="flex gap-2">
            <Headphones className="mt-0.5 size-4 shrink-0 text-primary" />
            Use fones de ouvido: assim o microfone capta só a sua voz.
          </li>
          <li className="flex gap-2">
            <Mic className="mt-0.5 size-4 shrink-0 text-primary" />A detecção é uma estimativa e pode falhar com ruído. Não é um diagnóstico.
          </li>
        </ul>
      )}
      {status === "error" && <p className="text-sm text-destructive">Não foi possível abrir o microfone. Verifique se outro aplicativo está usando-o.</p>}
      <Button type="button" onClick={onStart} disabled={status === "requesting"}>
        <Mic /> {status === "requesting" ? "Aguardando permissão…" : "Ativar microfone"}
      </Button>
    </div>
  );
}
