'use client';
/**
 * DataPrefetchProvider
 *
 * Wraps the entire app with DataCacheProvider which handles:
 *  - Parallel prefetch of products, categories, banners on app load
 *  - In-memory + localStorage caching with per-resource TTL
 *  - Background refresh every 10 minutes
 *  - Tab-visibility re-validation
 *
 * Components access cached data via:
 *   import { useProducts, useCategories, useBanners } from '@/context/DataCacheContext';
 */

import { DataCacheProvider } from '@/context/DataCacheContext';

export default function DataPrefetchProvider({ children }) {
  return <DataCacheProvider>{children}</DataCacheProvider>;
}
