import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Button } from '@/components/ui/Button';
import { CONFIG } from '@/constants/config';
import { COLORS } from '@/constants/colors';

export default function OnboardingScreen() {
  const completeOnboarding = async () => {
    // Mark onboarding as complete
    await SecureStore.setItemAsync(CONFIG.STORAGE_KEYS.ONBOARDING_COMPLETE, 'true');
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Onboarding</Text>
        <Text style={styles.subtitle}>
          The full 8-screen onboarding wizard will be implemented in Phase 4b
        </Text>

        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>
            This will include:
          </Text>
          <Text style={styles.listItem}>• Personal information</Text>
          <Text style={styles.listItem}>• Health screening questions</Text>
          <Text style={styles.listItem}>• Fitness goals</Text>
          <Text style={styles.listItem}>• Equipment availability</Text>
          <Text style={styles.listItem}>• Cycle tracking setup</Text>
        </View>

        <Button
          title="Skip to Dashboard (Dev Only)"
          onPress={completeOnboarding}
          fullWidth
          variant="outline"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.neutral[50],
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.neutral[900],
    marginBottom: 8,
  },
  subtitle: {
    color: COLORS.neutral[500],
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
  placeholder: {
    backgroundColor: COLORS.white,
    padding: 24,
    borderRadius: 16,
    marginBottom: 32,
    width: '100%',
  },
  placeholderText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.neutral[700],
    marginBottom: 12,
  },
  listItem: {
    fontSize: 14,
    color: COLORS.neutral[600],
    marginBottom: 8,
  },
});
