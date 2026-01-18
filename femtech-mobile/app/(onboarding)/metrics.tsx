import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { Ruler, ChevronLeft } from 'lucide-react-native';
import { COLORS } from '@/constants/colors';

export default function MetricsScreen() {
  const { heightCm, weightKg, setMetrics, nextStep, prevStep } =
    useOnboardingStore();

  const [height, setHeight] = useState(heightCm?.toString() || '');
  const [weight, setWeight] = useState(weightKg?.toString() || '');
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');

  const handleContinue = () => {
    const h = parseFloat(height);
    const w = parseFloat(weight);

    if (h && w) {
      // Convert to metric if needed
      const finalHeightCm = unit === 'imperial' ? h * 2.54 : h;
      const finalWeightKg = unit === 'imperial' ? w * 0.453592 : w;

      setMetrics(finalHeightCm, finalWeightKg);
      nextStep();
      router.push('/(onboarding)/activity');
    }
  };

  const handleBack = () => {
    prevStep();
    router.back();
  };

  const isValid =
    height && weight && parseFloat(height) > 0 && parseFloat(weight) > 0;

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={handleBack} style={styles.backButton}>
        <ChevronLeft size={24} color={COLORS.neutral[900]} />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        {/* Icon */}
        <View style={styles.iconBox}>
          <Ruler size={32} color={COLORS.primary[500]} />
        </View>

        {/* Title */}
        <Text style={styles.title}>Your measurements</Text>
        <Text style={styles.subtitle}>
          We use this to calculate appropriate exercise intensity.
        </Text>

        {/* Unit Toggle */}
        <View style={styles.unitToggle}>
          <TouchableOpacity
            onPress={() => setUnit('metric')}
            style={[
              styles.unitButton,
              unit === 'metric' && styles.unitButtonActive,
            ]}
          >
            <Text
              style={[
                styles.unitText,
                unit === 'metric' && styles.unitTextActive,
              ]}
            >
              Metric (cm/kg)
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setUnit('imperial')}
            style={[
              styles.unitButton,
              unit === 'imperial' && styles.unitButtonActive,
            ]}
          >
            <Text
              style={[
                styles.unitText,
                unit === 'imperial' && styles.unitTextActive,
              ]}
            >
              Imperial (in/lb)
            </Text>
          </TouchableOpacity>
        </View>

        {/* Inputs */}
        <Input
          label={unit === 'metric' ? 'Height (cm)' : 'Height (inches)'}
          placeholder={unit === 'metric' ? '165' : '65'}
          keyboardType="decimal-pad"
          value={height}
          onChangeText={setHeight}
        />

        <Input
          label={unit === 'metric' ? 'Weight (kg)' : 'Weight (lb)'}
          placeholder={unit === 'metric' ? '60' : '132'}
          keyboardType="decimal-pad"
          value={weight}
          onChangeText={setWeight}
        />

        {/* Privacy note */}
        <View style={styles.privacyNote}>
          <Text style={styles.privacyText}>
            Your data is stored securely and never shared with third parties.
          </Text>
        </View>

        {/* Spacer */}
        <View style={styles.spacer} />

        {/* Continue Button */}
        <View style={styles.buttonContainer}>
          <Button
            title="Continue"
            onPress={handleContinue}
            disabled={!isValid}
            fullWidth
            size="lg"
          />
        </View>
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
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
    marginBottom: 24,
  },
  unitToggle: {
    flexDirection: 'row',
    backgroundColor: COLORS.neutral[100],
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  unitButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  unitButtonActive: {
    backgroundColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  unitText: {
    fontWeight: '500',
    color: COLORS.neutral[500],
  },
  unitTextActive: {
    color: COLORS.primary[600],
  },
  privacyNote: {
    backgroundColor: COLORS.neutral[50],
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  privacyText: {
    color: COLORS.neutral[600],
    fontSize: 14,
  },
  spacer: {
    flex: 1,
  },
  buttonContainer: {
    paddingBottom: 32,
  },
});
