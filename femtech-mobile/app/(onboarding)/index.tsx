import { Redirect } from 'expo-router';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { useEffect } from 'react';

export default function OnboardingIndex() {
  const { reset } = useOnboardingStore();

  useEffect(() => {
    // Reset onboarding state when entering
    reset();
  }, [reset]);

  return <Redirect href="/(onboarding)/age" />;
}
