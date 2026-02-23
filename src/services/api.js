import axiosInstance from '@/lib/axios';

// API service functions - all paths match server endpoints
export const api = {
  // Products
  products: {
    getAll: () => axiosInstance.get('/products'),
    getById: (id) => axiosInstance.get(`/products/${id}`),
    create: (data) => axiosInstance.post('/products', data),
    update: (id, data) => axiosInstance.put(`/products/${id}`, data),
    delete: (id) => axiosInstance.delete(`/products/${id}`),
    search: (query) => axiosInstance.get(`/products/search/${encodeURIComponent(query)}`),
  },

  // Categories
  categories: {
    getAll: () => axiosInstance.get('/categories'),
    getById: (id) => axiosInstance.get(`/categories/${id}`),
    create: (data) => axiosInstance.post('/categories', data),
    update: (id, data) => axiosInstance.put(`/categories/${id}`, data),
    delete: (id) => axiosInstance.delete(`/categories/${id}`),
  },

  // Orders
  orders: {
    getAll: () => axiosInstance.get('/orders'),
    getById: (id) => axiosInstance.get(`/orders/${id}`),
    create: (data) => axiosInstance.post('/orders', data),
    update: (id, data) => axiosInstance.put(`/orders/${id}`, data),
    delete: (id) => axiosInstance.delete(`/orders/${id}`),
    updateStatus: (id, status) => axiosInstance.put(`/orders/${id}`, { status }),
  },

  // Banners
  banners: {
    getAll: () => axiosInstance.get('/banners'),
    getById: (id) => axiosInstance.get(`/banners/${id}`),
    getByPosition: (position) => axiosInstance.get(`/banners/position/${position}`),
    create: (data) => axiosInstance.post('/banners', data),
    update: (id, data) => axiosInstance.put(`/banners/${id}`, data),
    delete: (id) => axiosInstance.delete(`/banners/${id}`),
  },

  // Messages
  messages: {
    getAll: () => axiosInstance.get('/messages'),
    getUnread: () => axiosInstance.get('/messages/unread'),
    create: (data) => axiosInstance.post('/messages', data),
    markAsRead: (id) => axiosInstance.post(`/messages/${id}/read`),
    markAllAsRead: () => axiosInstance.post('/messages/read-all'),
    delete: (id) => axiosInstance.delete(`/messages/${id}`),
  },

  // Notifications
  notifications: {
    getAll: () => axiosInstance.get('/notifications'),
    getUnread: () => axiosInstance.get('/notifications/unread'),
    markAsRead: (id) => axiosInstance.post(`/notifications/${id}/read`),
    markAllAsRead: () => axiosInstance.post('/notifications/read-all'),
    delete: (id) => axiosInstance.delete(`/notifications/${id}`),
  },

  // Users
  users: {
    getAll: (params) => axiosInstance.get('/users', { params }),
    getById: (id) => axiosInstance.get(`/users/${id}`),
    updateRole: (id, role) => axiosInstance.put(`/users/${id}/role`, { role }),
    delete: (id) => axiosInstance.delete(`/users/${id}`),
  },

  // Auth
  auth: {
    login: (credentials) => axiosInstance.post('/auth/login', credentials),
    signup: (userData) => axiosInstance.post('/auth/signup', userData),
    // logout is handled client-side via NextAuth signOut()
    logout: () => Promise.resolve({ data: { success: true } }),
    getProfile: (userId) => axiosInstance.get(`/auth/profile/${userId}`),
    updateProfile: (userId, data) => axiosInstance.put(`/auth/profile/${userId}`, data),
    changePassword: (data) => axiosInstance.post('/auth/change-password', data),
  },

  // Dashboard & Analytics
  dashboard: {
    getStats: () => axiosInstance.get('/dashboard/stats'),
  },

  analytics: {
    getStats: () => axiosInstance.get('/analytics/stats'),
  },

  // Email
  email: {
    send: (data) => axiosInstance.post('/email/send-email', data),
    sendToAll: (data) => axiosInstance.post('/email/send-to-all-customers', data),
    test: () => axiosInstance.get('/email/test'),
  },
};

export default api;
