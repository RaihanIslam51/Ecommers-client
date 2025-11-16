/**
 * MIGRATION EXAMPLES
 * 
 * Step-by-step examples showing how to migrate your existing code
 * to use the new caching system.
 */

// ============================================================================
// EXAMPLE 1: Simple Product List (Server Component)
// ============================================================================

// ❌ BEFORE - Using direct axios
// ============================================================================
/*
import axiosInstance from '@/lib/axios';

export default async function ProductsPage() {
  const response = await axiosInstance.get('/api/products');
  const products = response.data;

  return (
    <div>
      {products.map(product => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
*/

// ✅ AFTER - Using cached data fetcher
// ============================================================================
import dataFetcher from '@/lib/dataFetcher';

export default async function ProductsPage() {
  // Data is automatically cached and reused
  const products = await dataFetcher.fetch('/api/products');

  return (
    <div>
      {products.map(product => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}

// ============================================================================
// EXAMPLE 2: Client Component with useEffect
// ============================================================================

// ❌ BEFORE - Manual state management
// ============================================================================
/*
'use client';
import { useState, useEffect } from 'react';
import axiosInstance from '@/lib/axios';

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await axiosInstance.get('/api/categories');
        setCategories(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {categories.map(cat => (
        <CategoryCard key={cat._id} category={cat} />
      ))}
    </div>
  );
}
*/

// ✅ AFTER - Using custom hook
// ============================================================================
'use client';
import { useCachedFetch } from '@/hooks/useCachedData';

export default function CategoryList() {
  const { data: categories, loading, error } = useCachedFetch('/api/categories');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {categories?.map(cat => (
        <CategoryCard key={cat._id} category={cat} />
      ))}
    </div>
  );
}

// ============================================================================
// EXAMPLE 3: Fetching with Parameters
// ============================================================================

// ❌ BEFORE
// ============================================================================
/*
const response = await axiosInstance.get('/api/products', {
  params: { 
    category: 'electronics',
    limit: 20,
    sort: 'price'
  }
});
const products = response.data;
*/

// ✅ AFTER
// ============================================================================
const products = await dataFetcher.fetch('/api/products', {
  params: { 
    category: 'electronics',
    limit: 20,
    sort: 'price'
  }
});

// ============================================================================
// EXAMPLE 4: Multiple Parallel Requests
// ============================================================================

// ❌ BEFORE
// ============================================================================
/*
const [productsRes, categoriesRes, bannersRes] = await Promise.all([
  axiosInstance.get('/api/products'),
  axiosInstance.get('/api/categories'),
  axiosInstance.get('/api/banners'),
]);

const products = productsRes.data;
const categories = categoriesRes.data;
const banners = bannersRes.data;
*/

// ✅ AFTER
// ============================================================================
const [products, categories, banners] = await dataFetcher.fetchMultiple([
  { endpoint: '/api/products', options: {} },
  { endpoint: '/api/categories', options: {} },
  { endpoint: '/api/banners', options: {} },
]);

// ============================================================================
// EXAMPLE 5: POST Request with Cache Invalidation
// ============================================================================

// ❌ BEFORE
// ============================================================================
/*
async function addProduct(productData) {
  const response = await axiosInstance.post('/api/products', productData);
  // Need to manually refetch or update state
  refetchProducts();
  return response.data;
}
*/

// ✅ AFTER
// ============================================================================
async function addProduct(productData) {
  const result = await dataFetcher.post('/api/products', productData);
  // Cache is automatically invalidated for /api/products
  return result;
}

// ============================================================================
// EXAMPLE 6: Form Submit with Mutation Hook
// ============================================================================

// ❌ BEFORE
// ============================================================================
/*
'use client';
import { useState } from 'react';
import axiosInstance from '@/lib/axios';

export default function AddProductForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData);
      
      await axiosInstance.post('/api/products', data);
      alert('Product added!');
      
      // Need to manually refetch
      window.location.reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" required />
      <input name="price" type="number" required />
      <button type="submit" disabled={loading}>
        {loading ? 'Adding...' : 'Add Product'}
      </button>
      {error && <div>Error: {error}</div>}
    </form>
  );
}
*/

// ✅ AFTER
// ============================================================================
'use client';
import { useCachedMutation } from '@/hooks/useCachedData';

export default function AddProductForm() {
  const { mutate, loading, error } = useCachedMutation('/api/products');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    try {
      await mutate('POST', data);
      alert('Product added!');
      // Cache is automatically invalidated
    } catch (err) {
      // Error handled automatically
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" required />
      <input name="price" type="number" required />
      <button type="submit" disabled={loading}>
        {loading ? 'Adding...' : 'Add Product'}
      </button>
      {error && <div>Error: {error}</div>}
    </form>
  );
}

// ============================================================================
// EXAMPLE 7: Prefetch on Hover
// ============================================================================

// ❌ BEFORE
// ============================================================================
/*
import Link from 'next/link';

export default function ProductLink({ productId }) {
  return (
    <Link href={`/products/${productId}`}>
      View Product
    </Link>
  );
}
*/

// ✅ AFTER - Prefetch on hover
// ============================================================================
import Link from 'next/link';
import { usePrefetchHandlers } from '@/hooks/useCachedData';

export default function ProductLink({ productId }) {
  const prefetchHandlers = usePrefetchHandlers(`/api/products/${productId}`);

  return (
    <Link 
      href={`/products/${productId}`}
      {...prefetchHandlers}
    >
      View Product
    </Link>
  );
}

// ============================================================================
// EXAMPLE 8: Manual Cache Invalidation
// ============================================================================

// ❌ BEFORE
// ============================================================================
/*
import { useRouter } from 'next/navigation';

export default function DeleteButton({ productId }) {
  const router = useRouter();

  const handleDelete = async () => {
    await axiosInstance.delete(`/api/products/${productId}`);
    router.refresh(); // Force page reload
  };

  return <button onClick={handleDelete}>Delete</button>;
}
*/

// ✅ AFTER
// ============================================================================
import { useCacheInvalidation } from '@/hooks/useCachedData';
import dataFetcher from '@/lib/dataFetcher';

export default function DeleteButton({ productId }) {
  const { invalidatePattern } = useCacheInvalidation();

  const handleDelete = async () => {
    await dataFetcher.delete(`/api/products/${productId}`);
    // Manually invalidate if needed (though auto-invalidation should work)
    invalidatePattern(/\/api\/products/);
  };

  return <button onClick={handleDelete}>Delete</button>;
}

// ============================================================================
// EXAMPLE 9: Optimistic Updates
// ============================================================================

// ✅ NEW FEATURE - Optimistic UI updates
// ============================================================================
import { useOptimisticUpdate } from '@/hooks/useCachedData';
import dataFetcher from '@/lib/dataFetcher';

export default function LikeButton({ productId, initialLikes }) {
  const { data, optimisticUpdate } = useOptimisticUpdate(
    `/api/products/${productId}`
  );

  const handleLike = async () => {
    await optimisticUpdate(
      // Optimistic update function
      (currentData) => ({
        ...currentData,
        likes: currentData.likes + 1,
      }),
      // Actual mutation
      () => dataFetcher.post(`/api/products/${productId}/like`)
    );
  };

  const likes = data?.likes ?? initialLikes;

  return (
    <button onClick={handleLike}>
      ❤️ {likes}
    </button>
  );
}

// ============================================================================
// EXAMPLE 10: Conditional Prefetching
// ============================================================================

// ✅ NEW FEATURE - Smart prefetching
// ============================================================================
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import prefetch from '@/lib/prefetch';

export default function Layout({ children }) {
  const { data: session } = useSession();

  useEffect(() => {
    // Only prefetch user data if authenticated
    if (session?.user) {
      prefetch.resource('user');
    }
  }, [session]);

  return <>{children}</>;
}

// ============================================================================
// KEY TAKEAWAYS
// ============================================================================

/*
1. Replace axiosInstance.get() with dataFetcher.fetch()
2. Replace axiosInstance.post() with dataFetcher.post()
3. Use useCachedFetch() hook for client components
4. Use useCachedMutation() for forms and mutations
5. Cache is automatically managed - no manual refetching needed
6. Prefetching happens automatically on app load
7. Add prefetch handlers to links for instant navigation
8. Use optimistic updates for better UX
9. Manual cache control available when needed
10. All data is cached and shared globally
*/
