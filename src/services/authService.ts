import apiClient, { tokenStorage } from '../lib/apiClient';
import { API_ENDPOINTS } from '../config/api';

// Types
export interface User {
  id: string;
  fullName: string;
  name?: string; // Alias for backwards compatibility
  email: string;
  phone?: string;
  role: 'USER' | 'TASKER' | 'ADMIN';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION';
  avatar?: string;
  profileImage?: string;
  emailVerified: boolean;
  isOnline?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

// Auth Service
export const authService = {
  login: async (data: LoginInput): Promise<{ data: AuthResponse }> => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, data);

    // Store tokens
    if (response.data.data) {
      const { accessToken, refreshToken } = response.data.data;
      tokenStorage.setTokens(accessToken, refreshToken);
    }

    return response.data;
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } finally {
      tokenStorage.clearTokens();
    }
  },

  getCurrentUser: async (): Promise<{ data: User }> => {
    const response = await apiClient.get(API_ENDPOINTS.AUTH.ME);
    return response.data;
  },

  isAuthenticated: (): boolean => {
    return !!tokenStorage.getAccessToken();
  },
};
