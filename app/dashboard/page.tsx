'use client';

import React, { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { BookOpen, ClipboardList, CalendarDays, GraduationCap, Bot, Network } from 'lucide-react';

// Placeholder data - replace with actual data fetching later
const summaryData = {
  upcomingTasks: 3,
  dueFlashcards: 15,
  notesCount: 28,
  calendarEventsToday: 2,
  mindMapsCount: 5
};

// Module navigation map
const moduleRoutes = {
  notes: '/dashboard/notes',
  flashcards: '/dashboard/flashcards',
  tasks: '/dashboard/tasks',
  calendar: '/dashboard/calendar',
  mindmaps: '/dashboard/mindmaps',
  'ai-chat': '/dashboard/ai', // Assumes this route exists or will exist
};

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const view = searchParams.get('view');
  
  // Handle redirecting based on 'view' query parameter
  useEffect(() => {
    if (view && moduleRoutes[view]) {
      router.push(moduleRoutes[view]);
    }
  }, [router, view]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Dashboard</h1>
      
      {/* Summary Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Upcoming Tasks Widget - link to tasks page */}
        <div 
          onClick={() => router.push('/dashboard/tasks')}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Compiti Imminenti</h2>
            <ClipboardList className="h-6 w-6 text-blue-500 dark:text-blue-400" />
          </div>
          <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">{summaryData.upcomingTasks}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Compiti in scadenza</p>
        </div>

        {/* Due Flashcards Widget - link to flashcards page */}
        <div 
          onClick={() => router.push('/dashboard/flashcards')}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Flashcard da Ripassare</h2>
            <GraduationCap className="h-6 w-6 text-green-500 dark:text-green-400" />
          </div>
          <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">{summaryData.dueFlashcards}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Schede pronte per lo studio</p>
        </div>

        {/* Mind Maps Widget - link to mind maps page */}
        <div 
          onClick={() => router.push('/dashboard/mindmaps')}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Mappe Mentali</h2>
            <Network className="h-6 w-6 text-orange-500 dark:text-orange-400" />
          </div>
          <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">{summaryData.mindMapsCount}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Mappe create</p>
        </div>

        {/* Notes Count Widget - link to notes page */}
        <div 
          onClick={() => router.push('/dashboard/notes')}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Appunti Totali</h2>
            <BookOpen className="h-6 w-6 text-yellow-500 dark:text-yellow-400" />
          </div>
          <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">{summaryData.notesCount}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Note create</p>
        </div>

        {/* Calendar Events Today Widget - link to calendar page */}
        <div 
          onClick={() => router.push('/dashboard/calendar')}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Eventi di Oggi</h2>
            <CalendarDays className="h-6 w-6 text-purple-500 dark:text-purple-400" />
          </div>
          <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">{summaryData.calendarEventsToday}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Eventi nel calendario</p>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Assistant Widget */}
        <div 
          onClick={() => router.push('/dashboard/ai')}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer col-span-1"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Assistente AI</h2>
            <Bot className="h-6 w-6 text-pink-500 dark:text-pink-400" />
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Hai bisogno di aiuto con i tuoi studi? L'assistente AI può rispondere alle tue domande e aiutarti a comprendere concetti complessi.
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-800">
            <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
              Fai domande su qualsiasi argomento e ottieni risposte immediate!
            </p>
          </div>
        </div>

        {/* Placeholder for other dashboard content */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md col-span-1 lg:col-span-2">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Prossimamente...</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Qui verranno visualizzati grafici di progresso, attività recenti e altre informazioni utili.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
} 