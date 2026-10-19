import type { Metadata } from "next";
import { Logo } from "@/components/brand/logo";
import { isSupabaseConfigured } from "@/lib/env";

export const metadata: Metadata = { title: "Configuração necessária" };

export default function ConfiguracaoPage() {
  const ok = isSupabaseConfigured();
  return (
    <main id="conteudo" className="mx-auto max-w-2xl space-y-6 px-4 py-12">
      <Logo />
      <h1 className="text-3xl font-semibold">{ok ? "Supabase configurado" : "Configure o Supabase para começar"}</h1>
      {ok ? (
        <p className="text-muted-foreground">As variáveis de ambiente foram encontradas. Volte para a página inicial.</p>
      ) : (
        <div className="space-y-4 text-muted-foreground">
          <p>
            Esta instalação ainda não tem um banco de dados conectado. A aplicação depende do Supabase (PostgreSQL,
            autenticação e armazenamento). Siga o passo a passo do arquivo <code>README.md</code>:
          </p>
          <ol className="list-decimal space-y-2 pl-6">
            <li>Crie um projeto no Supabase e aplique as migrations da pasta <code>supabase/migrations</code>.</li>
            <li>
              Defina <code>NEXT_PUBLIC_SUPABASE_URL</code> e <code>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code> (ou{" "}
              <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>) no arquivo <code>.env.local</code> ou nas variáveis do Vercel.
            </li>
            <li>Reinicie o servidor. A primeira conta criada se torna diretora musical.</li>
          </ol>
        </div>
      )}
    </main>
  );
}
