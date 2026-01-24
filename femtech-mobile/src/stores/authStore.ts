import { create } from 'zustand';
import { getItem, setItem, removeItem } from '@/utils/storage';
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
      const token = await getItem(CONFIG.STORAGE_KEYS.AUTH_TOKEN);
      const userId = await getItem(CONFIG.STORAGE_KEYS.USER_ID);

      if (token && userId) {
        // Validate token by fetching profile
        try {
          await apiClient.getProfile();
          set({ isAuthenticated: true, userId, isLoading: false });
        } catch {
          // Token invalid, clear storage
          await removeItem(CONFIG.STORAGE_KEYS.AUTH_TOKEN);
          await removeItem(CONFIG.STORAGE_KEYS.USER_ID);
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

    await setItem(CONFIG.STORAGE_KEYS.AUTH_TOKEN, token);
    await setItem(CONFIG.STORAGE_KEYS.USER_ID, userId);

    set({ isAuthenticated: true, userId });
  },

  register: async (email: string, password: string) => {
    const response = await apiClient.register({ email, password });
    const { token, userId } = response.data;

    await setItem(CONFIG.STORAGE_KEYS.AUTH_TOKEN, token);
    await setItem(CONFIG.STORAGE_KEYS.USER_ID, userId);

    set({ isAuthenticated: true, userId });
  },

  logout: async () => {
    await removeItem(CONFIG.STORAGE_KEYS.AUTH_TOKEN);
    await removeItem(CONFIG.STORAGE_KEYS.USER_ID);
    await removeItem(CONFIG.STORAGE_KEYS.ONBOARDING_COMPLETE);

    set({ isAuthenticated: false, userId: null });
  },
}));
