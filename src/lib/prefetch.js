/**
 * Global Data Prefetching
 * 
 * Orchestrates prefetching of all critical application data
 * on app initialization for instant navigation and rendering.
 */

import dataFetcher from './dataFetcher';

/**
 * Configuration for prefetchable endpoints
 * Add or modify endpoints based on your application needs
 * 
 * NOTE: Prefetching is DISABLED by default.
 * To enable: set NEXT_PUBLIC_ENABLE_PREFETCH=true in .env.local
 */
const PREFETCH_CONFIG = {
  // Core data - always prefetch (when enabled)
  core: [
    // Commented out by default - uncomment when your API is ready
    // { endpoint: '/api/products', options: { params: { limit: 50 } } },
    // { endpoint: '/api/categories', options: {} },
    // { endpoint: '/api/banners', options: {} },
  ],
  
  // Extended data - prefetch based on user type or route
  extended: [
    // Commented out by default
    // { endpoint: '/api/products', options: { params: { featured: true } } },
    // { endpoint: '/api/products', options: { params: { sort: 'popular', limit: 20 } } },
    // { endpoint: '/api/products', options: { params: { sort: 'newest', limit: 20 } } },
  ],
  
  // User-specific data - only prefetch if authenticated
  user: [
    // Commented out by default
    // { endpoint: '/api/user/profile', options: {} },
    // { endpoint: '/api/orders', options: {} },
    // { endpoint: '/api/user/wishlist', options: {} },
  ],
};

/**
 * Prefetch all core application data
 * 
 * @param {object} options - Prefetch options
 * @param {boolean} options.includeExtended - Include extended data
 * @param {boolean} options.includeUser - Include user-specific data
 * @param {boolean} options.parallel - Fetch all in parallel (default: true)
 * @returns {Promise<object>} - Prefetch results
 */
