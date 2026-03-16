'use client'

import { useMemo } from 'react';

import { useStory } from '@/contexts/StoryContext';
import { StoryTree } from '@/components/story-tree/StoryTree'
import StoryReader from '@/components/story/StoryReader';
import StoryDecisionButtons from '@/components/story/StoryDecisionButtons';
import StoryPromptForm from '@/components/story/StoryPromptForm';

export default function HomePage() {
  const {
    currentStory,
    currentNodeId,
    setCurrentNodeId,
    addNodeFromPrompt,
  } = useStory();

  const currentNode = useMemo(
    () => currentStory.nodes.find((n) => n.id === currentNodeId),
    [currentStory, currentNodeId]
  );

  const outgoingEdges = useMemo(
    () => currentStory.edges.filter((e) => e.from === currentNodeId),
    [currentStory, currentNodeId]
  );

  const handleGenerateFromPrompt = async (prompt: string) => {
    const result = await addNodeFromPrompt(prompt);
    if ('error' in result) {
      throw new Error(result.error);
    }
  };

  if (!currentNode) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-50 p-8">
        <p>História em estado inválido!</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 p-8 space-y-8">
      <section className="space-y-4">
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

      <section className="mt-8 space-y-2">
        <h2 className="text-xl font-semibold">Árvore da História</h2>
        <StoryTree />
      </section>
    </main>
  );
}