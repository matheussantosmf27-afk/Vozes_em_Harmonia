"use client";

import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { NativeSelect } from "@/components/ui/native-select";
import { saveRepertoire } from "@/app/actions/repertoire";
import { initialActionState } from "@/lib/action-result";
import { CATEGORY_LABELS, FORMATION_LABELS, LICENSE_LABELS, REPERTOIRE_STATUS_LABELS } from "@/lib/repertoire";
import type { Tables } from "@/lib/supabase/database.types";

const opts = (m: Record<string, string>) => Object.entries(m).map(([value, label]) => ({ value, label }));

export function RepertoireForm({ initial }: { initial?: Partial<Tables<"repertoire">> }) {
  const [state, action, pending] = useActionState(saveRepertoire, initialActionState);
  const [license, setLicense] = useState(initial?.license_status ?? "autorizacao_pendente");
  useEffect(() => {
    if (!state.ok && state.error) toast.error(state.error);
  }, [state]);
  const authorized = license !== "autorizacao_pendente";
  return (
    <form action={action} className="space-y-6">
      {initial?.id && <input type="hidden" name="id" value={initial.id} />}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="title">Título</Label>
          <Input id="title" name="title" required maxLength={200} defaultValue={initial?.title ?? ""} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="composer">Compositor / autor da música</Label>
          <Input id="composer" name="composer" maxLength={200} defaultValue={initial?.composer ?? ""} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="lyricist">Autor da letra</Label>
          <Input id="lyricist" name="lyricist" maxLength={200} defaultValue={initial?.lyricist ?? ""} />
        </div>
      </div>

      <fieldset className="space-y-3 rounded-2xl border bg-card p-4">
        <legend className="px-1 font-semibold">Direitos autorais</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="license_status">Situação de uso</Label>
            <NativeSelect id="license_status" name="license_status" value={license} onChange={(e) => setLicense(e.target.value as typeof license)} options={opts(LICENSE_LABELS)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="source">Fonte (hinário, editora, site)</Label>
            <Input id="source" name="source" maxLength={300} defaultValue={initial?.source ?? ""} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="copyright_info">Informações de direitos e licença</Label>
            <Textarea id="copyright_info" name="copyright_info" maxLength={2000} defaultValue={initial?.copyright_info ?? ""} placeholder="Ex.: Licença CCLI nº …; autorização por escrito do autor em 10/03/2026; domínio público (autor falecido em 1890)." />
          </div>
        </div>
        {!authorized && (
          <p className="rounded-lg bg-warning/10 p-3 text-sm">
            Enquanto a autorização estiver pendente, letra, cifra e arquivos protegidos não podem ser armazenados. Você pode registrar a distribuição de vozes e as observações.
          </p>
        )}
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-4">
        <div className="space-y-1.5">
          <Label htmlFor="original_key">Tom original</Label>
          <Input id="original_key" name="original_key" maxLength={40} defaultValue={initial?.original_key ?? ""} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="group_key">Tom do grupo</Label>
          <Input id="group_key" name="group_key" maxLength={40} defaultValue={initial?.group_key ?? ""} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="tempo_bpm">Andamento (bpm)</Label>
          <Input id="tempo_bpm" name="tempo_bpm" type="number" min={20} max={260} defaultValue={initial?.tempo_bpm ?? ""} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="time_signature">Compasso</Label>
          <Input id="time_signature" name="time_signature" placeholder="4/4" defaultValue={initial?.time_signature ?? ""} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="formation">Formação vocal</Label>
          <NativeSelect id="formation" name="formation" defaultValue={initial?.formation ?? "satb"} options={opts(FORMATION_LABELS)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="voices_required">Vozes necessárias</Label>
          <Input id="voices_required" name="voices_required" type="number" min={1} max={8} defaultValue={initial?.voices_required ?? 4} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="difficulty">Dificuldade (1–5)</Label>
          <Input id="difficulty" name="difficulty" type="number" min={1} max={5} defaultValue={initial?.difficulty ?? 2} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="status">Situação de preparo</Label>
          <NativeSelect id="status" name="status" defaultValue={initial?.status ?? "planejada"} options={opts(REPERTOIRE_STATUS_LABELS)} />
        </div>
      </div>

      <fieldset className="space-y-2">
        <legend className="font-semibold">Categorias</legend>
        <div className="flex flex-wrap gap-3">
          {Object.entries(CATEGORY_LABELS).map(([v, l]) => (
            <label key={v} className="flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-sm">
              <input type="checkbox" name="categories" value={v} defaultChecked={initial?.categories?.includes(v)} className="size-4" /> {l}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="lyrics">Letra {authorized ? "" : "(requer autorização)"}</Label>
          <Textarea id="lyrics" name="lyrics" rows={8} disabled={!authorized} defaultValue={initial?.lyrics ?? ""} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="chords">Cifras {authorized ? "" : "(requer autorização)"}</Label>
          <Textarea id="chords" name="chords" rows={8} disabled={!authorized} defaultValue={initial?.chords ?? ""} className="font-mono" />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="director_notes">Observações do diretor musical (distribuição de vozes, dinâmica, pontos de atenção)</Label>
          <Textarea id="director_notes" name="director_notes" rows={4} defaultValue={initial?.director_notes ?? ""} />
        </div>
      </div>
      <Button type="submit" size="lg" disabled={pending}>
        Salvar música
      </Button>
    </form>
  );
}
