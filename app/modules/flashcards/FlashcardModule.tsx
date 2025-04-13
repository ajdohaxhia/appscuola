'use client';

import React, { useState, useEffect, useCallback } from 'react';
// Remove useStore imports if no longer needed
// import { useStore } from '@/app/hooks/useStore'; 
import { dbService, type FlashcardSet, type Flashcard } from '@/app/lib/db'; // Use FlashcardSet
import { Plus, Search, Trash2, Save, BookOpen, Edit } from 'lucide-react'; // Added Edit icon
import FlashcardDeckSidebar from './FlashcardDeckSidebar';
import FlashcardDeckEditor from './FlashcardDeckEditor';
import FlashcardStudy from './FlashcardStudy';
import { SkeletonTheme } from 'react-loading-skeleton'; // Import SkeletonTheme
import Skeleton from 'react-loading-skeleton';        // Import Skeleton
import 'react-loading-skeleton/dist/skeleton.css'; // Import Skeleton CSS

export function FlashcardModule() { // Changed to named export if default export not needed
  const [sets, setSets] = useState<FlashcardSet[]>([]); // Renamed decks to sets
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [isLoadingSets, setIsLoadingSets] = useState<boolean>(true);
  const [isLoadingCards, setIsLoadingCards] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSet, setSelectedSet] = useState<FlashcardSet | null>(null);
  const [isEditingSet, setIsEditingSet] = useState<boolean>(false);
  const [isStudying, setIsStudying] = useState<boolean>(false);
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const [newSetName, setNewSetName] = useState('');
  const [newSetDescription, setNewSetDescription] = useState('');
  
  // Load flashcard sets from DB
  const loadSets = useCallback(async () => {
    setIsLoadingSets(true);
    try {
      const dbSets = await dbService.getFlashcardSets(); // Use new dbService method
      setSets(dbSets);
      // If a set was previously selected, try to find it in the new list
      if (selectedSet?.id) {
        const currentSet = dbSets.find(s => s.id === selectedSet.id);
        setSelectedSet(currentSet || null);
        if (!currentSet) {
          setFlashcards([]); // Clear cards if set is gone
          setIsEditingSet(false);
          setIsStudying(false);
        }
      }
    } catch (error) {
      console.error('Errore nel caricamento dei set di flashcard:', error);
    } finally {
      setIsLoadingSets(false);
    }
  }, [selectedSet?.id]); // Depend on selectedSet ID

  useEffect(() => {
    loadSets();
  }, [loadSets]);
  
  // Load flashcards for the selected set
  const loadFlashcards = useCallback(async (setId: number) => {
    if (!setId) return;
    setIsLoadingCards(true);
    try {
      const cards = await dbService.getFlashcardsBySetId(setId); // Use new dbService method
      setFlashcards(cards);
    } catch (error) {
      console.error('Errore nel caricamento delle flashcard:', error);
      setFlashcards([]); // Clear cards on error
    } finally {
      setIsLoadingCards(false);
    }
  }, []);

  // Load cards when selectedSet changes
  useEffect(() => {
    if (selectedSet?.id) {
      loadFlashcards(selectedSet.id);
    } else {
      setFlashcards([]); // Clear cards if no set is selected
    }
  }, [selectedSet?.id, loadFlashcards]);
  
  // Filter sets based on search query
  const filteredDecks = sets.filter(set => 
    set.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (set.description && set.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  // Create a new flashcard set
  const handleCreateSet = useCallback(async () => {
    const newSetData: Omit<FlashcardSet, 'id' | 'createdAt' | 'updatedAt'> = {
      title: 'Nuovo Set',
      description: '',
      category: 'Generale',
      icon: '📚' // Default icon
    };
    try {
      const newId = await dbService.addFlashcardSet(newSetData); // Use new dbService method
      const createdSet = await dbService.getFlashcardSetById(newId); // Use new dbService method
      if (createdSet) {
        setSets(prev => [createdSet, ...prev]);
        setSelectedSet(createdSet); // Select the new set
        setIsEditingSet(false); // Start by viewing, not editing metadata
        setIsStudying(false);
      }
    } catch (error) {
      console.error('Errore nella creazione del set:', error);
    }
  }, []);
  
  // Select a set
  const handleSelectSet = useCallback((setId: number) => {
    if (selectedSet?.id === setId) return; // Already selected
    
    const set = sets.find(s => s.id === setId);
    if (set) {
      setSelectedSet(set);
      setIsEditingSet(false);
      setIsStudying(false);
      // Flashcards will be loaded by the useEffect hook watching selectedSet.id
    } else {
      console.error("Selected set not found in state.");
      setSelectedSet(null);
    }
  }, [sets, selectedSet?.id]);
  
  // Delete a set
  const handleDeleteSet = useCallback(async (setId: number) => {
    if (!window.confirm("Sei sicuro di voler eliminare questo set e tutte le sue flashcard?")) return;
    try {
      await dbService.deleteFlashcardSet(setId); // Use new dbService method
      setSets(prevSets => prevSets.filter(set => set.id !== setId));
      if (selectedSet?.id === setId) {
        setSelectedSet(null); // Deselect if it was the current one
      }
    } catch (error) {
      console.error('Errore nell\'eliminazione del set:', error);
    }
  }, [selectedSet?.id]);
  
  // Update set metadata (title, description)
  const handleUpdateSet = useCallback(async (id: number, updates: Partial<FlashcardSet>) => {
    // Find the set to update from the current state using the ID
    const currentSet = sets.find(s => s.id === id);
    if (!currentSet) {
      console.error('Set to update not found:', id);
      return;
    }

    try {
      // Merge the current set data with the updates
      const setToUpdate = { ...currentSet, ...updates, updatedAt: new Date() };
      await dbService.updateFlashcardSet(setToUpdate); // Update in DB

      // Update the set in the local state
      const updatedSets = sets.map(set => 
        set.id === id ? setToUpdate : set
      );
      setSets(updatedSets);

      // If the updated set is the currently selected one, update selectedSet state as well
      if (selectedSet?.id === id) {
        setSelectedSet(setToUpdate); 
      }
      // Assuming setIsEditingSet(false) is handled within FlashcardDeckEditor on save
    } catch (error) {
      console.error('Errore nell\'aggiornamento del set:', error);
    }
  }, [sets, selectedSet?.id]);
  
  // --- Flashcard CRUD Operations (passed to Editor/Study) ---
  
  const handleAddFlashcard = useCallback(async (cardData: Pick<Flashcard, 'front' | 'back'>) => {
    if (!selectedSet?.id) return;
    try {
      // Pass setId along with front and back
      const newId = await dbService.addFlashcard({ ...cardData, setId: selectedSet.id }); 
      const newCard = await dbService.getFlashcardById(newId);
      if (newCard) {
        setFlashcards(prev => [newCard, ...prev].sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0))); // Add and resort
      }
    } catch (error) {
      console.error('Errore nell\'aggiunta della flashcard:', error);
    }
  }, [selectedSet?.id]);

  // This is the full update function used by the Study component
  const handleUpdateFullFlashcard = useCallback(async (updatedCard: Flashcard) => {
    if (!updatedCard.id || !selectedSet?.id) return;
    if (updatedCard.setId !== selectedSet.id) {
        console.error("Cannot update flashcard belonging to a different set.");
        return;
    }
    try {
      await dbService.updateFlashcard(updatedCard);
      setFlashcards(prev => 
        prev.map(card => card.id === updatedCard.id ? updatedCard : card)
      );
    } catch (error) {
      console.error('Errore nell\'aggiornamento della flashcard (studio):', error);
    }
  }, [selectedSet?.id]);
  
  // This is the partial update function used by the Editor component
  const handleUpdatePartialFlashcard = useCallback(async (id: number, updates: Partial<Flashcard>) => {
    if (!selectedSet?.id) return;
    const cardToUpdate = flashcards.find(c => c.id === id);
    if (!cardToUpdate) {
        console.error("Flashcard to update not found in local state.");
        return;
    } 
    if (updates.setId && updates.setId !== selectedSet.id) {
        console.error("Cannot update flashcard to belong to a different set.");
        return;
    }
    const updatedCardData = { ...cardToUpdate, ...updates };

    try {
      await dbService.updateFlashcard(updatedCardData); // Pass the complete object
      setFlashcards(prev => 
        prev.map(card => card.id === id ? updatedCardData : card)
      );
    } catch (error) {
      console.error('Errore nell\'aggiornamento della flashcard (editor):', error);
    }
  }, [selectedSet?.id, flashcards]);
  
  const handleDeleteFlashcard = useCallback(async (cardId: number) => {
    if (!selectedSet?.id) return;
    try {
      await dbService.deleteFlashcard(cardId); // Use new dbService method
      setFlashcards(prev => prev.filter(card => card.id !== cardId));
    } catch (error) {
      console.error('Errore nell\'eliminazione della flashcard:', error);
    }
  }, [selectedSet?.id]);

  // --- Study Mode Logic ---
  
  const handleStartStudy = () => {
    if (!selectedSet || flashcards.length === 0) return;
    setIsStudying(true);
    setIsEditingSet(false);
  };
  
  const handleEndStudy = () => {
    setIsStudying(false);
    // Optionally refresh cards after study session if reviews happened
    if (selectedSet?.id) {
      loadFlashcards(selectedSet.id);
    }
  };

  // --- Render Logic ---

  // Function to render the main content area based on state
  const renderMainContent = () => {
    if (isStudying && selectedSet) {
      return (
        <FlashcardStudy 
          key={`study-${selectedSet.id}`}
          set={selectedSet}
          initialFlashcards={flashcards}
          onUpdateFlashcard={handleUpdateFullFlashcard}
          onEndStudy={handleEndStudy}
          isLoading={isLoadingCards}
        />
      );
    } 
    
    if (selectedSet) {
      return (
        <FlashcardDeckEditor 
          key={`edit-${selectedSet.id}`}
          set={selectedSet}
          cards={flashcards}
          isEditingSetInfo={isEditingSet}
          onUpdateSetInfo={handleUpdateSet}
          onAddFlashcard={handleAddFlashcard}
          onUpdateFlashcard={handleUpdatePartialFlashcard}
          onDeleteFlashcard={handleDeleteFlashcard}
          onStartStudy={handleStartStudy}
          setIsEditingSetInfo={setIsEditingSet}
          isLoadingCards={isLoadingCards}
        />
      );
    } 
    
    // Placeholder when no set is selected
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
        <BookOpen className="w-16 h-16 mb-4 text-gray-300 dark:text-gray-600" />
        <h2 className="text-xl font-semibold mb-2">Seleziona un Set</h2>
        <p className="mb-4">Scegli un set dalla barra laterale per vedere le flashcard o iniziare a studiare.</p>
        <button
          onClick={() => { 
              setSelectedSet(null); 
              setIsEditingSet(false);
              setIsStudying(false); 
              setShowCreateForm(true); 
          }}
          className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors"
        >
          <Plus size={18} className="mr-1" />
          Crea un nuovo Set
        </button>
      </div>
    );
  };
  
  return (
    <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5"> {/* Wrap with SkeletonTheme */}
    <div className="flex h-full bg-gray-100 dark:bg-gray-900">
      <FlashcardDeckSidebar 
        decks={filteredDecks}
        currentDeckId={selectedSet?.id ?? null}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSelectDeck={handleSelectSet}
        onCreateDeck={handleCreateSet}
        onDeleteDeck={handleDeleteSet}
        loading={isLoadingSets}
      />
      
      <main className="flex-1 h-full overflow-y-auto">
        {showCreateForm ? (
           <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded shadow-md">
           <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Crea Nuovo Set</h3>
           <input 
             type="text"
             placeholder="Nome del Set"
             value={newSetName}
             onChange={(e) => setNewSetName(e.target.value)}
             className="w-full p-2 border rounded mb-3 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
           />
           <textarea 
             placeholder="Descrizione (opzionale)"
             value={newSetDescription}
             onChange={(e) => setNewSetDescription(e.target.value)}
             className="w-full p-2 border rounded mb-4 h-24 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
           />
           <div className="flex justify-end space-x-2">
            <button onClick={() => setShowCreateForm(false)} className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">Annulla</button>
            <button onClick={handleCreateSet} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded">Crea</button>
           </div>
         </div>
        ) : renderMainContent()} 
      </main>
    </div>
    </SkeletonTheme>
  );
}

// Add default export if this is the primary export for the route
export default FlashcardModule;