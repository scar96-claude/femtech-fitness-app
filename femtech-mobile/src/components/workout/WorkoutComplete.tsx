import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/Button';
import { Trophy, Clock, Dumbbell, Flame, Share2 } from 'lucide-react-native';
import { WorkoutLog } from '@/types';
import * as Haptics from 'expo-haptics';
import { COLORS } from '@/constants/colors';

interface WorkoutCompleteProps {
  workoutLog: WorkoutLog;
  workoutName: string;
  onDone: () => void;
}

export function WorkoutComplete({
  workoutLog,
  workoutName,
  onDone,
}: WorkoutCompleteProps) {
  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  const totalSets = workoutLog.exercises.reduce(
    (acc, ex) => acc + ex.sets.length,
    0
  );

  const totalReps = workoutLog.exercises.reduce(
    (acc, ex) => acc + ex.sets.reduce((setAcc, set) => setAcc + set.reps, 0),
    0
  );

  const totalWeight = workoutLog.exercises.reduce(
    (acc, ex) =>
      acc +
      ex.sets.reduce(
        (setAcc, set) => setAcc + (set.weightKg || 0) * set.reps,
        0
      ),
    0
  );

  const exercisesWithRpe = workoutLog.exercises.filter((ex) => ex.rpe);
  const avgRpe =
    exercisesWithRpe.length > 0
      ? exercisesWithRpe.reduce((acc, ex) => acc + (ex.rpe || 0), 0) /
        exercisesWithRpe.length
      : 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Celebration */}
        <View style={styles.celebration}>
          <View style={styles.trophyContainer}>
            <Trophy size={64} color="#22c55e" />
          </View>

          <Text style={styles.title}>Great Work! 🎉</Text>
          <Text style={styles.subtitle}>{workoutName} complete</Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={[styles.statCardInner, { backgroundColor: '#e0f2fe' }]}>
              <Clock size={24} color={COLORS.primary[500]} />
              <Text style={styles.statValue}>{workoutLog.totalDuration || 0}</Text>
              <Text style={styles.statLabel}>minutes</Text>
            </View>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statCardInner, { backgroundColor: '#dcfce7' }]}>
              <Dumbbell size={24} color="#22c55e" />
              <Text style={styles.statValue}>{totalSets}</Text>
              <Text style={styles.statLabel}>sets completed</Text>
            </View>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statCardInner, { backgroundColor: '#fef3c7' }]}>
              <Flame size={24} color="#f59e0b" />
              <Text style={styles.statValue}>{totalReps}</Text>
              <Text style={styles.statLabel}>total reps</Text>
            </View>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statCardInner, { backgroundColor: '#f3e8ff' }]}>
              <Trophy size={24} color="#8b5cf6" />
              <Text style={styles.statValue}>{Math.round(totalWeight)}</Text>
              <Text style={styles.statLabel}>kg lifted</Text>
            </View>
          </View>
        </View>

        {/* Average RPE */}
        {avgRpe > 0 && (
          <View style={styles.rpeCard}>
            <Text style={styles.rpeLabel}>Average RPE</Text>
            <View style={styles.rpeValue}>
              <Text style={styles.rpeNumber}>{avgRpe.toFixed(1)}</Text>
              <Text style={styles.rpeMax}>/ 10</Text>
            </View>
          </View>
        )}

        {/* Share Button */}
        <TouchableOpacity style={styles.shareButton}>
          <Share2 size={20} color={COLORS.neutral[600]} />
          <Text style={styles.shareText}>Share Workout</Text>
        </TouchableOpacity>

        {/* Done Button */}
        <Button
          title="Done"
          onPress={onDone}
          fullWidth
          size="lg"
          style={styles.doneButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  celebration: {
    alignItems: 'center',
    paddingTop: 32,
  },
  trophyContainer: {
    width: 128,
    height: 128,
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    borderRadius: 64,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.neutral[900],
    marginBottom: 8,
  },
  subtitle: {
    color: COLORS.neutral[500],
    fontSize: 18,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
    marginTop: 32,
  },
  statCard: {
    width: '50%',
    padding: 8,
  },
  statCardInner: {
    borderRadius: 16,
    padding: 16,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.neutral[900],
    marginTop: 8,
  },
  statLabel: {
    color: COLORS.neutral[500],
  },
  rpeCard: {
    backgroundColor: COLORS.neutral[100],
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 24,
    marginTop: 16,
  },
  rpeLabel: {
    color: COLORS.neutral[500],
    marginBottom: 4,
  },
  rpeValue: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  rpeNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.neutral[900],
  },
  rpeMax: {
    color: COLORS.neutral[500],
    marginLeft: 4,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.neutral[100],
    borderRadius: 12,
    paddingVertical: 16,
    marginHorizontal: 24,
    marginTop: 24,
  },
  shareText: {
    color: COLORS.neutral[700],
    fontWeight: '500',
    marginLeft: 8,
  },
  doneButton: {
    marginHorizontal: 24,
    marginTop: 24,
  },
});
