export const CONFIG = {
  // Update this to your actual backend URL
  API_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api',

  // App settings
  APP_NAME: 'FemTech Fitness',

  // Storage keys
  STORAGE_KEYS: {
    AUTH_TOKEN: 'auth_token',
    USER_ID: 'user_id',
    ONBOARDING_COMPLETE: 'onboarding_complete',
  },
} as const;
