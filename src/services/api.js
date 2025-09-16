import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('auth_token');
      window.location.href = '/';
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

// Auth API
export const authAPI = {
  walletLogin: (data) => api.post('/auth/wallet-login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  logout: () => api.post('/auth/logout'),
};

// Transaction API
export const transactionAPI = {
  send: (data) => api.post('/transactions/send', data),
  getHistory: (params) => api.get('/transactions/history', { params }),
  getTransaction: (txId) => api.get(`/transactions/${txId}`),
  updateStatus: (txId) => api.put(`/transactions/${txId}/status`),
};

// Rates API
export const ratesAPI = {
  getRates: () => api.get('/rates'),
  convert: (data) => api.post('/rates/convert', data),
};

// Users API
export const usersAPI = {
  getStats: () => api.get('/users/stats'),
};

export default api;
