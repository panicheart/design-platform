import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

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

// Auth API
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials),
  register: (userData: {
    username: string;
    email: string;
    password: string;
    department: string;
    position: string;
  }) => api.post('/auth/register', userData),
};

// Resource API
export const resourceAPI = {
  getAll: (params?: { type?: string; status?: string; visibility?: string }) =>
    api.get('/resources', { params }),
  getById: (id: string) => api.get(`/resources/${id}`),
  create: (data: any) => api.post('/resources', data),
  update: (id: string, data: any) => api.put(`/resources/${id}`, data),
  delete: (id: string) => api.delete(`/resources/${id}`),
};

// Task API
export const taskAPI = {
  getAll: (params?: { type?: string; status?: string; assignedTo?: string }) =>
    api.get('/tasks', { params }),
  getById: (id: string) => api.get(`/tasks/${id}`),
  create: (data: any) => api.post('/tasks', data),
  update: (id: string, data: any) => api.put(`/tasks/${id}`, data),
  delete: (id: string) => api.delete(`/tasks/${id}`),
  addComment: (id: string, content: string) =>
    api.post(`/tasks/${id}/comments`, { content }),
  updateProgress: (id: string, progress: number) =>
    api.patch(`/tasks/${id}/progress`, { progress }),
};

export default api; 