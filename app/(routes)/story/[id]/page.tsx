'use client'

import { useParams } from "next/navigation";
import { useMemo } from "react";
import { useStory } from "@/contexts/StoryContext";

export default function StoryPage() {
  const params = useParams();
  const id = params.id as string;
  const { currentStory, currentNodeId, setCurrentNodeId } = useStory();

  const currentNode = useMemo(
    () => currentStory?.nodes.find((n) => n.id === currentNodeId),
    [currentStory, currentNodeId]
  )

  const outgoingEdges = useMemo(
    () => currentStory?.edges.filter((e) => e.from === currentNodeId) ?? [],
    [currentStory, currentNodeId]
  );

  if (!currentStory) {
    return <div>Carregando história...</div>;
  }

  if (!currentNode) {
    return (
      <div>
        Nó não encontrado.
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 p-8">
      <h1>{currentStory.title} — ID: {id}</h1>
      <h2>{currentNode.title}</h2>
      <p>{currentNode.text}</p>
      {outgoingEdges.map((edge) => (
        <button key={edge.id} onClick={() => setCurrentNodeId(edge.to)}>
          {edge.label}
        </button>
      ))}
    </main>
  )
}