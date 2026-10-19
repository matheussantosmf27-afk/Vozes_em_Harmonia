import type { Metadata } from "next";
import Link from "next/link";
import { AlertCircle, ListPlus, Users } from "lucide-react";
import { PageHeader, EmptyState } from "@/components/common/page-header";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { NativeSelect } from "@/components/ui/native-select";
import { Button } from "@/components/ui/button";
import { requireStaff } from "@/lib/auth";
import { getMembersOverview } from "@/lib/data/staff";
import { CLASSIFICATION_STATUS_LABELS, VOICE_LABELS, type VoiceClass } from "@/lib/pedagogy/classification";
import { formatRelative, pct } from "@/lib/format";

export const metadata: Metadata = { title: "Área do professor" };

export default async function ProfessorPage({ searchParams }: PageProps<"/professor">) {
  await requireStaff();
  const sp = await searchParams;
  const filtro = typeof sp.filtro === "string" ? sp.filtro : "";
  const all = await getMembersOverview();
  const members = all.filter((m) => (filtro === "atencao" ? m.flags.length > 0 : filtro === "sem-avaliacao" ? !m.hasInitial : filtro === "revisar" ? !m.classifiedByTeacher && !!m.classification : true));
  const attention = all.filter((m) => m.flags.length > 0).length;
  return (
    <>
      <PageHeader
        eyebrow="Acompanhamento"
        title="Área do professor"
        description="Acompanhe cada integrante, registre avaliações e observações, ajuste planos e metas. Os indicadores apoiam — não substituem — a sua escuta."
        actions={
          <Link href="/professor/atividades" className={buttonVariants({ variant: "outline" })}>
            <ListPlus /> Criar atividades
          </Link>
        }
      />
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ["Integrantes ativos", all.length],
          ["Precisam de atenção", attention],
          ["Sem avaliação inicial", all.filter((m) => !m.hasInitial).length],
          ["Classificações a revisar", all.filter((m) => m.classification && !m.classifiedByTeacher).length],
        ].map(([l, v]) => (
          <div key={l} className="rounded-2xl border bg-card p-4">
            <p className="font-heading text-2xl">{v}</p>
            <p className="text-sm text-muted-foreground">{l}</p>
          </div>
        ))}
      </div>
      <form className="mb-4 flex flex-wrap gap-2">
        <NativeSelect name="filtro" defaultValue={filtro} aria-label="Filtro" options={[{ value: "", label: "Todos os integrantes" }, { value: "atencao", label: "Precisam de atenção" }, { value: "sem-avaliacao", label: "Avaliações pendentes" }, { value: "revisar", label: "Classificação a revisar" }]} className="w-64" />
        <Button type="submit" variant="secondary">
          Filtrar
        </Button>
      </form>
      {members.length === 0 ? (
        <EmptyState icon={Users} title="Nenhum integrante neste filtro" />
      ) : (
        <div className="overflow-x-auto rounded-2xl border bg-card">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="border-b text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="p-3">Integrante</th>
                <th className="p-3">Classificação</th>
                <th className="p-3">Última prática</th>
                <th className="p-3">Dias ativos (30d)</th>
                <th className="p-3">Média recente</th>
                <th className="p-3">Aulas</th>
                <th className="p-3">Atenção</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {members.map((m) => (
                <tr key={m.id} className="hover:bg-muted/40">
                  <td className="p-3">
                    <Link href={`/professor/integrantes/${m.id}`} className="font-medium text-primary hover:underline">
                      {m.name}
                    </Link>
                  </td>
                  <td className="p-3">
                    {m.classification ? VOICE_LABELS[m.classification as VoiceClass] : "—"}
                    {m.classificationStatus && <span className="block text-xs text-muted-foreground">{CLASSIFICATION_STATUS_LABELS[m.classificationStatus as keyof typeof CLASSIFICATION_STATUS_LABELS]}</span>}
                  </td>
                  <td className="p-3 text-muted-foreground">{m.lastActivity ? formatRelative(m.lastActivity) : "nunca"}</td>
                  <td className="p-3">{m.activeDays30}</td>
                  <td className="p-3">{pct(m.recentAvg)}</td>
                  <td className="p-3">{m.lessonsCompleted}</td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {m.flags.map((f) => (
                        <Badge key={f} variant="secondary" className="gap-1">
                          <AlertCircle className="size-3" /> {f}
                        </Badge>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
