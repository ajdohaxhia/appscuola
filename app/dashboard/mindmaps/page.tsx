'use client';

import React, { Suspense } from 'react';
import { MindMapModule } from '@/app/modules/mindmaps/MindMapModule';

// Content component that will be wrapped in Suspense
function MindMapsContent() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col space-y-6 h-[calc(100vh-12rem)]">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Mappe Mentali</h1>
        <div className="flex-1 min-h-0 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <MindMapModule />
        </div>
      </div>
    </div>
  );
}

export default function MindMapsPage() {
  return (
    <Suspense fallback={<div className="p-6">Caricamento mappe mentali...</div>}>
      <MindMapsContent />
    </Suspense>
  );
} 