import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5004/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ats_token');
  if (token && config?.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('ats_token', token);
  } else {
    localStorage.removeItem('ats_token');
  }
};

export default api;
