import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { CONFIG } from '@/constants/config';

// Create axios instance
export const api = axios.create({
  baseURL: CONFIG.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor - add auth token
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync(CONFIG.STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Clear auth and redirect to login
      await SecureStore.deleteItemAsync(CONFIG.STORAGE_KEYS.AUTH_TOKEN);
      // Navigation will be handled by auth state change
    }
    return Promise.reject(error);
  }
);

// Types (should match backend)
interface UserProfile {
  id: string;
  email: string;
  dateOfBirth: string;
  heightCm: number;
  weightKg: number;
  activityLevel: string;
  primaryGoal: string;
  demographic: 'reproductive' | 'perimenopause';
}

interface HealthMetadata {
  pelvicRisk: boolean;
  boneDensityRisk: boolean;
  cycleType: string;
  lastPeriodDate: string;
  avgCycleLength: number;
}

interface GenerateWorkoutParams {
  equipment: 'bodyweight' | 'home_gym' | 'full_gym';
  frequencyPerWeek: number;
  includeCardio: boolean;
}

interface PerformanceLog {
  exerciseId: string;
  sets: number;
  reps: number;
  weightKg: number;
  rpe: number;
}

// API methods
export const apiClient = {
  // Auth
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),

  register: (data: { email: string; password: string }) =>
    api.post('/auth/register', data),

  // User
  getProfile: () => api.get('/user/profile'),

  updateProfile: (data: Partial<UserProfile>) =>
    api.patch('/user/profile', data),

  // Health metadata
  updateHealthMetadata: (data: Partial<HealthMetadata>) =>
    api.patch('/user/health-metadata', data),

  // Workouts
  generateWorkout: (params: GenerateWorkoutParams) =>
    api.post('/workouts/generate', params),

  getWorkoutHistory: () => api.get('/workouts/history'),

  logPerformance: (data: PerformanceLog) =>
    api.post('/workouts/log', data),

  // Cycle tracking
  logPeriod: (date: string) =>
    api.post('/cycle/log-period', { date }),

  getCycleLogs: () => api.get('/cycle/logs'),

  // Dashboard
  getDashboard: () => api.get('/dashboard'),

  getWorkoutForToday: () => api.get('/workouts/today'),

  logQuickAction: (action: 'period' | 'sleep' | 'energy' | 'symptoms', data: Record<string, unknown>) =>
    api.post(`/quick-actions/${action}`, data),

  logSymptoms: (symptoms: Record<string, number>) =>
    api.post('/symptoms/log', { symptoms, date: new Date().toISOString() }),
};
