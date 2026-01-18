import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { CONFIG } from '@/constants/config';
import { apiClient } from '@/services/api';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  userId: string | null;

  // Actions
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isLoading: true,
  userId: null,

  initialize: async () => {
    try {
      const token = await SecureStore.getItemAsync(CONFIG.STORAGE_KEYS.AUTH_TOKEN);
      const userId = await SecureStore.getItemAsync(CONFIG.STORAGE_KEYS.USER_ID);

      if (token && userId) {
        // Validate token by fetching profile
        try {
          await apiClient.getProfile();
          set({ isAuthenticated: true, userId, isLoading: false });
        } catch {
          // Token invalid, clear storage
          await SecureStore.deleteItemAsync(CONFIG.STORAGE_KEYS.AUTH_TOKEN);
          await SecureStore.deleteItemAsync(CONFIG.STORAGE_KEYS.USER_ID);
          set({ isAuthenticated: false, userId: null, isLoading: false });
        }
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Auth init error:', error);
      set({ isLoading: false });
    }
  },

  login: async (email: string, password: string) => {
    const response = await apiClient.login(email, password);
    const { token, userId } = response.data;

    await SecureStore.setItemAsync(CONFIG.STORAGE_KEYS.AUTH_TOKEN, token);
    await SecureStore.setItemAsync(CONFIG.STORAGE_KEYS.USER_ID, userId);

    set({ isAuthenticated: true, userId });
  },

  register: async (email: string, password: string) => {
    const response = await apiClient.register({ email, password });
    const { token, userId } = response.data;

    await SecureStore.setItemAsync(CONFIG.STORAGE_KEYS.AUTH_TOKEN, token);
    await SecureStore.setItemAsync(CONFIG.STORAGE_KEYS.USER_ID, userId);

    set({ isAuthenticated: true, userId });
  },

  logout: async () => {
    await SecureStore.deleteItemAsync(CONFIG.STORAGE_KEYS.AUTH_TOKEN);
    await SecureStore.deleteItemAsync(CONFIG.STORAGE_KEYS.USER_ID);
    await SecureStore.deleteItemAsync(CONFIG.STORAGE_KEYS.ONBOARDING_COMPLETE);

    set({ isAuthenticated: false, userId: null });
  },
}));
