import { Redirect } from 'expo-router';
import { getItem } from '@/utils/storage';
import { useAuthStore } from '@/stores/authStore';
import { CONFIG } from '@/constants/config';
import { useEffect, useState } from 'react';

export default function Index() {
  const { isAuthenticated } = useAuthStore();
  const [onboardingComplete, setOnboardingComplete] = useState<boolean | null>(null);

  useEffect(() => {
    checkOnboarding();
  }, []);

  const checkOnboarding = async () => {
    const complete = await getItem(CONFIG.STORAGE_KEYS.ONBOARDING_COMPLETE);
    setOnboardingComplete(complete === 'true');
  };

  if (onboardingComplete === null) {
    return null; // Still loading
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/welcome" />;
  }

  if (!onboardingComplete) {
    return <Redirect href="/(onboarding)" />;
  }

  return <Redirect href="/(tabs)" />;
}
