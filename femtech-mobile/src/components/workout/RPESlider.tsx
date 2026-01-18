import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useWorkoutStore } from '@/stores/workoutStore';
import * as Haptics from 'expo-haptics';
import { COLORS } from '@/constants/colors';

const RPE_COLORS: Record<number, string> = {
  1: '#4ade80',
  2: '#22c55e',
  3: '#84cc16',
  4: '#facc15',
  5: '#eab308',
  6: '#fb923c',
  7: '#f97316',
  8: '#f87171',
  9: '#ef4444',
  10: '#dc2626',
};

interface RPESliderProps {
  onSubmit: (rpe: number) => void;
}

export function RPESlider({ onSubmit }: RPESliderProps) {
  const { getCurrentExercise, setRpe } = useWorkoutStore();
  const exercise = getCurrentExercise();

  const handleSelect = (rpe: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setRpe(rpe);
    onSubmit(rpe);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>How hard was that?</Text>
        <Text style={styles.subtitle}>
          Rate your perceived exertion for {exercise?.name}
        </Text>

        {/* Target RPE Indicator */}
        {exercise && (
          <View style={styles.targetCard}>
            <Text style={styles.targetText}>
              Target RPE: <Text style={styles.targetBold}>{exercise.targetRpe}</Text>
            </Text>
          </View>
        )}

        {/* RPE Grid */}
        <View style={styles.grid}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rpe) => (
            <TouchableOpacity
              key={rpe}
              onPress={() => handleSelect(rpe)}
              style={[
                styles.rpeButton,
                { backgroundColor: RPE_COLORS[rpe] },
              ]}
            >
              <Text style={styles.rpeNumber}>{rpe}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          <Text style={styles.legendText}>1 = Very Light</Text>
          <Text style={styles.legendText}>10 = Max Effort</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  content: {
    width: '100%',
    maxWidth: 340,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.neutral[900],
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: COLORS.neutral[500],
    textAlign: 'center',
    marginBottom: 24,
  },
  targetCard: {
    backgroundColor: COLORS.primary[50],
    borderRadius: 12,
    padding: 12,
    marginBottom: 24,
  },
  targetText: {
    color: COLORS.primary[700],
    textAlign: 'center',
  },
  targetBold: {
    fontWeight: 'bold',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  rpeButton: {
    width: 60,
    height: 60,
    margin: 4,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rpeNumber: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  legendText: {
    color: COLORS.neutral[400],
    fontSize: 14,
  },
});
