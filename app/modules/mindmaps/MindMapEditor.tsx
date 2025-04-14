'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  Background,
  Controls,
  Node,
  Edge,
  Connection,
  useNodesState,
  useEdgesState
} from 'reactflow';
import 'reactflow/dist/style.css';
import { MindMap } from '@/app/lib/db';
import { PlusCircle, X } from 'lucide-react';

const nodeTypes = {};

interface MindMapEditorProps {
  mindMap: MindMap;
  isEditing: boolean;
  onChange: (nodes: string, edges: string) => void;
}

const MindMapEditor: React.FC<MindMapEditorProps> = ({ mindMap, isEditing, onChange }) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  
  // Parse nodes and edges from strings to objects
  const initialNodes = React.useMemo(() => {
    try {
      return mindMap.nodes ? JSON.parse(mindMap.nodes) : [];
    } catch (e) {
      console.error('Error parsing nodes:', e);
      return [];
    }
  }, [mindMap.nodes]);
  
  const initialEdges = React.useMemo(() => {
    try {
      return mindMap.edges ? JSON.parse(mindMap.edges) : [];
    } catch (e) {
      console.error('Error parsing edges:', e);
      return [];
    }
  }, [mindMap.edges]);
  
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [nodeName, setNodeName] = useState('');
  const [showNodeForm, setShowNodeForm] = useState(false);
  const [formPosition, setFormPosition] = useState({ x: 0, y: 0 });

  // When nodes or edges change, convert to JSON strings and call onChange
  useEffect(() => {
    try {
      const nodesString = JSON.stringify(nodes);
      const edgesString = JSON.stringify(edges);
      onChange(nodesString, edgesString);
    } catch (e) {
      console.error('Error stringifying nodes/edges:', e);
    }
  }, [nodes, edges, onChange]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      if (reactFlowWrapper.current && reactFlowInstance) {
        const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
        const position = reactFlowInstance.project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });

        setFormPosition(position);
        setShowNodeForm(true);
      }
    },
    [reactFlowInstance]
  );

  const addNode = () => {
    if (!nodeName.trim()) return;

    const newNode: Node = {
      id: `node-${Date.now()}`,
      data: { label: nodeName },
      position: formPosition,
      type: 'default',
    };

    setNodes((nds) => nds.concat(newNode));
    setNodeName('');
    setShowNodeForm(false);
  };

  const handlePaneClick = useCallback(() => {
    setShowNodeForm(false);
  }, []);

  const handleButtonClick = useCallback((event: React.MouseEvent) => {
    if (reactFlowWrapper.current && reactFlowInstance) {
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      setFormPosition(position);
      setShowNodeForm(true);
    }
    event.stopPropagation();
  }, [reactFlowInstance]);

  return (
    <div className="h-full w-full" ref={reactFlowWrapper}>
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onPaneClick={handlePaneClick}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="bottom-right"
          proOptions={{ hideAttribution: true }}
          deleteKeyCode={['Backspace', 'Delete']}
        >
          <Background />
          <Controls />
          {isEditing && (
            <div className="absolute bottom-4 right-4">
              <button 
                className="flex items-center p-2 bg-primary hover:bg-primary-light text-white rounded-full"
                onClick={handleButtonClick}
              >
                <PlusCircle size={24} />
              </button>
            </div>
          )}
        </ReactFlow>
        {showNodeForm && (
          <div 
            className="absolute bg-white dark:bg-gray-800 shadow-lg rounded-md p-3 z-10"
            style={{ 
              top: formPosition.y, 
              left: formPosition.x 
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">Nuovo nodo</h3>
              <button 
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowNodeForm(false)}
              >
                <X size={16} />
              </button>
            </div>
            <div className="flex">
              <input
                type="text"
                value={nodeName}
                onChange={(e) => setNodeName(e.target.value)}
                placeholder="Nome del nodo"
                className="p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-l-md w-48 focus:outline-none focus:ring-2 focus:ring-primary"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    addNode();
                  }
                }}
              />
              <button
                className="bg-primary hover:bg-primary-light text-white px-3 rounded-r-md"
                onClick={addNode}
              >
                Aggiungi
              </button>
            </div>
          </div>
        )}
      </ReactFlowProvider>
    </div>
  );
};

export default MindMapEditor; 