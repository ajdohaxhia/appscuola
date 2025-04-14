'use client';

import React, { Suspense } from 'react';
import { AIChatModule } from '@/app/modules/ai/AIChatModule';

function AIChatContent() {
  return <AIChatModule />;
}

export default function AIPage() {
  return (
    <Suspense fallback={<div>Loading AI chat...</div>}>
      <AIChatContent />
    </Suspense>
  );
} 