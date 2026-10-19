import type { Metadata } from "next";
import Link from "next/link";
import { SignInForm } from "@/components/auth/auth-forms";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const metadata: Metadata = { title: "Entrar" };

export default async function EntrarPage({ searchParams }: PageProps<"/entrar">) {
  const sp = await searchParams;
  const voltar = typeof sp.voltar === "string" ? sp.voltar : undefined;
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Bem-vindo(a) de volta</h1>
        <p className="text-muted-foreground">Entre para continuar a sua jornada musical.</p>
      </div>
      {sp.erro === "link-invalido" && (
        <Alert variant="destructive">
          <AlertDescription>O link expirou ou já foi usado. Entre com sua senha ou peça um novo link.</AlertDescription>
        </Alert>
      )}
      <SignInForm voltar={voltar} />
      <p className="text-center text-sm text-muted-foreground">
        Ainda não tem conta?{" "}
        <Link href="/cadastro" className="font-medium text-primary underline-offset-4 hover:underline">
          Criar conta
        </Link>
      </p>
    </div>
  );
}
