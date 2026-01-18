import React from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { DatePicker } from '@/components/onboarding/DatePicker';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { Cake } from 'lucide-react-native';
import { COLORS } from '@/constants/colors';

function calculateAge(birthDate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
}

export default function AgeScreen() {
  const { dateOfBirth, setDateOfBirth, nextStep } = useOnboardingStore();

  // Calculate date limits (18-80 years old)
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 18);

  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() - 80);

  const handleContinue = () => {
    if (dateOfBirth) {
      nextStep();
      router.push('/(onboarding)/metrics');
    }
  };

  const age = dateOfBirth ? calculateAge(dateOfBirth) : null;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Icon */}
        <View style={styles.iconBox}>
          <Cake size={32} color={COLORS.primary[500]} />
        </View>

        {/* Title */}
        <Text style={styles.title}>When were you born?</Text>
        <Text style={styles.subtitle}>
          Your age helps us personalize your workouts to your body's needs.
        </Text>

        {/* Date Picker */}
        <DatePicker
          label="Date of Birth"
          placeholder="Select your birthday"
          value={dateOfBirth}
          onChange={setDateOfBirth}
          maximumDate={maxDate}
          minimumDate={minDate}
        />

        {/* Age info card */}
        {dateOfBirth && age !== null && (
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>{age} years old</Text>
            <Text style={styles.infoText}>
              {age < 40
                ? "We'll optimize your workouts around your menstrual cycle."
                : "We'll focus on bone health and sustainable strength."}
            </Text>
          </View>
        )}

        {/* Spacer */}
        <View style={styles.spacer} />

        {/* Continue Button */}
        <View style={styles.buttonContainer}>
          <Button
            title="Continue"
            onPress={handleContinue}
            disabled={!dateOfBirth}
            fullWidth
            size="lg"
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  iconBox: {
    width: 64,
    height: 64,
    backgroundColor: COLORS.primary[100],
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
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
    lineHeight: 24,
  },
  infoCard: {
    backgroundColor: COLORS.primary[50],
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  infoTitle: {
    color: COLORS.primary[700],
    fontWeight: '600',
    fontSize: 16,
  },
  infoText: {
    color: COLORS.primary[600],
    fontSize: 14,
    marginTop: 4,
  },
  spacer: {
    flex: 1,
  },
  buttonContainer: {
    paddingBottom: 32,
  },
});
