'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/app/hooks/useStore';
import { dbService, MindMap } from '@/app/lib/db';
import { Plus, Search, Trash2, Save } from 'lucide-react';
import MindMapEditor from './MindMapEditor';
import MindMapSidebar from './MindMapSidebar';

const MindMapModule: React.FC = () => {
  const [mindMaps, setMindMaps] = useState<MindMap[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentMindMap, setCurrentMindMap] = useState<MindMap | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  
  const currentMindMapId = useStore((state) => state.currentMindMapId);
  const setCurrentMindMapId = useStore((state) => state.setCurrentMindMapId);
  
  // Carica tutte le mappe mentali all'avvio
  useEffect(() => {
    const fetchMindMaps = async () => {
      try {
        const allMindMaps = await dbService.getMindMaps();
        setMindMaps(allMindMaps);
        setLoading(false);
        
        // Se c'è un ID di mappa mentale corrente nello store, caricalo
        if (currentMindMapId) {
          const mindMap = await dbService.getMindMapById(currentMindMapId);
          if (mindMap) {
            setCurrentMindMap(mindMap);
          } else {
            // Se la mappa mentale non esiste più, resetta l'ID corrente
            setCurrentMindMapId(null);
          }
        }
      } catch (error) {
        console.error('Errore nel caricamento delle mappe mentali:', error);
        setLoading(false);
      }
    };
    
    fetchMindMaps();
  }, [currentMindMapId, setCurrentMindMapId]);
  
  // Filtra le mappe mentali in base alla query di ricerca
  const filteredMindMaps = mindMaps.filter(mindMap => 
    mindMap.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Crea una nuova mappa mentale
  const handleCreateMindMap = async () => {
    try {
      const newMindMap: Omit<MindMap, 'id'> = {
        title: 'Nuova Mappa Mentale',
        nodes: '[]', // Empty array as JSON string
        edges: '[]', // Empty array as JSON string
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const mindMapId = await dbService.createMindMap(newMindMap);
      const createdMindMap = await dbService.getMindMapById(mindMapId);
      
      if (createdMindMap) {
        setMindMaps([createdMindMap, ...mindMaps]);
        setCurrentMindMap(createdMindMap);
        setCurrentMindMapId(mindMapId);
        setIsEditing(true);
      }
    } catch (error) {
      console.error('Errore nella creazione della mappa mentale:', error);
    }
  };
  
  // Seleziona una mappa mentale
  const handleSelectMindMap = async (mindMapId: number) => {
    if (currentMindMapId === mindMapId) return;
    
    try {
      const mindMap = await dbService.getMindMapById(mindMapId);
      if (mindMap) {
        setCurrentMindMap(mindMap);
        setCurrentMindMapId(mindMapId);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Errore nel caricamento della mappa mentale:', error);
    }
  };
  
  // Elimina una mappa mentale
  const handleDeleteMindMap = async (mindMapId: number) => {
    try {
      await dbService.deleteMindMap(mindMapId);
      setMindMaps(mindMaps.filter(mindMap => mindMap.id !== mindMapId));
      
      if (currentMindMapId === mindMapId) {
        setCurrentMindMap(null);
        setCurrentMindMapId(null);
      }
    } catch (error) {
      console.error('Errore nell\'eliminazione della mappa mentale:', error);
    }
  };
  
  // Aggiorna una mappa mentale
  const handleUpdateMindMap = async (updatedMindMap: MindMap) => {
    try {
      if (updatedMindMap.id) {
        updatedMindMap.updatedAt = new Date();
        await dbService.updateMindMap(updatedMindMap.id, updatedMindMap);
        
        // Aggiorna la lista delle mappe mentali
        setMindMaps(mindMaps.map(mindMap => 
          mindMap.id === updatedMindMap.id ? updatedMindMap : mindMap
        ));
        
        // Aggiorna la mappa mentale corrente
        setCurrentMindMap(updatedMindMap);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Errore nell\'aggiornamento della mappa mentale:', error);
    }
  };

  // Handle node and edge changes
  const handleMindMapChange = (nodes: string, edges: string) => {
    if (currentMindMap) {
      setCurrentMindMap({
        ...currentMindMap,
        nodes,
        edges
      });
    }
  };
  
  return (
    <div className="flex h-full">
      {/* Sidebar per la lista delle mappe mentali */}
      <MindMapSidebar 
        mindMaps={filteredMindMaps}
        currentMindMapId={currentMindMapId}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSelectMindMap={handleSelectMindMap}
        onCreateMindMap={handleCreateMindMap}
        onDeleteMindMap={handleDeleteMindMap}
        loading={loading}
      />
      
      {/* Editor per la mappa mentale corrente */}
      <div className="flex-1 h-full overflow-auto bg-white dark:bg-gray-800 p-6">
        {currentMindMap ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {isEditing ? (
                  <input 
                    type="text" 
                    value={currentMindMap.title}
                    onChange={(e) => setCurrentMindMap({...currentMindMap, title: e.target.value})}
                    className="bg-white dark:bg-gray-700 border-b-2 border-primary dark:border-primary-light focus:outline-none w-full"
                  />
                ) : (
                  currentMindMap.title
                )}
              </h2>
              <div className="flex space-x-2">
                {isEditing ? (
                  <button 
                    onClick={() => handleUpdateMindMap(currentMindMap)}
                    className="flex items-center p-2 bg-primary hover:bg-primary-light text-white rounded-md"
                  >
                    <Save size={18} className="mr-1" />
                    Salva
                  </button>
                ) : (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="flex items-center p-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md"
                  >
                    Modifica
                  </button>
                )}
                
                <button 
                  onClick={() => handleDeleteMindMap(currentMindMap.id!)}
                  className="flex items-center p-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
                >
                  <Trash2 size={18} className="mr-1" />
                  Elimina
                </button>
              </div>
            </div>
            
            <div className="h-[calc(100%-4rem)]">
              <MindMapEditor 
                mindMap={currentMindMap}
                isEditing={isEditing}
                onChange={handleMindMapChange}
              />
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
            <div className="mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
              </svg>
            </div>
            <p className="text-xl mb-2">Nessuna mappa mentale selezionata</p>
            <p className="mb-4">Seleziona una mappa mentale dalla barra laterale o creane una nuova</p>
            <button
              onClick={handleCreateMindMap}
              className="flex items-center p-2 bg-primary hover:bg-primary-light text-white rounded-md"
            >
              <Plus size={18} className="mr-1" />
              Nuova Mappa Mentale
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MindMapModule; 