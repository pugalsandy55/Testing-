import { create } from 'zustand';
import { User } from '../types';
import { apiRequest } from '../services/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: JSON.parse(localStorage.getItem('ats_user') || 'null'),
  token: localStorage.getItem('ats_token'),
  isAuthenticated: !!localStorage.getItem('ats_token'),
  isLoading: false,

  login: (token: string, user: User) => {
    localStorage.setItem('ats_token', token);
    localStorage.setItem('ats_user', JSON.stringify(user));
    set({ token, user, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('ats_token');
    localStorage.removeItem('ats_user');
    set({ token: null, user: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('ats_token');
    if (!token) return;
    try {
      set({ isLoading: true });
      const user = await apiRequest<User>('/auth/me');
      localStorage.setItem('ats_user', JSON.stringify(user));
      set({ user, isAuthenticated: true, isLoading: false });
    } catch {
      // If token expired
      localStorage.removeItem('ats_token');
      localStorage.removeItem('ats_user');
      set({ token: null, user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
