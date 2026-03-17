import type { StoryEdge } from "@/types/story";

interface StoryDecisionButtonsProps {
  edges: StoryEdge[];
  onSelect: (edge: StoryEdge) => void;
}

export default function StoryDecisionButtons({ edges, onSelect }: StoryDecisionButtonsProps) {
  if (edges.length === 0) {
    return (
      <div className="rounded-md border border-slate-700/80 bg-slate-900/40 px-3 py-2 text-sm text-slate-200">
        Fim deste ramo da história.
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-3">
      {edges.map((edge) => (
        <button
          key={edge.id}
          type="button"
          onClick={() => onSelect(edge)}
          className="inline-flex items-center rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-slate-50 shadow-sm transition-transform transition-colors hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 active:scale-[0.97]"
        >
          {edge.label}
        </button>
      ))}
    </div>
  );
}