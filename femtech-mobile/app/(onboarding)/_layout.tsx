import { Stack } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProgressBar } from '@/components/onboarding/ProgressBar';
import { COLORS } from '@/constants/colors';

export default function OnboardingLayout() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ProgressBar />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: COLORS.white },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="age" />
        <Stack.Screen name="metrics" />
        <Stack.Screen name="activity" />
        <Stack.Screen name="goal" />
        <Stack.Screen name="equipment" />
        <Stack.Screen name="frequency" />
        <Stack.Screen name="health-screening" />
        <Stack.Screen name="cycle-setup" />
      </Stack>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
});
