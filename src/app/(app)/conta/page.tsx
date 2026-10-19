import type { Metadata } from "next";
import Link from "next/link";
import { Download } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { DeleteAccountForm, DeleteRecordingsButton, ProfileForm } from "@/components/common/account-forms";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { requireUser, ROLE_LABELS } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Minha conta" };

export default async function ContaPage() {
  const user = await requireUser();
  const supabase = await createClient();
  const [{ data: profile }, { count: recordings }] = await Promise.all([
    supabase.from("profiles").select("full_name, display_name").eq("id", user.id).single(),
    supabase.from("media_assets").select("id", { count: "exact", head: true }).eq("owner_id", user.id).eq("bucket", "recordings"),
  ]);
  return (
    <div className="max-w-3xl space-y-8">
      <PageHeader title="Minha conta e privacidade" description={user.email ?? undefined} />
      <section className="space-y-3 rounded-2xl border bg-card p-5">
        <h2 className="font-semibold">Dados pessoais</h2>
        <ProfileForm fullName={profile?.full_name ?? user.fullName} displayName={profile?.display_name ?? null} />
        <div className="flex flex-wrap gap-2">
          {user.roles.map((r) => (
            <Badge key={r} variant="secondary">
              {ROLE_LABELS[r]}
            </Badge>
          ))}
        </div>
      </section>
      <section className="space-y-3 rounded-2xl border bg-card p-5">
        <h2 className="font-semibold">Seus dados (LGPD)</h2>
        <p className="text-sm text-muted-foreground">Baixe uma cópia de tudo o que a plataforma guarda sobre você: avaliações, classificações, plano, metas, atividades, progresso, conquistas e presença.</p>
        <a href="/conta/exportar" className={buttonVariants({ variant: "outline" })}>
          <Download /> Baixar meus dados (JSON)
        </a>
        <p className="text-sm text-muted-foreground">
          Leia a <Link href="/privacidade" className="text-primary underline underline-offset-4">política de privacidade</Link>. Atividades e estudos podem ser excluídos individualmente em “Meu progresso”.
        </p>
      </section>
      <section className="space-y-3 rounded-2xl border bg-card p-5">
        <h2 className="font-semibold">Gravações</h2>
        <p className="text-sm text-muted-foreground">Você tem {recordings ?? 0} gravação(ões) salva(s). Somente você tem acesso a elas.</p>
        <DeleteRecordingsButton />
      </section>
      <section className="space-y-3 rounded-2xl border border-destructive/40 bg-destructive/5 p-5">
        <h2 className="font-semibold text-destructive">Excluir conta</h2>
        <p className="text-sm">A exclusão é definitiva: perfil, avaliações, histórico, metas, gravações e presença serão apagados. Se você for o único diretor musical, designe outro diretor antes.</p>
        <DeleteAccountForm />
      </section>
    </div>
  );
}
