'use client';

import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="text-center max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-6xl font-bold text-primary dark:text-primary-light mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Pagina non trovata</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          La pagina che stai cercando non esiste o è stata spostata.
        </p>
        <div className="flex flex-col space-y-3">
          <Link
            href="/dashboard"
            className="px-4 py-2 bg-primary hover:bg-primary-light text-white rounded-md"
          >
            Torna alla Dashboard
          </Link>
          <Link
            href="/"
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md"
          >
            Torna alla Home
          </Link>
        </div>
      </div>
    </div>
  );
} 