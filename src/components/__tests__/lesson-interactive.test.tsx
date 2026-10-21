import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("@/lib/audio/engine", () => ({
  playMidi: vi.fn(async () => ({ stop() {}, done: Promise.resolve(), endsAt: 0, startedAt: 0 })),
  playEvents: vi.fn(async () => ({ stop() {}, done: Promise.resolve(), endsAt: 0, startedAt: 0 })),
  isAudioSupported: () => true,
  unlockAudio: vi.fn(),
  scheduleNote: vi.fn(),
  getAudioContext: vi.fn(),
}));

import { CheckQuestion, Compare, FlipCards, Match, Order, Reveal, TrueFalse } from "@/components/lesson/interactive-blocks";
import { LessonPlayer } from "@/components/lesson/lesson-player";
import { Illustration } from "@/components/lesson/illustrations";
import { ILLUSTRATIONS } from "@/content/types";

describe("CheckQuestion", () => {
  it("dá feedback imediato e explica a resposta certa", async () => {
    const user = userEvent.setup();
    render(<CheckQuestion question="Quantas linhas tem a pauta?" options={["Quatro", "Cinco", "Seis"]} answer={1} explain="São cinco linhas e quatro espaços." />);
    await user.click(screen.getByRole("button", { name: "Seis" }));
    expect(screen.getByText(/Quase/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Cinco" }));
    expect(screen.getByText(/Isso mesmo!/)).toBeInTheDocument();
    expect(screen.getByText(/cinco linhas e quatro espaços/)).toBeInTheDocument();
  });
});

describe("TrueFalse", () => {
  it("percorre as afirmações e mostra o placar", async () => {
    const user = userEvent.setup();
    render(
      <TrueFalse
        items={[
          { statement: "A", answer: true, explain: "x" },
          { statement: "B", answer: false, explain: "y" },
        ]}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Verdadeiro" }));
    await user.click(screen.getByRole("button", { name: "Próxima" }));
    await user.click(screen.getByRole("button", { name: "Verdadeiro" }));
    expect(screen.getByText(/É falso/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Ver resultado" }));
    expect(screen.getByText("Você acertou 1 de 2.")).toBeInTheDocument();
  });
});

describe("Match", () => {
  it("aceita só os pares corretos", async () => {
    const user = userEvent.setup();
    const pairs = [
      { left: "Semibreve", right: "4 tempos" },
      { left: "Mínima", right: "2 tempos" },
      { left: "Semínima", right: "1 tempo" },
    ];
    render(<Match prompt="Figuras" pairs={pairs} />);
    for (const p of pairs) {
      await user.click(screen.getByRole("button", { name: p.left }));
      await user.click(screen.getByRole("button", { name: p.right }));
    }
    expect(screen.getByText(/ligou todos os pares/)).toBeInTheDocument();
  });
});

describe("Order", () => {
  it("monta a sequência na ordem correta e recusa a errada", async () => {
    const user = userEvent.setup();
    render(<Order prompt="Aquecimento" items={["Corpo", "Respiração", "Vogais"]} />);
    await user.click(screen.getByRole("button", { name: "Vogais" }));
    expect(screen.getByText(/Ainda não é esse/)).toBeInTheDocument();
    for (const t of ["Corpo", "Respiração", "Vogais"]) await user.click(screen.getByRole("button", { name: t }));
    expect(screen.getByText("Sequência completa!")).toBeInTheDocument();
  });
});

describe("Compare", () => {
  it("só revela os rótulos depois do acerto no desafio de escuta", async () => {
    const user = userEvent.setup();
    render(
      <Compare
        prompt="Qual está afinada?"
        options={[
          { label: "um pouco abaixo", notes: ["A3"], cents: -35 },
          { label: "afinada", notes: ["A3"] },
        ]}
        answer={1}
        explain="A afinada soa estável."
      />,
    );
    expect(screen.queryByText(/afinada$/)).not.toBeInTheDocument();
    await user.click(screen.getAllByRole("button", { name: "É esta" })[1]);
    expect(screen.getByText("B · afinada")).toBeInTheDocument();
    expect(screen.getByText(/soa estável/)).toBeInTheDocument();
  });
});

describe("Reveal e FlipCards", () => {
  it("mostram a resposta e a correção ao tocar", async () => {
    const user = userEvent.setup();
    render(
      <>
        <Reveal prompt="Pense" answer="Resposta escondida" />
        <FlipCards items={[{ erro: "Erguer o queixo", correcao: "Queixo paralelo ao chão" }]} />
      </>,
    );
    await user.click(screen.getByRole("button", { name: /Ver resposta/ }));
    expect(screen.getByText("Resposta escondida")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Erguer o queixo/ }));
    expect(screen.getByText("Queixo paralelo ao chão")).toBeInTheDocument();
  });
});

describe("LessonPlayer", () => {
  it("mostra uma etapa por vez, avança e permite ver a aula inteira", async () => {
    const user = userEvent.setup();
    render(
      <LessonPlayer
        lessonKey="teste"
        steps={[
          { titulo: "Primeira", tipo: "descobrir" },
          { titulo: "Segunda", tipo: "experimentar" },
        ]}
        panels={[<p key="1">conteúdo 1</p>, <p key="2">conteúdo 2</p>]}
      />,
    );
    expect(screen.getByText("Etapa 1 de 2")).toBeInTheDocument();
    expect(screen.getByText("conteúdo 2")).not.toBeVisible();
    await user.click(screen.getByRole("button", { name: /Continuar/ }));
    expect(screen.getByText("conteúdo 2")).toBeVisible();
    await user.click(screen.getByRole("button", { name: /Concluir etapas/ }));
    expect(screen.getByText("Você percorreu a aula!")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Ver a aula inteira/ }));
    expect(screen.getByText("conteúdo 1")).toBeVisible();
    expect(screen.getByText("conteúdo 2")).toBeVisible();
  });
});

describe("Illustration", () => {
  it("todas as ilustrações têm descrição acessível", () => {
    for (const name of ILLUSTRATIONS) {
      const { container, unmount } = render(<Illustration name={name} />);
      const svg = within(container).getByRole("img");
      expect(svg.getAttribute("aria-label")?.length, name).toBeGreaterThan(30);
      unmount();
    }
  });
});
