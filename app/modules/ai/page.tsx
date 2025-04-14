'use client';

import { useState } from 'react';
import { AIChatModule } from './AIChatModule';
import AICodeModule from './AICodeModule';
import AIImageModule from './AIImageModule';
import { MessageSquare, Code, Image as ImageIcon } from 'lucide-react';

type AIMode = 'chat' | 'code' | 'image';

export default function AIPage() {
  const [mode, setMode] = useState<AIMode>('chat');

  const modes = [
    { id: 'chat', label: 'AI Chat', icon: MessageSquare },
    { id: 'code', label: 'Code Generation', icon: Code },
    { id: 'image', label: 'Image Generation', icon: ImageIcon },
  ] as const;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-center space-x-4 p-4 border-b">
        {modes.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setMode(id as AIMode)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              mode === id
                ? 'bg-primary text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto">
        {mode === 'chat' && <AIChatModule />}
        {mode === 'code' && <AICodeModule />}
        {mode === 'image' && <AIImageModule />}
      </div>
    </div>
  );
} 