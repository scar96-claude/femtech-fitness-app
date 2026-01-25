import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/common/Logo';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '@/constants/colors';
import { useAuthStore } from '@/stores/authStore';

export default function WelcomeScreen() {
  const { mockLogin } = useAuthStore();

  const handleDemoLogin = async () => {
    await mockLogin();
    router.replace('/(tabs)');
  };

  return (
    <LinearGradient
      colors={[COLORS.primary[500], COLORS.primary[600]]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Logo/Hero Section */}
        <View style={styles.heroSection}>
          <Logo size="lg" variant="light" />

          <Text style={styles.title}>FemTech Fitness</Text>

          <Text style={styles.subtitle}>
            Workouts designed for your body, your cycle, your life.
          </Text>
        </View>

        {/* CTA Section */}
        <View style={styles.ctaSection}>
          <Link href="/(auth)/register" asChild>
            <Button
              title="Get Started"
              variant="secondary"
              size="lg"
              fullWidth
            />
          </Link>

          <Link href="/(auth)/login" asChild>
            <Button
              title="I already have an account"
              variant="ghost"
              size="lg"
              fullWidth
              style={styles.ghostButton}
            />
          </Link>

          {/* Demo Login Button */}
          <TouchableOpacity onPress={handleDemoLogin} style={styles.demoButton}>
            <Text style={styles.demoButtonText}>
              Try Demo (No Account Needed)
            </Text>
          </TouchableOpacity>

          <Text style={styles.disclaimer}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 24,
  },
  heroSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: COLORS.white,
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 8,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 18,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  ctaSection: {
    paddingBottom: 32,
  },
  ghostButton: {
    marginTop: 12,
  },
  demoButton: {
    marginTop: 24,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 12,
    borderStyle: 'dashed',
  },
  demoButtonText: {
    color: COLORS.white,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
  },
  disclaimer: {
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    fontSize: 12,
    marginTop: 24,
  },
});
