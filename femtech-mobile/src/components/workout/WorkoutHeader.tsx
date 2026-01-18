import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { X, Pause, Play } from 'lucide-react-native';
import { useWorkoutStore } from '@/stores/workoutStore';
import { COLORS } from '@/constants/colors';

interface WorkoutHeaderProps {
  onExit: () => void;
}

export function WorkoutHeader({ onExit }: WorkoutHeaderProps) {
  const { workout, isPaused, pauseWorkout, resumeWorkout, getProgress } =
    useWorkoutStore();
  const progress = getProgress();

  if (!workout) return null;

  return (
    <View style={styles.container}>
      {/* Top Row: Exit + Title + Pause */}
      <View style={styles.topRow}>
        <TouchableOpacity onPress={onExit} style={styles.iconButton}>
          <X size={20} color={COLORS.neutral[600]} />
        </TouchableOpacity>

        <Text style={styles.title} numberOfLines={1}>
          {workout.name}
        </Text>

        <TouchableOpacity
          onPress={isPaused ? resumeWorkout : pauseWorkout}
          style={styles.iconButton}
        >
          {isPaused ? (
            <Play size={20} color={COLORS.neutral[600]} />
          ) : (
            <Pause size={20} color={COLORS.neutral[600]} />
          )}
        </TouchableOpacity>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${progress.percentage}%` },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {progress.current}/{progress.total}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.neutral[100],
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.neutral[900],
    marginHorizontal: 12,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: COLORS.neutral[200],
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary[500],
    borderRadius: 4,
  },
  progressText: {
    color: COLORS.neutral[500],
    fontSize: 14,
    marginLeft: 12,
  },
});
