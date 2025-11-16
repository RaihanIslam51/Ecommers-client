/**
 * Global Prefetch Configuration
 * 
 * Centralized configuration for the entire prefetching system.
 * Modify these settings to customize behavior for your application.
 */

export const PREFETCH_CONFIG = {
  // ============================================================================
  // CACHE CONFIGURATION
  // ============================================================================
  
  cache: {
    // Enable/disable caching globally
    enabled: true,
    
    // Default TTL (Time To Live) in milliseconds
    defaultTTL: 5 * 60 * 1000, // 5 minutes
    
    // TTL per resource type
    ttl: {
      products: 10 * 60 * 1000,      // 10 minutes
      categories: 30 * 60 * 1000,    // 30 minutes
      banners: 15 * 60 * 1000,       // 15 minutes
      user: 5 * 60 * 1000,           // 5 minutes
      orders: 2 * 60 * 1000,         // 2 minutes
      cart: 1 * 60 * 1000,           // 1 minute
      search: 3 * 60 * 1000,         // 3 minutes
      analytics: 10 * 60 * 1000,     // 10 minutes
    },
    
    // Auto cleanup expired entries interval
    cleanupInterval: 60 * 1000, // 1 minute
    
    // Maximum cache size (approximate, in number of entries)
    maxSize: 1000,
  },

  // ============================================================================
  // PREFETCH CONFIGURATION
  // ============================================================================
  
  prefetch: {
    // Enable/disable prefetching
    enabled: true,
    
    // Prefetch on app initialization
    onAppInit: true,
    
    // Fetch all endpoints in parallel (faster but more server load)
    parallel: true,
    
    // Use requestIdleCallback for non-blocking prefetch
    useIdleCallback: true,
    
    // Background refresh interval (0 to disable)
    backgroundRefreshInterval: 5 * 60 * 1000, // 5 minutes
    
    // Smart prefetch - predict and prefetch likely next pages
    smartPrefetch: true,
    
    // Prefetch on link hover/focus
    prefetchOnHover: true,
    
    // Delay before prefetch on hover (milliseconds)
    hoverDelay: 0,
  },

  // ============================================================================
  // ENDPOINTS TO PREFETCH
  // ============================================================================
  
  endpoints: {
    // Core data - always prefetch on app load
    core: [
      { 
        endpoint: '/api/products', 
        options: { params: { limit: 50 } },
        description: 'Main product list'
      },
      { 
        endpoint: '/api/categories', 
        options: {},
        description: 'Product categories'
      },
      { 
        endpoint: '/api/banners', 
        options: {},
        description: 'Homepage banners'
      },
    ],
    
    // Extended data - prefetch if enabled
    extended: [
      { 
        endpoint: '/api/products', 
        options: { params: { featured: true, limit: 20 } },
        description: 'Featured products'
      },
      { 
        endpoint: '/api/products', 
        options: { params: { sort: 'popular', limit: 20 } },
        description: 'Popular products'
      },
      { 
        endpoint: '/api/products', 
        options: { params: { sort: 'newest', limit: 20 } },
        description: 'New arrivals'
      },
    ],
    
    // User-specific data - only prefetch if authenticated
    user: [
      { 
        endpoint: '/api/user/profile', 
        options: {},
        description: 'User profile'
      },
      { 
        endpoint: '/api/orders', 
        options: {},
        description: 'User orders'
      },
      { 
        endpoint: '/api/user/wishlist', 
        options: {},
        description: 'User wishlist'
      },
    ],
  },

  // ============================================================================
  // ROUTE-SPECIFIC PREFETCH CONFIGURATION
  // ============================================================================
  
  routes: {
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
    '/cart': [
      { endpoint: '/api/cart', options: {} },
      { endpoint: '/api/shipping/options', options: {} },
    ],
    '/checkout': [
      { endpoint: '/api/cart', options: {} },
      { endpoint: '/api/shipping/options', options: {} },
      { endpoint: '/api/payment/methods', options: {} },
    ],
  },

  // ============================================================================
  // SMART PREFETCH NAVIGATION MAP
  // ============================================================================
  
  smartNavigation: {
    // Map of current route -> likely next routes
    '/': ['/store', '/products', '/hot-deals'],
    '/store': ['/products/[id]', '/cart'],
    '/products': ['/products/[id]', '/cart'],
    '/products/[id]': ['/cart', '/checkout'],
    '/cart': ['/checkout', '/store'],
    '/checkout': ['/profile/orders'],
    '/profile': ['/orders', '/wishlist'],
  },

  // ============================================================================
  // REQUEST CONFIGURATION
  // ============================================================================
  
  request: {
    // Request timeout in milliseconds
    timeout: 15000,
    
    // Maximum retries for failed requests
    maxRetries: 3,
    
    // Retry delay (exponential backoff)
    retryDelay: 1000,
    
    // Request deduplication window (milliseconds)
    deduplicationWindow: 5000,
  },

  // ============================================================================
  // LOGGING CONFIGURATION
  // ============================================================================
  
  logging: {
    // Enable logging in development
    enableInDev: true,
    
    // Enable logging in production
    enableInProd: false,
    
    // Log levels: 'all', 'errors', 'none'
    level: 'all',
    
    // Log cache operations
    logCache: true,
    
    // Log prefetch operations
    logPrefetch: true,
    
    // Log API requests
    logRequests: true,
  },

  // ============================================================================
  // PERFORMANCE CONFIGURATION
  // ============================================================================
  
  performance: {
    // Enable performance monitoring
    monitor: true,
    
    // Log slow requests (milliseconds)
    slowRequestThreshold: 2000,
    
    // Enable request timing
    enableTiming: true,
    
    // Compress responses (if server supports)
    compression: true,
  },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get cache TTL for specific resource type
 */
export function getCacheTTL(resourceType) {
  return PREFETCH_CONFIG.cache.ttl[resourceType] || PREFETCH_CONFIG.cache.defaultTTL;
}

/**
 * Check if caching is enabled
 */
export function isCacheEnabled() {
  return PREFETCH_CONFIG.cache.enabled;
}

/**
 * Check if prefetch is enabled
 */
export function isPrefetchEnabled() {
  return PREFETCH_CONFIG.prefetch.enabled;
}

/**
 * Check if logging is enabled
 */
export function isLoggingEnabled() {
  const isDev = process.env.NODE_ENV === 'development';
  return isDev 
    ? PREFETCH_CONFIG.logging.enableInDev 
    : PREFETCH_CONFIG.logging.enableInProd;
}

/**
 * Get endpoints for specific category
 */
export function getEndpoints(category) {
  return PREFETCH_CONFIG.endpoints[category] || [];
}

/**
 * Get prefetch config for route
 */
export function getRouteConfig(route) {
  return PREFETCH_CONFIG.routes[route] || [];
}

/**
 * Get smart navigation config for route
 */
export function getSmartNavigation(route) {
  return PREFETCH_CONFIG.smartNavigation[route] || [];
}

// Export default
export default PREFETCH_CONFIG;
