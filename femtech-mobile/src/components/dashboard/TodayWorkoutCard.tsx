import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Play, Dumbbell, Clock, Zap, Moon } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { COLORS } from '@/constants/colors';

interface TodayWorkoutCardProps {
  workout: {
    id: string;
    name: string;
    exerciseCount: number;
    estimatedMinutes: number;
    focusArea: string;
    isRestDay: boolean;
  } | null;
  phaseNote?: string;
  isReproductive: boolean;
}

export function TodayWorkoutCard({
  workout,
  phaseNote,
  isReproductive,
}: TodayWorkoutCardProps) {
  const handleStartWorkout = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (workout) {
      router.push(`/(tabs)/workout?id=${workout.id}`);
    }
  };

  // Rest Day Card
  if (workout?.isRestDay || !workout) {
    return (
      <View style={styles.restContainer}>
        <View style={styles.restHeader}>
          <View style={styles.restIconContainer}>
            <Moon size={24} color="#737373" />
          </View>
          <View style={styles.restTextContainer}>
            <Text style={styles.restTitle}>Rest Day</Text>
            <Text style={styles.restSubtitle}>
              Recovery is part of the process
            </Text>
          </View>
        </View>

        <View style={styles.restTipCard}>
          <Text style={styles.restTipText}>
            🧘 Consider light stretching, a walk, or foam rolling today.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <TouchableOpacity
      onPress={handleStartWorkout}
      activeOpacity={0.9}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.label}>TODAY'S WORKOUT</Text>
          <Text style={styles.workoutName}>{workout.name}</Text>
        </View>

        <View style={styles.playButton}>
          <Play size={28} color={COLORS.primary[500]} fill={COLORS.primary[500]} />
        </View>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Dumbbell size={18} color="#ffffff" />
          <Text style={styles.statText}>{workout.exerciseCount} exercises</Text>
        </View>

        <View style={styles.stat}>
          <Clock size={18} color="#ffffff" />
          <Text style={styles.statText}>{workout.estimatedMinutes} min</Text>
        </View>

        <View style={styles.stat}>
          <Zap size={18} color="#ffffff" />
          <Text style={styles.statText}>{workout.focusArea}</Text>
        </View>
      </View>

      {/* Phase Note (for reproductive users) */}
      {isReproductive && phaseNote && (
        <View style={styles.noteCard}>
          <Text style={styles.noteText}>💡 {phaseNote}</Text>
        </View>
      )}

      {/* Bone Health Note (for perimenopause users) */}
      {!isReproductive && (
        <View style={styles.noteCard}>
          <Text style={styles.noteText}>
            🦴 Includes bone-strengthening exercises
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary[500],
    borderRadius: 24,
    padding: 24,
    marginHorizontal: 24,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  label: {
    color: COLORS.primary[100],
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
  },
  workoutName: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 4,
  },
  playButton: {
    width: 56,
    height: 56,
    backgroundColor: '#ffffff',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  statText: {
    color: '#ffffff',
    marginLeft: 8,
  },
  noteCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 12,
  },
  noteText: {
    color: '#ffffff',
    fontSize: 14,
  },
  // Rest day styles
  restContainer: {
    backgroundColor: COLORS.neutral[100],
    borderRadius: 24,
    padding: 24,
    marginHorizontal: 24,
    marginBottom: 16,
  },
  restHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  restIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: COLORS.neutral[200],
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  restTextContainer: {
    marginLeft: 16,
  },
  restTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.neutral[900],
  },
  restSubtitle: {
    color: COLORS.neutral[500],
  },
  restTipCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
  },
  restTipText: {
    color: COLORS.neutral[600],
    fontSize: 14,
  },
});
