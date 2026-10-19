import { expect, test, type Page } from "@playwright/test";

const run = Date.now().toString(36);
const director = { email: process.env.E2E_DIRECTOR_EMAIL ?? `diretor-${run}@example.com`, password: process.env.E2E_DIRECTOR_PASSWORD ?? "senha1234" };
const member = { email: `integrante-${run}@example.com`, password: "senha1234", name: `Integrante ${run}` };

async function signUp(page: Page, name: string, email: string, password: string) {
  await page.goto("/cadastro");
  await page.fill("#fullName", name);
  await page.fill("#email", email);
  await page.fill("#password", password);
  await page.check("input[name=consent]");
  await page.click("button[type=submit]");
}

async function signIn(page: Page, email: string, password: string) {
  await page.goto("/entrar");
  await page.fill("#email", email);
  await page.fill("#password", password);
  await page.click("button[type=submit]");
  await page.waitForLoadState("networkidle");
}

test.describe.serial("fluxos principais", () => {
  test("diretor entra (ou é a primeira conta) e acessa o painel", async ({ page }) => {
    if (!process.env.E2E_DIRECTOR_EMAIL) await signUp(page, "Diretor E2E", director.email, director.password);
    else await signIn(page, director.email, director.password);
    await page.goto("/diretor");
    test.skip(!page.url().endsWith("/diretor"), "Defina E2E_DIRECTOR_EMAIL com uma conta de diretor (o banco já tem contas).");
    await expect(page.getByRole("heading", { name: "Direção musical" })).toBeVisible();
  });

  test("novo integrante aguarda aprovação e é aprovado", async ({ browser }) => {
    const m = await (await browser.newContext()).newPage();
    await signUp(m, member.name, member.email, member.password);
    await m.waitForURL("**/aguardando");
    const d = await (await browser.newContext()).newPage();
    await signIn(d, director.email, director.password);
    await d.goto("/diretor/integrantes");
    await d.locator("tr", { hasText: member.name }).getByRole("button", { name: "Aprovar acesso" }).click();
    await expect(d.locator("tr", { hasText: member.name }).getByText("Ativo")).toBeVisible();
    await m.goto("/inicio");
    await expect(m).toHaveURL(/\/inicio$/);
    await m.goto("/diretor");
    await expect(m).toHaveURL(/\/inicio/);
  });

  test("aula só é concluída ao atingir a nota mínima", async ({ page }) => {
    await signIn(page, member.email, member.password);
    await page.goto("/aprender/fundamentos-vocais/postura-e-relaxamento");
    await expect(page.getByText("Aula concluída")).toHaveCount(0);
    const correct = [
      "Um fio puxando o topo da cabeça para cima, com ombros pesando para baixo",
      "Porque tensiona o pescoço e a laringe",
      "Na parte da frente da cadeira, pés no chão e coluna sem encostar",
      "Permanecem soltos; a expansão acontece nas costelas e no abdômen",
      "Sentir a vibração do som sem esforço, com a mandíbula solta",
    ];
    await page.locator("div.rounded-2xl", { hasText: "Avaliação: postura para cantar" }).last().getByRole("button", { name: "Começar" }).click();
    for (let i = 0; i < 5; i++) {
      for (const t of correct) {
        const b = page.getByRole("button", { name: t, exact: true });
        if (await b.count()) {
          await b.click();
          break;
        }
      }
      await page.getByRole("button", { name: /Próxima|Ver resultado/ }).click();
    }
    await expect(page.getByText("Resultado salvo no seu progresso.")).toBeVisible({ timeout: 15_000 });
    await page.reload();
    await expect(page.getByText("Aula concluída").first()).toBeVisible();
  });

  test("avaliação inicial gera relatório e plano", async ({ page }) => {
    await signIn(page, member.email, member.password);
    await page.goto("/jornada/avaliacao");
    await page.getByRole("button", { name: "Começar" }).click();
    await page.getByRole("radio", { name: "Vozes masculinas" }).click();
    await page.getByRole("button", { name: /Continuar/ }).click();
    for (let i = 0; i < 9; i++) await page.getByRole("button", { name: "Pular teste" }).click();
    await page.getByRole("button", { name: "Pular", exact: true }).click();
    await page.getByRole("button", { name: /Concluir e gerar meu plano/ }).click();
    await page.waitForURL("**/jornada/relatorio/**");
    await expect(page.getByText("Pontos fortes")).toBeVisible();
    await page.goto("/jornada");
    await expect(page.getByText("Objetivo principal")).toBeVisible();
  });

  test("treinador de harmonia registra prática e concede conquista", async ({ page }) => {
    await signIn(page, member.email, member.password);
    await page.goto("/harmonia/tercas-paralelas");
    await page.getByRole("button", { name: "Tocar" }).click();
    await page.waitForTimeout(1500);
    await page.getByRole("button", { name: "Pausar" }).click();
    await page.getByRole("button", { name: "Mantive minha voz" }).click();
    await expect(page.getByText("Prática registrada!")).toBeVisible();
  });
});
