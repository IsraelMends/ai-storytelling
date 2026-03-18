'use client'

import { useMemo } from 'react';

import { useStory } from '@/contexts/StoryContext';
import { StoryTree } from '@/components/story-tree/StoryTree'
import StoryReader from '@/components/story/StoryReader';
import StoryDecisionButtons from '@/components/story/StoryDecisionButtons';
import StoryPromptForm from '@/components/story/StoryPromptForm';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorState } from '@/components/ui/ErrorState';

export default function HomePage() {
  const {
    currentStory,
    currentNodeId,
    setCurrentNodeId,
    addNodeFromPrompt,
    loading,
    error,
    createNewStory,
  } = useStory();

  const currentNode = useMemo(
    () => currentStory?.nodes.find((n) => n.id === currentNodeId),
    [currentStory, currentNodeId]
  );

  const outgoingEdges = useMemo(
    () => currentStory?.edges.filter((e) => e.from === currentNodeId) ?? [],
    [currentStory, currentNodeId]
  );

  const handleGenerateFromPrompt = async (prompt: string) => {
    const result = await addNodeFromPrompt(prompt);
    if ('error' in result) {
      throw new Error(result.error);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-50 p-8">
        <LoadingSpinner message="Carregando história..." />
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-50 p-8">
        <ErrorState message={error} onRetry={() => window.location.reload()} />
      </main>
    );
  }

  if (!currentStory) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-50 p-8 flex flex-col items-center justify-center gap-4">
        <p className="text-slate-400">Nenhuma história encontrada.</p>
        <button
          onClick={createNewStory}
          className="px-6 py-3 bg-sky-600 rounded-lg hover:bg-sky-500 transition-colors font-medium"
        >
          Criar Nova História
        </button>
      </main>
    );
  }

  if (!currentNode) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-50 p-8">
        <ErrorState message="História em estado inválido!" onRetry={() => window.location.reload()} />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] gap-8">
        {/* Coluna esquerda: narrativa + decisões + formulário */}
        <section className="space-y-4 order-1">
          <StoryReader
            storyTitle={currentStory.title}
            nodeTitle={currentNode.title}
            nodeText={currentNode.text}
          />

          <StoryDecisionButtons
            edges={outgoingEdges}
            onSelect={(edge) => setCurrentNodeId(edge.to)}
          />

          <StoryPromptForm onSubmit={handleGenerateFromPrompt} />
        </section>

        {/* Coluna direita: grafo */}
        <section className="space-y-2 order-2">
          <h2 className="text-xl font-semibold">Árvore da História</h2>
          <div className="border border-slate-700 rounded-xl p-2 bg-slate-900/50">
            <StoryTree />
          </div>
        </section>
      </div>
    </main>
  );
}