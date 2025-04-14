'use client';

import { useEffect } from 'react';

export default function ViewportHandler() {
  useEffect(() => {
    // Function to handle viewport issues
    const handleViewport = () => {
      // Set viewport height
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);

      // Handle iOS viewport issues
      if (navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform)) {
        document.body.style.height = `${window.innerHeight}px`;
        document.body.style.overflow = 'hidden';
      }
    };

    // Initial call
    handleViewport();

    // Add event listeners
    window.addEventListener('resize', handleViewport);
    window.addEventListener('orientationchange', handleViewport);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleViewport);
      window.removeEventListener('orientationchange', handleViewport);
    };
  }, []);

  return null;
} 