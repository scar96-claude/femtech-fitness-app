import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Switch,
} from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/onboarding/Slider';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { ChevronLeft, Calendar, Activity } from 'lucide-react-native';
import { COLORS } from '@/constants/colors';

const FREQUENCY_LABELS: Record<number, string> = {
  2: '2 days',
  3: '3 days',
  4: '4 days',
  5: '5 days',
  6: '6 days',
};

const FREQUENCY_DESCRIPTIONS: Record<number, string> = {
  2: 'Perfect for beginners or busy schedules',
  3: 'Great balance of training and recovery',
  4: 'Recommended for most fitness goals',
  5: 'Ideal for intermediate to advanced',
  6: 'Maximum volume for serious athletes',
};

export default function FrequencyScreen() {
  const {
    workoutFrequency,
    setWorkoutFrequency,
    includeCardio,
    setIncludeCardio,
    nextStep,
    prevStep,
  } = useOnboardingStore();

  const handleContinue = () => {
    nextStep();
    router.push('/(onboarding)/health-screening');
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
        <Text style={styles.title}>How often can you work out?</Text>
        <Text style={styles.subtitle}>
          Choose a frequency that fits your schedule and recovery needs.
        </Text>

        {/* Frequency Slider Card */}
        <View style={styles.sliderCard}>
          <View style={styles.sliderHeader}>
            <Calendar size={24} color={COLORS.primary[500]} />
            <Text style={styles.sliderTitle}>Weekly Workouts</Text>
          </View>

          <View style={styles.frequencyDisplay}>
            <Text style={styles.frequencyValue}>
              {workoutFrequency} days per week
            </Text>
            <Text style={styles.frequencyDescription}>
              {FREQUENCY_DESCRIPTIONS[workoutFrequency]}
            </Text>
          </View>

          <View style={styles.sliderContainer}>
            <Text style={styles.sliderLabel}>2</Text>
            <View style={styles.sliderWrapper}>
              <Slider
                value={workoutFrequency}
                onValueChange={setWorkoutFrequency}
                minimumValue={2}
                maximumValue={6}
                step={1}
                labels={FREQUENCY_LABELS}
              />
            </View>
            <Text style={styles.sliderLabel}>6</Text>
          </View>
        </View>

        {/* Cardio Toggle Card */}
        <View style={styles.cardioCard}>
          <View style={styles.cardioContent}>
            <View style={styles.cardioLeft}>
              <Activity size={24} color={COLORS.primary[500]} />
              <View style={styles.cardioTextContainer}>
                <Text style={styles.cardioTitle}>Include Cardio</Text>
                <Text style={styles.cardioDescription}>
                  Add cardio recommendations to your plan
                </Text>
              </View>
            </View>
            <Switch
              value={includeCardio}
              onValueChange={setIncludeCardio}
              trackColor={{
                false: COLORS.neutral[300],
                true: COLORS.primary[200],
              }}
              thumbColor={includeCardio ? COLORS.primary[500] : COLORS.neutral[100]}
            />
          </View>

          {includeCardio && (
            <View style={styles.cardioInfo}>
              <Text style={styles.cardioInfoText}>
                We'll suggest cardio activities that complement your strength
                training, adjusted for your cycle phase.
              </Text>
            </View>
          )}
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Recovery matters</Text>
          <Text style={styles.infoText}>
            Your body needs rest days to build muscle and prevent injury. We'll
            help you find the right balance based on your goals and life stage.
          </Text>
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>

      {/* Continue Button */}
      <View style={styles.buttonContainer}>
        <Button
          title="Continue"
          onPress={handleContinue}
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
  sliderCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
  },
  sliderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sliderTitle: {
    marginLeft: 12,
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.neutral[900],
  },
  frequencyDisplay: {
    alignItems: 'center',
    marginBottom: 24,
  },
  frequencyValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary[600],
    marginBottom: 4,
  },
  frequencyDescription: {
    fontSize: 14,
    color: COLORS.neutral[500],
    textAlign: 'center',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sliderLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.neutral[500],
    width: 24,
    textAlign: 'center',
  },
  sliderWrapper: {
    flex: 1,
    marginHorizontal: 8,
  },
  cardioCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
  },
  cardioContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardioLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardioTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  cardioTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.neutral[900],
  },
  cardioDescription: {
    fontSize: 14,
    color: COLORS.neutral[500],
    marginTop: 2,
  },
  cardioInfo: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.neutral[100],
  },
  cardioInfoText: {
    fontSize: 14,
    color: COLORS.neutral[600],
    lineHeight: 20,
  },
  infoCard: {
    backgroundColor: COLORS.primary[50],
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.primary[100],
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary[700],
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.primary[600],
    lineHeight: 20,
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
