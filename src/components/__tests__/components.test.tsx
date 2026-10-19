import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("@/lib/audio/engine", () => ({
  playMidi: vi.fn(async () => ({ stop() {}, done: Promise.resolve(), endsAt: 0, startedAt: 0 })),
  playEvents: vi.fn(async () => ({ stop() {}, done: Promise.resolve(), endsAt: 0, startedAt: 0 })),
  isAudioSupported: () => true,
  unlockAudio: vi.fn(),
  scheduleNote: vi.fn(),
  getAudioContext: vi.fn(),
}));
const recordAttempt = vi.fn(async () => ({ ok: true, data: { achievements: ["Primeira aula concluída"], lessonCompleted: true } }));
vi.mock("@/app/actions/practice", () => ({ recordAttempt: (...a: unknown[]) => recordAttempt(...(a as [])) }));
vi.mock("sonner", () => ({ toast: Object.assign(vi.fn(), { success: vi.fn(), error: vi.fn(), info: vi.fn() }) }));

import { PianoKeyboard } from "@/components/music/piano-keyboard";
import { Staff } from "@/components/music/staff";
import { ExerciseRunner } from "@/components/exercises/exercise-runner";
import { AnswerSelf } from "@/components/exercises/answer-self";

describe("PianoKeyboard", () => {
  it("expõe cada tecla com nome acessível e informa a nota tocada", () => {
    const onPress = vi.fn();
    render(<PianoKeyboard from={60} to={72} onPress={onPress} />);
    expect(screen.getAllByRole("button")).toHaveLength(13);
    fireEvent.pointerDown(screen.getByRole("button", { name: "Mi4" }));
    expect(onPress).toHaveBeenCalledWith(64);
    fireEvent.keyDown(screen.getByRole("button", { name: "Fá♯4" }), { key: "Enter" });
    expect(onPress).toHaveBeenCalledWith(66);
  });
});

describe("Staff", () => {
  it("descreve as notas para leitores de tela", () => {
    render(<Staff clef="fa" notes={[48, 55]} />);
    expect(screen.getByRole("img", { name: /clave de Fá: Dó3, Sol3/ })).toBeInTheDocument();
  });
});

describe("ExerciseRunner", () => {
  beforeEach(() => recordAttempt.mockClear());

  it("corrige, explica e salva o resultado ao final", async () => {
    const user = userEvent.setup();
    render(
      <ExerciseRunner
        exercise={{
          id: "11111111-1111-1111-1111-111111111111",
          slug: "teste",
          title: "Teste de conceitos",
          instructions: "",
          type: "quiz",
          purpose: "avaliacao",
          config: {
            shuffleOptions: false,
            questions: [
              { q: "Quantos semitons há em um tom?", options: ["1", "2"], answer: 1, explanation: "Um tom = dois semitons." },
              { q: "Dó–Mi é uma…", options: ["terça", "quinta"], answer: 0 },
            ],
          },
        }}
      />,
    );
    await user.click(screen.getByRole("button", { name: /Começar/ }));
    await user.click(screen.getByRole("button", { name: "2" }));
    expect(screen.getByText("Correto!")).toBeInTheDocument();
    expect(screen.getByText("Um tom = dois semitons.")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Próxima/ }));
    await user.click(screen.getByRole("button", { name: "quinta" }));
    expect(screen.getByText("Não foi desta vez.")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Ver resultado/ }));
    expect(screen.getByText("50%")).toBeInTheDocument();
    await waitFor(() => expect(recordAttempt).toHaveBeenCalledTimes(1));
    expect(recordAttempt).toHaveBeenCalledWith(expect.objectContaining({ exerciseId: "11111111-1111-1111-1111-111111111111", score: 0.5, correct: 1, total: 2 }));
  });

  it("não salva quando persist=false (avaliação inicial agrupa os resultados)", async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();
    render(
      <ExerciseRunner
        persist={false}
        onComplete={onComplete}
        exercise={{ id: "x", slug: "x", title: "X", instructions: "", type: "quiz", purpose: "diagnostico", config: { shuffleOptions: false, questions: [{ q: "?", options: ["a", "b"], answer: 0 }] } }}
      />,
    );
    await user.click(screen.getByRole("button", { name: /Começar/ }));
    await user.click(screen.getByRole("button", { name: "a" }));
    await user.click(screen.getByRole("button", { name: /Ver resultado/ }));
    expect(onComplete).toHaveBeenCalledWith(expect.objectContaining({ score: 1, correct: 1, total: 1 }));
    expect(recordAttempt).not.toHaveBeenCalled();
  });
});

describe("AnswerSelf", () => {
  it("só permite concluir depois de avaliar todos os itens", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<AnswerSelf items={["Postura", "Respiração"]} onSubmit={onSubmit} done={false} />);
    const submit = screen.getByRole("button", { name: "Concluir autoavaliação" });
    expect(submit).toBeDisabled();
    const groups = screen.getAllByRole("radiogroup");
    await user.click(groups[0].querySelector("button")!);
    await user.click(groups[1].querySelectorAll("button")[1]);
    await user.click(submit);
    expect(onSubmit).toHaveBeenCalledWith([2, 1]);
  });
});