export async function prefetchAll(options = {}) {
  const {
    includeExtended = true,
    includeUser = false,
    parallel = true,
  } = options;

  const startTime = Date.now();
  
  // Only log in development
  if (process.env.NODE_ENV === 'development') {
    console.log('🚀 Starting global data prefetch...');
  }

  const endpoints = [
    ...PREFETCH_CONFIG.core,
    ...(includeExtended ? PREFETCH_CONFIG.extended : []),
    ...(includeUser ? PREFETCH_CONFIG.user : []),
  ];

  // Return early if no endpoints to prefetch
  if (endpoints.length === 0) {
    console.log('⏭️ No endpoints configured for prefetching');
    return { success: [], failed: [], total: 0, duration: 0 };
  }

  const results = {
    success: [],
    failed: [],
    total: endpoints.length,
    duration: 0,
  };

  try {
    if (parallel) {
      // Fetch all in parallel for maximum speed
      const responses = await dataFetcher.fetchMultiple(endpoints);
      
      responses.forEach((response, index) => {
        if (response !== null) {
          results.success.push(endpoints[index].endpoint);
        } else {
          results.failed.push(endpoints[index].endpoint);
        }
      });
    } else {
      // Fetch sequentially (use if server can't handle parallel load)
      for (const { endpoint, options } of endpoints) {
        try {
          await dataFetcher.preload(endpoint, options);
          results.success.push(endpoint);
        } catch (error) {
          results.failed.push(endpoint);
          console.warn(`⚠️ Failed to prefetch ${endpoint}:`, error.message);
        }
      }
    }

    results.duration = Date.now() - startTime;

    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ Prefetch complete: ${results.success.length}/${results.total} succeeded in ${results.duration}ms`);
      
      if (results.failed.length > 0) {
        console.warn('⚠️ Some endpoints failed (this is OK if server is not running):', results.failed);
      }
    }

    return results;
  } catch (error) {
    console.warn('⚠️ Prefetch encountered errors:', error.message);
    results.duration = Date.now() - startTime;
    return results;
  }
}

/**
 * Prefetch specific resource type
 * 
 * @param {string} resourceType - Resource type (core, extended, user)
 * @returns {Promise<void>}
 */
export async function prefetchResource(resourceType) {
  if (!PREFETCH_CONFIG[resourceType]) {
    console.warn(`Unknown resource type: ${resourceType}`);
    return;
  }

  console.log(`🔄 Prefetching ${resourceType} data...`);
  
  const endpoints = PREFETCH_CONFIG[resourceType];
  await dataFetcher.fetchMultiple(endpoints);
  
  console.log(`✅ ${resourceType} data prefetched`);
}

/**
 * Prefetch data for specific page/route
 * 
 * @param {string} route - Route path
 * @returns {Promise<void>}
 */
export async function prefetchForRoute(route) {
  console.log(`🔄 Prefetching data for route: ${route}`);

  const routeConfig = {
    '/': [
      { endpoint: '/api/banners', options: {} },
      { endpoint: '/api/categories', options: {} },
      { endpoint: '/api/products', options: { params: { featured: true, limit: 20 } } },
    ],
    '/store': [
      { endpoint: '/api/products', options: { params: { limit: 50 } } },
      { endpoint: '/api/categories', options: {} },
    ],
    '/products': [
      { endpoint: '/api/products', options: {} },
      { endpoint: '/api/categories', options: {} },
    ],
    '/profile': [
      { endpoint: '/api/user/profile', options: {} },
      { endpoint: '/api/orders', options: {} },
    ],
    '/dashboard': [
      { endpoint: '/api/user/profile', options: {} },
      { endpoint: '/api/orders', options: {} },
      { endpoint: '/api/analytics', options: {} },
    ],
  };

  const endpoints = routeConfig[route];
  
  if (!endpoints) {
    console.warn(`No prefetch config for route: ${route}`);
    return;
  }

  await dataFetcher.fetchMultiple(endpoints);
  console.log(`✅ Route data prefetched: ${route}`);
}

/**
 * Smart prefetch based on user navigation patterns
 * Prefetch likely next pages based on current route
 * 
 * @param {string} currentRoute - Current route path
 * @returns {Promise<void>}
 */
export async function smartPrefetch(currentRoute) {
  const prefetchMap = {
    '/': ['/store', '/products'],
    '/store': ['/products/[id]', '/cart'],
    '/products/[id]': ['/cart', '/checkout'],
    '/cart': ['/checkout'],
    '/profile': ['/orders'],
  };

  const nextRoutes = prefetchMap[currentRoute] || [];
  
  if (nextRoutes.length === 0) return;

  console.log(`🧠 Smart prefetching for routes: ${nextRoutes.join(', ')}`);

  for (const route of nextRoutes) {
    await prefetchForRoute(route);
  }
}

/**
 * Prefetch on idle (using requestIdleCallback)
 * Best for background prefetching without blocking main thread
 * 
 * @param {Function} prefetchFn - Prefetch function to execute
 * @returns {void}
 */
export function prefetchOnIdle(prefetchFn) {
  if (typeof window === 'undefined') return;

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => {
      prefetchFn();
    });
  } else {
    // Fallback for browsers without requestIdleCallback
    setTimeout(() => {
      prefetchFn();
    }, 1000);
  }
}

/**
 * Prefetch on interaction (hover, focus)
 * Useful for prefetching data when user shows intent
 * 
 * @param {string} endpoint - API endpoint
 * @param {object} options - Fetch options
 * @returns {Function} - Event handler
 */
export function createPrefetchHandler(endpoint, options = {}) {
  let prefetched = false;

  return async () => {
    if (prefetched) return;
    
    prefetched = true;
    await dataFetcher.preload(endpoint, options);
  };
}

/**
 * Background refresh - revalidate cache in background
 * 
 * @param {number} interval - Refresh interval in milliseconds
 * @returns {Function} - Cleanup function
 */
export function startBackgroundRefresh(interval = 5 * 60 * 1000) {
  console.log(`🔄 Starting background refresh (interval: ${interval}ms)`);

  const intervalId = setInterval(async () => {
    console.log('🔄 Background refresh...');
    
    // Revalidate core data
    await prefetchResource('core');
  }, interval);

  // Return cleanup function
  return () => {
    clearInterval(intervalId);
    console.log('🛑 Background refresh stopped');
  };
}

/**
 * Add custom endpoint to prefetch config
 * 
 * @param {string} category - Category (core, extended, user)
 * @param {object} endpointConfig - Endpoint configuration
 */
export function addPrefetchEndpoint(category, endpointConfig) {
  if (!PREFETCH_CONFIG[category]) {
    PREFETCH_CONFIG[category] = [];
  }
  
  PREFETCH_CONFIG[category].push(endpointConfig);
  console.log(`➕ Added prefetch endpoint to ${category}:`, endpointConfig.endpoint);
}

/**
 * Get prefetch configuration
 */
export function getPrefetchConfig() {
  return PREFETCH_CONFIG;
}

// Export default object
const prefetch = {
  all: prefetchAll,
  resource: prefetchResource,
  route: prefetchForRoute,
  smart: smartPrefetch,
  onIdle: prefetchOnIdle,
  createHandler: createPrefetchHandler,
  startBackgroundRefresh,
  addEndpoint: addPrefetchEndpoint,
  getConfig: getPrefetchConfig,
};

export default prefetch;
