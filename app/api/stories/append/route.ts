import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { StoryEdge, StoryNode } from '@/types/story'

type AppendBody = {
  storyId: string;
  baseNodeId: string;
  newNodeData: { title: string; text: string; isEnding?: boolean };
  newEdgeLabel: string;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as AppendBody;

    const storyId = String(body?.storyId ?? '')
    const baseNodeId = String(body?.baseNodeId ?? '');
    const newEdgeLabel = String(body?.newEdgeLabel ?? '').trim();
    const title = String(body?.newNodeData?.title ?? 'Novo nó');
    const text = String(body?.newNodeData?.text ?? '');
    const isEnding = Boolean(body?.newNodeData?.isEnding ?? false);

    if (!storyId || !baseNodeId || !newEdgeLabel || !text) {
      return NextResponse.json(
        { error: "storyId, baseNodeId, newEdgeLabel e newNodeData.text são obrigatórios" },
        { status: 400 }
      );
    }

    const baseNode = await prisma.storyNode.findUnique({ where: { id: baseNodeId } })
    if (!baseNode || baseNode.storyId !== storyId) {
      return NextResponse.json(
        { error: "baseNodeId inválido para este storyId" },
        { status: 400 }
      )
    }

    const result = await prisma.$transaction(async (tx) => {
      const db = tx as unknown as typeof prisma
      const createdNodeRaw = await db.storyNode.create({
        data: {
          storyId,
          title,
          text,
          isStart: false,
          isEnding,
        }
      })

      const createdEdgeRaw = await db.storyEdge.create({
        data: {
          storyId,
          fromNodeId: baseNodeId,
          toNodeId: createdNodeRaw.id,
          label: newEdgeLabel,
        },
      })

      const createdNode: StoryNode = {
        id: createdNodeRaw.id,
        title: createdNodeRaw.title,
        text: createdNodeRaw.text,
        isStart: createdNodeRaw.isStart,
        isEnding: createdNodeRaw.isEnding,
        createdAt: createdNodeRaw.createdAt.toISOString(),
        createdBy: createdNodeRaw.createdBy ?? undefined,
      };

      const createdEdge: StoryEdge = {
        id: createdEdgeRaw.id,
        from: createdEdgeRaw.fromNodeId,
        to: createdEdgeRaw.toNodeId,
        label: createdEdgeRaw.label,
      };

      return { createdNode, createdEdge };
    })

    return NextResponse.json(result, { status: 201 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Erro ao anexar nó e aresta";
    return NextResponse.json(
      { error: message },
      { status: 500 },
    )
  }
}