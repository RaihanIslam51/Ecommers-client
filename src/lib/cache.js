/**
 * Global Cache Manager
 * 
 * Provides in-memory caching with TTL (Time To Live) support,
 * cache invalidation, and automatic cleanup.
 */

/* ===== ORIGINAL CacheManager (COMMENTED OUT) ===== */
// class CacheManager {
//   constructor() {
//     this.cache = new Map();
//     this.timestamps = new Map();
//     this.defaultTTL = 5 * 60 * 1000; // 5 minutes default
//     this.cleanupInterval = null;
//     
//     // Start automatic cleanup
//     this.startCleanup();
//   }
//
//   /**
//    * Generate a cache key from URL and params
//    */
//   generateKey(url, params = {}) {
//     const paramString = Object.keys(params).length > 0 
//       ? JSON.stringify(params) 
//       : '';
//     return `${url}:${paramString}`;
//   }
//
//   /**
//    * Set cache entry with optional TTL
//    */
//   set(key, value, ttl = this.defaultTTL) {
//     this.cache.set(key, value);
//     this.timestamps.set(key, {
//       createdAt: Date.now(),
//       ttl,
//     });
//
//     if (process.env.NODE_ENV === 'development') {
//       console.log(`💾 Cache SET: ${key} (TTL: ${ttl}ms)`);
//     }
//   }
//
//   /**
//    * Get cache entry if valid
//    */
//   get(key) {
//     if (!this.cache.has(key)) {
//       return null;
//     }
//
//     const timestamp = this.timestamps.get(key);
//     if (!timestamp) {
//       this.cache.delete(key);
//       return null;
//     }
//
//     const isExpired = Date.now() - timestamp.createdAt > timestamp.ttl;
//     
//     if (isExpired) {
//       this.delete(key);
//       if (process.env.NODE_ENV === 'development') {
//         console.log(`⏰ Cache EXPIRED: ${key}`);
//       }
//       return null;
//     }
//
//     if (process.env.NODE_ENV === 'development') {
//       console.log(`✅ Cache HIT: ${key}`);
//     }
//     return this.cache.get(key);
//   }
//
//   /**
//    * Check if cache entry exists and is valid
//    */
//   has(key) {
//     return this.get(key) !== null;
//   }
//
//   /**
//    * Delete specific cache entry
//    */
//   delete(key) {
//     this.cache.delete(key);
//     this.timestamps.delete(key);
//     
//     if (process.env.NODE_ENV === 'development') {
//       console.log(`🗑️ Cache DELETE: ${key}`);
//     }
//   }
//
//   /**
//    * Clear all cache entries
//    */
//   clear() {
//     this.cache.clear();
//     this.timestamps.clear();
//     
//     if (process.env.NODE_ENV === 'development') {
//       console.log('🧹 Cache CLEARED');
//     }
//   }
//
//   /**
//    * Invalidate cache by pattern (regex or string)
//    */
//   invalidatePattern(pattern) {
//     const regex = typeof pattern === 'string' 
//       ? new RegExp(pattern) 
//       : pattern;
//     
//     const keysToDelete = [];
//     
//     for (const key of this.cache.keys()) {
//       if (regex.test(key)) {
//         keysToDelete.push(key);
//       }
//     }
//
//     keysToDelete.forEach(key => this.delete(key));
//     
//     if (process.env.NODE_ENV === 'development') {
//       console.log(`🔄 Cache INVALIDATED: ${keysToDelete.length} entries matching ${pattern}`);
//     }
//     
//     return keysToDelete.length;
//   }
//
//   /**
//    * Get cache statistics
//    */
//   getStats() {
//     const now = Date.now();
//     let validEntries = 0;
//     let expiredEntries = 0;
//
//     for (const [key, timestamp] of this.timestamps.entries()) {
//       const isExpired = now - timestamp.createdAt > timestamp.ttl;
//       if (isExpired) {
//         expiredEntries++;
//       } else {
//         validEntries++;
//       }
//     }
//
//     return {
//       total: this.cache.size,
//       valid: validEntries,
//       expired: expiredEntries,
//     };
//   }
//
//   /**
//    * Clean up expired entries
//    */
//   cleanup() {
//     const now = Date.now();
//     const keysToDelete = [];
//
//     for (const [key, timestamp] of this.timestamps.entries()) {
//       const isExpired = now - timestamp.createdAt > timestamp.ttl;
//       if (isExpired) {
//         keysToDelete.push(key);
//       }
//     }
//
//     keysToDelete.forEach(key => {
//       this.cache.delete(key);
//       this.timestamps.delete(key);
//     });
//
//     if (keysToDelete.length > 0 && process.env.NODE_ENV === 'development') {
//       console.log(`🧼 Cache CLEANUP: Removed ${keysToDelete.length} expired entries`);
//     }
//   }
//
//   /**
//    * Start automatic cleanup interval
//    */
//   startCleanup() {
//     if (this.cleanupInterval) return;
//     
//     // Run cleanup every minute
//     this.cleanupInterval = setInterval(() => {
//       this.cleanup();
//     }, 60 * 1000);
//   }
//
//   /**
//    * Stop automatic cleanup
//    */
//   stopCleanup() {
//     if (this.cleanupInterval) {
//       clearInterval(this.cleanupInterval);
//       this.cleanupInterval = null;
//     }
//   }
//
//   /**
//    * Get all cache keys
//    */
//   keys() {
//     return Array.from(this.cache.keys());
//   }
//
//   /**
//    * Get cache size
//    */
//   size() {
//     return this.cache.size;
//   }
// }
//
// // Create singleton instance
// // const cacheManager = new CacheManager();
// //
// // // Export both the instance and the class
// // export default cacheManager;
// // export { CacheManager };

// ----- NO-OP CacheManager (caching DISABLED) -----
class CacheManagerNoOp {
  constructor() { /* caching disabled */ }
  generateKey(url, params = {}) { try { return `${url}:${JSON.stringify(params||{})}` } catch(e){ return String(url) } }
  set(key, value, ttl) { /* no-op */ }
  get(key) { return null; }
  has(key) { return false; }
  delete(key) { /* no-op */ }
  clear() { /* no-op */ }
  invalidatePattern() { return 0; }
  getStats() { return { total: 0, valid: 0, expired: 0 }; }
  cleanup() { /* no-op */ }
  startCleanup() { /* no-op */ }
  stopCleanup() { /* no-op */ }
  keys() { return []; }
  size() { return 0; }
}

const cacheManager = new CacheManagerNoOp();

export default cacheManager;
