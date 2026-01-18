import { useAuthStore } from '@/stores/authStore';

/**
 * Custom hook for authentication
 * Provides a convenient interface for auth-related operations
 */
export function useAuth() {
  const {
    isAuthenticated,
    isLoading,
    userId,
    login,
    register,
    logout,
    initialize,
  } = useAuthStore();

  return {
    // State
    isAuthenticated,
    isLoading,
    userId,

    // Actions
    login,
    register,
    logout,
    initialize,
  };
}
