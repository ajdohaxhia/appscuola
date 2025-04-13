'use client';

import React from 'react';
import { Settings } from 'lucide-react';

export default function SettingsPage() {
  // Placeholder for future settings implementation
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center">
        <Settings className="mr-3 h-7 w-7" />
        Impostazioni
      </h1>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Impostazioni Applicazione</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Le opzioni di configurazione per AppScuola verranno aggiunte qui in futuro.
        </p>
        {/* Examples of potential settings sections */}
        <div className="mt-6 space-y-4">
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h3 className="text-md font-medium text-gray-700 dark:text-gray-300">Aspetto</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Personalizzazione del tema (già implementato tramite toggle).</p>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h3 className="text-md font-medium text-gray-700 dark:text-gray-300">Notifiche</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Configurazione delle notifiche push (da implementare).</p>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h3 className="text-md font-medium text-gray-700 dark:text-gray-300">Account</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Gestione profilo utente (se verrà implementata autenticazione).</p>
            </div>
        </div>
      </div>
    </div>
  );
} 