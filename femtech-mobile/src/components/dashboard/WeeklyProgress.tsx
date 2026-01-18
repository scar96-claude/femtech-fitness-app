import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Check } from 'lucide-react-native';
import { COLORS } from '@/constants/colors';

interface WeeklyProgressProps {
  completed: number;
  planned: number;
  days: {
    day: string;
    completed: boolean;
    isToday: boolean;
  }[];
}

export function WeeklyProgress({ completed, planned, days }: WeeklyProgressProps) {
  const progressPercent = planned > 0 ? (completed / planned) * 100 : 0;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>This Week</Text>
        <Text style={styles.count}>
          {completed}/{planned} workouts
        </Text>
      </View>

      {/* Days Row */}
      <View style={styles.daysRow}>
        {days.map((day, index) => (
          <View key={index} style={styles.dayColumn}>
            <Text
              style={[
                styles.dayLabel,
                day.isToday && styles.dayLabelToday,
              ]}
            >
              {day.day}
            </Text>

            <View
              style={[
                styles.dayCircle,
                day.completed && styles.dayCircleCompleted,
                day.isToday && !day.completed && styles.dayCircleToday,
              ]}
            >
              {day.completed ? (
                <Check size={20} color="#ffffff" />
              ) : day.isToday ? (
                <View style={styles.todayDot} />
              ) : null}
            </View>
          </View>
        ))}
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${progressPercent}%` },
            ]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 24,
    marginHorizontal: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: COLORS.neutral[100],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.neutral[900],
  },
  count: {
    color: COLORS.primary[600],
    fontWeight: '500',
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayColumn: {
    alignItems: 'center',
  },
  dayLabel: {
    fontSize: 12,
    color: COLORS.neutral[400],
    marginBottom: 8,
  },
  dayLabelToday: {
    color: COLORS.primary[600],
    fontWeight: '600',
  },
  dayCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.neutral[100],
  },
  dayCircleCompleted: {
    backgroundColor: '#22c55e',
  },
  dayCircleToday: {
    backgroundColor: COLORS.primary[100],
    borderWidth: 2,
    borderColor: COLORS.primary[500],
  },
  todayDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary[500],
  },
  progressBarContainer: {
    marginTop: 16,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: COLORS.neutral[100],
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#22c55e',
    borderRadius: 4,
  },
});
