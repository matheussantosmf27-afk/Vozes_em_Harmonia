import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";

export const metadata: Metadata = { title: "Privacidade e LGPD" };

export default function PrivacidadePage() {
  return (
    <main id="conteudo" className="mx-auto max-w-3xl space-y-8 px-4 py-10">
      <Link href="/">
        <Logo />
      </Link>
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">Privacidade e proteção de dados</h1>
        <p className="text-muted-foreground">
          Como o Vozes em Harmonia trata os seus dados, em respeito à Lei Geral de Proteção de Dados (Lei nº 13.709/2018).
        </p>
      </div>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Quais dados guardamos</h2>
        <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
          <li>Nome e e-mail, para identificar você no ministério.</li>
          <li>Respostas da avaliação, resultados de atividades, metas, presença em ensaios e observações dos professores.</li>
          <li>Gravações de áudio somente quando você escolher salvar uma gravação.</li>
        </ul>
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Microfone e áudio</h2>
        <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
          <li>O microfone só é usado depois da sua autorização no navegador, para estimar a altura da nota que você canta.</li>
          <li>A análise acontece no seu próprio aparelho. O áudio não é enviado nem armazenado automaticamente.</li>
          <li>Ao salvar um resultado, guardamos apenas números (nota, desvio em cents, estabilidade).</li>
          <li>Gravações salvas ficam em uma área privada: somente você pode ouvi-las e excluí-las.</li>
        </ul>
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Quem vê os seus dados</h2>
        <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
          <li>Você vê todos os seus registros.</li>
          <li>Professores e o diretor musical veem seus dados de estudo para orientar você.</li>
          <li>Outros integrantes veem apenas seu nome (por exemplo, em ensaios e distribuição de vozes).</li>
          <li>Não há ranking nem comparação pública de desempenho.</li>
        </ul>
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Seus direitos</h2>
        <p className="text-muted-foreground">
          Em “Minha conta” você pode baixar uma cópia dos seus dados, excluir tentativas e gravações e excluir a sua conta
          com todos os registros. Dúvidas podem ser tratadas com a liderança do ministério, responsável por esta instalação.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Não é uma ferramenta médica</h2>
        <p className="text-muted-foreground">
          A plataforma não diagnostica problemas de saúde vocal. Em caso de dor, rouquidão persistente ou desconforto,
          procure um otorrinolaringologista ou fonoaudiólogo.
        </p>
      </section>
    </main>
  );
}
