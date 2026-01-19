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
import { useOnboardingStore } from '@/stores/onboardingStore';
import { ChevronLeft, ShieldCheck, AlertTriangle } from 'lucide-react-native';
import { COLORS } from '@/constants/colors';

// Define the health screening keys to match the store
type HealthQuestionKey =
  | 'pelvicFloorIssues'
  | 'diastasisRecti'
  | 'recentPregnancy'
  | 'osteoporosisRisk'
  | 'jointIssues'
  | 'backProblems'
  | 'cardiovascularConditions';

const HEALTH_QUESTIONS: { key: HealthQuestionKey; question: string; info?: string }[] = [
  {
    key: 'pelvicFloorIssues',
    question: 'Do you experience pelvic floor issues?',
    info: 'Such as incontinence, prolapse, or pelvic pain',
  },
  {
    key: 'diastasisRecti',
    question: 'Have you been diagnosed with diastasis recti?',
    info: 'Abdominal muscle separation, often after pregnancy',
  },
  {
    key: 'recentPregnancy',
    question: 'Have you been pregnant in the past 12 months?',
    info: 'Including current pregnancy or recent birth',
  },
  {
    key: 'osteoporosisRisk',
    question: 'Do you have osteoporosis or osteopenia?',
    info: 'Or have you been told you have low bone density',
  },
  {
    key: 'jointIssues',
    question: 'Do you have any joint problems?',
    info: 'Such as arthritis, knee issues, or shoulder injuries',
  },
  {
    key: 'backProblems',
    question: 'Do you experience chronic back pain?',
    info: 'Including herniated discs or sciatica',
  },
  {
    key: 'cardiovascularConditions',
    question: 'Do you have any heart or blood pressure conditions?',
    info: 'Such as hypertension or heart disease',
  },
];

export default function HealthScreeningScreen() {
  const {
    healthScreening,
    setHealthScreening,
    demographic,
    nextStep,
    prevStep,
  } = useOnboardingStore();

  const handleToggle = (key: HealthQuestionKey) => {
    setHealthScreening(key, !healthScreening[key]);
  };

  const handleContinue = () => {
    nextStep();
    // Perimenopause users skip cycle setup
    if (demographic === 'perimenopause') {
      router.replace('/(tabs)');
    } else {
      router.push('/(onboarding)/cycle-setup');
    }
  };

  const handleBack = () => {
    prevStep();
    router.back();
  };

  const hasAnyConditions = Object.values(healthScreening).some((v) => v);

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
        {/* Header */}
        <View style={styles.headerContainer}>
          <ShieldCheck size={32} color={COLORS.primary[500]} />
          <Text style={styles.title}>Health Screening</Text>
        </View>
        <Text style={styles.subtitle}>
          Help us understand your health needs so we can provide safe,
          personalized workouts. All information is kept private.
        </Text>

        {/* Questions */}
        {HEALTH_QUESTIONS.map((item) => (
          <View key={item.key} style={styles.questionCard}>
            <View style={styles.questionContent}>
              <View style={styles.questionText}>
                <Text style={styles.questionTitle}>{item.question}</Text>
                {item.info && (
                  <Text style={styles.questionInfo}>{item.info}</Text>
                )}
              </View>
              <Switch
                value={healthScreening[item.key]}
                onValueChange={() => handleToggle(item.key)}
                trackColor={{
                  false: COLORS.neutral[300],
                  true: COLORS.primary[200],
                }}
                thumbColor={
                  healthScreening[item.key]
                    ? COLORS.primary[500]
                    : COLORS.neutral[100]
                }
              />
            </View>
          </View>
        ))}

        {/* Safety Notice */}
        {hasAnyConditions && (
          <View style={styles.safetyCard}>
            <AlertTriangle size={20} color="#92400e" />
            <View style={styles.safetyContent}>
              <Text style={styles.safetyTitle}>
                We'll adjust your workouts
              </Text>
              <Text style={styles.safetyText}>
                Based on your responses, we'll modify exercises and provide
                alternatives to keep you safe while helping you reach your
                goals.
              </Text>
            </View>
          </View>
        )}

        {/* Privacy Notice */}
        <View style={styles.privacyCard}>
          <Text style={styles.privacyTitle}>Your privacy matters</Text>
          <Text style={styles.privacyText}>
            This information is stored securely on your device and used only to
            personalize your workout experience. We never share your health
            data with third parties.
          </Text>
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>

      {/* Continue Button */}
      <View style={styles.buttonContainer}>
        <Button
          title={demographic === 'perimenopause' ? 'Complete Setup' : 'Continue'}
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
  questionCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.neutral[200],
  },
  questionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  questionText: {
    flex: 1,
    marginRight: 16,
  },
  questionTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.neutral[900],
  },
  questionInfo: {
    fontSize: 13,
    color: COLORS.neutral[500],
    marginTop: 4,
  },
  safetyCard: {
    flexDirection: 'row',
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#fcd34d',
  },
  safetyContent: {
    flex: 1,
    marginLeft: 12,
  },
  safetyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400e',
  },
  safetyText: {
    fontSize: 13,
    color: '#a16207',
    marginTop: 4,
    lineHeight: 18,
  },
  privacyCard: {
    backgroundColor: COLORS.neutral[50],
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  privacyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.neutral[700],
    marginBottom: 4,
  },
  privacyText: {
    fontSize: 13,
    color: COLORS.neutral[500],
    lineHeight: 18,
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
