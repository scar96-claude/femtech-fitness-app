import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { WorkoutHistoryCard } from './WorkoutHistoryCard';
import { WorkoutHistoryItem } from '@/types';
import { COLORS } from '@/constants/colors';

interface WorkoutHistoryListProps {
  workouts: WorkoutHistoryItem[];
  isLoading?: boolean;
  onWorkoutPress?: (workout: WorkoutHistoryItem) => void;
}

export function WorkoutHistoryList({
  workouts,
  isLoading,
  onWorkoutPress,
}: WorkoutHistoryListProps) {
  if (isLoading && workouts.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary[500]} />
      </View>
    );
  }

  if (workouts.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🏋️</Text>
        <Text style={styles.emptyTitle}>No workouts yet</Text>
        <Text style={styles.emptyText}>
          Complete your first workout to start tracking your progress
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Recent Workouts</Text>

      {workouts.map((workout) => (
        <WorkoutHistoryCard
          key={workout.id}
          workout={workout}
          onPress={() => onWorkoutPress?.(workout)}
        />
      ))}

      {isLoading && (
        <View style={styles.loadingMore}>
          <ActivityIndicator size="small" color={COLORS.primary[500]} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.neutral[900],
    marginBottom: 16,
  },
  loadingContainer: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  emptyContainer: {
    paddingVertical: 48,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyIcon: {
    fontSize: 48,
    color: COLORS.neutral[400],
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.neutral[900],
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.neutral[500],
    textAlign: 'center',
    marginTop: 8,
  },
  loadingMore: {
    paddingVertical: 16,
    alignItems: 'center',
  },
});
