import type { Metadata } from "next";
import { NewPasswordForm } from "@/components/auth/auth-forms";
import { Logo } from "@/components/brand/logo";
import { requireUser } from "@/lib/auth";

export const metadata: Metadata = { title: "Nova senha" };

export default async function NovaSenhaPage() {
  await requireUser({ allowPending: true });
  return (
    <main id="conteudo" className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center gap-6 px-4">
      <Logo />
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Crie uma nova senha</h1>
        <p className="text-muted-foreground">Use pelo menos 8 caracteres, com letras e números.</p>
      </div>
      <NewPasswordForm />
    </main>
  );
}
