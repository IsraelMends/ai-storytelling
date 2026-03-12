export type StoryId = string;
export type NodeId = string;

/**
 * Um ponto da narrativa ( trecho da história )
 */

export interface StoryNode {
  id: NodeId;
  title: string;
  text: string;
  isStart?: boolean;
  isEnding?: boolean;
  createdAt: string;
  createdBy?: string;
}
/**
 * Uma decisão que liga um nó a outro
 */

export interface StoryEdge {
  id: string;
  from: NodeId;
  to: NodeId;
  label: string;
}

/**
 * Uma história completa (conjunto de nós e ligações)
 */

export interface Story {
  id: StoryId;
  title: string;
  description: string;
  nodes: StoryNode[];
  edges: StoryEdge[];
  createdAt: string;
  createdBy?: string;
  isPublic?: boolean;
}