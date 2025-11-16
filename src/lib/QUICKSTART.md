# 🚀 Quick Start Guide - Global Data Prefetching

Get your prefetching system up and running in 5 minutes!

## ✅ System Status

The prefetching system is already installed and configured! Here's what's been set up:

### 📦 Installed Components

- ✅ **Cache Manager** (`lib/cache.js`) - In-memory caching with TTL
- ✅ **Data Fetcher** (`lib/dataFetcher.js`) - API wrapper with caching
- ✅ **Prefetch Orchestrator** (`lib/prefetch.js`) - Smart prefetching
- ✅ **React Provider** (`components/DataPrefetchProvider.jsx`) - Auto-prefetch on mount
- ✅ **Custom Hooks** (`hooks/useCachedData.js`) - React hooks for cached data
- ✅ **Configuration** (`lib/prefetchConfig.js`) - Centralized settings

### 🔗 Integration Status

- ✅ **Root Layout** - DataPrefetchProvider is integrated
- ✅ **Auto Prefetch** - Runs automatically on app load
- ✅ **Background Refresh** - Updates cache every 5 minutes
- ✅ **Smart Navigation** - Prefetches likely next pages

## 🎯 How to Use

### 1. Replace Your API Calls

**In Server Components:**
```javascript
// ❌ OLD
import axiosInstance from '@/lib/axios';
const response = await axiosInstance.get('/api/products');
const products = response.data;

// ✅ NEW (instant from cache!)
import dataFetcher from '@/lib/dataFetcher';
const products = await dataFetcher.fetch('/api/products');
```

**In Client Components:**
```javascript
// ❌ OLD
'use client';
import { useState, useEffect } from 'react';
import axiosInstance from '@/lib/axios';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get('/api/products')
      .then(res => setProducts(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  return <div>{/* render products */}</div>;
}

// ✅ NEW (instant from cache!)
'use client';
import { useCachedFetch } from '@/hooks/useCachedData';

export default function Products() {
  const { data: products, loading } = useCachedFetch('/api/products');

  if (loading) return <div>Loading...</div>;
  return <div>{/* render products */}</div>;
}
```

### 2. Configure What to Prefetch

Edit `lib/prefetchConfig.js`:

```javascript
export const PREFETCH_CONFIG = {
  endpoints: {
    core: [
      // Add your critical endpoints here
      { endpoint: '/api/products', options: { params: { limit: 50 } } },
      { endpoint: '/api/categories', options: {} },
    ],
  },
};
```

### 3. Check It's Working

Open your browser console and look for:

```
🚀 Starting global data prefetch...
💾 Cache SET: /api/products:{} (TTL: 600000ms)
💾 Cache SET: /api/categories:{} (TTL: 1800000ms)
✅ Prefetch complete: 5/5 succeeded in 1234ms
```

## 🎨 Common Patterns

### Fetch with Parameters
```javascript
const products = await dataFetcher.fetch('/api/products', {
  params: { category: 'electronics', limit: 20 }
});
```

### Multiple Requests in Parallel
```javascript
const [products, categories, banners] = await dataFetcher.fetchMultiple([
  { endpoint: '/api/products', options: {} },
  { endpoint: '/api/categories', options: {} },
  { endpoint: '/api/banners', options: {} },
]);
```

### Form Submissions
```javascript
'use client';
import { useCachedMutation } from '@/hooks/useCachedData';

export default function AddForm() {
  const { mutate, loading } = useCachedMutation('/api/products');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    await mutate('POST', data);
    // Cache automatically invalidated!
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

### Prefetch on Hover
```javascript
import { usePrefetchHandlers } from '@/hooks/useCachedData';

export default function ProductLink({ id }) {
  const handlers = usePrefetchHandlers(`/api/products/${id}`);
  
  return <Link href={`/products/${id}`} {...handlers}>View</Link>;
}
```

## ⚙️ Configuration

### Adjust Cache Duration

Edit `lib/prefetchConfig.js`:

```javascript
cache: {
  ttl: {
    products: 10 * 60 * 1000,   // 10 minutes
    categories: 30 * 60 * 1000, // 30 minutes
    user: 5 * 60 * 1000,        // 5 minutes
  }
}
```

### Enable/Disable Features

```javascript
prefetch: {
  enabled: true,              // Master switch
  parallel: true,             // Fetch all at once
  smartPrefetch: true,        // Predict next pages
  backgroundRefreshInterval: 5 * 60 * 1000, // 5 min
}
```

## 🔍 Debugging

### View Cache Stats
```javascript
import dataFetcher from '@/lib/dataFetcher';

const stats = dataFetcher.getStats();
console.log(stats); // { total: 10, valid: 8, expired: 2 }
```

### Clear Cache Manually
```javascript
// Clear everything
dataFetcher.clearAll();

// Clear specific pattern
dataFetcher.invalidatePattern(/\/api\/products/);

// Clear specific endpoint
dataFetcher.invalidate('/api/products', { category: 'electronics' });
```

### Enable Detailed Logging

Edit `lib/prefetchConfig.js`:

```javascript
logging: {
  enableInDev: true,
  level: 'all',
  logCache: true,
  logPrefetch: true,
  logRequests: true,
}
```

## 📊 Expected Results

### Before Prefetching
- Page load: 2-3s
- Navigation: 1-2s per page
- Multiple API calls per page

### After Prefetching
- Initial load: 2-3s (one-time prefetch)
- Navigation: ~0ms (instant from cache!)
- API calls: 70-80% reduction

## 🚨 Troubleshooting

### Data not caching?
1. Check console for cache operations
2. Verify `cache: true` in your fetch options
3. Check TTL isn't too short

### Stale data?
1. Reduce TTL in config
2. Enable background refresh
3. Use `revalidate: true` option

### High memory?
1. Reduce number of prefetched endpoints
2. Lower TTL values
3. Call `clearAll()` periodically

## 📚 Next Steps

1. ✅ **Migrate existing code** - See `MIGRATION_EXAMPLES.js`
2. ✅ **Customize endpoints** - Edit `prefetchConfig.js`
3. ✅ **Add hover prefetch** - Use `usePrefetchHandlers`
4. ✅ **Monitor performance** - Check cache stats
5. ✅ **Fine-tune TTL** - Adjust based on your data

## 🎉 You're All Set!

Your app now has:
- ⚡ Instant page navigation
- 💾 Automatic data caching
- 🧠 Smart prefetching
- 🔄 Background refresh
- 🚀 Blazing fast performance

Start using `dataFetcher.fetch()` instead of `axiosInstance.get()` and enjoy instant data access!

## 📖 Full Documentation

See `PREFETCH_GUIDE.md` for complete API reference and advanced patterns.
