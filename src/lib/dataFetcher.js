/**
 * Data Fetcher with Caching
 * 
 * Provides a high-level API for fetching data with automatic caching,
 * request deduplication, and error handling.
 */

import axiosInstance from './axios';
import cacheManager from './cache';

// Store in-flight requests to prevent duplicate fetches
const pendingRequests = new Map();

/**
 * Cache TTL configurations for different resource types
 */
const CACHE_TTL = {
  products: 10 * 60 * 1000,      // 10 minutes
  categories: 30 * 60 * 1000,    // 30 minutes
  banners: 15 * 60 * 1000,       // 15 minutes
  user: 5 * 60 * 1000,           // 5 minutes
  orders: 2 * 60 * 1000,         // 2 minutes
  cart: 1 * 60 * 1000,           // 1 minute
  default: 5 * 60 * 1000,        // 5 minutes
};

/**
 * Determine TTL based on endpoint
 */
function getTTLForEndpoint(endpoint) {
  if (endpoint.includes('/products')) return CACHE_TTL.products;
  if (endpoint.includes('/categories')) return CACHE_TTL.categories;
  if (endpoint.includes('/banners')) return CACHE_TTL.banners;
  if (endpoint.includes('/user')) return CACHE_TTL.user;
  if (endpoint.includes('/orders')) return CACHE_TTL.orders;
  if (endpoint.includes('/cart')) return CACHE_TTL.cart;
  return CACHE_TTL.default;
}

/**
 * Fetch data with caching and request deduplication
 * 
 * @param {string} endpoint - API endpoint
 * @param {object} options - Fetch options
 * @param {object} options.params - Query parameters
 * @param {boolean} options.cache - Enable/disable caching (default: true)
 * @param {number} options.ttl - Custom TTL in milliseconds
 * @param {boolean} options.revalidate - Force cache revalidation
 * @returns {Promise<any>} - Response data
 */
export async function fetchData(endpoint, options = {}) {
  const {
    params = {},
    cache = true,
    ttl = null,
    revalidate = false,
  } = options;

  // Generate cache key
  const cacheKey = cacheManager.generateKey(endpoint, params);

  // Check cache first (if caching is enabled and not revalidating)
  if (cache && !revalidate) {
    const cachedData = cacheManager.get(cacheKey);
    if (cachedData !== null) {
      return cachedData;
    }
  }

  // Check if there's already a pending request for this endpoint
  if (pendingRequests.has(cacheKey)) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`⏳ Request DEDUPED: ${endpoint}`);
    }
    return pendingRequests.get(cacheKey);
  }

  // Create the request promise
  const requestPromise = (async () => {
    try {
      const response = await axiosInstance.get(endpoint, { params });
      const data = response.data;

      // Cache the response
      if (cache) {
        const cacheTTL = ttl || getTTLForEndpoint(endpoint);
        cacheManager.set(cacheKey, data, cacheTTL);
      }

      return data;
    } catch (error) {
      console.error(`❌ Fetch Error [${endpoint}]:`, error.message);
      throw error;
    } finally {
      // Remove from pending requests
      pendingRequests.delete(cacheKey);
    }
  })();

  // Store the pending request
  pendingRequests.set(cacheKey, requestPromise);

  return requestPromise;
}

/**
 * Fetch multiple endpoints in parallel
 * 
 * @param {Array} requests - Array of {endpoint, options} objects
 * @returns {Promise<Array>} - Array of responses
 */
export async function fetchMultiple(requests) {
  const promises = requests.map(({ endpoint, options }) => 
    fetchData(endpoint, options).catch(error => {
      console.error(`Failed to fetch ${endpoint}:`, error);
      return null; // Return null for failed requests
    })
  );

  return Promise.all(promises);
}

/**
 * Post data (no caching)
 * 
 * @param {string} endpoint - API endpoint
 * @param {object} data - Request body
 * @param {object} options - Additional options
 * @returns {Promise<any>} - Response data
 */
export async function postData(endpoint, data, options = {}) {
  try {
    const response = await axiosInstance.post(endpoint, data, options);
    
    // Invalidate related cache entries
    invalidateRelatedCache(endpoint);
    
    return response.data;
  } catch (error) {
    console.error(`❌ Post Error [${endpoint}]:`, error.message);
    throw error;
  }
}

/**
 * Put data (update)
 * 
 * @param {string} endpoint - API endpoint
 * @param {object} data - Request body
 * @param {object} options - Additional options
 * @returns {Promise<any>} - Response data
 */
export async function putData(endpoint, data, options = {}) {
  try {
    const response = await axiosInstance.put(endpoint, data, options);
    
    // Invalidate related cache entries
    invalidateRelatedCache(endpoint);
    
    return response.data;
  } catch (error) {
    console.error(`❌ Put Error [${endpoint}]:`, error.message);
    throw error;
  }
}

/**
 * Delete data
 * 
 * @param {string} endpoint - API endpoint
 * @param {object} options - Additional options
 * @returns {Promise<any>} - Response data
 */
export async function deleteData(endpoint, options = {}) {
  try {
    const response = await axiosInstance.delete(endpoint, options);
    
    // Invalidate related cache entries
    invalidateRelatedCache(endpoint);
    
    return response.data;
  } catch (error) {
    console.error(`❌ Delete Error [${endpoint}]:`, error.message);
    throw error;
  }
}

/**
 * Invalidate cache entries related to an endpoint
 */
function invalidateRelatedCache(endpoint) {
  // Extract resource type from endpoint
  const resourceMatch = endpoint.match(/\/api\/([^\/]+)/);
  if (resourceMatch) {
    const resource = resourceMatch[1];
    cacheManager.invalidatePattern(new RegExp(`/api/${resource}`));
  }
}

/**
 * Manually invalidate cache for specific endpoint
 */
export function invalidateCache(endpoint, params = {}) {
  const cacheKey = cacheManager.generateKey(endpoint, params);
  cacheManager.delete(cacheKey);
}

/**
 * Manually invalidate cache by pattern
 */
export function invalidateCachePattern(pattern) {
  return cacheManager.invalidatePattern(pattern);
}

/**
 * Clear all cache
 */
export function clearAllCache() {
  cacheManager.clear();
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
  return cacheManager.getStats();
}

/**
 * Preload data (fetch and cache without returning)
 */
export async function preloadData(endpoint, options = {}) {
  try {
    await fetchData(endpoint, { ...options, cache: true });
    if (process.env.NODE_ENV === 'development') {
      console.log(`📦 Preloaded: ${endpoint}`);
    }
  } catch (error) {
    console.error(`Failed to preload ${endpoint}:`, error);
  }
}

// Export default object with all methods
const dataFetcher = {
  fetch: fetchData,
  fetchMultiple,
  post: postData,
  put: putData,
  delete: deleteData,
  invalidate: invalidateCache,
  invalidatePattern: invalidateCachePattern,
  clearAll: clearAllCache,
  getStats: getCacheStats,
  preload: preloadData,
};

export default dataFetcher;
