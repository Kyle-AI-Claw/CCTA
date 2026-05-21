import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/auth';
import type { User } from '../types';

export function useAuth() {
  const {
    user,
    isAuthenticated,
    isLoading,
    setUser,
    logout,
  } = useAuthStore();

  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    useAuthStore.getState().initializeAuth();
    setIsChecking(false);
  }, []);

  const login = async (username: string, password: string): Promise<User> => {
    const response = await authService.login(username, password);
    if (response && response.user) {
      setUser(response.user);
    }
    if (response && response.tokens) {
      useAuthStore.getState().setTokens(response.tokens);
    }
    return response.user as User;
  };

  const register = async (username: string, email: string, password: string): Promise<User> => {
    const response = await authService.register(username, email, password);
    if (response && response.user) {
      setUser(response.user);
    }
    if (response && response.tokens) {
      useAuthStore.getState().setTokens(response.tokens);
    }
    return response.user as User;
  };

  const logoutUser = () => {
    authService.logout();
    logout();
  };

  return {
    user,
    isAuthenticated,
    isLoading: isLoading || isChecking,
    login,
    register,
    logout: logoutUser,
  };
}
