interface StoryReaderProps {
  storyTitle: string;
  nodeTitle: string;
  nodeText: string;
}

export default function StoryReader({ storyTitle, nodeTitle, nodeText }: StoryReaderProps) {
  return (
    <section className="space-y-3 animate-[fadeIn_260ms_ease-out]">
      <header className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
          {storyTitle}
        </h1>
        <h2 className="text-lg md:text-xl font-medium text-sky-300">
          {nodeTitle}
        </h2>
      </header>
      <p className="leading-relaxed text-slate-100">
        {nodeText}
      </p>
    </section>
  );
}