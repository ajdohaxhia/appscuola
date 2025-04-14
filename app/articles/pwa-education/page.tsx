'use client'; 

import React, { Suspense } from 'react'; 

function Content() { 
  return (
    <div>Content</div>
  ); 
} 

export default function Page() { 
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Content />
    </Suspense>
  ); 
}
