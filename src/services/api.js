import axiosInstance from '@/lib/axios';

// Example API service functions
export const api = {
  // Products
  products: {
    getAll: () => axiosInstance.get('/api/products'),
    getById: (id) => axiosInstance.get(`/api/products/${id}`),
    create: (data) => axiosInstance.post('/api/products', data),
    update: (id, data) => axiosInstance.put(`/api/products/${id}`, data),
    delete: (id) => axiosInstance.delete(`/api/products/${id}`),
  },

  // Categories
  categories: {
    getAll: () => axiosInstance.get('/api/categories'),
    getById: (id) => axiosInstance.get(`/api/categories/${id}`),
    create: (data) => axiosInstance.post('/api/categories', data),
    update: (id, data) => axiosInstance.put(`/api/categories/${id}`, data),
    delete: (id) => axiosInstance.delete(`/api/categories/${id}`),
  },

  // Orders
  orders: {
    getAll: () => axiosInstance.get('/api/orders'),
    getById: (id) => axiosInstance.get(`/api/orders/${id}`),
    create: (data) => axiosInstance.post('/api/orders', data),
    update: (id, data) => axiosInstance.put(`/api/orders/${id}`, data),
    delete: (id) => axiosInstance.delete(`/api/orders/${id}`),
  },

  // Customers
  customers: {
    getAll: () => axiosInstance.get('/api/customers'),
    getById: (id) => axiosInstance.get(`/api/customers/${id}`),
    create: (data) => axiosInstance.post('/api/customers', data),
    update: (id, data) => axiosInstance.put(`/api/customers/${id}`, data),
    delete: (id) => axiosInstance.delete(`/api/customers/${id}`),
  },

  // Auth
  auth: {
    login: (credentials) => axiosInstance.post('/api/auth/login', credentials),
    register: (userData) => axiosInstance.post('/api/auth/register', userData),
    logout: () => axiosInstance.post('/api/auth/logout'),
    getProfile: () => axiosInstance.get('/api/auth/profile'),
  },
};

export default api;
