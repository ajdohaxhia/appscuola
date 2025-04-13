'use client';

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary dark:border-primary-light mx-auto mb-4"></div>
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">Caricamento...</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Stiamo preparando l'esperienza AppScuola per te.
        </p>
      </div>
    </div>
  );
} 