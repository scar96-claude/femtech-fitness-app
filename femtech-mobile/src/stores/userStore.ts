import { create } from 'zustand';
import { apiClient } from '@/services/api';

interface UserProfile {
  id: string;
  email: string;
  dateOfBirth: string;
  heightCm: number | null;
  weightKg: number | null;
  activityLevel: string;
  primaryGoal: string;
  demographic: 'reproductive' | 'perimenopause';
}

interface HealthMetadata {
  pelvicRisk: boolean;
  boneDensityRisk: boolean;
  cycleType: string;
  lastPeriodDate: string | null;
  avgCycleLength: number;
  injuryHistory: unknown[];
}

interface UserState {
  profile: UserProfile | null;
  healthMetadata: HealthMetadata | null;
  isLoading: boolean;

  // Actions
  fetchProfile: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  updateHealthMetadata: (data: Partial<HealthMetadata>) => Promise<void>;
  clear: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  healthMetadata: null,
  isLoading: false,

  fetchProfile: async () => {
    set({ isLoading: true });
    try {
      const response = await apiClient.getProfile();
      set({
        profile: response.data.profile,
        healthMetadata: response.data.healthMetadata,
        isLoading: false,
      });
    } catch (error) {
      console.error('Fetch profile error:', error);
      set({ isLoading: false });
    }
  },

  updateProfile: async (data) => {
    const response = await apiClient.updateProfile(data);
    set((state) => ({
      profile: { ...state.profile, ...response.data } as UserProfile,
    }));
  },

  updateHealthMetadata: async (data) => {
    const response = await apiClient.updateHealthMetadata(data);
    set((state) => ({
      healthMetadata: { ...state.healthMetadata, ...response.data } as HealthMetadata,
    }));
  },

  clear: () => set({ profile: null, healthMetadata: null }),
}));
