import axios from 'axios';
import { getToken } from '../services/authService';

const api = axios.create({
  baseURL: 'https://localhost:7086/api',
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export default api;
