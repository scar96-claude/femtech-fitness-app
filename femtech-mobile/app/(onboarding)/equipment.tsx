import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { OptionCard } from '@/components/onboarding/OptionCard';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { ChevronLeft, User, Home, Building2 } from 'lucide-react-native';
import { COLORS } from '@/constants/colors';

const EQUIPMENT_OPTIONS = [
  {
    value: 'bodyweight' as const,
    title: 'Bodyweight Only',
    description: 'No equipment needed - just your body',
    icon: <User size={24} color={COLORS.primary[500]} />,
  },
  {
    value: 'home_gym' as const,
    title: 'Home Gym',
    description: 'Dumbbells, resistance bands, or basic equipment',
    icon: <Home size={24} color={COLORS.primary[500]} />,
  },
  {
    value: 'full_gym' as const,
    title: 'Full Gym',
    description: 'Access to barbells, machines, and full equipment',
    icon: <Building2 size={24} color={COLORS.primary[500]} />,
  },
];

export default function EquipmentScreen() {
  const { equipmentAccess, setEquipmentAccess, nextStep, prevStep } =
    useOnboardingStore();

  const handleContinue = () => {
    if (equipmentAccess) {
      nextStep();
      router.push('/(onboarding)/frequency');
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
        <Text style={styles.title}>What equipment do you have?</Text>
        <Text style={styles.subtitle}>
          We'll design workouts that match your available equipment.
        </Text>

        {/* Options */}
        {EQUIPMENT_OPTIONS.map((option) => (
          <OptionCard
            key={option.value}
            title={option.title}
            description={option.description}
            icon={option.icon}
            selected={equipmentAccess === option.value}
            onSelect={() => setEquipmentAccess(option.value)}
          />
        ))}

        <View style={styles.bottomSpace} />
      </ScrollView>

      {/* Continue Button */}
      <View style={styles.buttonContainer}>
        <Button
          title="Continue"
          onPress={handleContinue}
          disabled={!equipmentAccess}
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
  bottomSpace: {
    height: 24,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    backgroundColor: COLORS.white,
  },
});
