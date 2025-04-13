'use client';

import React from 'react';
// Import the *named* export from CalendarModule
import { CalendarModule } from '@/app/modules/calendar/CalendarModule';

export default function CalendarPage() {
  // This component wraps the actual CalendarModule logic
  return (
    <CalendarModule />
  );
} 