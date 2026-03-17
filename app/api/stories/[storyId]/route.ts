import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Story, StoryEdge, StoryNode } from "@/types/story";

function toStoryNode(n: {
  id: string;
  title: string;
  text: string;
  isStart: boolean;
  isEnding: boolean;
  createdAt: Date;
  createdBy: string | null;
}): StoryNode {
  return {
    id: n.id,
    title: n.title,
    text: n.text,
    isStart: n.isStart,
    isEnding: n.isEnding,
    createdAt: n.createdAt.toISOString(),
    createdBy: n.createdBy ?? undefined,
  };
}

function toStoryEdge(e: {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  label: string;
}): StoryEdge {
  return {
    id: e.id,
    from: e.fromNodeId,
    to: e.toNodeId,
    label: e.label,
  };
}

export async function GET(
  _req: Request,
  context: {params: Promise<{storyId: string}>}
) {
  try {
    const { storyId } = await context.params;

    const story = await prisma.story.findUnique({ where: { id: storyId } });
    if (!story) {
      return NextResponse.json({error: 'Story not found'}, {status:404})
    }

    const [rawNodes, rawEdges] = await Promise.all([
      prisma.storyNode.findMany({
        where: { storyId },
        orderBy: { createdAt: 'asc' },
      }),
      prisma.storyEdge.findMany({
        where: { storyId },
        orderBy: { createdAt: 'asc' },
      })
    ])

    const nodes = rawNodes.map(toStoryNode);
    const edges = rawEdges.map(toStoryEdge);

    const startNode = nodes.find((n) => n.isStart) ?? nodes[0] ?? null;

    const storyWithGraph: Story = {
      id: story.id,
      title: story.title,
      description: story.description,
      createdAt: story.createdAt.toISOString(),
      createdBy: story.createdBy ?? undefined,
      isPublic: story.isPublic,
      nodes,
      edges,
    };

    return NextResponse.json(
      {
        story: storyWithGraph,
        nodes,
        edges,
        currentNodeId: startNode?.id ?? null,
      },
      { status: 200 },
    )
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Erro ao buscar story';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}
