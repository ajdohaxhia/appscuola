'use client';

import React from 'react';
// Import the *named* export from FlashcardModule
import { FlashcardModule } from '@/app/modules/flashcards/FlashcardModule';

export default function FlashcardsPage() {
  // This component wraps the actual FlashcardModule logic
  return (
    <FlashcardModule />
  );
} 