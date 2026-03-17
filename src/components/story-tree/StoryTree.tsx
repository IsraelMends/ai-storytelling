'use client'

import { useMemo } from 'react';
import { ReactFlow, Background, Controls, MiniMap, ReactFlowProvider } from 'reactflow';
import 'reactflow/dist/style.css';
import { useStory } from '@/contexts/StoryContext';
import type { Node, Edge } from 'reactflow';

const NODE_WIDTH = 120;
const NODE_HEIGHT = 90;
const HORIZONTAL_GAP = 140;
const VERTICAL_GAP = 110;

export function StoryTree() {
  const { currentStory, currentNodeId } = useStory();

  // Profissionalização: tratamento para histórias ou edges indefinidos/vazios
  const { nodes, edges } = useMemo(() => {
    const storyNodes = Array.isArray(currentStory?.nodes) ? currentStory.nodes : [];
    const storyEdges = Array.isArray(currentStory?.edges) ? currentStory.edges : [];

    // Layout automático grid simples (pode evoluir para tree layout no futuro)
    const flowNodes: Node[] = storyNodes.map((node, index) => {
      const isCurrent = node.id === currentNodeId;

      return {
        id: node.id,
        type: 'default',
        position: {
          x: (index % 4) * (NODE_WIDTH + HORIZONTAL_GAP),
          y: Math.floor(index / 4) * (NODE_HEIGHT + VERTICAL_GAP),
        },
        data: {
          label: node.title && node.title.trim().length > 0
            ? node.title
            : (node.text?.slice(0, 30) || 'Novo Nó') + (node.text?.length > 30 ? '...' : ''),
        },
        style: {
          width: NODE_WIDTH,
          height: NODE_HEIGHT,
          border: isCurrent ? '2px solid #38bdf8' : '1.5px solid #64748b',
          borderRadius: 8,
          background: isCurrent ? '#0f172a' : '#f7fafc',
          color: isCurrent ? '#f9fafb' : '#020617',
          fontSize: 14,
          boxShadow: isCurrent
            ? '0 0 0 1px rgba(56,189,248,0.5), 0 10px 30px rgba(15,23,42,0.45)'
            : '0 2px 12px 0 rgba(30,41,59,0.08)',
          transition: 'box-shadow 150ms ease-out, transform 150ms ease-out',
        },
      };
    });

    const flowEdges: Edge[] = storyEdges.map((edge) => ({
      id: edge.id,
      source: edge.from,
      target: edge.to,
      label: edge.label,
      animated: !!edge.label,
      style: edge.label ? { stroke: '#2563eb' } : undefined,
      labelStyle: edge.label
        ? { fontWeight: 500, fontSize: 13, fill: '#2563eb' } : undefined,
    }));

    return { nodes: flowNodes, edges: flowEdges };
  }, [currentStory, currentNodeId]);

  return (
    <ReactFlowProvider>
      <div
        className="w-full h-[420px] border border-slate-700 rounded-lg bg-white"
        style={{
          minHeight: 360,
          boxShadow: '0 2px 12px 0 rgba(30,41,59,0.05)',
        }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          minZoom={0.25}
          maxZoom={2}
          defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
          nodesDraggable={false}
          elementsSelectable={false}
        >
          <Background color="#f1f5f9" gap={18} />
          <Controls showInteractive={false} />
          <MiniMap
            pannable
            nodeColor={n => '#2563eb'}
            maskColor="rgba(30,41,59,0.05)"
          />
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
}