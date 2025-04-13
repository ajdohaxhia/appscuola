'use client';

import React from 'react';
import { Search, Plus, Trash2 } from 'lucide-react';
import { FlashcardDeck } from '@/app/lib/db';
import { formatDistanceToNow } from 'date-fns';
import { it } from 'date-fns/locale';

interface FlashcardDeckSidebarProps {
  decks: FlashcardDeck[];
  currentDeckId: number | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectDeck: (id: number) => void;
  onCreateDeck: () => void;
  onDeleteDeck: (id: number) => void;
  loading: boolean;
}

const FlashcardDeckSidebar: React.FC<FlashcardDeckSidebarProps> = ({
  decks,
  currentDeckId,
  searchQuery,
  onSearchChange,
  onSelectDeck,
  onCreateDeck,
  onDeleteDeck,
  loading
}) => {
  return (
    <div className="w-80 border-r border-gray-200 dark:border-gray-700 h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Flashcards</h2>
          <button
            onClick={onCreateDeck}
            className="flex items-center p-2 bg-primary hover:bg-primary-light text-white rounded-full"
            title="Crea nuovo mazzo"
          >
            <Plus size={18} />
          </button>
        </div>
        
        <div className="relative">
          <input
            type="text"
            placeholder="Cerca nei mazzi..."
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
        ) : decks.length > 0 ? (
          <ul>
            {decks.map((deck) => (
              <li 
                key={deck.id} 
                className={`border-b border-gray-200 dark:border-gray-700 relative ${
                  currentDeckId === deck.id 
                    ? 'bg-primary-light/20 dark:bg-primary-dark/30' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <button
                  onClick={() => onSelectDeck(deck.id!)}
                  className="block w-full text-left p-4"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium mb-1 truncate pr-8">{deck.title}</h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDistanceToNow(new Date(deck.updatedAt), { 
                        addSuffix: true,
                        locale: it 
                      })}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
                    {deck.description}
                  </p>
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteDeck(deck.id!);
                  }}
                  className="absolute top-4 right-4 p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                  title="Elimina mazzo"
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
                <p className="mb-2">Non hai ancora creato mazzi di flashcard</p>
                <button
                  onClick={onCreateDeck}
                  className="flex items-center p-2 bg-primary hover:bg-primary-light text-white rounded-md"
                >
                  <Plus size={18} className="mr-1" />
                  Crea il primo mazzo
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FlashcardDeckSidebar; 