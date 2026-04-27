import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  getAdmins: () => api.get('/auth/admins'),
  createAdmin: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/admins', data),
  updateAdmin: (id: string, data: { name: string; email: string; password?: string }) =>
    api.put(`/auth/admins/${id}`, data),
  deleteAdmin: (id: string) => api.delete(`/auth/admins/${id}`),
};

// Product APIs
export const productAPI = {
  getAll: (params?: any) => api.get('/products', { params }),
  getById: (id: string) => api.get(`/products/${id}`),
  create: (data: any) => api.post('/products', data),
  update: (id: string, data: any) => api.put(`/products/${id}`, data),
  delete: (id: string) => api.delete(`/products/${id}`),
};

// Cart APIs
export const cartAPI = {
  get: () => api.get('/cart'),
  addItem: (data: { productId: string; quantity: number; selectedSize: number }) =>
    api.post('/cart', data),
  updateItem: (id: string, data: { quantity: number }) =>
    api.put(`/cart/${id}`, data),
  removeItem: (id: string) => api.delete(`/cart/${id}`),
  clear: () => api.delete('/cart'),
};

// Order APIs
export const orderAPI = {
  create: (data: any) => api.post('/orders', data),
  getAll: () => api.get('/orders'),
  getById: (id: string) => api.get(`/orders/${id}`),
  updateStatus: (id: string, data: { status: string }) =>
    api.put(`/orders/${id}/status`, data),
  getAllAdmin: () => api.get('/orders/all'),
};

export const statsAPI = {
  getDashboard: () => api.get('/stats'),
};

export default api;
