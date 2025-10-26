# API Configuration Guide

## 📁 Structure

- **`axios.js`** - Axios instance with interceptors
- **`../hooks/useApi.js`** - Custom hooks for API calls
- **`../services/api.js`** - API service functions

## 🚀 Usage Examples

### 1. Using Custom Hooks (Recommended)

#### GET Request with useGet
```jsx
'use client';

import { useGet } from '@/hooks/useApi';
import { useEffect } from 'react';

export default function ProductsPage() {
  const { data, loading, error, refetch } = useGet('/api/products');

  useEffect(() => {
    refetch();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {data?.products?.map((product) => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}
```

#### POST Request with usePost
```jsx
'use client';

import { usePost } from '@/hooks/useApi';

export default function AddProduct() {
  const { data, loading, error, post } = usePost();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await post('/api/products', {
        name: 'New Product',
        price: 100,
      });
      console.log('Success:', result);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit" disabled={loading}>
        {loading ? 'Adding...' : 'Add Product'}
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
}
```

#### Generic useApi Hook
```jsx
'use client';

import { useApi } from '@/hooks/useApi';

export default function ProductManager() {
  const { data, loading, error, request } = useApi();

  const fetchProducts = async () => {
    await request('GET', '/api/products');
  };

  const createProduct = async (productData) => {
    await request('POST', '/api/products', productData);
  };

  const updateProduct = async (id, productData) => {
    await request('PUT', `/api/products/${id}`, productData);
  };

  const deleteProduct = async (id) => {
    await request('DELETE', `/api/products/${id}`);
  };

  return <div>{/* Your UI */}</div>;
}
```

### 2. Using API Services

```jsx
'use client';

import { api } from '@/services/api';
import { useState } from 'react';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const response = await api.products.getAll();
      setProducts(response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (productData) => {
    try {
      const response = await api.products.create(productData);
      console.log('Created:', response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return <div>{/* Your UI */}</div>;
}
```

### 3. Direct Axios Instance Usage

```jsx
'use client';

import axiosInstance from '@/lib/axios';

export default function CustomComponent() {
  const fetchData = async () => {
    try {
      const response = await axiosInstance.get('/api/custom-endpoint');
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return <div>{/* Your UI */}</div>;
}
```

### 4. Server Components (Next.js App Router)

```jsx
// app/products/page.jsx
import axiosInstance from '@/lib/axios';

async function getProducts() {
  try {
    const response = await axiosInstance.get('/api/products');
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div>
      {products.map((product) => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root of your project:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**Important:** Always prefix with `NEXT_PUBLIC_` for client-side access.

### Adding Authentication

Uncomment the auth code in `lib/axios.js`:

```javascript
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
```

## 🎯 Best Practices

1. ✅ Use custom hooks for client components
2. ✅ Use API services for organized code
3. ✅ Handle loading and error states
4. ✅ Use environment variables
5. ✅ Add authentication tokens via interceptors
6. ✅ Handle errors globally in interceptors
7. ✅ Use TypeScript for better type safety (optional)

## 📝 Notes

- Custom hooks only work in Client Components (`'use client'`)
- For Server Components, use the axios instance directly
- Environment variables with `NEXT_PUBLIC_` are exposed to the browser
- Without `NEXT_PUBLIC_` prefix, variables are only available server-side
