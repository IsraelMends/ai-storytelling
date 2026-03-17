import { test, expect } from "@playwright/test";

const MOCK_STORY_RESPONSE = {
  story: {
    id: "S1",
    title: "História de Teste",
    description: "História usada em testes e2e",
    createdAt: new Date().toISOString(),
    nodes: [],
    edges: [],
  },
  nodes: [
    {
      id: "START",
      title: "Início",
      text: "Texto inicial da história",
      isStart: true,
      isEnding: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: "N2",
      title: "Segundo nó",
      text: "Outro trecho de história",
      isStart: false,
      isEnding: false,
      createdAt: new Date().toISOString(),
    },
  ],
  edges: [
    {
      id: "E1",
      from: "START",
      to: "N2",
      label: "Ir para o segundo nó",
    },
  ],
  currentNodeId: "START",
};

test("leitura básica e navegação por decisões", async ({ page }) => {
  // Mock da API de story para não depender de banco/seed
  await page.route("**/api/stories/**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(MOCK_STORY_RESPONSE),
    });
  });

  await page.goto("/");

  // Espera sair do estado de loading e mostrar o texto do nó inicial
  await expect(page.getByText("Texto inicial da história")).toBeVisible();

  // Clica na primeira decisão e espera que o texto exibido mude
  await page.getByRole("button", { name: "Ir para o segundo nó" }).click();
  await expect(page.getByText("Outro trecho de história")).toBeVisible();
});