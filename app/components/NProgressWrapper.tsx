'use client';

import { useEffect } from 'react';
import NProgress from 'nprogress';
import { usePathname, useSearchParams } from 'next/navigation';
import 'nprogress/nprogress.css'; // Import the CSS

// Customize NProgress appearance if desired
// NProgress.configure({ showSpinner: false });

const NProgressWrapper = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    NProgress.done(); // Ensure progress bar is finished on initial load
    return () => {
      NProgress.start(); // Start progress bar on route change start
    };
  }, [pathname, searchParams]); // Trigger on path or search param change

  useEffect(() => {
    NProgress.done(); // Finish progress bar when component mounts/updates after navigation
  });

  // NProgress css can be customized globally in globals.css or layout.tsx if preferred
  // Example: #nprogress .bar { background: #yourColor !important; }

  return <>{children}</>;
};

export default NProgressWrapper; 