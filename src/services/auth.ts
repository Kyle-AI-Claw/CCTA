import api from './api';
import type { AuthResponse, User, AuthTokens } from '../types';

export const authService = {
  // Register
  async register(username: string, email: string, password: string): Promise<AuthResponse> {
    const response = await api.post('/auth/register', { username, email, password });
    return response.data;
  },

  // Login
  async login(username: string, password: string): Promise<AuthResponse> {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  },

  // Refresh token
  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data.data;
  },

  // Logout
  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },
};