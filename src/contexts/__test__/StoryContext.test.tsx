import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { StoryProvider, useStory } from "../StoryContext";

// Ajuste o import conforme seu projeto:
import * as storyService from "@/services/storyService";
import type { Story, StoryEdge, StoryNode } from "@/types/story";

jest.mock("@/services/storyService", () => ({
  getStoryById: jest.fn(),
  appendNodeAndEdge: jest.fn(),
  createStory: jest.fn(),
}));

function Harness() {
  const ctx = useStory();
  return (
    <div>
      <div data-testid="currentNodeId">{ctx.currentNodeId ?? ""}</div>
      <div data-testid="nodesCount">{ctx.nodes.length}</div>
      <div data-testid="edgesCount">{ctx.edges.length}</div>

      <button onClick={() => ctx.setCurrentNodeId("NODE_X")}>setNode</button>
      <button onClick={() => void ctx.addNodeFromPrompt("novo ramo")}>addNode</button>

      {ctx.error ? <div data-testid="error">{ctx.error}</div> : null}
      {ctx.loading ? <div data-testid="loading">loading</div> : null}
    </div>
  );
}

const mockedGetStoryById = jest.mocked(storyService.getStoryById);
const mockedAppendNodeAndEdge = jest.mocked(storyService.appendNodeAndEdge);

const baseNode: StoryNode = {
  id: "START",
  title: "Início",
  text: "...",
  isStart: true,
  isEnding: false,
  createdAt: new Date().toISOString(),
};

const baseStory = (nodes: StoryNode[], edges: StoryEdge[]): Story => ({
  id: "S1",
  title: "Story",
  description: "Desc",
  createdAt: new Date().toISOString(),
  nodes,
  edges,
});

describe("StoryContext", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("setCurrentNodeId muda o nó atual como esperado", async () => {
    mockedGetStoryById.mockResolvedValue({
      story: baseStory([baseNode], []),
      nodes: [baseNode],
      edges: [],
      currentNodeId: "START",
    });

    const user = userEvent.setup();

    render(
      <StoryProvider storyId="S1">
        <Harness />
      </StoryProvider>
    );

    // Espera carregar
    expect(await screen.findByTestId("currentNodeId")).toHaveTextContent("START");

    await user.click(screen.getByText("setNode"));
    expect(screen.getByTestId("currentNodeId")).toHaveTextContent("NODE_X");
  });

  test("addNodeFromPrompt: sucesso adiciona nó+aresta e atualiza currentNodeId", async () => {
    mockedGetStoryById.mockResolvedValue({
      story: baseStory([baseNode], []),
      nodes: [baseNode],
      edges: [],
      currentNodeId: "START",
    });

    // Se seu addNodeFromPrompt chama /api/ai/generate via fetch,
    // mocke o fetch também. Ajuste o shape para bater com seu código.
    global.fetch = jest.fn(async (input: RequestInfo) => {
      if (String(input).includes("/api/ai/generate")) {
        return {
          ok: true,
          json: async () => ({ title: "N2", text: "texto gerado", edgeLabel: "Escolha" }),
        } as unknown as Response;
      }
      throw new Error("fetch não mockado para: " + input);
    }) as unknown as typeof fetch;

    mockedAppendNodeAndEdge.mockResolvedValue({
      createdNode: {
        id: "N2",
        title: "N2",
        text: "texto gerado",
        createdAt: new Date().toISOString(),
      },
      createdEdge: { id: "E1", from: "START", to: "N2", label: "Escolha" },
    });

    const user = userEvent.setup();

    render(
      <StoryProvider storyId="S1">
        <Harness />
      </StoryProvider>
    );

    expect(await screen.findByTestId("nodesCount")).toHaveTextContent("1");
    expect(screen.getByTestId("edgesCount")).toHaveTextContent("0");

    await user.click(screen.getByText("addNode"));

    // Depois do append, deve ter +1 node e +1 edge
    expect(await screen.findByTestId("nodesCount")).toHaveTextContent("2");
    expect(screen.getByTestId("edgesCount")).toHaveTextContent("1");
    expect(screen.getByTestId("currentNodeId")).toHaveTextContent("N2");
  });

  test("addNodeFromPrompt: erro retorna { error } e não altera story", async () => {
    mockedGetStoryById.mockResolvedValue({
      story: baseStory([baseNode], []),
      nodes: [baseNode],
      edges: [],
      currentNodeId: "START",
    });

    global.fetch = jest.fn(async () => {
      return {
        ok: false,
        json: async () => ({ error: "Falha IA" }),
      } as unknown as Response;
    }) as unknown as typeof fetch;

    const user = userEvent.setup();

    render(
      <StoryProvider storyId="S1">
        <Harness />
      </StoryProvider>
    );

    expect(await screen.findByTestId("nodesCount")).toHaveTextContent("1");

    await user.click(screen.getByText("addNode"));

    // Continua igual
    expect(screen.getByTestId("nodesCount")).toHaveTextContent("1");
    expect(screen.getByTestId("edgesCount")).toHaveTextContent("0");
    expect(screen.getByTestId("currentNodeId")).toHaveTextContent("START");
    expect(await screen.findByTestId("error")).toHaveTextContent(/Falha/i);
  });
});