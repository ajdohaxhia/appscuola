'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Box, ZoomIn, ZoomOut, RotateCcw, Maximize2, PanelLeft, Download, Share2 } from 'lucide-react';
import { useSpring, animated } from 'react-spring';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// Mock data for AR models
const SAMPLE_MODELS = [
  {
    id: 1,
    name: 'Sistema Solare',
    thumbnail: '/images/ar/solar-system-thumb.jpg',
    description: 'Un modello interattivo del sistema solare',
    category: 'Scienze',
    complexity: 'Media'
  },
  {
    id: 2,
    name: 'Cellula Umana',
    thumbnail: '/images/ar/human-cell-thumb.jpg',
    description: 'Esplora la struttura di una cellula umana in 3D',
    category: 'Biologia',
    complexity: 'Alta'
  },
  {
    id: 3,
    name: 'Modello Atomico',
    thumbnail: '/images/ar/atom-model-thumb.jpg',
    description: 'Visualizza la struttura atomica in realtà aumentata',
    category: 'Chimica',
    complexity: 'Media'
  },
  {
    id: 4,
    name: 'Piramide Egizia',
    thumbnail: '/images/ar/pyramid-thumb.jpg', 
    description: 'Esplora la struttura di una piramide egizia',
    category: 'Storia',
    complexity: 'Bassa'
  }
];

export function ARViewerModule() {
  const [selectedModelId, setSelectedModelId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showModelList, setShowModelList] = useState(true);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const viewerRef = useRef<HTMLDivElement>(null);
  
  const selectedModel = SAMPLE_MODELS.find(model => model.id === selectedModelId);
  
  // Animation for model rotation
  const rotationProps = useSpring({
    transform: `rotate(${rotation}deg)`,
    config: { tension: 120, friction: 14 }
  });
  
  // Simulate loading when selecting a model
  useEffect(() => {
    if (selectedModelId) {
      setIsLoading(true);
      // Simulate loading delay
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [selectedModelId]);
  
  const handleModelSelect = (modelId: number) => {
    setSelectedModelId(modelId);
    setShowModelList(false);
  };
  
  const handleZoomIn = () => {
    setScale(prevScale => Math.min(prevScale + 0.2, 3));
  };
  
  const handleZoomOut = () => {
    setScale(prevScale => Math.max(prevScale - 0.2, 0.5));
  };
  
  const handleRotate = () => {
    setRotation(prevRotation => prevRotation + 90);
  };
  
  const resetView = () => {
    setScale(1);
    setRotation(0);
  };
  
  return (
    <div className="min-h-full bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200 flex items-center">
          <Box className="h-6 w-6 mr-2 text-primary dark:text-primary-light" />
          AR Viewer
        </h1>
        <button 
          onClick={() => setShowModelList(!showModelList)}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <PanelLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>
      
      <div className="flex-1 flex">
        {/* Model List Sidebar */}
        {showModelList && (
          <div className="w-80 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-y-auto p-4">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Modelli AR</h2>
            
            <div className="space-y-4">
              {SAMPLE_MODELS.map(model => (
                <div 
                  key={model.id}
                  onClick={() => handleModelSelect(model.id)}
                  className={`cursor-pointer rounded-lg overflow-hidden border transition-all ${
                    selectedModelId === model.id 
                      ? 'border-primary dark:border-primary-light shadow-md' 
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="h-32 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <span className="text-gray-500 dark:text-gray-400">Anteprima</span>
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-gray-800 dark:text-gray-200">{model.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">
                      {model.description}
                    </p>
                    <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <span>{model.category}</span>
                      <span>Complessità: {model.complexity}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Viewer */}
        <div className="flex-1 relative">
          {!selectedModelId ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <Box className="h-16 w-16 text-gray-300 dark:text-gray-700 mb-4" />
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Seleziona un modello per iniziare
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-md">
                Scegli un modello dalla lista per visualizzarlo in AR. Potrai esplorarlo, ruotarlo e ingrandirlo.
              </p>
            </div>
          ) : (
            <div className="h-full flex flex-col">
              {/* Viewer Toolbar */}
              <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-2 flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <button 
                    onClick={handleZoomIn}
                    className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                    title="Zoom in"
                  >
                    <ZoomIn className="h-5 w-5" />
                  </button>
                  <button 
                    onClick={handleZoomOut}
                    className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                    title="Zoom out"
                  >
                    <ZoomOut className="h-5 w-5" />
                  </button>
                  <button 
                    onClick={handleRotate}
                    className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                    title="Ruota"
                  >
                    <RotateCcw className="h-5 w-5" />
                  </button>
                  <button 
                    onClick={resetView}
                    className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                    title="Reset view"
                  >
                    <Maximize2 className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="flex items-center space-x-1">
                  <button className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400">
                    <Download className="h-5 w-5" />
                  </button>
                  <button className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400">
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              {/* AR Viewer Canvas */}
              <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 p-8">
                <div 
                  ref={viewerRef} 
                  className="relative w-full max-w-2xl aspect-square rounded-lg overflow-hidden shadow-lg"
                >
                  {isLoading ? (
                    <Skeleton height="100%" />
                  ) : (
                    <animated.div 
                      style={{ 
                        ...rotationProps,
                        transform: `${rotationProps.transform} scale(${scale})`
                      }}
                      className="h-full w-full flex items-center justify-center bg-gray-800 rounded-lg"
                    >
                      <div className="relative">
                        {/* Mock 3D Object - in production this would be a proper 3D model */}
                        <div className="h-40 w-40 bg-primary/60 rounded relative">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="h-24 w-24 bg-primary-light/70 rounded-full animate-pulse" />
                          </div>
                          <div className="absolute top-0 left-0 right-0 h-10 bg-white/10 rounded-t flex items-center justify-center">
                            <span className="text-xs text-white font-medium">
                              {selectedModel?.name}
                            </span>
                          </div>
                        </div>
                      </div>
                    </animated.div>
                  )}
                </div>
              </div>
              
              {/* Model Info */}
              <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  {selectedModel?.name}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {selectedModel?.description}
                </p>
                <div className="mt-3 flex justify-between">
                  <span className="inline-block bg-primary/10 text-primary dark:bg-primary-light/10 dark:text-primary-light px-2 py-1 rounded text-xs">
                    {selectedModel?.category}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Complessità: {selectedModel?.complexity}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ARViewerModule; 