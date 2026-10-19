import Link from "next/link";
import { Logo } from "@/components/brand/logo";

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[1fr_minmax(0,560px)]">
      <aside className="relative hidden overflow-hidden bg-primary text-primary-foreground lg:flex lg:flex-col lg:justify-between lg:p-12">
        <Link href="/" className="relative z-10 w-fit">
          <span className="inline-flex items-center gap-2 font-heading text-xl">Vozes em Harmonia</span>
        </Link>
        <svg viewBox="0 0 600 300" className="absolute inset-x-0 top-1/3 w-full opacity-25" aria-hidden>
          {[0, 1, 2, 3, 4].map((i) => (
            <path key={i} d={`M0 ${100 + i * 24} C150 ${60 + i * 24} 300 ${150 + i * 24} 600 ${90 + i * 24}`} stroke="currentColor" strokeWidth="1.5" fill="none" />
          ))}
        </svg>
        <blockquote className="relative z-10 max-w-md space-y-4">
          <p className="font-heading text-3xl leading-snug">
            Cada voz se desenvolve individualmente para, em seguida, contribuir melhor para a harmonia coletiva.
          </p>
          <footer className="text-sm text-primary-foreground/75">Princípio do Vozes em Harmonia</footer>
        </blockquote>
      </aside>
      <main id="conteudo" className="flex flex-col justify-center px-4 py-10 sm:px-10">
        <div className="mx-auto w-full max-w-sm">
          <Link href="/" className="mb-8 inline-block lg:hidden">
            <Logo />
          </Link>
          {children}
        </div>
      </main>
    </div>
  );
}
