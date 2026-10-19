import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/common/page-header";
import { RepertoireForm } from "@/components/repertoire/repertoire-form";
import { requireDirector } from "@/lib/auth";

export const metadata: Metadata = { title: "Nova música" };

export default async function NovaMusicaPage() {
  await requireDirector();
  return (
    <div className="mx-auto max-w-4xl">
      <nav aria-label="Trilha de navegação" className="mb-3 text-sm text-muted-foreground">
        <Link href="/repertorio" className="hover:underline">
          Repertório
        </Link>{" "}
        / Nova
      </nav>
      <PageHeader title="Nova música" description="Use apenas composições próprias, obras em domínio público ou materiais devidamente licenciados." />
      <RepertoireForm />
    </div>
  );
}
