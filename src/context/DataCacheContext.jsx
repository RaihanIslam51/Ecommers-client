'use client';
/**
 * DataCacheContext
 *
 * Professional global data cache for Products, Categories and Banners.
 *
 * Strategy
 * ─────────
 * 1. On mount: check in-memory / localStorage cache → skip network if fresh.
 * 2. Parallel-fetch all three resources that have expired / missing cache.
 * 3. Background refresh every REFRESH_INTERVAL ms (default 10 min).
 * 4. Expose fine-grained hooks: useProducts, useCategories, useBanners.
 * 5. Expose invalidate(resource) + refetch(resource) for post-mutation use.
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import axiosInstance from '@/lib/axios';
import cacheManager from '@/lib/cache';

// ─────────────────────────────────────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────────────────────────────────────

const TTL = {
  products:   10 * 60 * 1000,  // 10 min
  categories: 30 * 60 * 1000,  // 30 min
  banners:    15 * 60 * 1000,  // 15 min
};

const ENDPOINTS = {
  products:   '/products',
  categories: '/categories',
  banners:    '/banners',
};

const REFRESH_INTERVAL = 10 * 60 * 1000; // background re-fetch every 10 min

// ─────────────────────────────────────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────────────────────────────────────

const DataCacheContext = createContext(null);

// ─────────────────────────────────────────────────────────────────────────────
// Slice shape
// ─────────────────────────────────────────────────────────────────────────────

const makeSlice = () => ({
  data: null,       // null = not yet loaded
  loading: true,
  error: null,
  lastFetched: null,
});

// ─────────────────────────────────────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────────────────────────────────────

export function DataCacheProvider({ children }) {
  const [state, setState] = useState({
    products:   makeSlice(),
    categories: makeSlice(),
    banners:    makeSlice(),
  });

  const refreshTimerRef = useRef(null);
  const isMountedRef   = useRef(true);

  // ── helpers ──────────────────────────────────────────────────────────────

  const setSlice = useCallback((resource, patch) => {
    if (!isMountedRef.current) return;
    setState(prev => ({
      ...prev,
      [resource]: { ...prev[resource], ...patch },
    }));
  }, []);

  // ── fetch one resource ────────────────────────────────────────────────────

  const fetchResource = useCallback(async (resource, { force = false } = {}) => {
    const cacheKey = ENDPOINTS[resource];
    const ttl      = TTL[resource];

    // Check cache first (unless force-refreshing)
    if (!force) {
      const cached = cacheManager.get(cacheKey);
      if (cached) {
        setSlice(resource, {
          data: cached,
          loading: false,
          error: null,
          lastFetched: Date.now(),
        });
        return cached;
      }
    }

    setSlice(resource, { loading: true, error: null });

    try {
      const res  = await axiosInstance.get(ENDPOINTS[resource]);
      const body = res.data;

      // Normalise: server returns { products: [...] } / { categories: [...] } / { banners: [...] }
      const data = body[resource] ?? body.data ?? body;

      cacheManager.set(cacheKey, data, ttl);

      setSlice(resource, {
        data,
        loading: false,
        error: null,
        lastFetched: Date.now(),
      });

      return data;
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Failed to fetch';
      setSlice(resource, { loading: false, error: msg });
      if (process.env.NODE_ENV === 'development') {
        console.error(`❌ DataCache [${resource}]:`, msg);
      }
      return null;
    }
  }, [setSlice]);

  // ── fetch all three in parallel ───────────────────────────────────────────

  const fetchAll = useCallback((opts = {}) => {
    return Promise.all([
      fetchResource('products',   opts),
      fetchResource('categories', opts),
      fetchResource('banners',    opts),
    ]);
  }, [fetchResource]);

  // ── initial load on mount ─────────────────────────────────────────────────

  useEffect(() => {
    isMountedRef.current = true;

    // Use requestIdleCallback so the initial page paint is not blocked
    const run = () => fetchAll({ force: false });

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      window.requestIdleCallback(run, { timeout: 3000 });
    } else {
      // Small delay so the browser can finish rendering first
      setTimeout(run, 100);
    }

    // Background periodic refresh
    refreshTimerRef.current = setInterval(() => {
      if (document.visibilityState !== 'hidden') {
        fetchAll({ force: true });
      }
    }, REFRESH_INTERVAL);

    // Refresh when tab regains focus (user comes back from another tab)
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        fetchAll({ force: false }); // uses cache if still fresh
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      isMountedRef.current = false;
      clearInterval(refreshTimerRef.current);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [fetchAll]);

  // ── public API ────────────────────────────────────────────────────────────

  /** Invalidate cache for a resource (or all) and optionally re-fetch */
  const invalidate = useCallback((resource, { refetchNow = true } = {}) => {
    if (resource === 'all') {
      cacheManager.invalidatePattern(/./);
      setSlice('products',   makeSlice());
      setSlice('categories', makeSlice());
      setSlice('banners',    makeSlice());
      if (refetchNow) fetchAll({ force: true });
    } else {
      cacheManager.delete(ENDPOINTS[resource]);
      setSlice(resource, makeSlice());
      if (refetchNow) fetchResource(resource, { force: true });
    }
  }, [fetchAll, fetchResource, setSlice]);

  /** Force-refetch a resource (or all) */
  const refetch = useCallback((resource = 'all') => {
    if (resource === 'all') return fetchAll({ force: true });
    return fetchResource(resource, { force: true });
  }, [fetchAll, fetchResource]);

  // ─────────────────────────────────────────────────────────────────────────
  const value = {
    ...state,
    invalidate,
    refetch,
    // Convenience property: are ALL resources loaded?
    ready: !state.products.loading && !state.categories.loading && !state.banners.loading,
  };

  return (
    <DataCacheContext.Provider value={value}>
      {children}
    </DataCacheContext.Provider>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Hooks
// ─────────────────────────────────────────────────────────────────────────────

/** Full context access */
export function useDataCache() {
  const ctx = useContext(DataCacheContext);
  if (!ctx) throw new Error('useDataCache must be used inside <DataCacheProvider>');
  return ctx;
}

/** Products slice → { data, loading, error, lastFetched, refetch, invalidate } */
export function useProducts() {
  const { products, refetch, invalidate } = useDataCache();
  return {
    ...products,
    refetch:    () => refetch('products'),
    invalidate: (opts) => invalidate('products', opts),
  };
}

/** Categories slice */
export function useCategories() {
  const { categories, refetch, invalidate } = useDataCache();
  return {
    ...categories,
    refetch:    () => refetch('categories'),
    invalidate: (opts) => invalidate('categories', opts),
  };
}

/** Banners slice */
export function useBanners() {
  const { banners, refetch, invalidate } = useDataCache();
  return {
    ...banners,
    refetch:    () => refetch('banners'),
    invalidate: (opts) => invalidate('banners', opts),
  };
}

export default DataCacheContext;
