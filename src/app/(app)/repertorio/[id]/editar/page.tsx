import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/common/page-header";
import { RepertoireForm } from "@/components/repertoire/repertoire-form";
import { requireDirector } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Editar música" };

export default async function EditarMusicaPage({ params }: PageProps<"/repertorio/[id]/editar">) {
  const { id } = await params;
  await requireDirector();
  const supabase = await createClient();
  const { data } = await supabase.from("repertoire").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  return (
    <div className="mx-auto max-w-4xl">
      <nav aria-label="Trilha de navegação" className="mb-3 text-sm text-muted-foreground">
        <Link href={`/repertorio/${id}`} className="hover:underline">
          {data.title}
        </Link>{" "}
        / Editar
      </nav>
      <PageHeader title="Editar música" />
      <RepertoireForm initial={data} />
    </div>
  );
}
