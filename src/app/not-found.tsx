import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main id="conteudo" className="mx-auto flex min-h-[60dvh] max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="font-music text-5xl text-gold" aria-hidden>𝄽</p>
      <h1 className="text-2xl font-semibold">Página não encontrada</h1>
      <p className="text-muted-foreground">Essa pausa não estava na partitura. O endereço pode ter mudado.</p>
      <Link href="/inicio" className={buttonVariants()}>
        Voltar ao início
      </Link>
    </main>
  );
}
