import type { Metadata } from "next";
import Link from "next/link";
import { ResetRequestForm } from "@/components/auth/auth-forms";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const metadata: Metadata = { title: "Recuperar senha" };

export default async function RecuperarSenhaPage({ searchParams }: PageProps<"/recuperar-senha">) {
  const sp = await searchParams;
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Recuperar senha</h1>
        <p className="text-muted-foreground">Enviaremos um link para você criar uma nova senha.</p>
      </div>
      {sp.erro === "outro-navegador" && (
        <Alert variant="destructive">
          <AlertDescription>
            O link foi aberto em um navegador diferente daquele em que você pediu a recuperação. Peça um novo link e abra-o no mesmo navegador.
          </AlertDescription>
        </Alert>
      )}
      <ResetRequestForm />
      <Link href="/entrar" className="block text-center text-sm text-primary underline-offset-4 hover:underline">
        Voltar para o login
      </Link>
    </div>
  );
}
