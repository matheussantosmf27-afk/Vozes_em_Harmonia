import { CLASSIFICATION_STATUS_LABELS, VOICE_LABELS, regionFor, REGION_LABELS, type VoiceClass } from "@/lib/pedagogy/classification";
import { noteName } from "@/lib/music/notes";
import { formatDate } from "@/lib/format";
import { Badge } from "@/components/ui/badge";

export interface ClassificationData {
  classification: VoiceClass;
  status: keyof typeof CLASSIFICATION_STATUS_LABELS;
  comfortable_low_midi: number | null;
  comfortable_high_midi: number | null;
  range_low_midi: number | null;
  range_high_midi: number | null;
  tessitura_low_midi: number | null;
  tessitura_high_midi: number | null;
  passaggio: string | null;
  notes: string | null;
  classified_by: string | null;
  created_at: string;
}

const span = (a: number | null, b: number | null) => (a && b ? `${noteName(a)} – ${noteName(b)}` : "—");

export function ClassificationCard({ data, authorName }: { data: ClassificationData | null; authorName?: string | null }) {
  if (!data) {
    return (
      <div className="space-y-2 rounded-2xl border bg-card p-5">
        <p className="text-sm text-muted-foreground">Classificação vocal</p>
        <p className="font-heading text-2xl">Ainda não classificada</p>
        <p className="text-sm text-muted-foreground">Faça a avaliação inicial. A classificação é sempre provisória até a avaliação do professor.</p>
      </div>
    );
  }
  const region = data.comfortable_low_midi && data.comfortable_high_midi ? regionFor(data.comfortable_low_midi, data.comfortable_high_midi) : null;
  return (
    <div className="space-y-4 rounded-2xl border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-sm text-muted-foreground">Classificação vocal</p>
          <p className="font-heading text-2xl">{VOICE_LABELS[data.classification]}</p>
        </div>
        <Badge variant={data.status === "confirmada" ? "default" : "secondary"}>{CLASSIFICATION_STATUS_LABELS[data.status]}</Badge>
      </div>
      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-muted-foreground">Região confortável atual</dt>
          <dd className="font-medium">{span(data.comfortable_low_midi, data.comfortable_high_midi)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Extensão observada</dt>
          <dd className="font-medium">{span(data.range_low_midi, data.range_high_midi)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Tessitura estimada</dt>
          <dd className="font-medium">{span(data.tessitura_low_midi, data.tessitura_high_midi)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Região para cantar em grupo</dt>
          <dd className="font-medium">{region ? REGION_LABELS[region] : "—"}</dd>
        </div>
        {data.passaggio && (
          <div className="sm:col-span-2">
            <dt className="text-muted-foreground">Região de passagem (avaliada pelo professor)</dt>
            <dd className="font-medium">{data.passaggio}</dd>
          </div>
        )}
      </dl>
      {data.notes && <p className="rounded-lg bg-muted/50 p-3 text-sm">{data.notes}</p>}
      <p className="text-xs text-muted-foreground">
        {data.classified_by ? `Registrada por ${authorName ?? "professor(a)"}` : "Sugestão automática da avaliação"} em {formatDate(data.created_at)}.
      </p>
    </div>
  );
}
