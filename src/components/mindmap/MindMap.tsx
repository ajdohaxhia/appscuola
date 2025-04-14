import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Node, Edge, useNodesState, useEdgesState, ReactFlow, Controls, Background, Panel, addEdge } from 'reactflow';
import 'reactflow/dist/style.css';
import MindMapNode from './MindMapNode';
import MindMapEdge from './MindMapEdge';
import { AISuggestions } from './AISuggestions';
import { ExportOptions } from './ExportOptions';
import { cn } from '../../utils/cn';
import { Button } from '../ui/button';
import { Plus, Trash2, Save, Download, Share2, Sparkles } from 'lucide-react';

const nodeTypes = {
  mindmap: MindMapNode,
};

const edgeTypes = {
  mindmap: MindMapEdge,
};

interface MindMapProps {
  initialNodes?: Node[];
  initialEdges?: Edge[];
  onSave?: (nodes: Node[], edges: Edge[]) => void;
  onExport?: (format: 'svg' | 'png' | 'pdf') => void;
  onShare?: () => void;
}

export const MindMap: React.FC<MindMapProps> = ({
  initialNodes = [],
  initialEdges = [],
  onSave,
  onExport,
  onShare,
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [showExportOptions, setShowExportOptions] = useState(false);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  const onConnect = useCallback(
    (params: any) => {
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const onAddNode = useCallback(() => {
    if (!reactFlowInstance) return;

    const position = reactFlowInstance.project({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    });

    const newNode: Node = {
      id: `node-${nodes.length + 1}`,
      type: 'mindmap',
      position,
      data: { label: 'New Node' },
    };

    setNodes((nds) => [...nds, newNode]);
  }, [nodes.length, reactFlowInstance, setNodes]);

  const onDeleteNode = useCallback(() => {
    if (!selectedNode) return;

    setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id));
    setEdges((eds) =>
      eds.filter(
        (edge) =>
          edge.source !== selectedNode.id && edge.target !== selectedNode.id
      )
    );
    setSelectedNode(null);
  }, [selectedNode, setNodes, setEdges]);

  const onSaveMap = useCallback(() => {
    if (onSave) {
      onSave(nodes, edges);
    }
  }, [nodes, edges, onSave]);

  const onExportMap = useCallback(
    (format: 'svg' | 'png' | 'pdf') => {
      if (onExport) {
        onExport(format);
      }
    },
    [onExport]
  );

  const handleSuggestionSelect = useCallback(
    (suggestion: string) => {
      if (!selectedNode || !reactFlowInstance) return;

      const position = reactFlowInstance.project({
        x: selectedNode.position.x + 200,
        y: selectedNode.position.y,
      });

      const newNode: Node = {
        id: `node-${nodes.length + 1}`,
        type: 'mindmap',
        position,
        data: { label: suggestion },
      };

      const newEdge: Edge = {
        id: `edge-${selectedNode.id}-${newNode.id}`,
        source: selectedNode.id,
        target: newNode.id,
        type: 'mindmap',
      };

      setNodes((nds) => [...nds, newNode]);
      setEdges((eds) => [...eds, newEdge]);
    },
    [selectedNode, nodes.length, reactFlowInstance, setNodes, setEdges]
  );

  return (
    <div className="w-full h-full" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onInit={setReactFlowInstance}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
      >
        <Background />
        <Controls />
        <Panel position="top-right" className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onAddNode}
            title="Add Node"
            className="h-8 w-8 p-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onDeleteNode}
            disabled={!selectedNode}
            title="Delete Node"
            className="h-8 w-8 p-0"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onSaveMap}
            title="Save Map"
            className="h-8 w-8 p-0"
          >
            <Save className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowExportOptions(!showExportOptions)}
            title="Export Options"
            className="h-8 w-8 p-0"
          >
            <Download className="h-4 w-4" />
          </Button>
          {selectedNode && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAISuggestions(!showAISuggestions)}
              title="AI Suggestions"
              className="h-8 w-8 p-0"
            >
              <Sparkles className="h-4 w-4" />
            </Button>
          )}
          {onShare && (
            <Button
              variant="outline"
              size="sm"
              onClick={onShare}
              title="Share Map"
              className="h-8 w-8 p-0"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          )}
        </Panel>
        {showAISuggestions && selectedNode && (
          <Panel position="top-left" className="w-64">
            <AISuggestions
              onSuggestionSelect={handleSuggestionSelect}
              context={selectedNode.data.label}
            />
          </Panel>
        )}
        {showExportOptions && (
          <Panel position="bottom-right" className="w-64">
            <ExportOptions onExport={onExportMap} onShare={onShare} />
          </Panel>
        )}
      </ReactFlow>
    </div>
  );
}; 