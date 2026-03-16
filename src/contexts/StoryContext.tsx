'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import type { Story, StoryId, NodeId, StoryNode, StoryEdge } from '../types/story'

// 1) História de exemplo (hardcoded)

const exampleNodes: StoryNode[] = [
  {
    id: 'start',
    title: 'início na floresta',
    text: 'Elena entra na floresta ao anoitecer e ouve um som distante entre as árvores',
    isStart: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'follow-sound',
    title: 'Seguir o som',
    text: 'Ela decide seguir o som e encontra uma clareira iluminada por vagalumes.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'go-back',
    title: 'Voltar para a vila',
    text: 'Ela sente medo e decide voltar para a vila, mas percebe que o caminho mudou.',
    createdAt: new Date().toISOString(),
    isEnding: true,
  }
]

const exampleEdges: StoryEdge[] = [
  {
    id: 'start->follow',
    from: 'start',
    to: 'follow-sound',
    label: 'Seguir o som'
  },
  {
    id: 'start->back',
    from: 'start',
    to: 'go-back',
    label: 'Voltar para a vila'
  }
]

const exampleStory: Story = {
  id: 'demo-story' as StoryId,
  title: 'A floresta da Elena',
  description: 'Uma pequena história de exemplo para testar o fluxo',
  nodes: exampleNodes,
  edges: exampleEdges,
  createdAt: new Date().toISOString(),
  isPublic: false,
}

// 2) Tipagem do contexto
export interface StoryContextValue {
  currentStory: Story;
  currentNodeId: NodeId;
  setCurrentNodeId: (id: NodeId) => void;
  addNodeFromPrompt: (
    prompt: string
  ) => Promise<{ nodeId: string } | { error: string }>;
}

// 3) Criação do contexto
const StoryContext = createContext<StoryContextValue | undefined>(undefined);



// 4) Provider
export function StoryProvider({ children }: { children: ReactNode }) {
  const [currentNodeId, setCurrentNodeId] = useState<NodeId>("start");
  const [story, setStory] = useState<Story>(exampleStory);

  const addNodeFromPrompt = async (
    prompt: string
  ): Promise<{ nodeId: string } | { error: string }> => {
    const currentNode = story.nodes.find((n) => n.id === currentNodeId);
    const context = currentNode ? currentNode.text : undefined;

    const res = await fetch("/api/ai/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, context }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { error: data.error || "Erro desconhecido ao gerar texto com IA" };
    }

    const text: string | undefined = data.text;

    if (!text) {
      return { error: "Resposta vazia da IA" };
    }

    const newId = `node-${Date.now()}`;

    const newNode: StoryNode = {
      id: newId,
      title: prompt.slice(0, 30),
      text,
      createdAt: new Date().toISOString(),
    };

    const newEdge: StoryEdge = {
      id: `edge-${Date.now()}`,
      from: currentNodeId,
      to: newId,
      label: prompt.slice(0, 30),
    };

    setStory((prev) => ({
      ...prev,
      nodes: [...prev.nodes, newNode],
      edges: [...prev.edges, newEdge],
    }));

    setCurrentNodeId(newId);
    return { nodeId: newId };
  };

  const value: StoryContextValue = {
    currentStory: story,
    currentNodeId,
    setCurrentNodeId,
    addNodeFromPrompt,
  };

  return (
    <StoryContext.Provider value={value}>
      {children}
    </StoryContext.Provider>
  )
}

// 5) Hook de acesso
export function useStory() {
  const ctx = useContext(StoryContext);

  if (!ctx) {
    throw new Error('useStory deve ser usado dentro de <StoryProvider/>')
  }

  return ctx
}