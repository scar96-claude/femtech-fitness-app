import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { OptionCard } from '@/components/onboarding/OptionCard';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { ChevronLeft, Sofa, Footprints, Bike, Zap } from 'lucide-react-native';
import { COLORS } from '@/constants/colors';

const ACTIVITY_OPTIONS = [
  {
    value: 'sedentary' as const,
    title: 'Sedentary',
    description: 'Little to no regular exercise',
    icon: <Sofa size={24} color={COLORS.primary[500]} />,
  },
  {
    value: 'light' as const,
    title: 'Lightly Active',
    description: 'Light exercise 1-2 days/week',
    icon: <Footprints size={24} color={COLORS.primary[500]} />,
  },
  {
    value: 'moderate' as const,
    title: 'Moderately Active',
    description: 'Moderate exercise 3-4 days/week',
    icon: <Bike size={24} color={COLORS.primary[500]} />,
  },
  {
    value: 'active' as const,
    title: 'Very Active',
    description: 'Intense exercise 5+ days/week',
    icon: <Zap size={24} color={COLORS.primary[500]} />,
  },
];

export default function ActivityScreen() {
  const { activityLevel, setActivityLevel, nextStep, prevStep } =
    useOnboardingStore();

  const handleContinue = () => {
    if (activityLevel) {
      nextStep();
      router.push('/(onboarding)/goal');
    }
  };

  const handleBack = () => {
    prevStep();
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={handleBack} style={styles.backButton}>
        <ChevronLeft size={24} color={COLORS.neutral[900]} />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Title */}
        <Text style={styles.title}>How active are you?</Text>
        <Text style={styles.subtitle}>
          Be honest — we'll build up from wherever you are.
        </Text>

        {/* Options */}
        {ACTIVITY_OPTIONS.map((option) => (
          <OptionCard
            key={option.value}
            title={option.title}
            description={option.description}
            icon={option.icon}
            selected={activityLevel === option.value}
            onSelect={() => setActivityLevel(option.value)}
          />
        ))}

        <View style={styles.bottomSpace} />
      </ScrollView>

      {/* Continue Button */}
      <View style={styles.buttonContainer}>
        <Button
          title="Continue"
          onPress={handleContinue}
          disabled={!activityLevel}
          fullWidth
          size="lg"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  backText: {
    color: COLORS.neutral[900],
    marginLeft: 4,
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
  },
  scrollContent: {
    paddingTop: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.neutral[900],
    marginBottom: 8,
  },
  subtitle: {
    color: COLORS.neutral[500],
    fontSize: 16,
    marginBottom: 32,
  },
  bottomSpace: {
    height: 24,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    backgroundColor: COLORS.white,
  },
});
