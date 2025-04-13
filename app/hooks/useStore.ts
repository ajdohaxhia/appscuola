import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Definizione delle interfacce per lo stato
interface AppState {
  // Stato UI
  darkMode: boolean;
  sidebarOpen: boolean;
  currentView: 'notes' | 'mindmaps' | 'flashcards' | 'ai-chat' | 'ai-images' | 'home';
  
  // Stato Editor
  currentNoteId: number | null;
  currentMindMapId: number | null;
  currentFlashcardDeckId: number | null;
  currentChatId: number | null;
  
  // Flag per lo stato dell'applicazione
  isOffline: boolean;
  isInstallable: boolean;
  isPendingSync: boolean;
  
  // Azioni per gestire lo stato
  setDarkMode: (darkMode: boolean) => void;
  toggleSidebar: () => void;
  setCurrentView: (view: AppState['currentView']) => void;
  setCurrentNoteId: (id: number | null) => void;
  setCurrentMindMapId: (id: number | null) => void;
  setCurrentFlashcardDeckId: (id: number | null) => void;
  setCurrentChatId: (id: number | null) => void;
  setOfflineStatus: (isOffline: boolean) => void;
  setInstallableStatus: (isInstallable: boolean) => void;
  setPendingSyncStatus: (isPendingSync: boolean) => void;
}

// Creazione dello store
export const useStore = create<AppState>()(
  persist(
    (set) => ({
      // Stato iniziale
      darkMode: false,
      sidebarOpen: true,
      currentView: 'home',
      currentNoteId: null,
      currentMindMapId: null,
      currentFlashcardDeckId: null,
      currentChatId: null,
      isOffline: false,
      isInstallable: false,
      isPendingSync: false,
      
      // Azioni
      setDarkMode: (darkMode) => set({ darkMode }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setCurrentView: (currentView) => set({ currentView }),
      setCurrentNoteId: (currentNoteId) => set({ currentNoteId }),
      setCurrentMindMapId: (currentMindMapId) => set({ currentMindMapId }),
      setCurrentFlashcardDeckId: (currentFlashcardDeckId) => set({ currentFlashcardDeckId }),
      setCurrentChatId: (currentChatId) => set({ currentChatId }),
      setOfflineStatus: (isOffline) => set({ isOffline }),
      setInstallableStatus: (isInstallable) => set({ isInstallable }),
      setPendingSyncStatus: (isPendingSync) => set({ isPendingSync }),
    }),
    {
      name: 'app-storage', // nome utilizzato per localStorage
      partialize: (state) => ({
        darkMode: state.darkMode,
        currentView: state.currentView,
        currentNoteId: state.currentNoteId,
        currentMindMapId: state.currentMindMapId,
        currentFlashcardDeckId: state.currentFlashcardDeckId,
        currentChatId: state.currentChatId,
      }),
    }
  )
); 