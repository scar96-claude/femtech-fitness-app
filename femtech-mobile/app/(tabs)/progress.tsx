import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/ui/Card';
import { TrendingUp } from 'lucide-react-native';
import { COLORS } from '@/constants/colors';

export default function ProgressScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.header}>Progress</Text>

        <Card variant="elevated" style={styles.card}>
          <View style={styles.iconContainer}>
            <TrendingUp size={48} color={COLORS.success} />
          </View>
          <Text style={styles.cardTitle}>Your Journey</Text>
          <Text style={styles.cardText}>
            Track your progress over time with charts, workout history,
            and performance insights tailored to your cycle.
          </Text>
        </Card>

        <Card variant="outlined" style={styles.card}>
          <Text style={styles.sectionTitle}>Coming in Phase 4e:</Text>
          <Text style={styles.listItem}>• Workout history calendar</Text>
          <Text style={styles.listItem}>• Strength progress charts</Text>
          <Text style={styles.listItem}>• Cycle-synced insights</Text>
          <Text style={styles.listItem}>• Personal records</Text>
          <Text style={styles.listItem}>• Weekly/monthly summaries</Text>
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
  iconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.neutral[900],
    marginBottom: 8,
    textAlign: 'center',
  },
  cardText: {
    fontSize: 14,
    color: COLORS.neutral[600],
    lineHeight: 20,
    textAlign: 'center',
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
