import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/ui/Card';
import { COLORS } from '@/constants/colors';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.header}>Dashboard</Text>

        <Card variant="elevated" style={styles.card}>
          <Text style={styles.cardTitle}>Welcome to FemTech Fitness</Text>
          <Text style={styles.cardText}>
            Your personalized dashboard will show your current cycle phase,
            today's workout recommendation, and recent progress.
          </Text>
        </Card>

        <Card variant="outlined" style={styles.card}>
          <Text style={styles.sectionTitle}>Coming in Phase 4c:</Text>
          <Text style={styles.listItem}>• Cycle phase indicator</Text>
          <Text style={styles.listItem}>• Today's workout preview</Text>
          <Text style={styles.listItem}>• Weekly progress summary</Text>
          <Text style={styles.listItem}>• Quick actions</Text>
        </Card>
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
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.neutral[900],
    marginBottom: 24,
  },
  card: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.neutral[900],
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: COLORS.neutral[600],
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.neutral[700],
    marginBottom: 12,
  },
  listItem: {
    fontSize: 14,
    color: COLORS.neutral[600],
    marginBottom: 6,
  },
});
