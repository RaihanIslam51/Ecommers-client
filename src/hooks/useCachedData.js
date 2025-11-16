/**
 * Custom Hook for Cached Data Fetching
 * 
 * Provides React hooks for accessing cached data with automatic
 * loading states and error handling.
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import dataFetcher from '@/lib/dataFetcher';

/**
 * Hook for fetching data with caching
 * 
 * @param {string} endpoint - API endpoint
 * @param {object} options - Fetch options
 * @param {boolean} autoFetch - Auto-fetch on mount (default: true)
 * @returns {object} - { data, loading, error, refetch }
 */
export function useCachedFetch(endpoint, options = {}, autoFetch = true) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState(null);
  const isMounted = useRef(true);

  const fetchData = useCallback(async () => {
    if (!endpoint) return;

    setLoading(true);
    setError(null);

    try {
      const result = await dataFetcher.fetch(endpoint, options);
      
      if (isMounted.current) {
        setData(result);
      }
    } catch (err) {
      if (isMounted.current) {
        setError(err.message || 'Failed to fetch data');
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [endpoint, JSON.stringify(options)]);

  useEffect(() => {
    isMounted.current = true;

    if (autoFetch) {
      fetchData();
    }

    return () => {
      isMounted.current = false;
    };
  }, [autoFetch, fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}

/**
 * Hook for accessing multiple endpoints
 * 
 * @param {Array} requests - Array of {endpoint, options} objects
 * @param {boolean} autoFetch - Auto-fetch on mount (default: true)
 * @returns {object} - { data, loading, error, refetch }
 */
export function useCachedMultiple(requests, autoFetch = true) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState(null);
  const isMounted = useRef(true);

  const fetchData = useCallback(async () => {
    if (!requests || requests.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      const results = await dataFetcher.fetchMultiple(requests);
      
      if (isMounted.current) {
        setData(results);
      }
    } catch (err) {
      if (isMounted.current) {
        setError(err.message || 'Failed to fetch data');
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [JSON.stringify(requests)]);

  useEffect(() => {
    isMounted.current = true;

    if (autoFetch) {
      fetchData();
    }

    return () => {
      isMounted.current = false;
    };
  }, [autoFetch, fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}

/**
 * Hook for mutations with automatic cache invalidation
 * 
 * @param {string} endpoint - API endpoint
 * @returns {object} - { mutate, loading, error, data }
 */
export function useCachedMutation(endpoint) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = useCallback(async (method, payload, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      let result;
      
      switch (method.toUpperCase()) {
        case 'POST':
          result = await dataFetcher.post(endpoint, payload, options);
          break;
        case 'PUT':
          result = await dataFetcher.put(endpoint, payload, options);
          break;
        case 'DELETE':
          result = await dataFetcher.delete(endpoint, options);
          break;
        default:
          throw new Error(`Unsupported method: ${method}`);
      }

      setData(result);
      return result;
    } catch (err) {
      setError(err.message || 'Mutation failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  return {
    mutate,
    loading,
    error,
    data,
  };
}

/**
 * Hook for cache invalidation
 * 
 * @returns {object} - { invalidate, invalidatePattern, clearAll }
 */
export function useCacheInvalidation() {
  const invalidate = useCallback((endpoint, params = {}) => {
    dataFetcher.invalidate(endpoint, params);
  }, []);

  const invalidatePattern = useCallback((pattern) => {
    dataFetcher.invalidatePattern(pattern);
  }, []);

  const clearAll = useCallback(() => {
    dataFetcher.clearAll();
  }, []);

  return {
    invalidate,
    invalidatePattern,
    clearAll,
  };
}

/**
 * Hook for optimistic updates
 * 
 * @param {string} endpoint - API endpoint
 * @param {object} options - Fetch options
 * @returns {object} - { data, loading, error, optimisticUpdate }
 */
export function useOptimisticUpdate(endpoint, options = {}) {
  const { data, loading, error, refetch } = useCachedFetch(endpoint, options);
  const [optimisticData, setOptimisticData] = useState(null);

  const optimisticUpdate = useCallback(async (updateFn, mutateFn) => {
    // Apply optimistic update
    const newData = updateFn(data);
    setOptimisticData(newData);

    try {
      // Perform actual mutation
      await mutateFn();
      
      // Refetch to get server data
      await refetch();
      
      // Clear optimistic data
      setOptimisticData(null);
    } catch (err) {
      // Revert on error
      setOptimisticData(null);
      throw err;
    }
  }, [data, refetch]);

  return {
    data: optimisticData || data,
    loading,
    error,
    optimisticUpdate,
    refetch,
  };
}

/**
 * Hook for prefetching on hover/focus
 * 
 * @param {string} endpoint - API endpoint
 * @param {object} options - Fetch options
 * @returns {object} - Event handlers
 */
export function usePrefetchHandlers(endpoint, options = {}) {
  const [prefetched, setPrefetched] = useState(false);

  const handlePrefetch = useCallback(async () => {
    if (prefetched) return;
    
    setPrefetched(true);
    await dataFetcher.preload(endpoint, options);
  }, [endpoint, options, prefetched]);

  return {
    onMouseEnter: handlePrefetch,
    onFocus: handlePrefetch,
  };
}

// Export default object with all hooks
const cachedHooks = {
  useCachedFetch,
  useCachedMultiple,
  useCachedMutation,
  useCacheInvalidation,
  useOptimisticUpdate,
  usePrefetchHandlers,
};

export default cachedHooks;
