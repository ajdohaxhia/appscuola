'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useStore } from '@/app/hooks/useStore';
import { dbService, type Note } from '@/app/lib/db';
import { Plus, Search, Trash2, Save } from 'lucide-react';
import NoteEditor from './NoteEditor';
import NoteSidebar from './NoteSidebar';
import { SkeletonTheme } from 'react-loading-skeleton';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const NotesModule: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const currentNoteId = useStore((state) => state.currentNoteId);
  const setCurrentNoteId = useStore((state) => state.setCurrentNoteId);
  
  // Carica tutte le note all'avvio
  const loadNotes = useCallback(async () => {
    setIsLoading(true);
    try {
      const allNotes = await dbService.getNotes();
      setNotes(allNotes);
      setIsLoading(false);
      
      // Se c'è un ID di nota corrente nello store, caricalo
      if (currentNoteId) {
        const note = await dbService.getNoteById(currentNoteId);
        if (note) {
          setSelectedNote(note);
        } else {
          // Se la nota non esiste più, resetta l'ID corrente
          setCurrentNoteId(null);
        }
      }
    } catch (error) {
      console.error('Errore nel caricamento delle note:', error);
      setIsLoading(false);
    }
  }, [currentNoteId, setCurrentNoteId]);
  
  useEffect(() => {
    loadNotes();
  }, [loadNotes]);
  
  // Filtra le note in base alla query di ricerca
  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (note.tags && note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))) ||
    (note.plainTextContent && note.plainTextContent.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Crea una nuova nota
  const handleCreateNote = useCallback(async () => {
    const newNoteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'> = {
      title: 'Nuova Nota',
      content: '<p></p>', // Start with empty paragraph
      tags: [],
      isPinned: false,
      // plainTextContent will be generated on save
    };
    try {
      const newId = await dbService.addNote(newNoteData); // Corrected: use addNote
      const newNote = await dbService.getNoteById(newId);
      if (newNote) {
        setNotes(prev => [newNote, ...prev]);
        setSelectedNote(newNote);
        setCurrentNoteId(newId);
      }
    } catch (error) {
      console.error("Failed to create note:", error);
    }
  }, [currentNoteId, setCurrentNoteId]);
  
  // Seleziona una nota
  const handleSelectNote = useCallback((noteId: number | null) => {
    if (noteId === null) {
      setSelectedNote(null);
      return;
    }
    // Find note in the current state first for responsiveness
    const note = notes.find(n => n.id === noteId);
    if (note) {
      setSelectedNote(note);
    } else {
      // Optional: Fetch from DB if not found in state (edge case)
      console.warn(`Note with ID ${noteId} not found in current state.`);
      // dbService.getNoteById(noteId).then(dbNote => setSelectedNote(dbNote || null));
      setSelectedNote(null); // Fallback
    }
  }, [notes]); // Dependency on notes state
  
  // Handle saving/updating a note
  const handleSaveNote = useCallback(async (updatedNoteData: Note) => {
    if (!updatedNoteData.id) return; 
    try {
      // Ensure updatedAt is set
      const noteToSave = { 
          ...updatedNoteData, 
          updatedAt: new Date()
      };
      
      // Add plain text content generation (can be improved)
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = noteToSave.content;
      noteToSave.plainTextContent = tempDiv.textContent || tempDiv.innerText || '';
      
      await dbService.updateNote(noteToSave);
      setNotes(prevNotes => 
        prevNotes.map(n => n.id === noteToSave.id ? noteToSave : n)
      );
      setSelectedNote(prevSelected => 
        prevSelected?.id === noteToSave.id ? noteToSave : prevSelected
      );
      // Potentially add a success message here
    } catch (error) {
      console.error("Failed to save note:", error);
      // Potentially add an error message here
    }
  }, []);
  
  // Handle deleting a note
  const handleDeleteNote = useCallback(async (noteId: number) => {
    // Make sure noteId is a number before proceeding
    if (typeof noteId !== 'number') {
      console.error("Invalid note ID for deletion:", noteId);
      return;
    } 
    try {
      await dbService.deleteNote(noteId);
      setNotes(prevNotes => prevNotes.filter(n => n.id !== noteId));
      if (currentNoteId === noteId) {
        setSelectedNote(null);
        setCurrentNoteId(null);
      }
      // Potentially add a success message here
    } catch (error) {
      console.error("Failed to delete note:", error);
      // Potentially add an error message here
    }
  }, [currentNoteId]); // Dependency: currentNoteId to clear selection
  
  // Sort notes: Pinned first, then by updatedAt descending
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.isPinned !== b.isPinned) {
      return a.isPinned ? -1 : 1;
    }
    // Ensure dates are valid before comparing
    const dateA = a.updatedAt instanceof Date ? a.updatedAt.getTime() : 0;
    const dateB = b.updatedAt instanceof Date ? b.updatedAt.getTime() : 0;
    return dateB - dateA; // Most recent first
  });
  
  return (
    <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5">
      <div className="flex h-full bg-white dark:bg-gray-800">
        {/* Sidebar */}
        <div className="w-80 border-r border-gray-200 dark:border-gray-700 flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Appunti</h2>
              <button
                onClick={handleCreateNote}
                className="p-2 rounded-full text-primary hover:bg-primary-light/10 dark:text-primary-light dark:hover:bg-primary-dark/20 transition-colors"
                aria-label="Crea nuova nota"
              >
                <Plus size={20} />
              </button>
            </div>

            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Cerca note..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:outline-none focus:ring-1 focus:ring-primary-light focus:border-primary-light"
                aria-label="Cerca nelle note"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 space-y-3">
                  <Skeleton height={60} count={8} />
              </div>
            ) : (
              <NoteSidebar
                notes={sortedNotes}
                currentNoteId={selectedNote?.id ?? null}
                onSelectNote={handleSelectNote}
                onDeleteNote={handleDeleteNote}
                onCreateNote={handleCreateNote}
                searchQuery={searchTerm}
                onSearchChange={setSearchTerm}
                loading={isLoading}
              />
            )}
          </div>
        </div>
        
        {/* Editor */}
        <NoteEditor 
          key={selectedNote?.id ?? 'editor-placeholder'}
          note={selectedNote} 
          onSave={handleSaveNote}
        />
      </div>
    </SkeletonTheme>
  );
};

export default NotesModule; 