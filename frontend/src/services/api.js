import axios from 'axios';

const API_BASE_URL = '/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    return res.data;
  },
  register: async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password });
    return res.data;
  },
  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  }
};

export const itemService = {
  createItem: async (formData) => {
    const res = await api.post('/items/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },
  getMyItems: async () => {
    const res = await api.get('/items/my');
    return res.data;
  },
  getItem: async (id) => {
    const res = await api.get(`/items/${id}`);
    return res.data;
  },
  updateStatus: async (id, status) => {
    const res = await api.patch(`/items/${id}/status`, { status });
    return res.data;
  }
};

export const matchService = {
  getMyMatches: async () => {
    const res = await api.get('/matches/my');
    return res.data;
  },
  updateMatchStatus: async (id, status) => {
    const res = await api.patch(`/matches/${id}/status`, { status });
    return res.data;
  }
};

export const adminService = {
  getAllItems: async () => {
    const res = await api.get('/admin/items');
    return res.data;
  },
  getAllMatches: async () => {
    const res = await api.get('/admin/matches');
    return res.data;
  },
  verifyMatch: async (id) => {
    const res = await api.patch(`/admin/matches/${id}/verify`);
    return res.data;
  },
  markCollected: async (itemId) => {
    const res = await api.patch(`/admin/items/${itemId}/collected`);
    return res.data;
  }
};

export default api;
