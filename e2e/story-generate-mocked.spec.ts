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
  ],
  edges: [],
  currentNodeId: "START",
};

test("geração de novo nó com IA mockada", async ({ page }) => {
  // Mock de carregamento da história inicial
  await page.route("**/api/stories/**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(MOCK_STORY_RESPONSE),
    });
  });

  // Mock da IA
  await page.route("**/api/ai/generate", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        title: "Novo nó",
        text: "Texto gerado fake",
        edgeLabel: "Escolha fake",
      }),
    });
  });

  // Mock do append (persistência de nó + aresta)
  await page.route("**/api/stories/append", async (route) => {
    await route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify({
        createdNode: {
          id: "N_FAKE",
          title: "Novo nó",
          text: "Texto gerado fake",
          isStart: false,
          isEnding: false,
          createdAt: new Date().toISOString(),
        },
        createdEdge: {
          id: "E_FAKE",
          from: "START",
          to: "N_FAKE",
          label: "Escolha fake",
        },
      }),
    });
  });

  await page.goto("/");

  // Garante que a história inicial carregou
  await expect(page.getByText("Texto inicial da história")).toBeVisible();

  // Input e botão reais da UI
  const input = page.getByPlaceholder("Digite sua continuação ou decisão...");
  await input.fill("crie um novo ramo");

  await page.getByRole("button", { name: /gerar/i }).click();

  // Garante que o texto gerado apareceu em algum lugar da página
  await expect(page.locator("body")).toContainText("Texto gerado fake");
});

