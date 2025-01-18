import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  nameid: string;
  role: string;
  exp: number;
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'?: string;
}

const API_URL = 'https://localhost:7086/api/User';

export async function login(email: string, password: string): Promise<string> {
  try {
    const response = await axios.post(`${API_URL}/Login`, { email, password });
    const token = response.data;

    if (!token) {
      throw new Error('Token jest pusty!');
    }
    localStorage.setItem('jwt', token);
    return token;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Login failed');
  }
}

export async function register(user: { username: string; email: string; password: string }): Promise<void> {
  try {
    await axios.post(`${API_URL}`, user);
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Registration failed');
  }
}

export function logout(): void {
  localStorage.removeItem('jwt');
  window.location.reload();
}

export function getToken(): string | null {
  return localStorage.getItem('jwt');
}

export function decodeToken(token: string): JwtPayload {
  if (!token || !token.includes('.')) {
    throw new Error('Invalid token format');
  }
  return jwtDecode<JwtPayload>(token);
}
