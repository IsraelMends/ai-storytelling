import type { Story, StoryEdge, StoryNode } from "@/types/story";

export type StoryGraph = {
  story: Story;
  nodes: StoryNode[];
  edges: StoryEdge[];
  currentNodeId: string | null;
};

export type AppendResult = {
  createdNode: StoryNode;
  createdEdge: StoryEdge;
};

function getErrorMessage(data: unknown, fallback: string) {
  if (typeof data !== "object" || data === null) return fallback;
  if ("error" in data && typeof (data as Record<string, unknown>).error === "string") {
    return (data as Record<string, unknown>).error as string;
  }
  if ("message" in data && typeof (data as Record<string, unknown>).message === "string") {
    return (data as Record<string, unknown>).message as string;
  }
  return fallback;
}

async function requestJSON<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    }
  })

  const text = await res.text();
  const data: unknown = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const message = getErrorMessage(data, `HTTP ${res.status}`);
    throw new Error(message);
  }

  return data as T
}

export async function getStoryById(storyId: string) {
  return requestJSON<StoryGraph>(`/api/stories/${encodeURIComponent(storyId)}`, {
    method: 'GET',
  })
}

export async function createStory(data: { title?: string }) {
  return requestJSON<StoryGraph>('/api/stories', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

export async function appendNodeAndEdge(params: {
  storyId: string;
  baseNodeId: string;
  newNodeData: { title: string; text: string; isEnding?: boolean };
  newEdgeLabel: string;
}) {
  return requestJSON<AppendResult>(`/api/stories/append`, {
    method: 'POST',
    body: JSON.stringify(params),
  })
}