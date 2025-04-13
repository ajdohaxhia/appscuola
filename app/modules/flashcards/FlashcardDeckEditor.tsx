'use client';

import React, { useState, useMemo } from 'react';
import { type Flashcard, type FlashcardSet } from '@/app/lib/db';
import { Plus, Trash2, ChevronDown, ChevronUp, Edit, Save, X, BookOpen } from 'lucide-react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface FlashcardDeckEditorProps {
  set: FlashcardSet;
  cards: Flashcard[];
  isLoadingCards: boolean;
  isEditingSetInfo: boolean;
  onUpdateSetInfo: (id: number, updates: Partial<FlashcardSet>) => Promise<void>;
  onAddFlashcard: (cardData: { front: string; back: string }) => Promise<void>;
  onUpdateFlashcard: (id: number, updates: Partial<Flashcard>) => Promise<void>;
  onDeleteFlashcard: (id: number) => Promise<void>;
  onStartStudy: () => void;
  setIsEditingSetInfo: (isEditing: boolean) => void;
}

const FlashcardDeckEditor: React.FC<FlashcardDeckEditorProps> = ({
  set,
  cards,
  isLoadingCards,
  isEditingSetInfo,
  onUpdateSetInfo,
  onAddFlashcard,
  onUpdateFlashcard,
  onDeleteFlashcard,
  onStartStudy,
  setIsEditingSetInfo
}) => {
  const [expandedCardId, setExpandedCardId] = useState<number | null>(null);
  const [newCardFront, setNewCardFront] = useState('');
  const [newCardBack, setNewCardBack] = useState('');
  const [showNewCardForm, setShowNewCardForm] = useState(false);
  
  const [editableTitle, setEditableTitle] = useState(set.title);
  const [editableDescription, setEditableDescription] = useState(set.description || '');

  const toggleCardExpanded = (cardId: number) => {
    setExpandedCardId(expandedCardId === cardId ? null : cardId);
  };

  const handleAddFlashcard = async () => {
    if (newCardFront.trim() && newCardBack.trim()) {
      setShowNewCardForm(true);
    }
  };

  const handleUpdateLocalFlashcard = (cardId: number, field: 'front' | 'back', value: string) => {
    const cardToUpdate = cards.find(c => c.id === cardId);
    if (cardToUpdate) {
      onUpdateFlashcard(cardId, { [field]: value });
    }
  };
  
  const handleSaveSetInfo = async () => {
    setIsEditingSetInfo(false);
    try {
      await onUpdateSetInfo(set.id!, { title: editableTitle, description: editableDescription });
    } catch (error) {
      console.error("Error updating set info:", error);
    }
  };

  const sortedCards = useMemo(() => {
    if (!cards) return [];
    return [...cards].sort((a, b) => {
        const dateA = a.createdAt?.getTime() ?? 0;
        const dateB = b.createdAt?.getTime() ?? 0;
        return dateB - dateA;
    });
  }, [cards]);

  return (
    <div className="p-6 flex flex-col h-full">
      <div className="flex justify-between items-start mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
        <div>
          {isEditingSetInfo ? (
            <div className="space-y-2">
              <input 
                type="text" 
                value={editableTitle}
                onChange={(e) => setEditableTitle(e.target.value)}
                className="text-2xl font-bold bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary-light w-full"
              />
              <textarea
                value={editableDescription}
                onChange={(e) => setEditableDescription(e.target.value)}
                placeholder="Descrizione del set (opzionale)"
                rows={2}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-primary bg-white dark:bg-gray-700 text-sm"
              />
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{set.title}</h2>
              {set.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{set.description}</p>
              )}
            </>
          )}
        </div>
        <div className="flex space-x-2 flex-shrink-0 ml-4">
          {isEditingSetInfo ? (
            <>
              <button 
                onClick={() => setIsEditingSetInfo(false)} 
                className="p-2 rounded-md text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
                aria-label="Annulla modifica"
              >
                <X size={18} />
              </button>
              <button 
                onClick={handleSaveSetInfo}
                className="flex items-center px-3 py-1.5 bg-primary text-white rounded-md hover:bg-primary-light transition-colors shadow-sm"
                aria-label="Salva modifiche set"
              >
                <Save size={16} className="mr-1" />
                Salva
              </button>
            </>
          ) : (
            <>
             {cards.length > 0 && (
                  <button 
                    onClick={onStartStudy}
                    className="flex items-center px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors shadow-sm"
                    aria-label="Inizia studio"
                  >
                    <BookOpen size={16} className="mr-1" />
                    Studia
                  </button>
              )}
              <button 
                onClick={() => setIsEditingSetInfo(true)} 
                className="p-2 rounded-md text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
                aria-label="Modifica informazioni set"
              >
                <Edit size={18} />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
          {cards.length} Flashcard{cards.length !== 1 ? 's' : ''}
        </h3>
        <button
          onClick={() => setShowNewCardForm(!showNewCardForm)}
          className="flex items-center px-3 py-1.5 bg-primary hover:bg-primary-light text-white rounded-md transition-colors shadow-sm"
        >
          <Plus size={16} className="mr-1" />
          {showNewCardForm ? 'Annulla' : 'Aggiungi Flashcard'}
        </button>
      </div>

      {showNewCardForm && (
        <div className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 shadow-sm">
          <div className="mb-4">
            <label htmlFor="new-card-front" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Fronte</label>
            <textarea
              id="new-card-front"
              value={newCardFront}
              onChange={(e) => setNewCardFront(e.target.value)}
              placeholder="Inserisci la domanda o il termine"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-primary bg-white dark:bg-gray-700 text-sm"
              rows={3}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="new-card-back" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Retro</label>
            <textarea
              id="new-card-back"
              value={newCardBack}
              onChange={(e) => setNewCardBack(e.target.value)}
              placeholder="Inserisci la risposta o la definizione"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-primary bg-white dark:bg-gray-700 text-sm"
              rows={3}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setShowNewCardForm(false)}
              className="px-4 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Annulla
            </button>
            <button
              onClick={handleAddFlashcard}
              className="px-4 py-1.5 bg-primary hover:bg-primary-light text-white rounded-md text-sm disabled:opacity-50 transition-colors"
              disabled={!newCardFront.trim() || !newCardBack.trim()}
            >
              Aggiungi
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto -mr-6 pr-6">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Flashcard nel Set ({isLoadingCards ? '...' : sortedCards.length})
        </h3>
        
        {isLoadingCards ? (
          <div className="space-y-3">
            <Skeleton height={100} count={3} />
          </div>
        ) : sortedCards.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
              <BookOpen className="mx-auto h-10 w-10 mb-2" />
              <p>Questo set non ha ancora nessuna flashcard.</p>
              <p className="text-sm">Clicca su "Aggiungi Flashcard" per crearne una.</p>
            </div>
        ) : (
            <div className="space-y-3">
                {sortedCards.map((card) => (
                    <div 
                      key={card.id} 
                      className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex flex-col"
                    >
                        <div 
                          className="flex justify-between items-start p-3 cursor-pointer"
                          onClick={() => toggleCardExpanded(card.id!)}
                        >
                          <div className="flex-1 mr-2">
                            <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Fronte</label>
                            {isEditingSetInfo ? (
                              <textarea
                                value={card.front}
                                onChange={(e) => handleUpdateLocalFlashcard(card.id!, 'front', e.target.value)}
                                className="w-full p-1 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-primary bg-white dark:bg-gray-700 text-sm"
                                rows={2}
                              />
                            ) : (
                              <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{card.front}</p>
                            )}
                          </div>
                          
                          <div className="flex items-center flex-shrink-0">
                            {isEditingSetInfo && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation(); 
                                  onDeleteFlashcard(card.id!);
                                }}
                                className="p-1 mr-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors rounded-full hover:bg-red-100 dark:hover:bg-red-900/30"
                                aria-label="Elimina flashcard"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                            <button 
                                onClick={() => toggleCardExpanded(card.id!)} 
                                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                aria-label={expandedCardId === card.id ? "Chiudi" : "Espandi"}
                            >
                                {expandedCardId === card.id ? (
                                  <ChevronUp size={20} />
                                ) : (
                                  <ChevronDown size={20} />
                                )}
                            </button>
                          </div>
                        </div>
                        
                        {expandedCardId === card.id && (
                          <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-850">
                            <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Retro</label>
                            {isEditingSetInfo ? (
                              <textarea
                                value={card.back}
                                onChange={(e) => handleUpdateLocalFlashcard(card.id!, 'back', e.target.value)}
                                className="w-full p-1 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-primary bg-white dark:bg-gray-700 text-sm"
                                rows={3}
                              />
                            ) : (
                              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{card.back}</p>
                            )}
                          </div>
                        )}
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default FlashcardDeckEditor; 