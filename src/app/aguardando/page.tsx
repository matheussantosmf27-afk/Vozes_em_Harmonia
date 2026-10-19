import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Hourglass } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/auth";
import { signOut } from "@/app/actions/auth";

export const metadata: Metadata = { title: "Aguardando aprovação" };

export default async function AguardandoPage() {
  const user = await requireUser({ allowPending: true });
  if (user.isActive) redirect("/inicio");
  return (
    <main id="conteudo" className="mx-auto flex min-h-dvh max-w-md flex-col justify-center gap-6 px-4">
      <Logo />
      <Hourglass className="size-10 text-gold" aria-hidden />
      <h1 className="text-3xl font-semibold">Olá, {user.displayName}! Seu acesso está aguardando aprovação.</h1>
      <p className="text-muted-foreground">
        Para proteger os dados do ministério, o diretor musical aprova cada nova conta. Avise a liderança que você se
        cadastrou. Assim que for aprovado(a), basta recarregar esta página.
      </p>
      <form action={signOut}>
        <Button variant="outline">Sair</Button>
      </form>
    </main>
  );
}
