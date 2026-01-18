import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { DatePicker } from '@/components/onboarding/DatePicker';
import { Slider } from '@/components/onboarding/Slider';
import { OptionCard } from '@/components/onboarding/OptionCard';
import { useOnboardingStore } from '@/stores/onboardingStore';
import {
  ChevronLeft,
  Calendar,
  Clock,
  RefreshCw,
} from 'lucide-react-native';
import { COLORS } from '@/constants/colors';

const CYCLE_LENGTH_LABELS: Record<number, string> = {
  21: '21',
  24: '24',
  28: '28',
  32: '32',
  35: '35',
};

const REGULARITY_OPTIONS = [
  {
    value: 'regular' as const,
    title: 'Regular',
    description: 'My cycle is predictable (within a few days)',
    icon: <RefreshCw size={24} color={COLORS.primary[500]} />,
  },
  {
    value: 'irregular' as const,
    title: 'Irregular',
    description: 'My cycle length varies significantly',
    icon: <Clock size={24} color={COLORS.primary[500]} />,
  },
  {
    value: 'unknown' as const,
    title: "I'm not sure",
    description: "I don't track my cycle",
    icon: <Calendar size={24} color={COLORS.primary[500]} />,
  },
];

export default function CycleSetupScreen() {
  const {
    cycleData,
    setCycleData,
    prevStep,
  } = useOnboardingStore();

  const { lastPeriodDate, cycleLength, regularity } = cycleData;

  const handleComplete = () => {
    // Navigate to main app
    router.replace('/(tabs)');
  };

  const handleBack = () => {
    prevStep();
    router.back();
  };

  // Max date is today for last period
  const today = new Date();
  // Min date is 60 days ago (reasonable window for last period)
  const minDate = new Date();
  minDate.setDate(minDate.getDate() - 60);

  const canContinue = lastPeriodDate && cycleLength && regularity;

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
        <View style={styles.headerContainer}>
          <Calendar size={32} color={COLORS.primary[500]} />
          <Text style={styles.title}>Cycle Setup</Text>
        </View>
        <Text style={styles.subtitle}>
          We'll use this information to optimize your workouts based on where
          you are in your cycle.
        </Text>

        {/* Last Period Date */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Last period start date</Text>
          <Text style={styles.sectionSubtitle}>
            When did your most recent period begin?
          </Text>
          <DatePicker
            value={lastPeriodDate}
            onChange={(date) => setCycleData({ lastPeriodDate: date })}
            placeholder="Select date"
            minDate={minDate}
            maxDate={today}
          />
        </View>

        {/* Cycle Length */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Average cycle length</Text>
          <Text style={styles.sectionSubtitle}>
            How many days between the start of each period?
          </Text>
          <View style={styles.cycleLengthCard}>
            <Text style={styles.cycleLengthValue}>
              {cycleLength} days
            </Text>
            <Text style={styles.cycleLengthInfo}>
              Average is 28 days, but normal ranges from 21-35
            </Text>
            <View style={styles.sliderContainer}>
              <Text style={styles.sliderLabel}>21</Text>
              <View style={styles.sliderWrapper}>
                <Slider
                  value={cycleLength}
                  onValueChange={(val) => setCycleData({ cycleLength: val })}
                  minimumValue={21}
                  maximumValue={35}
                  step={1}
                  labels={CYCLE_LENGTH_LABELS}
                />
              </View>
              <Text style={styles.sliderLabel}>35</Text>
            </View>
          </View>
        </View>

        {/* Regularity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cycle regularity</Text>
          <Text style={styles.sectionSubtitle}>
            How consistent is your cycle?
          </Text>
          {REGULARITY_OPTIONS.map((option) => (
            <OptionCard
              key={option.value}
              title={option.title}
              description={option.description}
              icon={option.icon}
              selected={regularity === option.value}
              onSelect={() => setCycleData({ regularity: option.value })}
            />
          ))}
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Why we ask</Text>
          <Text style={styles.infoText}>
            Your menstrual cycle affects energy levels, recovery, and strength.
            We'll adjust workout intensity to work with your body, not against
            it. For example, we may suggest lighter loads during your period and
            more intense training during ovulation.
          </Text>
        </View>

        {/* Skip Option */}
        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleComplete}
        >
          <Text style={styles.skipText}>Skip for now</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpace} />
      </ScrollView>

      {/* Complete Button */}
      <View style={styles.buttonContainer}>
        <Button
          title="Complete Setup"
          onPress={handleComplete}
          disabled={!canContinue}
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
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.neutral[900],
    marginLeft: 12,
  },
  subtitle: {
    color: COLORS.neutral[500],
    fontSize: 16,
    marginBottom: 24,
    lineHeight: 22,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.neutral[900],
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: COLORS.neutral[500],
    marginBottom: 12,
  },
  cycleLengthCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
  },
  cycleLengthValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary[600],
    textAlign: 'center',
    marginBottom: 4,
  },
  cycleLengthInfo: {
    fontSize: 14,
    color: COLORS.neutral[500],
    textAlign: 'center',
    marginBottom: 20,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sliderLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.neutral[500],
    width: 28,
    textAlign: 'center',
  },
  sliderWrapper: {
    flex: 1,
    marginHorizontal: 8,
  },
  infoCard: {
    backgroundColor: COLORS.primary[50],
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.primary[100],
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary[700],
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.primary[600],
    lineHeight: 20,
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  skipText: {
    fontSize: 16,
    color: COLORS.neutral[500],
    textDecorationLine: 'underline',
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
