/**
 * Global Cache Manager — Memory + localStorage persistence
 *
 * Features:
 *  - In-memory Map for ultra-fast reads
 *  - localStorage fallback so data survives page refresh
 *  - Per-entry TTL (Time To Live)
 *  - Auto cleanup of expired entries every 60 s
 *  - Pattern-based invalidation
 *  - Safe server-side rendering (no-op when window is absent)
 */

const LS_PREFIX = 'ec_cache_';

const isClient = () => typeof window !== 'undefined';

class CacheManager {
  constructor() {
    /** @type {Map<string, any>} */
    this.cache = new Map();
    /** @type {Map<string, { createdAt: number; ttl: number }>} */
    this.timestamps = new Map();
    this.defaultTTL = 5 * 60 * 1000; // 5 minutes
    this._cleanupTimer = null;
    this._startCleanup();
  }

  // ---------------------------------------------------------------------------
  // Key generation
  // ---------------------------------------------------------------------------

  /** Create a deterministic cache key from endpoint + params */
  generateKey(url, params = {}) {
    try {
      const p = params && Object.keys(params).length ? `:${JSON.stringify(params)}` : '';
      return `${url}${p}`;
    } catch {
      return String(url);
    }
  }

  // ---------------------------------------------------------------------------
  // Core operations
  // ---------------------------------------------------------------------------

  /**
   * Store a value. Also persists to localStorage for page-reload survival.
   * @param {string} key
   * @param {any}    value
   * @param {number} [ttl] milliseconds
   */
  set(key, value, ttl = this.defaultTTL) {
    const meta = { createdAt: Date.now(), ttl };
    this.cache.set(key, value);
    this.timestamps.set(key, meta);

    // Persist to localStorage (skip huge payloads silently)
    if (isClient()) {
      try {
        const entry = JSON.stringify({ value, meta });
        localStorage.setItem(LS_PREFIX + key, entry);
      } catch {
        /* quota exceeded or serialisation error — that's fine */
      }
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`💾 Cache SET: ${key} (TTL: ${Math.round(ttl / 1000)}s)`);
    }
  }

  /**
   * Retrieve a value.
   * Memory-first, then falls back to localStorage, then returns null.
   * @param {string} key
   * @returns {any|null}
   */
  get(key) {
    // --- Memory check ---
    if (this.cache.has(key)) {
      const meta = this.timestamps.get(key);
      if (meta && Date.now() - meta.createdAt <= meta.ttl) {
        if (process.env.NODE_ENV === 'development') {
          console.log(`⚡ Cache HIT (memory): ${key}`);
        }
        return this.cache.get(key);
      }
      // Expired in memory
      this._deleteMemory(key);
    }

    // --- localStorage check ---
    if (isClient()) {
      try {
        const raw = localStorage.getItem(LS_PREFIX + key);
        if (raw) {
          const { value, meta } = JSON.parse(raw);
          if (meta && Date.now() - meta.createdAt <= meta.ttl) {
            // Warm up memory cache
            this.cache.set(key, value);
            this.timestamps.set(key, meta);
            if (process.env.NODE_ENV === 'development') {
              console.log(`📦 Cache HIT (localStorage): ${key}`);
            }
            return value;
          }
          // Expired in localStorage too
          localStorage.removeItem(LS_PREFIX + key);
        }
      } catch {
        /* corrupt entry */
      }
    }

    return null;
  }

  /** @param {string} key @returns {boolean} */
  has(key) {
    return this.get(key) !== null;
  }

  /** @param {string} key */
  delete(key) {
    this._deleteMemory(key);
    if (isClient()) {
      try { localStorage.removeItem(LS_PREFIX + key); } catch { /* ignore */ }
    }
    if (process.env.NODE_ENV === 'development') {
      console.log(`🗑️ Cache DELETE: ${key}`);
    }
  }

  /** Remove all cache entries (memory + localStorage) */
  clear() {
    this.cache.clear();
    this.timestamps.clear();
    if (isClient()) {
      try {
        Object.keys(localStorage)
          .filter(k => k.startsWith(LS_PREFIX))
          .forEach(k => localStorage.removeItem(k));
      } catch { /* ignore */ }
    }
    if (process.env.NODE_ENV === 'development') {
      console.log('🧹 Cache CLEARED');
    }
  }

  /**
   * Invalidate all entries whose key matches a pattern.
   * @param {string|RegExp} pattern
   * @returns {number} number of removed entries
   */
  invalidatePattern(pattern) {
    const re = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
    const toRemove = [];

    for (const key of this.cache.keys()) {
      if (re.test(key)) toRemove.push(key);
    }
    // Also check localStorage keys not yet in memory
    if (isClient()) {
      try {
        Object.keys(localStorage)
          .filter(k => k.startsWith(LS_PREFIX))
          .map(k => k.slice(LS_PREFIX.length))
          .filter(k => re.test(k) && !toRemove.includes(k))
          .forEach(k => toRemove.push(k));
      } catch { /* ignore */ }
    }

    toRemove.forEach(k => this.delete(k));

    if (process.env.NODE_ENV === 'development') {
      console.log(`🔄 Cache INVALIDATED: ${toRemove.length} entries matching ${pattern}`);
    }
    return toRemove.length;
  }

  // ---------------------------------------------------------------------------
  // Stats
  // ---------------------------------------------------------------------------

  getStats() {
    const now = Date.now();
    let valid = 0;
    let expired = 0;
    for (const [, meta] of this.timestamps) {
      (now - meta.createdAt <= meta.ttl ? valid++ : expired++);
    }
    return { total: this.cache.size, valid, expired };
  }

  // ---------------------------------------------------------------------------
  // Cleanup
  // ---------------------------------------------------------------------------

  cleanup() {
    const now = Date.now();
    const toRemove = [];
    for (const [key, meta] of this.timestamps) {
      if (now - meta.createdAt > meta.ttl) toRemove.push(key);
    }
    toRemove.forEach(k => this._deleteMemory(k));
    if (toRemove.length && process.env.NODE_ENV === 'development') {
      console.log(`🧼 Cache CLEANUP: removed ${toRemove.length} expired entries`);
    }
  }

  keys() {
    return Array.from(this.cache.keys());
  }

  size() {
    return this.cache.size;
  }

  // ---------------------------------------------------------------------------
  // Internals
  // ---------------------------------------------------------------------------

  _deleteMemory(key) {
    this.cache.delete(key);
    this.timestamps.delete(key);
  }

  _startCleanup() {
    if (!isClient()) return;
    this._cleanupTimer = setInterval(() => this.cleanup(), 60 * 1000);
    // Don't block process exit in Node environments
    if (this._cleanupTimer.unref) this._cleanupTimer.unref();
  }

  stopCleanup() {
    if (this._cleanupTimer) {
      clearInterval(this._cleanupTimer);
      this._cleanupTimer = null;
    }
  }
}

// Singleton
const cacheManager = new CacheManager();

export default cacheManager;
export { CacheManager };
