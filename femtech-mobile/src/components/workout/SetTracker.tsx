import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Check } from 'lucide-react-native';
import { useWorkoutStore } from '@/stores/workoutStore';
import * as Haptics from 'expo-haptics';
import { COLORS } from '@/constants/colors';

interface SetTrackerProps {
  totalSets: number;
  targetReps: number | string;
  onCompleteSet: () => void;
}

export function SetTracker({
  totalSets,
  targetReps,
  onCompleteSet,
}: SetTrackerProps) {
  const { currentSetIndex, getExerciseLog, getCurrentExercise } =
    useWorkoutStore();
  const exercise = getCurrentExercise();
  const exerciseLog = exercise
    ? getExerciseLog(exercise.exerciseId)
    : undefined;
  const completedSets = exerciseLog?.sets.length || 0;

  const handleCompleteSet = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onCompleteSet();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Sets</Text>

      <View style={styles.setsRow}>
        {Array.from({ length: totalSets }).map((_, index) => {
          const isCompleted = index < completedSets;
          const isCurrent = index === currentSetIndex && !isCompleted;

          return (
            <TouchableOpacity
              key={index}
              onPress={isCurrent ? handleCompleteSet : undefined}
              disabled={!isCurrent}
              activeOpacity={isCurrent ? 0.7 : 1}
              style={[
                styles.setButton,
                isCompleted && styles.setButtonCompleted,
                isCurrent && styles.setButtonCurrent,
              ]}
            >
              {isCompleted ? (
                <Check size={24} color="#ffffff" />
              ) : (
                <View style={styles.setContent}>
                  <Text
                    style={[
                      styles.setNumber,
                      isCurrent && styles.setNumberCurrent,
                    ]}
                  >
                    {index + 1}
                  </Text>
                  {isCurrent && (
                    <Text style={styles.tapText}>Tap when done</Text>
                  )}
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Target Info */}
      <View style={styles.targetCard}>
        <Text style={styles.targetText}>
          Target: <Text style={styles.targetBold}>{targetReps} reps</Text> per
          set
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  label: {
    color: COLORS.neutral[500],
    fontWeight: '500',
    marginBottom: 12,
  },
  setsRow: {
    flexDirection: 'row',
  },
  setButton: {
    flex: 1,
    height: 64,
    marginHorizontal: 4,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.neutral[100],
  },
  setButtonCompleted: {
    backgroundColor: '#22c55e',
  },
  setButtonCurrent: {
    backgroundColor: COLORS.primary[500],
  },
  setContent: {
    alignItems: 'center',
  },
  setNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.neutral[400],
  },
  setNumberCurrent: {
    color: '#ffffff',
  },
  tapText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 10,
    marginTop: 2,
  },
  targetCard: {
    marginTop: 12,
    backgroundColor: COLORS.neutral[50],
    borderRadius: 12,
    padding: 12,
  },
  targetText: {
    color: COLORS.neutral[600],
    textAlign: 'center',
  },
  targetBold: {
    fontWeight: '600',
  },
});
