import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Story, StoryNode } from "@/types/story";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const title = String(body?.title ?? "Nova história");

    const story = await prisma.story.create({
      data:{title, description: "Descrição da história"},
    })

    // Cria nó inicial
    const startNode = await prisma.storyNode.create({
      data: {
        storyId: story.id,
        title: "Início",
        text: 'A história começa aqui',
        isStart: true,
        isEnding: false,
      }
    })

    const node: StoryNode = {
      id: startNode.id,
      title: startNode.title,
      text: startNode.text,
      isStart: startNode.isStart,
      isEnding: startNode.isEnding,
      createdAt: startNode.createdAt.toISOString(),
      createdBy: startNode.createdBy ?? undefined,
    };

    const storyWithGraph: Story = {
      id: story.id,
      title: story.title,
      description: story.description,
      createdAt: story.createdAt.toISOString(),
      createdBy: story.createdBy ?? undefined,
      isPublic: story.isPublic,
      nodes: [node],
      edges: [],
    };

    return NextResponse.json(
      {
        story: storyWithGraph,
        nodes: [node],
        edges: [],
        currentNodeId: node.id
      },
      {status:201}
    )
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Erro ao criar história";
    return NextResponse.json(
      { error: message },
      { status: 500}
    )
  }
}