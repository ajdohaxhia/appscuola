'use client';

import React, { Suspense } from 'react';
import NotesModule from '@/app/modules/notes/NotesModule';

function NotesContent() {
  return (
    <NotesModule />
  );
}

export default function NotesPage() {
  // This component wraps the actual NotesModule logic
  // It ensures the NotesModule runs as a client component within the server layout
  return (
    <Suspense fallback={<div>Loading notes...</div>}>
      <NotesContent />
    </Suspense>
  );
} 