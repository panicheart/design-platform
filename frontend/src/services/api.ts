import axios from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { store } from '../store';
import { logout } from '../store/slices/authSlice';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

interface LoginResponse {
  token: string;
  user: User;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  department: string;
}

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  department: string;
  position: string;
}

interface Task {
  id: string;
  _id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  priority: string;
  assignedTo: string;
  createdBy: string;
  department: string;
  startDate: Date;
  endDate: Date;
  dueDate: Date;
  estimatedHours: number;
  actualHours: number;
  tags: string[];
  progress: number;
  comments?: {
    id: string;
    user: {
      id: string;
      username: string;
      email: string;
    };
    content: string;
    timestamp: string;
  }[];
}

interface Resource {
  id: string;
  name: string;
  type: string;
  description: string;
  url: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

// 创建 axios 实例
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      store.dispatch(logout());
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials: LoginRequest) =>
    api.post<ApiResponse<LoginResponse>>('/auth/login', credentials),
  register: (userData: RegisterRequest) =>
    api.post<ApiResponse<LoginResponse>>('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get<ApiResponse<User>>('/auth/me'),
};

// Resource API
export const resourceAPI = {
  getAll: () => api.get<ApiResponse<Resource[]>>('/resources'),
  getOne: (id: string) => api.get<ApiResponse<Resource>>(`/resources/${id}`),
  create: (data: FormData) => api.post<ApiResponse<Resource>>('/resources', data),
  update: (id: string, data: FormData) => api.put<ApiResponse<Resource>>(`/resources/${id}`, data),
  delete: (id: string) => api.delete<ApiResponse<void>>(`/resources/${id}`),
};

// Task API
export const taskAPI = {
  getTasks: () => api.get<ApiResponse<Task[]>>('/tasks'),
  getTask: (id: string) => api.get<ApiResponse<Task>>(`/tasks/${id}`),
  createTask: (data: Omit<Task, 'id' | '_id'>) => api.post<ApiResponse<Task>>('/tasks', data),
  updateTask: (id: string, data: Partial<Task>) => api.put<ApiResponse<Task>>(`/tasks/${id}`, data),
  deleteTask: (id: string) => api.delete<ApiResponse<void>>(`/tasks/${id}`),
  updateTaskProgress: (id: string, progress: number) =>
    api.patch<ApiResponse<Task>>(`/tasks/${id}/progress`, { progress }),
};

export type { User, Task, Resource, LoginResponse };
export default api; 