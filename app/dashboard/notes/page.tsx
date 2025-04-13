'use client';

import React from 'react';
import NotesModule from '@/app/modules/notes/NotesModule';

export default function NotesPage() {
  // This component wraps the actual NotesModule logic
  // It ensures the NotesModule runs as a client component within the server layout
  return (
    <NotesModule />
  );
} 