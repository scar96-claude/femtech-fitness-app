import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { OptionCard } from '@/components/onboarding/OptionCard';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { ChevronLeft, Dumbbell, Scale, Heart, Bone } from 'lucide-react-native';
import { COLORS } from '@/constants/colors';

const GOAL_OPTIONS = [
  {
    value: 'strength' as const,
    title: 'Build Strength',
    description: 'Get stronger and build lean muscle',
    icon: <Dumbbell size={24} color={COLORS.primary[500]} />,
  },
  {
    value: 'weight_loss' as const,
    title: 'Lose Weight',
    description: 'Burn fat and improve body composition',
    icon: <Scale size={24} color={COLORS.primary[500]} />,
  },
  {
    value: 'endurance' as const,
    title: 'Improve Endurance',
    description: 'Build stamina and cardiovascular health',
    icon: <Heart size={24} color={COLORS.primary[500]} />,
  },
  {
    value: 'bone_health' as const,
    title: 'Bone Health',
    description: 'Strengthen bones and prevent osteoporosis',
    icon: <Bone size={24} color={COLORS.primary[500]} />,
  },
];

export default function GoalScreen() {
  const { primaryGoal, setPrimaryGoal, demographic, nextStep, prevStep } =
    useOnboardingStore();

  const handleContinue = () => {
    if (primaryGoal) {
      nextStep();
      router.push('/(onboarding)/equipment');
    }
  };

  const handleBack = () => {
    prevStep();
    router.back();
  };

  // Highlight bone health for perimenopause users
  const sortedOptions =
    demographic === 'perimenopause'
      ? [...GOAL_OPTIONS].sort((a) => (a.value === 'bone_health' ? -1 : 0))
      : GOAL_OPTIONS;

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
        <Text style={styles.title}>What's your main goal?</Text>
        <Text style={styles.subtitle}>
          We'll tailor your program to focus on what matters most to you.
        </Text>

        {/* Recommendation for 40+ */}
        {demographic === 'perimenopause' && (
          <View style={styles.recommendationCard}>
            <Text style={styles.recommendationTitle}>Recommended for you</Text>
            <Text style={styles.recommendationText}>
              Women over 40 benefit greatly from bone-strengthening exercises to
              prevent osteoporosis.
            </Text>
          </View>
        )}

        {/* Options */}
        {sortedOptions.map((option) => (
          <OptionCard
            key={option.value}
            title={option.title}
            description={option.description}
            icon={option.icon}
            selected={primaryGoal === option.value}
            onSelect={() => setPrimaryGoal(option.value)}
          />
        ))}

        <View style={styles.bottomSpace} />
      </ScrollView>

      {/* Continue Button */}
      <View style={styles.buttonContainer}>
        <Button
          title="Continue"
          onPress={handleContinue}
          disabled={!primaryGoal}
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
    marginBottom: 24,
  },
  recommendationCard: {
    backgroundColor: '#fef3c7',
    borderWidth: 1,
    borderColor: '#fcd34d',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  recommendationTitle: {
    color: '#92400e',
    fontWeight: '600',
    fontSize: 14,
  },
  recommendationText: {
    color: '#a16207',
    fontSize: 14,
    marginTop: 4,
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
