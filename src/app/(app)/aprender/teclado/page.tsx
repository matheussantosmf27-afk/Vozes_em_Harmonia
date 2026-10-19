import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/common/page-header";
import { TheoryExplorer } from "@/components/theory/theory-explorer";

export const metadata: Metadata = { title: "Teclado e teoria interativa" };

export default function TecladoPage() {
  return (
    <>
      <nav aria-label="Trilha de navegação" className="mb-3 text-sm text-muted-foreground">
        <Link href="/aprender" className="hover:underline">
          Aprender
        </Link>{" "}
        / Teclado
      </nav>
      <PageHeader
        eyebrow="Ferramenta"
        title="Teclado e teoria interativa"
        description="Toque notas, explore intervalos, monte acordes e inversões, ouça escalas, conheça o campo harmônico e transponha cifras."
      />
      <TheoryExplorer />
    </>
  );
}
