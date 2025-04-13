'use client';

import React from 'react';
import { Search, Plus, Trash2 } from 'lucide-react';
import { Note } from '@/app/lib/db';
import { formatDistanceToNow } from 'date-fns';
import { it } from 'date-fns/locale';

interface NoteSidebarProps {
  notes: Note[];
  currentNoteId: number | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectNote: (id: number) => void;
  onCreateNote: () => void;
  onDeleteNote: (id: number) => void;
  loading: boolean;
}

const NoteSidebar: React.FC<NoteSidebarProps> = ({
  notes,
  currentNoteId,
  searchQuery,
  onSearchChange,
  onSelectNote,
  onCreateNote,
  onDeleteNote,
  loading
}) => {
  // Funzione per estrarre un breve riassunto dal contenuto
  const getSummary = (content: string): string => {
    return content.length > 100 
      ? content.substring(0, 100).replace(/<[^>]*>?/gm, '') + '...'
      : content.replace(/<[^>]*>?/gm, '');
  };

  return (
    <div className="w-80 border-r border-gray-200 dark:border-gray-700 h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Note</h2>
          <button
            onClick={onCreateNote}
            className="flex items-center p-2 bg-primary hover:bg-primary-light text-white rounded-full"
            title="Crea nuova nota"
          >
            <Plus size={18} />
          </button>
        </div>
        
        <div className="relative">
          <input
            type="text"
            placeholder="Cerca nelle note..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 pr-4 py-2 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-24">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : notes.length > 0 ? (
          <ul>
            {notes.map((note) => (
              <li 
                key={note.id} 
                className={`border-b border-gray-200 dark:border-gray-700 relative ${
                  currentNoteId === note.id 
                    ? 'bg-primary-light/20 dark:bg-primary-dark/30' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <button
                  onClick={() => onSelectNote(note.id!)}
                  className="block w-full text-left p-4"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium mb-1 truncate pr-8">{note.title}</h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDistanceToNow(new Date(note.updatedAt), { 
                        addSuffix: true,
                        locale: it 
                      })}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
                    {getSummary(note.content)}
                  </p>
                  
                  {note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {note.tags.slice(0, 3).map((tag, index) => (
                        <span 
                          key={index} 
                          className="text-xs px-1.5 py-0.5 bg-primary-light/20 text-primary-dark dark:bg-primary-dark/30 dark:text-primary-light rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                      {note.tags.length > 3 && (
                        <span className="text-xs px-1.5 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700">
                          +{note.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteNote(note.id!);
                  }}
                  className="absolute top-4 right-4 p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                  title="Elimina nota"
                >
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 text-gray-500 dark:text-gray-400">
            {searchQuery ? (
              <>
                <p className="mb-2">Nessun risultato per "{searchQuery}"</p>
                <button
                  onClick={() => onSearchChange('')}
                  className="text-primary hover:text-primary-light underline"
                >
                  Cancella ricerca
                </button>
              </>
            ) : (
              <>
                <p className="mb-2">Non hai ancora creato note</p>
                <button
                  onClick={onCreateNote}
                  className="flex items-center p-2 bg-primary hover:bg-primary-light text-white rounded-md"
                >
                  <Plus size={18} className="mr-1" />
                  Crea la prima nota
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NoteSidebar; 