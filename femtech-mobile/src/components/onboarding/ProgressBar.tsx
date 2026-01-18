import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { COLORS } from '@/constants/colors';

export function ProgressBar() {
  const { currentStep, totalSteps } = useOnboardingStore();
  const progress = (currentStep / totalSteps) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.textRow}>
        <Text style={styles.stepText}>
          Step {currentStep} of {totalSteps}
        </Text>
        <Text style={styles.percentText}>{Math.round(progress)}%</Text>
      </View>

      <View style={styles.track}>
        <View style={[styles.fill, { width: `${progress}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  textRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  stepText: {
    color: COLORS.neutral[500],
    fontSize: 14,
  },
  percentText: {
    color: COLORS.neutral[500],
    fontSize: 14,
  },
  track: {
    height: 8,
    backgroundColor: COLORS.neutral[200],
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: COLORS.primary[500],
    borderRadius: 4,
  },
});
