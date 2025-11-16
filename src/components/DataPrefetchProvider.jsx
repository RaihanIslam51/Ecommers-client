'use client';

/**
 * Data Prefetch Provider
 * 
 * Client-side component that triggers global data prefetching
 * when the application mounts.
 * 
 * PREFETCHING IS DISABLED BY DEFAULT
 * To enable: set NEXT_PUBLIC_ENABLE_PREFETCH=true in .env.local
 */

import { useEffect, useState, useRef } from 'react';
import prefetch from '@/lib/prefetch';
import { usePathname } from 'next/navigation';

export default function DataPrefetchProvider({ children }) {
  const [isPrefetched, setIsPrefetched] = useState(false);
  const pathname = usePathname();
  const hasInitialized = useRef(false);
  const backgroundRefreshCleanup = useRef(null);

  // Initial prefetch on mount
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    async function initializePrefetch() {
      // Check if prefetch is enabled via environment variable
      const prefetchEnabled = process.env.NEXT_PUBLIC_ENABLE_PREFETCH === 'true';
      
      if (!prefetchEnabled) {
        console.log('⏸️ Prefetching is disabled (set NEXT_PUBLIC_ENABLE_PREFETCH=true to enable)');
        setIsPrefetched(true);
        return;
      }

      try {
        console.log('🚀 Initializing data prefetch...');
        
        // Prefetch all core and extended data
        await prefetch.all({
          includeExtended: false, // Disabled to reduce initial load
          includeUser: false,
          parallel: true,
        });

        setIsPrefetched(true);

        // Start background refresh (every 5 minutes) - disabled by default
        // Uncomment to enable:
        // backgroundRefreshCleanup.current = prefetch.startBackgroundRefresh(5 * 60 * 1000);

      } catch (error) {
        console.warn('⚠️ Prefetch initialization failed (app will continue):', error.message);
        setIsPrefetched(true); // Set anyway to allow app to continue
      }
    }

    // Use requestIdleCallback for non-blocking prefetch
    if (typeof window !== 'undefined') {
      prefetch.onIdle(initializePrefetch);
    }

    // Cleanup
    return () => {
      if (backgroundRefreshCleanup.current) {
        backgroundRefreshCleanup.current();
      }
    };
  }, []);

  // Smart prefetch on route changes - disabled by default
  // Uncomment to enable:
  /*
  useEffect(() => {
    if (!isPrefetched || !pathname) return;

    // Prefetch likely next routes based on current location
    prefetch.onIdle(() => {
      prefetch.smart(pathname).catch(err => {
        console.warn('Smart prefetch failed:', err.message);
      });
    });
  }, [pathname, isPrefetched]);
  */

  return <>{children}</>;
}
