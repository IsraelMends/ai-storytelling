interface StoryReaderProps {
  storyTitle: string;
  nodeTitle: string;
  nodeText: string;
}

export default function StoryReader({ storyTitle, nodeTitle, nodeText }: StoryReaderProps) {
  return (
    <>
      <h1>{storyTitle}</h1>
      <h2>{nodeTitle}</h2>
      <p>{nodeText}</p>
    </>
  );
}