import { useUserStore } from '@/stores/userStore';
import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';

/**
 * Custom hook for user profile data
 * Automatically fetches profile when user is authenticated
 */
export function useUser() {
  const { isAuthenticated } = useAuthStore();
  const {
    profile,
    healthMetadata,
    isLoading,
    fetchProfile,
    updateProfile,
    updateHealthMetadata,
    clear,
  } = useUserStore();

  useEffect(() => {
    if (isAuthenticated && !profile) {
      fetchProfile();
    }
  }, [isAuthenticated, profile, fetchProfile]);

  // Helper to determine user's demographic based on age
  const getDemographic = (): 'reproductive' | 'perimenopause' | null => {
    if (!profile?.dateOfBirth) return null;

    const birthDate = new Date(profile.dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();

    return age >= 40 ? 'perimenopause' : 'reproductive';
  };

  // Helper to check if user has completed onboarding
  const hasCompletedOnboarding = (): boolean => {
    return !!(
      profile?.dateOfBirth &&
      healthMetadata &&
      profile?.primaryGoal
    );
  };

  return {
    // State
    profile,
    healthMetadata,
    isLoading,
    demographic: getDemographic(),
    hasCompletedOnboarding: hasCompletedOnboarding(),

    // Actions
    fetchProfile,
    updateProfile,
    updateHealthMetadata,
    clear,
  };
}
