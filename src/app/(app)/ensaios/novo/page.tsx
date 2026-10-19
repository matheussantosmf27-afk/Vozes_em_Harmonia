import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/common/page-header";
import { DEFAULT_AGENDA, RehearsalForm } from "@/components/rehearsal/rehearsal-form";
import { requireDirector } from "@/lib/auth";
import { isoToBrasiliaLocal, rehearsalFormOptions } from "@/lib/data/rehearsal-form";
import { nowMs } from "@/lib/format";

export const metadata: Metadata = { title: "Novo ensaio" };

export default async function NovoEnsaioPage() {
  await requireDirector();
  const { groups, repertoire } = await rehearsalFormOptions();
  const nextWeek = new Date(nowMs() + 7 * 86400000);
  nextWeek.setUTCHours(22, 0, 0, 0); // 19h em Brasília
  return (
    <div className="mx-auto max-w-4xl">
      <nav aria-label="Trilha de navegação" className="mb-3 text-sm text-muted-foreground">
        <Link href="/ensaios" className="hover:underline">
          Ensaios
        </Link>{" "}
        / Novo
      </nav>
      <PageHeader title="Novo ensaio" description="Defina data, músicas, objetivos e a pauta por blocos de tempo. O modelo de 60 minutos já vem preenchido e pode ser modificado." />
      <RehearsalForm
        canEditRepertoire
        groups={groups}
        repertoire={repertoire}
        initial={{ title: "", startsAt: isoToBrasiliaLocal(nextWeek.toISOString()), durationMinutes: 60, location: "", groupId: "", objectives: "", agenda: DEFAULT_AGENDA, repertoire: [] }}
      />
    </div>
  );
}
