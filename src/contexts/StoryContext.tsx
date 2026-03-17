'use client'

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { Story, StoryNode, StoryEdge } from '@/types/story';
import * as storyService from '@/services/storyService';

type StoryContextValue = {
  currentStory: Story | null;
  nodes: StoryNode[];
  edges: StoryEdge[];
  currentNodeId: string | null;
  loading: boolean;
  error: string | null;

  setCurrentNodeId: (id: string) => void;
  addNodeFromPrompt: (prompt: string) => Promise<{ ok: true } | { ok: false; error: string }>;
}

// 3) Criação do contexto
const StoryContext = createContext<StoryContextValue | undefined>(undefined);


// 4) Provider
export function StoryProvider({
  children,
  storyId: storyIdProp,
}: {
  children: React.ReactNode;
  storyId?: string;
}) {

  const storyId = storyIdProp ?? "COLOQUE_UM_STORY_ID_AQUI";

  const [currentStory, setCurrentStory] = useState<Story | null>(null);
  const [nodes, setNodes] = useState<StoryNode[]>([]);
  const [edges, setEdges] = useState<StoryEdge[]>([]);
  const [currentNodeId, setCurrentNodeIdState] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await storyService.getStoryById(storyId);
      setCurrentStory({
        ...data.story,
        nodes: data.nodes,
        edges: data.edges,
      });
      setNodes(data.nodes);
      setEdges(data.edges);
      setCurrentNodeIdState(
        data.currentNodeId ??
          data.nodes.find((n) => n.isStart)?.id ??
          data.nodes[0]?.id ??
          null
      );
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Falha ao carregar story');
    } finally {
      setLoading(false);
    }
  }, [storyId]);

  useEffect(() => {
    void load();
  }, [load]);

  const setCurrentNodeId = (id: string) => setCurrentNodeIdState(id);

  const addNodeFromPrompt: StoryContextValue["addNodeFromPrompt"] = useCallback(async (prompt) => {
    try {
      setError(null);

      const fail = (msg: string) => {
        setError(msg);
        return { ok: false as const, error: msg };
      };

      if (!currentStory || !currentNodeId) {
        return fail('Story não carregada');
      }


      // 1) Gerar conteúdo do novo nó
      const baseNode = nodes.find((n) => n.id === currentNodeId);
      if (!baseNode) return fail("Nó atual inválido");

      const aiRes = await fetch("/api/ai/generate", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          context: { nodeTitle: baseNode.title, nodeText: baseNode.text },
        }),
      });

      const aiJson = await aiRes.json();
      if (!aiRes.ok) return fail(aiJson?.error ?? 'Falha ao gerar texto');

      //Ajuste esse shape conforme o que sua rota realmente retorno:
      const newTitle = aiJson?.title ?? 'Novo nó';
      const newText = aiJson?.text ?? aiJson?.nodeText ?? aiJson?.context ?? '';
      const edgeLabel = aiJson?.edgeLabel ?? 'prompt';

      if (!newText) return fail('IA retornou texto vazio');

      // 2) Persistir nó + aresta (atômico)
      const { createdNode, createdEdge } = await storyService.appendNodeAndEdge({
        storyId: currentStory.id,
        baseNodeId: currentNodeId,
        newNodeData: { title: newTitle, text: newText },
        newEdgeLabel: edgeLabel,
      });

      // 3) Atualizar estado local (delta)
      setNodes((prev) => [...prev, createdNode]);
      setEdges((prev) => [...prev, createdEdge]);
      setCurrentStory((prev) =>
        prev
          ? {
              ...prev,
              nodes: [...prev.nodes, createdNode],
              edges: [...prev.edges, createdEdge],
            }
          : prev
      );
      setCurrentNodeIdState(createdNode.id);

      return { ok: true };
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Erro ao adicionar nó';
      setError(msg);
      return { ok: false, error: msg };
    }
  }, [currentStory, currentNodeId, nodes])

  const value = useMemo<StoryContextValue>(
    () => ({
      currentStory,
      nodes,
      edges,
      currentNodeId,
      loading,
      error,
      setCurrentNodeId,
      addNodeFromPrompt,
    }),
    [currentStory, nodes, edges, currentNodeId, loading, error, addNodeFromPrompt]
  );

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