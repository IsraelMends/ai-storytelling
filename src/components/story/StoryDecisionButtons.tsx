import type { StoryEdge } from "@/types/story";

interface StoryDecisionButtonsProps {
  edges: StoryEdge[];
  onSelect: (edge: StoryEdge) => void;
}

export default function StoryDecisionButtons({ edges, onSelect }: StoryDecisionButtonsProps) {
  if (edges.length === 0) {
    return <div>Fim deste ramo da história</div>;
  }

  return (
    <div>
      {edges.map((edge) => (
        <button key={edge.id} onClick={() => onSelect(edge)}>
          {edge.label}
        </button>
      ))}
    </div>
  );
}