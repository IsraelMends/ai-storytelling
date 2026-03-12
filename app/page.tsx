'use client'

import { useStory } from '@/contexts/StoryContext';
import { useMemo } from 'react';

import { StoryTree } from '@/components/story-tree/StoryTree'

export default function HomePage() {

  const { currentStory, currentNodeId, setCurrentNodeId } = useStory();

  const currentNode = useMemo(
    () => currentStory.nodes.find((n) => n.id === currentNodeId), [currentStory, currentNodeId]
  )

  const outgoingEdges = useMemo(
    () => currentStory.edges.filter((e) => e.from === currentNodeId), [currentStory, currentNodeId]
  );

  if (!currentNode) {
    return (
      <div>
        História em estado inválido!
      </div>
    )
  }


  return (
    <main className='min-h-screen bg-slate-950 text-slate-50 p-8'>
      <h1>{currentStory.title}</h1>
      <h2>{currentNode.title}</h2>
      <p>{currentNode.text}</p>
      {outgoingEdges.length > 0 ? (
        outgoingEdges.map((edge) => (
          <button key={edge.id} onClick={() => setCurrentNodeId(edge.id)}>
            {edge.label}
          </button>
        ))
      ) : (
        <p>Fim deste ramo da história</p>
      )}
      <section className='mt-8'>
        <h2>Árvore da História</h2>
        <StoryTree />
      </section>
    </main>
  );
}