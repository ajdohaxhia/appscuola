'use client';

import React, { useState, useCallback } from 'react';
import { MindMap } from '@/components/mindmap/MindMap';
import { Node, Edge } from 'reactflow';

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'mindmap',
    position: { x: 0, y: 0 },
    data: { label: 'Main Topic' },
  },
];

const initialEdges: Edge[] = [];

export default function MindMapPage() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  const handleSave = useCallback((newNodes: Node[], newEdges: Edge[]) => {
    setNodes(newNodes);
    setEdges(newEdges);
    // Here you would typically save to a database or local storage
    console.log('Saving mind map:', { nodes: newNodes, edges: newEdges });
  }, []);

  const handleExport = useCallback((format: 'svg' | 'png' | 'pdf') => {
    // Here you would implement the export functionality
    console.log('Exporting mind map as:', format);
  }, []);

  const handleShare = useCallback(() => {
    // Here you would implement the sharing functionality
    console.log('Sharing mind map');
  }, []);

  return (
    <div className="w-full h-screen">
      <MindMap
        initialNodes={nodes}
        initialEdges={edges}
        onSave={handleSave}
        onExport={handleExport}
        onShare={handleShare}
      />
    </div>
  );
} 