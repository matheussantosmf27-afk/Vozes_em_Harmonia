import type { Metadata } from "next";
import Link from "next/link";
import { ResetRequestForm } from "@/components/auth/auth-forms";

export const metadata: Metadata = { title: "Recuperar senha" };

export default function RecuperarSenhaPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Recuperar senha</h1>
        <p className="text-muted-foreground">Enviaremos um link para você criar uma nova senha.</p>
      </div>
      <ResetRequestForm />
      <Link href="/entrar" className="block text-center text-sm text-primary underline-offset-4 hover:underline">
        Voltar para o login
      </Link>
    </div>
  );
}
