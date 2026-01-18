import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/ui/Card';
import { Dumbbell } from 'lucide-react-native';
import { COLORS } from '@/constants/colors';

export default function WorkoutScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.header}>Today's Workout</Text>

        <Card variant="elevated" style={styles.card}>
          <View style={styles.iconContainer}>
            <Dumbbell size={48} color={COLORS.primary[500]} />
          </View>
          <Text style={styles.cardTitle}>Workout Player</Text>
          <Text style={styles.cardText}>
            The workout experience will guide you through each exercise with
            timers, rest periods, and performance logging.
          </Text>
        </Card>

        <Card variant="outlined" style={styles.card}>
          <Text style={styles.sectionTitle}>Coming in Phase 4d:</Text>
          <Text style={styles.listItem}>• Exercise cards with video</Text>
          <Text style={styles.listItem}>• Set/rep tracking</Text>
          <Text style={styles.listItem}>• Rest timers</Text>
          <Text style={styles.listItem}>• RPE logging</Text>
          <Text style={styles.listItem}>• Workout completion summary</Text>
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
