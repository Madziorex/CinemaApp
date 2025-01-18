import axios from 'axios';
import { getToken } from './authService';

const apiClient = axios.create({
  baseURL: 'https://localhost:7086/api',
});

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
